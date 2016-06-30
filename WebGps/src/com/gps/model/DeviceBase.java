package com.gps.model;

public class DeviceBase
  extends DeviceObject
{
  protected UserAccountEx userAccount;
  
  public UserAccountEx getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setUserAccount(UserAccountEx userAccount)
  {
    this.userAccount = userAccount;
  }
  
  public boolean isOnline()
  {
    if ((getStatus() != null) && (getStatus().getOnline() != null) && 
      (getStatus().getOnline().intValue() > 0)) {
      return true;
    }
    return false;
  }
}
