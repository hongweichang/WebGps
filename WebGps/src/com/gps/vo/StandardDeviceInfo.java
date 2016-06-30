package com.gps.vo;

public class StandardDeviceInfo
{
  private Integer id;
  private String devIDNO;
  private String chnAttr;
  private Integer module;
  private Integer mainDev;
  private DeviceStatusInfo status;
  
  public DeviceStatusInfo getStatus()
  {
    return this.status;
  }
  
  public void setStatus(DeviceStatusInfo status)
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
  
  public String getDevIDNO()
  {
    return this.devIDNO;
  }
  
  public void setDevIDNO(String devIDNO)
  {
    this.devIDNO = devIDNO;
  }
  
  public String getChnAttr()
  {
    return this.chnAttr;
  }
  
  public void setChnAttr(String chnAttr)
  {
    this.chnAttr = chnAttr;
  }
  
  public Integer getModule()
  {
    return this.module;
  }
  
  public void setModule(Integer module)
  {
    this.module = module;
  }
  
  public Integer getMainDev()
  {
    return this.mainDev;
  }
  
  public void setMainDev(Integer mainDev)
  {
    this.mainDev = mainDev;
  }
}
