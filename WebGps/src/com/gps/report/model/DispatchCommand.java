package com.gps.report.model;

import com.gps.model.UserAccountEx;
import java.io.Serializable;
import java.util.Date;

public class DispatchCommand
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final int DISPATCH_STATUS_ALLOC = 1;
  public static final int DISPATCH_STATUS_FINISHED = 2;
  public static final int DISPATCH_STATUS_FAILED = 3;
  private Integer id;
  private String guid;
  private String devIdno;
  private Integer accountID;
  private String command;
  private Integer mapType;
  private Integer jingDu;
  private Integer weiDu;
  private Date dtime;
  private Integer status;
  private String completeDesc;
  private Date completeTime;
  private UserAccountEx user;
  private String position;
  private String dtimeStr;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getGuid()
  {
    return this.guid;
  }
  
  public void setGuid(String guid)
  {
    this.guid = guid;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Integer getAccountID()
  {
    return this.accountID;
  }
  
  public void setAccountID(Integer accountID)
  {
    this.accountID = accountID;
  }
  
  public String getCommand()
  {
    return this.command;
  }
  
  public void setCommand(String command)
  {
    this.command = command;
  }
  
  public Integer getMapType()
  {
    return this.mapType;
  }
  
  public void setMapType(Integer mapType)
  {
    this.mapType = mapType;
  }
  
  public Integer getJingDu()
  {
    return this.jingDu;
  }
  
  public void setJingDu(Integer jingDu)
  {
    this.jingDu = jingDu;
  }
  
  public Integer getWeiDu()
  {
    return this.weiDu;
  }
  
  public void setWeiDu(Integer weiDu)
  {
    this.weiDu = weiDu;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public Integer getStatus()
  {
    return this.status;
  }
  
  public void setStatus(Integer status)
  {
    this.status = status;
  }
  
  public String getCompleteDesc()
  {
    return this.completeDesc;
  }
  
  public void setCompleteDesc(String completeDesc)
  {
    this.completeDesc = completeDesc;
  }
  
  public Date getCompleteTime()
  {
    return this.completeTime;
  }
  
  public void setCompleteTime(Date completeTime)
  {
    this.completeTime = completeTime;
  }
  
  public UserAccountEx getUser()
  {
    return this.user;
  }
  
  public void setUser(UserAccountEx user)
  {
    this.user = user;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
  
  public String getDtimeStr()
  {
    return this.dtimeStr;
  }
  
  public void setDtimeStr(String dtimeStr)
  {
    this.dtimeStr = dtimeStr;
  }
}
