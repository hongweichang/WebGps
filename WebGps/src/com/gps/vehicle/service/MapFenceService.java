package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.MapFence;

public abstract interface MapFenceService
  extends UniversalService
{
  public abstract AjaxDto<MapFence> getMapFenceList(String[] paramArrayOfString, String paramString, Pagination paramPagination);
  
  public abstract MapFence getMapFence(String paramString, Integer paramInteger);
}
