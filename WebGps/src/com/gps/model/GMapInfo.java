package com.gps.model;

import java.io.Serializable;

public class GMapInfo
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String gpsLatitude;
  private String gmapInfo;
  private String position;
  
  public GMapInfo() {}
  
  public GMapInfo(String gpsLatitude, String gmapInfo, String position)
  {
    this.gpsLatitude = gpsLatitude;
    this.gmapInfo = gmapInfo;
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
  
  public String getGmapInfo()
  {
    return this.gmapInfo;
  }
  
  public void setGmapInfo(String gmapInfo)
  {
    this.gmapInfo = gmapInfo;
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
