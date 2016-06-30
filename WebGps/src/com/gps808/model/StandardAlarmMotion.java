package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardAlarmMotion
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private Integer uid;
  private Integer scp;
  private String vid;
  private Integer atp;
  private String stp;
  private Integer ismsd;
  private String smad;
  private String smcd;
  private Integer iemsd;
  private String emad;
  private String emcd;
  private Integer ird;
  private Integer rdy;
  private Integer rch;
  private Integer rtm;
  private Integer cp;
  private Integer cpch;
  private Integer sd;
  private String sds;
  private Integer sam;
  private String btm;
  private String etm;
  private Integer enb;
  private Date uptm;
  private String slatp;
  
  public String getSlatp()
  {
    return this.slatp;
  }
  
  public void setSlatp(String slatp)
  {
    this.slatp = slatp;
  }
  
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
  
  public Integer getScp()
  {
    return this.scp;
  }
  
  public void setScp(Integer scp)
  {
    this.scp = scp;
  }
  
  public String getVid()
  {
    return this.vid;
  }
  
  public void setVid(String vid)
  {
    this.vid = vid;
  }
  
  public Integer getAtp()
  {
    return this.atp;
  }
  
  public void setAtp(Integer atp)
  {
    this.atp = atp;
  }
  
  public String getStp()
  {
    return this.stp;
  }
  
  public void setStp(String stp)
  {
    this.stp = stp;
  }
  
  public Integer getIsmsd()
  {
    return this.ismsd;
  }
  
  public void setIsmsd(Integer ismsd)
  {
    this.ismsd = ismsd;
  }
  
  public String getSmad()
  {
    return this.smad;
  }
  
  public void setSmad(String smad)
  {
    this.smad = smad;
  }
  
  public String getSmcd()
  {
    return this.smcd;
  }
  
  public void setSmcd(String smcd)
  {
    this.smcd = smcd;
  }
  
  public Integer getIemsd()
  {
    return this.iemsd;
  }
  
  public void setIemsd(Integer iemsd)
  {
    this.iemsd = iemsd;
  }
  
  public String getEmad()
  {
    return this.emad;
  }
  
  public void setEmad(String emad)
  {
    this.emad = emad;
  }
  
  public String getEmcd()
  {
    return this.emcd;
  }
  
  public void setEmcd(String emcd)
  {
    this.emcd = emcd;
  }
  
  public Integer getIrd()
  {
    return this.ird;
  }
  
  public void setIrd(Integer ird)
  {
    this.ird = ird;
  }
  
  public Integer getRdy()
  {
    return this.rdy;
  }
  
  public void setRdy(Integer rdy)
  {
    this.rdy = rdy;
  }
  
  public Integer getRch()
  {
    return this.rch;
  }
  
  public void setRch(Integer rch)
  {
    this.rch = rch;
  }
  
  public Integer getRtm()
  {
    return this.rtm;
  }
  
  public void setRtm(Integer rtm)
  {
    this.rtm = rtm;
  }
  
  public Integer getCp()
  {
    return this.cp;
  }
  
  public void setCp(Integer cp)
  {
    this.cp = cp;
  }
  
  public Integer getCpch()
  {
    return this.cpch;
  }
  
  public void setCpch(Integer cpch)
  {
    this.cpch = cpch;
  }
  
  public Integer getSd()
  {
    return this.sd;
  }
  
  public void setSd(Integer sd)
  {
    this.sd = sd;
  }
  
  public String getSds()
  {
    return this.sds;
  }
  
  public void setSds(String sds)
  {
    this.sds = sds;
  }
  
  public String getBtm()
  {
    return this.btm;
  }
  
  public void setBtm(String btm)
  {
    this.btm = btm;
  }
  
  public String getEtm()
  {
    return this.etm;
  }
  
  public void setEtm(String etm)
  {
    this.etm = etm;
  }
  
  public Integer getEnb()
  {
    return this.enb;
  }
  
  public void setEnb(Integer enb)
  {
    this.enb = enb;
  }
  
  public Integer getSam()
  {
    return this.sam;
  }
  
  public void setSam(Integer sam)
  {
    this.sam = sam;
  }
  
  public Date getUptm()
  {
    return this.uptm;
  }
  
  public void setUptm(Date uptm)
  {
    this.uptm = uptm;
  }
  
  public int hashCode()
  {
    int prime = 31;
    int result = 1;
    result = 31 * result + (this.uid == null ? 0 : this.uid.hashCode());
    result = 31 * result + (this.vid == null ? 0 : this.vid.hashCode());
    result = 31 * result + (this.atp == null ? 0 : this.atp.hashCode());
    return result;
  }
  
  public boolean equals(Object obj)
  {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (getClass() != obj.getClass()) {
      return false;
    }
    StandardAlarmMotion other = (StandardAlarmMotion)obj;
    if (this.uid == null)
    {
      if (other.uid != null) {
        return false;
      }
    }
    else if (!this.uid.equals(other.uid)) {
      return false;
    }
    if (this.vid == null)
    {
      if (other.vid != null) {
        return false;
      }
    }
    else if (!this.vid.equals(other.vid)) {
      return false;
    }
    if (this.atp == null)
    {
      if (other.atp != null) {
        return false;
      }
    }
    else if (!this.atp.equals(other.atp)) {
      return false;
    }
    return true;
  }
}
