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
import com.gps.vehicle.model.RecordPlan;
import com.gps.vehicle.service.RecordPlanService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class RecordPlanAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private RecordPlanService recordPlanService;
  private StorageRelationServiceEx storageRelationServiceEx;
  
  public RecordPlanService getRecordPlanService()
  {
    return this.recordPlanService;
  }
  
  public void setRecordPlanService(RecordPlanService recordPlanService)
  {
    this.recordPlanService = recordPlanService;
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
    return findPrivilege(UserRole.PRIVI_VEHIMGR_RECORD);
  }
  
  protected void addRecordPlanLog(Integer subType, RecordPlan recordPlan)
  {
    addUserLog(Integer.valueOf(12), subType, recordPlan.getDevIdno(), null, null, null, null);
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
        AjaxDto<RecordPlan> ajaxDto = this.recordPlanService.getRecordPlanList(allDevices, getPaginationEx());
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
        RecordPlan plan = (RecordPlan)this.recordPlanService.get(idno);
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
        RecordPlan recordPlan = new RecordPlan();
        recordPlan = (RecordPlan)AjaxUtils.getObject(getRequest(), recordPlan.getClass());
        String idnos = recordPlan.getDevIdno();
        if ((idnos == null) || (idnos.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String[] devIdno = idnos.split(",");
          for (int i = 0; i < devIdno.length; i++)
          {
            recordPlan.setDevIdno(devIdno[i]);
            RecordPlan plan = (RecordPlan)this.recordPlanService.get(devIdno[i]);
            if (plan != null)
            {
              this.recordPlanService.save(recordPlan);
              
              addRecordPlanLog(Integer.valueOf(2), recordPlan);
              this.notifyService.sendRecordPlanChange(2, devIdno[i]);
            }
            else
            {
              DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno[i]);
              if (device != null)
              {
                this.recordPlanService.save(recordPlan);
                
                addRecordPlanLog(Integer.valueOf(1), recordPlan);
                this.notifyService.sendRecordPlanChange(1, devIdno[i]);
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
        this.recordPlanService.removeList(lstIds);
        for (i = 0; i < devIdnos.length; i++)
        {
          addUserLog(Integer.valueOf(12), Integer.valueOf(3), 
            devIdnos[i], null, null, null, null);
          this.notifyService.sendRecordPlanChange(3, devIdnos[i]);
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
