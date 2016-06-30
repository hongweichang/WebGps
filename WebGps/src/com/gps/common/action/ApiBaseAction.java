package com.gps.common.action;

import com.framework.web.action.BaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.DevGroupService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceGpsService;

public abstract class ApiBaseAction
  extends BaseAction
{
  private static final long serialVersionUID = 1L;
  protected AccountService accountService;
  protected UserService userService;
  protected DeviceService deviceService;
  protected DevGroupService devGroupService;
  protected NotifyService notifyService;
  protected ServerService serverService;
  protected DeviceGpsService deviceGpsService;
  protected DeviceAlarmService deviceAlarmService;
  
  public DeviceAlarmService getDeviceAlarmService()
  {
    return this.deviceAlarmService;
  }
  
  public void setDeviceAlarmService(DeviceAlarmService deviceAlarmService)
  {
    this.deviceAlarmService = deviceAlarmService;
  }
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public UserService getUserService()
  {
    return this.userService;
  }
  
  public void setUserService(UserService userService)
  {
    this.userService = userService;
  }
  
  public DevGroupService getDevGroupService()
  {
    return this.devGroupService;
  }
  
  public void setDevGroupService(DevGroupService devGroupService)
  {
    this.devGroupService = devGroupService;
  }
  
  public DeviceService getDeviceService()
  {
    return this.deviceService;
  }
  
  public void setDeviceService(DeviceService deviceService)
  {
    this.deviceService = deviceService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public DeviceGpsService getDeviceGpsService()
  {
    return this.deviceGpsService;
  }
  
  public void setDeviceGpsService(DeviceGpsService deviceGpsService)
  {
    this.deviceGpsService = deviceGpsService;
  }
  
  protected abstract boolean checkPrivi();
}
