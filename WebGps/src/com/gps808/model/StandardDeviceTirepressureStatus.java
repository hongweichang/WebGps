package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardDeviceTirepressureStatus
  implements Serializable
{
  private static final long serialVersionUID = 6245952610728029753L;
  private String vehiIdno;
  private Integer type;
  private String devIdno;
  private Date gpsTime;
  private String tirepressure;
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
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
  
  public Date getGpsTime()
  {
    return this.gpsTime;
  }
  
  public void setGpsTime(Date gpsTime)
  {
    this.gpsTime = gpsTime;
  }
  
  public String getTirepressure()
  {
    return this.tirepressure;
  }
  
  public void setTirepressure(String tirepressure)
  {
    this.tirepressure = tirepressure;
  }
}
