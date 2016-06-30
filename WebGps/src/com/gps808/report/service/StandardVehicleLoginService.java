package com.gps808.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.UniversalService;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import java.util.List;

public abstract interface StandardVehicleLoginService
  extends UniversalService
{
  public abstract List<StandardDeviceAlarmSummary> summaryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, String paramString4, String paramString5, List<QueryScalar> paramList1, String paramString6, String paramString7, String paramString8, String paramString9);
  
  public abstract List<StandardDeviceAlarmSummary> summaryDrivingBehavior(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, Pagination paramPagination, String paramString3, String paramString4);
  
  public abstract AjaxDto<StandardDeviceAlarm> queryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, Pagination paramPagination, String paramString4, String paramString5, String paramString6, String paramString7);
}
