package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardVehicleDaily
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer vid;
  private Date dt;
  private Integer tc;
  private Integer lc;
  private Integer yh;
  private Integer wt;
  private String as;
  private Integer dti;
  private String vn;
  private Integer pt;
  private String ln;
  private Integer rank;
  
  public Integer getVid()
  {
    return this.vid;
  }
  
  public void setVid(Integer vid)
  {
    this.vid = vid;
  }
  
  public Date getDt()
  {
    return this.dt;
  }
  
  public void setDt(Date dt)
  {
    this.dt = dt;
  }
  
  public Integer getTc()
  {
    return this.tc;
  }
  
  public void setTc(Integer tc)
  {
    this.tc = tc;
  }
  
  public Integer getLc()
  {
    return this.lc;
  }
  
  public void setLc(Integer lc)
  {
    this.lc = lc;
  }
  
  public Integer getYh()
  {
    return this.yh;
  }
  
  public void setYh(Integer yh)
  {
    this.yh = yh;
  }
  
  public Integer getWt()
  {
    return this.wt;
  }
  
  public void setWt(Integer wt)
  {
    this.wt = wt;
  }
  
  public String getAs()
  {
    return this.as;
  }
  
  public void setAs(String as)
  {
    this.as = as;
  }
  
  public Integer getDti()
  {
    return this.dti;
  }
  
  public void setDti(Integer dti)
  {
    this.dti = dti;
  }
  
  public String getVn()
  {
    return this.vn;
  }
  
  public void setVn(String vn)
  {
    this.vn = vn;
  }
  
  public Integer getPt()
  {
    return this.pt;
  }
  
  public void setPt(Integer pt)
  {
    this.pt = pt;
  }
  
  public String getLn()
  {
    return this.ln;
  }
  
  public void setLn(String ln)
  {
    this.ln = ln;
  }
  
  public Integer getRank()
  {
    return this.rank;
  }
  
  public void setRank(Integer rank)
  {
    this.rank = rank;
  }
}
