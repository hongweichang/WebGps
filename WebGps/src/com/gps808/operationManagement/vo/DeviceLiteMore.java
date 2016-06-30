package com.gps808.operationManagement.vo;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.gps.model.DeviceStatus;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.LocaleProvider;
import com.opensymphony.xwork2.TextProvider;
import com.opensymphony.xwork2.TextProviderFactory;
import com.opensymphony.xwork2.inject.Container;
import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class DeviceLiteMore
  extends DeviceLite
  implements LocaleProvider, Serializable
{
  private static final long serialVersionUID = 1L;
  private transient TextProvider textProvider;
  private Container container;
  private final transient Logger log = Logger.getLogger(DeviceLiteMore.class);
  private String alarmShield;
  
  public Locale getLocale()
  {
    ActionContext ctx = ActionContext.getContext();
    if (ctx != null) {
      return ctx.getLocale();
    }
    if (this.log.isDebugEnabled()) {
      this.log.error("Action context not initialized");
    }
    return null;
  }
  
  private TextProvider getTextProvider()
  {
    if (this.textProvider == null)
    {
      TextProviderFactory tpf = new TextProviderFactory();
      if (this.container != null) {
        this.container.inject(tpf);
      }
      this.textProvider = tpf.createInstance(getClass(), this);
    }
    return this.textProvider;
  }
  
  public String getText(String aTextName)
  {
    return getTextProvider().getText(aTextName);
  }
  
  public String getAlarmShield()
  {
    return this.alarmShield;
  }
  
  public void setAlarmShield(String alarmShield)
  {
    this.alarmShield = alarmShield;
  }
  
  public boolean isGpsValid()
  {
    if ((this != null) && (this.status != null) && (this.status.getStatus1() != null))
    {
      int valid = this.status.getStatus1().intValue() & 0x1;
      if (valid == 1) {
        return true;
      }
    }
    return false;
  }
  
  public boolean isDeviceStop()
  {
    if ((this != null) && (this.status != null) && (this.status.getStatus2() != null))
    {
      int valid = this.status.getStatus2().intValue() >> 18 & 0x1;
      if (valid == 1) {
        return true;
      }
    }
    return false;
  }
  
  public Date getGpsTime()
  {
    if ((this != null) && (this.status != null)) {
      return this.status.getGpsTime();
    }
    return DateUtil.StrLongTime2Date("1990-12-25 12:22:22");
  }
  
  public String getGpsTimeString()
  {
    if ((this != null) && (this.status != null)) {
      return this.status.getGpsTimeStr();
    }
    return "";
  }
  
  public boolean isOnline()
  {
    if ((this != null) && (this.status != null) && (this.status.getOnline() != null) && (this.status.getOnline().intValue() == 1)) {
      return true;
    }
    return false;
  }
  
  protected boolean isAlarmShield(String shield)
  {
    if ((this.alarmShield != null) && (!this.alarmShield.isEmpty()) && (shield != null) && (!shield.isEmpty()))
    {
      this.alarmShield = ("," + this.alarmShield + ",");
      if (this.alarmShield.indexOf("," + shield + ",") >= 0) {
        return true;
      }
      return false;
    }
    return false;
  }
  
  protected String getDiskTypeStr(Integer type)
  {
    switch (type.intValue())
    {
    case 0: 
    case 1: 
      return getText("sdcard");
    case 2: 
      return getText("harddisk");
    case 3: 
      return getText("ssd");
    }
    return getText("sdcard");
  }
  
  protected Map<String, String> gpsGetDiskStatus(int diskStatus, String diskName, boolean isAlarm)
  {
    Map<String, String> ret = new HashMap();
    String info = diskName;
    String isAlarm2 = "0";
    if (diskStatus == 0)
    {
      info = info + getText("monitor.diskNoExist");
      if (isAlarm) {
        isAlarm2 = "1";
      }
    }
    else if (diskStatus == 2)
    {
      info = info + getText("monitor.diskNoElec");
      if (isAlarm) {
        isAlarm2 = "1";
      }
    }
    else
    {
      info = info + getText("terminal.pay.normal");
    }
    ret.put("isAlarm", isAlarm2);
    ret.put("info", info);
    return ret;
  }
  
  public Map<String, String> getDiskStatus()
  {
    Map<String, String> ret = new HashMap();
    String alarm = "";
    String normal = "";
    if ((this != null) && (this.status.getStatus1() != null))
    {
      if (this.status.getDiskType() == null) {
        this.status.setDiskType(Integer.valueOf(0));
      }
      String diskName = getDiskTypeStr(this.status.getDiskType());
      
      int disk1Status = this.status.getStatus1().intValue() >> 8 & 0x3;
      
      boolean diskAlarm = false;
      int disk2Valid = this.status.getStatus1().intValue() >> 28 & 0x1;
      if (disk2Valid > 0)
      {
        int disk2Status = this.status.getStatus1().intValue() >> 29 & 0x3;
        if ((this.status.getDiskType().intValue() == 2) && 
          (disk1Status != 1)) {
          if ((isAlarmShield("39")) && (isAlarmShield("40"))) {
            diskAlarm = false;
          } else {
            diskAlarm = true;
          }
        }
        if ((!diskAlarm) && 
          (disk1Status != 1) && (disk2Status != 1)) {
          if ((isAlarmShield("39")) && (isAlarmShield("40"))) {
            diskAlarm = false;
          } else {
            diskAlarm = true;
          }
        }
        String disk1Name = getText("harddisk") + "1";
        if (this.status.getDiskType().intValue() != 2) {
          disk1Name = diskName + '1';
        }
        Map<String, String> diskInfo = gpsGetDiskStatus(disk1Status, disk1Name, diskAlarm);
        if ((((String)diskInfo.get("isAlarm")).equals("1")) && (!isAlarmShield("39"))) {
          alarm = alarm + (String)diskInfo.get("info");
        } else {
          normal = normal + (String)diskInfo.get("info");
        }
        String disk2Name = getText("harddisk") + "2";
        if (this.status.getDiskType().intValue() == 2) {
          disk2Name = getText("sdcard");
        }
        if (this.status.getDiskType().intValue() != 2) {
          disk2Name = diskName + '2';
        }
        diskInfo = gpsGetDiskStatus(disk2Status, disk2Name, diskAlarm);
        if ((((String)diskInfo.get("isAlarm")).equals("1")) && (!isAlarmShield("40")))
        {
          if (!alarm.isEmpty()) {
            alarm = alarm + ",";
          }
          alarm = alarm + (String)diskInfo.get("info");
        }
        else
        {
          if (!normal.isEmpty()) {
            normal = normal + ",";
          }
          normal = normal + (String)diskInfo.get("info");
        }
      }
      else
      {
        if (isAlarmShield("39")) {
          diskAlarm = false;
        } else {
          diskAlarm = true;
        }
        Map<String, String> diskInfo = gpsGetDiskStatus(disk1Status, diskName, diskAlarm);
        if (((String)diskInfo.get("isAlarm")).equals("1")) {
          alarm = alarm + (String)diskInfo.get("info");
        } else {
          normal = normal + (String)diskInfo.get("info");
        }
      }
    }
    ret.put("alarm", alarm);
    ret.put("normal", normal);
    return ret;
  }
}
