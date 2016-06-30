package com.gps.user.action;

import com.gps.model.DeviceBase;
import com.gps.model.UserAccountEx;
import java.util.Comparator;

final class PriviAction$DeviceComparator
  implements Comparator<DeviceBase>
{
  PriviAction$DeviceComparator(PriviAction paramPriviAction) {}
  
  public int compare(DeviceBase o1, DeviceBase o2)
  {
    if (o1.isOnline() != o2.isOnline())
    {
      if (o1.isOnline()) {
        return -1;
      }
      return 1;
    }
    return o1.getUserAccount().getPinYin().compareTo(o2.getUserAccount().getPinYin());
  }
}
