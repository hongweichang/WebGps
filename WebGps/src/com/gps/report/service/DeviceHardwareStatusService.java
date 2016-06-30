package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DeviceHardwareStatus;

public abstract interface DeviceHardwareStatusService
  extends UniversalService
{
  public abstract AjaxDto<DeviceHardwareStatus> queryHardwareStatus(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceHardwareStatus> queryDistinctHardwareStatus(String paramString1, String paramString2, String[] paramArrayOfString, boolean paramBoolean, String paramString3, Pagination paramPagination);
}
