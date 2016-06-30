package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceInfo;
import com.gps.model.UserRole;
import com.gps.report.vo.DeviceQuery;
import com.gps.vehicle.model.MapFence;
import com.gps.vehicle.service.MapFenceService;
import com.gps.vehicle.service.MapMarkerService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VehiFenceAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private MapMarkerService mapMarkerService;
  private MapFenceService mapFenceService;
  
  public MapMarkerService getMapMarkerService()
  {
    return this.mapMarkerService;
  }
  
  public void setMapMarkerService(MapMarkerService mapMarkerService)
  {
    this.mapMarkerService = mapMarkerService;
  }
  
  public MapFenceService getMapFenceService()
  {
    return this.mapFenceService;
  }
  
  public void setMapFenceService(MapFenceService mapFenceService)
  {
    this.mapFenceService = mapFenceService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_FENCE);
  }
  
  protected void addMapFenceLog(Integer subType, MapFence fence)
  {
    addUserLog(Integer.valueOf(9), subType, fence.getDevIdno(), fence.getMarkerID().toString(), null, "2", null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if (!query.getDevIdnos().isEmpty())
      {
        String[] allDevices = query.getDevIdnos().split(",");
        String markerId = getRequestString("markerId");
        AjaxDto<MapFence> ajaxDto = this.mapFenceService.getMapFenceList(allDevices, markerId, getPaginationEx());
        addCustomResponse("fences", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
      else
      {
        addCustomResponse("fences", null);
        addCustomResponse("pagination", getPaginationEx());
      }
      addCustomResponse("markers", this.mapMarkerService.getMapMarkerList(getClientId()));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String listMarker()
    throws Exception
  {
    try
    {
      addCustomResponse("markers", this.mapMarkerService.getMapMarkerList(getClientId()));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String get()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        MapFence fence = (MapFence)this.mapFenceService.get(Integer.valueOf(Integer.parseInt(id)));
        if (fence != null)
        {
          addCustomResponse("fence", fence);
          addCustomResponse("markers", this.mapMarkerService.getMapMarkerList(getClientId()));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean isEnableFence()
  {
    long config = this.deviceService.getServerConfig();
    if (enableFence(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
  }
  
  public String save()
    throws Exception
  {
    try
    {
      if (isEnableFence())
      {
        MapFence fence = new MapFence();
        fence = (MapFence)AjaxUtils.getObject(getRequest(), fence.getClass());
        String idnos = fence.getDevIdno();
        if ((idnos == null) || (idnos.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String[] devIdno = idnos.split(",");
          for (int i = 0; i < devIdno.length; i++)
          {
            fence.setDevIdno(devIdno[i]);
            
            MapFence mapFence = this.mapFenceService.getMapFence(devIdno[i], fence.getMarkerID());
            if (mapFence != null)
            {
              fence.setId(mapFence.getId());
              
              this.mapFenceService.save(fence);
              
              addMapFenceLog(Integer.valueOf(2), fence);
              this.notifyService.sendMapFenceChange(2, devIdno[i]);
            }
            else
            {
              DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno[i]);
              if (device != null)
              {
                fence.setId(null);
                
                this.mapFenceService.save(fence);
                
                addMapFenceLog(Integer.valueOf(1), fence);
                this.notifyService.sendMapFenceChange(1, devIdno[i]);
              }
            }
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String edit()
    throws Exception
  {
    try
    {
      MapFence fence = new MapFence();
      fence = (MapFence)AjaxUtils.getObject(getRequest(), fence.getClass());
      
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        MapFence mapFence = (MapFence)this.mapFenceService.get(Integer.valueOf(Integer.parseInt(id)));
        if (mapFence != null)
        {
          fence.setId(mapFence.getId());
          fence.setDevIdno(mapFence.getDevIdno());
          fence.setMarkerID(mapFence.getMarkerID());
          
          this.mapFenceService.save(fence);
          
          addMapFenceLog(Integer.valueOf(2), fence);
          this.notifyService.sendMapFenceChange(2, fence.getDevIdno());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delete()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      String devIdno = getRequestString("devIdno");
      if ((id == null) || (id.isEmpty()) || (devIdno == null) || (devIdno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] ids = id.split(",");
        String[] devIdnos = devIdno.split(",");
        List<Serializable> lstIds = new ArrayList();
        int i = 0;
        for (i = 0; i < ids.length; i++) {
          lstIds.add(Integer.valueOf(Integer.parseInt(ids[i])));
        }
        this.mapFenceService.removeList(lstIds);
        Map<String, String> mapDev = new HashMap();
        for (i = 0; i < ids.length; i++)
        {
          addUserLog(Integer.valueOf(9), Integer.valueOf(3), 
            ids[i], null, null, "2", null);
          if (mapDev.get(devIdnos[i]) == null)
          {
            mapDev.put(devIdnos[i], devIdnos[i]);
            this.notifyService.sendMapFenceChange(3, devIdnos[i]);
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
