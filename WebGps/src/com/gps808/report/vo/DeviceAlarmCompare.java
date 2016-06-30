package com.gps808.report.vo;

import java.util.Comparator;
import java.util.Date;

public class DeviceAlarmCompare
  implements Comparator<Object>
{
  public int compare(Object o1, Object o2)
  {
    StandardDeviceAlarmEx alarm1 = (StandardDeviceAlarmEx)o1;
    StandardDeviceAlarmEx alarm2 = (StandardDeviceAlarmEx)o2;
    if (alarm1.getStm().getTime() > alarm2.getStm().getTime()) {
      return 1;
    }
    return -1;
  }
}
