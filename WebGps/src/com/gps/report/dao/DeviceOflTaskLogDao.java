package com.gps.report.dao;

import com.gps.report.model.DeviceOflTaskLog;
import java.util.List;

public abstract interface DeviceOflTaskLogDao
{
  public abstract List<DeviceOflTaskLog> queryDistinctOflTaskLog(String paramString);
}
