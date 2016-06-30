package com.gps.common.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.UserLog;
import com.gps808.report.vo.StandardUserOnlineQuery;
import java.util.List;

public abstract interface UserLogService
  extends UniversalService
{
  public abstract AjaxDto<UserLog> queryUserLog(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination, String paramString4, String paramString5, String paramString6, String paramString7);
  
  public abstract List<StandardUserOnlineQuery> queryUserOnlineSummary(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3);
  
  public abstract AjaxDto<UserLog> queryUserLogEx(String paramString1, String paramString2, String[] paramArrayOfString1, String[] paramArrayOfString2, String[] paramArrayOfString3, Integer paramInteger, Pagination paramPagination);
  
  public abstract AjaxDto<UserLog> querySMSLog(String paramString1, String paramString2, String[] paramArrayOfString1, String[] paramArrayOfString2, Integer paramInteger, Pagination paramPagination);
}
