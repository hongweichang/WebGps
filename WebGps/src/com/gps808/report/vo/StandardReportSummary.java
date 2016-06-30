package com.gps808.report.vo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class StandardReportSummary
{
  private String vehiIdno;
  private Date beginTime;
  private Date endTime;
  private Integer plateType;
  private Integer companyId;
  private String vehiColor;
  private Integer param1Sum;
  private List<String> countStrs;
  private List<Integer> counts;
  private String param1SumStr;
  private BigDecimal loginRate;
  private String name;
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public BigDecimal getLoginRate()
  {
    return this.loginRate;
  }
  
  public void setLoginRate(BigDecimal loginRate)
  {
    this.loginRate = loginRate;
  }
  
  public String getParam1SumStr()
  {
    return this.param1SumStr;
  }
  
  public void setParam1SumStr(String param1SumStr)
  {
    this.param1SumStr = param1SumStr;
  }
  
  public List<Integer> getCounts()
  {
    return this.counts;
  }
  
  public void setCounts(List<Integer> counts)
  {
    this.counts = counts;
  }
  
  public List<String> getCountStrs()
  {
    return this.countStrs;
  }
  
  public void setCountStrs(List<String> countStrs)
  {
    this.countStrs = countStrs;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
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
  
  public void addCountStr(String countStr)
  {
    if (this.countStrs == null) {
      this.countStrs = new ArrayList();
    }
    this.countStrs.add(countStr);
  }
  
  public void addCount(Integer count)
  {
    if (this.counts == null) {
      this.counts = new ArrayList();
    }
    this.counts.add(count);
  }
  
  public Integer getParam1Sum()
  {
    return this.param1Sum;
  }
  
  public void setParam1Sum(Integer param1Sum)
  {
    this.param1Sum = param1Sum;
  }
  
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
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
}
