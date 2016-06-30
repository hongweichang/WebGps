package com.gps.user.model;

public class UserDevPermit
{
  private Integer id;
  private Integer accountId;
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
  
  public Integer getAccountId()
  {
    return this.accountId;
  }
  
  public void setAccountId(Integer accountId)
  {
    this.accountId = accountId;
  }
}
