package com.gps808.report.dao;

import com.gps808.model.StandardDeviceAlarm;
import java.util.List;

public abstract interface StandardVehicleAlarmDao
{
  public abstract List<StandardDeviceAlarm> summaryDeviceAlarm();
  
  public abstract StandardDeviceAlarm getStandardDeviceAlarm(String paramString);
  
  public abstract void updateStandardDeviceAlarm(List<String> paramList, Integer paramInteger, String paramString);
}
