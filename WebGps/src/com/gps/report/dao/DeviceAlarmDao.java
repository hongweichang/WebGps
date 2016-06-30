package com.gps.report.dao;

import com.gps.model.DeviceAlarm;
import com.gps.report.vo.DeviceAlarmSummary;
import java.util.List;

public abstract interface DeviceAlarmDao
{
  public abstract List<DeviceAlarmSummary> summaryDeviceAlarm(String paramString);
  
  public abstract List<DeviceAlarm> queryDeviceAlarm(List<String> paramList);
}
