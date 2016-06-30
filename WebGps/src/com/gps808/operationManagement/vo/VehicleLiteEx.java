package com.gps808.operationManagement.vo;

import java.util.List;

public class VehicleLiteEx
{
  protected Integer id;
  protected String nm;
  protected Integer pid;
  protected String pnm;
  protected Integer ic;
  protected String dn;
  protected String dt;
  protected List<DeviceLiteEx> dl;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getNm()
  {
    return this.nm;
  }
  
  public void setNm(String nm)
  {
    this.nm = nm;
  }
  
  public Integer getPid()
  {
    return this.pid;
  }
  
  public void setPid(Integer pid)
  {
    this.pid = pid;
  }
  
  public Integer getIc()
  {
    return this.ic;
  }
  
  public void setIc(Integer ic)
  {
    this.ic = ic;
  }
  
  public String getDn()
  {
    return this.dn;
  }
  
  public void setDn(String dn)
  {
    this.dn = dn;
  }
  
  public String getDt()
  {
    return this.dt;
  }
  
  public void setDt(String dt)
  {
    this.dt = dt;
  }
  
  public List<DeviceLiteEx> getDl()
  {
    return this.dl;
  }
  
  public void setDl(List<DeviceLiteEx> dl)
  {
    this.dl = dl;
  }
  
  public String getPnm()
  {
    return this.pnm;
  }
  
  public void setPnm(String pnm)
  {
    this.pnm = pnm;
  }
}
