package com.gps808.report.dao;

import com.gps808.model.StandardDeviceDaily;
import com.gps808.report.vo.StandardReportSummary;
import java.util.List;

public abstract interface StandardVehicleDailyDao
{
  public abstract List<StandardDeviceDaily> queryDistinctDaily(String paramString);
  
  public abstract List<StandardReportSummary> queryMonthlyOnline(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardReportSummary> queryCompanyDaily(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3);
}
