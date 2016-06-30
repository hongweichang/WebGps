package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardDevFlowCur
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private String did;
  private Float cdu;
  private Float cdvu;
  private Float cdgu;
  private Float cdou;
  private Float cmu;
  private Float cmvu;
  private Float cmgu;
  private Float cmou;
  private Date uptm;
  
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
  
  public Float getCdu()
  {
    return this.cdu;
  }
  
  public void setCdu(Float cdu)
  {
    this.cdu = cdu;
  }
  
  public Float getCdvu()
  {
    return this.cdvu;
  }
  
  public void setCdvu(Float cdvu)
  {
    this.cdvu = cdvu;
  }
  
  public Float getCdgu()
  {
    return this.cdgu;
  }
  
  public void setCdgu(Float cdgu)
  {
    this.cdgu = cdgu;
  }
  
  public Float getCdou()
  {
    return this.cdou;
  }
  
  public void setCdou(Float cdou)
  {
    this.cdou = cdou;
  }
  
  public Float getCmu()
  {
    return this.cmu;
  }
  
  public void setCmu(Float cmu)
  {
    this.cmu = cmu;
  }
  
  public Float getCmvu()
  {
    return this.cmvu;
  }
  
  public void setCmvu(Float cmvu)
  {
    this.cmvu = cmvu;
  }
  
  public Float getCmgu()
  {
    return this.cmgu;
  }
  
  public void setCmgu(Float cmgu)
  {
    this.cmgu = cmgu;
  }
  
  public Float getCmou()
  {
    return this.cmou;
  }
  
  public void setCmou(Float cmou)
  {
    this.cmou = cmou;
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
