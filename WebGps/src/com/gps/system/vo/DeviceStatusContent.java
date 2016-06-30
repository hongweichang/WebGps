package com.gps.system.vo;

import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.ServerInfo;

public class DeviceStatusContent
{
  private DeviceInfo devInfo;
  private DeviceStatus devStatus;
  private ServerInfo svrInfo;
  
  public DeviceInfo getDevInfo()
  {
    return this.devInfo;
  }
  
  public void setDevInfo(DeviceInfo devInfo)
  {
    this.devInfo = devInfo;
  }
  
  public ServerInfo getSvrInfo()
  {
    return this.svrInfo;
  }
  
  public void setSvrInfo(ServerInfo svrInfo)
  {
    this.svrInfo = svrInfo;
  }
  
  public DeviceStatus getDevStatus()
  {
    return this.devStatus;
  }
  
  public void setDevStatus(DeviceStatus devStatus)
  {
    this.devStatus = devStatus;
  }
}
