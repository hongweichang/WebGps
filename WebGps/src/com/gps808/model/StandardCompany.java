package com.gps808.model;

import java.util.Date;

public class StandardCompany
{
  public static final String SESSION_COMPANYS_ = "companys";
  public static final String SESSION_ALLCOMPANYS_ = "allCompanys";
  public static final int LEVEL_COMPANY = 1;
  public static final int LEVEL_TEAM = 2;
  public static final int LEVEL_LINE = 3;
  private Integer id;
  private String name;
  private Integer level;
  private String code;
  private String abbreviation;
  private String legal;
  private String linkMan;
  private String linkPhone;
  private Integer industryType;
  private Integer parentId;
  private String businessLicenseNum;
  private String registeredCapital;
  private String address;
  private String introduction;
  private String remark;
  private Date updateTime;
  private String parentName;
  private Integer isMine;
  private Integer isChild;
  private Integer companyId;
  private String customerID;
  private Integer accountID;
  private String accountName;
  private String password;
  private Date validity;
  
  public String getParentName()
  {
    return this.parentName;
  }
  
  public void setParentName(String parentName)
  {
    this.parentName = parentName;
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
  
  public Integer getLevel()
  {
    return this.level;
  }
  
  public void setLevel(Integer level)
  {
    this.level = level;
  }
  
  public String getCode()
  {
    return this.code;
  }
  
  public void setCode(String code)
  {
    this.code = code;
  }
  
  public String getAbbreviation()
  {
    return this.abbreviation;
  }
  
  public void setAbbreviation(String abbreviation)
  {
    this.abbreviation = abbreviation;
  }
  
  public String getLegal()
  {
    return this.legal;
  }
  
  public void setLegal(String legal)
  {
    this.legal = legal;
  }
  
  public String getLinkMan()
  {
    return this.linkMan;
  }
  
  public void setLinkMan(String linkMan)
  {
    this.linkMan = linkMan;
  }
  
  public String getLinkPhone()
  {
    return this.linkPhone;
  }
  
  public void setLinkPhone(String linkPhone)
  {
    this.linkPhone = linkPhone;
  }
  
  public Integer getIndustryType()
  {
    return this.industryType;
  }
  
  public void setIndustryType(Integer industryType)
  {
    this.industryType = industryType;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
  
  public String getBusinessLicenseNum()
  {
    return this.businessLicenseNum;
  }
  
  public void setBusinessLicenseNum(String businessLicenseNum)
  {
    this.businessLicenseNum = businessLicenseNum;
  }
  
  public String getRegisteredCapital()
  {
    return this.registeredCapital;
  }
  
  public void setRegisteredCapital(String registeredCapital)
  {
    this.registeredCapital = registeredCapital;
  }
  
  public String getAddress()
  {
    return this.address;
  }
  
  public void setAddress(String address)
  {
    this.address = address;
  }
  
  public String getIntroduction()
  {
    return this.introduction;
  }
  
  public void setIntroduction(String introduction)
  {
    this.introduction = introduction;
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
  
  public Integer getIsMine()
  {
    return this.isMine;
  }
  
  public void setIsMine(Integer isMine)
  {
    this.isMine = isMine;
  }
  
  public Integer getIsChild()
  {
    return this.isChild;
  }
  
  public void setIsChild(Integer isChild)
  {
    this.isChild = isChild;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public String getCustomerID()
  {
    return this.customerID;
  }
  
  public void setCustomerID(String customerID)
  {
    this.customerID = customerID;
  }
  
  public Integer getAccountID()
  {
    return this.accountID;
  }
  
  public void setAccountID(Integer accountID)
  {
    this.accountID = accountID;
  }
  
  public String getAccountName()
  {
    return this.accountName;
  }
  
  public void setAccountName(String accountName)
  {
    this.accountName = accountName;
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
}
