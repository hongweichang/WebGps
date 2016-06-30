package com.gps808.model;

import java.io.Serializable;

public class StandardDevFlowConfig
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private String did;
  private Integer nofc;
  private Integer nodfr;
  private Integer nomfr;
  private Float fdl;
  private Float fml;
  private Integer ndr;
  private Integer nmr;
  private Integer nmtd;
  private Integer nflt;
  
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
  
  public Integer getNofc()
  {
    return this.nofc;
  }
  
  public void setNofc(Integer nofc)
  {
    this.nofc = nofc;
  }
  
  public Integer getNodfr()
  {
    return this.nodfr;
  }
  
  public void setNodfr(Integer nodfr)
  {
    this.nodfr = nodfr;
  }
  
  public Integer getNomfr()
  {
    return this.nomfr;
  }
  
  public void setNomfr(Integer nomfr)
  {
    this.nomfr = nomfr;
  }
  
  public Float getFdl()
  {
    return this.fdl;
  }
  
  public void setFdl(Float fdl)
  {
    this.fdl = fdl;
  }
  
  public Float getFml()
  {
    return this.fml;
  }
  
  public void setFml(Float fml)
  {
    this.fml = fml;
  }
  
  public Integer getNdr()
  {
    return this.ndr;
  }
  
  public void setNdr(Integer ndr)
  {
    this.ndr = ndr;
  }
  
  public Integer getNmr()
  {
    return this.nmr;
  }
  
  public void setNmr(Integer nmr)
  {
    this.nmr = nmr;
  }
  
  public Integer getNmtd()
  {
    return this.nmtd;
  }
  
  public void setNmtd(Integer nmtd)
  {
    this.nmtd = nmtd;
  }
  
  public Integer getNflt()
  {
    return this.nflt;
  }
  
  public void setNflt(Integer nflt)
  {
    this.nflt = nflt;
  }
  
  public void copyOther(StandardDevFlowConfig config)
  {
    this.nofc = config.getNofc();
    this.nodfr = config.getNodfr();
    this.nomfr = config.getNomfr();
    this.fdl = config.getFdl();
    this.fml = config.getFml();
    this.ndr = config.getNdr();
    this.nmr = config.getNmr();
    this.nmtd = config.getNmtd();
    this.nflt = config.getNflt();
  }
}
