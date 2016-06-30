package com.gps.report.model;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

public class DeviceGps
  implements Serializable
{
  private static final long serialVersionUID = 6245952610728029753L;
  private String devIdno;
  private Date gpsDate;
  private Blob gpsData;
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getGpsDate()
  {
    return this.gpsDate;
  }
  
  public void setGpsDate(Date gpsDate)
  {
    this.gpsDate = gpsDate;
  }
  
  public Blob getGpsData()
  {
    return this.gpsData;
  }
  
  public void setGpsData(Blob gpsData)
  {
    this.gpsData = gpsData;
  }
}
