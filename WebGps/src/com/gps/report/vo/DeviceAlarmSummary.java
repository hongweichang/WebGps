package com.gps.report.vo;

import java.util.Date;

public class DeviceAlarmSummary
{
  private String devIdno;
  private Integer armInfo;
  private Integer armType;
  private Date beginTime;
  private Date endTime;
  private Integer count;
  private Integer param1Sum;
  
  public Date getBeginTime()
  {
    return this.beginTime;
  }
  
  public void setBeginTime(Date beginTime)
  {
    this.beginTime = beginTime;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Integer getArmInfo()
  {
    return this.armInfo;
  }
  
  public void setArmInfo(Integer armInfo)
  {
    this.armInfo = armInfo;
  }
  
  public Integer getArmType()
  {
    return this.armType;
  }
  
  public void setArmType(Integer armType)
  {
    this.armType = armType;
  }
  
  public Integer getParam1Sum()
  {
    return this.param1Sum;
  }
  
  public void setParam1Sum(Integer param1Sum)
  {
    this.param1Sum = param1Sum;
  }
}
