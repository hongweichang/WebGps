package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardAlarmAudio
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private Integer uid;
  private String sds;
  private String dec;
  private Date uptm;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getUid()
  {
    return this.uid;
  }
  
  public void setUid(Integer uid)
  {
    this.uid = uid;
  }
  
  public String getSds()
  {
    return this.sds;
  }
  
  public void setSds(String sds)
  {
    this.sds = sds;
  }
  
  public String getDec()
  {
    return this.dec;
  }
  
  public void setDec(String dec)
  {
    this.dec = dec;
  }
  
  public Date getUptm()
  {
    return this.uptm;
  }
  
  public void setUptm(Date uptm)
  {
    this.uptm = uptm;
  }
}
