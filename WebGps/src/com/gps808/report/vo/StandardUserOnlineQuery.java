package com.gps808.report.vo;

import java.util.Date;

public class StandardUserOnlineQuery
{
  private String account;
  private String name;
  private String company;
  private Integer loginType;
  private String loginTypeStr;
  private Date beginTime;
  private Date endTime;
  private Integer count;
  private Integer times;
  
  public String getAccount()
  {
    return this.account;
  }
  
  public void setAccount(String account)
  {
    this.account = account;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getCompany()
  {
    return this.company;
  }
  
  public void setCompany(String company)
  {
    this.company = company;
  }
  
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
  
  public Integer getTimes()
  {
    return this.times;
  }
  
  public void setTimes(Integer times)
  {
    this.times = times;
  }
  
  public Integer getLoginType()
  {
    return this.loginType;
  }
  
  public void setLoginType(Integer loginType)
  {
    this.loginType = loginType;
  }
  
  public String getLoginTypeStr()
  {
    return this.loginTypeStr;
  }
  
  public void setLoginTypeStr(String loginTypeStr)
  {
    this.loginTypeStr = loginTypeStr;
  }
}
