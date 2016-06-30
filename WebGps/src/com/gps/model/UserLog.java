package com.gps.model;

import java.util.Date;

public class UserLog
{
  public static final int USRLOG_MAIN_TYPE_LOGIN = 1;
  public static final int USRLOG_MAIN_TYPE_DEVICE_CTRL = 2;
  public static final int USRLOG_MAIN_TYPE_MEDIA = 3;
  public static final int USRLOG_MAIN_TYPE_USER = 4;
  public static final int USRLOG_MAIN_TYPE_ROLE = 5;
  public static final int USRLOG_MAIN_TYPE_VEHICLE = 6;
  public static final int USRLOG_MAIN_TYPE_VEHIGROUP = 7;
  public static final int USRLOG_MAIN_TYPE_VEHI_DOWNPLAN = 8;
  public static final int USRLOG_MAIN_TYPE_VEHI_FENCE = 9;
  public static final int USRLOG_MAIN_TYPE_TERMINAL_MOBILE = 10;
  public static final int USRLOG_MAIN_TYPE_SNAPSHOT_PLAN = 11;
  public static final int USRLOG_MAIN_TYPE_RECORD_PLAN = 12;
  public static final int USRLOG_MAIN_TYPE_ALARM_ACTION = 13;
  public static final int USRLOG_MAIN_TYPE_DVR = 14;
  public static final int USRLOG_MAIN_TYPE_DRIVER = 15;
  public static final int USRLOG_MAIN_TYPE_COMPANY = 16;
  public static final int USRLOG_MAIN_TYPE_DEVICE = 17;
  public static final int USRLOG_MAIN_TYPE_SIMCARD = 18;
  public static final int USRLOG_MAIN_TYPE_VEHITEAM = 19;
  public static final int USRLOG_MAIN_TYPE_RULE = 20;
  public static final int USRLOG_MAIN_TYPE_LINE = 21;
  public static final int USRLOG_LOGIN_SUB_TYPE_LOGIN = 1;
  public static final int USRLOG_LOGIN_SUB_TYPE_LOGOUT = 2;
  public static final int USRLOG_LOGIN_SUB_TYPE_INTERUPT = 3;
  public static final int USRLOG_LOGIN_SUB_TYPE_TRANSFER = 4;
  public static final int USRLOG_LOGIN_SUB_TYPE_UNKOWN_USR = 5;
  public static final int USRLOG_LOGIN_SUB_TYPE_GET_SVR_FAILED = 6;
  public static final int USRLOG_LOGIN_SUB_TYPE_UPDATE_PASSWORD = 7;
  public static final int USRLOG_LOGIN_SUB_TYPE_UPDATE_ACCOUNT = 8;
  public static final int USERLOG_LOGIN_CLIENT_WIN = 1;
  public static final int USERLOG_LOGIN_CLIENT_WEB = 2;
  public static final int USERLOG_LOGIN_CLIENT_MOBILE = 3;
  public static final int USERLOG_LOGIN_CLIENT_WIN_JT = 4;
  public static final int USERLOG_LOGIN_CLIENT_WEB_JT = 5;
  public static final int USERLOG_LOGIN_CLIENT_MOBILE_JT = 6;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_TEXT = 1;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_SMS = 2;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_CTRL = 3;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_PTZ = 4;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_READ_STATUS = 5;
  public static final int USRLOG_DEV_CTRL_SUB_TYP_SET_GPSINTERVAL = 6;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_READ_MOTION = 7;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SET_MOTION = 8;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_READ_NETFLOW_STATISTICS = 9;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SET_NETFLOW_PARAM = 10;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_CLEAR_NETFLOW_STATISTICS = 11;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_ADJUST_NETFLOW_STATISTICS = 12;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_DISPATCH_COMMAND = 13;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_CFG_VIDEO_COMMAND = 14;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_CFG_VIDEO_COMMAND = 15;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_CFG_AUDIO_COMMAND = 16;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_CFG_AUDIO_COMMAND = 17;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_CFG_AUDIO_INPUT_COMMAND = 18;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_CFG_AUDIO_INPUT_COMMAND = 19;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SEND_CFG_PTZ_COMMAND = 20;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_CFG_PTZ_COMMAND = 21;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_PARAM = 22;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SET_PARAM = 23;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_TRANSPARENT_CONFIG = 24;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_FREE_PRESET_GET = 25;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_GET_VIDEO_COLOR = 26;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_SET_VIDEO_COLOR = 27;
  public static final int USRLOG_DEV_CTRL_SUB_TYPE_TRANSPARENT_DATA = 28;
  public static final int USRLOG_MEDIA_SUB_TYPE_VIDEO = 1;
  public static final int USRLOG_MEDIA_SUB_TYPE_AUDIO = 2;
  public static final int USRLOG_MEDIA_SUB_TYPE_TACKBACK = 3;
  public static final int USRLOG_MEDIA_SUB_TYPE_SNAPSHOT = 4;
  public static final int USRLOG_MEDIA_SUB_TYPE_REC_SEARCH = 5;
  public static final int USRLOG_MEDIA_SUB_TYPE_REC_DOWN = 6;
  public static final int USRLOG_MEDIA_SUB_TYPE_DLOWN_DEV_PARAM = 7;
  public static final int USRLOG_MEDIA_SUB_TYPE_UPLOAD_DEV_PARAM_FILE = 8;
  public static final int USRLOG_MEDIA_SUB_TYPE_UPLOAD_DEVICE_PARAM = 9;
  public static final int USRLOG_MEDIA_SUB_TYPE_UPLOAD_DEV_UP_FILE = 10;
  public static final int USRLOG_MEDIA_SUB_TYPE_UPLOAD_UPGRADE_DEVICE = 11;
  public static final int USRLOG_MEDIA_SUB_TYPE_PLAYBACK = 12;
  public static final int USRLOG_MEDIA_SUB_TYPE_BROADCAST = 13;
  public static final int USRLOG_MEDIA_SUB_TYPE_UPLOAD_FILE_UPLOAD = 14;
  public static final int USRLOG_USER_SUB_TYPE_ADD = 1;
  public static final int USRLOG_USER_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_USER_SUB_TYPE_DEL = 3;
  public static final int USRLOG_USER_SUB_TYPE_RESET_PWD = 4;
  public static final int USRLOG_USER_SUB_TYPE_DEV_PERMIT = 5;
  public static final int USRLOG_ROLE_SUB_TYPE_ADD = 1;
  public static final int USRLOG_ROLE_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_ROLE_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHICLE_SUB_TYPE_EDIT = 1;
  public static final int USRLOG_VEHICLE_SUB_TYPE_DELETE = 2;
  public static final int USRLOG_VEHICLE_SUB_TYPE_COPY = 3;
  public static final int USRLOG_VEHICLE_SUB_TYPE_ADD = 4;
  public static final int USRLOG_MOBILE_SUB_TYPE_EDIT = 1;
  public static final int USRLOG_MOBILE_SUB_TYPE_RESET_PWD = 2;
  public static final int USRLOG_MOBILE_SUB_TYPE_DEV_PERMIT = 3;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_MOVE_GROUP = 4;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_MOVE_VEHI = 5;
  public static final int USRLOG_VEHIGROUP_SUB_TYPE_MOVE_SELECT_VEHI = 6;
  public static final int USRLOG_VEHI_DOWNPLAN_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_DOWNPLAN_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_DOWNPLAN_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHI_FENCE_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_FENCE_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_FENCE_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHI_SNAPSHOT_PLAN_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_SNAPSHOT_PLAN_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_SNAPSHOT_PLAN_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHI_RECORD_PLAN_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_RECORD_PLAN_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_RECORD_PLAN_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHI_ALARM_ACTION_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_ALARM_ACTION_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_ALARM_ACTION_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHI_DRIVER_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHI_DRIVER_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHI_DRIVER_SUB_TYPE_DEL = 3;
  public static final int USRLOG_COMPANY_SUB_TYPE_ADD = 1;
  public static final int USRLOG_COMPANY_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_COMPANY_SUB_TYPE_DEL = 3;
  public static final int USRLOG_DEVICE_SUB_TYPE_ADD = 1;
  public static final int USRLOG_DEVICE_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_DEVICE_SUB_TYPE_DEL = 3;
  public static final int USRLOG_SIMCARD_SUB_TYPE_ADD = 1;
  public static final int USRLOG_SIMCARD_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_SIMCARD_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_ADD = 1;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_DEL = 3;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_MOVE_TEAM = 4;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_MOVE_VEHI = 5;
  public static final int USRLOG_VEHITEAM_SUB_TYPE_MOVE_SELECT_VEHI = 6;
  public static final int USRLOG_RULE_SUB_TYPE_ADD = 1;
  public static final int USRLOG_RULE_SUB_TYPE_EDIT = 2;
  public static final int USRLOG_RULE_SUB_TYPE_DEL = 3;
  public static final int USRLOG_RULE_SUB_TYPE_ASSIGN = 4;
  public static final String USERLOG_LOGID = "userLogId";
  private Integer id;
  private Integer userId;
  private Integer mainType;
  private Integer subType;
  private String devIdno;
  private String param1;
  private String param2;
  private String param3;
  private String param4;
  private Date dtime;
  private UserInfo userInfo;
  private String dtimeStr;
  private Integer plateType;
  private Integer dtimeI;
  
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
  
