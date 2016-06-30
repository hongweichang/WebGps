package com.gps.model;

import java.io.Serializable;

public class LiveVideoSession
  implements Serializable
{
  private static final long serialVersionUID = 77L;
  private Integer id;
  protected Integer userId;
  private Integer status;
  private String randParam;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getUserId()
  {
    return this.userId;
  }
  
  public void setUserId(Integer userId)
  {
    this.userId = userId;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public String getRandParam()
  {
    return this.randParam;
  }
  
  public void setRandParam(String randParam)
  {
    this.randParam = randParam;
  }
}
