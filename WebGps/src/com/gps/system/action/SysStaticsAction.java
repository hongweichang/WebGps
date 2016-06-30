package com.gps.system.action;

import com.framework.logger.Logger;
import com.gps.common.action.SysBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.system.service.SysStatusService;
import com.gps.system.service.SysUserService;
import com.gps.system.vo.ServerStatus;

public class SysStaticsAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private SysUserService sysUserService;
  private ServerService serverService;
  private UserService userService;
  private SysStatusService sysStatusService;
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public UserService getUserService()
  {
    return this.userService;
  }
  
  public void setUserService(UserService userService)
  {
    this.userService = userService;
  }
  
  public SysStatusService getSysStatusService()
  {
    return this.sysStatusService;
  }
  
  public void setSysStatusService(SysStatusService sysStatusService)
  {
    this.sysStatusService = sysStatusService;
  }
  
  public String query()
    throws Exception
  {
    try
    {
      addCustomResponse("deviceManageCount", Integer.valueOf(this.deviceService.getRegistCount()));
      addCustomResponse("deviceTotalCount", Integer.valueOf(this.deviceService.getDeviceCount(null, null, null)));
      addCustomResponse("deviceStoreCount", Integer.valueOf(this.deviceService.getStoreCount()));
      addCustomResponse("deviceOnlineCount", this.sysStatusService.getDeviceOnlineCount());
      addCustomResponse("deviceUnregCount", this.sysStatusService.getDeviceUnregCount());
      
      addCustomResponse("clientTotalCount", Integer.valueOf(this.userService.getUserCount(null, Integer.valueOf(0), null)));
      addCustomResponse("clientUserCount", Integer.valueOf(this.userService.getClientUserCount()));
      addCustomResponse("clientOnlineCount", this.sysStatusService.getClientOnlineCount());
      
      addCustomResponse("LoginServerStatus", this.serverService.getLoginSvrOnline());
      ServerStatus svrStatus = this.serverService.getServerStatus(-1, "1");
      addCustomResponse("ServerTotalCount", svrStatus.getTotal());
      addCustomResponse("ServerOnlineCount", svrStatus.getOnline());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
