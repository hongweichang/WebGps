package com.gps808.operationManagement.vo;

public class ServerInfoResult
{
  protected Integer result;
  protected Integer cmsserver;
  protected ResultServer server;
  
  public Integer getResult()
  {
    return this.result;
  }
  
  public void setResult(Integer result)
  {
    this.result = result;
  }
  
  public Integer getCmsserver()
  {
    return this.cmsserver;
  }
  
  public void setCmsserver(Integer cmsserver)
  {
    this.cmsserver = cmsserver;
  }
  
  public ResultServer getServer()
  {
    return this.server;
  }
  
  public void setServer(ResultServer server)
  {
    this.server = server;
  }
}
