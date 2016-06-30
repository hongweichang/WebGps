package com.gps.report.vo;

import java.util.Date;

public class DailyCount
{
  private Date dtime;
  private Integer count;
  private String dtimeStr;
  
  public String getDtimeStr()
  {
    return this.dtimeStr;
  }
  
  public void setDtimeStr(String dtimeStr)
  {
    this.dtimeStr = dtimeStr;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
}
