package com.framework.web.action;

import com.framework.jasperReports.ReportCreater;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.Configuration;
import com.framework.web.dto.Pagination;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.SessionAware;
import org.apache.struts2.util.ServletContextAware;

public abstract class BaseAction
  extends ActionSupport
  implements ServletContextAware, SessionAware
{
  private static final long serialVersionUID = 1L;
  public static final int googleMap = 1;
  public static final int baiduMap = 2;
  public static final int LOGIN_RET_SUCCESS = 0;
  public static final int LOGIN_RET_NAME_ERROR = 1;
  public static final int LOGIN_RET_PWD_ERROR = 2;
  public static final int LOGIN_RET_EXPIRE_ERROR = 3;
  public static final int LOGIN_RET_VERIFICATION_ERROR = 4;
  public static final int LOGIN_RET_EXCEPTION_ERROR = 5;
  public static final int Login_RET_NOT_AUDIT = 6;
  public static final int LOGIN_RET_EXCEPTION_ACCOUNT = 7;
  
  public static boolean getEnableDownloadClientWin()
  {
    return enableDownloadClientWin;
  }
  
  public static void setEnableDownloadClientWin(boolean enableDownloadClientWin)
  {
    enableDownloadClientWin = enableDownloadClientWin;
  }
  
  public static boolean getEnableDownloadClientIos()
  {
    return enableDownloadClientIos;
  }
  
  public static void setEnableDownloadClientIos(boolean enableDownloadClientIos)
  {
    enableDownloadClientIos = enableDownloadClientIos;
  }
  
  public static boolean getEnableDownloadClientAndroidBaidu()
  {
    return enableDownloadClientAndroidBaidu;
  }
  
  public static void setEnableDownloadClientAndroidBaidu(boolean enableDownloadClientAndroidBaidu)
  {
    enableDownloadClientAndroidBaidu = enableDownloadClientAndroidBaidu;
  }
  
  public static boolean getEnableDownloadClientAndroidGoogle()
  {
    return enableDownloadClientAndroidGoogle;
  }
  
  public static void setEnableDownloadClientAndroidGoogle(boolean enableDownloadClientAndroidGoogle)
  {
    enableDownloadClientAndroidGoogle = enableDownloadClientAndroidGoogle;
  }
  
  public static boolean getEnableDownloadClientPlayer()
  {
    return enableDownloadClientPlayer;
  }
  
  public static void setEnableDownloadClientPlayer(boolean enableDownloadClientPlayer)
  {
    enableDownloadClientPlayer = enableDownloadClientPlayer;
  }
  
  public static boolean getEnableDownloadClientMapinfo()
  {
    return enableDownloadClientMapinfo;
  }
  
  public static void setEnableDownloadClientMapinfo(boolean enableDownloadClientMapinfo)
  {
    enableDownloadClientMapinfo = enableDownloadClientMapinfo;
  }
  
  public static String ACTION_RESULT = "result";
  public static String JSON_RESULT = "jsonresult";
  public static final int RET_SUCCESS = 0;
  public static final int RET_EXCEPTION_ERROR = 1;
  public static final int RET_SESSION_UNVALID = 2;
  public static final int RET_REQUIRE_TIMEOUT = 3;
  public static final int RET_EXCEPTION_REQUEST = 4;
  public static final int RET_EXCEPTION_NETWORK = 5;
  public static final int RET_TIME_FROMAT_ERR = 6;
  public static final int RET_TIME_RANGE_ERR = 7;
  public static final int RET_REQUIRE_PARAM = 8;
  public static final int RET_SERVER_NO_EXIST = 9;
  public static final int RET_SERVER_TYPE_ERR = 10;
  public static final int RET_IDNO_EXIST = 11;
  public static final int RET_DEVICE_NO_EXIST = 12;
  public static final int RET_DEVICE_LIMIT_ERR = 13;
  public static final int RET_DEVICE_BATCH_IDNO_ERR = 14;
  public static final int RET_ACCOUNT_EXIST = 15;
  public static final int RET_CLIENT_NO_EXIST = 16;
  public static final int RET_CLIENT_HAS_DEVICE = 17;
  public static final int RET_CLIENT_HAS_USER = 18;
  public static final int RET_OLD_PWD_ERROR = 19;
  public static final int RET_USER_NO_EXIST = 20;
  public static final int RET_ROLE_NO_EXIST = 21;
  public static final int RET_ROLE_NAME_EXIST = 22;
  public static final int RET_ROLE_HAS_USER = 23;
  public static final int RET_NO_PRIVILIGE = 24;
  public static final int RET_VEHICLE_NO_EXIST = 25;
  public static final int RET_GROUP_NO_EXIST = 26;
  public static final int RET_GROUP_HAS_USED = 27;
  public static final int RET_DB_CONN_ERR = 28;
  public static final int RET_NAME_EXIST = 29;
  public static final int RET_NO_EXIST = 30;
  public static final int RET_DOWN_STATION_SSID_EXIST = 31;
  public static final int RET_DOWN_STATION_USED = 32;
  public static final int RET_DOWN_STATION_NO_EXIST = 33;
  public static final int RET_GROUP_NAME_USED = 34;
  public static final int RET_DEVICE_HAS_REGISTER = 35;
  public static final int RET_SERVER_NO_SUPPORT = 36;
  public static final int RET_USER_PWD_ERROR = 37;
  public static final int RET_USER_VERIFY_CODE = 38;
  public static final int RET_DEVICE_IDNO_USED = 39;
  public static final int RET_NOT_CLIENT_ACCOUNT = 40;
  public static final int RET_IMAGE_SIZE_ERR = 41;
  public static final int RET_IMAGE_TYPE_ERR = 42;
  public static final int RET_SEND_EMAIL_ERR = 43;
  public static final int RET_File_NOT_EXIST = 44;
  public static final int RET_COMPANY_HAS_COMPANY = 45;
  public static final int RET_USER_DISABLED = 46;
  public static final int RET_INSTALLED = 47;
  public static final int RET_JOBNUM_EXIST = 48;
  public static final int RET_SIMCARD_EXIST = 49;
  public static final int RET_VEHITEAM_NOT_MOVE = 50;
  public static final int RET_RULE_EXIST = 51;
  public static final int RET_TYPE_EXIST = 52;
  public static final int RET_BRAND_EXIST = 53;
  public static final int RET_DEVICE_USED = 54;
  public static final int RET_MARK_NAME_USED = 55;
  public static final int RET_MARK_USED = 56;
  public static final int RET_USER_RESPONSE_ERR = 57;
  public static final int RET_DOWNLOADTASK_EXIST = 58;
  public static final int RET_DEVICE_OFFLINE = 59;
  public static final int RET_MEDIA_ADDRESS_ERR = 60;
  public static final int RET_SAFE_EXIST = 61;
  public static final int RET_LINE_NOT_EXIST = 62;
  public static final int RET_LINE_NAME_ERR = 63;
  public static final int RET_LINE_HAS_VEHICLE = 64;
  public static final int LOGIN_CLIENT_LOGIN = 1;
  protected static final String EXCEL = "excel";
  public static final int GPS_SVR_CONFIG_FENCE = 0;
  public static final int GPS_SVR_CONFIG_SMS = 1;
  public static final int GPS_SVR_CONFIG_AUTO_DOWN = 2;
  public static final int GPS_SVR_CONFIG_FLOW = 3;
  public static final int GPS_SVR_CONFIG_PHONE = 4;
  public static final int GPS_SVR_CONFIG_PLAYBACK = 5;
  public static final int GPS_SVR_CONFIG_CENTER_STORAGE = 6;
  public static final int GPS_SVR_CONFIG_TRACKER = 7;
  public final transient Logger log = Logger.getLogger(getClass());
  private Map session;
  private ServletContext context;
  private Pagination pagination;
  private Map customResponseMap = null;
  protected InputStream excelStream;
  protected String excelFile = "";
  protected boolean hasExcelRight = true;
  protected boolean hasCsvRight = true;
  protected boolean hasPdfRight = true;
  protected String excelError;
  private static boolean isInitialize = false;
  private static boolean enableMdvr = false;
  private static boolean enableMobile = false;
  private static boolean enableDvr = false;
  private static boolean enablePad = false;
  private static boolean enableGps = false;
  private static boolean enableAutoDown = false;
  private static boolean enableAdvertising = false;
  private static boolean enableReportNormal = false;
  private static boolean enableReportSpeed = false;
  private static boolean enableReportLogin = false;
  private static boolean enableReportIoin = false;
  private static boolean enableReportAlarm = false;
  private static boolean enableReportOil = false;
  private static boolean enableReportPark = false;
  private static boolean enableReportFence = false;
  private static boolean enableReportStorage = false;
  private static boolean enableReportEquipment = false;
  private static boolean enableReportFatigue = false;
  private static boolean enableHasReceipt = false;
  private static boolean enableHasAddArea = false;
  private static boolean enableHasRoadRule = false;
  private static boolean enableChecksum = false;
  private static boolean enableHasDrivingBehavior = false;
  private static boolean enableHasLiCheng = false;
  private static boolean enableHasDriving = false;
  private static boolean enableHasMalfunction = false;
  private static boolean enableHasVideo = false;
  private static boolean enableHasMedia = false;
  private static boolean enableHasData = false;
  private static boolean enableHasUserBehavior = false;
  private static boolean enableHasTraffic = false;
  private static boolean enableHasTemperature = false;
  private static boolean enableHasSign = false;
  private static boolean enableTrip = false;
  private static boolean enableTpms = false;
  private static boolean enableHasOBD = false;
  private static boolean enableShowClient = false;
  private static boolean enableTerminalGroup = false;
  private static boolean enableTerminalFence = false;
  private static boolean enableShowLocation = false;
  private static boolean enableEditMileage = false;
  private static boolean enableUpdatePwd = false;
  private static boolean enableSqlServer = false;
  private static boolean enableTerminalSnapshot = false;
  private static boolean enableTerminalRecord = false;
  private static boolean enableTerminalAlarmAction = false;
  private static boolean enableTerminalDriver = false;
  private static boolean enableLargeAudit = false;
  private static boolean enableGeoAddress = false;
  private static boolean enableGeoByLanguage = false;
  private static String openAccount = null;
  private static String openPassword = null;
  
  public static String getOpenAccount()
  {
    return openAccount;
  }
  
  public static void setOpenAccount(String openAccount)
  {
    openAccount = openAccount;
  }
  
  public static String getOpenPassword()
  {
    return openPassword;
  }
  
  public static void setOpenPassword(String openPassword)
  {
    openPassword = openPassword;
  }
  
  private static boolean enableBetaVersion = false;
  
  public static boolean getEnableBetaVersion()
  {
    return enableBetaVersion;
  }
  
  public static void setEnableBetaVersion(boolean enableBetaVersion)
  {
    enableBetaVersion = enableBetaVersion;
  }
  
  public static boolean getEnableGeoByLanguage()
  {
    return enableGeoByLanguage;
  }
  
  public static void setEnableGeoByLanguage(boolean enableGeoByLanguage)
  {
    enableGeoByLanguage = enableGeoByLanguage;
  }
  
  public static boolean getEnableGeoAddress()
  {
    return enableGeoAddress;
  }
  
  public static void setEnableGeoAddress(boolean enableGeoAddress)
  {
    enableGeoAddress = enableGeoAddress;
  }
  
  public static boolean getEnableLargeAudit()
  {
    return enableLargeAudit;
  }
  
  public static void setEnableLargeAudit(boolean enableLargeAudit)
  {
    enableLargeAudit = enableLargeAudit;
  }
  
  private static boolean enableDownloadClientWin = true;
  private static boolean enableDownloadClientIos = true;
  private static boolean enableDownloadClientAndroidBaidu = true;
  private static boolean enableDownloadClientAndroidGoogle = true;
  private static boolean enableDownloadClientPlayer = true;
  private static boolean enableDownloadClientMapinfo = false;
  private static boolean enableClientRePort = true;
  
  public static boolean getEnableClientRePort()
  {
    return enableClientRePort;
  }
  
  public static void setEnableClientRePort(boolean enableClientRePort)
  {
    enableClientRePort = enableClientRePort;
  }
  
  private static boolean enableTrackPlay = false;
  
  public static boolean getEnableTrackPlay()
  {
    return enableTrackPlay;
  }
  
  public static void setEnableTrackPlay(boolean enableTrackPlay)
  {
    enableTrackPlay = enableTrackPlay;
  }
  
  public static boolean getEnableTerminalGroup()
  {
    return enableTerminalGroup;
  }
  
  public static void setEnableTerminalGroup(boolean enableTerminalGroup)
  {
    enableTerminalGroup = enableTerminalGroup;
  }
  
  public static boolean getEnableTerminalFence()
  {
    return enableTerminalFence;
  }
  
  public static void setEnableTerminalFence(boolean enableTerminalFence)
  {
    enableTerminalFence = enableTerminalFence;
  }
  
  public static boolean getEnableShowLocation()
  {
    return enableShowLocation;
  }
  
  public static void setEnableShowLocation(boolean enableShowLocation)
  {
    enableShowLocation = enableShowLocation;
  }
  
  public static boolean getEnableEditMileage()
  {
    return enableEditMileage;
  }
  
  public static void setEnableEditMileage(boolean enableEditMileage)
  {
    enableEditMileage = enableEditMileage;
  }
  
  public static boolean getEnableUpdatePwd()
  {
    return enableUpdatePwd;
  }
  
  public static void setEnableUpdatePwd(boolean enableUpdatePwd)
  {
    enableUpdatePwd = enableUpdatePwd;
  }
  
  public static boolean getEnableSqlServer()
  {
    return enableSqlServer;
  }
  
  public static void setEnableSqlServer(boolean enableSqlServer)
  {
    enableSqlServer = enableSqlServer;
  }
  
  public static boolean getEnableTerminalSnapshot()
  {
    return enableTerminalSnapshot;
  }
  
  public static void setEnableTerminalSnapshot(boolean enableTerminalSnapshot)
  {
    enableTerminalSnapshot = enableTerminalSnapshot;
  }
  
  public static boolean getEnableTerminalRecord()
  {
    return enableTerminalRecord;
  }
  
  public static void setEnableTerminalRecord(boolean enableTerminalRecord)
  {
    enableTerminalRecord = enableTerminalRecord;
  }
  
  public static boolean getEnableTerminalAlarmAction()
  {
    return enableTerminalAlarmAction;
  }
  
  public static void setEnableTerminalAlarmAction(boolean enableTerminalAlarmAction)
  {
    enableTerminalAlarmAction = enableTerminalAlarmAction;
  }
  
  public static boolean getEnableTerminalDriver()
  {
    return enableTerminalDriver;
  }
  
  public static void setEnableTerminalDriver(boolean enableTerminalDriver)
  {
    enableTerminalDriver = enableTerminalDriver;
  }
  
  public static boolean getEnableReportFence()
  {
    return enableReportFence;
  }
  
  public static void setEnableReportFence(boolean enableReportFence)
  {
    enableReportFence = enableReportFence;
  }
  
  public static boolean getEnableReport3GFlow()
  {
    return enableReport3GFlow;
  }
  
  public static void setEnableReport3GFlow(boolean enableReport3GFlow)
  {
    enableReport3GFlow = enableReport3GFlow;
  }
  
  public static boolean getEnableReportStorage()
  {
    return enableReportStorage;
  }
  
  public static void setEnableReportStorage(boolean enableReportStorage)
  {
    enableReportStorage = enableReportStorage;
  }
  
  public static boolean getEnableReportEquipment()
  {
    return enableReportEquipment;
  }
  
  public static void setEnableReportEquipment(boolean enableReportEquipment)
  {
    enableReportEquipment = enableReportEquipment;
  }
  
  public static boolean getEnableReportFatigue()
  {
    return enableReportFatigue;
  }
  
  public static void setEnableReportFatigue(boolean enableReportFatigue)
  {
    enableReportFatigue = enableReportFatigue;
  }
  
  public static boolean getEnableHasReceipt()
  {
    return enableHasReceipt;
  }
  
  public static void setEnableHasReceipt(boolean enableHasReceipt)
  {
    enableHasReceipt = enableHasReceipt;
  }
  
  public static boolean getEnableHasAddArea()
  {
    return enableHasAddArea;
  }
  
  public static void setEnableHasAddArea(boolean enableHasAddArea)
  {
    enableHasAddArea = enableHasAddArea;
  }
  
  public static boolean getEnableHasRoadRule()
  {
    return enableHasRoadRule;
  }
  
  public static void setEnableHasRoadRule(boolean enableHasRoadRule)
  {
    enableHasRoadRule = enableHasRoadRule;
  }
  
  public static boolean getEnableChecksum()
  {
    return enableChecksum;
  }
  
  public static void setEnableChecksum(boolean enableChecksum)
  {
    enableChecksum = enableChecksum;
  }
  
  public static boolean getEnableHasDrivingBehavior()
  {
    return enableHasDrivingBehavior;
  }
  
  public static void setEnableHasDrivingBehavior(boolean enableHasDrivingBehavior)
  {
    enableHasDrivingBehavior = enableHasDrivingBehavior;
  }
  
  public static boolean getEnableHasLiCheng()
  {
    return enableHasLiCheng;
  }
  
  public static void setEnableHasLiCheng(boolean enableHasLiCheng)
  {
    enableHasLiCheng = enableHasLiCheng;
  }
  
  public static boolean getEnableHasDriving()
  {
    return enableHasDriving;
  }
  
  public static void setEnableHasDriving(boolean enableHasDriving)
  {
    enableHasDriving = enableHasDriving;
  }
  
  public static boolean getEnableHasMalfunction()
  {
    return enableHasMalfunction;
  }
  
  public static void setEnableHasMalfunction(boolean enableHasMalfunction)
  {
    enableHasMalfunction = enableHasMalfunction;
  }
  
  public static boolean getEnableHasVideo()
  {
    return enableHasVideo;
  }
  
  public static void setEnableHasVideo(boolean enableHasVideo)
  {
    enableHasVideo = enableHasVideo;
  }
  
  public static boolean getEnableHasMedia()
  {
    return enableHasMedia;
  }
  
  public static void setEnableHasMedia(boolean enableHasMedia)
  {
    enableHasMedia = enableHasMedia;
  }
  
  public static boolean getEnableHasData()
  {
    return enableHasData;
  }
  
  public static void setEnableHasData(boolean enableHasData)
  {
    enableHasData = enableHasData;
  }
  
  public static boolean getEnableHasUserBehavior()
  {
    return enableHasUserBehavior;
  }
  
  public static void setEnableHasUserBehavior(boolean enableHasUserBehavior)
  {
    enableHasUserBehavior = enableHasUserBehavior;
  }
  
  public static boolean getEnableHasTraffic()
  {
    return enableHasTraffic;
  }
  
  public static void setEnableHasTraffic(boolean enableHasTraffic)
  {
    enableHasTraffic = enableHasTraffic;
  }
  
  public static boolean getEnableHasTemperature()
  {
    return enableHasTemperature;
  }
  
  public static void setEnableHasTemperature(boolean enableHasTemperature)
  {
    enableHasTemperature = enableHasTemperature;
  }
  
  public static boolean getEnableHasSign()
  {
    return enableHasSign;
  }
  
  public static void setEnableHasSign(boolean enableHasSign)
  {
    enableHasSign = enableHasSign;
  }
  
  public static boolean getEnableTrip()
  {
    return enableTrip;
  }
  
  public static void setEnableTrip(boolean enableTrip)
  {
    enableTrip = enableTrip;
  }
  
  public static boolean getEnableTpms()
  {
    return enableTpms;
  }
  
  public static void setEnableTpms(boolean enableTpms)
  {
    enableTpms = enableTpms;
  }
  
  public static boolean getEnableHasOBD()
  {
    return enableHasOBD;
  }
  
  public static void setEnableHasOBD(boolean enableHasOBD)
  {
    enableHasOBD = enableHasOBD;
  }
  
  public static boolean getEnableShowClient()
  {
    return enableShowClient;
  }
  
  public static void setEnableShowClient(boolean enableShowClient)
  {
    enableShowClient = enableShowClient;
  }
  
  private static boolean enableReport3GFlow = false;
  private static boolean enableReportExtern = false;
  private static boolean enableReportDispatch = false;
  
  public static boolean getEnableReportNormal()
  {
    return enableReportNormal;
  }
  
  public static void setEnableReportNormal(boolean enableReportNormal)
  {
    enableReportNormal = enableReportNormal;
  }
  
  public static boolean getEnableReportSpeed()
  {
    return enableReportSpeed;
  }
  
  public static void setEnableReportSpeed(boolean enableReportSpeed)
  {
    enableReportSpeed = enableReportSpeed;
  }
  
  public static boolean getEnableReportLogin()
  {
    return enableReportLogin;
  }
  
  public static void setEnableReportLogin(boolean enableReportLogin)
  {
    enableReportLogin = enableReportLogin;
  }
  
  public static boolean getEnableReportIoin()
  {
    return enableReportIoin;
  }
  
  public static void setEnableReportIoin(boolean enableReportIoin)
  {
    enableReportIoin = enableReportIoin;
  }
  
  public static boolean getEnableReportAlarm()
  {
    return enableReportAlarm;
  }
  
  public static void setEnableReportAlarm(boolean enableReportAlarm)
  {
    enableReportAlarm = enableReportAlarm;
  }
  
  public static boolean getEnableReportOil()
  {
    return enableReportOil;
  }
  
  public static void setEnableReportOil(boolean enableReportOil)
  {
    enableReportOil = enableReportOil;
  }
  
  public static boolean getEnableReportPark()
  {
    return enableReportPark;
  }
  
  public static void setEnableReportPark(boolean enableReportPark)
  {
    enableReportPark = enableReportPark;
  }
  
  public static boolean getEnableReportExtern()
  {
    return enableReportExtern;
  }
  
  public static void setEnableReportExtern(boolean enableReportExtern)
  {
    enableReportExtern = enableReportExtern;
  }
  
  public static boolean getEnableReportDispatch()
  {
    return enableReportDispatch;
  }
  
  public static void setEnableReportDispatch(boolean enableReportDispatch)
  {
    enableReportDispatch = enableReportDispatch;
  }
  
  public BaseAction()
  {
    loadConfig();
  }
  
  public static boolean getEnableAutoDown()
  {
    return enableAutoDown;
  }
  
  public static void setEnableAutoDown(boolean enableAutoDown)
  {
    enableAutoDown = enableAutoDown;
  }
  
  public static boolean getEnableAdvertising()
  {
    return enableAdvertising;
  }
  
  public static void setEnableAdvertising(boolean enableAdvertising)
  {
    enableAdvertising = enableAdvertising;
  }
  
  public static boolean isInitialize()
  {
    return isInitialize;
  }
  
  public static void setInitialize(boolean isInitialize)
  {
    isInitialize = isInitialize;
  }
  
  public static boolean getEnableMdvr()
  {
    return enableMdvr;
  }
  
  public static void setEnableMdvr(boolean enableMdvr)
  {
    enableMdvr = enableMdvr;
  }
  
  public static boolean getEnableMobile()
  {
    return enableMobile;
  }
  
  public static void setEnableMobile(boolean enableMobile)
  {
    enableMobile = enableMobile;
  }
  
  public static boolean getEnableDvr()
  {
    return enableDvr;
  }
  
  public static void setEnableDvr(boolean enableDvr)
  {
    enableDvr = enableDvr;
  }
  
  public static boolean getEnablePad()
  {
    return enablePad;
  }
  
  public static void setEnablePad(boolean enablePad)
  {
    enablePad = enablePad;
  }
  
  public static boolean getEnableGps()
  {
    return enableGps;
  }
  
  public static void setEnableGps(boolean enableGps)
  {
    enableGps = enableGps;
  }
  
  public HttpServletRequest getRequest()
  {
    return ServletActionContext.getRequest();
  }
  
  public HttpServletResponse getResponse()
  {
    return ServletActionContext.getResponse();
  }
  
  public ServletContext getServletContext()
  {
    return this.context;
  }
  
  public void setServletContext(ServletContext context)
  {
    this.context = context;
  }
  
  public Map getSession()
  {
    return this.session;
  }
  
  public void setSession(Map session)
  {
    this.session = session;
  }
  
  public Map getCustomResponseMap()
  {
    return this.customResponseMap;
  }
  
  public void setCustomResponseMap(Map customResponseMap)
  {
    this.customResponseMap = customResponseMap;
  }
  
  public void addCustomResponse(String key, Object value)
  {
    if (this.customResponseMap == null) {
      this.customResponseMap = new HashMap();
    }
    this.customResponseMap.put(key, value);
  }
  
  protected Pagination readPagination(Map map)
  {
    Integer pageRecords = null;
    Integer currentPage = null;
    Integer totalRecords = null;
    HashMap<String, String> sortParams = new HashMap();
    if (map != null)
    {
      pageRecords = (Integer)map.get("pageRecords");
      currentPage = (Integer)map.get("currentPage");
      totalRecords = (Integer)map.get("totalRecords");
      sortParams = (HashMap)map.get("sortParams");
    }
    int _pageRecords = pageRecords != null ? pageRecords.intValue() : 10;
    int _currentPage = currentPage != null ? currentPage.intValue() : 1;
    int _totalRecords = totalRecords != null ? totalRecords.intValue() : 0;
    
    Pagination pagination = new Pagination(_pageRecords, _currentPage, _totalRecords, sortParams);
    return pagination;
  }
  
  protected Pagination getRequestPagination()
  {
    Map pageMaps = new HashMap();
    String pageRecords = getRequestString("pageRecords");
    String currentPage = getRequestString("currentPage");
    String totalRecords = getRequestString("totalRecords");
    
    pageMaps.put("pageRecords", Integer.valueOf((pageRecords != null) && (!pageRecords.isEmpty()) ? Integer.parseInt(pageRecords) : 10));
    pageMaps.put("currentPage", Integer.valueOf((currentPage != null) && (!currentPage.isEmpty()) ? Integer.parseInt(currentPage) : 1));
    pageMaps.put("totalRecords", Integer.valueOf(0));
    return readPagination(pageMaps);
  }
  
  public Pagination getPagination()
  {
    Map map = new HashMap();
    try
    {
      map = (Map)AjaxUtils.getObject(getRequest(), map.getClass());
    }
    catch (Exception e)
    {
      this.log.error("��������������");
    }
    return readPagination(map);
  }
  
  public Pagination getPaginationEx()
  {
    Map map = new HashMap();
    try
    {
      map = (Map)AjaxUtils.getObject(getJsonRequestString("pagin"), map.getClass());
    }
    catch (Exception e)
    {
      this.log.error("��������������");
    }
    return readPagination(map);
  }
  
  public void setPagination(Pagination pagination)
  {
    this.pagination = pagination;
  }
  
  public String getJsonRequestString(String parameter)
  {
    String param = getRequest().getParameter(parameter);
    String str = "";
    try
    {
      str = AjaxUtils.decode(param);
    }
    catch (Exception e)
    {
      this.log.error("��������������");
    }
    return str;
  }
  
  public String getRequestString(String parameter)
  {
    String param = getRequest().getParameter(parameter);
    if (param != null) {
      try
      {
        return new String(param.getBytes("ISO-8859-1"), "UTF-8");
      }
      catch (UnsupportedEncodingException e)
      {
        e.printStackTrace();
        return null;
      }
    }
    return null;
  }
  
  public String getRequestStringEx(String parameter)
  {
    String param = getRequest().getParameter(parameter);
    if (param != null)
    {
      String method = ServletActionContext.getRequest().getMethod();
      try
      {
        if ((method != null) && (method.toLowerCase().equals("post"))) {
          return URLDecoder.decode(param, "UTF-8");
        }
        return new String(param.getBytes("ISO-8859-1"), "UTF-8");
      }
      catch (Exception e)
      {
        e.printStackTrace();
        return null;
      }
    }
    return null;
  }
  
  public void updateSessionLanguage()
  {
    Boolean isChinese = Boolean.valueOf(false);
    String language = getRequestString("language");
    Locale locale = Locale.getDefault();
    if (language != null)
    {
      if (language.equals("en"))
      {
        locale = Locale.US;
      }
      else if (language.equals("zh"))
      {
        locale = Locale.CHINA;
        isChinese = Boolean.valueOf(true);
      }
      else if (language.equals("tw"))
      {
        locale = Locale.TAIWAN;
      }
      else if (language.equals("tr"))
      {
        locale = new Locale("tr");
      }
      else if (language.equals("th"))
      {
        locale = new Locale("th", "TH");
      }
      else if (language.equals("es"))
      {
        locale = new Locale("es");
      }
      else if (language.equals("ar"))
      {
        locale = new Locale("ar");
      }
      else if (language.equals("pt"))
      {
        locale = new Locale("pt", "PT");
      }
      else if (language.equals("bg"))
      {
        locale = new Locale("bg");
      }
      else if (language.equals("ro"))
      {
        locale = new Locale("ro");
      }
      else
      {
        locale = Locale.US;
      }
    }
    else {
      locale = Locale.US;
    }
    ResourceBundle bundle = ResourceBundle.getBundle("i18n/messageResource", locale);
    ActionContext.getContext().setLocale(locale);
    getSession().put("WW_TRANS_I18N_LOCALE", locale);
    getSession().put("bundle", bundle);
    getSession().put("isChinese", isChinese);
  }
  
  public boolean isSessChinese()
  {
    return ((Boolean)getSession().get("isChinese")).booleanValue();
  }
  
  public InputStream getExcelStream()
  {
    return this.excelStream;
  }
  
  public void setExcelStream(InputStream excelStream)
  {
    this.excelStream = excelStream;
  }
  
  public String getExcelFile()
  {
    return this.excelFile;
  }
  
  public void setExcelFile(String excelFile)
  {
    this.excelFile = excelFile;
  }
  
  public boolean isHasExcelRight()
  {
    return this.hasExcelRight;
  }
  
  public void setHasExcelRight(boolean hasExcelRight)
  {
    this.hasExcelRight = hasExcelRight;
  }
  
  public String getExcelError()
  {
    return this.excelError;
  }
  
  public void setExcelError(String excelError)
  {
    this.excelError = excelError;
  }
  
  protected HSSFSheet createExcelHead(HSSFWorkbook wb, HSSFSheet sheet, String[] heads, String title)
  {
    try
    {
      HSSFRow row = sheet.createRow(0);
      HSSFCell cell = row.createCell(0);
      row.setHeight((short)900);
      sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (short)(heads.length - 1)));
      HSSFCellStyle style = wb.createCellStyle();
      style.setAlignment((short)2);
      style.setWrapText(true);
      
      HSSFFont cnFont = wb.createFont();
      cnFont.setFontHeightInPoints((short)16);
      cnFont.setFontName("Arial");
      style.setFont(cnFont);
      cell.setCellStyle(style);
      
      cell.setCellValue(title);
      
      row = sheet.createRow(1);
      for (int i = 0; i < heads.length; i++)
      {
        cell = row.createCell(i);
        style = wb.createCellStyle();
        cnFont = wb.createFont();
        cnFont.setFontHeightInPoints((short)10);
        cnFont.setFontName("Arial");
        cnFont.setBoldweight((short)700);
        style.setFont(cnFont);
        cell.setCellStyle(style);
        cell.setCellValue(heads[i]);
      }
      return sheet;
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return null;
  }
  
  protected InputStream createExcelStream(HSSFWorkbook wb, HSSFSheet sheet, String[] heads, String title)
  {
    createExcelHead(wb, sheet, heads, title);
    for (int i = 0; i < heads.length; i++) {
      sheet.autoSizeColumn(i);
    }
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    try
    {
      wb.write(os);
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    byte[] content = os.toByteArray();
    InputStream is = new ByteArrayInputStream(content);
    return is;
  }
  
  protected void doExcelNoRight()
    throws UnsupportedEncodingException
  {
    this.excelStream = new ByteArrayInputStream(new byte[0]);
    makeExcelName(this.excelError + ".xls");
  }
  
  protected void makeExcelName(String file)
    throws UnsupportedEncodingException
  {
    String str = ServletActionContext.getRequest().getHeader("USER-AGENT");
    if (str.indexOf("Firefox") != -1)
    {
      this.excelFile = new String(file.getBytes("utf-8"), "ISO8859-1");
    }
    else if (str.indexOf("MSIE 6.0") != -1)
    {
      String temp = file.replace(':', '-');
      this.excelFile = URLEncoder.encode(temp, "utf-8").replace('+', '-');
    }
    else
    {
      this.excelFile = toUtf8String(file);
    }
  }
  
  public static String toUtf8String(String s)
  {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < s.length(); i++)
    {
      char c = s.charAt(i);
      if ((c >= 0) && (c <= '?'))
      {
        sb.append(c);
      }
      else
      {
        byte[] b;
        try
        {
          b = Character.toString(c).getBytes("utf-8");
        }
        catch (Exception ex)
        {
//          byte[] b;
          System.out.println(ex);
          b = new byte[0];
        }
        for (int j = 0; j < b.length; j++)
        {
          int k = b[j];
          if (k < 0) {
            k += 256;
          }
          sb.append("%" + Integer.toHexString(k).toUpperCase());
        }
      }
    }
    return sb.toString();
  }
  
  protected String[] genExcelHeads()
  {
    return null;
  }
  
  protected void genExcelData(HSSFSheet sheet) {}
  
  protected String genExcelTitle()
  {
    return null;
  }
  
  public String excel()
    throws Exception
  {
    try
    {
      if (this.hasExcelRight)
      {
        String title = genExcelTitle();
        
        String[] heads = genExcelHeads();
        
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("sheet1");
        
        genExcelData(sheet);
        
        this.excelStream = createExcelStream(wb, sheet, heads, title);
        String file = title + ".xls";
        makeExcelName(file);
      }
      else
      {
        doExcelNoRight();
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "excel";
  }
  
  static String parseConfig(Configuration config, String key, String defaultValue)
  {
    String value = config.getValue(key);
    if ((value != null) && (!value.isEmpty())) {
      return value.trim();
    }
    return defaultValue;
  }
  
  static boolean parseConfig(Configuration config, String key)
  {
    String value = config.getValue(key);
    if ((value != null) && (!value.isEmpty())) {
      try
      {
        value = value.trim();
        return Integer.parseInt(value) > 0;
      }
      catch (NumberFormatException e)
      {
        return false;
      }
    }
    return true;
  }
  
  static boolean parseConfigEx(Configuration config, String key, boolean isDefault)
  {
    String value = config.getValue(key);
    if ((value != null) && (!value.isEmpty())) {
      try
      {
        value = value.trim();
        return Integer.parseInt(value) > 0;
      }
      catch (NumberFormatException e)
      {
        System.out.print("parseConfigEx NumberFormatException " + e.getMessage());
        return isDefault;
      }
    }
    return isDefault;
  }
  
  static void loadConfig()
  {
    if (!isInitialize)
    {
      ServletContext context = ServletActionContext.getServletContext();
      String configPath = context.getRealPath("WEB-INF\\classes\\config\\config.conf");
      Configuration config = new Configuration(configPath);
      enableMdvr = parseConfig(config, "EnableMDVR");
      enableMobile = parseConfig(config, "EnableMobile");
      enableDvr = parseConfig(config, "EnableDVR");
      enablePad = parseConfig(config, "EnablePad");
      enableGps = parseConfig(config, "EnableGPS");
      enableAutoDown = parseConfig(config, "EnableAutoDown");
      enableAdvertising = parseConfig(config, "EnableAdvertising");
      
      enableTerminalGroup = parseConfig(config, "EnableTerminalGroup");
      enableTerminalFence = parseConfig(config, "EnableTerminalFence");
      enableTerminalSnapshot = parseConfig(config, "EnableTerminalSnapshot");
      enableTerminalRecord = parseConfig(config, "EnableTerminalRecord");
      enableTerminalAlarmAction = parseConfig(config, "EnableTerminalAlarmAction");
      enableTerminalDriver = parseConfig(config, "EnableTerminalDriver");
      enableShowLocation = parseConfig(config, "EnableShowLocation");
      enableEditMileage = parseConfig(config, "EnableEditMileage");
      enableUpdatePwd = parseConfig(config, "EnableUpdatePwd");
      enableSqlServer = parseConfig(config, "EnableSqlServer");
      
      enableReportNormal = parseConfig(config, "EnableReportNormal");
      enableReportSpeed = parseConfig(config, "EnableReportSpeed");
      enableReportLogin = parseConfig(config, "EnableReportLogin");
      enableReportIoin = parseConfig(config, "EnableReportIoin");
      enableReportAlarm = parseConfig(config, "EnableReportAlarm");
      enableReportOil = parseConfig(config, "EnableReportOil");
      enableReportPark = parseConfig(config, "EnableReportPark");
      enableReportFence = parseConfig(config, "EnableReportFence");
      enableReport3GFlow = parseConfig(config, "EnableReport3GFlow");
      enableReportExtern = parseConfig(config, "EnableReportExtern");
      enableReportDispatch = parseConfig(config, "EnableReportDispatch");
      enableReportStorage = parseConfig(config, "EnableReportStorage");
      enableReportEquipment = parseConfig(config, "EnableReportEquipment");
      enableReportFatigue = parseConfig(config, "EnableReportFatigue");
      enableHasReceipt = parseConfigEx(config, "EnableHasReceipt", false);
      enableHasAddArea = parseConfigEx(config, "EnableHasAddArea", false);
      enableHasRoadRule = parseConfigEx(config, "EnableHasRoadRule", false);
      enableChecksum = parseConfigEx(config, "EnableChecksum", false);
      enableHasDrivingBehavior = parseConfigEx(config, "EnableHasDrivingBehavior", false);
      enableHasLiCheng = parseConfigEx(config, "EnableHasLiCheng", false);
      enableHasDriving = parseConfigEx(config, "EnableHasDriving", false);
      enableHasMalfunction = parseConfigEx(config, "EnableHasMalfunction", false);
      enableHasVideo = parseConfigEx(config, "EnableHasVideo", false);
      enableHasMedia = parseConfigEx(config, "EnableHasMedia", false);
      enableHasData = parseConfigEx(config, "EnableHasData", false);
      enableHasUserBehavior = parseConfigEx(config, "EnableHasUserBehavior", false);
      enableHasTraffic = parseConfigEx(config, "EnableHasTraffic", false);
      enableHasTemperature = parseConfigEx(config, "EnableHasTemperature", false);
      enableHasSign = parseConfigEx(config, "EnableHasSign", false);
      enableTrip = parseConfigEx(config, "EnableTrip", false);
      enableTpms = parseConfigEx(config, "EnableTpms", false);
      enableHasOBD = parseConfigEx(config, "EnableHasOBD", false);
      enableShowClient = parseConfigEx(config, "EnableShowClient", false);
      
      enableDownloadClientWin = parseConfig(config, "EnableDownloadClientWin");
      enableDownloadClientIos = parseConfig(config, "EnableDownloadClientIos");
      enableDownloadClientAndroidBaidu = parseConfig(config, "EnableDownloadClientAndroidBaidu");
      enableDownloadClientAndroidGoogle = parseConfig(config, "EnableDownloadClientAndroidGoogle");
      enableDownloadClientPlayer = parseConfig(config, "EnableDownloadClientPlayer");
      enableDownloadClientMapinfo = parseConfig(config, "EnableDownloadClientMapinfo");
      
      enableTrackPlay = parseConfig(config, "EnableTrackPlay");
      enableLargeAudit = parseConfig(config, "EnableLargeAudit");
      enableGeoAddress = parseConfigEx(config, "EnableGeoAddress", false);
      enableGeoByLanguage = parseConfigEx(config, "EnableGeoByLanguage", true);
      
      enableBetaVersion = parseConfigEx(config, "EnableBetaVersion", false);
      
      openAccount = parseConfig(config, "OpenAccount", null);
      openPassword = parseConfig(config, "OpenPassword", null);
      
      File file = new File(context.getRealPath("/"));
      String path = file.getParentFile().getParentFile().getParentFile().getAbsolutePath();
      Configuration standardConfig = new Configuration(path + "\\GPSLoginSvr.ini");
      String type = standardConfig.getValue("Version");
      if ((type != null) && (type.equals("2"))) {
        is808GPS = true;
      }
      isInitialize = true;
    }
  }
  
  protected boolean enableFence(long config)
  {
    if ((config >> 0 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enableDriver(long config)
  {
    if ((config >> 0 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enableSms(long config)
  {
    if ((config >> 1 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enableAutoDown(long config)
  {
    if (getEnableAutoDown())
    {
      if ((config >> 2 & 1L) > 0L) {
        return true;
      }
      return false;
    }
    return false;
  }
  
  protected boolean enable3GFlow(long config)
  {
    if ((config >> 3 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enablePhone(long config)
  {
    if ((config >> 4 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enablePlayback(long config)
  {
    if ((config >> 5 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enableStorage(long config)
  {
    if ((config >> 6 & 1L) > 0L) {
      return true;
    }
    return false;
  }
  
  protected boolean enableTracker(long config)
  {
    if (getEnableMobile())
    {
      if ((config >> 7 & 1L) > 0L) {
        return true;
      }
      return false;
    }
    return false;
  }
  
  public static boolean is808GPS = false;
  public static boolean isAllowManageDevice = false;
  private static ReportCreater reportCreate;
  
  public static ReportCreater getReportCreate()
  {
    if (reportCreate == null)
    {
      reportCreate = new ReportCreater();
      reportCreate.setJasperReportPath(ServletActionContext.getServletContext().getRealPath("WEB-INF\\jasper"));
    }
    return reportCreate;
  }
}
