package com.gps808.report.vo;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

public class StandardDeviceMinMaxGps
  implements Serializable
{
  private static final long serialVersionUID = 6245952610728029753L;
  private Integer vehiId;
  private String vehiIdno;
  private Integer plateType;
  private String devIdno;
  private Date minDate;
  private Blob minData;
  private Date maxDate;
  private Blob maxData;
  
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
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getMinDate()
  {
    return this.minDate;
  }
  
  public void setMinDate(Date minDate)
  {
    this.minDate = minDate;
  }
  
  public Blob getMinData()
  {
    return this.minData;
  }
  
  public void setMinData(Blob minData)
  {
    this.minData = minData;
  }
  
  public Date getMaxDate()
  {
    return this.maxDate;
  }
  
  public void setMaxDate(Date maxDate)
  {
    this.maxDate = maxDate;
  }
  
  public Blob getMaxData()
  {
    return this.maxData;
  }
  
  public void setMaxData(Blob maxData)
  {
    this.maxData = maxData;
  }
}
