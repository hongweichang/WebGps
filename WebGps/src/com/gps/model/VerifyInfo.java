package com.gps.model;

import java.util.Date;

public class VerifyInfo
{
  public static int VERIFY_TYPE_EMAIL = 1;
  public static int VERIFY_TYPE_SMS = 2;
  private Integer id;
  private Integer accountId;
  private String guid;
  private Integer type;
  private Date expireTime;
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
  
  public String getGuid()
  {
    return this.guid;
  }
  
  public void setGuid(String guid)
  {
    this.guid = guid;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public Date getExpireTime()
  {
    return this.expireTime;
  }
  
  public void setExpireTime(Date expireTime)
  {
    this.expireTime = expireTime;
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
