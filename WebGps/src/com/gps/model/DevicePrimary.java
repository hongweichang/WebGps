package com.gps.model;

import java.util.Date;

public class DevicePrimary
{
  public static final int DEVICE_CLIENT_NULL = 0;
  public static final int DEVICE_TYPE_MDVR = 1;
  public static final int DEVICE_TYPE_MOBILE = 2;
  public static final int SEX_MALE = 1;
  public static final int SEX_FEMALE = 2;
  public static final int POST_MEMBER = 1;
  public static final int POST_CAPTAIN = 2;
  public static final int MAX_CHN_COUNT = 8;
  protected Integer id;
  protected String idno;
  protected Integer devType;
  protected Integer devSubType;
  protected Integer factory;
  protected Integer icon;
  protected Integer chnCount;
  protected String chnName;
  protected Integer ioInCount;
  protected String ioInName;
  protected Integer tempCount;
  protected String tempName;
  protected String simCard;
  protected String vehiBand;
  protected String vehiType;
  protected String vehiUse;
  protected String vehiColor;
  protected String vehiCompany;
  protected String driverName;
  protected String driverTele;
  protected Date dateProduct;
  protected Integer userID;
  protected Integer devGroupId;
  protected Integer module;
  protected DeviceStatus status;
  protected Integer userSex;
  protected String userCardID;
  protected String userIDNO;
  protected Integer userPost;
  protected String userAddress;
  protected Integer userEquip;
  protected String Remarks;
  
  public Integer getUserSex()
  {
    return this.userSex;
  }
  
  public void setUserSex(Integer userSex)
  {
    this.userSex = userSex;
  }
  
  public String getUserCardID()
  {
    return this.userCardID;
  }
  
  public void setUserCardID(String userCardID)
  {
    this.userCardID = userCardID;
  }
  
  public String getUserIDNO()
  {
    return this.userIDNO;
  }
  
  public void setUserIDNO(String userIDNO)
  {
    this.userIDNO = userIDNO;
  }
  
  public Integer getUserPost()
  {
    return this.userPost;
  }
  
  public void setUserPost(Integer userPost)
  {
    this.userPost = userPost;
  }
  
  public String getUserAddress()
  {
    return this.userAddress;
  }
  
  public void setUserAddress(String userAddress)
  {
    this.userAddress = userAddress;
  }
  
  public Integer getUserEquip()
  {
    return this.userEquip;
  }
  
  public void setUserEquip(Integer userEquip)
  {
    this.userEquip = userEquip;
  }
  
  public String getRemarks()
  {
    return this.Remarks;
  }
  
  public void setRemarks(String remarks)
  {
    this.Remarks = remarks;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getIdno()
  {
    return this.idno;
  }
  
  public void setIdno(String idno)
  {
    this.idno = idno;
  }
  
  public Integer getDevType()
  {
    return this.devType;
  }
  
  public void setDevType(Integer devType)
  {
    this.devType = devType;
  }
  
  public Integer getFactory()
  {
    return this.factory;
  }
  
  public void setFactory(Integer factory)
  {
    this.factory = factory;
  }
  
  public Integer getChnCount()
  {
    return this.chnCount;
  }
  
  public void setChnCount(Integer chnCount)
  {
    this.chnCount = chnCount;
  }
  
  public String getChnName()
  {
    return this.chnName;
  }
  
  public void setChnName(String chnName)
  {
    this.chnName = chnName;
  }
  
  public Integer getIoInCount()
  {
    return this.ioInCount;
  }
  
  public void setIoInCount(Integer ioInCount)
  {
    this.ioInCount = ioInCount;
  }
  
  public String getIoInName()
  {
    return this.ioInName;
  }
  
  public void setIoInName(String ioInName)
  {
    this.ioInName = ioInName;
  }
  
  public Integer getTempCount()
  {
    return this.tempCount;
  }
  
  public void setTempCount(Integer tempCount)
  {
    this.tempCount = tempCount;
  }
  
  public String getTempName()
  {
    return this.tempName;
  }
  
  public void setTempName(String tempName)
  {
    this.tempName = tempName;
  }
  
  public String getSimCard()
  {
    return this.simCard;
  }
  
  public void setSimCard(String simCard)
  {
    this.simCard = simCard;
  }
  
  public String getVehiBand()
  {
    return this.vehiBand;
  }
  
  public void setVehiBand(String vehiBand)
  {
    this.vehiBand = vehiBand;
  }
  
  public String getVehiType()
  {
    return this.vehiType;
  }
  
  public void setVehiType(String vehiType)
  {
    this.vehiType = vehiType;
  }
  
  public String getVehiUse()
  {
    return this.vehiUse;
  }
  
  public void setVehiUse(String vehiUse)
  {
    this.vehiUse = vehiUse;
  }
  
  public String getVehiColor()
  {
    return this.vehiColor;
  }
  
  public void setVehiColor(String vehiColor)
  {
    this.vehiColor = vehiColor;
  }
  
  public String getVehiCompany()
  {
    return this.vehiCompany;
  }
  
  public void setVehiCompany(String vehiCompany)
  {
    this.vehiCompany = vehiCompany;
  }
  
  public String getDriverName()
  {
    return this.driverName;
  }
  
  public void setDriverName(String driverName)
  {
    this.driverName = driverName;
  }
  
  public String getDriverTele()
  {
    return this.driverTele;
  }
  
  public void setDriverTele(String driverTele)
  {
    this.driverTele = driverTele;
  }
  
  public Date getDateProduct()
  {
    return this.dateProduct;
  }
  
  public void setDateProduct(Date dateProduct)
  {
    this.dateProduct = dateProduct;
  }
  
  public Integer getUserID()
  {
    return this.userID;
  }
  
  public void setUserID(Integer userID)
  {
    this.userID = userID;
  }
  
  public Integer getDevGroupId()
  {
    return this.devGroupId;
  }
  
  public void setDevGroupId(Integer devGroupId)
  {
    this.devGroupId = devGroupId;
  }
  
  public Integer getIcon()
  {
    return this.icon;
  }
  
  public void setIcon(Integer icon)
  {
    this.icon = icon;
  }
  
  public DeviceStatus getStatus()
  {
    return this.status;
  }
  
  public void setStatus(DeviceStatus status)
  {
    this.status = status;
  }
  
  public Integer getModule()
  {
    return this.module;
  }
  
  public void setModule(Integer module)
  {
    this.module = module;
  }
  
  public Integer getDevSubType()
  {
    return this.devSubType;
  }
  
  public void setDevSubType(Integer devSubType)
  {
    this.devSubType = devSubType;
  }
}
