package com.framework.listener;

import com.framework.logger.Logger;
import com.framework.web.cache.MyCacheLoader;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.UserService;
import com.gps.model.BMapInfo;
import com.gps.model.GMapInfo;
import com.gps.model.UserSession;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public final class MyServletContextListener
  implements ServletContextListener, ApplicationContextAware, Runnable
{
  private final transient Logger log = Logger.getLogger(MyServletContextListener.class);
  private static UserService userService;
  private static ServletContext application;
  
  public static UserService getUserService()
  {
    return userService;
  }
  
  private Thread thread = new Thread(this);
  private int currentPage_baidu = 1;
  private int currentPage_google = 1;
  private int pageRecords = 10000;
  private int totalPages_baidu = 1;
  private int totalPages_google = 1;
  private int currentPage_vehicles = 1;
  private int totalPages_vehicles = 1;
  private static final String ONLINEUSERLIST = "onlineUserList";
  private static final String MAP_VEHICLES = "map_vehicles";
  private static final String API_SESSION_USER = "api_session_user";
  private static final String API_USER_ID = "api_user_id";
  private static final String API_USER_COMPANYID = "api_user_companyId";
  private static final String API_USER_UPDATE_TIME = "api_user_update_time";
  private static final String API_USER_RELATION = "api_user_relation";
  private static final String API_RELATION_VEHICLE = "api_relation_vehicle";
  private static final String API_RELATION_DEVIDNO = "api_relation_devIdno";
  private static final String API_RELATION_UPDATE_TIME = "api_relation_update_time";
  private static final String API_RELATION_ISADMIN = "api_relation_isAdmin";
  private static final String API_RELATION_ISMASTER = "api_relation_isMaster";
  private static boolean isVehicleChange = false;
  private static int changeCount = 0;
  private static Map<String, Integer> mapChangeVehiIdno = null;
  
  public static void setVehicleChange(boolean isVehicleChange_, String upVehiIdnos_, String delVehiIdnos_)
  {
    if (isVehicleChange_)
    {
      isVehicleChange = true;
      if (mapChangeVehiIdno == null) {
        mapChangeVehiIdno = Collections.synchronizedMap(new HashMap());
      }
      if ((upVehiIdnos_ != null) && (!upVehiIdnos_.isEmpty()))
      {
        String[] idnos = upVehiIdnos_.split(",");
        for (int i = 0; i < idnos.length; i++) {
          mapChangeVehiIdno.put(idnos[i], Integer.valueOf(1));
        }
      }
      if ((delVehiIdnos_ != null) && (!delVehiIdnos_.isEmpty()))
      {
        String[] idnos = delVehiIdnos_.split(",");
        for (int i = 0; i < idnos.length; i++) {
          mapChangeVehiIdno.put(idnos[i], Integer.valueOf(2));
        }
      }
    }
  }
  
  /* Error */
  public void contextInitialized(ServletContextEvent arg0)
  {
    // Byte code:
    //   0: invokestatic 166	com/gps/util/GpsInsideChina:InitPolygon	()V
    //   3: aload_0
    //   4: invokespecial 171	com/framework/listener/MyServletContextListener:initCompanyTable	()V
    //   7: getstatic 119	com/framework/listener/MyServletContextListener:userService	Lcom/gps/common/service/UserService;
    //   10: invokeinterface 174 1 0
    //   15: goto +42 -> 57
    //   18: astore_2
    //   19: aload_2
    //   20: invokevirtual 179	java/lang/Exception:printStackTrace	()V
    //   23: aload_1
    //   24: invokevirtual 184	javax/servlet/ServletContextEvent:getServletContext	()Ljavax/servlet/ServletContext;
    //   27: putstatic 190	com/framework/listener/MyServletContextListener:application	Ljavax/servlet/ServletContext;
    //   30: aload_0
    //   31: getfield 99	com/framework/listener/MyServletContextListener:thread	Ljava/lang/Thread;
    //   34: invokevirtual 192	java/lang/Thread:start	()V
    //   37: goto +34 -> 71
    //   40: astore_3
    //   41: aload_1
    //   42: invokevirtual 184	javax/servlet/ServletContextEvent:getServletContext	()Ljavax/servlet/ServletContext;
    //   45: putstatic 190	com/framework/listener/MyServletContextListener:application	Ljavax/servlet/ServletContext;
    //   48: aload_0
    //   49: getfield 99	com/framework/listener/MyServletContextListener:thread	Ljava/lang/Thread;
    //   52: invokevirtual 192	java/lang/Thread:start	()V
    //   55: aload_3
    //   56: athrow
    //   57: aload_1
    //   58: invokevirtual 184	javax/servlet/ServletContextEvent:getServletContext	()Ljavax/servlet/ServletContext;
    //   61: putstatic 190	com/framework/listener/MyServletContextListener:application	Ljavax/servlet/ServletContext;
    //   64: aload_0
    //   65: getfield 99	com/framework/listener/MyServletContextListener:thread	Ljava/lang/Thread;
    //   68: invokevirtual 192	java/lang/Thread:start	()V
    //   71: return
    // Line number table:
    //   Java source line #116	-> byte code offset #0
    //   Java source line #117	-> byte code offset #3
    //   Java source line #118	-> byte code offset #7
    //   Java source line #119	-> byte code offset #15
    //   Java source line #120	-> byte code offset #19
    //   Java source line #122	-> byte code offset #23
    //   Java source line #123	-> byte code offset #30
    //   Java source line #121	-> byte code offset #40
    //   Java source line #122	-> byte code offset #41
    //   Java source line #123	-> byte code offset #48
    //   Java source line #124	-> byte code offset #55
    //   Java source line #122	-> byte code offset #57
    //   Java source line #123	-> byte code offset #64
    //   Java source line #125	-> byte code offset #71
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	72	0	this	MyServletContextListener
    //   0	72	1	arg0	ServletContextEvent
    //   18	2	2	e	Exception
    //   40	16	3	localObject	Object
    // Exception table:
    //   from	to	target	type
    //   0	15	18	java/lang/Exception
    //   0	23	40	finally
  }
  
  public void contextDestroyed(ServletContextEvent arg0)
  {
    userService.deleteAllLive();
    MyCacheLoader.getManager().shutdown();
  }
  
  public void setApplicationContext(ApplicationContext applicationContext)
    throws BeansException
  {
    userService = (UserService)applicationContext.getBean("userService");
  }
  
  public void findAllBMapInfo()
    throws Exception
  {
    Pagination pagination = new Pagination();
    pagination.setCurrentPage(this.currentPage_baidu);
    pagination.setPageRecords(this.pageRecords);
    
    Cache bMap = MyCacheLoader.getManager().getCache("baiduMap");
    AjaxDto<BMapInfo> ajaxDto = userService.findAllBMapInfo(pagination);
    List<BMapInfo> bmapinfos = ajaxDto.getPageList();
    this.currentPage_baidu += 1;
    this.totalPages_baidu = ajaxDto.getPagination().getTotalPages();
    if (bmapinfos != null) {
      for (BMapInfo info : bmapinfos) {
        bMap.put(new Element(info.getGpsLatitude(), info.getPosition()));
      }
    }
    bMap.flush();
    this.log.info("BMap Size: " + bMap.getSize());
  }
  
  public void findAllGMapInfo()
    throws Exception
  {
    Pagination pagination = new Pagination();
    pagination.setCurrentPage(this.currentPage_google);
    pagination.setPageRecords(this.pageRecords);
    
    Cache gMap = MyCacheLoader.getManager().getCache("googleMap");
    AjaxDto<GMapInfo> ajaxDto = userService.findAllGMapInfo(pagination);
    List<GMapInfo> gmapinfos = ajaxDto.getPageList();
    this.currentPage_google += 1;
    this.totalPages_google = ajaxDto.getPagination().getTotalPages();
    if (gmapinfos != null) {
      for (GMapInfo info : gmapinfos) {
        gMap.put(new Element(info.getGpsLatitude(), info.getPosition()));
      }
    }
    gMap.flush();
    
    this.log.info("GMap Size: " + gMap.getSize());
  }
  
  public void findAllVehicles()
  {
    Pagination pagination = new Pagination();
    pagination.setCurrentPage(this.currentPage_vehicles);
    pagination.setPageRecords(this.pageRecords);
    
    Map<String, StandardVehicle> mapRelation = (Map)application.getAttribute("map_vehicles");
    if (mapRelation == null)
    {
      mapRelation = new HashMap();
      application.setAttribute("map_vehicles", mapRelation);
    }
    AjaxDto<StandardVehicle> ajaxDto = userService.findAllVehicles(pagination);
    this.currentPage_vehicles += 1;
    if (ajaxDto != null)
    {
      this.totalPages_vehicles = ajaxDto.getPagination().getTotalPages();
      if (ajaxDto.getPageList() != null)
      {
        List<StandardVehicle> vehicles = ajaxDto.getPageList();
        int i = 0;
        for (int j = vehicles.size(); i < j; i++) {
          mapRelation.put(((StandardVehicle)vehicles.get(i)).getVehiIDNO(), (StandardVehicle)vehicles.get(i));
        }
      }
    }
  }
  
  private boolean isLoadBaidu()
  {
    if (this.currentPage_baidu <= this.totalPages_baidu) {
      return true;
    }
    return false;
  }
  
  private boolean isLoadGoogle()
  {
    if (this.currentPage_google <= this.totalPages_google) {
      return true;
    }
    return false;
  }
  
  private boolean isLoadVehicles()
  {
    if (this.currentPage_vehicles <= this.totalPages_vehicles) {
      return true;
    }
    return false;
  }
  
  public void run()
  {
    synchronized (this)
    {
      for (;;)
      {
        if ((isLoadBaidu()) || (isLoadGoogle()))
        {
          try
          {
            if (isLoadBaidu()) {
              findAllBMapInfo();
            }
            if (isLoadGoogle()) {
              findAllGMapInfo();
            }
            if (isLoadVehicles()) {
              findAllVehicles();
            }
            Thread.sleep(500L);
          }
          catch (Exception e)
          {
            e.printStackTrace();
          }
          continue;
        }
        try
        {
          updateUserSessionInfo();
          
          Thread.sleep(60000L);
        }
        catch (Exception e)
        {
          e.printStackTrace();
        }
      }
    }
  }
  
  private boolean isExistRelation(Integer companyId, Integer childId)
  {
    Integer records = userService.getCompanyRelationCount(companyId, childId);
    if ((records == null) || (records.intValue() == 0)) {
      return false;
    }
    return true;
  }
  
  private StandardCompany getStandardCompanyEx(List<StandardCompany> companys, Integer id)
  {
    if ((companys != null) && (id != null)) {
      for (int i = 0; i < companys.size(); i++) {
        if (((StandardCompany)companys.get(i)).getId().intValue() == id.intValue()) {
          return (StandardCompany)companys.get(i);
        }
      }
    }
    return null;
  }
  
  private void initCompanyTable()
    throws Exception
  {
    if (isExistRelation(null, null)) {
      return;
    }
    List<StandardCompany> allCompanys = userService.getStandardCompanyList(null);
    if ((allCompanys == null) || (allCompanys.size() == 0)) {
      return;
    }
    List<Object> lstUpdateCompany = new ArrayList();
    
    List<Object> lstUpdateRelation = new ArrayList();
    for (int i = 0; i < allCompanys.size(); i++)
    {
      StandardCompany company = (StandardCompany)allCompanys.get(i);
      if (company.getId().intValue() != -1)
      {
        if (company.getParentId().intValue() == 0)
        {
          if ((company.getCompanyId() == null) || (company.getCompanyId().intValue() != 0))
          {
            company.setCompanyId(Integer.valueOf(0));
            lstUpdateCompany.add(company);
          }
        }
        else
        {
          StandardCompany company_ = getStandardCompanyEx(allCompanys, company.getParentId());
          while ((company_ != null) && (company_.getLevel() != null) && (company_.getLevel().intValue() != 1))
          {
            if (!isExistRelation(company_.getId(), company.getId())) {
              lstUpdateRelation.add(new StandardCompanyRelation(company_.getId(), company.getId()));
            }
            company_ = getStandardCompanyEx(allCompanys, company_.getParentId());
          }
          if ((company_ != null) && (
            (company.getCompanyId() == null) || (company.getCompanyId().intValue() != company_.getId().intValue())))
          {
            company.setCompanyId(company_.getId());
            lstUpdateCompany.add(company);
          }
        }
        StandardCompany company_ = getStandardCompanyEx(allCompanys, company.getCompanyId());
        while (company_ != null)
        {
          if (!isExistRelation(company_.getId(), company.getId())) {
            lstUpdateRelation.add(new StandardCompanyRelation(company_.getId(), company.getId()));
          }
          company_ = getStandardCompanyEx(allCompanys, company_.getParentId());
        }
      }
    }
    if (lstUpdateCompany.size() > 0) {
      userService.saveList(lstUpdateCompany);
    }
    if (lstUpdateRelation.size() > 0) {
      userService.saveList(lstUpdateRelation);
    }
  }
  
  private void updateUserSessionInfo()
    throws Exception
  {
    if (application != null)
    {
      updateUserLoginSession();
      
      updateApiUserLoginSession();
      if (isVehicleChange)
      {
        changeCount += 1;
        if (changeCount == 5)
        {
          updateCacheVehiRelation();
          
          updateCacheVehicleInfo();
          
          isVehicleChange = false;
          changeCount = 0;
        }
      }
    }
  }
  
  private void updateSessionEx(String sessionId)
    throws Exception
  {
    UserSession session = userService.getUserSession(sessionId);
    if ((session != null) && (session.getId() != null))
    {
      session.setUpdateTime(new Date());
      userService.save(session);
    }
  }
  
  private void updateUserLoginSession()
    throws Exception
  {
    List<String> onlineUserList = (List)application.getAttribute("onlineUserList");
    if ((onlineUserList != null) && (onlineUserList.size() > 0))
    {
      int i = 0;
      int size = onlineUserList.size();
      while (i < size)
      {
        updateSessionEx((String)onlineUserList.get(i));
        size = onlineUserList.size();
        i++;
      }
    }
  }
  
  private void updateApiUserLoginSession()
    throws Exception
  {
    Map<Integer, Integer> mapDelRelation = new HashMap();
    try
    {
      Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
      if ((synmapSession != null) && (synmapSession.size() > 0))
      {
        Iterator<Map.Entry<String, Map<String, Object>>> entries = synmapSession.entrySet().iterator();
        while (entries.hasNext())
        {
          Map.Entry<String, Map<String, Object>> entry = (Map.Entry)entries.next();
          Map<String, Object> mapUser = (Map)entry.getValue();
          
          int time = 0;
          try
          {
            time = Integer.parseInt(mapUser.get("api_user_update_time").toString());
          }
          catch (Exception localException) {}
          Integer userId = (Integer)mapUser.get("api_user_id");
          long nowTime = new Date().getTime() / 1000L;
          if (nowTime - time >= 14400L)
          {
            entries.remove();
            if ((mapDelRelation.get(userId) != null) && (((Integer)mapDelRelation.get(userId)).intValue() != 0)) {
              mapDelRelation.put(userId, Integer.valueOf(1));
            }
          }
          else
          {
            updateSessionEx((String)entry.getKey());
            mapDelRelation.put(userId, Integer.valueOf(0));
          }
        }
      }
      Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
      if ((synmapRelation != null) && (synmapRelation.size() > 0))
      {
        Iterator<Map.Entry<String, Map<String, Object>>> entries = synmapRelation.entrySet().iterator();
        while (entries.hasNext())
        {
          Map.Entry<String, Map<String, Object>> entry = (Map.Entry)entries.next();
          if ((mapDelRelation != null) && (mapDelRelation.get(entry.getKey()) != null) && 
            (((Integer)mapDelRelation.get(entry.getKey())).intValue() == 1)) {
            entries.remove();
          }
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
  }
  
  private void updateCacheVehiRelation()
    throws Exception
  {
    try
    {
      Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
      if ((synmapRelation != null) && (synmapRelation.size() > 0))
      {
        Iterator<Map.Entry<String, Map<String, Object>>> entries = synmapRelation.entrySet().iterator();
        while (entries.hasNext())
        {
          Map.Entry<String, Map<String, Object>> entry = (Map.Entry)entries.next();
          
          updateUserVehicle((String)entry.getKey(), (Map)entry.getValue());
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
  }
  
  private static boolean isAdmin(Object isAdmin_)
  {
    if ((isAdmin_ != null) && (isAdmin_.toString().equals("true"))) {
      return true;
    }
    return false;
  }
  
  private static boolean isMaster(Object isMaster_)
  {
    if ((isMaster_ != null) && (isMaster_.toString().equals("true"))) {
      return true;
    }
    return false;
  }
  
  private static void updateUserVehicle(String userId, Map<String, Object> userRelation)
    throws Exception
  {
    List<String> lstVehiIdno = new ArrayList();
    
    boolean isAdmin = isAdmin(userRelation.get("api_relation_isAdmin"));
    
    boolean isMaster = isMaster(userRelation.get("api_relation_isMaster"));
    if ((isAdmin) || (isMaster))
    {
      Integer parentId = null;
      if (!isAdmin) {
        parentId = (Integer)userRelation.get("api_user_companyId");
      }
      List<Integer> lstCompanyId = userService.getCompanyIdList(parentId, null, isAdmin);
      if (!isAdmin)
      {
        if (lstCompanyId == null) {
          lstCompanyId = new ArrayList();
        }
        lstCompanyId.add(parentId);
      }
      if ((lstCompanyId != null) && (lstCompanyId.size() > 0)) {
        lstVehiIdno = userService.getStandardVehiIdnoList(lstCompanyId, null);
      }
    }
    else
    {
      int userId_ = 0;
      try
      {
        userId_ = Integer.parseInt(userId);
      }
      catch (Exception localException) {}
      List<StandardUserVehiPermitEx> vehiPermits = userService.getAuthorizedVehicleList(Integer.valueOf(userId_), null, null);
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
      List<StandardVehiDevRelationExMore> relations = userService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, null, null, null);
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
    userRelation.put("api_relation_vehicle", mapVehicle);
    userRelation.put("api_relation_devIdno", lstDevIdno);
    userRelation.put("api_relation_update_time", Long.valueOf(new Date().getTime() / 1000L));
  }
  
  public String toMemoryInfo()
  {
    Runtime currRuntime = Runtime.getRuntime();
    
    int nFreeMemory = (int)(currRuntime.freeMemory() / 1024L / 1024L);
    
    int nTotalMemory = (int)(currRuntime.totalMemory() / 1024L / 1024L);
    return nFreeMemory + "M/" + nTotalMemory + "M(free/total)";
  }
  
  public static void updateCacheVehiRelationByUser(Integer userId)
    throws Exception
  {
    try
    {
      if (userId != null)
      {
        Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
        if ((synmapRelation != null) && (synmapRelation.size() > 0) && 
          (synmapRelation.get(userId.toString()) != null)) {
          updateUserVehicle(userId.toString(), (Map)synmapRelation.get(userId.toString()));
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
  }
  
  public static void delCacheVehiRelationByUser(Integer userId)
    throws Exception
  {
    try
    {
      if (userId != null)
      {
        Map<String, Map<String, Object>> synmapSession = Collections.synchronizedMap((Map)application.getAttribute("api_session_user"));
        if ((synmapSession != null) && (synmapSession.size() > 0))
        {
          Iterator<Map.Entry<String, Map<String, Object>>> entries = synmapSession.entrySet().iterator();
          while (entries.hasNext())
          {
            Map.Entry<String, Map<String, Object>> entry = (Map.Entry)entries.next();
            Map<String, Object> mapUser = (Map)entry.getValue();
            if (userId.intValue() == ((Integer)mapUser.get("api_user_id")).intValue()) {
              entries.remove();
            }
          }
        }
        Map<String, Map<String, Object>> synmapRelation = Collections.synchronizedMap((Map)application.getAttribute("api_user_relation"));
        if ((synmapRelation != null) && (synmapRelation.size() > 0)) {
          synmapRelation.remove(userId.toString());
        }
      }
    }
    catch (NullPointerException localNullPointerException) {}
  }
  
  public void updateCacheVehicleInfo()
  {
    if ((mapChangeVehiIdno != null) && (mapChangeVehiIdno.size() > 0))
    {
      Map<String, StandardVehicle> mapRelation = (Map)application.getAttribute("map_vehicles");
      if (mapRelation == null)
      {
        mapRelation = new HashMap();
        application.setAttribute("map_vehicles", mapRelation);
      }
      Map<String, StandardVehicle> mapRelation_ = Collections.synchronizedMap(mapRelation);
      for (Map.Entry<String, Integer> entry : mapChangeVehiIdno.entrySet()) {
        if ((entry.getKey() != null) && (!((String)entry.getKey()).isEmpty()) && (entry.getValue() != null)) {
          if (((Integer)entry.getValue()).intValue() == 2)
          {
            mapRelation_.remove(entry.getKey());
          }
          else
          {
            StandardVehicle vehicle_ = (StandardVehicle)userService.getObject(StandardVehicle.class, (Serializable)entry.getKey());
            if (vehicle_ != null) {
              mapRelation_.put((String)entry.getKey(), vehicle_);
            }
          }
        }
      }
    }
  }
}
