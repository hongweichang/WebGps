package com.gps.user.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.listener.UserBindingListener;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.Configuration;
import com.framework.utils.DateUtil;
import com.framework.utils.SendEmailUtil;
import com.framework.web.action.BaseAction;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceInfo;
import com.gps.model.LiveVideoSession;
import com.gps.model.RememberKey;
import com.gps.model.ResetPassword;
import com.gps.model.ServerInfo;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.model.UserSession;
import com.gps.system.vo.Password;
import com.gps.user.model.UserAlarmShield;
import com.gps.user.service.RememberKeyService;
import com.gps.user.service.UserAlarmShieldService;
import com.gps.user.service.VerifyInfoService;
import com.gps.user.vo.DownInfo;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.opensymphony.xwork2.ActionContext;
import java.io.File;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.struts2.ServletActionContext;
import org.springframework.jdbc.UncategorizedSQLException;

public class LoginAction
  extends UserBaseAction
{
  public static final int LOGIN_RET_SUCCESS = 0;
  public static final int LOGIN_RET_NAME_ERROR = 1;
  public static final int LOGIN_RET_PWD_ERROR = 2;
  public static final int LOGIN_RET_EXPIRE_ERROR = 3;
  public static final int LOGIN_RET_VERIFICATION_ERROR = 4;
  public static final int LOGIN_RET_EXCEPTION_ERROR = 5;
  public static final int LOGIN_RET_SERVER_NO_SUPPORT = 6;
  public static final int LOGIN_RET_SESSION_ERROR = 7;
  private static final long serialVersionUID = 1L;
  private static int gViewer_androidVersionCode = -1;
  private static String gViewer_androidVersionName = "";
  private static String gViewer_androidFile = "";
  private static int gViewer_androidBaiduVersionCode = -1;
  private static String gViewer_androidBaiduVersionName = "";
  private static String gViewer_androidBaiduFile = "";
  private static int gMonitor_androidVersionCode = -1;
  private static String gMonitor_androidVersionName = "";
  private static String gMonitor_androidFile = "";
  private static boolean gIsReadInformation = false;
  private static String gChineseSystemTitle = "";
  private static String gChineseMainTitle = "";
  private static String gChineseCopyright = "";
  private static String gEnglishSystemTitle = "";
  private static String gEnglishMainTitle = "";
  private static String gEnglishCopyright = "";
  private static String gTwSystemTitle = "";
  private static String gTwMainTitle = "";
  private static String gTwCopyright = "";
  private static boolean isAddLive = false;
  private static final String DOWN_ICON_WINDOWS = "downicon windowns";
  private static final String DOWN_ICON_APPLE = "downicon apple";
  private static final String DOWN_ICON_ANDROID = "downicon android";
  private UserAlarmShieldService userAlarmShieldService;
  private RememberKeyService rememberKeyService;
  private VerifyInfoService verifyInfoService;
  private StandardUserService standardUserService;
  
  public StandardUserService getStandardUserService()
  {
    return this.standardUserService;
  }
  
  public void setStandardUserService(StandardUserService standardUserService)
  {
    this.standardUserService = standardUserService;
  }
  
  public RememberKeyService getRememberKeyService()
  {
    return this.rememberKeyService;
  }
  
  public void setRememberKeyService(RememberKeyService rememberKeyService)
  {
    this.rememberKeyService = rememberKeyService;
  }
  
  public VerifyInfoService getVerifyInfoService()
  {
    return this.verifyInfoService;
  }
  
  public void setVerifyInfoService(VerifyInfoService verifyInfoService)
  {
    this.verifyInfoService = verifyInfoService;
  }
  
  public UserAlarmShieldService getUserAlarmShieldService()
  {
    return this.userAlarmShieldService;
  }
  
  public void setUserAlarmShieldService(UserAlarmShieldService userAlarmShieldService)
  {
    this.userAlarmShieldService = userAlarmShieldService;
  }
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  protected void doLoginSucFor808(HttpServletRequest request, StandardUserAccount userAccount)
  {
    getSession().put("userAccount", userAccount);
    
    addCustomResponse("account", userAccount.getAccount());
    addCustomResponse("name", userAccount.getName());
    addCustomResponse("accountId", userAccount.getId());
    
    addCustomResponse("vision", "808gps");
    
    ActionContext ctx = ActionContext.getContext();
    ctx.getSession().put("userid", userAccount.getId().toString());
    ctx.getSession().put("account808", userAccount.getAccount());
    ctx.getSession().put("company", userAccount.getCompany());
    
    LiveVideoSession liveVideo = new LiveVideoSession();
    if (isAddLive)
    {
      liveVideo = addLiveVideoSession();
      addCustomResponse("code", liveVideo.getId());
    }
    if (((userAccount.getAccount() != null) && (userAccount.getAccount().equals("admin"))) || (
      (userAccount.getAccount() != null) && (userAccount.getId().equals(userAccount.getCompany().getAccountID())))) {
      ctx.getSession().put("privilege", StandardUserRole.getUserRole());
    } else if ((userAccount != null) && (userAccount.getRole() != null)) {
      ctx.getSession().put("privilege", userAccount.getRole().getPrivilege());
    } else {
      ctx.getSession().put("privilege", "");
    }
    if ((userAccount.getAccount() != null) && (userAccount.getAccount().equals("admin"))) {
      addCustomResponse("companyId", Integer.valueOf(0));
    } else {
      addCustomResponse("companyId", userAccount.getCompany().getId());
    }
    if (((userAccount.getAccount() != null) && (userAccount.getAccount().equals("admin"))) || (
      (userAccount.getAccount() != null) && (userAccount.getId().equals(userAccount.getCompany().getAccountID()))))
    {
      addCustomResponse("privilege", StandardUserRole.getUserRole());
      if ((userAccount.getAccount() != null) && (userAccount.getAccount().equals("admin"))) {
        addCustomResponse("isAdmin", Integer.valueOf(0));
      } else {
        addCustomResponse("isAdmin", Integer.valueOf(1));
      }
    }
    else
    {
      String privilege = "";
      if (userAccount.getRole() != null) {
        privilege = userAccount.getRole().getPrivilege();
      }
      addCustomResponse("privilege", privilege);
      addCustomResponse("isAdmin", Integer.valueOf(1));
    }
    userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
      Integer.valueOf(1), null, request.getRemoteAddr(), null, 
      String.format("%d", new Object[] { Integer.valueOf(2) }), null);
    
    updateSessionLanguage();
    
    getSession().put("onlineUserBindingListener", new UserBindingListener(userService, userAccount, null));
    addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
  }
  
  protected void doLoginSuc(HttpServletRequest request, UserInfo user)
  {
    getSession().put("user", user);
    
    addCustomResponse("account", user.getUserAccount().getAccount());
    addCustomResponse("name", user.getUserAccount().getName());
    addCustomResponse("useid", user.getId());
    
    ActionContext ctx = ActionContext.getContext();
    ctx.getSession().put("userid", user.getId().toString());
    ctx.getSession().put("accountid", user.getAccountId().toString());
    ctx.getSession().put("account", user.getUserAccount().getAccount());
    ctx.getSession().put("username", user.getUserAccount().getName());
    ctx.getSession().put("showlocation", Boolean.valueOf(BaseAction.getEnableShowLocation()));
    ctx.getSession().put("updatepwd", Boolean.valueOf(BaseAction.getEnableUpdatePwd()));
    
    LiveVideoSession liveVideo = new LiveVideoSession();
    if (isAddLive)
    {
      liveVideo = addLiveVideoSession();
      addCustomResponse("code", liveVideo.getId());
    }
    updateSessionPrivilege(user);
    if (user.getIsAdmin().equals(Integer.valueOf(1)))
    {
      addCustomResponse("isAdmin", Integer.valueOf(1));
      ctx.getSession().put("clientid", user.getId().toString());
    }
    else
    {
      addCustomResponse("isAdmin", Integer.valueOf(0));
      ctx.getSession().put("clientid", user.getParentId().toString());
    }
    addCustomResponse("url", user.getUrl());
    if ((user.getPwdStatus() != null) && (user.getPwdStatus().equals(Integer.valueOf(1)))) {
      addCustomResponse("pwdStatus", Integer.valueOf(1));
    } else {
      addCustomResponse("pwdStatus", Integer.valueOf(0));
    }
    userService.addUserLog(user.getId(), Integer.valueOf(1), 
      Integer.valueOf(1), null, request.getRemoteAddr(), null, 
      String.format("%d", new Object[] { Integer.valueOf(2) }), null);
    
    updateSessionLanguage();
    getSession().put("onlineUserBindingListener", new UserBindingListener(userService, user, liveVideo.getId()));
    addCustomResponse("showLocation", Boolean.valueOf(BaseAction.getEnableShowLocation()));
    addCustomResponse("editMileage", Boolean.valueOf(BaseAction.getEnableEditMileage()));
    addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
  }
  
  public boolean handleLogin(boolean isPwdEncrypt)
  {
    boolean ret = false;
    try
    {
      String userAccount = getRequestString("userAccount");
      String password = getRequestString("password");
      String oldPassword = password;
      HttpServletRequest request = ServletActionContext.getRequest();
      if (is808GPS)
      {
        StandardUserAccount user = this.standardUserService.getStandardUserAccountByAccount(userAccount);
        if (user == null)
        {
          userService.addUserLog(null, Integer.valueOf(1), 
            Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          if ((password != null) && (!password.isEmpty()) && 
            (isPwdEncrypt)) {
            password = MD5EncryptUtils.encrypt(password);
          }
          if ((user.getPassword() != null) && (!user.getPassword().isEmpty()) && 
            (password.equalsIgnoreCase(user.getPassword())))
          {
            if ((user.getStatus() == null) || (user.getStatus().intValue() == 0))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
            }
            else if (user.getStatus().intValue() == 2)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
            }
            else if ((user.getValidity() != null) && (DateUtil.compareDate(new Date(), user.getValidity())))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
            }
            else
            {
              doLoginSucFor808(request, user);
              ret = true;
            }
          }
          else
          {
            userService.addUserLog(user.getId(), Integer.valueOf(1), 
              Integer.valueOf(5), null, request.getRemoteAddr(), user.getAccount(), password, null);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
          }
        }
      }
      else
      {
        UserInfo user = userService.getUserInfoByAccount(userAccount);
        if (user == null)
        {
          userService.addUserLog(null, Integer.valueOf(1), 
            Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          if ((password != null) && (!password.isEmpty()) && 
            (isPwdEncrypt)) {
            password = MD5EncryptUtils.encrypt(password);
          }
          if ((password.equalsIgnoreCase(user.getUserAccount().getPassword())) || (
            (password.isEmpty()) && (user.getUserAccount().getPassword().isEmpty())))
          {
            if (DateUtil.compareDate(new Date(), user.getUserAccount().getValidity()))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
            }
            else
            {
              doLoginSuc(request, user);
              ret = true;
            }
          }
          else
          {
            userService.addUserLog(user.getAccountId(), Integer.valueOf(1), 
              Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return ret;
  }
  
  public String login()
    throws Exception
  {
    if (is808GPS)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      return "success";
    }
    String verificationCode = getRequestString("verificationCode");
    String code = (String)getSession().get("rand");
    if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
    }
    else
    {
      isAddLive = false;
      handleLogin(true);
    }
    return "success";
  }
  
  public String sessionLogin()
    throws Exception
  {
    String session = getRequestString("userSession");
    UserSession userSession = userService.getUserSession(session);
    if ((userSession == null) || (userSession.getUserInfo() == null))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
    }
    else
    {
      isAddLive = false;
      HttpServletRequest request = ServletActionContext.getRequest();
      String ctype = getRequestString("ctype");
      if ((ctype != null) && (Integer.parseInt(ctype) == 1)) {
        request.getSession().setMaxInactiveInterval(43200);
      }
      doLoginSuc(request, userSession.getUserInfo());
    }
    return "success";
  }
  
  protected boolean isEnablePhone()
  {
    long config = this.deviceService.getServerConfig();
    return enablePhone(config);
  }
  
  protected void readAndroidGoogleVersion()
  {
    if (gViewer_androidVersionCode == -1) {
      try
      {
        ServletContext context = getServletContext();
        Configuration config = new Configuration(context.getRealPath("product\\mobile\\android\\version.ini"));
        
        gViewer_androidVersionCode = Integer.parseInt(config.getValue("verCode"));
        gViewer_androidVersionName = config.getValue("verName");
        gViewer_androidFile = config.getValue("file");
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    }
  }
  
  protected void readGmonitorAndroidVersion()
  {
    if (gMonitor_androidVersionCode == -1) {
      try
      {
        ServletContext context = getServletContext();
        Configuration config = new Configuration(context.getRealPath("ipcam\\mobile\\android_version.ini"));
        gMonitor_androidVersionCode = Integer.parseInt(config.getValue("verCode"));
        gMonitor_androidVersionName = config.getValue("verName");
        gMonitor_androidFile = config.getValue("file");
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    }
  }
  
  protected void getGViewerAndroidVersion()
  {
    String update = getRequestString("update");
    if ((update != null) && (update.equals("gViewerAndroid")))
    {
      readAndroidGoogleVersion();
      addCustomResponse("verCode", Integer.valueOf(gViewer_androidVersionCode));
      addCustomResponse("verName", gViewer_androidVersionName);
      addCustomResponse("verFile", gViewer_androidFile);
    }
  }
  
  protected void getGmonitorAndroidVersion()
  {
    String update = getRequestString("update");
    if ((update != null) && (update.equals("gMonitorAndroid")))
    {
      readGmonitorAndroidVersion();
      addCustomResponse("verCode", Integer.valueOf(gMonitor_androidVersionCode));
      addCustomResponse("verName", gMonitor_androidVersionName);
      addCustomResponse("verFile", gMonitor_androidFile);
    }
  }
  
  protected void readAndroidBaiduVersion()
  {
    if (gViewer_androidBaiduVersionCode == -1) {
      try
      {
        ServletContext context = getServletContext();
        Configuration config = new Configuration(context.getRealPath("product\\mobile\\android\\version.ini"));
        gViewer_androidBaiduVersionCode = Integer.parseInt(config.getValue("verCodeBaidu"));
        gViewer_androidBaiduVersionName = config.getValue("verNameBaidu");
        gViewer_androidBaiduFile = config.getValue("fileBaidu");
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    }
  }
  
  protected void getGViewerAndroidBaiduVersion()
  {
    String update = getRequestString("update");
    if ((update != null) && (update.equals("gViewerAndroidBaidu")))
    {
      readAndroidBaiduVersion();
      addCustomResponse("verCode", Integer.valueOf(gViewer_androidBaiduVersionCode));
      addCustomResponse("verName", gViewer_androidBaiduVersionName);
      addCustomResponse("verFile", gViewer_androidBaiduFile);
    }
  }
  
  private String getVerCode(String code)
  {
    String verCode = "";
    try
    {
      if ((code != null) && (!"".equals(code)))
      {
        String[] codes = code.split("\\.");
        if (codes.length >= 3) {
          verCode = Integer.parseInt(codes[0]) * 1000 + Integer.parseInt(codes[1]) + codes[2];
        }
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    return verCode;
  }
  
  protected void getMobileAndroidClient()
  {
    String appName = getRequestString("update");
    String path = "product/android/" + appName;
    if ((appName != null) && (!appName.isEmpty()) && (path != null) && (!path.isEmpty()))
    {
      ServletContext context = getServletContext();
      String lastestFile = getLastestFile(context.getRealPath(path + "/"), ".apk", appName);
      
      String[] info = lastestFile.split("_");
      if (info.length >= 3)
      {
        addCustomResponse("verCode", getVerCode(info[1]));
        addCustomResponse("verName", info[1] + " " + info[2].replaceAll(".apk", ""));
        addCustomResponse("verFile", path + "/" + lastestFile);
      }
    }
  }
  
  protected void getServerLoginAddr()
  {
    String server = getRequestString("server");
    if ((server != null) && (server.equals("login")))
    {
      ServerInfo svrInfo = (ServerInfo)this.serverService.get("1");
      if (svrInfo != null)
      {
        addCustomResponse("serverIp", svrInfo.getClientIp());
        addCustomResponse("serverPort", svrInfo.getClientPort());
        addCustomResponse("serverLanIp", svrInfo.getLanip());
      }
    }
  }
  
  protected void getUsrPrivi()
  {
    if (isAdminUser())
    {
      addCustomResponse("priviUserType", Integer.valueOf(0));
      addCustomResponse("priviUserVal", "");
    }
    else
    {
      addCustomResponse("priviUserType", Integer.valueOf(1));
      addCustomResponse("priviUserVal", getSessionPrivilege());
    }
  }
  
  protected void getUsrAlarmShield()
  {
    UserAlarmShield alarmShield = (UserAlarmShield)this.userAlarmShieldService.get(getSessionUserId());
    if (alarmShield != null) {
      addCustomResponse("userAlarmShield", alarmShield.getArmString());
    } else {
      addCustomResponse("userAlarmShield", "");
    }
  }
  
  protected LiveVideoSession addLiveVideoSession()
  {
    LiveVideoSession liveVideo = new LiveVideoSession();
    Integer userid = getSessionUserId();
    liveVideo.setUserId(userid);
    liveVideo.setStatus(Integer.valueOf(0));
    String random = UUID.randomUUID().toString();
    liveVideo.setRandParam(random);
    userService.save(liveVideo);
    liveVideo = userService.findLiveVideoSession(userid, random);
    return liveVideo;
  }
  
  public String loginEx()
    throws Exception
  {
    try
    {
      if (isEnablePhone())
      {
        isAddLive = false;
        if (handleLogin(true))
        {
          getGViewerAndroidVersion();
          getGViewerAndroidBaiduVersion();
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String loginMobile()
    throws Exception
  {
    try
    {
      if (isEnablePhone())
      {
        isAddLive = false;
        String live = getRequestString("live");
        if ((live != null) && (!live.isEmpty())) {
          isAddLive = true;
        }
        if (handleLogin(true))
        {
          getGmonitorAndroidVersion();
          getGViewerAndroidVersion();
          getGViewerAndroidBaiduVersion();
          getServerLoginAddr();
          getUsrPrivi();
          getUsrAlarmShield();
          getMobileAndroidClient();
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String checkUpdates()
  {
    try
    {
      getMobileAndroidClient();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String terminalLogin()
    throws Exception
  {
    try
    {
      String userAccount = getRequestString("userAccount");
      String password = getRequestString("password");
      String oldPassword = password;
      HttpServletRequest request = ServletActionContext.getRequest();
      
      UserAccount account = this.accountService.findByAccount(userAccount);
      if (account == null)
      {
        userService.addUserLog(null, Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else if (account.getType().intValue() == 1)
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(account.getAccount());
        if (device.getUserID().intValue() == 0)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          if ((password != null) && (!password.isEmpty())) {
            password = MD5EncryptUtils.encrypt(password);
          }
          if ((password.equalsIgnoreCase(account.getPassword())) || (
            (password.isEmpty()) && (account.getPassword().isEmpty())))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
            
            ActionContext ctx = ActionContext.getContext();
            ctx.getSession().put("userid", account.getId().toString());
            ctx.getSession().put("account", account.getAccount());
            ctx.getSession().put("username", account.getName());
            
            ctx.getSession().put("clientid", device.getUserID().toString());
            ctx.getSession().put("onlineUserBindingListener", new UserBindingListener(userService, account, null));
            
            userService.addUserLog(account.getId(), Integer.valueOf(1), 
              Integer.valueOf(1), null, request.getRemoteAddr(), null, 
              String.format("%d", new Object[] { Integer.valueOf(2) }), null);
            
            updateSessionLanguage();
          }
          else
          {
            userService.addUserLog(account.getId(), Integer.valueOf(1), 
              Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
          }
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String logout()
    throws Exception
  {
    try
    {
      ActionContext ctx = ActionContext.getContext();
      String userid = (String)ctx.getSession().get("userid");
      String accountid = (String)ctx.getSession().get("accountid");
      
      HttpServletRequest request = ServletActionContext.getRequest();
      HttpSession session = request.getSession();
      
      session.invalidate();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String saveName()
    throws Exception
  {
    try
    {
      UserInfo usr = getSessionUsr();
      if (usr != null)
      {
        UserInfo newUsr = new UserInfo();
        newUsr = (UserInfo)AjaxUtils.getObject(getRequest(), newUsr.getClass());
        usr.getUserAccount().setName(newUsr.getUserAccount().getName());
        userService.addUserLog(usr.getId(), Integer.valueOf(1), 
          Integer.valueOf(8), null, null, null, null, null);
        userService.save(usr);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String password()
    throws Exception
  {
    try
    {
      UserInfo usr = getSessionUsr();
      if (usr != null)
      {
        Password password = new Password();
        password = (Password)AjaxUtils.getObject(getRequest(), password.getClass());
        if (!usr.getUserAccount().getPassword().equalsIgnoreCase(MD5EncryptUtils.encrypt(password.getOldPwd())))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(19));
        }
        else
        {
          usr.getUserAccount().setPassword(MD5EncryptUtils.encrypt(password.getNewPwd()));
          userService.save(usr);
          userService.addUserLog(usr.getId(), Integer.valueOf(1), 
            Integer.valueOf(7), null, null, null, null, null);
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected UserInfo getSessionUsr()
  {
    Integer usrId = getSessionUserId();
    if (usrId != null)
    {
      UserInfo usr = (UserInfo)userService.get(usrId);
      return usr;
    }
    return null;
  }
  
  public String getAccount()
    throws Exception
  {
    try
    {
      UserInfo usr = getSessionUsr();
      if (usr != null)
      {
        addCustomResponse("name", usr.getUserAccount().getName());
        addCustomResponse("telephone", usr.getTelephone());
        addCustomResponse("email", usr.getEmail());
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveAccount()
    throws Exception
  {
    try
    {
      UserInfo usr = getSessionUsr();
      if (usr != null)
      {
        UserInfo newUsr = new UserInfo();
        newUsr = (UserInfo)AjaxUtils.getObject(getRequest(), newUsr.getClass());
        usr.setTelephone(newUsr.getTelephone());
        usr.setEmail(newUsr.getEmail());
        userService.addUserLog(usr.getId(), Integer.valueOf(1), 
          Integer.valueOf(8), null, null, null, null, null);
        userService.save(usr);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String daemon()
  {
    try
    {
      this.serverService.getLoginSvrOnline();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      if ((ex instanceof UncategorizedSQLException)) {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(28));
      } else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
    }
    return "success";
  }
  
  public String information()
  {
    if (!gIsReadInformation)
    {
      gIsReadInformation = true;
      ServletContext context = getServletContext();
      PropertiesConfiguration config = new PropertiesConfiguration();
      config.setEncoding("UTF-16");
      try
      {
        config.load(context.getRealPath("WEB-INF\\classes\\config\\information.properties"));
      }
      catch (ConfigurationException e)
      {
        e.printStackTrace();
      }
      gChineseSystemTitle = getConfigValue(config, "ChineseSystemTitle", "������������������");
      gChineseMainTitle = getConfigValue(config, "ChineseMainTitle", "������������������");
      gChineseCopyright = getConfigValue(config, "ChineseCopyright", "Copyright (c) 2013. All right reserved.");
      gEnglishSystemTitle = getConfigValue(config, "EnglishSystemTitle", "Vehicle Management Systems");
      gEnglishMainTitle = getConfigValue(config, "EnglishMainTitle", "Vehicle Monitor Systems");
      gEnglishCopyright = getConfigValue(config, "EnglishCopyright", "Copyright (c) 2013. All right reserved.");
      gTwSystemTitle = getConfigValue(config, "TwSystemTitle", "Vehicle Management Systems");
      gTwMainTitle = getConfigValue(config, "TwMainTitle", "Vehicle Monitor Systems");
      gTwCopyright = getConfigValue(config, "TwCopyright", "Copyright (c) 2013. All right reserved.");
    }
    addCustomResponse("ChineseSystemTitle", gChineseSystemTitle);
    addCustomResponse("ChineseMainTitle", gChineseMainTitle);
    addCustomResponse("ChineseCopyright", gChineseCopyright);
    addCustomResponse("EnglishSystemTitle", gEnglishSystemTitle);
    addCustomResponse("EnglishMainTitle", gEnglishMainTitle);
    addCustomResponse("EnglishCopyright", gEnglishCopyright);
    addCustomResponse("TwSystemTitle", gTwSystemTitle);
    addCustomResponse("TwMainTitle", gTwMainTitle);
    addCustomResponse("TwCopyright", gTwCopyright);
    addCustomResponse("enableAdvertising", Boolean.valueOf(getEnableAdvertising()));
    
    return "success";
  }
  
  protected String getConfigValue(PropertiesConfiguration config, String key, String def)
  {
    String value = config.getString(key);
    if ((value == null) || (value.isEmpty())) {
      return def;
    }
    return value;
  }
  
  protected String getLastestFile(String filePath, String fileSuffix, String update)
  {
    String lastestFile = "";
    long lastModified = 0L;
    File file = new File(filePath);
    if (file.exists())
    {
      File[] files = file.listFiles();
      for (int i = 0; i < files.length; i++) {
        if (files[i].isFile())
        {
          String fileName = files[i].getName();
          
          int index = fileName.toUpperCase().lastIndexOf(fileSuffix.toUpperCase());
          if ((index != -1) && (index == fileName.length() - fileSuffix.length()) && 
            (files[i].lastModified() > lastModified))
          {
            lastestFile = files[i].getName();
            lastModified = files[i].lastModified();
          }
        }
      }
    }
    return lastestFile;
  }
  
  protected String getVersionDate(String date)
  {
    if (date.length() > 8) {
      return date.substring(0, 8);
    }
    return date;
  }
  
  protected DownInfo getPlayerVersion()
  {
    ServletContext context = getServletContext();
    String lastestFile = getLastestFile(context.getRealPath("product\\player\\"), ".exe", "");
    
    String[] info = lastestFile.split("_");
    if (info.length >= 4)
    {
      DownInfo downInfo = new DownInfo();
      downInfo.setStyle("downicon windowns");
      downInfo.setName("player");
      downInfo.setVerValue(info[2]);
      downInfo.setDateValue(getVersionDate(info[3]));
      downInfo.setUrl("product/player/" + lastestFile);
      return downInfo;
    }
    return null;
  }
  
  protected DownInfo getMapinfoVersion()
  {
    ServletContext context = getServletContext();
    String lastestFile = getLastestFile(context.getRealPath("product\\plugin\\"), ".exe", "");
    
    String[] info = lastestFile.split("_");
    if (info.length >= 3)
    {
      DownInfo downInfo = new DownInfo();
      downInfo.setStyle("downicon windowns");
      downInfo.setName("mapinfo");
      downInfo.setVerValue(info[1]);
      downInfo.setDateValue(getVersionDate(info[2]));
      downInfo.setUrl("product/plugin/" + lastestFile);
      return downInfo;
    }
    return null;
  }
  
  protected DownInfo getViewerVersion()
  {
    ServletContext context = getServletContext();
    String lastestFile = getLastestFile(context.getRealPath("product\\cmsv6\\install\\"), ".exe", "");
    
    String[] info = lastestFile.split("_");
    if (info.length >= 4)
    {
      DownInfo downInfo = new DownInfo();
      downInfo.setStyle("downicon windowns");
      downInfo.setName("clientWin");
      downInfo.setVerValue(info[2]);
      downInfo.setDateValue(getVersionDate(info[3]));
      downInfo.setUrl("product/cmsv6/install/" + lastestFile);
      return downInfo;
    }
    return null;
  }
  
  protected DownInfo getIosVersion()
  {
    ServletContext context = getServletContext();
    Configuration config = new Configuration(context.getRealPath("product\\mobile\\ios\\version.ini"));
    
    DownInfo downInfo = new DownInfo();
    downInfo.setName("clientIos");
    downInfo.setStyle("downicon apple");
    downInfo.setVerValue(config.getValue("version"));
    downInfo.setDateValue(config.getValue("date"));
    if (!isEnglish()) {
      downInfo.setUrl(config.getValue("cnUrl"));
    } else {
      downInfo.setUrl(config.getValue("enUrl"));
    }
    return downInfo;
  }
  
  protected boolean isEnglish()
  {
    String language = getRequestString("language");
    if ((language != null) && (language.equals("zh"))) {
      return false;
    }
    return true;
  }
  
  protected DownInfo getAndroidClient(String versioName, String url)
  {
    String[] info = versioName.split(" ");
    if (info.length >= 2)
    {
      DownInfo downInfo = new DownInfo();
      downInfo.setStyle("downicon android");
      downInfo.setVerValue(info[0]);
      downInfo.setDateValue(info[1]);
      downInfo.setUrl("product/mobile/android/" + url);
      return downInfo;
    }
    return null;
  }
  
  protected DownInfo getAllClient()
  {
    String path = getRequestString("path");
    ServletContext context = getServletContext();
    String lastestFile = getLastestFile(context.getRealPath(path + "\\"), ".exe", "");
    
    String[] info = lastestFile.split("_");
    if (info.length >= 3)
    {
      DownInfo downInfo = new DownInfo();
      downInfo.setStyle("downicon windowns");
      downInfo.setName("clientWin");
      downInfo.setVerValue(info[1]);
      downInfo.setDateValue(getVersionDate(info[2]));
      downInfo.setUrl(path + "/" + lastestFile);
      return downInfo;
    }
    return null;
  }
  
  public String download()
  {
    try
    {
      List<DownInfo> lstDown = new ArrayList();
      if (getEnableDownloadClientWin())
      {
        DownInfo gViewerDown = getViewerVersion();
        lstDown.add(gViewerDown);
      }
      if (getEnableDownloadClientIos())
      {
        DownInfo iosDown = getIosVersion();
        lstDown.add(iosDown);
      }
      readAndroidBaiduVersion();
      readAndroidGoogleVersion();
      DownInfo baiduAndroid = getAndroidClient(gViewer_androidBaiduVersionName, gViewer_androidBaiduFile);
      baiduAndroid.setName("androidBaidu");
      DownInfo googleAndroid = getAndroidClient(gViewer_androidVersionName, gViewer_androidFile);
      googleAndroid.setName("androidGoogle");
      if (isEnglish())
      {
        if (getEnableDownloadClientAndroidGoogle()) {
          lstDown.add(googleAndroid);
        }
        if (getEnableDownloadClientAndroidBaidu()) {
          lstDown.add(baiduAndroid);
        }
      }
      else
      {
        if (getEnableDownloadClientAndroidBaidu()) {
          lstDown.add(baiduAndroid);
        }
        if (getEnableDownloadClientAndroidGoogle()) {
          lstDown.add(googleAndroid);
        }
      }
      if (getEnableDownloadClientPlayer())
      {
        DownInfo player = getPlayerVersion();
        lstDown.add(player);
      }
      if (getEnableDownloadClientMapinfo())
      {
        DownInfo mapinfo = getMapinfoVersion();
        lstDown.add(mapinfo);
      }
      addCustomResponse("lstDown", lstDown);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "success";
  }
  
  protected void setDefaultPassword(UserInfo client)
  {
    client.getUserAccount().setPassword(MD5EncryptUtils.encrypt("000000"));
  }
  
  protected void updateUserAccount(UserInfo client)
  {
    setDefaultPassword(client);
    client.getUserAccount().setType(Integer.valueOf(2));
    Calendar cal = Calendar.getInstance();
    cal.set(2036, 12, 31);
    client.getUserAccount().setValidity(cal.getTime());
    client.setParentId(Integer.valueOf(0));
    client.setIsAdmin(Integer.valueOf(1));
    client.setRoleId(UserInfo.DEFAULT_ROLE);
  }
  
  protected void makeRememberKey()
  {
    RememberKey key = new RememberKey();
    
    ActionContext ctx = ActionContext.getContext();
    Integer accountId = Integer.valueOf(Integer.parseInt((String)ctx.getSession().get("accountid")));
    key.setAccountId(accountId);
    
    String cookie = UUID.randomUUID().toString();
    key.setCookie(cookie);
    
    HttpServletRequest request = ServletActionContext.getRequest();
    key.setIPAddress(request.getRemoteAddr());
    this.rememberKeyService.save(key);
    
    addCustomResponse("userKey", cookie);
  }
  
  public String glogin()
  {
    isAddLive = false;
    if (handleLogin(true))
    {
      String autoLogin = getRequestString("autoLogin");
      if ((autoLogin != null) && (autoLogin.equals("1"))) {
        makeRememberKey();
      }
    }
    return "success";
  }
  
  public String autoLogin()
  {
    try
    {
      String userKey = getRequestString("userKey");
      if ((userKey == null) || (userKey.isEmpty()))
      {
        ActionContext ctx = ActionContext.getContext();
        String userid = (String)ctx.getSession().get("userid");
        if (userid == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
          addCustomResponse("account", (String)ctx.getSession().get("account"));
          addCustomResponse("name", (String)ctx.getSession().get("username"));
        }
      }
      else
      {
        RememberKey key = this.rememberKeyService.getRememberKey(userKey);
        if (key == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          UserInfo user = userService.getUserInfoByAccount(key.getAccountId());
          if (user != null)
          {
            isAddLive = false;
            HttpServletRequest request = ServletActionContext.getRequest();
            doLoginSuc(request, user);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "success";
  }
  
  public String regist()
  {
    try
    {
      UserAccount saveAccount = new UserAccount();
      saveAccount = (UserAccount)AjaxUtils.getObject(getRequest(), saveAccount.getClass());
      
      UserAccount account = this.accountService.findByAccount(saveAccount.getAccount());
      if ((account != null) || (this.accountService.isAccountUnvalid(saveAccount.getAccount())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(15));
      }
      else
      {
        UserAccount userAccount = new UserAccount();
        userAccount.setName(saveAccount.getAccount());
        userAccount.setAccount(saveAccount.getAccount());
        
        UserInfo user = new UserInfo();
        user.setUserAccount(userAccount);
        updateUserAccount(user);
        user.getUserAccount().setPassword(MD5EncryptUtils.encrypt(saveAccount.getPassword()));
        
        UserInfo addUser = (UserInfo)userService.save(user);
        this.notifyService.sendClientChange(1, addUser.getId().intValue());
        
        isAddLive = false;
        doLoginSuc(ServletActionContext.getRequest(), addUser);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "success";
  }
  
  public String findAccount()
  {
    try
    {
      String account = getRequestString("account");
      if ((account == null) || (account.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = userService.getUserInfoByAccount(account);
        if (user == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
        }
        else
        {
          addCustomResponse("account", user.getUserAccount().getAccount());
          addCustomResponse("name", user.getUserAccount().getName());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "success";
  }
  
  public String sendEmail()
  {
    try
    {
      String verificationCode = getRequestString("verifyCode");
      String code = (String)getSession().get("rand");
      if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(38));
      }
      else
      {
        String account = getRequestString("account");
        if ((account == null) || (account.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          UserInfo user = userService.getUserInfoByAccount(account);
          if (user == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
          }
          else
          {
            ResetPassword reset = this.accountService.findResetSession(account);
            if (reset == null)
            {
              reset = new ResetPassword();
              Date d = new Date();
              Calendar rightNow = Calendar.getInstance();
              rightNow.setTime(d);
              
              rightNow.add(6, 1);
              Date dt = rightNow.getTime();
              reset.setSendTime(d);
              reset.setEndTime(dt);
              reset.setAccount(account);
              reset.setStatus(Integer.valueOf(1));
              
              String randParam = UUID.randomUUID().toString();
              reset.setRandParam(randParam);
              this.accountService.save(reset);
              reset = this.accountService.findResetSession(account);
            }
            updateSessionLanguage();
            String language = getRequestString("language");
            String title = getRequestString("title");
            SendEmailUtil emailUtil = new SendEmailUtil();
            
            emailUtil.sendHtmlEmail(this, account, reset.getId(), reset.getRandParam(), language, title);
            
            System.out.println(" ������������.. ");
            this.log.info("������������...");
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(43));
    }
    return "success";
  }
  
  public String checkLink()
  {
    try
    {
      String account = getRequestString("account");
      String sid = getRequestString("sid");
      String randParam = getRequestString("rand");
      ResetPassword reset = this.accountService.findResetSessionByAI(Integer.valueOf(Integer.parseInt(sid)), randParam, account);
      if (reset == null) {
        addCustomResponse("expired", Integer.valueOf(7));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String changePassword()
  {
    try
    {
      String account = getRequestString("account");
      String sid = getRequestString("sid");
      String randParam = getRequestString("rand");
      String newPwd = getRequestString("newPwd");
      ResetPassword reset = this.accountService.findResetSessionByAI(Integer.valueOf(Integer.parseInt(sid)), randParam, account);
      if (reset == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
      else
      {
        UserAccount userAccount = this.accountService.findByAccount(account);
        if (userAccount == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          userAccount.setPassword(MD5EncryptUtils.encrypt(newPwd));
          this.accountService.save(userAccount);
          
          reset.setStatus(Integer.valueOf(0));
          this.accountService.save(reset);
          HttpServletRequest request = ServletActionContext.getRequest();
          
          UserInfo user = userService.getUserInfoByAccount(account);
          if (user == null)
          {
            userService.addUserLog(null, Integer.valueOf(1), 
              Integer.valueOf(5), null, request.getRemoteAddr(), account, newPwd, null);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
          }
          else if (DateUtil.compareDate(new Date(), userAccount.getValidity()))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
          }
          else
          {
            isAddLive = false;
            doLoginSuc(request, user);
          }
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
  
  public String userEditPwd()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      String pwd = getRequestString("pwd");
      if ((id == null) || (id.isEmpty()) || (pwd == null) || (pwd.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          user.getUserAccount().setPassword(MD5EncryptUtils.encrypt(pwd));
          user.setPwdStatus(Integer.valueOf(1));
          UserBaseAction.userService.save(user);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
}
