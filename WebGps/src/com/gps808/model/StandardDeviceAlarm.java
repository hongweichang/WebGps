package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardDeviceAlarm
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final int GPS_ALARM_TYPE_USEDEFINE = 1;
  public static final int GPS_ALARM_TYPE_URGENCY_BUTTON = 2;
  public static final int GPS_ALARM_TYPE_SHAKE = 3;
  public static final int GPS_ALARM_TYPE_VIDEO_LOST = 4;
  public static final int GPS_ALARM_TYPE_VIDEO_MASK = 5;
  public static final int GPS_ALARM_TYPE_DOOR_OPEN_LAWLESS = 6;
  public static final int GPS_ALARM_TYPE_WRONG_PWD = 7;
  public static final int GPS_ALARM_TYPE_FIRE_LOWLESS = 8;
  public static final int GPS_ALARM_TYPE_TEMPERATOR = 9;
  public static final int GPS_ALARM_TYPE_DISK_ERROR = 10;
  public static final int GPS_ALARM_TYPE_OVERSPEED = 11;
  public static final int GPS_ALARM_TYPE_BEYOND_BOUNDS = 12;
  public static final int GPS_ALARM_TYPE_DOOR_ABNORMAL = 13;
  public static final int GPS_ALARM_TYPE_PARK_TOO_LONG = 14;
  public static final int GPS_ALARM_INFO_IDLE = 0;
  public static final int GPS_ALARM_INFO_PARK = 1;
  public static final int GPS_ALARM_TYPE_MOTION = 15;
  public static final int GPS_ALARM_TYPE_ACC_ON = 16;
  public static final int GPS_ALARM_TYPE_DEV_ONLINE = 17;
  public static final int GPS_ALARM_TYPE_GPS_SIGNAL_LOSS = 18;
  public static final int GPS_ALARM_TYPE_IO_1 = 19;
  public static final int GPS_ALARM_TYPE_IO_2 = 20;
  public static final int GPS_ALARM_TYPE_IO_3 = 21;
  public static final int GPS_ALARM_TYPE_IO_4 = 22;
  public static final int GPS_ALARM_TYPE_IO_5 = 23;
  public static final int GPS_ALARM_TYPE_IO_6 = 24;
  public static final int GPS_ALARM_TYPE_IO_7 = 25;
  public static final int GPS_ALARM_TYPE_IO_8 = 26;
  public static final int GPS_ALARM_TYPE_IO_9 = 41;
  public static final int GPS_ALARM_TYPE_IO_10 = 42;
  public static final int GPS_ALARM_TYPE_IO_11 = 43;
  public static final int GPS_ALARM_TYPE_IO_12 = 44;
  public static final int GPS_ALARM_TYPE_FATIGUE = 49;
  public static final int GPS_ALARM_TYPE_NIGHT_DRIVING = 151;
  public static final int GPS_ALARM_TYPE_END_DISK_ERROR = 60;
  public static final int GPS_ALARM_TYPE_HDD_HIGH_TEMPERATURE = 157;
  public static final int GPS_ALARM_TYPE_END_HDD_HIGH_TEMPERATURE = 158;
  public static final int GPS_ALARM_TYPE_USEDEFINE_CUSTOM = 113;
  public static final int GPS_ALARM_TYPE_AREA_OVERSPEED = 200;
  public static final int GPS_ALARM_TYPE_WARNING = 201;
  public static final int GPS_ALARM_TYPE_GNSS_MOD_ERR = 202;
  public static final int GPS_ALARM_TYPE_GNSS_WIRE_MISS = 203;
  public static final int GPS_ALARM_TYPE_GNSS_WIRE_SHORTAGE = 204;
  public static final int GPS_ALARM_TYPE_VOLTAGE_LOW = 205;
  public static final int GPS_ALARM_TYPE_POWER_OFF = 206;
  public static final int GPS_ALARM_TYPE_LCD_ERR = 207;
  public static final int GPS_ALARM_TYPE_TTS_MOD_ERR = 208;
  public static final int GPS_ALARM_TYPE_CAMERA__ERR = 209;
  public static final int GPS_ALARM_TYPE_DIRVE_TIMEOUT = 210;
  public static final int GPS_ALARM_TYPE_AREA_INOUT = 211;
  public static final int GPS_ALARM_TYPE_LINE_INOUT = 212;
  public static final int GPS_ALARM_TYPE_LINE_DRIVE_TIME = 213;
  public static final int GPS_ALARM_TYPE_LINE_DEVIATE = 214;
  public static final int GPS_ALARM_TYPE_VSS_ERR = 215;
  public static final int GPS_ALARM_TYPE_OIL_ABNORMAL = 216;
  public static final int GPS_ALARM_TYPE_STOLEN = 217;
  public static final int GPS_ALARM_TYPE_MOVE_LAWLESS = 218;
  public static final int GPS_ALARM_TYPE_COLLISION = 219;
  public static final int GPS_ALARM_TYPE_CMS_AREA_OVERSPEED = 300;
  public static final int GPS_ALARM_TYPE_CMS_AREA_LOWSPEED = 301;
  public static final int GPS_ALARM_TYPE_CMS_AREA_INOUT = 302;
  public static final int GPS_ALARM_TYPE_CMS_LINE_INOUT = 303;
  public static final int GPS_ALARM_TYPE_CMS_OVERSPEED = 304;
  public static final int GPS_ALARM_TYPE_CMS_LOWSPEED = 305;
  public static final int GPS_ALARM_TYPE_CMS_FATIGUE = 306;
  public static final int GPS_ALARM_TYPE_CMS_PARK_TOO_LONG = 307;
  public static final int GPS_ALARM_TYPE_CMS_AREA_POINT = 308;
  public static final int GPS_ALARM_TYPE_CMS_LINE_OVERSPEED = 309;
  public static final int GPS_ALARM_TYPE_CMS_LINE_LOWSPEED = 310;
  public static final int GPS_ALARM_TYPE_CMS_ROAD_LVL_OVERSPEED = 311;
  public static final int GPS_ALARM_TYPE_REFUEL = 46;
  public static final int GPS_ALARM_TYPE_STILL_FUEL = 47;
  public static final int GPS_ALARM_TYPE_DATA = 113;
  public static final int GPS_ALARM_INFO_PRACTICE = 15;
  public static final int GPS_ALARM_INFO_INFORMATION_SERVICES = 16;
  public static final int GPS_ALARM_INFO_ELECTRONIC_WAYBILL = 17;
  public static final int GPS_ALARM_INFO_COMPRESSED_DATA = 18;
  public static final int GPS_ALARM_INFO_MULTIMEDIA_EVENT_INFORMATION = 20;
  public static final int GPS_ALARM_TYPE_DRIVER_STATUS_COLLECTION = 116;
  public static final int GPS_ALARM_TYPE_SLIP_STATION = 118;
  public static final int GPS_ALARM_TYPE_TPMS = 168;
  public static final int GPS_ALARM_INFO_BATTERY_VOLTAGE = 1;
  public static final int GPS_ALARM_INFO_TIRE_PRESSURE_ABNORMAL = 2;
  public static final int GPS_ALARM_INFO_TEMPERATURE_ANOMALIES = 3;
  private String guid;
  private Integer vehiId;
  private String vehiIdno;
  private String devIdno;
  private Date armTimeStart;
  private Date armTimeEnd;
  private Integer armType;
  private Integer armInfo;
  private Integer param1;
  private Integer param2;
  private Integer param3;
  private Integer param4;
  private String armDesc;
  private String statusStart;
  private String statusEnd;
  private String imgInfo;
  private Integer handleStatus;
  private String handleInfo;
  private Date createTime;
  private String timeLength;
  private String startPosition;
  private String endPosition;
  private String alarmSource;
  private String handleuser;
  private String handleContent;
  private String handleTime;
  private Integer plateType;
  private String vehiColor;
  private String armTypeStr;
  private Integer startJingDu;
  private Integer startWeiDu;
  private Integer endJingDu;
  private Integer endWeiDu;
  private Integer startSpeed;
  private Integer endSpeed;
  private Integer startStatus1;
  private Integer startStatus2;
  private Integer endStatus1;
  private Integer endStatus2;
  private Integer startLiCheng;
  private Integer endLiCheng;
  private Integer armTimeStartI;
  private Integer armTimeEndI;
  private String armInfoDesc;
  
  public String getArmInfoDesc()
  {
    return this.armInfoDesc;
  }
  
  public void setArmInfoDesc(String armInfoDesc)
  {
    this.armInfoDesc = armInfoDesc;
  }
  
  public Integer getStartJingDu()
  {
    return this.startJingDu;
  }
  
  public void setStartJingDu(Integer startJingDu)
  {
    this.startJingDu = startJingDu;
  }
  
  public Integer getStartWeiDu()
  {
    return this.startWeiDu;
  }
  
  public void setStartWeiDu(Integer startWeiDu)
  {
    this.startWeiDu = startWeiDu;
  }
  
  public Integer getEndJingDu()
  {
    return this.endJingDu;
  }
  
  public void setEndJingDu(Integer endJingDu)
  {
    this.endJingDu = endJingDu;
  }
  
  public Integer getEndWeiDu()
  {
    return this.endWeiDu;
  }
  
  public void setEndWeiDu(Integer endWeiDu)
  {
    this.endWeiDu = endWeiDu;
  }
  
  public String getArmTypeStr()
  {
    return this.armTypeStr;
  }
  
  public void setArmTypeStr(String armTypeStr)
  {
    this.armTypeStr = armTypeStr;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public String getVehiColor()
  {
    return this.vehiColor;
  }
  
  public void setVehiColor(String vehiColor)
  {
    this.vehiColor = vehiColor;
  }
  
  public String getAlarmSource()
  {
    return this.alarmSource;
  }
  
  public void setAlarmSource(String alarmSource)
  {
    this.alarmSource = alarmSource;
  }
  
  public String getHandleuser()
  {
    return this.handleuser;
  }
  
  public void setHandleuser(String handleuser)
  {
    this.handleuser = handleuser;
  }
  
  public String getHandleContent()
  {
    return this.handleContent;
  }
  
  public void setHandleContent(String handleContent)
  {
    this.handleContent = handleContent;
  }
  
  public String getHandleTime()
  {
    return this.handleTime;
  }
  
  public void setHandleTime(String handleTime)
  {
    this.handleTime = handleTime;
  }
  
  public String getStartPosition()
  {
    return this.startPosition;
  }
  
  public void setStartPosition(String startPosition)
  {
    this.startPosition = startPosition;
  }
  
  public String getEndPosition()
  {
    return this.endPosition;
  }
  
  public void setEndPosition(String endPosition)
  {
    this.endPosition = endPosition;
  }
  
  public String getTimeLength()
  {
    return this.timeLength;
  }
  
  public void setTimeLength(String timeLength)
  {
    this.timeLength = timeLength;
  }
  
  public String getGuid()
  {
    return this.guid;
  }
  
  public void setGuid(String guid)
  {
    this.guid = guid;
  }
  
  public Integer getVehiId()
  {
    return this.vehiId;
  }
  
  public void setVehiId(Integer vehiId)
  {
    this.vehiId = vehiId;
  }
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getArmTimeStart()
  {
    return this.armTimeStart;
  }
  
  public void setArmTimeStart(Date armTimeStart)
  {
    this.armTimeStart = armTimeStart;
  }
  
  public Date getArmTimeEnd()
  {
    return this.armTimeEnd;
  }
  
  public void setArmTimeEnd(Date armTimeEnd)
  {
    this.armTimeEnd = armTimeEnd;
  }
  
  public Integer getArmType()
  {
    return this.armType;
  }
  
  public void setArmType(Integer armType)
  {
    this.armType = armType;
  }
  
  public Integer getArmInfo()
  {
    return this.armInfo;
  }
  
  public void setArmInfo(Integer armInfo)
  {
    this.armInfo = armInfo;
  }
  
  public Integer getParam1()
  {
    return this.param1;
  }
  
  public void setParam1(Integer param1)
  {
    this.param1 = param1;
  }
  
  public Integer getParam2()
  {
    return this.param2;
  }
  
  public void setParam2(Integer param2)
  {
    this.param2 = param2;
  }
  
  public Integer getParam3()
  {
    return this.param3;
  }
  
  public void setParam3(Integer param3)
  {
    this.param3 = param3;
  }
  
  public Integer getParam4()
  {
    return this.param4;
  }
  
  public void setParam4(Integer param4)
  {
    this.param4 = param4;
  }
  
  public String getArmDesc()
  {
    return this.armDesc;
  }
  
  public void setArmDesc(String armDesc)
  {
    this.armDesc = armDesc;
  }
  
  public String getStatusStart()
  {
    return this.statusStart;
  }
  
  public void setStatusStart(String statusStart)
  {
    this.statusStart = statusStart;
  }
  
  public String getStatusEnd()
  {
    return this.statusEnd;
  }
  
  public void setStatusEnd(String statusEnd)
  {
    this.statusEnd = statusEnd;
  }
  
  public String getImgInfo()
  {
    return this.imgInfo;
  }
  
  public void setImgInfo(String imgInfo)
  {
    this.imgInfo = imgInfo;
  }
  
  public Integer getHandleStatus()
  {
    return this.handleStatus;
  }
  
  public void setHandleStatus(Integer handleStatus)
  {
    this.handleStatus = handleStatus;
  }
  
  public String getHandleInfo()
  {
    return this.handleInfo;
  }
  
  public void setHandleInfo(String handleInfo)
  {
    this.handleInfo = handleInfo;
  }
  
  public Date getCreateTime()
  {
    return this.createTime;
  }
  
  public void setCreateTime(Date createTime)
  {
    this.createTime = createTime;
  }
  
  public Integer getStartSpeed()
  {
    return this.startSpeed;
  }
  
  public void setStartSpeed(Integer startSpeed)
  {
    this.startSpeed = startSpeed;
  }
  
  public Integer getEndSpeed()
  {
    return this.endSpeed;
  }
  
  public void setEndSpeed(Integer endSpeed)
  {
    this.endSpeed = endSpeed;
  }
  
  public Integer getStartStatus1()
  {
    return this.startStatus1;
  }
  
  public void setStartStatus1(Integer startStatus1)
  {
    this.startStatus1 = startStatus1;
  }
  
  public Integer getStartStatus2()
  {
    return this.startStatus2;
  }
  
  public void setStartStatus2(Integer startStatus2)
  {
    this.startStatus2 = startStatus2;
  }
  
  public Integer getEndStatus1()
  {
    return this.endStatus1;
  }
  
  public void setEndStatus1(Integer endStatus1)
  {
    this.endStatus1 = endStatus1;
  }
  
  public Integer getEndStatus2()
  {
    return this.endStatus2;
  }
  
  public void setEndStatus2(Integer endStatus2)
  {
    this.endStatus2 = endStatus2;
  }
  
  public Integer getStartLiCheng()
  {
    return this.startLiCheng;
  }
  
  public void setStartLiCheng(Integer startLiCheng)
  {
    this.startLiCheng = startLiCheng;
  }
  
  public Integer getEndLiCheng()
  {
    return this.endLiCheng;
  }
  
  public void setEndLiCheng(Integer endLiCheng)
  {
    this.endLiCheng = endLiCheng;
  }
  
  public Integer getArmTimeStartI()
  {
    return this.armTimeStartI;
  }
  
  public void setArmTimeStartI(Integer armTimeStartI)
  {
    this.armTimeStartI = armTimeStartI;
  }
  
  public Integer getArmTimeEndI()
  {
    return this.armTimeEndI;
  }
  
  public void setArmTimeEndI(Integer armTimeEndI)
  {
    this.armTimeEndI = armTimeEndI;
  }
}
