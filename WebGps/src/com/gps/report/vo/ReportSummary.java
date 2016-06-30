package com.gps.report.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ReportSummary
{
  private String devIdno;
  private Date beginTime;
  private Date endTime;
  private Integer param1Sum;
  private List<Integer> counts;
  private String beginTimeStr;
  private String endTimeStr;
  
  public String getBeginTimeStr()
  {
    return this.beginTimeStr;
  }
  
  public void setBeginTimeStr(String beginTimeStr)
  {
    this.beginTimeStr = beginTimeStr;
  }
  
  public String getEndTimeStr()
  {
    return this.endTimeStr;
  }
  
  public void setEndTimeStr(String endTimeStr)
  {
    this.endTimeStr = endTimeStr;
  }
  
  public List<Integer> getCounts()
  {
    return this.counts;
  }
  
  public void setCounts(List<Integer> counts)
  {
    this.counts = counts;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
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
}
