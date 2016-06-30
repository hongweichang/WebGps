package com.gps808.operationManagement.vo;

import java.util.Date;

public class StandardSendVehicle
{
  private Integer id;
  private String vid;
  private Integer cid;
  private Integer stu;
  private Integer ptp;
  private Integer jingDu;
  private Integer ol;
  private Date tm;
  private String position;
  private Integer weiDu;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getVid()
  {
    return this.vid;
  }
  
  public void setVid(String vid)
  {
    this.vid = vid;
  }
  
  public Integer getStu()
  {
    return this.stu;
  }
  
  public void setStu(Integer stu)
  {
    this.stu = stu;
  }
  
  public Integer getPtp()
  {
    return this.ptp;
  }
  
  public void setPtp(Integer ptp)
  {
    this.ptp = ptp;
  }
  
  public Integer getJingDu()
  {
    return this.jingDu;
  }
  
  public void setJingDu(Integer jingDu)
  {
    this.jingDu = jingDu;
  }
  
  public Integer getWeiDu()
  {
    return this.weiDu;
  }
  
  public void setWeiDu(Integer weiDu)
  {
    this.weiDu = weiDu;
  }
  
  public Integer getCid()
  {
    return this.cid;
  }
  
  public void setCid(Integer cid)
  {
    this.cid = cid;
  }
  
  public Integer getOl()
  {
    return this.ol;
  }
  
  public void setOl(Integer ol)
  {
    this.ol = ol;
  }
  
  public Date getTm()
  {
    return this.tm;
  }
  
  public void setTm(Date tm)
  {
    this.tm = tm;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
}
