package com.gps.common.dao;

public abstract interface DeviceStatusDao
{
  public abstract int getTotalCount();
  
  public abstract int getOnlineCount(String paramString);
}
