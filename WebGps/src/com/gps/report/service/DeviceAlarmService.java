package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.UniversalService;
import com.gps.model.DeviceAlarm;
import com.gps.report.vo.DailyCount;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.system.model.SysNews;
import java.util.List;

public abstract interface DeviceAlarmService
  extends UniversalService
{
  public abstract List<DeviceAlarmSummary> summaryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, String paramString4, String paramString5, List<QueryScalar> paramList1, boolean paramBoolean, String paramString6, String paramString7, String paramString8, String paramString9);
  
  public abstract List<DailyCount> queryDailyCount(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList);
  
  public abstract AjaxDto<DeviceAlarm> queryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, Pagination paramPagination, String paramString4, String paramString5, String paramString6, String paramString7);
  
  public abstract AjaxDto<DeviceAlarm> queryDeviceAlarmList(String paramString1, List<Integer> paramList, String paramString2, Pagination paramPagination);
  
  public abstract AjaxDto<SysNews> queryNews(String paramString1, String paramString2, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceAlarm> queryDeviceAlarmMobileList(String paramString1, String paramString2, List<Integer> paramList, String[] paramArrayOfString, String paramString3, Pagination paramPagination);
  
  public abstract List<DeviceAlarm> queryDeviceAlarm(List<String> paramList);
}
