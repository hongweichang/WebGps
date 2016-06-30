package com.gps.model;

public class UserRole
{
  public static final Integer PRIVI_USERMGR_USER = Integer.valueOf(11);
  public static final Integer PRIVI_USERMGR_ROLE = Integer.valueOf(12);
  public static final Integer PRIVI_USERMGR_LOG = Integer.valueOf(13);
  public static final Integer PRIVI_VEHIMGR_VEHICLE = Integer.valueOf(21);
  public static final Integer PRIVI_VEHIMGR_GROUP = Integer.valueOf(22);
  public static final Integer PRIVI_VEHIMGR_DOWN_PLAN = Integer.valueOf(23);
  public static final Integer PRIVI_VEHIMGR_FENCE = Integer.valueOf(24);
  public static final Integer PRIVI_VEHIMGR_MOBILE = Integer.valueOf(25);
  public static final Integer PRIVI_VEHIMGR_SNAPSHOT = Integer.valueOf(26);
  public static final Integer PRIVI_VEHIMGR_RECORD = Integer.valueOf(27);
  public static final Integer PRIVI_VEHIMGR_ALARM_ACTION = Integer.valueOf(28);
  public static final Integer PRIVI_VEHIMGR_DVR = Integer.valueOf(29);
  public static final Integer PRIVI_VEHIMGR_DRIVER = Integer.valueOf(20);
  public static final Integer PRIVI_REPORT_NORMAL = Integer.valueOf(31);
  public static final Integer PRIVI_REPORT_NORMAL_LICHENG_SUMMARY = Integer.valueOf(311);
  public static final Integer PRIVI_REPORT_NORMAL_LICHENG_DETAIL = Integer.valueOf(312);
  public static final Integer PRIVI_REPORT_NORMAL_TRACK_DETAIL = Integer.valueOf(313);
  public static final Integer PRIVI_REPORT_NORMAL_VEHICLE_ONLINE_RATE = Integer.valueOf(314);
  public static final Integer PRIVI_REPORT_NORMAL_STATISTICAL_MILEAGE = Integer.valueOf(315);
  public static final Integer PRIVI_REPORT_PASSENGER = Integer.valueOf(42);
  public static final Integer PRIVI_REPORT_PASSENGER_TICKET_SUMMARY = Integer.valueOf(421);
  public static final Integer PRIVI_REPORT_PASSENGER_TICKET_DETAIL = Integer.valueOf(422);
  public static final Integer PRIVI_REPORT_ALARM = Integer.valueOf(32);
  public static final Integer PRIVI_REPORT_ALARM_SUMMARY = Integer.valueOf(321);
  public static final Integer PRIVI_REPORT_ALARM_GPSSINAL_DETAIL = Integer.valueOf(322);
  public static final Integer PRIVI_REPORT_ALARM_URGENCY_BUTTON = Integer.valueOf(323);
  public static final Integer PRIVI_REPORT_ALARM_DOOR_OPEN_LAWLESS_DETAIL = Integer.valueOf(324);
  public static final Integer PRIVI_REPORT_ALARM_ALL = Integer.valueOf(325);
  public static final Integer PRIVI_REPORT_ALARM_MOTION_DETAIL = Integer.valueOf(326);
  public static final Integer PRIVI_REPORT_ALARM_SHAKE_DETAIL = Integer.valueOf(327);
  public static final Integer PRIVI_REPORT_ALARM_VIDEO_LOST = Integer.valueOf(328);
  public static final Integer PRIVI_REPORT_ALARM_FATIGUE = Integer.valueOf(329);
  public static final Integer PRIVI_REPORT_ALARM_ACC = Integer.valueOf(320);
  public static final Integer PRIVI_REPORT_ALARM_NIGHT_DRIVING = Integer.valueOf(3211);
  public static final Integer PRIVI_REPORT_ALARM_QUERY = Integer.valueOf(3212);
  public static final Integer PRIVI_REPORT_ALARM_STATISTICS_QUERY = Integer.valueOf(3213);
  public static final Integer PRIVI_REPORT_ALARM_VIOLATION = Integer.valueOf(3214);
  public static final Integer PRIVI_REPORT_ALARM_UPS_CUT = Integer.valueOf(3215);
  public static final Integer PRIVI_REPORT_ALARM_TURN_OFF = Integer.valueOf(3216);
  public static final Integer PRIVI_REPORT_ALARM_BOARD_OPENED = Integer.valueOf(3217);
  public static final Integer PRIVI_REPORT_ALARM_SIM_LOST = Integer.valueOf(3218);
  public static final Integer PRIVI_REPORT_SPEED = Integer.valueOf(33);
  public static final Integer PRIVI_REPORT_SPEED_ALARM_SUMMARY = Integer.valueOf(331);
  public static final Integer PRIVI_REPORT_SPEED_ALARM_DETAIL = Integer.valueOf(332);
  public static final Integer PRIVI_REPORT_SPEED_DETAIL = Integer.valueOf(333);
  public static final Integer PRIVI_REPORT_LOGIN = Integer.valueOf(34);
  public static final Integer PRIVI_REPORT_LOGIN_SUMMARY = Integer.valueOf(341);
  public static final Integer PRIVI_REPORT_LOGIN_DETAIL = Integer.valueOf(342);
  public static final Integer PRIVI_REPORT_LOGIN_RATE = Integer.valueOf(343);
  public static final Integer PRIVI_REPORT_IOIN = Integer.valueOf(35);
  public static final Integer PRIVI_REPORT_IOIN_SUMMARY = Integer.valueOf(351);
  public static final Integer PRIVI_REPORT_IOIN_DETAIL = Integer.valueOf(352);
  public static final Integer PRIVI_REPORT_OIL = Integer.valueOf(36);
  public static final Integer PRIVI_REPORT_OIL_TRACK_DETAIL = Integer.valueOf(361);
  public static final Integer PRIVI_REPORT_OIL_EXCEPTION_DETAIL = Integer.valueOf(362);
  public static final Integer PRIVI_REPORT_OIL_SUMMARY = Integer.valueOf(363);
  public static final Integer PRIVI_REPORT_PARK = Integer.valueOf(37);
  public static final Integer PRIVI_REPORT_PARK_SUMMARY = Integer.valueOf(371);
  public static final Integer PRIVI_REPORT_PARK_DETAIL = Integer.valueOf(372);
  public static final Integer PRIVI_REPORT_PARK_ACCON_SUMMARY = Integer.valueOf(373);
  public static final Integer PRIVI_REPORT_PARK_ACCON_DETAIL = Integer.valueOf(374);
  public static final Integer PRIVI_REPORT_FENCE = Integer.valueOf(38);
  public static final Integer PRIVI_REPORT_FENCE_ALARM_DETAIL = Integer.valueOf(381);
  public static final Integer PRIVI_REPORT_FENCE_ACCESS_DETAIL = Integer.valueOf(382);
  public static final Integer PRIVI_REPORT_FENCE_PARK_DETAIL = Integer.valueOf(383);
  public static final Integer PRIVI_REPORT_EXTEND = Integer.valueOf(39);
  public static final Integer PRIVI_REPORT_EXTEND_ALARM_DETAIL = Integer.valueOf(391);
  public static final Integer PRIVI_REPORT_EXTEND_DISPATCH_DETAIL = Integer.valueOf(392);
  public static final Integer PRIVI_REPORT_NETFLOW = Integer.valueOf(40);
  public static final Integer PRIVI_REPORT_NETFLOW_SUMMARY = Integer.valueOf(401);
  public static final Integer PRIVI_REPORT_NETFLOW_DETAIL = Integer.valueOf(402);
  public static final Integer PRIVI_REPORT_DISPATCH = Integer.valueOf(41);
  public static final Integer PRIVI_REPORT_DISPATCH_TTS_DETAIL = Integer.valueOf(411);
  public static final Integer PRIVI_REPORT_STORAGE = Integer.valueOf(43);
  public static final Integer PRIVI_REPORT_ALARM_DISK_ERROR_DETAIL = Integer.valueOf(431);
  public static final Integer PRIVI_REPORT_ALARM_HDD_HIGH_TEMPERATURE = Integer.valueOf(432);
  public static final Integer PRIVI_REPORT_HARDDISK_STATUS_INFORMATION = Integer.valueOf(433);
  public static final Integer PRIVI_REPORT_EQUIPMENT = Integer.valueOf(44);
  public static final Integer PRIVI_REPORT_VERSION_DETAIL = Integer.valueOf(441);
  public static final Integer PRIVI_REPORT_OFFLINE_RECORDING_EQUIPMENT_UPGRADE = Integer.valueOf(442);
  public static final Integer PRIVI_REPORT_PARAMETER_CONFIGURATION = Integer.valueOf(443);
  public static final Integer PRIVI_TRACK_PLAYBACK = Integer.valueOf(41);
  public static final Integer PRIVI_MONITOR_POSITION = Integer.valueOf(51);
  public static final Integer PRIVI_MONITOR_AV = Integer.valueOf(52);
  public static final Integer PRIVI_MONITOR_TALKBACK = Integer.valueOf(53);
  public static final Integer PRIVI_MONITOR_MAPMARKER = Integer.valueOf(51);
  public static final Integer PRIVI_MAP_MY_MAP_MANAGE = Integer.valueOf(611);
  public static final Integer PRIVI_MAP_SHARE_MAP = Integer.valueOf(612);
  public static final Integer PRIVI_VIDEO = Integer.valueOf(621);
  public static final Integer PRIVI_VIDEO_SOUND = Integer.valueOf(622);
  public static final Integer PRIVI_VIDEO_TALK = Integer.valueOf(623);
  public static final Integer PRIVI_VIDEO_MONITOR = Integer.valueOf(624);
  public static final Integer PRIVI_VIDEO_DEV_CAPTURE = Integer.valueOf(625);
  public static final Integer PRIVI_VIDEO_PTZ = Integer.valueOf(626);
  public static final Integer PRIVI_VIDEO_RECORD = Integer.valueOf(627);
  public static final Integer PRIVI_TRACK_BACK = Integer.valueOf(631);
  public static final Integer PRIVI_RECORD_BACK = Integer.valueOf(641);
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
  private Integer userId;
  private String name;
  private String remarks;
  private String privilege;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getUserId()
  {
    return this.userId;
  }
  
  public void setUserId(Integer userId)
  {
    this.userId = userId;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getRemarks()
  {
    return this.remarks;
  }
  
  public void setRemarks(String remarks)
  {
    this.remarks = remarks;
  }
  
  public String getPrivilege()
  {
    return this.privilege;
  }
  
  public void setPrivilege(String privilege)
  {
    this.privilege = privilege;
  }
}
