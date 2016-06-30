package com.gps.api.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.api.service.AlarmImageService;
import com.gps.common.action.ApiBaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.common.vo.DeviceResult;
import com.gps.common.vo.DriverInfo;
import com.gps.model.DeviceAlarm;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceGroup;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceOnline;
import com.gps.model.DeviceStatus;
import com.gps.model.LiveVideoSession;
import com.gps.model.ServerInfo;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.model.UserLog;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.DeviceTrack;
import com.gps.system.action.SysDeviceAction;
import com.gps.system.model.SysNews;
import com.gps.system.model.SysUsrInfo;
import com.gps.system.service.SysUserService;
import com.gps.util.ConvertUtil;
import com.gps.util.GoogleGpsFix;
import com.gps.vo.DeviceStatusInfo;
import com.gps.vo.GpsValue;
import com.gps.vo.StandardDeviceInfo;
import com.gps.vo.VehicleInfo;
import com.gps.vo.VehicleTeam;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceTrack;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

public class MobileAction
  extends ApiBaseAction
{
  private static final long serialVersionUID = 1L;
  private static String sUploadPath = "";
  private List<File> uploadFile;
  private List<String> uploadFileFileName;
  private List<String> uploadFileContentType;
  private AlarmImageService alarmImageService;
  private SysUserService sysUserService;
  private AccountService accountService;
  protected StandardUserService standardUserService;
  protected StandardVehicleGpsService vehicleGpsService;
  
  public StandardVehicleGpsService getVehicleGpsService()
  {
    return this.vehicleGpsService;
  }
  
  public void setVehicleGpsService(StandardVehicleGpsService vehicleGpsService)
  {
    this.vehicleGpsService = vehicleGpsService;
  }
  
  public StandardUserService getStandardUserService()
  {
    return this.standardUserService;
  }
  
  public void setStandardUserService(StandardUserService standardUserService)
  {
    this.standardUserService = standardUserService;
  }
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public AlarmImageService getAlarmImageService()
  {
    return this.alarmImageService;
  }
  
  public void setAlarmImageService(AlarmImageService alarmImageService)
  {
    this.alarmImageService = alarmImageService;
  }
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  public List<File> getUploadFile()
  {
    return this.uploadFile;
  }
  
  public void setUploadFile(List<File> uploadFile)
  {
    this.uploadFile = uploadFile;
  }
  
  public List<String> getUploadFileFileName()
  {
    return this.uploadFileFileName;
  }
  
  public void setUploadFileFileName(List<String> uploadFileFileName)
  {
    this.uploadFileFileName = uploadFileFileName;
  }
  
  public List<String> getUploadFileContentType()
  {
    return this.uploadFileContentType;
  }
  
  public void setUploadFileContentType(List<String> uploadFileContentType)
  {
    this.uploadFileContentType = uploadFileContentType;
  }
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String login()
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
        this.userService.addUserLog(null, Integer.valueOf(1), 
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
            
            addCustomResponse("name", account.getName());
            addCustomResponse("terminalId", account.getId());
            UUID uuid = UUID.randomUUID();
            addCustomResponse("jsession", uuid.toString().replaceAll("-", ""));
          }
          else
          {
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
  
  public String padLogin()
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
        this.userService.addUserLog(null, Integer.valueOf(1), 
          Integer.valueOf(5), null, request.getRemoteAddr(), userAccount, oldPassword, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else if (account.getType().intValue() == 1)
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(account.getAccount());
        if ((device.getUserID().intValue() == 0) || (device.getDevType().intValue() != 4))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          List<Object> list = this.accountService.findDriverInfo(account.getAccount());
          if ((list == null) || (list.size() == 0))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
            return "success";
          }
          Object[] object = (Object[])list.get(0);
          if ((password != null) && (!password.isEmpty())) {
            password = MD5EncryptUtils.encrypt(password);
          }
          if ((object[2] != null) && (password.equals(object[2])))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
            
            DriverInfo info = new DriverInfo();
            info.setVehicleNum((String) object[0]);
            info.setDriverName((String) object[3]);
            info.setDriverTel((String) object[4]);
            info.setBeginTime((Date)object[6]);
            info.setEndTime((Date)object[7]);
            info.setDriverPicture((String) object[5]);
            info.setCargoName(object[8] == null ? "" : object[8].toString());
            info.setCargoLength(object[9] == null ? "" : object[9].toString());
            info.setCargoHeight(object[10] == null ? "" : object[10].toString());
            info.setCargoWidth(object[11] == null ? "" : object[11].toString());
            info.setCargoWeight(object[12] == null ? "" : object[12].toString());
            info.setAxisWeight(object[13] == null ? "" : object[13].toString());
            info.setStartPoint(object[14] == null ? "" : object[14].toString());
            info.setEndPoint(object[15] == null ? "" : object[15].toString());
            addCustomResponse("driverInfo", info);
            this.userService.addUserLog(account.getId(), Integer.valueOf(1), 
              Integer.valueOf(1), request.getSession().getId(), request.getRemoteAddr(), userAccount, String.format("%d", new Object[] { Integer.valueOf(6) }), null);
            
            UserLog userLog = this.userService.getUserLoginLog(account.getId(), Integer.valueOf(1), 
              Integer.valueOf(1), request.getSession().getId(), String.format("%d", new Object[] { Integer.valueOf(6) }));
            if (userLog != null) {
              request.getSession().setAttribute("userLogId", userLog.getId());
            }
          }
          else
          {
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
  
  public String padLoginOut()
  {
    try
    {
      String userAccount = getRequestString("userAccount");
      HttpServletRequest request = ServletActionContext.getRequest();
      if (userAccount != null)
      {
        UserAccount account = this.accountService.findByAccount(userAccount);
        this.userService.addUserLog(null, Integer.valueOf(1), 
          Integer.valueOf(2), request.getSession().getId(), request.getRemoteAddr(), userAccount, String.format("%d", new Object[] { Integer.valueOf(6) }), null);
        if (account != null) {
          if (request.getSession().getAttribute("userLogId") != null)
          {
            this.userService.updateUserLoginLog((Integer)request.getSession().getAttribute("userLogId"), DateUtil.dateSwitchString(new Date()));
            request.getSession().removeAttribute("userLogId");
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String info()
    throws Exception
  {
    try
    {
      Integer terminalId = getTerminalId();
      if (terminalId == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserAccount account = this.accountService.get(terminalId);
        DeviceBase device = this.deviceService.findDeviceByIdnoEx(account.getAccount());
        addCustomResponse("info", device);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  protected Integer getTerminalId()
  {
    String terminalId = getRequestString("terminalId");
    if (terminalId != null) {
      return Integer.valueOf(Integer.parseInt(terminalId));
    }
    return null;
  }
  
  protected String getJsession()
  {
    return getRequestString("jsession");
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
  
  public String terminal()
    throws Exception
  {
    try
    {
      Integer terminalId = getTerminalId();
      String jsession = getJsession();
      String name = getRequestString("name");
      if ((terminalId == null) || (jsession == null))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        AjaxDto<DeviceBase> ajaxDevice = this.deviceService.getUserDeviceList(name, terminalId, null, null);
        if (ajaxDevice.getPageList() != null)
        {
          AjaxDto<DeviceStatus> ajaxStatus = this.deviceService.getDeviceStatus(ajaxDevice.getPageList());
          
          Map<String, DeviceStatus> mapStatus = new HashMap();
          if (ajaxStatus.getPageList() != null) {
            for (int i = 0; i < ajaxStatus.getPageList().size(); i++)
            {
              DeviceStatus status = (DeviceStatus)ajaxStatus.getPageList().get(i);
              
              GpsValue gpsValue = GoogleGpsFix.fixCoordinate(status.getJingDu(), status.getWeiDu());
              status.setMapJingDu(gpsValue.getMapJingDu());
              status.setMapWeiDu(gpsValue.getMapWeiDu());
              mapStatus.put(status.getDevIdno(), status);
            }
          }
          List<DeviceBase> devLists = new ArrayList();
          List<DeviceBase> offlineLists = new ArrayList();
          for (int i = 0; i < ajaxDevice.getPageList().size(); i++)
          {
            DeviceBase device = (DeviceBase)ajaxDevice.getPageList().get(i);
            DeviceStatus status = (DeviceStatus)mapStatus.get(device.getIdno());
            if (status != null)
            {
              if (status.getJingDu() == null) {
                status.setJingDu(Integer.valueOf(0));
              }
              if (status.getWeiDu() == null) {
                status.setWeiDu(Integer.valueOf(0));
              }
            }
            device.setStatus(status);
            if ((status != null) && (status.getOnline() != null) && (status.getOnline().intValue() > 0)) {
              devLists.add(device);
            } else {
              offlineLists.add(device);
            }
          }
          devLists.addAll(offlineLists);
          addCustomResponse("terminals", devLists);
        }
        else
        {
          addCustomResponse("terminals", null);
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
  
  public String status()
    throws Exception
  {
    try
    {
      String devIdnos = getRequestString("devIdnos");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devIdnos.split(","));
      if (ajaxDto.getPageList() != null)
      {
        String toMap = getRequestString("toMap");
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
          if (status.getJingDu() == null) {
            status.setJingDu(Integer.valueOf(0));
          }
          if (status.getWeiDu() == null) {
            status.setWeiDu(Integer.valueOf(0));
          }
          GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap);
          status.setMapJingDu(gpsValue.getMapJingDu());
          status.setMapWeiDu(gpsValue.getMapWeiDu());
        }
      }
      addCustomResponse("status", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String gwayAddr()
    throws Exception
  {
    try
    {
      ServerInfo server = this.serverService.getOnlineServer(2);
      addCustomResponse("server", server);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void getImageUploadPath()
  {
    if (sUploadPath.isEmpty())
    {
      ServletContext context = getServletContext();
      sUploadPath = context.getRealPath("upload");
      sUploadPath += "\\";
      sUploadPath = sUploadPath.replace('/', '\\');
      File fileDis = new File(sUploadPath);
      fileDis.mkdirs();
    }
  }
  
  protected String[] getImageSavePath(String devIdno, String armGuid, String fileName, int imageId)
  {
    String[] ret = new String[2];
    String strDir = sUploadPath + DateUtil.dateSwitchDateString(new Date()) + '\\';
    String ext = ".jpg";
    int index = fileName.lastIndexOf(".");
    if (index != -1) {
      ext = fileName.substring(index);
    }
    String file = String.format("%s_%s_%d%s", new Object[] { devIdno, armGuid, Integer.valueOf(imageId), ext });
    File fileDis = new File(strDir);
    if (!fileDis.isDirectory()) {
      fileDis.mkdirs();
    }
    ret[0] = (strDir + file);
    ret[1] = ("upload/" + DateUtil.dateSwitchDateString(new Date()) + "/" + file);
    return ret;
  }
  
  /* Error */
  public void uploadImage()
    throws Exception
  {
    // Byte code:
    //   0: aload_0
    //   1: invokevirtual 637	com/gps/api/action/MobileAction:getImageUploadPath	()V
    //   4: aload_0
    //   5: ldc_w 639
    //   8: invokevirtual 101	com/gps/api/action/MobileAction:getRequestString	(Ljava/lang/String;)Ljava/lang/String;
    //   11: astore_1
    //   12: aload_0
    //   13: ldc_w 640
    //   16: invokevirtual 101	com/gps/api/action/MobileAction:getRequestString	(Ljava/lang/String;)Ljava/lang/String;
    //   19: astore_2
    //   20: aload_1
    //   21: ifnull +21 -> 42
    //   24: aload_1
    //   25: invokevirtual 175	java/lang/String:isEmpty	()Z
    //   28: ifne +14 -> 42
    //   31: aload_2
    //   32: ifnull +10 -> 42
    //   35: aload_2
    //   36: invokevirtual 175	java/lang/String:isEmpty	()Z
    //   39: ifeq +18 -> 57
    //   42: aload_0
    //   43: getstatic 140	com/gps/api/action/MobileAction:ACTION_RESULT	Ljava/lang/String;
    //   46: bipush 8
    //   48: invokestatic 123	java/lang/Integer:valueOf	(I)Ljava/lang/Integer;
    //   51: invokevirtual 143	com/gps/api/action/MobileAction:addCustomResponse	(Ljava/lang/String;Ljava/lang/Object;)V
    //   54: goto +656 -> 710
    //   57: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   60: new 264	java/lang/StringBuilder
    //   63: dup
    //   64: ldc_w 648
    //   67: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   70: aload_1
    //   71: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   74: ldc_w 650
    //   77: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   80: aload_2
    //   81: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   84: ldc_w 652
    //   87: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   90: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   93: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   96: new 659	com/gps/api/model/AlarmImage
    //   99: dup
    //   100: invokespecial 661	com/gps/api/model/AlarmImage:<init>	()V
    //   103: astore_3
    //   104: aload_3
    //   105: aload_1
    //   106: invokevirtual 662	com/gps/api/model/AlarmImage:setDevIdno	(Ljava/lang/String;)V
    //   109: aload_3
    //   110: aload_2
    //   111: invokevirtual 665	com/gps/api/model/AlarmImage:setGuid	(Ljava/lang/String;)V
    //   114: aload_3
    //   115: new 285	java/util/Date
    //   118: dup
    //   119: invokespecial 364	java/util/Date:<init>	()V
    //   122: invokevirtual 668	com/gps/api/model/AlarmImage:setImageTime	(Ljava/util/Date;)V
    //   125: new 264	java/lang/StringBuilder
    //   128: dup
    //   129: invokespecial 266	java/lang/StringBuilder:<init>	()V
    //   132: astore 4
    //   134: new 264	java/lang/StringBuilder
    //   137: dup
    //   138: invokespecial 266	java/lang/StringBuilder:<init>	()V
    //   141: astore 5
    //   143: iconst_0
    //   144: istore 6
    //   146: goto +448 -> 594
    //   149: aconst_null
    //   150: astore 7
    //   152: aconst_null
    //   153: astore 8
    //   155: aload_0
    //   156: getfield 84	com/gps/api/action/MobileAction:uploadFileFileName	Ljava/util/List;
    //   159: iload 6
    //   161: invokeinterface 259 2 0
    //   166: checkcast 176	java/lang/String
    //   169: astore 9
    //   171: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   174: new 264	java/lang/StringBuilder
    //   177: dup
    //   178: ldc_w 671
    //   181: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   184: aload 9
    //   186: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   189: ldc_w 652
    //   192: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   195: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   198: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   201: aload 9
    //   203: ldc 32
    //   205: invokevirtual 673	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   208: ifne +353 -> 561
    //   211: new 674	java/io/FileInputStream
    //   214: dup
    //   215: aload_0
    //   216: getfield 76	com/gps/api/action/MobileAction:uploadFile	Ljava/util/List;
    //   219: iload 6
    //   221: invokeinterface 259 2 0
    //   226: checkcast 587	java/io/File
    //   229: invokespecial 676	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   232: astore 10
    //   234: aload_0
    //   235: aload_1
    //   236: aload_2
    //   237: aload 9
    //   239: iload 6
    //   241: invokevirtual 679	com/gps/api/action/MobileAction:getImageSavePath	(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)[Ljava/lang/String;
    //   244: astore 11
    //   246: new 681	java/io/FileOutputStream
    //   249: dup
    //   250: aload 11
    //   252: iconst_0
    //   253: aaload
    //   254: invokespecial 683	java/io/FileOutputStream:<init>	(Ljava/lang/String;)V
    //   257: astore 12
    //   259: aload 4
    //   261: new 264	java/lang/StringBuilder
    //   264: dup
    //   265: aload 11
    //   267: iconst_0
    //   268: aaload
    //   269: invokestatic 573	java/lang/String:valueOf	(Ljava/lang/Object;)Ljava/lang/String;
    //   272: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   275: ldc_w 684
    //   278: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   281: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   284: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   287: pop
    //   288: aload 5
    //   290: new 264	java/lang/StringBuilder
    //   293: dup
    //   294: aload 11
    //   296: iconst_1
    //   297: aaload
    //   298: invokestatic 573	java/lang/String:valueOf	(Ljava/lang/Object;)Ljava/lang/String;
    //   301: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   304: ldc_w 684
    //   307: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   310: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   313: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   316: pop
    //   317: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   320: new 264	java/lang/StringBuilder
    //   323: dup
    //   324: ldc_w 686
    //   327: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   330: aload 4
    //   332: invokevirtual 267	java/lang/StringBuilder:append	(Ljava/lang/Object;)Ljava/lang/StringBuilder;
    //   335: ldc_w 652
    //   338: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   341: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   344: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   347: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   350: new 264	java/lang/StringBuilder
    //   353: dup
    //   354: ldc_w 688
    //   357: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   360: aload 5
    //   362: invokevirtual 267	java/lang/StringBuilder:append	(Ljava/lang/Object;)Ljava/lang/StringBuilder;
    //   365: ldc_w 652
    //   368: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   371: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   374: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   377: new 690	java/io/BufferedInputStream
    //   380: dup
    //   381: aload 10
    //   383: invokespecial 692	java/io/BufferedInputStream:<init>	(Ljava/io/InputStream;)V
    //   386: astore 7
    //   388: new 695	java/io/BufferedOutputStream
    //   391: dup
    //   392: aload 12
    //   394: invokespecial 697	java/io/BufferedOutputStream:<init>	(Ljava/io/OutputStream;)V
    //   397: astore 8
    //   399: ldc_w 700
    //   402: istore 13
    //   404: iload 13
    //   406: newarray <illegal type>
    //   408: astore 14
    //   410: iconst_m1
    //   411: istore 15
    //   413: goto +23 -> 436
    //   416: aload 8
    //   418: aload 14
    //   420: iconst_0
    //   421: iload 15
    //   423: invokevirtual 701	java/io/BufferedOutputStream:write	([BII)V
    //   426: iload 15
    //   428: iload 13
    //   430: if_icmpge +6 -> 436
    //   433: goto +128 -> 561
    //   436: aload 7
    //   438: aload 14
    //   440: invokevirtual 705	java/io/BufferedInputStream:read	([B)I
    //   443: dup
    //   444: istore 15
    //   446: iconst_m1
    //   447: if_icmpne -31 -> 416
    //   450: goto +111 -> 561
    //   453: astore 10
    //   455: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   458: new 264	java/lang/StringBuilder
    //   461: dup
    //   462: ldc_w 709
    //   465: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   468: aload 10
    //   470: invokevirtual 223	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   473: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   476: ldc_w 652
    //   479: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   482: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   485: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   488: aload 10
    //   490: invokevirtual 711	java/lang/Exception:printStackTrace	()V
    //   493: aload 7
    //   495: ifnull +8 -> 503
    //   498: aload 7
    //   500: invokevirtual 714	java/io/BufferedInputStream:close	()V
    //   503: aload 8
    //   505: ifnull +86 -> 591
    //   508: aload 8
    //   510: invokevirtual 717	java/io/BufferedOutputStream:close	()V
    //   513: goto +78 -> 591
    //   516: astore 17
    //   518: aload 17
    //   520: invokevirtual 718	java/io/IOException:printStackTrace	()V
    //   523: goto +68 -> 591
    //   526: astore 16
    //   528: aload 7
    //   530: ifnull +8 -> 538
    //   533: aload 7
    //   535: invokevirtual 714	java/io/BufferedInputStream:close	()V
    //   538: aload 8
    //   540: ifnull +18 -> 558
    //   543: aload 8
    //   545: invokevirtual 717	java/io/BufferedOutputStream:close	()V
    //   548: goto +10 -> 558
    //   551: astore 17
    //   553: aload 17
    //   555: invokevirtual 718	java/io/IOException:printStackTrace	()V
    //   558: aload 16
    //   560: athrow
    //   561: aload 7
    //   563: ifnull +8 -> 571
    //   566: aload 7
    //   568: invokevirtual 714	java/io/BufferedInputStream:close	()V
    //   571: aload 8
    //   573: ifnull +18 -> 591
    //   576: aload 8
    //   578: invokevirtual 717	java/io/BufferedOutputStream:close	()V
    //   581: goto +10 -> 591
    //   584: astore 17
    //   586: aload 17
    //   588: invokevirtual 718	java/io/IOException:printStackTrace	()V
    //   591: iinc 6 1
    //   594: iload 6
    //   596: aload_0
    //   597: getfield 84	com/gps/api/action/MobileAction:uploadFileFileName	Ljava/util/List;
    //   600: invokeinterface 254 1 0
    //   605: if_icmplt -456 -> 149
    //   608: getstatic 642	java/lang/System:out	Ljava/io/PrintStream;
    //   611: new 264	java/lang/StringBuilder
    //   614: dup
    //   615: ldc_w 721
    //   618: invokespecial 576	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   621: aload_1
    //   622: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   625: ldc_w 650
    //   628: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   631: aload_2
    //   632: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   635: ldc_w 652
    //   638: invokevirtual 580	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   641: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   644: invokevirtual 654	java/io/PrintStream:print	(Ljava/lang/String;)V
    //   647: aload_3
    //   648: aload 4
    //   650: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   653: invokevirtual 723	com/gps/api/model/AlarmImage:setImagePath	(Ljava/lang/String;)V
    //   656: aload_3
    //   657: aload 5
    //   659: invokevirtual 271	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   662: invokevirtual 726	com/gps/api/model/AlarmImage:setImageUrl	(Ljava/lang/String;)V
    //   665: aload_3
    //   666: ldc_w 729
    //   669: invokevirtual 731	com/gps/api/model/AlarmImage:setImageSvrIdno	(Ljava/lang/String;)V
    //   672: aload_0
    //   673: getfield 63	com/gps/api/action/MobileAction:alarmImageService	Lcom/gps/api/service/AlarmImageService;
    //   676: aload_3
    //   677: invokeinterface 734 2 0
    //   682: pop
    //   683: goto +27 -> 710
    //   686: astore_1
    //   687: aload_0
    //   688: getfield 219	com/gps/api/action/MobileAction:log	Lcom/framework/logger/Logger;
    //   691: aload_1
    //   692: invokevirtual 223	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   695: aload_1
    //   696: invokevirtual 226	com/framework/logger/Logger:error	(Ljava/lang/Object;Ljava/lang/Throwable;)V
    //   699: aload_0
    //   700: getstatic 140	com/gps/api/action/MobileAction:ACTION_RESULT	Ljava/lang/String;
    //   703: iconst_1
    //   704: invokestatic 123	java/lang/Integer:valueOf	(I)Ljava/lang/Integer;
    //   707: invokevirtual 143	com/gps/api/action/MobileAction:addCustomResponse	(Ljava/lang/String;Ljava/lang/Object;)V
    //   710: ldc -24
    //   712: areturn
    // Line number table:
    //   Java source line #513	-> byte code offset #0
    //   Java source line #515	-> byte code offset #4
    //   Java source line #516	-> byte code offset #12
    //   Java source line #517	-> byte code offset #20
    //   Java source line #518	-> byte code offset #31
    //   Java source line #519	-> byte code offset #42
    //   Java source line #520	-> byte code offset #54
    //   Java source line #521	-> byte code offset #57
    //   Java source line #522	-> byte code offset #96
    //   Java source line #523	-> byte code offset #104
    //   Java source line #524	-> byte code offset #109
    //   Java source line #525	-> byte code offset #114
    //   Java source line #526	-> byte code offset #125
    //   Java source line #527	-> byte code offset #134
    //   Java source line #528	-> byte code offset #143
    //   Java source line #529	-> byte code offset #149
    //   Java source line #530	-> byte code offset #152
    //   Java source line #531	-> byte code offset #155
    //   Java source line #532	-> byte code offset #171
    //   Java source line #534	-> byte code offset #201
    //   Java source line #535	-> byte code offset #211
    //   Java source line #536	-> byte code offset #234
    //   Java source line #537	-> byte code offset #246
    //   Java source line #538	-> byte code offset #259
    //   Java source line #539	-> byte code offset #288
    //   Java source line #540	-> byte code offset #317
    //   Java source line #541	-> byte code offset #347
    //   Java source line #542	-> byte code offset #377
    //   Java source line #543	-> byte code offset #388
    //   Java source line #544	-> byte code offset #399
    //   Java source line #545	-> byte code offset #404
    //   Java source line #546	-> byte code offset #410
    //   Java source line #547	-> byte code offset #413
    //   Java source line #548	-> byte code offset #416
    //   Java source line #549	-> byte code offset #426
    //   Java source line #550	-> byte code offset #433
    //   Java source line #547	-> byte code offset #436
    //   Java source line #554	-> byte code offset #450
    //   Java source line #555	-> byte code offset #455
    //   Java source line #556	-> byte code offset #488
    //   Java source line #559	-> byte code offset #493
    //   Java source line #560	-> byte code offset #503
    //   Java source line #561	-> byte code offset #513
    //   Java source line #562	-> byte code offset #518
    //   Java source line #557	-> byte code offset #526
    //   Java source line #559	-> byte code offset #528
    //   Java source line #560	-> byte code offset #538
    //   Java source line #561	-> byte code offset #548
    //   Java source line #562	-> byte code offset #553
    //   Java source line #564	-> byte code offset #558
    //   Java source line #559	-> byte code offset #561
    //   Java source line #560	-> byte code offset #571
    //   Java source line #561	-> byte code offset #581
    //   Java source line #562	-> byte code offset #586
    //   Java source line #528	-> byte code offset #591
    //   Java source line #566	-> byte code offset #608
    //   Java source line #567	-> byte code offset #647
    //   Java source line #568	-> byte code offset #656
    //   Java source line #569	-> byte code offset #665
    //   Java source line #570	-> byte code offset #672
    //   Java source line #572	-> byte code offset #683
    //   Java source line #573	-> byte code offset #687
    //   Java source line #574	-> byte code offset #699
    //   Java source line #576	-> byte code offset #710
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	713	0	this	MobileAction
    //   11	611	1	devIdno	String
    //   686	10	1	ex	Exception
    //   19	613	2	armguid	String
    //   103	574	3	armImage	com.gps.api.model.AlarmImage
    //   132	517	4	buildPath	StringBuilder
    //   141	517	5	buildUrl	StringBuilder
    //   144	451	6	i	int
    //   150	417	7	bis	BufferedInputStream
    //   153	424	8	bos	BufferedOutputStream
    //   169	69	9	fileName	String
    //   232	150	10	fis	FileInputStream
    //   453	36	10	e	Exception
    //   244	51	11	ret	String[]
    //   257	136	12	fos	java.io.FileOutputStream
    //   402	27	13	length	int
    //   408	31	14	b	byte[]
    //   411	34	15	len	int
    //   526	33	16	localObject	Object
    //   516	3	17	e	IOException
    //   551	3	17	e	IOException
    //   584	3	17	e	IOException
    // Exception table:
    //   from	to	target	type
    //   201	450	453	java/lang/Exception
    //   493	513	516	java/io/IOException
    //   201	493	526	finally
    //   528	548	551	java/io/IOException
    //   561	581	584	java/io/IOException
    //   4	683	686	java/lang/Exception
  }
  
  public String track()
    throws Exception
  {
    String distance = getRequestString("distance");
    String parkTime = getRequestString("parkTime");
    if ((distance == null) || (distance.isEmpty()) || 
      (parkTime == null) || (parkTime.isEmpty())) {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    } else {
      queryGpsTrack(distance, parkTime, getRequestPagination());
    }
    return "success";
  }
  
  protected void queryGpsTrack(String distance, String parkTime, Pagination pagination)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String devIdno = getRequestString("devIdno");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (devIdno == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
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
        AjaxDto<DeviceTrack> ajaxDto = this.deviceGpsService.queryDeviceGps(devIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, park, pagination, toMap);
        addCustomResponse("tracks", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
  
  public String online()
    throws Exception
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      String[] devices = query.getDevIdnos().split(",");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
      List<DeviceOnline> lstOnline = new ArrayList();
      if (ajaxDto.getPageList() != null) {
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
          
          DeviceOnline online = new DeviceOnline();
          if ((status.getOnline() != null) && (status.getOnline().intValue() == 1)) {
            online.setOnline(true);
          } else {
            online.setOnline(false);
          }
          online.setIdno(status.getDevIdno());
          lstOnline.add(online);
        }
      }
      addCustomResponse("onlines", lstOnline);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String editDevice()
    throws Exception
  {
    try
    {
      String devIDNO = getRequestString("devIDNO");
      String operator = getRequestString("operator");
      String sysUser = getRequestString("sysUser");
      String sysPwd = getRequestString("sysPwd");
      if ((devIDNO == null) || (devIDNO.isEmpty()) || 
        (operator == null) || (operator.isEmpty()) || ((!operator.equals("1")) && (!operator.equals("2"))) || 
        (sysUser == null) || (sysUser.isEmpty()) || (sysPwd == null) || (sysPwd.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        SysUsrInfo user = this.sysUserService.getUserInfoByAccount(sysUser);
        if (user == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
        }
        else if (!sysPwd.equalsIgnoreCase(user.getPassword()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(37));
        }
        else if (operator.equals("1"))
        {
          UserAccount account = this.accountService.findByAccount(devIDNO);
          if ((account != null) || (this.accountService.isAccountUnvalid(devIDNO)))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
          }
          else
          {
            DeviceInfo device = new DeviceInfo();
            device.setDevType(Integer.valueOf(1));
            device.setIdno(devIDNO);
            
            UserAccount userAccount = new UserAccount();
            userAccount.setName(device.getIdno());
            device.setUserAccount(userAccount);
            
            SysDeviceAction.updateUserAccount(device);
            
            SysDeviceAction.initDevice(device);
            if (!this.deviceService.addDeviceInfo(device).booleanValue()) {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
            } else {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
            }
          }
        }
        else
        {
          DeviceInfo device = this.deviceService.findDeviceByIdno(devIDNO);
          if (device != null)
          {
            this.deviceService.delDeviceInfo(device);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
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
  
  public String queryDevice()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceInfo> ajaxDto = this.deviceService.getDeviceList(name, null, null, null, null, null);
      List<DeviceResult> devices = new ArrayList();
      if (ajaxDto.getPageList() != null) {
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceResult result = new DeviceResult();
          DeviceInfo info = (DeviceInfo)ajaxDto.getPageList().get(i);
          result.setName(info.getUserAccount().getName());
          result.setIdno(info.getIdno());
          result.setChnCount(info.getChnCount());
          result.setSimCard(info.getSimCard());
          result.setDriveName(info.getDriverName());
          result.setDriveTele(info.getDriverTele());
          devices.add(result);
        }
      }
      addCustomResponse("devices", devices);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String queryUser()
    throws Exception
  {
    try
    {
      String userid = getRequestString("userid");
      if ((userid == null) || (userid.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)this.userService.get(Integer.valueOf(Integer.parseInt(userid)));
        if (user != null) {
          addCustomResponse("account", user.getUserAccount().getAccount());
        } else {
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
  
  public String queryUserNew()
    throws Exception
  {
    try
    {
      String code = getRequestString("code");
      if ((code == null) || (code.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        LiveVideoSession liveVideo = this.userService.findLiveVideoSessionById(Integer.valueOf(Integer.parseInt(code)));
        if (liveVideo != null)
        {
          UserInfo user = (UserInfo)this.userService.get(liveVideo.getUserId());
          if (user != null) {
            addCustomResponse("account", user.getUserAccount().getAccount());
          } else {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  public String devList()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = this.deviceService.getClientDeviceList(name, null, null, getRequestPagination());
      addCustomResponse("devices", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String queryAlarm()
  {
    try
    {
      String updateTime = getRequestString("createTime");
      String type = getRequestString("type");
      List<Integer> lstArmType = new ArrayList();
      if ((type != null) && (!type.isEmpty()))
      {
        String[] armType = type.split(",");
        for (int i = 0; i < armType.length; i++) {
          if (!armType[i].isEmpty()) {
            lstArmType.add(Integer.valueOf(Integer.parseInt(armType[i])));
          }
        }
      }
      AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarmList(updateTime, lstArmType, "", null);
      addCustomResponse("alarms", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String queryAlarmMobile()
  {
    try
    {
      String armType = getRequestString("armType");
      String devicle = getRequestString("devicle");
      String startTime = getRequestString("startTime");
      String endTime = getRequestString("endTime");
      String type = getRequestString("type");
      List<Integer> lstArmType = new ArrayList();
      if ((armType != null) && (!armType.isEmpty()))
      {
        String[] armTypes = armType.split(",");
        for (int i = 0; i < armTypes.length; i++) {
          if (!armTypes[i].isEmpty()) {
            lstArmType.add(Integer.valueOf(Integer.parseInt(armTypes[i])));
          }
        }
      }
      AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarmMobileList(startTime, endTime, lstArmType, devicle.split(","), type, getRequestPagination());
      addCustomResponse("alarms", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String updateAlarmHandle()
  {
    try
    {
      String guids = getRequestString("guid");
      List<String> lstGuid = new ArrayList();
      if ((guids != null) && (!guids.isEmpty()))
      {
        String[] strs = guids.split(",");
        for (int i = 0; i < strs.length; i++) {
          if (!strs[i].isEmpty()) {
            lstGuid.add(strs[i]);
          }
        }
      }
      List<DeviceAlarm> alarms = this.deviceAlarmService.queryDeviceAlarm(lstGuid);
      for (DeviceAlarm alarm : alarms)
      {
        alarm.setHandleUserID(Integer.valueOf(1));
        alarm.setHandleTime(new Date());
        this.deviceAlarmService.save(alarm);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String queryNews()
  {
    try
    {
      String id = getRequestString("id");
      AjaxDto<SysNews> ajaxDto = this.deviceAlarmService.queryNews(id, "", null);
      addCustomResponse("news", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String fileExistsToMd()
  {
    String path = getRequest().getParameter("file");
    if (!"".equals(path))
    {
      try
      {
        path = new String(path.getBytes("ISO-8859-1"), "UTF-8");
        File file = new File(getServletContext().getRealPath("/") + path);
        if (file.exists())
        {
          String md5 = MD5EncryptUtils.getFileMD5String(file);
          addCustomResponse("md5", md5);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(44));
          this.log.error("����������");
        }
      }
      catch (UnsupportedEncodingException ex)
      {
        this.log.error(ex.getMessage(), ex);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
      }
      catch (IOException ex)
      {
        this.log.error(ex.getMessage(), ex);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
      }
    }
    else
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      this.log.error("������������");
    }
    return "success";
  }
  
  public String downLoad()
  {
    String path = getRequest().getParameter("path");
    if (!"".equals(path))
    {
      try
      {
        InputStream ins = null;
        BufferedInputStream bins = null;
        OutputStream outs = null;
        BufferedOutputStream bouts = null;
        path = new String(path.getBytes("ISO-8859-1"), "UTF-8");
        File file = new File(getServletContext().getRealPath("/") + path);
        if (file.exists())
        {
          ins = new FileInputStream(getServletContext().getRealPath("/") + path);
          bins = new BufferedInputStream(ins);
          outs = getResponse().getOutputStream();
          bouts = new BufferedOutputStream(outs);
          getResponse().setContentType("application/x-download");
          getResponse().setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
          int b = 0;
          byte[] buffer = new byte['?'];
          while ((b = bins.read(buffer)) != -1) {
            bouts.write(buffer, 0, b);
          }
          bouts.flush();
          ins.close();
          bins.close();
          outs.close();
          bouts.close();
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(44));
          this.log.error("����������������");
        }
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
      }
    }
    else
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      this.log.error("������������������");
    }
    return "success";
  }
  
  public String queryAlarmMobileByGUID()
  {
    try
    {
      String guids = getRequestString("guid");
      List<String> lstGuid = new ArrayList();
      if ((guids != null) && (!guids.isEmpty()))
      {
        String[] strs = guids.split(",");
        for (int i = 0; i < strs.length; i++) {
          if (!strs[i].isEmpty()) {
            lstGuid.add(strs[i]);
          }
        }
      }
      List<DeviceAlarm> alarms = this.deviceAlarmService.queryDeviceAlarm(lstGuid);
      addCustomResponse("alarms", alarms);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void setNewVehicle(StandardVehicle oldVehicle, VehicleInfo newVehicle)
  {
    newVehicle.setId(oldVehicle.getId());
    newVehicle.setVehiIDNO(oldVehicle.getVehiIDNO());
    newVehicle.setVehiColor(oldVehicle.getVehiColor());
    newVehicle.setPlateType(oldVehicle.getPlateType());
    newVehicle.setCompanyId(oldVehicle.getCompany().getId());
    newVehicle.setIcon(oldVehicle.getIcon());
    newVehicle.setChnCount(oldVehicle.getChnCount());
    newVehicle.setChnName(oldVehicle.getChnName());
  }
  
  protected void setNewDevice(StandardVehiDevRelation relation, StandardDeviceInfo newDevice)
  {
    newDevice.setId(relation.getDevice().getId());
    newDevice.setDevIDNO(relation.getDevice().getDevIDNO());
    newDevice.setChnAttr(relation.getChnAttr());
    newDevice.setModule(relation.getModule());
    newDevice.setMainDev(relation.getMainDev());
  }
  
  protected void setNewStatus(DeviceStatus oldStatus, DeviceStatusInfo newStatus)
  {
    newStatus.setId(oldStatus.getId());
    newStatus.setDevIdno(oldStatus.getDevIdno());
    newStatus.setGaoDu(oldStatus.getGaoDu());
    newStatus.setGpsTime(DateUtil.dateSwitchString(oldStatus.getGpsTime()));
    newStatus.setHuangXiang(oldStatus.getHuangXiang());
    newStatus.setJingDu(oldStatus.getJingDu());
    newStatus.setLiCheng(oldStatus.getLiCheng());
    newStatus.setOnline(oldStatus.getOnline());
    newStatus.setParkTime(oldStatus.getParkTime());
    newStatus.setSpeed(oldStatus.getSpeed());
    newStatus.setStatus1(oldStatus.getStatus1());
    newStatus.setStatus2(oldStatus.getStatus2());
    newStatus.setStatus3(oldStatus.getStatus3());
    newStatus.setStatus4(oldStatus.getStatus4());
    newStatus.setWeiDu(oldStatus.getWeiDu());
    newStatus.setTempSensor1(oldStatus.getTempSensor1());
    newStatus.setTempSensor2(oldStatus.getTempSensor2());
    newStatus.setTempSensor3(oldStatus.getTempSensor3());
    newStatus.setTempSensor4(oldStatus.getTempSensor4());
    newStatus.setMapJingDu(oldStatus.getMapJingDu());
    newStatus.setMapWeiDu(oldStatus.getMapWeiDu());
  }
  
  protected List<StandardCompany> findUserCompanys(StandardCompany company, List<Integer> lstLevel)
  {
    List<StandardCompany> companys = new ArrayList();
    boolean isAdmin = company.getId().intValue() == -1;
    Integer parentId = null;
    if (!isAdmin) {
      parentId = company.getId();
    }
    List<Integer> lstCompanyId = this.standardUserService.getCompanyIdList(parentId, lstLevel, isAdmin);
    if ((lstCompanyId != null) && (lstCompanyId.size() > 0)) {
      companys = this.standardUserService.getStandardCompanyList(lstCompanyId);
    }
    if (companys != null) {
      for (int i = companys.size() - 1; i >= 0; i--)
      {
        StandardCompany compy = (StandardCompany)companys.get(i);
        compy.setIsMine(Integer.valueOf(0));
        if (compy.getId().intValue() == -1) {
          companys.remove(i);
        }
      }
    }
    if (!isAdmin)
    {
      company.setIsMine(Integer.valueOf(1));
      companys.add(company);
    }
    return companys;
  }
  
  public String standardTerminal()
    throws Exception
  {
    try
    {
      Integer accountId = Integer.valueOf(Integer.parseInt(getRequestString("accountId")));
      String jsession = getJsession();
      String toMap = getRequestString("toMap");
      if ((accountId == null) || (jsession == null))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        List<StandardVehicle> oldVehicles = new ArrayList();
        List<VehicleInfo> vehicles = new ArrayList();
        StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, accountId);
        StandardUserVehiPermitVehicle permit;
        if (user.getAccount().equals("admin"))
        {
          AjaxDto<StandardVehicle> vehicleList = this.standardUserService.getStandardVehicleList(null, null, null);
          oldVehicles = vehicleList.getPageList();
        }
        else
        {
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(accountId, null, null);
          if ((vehiPermits != null) && (vehiPermits.size() > 0)) {
            for (Iterator localIterator1 = vehiPermits.iterator(); localIterator1.hasNext();)
            {
              permit = (StandardUserVehiPermitVehicle)localIterator1.next();
              oldVehicles.add(permit.getVehicle());
            }
          }
        }
        VehicleInfo newVehicle;
        for (StandardVehicle oldVehicle : oldVehicles)
        {
          List<StandardVehiDevRelation> relations = this.standardUserService.getStandardVehiDevRelationList(oldVehicle.getVehiIDNO(), null);
          newVehicle = new VehicleInfo();
          setNewVehicle(oldVehicle, newVehicle);
          List<StandardDeviceInfo> deviceLists = new ArrayList();
          if ((relations != null) && (((List)relations).size() > 0)) {
        	 
            for (StandardVehiDevRelation relation : relations )
            {
              StandardDeviceInfo newDevice = new StandardDeviceInfo();
              setNewDevice(relation, newDevice);
              deviceLists.add(newDevice);
            }
          }
          newVehicle.setDevice(deviceLists);
          vehicles.add(newVehicle);
        }
        List<StandardCompany> oldTeams = findUserCompanys(user.getCompany(), null);
        List<VehicleTeam> teams = new ArrayList();
        for (StandardCompany oldTeam : oldTeams)
        {
          VehicleTeam newTeam = new VehicleTeam();
          newTeam.setId(oldTeam.getId());
          newTeam.setName(oldTeam.getName());
          newTeam.setParentId(oldTeam.getParentId());
          newTeam.setLevel(oldTeam.getLevel());
          teams.add(newTeam);
        }
        Object ajaxStatus = this.deviceService.getStandardDeviceStatus(vehicles);
        
        Map<String, DeviceStatus> mapStatus = new HashMap();
        if (((AjaxDto)ajaxStatus).getPageList() != null) {
          for (int i = 0; i < ((AjaxDto)ajaxStatus).getPageList().size(); i++)
          {
            DeviceStatus status = (DeviceStatus)((AjaxDto)ajaxStatus).getPageList().get(i);
            
            GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap);
            status.setMapJingDu(gpsValue.getMapJingDu());
            status.setMapWeiDu(gpsValue.getMapWeiDu());
            mapStatus.put(status.getDevIdno(), status);
          }
        }
        List<VehicleInfo> vehicleLists = new ArrayList();
        List<VehicleInfo> offlineLists = new ArrayList();
        for (int i = 0; i < vehicles.size(); i++)
        {
          List<StandardDeviceInfo> deviceLists = new ArrayList();
          List<StandardDeviceInfo> offdeviceLists = new ArrayList();
          List<StandardDeviceInfo> devices = ((VehicleInfo)vehicles.get(i)).getDevice();
          boolean flag = false;
          for (int j = 0; j < devices.size(); j++)
          {
            StandardDeviceInfo device = (StandardDeviceInfo)devices.get(j);
            DeviceStatusInfo status = new DeviceStatusInfo();
            setNewStatus((DeviceStatus)mapStatus.get(device.getDevIDNO()), status);
            if (status != null)
            {
              if (status.getJingDu() == null) {
                status.setJingDu(Integer.valueOf(0));
              }
              if (status.getWeiDu() == null) {
                status.setWeiDu(Integer.valueOf(0));
              }
            }
            device.setStatus(status);
            if ((status != null) && (status.getOnline() != null) && (status.getOnline().intValue() > 0))
            {
              deviceLists.add(device);
              flag = true;
            }
            else
            {
              offdeviceLists.add(device);
            }
          }
          deviceLists.addAll(offdeviceLists);
          ((VehicleInfo)vehicles.get(i)).setDevice(deviceLists);
          if (flag) {
            vehicleLists.add((VehicleInfo)vehicles.get(i));
          } else {
            offlineLists.add((VehicleInfo)vehicles.get(i));
          }
        }
        vehicleLists.addAll(offlineLists);
        addCustomResponse("vehicles", vehicleLists);
        addCustomResponse("vehiTeam", teams);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String standardTrack()
    throws Exception
  {
    String distance = getRequestString("distance");
    String parkTime = getRequestString("parkTime");
    if ((distance == null) || (distance.isEmpty()) || 
      (parkTime == null) || (parkTime.isEmpty())) {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    } else {
      queryStandardGpsTrack(distance, parkTime, getRequestPagination());
    }
    return "success";
  }
  
  protected void queryStandardGpsTrack(String distance, String parkTime, Pagination pagination)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String vehiIdno = getRequestString("vehiIdno");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (vehiIdno == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
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
        AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, 0, 0, park, 0, 0, pagination, toMap, null);
        addCustomResponse("tracks", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
}
