package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DeviceNetFlow;
import com.gps.report.vo.DeviceNetflowSummary;

public abstract interface DeviceNetFlowService
  extends UniversalService
{
  public abstract AjaxDto<DeviceNetflowSummary> queryDistinctNetFlow(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination, String paramString3, String paramString4, String paramString5, String paramString6);
  
  public abstract AjaxDto<DeviceNetFlow> queryNetFlow(String paramString1, String paramString2, String[] paramArrayOfString, Integer paramInteger, Pagination paramPagination, String paramString3, String paramString4, String paramString5, String paramString6);
}
