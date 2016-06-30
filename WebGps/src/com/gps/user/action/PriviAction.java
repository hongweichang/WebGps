package com.gps.user.action;

import com.framework.logger.Logger;
import com.framework.utils.PinYinUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DevGroupService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceGroup;
import com.gps.model.DeviceLite;
import com.gps.model.DeviceStatus;
import com.gps.model.UserAccountEx;
import com.gps.model.UserInfo;
import com.gps.model.UserRole;
import com.gps.user.service.RoleService;
import com.gps.user.vo.UserPrivi;
import com.gps.util.ConvertUtil;
import com.gps.vo.GpsValue;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PriviAction
  extends UserBaseAction
{
  private static final String PAGE_MONITOR = "monitor";
  private static final String PAGE_TRACK = "track";
  private static final String PAGE_REPORT = "report";
  private static final String PAGE_VEHICLE = "vehicle";
  private static final String PAGE_USER = "user";
  private RoleService roleService;
  
  public RoleService getRoleService()
  {
    return this.roleService;
  }
  
  public void setRoleService(RoleService roleService)
  {
    this.roleService = roleService;
  }
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  protected List<UserPrivi> getPriviMonitor()
  {
    List<UserPrivi> monitorPrivi = new ArrayList();
    monitorPrivi.add(new UserPrivi(UserRole.PRIVI_MONITOR_POSITION));
    monitorPrivi.add(new UserPrivi(UserRole.PRIVI_MONITOR_AV));
    monitorPrivi.add(new UserPrivi(UserRole.PRIVI_MONITOR_TALKBACK));
    monitorPrivi.add(new UserPrivi(UserRole.PRIVI_MONITOR_MAPMARKER));
    return monitorPrivi;
  }
  
  protected List<UserPrivi> getPriviTrack()
  {
    List<UserPrivi> trackPrivi = new ArrayList();
    UserPrivi priviTrack = new UserPrivi();
    priviTrack.setPrivi(UserRole.PRIVI_TRACK_PLAYBACK);
    priviTrack.setUrl("track/track.html");
    trackPrivi.add(priviTrack);
    return trackPrivi;
  }
  
  protected List<UserPrivi> getPriviReport(long serverConfig)
  {
    List<UserPrivi> reportPrivi = new ArrayList();
    if (getEnableReportNormal())
    {
      UserPrivi priviNormal = new UserPrivi();
      priviNormal.setPrivi(UserRole.PRIVI_REPORT_NORMAL);
      priviNormal.setUrl("report/normal_licheng_summary.html");
      priviNormal.addSubPrivi(UserRole.PRIVI_REPORT_NORMAL_LICHENG_SUMMARY, "report/normal_licheng_summary.html");
      priviNormal.addSubPrivi(UserRole.PRIVI_REPORT_NORMAL_LICHENG_DETAIL, "report/normal_licheng_daily.html");
      
      priviNormal.addSubPrivi(UserRole.PRIVI_REPORT_NORMAL_TRACK_DETAIL, "report/normal_track_detail.html");
      
      reportPrivi.add(priviNormal);
    }
    if (getEnableReportSpeed())
    {
      UserPrivi priviSpeed = new UserPrivi();
      priviSpeed.setPrivi(UserRole.PRIVI_REPORT_SPEED);
      priviSpeed.setUrl("report/speed_alarm_summary.html");
      priviSpeed.addSubPrivi(UserRole.PRIVI_REPORT_SPEED_ALARM_SUMMARY, "report/speed_alarm_summary.html");
      priviSpeed.addSubPrivi(UserRole.PRIVI_REPORT_SPEED_ALARM_DETAIL, "report/speed_alarm_detail.html");
      priviSpeed.addSubPrivi(UserRole.PRIVI_REPORT_SPEED_DETAIL, "report/speed_detail.html");
      reportPrivi.add(priviSpeed);
    }
    if (getEnableReportLogin())
    {
      UserPrivi priviLogin = new UserPrivi();
      priviLogin.setPrivi(UserRole.PRIVI_REPORT_LOGIN);
      priviLogin.setUrl("report/login_rate.html");
      priviLogin.addSubPrivi(UserRole.PRIVI_REPORT_LOGIN_RATE, "report/login_rate.html");
      priviLogin.addSubPrivi(UserRole.PRIVI_REPORT_LOGIN_SUMMARY, "report/login_summary.html");
      priviLogin.addSubPrivi(UserRole.PRIVI_REPORT_LOGIN_DETAIL, "report/login_detail.html");
      reportPrivi.add(priviLogin);
    }
    if (getEnableReportIoin())
    {
      UserPrivi priviIoin = new UserPrivi();
      priviIoin.setPrivi(UserRole.PRIVI_REPORT_IOIN);
      priviIoin.setUrl("report/ioin_summary.html");
      priviIoin.addSubPrivi(UserRole.PRIVI_REPORT_IOIN_SUMMARY, "report/ioin_summary.html");
      priviIoin.addSubPrivi(UserRole.PRIVI_REPORT_IOIN_DETAIL, "report/ioin_detail.html");
      reportPrivi.add(priviIoin);
    }
    if (getEnableReportAlarm())
    {
      UserPrivi priviAlarm = new UserPrivi();
      priviAlarm.setPrivi(UserRole.PRIVI_REPORT_ALARM);
      priviAlarm.setUrl("report/alarm_summary.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_SUMMARY, "report/alarm_summary.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_ALL, "report/alarm_all_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_ACC, "report/alarm_acc_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_GPSSINAL_DETAIL, "report/alarm_gpssinnal_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_URGENCY_BUTTON, "report/alarm_urgencybutton_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_DOOR_OPEN_LAWLESS_DETAIL, "report/alarm_dooropen_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_MOTION_DETAIL, "report/alarm_motion_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_VIDEO_LOST, "report/alarm_videolost_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_SHAKE_DETAIL, "report/alarm_shake_detail.html");
      if (getEnableReportFatigue())
      {
        priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_FATIGUE, "report/alarm_fatigue_detail.html");
        priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_NIGHT_DRIVING, "report/alarm_nightdriving_detail.html");
      }
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_UPS_CUT, "report/alarm_upscut_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_BOARD_OPENED, "report/alarm_boardopened_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_TURN_OFF, "report/alarm_turnoff_detail.html");
      priviAlarm.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_SIM_LOST, "report/alarm_simlost_detail.html");
      
      reportPrivi.add(priviAlarm);
    }
    if (getEnableReportStorage())
    {
      UserPrivi priviStorage = new UserPrivi();
      priviStorage.setPrivi(UserRole.PRIVI_REPORT_STORAGE);
      priviStorage.setUrl("report/alarm_diskerror_detail.html");
      priviStorage.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_DISK_ERROR_DETAIL, "report/alarm_diskerror_detail.html");
      priviStorage.addSubPrivi(UserRole.PRIVI_REPORT_ALARM_HDD_HIGH_TEMPERATURE, "report/alarm_hightemperature_detail.html");
      priviStorage.addSubPrivi(UserRole.PRIVI_REPORT_HARDDISK_STATUS_INFORMATION, "report/harddisk_status_information.html");
      reportPrivi.add(priviStorage);
    }
    if (getEnableReportEquipment())
    {
      UserPrivi priviEquipment = new UserPrivi();
      priviEquipment.setPrivi(UserRole.PRIVI_REPORT_EQUIPMENT);
      priviEquipment.setUrl("report/version_detail.html");
      priviEquipment.addSubPrivi(UserRole.PRIVI_REPORT_VERSION_DETAIL, "report/version_detail.html");
      priviEquipment.addSubPrivi(UserRole.PRIVI_REPORT_OFFLINE_RECORDING_EQUIPMENT_UPGRADE, "report/ofl_task_log_detail.html");
      priviEquipment.addSubPrivi(UserRole.PRIVI_REPORT_PARAMETER_CONFIGURATION, "report/parameter_configuration_detail.html");
      reportPrivi.add(priviEquipment);
    }
    if (getEnableReportOil())
    {
      UserPrivi priviOil = new UserPrivi();
      priviOil.setPrivi(UserRole.PRIVI_REPORT_OIL);
      priviOil.setUrl("report/oil_summary.html");
      priviOil.addSubPrivi(UserRole.PRIVI_REPORT_OIL_SUMMARY, "report/oil_summary.html");
      priviOil.addSubPrivi(UserRole.PRIVI_REPORT_OIL_TRACK_DETAIL, "report/oil_track_detail.html");
      priviOil.addSubPrivi(UserRole.PRIVI_REPORT_OIL_EXCEPTION_DETAIL, "report/oil_exception_detail.html");
      reportPrivi.add(priviOil);
    }
    if (getEnableReportPark())
    {
      UserPrivi priviPark = new UserPrivi();
      priviPark.setPrivi(UserRole.PRIVI_REPORT_PARK);
      priviPark.setUrl("report/park_summary.html");
      priviPark.addSubPrivi(UserRole.PRIVI_REPORT_PARK_SUMMARY, "report/park_summary.html");
      priviPark.addSubPrivi(UserRole.PRIVI_REPORT_PARK_DETAIL, "report/park_detail.html");
      priviPark.addSubPrivi(UserRole.PRIVI_REPORT_PARK_ACCON_SUMMARY, "report/park_summary.html?type=1");
      priviPark.addSubPrivi(UserRole.PRIVI_REPORT_PARK_ACCON_DETAIL, "report/park_detail.html?type=1");
      reportPrivi.add(priviPark);
    }
    if ((getEnableReportFence()) && (enableFence(serverConfig)))
    {
      UserPrivi priviFence = new UserPrivi();
      priviFence.setPrivi(UserRole.PRIVI_REPORT_FENCE);
      priviFence.setUrl("report/fence_alarm_detail.html");
      priviFence.addSubPrivi(UserRole.PRIVI_REPORT_FENCE_ALARM_DETAIL, "report/fence_alarm_detail.html");
      priviFence.addSubPrivi(UserRole.PRIVI_REPORT_FENCE_ACCESS_DETAIL, "report/fence_access_detail.html");
      priviFence.addSubPrivi(UserRole.PRIVI_REPORT_FENCE_PARK_DETAIL, "report/fence_park_detail.html");
      reportPrivi.add(priviFence);
    }
    if ((getEnableReport3GFlow()) && (enable3GFlow(serverConfig)))
    {
      UserPrivi priviNetFlow = new UserPrivi();
      priviNetFlow.setPrivi(UserRole.PRIVI_REPORT_NETFLOW);
      priviNetFlow.setUrl("report/netflow_summary.html");
      priviNetFlow.addSubPrivi(UserRole.PRIVI_REPORT_NETFLOW_SUMMARY, "report/netflow_summary.html");
      priviNetFlow.addSubPrivi(UserRole.PRIVI_REPORT_NETFLOW_DETAIL, "report/netflow_detail.html");
      reportPrivi.add(priviNetFlow);
    }
    if ((getEnableReportExtern()) && (enableTracker(serverConfig)))
    {
      UserPrivi priviDispatch = new UserPrivi();
      priviDispatch.setPrivi(UserRole.PRIVI_REPORT_EXTEND);
      priviDispatch.setUrl("report/extend_alarm_detail.html");
      priviDispatch.addSubPrivi(UserRole.PRIVI_REPORT_EXTEND_ALARM_DETAIL, "report/extend_alarm_detail.html");
      priviDispatch.addSubPrivi(UserRole.PRIVI_REPORT_EXTEND_DISPATCH_DETAIL, "report/extend_dispatch_detail.html");
      reportPrivi.add(priviDispatch);
    }
    if (getEnableReportDispatch())
    {
      UserPrivi priviDispatch = new UserPrivi();
      priviDispatch.setPrivi(UserRole.PRIVI_REPORT_DISPATCH);
      priviDispatch.setUrl("report/dispatch_tts_detail.html");
      priviDispatch.addSubPrivi(UserRole.PRIVI_REPORT_DISPATCH_TTS_DETAIL, "report/dispatch_tts_detail.html");
      reportPrivi.add(priviDispatch);
    }
    return reportPrivi;
  }
  
  protected List<UserPrivi> getPriviVehicle(long serverConfig)
  {
    List<UserPrivi> vehiclePrivi = new ArrayList();
    if (getEnableMdvr())
    {
      UserPrivi vehicle = new UserPrivi();
      vehicle.setPrivi(UserRole.PRIVI_VEHIMGR_VEHICLE);
      vehicle.setUrl("vehicle/vehi_list.html");
      vehiclePrivi.add(vehicle);
    }
    if (getEnableDvr())
    {
      UserPrivi vehicle = new UserPrivi();
      vehicle.setPrivi(UserRole.PRIVI_VEHIMGR_DVR);
      vehicle.setUrl("vehicle/dvr_list.html");
      vehiclePrivi.add(vehicle);
    }
    if (enableTracker(serverConfig))
    {
      UserPrivi mobile = new UserPrivi();
      mobile.setPrivi(UserRole.PRIVI_VEHIMGR_MOBILE);
      mobile.setUrl("vehicle/mobile_list.html");
      vehiclePrivi.add(mobile);
    }
    if (getEnableTerminalGroup())
    {
      UserPrivi group = new UserPrivi();
      group.setPrivi(UserRole.PRIVI_VEHIMGR_GROUP);
      group.setUrl("vehicle/vehi_group.html");
      vehiclePrivi.add(group);
    }
    if ((getEnableTerminalFence()) && (enableFence(serverConfig)))
    {
      UserPrivi mapFence = new UserPrivi();
      mapFence.setPrivi(UserRole.PRIVI_VEHIMGR_FENCE);
      mapFence.setUrl("vehicle/vehi_mapfence.html");
      vehiclePrivi.add(mapFence);
    }
    if (enableAutoDown(serverConfig))
    {
      UserPrivi downPlan = new UserPrivi();
      downPlan.setPrivi(UserRole.PRIVI_VEHIMGR_DOWN_PLAN);
      downPlan.setUrl("vehicle/vehi_downplan.html");
      vehiclePrivi.add(downPlan);
    }
    if ((getEnableTerminalSnapshot()) && (enableStorage(serverConfig)))
    {
      UserPrivi snapshotPlan = new UserPrivi();
      snapshotPlan.setPrivi(UserRole.PRIVI_VEHIMGR_SNAPSHOT);
      snapshotPlan.setUrl("vehicle/vehi_snapshotplan.html");
      vehiclePrivi.add(snapshotPlan);
    }
    if ((getEnableTerminalRecord()) && (enableStorage(serverConfig)))
    {
      UserPrivi recordPlan = new UserPrivi();
      recordPlan.setPrivi(UserRole.PRIVI_VEHIMGR_RECORD);
      recordPlan.setUrl("vehicle/vehi_recordplan.html");
      vehiclePrivi.add(recordPlan);
    }
    if (getEnableTerminalAlarmAction())
    {
      UserPrivi alarmAction = new UserPrivi();
      alarmAction.setPrivi(UserRole.PRIVI_VEHIMGR_ALARM_ACTION);
      alarmAction.setUrl("vehicle/vehi_alarmaction.html");
      vehiclePrivi.add(alarmAction);
    }
    if (getEnableTerminalDriver())
    {
      UserPrivi alarmAction = new UserPrivi();
      alarmAction.setPrivi(UserRole.PRIVI_VEHIMGR_DRIVER);
      alarmAction.setUrl("vehicle/vehi_driverinfo.html");
      vehiclePrivi.add(alarmAction);
    }
    return vehiclePrivi;
  }
  
  protected List<UserPrivi> getPriviUserMgr()
  {
    List<UserPrivi> userPrivi = new ArrayList();
    
    UserPrivi user = new UserPrivi();
    user.setPrivi(UserRole.PRIVI_USERMGR_USER);
    user.setUrl("user/user_list.html");
    userPrivi.add(user);
    
    UserPrivi role = new UserPrivi();
    role.setPrivi(UserRole.PRIVI_USERMGR_ROLE);
    role.setUrl("user/role_list.html");
    userPrivi.add(role);
    
    UserPrivi log = new UserPrivi();
    log.setPrivi(UserRole.PRIVI_USERMGR_LOG);
    log.setUrl("user/userlog_list.html");
    userPrivi.add(log);
    return userPrivi;
  }
  
  protected void insertMainPrivi(String privilege, List<UserPrivi> lstPrivi, String page, List<String> privis)
  {
    boolean ret = false;
    if (!isAdminUser()) {
      for (int i = 0; i < lstPrivi.size(); i++) {
        if (privilege.indexOf(String.format(",%d,", new Object[] { ((UserPrivi)lstPrivi.get(i)).getPrivi() })) >= 0)
        {
          ret = true;
          break;
        }
      }
    } else {
      ret = true;
    }
    if (ret) {
      privis.add(page);
    }
  }
  
  public String query()
    throws Exception
  {
    try
    {
      long config = this.deviceService.getServerConfig();
      List<String> privis = new ArrayList();
      
      UserInfo user = (UserInfo)UserBaseAction.userService.get(getSessionUserId());
      updateSessionPrivilege(user);
      String privilege = getSessionPrivilege();
      
      List<UserPrivi> priviReport = getPriviReport(config);
      if (priviReport.size() > 0) {
        insertMainPrivi(privilege, priviReport, "report", privis);
      }
      List<UserPrivi> priviVehicle = getPriviVehicle(config);
      if (priviVehicle.size() > 0) {
        insertMainPrivi(privilege, priviVehicle, "vehicle", privis);
      }
      insertMainPrivi(privilege, getPriviUserMgr(), "user", privis);
      addCustomResponse("privis", privis);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void insertPagePrivi(String privilege, List<UserPrivi> lstPrivi, List<UserPrivi> privis)
  {
    for (int i = 0; i < lstPrivi.size(); i++)
    {
      boolean add = false;
      UserPrivi userPrivi = (UserPrivi)lstPrivi.get(i);
      if (isAdminUser()) {
        add = true;
      } else if (privilege.indexOf(String.format(",%d,", new Object[] { userPrivi.getPrivi() })) >= 0) {
        add = true;
      }
      if (add) {
        privis.add(userPrivi);
      }
    }
  }
  
  public String page()
    throws Exception
  {
    try
    {
      String privilege = getSessionPrivilege();
      String page = getRequestString("page");
      List<UserPrivi> privis = new ArrayList();
      if ("report".equals(page))
      {
        long config = this.deviceService.getServerConfig();
        List<UserPrivi> priviReport = getPriviReport(config);
        insertPagePrivi(privilege, priviReport, privis);
      }
      else if ("vehicle".equals(page))
      {
        long config = this.deviceService.getServerConfig();
        List<UserPrivi> priviVehicle = getPriviVehicle(config);
        insertPagePrivi(privilege, priviVehicle, privis);
      }
      else if ("user".equals(page))
      {
        List<UserPrivi> priviUser = getPriviUserMgr();
        insertPagePrivi(privilege, priviUser, privis);
      }
      addCustomResponse("privis", privis);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void getGroupParentList(Integer groupId, Map<Integer, DeviceGroup> mapGroupAll, Map<Integer, DeviceGroup> mapGroupRet, List<DeviceGroup> lstGroupRet)
  {
    if ((!groupId.equals(Integer.valueOf(0))) && 
      (mapGroupRet.get(groupId) == null))
    {
      DeviceGroup group = (DeviceGroup)mapGroupAll.get(groupId);
      if (group != null)
      {
        mapGroupRet.put(group.getId(), group);
        lstGroupRet.add(group);
        getGroupParentList(group.getParentId(), mapGroupAll, mapGroupRet, lstGroupRet);
      }
    }
  }
  
  List<DeviceLite> getDeviceLite(List<DeviceBase> lstDevice)
  {
    if ((lstDevice != null) && (lstDevice.size() > 0))
    {
      List<DeviceLite> lstLite = new ArrayList();
      for (int i = 0; i < lstDevice.size(); i++)
      {
        DeviceBase device = (DeviceBase)lstDevice.get(i);
        DeviceLite lite = new DeviceLite();
        lite.setUserAccount(device.getUserAccount());
        lite.setId(device.getId());
        lite.setIdno(device.getIdno());
        lite.setDevGroupId(device.getDevGroupId());
        lite.setDevType(device.getDevType());
        lite.setDevSubType(device.getDevSubType());
        lite.setFactory(device.getFactory());
        lite.setIcon(device.getIcon());
        lite.setChnCount(device.getChnCount());
        lite.setChnName(device.getChnName());
        lite.setIoInCount(device.getIoInCount());
        lite.setIoInName(device.getIoInName());
        lite.setTempCount(device.getTempCount());
        lite.setTempName(device.getTempName());
        lite.setSimCard(device.getSimCard());
        lite.setStatus(device.getStatus());
        lstLite.add(lite);
      }
      return lstLite;
    }
    return null;
  }
  
  protected String getUserVehicle(boolean bLite)
  {
    try
    {
      AjaxDto<DeviceBase> ajaxDevice = getUserAllDevice(null, null, null);
      
      ActionContext ctx = ActionContext.getContext();
      String toMap = getRequestString("toMap");
      if (ajaxDevice.getPageList() != null)
      {
        AjaxDto<DeviceStatus> ajaxStatus = this.deviceService.getDeviceStatus(ajaxDevice.getPageList());
        
        Map<String, DeviceStatus> mapStatus = new HashMap();
        if (ajaxStatus.getPageList() != null) {
          for (int i = 0; i < ajaxStatus.getPageList().size(); i++)
          {
            DeviceStatus status = (DeviceStatus)ajaxStatus.getPageList().get(i);
            
            GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap);
            status.setMapJingDu(gpsValue.getMapJingDu());
            status.setMapWeiDu(gpsValue.getMapWeiDu());
            mapStatus.put(status.getDevIdno(), status);
          }
        }
        List<DeviceGroup> groupList = this.devGroupService.getGroupList(getClientId(), null);
        
        Map<Integer, DeviceGroup> mapGroupAll = new HashMap();
        if (groupList != null) {
          for (int i = 0; i < groupList.size(); i++)
          {
            DeviceGroup group = (DeviceGroup)groupList.get(i);
            mapGroupAll.put(group.getId(), group);
          }
        }
        Map<Integer, DeviceGroup> mapGroupRet = new HashMap();
        List<DeviceGroup> lstGroupRet = new ArrayList();
        for (int i = 0; i < ajaxDevice.getPageList().size(); i++)
        {
          DeviceBase device = (DeviceBase)ajaxDevice.getPageList().get(i);
          
          String pinYin = PinYinUtil.converterToFirstSpell(device.getUserAccount().getName());
          device.getUserAccount().setPinYin(pinYin);
          
          DeviceStatus status = (DeviceStatus)mapStatus.get(device.getIdno());
          if (status != null)
          {
            if (status.getJingDu() == null) {
              status.setJingDu(Integer.valueOf(0));
            }
            if (status.getWeiDu() == null) {
              status.setWeiDu(Integer.valueOf(0));
            }
            device.setStatus(status);
          }
          getGroupParentList(device.getDevGroupId(), mapGroupAll, mapGroupRet, lstGroupRet);
          
          ctx.getSession().put(getDeviceNameSessionKey(device.getIdno()), device.getUserAccount().getName());
          ctx.getSession().put(getDeviceIoinSessionKey(device.getIdno()), device.getIoInName());
          ctx.getSession().put(getDeviceTempSensorSessionKey(device.getIdno()), device.getTempName());
          ctx.getSession().put(getDeviceChannelSessionKey(device.getIdno()), device.getChnName());
        }
        addCustomResponse("groups", lstGroupRet);
      }
      String sort = getRequestString("sort");
      if ((sort != null) && (sort.equals("1")))
      {
        List<DeviceBase> lstDevice = ajaxDevice.getPageList();
        Collections.sort(lstDevice, new PriviAct());
        if (bLite) {
          addCustomResponse("vehicles", getDeviceLite(lstDevice));
        } else {
          addCustomResponse("vehicles", lstDevice);
        }
      }
      else if (bLite)
      {
        addCustomResponse("vehicles", getDeviceLite(ajaxDevice.getPageList()));
      }
      else
      {
        addCustomResponse("vehicles", ajaxDevice.getPageList());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String vehicle()
    throws Exception
  {
    return getUserVehicle(false);
  }
  
  public String vehicleEx()
    throws Exception
  {
    return getUserVehicle(true);
  }
  
  final class PriviAct
    implements Comparator<DeviceBase>
  {
  
    
    public int compare(DeviceBase o1, DeviceBase o2)
    {
      if (o1.isOnline() != o2.isOnline())
      {
        if (o1.isOnline()) {
          return -1;
        }
        return 1;
      }
      return o1.getUserAccount().getPinYin().compareTo(o2.getUserAccount().getPinYin());
    }
  }
  
  public String terminal()
    throws Exception
  {
    return vehicle();
  }
  
  public String position()
    throws Exception
  {
    try
    {
      String jingDu = getRequestString("jingDu");
      String weiDu = getRequestString("weiDu");
      String toMap = getRequestString("toMap");
      GpsValue gpsValue = ConvertUtil.convert(Integer.valueOf(Integer.parseInt(jingDu)), Integer.valueOf(Integer.parseInt(weiDu)), toMap);
      addCustomResponse("gpsValue", gpsValue);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
