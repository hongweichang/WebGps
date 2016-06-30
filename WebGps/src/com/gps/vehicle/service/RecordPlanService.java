package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.RecordPlan;

public abstract interface RecordPlanService
  extends UniversalService
{
  public abstract AjaxDto<RecordPlan> getRecordPlanList(String[] paramArrayOfString, Pagination paramPagination);
}
