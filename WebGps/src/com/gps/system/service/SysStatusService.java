package com.gps.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.DeviceStatus;
import com.gps.model.UserSession;

public abstract interface SysStatusService
  extends UniversalService
{
  public abstract Integer getDeviceUnregCount();
  
  public abstract AjaxDto<DeviceStatus> getDeviceUnregList(Pagination paramPagination);
  
  public abstract Integer getDeviceOnlineCount();
  
  public abstract AjaxDto<DeviceStatus> getDeviceOnlineList(String paramString, Pagination paramPagination);
  
  public abstract Integer getClientOnlineCount();
  
  public abstract AjaxDto<UserSession> getClientOnlineList(String paramString, Pagination paramPagination);
}
