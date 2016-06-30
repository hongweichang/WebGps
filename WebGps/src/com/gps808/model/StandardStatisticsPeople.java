package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardStatisticsPeople
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private String vehiIdno;
  private Integer plateType;
  private String devIdno;
  private Integer upPeople1;
  private Integer downPeople1;
  private Integer upPeople2;
  private Integer downPeople2;
  private Integer upPeople3;
  private Integer downPeople3;
  private Integer upPeople4;
  private Integer downPeople4;
  private Integer curPeople;
  private Integer incrPeople;
  private Date statisticsTime;
  private Integer jindu;
  private Integer weidu;
  private String startPosition;
  
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
  
  public Integer getUpPeople1()
  {
    return this.upPeople1;
  }
  
  public void setUpPeople1(Integer upPeople1)
  {
    this.upPeople1 = upPeople1;
  }
  
  public Integer getDownPeople1()
  {
    return this.downPeople1;
  }
  
  public void setDownPeople1(Integer downPeople1)
  {
    this.downPeople1 = downPeople1;
  }
  
  public Integer getUpPeople2()
  {
    return this.upPeople2;
  }
  
  public void setUpPeople2(Integer upPeople2)
  {
    this.upPeople2 = upPeople2;
  }
  
  public Integer getDownPeople2()
  {
    return this.downPeople2;
  }
  
  public void setDownPeople2(Integer downPeople2)
  {
    this.downPeople2 = downPeople2;
  }
  
  public Integer getUpPeople3()
  {
    return this.upPeople3;
  }
  
  public void setUpPeople3(Integer upPeople3)
  {
    this.upPeople3 = upPeople3;
  }
  
  public Integer getDownPeople3()
  {
    return this.downPeople3;
  }
  
  public void setDownPeople3(Integer downPeople3)
  {
    this.downPeople3 = downPeople3;
  }
  
  public Integer getUpPeople4()
  {
    return this.upPeople4;
  }
  
  public void setUpPeople4(Integer upPeople4)
  {
    this.upPeople4 = upPeople4;
  }
  
  public Integer getDownPeople4()
  {
    return this.downPeople4;
  }
  
  public void setDownPeople4(Integer downPeople4)
  {
    this.downPeople4 = downPeople4;
  }
  
  public Date getStatisticsTime()
  {
    return this.statisticsTime;
  }
  
  public void setStatisticsTime(Date statisticsTime)
  {
    this.statisticsTime = statisticsTime;
  }
  
  public Integer getJindu()
  {
    return this.jindu;
  }
  
  public void setJindu(Integer jindu)
  {
    this.jindu = jindu;
  }
  
  public Integer getWeidu()
  {
    return this.weidu;
  }
  
  public void setWeidu(Integer weidu)
  {
    this.weidu = weidu;
  }
  
  public Integer getCurPeople()
  {
    return this.curPeople;
  }
  
  public void setCurPeople(Integer curPeople)
  {
    this.curPeople = curPeople;
  }
  
  public Integer getIncrPeople()
  {
    return this.incrPeople;
  }
  
  public void setIncrPeople(Integer incrPeople)
  {
    this.incrPeople = incrPeople;
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
  
  public String getStartPosition()
  {
    return this.startPosition;
  }
  
  public void setStartPosition(String startPosition)
  {
    this.startPosition = startPosition;
  }
}
