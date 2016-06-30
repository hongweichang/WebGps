package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.DownPlan;

public abstract interface DownPlanService
  extends UniversalService
{
  public abstract AjaxDto<DownPlan> getDownPlanList(String[] paramArrayOfString, Pagination paramPagination);
}
