package com.gps808.model;

import java.util.Date;

public class StandardVehiDevRelationEx
{
  private Integer id;
  private String vehiIdno;
  private String devIdno;
  private String chnAttr;
  private String ioInAttr;
  private String ioOutAttr;
  private String tempAttr;
  private Integer module;
  private Integer mainDev;
  private Date updateTime;
  
  public Integer getMainDev()
  {
    return this.mainDev;
  }
  
  public void setMainDev(Integer mainDev)
  {
    this.mainDev = mainDev;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public String getChnAttr()
  {
    return this.chnAttr;
  }
  
  public void setChnAttr(String chnAttr)
  {
    this.chnAttr = chnAttr;
  }
  
  public String getIoInAttr()
  {
    return this.ioInAttr;
  }
  
  public void setIoInAttr(String ioInAttr)
  {
    this.ioInAttr = ioInAttr;
  }
  
  public String getIoOutAttr()
  {
    return this.ioOutAttr;
  }
  
  public void setIoOutAttr(String ioOutAttr)
  {
    this.ioOutAttr = ioOutAttr;
  }
  
  public String getTempAttr()
  {
    return this.tempAttr;
  }
  
  public void setTempAttr(String tempAttr)
  {
    this.tempAttr = tempAttr;
  }
  
  public Integer getModule()
  {
    return this.module;
  }
  
  public void setModule(Integer module)
  {
    this.module = module;
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
