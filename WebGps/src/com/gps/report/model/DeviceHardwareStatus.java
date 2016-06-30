package com.gps.report.model;

import java.io.Serializable;
import java.util.Date;

public class DeviceHardwareStatus
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String devIdno;
  private Date date;
  private Integer dateI;
  private String devVerNum;
  private String diskType;
  private String diskAllVolume;
  private String diskLeftVolume;
  private String diskStatus;
  private String diskSerialNum;
  private String videoLost;
  private String record;
  private Integer videoTran;
  private Integer threeFlow;
  private Integer fourFlow;
  private String dateStr;
  private String vehiIdno;
  private Integer plateType;
  private Date updateTime;
  
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
  
  public String getDateStr()
  {
    return this.dateStr;
  }
  
  public void setDateStr(String dateStr)
  {
    this.dateStr = dateStr;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getDate()
  {
    return this.date;
  }
  
  public void setDate(Date date)
  {
    this.date = date;
  }
  
  public Integer getDateI()
  {
    return this.dateI;
  }
  
  public void setDateI(Integer dateI)
  {
    this.dateI = dateI;
  }
  
  public String getDevVerNum()
  {
    return this.devVerNum;
  }
  
  public void setDevVerNum(String devVerNum)
  {
    this.devVerNum = devVerNum;
  }
  
  public String getDiskType()
  {
    return this.diskType;
  }
  
  public void setDiskType(String diskType)
  {
    this.diskType = diskType;
  }
  
  public String getDiskAllVolume()
  {
    return this.diskAllVolume;
  }
  
  public void setDiskAllVolume(String diskAllVolume)
  {
    this.diskAllVolume = diskAllVolume;
  }
  
  public String getDiskLeftVolume()
  {
    return this.diskLeftVolume;
  }
  
  public void setDiskLeftVolume(String diskLeftVolume)
  {
    this.diskLeftVolume = diskLeftVolume;
  }
  
  public String getDiskStatus()
  {
    return this.diskStatus;
  }
  
  public void setDiskStatus(String diskStatus)
  {
    this.diskStatus = diskStatus;
  }
  
  public String getDiskSerialNum()
  {
    return this.diskSerialNum;
  }
  
  public void setDiskSerialNum(String diskSerialNum)
  {
    this.diskSerialNum = diskSerialNum;
  }
  
  public String getVideoLost()
  {
    return this.videoLost;
  }
  
  public void setVideoLost(String videoLost)
  {
    this.videoLost = videoLost;
  }
  
  public String getRecord()
  {
    return this.record;
  }
  
  public void setRecord(String record)
  {
    this.record = record;
  }
  
  public Integer getVideoTran()
  {
    return this.videoTran;
  }
  
  public void setVideoTran(Integer videoTran)
  {
    this.videoTran = videoTran;
  }
  
  public Integer getThreeFlow()
  {
    return this.threeFlow;
  }
  
  public void setThreeFlow(Integer threeFlow)
  {
    this.threeFlow = threeFlow;
  }
  
  public Integer getFourFlow()
  {
    return this.fourFlow;
  }
  
  public void setFourFlow(Integer fourFlow)
  {
    this.fourFlow = fourFlow;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
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
