package com.gps808.operationManagement.vo;

import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import java.util.Date;

public class StandardDeviceEx
{
  private Integer id;
  private String devIDNO;
  private Integer companyId;
  private Integer devType;
  private String serialID;
  private String brand;
  private String model;
  private Integer install;
  private Date stlTm;
  private String vehiIdno;
  
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
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public String getBrand()
  {
    return this.brand;
  }
  
  public void setBrand(String brand)
  {
    this.brand = brand;
  }
  
  public String getModel()
  {
    return this.model;
  }
  
  public void setModel(String model)
  {
    this.model = model;
  }
  
  public Integer getInstall()
  {
    return this.install;
  }
  
  public void setInstall(Integer install)
  {
    this.install = install;
  }
  
  public Integer getDevType()
  {
    return this.devType;
  }
  
  public void setDevType(Integer devType)
  {
    this.devType = devType;
  }
  
  public String getSerialID()
  {
    return this.serialID;
  }
  
  public void setSerialID(String serialID)
  {
    this.serialID = serialID;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public Date getStlTm()
  {
    return this.stlTm;
  }
  
  public void setStlTm(Date stlTm)
  {
    this.stlTm = stlTm;
  }
  
  public void setDevice(StandardDevice device)
  {
    this.id = device.getId();
    this.devIDNO = device.getDevIDNO();
    this.companyId = device.getCompany().getId();
    this.devType = device.getDevType();
    this.serialID = device.getSerialID();
    this.brand = device.getBrand();
    this.model = device.getModel();
    this.install = device.getInstall();
    this.stlTm = device.getStlTm();
  }
}
