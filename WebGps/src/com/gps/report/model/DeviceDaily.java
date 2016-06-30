package com.gps.report.model;

import java.io.Serializable;
import java.util.Date;

public class DeviceDaily
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String devIdno;
  private Date date;
  private Date startTime;
  private Integer startJingDu;
  private Integer startWeiDu;
  private Integer startGaoDu;
  private Integer startLiCheng;
  private Integer startYouLiang;
  private Date endTime;
  private Integer endJingDu;
  private Integer endWeiDu;
  private Integer endGaoDu;
  private Integer endLiCheng;
  private Integer endYouLiang;
  private Integer addYouLiang;
  private Integer reduceYouLiang;
  private Integer uploadWifiLiuLiang;
  private Integer downWifiLiuLiang;
  private Integer uploadSimLiuLiang;
  private Integer downSimLiuLiang;
  private Integer liCheng;
  private Integer youLiang;
  private Integer workTime;
  private String startPosition;
  private String endPosition;
  private String startTimeStr;
  private String endTimeStr;
  private String dateStr;
  
  public String getDateStr()
  {
    return this.dateStr;
  }
  
  public void setDateStr(String dateStr)
  {
    this.dateStr = dateStr;
  }
  
  public String getStartTimeStr()
  {
    return this.startTimeStr;
  }
  
  public void setStartTimeStr(String startTimeStr)
  {
    this.startTimeStr = startTimeStr;
  }
  
  public String getEndTimeStr()
  {
    return this.endTimeStr;
  }
  
  public void setEndTimeStr(String endTimeStr)
  {
    this.endTimeStr = endTimeStr;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getDate()
  {
    return this.date;
  }
  
  public void setDate(Date date)
  {
    this.date = date;
  }
  
  public Date getStartTime()
  {
    return this.startTime;
  }
  
  public void setStartTime(Date startTime)
  {
    this.startTime = startTime;
  }
  
  public Integer getStartJingDu()
  {
    return this.startJingDu;
  }
  
  public void setStartJingDu(Integer startJingDu)
  {
    this.startJingDu = startJingDu;
  }
  
  public Integer getStartWeiDu()
  {
    return this.startWeiDu;
  }
  
  public void setStartWeiDu(Integer startWeiDu)
  {
    this.startWeiDu = startWeiDu;
  }
  
  public Integer getStartGaoDu()
  {
    return this.startGaoDu;
  }
  
  public void setStartGaoDu(Integer startGaoDu)
  {
    this.startGaoDu = startGaoDu;
  }
  
  public Integer getStartLiCheng()
  {
    return this.startLiCheng;
  }
  
  public void setStartLiCheng(Integer startLiCheng)
  {
    this.startLiCheng = startLiCheng;
  }
  
  public Integer getStartYouLiang()
  {
    return this.startYouLiang;
  }
  
  public void setStartYouLiang(Integer startYouLiang)
  {
    this.startYouLiang = startYouLiang;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getEndJingDu()
  {
    return this.endJingDu;
  }
  
  public void setEndJingDu(Integer endJingDu)
  {
    this.endJingDu = endJingDu;
  }
  
  public Integer getEndWeiDu()
  {
    return this.endWeiDu;
  }
  
  public void setEndWeiDu(Integer endWeiDu)
  {
    this.endWeiDu = endWeiDu;
  }
  
  public Integer getEndGaoDu()
  {
    return this.endGaoDu;
  }
  
  public void setEndGaoDu(Integer endGaoDu)
  {
    this.endGaoDu = endGaoDu;
  }
  
  public Integer getEndLiCheng()
  {
    return this.endLiCheng;
  }
  
  public void setEndLiCheng(Integer endLiCheng)
  {
    this.endLiCheng = endLiCheng;
  }
  
  public Integer getEndYouLiang()
  {
    return this.endYouLiang;
  }
  
  public void setEndYouLiang(Integer endYouLiang)
  {
    this.endYouLiang = endYouLiang;
  }
  
  public Integer getAddYouLiang()
  {
    return this.addYouLiang;
  }
  
  public void setAddYouLiang(Integer addYouLiang)
  {
    this.addYouLiang = addYouLiang;
  }
  
  public Integer getReduceYouLiang()
  {
    return this.reduceYouLiang;
  }
  
  public void setReduceYouLiang(Integer reduceYouLiang)
  {
    this.reduceYouLiang = reduceYouLiang;
  }
  
  public Integer getUploadWifiLiuLiang()
  {
    return this.uploadWifiLiuLiang;
  }
  
  public void setUploadWifiLiuLiang(Integer uploadWifiLiuLiang)
  {
    this.uploadWifiLiuLiang = uploadWifiLiuLiang;
  }
  
  public Integer getDownWifiLiuLiang()
  {
    return this.downWifiLiuLiang;
  }
  
  public void setDownWifiLiuLiang(Integer downWifiLiuLiang)
  {
    this.downWifiLiuLiang = downWifiLiuLiang;
  }
  
  public Integer getUploadSimLiuLiang()
  {
    return this.uploadSimLiuLiang;
  }
  
  public void setUploadSimLiuLiang(Integer uploadSimLiuLiang)
  {
    this.uploadSimLiuLiang = uploadSimLiuLiang;
  }
  
  public Integer getDownSimLiuLiang()
  {
    return this.downSimLiuLiang;
  }
  
  public void setDownSimLiuLiang(Integer downSimLiuLiang)
  {
    this.downSimLiuLiang = downSimLiuLiang;
  }
  
  public Integer getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Integer liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public String getStartPosition()
  {
    return this.startPosition;
  }
  
  public void setStartPosition(String startPosition)
  {
    this.startPosition = startPosition;
  }
  
  public String getEndPosition()
  {
    return this.endPosition;
  }
  
  public void setEndPosition(String endPosition)
  {
    this.endPosition = endPosition;
  }
  
  public Integer getYouLiang()
  {
    return this.youLiang;
  }
  
  public void setYouLiang(Integer youLiang)
  {
    this.youLiang = youLiang;
  }
  
  public Integer getWorkTime()
  {
    return this.workTime;
  }
  
  public void setWorkTime(Integer workTime)
  {
    this.workTime = workTime;
  }
}
