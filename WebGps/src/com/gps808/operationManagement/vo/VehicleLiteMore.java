package com.gps808.operationManagement.vo;

import com.framework.utils.DateUtil;
import com.gps.model.DeviceStatus;
import java.util.Date;
import java.util.List;

public class VehicleLiteMore
  extends VehicleLite
{
  protected List<DeviceLiteMore> devListMore;
  
  public List<DeviceLiteMore> getDevListMore()
  {
    return this.devListMore;
  }
  
  public void setDevListMore(List<DeviceLiteMore> devListMore)
  {
    this.devListMore = devListMore;
  }
  
  public DeviceLiteMore getGpsDevice()
  {
    if (this.devListMore != null)
    {
      if (this.devListMore.size() == 1) {
        return (DeviceLiteMore)this.devListMore.get(0);
      }
      for (int i = 0; i < this.devListMore.size(); i++) {
        if ((((DeviceLiteMore)this.devListMore.get(i)).getModule().intValue() >> 0 & 0x1) <= 0) {
          return (DeviceLiteMore)this.devListMore.get(i);
        }
      }
    }
    return null;
  }
  
  public DeviceLiteMore getVideoDevice()
  {
    if (this.devListMore != null) {
      for (int i = 0; i < this.devListMore.size(); i++) {
        if ((((DeviceLiteMore)this.devListMore.get(i)).getModule().intValue() >> 0 & 0x1) > 0) {
          return (DeviceLiteMore)this.devListMore.get(i);
        }
      }
    }
    return null;
  }
  
  public String getLngLatStr()
  {
    DeviceLiteMore device = getGpsDevice();
    if ((device != null) && 
      (device.isGpsValid()) && (!device.isDeviceStop()))
    {
      if ((device.getStatus().getMapJingDu() == null) || (device.getStatus().getMapJingDu().equals("0")) || 
        (device.getStatus().getMapWeiDu() == null) || (device.getStatus().getMapWeiDu().equals("0")) || 
        (device.getStatus().getJingDu() == null) || (device.getStatus().getJingDu().intValue() == 0) || 
        (device.getStatus().getWeiDu() == null) || (device.getStatus().getWeiDu().intValue() == 0)) {
        return "";
      }
      return device.getStatus().getWeiDuEx() + "," + device.getStatus().getJingDuEx();
    }
    return "";
  }
  
  public DeviceLiteMore getLastTimeDevice()
  {
    if (this.devListMore != null)
    {
      if (this.devListMore.size() == 1) {
        return (DeviceLiteMore)this.devListMore.get(0);
      }
      Date gpsTime1 = ((DeviceLiteMore)this.devListMore.get(0)).getGpsTime();
      Date gpsTime2 = ((DeviceLiteMore)this.devListMore.get(1)).getGpsTime();
      if ((gpsTime1 != null) && (gpsTime2 != null))
      {
        if (DateUtil.compareDate(gpsTime1, gpsTime2)) {
          return (DeviceLiteMore)this.devListMore.get(0);
        }
        return (DeviceLiteMore)this.devListMore.get(1);
      }
      if ((gpsTime1 == null) && (gpsTime2 == null)) {
        return getGpsDevice();
      }
      if (gpsTime1 != null) {
        return (DeviceLiteMore)this.devListMore.get(0);
      }
      return (DeviceLiteMore)this.devListMore.get(1);
    }
    return null;
  }
  
  public String getGpsTimeString()
  {
    if ((this.devListMore != null) && (this.devListMore.size() > 0))
    {
      if (this.devListMore.size() == 1) {
        return ((DeviceLiteMore)this.devListMore.get(0)).getGpsTimeString();
      }
      if (((DeviceLiteMore)this.devListMore.get(0)).isOnline())
      {
        if (((DeviceLiteMore)this.devListMore.get(1)).isOnline()) {
          return getGpsDevice().getGpsTimeString();
        }
        return ((DeviceLiteMore)this.devListMore.get(0)).getGpsTimeString();
      }
      if (((DeviceLiteMore)this.devListMore.get(1)).isOnline()) {
        return ((DeviceLiteMore)this.devListMore.get(1)).getGpsTimeString();
      }
      return getLastTimeDevice().getGpsTimeString();
    }
    return "";
  }
  
  public long getOfflineLong()
  {
    DeviceLiteMore device = getGpsDevice();
    if ((device != null) && (device.getStatus() != null) && (device.getStatus().getGpsTime() != null))
    {
      Date offlineTime = device.getGpsTime();
      return new Date().getTime() - offlineTime.getTime();
    }
    return 0L;
  }
}
