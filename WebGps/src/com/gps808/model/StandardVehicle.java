package com.gps808.model;

import java.util.Date;
import java.util.List;

public class StandardVehicle
{
  private Integer id;
  private String vehiIDNO;
  private StandardCompany company;
  private Integer status;
  private Integer plateType;
  private String vehiColor;
  private String vehiBand;
  private String vehiType;
  private String vehiUse;
  private StandardDriver driver;
  private Date dateProduct;
  private Integer icon;
  private Integer chnCount;
  private String chnName;
  private Integer ioInCount;
  private String ioInName;
  private Integer ioOutCount;
  private String ioOutName;
  private Integer tempCount;
  private String tempName;
  private Integer mapType;
  private Integer mapValid;
  private Integer jingDu;
  private Integer weiDu;
  private Integer gaoDu;
  private Integer payEnable;
  private Date payBegin;
  private Integer payPeriod;
  private Integer payMonth;
  private Integer payDelayDay;
  private Integer stoDay;
  private Date safeDate;
  private String drivingNum;
  private Date drivingDate;
  private String operatingNum;
  private Date operatingDate;
  private Date stlTm;
  private Date updateTime;
  private List<StandardVehiDevRelation> relations;
  private List<StandardDevice> devices;
  
  public List<StandardVehiDevRelation> getRelations()
  {
    return this.relations;
  }
  
  public void setRelations(List<StandardVehiDevRelation> relations)
  {
    this.relations = relations;
  }
  
  public String getVehiBand()
  {
    return this.vehiBand;
  }
  
  public void setVehiBand(String vehiBand)
  {
    this.vehiBand = vehiBand;
  }
  
  public Integer getGaoDu() {
	  return this.gaoDu;
  }
  
  public void setGaoDu(Integer gaoDu) {
	  this.gaoDu = gaoDu;
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
  
  public StandardDriver getDriver()
  {
    return this.driver;
  }
  
  public void setDriver(StandardDriver driver)
  {
    this.driver = driver;
  }
  
  public Date getDateProduct()
  {
    return this.dateProduct;
  }
  
  public void setDateProduct(Date dateProduct)
  {
    this.dateProduct = dateProduct;
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
  
  public Integer getIoOutCount()
  {
    return this.ioOutCount;
  }
  
  public void setIoOutCount(Integer ioOutCount)
  {
    this.ioOutCount = ioOutCount;
  }
  
  public String getIoOutName()
  {
    return this.ioOutName;
  }
  
  public void setIoOutName(String ioOutName)
  {
    this.ioOutName = ioOutName;
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
  
  public Integer getMapType()
  {
    return this.mapType;
  }
  
  public void setMapType(Integer mapType)
  {
    this.mapType = mapType;
  }
  
  public Integer getMapValid()
  {
    return this.mapValid;
  }
  
  public void setMapValid(Integer mapValid)
  {
    this.mapValid = mapValid;
  }
  
  public Integer getJingDu()
  {
    return this.jingDu;
  }
  
  public void setJingDu(Integer jingDu)
  {
    this.jingDu = jingDu;
  }
  
  public Integer getWeiDu()
  {
    return this.weiDu;
  }
  
  public void setWeiDu(Integer weiDu)
  {
    this.weiDu = weiDu;
  }
  
  public Integer getPayEnable()
  {
    return this.payEnable;
  }
  
  public void setPayEnable(Integer payEnable)
  {
    this.payEnable = payEnable;
  }
  
  public Date getPayBegin()
  {
    return this.payBegin;
  }
  
  public void setPayBegin(Date payBegin)
  {
    this.payBegin = payBegin;
  }
  
  public Integer getPayPeriod()
  {
    return this.payPeriod;
  }
  
  public void setPayPeriod(Integer payPeriod)
  {
    this.payPeriod = payPeriod;
  }
  
  public Integer getPayMonth()
  {
    return this.payMonth;
  }
  
  public void setPayMonth(Integer payMonth)
  {
    this.payMonth = payMonth;
  }
  
  public Integer getPayDelayDay()
  {
    return this.payDelayDay;
  }
  
  public void setPayDelayDay(Integer payDelayDay)
  {
    this.payDelayDay = payDelayDay;
  }
  
  public Integer getStoDay()
  {
    return this.stoDay;
  }
  
  public void setStoDay(Integer stoDay)
  {
    this.stoDay = stoDay;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getVehiIDNO()
  {
    return this.vehiIDNO;
  }
  
  public void setVehiIDNO(String vehiIDNO)
  {
    this.vehiIDNO = vehiIDNO;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public String getVehiColor()
  {
    return this.vehiColor;
  }
  
  public void setVehiColor(String vehiColor)
  {
    this.vehiColor = vehiColor;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public List<StandardDevice> getDevices()
  {
    return this.devices;
  }
  
  public void setDevices(List<StandardDevice> devices)
  {
    this.devices = devices;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
  
  public Date getSafeDate()
  {
    return this.safeDate;
  }
  
  public void setSafeDate(Date safeDate)
  {
    this.safeDate = safeDate;
  }
  
  public String getDrivingNum()
  {
    return this.drivingNum;
  }
  
  public void setDrivingNum(String drivingNum)
  {
    this.drivingNum = drivingNum;
  }
  
  public Date getDrivingDate()
  {
    return this.drivingDate;
  }
  
  public void setDrivingDate(Date drivingDate)
  {
    this.drivingDate = drivingDate;
  }
  
  public String getOperatingNum()
  {
    return this.operatingNum;
  }
  
  public void setOperatingNum(String operatingNum)
  {
    this.operatingNum = operatingNum;
  }
  
  public Date getOperatingDate()
  {
    return this.operatingDate;
  }
  
  public void setOperatingDate(Date operatingDate)
  {
    this.operatingDate = operatingDate;
  }
  
  public Date getStlTm()
  {
    return this.stlTm;
  }
  
  public void setStlTm(Date stlTm)
  {
    this.stlTm = stlTm;
  }
}
