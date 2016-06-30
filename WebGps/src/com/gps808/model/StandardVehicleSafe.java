package com.gps808.model;

import java.util.Date;

public class StandardVehicleSafe
{
  private Integer id;
  private StandardVehicle vehicle;
  private String safeCom;
  private String agent;
  private String telephone;
  private Date startTime;
  private Date endTime;
  private Integer count;
  private Integer price;
  private Integer discount;
  private Double actualPrice;
  private String remark;
  private Date updateTime;
  private String vehiIdno;
  private Integer plateType;
  private Integer companyId;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public StandardVehicle getVehicle()
  {
    return this.vehicle;
  }
  
  public void setVehicle(StandardVehicle vehicle)
  {
    this.vehicle = vehicle;
  }
  
  public String getSafeCom()
  {
    return this.safeCom;
  }
  
  public void setSafeCom(String safeCom)
  {
    this.safeCom = safeCom;
  }
  
  public String getAgent()
  {
    return this.agent;
  }
  
  public void setAgent(String agent)
  {
    this.agent = agent;
  }
  
  public String getTelephone()
  {
    return this.telephone;
  }
  
  public void setTelephone(String telephone)
  {
    this.telephone = telephone;
  }
  
  public Date getStartTime()
  {
    return this.startTime;
  }
  
  public void setStartTime(Date startTime)
  {
    this.startTime = startTime;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
  
  public Integer getPrice()
  {
    return this.price;
  }
  
  public void setPrice(Integer price)
  {
    this.price = price;
  }
  
  public Integer getDiscount()
  {
    return this.discount;
  }
  
  public void setDiscount(Integer discount)
  {
    this.discount = discount;
  }
  
  public Double getActualPrice()
  {
    return this.actualPrice;
  }
  
  public void setActualPrice(Double actualPrice)
  {
    this.actualPrice = actualPrice;
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
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
}
