package com.gps808.model;

public class StandardUserVehiPermit
{
  private Integer id;
  private StandardVehicle vehicle;
  private StandardUserAccount user;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public StandardVehicle getVehicle()
  {
    return this.vehicle;
  }
  
  public void setVehicle(StandardVehicle vehicle)
  {
    this.vehicle = vehicle;
  }
  
  public StandardUserAccount getUser()
  {
    return this.user;
  }
  
  public void setUser(StandardUserAccount user)
  {
    this.user = user;
  }
}
