package com.gz.system.model;

import java.io.Serializable;
import java.util.Date;

public class GzPasswdInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String passwdid;
  private String monitorid;
  private Date startdate;
  private Date enddate;
  
  public String getPasswdid()
  {
    return this.passwdid;
  }
  
  public void setPasswdid(String passwdid)
  {
    this.passwdid = passwdid;
  }
  
  public String getMonitorid()
  {
    return this.monitorid;
  }
  
  public void setMonitorid(String monitorid)
  {
    this.monitorid = monitorid;
  }
  
  public Date getStartdate()
  {
    return this.startdate;
  }
  
  public void setStartdate(Date startdate)
  {
    this.startdate = startdate;
  }
  
  public Date getEnddate()
  {
    return this.enddate;
  }
  
  public void setEnddate(Date enddate)
  {
    this.enddate = enddate;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
