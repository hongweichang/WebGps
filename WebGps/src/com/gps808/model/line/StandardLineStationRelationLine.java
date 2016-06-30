package com.gps808.model.line;

public class StandardLineStationRelationLine
{
  private Integer id;
  private StandardLineInfo line;
  private Integer direct;
  private Integer sid;
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
  
  public StandardLineInfo getLine()
  {
    return this.line;
  }
  
  public void setLine(StandardLineInfo line)
  {
    this.line = line;
  }
  
  public Integer getDirect()
  {
    return this.direct;
  }
  
  public void setDirect(Integer direct)
  {
    this.direct = direct;
  }
  
  public Integer getSid()
  {
    return this.sid;
  }
  
  public void setSid(Integer sid)
  {
    this.sid = sid;
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
