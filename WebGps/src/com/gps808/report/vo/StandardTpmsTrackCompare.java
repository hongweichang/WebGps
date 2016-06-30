package com.gps808.report.vo;

import java.util.Comparator;

public class StandardTpmsTrackCompare
  implements Comparator<Object>
{
  public int compare(Object o1, Object o2)
  {
    StandardTpmsTrack track1 = (StandardTpmsTrack)o1;
    StandardTpmsTrack track2 = (StandardTpmsTrack)o2;
    if (track1.getTrackTime() > track2.getTrackTime()) {
      return 1;
    }
    if (track1.getGpsTime() == track2.getGpsTime()) {
      return 0;
    }
    return -1;
  }
}
