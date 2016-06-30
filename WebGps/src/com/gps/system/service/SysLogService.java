package com.gps.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.system.model.ServerLog;
import com.gps.system.model.SysUsrLog;

public abstract interface SysLogService
  extends UniversalService
{
  public abstract AjaxDto<ServerLog> getServerLogList(String paramString1, String paramString2, Pagination paramPagination);
  
  public abstract AjaxDto<SysUsrLog> getSysUsrLogList(String paramString1, String paramString2, Pagination paramPagination);
}
