package com.gps.report.dao;

import com.gps.report.model.DeviceDaily;
import java.util.List;

public abstract interface DeviceDailyDao
{
  public abstract List<DeviceDaily> queryDistinctDaily(String paramString);
}
