package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardDriverSignin
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer vehiID;
  private Integer sti;
  private String di;
  private Date st;
  private Integer sjd;
  private Integer swd;
  private Integer slc;
  private Date et;
  private Integer ejd;
  private Integer ewd;
  private Integer elc;
  private Integer ss;
  private Integer eti;
  private StandardDriver driver;
  private StandardDevice device;
  private String jn;
  private String dn;
  private String did;
  private String vid;
  private Integer pt;
  private String tl;
  private String sp;
  private String ep;
  
  public Integer getVehiID()
  {
    return this.vehiID;
  }
  
  public void setVehiID(Integer vehiID)
  {
    this.vehiID = vehiID;
  }
  
  public Integer getSti()
  {
    return this.sti;
  }
  
  public void setSti(Integer sti)
  {
    this.sti = sti;
  }
  
  public String getDi()
  {
    return this.di;
  }
  
  public void setDi(String di)
  {
    this.di = di;
  }
  
  public Date getSt()
  {
    return this.st;
  }
  
  public void setSt(Date st)
  {
    this.st = st;
  }
  
  public Integer getSjd()
  {
    return this.sjd;
  }
  
  public void setSjd(Integer sjd)
  {
    this.sjd = sjd;
  }
  
  public Integer getSwd()
  {
    return this.swd;
  }
  
  public void setSwd(Integer swd)
  {
    this.swd = swd;
  }
  
  public Integer getSlc()
  {
    return this.slc;
  }
  
  public void setSlc(Integer slc)
  {
    this.slc = slc;
  }
  
  public Date getEt()
  {
    return this.et;
  }
  
  public void setEt(Date et)
  {
    this.et = et;
  }
  
  public Integer getEjd()
  {
    return this.ejd;
  }
  
  public void setEjd(Integer ejd)
  {
    this.ejd = ejd;
  }
  
  public Integer getEwd()
  {
    return this.ewd;
  }
  
  public void setEwd(Integer ewd)
  {
    this.ewd = ewd;
  }
  
  public Integer getElc()
  {
    return this.elc;
  }
  
  public void setElc(Integer elc)
  {
    this.elc = elc;
  }
  
  public Integer getSs()
  {
    return this.ss;
  }
  
  public void setSs(Integer ss)
  {
    this.ss = ss;
  }
  
  public Integer getEti()
  {
    return this.eti;
  }
  
  public void setEti(Integer eti)
  {
    this.eti = eti;
  }
  
  public StandardDriver getDriver()
  {
    return this.driver;
  }
  
  public void setDriver(StandardDriver driver)
  {
    this.driver = driver;
  }
  
  public StandardDevice getDevice()
  {
    return this.device;
  }
  
  public void setDevice(StandardDevice device)
  {
    this.device = device;
  }
  
  public String getJn()
  {
    return this.jn;
  }
  
  public void setJn(String jn)
  {
    this.jn = jn;
  }
  
  public String getDn()
  {
    return this.dn;
  }
  
  public void setDn(String dn)
  {
    this.dn = dn;
  }
  
  public String getDid()
  {
    return this.did;
  }
  
  public void setDid(String did)
  {
    this.did = did;
  }
  
  public String getVid()
  {
    return this.vid;
  }
  
  public void setVid(String vid)
  {
    this.vid = vid;
  }
  
  public Integer getPt()
  {
    return this.pt;
  }
  
  public void setPt(Integer pt)
  {
    this.pt = pt;
  }
  
  public String getTl()
  {
    return this.tl;
  }
  
  public void setTl(String tl)
  {
    this.tl = tl;
  }
  
  public String getSp()
  {
    return this.sp;
  }
  
  public void setSp(String sp)
  {
    this.sp = sp;
  }
  
  public String getEp()
  {
    return this.ep;
  }
  
  public void setEp(String ep)
  {
    this.ep = ep;
  }
}
