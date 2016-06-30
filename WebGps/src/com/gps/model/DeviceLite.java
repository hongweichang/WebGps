package com.gps.model;

public class DeviceLite
{
  protected Integer id;
  protected String idno;
  protected Integer devGroupId;
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
  protected UserAccountEx userAccount;
  protected DeviceStatus status;
  
  public UserAccountEx getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setUserAccount(UserAccountEx userAccount)
  {
    this.userAccount = userAccount;
  }
  
  public DeviceStatus getStatus()
  {
    return this.status;
  }
  
  public void setStatus(DeviceStatus status)
  {
    this.status = status;
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
  
  public Integer getDevGroupId()
  {
    return this.devGroupId;
  }
  
  public void setDevGroupId(Integer devGroupId)
  {
    this.devGroupId = devGroupId;
  }
  
  public Integer getDevType()
  {
    return this.devType;
  }
  
  public void setDevType(Integer devType)
  {
    this.devType = devType;
  }
  
  public Integer getDevSubType()
  {
    return this.devSubType;
  }
  
  public void setDevSubType(Integer devSubType)
  {
    this.devSubType = devSubType;
  }
  
  public Integer getFactory()
  {
    return this.factory;
  }
  
  public void setFactory(Integer factory)
  {
    this.factory = factory;
  }
  
  public Integer getIcon()
  {
    return this.icon;
  }
  
  public void setIcon(Integer icon)
  {
    this.icon = icon;
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
}
