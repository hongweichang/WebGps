package com.gps.common.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.ServerInfo;
import com.gps.system.vo.ServerStatus;

public abstract interface ServerService
  extends UniversalService
{
  public abstract AjaxDto<ServerInfo> getAllServer(Integer paramInteger, Pagination paramPagination);
  
  public abstract int getServerCount(Integer paramInteger1, Integer paramInteger2);
  
  public abstract Boolean getLoginSvrOnline();
  
  public abstract ServerStatus getServerStatus(int paramInt, String paramString);
  
  public abstract ServerInfo findServer(int paramInt);
  
  public abstract ServerInfo getOnlineServer(int paramInt);
}
