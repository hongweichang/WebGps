package com.gps808.report.vo;

import java.io.Serializable;
import java.util.Date;

public class StandardStationAlarm
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String lineName;
  private Integer direction;
  private String vehiIdno;
  private Integer plateType;
  private String driverName;
  private String station;
  private Date armTime;
  private Integer speed;
  private Integer liCheng;
  private Integer youLiang;
  private String lastStation;
  private Date lastTime;
  
  public String getLineName()
  {
    return this.lineName;
  }
  
  public void setLineName(String lineName)
  {
    this.lineName = lineName;
  }
  
  public Integer getDirection()
  {
    return this.direction;
  }
  
  public void setDirection(Integer direction)
  {
    this.direction = direction;
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
  
  public String getDriverName()
  {
    return this.driverName;
  }
  
  public void setDriverName(String driverName)
  {
    this.driverName = driverName;
  }
  
  public String getStation()
  {
    return this.station;
  }
  
  public void setStation(String station)
  {
    this.station = station;
  }
  
  public Date getArmTime()
  {
    return this.armTime;
  }
  
  public void setArmTime(Date armTime)
  {
    this.armTime = armTime;
  }
  
  public Integer getSpeed()
  {
    return this.speed;
  }
  
  public void setSpeed(Integer speed)
  {
    this.speed = speed;
  }
  
  public Integer getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Integer liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public Integer getYouLiang()
  {
    return this.youLiang;
  }
  
  public void setYouLiang(Integer youLiang)
  {
    this.youLiang = youLiang;
  }
  
  public String getLastStation()
  {
    return this.lastStation;
  }
  
  public void setLastStation(String lastStation)
  {
    this.lastStation = lastStation;
  }
  
  public Date getLastTime()
  {
    return this.lastTime;
  }
  
  public void setLastTime(Date lastTime)
  {
    this.lastTime = lastTime;
  }
}
