package com.gps808.model;

import java.util.Date;

public class StandardUserAccount
{
  public static final String USER_ACCOUNT_ADMIN = "admin";
  public static final String USER_ACCOUNT_ADMINISTRATOR = "administrator";
  public static final String SESSION_USERACCOUNT = "userAccount";
  public static final String SESSION_ACCOUNT_808 = "account808";
  public static final String SESSION_USERID = "userid";
  public static final String SESSION_PRIVILEGE = "privilege";
  public static final String SESSION_COMPANY = "company";
  public static final String SESSION_SYSUSER_808 = "sysuser808";
  public static final String SESSION_USERSESSION = "userSession";
  private Integer id;
  private String name;
  private String account;
  private String password;
  private Date validity;
  private StandardCompany company;
  private StandardUserRole role;
  private Integer status;
  private Date createTime;
  private Date updateTime;
  private Integer isMine;
  private String permits;
  private Integer accountType;
  
  public String getPermits()
  {
    return this.permits;
  }
  
  public void setPermits(String permits)
  {
    this.permits = permits;
  }
  
  public Integer getIsMine()
  {
    return this.isMine;
  }
  
  public void setIsMine(Integer isMine)
  {
    this.isMine = isMine;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getAccount()
  {
    return this.account;
  }
  
  public void setAccount(String account)
  {
    this.account = account;
  }
  
  public String getPassword()
  {
    return this.password;
  }
  
  public void setPassword(String password)
  {
    this.password = password;
  }
  
  public Date getValidity()
  {
    return this.validity;
  }
  
  public void setValidity(Date validity)
  {
    this.validity = validity;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public StandardUserRole getRole()
  {
    return this.role;
  }
  
  public void setRole(StandardUserRole role)
  {
    this.role = role;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public Date getCreateTime()
  {
    return this.createTime;
  }
  
  public void setCreateTime(Date createTime)
  {
    this.createTime = createTime;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
  
  public Integer getAccountType()
  {
    return this.accountType;
  }
  
  public void setAccountType(Integer accountType)
  {
    this.accountType = accountType;
  }
}
