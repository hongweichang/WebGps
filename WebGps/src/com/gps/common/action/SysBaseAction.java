package com.gps.common.action;

import com.framework.logger.Logger;
import com.framework.web.action.BaseAction;
import com.gps.common.service.DeviceService;
import com.opensymphony.xwork2.ActionContext;
import java.util.Map;

public abstract class SysBaseAction
  extends BaseAction
{
  protected DeviceService deviceService;
  
  public DeviceService getDeviceService()
  {
    return this.deviceService;
  }
  
  public void setDeviceService(DeviceService deviceService)
  {
    this.deviceService = deviceService;
  }
  
  protected Integer getSessionSysUsrId()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String s = (String)ctx.getSession().get("userid");
    if (s != null)
    {
      Integer usrid = Integer.valueOf(Integer.parseInt(s));
      if (usrid != null) {
        return usrid;
      }
    }
    return null;
  }
  
  public String serverConfig()
    throws Exception
  {
    try
    {
      long config = this.deviceService.getServerConfig();
      addCustomResponse("enableFence", Boolean.valueOf(enableFence(config)));
      addCustomResponse("enableSms", Boolean.valueOf(enableSms(config)));
      addCustomResponse("enableAutoDown", Boolean.valueOf(enableAutoDown(config)));
      addCustomResponse("enable3GFlow", Boolean.valueOf(enable3GFlow(config)));
      addCustomResponse("enablePhone", Boolean.valueOf(enablePhone(config)));
      addCustomResponse("enablePlayback", Boolean.valueOf(enablePlayback(config)));
      addCustomResponse("enableStorage", Boolean.valueOf(enableStorage(config)));
      addCustomResponse("enableTracker", Boolean.valueOf(enableTracker(config)));
      addCustomResponse("enableMdvr", Boolean.valueOf(getEnableMdvr()));
      addCustomResponse("enableDvr", Boolean.valueOf(getEnableDvr()));
      addCustomResponse("enablePad", Boolean.valueOf(getEnablePad()));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
