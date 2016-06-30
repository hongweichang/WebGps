package com.gps.model;

import java.io.Serializable;

public class StorageRelation
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private String devIdno;
  private String svrIdno;
  private DeviceInfo devInfo;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public String getSvrIdno()
  {
    return this.svrIdno;
  }
  
  public void setSvrIdno(String svrIdno)
  {
    this.svrIdno = svrIdno;
  }
  
  public DeviceInfo getDevInfo()
  {
    return this.devInfo;
  }
  
  public void setDevInfo(DeviceInfo devInfo)
  {
    this.devInfo = devInfo;
  }
}
