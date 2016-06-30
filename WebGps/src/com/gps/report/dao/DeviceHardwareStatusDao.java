package com.gps.report.dao;

import com.gps.report.model.DeviceHardwareStatus;
import java.util.List;

public abstract interface DeviceHardwareStatusDao
{
  public abstract List<DeviceHardwareStatus> queryDistinctHardwareStatus(String paramString);
}
