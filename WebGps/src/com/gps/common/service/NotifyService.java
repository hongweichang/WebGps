package com.gps.common.service;

import com.framework.logger.Logger;
import com.gps.common.vo.CmsPacket;
import com.gps.common.vo.NotifyPacket;
import com.gps.model.ServerInfo;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;

public class NotifyService
  extends Thread
{
  public static final int NOTIFY_TYPE_ADD = 1;
  public static final int NOTIFY_TYPE_EDIT = 2;
  public static final int NOTIFY_TYPE_DEL = 3;
  public static final short NOTIFY_MSG_SERVER_CHANGE_REQ = 1;
  public static final short NOTIFY_MSG_CLIENT_CHANGE_REQ = 3;
  public static final short NOTIFY_MSG_CLI_DEVICE_CHANGE_REQ = 5;
  public static final short NOTIFY_MSG_DEVICE_INFO_CHANGE_REQ = 7;
  public static final short NOTIFY_MSG_CLI_ROLE_CHANGE_REQ = 9;
  public static final short NOTIFY_MSG_DOWN_STATION_CHANGE_REQ = 11;
  public static final short NOTIFY_MSG_DOWN_PLAN_CHANGE_REQ = 13;
  public static final short NOTIFY_MSG_MAP_FENCE_CHANGE_REQ = 17;
  public static final short NOTIFY_MSG_SNAPSHOT_PLAN_CHANGE_REQ = 21;
  public static final short NOTIFY_MSG_RECORD_PLAN_CHANGE_REQ = 23;
  public static final short NOTIFY_MSG_STORAGE_RELATION_CHANGE_REQ = 25;
  public static final short NOTIFY_MSG_ALARM_ACTION_CHANGE_REQ = 27;
  public static final short NOTIFY_MSG_TERMINAL_DEVICE_CHANGE_REQ = 49;
  public static final byte MSG_TYPE_NOTIFY = 67;
  public static final byte NOTIFY_MSG_808_INFO_CHANGE_REQ = 29;
  public static final int NOTIFY_MSG_RECORD_COMPANY_CHANGE_REQ = 1;
  public static final int NOTIFY_MSG_RECORD_ROLE_CHANGE_REQ = 2;
  public static final int NOTIFY_MSG_RECORD_USER_CHANGE_REQ = 3;
  public static final int NOTIFY_MSG_RECORD_PERMIT_CHANGE_REQ = 4;
  public static final int NOTIFY_MSG_RECORD_SIMCARD_CHANGE_REQ = 5;
  public static final int NOTIFY_MSG_RECORD_DEVICE_CHANGE_REQ = 6;
  public static final int NOTIFY_MSG_RECORD_VEHICLE_CHANGE_REQ = 7;
  public static final int NOTIFY_MSG_RECORD_DRIVER_CHANGE_REQ = 8;
  public static final int NOTIFY_MSG_RECORD_VEHITEAM_CHANGE_REQ = 9;
  public static final int NOTIFY_MSG_RECORD_VEHICHANGETEAM_CHANGE_REQ = 10;
  public static final int NOTIFY_MSG_RECORD_VEHIRELATION_CHANGE_REQ = 11;
  public static final int NOTIFY_MSG_RECORD_CHANGE_TYPE_RULE = 12;
  public static final int NOTIFY_MSG_RECORD_CHANGE_TYPE_VEHI_RULE = 13;
  public static final int NOTIFY_MSG_RECORD_STORAGE_RELATION_CHANGE_REQ = 14;
  public static final int NOTIFY_MSG_RECORD_SERVER_CHANGE_REQ = 15;
  public static final int NOTIFY_MSG_RECORD_DOWN_STATION_CHANGE_REQ = 16;
  public static final int NOTIFY_MSG_RECORD_DEVICE_OFLTASK_CHANGE_REQ = 17;
  public static final int NOTIFY_MSG_RECORD_DEVICE_YOULIANG_CHANGE_REQ = 18;
  public static final int NOTIFY_MSG_RECORD_LINE_CHANGE_REQ = 19;
  public static boolean isRunning = false;
  private ServerService serverService;
  private Object syncUserServer = new Object();
  private ServerInfo userServerInfo;
  private Object syncLoginSvr = new Object();
  private InetSocketAddress loginSvrAddress = null;
  private long lastUpdateLoginSvrAddr = System.currentTimeMillis() - 300000L;
  private long lastReadLoginSvrAddr = System.currentTimeMillis() - 60000L;
  private byte[] recvbuffer = new byte['?'];
  private Object syncSequence = new Object();
  private int sequence = 0;
  private Object syncSendPacket = new Object();
  private Map<Integer, NotifyPacket> lstSendPacket = new Hashtable();
  private long lastManageSendPacket = System.currentTimeMillis();
  private DatagramSocket socket = null;
  private final transient Logger log = Logger.getLogger(NotifyService.class);
  
  public NotifyService()
    throws Exception
  {
    String basePath = NotifyService.class.getClassLoader().getResource("").getFile().replaceAll("%20", " ").substring(1);
    String propFile = "config/1010gps.properties";
    InputStream file = new FileInputStream(basePath + propFile);
    if (file != null)
    {
      Properties properties = new Properties();
      properties.load(file);
      String language = properties.getProperty("local-language");
      String country = properties.getProperty("local-country");
      if ((language != null) && (!language.isEmpty()) && (country != null) && (!country.isEmpty()))
      {
        Locale currentLocale = new Locale(language, country);
        Locale.setDefault(currentLocale);
      }
    }
    if (!isRunning)
    {
      isRunning = true;
      this.socket = new DatagramSocket();
      this.socket.setSoTimeout(400);
      start();
    }
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public void setLoginSvrAddress(InetSocketAddress loginSvrAddress)
  {
    this.loginSvrAddress = loginSvrAddress;
  }
  
  public InetSocketAddress getLoginSvrAddress()
  {
    return this.loginSvrAddress;
  }
  
  public void run()
  {
    for (;;)
    {
      updateLoginSvrAddress();
      
      recvFromLoginSvr();
      
      manageSendPacket();
    }
  }
  
  protected Boolean isTimeout(long lastTime, long timeout)
  {
    long curTime = System.currentTimeMillis();
    if (curTime >= lastTime)
    {
      long interval = curTime - lastTime;
      return Boolean.valueOf(interval >= timeout);
    }
    return Boolean.valueOf(true);
  }
  
  protected void updateLoginSvrAddress()
  {
    if (((this.loginSvrAddress == null) || 
      (isTimeout(this.lastUpdateLoginSvrAddr, 300000L).booleanValue())) && 
      (this.serverService != null) && 
      (isTimeout(this.lastReadLoginSvrAddr, 60000L).booleanValue()))
    {
      this.lastReadLoginSvrAddr = System.currentTimeMillis();
      ServerInfo loginsvr = null;
      try
      {
        Object object = this.serverService.get("1");
        if (object != null) {
          loginsvr = (ServerInfo)object;
        }
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
      if (loginsvr != null) {
        updateLoginSvrAddress(loginsvr);
      } else {
        try
        {
          Thread.sleep(1000L);
        }
        catch (InterruptedException e)
        {
          e.printStackTrace();
        }
      }
      synchronized (this.syncUserServer)
      {
        try
        {
          this.userServerInfo = this.serverService.getOnlineServer(4);
        }
        catch (Exception e)
        {
          e.printStackTrace();
        }
      }
    }
  }
  
  public void updateLoginSvrAddress(ServerInfo loginsvr)
  {
    synchronized (this.syncLoginSvr)
    {
      this.loginSvrAddress = new InetSocketAddress(loginsvr.getLanip(), 
        loginsvr.getClientPort().intValue());
    }
    this.lastUpdateLoginSvrAddr = System.currentTimeMillis();
  }
  
  protected void recvFromLoginSvr()
  {
    DatagramPacket packet = new DatagramPacket(this.recvbuffer, this.recvbuffer.length);
    try
    {
      this.socket.receive(packet);
      
      CmsPacket cmsPacket = new CmsPacket(packet.getData(), packet.getLength());
      if (cmsPacket.isRight()) {
        synchronized (this.syncSendPacket)
        {
          this.lstSendPacket.remove(Integer.valueOf(cmsPacket.getSequence()));
        }
      }
    }
    catch (SocketTimeoutException localSocketTimeoutException) {}catch (IOException localIOException) {}
  }
  
  protected void manageSendPacket()
  {
    if (isTimeout(this.lastManageSendPacket, 10000L).booleanValue()) {
      synchronized (this.syncSendPacket)
      {
        Iterator<Map.Entry<Integer, NotifyPacket>> iter = this.lstSendPacket.entrySet().iterator();
        while (iter.hasNext())
        {
          Map.Entry<Integer, NotifyPacket> entry = (Map.Entry)iter.next();
          
          NotifyPacket packet = (NotifyPacket)entry.getValue();
          if (isTimeout(packet.getLastSendTime(), 20000L).booleanValue()) {
            if (!resendNotifyPacket(packet).booleanValue()) {
              iter.remove();
            }
          }
        }
      }
    }
  }
  
  protected Boolean resendNotifyPacket(NotifyPacket packet)
  {
    if (packet.getSendCount() >= 3L) {
      return Boolean.valueOf(false);
    }
    DatagramPacket dp = null;
    boolean send = false;
    synchronized (this.syncLoginSvr)
    {
      if (this.loginSvrAddress != null)
      {
        dp = new DatagramPacket(packet.getData(), packet.getLength(), 
          this.loginSvrAddress.getAddress(), this.loginSvrAddress.getPort());
        send = true;
      }
    }
    if (send) {
      try
      {
        this.socket.send(dp);
      }
      catch (IOException io)
      {
        System.out.print(io.getMessage());
      }
    }
    packet.addSendCount();
    StringBuffer buff = new StringBuffer();
    buff.append("/***********************��������**********************//r/n");
    buff.append("��������====" + packet.getData() + "/r/n");
    buff.append("��������====" + packet.getData().toString() + "/r/n");
    buff.append("��������====" + packet.getSendCount() + "/r/n");
    buff.append("/***********************��������**********************/");
    this.log.error(buff.toString());
    return Boolean.valueOf(true);
  }
  
  protected int getSequence()
  {
    int sequence = 0;
    synchronized (this.syncSequence)
    {
      sequence = this.sequence++;
      if (this.sequence > 65535) {
        this.sequence = 0;
      }
    }
    return sequence;
  }
  
  protected void sendCmsPacket(CmsPacket cmsPacket)
  {
    NotifyPacket packet = new NotifyPacket(cmsPacket);
    packet.setCmsPacket(cmsPacket);
    synchronized (this.syncSendPacket)
    {
      this.lstSendPacket.put(Integer.valueOf(packet.getSequence()), packet);
    }
    resendNotifyPacket(packet);
  }
  
  public void sendServerChange(int notifyType, int serverType, String idno)
  {
    byte[] serverChange = new byte[40];
    int index = 0;
    serverChange[(index++)] = ((byte)(notifyType & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    
    serverChange[(index++)] = ((byte)(serverType & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    System.arraycopy(idno.getBytes(), 0, serverChange, index, idno.getBytes().length);
    
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)1, 
      getSequence(), serverChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendDownStationChange(int notifyType, int stationId)
  {
    byte[] stationChange = new byte[8];
    int index = 0;
    stationChange[(index++)] = ((byte)(notifyType & 0xFF));
    stationChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    stationChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    stationChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    
    stationChange[(index++)] = ((byte)(stationId & 0xFF));
    stationChange[(index++)] = ((byte)(stationId >> 8 & 0xFF));
    stationChange[(index++)] = ((byte)(stationId >> 8 & 0xFF));
    stationChange[(index++)] = ((byte)(stationId >> 8 & 0xFF));
    
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)11, 
      getSequence(), stationChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendClientNotify(short msgType, int notifyType, int clientId)
  {
    byte[] clientChange = new byte[48];
    int index = 0;
    clientChange[(index++)] = ((byte)(notifyType & 0xFF));
    clientChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    clientChange[(index++)] = ((byte)(notifyType >> 16 & 0xFF));
    clientChange[(index++)] = ((byte)(notifyType >> 24 & 0xFF));
    
    clientChange[(index++)] = ((byte)(clientId & 0xFF));
    clientChange[(index++)] = ((byte)(clientId >> 8 & 0xFF));
    clientChange[(index++)] = ((byte)(clientId >> 16 & 0xFF));
    clientChange[(index++)] = ((byte)(clientId >> 24 & 0xFF));
    
    CmsPacket cmsPacket = new CmsPacket((byte)67, msgType, 
      getSequence(), clientChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendClientChange(int notifyType, int clientId)
  {
    sendClientNotify((short)3, notifyType, clientId);
  }
  
  public void sendCliDeviceChange(int notifyType, int clientId)
  {
    System.out.print("NotifyService sendCliDeviceChange \n");
    sendClientNotify((short)5, notifyType, clientId);
  }
  
  public void sendTerminalDeviceChange(int notifyType, int accountId)
  {
    sendClientNotify((short)49, notifyType, accountId);
  }
  
  public void sendDeviceInfoChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)7, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendRoleChange(int notifyType, int roleId)
  {
    sendClientNotify((short)9, notifyType, roleId);
  }
  
  public void sendDownPlanChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)13, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendMapFenceChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)17, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendSnapshotPlanChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)21, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendRecordPlanChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)23, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendStorageRelationChange(int notifyType, int serverType, String idno)
  {
    byte[] serverChange = new byte[40];
    int index = 0;
    serverChange[(index++)] = ((byte)(notifyType & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    
    serverChange[(index++)] = ((byte)(serverType & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    serverChange[(index++)] = ((byte)(serverType >> 8 & 0xFF));
    System.arraycopy(idno.getBytes(), 0, serverChange, index, idno.getBytes().length);
    
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)25, 
      getSequence(), serverChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendAlarmActionChange(int notifyType, String devIDNO)
  {
    byte[] deviceChange = new byte[36];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    System.arraycopy(devIDNO.getBytes(), 0, deviceChange, index, devIDNO.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)27, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public void sendStandardInfoChange(int notifyType, int infoType, int param, String szParam)
  {
    if (szParam == null) {
      szParam = "";
    }
    byte[] deviceChange = new byte[52];
    int index = 0;
    deviceChange[(index++)] = ((byte)(notifyType & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(notifyType >> 8 & 0xFF));
    
    deviceChange[(index++)] = ((byte)(infoType & 0xFF));
    deviceChange[(index++)] = ((byte)(infoType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(infoType >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(infoType >> 8 & 0xFF));
    
    deviceChange[(index++)] = ((byte)(param & 0xFF));
    deviceChange[(index++)] = ((byte)(param >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(param >> 8 & 0xFF));
    deviceChange[(index++)] = ((byte)(param >> 8 & 0xFF));
    System.arraycopy(szParam.getBytes(), 0, deviceChange, index, szParam.getBytes().length);
    CmsPacket cmsPacket = new CmsPacket((byte)67, (short)29, 
      getSequence(), deviceChange);
    sendCmsPacket(cmsPacket);
  }
  
  public String getUserServerLanAddr()
  {
    synchronized (this.syncUserServer)
    {
      if (this.userServerInfo != null) {
        return this.userServerInfo.getLanip();
      }
      return "127.0.0.1";
    }
  }
  
  public Integer getUserServerPort()
  {
    synchronized (this.syncUserServer)
    {
      if (this.userServerInfo != null) {
        return this.userServerInfo.getClientPort();
      }
      return Integer.valueOf(6603);
    }
  }
}
