package com.gps.system.model;

import java.io.Serializable;

public class DownStation
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String name;
  private String position;
  private String ssid;
  private String ip;
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
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
  
  public String getSsid()
  {
    return this.ssid;
  }
  
  public void setSsid(String ssid)
  {
    this.ssid = ssid;
  }
  
  public String getIp()
  {
    return this.ip;
  }
  
  public void setIp(String ip)
  {
    this.ip = ip;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
}
