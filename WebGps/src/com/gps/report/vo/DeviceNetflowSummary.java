package com.gps.report.vo;

import java.util.Date;

public class DeviceNetflowSummary
{
  private String devIdno;
  private Date startTime;
  private Date endTime;
  private Float totalNetFlow;
  private String startTimeStr;
  private String endTimeStr;
  
  public String getStartTimeStr()
  {
    return this.startTimeStr;
  }
  
  public void setStartTimeStr(String startTimeStr)
  {
    this.startTimeStr = startTimeStr;
  }
  
  public String getEndTimeStr()
  {
    return this.endTimeStr;
  }
  
  public void setEndTimeStr(String endTimeStr)
  {
    this.endTimeStr = endTimeStr;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
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
  
  public Float getTotalNetFlow()
  {
    return this.totalNetFlow;
  }
  
  public void setTotalNetFlow(Float totalNetFlow)
  {
    this.totalNetFlow = totalNetFlow;
  }
}
