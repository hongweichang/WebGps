package com.gps808.operationManagement.vo;

import com.gps.model.DeviceStatus;

public class DeviceLite
{
  protected String id;
  protected String idno;
  protected String name;
  protected Integer parentId;
  protected Integer devType;
  protected Integer devSubType;
  protected String factory;
  protected Integer chnCount;
  protected String chnName;
  protected Integer ioInCount;
  protected String ioInName;
  protected Integer tempCount;
  protected String tempName;
  protected String simCard;
  protected Integer module;
  protected DeviceStatus status;
  protected Integer nflt;
  
  public DeviceStatus getStatus()
  {
    return this.status;
  }
  
  public void setStatus(DeviceStatus status)
  {
    this.status = status;
  }
  
  public String getId()
  {
    return this.id;
  }
  
  public void setId(String id)
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
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
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
  
  public String getFactory()
  {
    return this.factory;
  }
  
  public void setFactory(String factory)
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
  
  public Integer getModule()
  {
    return this.module;
  }
  
  public void setModule(Integer module)
  {
    this.module = module;
  }
  
  public Integer getNflt()
  {
    return this.nflt;
  }
  
  public void setNflt(Integer nflt)
  {
    this.nflt = nflt;
  }
}
