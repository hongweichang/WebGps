package com.gps808.monitor.dao;

import com.gps.model.DeviceStatusLite;
import com.gps808.model.StandardAlarmMotion;
import com.gps808.model.StandardFixedTts;
import java.util.List;
import java.util.Map;

public abstract interface StandardMonitorDao
{
  public abstract StandardFixedTts getStandardFixedTts(Integer paramInteger, String paramString);
  
  public abstract List<StandardFixedTts> getStandardFixedTts(Integer paramInteger);
  
  public abstract StandardAlarmMotion findAlarmMotion(Integer paramInteger1, String paramString, Integer paramInteger2);
  
  public abstract Map<Integer, StandardAlarmMotion> findAlarmMotion(Integer paramInteger, String paramString);
  
  public abstract List<DeviceStatusLite> getDeviceStatusLite(String[] paramArrayOfString);
}
