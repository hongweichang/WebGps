package com.gps.model;

import java.util.Date;

public class DeviceInfo
  extends DeviceObject
{
  private UserInfo userInfo;
  protected UserAccount userAccount;
  public Date updateTime;
  
  public UserInfo getUserInfo()
  {
    return this.userInfo;
  }
  
  public void setUserInfo(UserInfo userInfo)
  {
    this.userInfo = userInfo;
  }
  
  public UserAccount getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setUserAccount(UserAccount userAccount)
  {
    this.userAccount = userAccount;
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
