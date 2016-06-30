package com.gps808.report.vo;

import java.util.Date;

public class StandardDeviceTempSummary
{
  private String vehiIdno;
  private Integer companyId;
  private Integer armType;
  private Integer armInfo;
  private Integer handleStatus;
  private Date beginTime;
  private Date endTime;
  private Integer count;
  private Integer param1Sum;
  private String countStr;
  private Integer plateType;
  private String vehiColor;
  private String armTypeStr;
  private Integer count1;
  private Integer param1;
  private Integer param2Sum;
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public String getVehiColor()
  {
    return this.vehiColor;
  }
  
  public void setVehiColor(String vehiColor)
  {
    this.vehiColor = vehiColor;
  }
  
  public String getCountStr()
  {
    return this.countStr;
  }
  
  public void setCountStr(String countStr)
  {
    this.countStr = countStr;
  }
  
  public Date getBeginTime()
  {
    return this.beginTime;
  }
  
  public void setBeginTime(Date beginTime)
  {
    this.beginTime = beginTime;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public Integer getArmType()
  {
    return this.armType;
  }
  
  public void setArmType(Integer armType)
  {
    this.armType = armType;
  }
  
  public Integer getArmInfo()
  {
    return this.armInfo;
  }
  
  public void setArmInfo(Integer armInfo)
  {
    this.armInfo = armInfo;
  }
  
  public Integer getParam1Sum()
  {
    return this.param1Sum;
  }
  
  public void setParam1Sum(Integer param1Sum)
  {
    this.param1Sum = param1Sum;
  }
  
  public Integer getHandleStatus()
  {
    return this.handleStatus;
  }
  
  public void setHandleStatus(Integer handleStatus)
  {
    this.handleStatus = handleStatus;
  }
  
  public String getArmTypeStr()
  {
    return this.armTypeStr;
  }
  
  public void setArmTypeStr(String armTypeStr)
  {
    this.armTypeStr = armTypeStr;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public Integer getCount1()
  {
    return this.count1;
  }
  
  public void setCount1(Integer count1)
  {
    this.count1 = count1;
  }
  
  public Integer getParam2Sum()
  {
    return this.param2Sum;
  }
  
  public void setParam2Sum(Integer param2Sum)
  {
    this.param2Sum = param2Sum;
  }
  
  public Integer getParam1()
  {
    return this.param1;
  }
  
  public void setParam1(Integer param3)
  {
    this.param1 = param3;
  }
}
