package com.gps808.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardStationAlarm;
import com.gps808.report.vo.StandardSummaryRank;
import java.util.List;

public abstract interface StandardVehicleAlarmService
  extends UniversalService
{
  public abstract List<StandardDeviceAlarmSummary> summaryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, String paramString4, String paramString5, List<QueryScalar> paramList1, String paramString6, String paramString7, String paramString8, String paramString9);
  
  public abstract List<StandardSummaryRank> getTopVehi(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList);
  
  public abstract List<StandardDeviceAlarmSummary> summaryComAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList, String paramString3, String paramString4, String paramString5, List<QueryScalar> paramList1, String paramString6, String paramString7, String paramString8, String paramString9);
  
  public abstract List<StandardSummaryRank> getTopCom(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList);
  
  public abstract AjaxDto<StandardDeviceAlarm> queryDeviceAlarm(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList1, List<Integer> paramList2, String paramString3, Pagination paramPagination, String paramString4, String paramString5, String paramString6, String paramString7);
  
  public abstract StandardStationAlarm queryStationAlarm(String paramString, Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, Integer paramInteger4, Integer paramInteger5);
  
  public abstract AjaxDto<StandardDeviceAlarm> queryDeviceAlarmByDevice(String paramString1, String paramString2, String[] paramArrayOfString, List<Integer> paramList1, List<Integer> paramList2, String paramString3, Pagination paramPagination);
  
  public abstract StandardDeviceAlarm getStandardDeviceAlarm(String paramString);
  
  public abstract void updateStandardDeviceAlarm(List<String> paramList, Integer paramInteger, String paramString);
  
  public abstract List<MapMarker> getMapMarkerList();
  
  public abstract List<MapMarker> getMarkerList();
}
