package com.gps.vehicle.model;

import java.util.Date;

public class DriverInfo
{
  private Integer id;
  private Integer userID;
  private String name;
  private String telephone;
  private String email;
  private String cardNO;
  private String Licence;
  private String orgName;
  private Date effective;
  private Date expiration;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getUserID()
  {
    return this.userID;
  }
  
  public void setUserID(Integer userID)
  {
    this.userID = userID;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getTelephone()
  {
    return this.telephone;
  }
  
  public void setTelephone(String telephone)
  {
    this.telephone = telephone;
  }
  
  public String getEmail()
  {
    return this.email;
  }
  
  public void setEmail(String email)
  {
    this.email = email;
  }
  
  public String getCardNO()
  {
    return this.cardNO;
  }
  
  public void setCardNO(String cardNO)
  {
    this.cardNO = cardNO;
  }
  
  public String getLicence()
  {
    return this.Licence;
  }
  
  public void setLicence(String licence)
  {
    this.Licence = licence;
  }
  
  public String getOrgName()
  {
    return this.orgName;
  }
  
  public void setOrgName(String orgName)
  {
    this.orgName = orgName;
  }
  
  public Date getEffective()
  {
    return this.effective;
  }
  
  public void setEffective(Date effective)
  {
    this.effective = effective;
  }
  
  public Date getExpiration()
  {
    return this.expiration;
  }
  
  public void setExpiration(Date expiration)
  {
    this.expiration = expiration;
  }
}
