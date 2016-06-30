package com.gps.vehicle.dao;

import com.gps.vehicle.model.AlarmAction;
import java.util.List;
import java.util.Map;

public abstract interface VehiAlarmActionDao
{
  public abstract AlarmAction findAlarmAction(String paramString, Integer paramInteger);
  
  public abstract Map<Integer, AlarmAction> getDeviceAlarmAction(String paramString);
  
  public abstract void saveAlarmAction(List<AlarmAction> paramList);
}