  public Integer getMainType()
  {
    return this.mainType;
  }
  
  public void setMainType(Integer mainType)
  {
    this.mainType = mainType;
  }
  
  public Integer getSubType()
  {
    return this.subType;
  }
  
  public void setSubType(Integer subType)
  {
    this.subType = subType;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public String getParam1()
  {
    return this.param1;
  }
  
  public void setParam1(String param1)
  {
    this.param1 = param1;
  }
  
  public String getParam2()
  {
    return this.param2;
  }
  
  public void setParam2(String param2)
  {
    this.param2 = param2;
  }
  
  public String getParam3()
  {
    return this.param3;
  }
  
  public void setParam3(String param3)
  {
    this.param3 = param3;
  }
  
  public String getParam4()
  {
    return this.param4;
  }
  
  public void setParam4(String param4)
  {
    this.param4 = param4;
  }
  
  public Date getDtime()
  {
    return this.dtime;
  }
  
  public void setDtime(Date dtime)
  {
    this.dtime = dtime;
  }
  
  public UserInfo getUserInfo()
  {
    return this.userInfo;
  }
  
  public void setUserInfo(UserInfo userInfo)
  {
    this.userInfo = userInfo;
  }
  
  public String getDtimeStr()
  {
    return this.dtimeStr;
  }
  
  public void setDtimeStr(String dtimeStr)
  {
    this.dtimeStr = dtimeStr;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public Integer getDtimeI()
  {
    return this.dtimeI;
  }
  
  public void setDtimeI(Integer dtimeI)
  {
    this.dtimeI = dtimeI;
  }
}
