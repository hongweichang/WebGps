package com.gps.system.model;

import java.io.Serializable;
import java.util.Date;

public class ServerLog
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final int SVR_ACTION_START = 1;
  public static final int SVR_ACTION_STOP = 2;
  public static final int SVR_ACTION_LOGIN = 3;
  public static final int SVR_ACTION_LOGOUT = 4;
  public static final int SVR_ACTION_ONLINE = 5;
  public static final int SVR_ACTION_OFFLINE = 6;
  private Integer id;
  private Integer svrid;
  private Integer action;
  private String content;
  private Date dtime;
  
  public ServerLog() {}
  
  public ServerLog(Integer id, Integer svrid, Integer action, String content, Date dtime)
  {
    this.id = id;
    this.svrid = svrid;
    this.action = action;
    this.content = content;
    this.dtime = dtime;
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
  
  public void setAction(Integer action)
  {
    this.action = action;
  }
  
  public Integer getAction()
  {
    return this.action;
  }
  
  public void setContent(String content)
  {
    this.content = content;
  }
  
  public String getContent()
  {
    return this.content;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
}
