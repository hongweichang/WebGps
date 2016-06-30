package com.gps.model;

import java.io.Serializable;

public class DeviceBrand
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String name;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
