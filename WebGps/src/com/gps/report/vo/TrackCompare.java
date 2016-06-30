package com.gps.report.vo;

import java.util.Comparator;

public class TrackCompare
  implements Comparator<Object>
{
  public int compare(Object o1, Object o2)
  {
    DeviceTrack track1 = (DeviceTrack)o1;
    DeviceTrack track2 = (DeviceTrack)o2;
    if (track1.getTrackTime() > track2.getTrackTime()) {
      return 1;
    }
    if (track1.getGpsTime() == track2.getGpsTime()) {
      return 0;
    }
    return -1;
  }
}
