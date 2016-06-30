package com.gps808.model;

import java.io.Serializable;

public class StandardStorageRelation
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String vehiIdno;
  private String svrIdno;
  private StandardVehicle vehicle;
  
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
  
  public StandardVehicle getVehicle()
  {
    return this.vehicle;
  }
  
  public void setVehicle(StandardVehicle vehicle)
  {
    this.vehicle = vehicle;
  }
}
