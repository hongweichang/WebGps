package com.gps.user.model;

import com.gps.model.UserAccountEx;

public class UserDevPermitEx
{
  private Integer id;
  private UserAccountEx userAccount;
  private String devIdno;
  
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
  
  public UserAccountEx getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setUserAccount(UserAccountEx userAccount)
  {
    this.userAccount = userAccount;
  }
}
