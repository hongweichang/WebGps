package com.gps.model;

import java.util.Date;

public class RememberKey
{
  private Integer id;
  private Integer accountId;
  private String cookie;
  private String IPAddress;
  private Date updateTime;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getAccountId()
  {
    return this.accountId;
  }
  
  public void setAccountId(Integer accountId)
  {
    this.accountId = accountId;
  }
  
  public String getCookie()
  {
    return this.cookie;
  }
  
  public void setCookie(String cookie)
  {
    this.cookie = cookie;
  }
  
  public String getIPAddress()
  {
    return this.IPAddress;
  }
  
  public void setIPAddress(String iPAddress)
  {
    this.IPAddress = iPAddress;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
}
