package com.gps.model;

import java.io.Serializable;

public class DeviceType
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String name;
  private Integer brandId;
  
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
  
  public Integer getBrandId()
  {
    return this.brandId;
  }
  
  public void setBrandId(Integer brandId)
  {
    this.brandId = brandId;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
