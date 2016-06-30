package com.gps.report.model;

import java.io.Serializable;
import java.util.Date;

public class DeviceNetFlow
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String devIdno;
  private Date dtime;
  private Float curDayUsed;
  private Float dayLimit;
  private Float curMonthUsed;
  private Float monthLimit;
  private String dtimeStr;
  
  public String getDtimeStr()
  {
    return this.dtimeStr;
  }
  
  public void setDtimeStr(String dtimeStr)
  {
    this.dtimeStr = dtimeStr;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public Float getCurDayUsed()
  {
    return this.curDayUsed;
  }
  
  public void setCurDayUsed(Float curDayUsed)
  {
    this.curDayUsed = curDayUsed;
  }
  
  public Float getDayLimit()
  {
    return this.dayLimit;
  }
  
  public void setDayLimit(Float dayLimit)
  {
    this.dayLimit = dayLimit;
  }
  
  public Float getCurMonthUsed()
  {
    return this.curMonthUsed;
  }
  
  public void setCurMonthUsed(Float curMonthUsed)
  {
    this.curMonthUsed = curMonthUsed;
  }
  
  public Float getMonthLimit()
  {
    return this.monthLimit;
  }
  
  public void setMonthLimit(Float monthLimit)
  {
    this.monthLimit = monthLimit;
  }
}
