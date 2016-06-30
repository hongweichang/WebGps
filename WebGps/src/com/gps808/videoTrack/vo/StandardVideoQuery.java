package com.gps808.videoTrack.vo;

import java.util.Date;

public class StandardVideoQuery
{
  private String vid;
  private String did;
  private Date stm;
  private Date etm;
  private Integer loc;
  private Integer ftp;
  private Integer vtp;
  private String adr;
  private Integer chn;
  
  public String getVid()
  {
    return this.vid;
  }
  
  public void setVid(String vid)
  {
    this.vid = vid;
  }
  
  public String getDid()
  {
    return this.did;
  }
  
  public void setDid(String did)
  {
    this.did = did;
  }
  
  public Date getStm()
  {
    return this.stm;
  }
  
  public void setStm(Date stm)
  {
    this.stm = stm;
  }
  
  public Date getEtm()
  {
    return this.etm;
  }
  
  public void setEtm(Date etm)
  {
    this.etm = etm;
  }
  
  public Integer getLoc()
  {
    return this.loc;
  }
  
  public void setLoc(Integer loc)
  {
    this.loc = loc;
  }
  
  public Integer getFtp()
  {
    return this.ftp;
  }
  
  public void setFtp(Integer ftp)
  {
    this.ftp = ftp;
  }
  
  public Integer getVtp()
  {
    return this.vtp;
  }
  
  public void setVtp(Integer vtp)
  {
    this.vtp = vtp;
  }
  
  public String getAdr()
  {
    return this.adr;
  }
  
  public void setAdr(String adr)
  {
    this.adr = adr;
  }
  
  public Integer getChn()
  {
    return this.chn;
  }
  
  public void setChn(Integer chn)
  {
    this.chn = chn;
  }
}
