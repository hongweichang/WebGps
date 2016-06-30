package com.gps808.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.vo.DeviceIdnos;
import com.gps808.model.StandardDevFlowConfig;
import com.gps808.model.StandardDevFlowCur;
import com.gps808.model.StandardUserRole;
import com.gps808.monitor.service.StandardMonitorService;

public class StandardFlowAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_MONITORING.toString());
  }
  
  public String getFlowInfo()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_3G_FLOW.toString()))
      {
        String devIdno = getRequestString("devIdno");
        if ((devIdno != null) && (!devIdno.isEmpty()))
        {
          StandardDevFlowCur flowCur = (StandardDevFlowCur)this.standardMonitorService.getObject(StandardDevFlowCur.class, devIdno);
          
          StandardDevFlowConfig flowConfig = (StandardDevFlowConfig)this.standardMonitorService.getObject(StandardDevFlowConfig.class, devIdno);
          
          addCustomResponse("fuse", flowCur);
          addCustomResponse("fconfig", flowConfig);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveConfig()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_3G_FLOW.toString()))
      {
        StandardDevFlowConfig config = new StandardDevFlowConfig();
        try
        {
          config = (StandardDevFlowConfig)AjaxUtils.getObject(getRequest(), config.getClass());
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
        }
        if ((config != null) && (config.getDid() != null) && (!config.getDid().isEmpty()) && (config.getNofc() != null)) {
          this.standardMonitorService.save(config);
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveFlowToOther()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_3G_FLOW.toString()))
      {
        DeviceIdnos deviceIdnos = new DeviceIdnos();
        try
        {
          deviceIdnos = (DeviceIdnos)AjaxUtils.getObject(getRequest(), deviceIdnos.getClass());
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
        }
        String devIdno = getRequestString("devIdno");
        if ((devIdno != null) && (!devIdno.isEmpty()) && (deviceIdnos != null) && (deviceIdnos.getDevIdnos() != null) && (!deviceIdnos.getDevIdnos().isEmpty()))
        {
          StandardDevFlowConfig flowConfig = (StandardDevFlowConfig)this.standardMonitorService.getObject(StandardDevFlowConfig.class, devIdno);
          if (flowConfig != null)
          {
            String[] idnos = deviceIdnos.getDevIdnos().split(",");
            for (int i = 0; i < idnos.length; i++)
            {
              StandardDevFlowConfig copyConfig = new StandardDevFlowConfig();
              copyConfig.setDid(idnos[i]);
              copyConfig.copyOther(flowConfig);
              this.standardMonitorService.save(copyConfig);
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
