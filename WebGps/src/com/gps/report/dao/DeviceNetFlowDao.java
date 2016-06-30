package com.gps.report.dao;

import com.gps.report.model.DeviceNetFlow;
import java.util.List;

public abstract interface DeviceNetFlowDao
{
  public abstract List<DeviceNetFlow> queryDistinctNetFlow(String paramString);
}
