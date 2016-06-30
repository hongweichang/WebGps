package com.gps808.operationManagement.vo;

import java.util.List;

public class StandardVehicleEx
{
  private Integer id;
  private String vid;
  private PartStandardInfo com;
  private Integer stu;
  private Integer ptp;
  private String cor;
  private Integer ol;
  private String tm;
  private String itm;
  private String stm;
  private List<PartStandardInfo> devList;
  
  public String getTm()
  {
    return this.tm;
  }
  
  public void setTm(String tm)
  {
    this.tm = tm;
  }
  
  public String getItm()
  {
    return this.itm;
  }
  
  public void setItm(String itm)
  {
    this.itm = itm;
  }
  
  public String getStm()
  {
    return this.stm;
  }
  
  public void setStm(String stm)
  {
    this.stm = stm;
  }
  
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
  
  public PartStandardInfo getCom()
  {
    return this.com;
  }
  
  public void setCom(PartStandardInfo com)
  {
    this.com = com;
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
  
  public String getCor()
  {
    return this.cor;
  }
  
  public void setCor(String cor)
  {
    this.cor = cor;
  }
  
  public List<PartStandardInfo> getDevList()
  {
    return this.devList;
  }
  
  public void setDevList(List<PartStandardInfo> devList)
  {
    this.devList = devList;
  }
  
  public Integer getOl()
  {
    return this.ol;
  }
  
  public void setOl(Integer ol)
  {
    this.ol = ol;
  }
}
