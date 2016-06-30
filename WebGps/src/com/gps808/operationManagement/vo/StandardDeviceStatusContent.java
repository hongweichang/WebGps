package com.gps808.operationManagement.vo;

import com.gps.model.DeviceStatus;
import com.gps.model.ServerInfo;
import com.gps808.model.StandardDevice;

public class StandardDeviceStatusContent
{
  private StandardDevice device;
  private DeviceStatus devStatus;
  private ServerInfo svrInfo;
  
  public StandardDevice getDevice()
  {
    return this.device;
  }
  
  public void setDevice(StandardDevice device)
  {
    this.device = device;
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
