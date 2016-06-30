package com.gps808.operationManagement.vo;

import com.gps.model.ServerInfo;
import java.io.Serializable;

public class ResultServer
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final String LOGIN_SERVER_IDNO = "1";
  private Integer svrid;
  private String idno;
  private Integer area;
  private Integer type;
  private String lanip;
  private String deviceIp;
  private Integer devicePort;
  private String clientIp;
  private Integer clientPort;
  private String deviceIp2;
  private String clientIp2;
  private Integer offlineTimeout;
  private String clientOtherPort;
  
  public Integer getSvrid()
  {
    return this.svrid;
  }
  
  public void setSvrid(Integer svrid)
  {
    this.svrid = svrid;
  }
  
  public String getIdno()
  {
    return this.idno;
  }
  
  public void setIdno(String idno)
  {
    this.idno = idno;
  }
  
  public Integer getArea()
  {
    return this.area;
  }
  
  public void setArea(Integer area)
  {
    this.area = area;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public String getLanip()
  {
    return this.lanip;
  }
  
  public void setLanip(String lanip)
  {
    this.lanip = lanip;
  }
  
  public String getDeviceIp()
  {
    return this.deviceIp;
  }
  
  public void setDeviceIp(String deviceIp)
  {
    this.deviceIp = deviceIp;
  }
  
  public Integer getDevicePort()
  {
    return this.devicePort;
  }
  
  public void setDevicePort(Integer devicePort)
  {
    this.devicePort = devicePort;
  }
  
  public String getClientIp()
  {
    return this.clientIp;
  }
  
  public void setClientIp(String clientIp)
  {
    this.clientIp = clientIp;
  }
  
  public Integer getClientPort()
  {
    return this.clientPort;
  }
  
  public void setClientPort(Integer clientPort)
  {
    this.clientPort = clientPort;
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
  
  public String getClientOtherPort()
  {
    return this.clientOtherPort;
  }
  
  public void setClientOtherPort(String clientOtherPort)
  {
    this.clientOtherPort = clientOtherPort;
  }
  
  public void setServerInfoEx(ServerInfo server)
  {
    this.clientIp = server.getClientIp();
    this.clientIp2 = server.getClientIp2();
    this.clientPort = server.getClientPort();
    this.clientOtherPort = server.getClientPortOther();
    this.deviceIp = server.getDeviceIp();
    this.deviceIp2 = server.getDeviceIp2();
    this.devicePort = server.getDevicePort();
    this.lanip = server.getLanip();
    this.svrid = server.getId();
  }
}
