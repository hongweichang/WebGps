package com.gps808.model;

public class StandardUserVehiPermitUser
{
  private Integer id;
  private String vehiIdno;
  private StandardUserAccount user;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
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
