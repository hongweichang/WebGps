package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.SnapshotPlan;

public abstract interface SnapshotPlanService
  extends UniversalService
{
  public abstract AjaxDto<SnapshotPlan> getSnapshotPlanList(String[] paramArrayOfString, Pagination paramPagination);
}
