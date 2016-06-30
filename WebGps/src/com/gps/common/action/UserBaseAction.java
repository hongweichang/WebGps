package com.gps.common.action;

import com.framework.logger.Logger;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.AccountService;
import com.gps.common.service.DevGroupService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceGroup;
import com.gps.model.UserInfo;
import com.gps.model.UserRole;
import com.gps.user.model.UserDevPermitEx;
import com.gps.user.service.UserDevPermitService;
import com.opensymphony.xwork2.ActionContext;
import java.util.List;
import java.util.Map;

public abstract class UserBaseAction
  extends BaseAction
{
  private static final long serialVersionUID = 1L;
  protected AccountService accountService;
  protected static UserService userService;
  protected DeviceService deviceService;
  protected DevGroupService devGroupService;
  protected NotifyService notifyService;
  protected ServerService serverService;
  protected UserDevPermitService userDevPermitService;
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public UserService getUserService()
  {
    return userService;
  }
  
  public void setUserService(UserService userService)
  {
    userService = userService;
  }
  
  public DevGroupService getDevGroupService()
  {
    return this.devGroupService;
  }
  
  public void setDevGroupService(DevGroupService devGroupService)
  {
    this.devGroupService = devGroupService;
  }
  
  public DeviceService getDeviceService()
  {
    return this.deviceService;
  }
  
  public void setDeviceService(DeviceService deviceService)
  {
    this.deviceService = deviceService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public UserDevPermitService getUserDevPermitService()
  {
    return this.userDevPermitService;
  }
  
  public void setUserDevPermitService(UserDevPermitService userDevPermitService)
  {
    this.userDevPermitService = userDevPermitService;
  }
  
  protected Integer getSessionUserId()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String s = (String)ctx.getSession().get("userid");
    if (s != null)
    {
      Integer usrid = Integer.valueOf(Integer.parseInt(s));
      if (usrid != null) {
        return usrid;
      }
    }
    return null;
  }
  
  protected Integer getSessionAccountId()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String s = (String)ctx.getSession().get("accountid");
    if (s != null)
    {
      Integer usrid = Integer.valueOf(Integer.parseInt(s));
      if (usrid != null) {
        return usrid;
      }
    }
    return null;
  }
  
  protected Integer getClientId()
  {
    ActionContext ctx = ActionContext.getContext();
    String s = (String)ctx.getSession().get("clientid");
    if (s != null)
    {
      Integer clientid = Integer.valueOf(Integer.parseInt(s));
      if (clientid != null) {
        return clientid;
      }
    }
    return null;
  }
  
  protected boolean isAdminUser()
  {
    Integer userId = getSessionUserId();
    return (userId != null) && (userId.equals(getClientId()));
  }
  
  protected String getSessionPrivilege()
  {
    ActionContext ctx = ActionContext.getContext();
    return (String)ctx.getSession().get("privilege");
  }
  
  protected void updateSessionPrivilege(UserInfo user)
  {
    ActionContext ctx = ActionContext.getContext();
    if ((user != null) && (user.getUserRole() != null)) {
      ctx.getSession().put("privilege", user.getUserRole().getPrivilege());
    } else {
      ctx.getSession().put("privilege", "");
    }
  }
  
  protected boolean findPrivilege(Integer privi)
  {
    String str = getSessionPrivilege();
    if (str != null)
    {
      String find = "," + privi.toString() + ",";
      int index = str.indexOf(find);
      if (index >= 0) {
        return true;
      }
      return false;
    }
    return false;
  }
  
  protected void addUserLog(Integer mainType, Integer subType, String devIDNO, String param1, String param2, String param3, String param4)
  {
    Integer userId = getSessionUserId();
    if (userId != null) {
      userService.addUserLog(userId, mainType, subType, 
        devIDNO, param1, param2, param3, param4);
    }
  }
  
  public boolean hasOperatorPrivi()
  {
    if (isAdminUser()) {
      return true;
    }
    return checkPrivi();
  }
  
  protected void getClientAllGroup()
  {
    List<DeviceGroup> groupList = this.devGroupService.getGroupList(getClientId(), null);
    addCustomResponse("groups", groupList);
  }
  
  protected void getClientAllDeviceAndGroup()
  {
    AjaxDto<DeviceBase> ajaxDevList = this.deviceService.getClientDeviceList(null, getClientId(), null, null);
    addCustomResponse("vehicles", ajaxDevList.getPageList());
    
    getClientAllGroup();
  }
  
  protected void getUserAllDeviceAndGroup()
  {
    if (isAdminUser())
    {
      getClientAllDeviceAndGroup();
    }
    else
    {
      AjaxDto<DeviceBase> ajaxDevList = this.deviceService.getUserDeviceList(null, getSessionAccountId(), null, null);
      addCustomResponse("vehicles", ajaxDevList.getPageList());
      
      getClientAllGroup();
    }
  }
  
  protected AjaxDto<DeviceBase> getUserAllDevice(String name, Integer devType, Pagination pagination)
  {
    if (isAdminUser()) {
      return this.deviceService.getClientDeviceList(name, getClientId(), devType, pagination);
    }
    return this.deviceService.getUserDeviceList(name, getSessionAccountId(), devType, pagination);
  }
  
  protected String getDeviceNameSessionKey(String devIdno)
  {
    return "device_name_" + devIdno;
  }
  
  protected String getDeviceNameInSession(String devIdno)
  {
    ActionContext ctx = ActionContext.getContext();
    String name = (String)ctx.getSession().get(getDeviceNameSessionKey(devIdno));
    if (name != null) {
      return name;
    }
    return null;
  }
  
  protected String getDeviceIoinSessionKey(String devIdno)
  {
    return "device_io_" + devIdno;
  }
  
  protected String getDeviceIoinInSession(String devIdno, int ioinIndex)
  {
    ActionContext ctx = ActionContext.getContext();
    String name = (String)ctx.getSession().get(getDeviceIoinSessionKey(devIdno));
    String ioinName = "";
    if (name != null)
    {
      String[] ioinNameArr = name.split(",");
      if (ioinIndex < ioinNameArr.length) {
        ioinName = ioinNameArr[ioinIndex];
      }
    }
    if (ioinName.isEmpty()) {
      ioinName = getText("report.ioin.name") + (ioinIndex + 1);
    }
    return ioinName;
  }
  
  protected String getDeviceChannelSessionKey(String devIdno)
  {
    return "device_channel_" + devIdno;
  }
  
  protected String getDeviceChannelInSession(String devIdno, int chn)
  {
    ActionContext ctx = ActionContext.getContext();
    String name = (String)ctx.getSession().get(getDeviceChannelSessionKey(devIdno));
    String chnName = "";
    if (name != null)
    {
      String[] chnNameArr = name.split(",");
      if (chn < chnNameArr.length) {
        chnName = chnNameArr[chn];
      }
    }
    if (chnName.isEmpty()) {
      chnName = getText("report.channel.name") + (chn + 1);
    }
    return chnName;
  }
  
  protected String getDeviceTempSensorSessionKey(String devIdno)
  {
    return "device_tempsensor_" + devIdno;
  }
  
  protected String getDeviceTempSensorInSession(String devIdno, int sensor)
  {
    ActionContext ctx = ActionContext.getContext();
    String name = (String)ctx.getSession().get(getDeviceTempSensorSessionKey(devIdno));
    String sensorName = "";
    if (name != null)
    {
      String[] sensorNameArr = name.split(",");
      if (sensor < sensorNameArr.length) {
        sensorName = sensorNameArr[sensor];
      }
    }
    if (sensorName.isEmpty()) {
      sensorName = getText("report.tempsensor.name") + (sensor + 1);
    }
    return sensorName;
  }
  
  protected int gpsGetDirection(int huangXiang)
  {
    return (huangXiang + 22) / 45 & 0x7;
  }
  
  protected String getDirectionString(int huangXiang)
  {
    int direction = gpsGetDirection(huangXiang);
    String str = "";
    switch (direction)
    {
    case 0: 
      str = getText("north");
      break;
    case 1: 
      str = getText("northEast");
      break;
    case 2: 
      str = getText("east");
      break;
    case 3: 
      str = getText("southEast");
      break;
    case 4: 
      str = getText("south");
      break;
    case 5: 
      str = getText("southWest");
      break;
    case 6: 
      str = getText("west");
      break;
    case 7: 
      str = getText("northWest");
      break;
    }
    return str;
  }
  
  protected abstract boolean checkPrivi();
  
  protected void readServerConfig()
  {
    long config = this.deviceService.getServerConfig();
    addCustomResponse("enableFence", Boolean.valueOf(enableFence(config)));
    addCustomResponse("enableSms", Boolean.valueOf(enableSms(config)));
    addCustomResponse("enableAutoDown", Boolean.valueOf(enableAutoDown(config)));
    addCustomResponse("enable3GFlow", Boolean.valueOf(enable3GFlow(config)));
    addCustomResponse("enablePhone", Boolean.valueOf(enablePhone(config)));
    addCustomResponse("enablePlayback", Boolean.valueOf(enablePlayback(config)));
    addCustomResponse("enableStorage", Boolean.valueOf(enableStorage(config)));
    addCustomResponse("enableTracker", Boolean.valueOf(enableTracker(config)));
    addCustomResponse("enablePhone", Boolean.valueOf(enablePhone(config)));
    addCustomResponse("enableMdvr", Boolean.valueOf(getEnableMdvr()));
    addCustomResponse("enableDvr", Boolean.valueOf(getEnableDvr()));
    addCustomResponse("enableTrackPlay", Boolean.valueOf(getEnableTrackPlay()));
    
    addCustomResponse("enableClientRePort", Boolean.valueOf(getEnableClientRePort()));
    
    addCustomResponse("enableTerminalGroup", Boolean.valueOf(getEnableTerminalGroup()));
    addCustomResponse("enableTerminalFence", Boolean.valueOf(getEnableTerminalFence()));
    boolean enableTerminalSnapshot = false;
    if ((getEnableTerminalSnapshot()) && (enableStorage(config))) {
      enableTerminalSnapshot = true;
    }
    addCustomResponse("enableTerminalSnapshot", Boolean.valueOf(enableTerminalSnapshot));
    boolean enableTerminalRecord = false;
    if ((getEnableTerminalRecord()) && (enableStorage(config))) {
      enableTerminalRecord = true;
    }
    addCustomResponse("enableTerminalRecord", Boolean.valueOf(enableTerminalRecord));
    addCustomResponse("enableTerminalAlarmAction", Boolean.valueOf(getEnableTerminalAlarmAction()));
    addCustomResponse("enableTerminalDriver", Boolean.valueOf(getEnableTerminalDriver()));
    
    addCustomResponse("enableReportNormal", Boolean.valueOf(getEnableReportNormal()));
    addCustomResponse("enableReportSpeed", Boolean.valueOf(getEnableReportSpeed()));
    addCustomResponse("enableReportLogin", Boolean.valueOf(getEnableReportLogin()));
    addCustomResponse("enableReportIoin", Boolean.valueOf(getEnableReportIoin()));
    addCustomResponse("enableReportAlarm", Boolean.valueOf(getEnableReportAlarm()));
    addCustomResponse("enableReportOil", Boolean.valueOf(getEnableReportOil()));
    addCustomResponse("enableReportPark", Boolean.valueOf(getEnableReportPark()));
    addCustomResponse("enableReportStorage", Boolean.valueOf(getEnableReportStorage()));
    boolean isEnableReportFence = false;
    if ((getEnableReportFence()) && (enableFence(config))) {
      isEnableReportFence = true;
    }
    addCustomResponse("enableReportFence", Boolean.valueOf(isEnableReportFence));
    boolean isEnableReport3GFlow = false;
    if ((getEnableReport3GFlow()) && (enable3GFlow(config))) {
      isEnableReport3GFlow = true;
    }
    addCustomResponse("enableReport3GFlow", Boolean.valueOf(isEnableReport3GFlow));
    boolean isEnableReportExtern = false;
    if ((getEnableReportExtern()) && (enableTracker(config))) {
      isEnableReportExtern = true;
    }
    addCustomResponse("enableReportExtern", Boolean.valueOf(isEnableReportExtern));
    addCustomResponse("enableReportDispatch", Boolean.valueOf(getEnableReportDispatch()));
    addCustomResponse("enableLargeAudit", Boolean.valueOf(getEnableLargeAudit()));
  }
  
  public String serverConfig()
    throws Exception
  {
    try
    {
      readServerConfig();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean hasPrivilege(Integer privi)
  {
    if (isAdminUser()) {
      return true;
    }
    return findPrivilege(privi);
  }
  
  public String permit()
    throws Exception
  {
    try
    {
      if (!hasPrivilege(UserRole.PRIVI_USERMGR_USER))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String idno = getRequestString("idno");
        if ((idno == null) || (idno.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          AjaxDto<UserDevPermitEx> lstPermit = this.userDevPermitService.getPermitListByDevIDNO(idno, getPagination());
          addCustomResponse("permits", lstPermit.getPageList());
          addCustomResponse("pagination", lstPermit.getPagination());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delPermit()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] ids;
      
        if (id.indexOf(",") != -1)
        {
          ids = id.split(",");
        }
        else
        {
          ids = new String[1];
          ids[0] = id;
        }
        this.userDevPermitService.delDevPermit(ids);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
