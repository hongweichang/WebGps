package com.gps808.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.model.StandardStatisticsPeople;
import com.gps808.report.vo.StandardReportSummary;
import java.util.List;

public abstract interface StandardVehicleDailyService
  extends UniversalService
{
  public abstract List<StandardDeviceDaily> queryDistinctDaily(String paramString1, String paramString2, boolean paramBoolean, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardDeviceDaily> queryDeviceDaily(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5, String paramString6, String[] paramArrayOfString1, String[] paramArrayOfString2, Pagination paramPagination);
  
  public abstract List<StandardReportSummary> queryMonthlyOnline(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardReportSummary> queryCompanyDaily(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3);
  
  public abstract AjaxDto<StandardStatisticsPeople> queryStandardStatisticsPeopleDaily(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
}
