package com.gps808.model;

import java.io.Serializable;

public class StandardStorageRelationEx
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String vehiIdno;
  private String svrIdno;
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public String getSvrIdno()
  {
    return this.svrIdno;
  }
  
  public void setSvrIdno(String svrIdno)
  {
    this.svrIdno = svrIdno;
  }
}
