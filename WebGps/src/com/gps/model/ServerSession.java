package com.gps.model;

import java.io.Serializable;
import java.util.Date;

public class ServerSession
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private Integer svrid;
  private String svridno;
  private String session;
  private Integer status;
  private Date updatetime;
  private ServerInfo svrInfo;
  
  public ServerSession() {}
  
  public ServerSession(Integer id, Integer svrid, String svridno, String session, Integer status, Date updatetime, ServerInfo svrInfo)
  {
    this.id = id;
    this.svrid = svrid;
    this.svridno = svridno;
    this.session = session;
    this.status = status;
    this.updatetime = updatetime;
    this.svrInfo = svrInfo;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setSvrid(Integer svrid)
  {
    this.svrid = svrid;
  }
  
  public Integer getSvrid()
  {
    return this.svrid;
  }
  
  public void setSvridno(String svridno)
  {
    this.svridno = svridno;
  }
  
  public String getSvridno()
  {
    return this.svridno;
  }
  
  public void setSession(String session)
  {
    this.session = session;
  }
  
  public String getSession()
  {
    return this.session;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setUpdatetime(Date updatetime)
  {
    this.updatetime = updatetime;
  }
  
  public Date getUpdatetime()
  {
    return this.updatetime;
  }
}
