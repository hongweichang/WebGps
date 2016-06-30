package com.gps808.model;

public class StandardUserVehiPermitVehicle
{
  private Integer id;
  private StandardVehicle vehicle;
  private Integer userId;
  
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
  
  public Integer getUserId()
  {
    return this.userId;
  }
  
  public void setUserId(Integer userId)
  {
    this.userId = userId;
  }
}
