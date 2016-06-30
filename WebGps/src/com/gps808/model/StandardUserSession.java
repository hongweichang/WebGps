package com.gps808.model;

import com.gps.model.ServerInfo;
import java.io.Serializable;
import java.util.Date;

public class StandardUserSession
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private Integer userid;
  private String session;
  private String clientIP;
  private Integer port;
  private Integer type;
  private String usrSvrIdno;
  private Integer status;
  private Date updateTime;
  private StandardUserAccount userAccount;
  private ServerInfo svrInfo;
  
  public StandardUserSession() {}
  
  public StandardUserSession(Integer id, Integer userid, String session, String clientIP, Integer port, Integer type, String usrSvrIdno, Integer status, Date updateTime)
  {
    this.id = id;
    this.userid = userid;
    this.session = session;
    this.clientIP = clientIP;
    this.port = port;
    this.type = type;
    this.usrSvrIdno = usrSvrIdno;
    this.status = status;
    this.updateTime = updateTime;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setUserid(Integer usrid)
  {
    this.userid = usrid;
  }
  
  public Integer getUserid()
  {
    return this.userid;
  }
  
  public void setSession(String session)
  {
    this.session = session;
  }
  
  public String getSession()
  {
    return this.session;
  }
  
  public void setClientIP(String clientIP)
  {
    this.clientIP = clientIP;
  }
  
  public String getClientIP()
  {
    return this.clientIP;
  }
  
  public void setPort(Integer port)
  {
    this.port = port;
  }
  
  public Integer getPort()
  {
    return this.port;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setUsrSvrIdno(String usrSvrIdno)
  {
    this.usrSvrIdno = usrSvrIdno;
  }
  
  public String getUsrSvrIdno()
  {
    return this.usrSvrIdno;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUserAccount(StandardUserAccount userAccount)
  {
    this.userAccount = userAccount;
  }
  
  public StandardUserAccount getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setSvrInfo(ServerInfo svrInfo)
  {
    this.svrInfo = svrInfo;
  }
  
  public ServerInfo getSvrInfo()
  {
    return this.svrInfo;
  }
}
