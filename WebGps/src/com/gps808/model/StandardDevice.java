package com.gps808.model;

import com.gps.model.DeviceStatus;
import java.util.Date;

public class StandardDevice
{
  private Integer id;
  private String devIDNO;
  private StandardCompany company;
  private StandardSIMCardInfo simInfo;
  private Integer devType;
  private String serialID;
  private String brand;
  private String model;
  private String softwareVer;
  private String hardwareVer;
  private String factory;
  private String remark;
  private Date updateTime;
  private Integer install;
  private Integer devSubType;
  private Integer protocol;
  private Integer diskType;
  private Integer audioCodec;
  private Date stlTm;
  private Integer nflt;
  private DeviceStatus status;
  private String vehiIdno;
  private Integer idnobf;
  private Integer idnobg;
  private Integer netAddrType;
  
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
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
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
  
  public String getSoftwareVer()
  {
    return this.softwareVer;
  }
  
  public void setSoftwareVer(String softwareVer)
  {
    this.softwareVer = softwareVer;
  }
  
  public String getHardwareVer()
  {
    return this.hardwareVer;
  }
  
  public void setHardwareVer(String hardwareVer)
  {
    this.hardwareVer = hardwareVer;
  }
  
  public String getFactory()
  {
    return this.factory;
  }
  
  public void setFactory(String factory)
  {
    this.factory = factory;
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
  
  public Integer getIdnobf()
  {
    return this.idnobf;
  }
  
  public void setIdnobf(Integer idnobf)
  {
    this.idnobf = idnobf;
  }
  
  public Integer getIdnobg()
  {
    return this.idnobg;
  }
  
  public void setIdnobg(Integer indobg)
  {
    this.idnobg = indobg;
  }
  
  public Integer getInstall()
  {
    return this.install;
  }
  
  public void setInstall(Integer install)
  {
    this.install = install;
  }
  
  public StandardSIMCardInfo getSimInfo()
  {
    return this.simInfo;
  }
  
  public void setSimInfo(StandardSIMCardInfo simInfo)
  {
    this.simInfo = simInfo;
  }
  
  public Integer getDevSubType()
  {
    return this.devSubType;
  }
  
  public void setDevSubType(Integer devSubType)
  {
    this.devSubType = devSubType;
  }
  
  public Integer getProtocol()
  {
    return this.protocol;
  }
  
  public void setProtocol(Integer protocol)
  {
    this.protocol = protocol;
  }
  
  public Integer getDiskType()
  {
    return this.diskType;
  }
  
  public void setDiskType(Integer diskType)
  {
    this.diskType = diskType;
  }
  
  public Integer getAudioCodec()
  {
    return this.audioCodec;
  }
  
  public void setAudioCodec(Integer audioCodec)
  {
    this.audioCodec = audioCodec;
  }
  
  public DeviceStatus getStatus()
  {
    return this.status;
  }
  
  public void setStatus(DeviceStatus status)
  {
    this.status = status;
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
  
  public Integer getNflt()
  {
    return this.nflt;
  }
  
  public void setNflt(Integer nflt)
  {
    this.nflt = nflt;
  }
  
  public Integer getNetAddrType()
  {
    return this.netAddrType;
  }
  
  public void setNetAddrType(Integer netAddrType)
  {
    this.netAddrType = netAddrType;
  }
}
