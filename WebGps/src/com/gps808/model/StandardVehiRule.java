package com.gps808.model;

public class StandardVehiRule
{
  private Integer id;
  private StandardVehicle vehicle;
  private StandardRuleMaintain rule;
  
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
  
  public StandardRuleMaintain getRule()
  {
    return this.rule;
  }
  
  public void setRule(StandardRuleMaintain rule)
  {
    this.rule = rule;
  }
}
