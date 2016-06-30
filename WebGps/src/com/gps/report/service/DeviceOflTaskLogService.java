package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DeviceOflTaskLog;

public abstract interface DeviceOflTaskLogService
  extends UniversalService
{
  public abstract AjaxDto<DeviceOflTaskLog> queryDistinctOflTaskLog(String paramString1, String paramString2, String[] paramArrayOfString, Integer paramInteger1, Integer paramInteger2, String paramString3, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceOflTaskLog> queryParameterConfiguration(String paramString1, String paramString2, String[] paramArrayOfString, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination);
}
