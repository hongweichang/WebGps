package com.gps.model;

import java.io.Serializable;

public class DevRegist
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private Integer number;
  private Long svrConfig;
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setNumber(Integer number)
  {
    this.number = number;
  }
  
  public Integer getNumber()
  {
    return this.number;
  }
  
  public Long getSvrConfig()
  {
    return this.svrConfig;
  }
  
  public void setSvrConfig(Long svrConfig)
  {
    this.svrConfig = svrConfig;
  }
}
