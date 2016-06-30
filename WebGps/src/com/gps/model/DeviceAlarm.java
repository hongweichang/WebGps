package com.gps.model;

import java.io.Serializable;
import java.util.Date;

public class DeviceAlarm
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
  public static final int GPS_ALARM_TYPE_IN_FENCE = 27;
  public static final int GPS_ALARM_TYPE_OUT_FENCE = 28;
  public static final int GPS_ALARM_TYPE_IN_FENCE_OVER_SPEED = 29;
  public static final int GPS_ALARM_TYPE_OUT_FENCE_OVER_SPEED = 30;
  public static final int GPS_ALARM_TYPE_IN_FENCE_LOW_SPEED = 31;
  public static final int GPS_ALARM_TYPE_OUT_FENCE_LOW_SPEED = 32;
  public static final int GPS_ALARM_TYPE_IN_FENCE_STOP = 33;
  public static final int GPS_ALARM_TYPE_OUT_FENCE_STOP = 34;
  public static final int GPS_ALARM_TYPE_FIRE = 35;
  public static final int GPS_ALARM_TYPE_PANIC = 36;
  public static final int GPS_ALARM_TYPE_TASK_FINISHED = 37;
  public static final int GPS_ALARM_TYPE_IMAGE_UPLOAD = 38;
  public static final int GPS_ALARM_TYPE_DISK1_NO_EXIST = 39;
  public static final int GPS_ALARM_TYPE_DISK2_NO_EXIST = 40;
  public static final int GPS_ALARM_TYPE_IO_9 = 41;
  public static final int GPS_ALARM_TYPE_IO_10 = 42;
  public static final int GPS_ALARM_TYPE_IO_11 = 43;
  public static final int GPS_ALARM_TYPE_IO_12 = 44;
  public static final int GPS_ALARM_TYPE_REFUEL = 46;
  public static final int GPS_ALARM_TYPE_STILL_FUEL = 47;
  public static final int GPS_ALARM_TYPE_URGENCY_BUTTON_5 = 48;
  public static final int GPS_ALARM_TYPE_FATIGUE = 49;
  public static final int GPS_ALARM_TYPE_END_USEDEFINE = 51;
  public static final int GPS_ALARM_TYPE_END_URGENCY_BUTTON = 52;
  public static final int GPS_ALARM_TYPE_END_SHAKE = 53;
  public static final int GPS_ALARM_TYPE_END_VIDEO_LOST = 54;
  public static final int GPS_ALARM_TYPE_END_VIDEO_MASK = 55;
  public static final int GPS_ALARM_TYPE_END_DOOR_OPEN_LAWLESS = 56;
  public static final int GPS_ALARM_TYPE_END_WRONG_PWD = 57;
  public static final int GPS_ALARM_TYPE_END_FIRE_LOWLESS = 58;
  public static final int GPS_ALARM_TYPE_END_TEMPERATOR = 59;
  public static final int GPS_ALARM_TYPE_END_DISK_ERROR = 60;
  public static final int GPS_ALARM_TYPE_END_OVERSPEED = 61;
  public static final int GPS_ALARM_TYPE_END_BEYOND_BOUNDS = 62;
  public static final int GPS_ALARM_TYPE_END_DOOR_ABNORMAL = 63;
  public static final int GPS_ALARM_TYPE_END_PARK_TOO_LONG = 64;
  public static final int GPS_ALARM_TYPE_END_MOTION = 65;
  public static final int GPS_ALARM_TYPE_ACC_OFF = 66;
  public static final int GPS_ALARM_TYPE_DEV_DISONLINE = 67;
  public static final int GPS_ALARM_TYPE_END_GPS_SIGNAL_LOSS = 68;
  public static final int GPS_ALARM_TYPE_END_IO_1 = 69;
  public static final int GPS_ALARM_TYPE_END_IO_2 = 70;
  public static final int GPS_ALARM_TYPE_END_IO_3 = 71;
  public static final int GPS_ALARM_TYPE_END_IO_4 = 72;
  public static final int GPS_ALARM_TYPE_END_IO_5 = 73;
  public static final int GPS_ALARM_TYPE_END_IO_6 = 74;
  public static final int GPS_ALARM_TYPE_END_IO_7 = 75;
  public static final int GPS_ALARM_TYPE_END_IO_8 = 76;
  public static final int GPS_ALARM_TYPE_END_IN_FENCE = 77;
  public static final int GPS_ALARM_TYPE_END_OUT_FENCE = 78;
  public static final int GPS_ALARM_TYPE_END_IN_FENCE_LOW_SPEED = 81;
  public static final int GPS_ALARM_TYPE_END_OUT_FENCE_LOW_SPEED = 82;
  public static final int GPS_ALARM_TYPE_END_IN_FENCE_OVER_SPEED = 79;
  public static final int GPS_ALARM_TYPE_END_OUT_FENCE_OVER_SPEED = 80;
  public static final int GPS_ALARM_TYPE_END_IN_FENCE_STOP = 83;
  public static final int GPS_ALARM_TYPE_END_OUT_FENCE_STOP = 84;
  public static final int GPS_ALARM_TYPE_END_IO_9 = 91;
  public static final int GPS_ALARM_TYPE_END_IO_10 = 92;
  public static final int GPS_ALARM_TYPE_END_IO_11 = 93;
  public static final int GPS_ALARM_TYPE_END_IO_12 = 94;
  public static final int GPS_ALARM_TYPE_END_FATIGUE = 99;
  public static final int GPS_EVENT_TYPE_PARK = 101;
  public static final int GPS_EVENT_TYPE_PARK_ACCON = 102;
  public static final int GPS_EVENT_TYPE_NET_FLOW = 103;
  public static final int GPS_EVENT_TYPE_OVERSPEED = 106;
  public static final int GPS_EVENT_TYPE_FENCE_ACCESS = 107;
  public static final int GPS_EVENT_TYPE_FENCE_PARK = 108;
  public static final int GPS_ALARM_TYPE_NIGHT_DRIVING = 151;
  public static final int GPS_ALARM_TYPE_END_NIGHT_DRIVING = 152;
  public static final int GPS_ALARM_TYPE_PASSENGER_TICKET = 113;
  public static final int GPS_ALARM_TYPE_UPS_CUT = 155;
  public static final int GPS_ALARM_TYPE_END_UPS_CUT = 156;
  public static final int GPS_ALARM_TYPE_HDD_HIGH_TEMPERATURE = 157;
  public static final int GPS_ALARM_TYPE_END_HDD_HIGH_TEMPERATURE = 158;
  public static final int GPS_ALARM_TYPE_BEFORE_BOARD_OPENED = 159;
  public static final int GPS_ALARM_TYPE_END_BEFORE_BOARD_OPENED = 160;
  public static final int GPS_ALARM_TYPE_TURN_OFF = 161;
  public static final int GPS_ALARM_TYPE_SIM_LOST = 166;
  public static final int GPS_ALARM_TYPE_END_SIM_LOST = 167;
  private String guid;
  private String devIdno;
  private Date armTime;
  private Integer armType;
  private Integer armInfo;
  private Integer Param1;
  private Integer Param2;
  private Integer Param3;
  private Integer Param4;
  private Integer status1;
  private Integer status2;
  private Integer status3;
  private Integer status4;
  private Integer speed;
  private Integer jingDu;
  private Integer weiDu;
  private Integer gaoDu;
  private Integer huangXiang;
  private Integer liCheng;
  private Integer youLiang;
  private Integer parkTime;
  private Integer tempSensor1;
  private Integer tempSensor2;
  private Integer tempSensor3;
  private Integer tempSensor4;
  private Date gpsTime;
  private String armDesc;
  private String imageUrl;
  private Integer handleUserID;
  private Date handleTime;
  private String handleWay;
  private Date createTime;
  private String position;
  private String position2;
  private String armTimeStr;
  private String gpsTimeStr;
  
  public String getGpsTimeStr()
  {
    return this.gpsTimeStr;
  }
  
  public void setGpsTimeStr(String gpsTimeStr)
  {
    this.gpsTimeStr = gpsTimeStr;
  }
  
  public String getArmTimeStr()
  {
    return this.armTimeStr;
  }
  
  public void setArmTimeStr(String armTimeStr)
  {
    this.armTimeStr = armTimeStr;
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
  
  public Date getArmTime()
  {
    return this.armTime;
  }
  
  public void setArmTime(Date armTime)
  {
    this.armTime = armTime;
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
    return this.Param1;
  }
  
  public void setParam1(Integer param1)
  {
    this.Param1 = param1;
  }
  
  public Integer getParam2()
  {
    return this.Param2;
  }
  
  public void setParam2(Integer param2)
  {
    this.Param2 = param2;
  }
  
  public Integer getParam3()
  {
    return this.Param3;
  }
  
  public void setParam3(Integer param3)
  {
    this.Param3 = param3;
  }
  
  public Integer getParam4()
  {
    return this.Param4;
  }
  
  public void setParam4(Integer param4)
  {
    this.Param4 = param4;
  }
  
  public Integer getStatus1()
  {
    return this.status1;
  }
  
  public void setStatus1(Integer status1)
  {
    this.status1 = status1;
  }
  
  public Integer getStatus2()
  {
    return this.status2;
  }
  
  public void setStatus2(Integer status2)
  {
    this.status2 = status2;
  }
  
  public Integer getStatus3()
  {
    return this.status3;
  }
  
  public void setStatus3(Integer status3)
  {
    this.status3 = status3;
  }
  
  public Integer getStatus4()
  {
    return this.status4;
  }
  
  public void setStatus4(Integer status4)
  {
    this.status4 = status4;
  }
  
  public Integer getSpeed()
  {
    return this.speed;
  }
  
  public void setSpeed(Integer speed)
  {
    this.speed = speed;
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
  
  public Integer getGaoDu()
  {
    return this.gaoDu;
  }
  
  public void setGaoDu(Integer gaoDu)
  {
    this.gaoDu = gaoDu;
  }
  
  public Integer getHuangXiang()
  {
    return this.huangXiang;
  }
  
  public void setHuangXiang(Integer huangXiang)
  {
    this.huangXiang = huangXiang;
  }
  
  public Integer getLiCheng()
  {
    return this.liCheng;
  }
  
  public void setLiCheng(Integer liCheng)
  {
    this.liCheng = liCheng;
  }
  
  public Integer getYouLiang()
  {
    return this.youLiang;
  }
  
  public void setYouLiang(Integer youLiang)
  {
    this.youLiang = youLiang;
  }
  
  public Integer getParkTime()
  {
    return this.parkTime;
  }
  
  public void setParkTime(Integer parkTime)
  {
    this.parkTime = parkTime;
  }
  
  public Integer getTempSensor1()
  {
    return this.tempSensor1;
  }
  
  public void setTempSensor1(Integer tempSensor1)
  {
    this.tempSensor1 = tempSensor1;
  }
  
  public Integer getTempSensor2()
  {
    return this.tempSensor2;
  }
  
  public void setTempSensor2(Integer tempSensor2)
  {
    this.tempSensor2 = tempSensor2;
  }
  
  public Integer getTempSensor3()
  {
    return this.tempSensor3;
  }
  
  public void setTempSensor3(Integer tempSensor3)
  {
    this.tempSensor3 = tempSensor3;
  }
  
  public Integer getTempSensor4()
  {
    return this.tempSensor4;
  }
  
  public void setTempSensor4(Integer tempSensor4)
  {
    this.tempSensor4 = tempSensor4;
  }
  
  public Date getGpsTime()
  {
    return this.gpsTime;
  }
  
  public void setGpsTime(Date gpsTime)
  {
    this.gpsTime = gpsTime;
  }
  
  public Integer getHandleUserID()
  {
    return this.handleUserID;
  }
  
  public void setHandleUserID(Integer handleUserID)
  {
    this.handleUserID = handleUserID;
  }
  
  public Date getHandleTime()
  {
    return this.handleTime;
  }
  
  public void setHandleTime(Date handleTime)
  {
    this.handleTime = handleTime;
  }
  
  public String getHandleWay()
  {
    return this.handleWay;
  }
  
  public void setHandleWay(String handleWay)
  {
    this.handleWay = handleWay;
  }
  
  public String getArmDesc()
  {
    return this.armDesc;
  }
  
  public void setArmDesc(String armDesc)
  {
    this.armDesc = armDesc;
  }
  
  public String getImageUrl()
  {
    return this.imageUrl;
  }
  
  public void setImageUrl(String imageUrl)
  {
    this.imageUrl = imageUrl;
  }
  
  public Date getCreateTime()
  {
    return this.createTime;
  }
  
  public void setCreateTime(Date createTime)
  {
    this.createTime = createTime;
  }
  
  public String getPosition()
  {
    return this.position;
  }
  
  public void setPosition(String position)
  {
    this.position = position;
  }
  
  public String getPosition2()
  {
    return this.position2;
  }
  
  public void setPosition2(String position2)
  {
    this.position2 = position2;
  }
}
