package com.gps808.report.vo;

import java.util.Comparator;

public class StandardTrackCompare
  implements Comparator<Object>
{
  public int compare(Object o1, Object o2)
  {
    StandardDeviceTrack track1 = (StandardDeviceTrack)o1;
    StandardDeviceTrack track2 = (StandardDeviceTrack)o2;
    if (track1.getTrackTime() > track2.getTrackTime()) {
      return 1;
    }
    return -1;
  }
}
