package com.gps808.model.line;

public class StandardLineStationRelationStation
{
  public static final int LINE_DIRECT_UP = 0;
  public static final int LINE_DIRECT_DOWN = 1;
  private Integer id;
  private Integer lid;
  private Integer direct;
  private StandardStationInfo station;
  private Integer sindex;
  private Integer stype;
  private Integer speed;
  private Integer len;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getLid()
  {
    return this.lid;
  }
  
  public void setLid(Integer lid)
  {
    this.lid = lid;
  }
  
  public Integer getDirect()
  {
    return this.direct;
  }
  
  public void setDirect(Integer direct)
  {
    this.direct = direct;
  }
  
  public StandardStationInfo getStation()
  {
    return this.station;
  }
  
  public void setStation(StandardStationInfo station)
  {
    this.station = station;
  }
  
  public Integer getSindex()
  {
    return this.sindex;
  }
  
  public void setSindex(Integer sindex)
  {
    this.sindex = sindex;
  }
  
  public Integer getStype()
  {
    return this.stype;
  }
  
  public void setStype(Integer stype)
  {
    this.stype = stype;
  }
  
  public Integer getSpeed()
  {
    return this.speed;
  }
  
  public void setSpeed(Integer speed)
  {
    this.speed = speed;
  }
  
  public Integer getLen()
  {
    return this.len;
  }
  
  public void setLen(Integer len)
  {
    this.len = len;
  }
}
