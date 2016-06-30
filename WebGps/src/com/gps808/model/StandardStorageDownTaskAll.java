package com.gps808.model;

import java.util.Date;

public class StandardStorageDownTaskAll
{
  private Integer id;
  private String did;
  private Integer ftp;
  private String fph;
  private Date ctm;
  private Date fbtm;
  private Date fetm;
  private Integer vtp;
  private Integer len;
  private Integer chn;
  private Integer stu;
  private Integer err;
  private Date dbtm;
  private Date detm;
  private String dph;
  private Integer svr;
  private Integer dtp;
  private Integer uid;
  private String lab;
  private Date sbtm;
  private Date setm;
  private Integer nfbtm;
  private Integer nfetm;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getDid()
  {
    return this.did;
  }
  
  public void setDid(String did)
  {
    this.did = did;
  }
  
  public Integer getFtp()
  {
    return this.ftp;
  }
  
  public void setFtp(Integer ftp)
  {
    this.ftp = ftp;
  }
  
  public String getFph()
  {
    return this.fph;
  }
  
  public void setFph(String fph)
  {
    this.fph = fph;
  }
  
  public Date getCtm()
  {
    return this.ctm;
  }
  
  public void setCtm(Date ctm)
  {
    this.ctm = ctm;
  }
  
  public Date getFbtm()
  {
    return this.fbtm;
  }
  
  public void setFbtm(Date fbtm)
  {
    this.fbtm = fbtm;
  }
  
  public Date getFetm()
  {
    return this.fetm;
  }
  
  public void setFetm(Date fetm)
  {
    this.fetm = fetm;
  }
  
  public Integer getVtp()
  {
    return this.vtp;
  }
  
  public void setVtp(Integer vtp)
  {
    this.vtp = vtp;
  }
  
  public Integer getLen()
  {
    return this.len;
  }
  
  public void setLen(Integer len)
  {
    this.len = len;
  }
  
  public Integer getChn()
  {
    return this.chn;
  }
  
  public void setChn(Integer chn)
  {
    this.chn = chn;
  }
  
  public Integer getStu()
  {
    return this.stu;
  }
  
  public void setStu(Integer stu)
  {
    this.stu = stu;
  }
  
  public Integer getErr()
  {
    return this.err;
  }
  
  public void setErr(Integer err)
  {
    this.err = err;
  }
  
  public Date getDbtm()
  {
    return this.dbtm;
  }
  
  public void setDbtm(Date dbtm)
  {
    this.dbtm = dbtm;
  }
  
  public Date getDetm()
  {
    return this.detm;
  }
  
  public void setDetm(Date detm)
  {
    this.detm = detm;
  }
  
  public String getDph()
  {
    return this.dph;
  }
  
  public void setDph(String dph)
  {
    this.dph = dph;
  }
  
  public Integer getSvr()
  {
    return this.svr;
  }
  
  public void setSvr(Integer svr)
  {
    this.svr = svr;
  }
  
  public Integer getDtp()
  {
    return this.dtp;
  }
  
  public void setDtp(Integer dtp)
  {
    this.dtp = dtp;
  }
  
  public Integer getUid()
  {
    return this.uid;
  }
  
  public void setUid(Integer uid)
  {
    this.uid = uid;
  }
  
  public String getLab()
  {
    return this.lab;
  }
  
  public void setLab(String lab)
  {
    this.lab = lab;
  }
  
  public Date getSbtm()
  {
    return this.sbtm;
  }
  
  public void setSbtm(Date sbtm)
  {
    this.sbtm = sbtm;
  }
  
  public Date getSetm()
  {
    return this.setm;
  }
  
  public void setSetm(Date setm)
  {
    this.setm = setm;
  }
  
  public Integer getNfbtm()
  {
    return this.nfbtm;
  }
  
  public void setNfbtm(Integer nfbtm)
  {
    this.nfbtm = nfbtm;
  }
  
  public Integer getNfetm()
  {
    return this.nfetm;
  }
  
  public void setNfetm(Integer nfetm)
  {
    this.nfetm = nfetm;
  }
  
  public void setTaskInfo(StandardStorageDownTaskReal taskReal)
  {
    this.did = taskReal.getDid();
    this.ftp = taskReal.getFtp();
    this.fph = taskReal.getFph();
    this.fbtm = taskReal.getFbtm();
    this.fetm = taskReal.getFetm();
    this.vtp = taskReal.getVtp();
    this.len = taskReal.getLen();
    this.chn = taskReal.getChn();
    this.dtp = taskReal.getDtp();
    this.uid = taskReal.getUid();
    this.lab = taskReal.getLab();
    this.stu = taskReal.getStu();
    this.ctm = taskReal.getCtm();
    this.sbtm = taskReal.getSbtm();
    this.setm = taskReal.getSetm();
  }
}
