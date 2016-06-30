package com.gps808.model.line;

import java.io.Serializable;
import java.util.Date;

public class StandardLineMonth
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer lid;
  private Date dt;
  private Integer tc;
  private Integer lc;
  private Integer yh;
  private Integer wt;
  private String as;
  private Integer dti;
  private String ln;
  private Integer rank;
  
  public Integer getLid()
  {
    return this.lid;
  }
  
  public void setLid(Integer lid)
  {
    this.lid = lid;
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
