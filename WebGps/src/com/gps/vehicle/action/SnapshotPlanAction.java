package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.StorageRelationServiceEx;
import com.gps.model.DeviceInfo;
import com.gps.model.StorageRelationEx;
import com.gps.model.UserRole;
import com.gps.report.vo.DeviceQuery;
import com.gps.vehicle.model.SnapshotPlan;
import com.gps.vehicle.service.SnapshotPlanService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class SnapshotPlanAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private SnapshotPlanService snapshotPlanService;
  private StorageRelationServiceEx storageRelationServiceEx;
  
  public SnapshotPlanService getSnapshotPlanService()
  {
    return this.snapshotPlanService;
  }
  
  public void setSnapshotPlanService(SnapshotPlanService snapshotPlanService)
  {
    this.snapshotPlanService = snapshotPlanService;
  }
  
  public StorageRelationServiceEx getStorageRelationServiceEx()
  {
    return this.storageRelationServiceEx;
  }
  
  public void setStorageRelationServiceEx(StorageRelationServiceEx storageRelationServiceEx)
  {
    this.storageRelationServiceEx = storageRelationServiceEx;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_SNAPSHOT);
  }
  
  protected void addSnapshotPlanLog(Integer subType, SnapshotPlan snapshotPlan)
  {
    addUserLog(Integer.valueOf(11), subType, snapshotPlan.getDevIdno(), null, null, null, null);
  }
  
  protected boolean isEnableStorage()
  {
    long config = this.deviceService.getServerConfig();
    if (enableStorage(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
  }
  
  public String devStoList()
    throws Exception
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if (!query.getDevIdnos().isEmpty())
      {
        String[] allDevices = query.getDevIdnos().split(",");
        List<StorageRelationEx> stoList = this.storageRelationServiceEx.getStoRelationList(allDevices);
        addCustomResponse("stoList", stoList);
      }
      else
      {
        addCustomResponse("stoList", null);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
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
        AjaxDto<SnapshotPlan> ajaxDto = this.snapshotPlanService.getSnapshotPlanList(allDevices, getPaginationEx());
        addCustomResponse("plans", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
      else
      {
        addCustomResponse("plans", null);
        addCustomResponse("pagination", getPaginationEx());
      }
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        SnapshotPlan plan = (SnapshotPlan)this.snapshotPlanService.get(idno);
        if (plan != null) {
          addCustomResponse("plan", plan);
        } else {
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
  
  public String save()
    throws Exception
  {
    try
    {
      if (isEnableStorage())
      {
        SnapshotPlan snapshotPlan = new SnapshotPlan();
        snapshotPlan = (SnapshotPlan)AjaxUtils.getObject(getRequest(), snapshotPlan.getClass());
        String idnos = snapshotPlan.getDevIdno();
        if ((idnos == null) || (idnos.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String[] devIdno = idnos.split(",");
          for (int i = 0; i < devIdno.length; i++)
          {
            snapshotPlan.setDevIdno(devIdno[i]);
            SnapshotPlan plan = (SnapshotPlan)this.snapshotPlanService.get(devIdno[i]);
            if (plan != null)
            {
              this.snapshotPlanService.save(snapshotPlan);
              
              addSnapshotPlanLog(Integer.valueOf(2), snapshotPlan);
              this.notifyService.sendSnapshotPlanChange(2, devIdno[i]);
            }
            else
            {
              DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno[i]);
              if (device != null)
              {
                this.snapshotPlanService.save(snapshotPlan);
                
                addSnapshotPlanLog(Integer.valueOf(1), snapshotPlan);
                this.notifyService.sendSnapshotPlanChange(1, devIdno[i]);
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
  
  public String delete()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] devIdnos = idno.split(",");
        List<Serializable> lstIds = new ArrayList();
        int i = 0;
        for (i = 0; i < devIdnos.length; i++) {
          lstIds.add(devIdnos[i]);
        }
        this.snapshotPlanService.removeList(lstIds);
        for (i = 0; i < devIdnos.length; i++)
        {
          addUserLog(Integer.valueOf(11), Integer.valueOf(3), 
            devIdnos[i], null, null, null, null);
          this.notifyService.sendSnapshotPlanChange(3, devIdnos[i]);
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
