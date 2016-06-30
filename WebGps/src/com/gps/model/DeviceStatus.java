package com.gps.model;

import java.io.Serializable;
import java.util.Date;

public class DeviceStatus
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String devIdno;
  private Integer network;
  private String netName;
  private String gwsvrIdno;
  private Integer online;
  private Integer status1;
  private Integer status2;
  private Integer status3;
  private Integer status4;
  private Integer tempSensor1;
  private Integer tempSensor2;
  private Integer tempSensor3;
  private Integer tempSensor4;
  private Integer speed;
  private Integer huangXiang;
  private Integer hangXiang;
  private Integer jingDu;
  private Integer weiDu;
  private Integer gaoDu;
  private Integer srcMapType;
  private Integer srcMapJingDu;
  private Integer srcMapWeiDu;
  private String mapJingDu;
  private String mapWeiDu;
  private Integer parkTime;
  private Integer liCheng;
  private Date gpsTime;
  private String ip;
  private Integer port;
  private Date updateTime;
  private String gpsTimeStr;
  private String position;
  private Integer protocol;
  private Integer diskType;
  private Integer audioCodec;
  private Integer factoryType;
  private Integer factoryDevType;
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setGwsvrIdno(String gwsvrIdno)
  {
    this.gwsvrIdno = gwsvrIdno;
  }
  
  public String getGwsvrIdno()
  {
    return this.gwsvrIdno;
  }
  
  public void setOnline(Integer online)
  {
    this.online = online;
  }
  
  public Integer getOnline()
  {
    return this.online;
  }
  
  public void setSpeed(Integer speed)
  {
    this.speed = speed;
  }
  
  public Integer getSpeed()
  {
    return this.speed;
  }
  
  public void setHuangXiang(Integer huangXiang)
  {
    this.huangXiang = huangXiang;
  }
  
  public Integer getHuangXiang()
  {
    return this.huangXiang;
  }
  
  public void setJingDu(Integer jingDu)
  {
    this.jingDu = jingDu;
  }
  
  public Integer getJingDu()
  {
    return this.jingDu;
  }
  
  public void setWeiDu(Integer weiDu)
  {
    this.weiDu = weiDu;
  }
  
  public Integer getWeiDu()
  {
    return this.weiDu;
  }
  
  public double getJingDuEx()
  {
    double jingdu = this.jingDu.intValue();
    return jingdu / 1000000.0D;
  }
  
  public double getWeiDuEx()
  {
    double weidu = this.weiDu.intValue();
    return weidu / 1000000.0D;
  }
  
  public void setGpsTime(Date gpsTime)
  {
    this.gpsTime = gpsTime;
  }
  
  public Date getGpsTime()
  {
    return this.gpsTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public String getIp()
  {
    return this.ip;
  }
  
  public void setIp(String ip)
  {
    this.ip = ip;
  }
  
  public Integer getPort()
  {
    return this.port;
  }
  
  public void setPort(Integer port)
  {
    this.port = port;
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
  
  public Integer getNetwork()
  {
    return this.network;
  }
  
  public void setNetwork(Integer network)
  {
    this.network = network;
  }
  
  public Integer getGaoDu()
  {
    return this.gaoDu;
  }
  
  public void setGaoDu(Integer gaoDu)
  {
    this.gaoDu = gaoDu;
  }
  
  public Integer getParkTime()
  {
    return this.parkTime;
  }
  
  public void setParkTime(Integer parkTime)
  {
    this.parkTime = parkTime;
  }
  
  public Integer getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Integer liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public Integer getSrcMapType()
  {
    return this.srcMapType;
  }
  
  public void setSrcMapType(Integer srcMapType)
  {
    this.srcMapType = srcMapType;
  }
  
  public Integer getSrcMapJingDu()
  {
    return this.srcMapJingDu;
  }
  
  public void setSrcMapJingDu(Integer srcMapJingDu)
  {
    this.srcMapJingDu = srcMapJingDu;
  }
  
  public Integer getSrcMapWeiDu()
  {
    return this.srcMapWeiDu;
  }
  
  public void setSrcMapWeiDu(Integer srcMapWeiDu)
  {
    this.srcMapWeiDu = srcMapWeiDu;
  }
  
  public String getNetName()
  {
    return this.netName;
  }
  
  public void setNetName(String netName)
  {
    this.netName = netName;
  }
  
  public Integer getHangXiang()
  {
    return this.hangXiang;
  }
  
  public void setHangXiang(Integer hangXiang)
  {
    this.hangXiang = hangXiang;
  }
  
  public String getGpsTimeStr()
  {
    return this.gpsTimeStr;
  }
  
  public void setGpsTimeStr(String gpsTimeStr)
  {
    this.gpsTimeStr = gpsTimeStr;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
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
  
  public Integer getFactoryType()
  {
    return this.factoryType;
  }
  
  public void setFactoryType(Integer factoryType)
  {
    this.factoryType = factoryType;
  }
  
  public Integer getFactoryDevType()
  {
    return this.factoryDevType;
  }
  
  public void setFactoryDevType(Integer factoryDevType)
  {
    this.factoryDevType = factoryDevType;
  }
}
