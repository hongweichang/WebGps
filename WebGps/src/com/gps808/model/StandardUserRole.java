package com.gps808.model;

import com.framework.web.action.BaseAction;
import java.util.Date;

public class StandardUserRole
{
  public static final Integer PRIVI_PAGE_MONITORING = Integer.valueOf(1);
  public static final Integer PRIVI_PAGE_REPORT = Integer.valueOf(2);
  public static final Integer PRIVI_REPORT_SPEED_DETAIL = Integer.valueOf(21);
  public static final Integer PRIVI_REPORT_TRACK_DETAIL = Integer.valueOf(22);
  public static final Integer PRIVI_REPORT_SMS_DETAIL = Integer.valueOf(23);
  public static final Integer PRIVI_REPORT_DRIVING_SUMMARY = Integer.valueOf(235);
  public static final Integer PRIVI_REPORT_DRIVING_DETAIL = Integer.valueOf(236);
  public static final Integer PRIVI_REPORT_LOGIN_SUMMARY = Integer.valueOf(24);
  public static final Integer PRIVI_REPORT_LOGIN_DETAIL = Integer.valueOf(25);
  public static final Integer PRIVI_REPORT_DAILYONLINE_DETAIL = Integer.valueOf(26);
  public static final Integer PRIVI_REPORT_MONTHLYONLINE_DETAIL = Integer.valueOf(27);
  public static final Integer PRIVI_REPORT_ONLINE_RATE_DETAIL = Integer.valueOf(28);
  public static final Integer PRIVI_REPORT_ALARM_SUMMARY = Integer.valueOf(29);
  public static final Integer PRIVI_REPORT_ALARM_DETAIL = Integer.valueOf(210);
  public static final Integer PRIVI_REPORT_MALFUNCTION_SUMMARY = Integer.valueOf(229);
  public static final Integer PRIVI_REPORT_MALFUNCTION_DETAIL = Integer.valueOf(230);
  public static final Integer PRIVI_REPORT_VIDEO_SUMMARY = Integer.valueOf(231);
  public static final Integer PRIVI_REPORT_VIDEO_DETAIL = Integer.valueOf(232);
  public static final Integer PRIVI_REPORT_IO_SUMMARY = Integer.valueOf(233);
  public static final Integer PRIVI_REPORT_IO_DETAIL = Integer.valueOf(234);
  public static final Integer PRIVI_REPORT_LICHENG_SUMMARY = Integer.valueOf(211);
  public static final Integer PRIVI_REPORT_LICHENG_DETAIL = Integer.valueOf(212);
  public static final Integer PRIVI_REPORT_PARK_SUMMARY = Integer.valueOf(213);
  public static final Integer PRIVI_REPORT_PARK_DETAIL = Integer.valueOf(214);
  public static final Integer PRIVI_REPORT_ACC_SUMMARY = Integer.valueOf(241);
  public static final Integer PRIVI_REPORT_ACC_DETAIL = Integer.valueOf(242);
  public static final Integer PRIVI_REPORT_FENCE_SUMMARY = Integer.valueOf(215);
  public static final Integer PRIVI_REPORT_FENCE_DETAIL = Integer.valueOf(216);
  public static final Integer PRIVI_REPORT_OIL_SUMMARY = Integer.valueOf(228);
  public static final Integer PRIVI_REPORT_OILTRACK_DETAIL = Integer.valueOf(217);
  public static final Integer PRIVI_REPORT_OILEXCEPTION_DETAIL = Integer.valueOf(218);
  public static final Integer PRIVI_REPORT_ALARM_DISK_ERROR_DETAIL = Integer.valueOf(219);
  public static final Integer PRIVI_REPORT_ALARM_HDD_HIGH_TEMPERATURE = Integer.valueOf(220);
  public static final Integer PRIVI_REPORT_HARDDISK_STATUS_INFORMATION = Integer.valueOf(221);
  public static final Integer PRIVI_REPORT_VERSION_DETAIL = Integer.valueOf(222);
  public static final Integer PRIVI_REPORT_OFFLINE_RECORDING_EQUIPMENT_UPGRADE = Integer.valueOf(223);
  public static final Integer PRIVI_REPORT_VEHICLE_PHOTO = Integer.valueOf(224);
  public static final Integer PRIVI_REPORT_VEHICLE_AUDIO = Integer.valueOf(225);
  public static final Integer PRIVI_REPORT_VEHICLE_VIDEO = Integer.valueOf(226);
  public static final Integer PRIVI_REPORT_DATA = Integer.valueOf(227);
  public static final Integer PRIVI_REPORT_USERONLINE_SUMMARY = Integer.valueOf(237);
  public static final Integer PRIVI_REPORT_USERONLINE_DETAIL = Integer.valueOf(238);
  public static final Integer PRIVI_REPORT_PEOPLE_SUMMARY = Integer.valueOf(239);
  public static final Integer PRIVI_REPORT_PEOPLE_DETAIL = Integer.valueOf(240);
  public static final Integer PRIVI_REPORT_TEMP_SUMMARY = Integer.valueOf(243);
  public static final Integer PRIVI_REPORT_TEMPTRACK_DETAIL = Integer.valueOf(244);
  public static final Integer PRIVI_REPORT_TEMPEXCEPTION_DETAIL = Integer.valueOf(245);
  public static final Integer PRIVI_REPORT_OPENDOOR_SUMMARY = Integer.valueOf(246);
  public static final Integer PRIVI_REPORT_OPENDOOR_DETAIL = Integer.valueOf(247);
  public static final Integer PRIVI_REPORT_SIGNIN_DETAIL = Integer.valueOf(248);
  public static final Integer PRIVI_REPORT_LINE_MONTH = Integer.valueOf(249);
  public static final Integer PRIVI_REPORT_LINE_DAILY = Integer.valueOf(250);
  public static final Integer PRIVI_REPORT_VEHICLE_MONTH = Integer.valueOf(251);
  public static final Integer PRIVI_REPORT_VEHICLE_DAILY = Integer.valueOf(252);
  public static final Integer PRIVI_REPORT_DRIVER_MONTH = Integer.valueOf(253);
  public static final Integer PRIVI_REPORT_DRIVER_DAILY = Integer.valueOf(254);
  public static final Integer PRIVI_REPORT_DRIP = Integer.valueOf(255);
  public static final Integer PRIVI_REPORT_STATION = Integer.valueOf(256);
  public static final Integer PRIVI_REPORT_OVERSPEED_SUMMARY = Integer.valueOf(257);
  public static final Integer PRIVI_REPORT_OVERSPEED_DETAIL = Integer.valueOf(258);
  public static final Integer PRIVI_REPORT_SLIP_STATION_SUMMARY = Integer.valueOf(259);
  public static final Integer PRIVI_REPORT_SLIP_STATION_DETAIL = Integer.valueOf(260);
  public static final Integer PRIVI_REPORT_TPMS_SUMMARY = Integer.valueOf(261);
  public static final Integer PRIVI_REPORT_TPMS_DETAIL = Integer.valueOf(262);
  public static final Integer PRIVI_REPORT_TPMSTRACK_DETAIL = Integer.valueOf(264);
  public static final Integer PRIVI_REPORT_OBDTRACK_DETAIL = Integer.valueOf(263);
  public static final Integer PRIVI_PAGE_OPERATION = Integer.valueOf(3);
  public static final Integer PRIVI_OPERATION_COMPANY = Integer.valueOf(31);
  public static final Integer PRIVI_OPERATION_ROLE = Integer.valueOf(32);
  public static final Integer PRIVI_OPERATION_USER = Integer.valueOf(33);
  public static final Integer PRIVI_OPERATION_SIM = Integer.valueOf(34);
  public static final Integer PRIVI_OPERATION_DEVICE = Integer.valueOf(35);
  public static final Integer PRIVI_OPERATION_VEHICLE = Integer.valueOf(36);
  public static final Integer PRIVI_OPERATION_DRIVER = Integer.valueOf(37);
  public static final Integer PRIVI_OPERATION_TEAM = Integer.valueOf(38);
  public static final Integer PRIVI_OPERATION_SAFE = Integer.valueOf(39);
  public static final Integer PRIVI_OPERATION_MATURITY = Integer.valueOf(310);
  public static final Integer PRIVI_OPERATION_DOCUMENTS = Integer.valueOf(311);
  public static final Integer PRIVI_OPERATION_LINE = Integer.valueOf(312);
  public static final Integer PRIVI_PAGE_INTERNAL = Integer.valueOf(4);
  public static final Integer PRIVI_PAGE_RULE = Integer.valueOf(5);
  public static final Integer PRIVI_PAGE_TRACK = Integer.valueOf(6);
  public static final Integer PRIVI_PAGE_REALTIMEVIDEO = Integer.valueOf(7);
  public static final Integer PRIVI_PAGE_LINE_MONITOR = Integer.valueOf(8);
  public static final Integer PRIVI_VIDEO = Integer.valueOf(621);
  public static final Integer PRIVI_VIDEO_SOUND = Integer.valueOf(622);
  public static final Integer PRIVI_VIDEO_TALK = Integer.valueOf(623);
  public static final Integer PRIVI_VIDEO_MONITOR = Integer.valueOf(624);
  public static final Integer PRIVI_VIDEO_DEV_CAPTURE = Integer.valueOf(625);
  public static final Integer PRIVI_VIDEO_PTZ = Integer.valueOf(626);
  public static final Integer PRIVI_VIDEO_RECORD = Integer.valueOf(627);
  public static final Integer PRIVI_VIDEO_LIGHTS = Integer.valueOf(628);
  public static final Integer PRIVI_MAP_MY_MAP_MANAGE = Integer.valueOf(611);
  public static final Integer PRIVI_MAP_SHARE_MAP = Integer.valueOf(612);
  public static final Integer PRIVI_MAP_MONITORING = Integer.valueOf(613);
  public static final Integer PRIVI_TRACK_BACK = Integer.valueOf(631);
  public static final Integer PRIVI_RECORD_BACK = Integer.valueOf(641);
  public static final Integer PRIVI_REPORT_ALARMLOG_DETAIL = Integer.valueOf(671);
  public static final Integer PRIVI_REPORT_USERLOG_DETAIL = Integer.valueOf(672);
  public static final Integer PRIVI_DEVICE_PARAMETER = Integer.valueOf(651);
  public static final Integer PRIVI_DEVICE_INFOR = Integer.valueOf(652);
  public static final Integer PRIVI_DEVICE_UPDATE = Integer.valueOf(653);
  public static final Integer PRIVI_DEVICE_3G_FLOW = Integer.valueOf(654);
  public static final Integer PRIVI_DEVICE_MOVE = Integer.valueOf(655);
  public static final Integer PRIVI_DEVICE_OTHER = Integer.valueOf(656);
  public static final Integer PRIVI_SYSTEM_ALARM_LINK = Integer.valueOf(661);
  public static final Integer PRIVI_SYSTEM_ALARM_SHIELD = Integer.valueOf(662);
  public static final Integer PRIVI_SYSTEM_SET = Integer.valueOf(663);
  public static final Integer PRIVI_SYSTEM_RECORD_SET = Integer.valueOf(664);
  private Integer id;
  private String name;
  private String privilege;
  private StandardCompany company;
  private String remark;
  private Date updateTime;
  private String userIds;
  
  public static final String getUserRole()
  {
    String USER_ROLE = ",1,13,2,21,24,25,26,27,28,29,210,211,212,213,214,241,242,215,216,217,218,219,220,221,222,223,224,225,226,23,227,228,229,230,231,232,233,234,22,235,236,257,258,259,260,237,238,671,672,239,240,243,244,245,248,261,262,264,263,3,31,32,33,34,35,36,37,38,39,310,311,4,41,42,43,44,5,6,7,611,612,613,621,622,623,624,625,626,627,628,631,641,651,652,653,654,655,656,661,662,663,664,7,";
    if (BaseAction.getEnableTrip()) {
      USER_ROLE = USER_ROLE + "8,312,249,251,253,250,252,254,255,256,";
    }
    return USER_ROLE;
  }
  
  public String getUserIds()
  {
    return this.userIds;
  }
  
  public void setUserIds(String userIds)
  {
    this.userIds = userIds;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getPrivilege()
  {
    return this.privilege;
  }
  
  public void setPrivilege(String privilege)
  {
    this.privilege = privilege;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public String getRemark()
  {
    return this.remark;
  }
  
  public void setRemark(String remark)
  {
    this.remark = remark;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
}
