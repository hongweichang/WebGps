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
import com.gps.vehicle.model.DownPlan;
import com.gps.vehicle.service.DownPlanService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class VehiDownPlanAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private DownPlanService downPlanService;
  
  public DownPlanService getDownPlanService()
  {
    return this.downPlanService;
  }
  
  public void setDownPlanService(DownPlanService downPlanService)
  {
    this.downPlanService = downPlanService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_DOWN_PLAN);
  }
  
  protected void addDownPlanLog(Integer subType, DownPlan downPlan)
  {
    addUserLog(Integer.valueOf(8), subType, downPlan.getDevIdno(), null, null, null, null);
  }
  
  protected boolean isEnableAutoDown()
  {
    long config = this.deviceService.getServerConfig();
    if (enableAutoDown(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
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
        AjaxDto<DownPlan> ajaxDto = this.downPlanService.getDownPlanList(allDevices, getPaginationEx());
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
        DownPlan plan = (DownPlan)this.downPlanService.get(idno);
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
      if (isEnableAutoDown())
      {
        DownPlan savePlan = new DownPlan();
        savePlan = (DownPlan)AjaxUtils.getObject(getRequest(), savePlan.getClass());
        String idnos = savePlan.getDevIdno();
        if ((idnos == null) || (idnos.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String[] devIdno = idnos.split(",");
          for (int i = 0; i < devIdno.length; i++)
          {
            savePlan.setDevIdno(devIdno[i]);
            
            DownPlan plan = (DownPlan)this.downPlanService.get(devIdno[i]);
            if (plan != null)
            {
              this.downPlanService.save(savePlan);
              
              addDownPlanLog(Integer.valueOf(2), savePlan);
              this.notifyService.sendDownPlanChange(2, devIdno[i]);
            }
            else
            {
              DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno[i]);
              if (device != null)
              {
                this.downPlanService.save(savePlan);
                
                addDownPlanLog(Integer.valueOf(1), savePlan);
                this.notifyService.sendDownPlanChange(1, devIdno[i]);
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
        this.downPlanService.removeList(lstIds);
        for (i = 0; i < devIdnos.length; i++)
        {
          addUserLog(Integer.valueOf(8), Integer.valueOf(3), 
            devIdnos[i], null, null, null, null);
          this.notifyService.sendDownPlanChange(3, devIdnos[i]);
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
