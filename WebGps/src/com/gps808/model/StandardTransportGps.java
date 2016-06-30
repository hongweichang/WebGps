package com.gps808.model;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

public class StandardTransportGps
  implements Serializable
{
  private static final long serialVersionUID = 6245952610728029753L;
  private Integer vehiId;
  private String vehiIdno;
  private Integer plateType;
  private Integer type;
  private String devIdno;
  private Date gpsDate;
  private Blob transportData;
  
  public Integer getVehiId()
  {
    return this.vehiId;
  }
  
  public void setVehiId(Integer vehiId)
  {
    this.vehiId = vehiId;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
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
  
  public Blob getTransportData()
  {
    return this.transportData;
  }
  
  public void setTransportData(Blob transportData)
  {
    this.transportData = transportData;
  }
}
