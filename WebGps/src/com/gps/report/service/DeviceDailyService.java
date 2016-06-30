package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DeviceDaily;
import java.util.List;

public abstract interface DeviceDailyService
  extends UniversalService
{
  public abstract List<DeviceDaily> queryDistinctDaily(String paramString1, String paramString2, boolean paramBoolean, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceDaily> queryDeviceDaily(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5, String paramString6, String[] paramArrayOfString, Pagination paramPagination);
}
