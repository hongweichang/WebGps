package com.gps808.report.vo;

import java.util.List;

public class StandardTpmsTrack
{
  public static final int VEHICLE_GPS_LENGTH = 88;
  private String vehiIdno;
  private Integer plateType;
  private Integer type;
  private String devIdno;
  private String gpsTime;
  private String gpsTimeStr;
  private long trackTime;
  private Integer tireCount;
  private List<Integer> tireBatterys;
  private List<Integer> tirePress;
  private List<Integer> temperures;
  private String tireInfoDesc;
  
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
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
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
  
  public long getTrackTime()
  {
    return this.trackTime;
  }
  
  public void setTrackTime(long trackTime)
  {
    this.trackTime = trackTime;
  }
  
  public Integer getTireCount()
  {
    return this.tireCount;
  }
  
  public void setTireCount(Integer tireCount)
  {
    this.tireCount = tireCount;
  }
  
  public List<Integer> getTireBatterys()
  {
    return this.tireBatterys;
  }
  
  public void setTireBatterys(List<Integer> tireBatterys)
  {
    this.tireBatterys = tireBatterys;
  }
  
  public List<Integer> getTirePress()
  {
    return this.tirePress;
  }
  
  public void setTirePress(List<Integer> tirePress)
  {
    this.tirePress = tirePress;
  }
  
  public List<Integer> getTemperures()
  {
    return this.temperures;
  }
  
  public void setTemperures(List<Integer> temperures)
  {
    this.temperures = temperures;
  }
  
  public String getTireInfoDesc()
  {
    return this.tireInfoDesc;
  }
  
  public void setTireInfoDesc(String tireInfoDesc)
  {
    this.tireInfoDesc = tireInfoDesc;
  }
}
