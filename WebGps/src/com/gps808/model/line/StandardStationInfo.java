package com.gps808.model.line;

public class StandardStationInfo
{
  public static final int DISABLE = 0;
  public static final int ENABLE = 1;
  private Integer id;
  private Integer enable;
  private String name;
  private Integer direct;
  private Integer lngIn;
  private Integer latIn;
  private Integer angleIn;
  private Integer lngOut;
  private Integer latOut;
  private Integer angleOut;
  private String abbr;
  private String remark;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getEnable()
  {
    return this.enable;
  }
  
  public void setEnable(Integer enable)
  {
    this.enable = enable;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public Integer getDirect()
  {
    return this.direct;
  }
  
  public void setDirect(Integer direct)
  {
    this.direct = direct;
  }
  
  public Integer getLngIn()
  {
    return this.lngIn;
  }
  
  public void setLngIn(Integer lngIn)
  {
    this.lngIn = lngIn;
  }
  
  public Integer getLatIn()
  {
    return this.latIn;
  }
  
  public void setLatIn(Integer latIn)
  {
    this.latIn = latIn;
  }
  
  public Integer getAngleIn()
  {
    return this.angleIn;
  }
  
  public void setAngleIn(Integer angleIn)
  {
    this.angleIn = angleIn;
  }
  
  public Integer getLngOut()
  {
    return this.lngOut;
  }
  
  public void setLngOut(Integer lngOut)
  {
    this.lngOut = lngOut;
  }
  
  public Integer getLatOut()
  {
    return this.latOut;
  }
  
  public void setLatOut(Integer latOut)
  {
    this.latOut = latOut;
  }
  
  public Integer getAngleOut()
  {
    return this.angleOut;
  }
  
  public void setAngleOut(Integer angleOut)
  {
    this.angleOut = angleOut;
  }
  
  public String getAbbr()
  {
    return this.abbr;
  }
  
  public void setAbbr(String abbr)
  {
    this.abbr = abbr;
  }
  
  public String getRemark()
  {
    return this.remark;
  }
  
  public void setRemark(String remark)
  {
    this.remark = remark;
  }
}
