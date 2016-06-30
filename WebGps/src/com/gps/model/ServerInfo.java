package com.gps.model;

import java.io.Serializable;

public class ServerInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final int SERVER_TYPE_ALL = -1;
  public static final int SERVER_TYPE_LOGIN = 1;
  public static final int SERVER_TYPE_GATEWAY = 2;
  public static final int SERVER_TYPE_MEDIA = 3;
  public static final int SERVER_TYPE_USER = 4;
  public static final int SERVER_TYPE_STORAGE = 5;
  public static final int SERVER_TYPE_WEB = 6;
  public static final int SERVER_TYPE_DOWN = 7;
  public static final String LOGIN_SERVER_IDNO = "1";
  private Integer id;
  private String name;
  private String idno;
  private Integer area;
  private Integer type;
  private String lanip;
  private String deviceIp;
  private Integer devicePort;
  private String clientIp;
  private Integer clientPort;
  private ServerSession svrSession;
  private String deviceIp2;
  private String clientIp2;
  private Integer offlineTimeout;
  private String clientPortOther;
  
  public ServerInfo() {}
  
  public ServerInfo(Integer id, String name, String idno, Integer area, Integer type, String lanip, String deviceIp, Integer devicePort, String clientIp, Integer clientPort, ServerSession svrSession)
  {
    this.id = id;
    this.name = name;
    this.idno = idno;
    this.area = area;
    this.type = type;
    this.lanip = lanip;
    this.deviceIp = deviceIp;
    this.devicePort = devicePort;
    this.clientIp = clientIp;
    this.clientPort = clientPort;
    this.svrSession = svrSession;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setIdno(String idno)
  {
    this.idno = idno;
  }
  
  public String getIdno()
  {
    return this.idno;
  }
  
  public void setArea(Integer area)
  {
    this.area = area;
  }
  
  public Integer getArea()
  {
    return this.area;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setLanip(String lanip)
  {
    this.lanip = lanip;
  }
  
  public String getLanip()
  {
    return this.lanip;
  }
  
  public void setDeviceIp(String deviceIp)
  {
    this.deviceIp = deviceIp;
  }
  
  public String getDeviceIp()
  {
    return this.deviceIp;
  }
  
  public void setDevicePort(Integer devicePort)
  {
    this.devicePort = devicePort;
  }
  
  public Integer getDevicePort()
  {
    return this.devicePort;
  }
  
  public void setClientIp(String clientIp)
  {
    this.clientIp = clientIp;
  }
  
  public String getClientIp()
  {
    return this.clientIp;
  }
  
  public void setClientPort(Integer clientPort)
  {
    this.clientPort = clientPort;
  }
  
  public Integer getClientPort()
  {
    return this.clientPort;
  }
  
  public void setSvrSession(ServerSession svrSession)
  {
    this.svrSession = svrSession;
  }
  
  public ServerSession getSvrSession()
  {
    return this.svrSession;
  }
  
  public String getDeviceIp2()
  {
    return this.deviceIp2;
  }
  
  public void setDeviceIp2(String deviceIp2)
  {
    this.deviceIp2 = deviceIp2;
  }
  
  public String getClientIp2()
  {
    return this.clientIp2;
  }
  
  public void setClientIp2(String clientIp2)
  {
    this.clientIp2 = clientIp2;
  }
  
  public Integer getOfflineTimeout()
  {
    return this.offlineTimeout;
  }
  
  public void setOfflineTimeout(Integer offlineTimeout)
  {
    this.offlineTimeout = offlineTimeout;
  }
  
  public String getClientPortOther()
  {
    return this.clientPortOther;
  }
  
  public void setClientPortOther(String clientPortOther)
  {
    this.clientPortOther = clientPortOther;
  }
  
  public boolean equals(Object obj)
  {
    if (this == obj) {
      return true;
    }
    if ((obj != null) && 
      (obj.getClass() == ServerInfo.class))
    {
      ServerInfo svr = (ServerInfo)obj;
      return getIdno().equals(svr.getIdno());
    }
    return false;
  }
  
  public int hashCode()
  {
    return getIdno().hashCode();
  }
}
