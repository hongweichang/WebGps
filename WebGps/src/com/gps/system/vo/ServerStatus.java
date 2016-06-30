package com.gps.system.vo;

public class ServerStatus
{
  private Integer total;
  private Integer online;
  
  public ServerStatus() {}
  
  public ServerStatus(Integer total, Integer online)
  {
    this.total = total;
    this.online = online;
  }
  
  public void setTotal(Integer total)
  {
    this.total = total;
  }
  
  public Integer getTotal()
  {
    return this.total;
  }
  
  public void setOnline(Integer online)
  {
    this.online = online;
  }
  
  public Integer getOnline()
  {
    return this.online;
  }
}
