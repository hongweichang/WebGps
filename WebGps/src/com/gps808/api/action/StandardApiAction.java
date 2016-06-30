package com.gps808.api.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceStatusLite;
import com.gps.model.ServerInfo;
import com.gps.util.ConvertUtil;
import com.gps.vo.GpsValue;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehicle;
import com.gps808.monitor.service.StandardMonitorService;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.DeviceLiteEx;
import com.gps808.operationManagement.vo.ResultServer;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceAlarmEx;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.videoTrack.service.StandardVideoTrackService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;
import org.hibernate.type.StandardBasicTypes;

public class StandardApiAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private static final String MAP_VEHICLES = "map_vehicles";
  private static final String API_SESSION_USER = "api_session_user";
  private static final String API_USER_PRIVILEGE = "api_user_privilege";
  private static final String API_USER_ID = "api_user_id";
  private static final String API_USER_COMPANY_USERID = "api_user_company_userId";
  private static final String API_USER_ACCOUNT = "api_user_account";
  private static final String API_USER_COMPANYID = "api_user_companyId";
  private static final String API_USER_UPDATE_TIME = "api_user_update_time";
  private static final String API_USER_RELATION = "api_user_relation";
  private static final String API_RELATION_VEHICLE = "api_relation_vehicle";
  private static final String API_RELATION_DEVIDNO = "api_relation_devIdno";
  private static final String API_RELATION_UPDATE_TIME = "api_relation_update_time";
  private static final String API_RELATION_ISADMIN = "api_relation_isAdmin";
  private static final String API_RELATION_ISMASTER = "api_relation_isMaster";
  private static final int API_RET_NAME_ERROR = 1;
  private static final int API_RET_PWD_ERROR = 2;
  private static final int API_RET_USER_DISABLED = 3;
  private static final int API_RET_EXPIRE_ERROR = 4;
  private static final int API_RET_REQUEST_ERROR = 5;
  private static final int API_RET_EXCEPTION_ERROR = 6;
  private static final int API_RET_PARAM_ERROR = 7;
  private static final int API_RET_VEHICLE_ERROR = 8;
  private static final int API_RET_TIME_ERROR = 9;
  private static final int API_RET_TIME_MORETHAN = 10;
  private static final int API_RET_DOWNLOADTASK_EXIST = 11;
  protected StandardVideoTrackService videoTrackService;
  
  public StandardVideoTrackService getVideoTrackService()
  {
    return this.videoTrackService;
  }
  
  public void setVideoTrackService(StandardVideoTrackService videoTrackService)
  {
    this.videoTrackService = videoTrackService;
  }
  
  private String getServerGuid()
  {
    return UUID.randomUUID().toString();
  }
  
  private boolean isAdmin(String jsession, String account)
  {
    if ((jsession != null) && (!jsession.isEmpty()))
    {
      HttpServletRequest request = ServletActionContext.getRequest();
      ServletContext application = request.getSession().getServletContext();
      try
      {
        Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
        if ((synmapSession == null) || (synmapSession.size() <= 0)) {
         
        }
        Map<String, Object> mapUser = (Map)synmapSession.get(jsession);
        if ((mapUser == null) || 
          (mapUser.get("api_user_account") == null) || (!mapUser.get("api_user_account").equals("admin"))) {
          
        }
        return true;
      }
      catch (NullPointerException localNullPointerException) {}
    }
    else if ((account != null) && (account.equals("admin")))
    {
      return true;
    }

    return false;
  }
  
  private boolean isMaster(String jsession, Integer userId, Integer accountId)
  {
    if ((jsession != null) && (!jsession.isEmpty()))
    {
      HttpServletRequest request = ServletActionContext.getRequest();
      ServletContext application = request.getSession().getServletContext();
      try
      {
        Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
        if ((synmapSession == null) || (synmapSession.size() <= 0)) {
          
        }
        Map<String, Object> mapUser = (Map)synmapSession.get(jsession);
        if ((mapUser == null) || 
          (mapUser.get("api_user_id") == null) || (mapUser.get("api_user_company_userId") == null) || 
          (!mapUser.get("api_user_id").equals(mapUser.get("api_user_company_userId")))) {
          
        }
        return true;
      }
      catch (NullPointerException localNullPointerException) {}
    }
    else if ((userId != null) && (accountId != null) && (userId.equals(accountId)))
    {
      return true;
    }
 
    return false;
  }
  
  private int getSessionUserIdEx(String jsession)
  {
    HttpServletRequest request = ServletActionContext.getRequest();
    ServletContext application = request.getSession().getServletContext();
    try
    {
      Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
      if ((synmapSession != null) && (synmapSession.size() > 0))
      {
        Map<String, Object> mapUser = (Map)synmapSession.get(jsession);
        if (mapUser != null) {
          return Integer.parseInt(mapUser.get("api_user_id").toString());
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
    return 0;
  }
  
  public String login()
  {
    try
    {
      String account = getRequestStringEx("account");
      String password = getRequestStringEx("password");
      HttpServletRequest request = ServletActionContext.getRequest();
      if ((password != null) && (!password.isEmpty())) {
        password = MD5EncryptUtils.encrypt(password);
      }
      StandardUserAccount userAccount = this.standardUserService.getStandardUserAccountByAccount(account);
      if (userAccount == null)
      {
        userService.addUserLog(null, Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), account, password, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else if ((userAccount.getPassword() != null) && (!userAccount.getPassword().isEmpty()) && 
        (password.equalsIgnoreCase(userAccount.getPassword())))
      {
        if ((userAccount.getStatus() == null) || (userAccount.getStatus().intValue() == 0)) {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
        } else if (userAccount.getStatus().intValue() == 2) {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        } else if (!"admin".equalsIgnoreCase(account))
        {
          if ((userAccount.getValidity() != null) && (DateUtil.compareDate(new Date(), userAccount.getValidity()))) {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          } else {
            doLoginSuc(request, userAccount, true, getServerGuid());
          }
        }
        else {
          doLoginSuc(request, userAccount, true, getServerGuid());
        }
      }
      else
      {
        userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), userAccount.getAccount(), password, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  private void doLoginSuc(HttpServletRequest request, StandardUserAccount userAccount, boolean addLoginLog, String sessionId)
    throws Exception
  {
    addUserSession(request, userAccount.getId(), sessionId);
    
    ServletContext application = request.getSession().getServletContext();
    
    Map<String, Map<String, Object>> mapSession = (Map)application.getAttribute("api_session_user");
    if (mapSession == null)
    {
      mapSession = new HashMap();
      application.setAttribute("api_session_user", mapSession);
    }
    Map<String, Object> mapUser = new HashMap();
    mapUser.put("api_user_id", userAccount.getId());
    mapUser.put("api_user_account", userAccount.getAccount());
    mapUser.put("api_user_companyId", userAccount.getCompany().getId());
    mapUser.put("api_user_company_userId", userAccount.getCompany().getAccountID());
    
    boolean isAdmin = isAdmin(null, userAccount.getAccount());
    
    boolean isMaster = isMaster(null, userAccount.getId(), userAccount.getCompany().getAccountID());
    if ((isAdmin) || (isMaster)) {
      mapUser.put("api_user_privilege", StandardUserRole.getUserRole());
    } else if ((userAccount != null) && (userAccount.getRole() != null)) {
      mapUser.put("api_user_privilege", userAccount.getRole().getPrivilege());
    } else {
      mapUser.put("api_user_privilege", "");
    }
    mapUser.put("api_user_update_time", Long.valueOf(new Date().getTime() / 1000L));
    
    Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap(mapSession);
    synmapSession.put(sessionId, mapUser);
    
    Map<String, Map<String, Object>> mapRelation = (Map)application.getAttribute("api_user_relation");
    if (mapRelation == null)
    {
      mapRelation = new HashMap();
      application.setAttribute("api_user_relation", mapRelation);
    }
    List<String> lstVehiIdno = new ArrayList();
    if ((isAdmin) || (isMaster))
    {
      Integer parentId = null;
      if (!isAdmin) {
        parentId = userAccount.getCompany().getId();
      }
      List<Integer> lstCompanyId = this.standardUserService.getCompanyIdList(parentId, null, isAdmin);
      if (!isAdmin)
      {
        if (lstCompanyId == null) {
          lstCompanyId = new ArrayList();
        }
        lstCompanyId.add(parentId);
      }
      if ((lstCompanyId != null) && (lstCompanyId.size() > 0)) {
        lstVehiIdno = this.standardUserService.getStandardVehiIdnoList(lstCompanyId, null);
      }
    }
    else
    {
      List<StandardUserVehiPermitEx> vehiPermits = this.standardUserService.getAuthorizedUserVehicleList(userAccount.getId(), null, null);
      if ((vehiPermits != null) && (vehiPermits.size() > 0))
      {
        int i = 0;
        for (int j = vehiPermits.size(); i < j; i++) {
          lstVehiIdno.add(((StandardUserVehiPermitEx)vehiPermits.get(i)).getVehiIdno());
        }
        vehiPermits = null;
      }
    }
    List<String> lstDevIdno = null;
    
    Map<String, List<Map<String, Object>>> mapVehicle = null;
    if ((isAdmin) || ((lstVehiIdno != null) && (lstVehiIdno.size() > 0)))
    {
      List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, null, null, null);
      lstVehiIdno = null;
      mapVehicle = new HashMap();
      lstDevIdno = new ArrayList();
      if ((relations != null) && (relations.size() > 0))
      {
        int i = 0;
        for (int j = relations.size(); i < j; i++)
        {
          StandardVehiDevRelationEx ralation = (StandardVehiDevRelationEx)relations.get(i);
          List<Map<String, Object>> device = (List)mapVehicle.get(ralation.getVehiIdno());
          if (device == null) {
            device = new ArrayList();
          }
          Map<String, Object> mapDev = new HashMap();
          mapDev.put("did", ralation.getDevIdno());
          if ((ralation.getModule().intValue() >> 0 & 0x1) > 0) {
            mapDev.put("type", Integer.valueOf(1));
          } else {
            mapDev.put("type", Integer.valueOf(0));
          }
          device.add(mapDev);
          mapVehicle.put(ralation.getVehiIdno(), device);
          lstDevIdno.add(ralation.getDevIdno());
          mapDev = null;
          device = null;
          ralation = null;
        }
      }
    }
    Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap(mapRelation);
    Map<String, Object> userRelation = (Map)synmapRelation.get(userAccount.getId().toString());
    if (userRelation == null)
    {
      userRelation = new HashMap();
      synmapRelation.put(userAccount.getId().toString(), userRelation);
    }
    userRelation.put("api_relation_update_time", Long.valueOf(new Date().getTime() / 1000L));
    userRelation.put("api_relation_vehicle", mapVehicle);
    userRelation.put("api_relation_devIdno", lstDevIdno);
    userRelation.put("api_user_companyId", userAccount.getCompany().getId());
    userRelation.put("api_relation_isAdmin", Boolean.valueOf(isAdmin));
    userRelation.put("api_relation_isMaster", Boolean.valueOf(isMaster));
    if (addLoginLog) {
      userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
        Integer.valueOf(1), sessionId, request.getRemoteAddr(), null, 
        String.format("%d", new Object[] { Integer.valueOf(5) }), null);
    }
    addCustomResponse("jsession", sessionId);
  }
  
  public String loginEx()
  {
    try
    {
      String account = getRequestStringEx("account");
      String password = getRequestStringEx("password");
      if ((account == null) || (password.isEmpty()) || (password == null) || (password.isEmpty()))
      {
        account = getOpenAccount();
        password = getOpenPassword();
      }
      HttpServletRequest request = ServletActionContext.getRequest();
      if ((password != null) && (!password.isEmpty())) {
        password = MD5EncryptUtils.encrypt(password);
      }
      StandardUserAccount userAccount = this.standardUserService.getStandardUserAccountByAccount(account);
      if (userAccount == null)
      {
        userService.addUserLog(null, Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), account, password, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else if ((userAccount.getPassword() != null) && (!userAccount.getPassword().isEmpty()) && 
        (password.equalsIgnoreCase(userAccount.getPassword())))
      {
        if ((userAccount.getStatus() == null) || (userAccount.getStatus().intValue() == 0)) {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
        } else if (userAccount.getStatus().intValue() == 2) {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        } else if (!"admin".equalsIgnoreCase(account))
        {
          if ((userAccount.getValidity() != null) && (DateUtil.compareDate(new Date(), userAccount.getValidity()))) {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          } else {
            doLoginSuc(request, userAccount, true, getServerGuid());
          }
        }
        else {
          doLoginSuc(request, userAccount, true, getServerGuid());
        }
      }
      else
      {
        userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), userAccount.getAccount(), password, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  private boolean isLogining(String jsession)
  {
    HttpServletRequest request = ServletActionContext.getRequest();
    ServletContext application = request.getSession().getServletContext();
    try
    {
      Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
      if ((synmapSession != null) && (synmapSession.size() > 0))
      {
        Map<String, Object> mapUser = (Map)synmapSession.get(jsession);
        if (mapUser != null)
        {
          mapUser.put("api_user_update_time", Long.valueOf(new Date().getTime() / 1000L));
          return true;
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
    return false;
  }
  
  private boolean isVehiOpRole(String jsession, String vehiIdno, String devIdno)
  {
    if (((vehiIdno != null) && (!vehiIdno.isEmpty())) || ((devIdno != null) && (!devIdno.isEmpty())))
    {
      int userId = getSessionUserIdEx(jsession);
      HttpServletRequest request = ServletActionContext.getRequest();
      ServletContext application = request.getSession().getServletContext();
      try
      {
        Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
        if ((synmapRelation != null) && (synmapRelation.size() > 0))
        {
          Map<String, Object> userRelation = (Map)synmapRelation.get(userId);
          if (userRelation != null)
          {
            if ((vehiIdno != null) && (!vehiIdno.isEmpty()) && 
              (((Map)userRelation.get("api_relation_vehicle")).get(vehiIdno) != null)) {
              return true;
            }
            if ((devIdno != null) && (!devIdno.isEmpty()) && 
              (((List)userRelation.get("api_relation_devIdno")).contains(devIdno))) {
              return true;
            }
          }
        }
      }
      catch (NullPointerException localNullPointerException) {}
    }
    return false;
  }
  
  private String getVehiOpRoleStr(String jsession, String vehiIdno, String devIdno)
  {
    if (((vehiIdno != null) && (!vehiIdno.isEmpty())) || ((devIdno != null) && (!devIdno.isEmpty())))
    {
      int userId = getSessionUserIdEx(jsession);
      HttpServletRequest request = ServletActionContext.getRequest();
      ServletContext application = request.getSession().getServletContext();
      try
      {
        Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
        if ((synmapRelation != null) && (synmapRelation.size() > 0))
        {
          Map<String, Object> userRelation = (Map)synmapRelation.get(userId);
          if (userRelation != null)
          {
            if ((vehiIdno != null) && (!vehiIdno.isEmpty()))
            {
              String[] vehiIdnos = vehiIdno.split(",");
              StringBuffer buffVehiIdno = new StringBuffer();
              Map<String, Object> MapVehicle = Collections.synchronizedMap((Map)userRelation.get("api_relation_vehicle"));
              for (int i = 0; i < vehiIdnos.length; i++) {
                if (MapVehicle.get(vehiIdnos[i]) != null)
                {
                  if (buffVehiIdno.length() > 0) {
                    buffVehiIdno.append(",");
                  }
                  buffVehiIdno.append(vehiIdnos[i]);
                }
              }
              return buffVehiIdno.toString();
            }
            if ((devIdno != null) && (!devIdno.isEmpty()))
            {
              String[] devIdnos = devIdno.split(",");
              StringBuffer buffDevIdno = new StringBuffer();
              List<String> lstDevIdno = Collections.synchronizedList((List)userRelation.get("api_relation_devIdno"));
              for (int i = 0; i < devIdnos.length; i++) {
                if (lstDevIdno.contains(devIdnos[i]))
                {
                  if (buffDevIdno.length() > 0) {
                    buffDevIdno.append(",");
                  }
                  buffDevIdno.append(devIdnos[i]);
                }
              }
              return buffDevIdno.toString();
            }
          }
        }
      }
      catch (NullPointerException localNullPointerException) {}
    }
    return "";
  }
  
  private List<String> getVehiOpRoleStr(String jsession, Integer type)
  {
    int userId = getSessionUserIdEx(jsession);
    HttpServletRequest request = ServletActionContext.getRequest();
    ServletContext application = request.getSession().getServletContext();
    try
    {
      Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
      if ((synmapRelation != null) && (synmapRelation.size() > 0))
      {
        Map<String, Object> userRelation = (Map)synmapRelation.get(userId);
        if ((userRelation != null) && 
          (type != null))
        {
          if (type.intValue() == 1)
          {
            Map<String, Object> MapVehicle = Collections.synchronizedMap((Map)userRelation.get("api_relation_vehicle"));
            return new ArrayList(MapVehicle.keySet());
          }
          if (type.intValue() == 2) {
            return (List)userRelation.get("api_relation_devIdno");
          }
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
    return null;
  }
  
  private Map<String, Object> getVehiDeviceMap(String jsession, String vehiIdno)
  {
    Map<String, Object> mapVehiDevice = new HashMap();
    
    int userId = getSessionUserIdEx(jsession);
    HttpServletRequest request = ServletActionContext.getRequest();
    ServletContext application = request.getSession().getServletContext();
    try
    {
      Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
      if ((synmapRelation != null) && (synmapRelation.size() > 0))
      {
        Map<String, Object> userRelation = (Map)synmapRelation.get(userId);
        if ((userRelation != null) && (userRelation.get("api_relation_vehicle") != null))
        {
          String[] vehiIdnos = vehiIdno.split(",");
          
          Map<String, Object> MapVehicle = Collections.synchronizedMap((Map)userRelation.get("api_relation_vehicle"));
          for (int i = 0; i < vehiIdnos.length; i++)
          {
            List<Map<String, Object>> lstDevice = (List)MapVehicle.get(vehiIdnos[i]);
            if ((lstDevice != null) && (lstDevice.size() > 0)) {
              mapVehiDevice.put(vehiIdnos[i], lstDevice);
            }
          }
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
    return mapVehiDevice;
  }
  
  public String logout()
    throws Exception
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      if ((jsession != null) && (!jsession.isEmpty()))
      {
        if (isLogining(jsession))
        {
          HttpServletRequest request = ServletActionContext.getRequest();
          ServletContext application = request.getSession().getServletContext();
          try
          {
            Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
            if ((synmapSession == null) || (synmapSession.size() <= 0)) {
              
            }
            synmapSession.remove(jsession);
          }
          catch (NullPointerException localNullPointerException) {}
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    label145:
    return "success";
  }
  
  public String getDeviceByVehicle()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String vehiIdno = getRequestStringEx("vehiIdno");
      if ((jsession != null) && (!jsession.isEmpty()) && (vehiIdno != null) && (!vehiIdno.isEmpty()))
      {
        if (isLogining(jsession))
        {
          String opVehiIdno = getVehiOpRoleStr(jsession, vehiIdno, null);
          if ((opVehiIdno != null) && (!opVehiIdno.isEmpty()))
          {
            Map<String, Object> mapVehiDevice = getVehiDeviceMap(jsession, opVehiIdno);
            List<Map<String, Object>> lstDevice = new ArrayList();
            String[] opVehiIdnos = opVehiIdno.split(",");
            for (int i = 0; i < opVehiIdnos.length; i++)
            {
              List<Map<String, Object>> lstDevice_ = (List)mapVehiDevice.get(opVehiIdnos[i]);
              if ((lstDevice_ != null) && (lstDevice_.size() > 0)) {
                for (int j = 0; j < lstDevice_.size(); j++)
                {
                  ((Map)lstDevice_.get(j)).put("vid", opVehiIdnos[i]);
                  lstDevice.add((Map)lstDevice_.get(j));
                }
              }
            }
            addCustomResponse("devices", lstDevice);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  private void setVehiOpRoleStrAndRelation(String jsession, String vehiIdno, String devIdno, StringBuffer opDevIdno, Map<String, String> mapDeviceVehi)
  {
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      opDevIdno.append(getVehiOpRoleStr(jsession, null, devIdno));
    }
    if ((opDevIdno == null) || (opDevIdno.length() == 0)) {
      if ((vehiIdno != null) && (!vehiIdno.isEmpty()))
      {
        String opVehiIdno = getVehiOpRoleStr(jsession, vehiIdno, null);
        if ((opVehiIdno != null) && (!opVehiIdno.isEmpty()))
        {
          Map<String, Object> mapVehiDevice = getVehiDeviceMap(jsession, opVehiIdno);
          String[] opVehiIdnos = opVehiIdno.split(",");
          StringBuffer bufDevIdno = new StringBuffer();
          for (int i = 0; i < opVehiIdnos.length; i++)
          {
            List<Map<String, Object>> lstDevice = (List)mapVehiDevice.get(opVehiIdnos[i]);
            if ((lstDevice != null) && (lstDevice.size() > 0)) {
              for (int j = 0; j < lstDevice.size(); j++)
              {
                if (bufDevIdno.length() > 0) {
                  bufDevIdno.append(",");
                }
                bufDevIdno.append(((Map)lstDevice.get(j)).get("did"));
                if (mapDeviceVehi != null) {
                  mapDeviceVehi.put(((Map)lstDevice.get(j)).get("did").toString(), opVehiIdnos[i]);
                }
              }
            }
          }
          opDevIdno.append(bufDevIdno);
        }
      }
    }
  }
  
  public String getDeviceOlStatus()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String devIdno = getRequestStringEx("devIdno");
      String vehiIdno = getRequestStringEx("vehiIdno");
      if ((jsession != null) && (!jsession.isEmpty()) && (
        ((devIdno != null) && (!devIdno.isEmpty())) || ((vehiIdno != null) && (!vehiIdno.isEmpty()))))
      {
        if (isLogining(jsession))
        {
          Map<String, String> mapDeviceVehi = new HashMap();
          
          StringBuffer opDevIdno = new StringBuffer();
          
          setVehiOpRoleStrAndRelation(jsession, vehiIdno, devIdno, opDevIdno, mapDeviceVehi);
          if ((opDevIdno != null) && (opDevIdno.length() > 0))
          {
            List<DeviceStatusLite> lstStatus = this.standardMonitorService.getDeviceStatusLite(opDevIdno.toString().split(","));
            if ((lstStatus != null) && (lstStatus.size() > 0))
            {
              List<Map<String, Object>> lstOnline = new ArrayList();
              Map<String, Object> mapOnline = null;
              for (int i = 0; i < lstStatus.size(); i++)
              {
                mapOnline = new HashMap();
                mapOnline.put("vid", mapDeviceVehi.get(((DeviceStatusLite)lstStatus.get(i)).getId()));
                mapOnline.put("did", ((DeviceStatusLite)lstStatus.get(i)).getId());
                if ((((DeviceStatusLite)lstStatus.get(i)).getOl() != null) && (((DeviceStatusLite)lstStatus.get(i)).getOl().intValue() != 0)) {
                  mapOnline.put("online", ((DeviceStatusLite)lstStatus.get(i)).getOl());
                } else {
                  mapOnline.put("online", Integer.valueOf(0));
                }
                lstOnline.add(mapOnline);
              }
              addCustomResponse("onlines", lstOnline);
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public String getDeviceStatus()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String devIdno = getRequestStringEx("devIdno");
      String vehiIdno = getRequestStringEx("vehiIdno");
      String toMap = getRequestStringEx("toMap");
      if ((jsession != null) && (!jsession.isEmpty()) && (
        ((devIdno != null) && (!devIdno.isEmpty())) || ((vehiIdno != null) && (!vehiIdno.isEmpty()))))
      {
        if (isLogining(jsession))
        {
          Map<String, String> mapDeviceVehi = new HashMap();
          
          StringBuffer opDevIdno = new StringBuffer();
          
          setVehiOpRoleStrAndRelation(jsession, vehiIdno, devIdno, opDevIdno, mapDeviceVehi);
          if ((opDevIdno != null) && (opDevIdno.length() > 0))
          {
            List<DeviceStatusLite> lstStatus = this.standardMonitorService.getDeviceStatusLite(opDevIdno.toString().split(","));
            if ((lstStatus != null) && (lstStatus.size() > 0))
            {
              for (int i = 0; i < lstStatus.size(); i++)
              {
                DeviceStatusLite status = (DeviceStatusLite)lstStatus.get(i);
                if (status.getLng() == null) {
                  status.setLng(Integer.valueOf(0));
                }
                if (status.getLat() == null) {
                  status.setLat(Integer.valueOf(0));
                }
                GpsValue gpsValue = ConvertUtil.convert(status.getLng(), status.getLat(), toMap);
                status.setMlng(gpsValue.getMapJingDu());
                status.setMlat(gpsValue.getMapWeiDu());
                
                status.setVid((String)mapDeviceVehi.get(status.getId()));
              }
              addCustomResponse("status", lstStatus);
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  protected void queryGpsTrackEx(String distance, String parkTime, Pagination pagination)
    throws Exception
  {
    String begintime = getRequestStringEx("begintime");
    String endtime = getRequestStringEx("endtime");
    String devIdno = getRequestStringEx("devIdno");
    String toMap = getRequestStringEx("toMap");
    String jsession = getRequestStringEx("jsession");
    String vehiIdno = getRequestStringEx("vehiIdno");
    if ((jsession == null) || (jsession.isEmpty()) || (begintime == null) || (endtime == null) || (
      ((devIdno != null) && (!devIdno.isEmpty()) && (devIdno.indexOf(",") < 0)) || (
      (vehiIdno == null) || (vehiIdno.isEmpty()) || (vehiIdno.indexOf(",") >= 0) || 
      (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
    }
    else if (!isLogining(jsession))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    else if (DateUtil.compareStrLongTime(begintime, endtime) >= 1)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
    }
    else if (DateUtil.dateCompareStrLongTimeRange(begintime, endtime, 7))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(10));
    }
    else if (!isVehiOpRole(jsession, vehiIdno, devIdno))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
    else
    {
      int meter = 0;
      if ((distance != null) && (!distance.isEmpty())) {
        meter = (int)(Double.parseDouble(distance) * 1000.0D);
      }
      int park = 0;
      if ((parkTime != null) && (!parkTime.isEmpty())) {
        park = Integer.parseInt(parkTime);
      }
      if ((devIdno == null) || (devIdno.isEmpty())) {
        devIdno = getGPSDevIdno(vehiIdno);
      }
      AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), meter, 0, 0, park, 0, 0, pagination, toMap, devIdno);
      
      List<StandardDeviceTrack> tracks = ajaxDto.getPageList();
      List<DeviceStatusLite> tracklites = null;
      if (tracks != null)
      {
        String[] devIdnos = new String[1];
        devIdnos[0] = devIdno;
        AjaxDto<DeviceStatusLite> dtoAjax = this.deviceService.getDeviceStatusLite(devIdnos);
        DeviceStatusLite status = null;
        if ((dtoAjax.getPageList() != null) && (dtoAjax.getPageList().size() >= 1)) {
          status = (DeviceStatusLite)dtoAjax.getPageList().get(0);
        }
        tracklites = new ArrayList();
        int toMap_ = 2;
        try
        {
          toMap_ = Integer.parseInt(toMap);
        }
        catch (Exception e)
        {
          toMap_ = 2;
        }
        for (int i = 0; i < tracks.size(); i++)
        {
          if (isGpsValid(((StandardDeviceTrack)tracks.get(i)).getStatus1())) {
            ((StandardDeviceTrack)tracks.get(i)).setPosition(getMapPositionEx(((StandardDeviceTrack)tracks.get(i)).getJingDu(), ((StandardDeviceTrack)tracks.get(i)).getWeiDu(), toMap_, getSession().get("WW_TRANS_I18N_LOCALE")));
          }
          DeviceStatusLite lite = new DeviceStatusLite();
          lite.setStatusLite((StandardDeviceTrack)tracks.get(i));
          if (status != null)
          {
            lite.setPt(status.getPt());
            lite.setDt(status.getDt());
            lite.setAc(status.getAc());
            lite.setFt(status.getFt());
            lite.setFdt(status.getFdt());
          }
          tracklites.add(lite);
        }
      }
      addCustomResponse("tracks", tracklites);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
  }
  
  public String queryTrackDetail()
  {
    try
    {
      String distance = getRequestStringEx("distance");
      String parkTime = getRequestStringEx("parkTime");
      String pageRecords = getRequestString("pageRecords");
      String currentPage = getRequestString("currentPage");
      if ((pageRecords != null) && (!pageRecords.isEmpty()) && 
        (currentPage != null) && (!currentPage.isEmpty())) {
        queryGpsTrackEx(distance, parkTime, getRequestPagination());
      } else {
        queryGpsTrackEx(distance, parkTime, null);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public String queryAlarmDetail()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String begintime = getRequestStringEx("begintime");
      String endtime = getRequestStringEx("endtime");
      String toMap = getRequestStringEx("toMap");
      String devIdno = getRequestStringEx("devIdno");
      String vehiIdno = getRequestStringEx("vehiIdno");
      if ((jsession != null) && (!jsession.isEmpty()) && (begintime != null) && (endtime != null) && (
        ((devIdno != null) && (!devIdno.isEmpty())) || ((vehiIdno != null) && (!vehiIdno.isEmpty()) && 
        (DateUtil.isLongTimeValid(begintime)) && (DateUtil.isLongTimeValid(endtime)))))
      {
        if (!isLogining(jsession))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
        else if (DateUtil.compareStrLongTime(begintime, endtime) >= 1)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
        }
        else if (DateUtil.dateCompareStrLongTimeRange(begintime, endtime, 90))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(10));
        }
        else
        {
          AjaxDto<StandardDeviceAlarm> ajaxDto = null;
          String armType = getRequestStringEx("armType");
          String handle = getRequestStringEx("handle");
          
          List<Integer> lstArmType = new ArrayList();
          if ((armType != null) && (!armType.isEmpty()))
          {
            String[] armTypes = armType.split(",");
            for (int i = 0; i < armTypes.length; i++) {
              lstArmType.add(Integer.valueOf(Integer.parseInt(armTypes[i])));
            }
          }
          String condition = "";
          if ((handle != null) && (!handle.isEmpty()) && ((handle.equals("0")) || (handle.equals("1")))) {
            condition = " and a.HandleStatus = " + handle;
          }
          boolean isOperate = false;
          if ((devIdno != null) && (!devIdno.isEmpty()))
          {
            String opDevIdno = getVehiOpRoleStr(jsession, null, devIdno);
            if ((opDevIdno != null) && (!opDevIdno.isEmpty()))
            {
              isOperate = true;
              ajaxDto = this.vehicleAlarmService.queryDeviceAlarmByDevice(begintime, endtime, 
                opDevIdno.split(","), lstArmType, null, condition + " order by a.ArmTimeStart desc", getRequestPagination());
            }
          }
          if ((ajaxDto == null) || (ajaxDto.getPageList() == null)) {
            if ((vehiIdno != null) && (!vehiIdno.isEmpty()))
            {
              String opVehiIdno = getVehiOpRoleStr(jsession, vehiIdno, null);
              if ((opVehiIdno != null) && (!opVehiIdno.isEmpty()))
              {
                isOperate = true;
                ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
                  opVehiIdno.split(","), lstArmType, null, condition + " order by ArmTimeStart asc", getRequestPagination(), null, null, null, null);
              }
            }
          }
          if (isOperate)
          {
            List<StandardDeviceAlarmEx> lstDeviceAlarm = null;
            if ((ajaxDto != null) && (ajaxDto.getPageList() != null))
            {
              List<StandardDeviceAlarm> deviceAlarms = ajaxDto.getPageList();
              lstDeviceAlarm = new ArrayList();
              Map<Integer, String> mapUser = new HashMap();
              for (int i = 0; i < deviceAlarms.size(); i++)
              {
                String[] handleInfo = handleFieldData(((StandardDeviceAlarm)deviceAlarms.get(i)).getHandleInfo());
                if (handleInfo != null)
                {
                  if (handleInfo.length > 0) {
                    try
                    {
                      ((StandardDeviceAlarm)deviceAlarms.get(i)).setHandleuser(getUserName(mapUser, Integer.valueOf(Integer.parseInt(handleInfo[0]))));
                    }
                    catch (Exception e)
                    {
                      ((StandardDeviceAlarm)deviceAlarms.get(i)).setHandleuser(handleInfo[0]);
                    }
                  }
                  if (handleInfo.length > 1) {
                    ((StandardDeviceAlarm)deviceAlarms.get(i)).setHandleTime(handleInfo[1]);
                  }
                  if (handleInfo.length > 2) {
                    ((StandardDeviceAlarm)deviceAlarms.get(i)).setHandleContent(handleInfo[2]);
                  }
                }
                StandardDeviceAlarmEx deviceAlarmEx = new StandardDeviceAlarmEx();
                deviceAlarmEx.setDevAlarmEx((StandardDeviceAlarm)deviceAlarms.get(i), toMap);
                lstDeviceAlarm.add(deviceAlarmEx);
              }
            }
            addCustomResponse("alarms", lstDeviceAlarm);
            addCustomResponse("pagination", ajaxDto.getPagination());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public String addDownloadTask()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String did = getRequestStringEx("did");
      String fbtm = getRequestStringEx("fbtm");
      String fetm = getRequestStringEx("fetm");
      String sbtm = getRequestStringEx("sbtm");
      String setm = getRequestStringEx("setm");
      String lab = getRequestStringEx("lab");
      String fph = getRequestStringEx("fph");
      String vtp = getRequestStringEx("vtp");
      String len = getRequestStringEx("len");
      String chn = getRequestStringEx("chn");
      String dtp = getRequestStringEx("dtp");
      if ((jsession == null) || (jsession.isEmpty()) || (did == null) || (did.isEmpty()) || (fph == null) || (fph.isEmpty()) || 
        (!DateUtil.isLongTimeValid(fbtm)) || (!DateUtil.isLongTimeValid(fetm)) || (!DateUtil.isLongTimeValid(sbtm)) || 
        (!DateUtil.isLongTimeValid(setm)) || (vtp == null) || (vtp.isEmpty()) || (len == null) || (len.isEmpty()) || 
        (chn == null) || (chn.isEmpty()) || (dtp == null) || (dtp.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
      else
      {
        StandardStorageDownTaskReal taskReal = new StandardStorageDownTaskReal();
        try
        {
          taskReal.setDid(did);
          taskReal.setChn(Integer.valueOf(Integer.parseInt(chn)));
          taskReal.setCtm(new Date());
          taskReal.setDtp(Integer.valueOf(Integer.parseInt(dtp)));
          taskReal.setFbtm(DateUtil.StrLongTime2Date(fbtm));
          taskReal.setFetm(DateUtil.StrLongTime2Date(fetm));
          taskReal.setFph(fph);
          taskReal.setFtp(Integer.valueOf(2));
          taskReal.setLab(lab);
          taskReal.setLen(Integer.valueOf(Integer.parseInt(len)));
          taskReal.setSbtm(DateUtil.StrLongTime2Date(sbtm));
          taskReal.setSetm(DateUtil.StrLongTime2Date(setm));
          taskReal.setStu(Integer.valueOf(1));
          taskReal.setVtp(Integer.valueOf(Integer.parseInt(vtp)));
          taskReal.setUid(Integer.valueOf(getSessionUserIdEx(jsession)));
          if ((DateUtil.compareStrLongTime(fbtm, fetm) >= 1) || 
            (DateUtil.compareStrLongTime(sbtm, setm) >= 1))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
          }
          else if (!isLogining(jsession))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
          }
          else if (!isVehiOpRole(jsession, null, did))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
          else
          {
            StandardStorageDownTaskReal oldTaskReal = this.videoTrackService.getDownTaskReal(taskReal.getDid(), taskReal.getFph().replaceAll("\\\\", "\\\\\\\\"), DateUtil.dateSwitchString(taskReal.getFbtm()), DateUtil.dateSwitchString(taskReal.getFetm()), taskReal.getChn());
            StandardStorageDownTaskAll oldTaskAll = this.videoTrackService.getDownTaskAll(taskReal.getDid(), taskReal.getFph().replaceAll("\\\\", "\\\\\\\\"), Integer.valueOf((int)(taskReal.getFbtm().getTime() / 1000L)), Integer.valueOf((int)(taskReal.getFetm().getTime() / 1000L)), taskReal.getChn());
            if ((oldTaskReal == null) && (oldTaskAll == null))
            {
              StandardStorageDownTaskAll taskAll = new StandardStorageDownTaskAll();
              taskAll.setTaskInfo(taskReal);
              this.videoTrackService.saveDownloadTaskInfo(taskReal, taskAll);
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
            }
          }
        }
        catch (Exception e)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
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
  
  public String getUserServer()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      if ((jsession != null) && (!jsession.isEmpty()))
      {
        if (isLogining(jsession))
        {
          ServerInfo userServer = this.serverService.getOnlineServer(4);
          ResultServer server = new ResultServer();
          if (userServer != null) {
            server.setServerInfoEx(userServer);
          }
          addCustomResponse("server", server);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public String getVideoDevice()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String vehiIdno = getRequestStringEx("vehiIdno");
      String devIdno = getRequestStringEx("devIdno");
      if ((jsession != null) && (!jsession.isEmpty()))
      {
        if (isLogining(jsession))
        {
          StandardVehiDevRelationEx relation = null;
          if (isVehiOpRole(jsession, null, devIdno))
          {
            List<StandardVehiDevRelationEx> relations = this.standardUserService.getStandardVehiDevRelationExList(null, devIdno);
            if ((relations != null) && (relations.size() > 0)) {
              if ((((StandardVehiDevRelationEx)relations.get(0)).getModule().intValue() >> 0 & 0x1) > 0) {
                relation = (StandardVehiDevRelationEx)relations.get(0);
              } else {
                addCustomResponse("isVideoDevice", Integer.valueOf(0));
              }
            }
          }
          else if (isVehiOpRole(jsession, vehiIdno, null))
          {
            List<StandardVehiDevRelationEx> relations = this.standardUserService.getStandardVehiDevRelationExList(vehiIdno, null);
            if ((relations != null) && (relations.size() > 0)) {
              if (relations.size() == 1)
              {
                relation = (StandardVehiDevRelationEx)relations.get(0);
              }
              else
              {
                for (int i = 0; i < relations.size(); i++) {
                  if ((((StandardVehiDevRelationEx)relations.get(i)).getModule().intValue() >> 0 & 0x1) > 0) {
                    relation = (StandardVehiDevRelationEx)relations.get(i);
                  }
                }
                if (relation == null) {
                  relation = (StandardVehiDevRelationEx)relations.get(0);
                }
              }
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
          if (relation != null)
          {
            addCustomResponse("isVideoDevice", Integer.valueOf(1));
            addCustomResponse("devIdno", relation.getDevIdno());
            if ((relation.getChnAttr() != null) && (!relation.getChnAttr().isEmpty())) {
              addCustomResponse("chnCount", Integer.valueOf(relation.getChnAttr().split(",").length));
            } else {
              addCustomResponse("chnCount", Integer.valueOf(1));
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public void setMapDevStatus(String devIdnos, String toMap, Map<String, DeviceStatusLite> mapStatus)
  {
    if ((devIdnos != null) && (!devIdnos.isEmpty()))
    {
      List<DeviceStatusLite> lstStatus = this.standardMonitorService.getDeviceStatusLite(devIdnos.split(","));
      if ((lstStatus != null) && (lstStatus.size() > 0))
      {
        DeviceStatusLite status = null;
        int i = 0;
        for (int j = lstStatus.size(); i < j; i++)
        {
          status = (DeviceStatusLite)lstStatus.get(i);
          
          GpsValue gpsValue = ConvertUtil.convert(status.getLng(), status.getLat(), toMap);
          status.setMlng(gpsValue.getMapJingDu());
          status.setMlat(gpsValue.getMapWeiDu());
          if (status.getLng() == null) {
            status.setLng(Integer.valueOf(0));
          }
          if (status.getLat() == null) {
            status.setLat(Integer.valueOf(0));
          }
          if (mapStatus != null) {
            mapStatus.put(status.getId(), status);
          }
        }
      }
    }
  }
  
  public String getVehicleDevice()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      String vehiIdno = getRequestStringEx("vehiIdno");
      String devIdno = getRequestStringEx("devIdno");
      String toMap = getRequestStringEx("toMap");
      if ((jsession != null) && (!jsession.isEmpty()) && (
        ((devIdno != null) && (!devIdno.isEmpty())) || ((vehiIdno != null) && (!vehiIdno.isEmpty()))))
      {
        if (isLogining(jsession))
        {
          Map<String, String> mapDeviceVehi = new HashMap();
          
          StringBuffer opDevIdno = new StringBuffer();
          
          setVehiOpRoleStrAndRelation(jsession, vehiIdno, devIdno, opDevIdno, mapDeviceVehi);
          VehicleLiteEx lite = new VehicleLiteEx();
          if ((opDevIdno != null) && (opDevIdno.length() > 0))
          {
            List<StandardVehiDevRelationExMore> relations = null;
            
            List<QueryScalar> scalars = new ArrayList();
            scalars.add(new QueryScalar("devComId", StandardBasicTypes.INTEGER));
            String fieldCondition = ", b.CompanyID as devComId";
            String queryCondition = ",jt808_device_info b where a.DevIDNO = b.DevIDNO ";
            if ((devIdno != null) && (!devIdno.isEmpty())) {
              relations = this.standardUserService.getStandardVehiDevRelationExMoreList(null, devIdno, scalars, fieldCondition, queryCondition);
            } else {
              relations = this.standardUserService.getStandardVehiDevRelationExMoreList(vehiIdno, null, scalars, fieldCondition, queryCondition);
            }
            if ((relations != null) && (relations.size() > 0))
            {
              if ((devIdno != null) && (!devIdno.isEmpty())) {
                vehiIdno = ((StandardVehiDevRelationExMore)relations.get(0)).getVehiIdno();
              }
              StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehiIdno);
              
              Map<String, DeviceStatusLite> mapStatus = new HashMap();
              setMapDevStatus(opDevIdno.toString(), toMap, mapStatus);
              
              setVehiLiteInfos(relations, vehicle, null, mapStatus, lite, null);
            }
            addCustomResponse("vehicle", lite);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public void setVehiLiteInfos(List<StandardVehiDevRelationExMore> relations, StandardVehicle vehicle, List<StandardVehicle> lstVehicle, Map<String, DeviceStatusLite> mapStatus, VehicleLiteEx lite, List<VehicleLiteEx> lstLite)
  {
    if ((relations != null) && (relations.size() > 0))
    {
      Map<String, List<DeviceLiteEx>> mapDevice = new HashMap();
      StandardVehiDevRelationExMore relation = null;
      DeviceLiteEx deviceLite = null;
      List<DeviceLiteEx> devices = null;
      int i = 0;
      for (int j = relations.size(); i < j; i++)
      {
        relation = (StandardVehiDevRelationExMore)relations.get(i);
        deviceLite = new DeviceLiteEx();
        deviceLite.setId(relation.getDevIdno());
        deviceLite.setPid(relation.getDevComId());
        
        String[] params_chn = getChannelParamToDev("CH", relation.getChnAttr(), relation.getChnName());
        deviceLite.setCc(Integer.valueOf(Integer.parseInt(params_chn[0])));
        deviceLite.setCn(params_chn[1]);
        
        String[] params_ioin = getChannelParamToDev("IO_", relation.getIoInAttr(), relation.getIoInName());
        deviceLite.setIc(Integer.valueOf(Integer.parseInt(params_ioin[0])));
        deviceLite.setIo(params_ioin[1]);
        
        String[] params_temp = getChannelParamToDev("TEMP_", relation.getIoInAttr(), relation.getTempName());
        deviceLite.setTc(Integer.valueOf(Integer.parseInt(params_temp[0])));
        deviceLite.setTn(params_temp[1]);
        
        deviceLite.setMd(relation.getModule());
        if (relation.getCardNum() != null) {
          deviceLite.setSim(relation.getCardNum());
        }
        deviceLite.setNflt(relation.getNflt());
        if (mapStatus != null) {
          deviceLite.setSt((DeviceStatusLite)mapStatus.get(relation.getDevIdno()));
        }
        if (mapDevice.get(relation.getVehiIdno()) == null)
        {
          devices = new ArrayList();
          devices.add(deviceLite);
          mapDevice.put(relation.getVehiIdno(), devices);
        }
        else
        {
          devices = (List)mapDevice.get(relation.getVehiIdno());
          devices.add(deviceLite);
          mapDevice.put(relation.getVehiIdno(), devices);
        }
      }
      relations = null;
      mapStatus = null;
      if (vehicle != null)
      {
        lite.setNm(vehicle.getVehiIDNO());
        lite.setPid(vehicle.getCompany().getId());
        lite.setIc(vehicle.getIcon());
        devices = (List)mapDevice.get(vehicle.getVehiIDNO());
        lite.setDl(devices);
        if ((devices != null) && (devices.size() > 0) && 
          (vehicle.getDriver() != null))
        {
          lite.setDn(vehicle.getDriver().getName());
          lite.setDt(vehicle.getDriver().getJobNum());
        }
        vehicle = null;
        mapDevice = null;
      }
      else if ((lstVehicle != null) && (lstVehicle.size() > 0))
      {
        StandardVehicle vehicle_ = null;
        VehicleLiteEx lite_ = null;
         i = 0;
        for (int j = lstVehicle.size(); i < j; i++)
        {
          lite_ = new VehicleLiteEx();
          vehicle_ = (StandardVehicle)lstVehicle.get(i);
          lite_.setId(vehicle_.getId());
          lite_.setNm(vehicle_.getVehiIDNO());
          lite_.setPid(vehicle_.getCompany().getId());
          lite_.setIc(vehicle_.getIcon());
          devices = (List)mapDevice.get(vehicle_.getVehiIDNO());
          lite_.setDl(devices);
          if ((devices != null) && (devices.size() > 0))
          {
            if (vehicle_.getDriver() != null)
            {
              lite_.setDn(vehicle_.getDriver().getName());
              lite_.setDt(vehicle_.getDriver().getJobNum());
            }
            lstLite.add(lite_);
          }
        }
        lstVehicle = null;
        mapDevice = null;
      }
    }
  }
  
  public String queryUserVehicle()
  {
    try
    {
      String jsession = getRequestStringEx("jsession");
      if ((jsession != null) && (!jsession.isEmpty()))
      {
        if (isLogining(jsession))
        {
          List<String> lstVehiIdno = getVehiOpRoleStr(jsession, Integer.valueOf(1));
          
          HttpServletRequest request = ServletActionContext.getRequest();
          ServletContext application = request.getSession().getServletContext();
          
          Map<String, StandardVehicle> mapRelation = Collections.synchronizedMap((Map)application.getAttribute("map_vehicles"));
          List<StandardVehicle> lstVehicle = new ArrayList();
          if ((lstVehiIdno != null) && (mapRelation != null)) {
            for (int i = 0; i < lstVehiIdno.size(); i++) {
              if (mapRelation.get(lstVehiIdno.get(i)) != null) {
                lstVehicle.add((StandardVehicle)mapRelation.get(lstVehiIdno.get(i)));
              }
            }
          }
          List<VehicleLiteEx> lstLite = new ArrayList();
          if ((lstVehiIdno != null) && (lstVehiIdno.size() > 0))
          {
            List<QueryScalar> scalars = new ArrayList();
            scalars.add(new QueryScalar("nflt", StandardBasicTypes.INTEGER));
            scalars.add(new QueryScalar("devComId", StandardBasicTypes.INTEGER));
            scalars.add(new QueryScalar("chnName", StandardBasicTypes.STRING));
            scalars.add(new QueryScalar("ioInName", StandardBasicTypes.STRING));
            scalars.add(new QueryScalar("tempName", StandardBasicTypes.STRING));
            scalars.add(new QueryScalar("cardNum", StandardBasicTypes.STRING));
            String fieldCondition = ",b.nFlowLimitType as nflt, b.CompanyID as devComId, c.ChnName as chnName, c.IOInName as ioInName, c.TempName as tempName, b.SimCard as cardNum";
            String queryCondition = ",jt808_device_info b,jt808_vehicle_info c where a.DevIDNO = b.DevIDNO and a.VehiIDNO = c.VehiIDNO";
            List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, scalars, fieldCondition, queryCondition);
            if ((relations != null) && (relations.size() > 0)) {
              setVehiLiteInfos(relations, null, lstVehicle, null, null, lstLite);
            }
          }
          addCustomResponse("vehicles", lstLite);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  public String findLastPosition()
  {
    try
    {
      String begintime = getRequestStringEx("begintime");
      String endtime = getRequestStringEx("endtime");
      String vehiIdno = getRequestStringEx("vehiIdno");
      if ((begintime == null) || (endtime == null) || (vehiIdno == null) || (vehiIdno.isEmpty()) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
      else
      {
        String toMap = getRequestStringEx("toMap");
        int meter = 0;
        int park = 0;
        String devIdno = null;
        if ((devIdno == null) || (devIdno.isEmpty())) {
          devIdno = getGPSDevIdno(vehiIdno);
        }
        AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, 0, 0, park, 0, 0, null, toMap, devIdno);
        
        StandardDeviceTrack track = null;
        if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
        {
          List<StandardDeviceTrack> lstTrack = ajaxDto.getPageList();
          int i = 0;
          for (int j = lstTrack.size(); i < j; i++) {
            if (isGpsValid(((StandardDeviceTrack)lstTrack.get(i)).getStatus1())) {
              track = (StandardDeviceTrack)lstTrack.get(i);
            }
          }
        }
        int toMap_ = 2;
        try
        {
          toMap_ = Integer.parseInt(toMap);
        }
        catch (Exception e)
        {
          toMap_ = 2;
        }
        String position = "";
        String gpstime = "";
        if (track != null)
        {
          position = getMapPositionEx(track.getJingDu(), track.getWeiDu(), toMap_, getSession().get("WW_TRANS_I18N_LOCALE"));
          gpstime = track.getGpsTime();
        }
        addCustomResponse("position", position);
        addCustomResponse("gpstime", gpstime);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
    }
    return "success";
  }
  
  protected boolean checkPrivi()
  {
    return true;
  }
}
