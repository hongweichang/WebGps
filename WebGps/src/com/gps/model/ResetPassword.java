package com.gps.model;

import java.io.Serializable;
import java.util.Date;

public class ResetPassword
  implements Serializable
{
  private static final long serialVersionUID = 56L;
  private Integer id;
  protected String account;
  private Date sendTime;
  private Date endTime;
  private Integer status;
  private String randParam;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getAccount()
  {
    return this.account;
  }
  
  public void setAccount(String account)
  {
    this.account = account;
  }
  
  public Date getSendTime()
  {
    return this.sendTime;
  }
  
  public void setSendTime(Date sendTime)
  {
    this.sendTime = sendTime;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public String getRandParam()
  {
    return this.randParam;
  }
  
  public void setRandParam(String randParam)
  {
    this.randParam = randParam;
  }
}
