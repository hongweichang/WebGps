package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.DriverInfo;

public abstract interface DriverInfoService
  extends UniversalService
{
  public abstract AjaxDto<DriverInfo> getDriverList(Integer paramInteger, String paramString, Pagination paramPagination);
}
