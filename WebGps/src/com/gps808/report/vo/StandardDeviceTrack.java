package com.gps808.report.vo;

public class StandardDeviceTrack
{
  public static final int VEHICLE_GPS_LENGTH = 72;
  private String vehiIdno;
  private Integer plateType;
  private String devIdno;
  private Integer youLiang;
  private Integer speed;
  private Integer liCheng;
  private Integer huangXiang;
  private Integer status1;
  private Integer status2;
  private Integer status3;
  private Integer status4;
  private Integer Online;
  public Integer getOnline() {
	return Online;
}

public void setOnline(Integer online) {
	Online = online;
}

private Integer tempSensor1;
  private Integer tempSensor2;
  private Integer tempSensor3;
  private Integer tempSensor4;
  private Integer jingDu;
  private Integer weiDu;
  private Integer gaoDu;
  private Integer parkTime;
  private String mapJingDu;
  private String mapWeiDu;
  private String gpsTime;
  private String gpsTimeStr;
  private long trackTime;
  private Boolean isParking;
  private Integer lineID;
  private Integer direction;
  private Integer odbVotage;
  private Integer odbJQTemp;
  private Integer odbStatus;
  private Integer obdRpm;
  private Integer obdSpeed;
  private Integer odbJQMPos;
  private String position;
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
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Integer getSpeed()
  {
    return this.speed;
  }
  
  public void setSpeed(Integer speed)
  {
    this.speed = speed;
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
  
  public Integer getGaoDu()
  {
    return this.gaoDu;
  }
  
  public void setGaoDu(Integer gaoDu)
  {
    this.gaoDu = gaoDu;
  }
  
  public Integer getHuangXiang()
  {
    return this.huangXiang;
  }
  
  public void setHuangXiang(Integer huangXiang)
  {
    this.huangXiang = huangXiang;
  }
  
  public Integer getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Integer liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public String getGpsTime()
  {
    return this.gpsTime;
  }
  
  public void setGpsTime(String gpsTime)
  {
    this.gpsTime = gpsTime;
  }
  
  public String getGpsTimeStr()
  {
    return this.gpsTimeStr;
  }
  
  public void setGpsTimeStr(String gpsTime)
  {
    this.gpsTimeStr = gpsTime;
  }
  
  public Integer getYouLiang()
  {
    return this.youLiang;
  }
  
  public void setYouLiang(Integer youLiang)
  {
    this.youLiang = youLiang;
  }
  
  public Integer getParkTime()
  {
    return this.parkTime;
  }
  
  public void setParkTime(Integer parkTime)
  {
    this.parkTime = parkTime;
  }
  
  public long getTrackTime()
  {
    return this.trackTime;
  }
  
  public void setTrackTime(long trackTime)
  {
    this.trackTime = trackTime;
  }
  
  public Boolean getIsParking()
  {
    return this.isParking;
  }
  
  public void setIsParking(Boolean isParking)
  {
    this.isParking = isParking;
  }
  
  public Integer getStatus1()
  {
    return this.status1;
  }
  
  public void setStatus1(Integer status1)
  {
    this.status1 = status1;
  }
  
  public Integer getStatus2()
  {
    return this.status2;
  }
  
  public void setStatus2(Integer status2)
  {
    this.status2 = status2;
  }
  
  public Integer getStatus3()
  {
    return this.status3;
  }
  
  public void setStatus3(Integer status3)
  {
    this.status3 = status3;
  }
  
  public Integer getStatus4()
  {
    return this.status4;
  }
  
  public void setStatus4(Integer status4)
  {
    this.status4 = status4;
  }
  
  public Integer getTempSensor1()
  {
    return this.tempSensor1;
  }
  
  public void setTempSensor1(Integer tempSensor1)
  {
    this.tempSensor1 = tempSensor1;
  }
  
  public Integer getTempSensor2()
  {
    return this.tempSensor2;
  }
  
  public void setTempSensor2(Integer tempSensor2)
  {
    this.tempSensor2 = tempSensor2;
  }
  
  public Integer getTempSensor3()
  {
    return this.tempSensor3;
  }
  
  public void setTempSensor3(Integer tempSensor3)
  {
    this.tempSensor3 = tempSensor3;
  }
  
  public Integer getTempSensor4()
  {
    return this.tempSensor4;
  }
  
  public void setTempSensor4(Integer tempSensor4)
  {
    this.tempSensor4 = tempSensor4;
  }
  
  public String getMapJingDu()
  {
    return this.mapJingDu;
  }
  
  public void setMapJingDu(String mapJingDu)
  {
    this.mapJingDu = mapJingDu;
  }
  
  public String getMapWeiDu()
  {
    return this.mapWeiDu;
  }
  
  public void setMapWeiDu(String mapWeiDu)
  {
    this.mapWeiDu = mapWeiDu;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
  
  public Integer getLineID()
  {
    return this.lineID;
  }
  
  public void setLineID(Integer lineID)
  {
    this.lineID = lineID;
  }
  
  public Integer getDirection()
  {
    return this.direction;
  }
  
  public void setDirection(Integer direction)
  {
    this.direction = direction;
  }
  
  public Integer getOdbVotage()
  {
    return this.odbVotage;
  }
  
  public void setOdbVotage(Integer odbVotage)
  {
    this.odbVotage = odbVotage;
  }
  
  public Integer getOdbJQTemp()
  {
    return this.odbJQTemp;
  }
  
  public void setOdbJQTemp(Integer odbJQTemp)
  {
    this.odbJQTemp = odbJQTemp;
  }
  
  public Integer getOdbStatus()
  {
    return this.odbStatus;
  }
  
  public void setOdbStatus(Integer odbStatus)
  {
    this.odbStatus = odbStatus;
  }
  
  public Integer getObdRpm()
  {
    return this.obdRpm;
  }
  
  public void setObdRpm(Integer obdRpm)
  {
    this.obdRpm = obdRpm;
  }
  
  public Integer getObdSpeed()
  {
    return this.obdSpeed;
  }
  
  public void setObdSpeed(Integer obdSpeed)
  {
    this.obdSpeed = obdSpeed;
  }
  
  public Integer getOdbJQMPos()
  {
    return this.odbJQMPos;
  }
  
  public void setOdbJQMPos(Integer odbJQMPos)
  {
    this.odbJQMPos = odbJQMPos;
  }
}
