package com.gps808.model;

import java.util.Date;

public class StandardDriver
{
  private Integer id;
  private String jobNum;
  private String name;
  private Integer sex;
  private String contact;
  private String cardNumber;
  private Date birth;
  private String licenseNum;
  private StandardCompany company;
  private Date rushDate;
  private Date validity;
  private Date updateTime;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getJobNum()
  {
    return this.jobNum;
  }
  
  public void setJobNum(String jobNum)
  {
    this.jobNum = jobNum;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public Integer getSex()
  {
    return this.sex;
  }
  
  public void setSex(Integer sex)
  {
    this.sex = sex;
  }
  
  public String getContact()
  {
    return this.contact;
  }
  
  public void setContact(String contact)
  {
    this.contact = contact;
  }
  
  public String getCardNumber()
  {
    return this.cardNumber;
  }
  
  public void setCardNumber(String cardNumber)
  {
    this.cardNumber = cardNumber;
  }
  
  public Date getBirth()
  {
    return this.birth;
  }
  
  public void setBirth(Date birth)
  {
    this.birth = birth;
  }
  
  public String getLicenseNum()
  {
    return this.licenseNum;
  }
  
  public void setLicenseNum(String licenseNum)
  {
    this.licenseNum = licenseNum;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public Date getRushDate()
  {
    return this.rushDate;
  }
  
  public void setRushDate(Date rushDate)
  {
    this.rushDate = rushDate;
  }
  
  public Date getValidity()
  {
    return this.validity;
  }
  
  public void setValidity(Date validity)
  {
    this.validity = validity;
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
