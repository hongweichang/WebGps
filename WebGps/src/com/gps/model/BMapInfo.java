package com.gps.model;

import java.io.Serializable;

public class BMapInfo
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String gpsLatitude;
  private String bmapInfo;
  private String position;
  
  public BMapInfo() {}
  
  public BMapInfo(String gpsLatitude, String bmapInfo, String position)
  {
    this.gpsLatitude = gpsLatitude;
    this.bmapInfo = bmapInfo;
    this.position = position;
  }
  
  public String getGpsLatitude()
  {
    return this.gpsLatitude;
  }
  
  public void setGpsLatitude(String gpsLatitude)
  {
    this.gpsLatitude = gpsLatitude;
  }
  
  public String getBmapInfo()
  {
    return this.bmapInfo;
  }
  
  public void setBmapInfo(String bmapInfo)
  {
    this.bmapInfo = bmapInfo;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
}
