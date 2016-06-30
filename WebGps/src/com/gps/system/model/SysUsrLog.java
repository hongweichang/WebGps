package com.gps.system.model;

import java.io.Serializable;
import java.util.Date;

public class SysUsrLog
  implements Serializable
{
  public static final int SYS_LOG_MAIN_TYPE_LOGIN = 1;
  public static final int SYS_LOG_MAIN_TYPE_SERVER = 2;
  public static final int SYS_LOG_MAIN_TYPE_DEVICE = 3;
  public static final int SYS_LOG_MAIN_TYPE_CLIENT = 4;
  public static final int SYS_LOG_LOGIN_SUB_TYPE_LOGIN = 1;
  public static final int SYS_LOG_LOGIN_SUB_TYPE_EXIT = 2;
  public static final int SYS_LOG_SERVER_SUB_TYPE_LOGIN = 1;
  public static final int SYS_LOG_SERVER_SUB_TYPE_ADD = 2;
  public static final int SYS_LOG_SERVER_SUB_TYPE_EDIT = 3;
  public static final int SYS_LOG_SERVER_SUB_TYPE_DEL = 4;
  public static final int SYS_LOG_SERVER_SUB_TYPE_SYSDB = 5;
  public static final int SYS_LOG_SERVER_SUB_TYPE_GPSDB = 6;
  public static final int SYS_LOG_SERVER_SUB_TYPE_ADD_DS = 7;
  public static final int SYS_LOG_SERVER_SUB_TYPE_EDIT_DS = 8;
  public static final int SYS_LOG_SERVER_SUB_TYPE_DEL_DS = 9;
  public static final int SYS_LOG_SERVER_SUB_TYPE_ADD_STO_REL = 10;
  public static final int SYS_LOG_SERVER_SUB_TYPE_DEL_STO_REL = 11;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_ADD = 1;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_EDIT = 2;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_DEL = 3;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_BATCH_ADD = 4;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_SALE = 5;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_RESALE = 6;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_BATCH_DEL = 7;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_BATCH_SALE = 8;
  public static final int SYS_LOG_DEVICE_SUB_TYPE_BATCH_RESALE = 9;
  public static final int SYS_LOG_CLIENT_SUB_TYPE_ADD = 1;
  public static final int SYS_LOG_CLIENT_SUB_TYPE_EDIT = 2;
  public static final int SYS_LOG_CLIENT_SUB_TYPE_DEL = 3;
  public static final int SYS_LOG_CLIENT_SUB_TYPE_RESET_PWD = 4;
  private static final long serialVersionUID = 48L;
  private Integer id;
  private Integer usrid;
  private Integer mainType;
  private Integer subType;
  private String param1;
  private String param2;
  private String param3;
  private String param4;
  private Date dtime;
  private SysUsrInfo sysUsr;
  
  public SysUsrLog() {}
  
  public SysUsrLog(Integer id, Integer usrid, Integer mainType, Integer subType, String param1, String param2, String param3, String param4, Date dtime)
  {
    this.id = id;
    this.usrid = usrid;
    this.mainType = mainType;
    this.subType = subType;
    this.param1 = param1;
    this.param2 = param2;
    this.param3 = param3;
    this.param4 = param4;
    this.dtime = dtime;
  }
  
  public SysUsrLog(Integer usrid, Integer mainType, Integer subType, String param1, String param2, String param3, String param4, Date dtime)
  {
    this.usrid = usrid;
    this.mainType = mainType;
    this.subType = subType;
    this.param1 = param1;
    this.param2 = param2;
    this.param3 = param3;
    this.param4 = param4;
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
  
  public void setUsrid(Integer usrid)
  {
    this.usrid = usrid;
  }
  
  public Integer getUsrid()
  {
    return this.usrid;
  }
  
  public void setMainType(Integer mainType)
  {
    this.mainType = mainType;
  }
  
  public Integer getMainType()
  {
    return this.mainType;
  }
  
  public void setSubType(Integer subType)
  {
    this.subType = subType;
  }
  
  public Integer getSubType()
  {
    return this.subType;
  }
  
  public void setParam1(String param1)
  {
    this.param1 = param1;
  }
  
  public String getParam1()
  {
    return this.param1;
  }
  
  public void setParam2(String param2)
  {
    this.param2 = param2;
  }
  
  public String getParam2()
  {
    return this.param2;
  }
  
  public void setParam3(String param3)
  {
    this.param3 = param3;
  }
  
  public String getParam3()
  {
    return this.param3;
  }
  
  public void setParam4(String param4)
  {
    this.param4 = param4;
  }
  
  public String getParam4()
  {
    return this.param4;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
  
  public void setSysUsr(SysUsrInfo sysUsr)
  {
    this.sysUsr = sysUsr;
  }
  
  public SysUsrInfo getSysUsr()
  {
    return this.sysUsr;
  }
}
