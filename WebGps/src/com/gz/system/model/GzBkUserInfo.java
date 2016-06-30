package com.gz.system.model;

import java.io.Serializable;

public class GzBkUserInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String name;
  private String password;
  private Integer type;
  
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
  
  public String getPassword()
  {
    return this.password;
  }
  
  public void setPassword(String password)
  {
    this.password = password;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
