package com.gps808.report.vo;

import java.util.Date;

public class StandardInvoiceSummary
{
  private String vehiIdno;
  private Integer plateType;
  private Date startTime;
  private Date endTime;
  private Integer count;
  private Double weight;
  private Double liCheng;
  
  public Double getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Double liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public Date getStartTime()
  {
    return this.startTime;
  }
  
  public void setStartTime(Date startTime)
  {
    this.startTime = startTime;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
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
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
  
  public Double getWeight()
  {
    return this.weight;
  }
  
  public void setWeight(Double weight)
  {
    this.weight = weight;
  }
}
