package com.gps808.model;

import java.util.Date;

public class StandardSIMCardInfo
{
  private Integer Id;
  private String cardNum;
  private Integer status;
  private Date registrationTime;
  private StandardCompany company;
  private String remark;
  private Date updateTime;
  private Integer install;
  
  public Integer getInstall()
  {
    return this.install;
  }
  
  public void setInstall(Integer install)
  {
    this.install = install;
  }
  
  public Integer getId()
  {
    return this.Id;
  }
  
  public void setId(Integer id)
  {
    this.Id = id;
  }
  
  public String getCardNum()
  {
    return this.cardNum;
  }
  
  public void setCardNum(String cardNum)
  {
    this.cardNum = cardNum;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public Date getRegistrationTime()
  {
    return this.registrationTime;
  }
  
  public void setRegistrationTime(Date registrationTime)
  {
    this.registrationTime = registrationTime;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public String getRemark()
  {
    return this.remark;
  }
  
  public void setRemark(String remark)
  {
    this.remark = remark;
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
