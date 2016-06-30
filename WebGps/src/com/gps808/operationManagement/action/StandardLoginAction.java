package com.gps808.operationManagement.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.listener.UserBindingListener;
import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.StringUtil;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceStatus;
import com.gps.model.DeviceStatusLite;
import com.gps.model.ServerInfo;
import com.gps.model.UserLog;
import com.gps.model.UserSession;
import com.gps.user.vo.UserPrivi;
import com.gps.user.vo.UserSubPrivi;
import com.gps.util.ConvertUtil;
import com.gps.vo.GpsValue;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardDriverEx;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehicle;
import com.gps808.model.line.StandardLineInfo;
import com.gps808.model.line.StandardLineStationRelation;
import com.gps808.model.line.StandardStationInfo;
import com.gps808.operationManagement.service.StandardLineService;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.DeviceLite;
import com.gps808.operationManagement.vo.DeviceLiteEx;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLite;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import com.opensymphony.xwork2.ActionContext;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.struts2.ServletActionContext;
import org.hibernate.type.StandardBasicTypes;

public class StandardLoginAction
  extends StandardUserBaseAction
{
  public static final int LOGIN_RET_SUCCESS = 0;
  public static final int LOGIN_RET_NAME_ERROR = 1;
  public static final int LOGIN_RET_PWD_ERROR = 2;
  public static final int LOGIN_RET_EXPIRE_ERROR = 3;
  public static final int LOGIN_RET_VERIFICATION_ERROR = 4;
  public static final int LOGIN_RET_EXCEPTION_ERROR = 5;
  public static final int LOGIN_RET_SERVER_NO_SUPPORT = 6;
  public static final int LOGIN_RET_SESSION_ERROR = 7;
  private static String gChineseMainTitle = "";
  private static String gChineseCopyright = "";
  private static String gEnglishMainTitle = "";
  private static String gEnglishCopyright = "";
  private static String gTwMainTitle = "";
  private static String gTwCopyright = "";
  private static final long serialVersionUID = 1L;
  
  public String login()
  {
    try
    {
      System.out.println("==================================================================");
      System.out.println(new Date());
      System.out.println("standardType:" + is808GPS);
      if (!is808GPS)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        return "success";
      }
      if (!BaseAction.getEnableChecksum())
      {
        String verificationCode = getRequestString("verificationCode");
        String code = (String)getSession().get("rand");
        if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          return "success";
        }
      }
      String account = getRequestString("account");
      String password = getRequestString("password");
      HttpServletRequest request = ServletActionContext.getRequest();
      if ((password != null) && (!password.isEmpty())) {
        password = MD5EncryptUtils.encrypt(password);
      }
      System.out.println("userName:" + account);
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
        System.out.println("userStatus:" + userAccount.getStatus().intValue());
        if ((userAccount.getStatus() == null) || (userAccount.getStatus().intValue() == 0))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(46));
        }
        else if (userAccount.getStatus().intValue() == 2)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else if (!"admin".equalsIgnoreCase(account))
        {
          if ((userAccount.getValidity() != null) && (DateUtil.compareDate(new Date(), userAccount.getValidity())))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
          }
          else
          {
            addUserSession(request, userAccount.getId(), request.getRequestedSessionId());
            doLoginSuc(request, userAccount, true);
          }
        }
        else
        {
          addUserSession(request, userAccount.getId(), request.getRequestedSessionId());
          doLoginSuc(request, userAccount, true);
        }
      }
      else
      {
//        userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
//          Integer.valueOf(5), null, request.getRemoteAddr(), userAccount.getAccount(), password, null);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    System.out.println("==================================================================");
    return "success";
  }
  
  private void doLoginSuc(HttpServletRequest request, StandardUserAccount userAccount, boolean addLoginLog)
  {
    getSession().put("userAccount", userAccount);
    
    addCustomResponse("account", userAccount.getAccount());
    addCustomResponse("name", userAccount.getName());
    addCustomResponse("accountId", userAccount.getId());
    if (isAllowManageDevice) {
      addCustomResponse("isAllowManage", Integer.valueOf(1));
    } else {
      addCustomResponse("isAllowManage", Integer.valueOf(0));
    }
    ActionContext ctx = ActionContext.getContext();
    ctx.getSession().put("userid", userAccount.getId().toString());
    ctx.getSession().put("account808", userAccount.getAccount());
    ctx.getSession().put("company", userAccount.getCompany());
    if (isAdmin())
    {
      addCustomResponse("companyId", Integer.valueOf(0));
      
      ctx.getSession().put("sysuser808", userAccount.getAccount());
    }
    else
    {
      addCustomResponse("companyId", userAccount.getCompany().getId());
    }
    updateSessionPrivilege(userAccount);
    if (isAdmin())
    {
      addCustomResponse("privilege", StandardUserRole.getUserRole());
      addCustomResponse("isAdmin", Integer.valueOf(0));
    }
    else if (isMaster())
    {
      if (userAccount.getCompany().getCompanyId().intValue() == 0)
      {
        addCustomResponse("isFirstCompany", Integer.valueOf(0));
      }
      else
      {
        StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, userAccount.getCompany().getCompanyId());
        if (company.getCompanyId().intValue() == 0)
        {
          addCustomResponse("isSecondCompany", Integer.valueOf(0));
        }
        else
        {
          StandardCompany com = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, company.getCompanyId());
          if (com.getCompanyId().intValue() == 0) {
            addCustomResponse("isThreeCompany", Integer.valueOf(0));
          } else {
            addCustomResponse("isThreeCompany", Integer.valueOf(1));
          }
          addCustomResponse("isSecondCompany", Integer.valueOf(1));
        }
        addCustomResponse("isFirstCompany", Integer.valueOf(1));
      }
      addCustomResponse("privilege", StandardUserRole.getUserRole());
      addCustomResponse("isAdmin", Integer.valueOf(1));
      addCustomResponse("isMaster", Integer.valueOf(0));
    }
    else
    {
      String privilege = "";
      if (userAccount.getRole() != null) {
        privilege = userAccount.getRole().getPrivilege();
      }
      if (userAccount.getCompany().getCompanyId().intValue() == 0)
      {
        addCustomResponse("isFirstCompany", Integer.valueOf(0));
      }
      else
      {
        StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, userAccount.getCompany().getCompanyId());
        if (company.getCompanyId().intValue() == 0)
        {
          addCustomResponse("isSecondCompany", Integer.valueOf(0));
        }
        else
        {
          StandardCompany com = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, company.getCompanyId());
          if (com.getCompanyId().intValue() == 0) {
            addCustomResponse("isThreeCompany", Integer.valueOf(0));
          } else {
            addCustomResponse("isThreeCompany", Integer.valueOf(1));
          }
          addCustomResponse("isSecondCompany", Integer.valueOf(1));
        }
        addCustomResponse("isFirstCompany", Integer.valueOf(1));
      }
      addCustomResponse("privilege", privilege);
      addCustomResponse("isAdmin", Integer.valueOf(1));
    }
    if (BaseAction.getEnableHasAddArea()) {
      addCustomResponse("hasAddArea", Integer.valueOf(0));
    } else {
      addCustomResponse("hasAddArea", Integer.valueOf(1));
    }
    if (BaseAction.getEnableTrip()) {
      addCustomResponse("hasLine", Integer.valueOf(0));
    } else {
      addCustomResponse("hasLine", Integer.valueOf(1));
    }
    if (BaseAction.getEnableHasRoadRule()) {
      addCustomResponse("hasRoadRule", Integer.valueOf(0));
    } else {
      addCustomResponse("hasRoadRule", Integer.valueOf(1));
    }
    if (BaseAction.getEnableTrip()) {
      addCustomResponse("isManageLine", Integer.valueOf(1));
    } else {
      addCustomResponse("isManageLine", Integer.valueOf(0));
    }
    Integer userLogId = null;
    if (addLoginLog) {
      try
      {
        userService.addUserLog(userAccount.getId(), Integer.valueOf(1), 
          Integer.valueOf(1), request.getSession().getId(), request.getRemoteAddr(), null, 
          String.format("%d", new Object[] { Integer.valueOf(5) }), null);
        
        UserLog userLog = userService.getUserLoginLog(userAccount.getId(), Integer.valueOf(1), 
          Integer.valueOf(1), request.getSession().getId(), String.format("%d", new Object[] { Integer.valueOf(5) }));
        if (userLog != null) {
          userLogId = userLog.getId();
        }
      }
      catch (Exception e)
      {
        String sql = "call Proc_Set_MonthPartition('user_log', 3)";
        this.standardUserService.executePartition(sql);
      }
    }
    updateSessionLanguage();
    
    getSession().put("onlineUserBindingListener", new UserBindingListener(userService, userAccount, null, userLogId));
    
    addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
  }
  
  public String sessionLogin()
    throws Exception
  {
    String session = getRequestString("userSession");
    String ctype = getRequestString("ctype");
    UserSession userSession = this.standardUserService.getUserSession(session);
    StandardUserAccount user = null;
    if (userSession == null)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
    }
    else
    {
      user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, userSession.getUserid());
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      }
      else
      {
        ActionContext ctx = ActionContext.getContext();
        ctx.getSession().put("userSession", session);
        HttpServletRequest request = ServletActionContext.getRequest();
        if ((ctype != null) && (Integer.parseInt(ctype) == 1))
        {
          request.getSession().setMaxInactiveInterval(43200);
          doLoginSuc(request, user, false);
        }
        else
        {
          doLoginSuc(request, user, true);
        }
      }
    }
    return "success";
  }
  
  public String logout()
    throws Exception
  {
    try
    {
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
  
  public void GetParentGroup(String nGroupID, Map<String, PartStandardInfo> allGroup, Map<String, PartStandardInfo> userGroup)
  {
    if (allGroup.containsKey(nGroupID))
    {
      PartStandardInfo company = (PartStandardInfo)allGroup.get(nGroupID);
      if (!userGroup.containsKey(nGroupID)) {
        userGroup.put(nGroupID, company);
      }
      if ((company.getParentId() != null) && 
        (!userGroup.containsKey(company.getParentId().toString()))) {
        GetParentGroup(company.getParentId().toString(), allGroup, userGroup);
      }
    }
  }
  
  public String getUserVehicle()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else
      {
        String toMap = getRequestString("toMap");
        List<VehicleLite> lstLite = new ArrayList();
        
        List<StandardVehicle> vehicles = new ArrayList();
        if (isAdmin())
        {
          AjaxDto<StandardVehicle> vehicleList = this.standardUserService.getStandardVehicleList(null, null, null);
          if ((vehicleList != null) && (vehicleList.getPageList() != null)) {
            vehicles = vehicleList.getPageList();
          }
        }
        else
        {
          List<Integer> companyIds = findUserCompanyIdList(user.getCompany().getId(), null, isAdmin());
          
          int parentId = user.getCompany().getParentId().intValue();
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(user.getId(), null, null);
          for (StandardUserVehiPermitVehicle permit : vehiPermits)
          {
            if (!companyIds.contains(permit.getVehicle().getCompany().getId())) {
              permit.getVehicle().getCompany().setId(Integer.valueOf(parentId));
            }
            vehicles.add(permit.getVehicle());
          }
        }
        List<String> vehiIdnos = new ArrayList();
        if (isAdmin())
        {
          vehiIdnos = null;
        }
        else
        {
          int i = 0;
          for (int j = vehicles.size(); i < j; i++) {
            vehiIdnos.add(((StandardVehicle)vehicles.get(i)).getVehiIDNO());
          }
        }
        if ((isAdmin()) || (vehiIdnos.size() > 0))
        {
          List<QueryScalar> scalars = new ArrayList();
          scalars.add(new QueryScalar("nflt", StandardBasicTypes.INTEGER));
          scalars.add(new QueryScalar("devComId", StandardBasicTypes.INTEGER));
          scalars.add(new QueryScalar("chnName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("ioInName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("tempName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("cardNum", StandardBasicTypes.STRING));
          String fieldCondition = ",b.nFlowLimitType as nflt, b.CompanyID as devComId, c.ChnName as chnName, c.IOInName as ioInName, c.TempName as tempName, b.SimCard as cardNum";
          List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(vehiIdnos, null, scalars, fieldCondition, ",jt808_device_info b,jt808_vehicle_info c where a.DevIDNO = b.DevIDNO and a.VehiIDNO = c.VehiIDNO");
          if ((relations != null) && (relations.size() > 0))
          {
            Object mapStatus = new HashMap();
            
            AjaxDto<DeviceStatus> ajaxDto = this.standardUserService.getDeviceOnlineList(null, null, true, null, null);
            if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
            {
              int i = 0;
              for (int j = ajaxDto.getPageList().size(); i < j; i++)
              {
                DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
                if (status.getGpsTime() != null) {
                  status.setGpsTimeStr(DateUtil.dateSwitchString(status.getGpsTime()));
                }
                GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap);
                status.setMapJingDu(gpsValue.getMapJingDu());
                status.setMapWeiDu(gpsValue.getMapWeiDu());
                if (status.getJingDu() == null) {
                  status.setJingDu(Integer.valueOf(0));
                }
                if (status.getWeiDu() == null) {
                  status.setWeiDu(Integer.valueOf(0));
                }
                ((Map)mapStatus).put(status.getDevIdno(), status);
              }
            }
            Map<String, List<DeviceLite>> mapDevice = new HashMap();
            int i = 0;
            for (int j = relations.size(); i < j; i++)
            {
              StandardVehiDevRelationExMore relation = (StandardVehiDevRelationExMore)relations.get(i);
              
              DeviceLite deviceLite = new DeviceLite();
              deviceLite.setId(relation.getDevIdno());
              deviceLite.setIdno(relation.getDevIdno());
              deviceLite.setParentId(relation.getDevComId());
              
              String chnAttr = relation.getChnAttr();
              
              String chnName_vehi = relation.getChnName();
              String[] params_chn = getChannelParamToDev("CH", chnAttr, chnName_vehi);
              deviceLite.setChnCount(Integer.valueOf(Integer.parseInt(params_chn[0])));
              deviceLite.setChnName(params_chn[1]);
              
              String IoInAttr = relation.getIoInAttr();
              String IoInName_vehi = relation.getIoInName();
              String[] params_ioin = getChannelParamToDev("IO_", IoInAttr, IoInName_vehi);
              deviceLite.setIoInCount(Integer.valueOf(Integer.parseInt(params_ioin[0])));
              deviceLite.setIoInName(params_ioin[1]);
              
              String tempAttr = relation.getIoInAttr();
              String tempName_vehi = relation.getTempName();
              String[] params_temp = getChannelParamToDev("TEMP_", tempAttr, tempName_vehi);
              deviceLite.setTempCount(Integer.valueOf(Integer.parseInt(params_temp[0])));
              deviceLite.setTempName(params_temp[1]);
              
              deviceLite.setModule(relation.getModule());
              if (relation.getCardNum() != null) {
                deviceLite.setSimCard(relation.getCardNum());
              }
              deviceLite.setStatus((DeviceStatus)((Map)mapStatus).get(relation.getDevIdno()));
              
              deviceLite.setNflt(relation.getNflt());
              
              List<DeviceLite> devices = new ArrayList();
              if (mapDevice.get(relation.getVehiIdno()) == null)
              {
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
             i = 0;
            for (int j = vehicles.size(); i < j; i++)
            {
              VehicleLite lite = new VehicleLite();
              StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
              lite.setId(vehicle.getVehiIDNO());
              lite.setName(vehicle.getVehiIDNO());
              lite.setIdno(vehicle.getVehiIDNO());
              lite.setParentId(vehicle.getCompany().getId());
              lite.setIcon(vehicle.getIcon());
              List<DeviceLite> devices = (List)mapDevice.get(vehicle.getVehiIDNO());
              lite.setDevList(devices);
              if ((devices != null) && (devices.size() > 0))
              {
                if (vehicle.getDriver() != null)
                {
                  lite.setDriverName(vehicle.getDriver().getName());
                  lite.setDriverTele(vehicle.getDriver().getJobNum());
                }
                lstLite.add(lite);
              }
            }
          }
        }
        addCustomResponse("vehicles", lstLite);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getUserVehicleEx()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else
      {
        String toMap = getRequestString("toMap");
        
        List<Integer> lstComapnyId = findUserCompanyIdList(user.getCompany().getId(), null, isAdmin());
        List<StandardCompany> lstCompanys = this.standardUserService.getStandardCompanyList(lstComapnyId);
        
        Map<String, PartStandardInfo> mapAllCompanys = new HashMap();
        Map<String, PartStandardInfo> mapUserCompanys = new HashMap();
        PartStandardInfo info = null;
        StandardCompany company = null;
        Map<Integer, StandardCompany> mapLineMore = new HashMap();
        for (int i = 0; i < lstCompanys.size(); i++)
        {
          info = new PartStandardInfo();
          company = (StandardCompany)lstCompanys.get(i);
          if (company.getId().intValue() != -1)
          {
            info.setId(company.getId().toString());
            info.setName(company.getName());
            info.setParentId(company.getParentId());
            info.setLevel(company.getLevel());
            info.setCompanyId(company.getCompanyId());
            
            mapAllCompanys.put(info.getId(), info);
            if ((company.getLevel() != null) && (company.getLevel().intValue() == 3)) {
              mapLineMore.put(company.getId(), company);
            }
          }
        }
        info = null;
        company = null;
        lstCompanys = null;
        AjaxDto<StandardLineStationRelation> dtoRelation;
        if (BaseAction.getEnableTrip())
        {
          List<StandardLineInfo> lstLineInfo = new ArrayList();
          List<StandardLineStationRelation> lstLineRelation = new ArrayList();
          List<StandardStationInfo> lstStation = new ArrayList();
          
          AjaxDto<StandardLineInfo> dtoLineInfo = this.standardLineService.getLineInfoList(lstComapnyId, Integer.valueOf(1), null, null);
          lstLineInfo = dtoLineInfo.getPageList();
          dtoLineInfo = null;
          if ((lstLineInfo != null) && (lstLineInfo.size() > 0))
          {
            List<Integer> lstLineId = new ArrayList();
            
            StandardCompany lineMore = null;
            for (int i = 0; i < lstLineInfo.size(); i++)
            {
              lstLineId.add(((StandardLineInfo)lstLineInfo.get(i)).getId());
              lineMore = (StandardCompany)mapLineMore.get(((StandardLineInfo)lstLineInfo.get(i)).getId());
              if (lineMore != null)
              {
                ((StandardLineInfo)lstLineInfo.get(i)).setName(lineMore.getName());
                ((StandardLineInfo)lstLineInfo.get(i)).setPid(lineMore.getParentId());
                ((StandardLineInfo)lstLineInfo.get(i)).setAbbr(lineMore.getAbbreviation());
              }
            }
            lineMore = null;
            mapLineMore = null;
            dtoRelation = this.standardLineService.getLineStationRelationInfos(lstLineId, " order by lid,sindex asc ", null);
            lstLineId = null;
            lstLineRelation = dtoRelation.getPageList();
            dtoRelation = null;
            if ((lstLineRelation != null) && (lstLineRelation.size() > 0))
            {
              List<Integer> lstStationId = new ArrayList();
              for (int i = 0; i < lstLineRelation.size(); i++) {
                lstStationId.add(((StandardLineStationRelation)lstLineRelation.get(i)).getSid());
              }
              AjaxDto<StandardStationInfo> dtoStation = this.standardLineService.getStationInfos(lstStationId, Integer.valueOf(1), null, null);
              lstStationId = null;
              lstStation = dtoStation.getPageList();
              dtoStation = null;
              if ((lstStation != null) && (lstStation.size() > 0))
              {
                StandardStationInfo station = null;
                GpsValue gpsValue = null;
                for (int i = 0; i < lstStation.size(); i++)
                {
                  station = (StandardStationInfo)lstStation.get(i);
                  if ((station.getLngIn() != null) && (station.getLatIn() != null) && 
                    (station.getLngIn().intValue() != 0) && (station.getLatIn().intValue() != 0))
                  {
                    gpsValue = ConvertUtil.convert(station.getLngIn(), station.getLatIn(), toMap);
                    if ((gpsValue.getMapJingDu() != null) && (!gpsValue.getMapJingDu().isEmpty())) {
                      station.setLngIn(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapJingDu()) * 1000000.0D)));
                    }
                    if ((gpsValue.getMapWeiDu() != null) && (!gpsValue.getMapWeiDu().isEmpty())) {
                      station.setLatIn(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapWeiDu()) * 1000000.0D)));
                    }
                  }
                  if ((station.getLngOut() != null) && (station.getLatOut() != null) && 
                    (station.getLngOut().intValue() != 0) && (station.getLatOut().intValue() != 0))
                  {
                    gpsValue = ConvertUtil.convert(station.getLngOut(), station.getLatOut(), toMap);
                    if ((gpsValue.getMapJingDu() != null) && (!gpsValue.getMapJingDu().isEmpty())) {
                      station.setLngOut(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapJingDu()) * 1000000.0D)));
                    }
                    if ((gpsValue.getMapWeiDu() != null) && (!gpsValue.getMapWeiDu().isEmpty())) {
                      station.setLatOut(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapWeiDu()) * 1000000.0D)));
                    }
                  }
                }
                station = null;
                gpsValue = null;
              }
            }
          }
          addCustomResponse("lineInfos", lstLineInfo);
          addCustomResponse("lineRelations", lstLineRelation);
          addCustomResponse("stationInfos", lstStation);
          
          AjaxDto<StandardDriverEx> dtoDriver = this.standardUserService.getStandardDriverExList(lstComapnyId, null, null);
          addCustomResponse("drivers", dtoDriver.getPageList());
          dtoDriver = null;
        }
        List<VehicleLiteEx> lstLite = new ArrayList();
        
        List<StandardVehicle> vehicles = new ArrayList();
        if ((isAdmin()) || (isMaster()))
        {
          AjaxDto<StandardVehicle> vehicleList = getUserVehicles(user.getCompany().getId(), null, null, isAdmin(), null);
          if (vehicleList.getPageList() != null) {
            vehicles = vehicleList.getPageList();
          }
          vehicleList = null;
        }
        else
        {
          List<Integer> companyIds = findUserCompanyIdList(user.getCompany().getId(), null, isAdmin());
          int parentId = user.getCompany().getParentId().intValue();
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(user.getId(), null, null);
          for (StandardUserVehiPermitVehicle permit : vehiPermits)
          {
            if (!companyIds.contains(permit.getVehicle().getCompany().getId())) {
              permit.getVehicle().getCompany().setId(Integer.valueOf(parentId));
            }
            vehicles.add(permit.getVehicle());
          }
          companyIds = null;
          vehiPermits = null;
        }
        List<String> vehiIdnos = new ArrayList();
        if (isAdmin())
        {
          vehiIdnos = null;
        }
        else
        {
          int i = 0;
          for (int j = vehicles.size(); i < j; i++) {
            vehiIdnos.add(((StandardVehicle)vehicles.get(i)).getVehiIDNO());
          }
        }
        List<StandardVehiDevRelationExMore> relations;
        if ((isAdmin()) || (vehiIdnos.size() > 0))
        {
          List<QueryScalar> scalars = new ArrayList();
          scalars.add(new QueryScalar("nflt", StandardBasicTypes.INTEGER));
          scalars.add(new QueryScalar("devComId", StandardBasicTypes.INTEGER));
          scalars.add(new QueryScalar("chnName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("ioInName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("tempName", StandardBasicTypes.STRING));
          scalars.add(new QueryScalar("cardNum", StandardBasicTypes.STRING));
          String fieldCondition = ",b.nFlowLimitType as nflt, b.CompanyID as devComId, c.ChnName as chnName, c.IOInName as ioInName, c.TempName as tempName, b.SimCard as cardNum";
          relations = this.standardUserService.getStandardVehiDevRelationExMoreList(vehiIdnos, null, scalars, fieldCondition, ",jt808_device_info b,jt808_vehicle_info c where a.DevIDNO = b.DevIDNO and a.VehiIDNO = c.VehiIDNO");
          vehiIdnos = null;
          scalars = null;
          fieldCondition = null;
          if ((relations != null) && (relations.size() > 0))
          {
            List<String> lstDevice = new ArrayList();
            for (int i = 0; i < relations.size(); i++) {
              lstDevice.add(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
            }
            AjaxDto<DeviceStatusLite> ajaxDto = this.standardUserService.getDeviceStatusLite(lstDevice, null, null, null);
            lstDevice = null;
            
            Map<String, DeviceStatusLite> mapStatus = new HashMap();
            if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
            {
              DeviceStatusLite status = null;
              int i = 0;
              for (int j = ajaxDto.getPageList().size(); i < j; i++)
              {
                status = (DeviceStatusLite)ajaxDto.getPageList().get(i);
                
                GpsValue gpsValue = ConvertUtil.convert(status.getLng(), status.getLat(), toMap);
                status.setMlng(gpsValue.getMapJingDu());
                status.setMlat(gpsValue.getMapWeiDu());
                if (status.getLng() == null) {
                  status.setLng(Integer.valueOf(0));
                }
                if (status.getLat() == null) {
                  status.setLat(Integer.valueOf(0));
                }
                mapStatus.put(status.getId(), status);
              }
              ajaxDto = null;
            }
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
              
              String[] params_temp = getChannelParamToDev("TEMP_", relation.getTempAttr(), relation.getTempName());
              deviceLite.setTc(Integer.valueOf(Integer.parseInt(params_temp[0])));
              deviceLite.setTn(params_temp[1]);
              
              deviceLite.setMd(relation.getModule());
              if (relation.getCardNum() != null) {
                deviceLite.setSim(relation.getCardNum());
              }
              deviceLite.setNflt(relation.getNflt());
              
              deviceLite.setSt((DeviceStatusLite)mapStatus.get(relation.getDevIdno()));
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
            deviceLite = null;
            devices = null;
            StandardVehicle vehicle = null;
            VehicleLiteEx lite = null;
             i = 0;
            for (int j = vehicles.size(); i < j; i++)
            {
              lite = new VehicleLiteEx();
              vehicle = (StandardVehicle)vehicles.get(i);
              lite.setNm(vehicle.getVehiIDNO());
              lite.setPid(vehicle.getCompany().getId());
              lite.setIc(vehicle.getIcon());
              devices = (List)mapDevice.get(vehicle.getVehiIDNO());
              lite.setDl(devices);
              if ((devices != null) && (devices.size() > 0))
              {
                if (vehicle.getDriver() != null)
                {
                  lite.setDn(vehicle.getDriver().getName());
                  lite.setDt(vehicle.getDriver().getJobNum());
                }
                GetParentGroup(lite.getPid().toString(), mapAllCompanys, mapUserCompanys);
                lstLite.add(lite);
              }
            }
            vehicle = null;
            lite = null;
            mapDevice = null;
            mapStatus = null;
            mapAllCompanys = null;
          }
        }
        List<PartStandardInfo> companys = new ArrayList();
        for (Map.Entry<String, PartStandardInfo> entry : mapUserCompanys.entrySet()) {
          companys.add((PartStandardInfo)entry.getValue());
        }
        addCustomResponse("infos", companys);
        addCustomResponse("vehicles", lstLite);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String information()
  {
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
    gChineseMainTitle = getConfigValue(config, "ChineseMainTitle", "");
    gChineseCopyright = getConfigValue(config, "ChineseCopyright", "");
    gEnglishMainTitle = getConfigValue(config, "EnglishMainTitle", "");
    gEnglishCopyright = getConfigValue(config, "EnglishCopyright", "");
    gTwMainTitle = getConfigValue(config, "TwMainTitle", "");
    gTwCopyright = getConfigValue(config, "TwCopyright", "");
    
    addCustomResponse("ChineseMainTitle", gChineseMainTitle);
    addCustomResponse("ChineseCopyright", gChineseCopyright);
    addCustomResponse("EnglishMainTitle", gEnglishMainTitle);
    addCustomResponse("EnglishCopyright", gEnglishCopyright);
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
  
  public String getUserVehicleList()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else
      {
        String companyId = getRequestString("companyId");
        String vehiIDNO = getRequest().getParameter("vehiIDNO");
        
        Pagination pagination = getPaginationEx();
        String condition = "";
        if (isAdmin())
        {
          if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
            condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { vehiIDNO });
          }
          List<Integer> companys = new ArrayList();
          if ((companyId != null) && (!companyId.isEmpty())) {
            companys.add(Integer.valueOf(Integer.parseInt(companyId)));
          }
          AjaxDto<StandardVehicle> vehicles = getUserVehicles(null, companys, condition, isAdmin(), pagination);
          
          addCustomResponse("infos", vehicles.getPageList());
          addCustomResponse("pagination", vehicles.getPagination());
        }
        else
        {
          if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
            condition = String.format(" and (vehicle.vehiIDNO like '%%%s%%')", new Object[] { vehiIDNO });
          }
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(user.getId(), null, condition);
          List<StandardVehicle> permitVehicles = new ArrayList();
          if ((vehiPermits != null) && (vehiPermits.size() > 0))
          {
            int i = 0;
            for (int j = vehiPermits.size(); i < j; i++)
            {
              StandardVehicle vehicle = ((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle();
              if ((companyId == null) || (companyId.isEmpty())) {
                permitVehicles.add(vehicle);
              } else if (vehicle.getCompany().getId().equals(Integer.valueOf(Integer.parseInt(companyId)))) {
                permitVehicles.add(vehicle);
              }
            }
          }
          AjaxDto<StandardVehicle> vehicles = doSummaryVehicleEx(permitVehicles, pagination);
          addCustomResponse("infos", vehicles.getPageList());
          addCustomResponse("pagination", vehicles.getPagination());
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
  
  protected AjaxDto<PartStandardInfo> getUserDtoVehicle(Integer userId, String vehiIDNO, String companyId, Boolean isOil, Boolean isOBD, Boolean isPeople, Boolean isTpms, Boolean isTemp, Pagination pagination)
  {
    AjaxDto<StandardVehicle> vehicles = new AjaxDto();
    Map<String, Integer> oilVehi = new HashMap();
    Map<String, Integer> mapOBDVehi = new HashMap();
    Map<String, Integer> mapPeopleVehi = new HashMap();
    Map<String, Integer> mapTpmsVehi = new HashMap();
    Map<String, Integer> mapTempVehi = new HashMap();
    List<Integer> companyIds = new ArrayList();
    if ((companyId != null) && (!companyId.isEmpty()))
    {
      StandardCompany company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(companyId)));
      if (companyId.equals("-1")) {
        companyIds = findUserCompanyIdList(company.getId(), null, true);
      } else {
        companyIds = findUserCompanyIdList(company.getId(), null, false);
      }
    }
    if ((isAdmin()) || (isMaster()))
    {
      String condition = "";
      if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
        condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { vehiIDNO });
      }
      StandardCompany company = (StandardCompany)getSession().get("company");
      AjaxDto<StandardVehicle> vehis = getUserVehicles(company.getId(), companyIds, condition, isAdmin(), null);
      List<StandardVehicle> vehiList = vehis.getPageList();
      List<StandardVehicle> vehicleList = new ArrayList();
      List<StandardVehicle> oBDVehi = new ArrayList();
      List<StandardVehicle> peopleVehi = new ArrayList();
      List<StandardVehicle> tpmsVehi = new ArrayList();
      List<StandardVehicle> tempVehi = new ArrayList();
      if ((vehiList != null) && (vehiList.size() > 0))
      {
        List<String> lstVehiIdno = new ArrayList();
        Map<String, StandardVehicle> mapIdnoVechicle = new HashMap();
        int i = 0;
        for (int j = vehiList.size(); i < j; i++)
        {
          lstVehiIdno.add(((StandardVehicle)vehiList.get(i)).getVehiIDNO());
          mapIdnoVechicle.put(((StandardVehicle)vehiList.get(i)).getVehiIDNO(), (StandardVehicle)vehiList.get(i));
        }
        List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, null, null, null);
        lstVehiIdno = null;
         i = 0;
        for (int j = relations.size(); i < j; i++)
        {
          StandardVehiDevRelationEx relation = (StandardVehiDevRelationEx)relations.get(i);
          if (1 == (relation.getModule().intValue() >> 7 & 0x1)) {
            if (!isOil.booleanValue()) {
              oilVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!vehicleList.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              vehicleList.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 9 & 0x1)) {
            if (!isOBD.booleanValue()) {
              mapOBDVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!oBDVehi.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              oBDVehi.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 10 & 0x1)) {
            if (!isPeople.booleanValue()) {
              mapPeopleVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!peopleVehi.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              peopleVehi.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 11 & 0x1)) {
            if (!isTpms.booleanValue()) {
              mapTpmsVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!tpmsVehi.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              tpmsVehi.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if ((relation.getTempAttr() != null) && (!relation.getTempAttr().isEmpty())) {
            if (!isTemp.booleanValue()) {
              mapTempVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!tempVehi.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              tempVehi.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
        }
        mapIdnoVechicle = null;
      }
      if ((!isOil.booleanValue()) && (!isOBD.booleanValue()) && (!isPeople.booleanValue()) && (!isTpms.booleanValue()) && (!isTemp.booleanValue())) {
        vehicles = doSummaryVehicleEx(vehis.getPageList(), pagination);
      } else if (isOil.booleanValue()) {
        vehicles = doSummaryVehicleEx(vehicleList, pagination);
      } else if (isOBD.booleanValue()) {
        vehicles = doSummaryVehicleEx(oBDVehi, pagination);
      } else if (isPeople.booleanValue()) {
        vehicles = doSummaryVehicleEx(peopleVehi, pagination);
      } else if (isTpms.booleanValue()) {
        vehicles = doSummaryVehicleEx(tpmsVehi, pagination);
      } else {
        vehicles = doSummaryVehicleEx(tempVehi, pagination);
      }
      vehis = null;
      vehicleList = null;
      oBDVehi = null;
      peopleVehi = null;
      tpmsVehi = null;
      tempVehi = null;
    }
    else
    {
      String condition = "";
      if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
        condition = String.format(" and (vehicle.vehiIDNO like '%%%s%%')", new Object[] { vehiIDNO });
      }
      if ((companyIds != null) && (companyIds.size() > 0))
      {
        condition = condition + String.format(" and (  vehicle.company.id = %d", new Object[] { companyIds.get(0) });
        for (int i = 1; i < companyIds.size(); i++) {
          condition = condition + String.format(" or vehicle.company.id = %d", new Object[] { companyIds.get(i) });
        }
        condition = condition + " ) ";
      }
      List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(userId, null, condition);
      List<StandardVehicle> permitVehicles = new ArrayList();
      if ((vehiPermits != null) && (vehiPermits.size() > 0))
      {
        List<String> lstVehiIdno = new ArrayList();
        Map<String, StandardVehicle> mapIdnoVechicle = new HashMap();
        int i = 0;
        for (int j = vehiPermits.size(); i < j; i++)
        {
          lstVehiIdno.add(((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle().getVehiIDNO());
          mapIdnoVechicle.put(((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle().getVehiIDNO(), ((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle());
        }
        List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, null, null, null);
        lstVehiIdno = null;
        vehiPermits = null;
         i = 0;
        for (int j = relations.size(); i < j; i++)
        {
          StandardVehiDevRelationEx relation = (StandardVehiDevRelationEx)relations.get(i);
          if ((!isOil.booleanValue()) && (!isPeople.booleanValue()) && (!isTemp.booleanValue()) && 
            (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno())))) {
            permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
          }
          if (1 == (relation.getModule().intValue() >> 7 & 0x1)) {
            if (!isOil.booleanValue()) {
              oilVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 9 & 0x1)) {
            if (!isOBD.booleanValue()) {
              mapOBDVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 10 & 0x1)) {
            if (!isPeople.booleanValue()) {
              mapPeopleVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if (1 == (relation.getModule().intValue() >> 11 & 0x1)) {
            if (!isTpms.booleanValue()) {
              mapTpmsVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
          if ((relation.getTempAttr() != null) && (!relation.getTempAttr().isEmpty())) {
            if (!isTemp.booleanValue()) {
              mapTempVehi.put(relation.getVehiIdno(), Integer.valueOf(1));
            } else if (!permitVehicles.contains(mapIdnoVechicle.get(relation.getVehiIdno()))) {
              permitVehicles.add((StandardVehicle)mapIdnoVechicle.get(relation.getVehiIdno()));
            }
          }
        }
        mapIdnoVechicle = null;
      }
      vehicles = doSummaryVehicleEx(permitVehicles, pagination);
      permitVehicles = null;
    }
    List<StandardVehicle> lstVehicle = vehicles.getPageList();
    List<PartStandardInfo> partVehicle = new ArrayList();
    if ((lstVehicle != null) && (lstVehicle.size() > 0)) {
      for (int i = 0; i < lstVehicle.size(); i++)
      {
        PartStandardInfo info = new PartStandardInfo();
        StandardVehicle vehicle = (StandardVehicle)lstVehicle.get(i);
        info.setId(vehicle.getVehiIDNO());
        info.setName(vehicle.getVehiIDNO());
        info.setParentId(vehicle.getCompany().getId());
        info.setCount((Integer)oilVehi.get(vehicle.getVehiIDNO()));
        info.setObd((Integer)mapOBDVehi.get(vehicle.getVehiIDNO()));
        info.setLevel((Integer)mapPeopleVehi.get(vehicle.getVehiIDNO()));
        info.setTpms((Integer)mapTpmsVehi.get(vehicle.getVehiIDNO()));
        info.setTemp((Integer)mapTempVehi.get(vehicle.getVehiIDNO()));
        partVehicle.add(info);
      }
    }
    AjaxDto<PartStandardInfo> dtoPartVehicles = new AjaxDto();
    dtoPartVehicles.setPageList(partVehicle);
    dtoPartVehicles.setPagination(vehicles.getPagination());
    
    return dtoPartVehicles;
  }
  
  public String loadCompanyList()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), null, isAdmin(), false, false);
        List<PartStandardInfo> partCompanys = new ArrayList();
        for (int i = 0; i < companys.size(); i++)
        {
          PartStandardInfo info = new PartStandardInfo();
          StandardCompany company = (StandardCompany)companys.get(i);
          if (company.getId().intValue() != -1)
          {
            info.setId(company.getId().toString());
            info.setName(company.getName());
            info.setParentId(company.getParentId());
            info.setLevel(company.getLevel());
            info.setCompanyId(company.getCompanyId());
            partCompanys.add(info);
          }
        }
        addCustomResponse("companys", partCompanys);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadUserCompanys()
  {
    try
    {
      String type = getRequestString("type");
      String level = getRequestString("level");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<StandardCompany> companys = new ArrayList();
        if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
        {
          if ((level != null) && (!level.isEmpty()) && ("0".equals(level)))
          {
            companys = findUserCompanys(userAccount.getCompany(), null, isAdmin(), true, false);
          }
          else if ((level != null) && (!level.isEmpty()) && ("2".equals(level)))
          {
            List<Integer> lstLevel = new ArrayList();
            lstLevel.add(Integer.valueOf(3));
            companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
          }
          else
          {
            List<Integer> lstLevel = new ArrayList();
            lstLevel.add(Integer.valueOf(1));
            companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
          }
          List<PartStandardInfo> partCompanys = new ArrayList();
          for (int i = 0; i < companys.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardCompany company = (StandardCompany)companys.get(i);
            if ((company.getId() != null) && (company.getId().intValue() != -1))
            {
              info.setId(company.getId().toString());
              info.setName(company.getName());
              info.setParentId(company.getParentId());
              partCompanys.add(info);
            }
          }
          addCustomResponse("infos", partCompanys);
        }
        else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
        {
          Pagination pagination = getPaginationEx();
          String name = getRequest().getParameter("name");
          String companyId = getRequestString("companyId");
          StandardCompany company = new StandardCompany();
          boolean isAdmin = isAdmin();
          if ((companyId != null) && (!companyId.isEmpty()))
          {
            company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(companyId)));
            isAdmin = false;
          }
          else
          {
            company = userAccount.getCompany();
          }
          if ((level != null) && (!level.isEmpty()) && ("0".equals(level)))
          {
            companys = findUserCompanys(company, null, isAdmin, true, false);
          }
          else if ((level != null) && (!level.isEmpty()) && ("2".equals(level)))
          {
            List<Integer> lstLevel = new ArrayList();
            lstLevel.add(Integer.valueOf(3));
            companys = findUserCompanys(company, lstLevel, isAdmin, true, false);
          }
          else
          {
            List<Integer> lstLevel = new ArrayList();
            lstLevel.add(Integer.valueOf(1));
            companys = findUserCompanys(company, lstLevel, isAdmin, true, false);
          }
          if ((name != null) && (!name.isEmpty())) {
            for (int i = companys.size() - 1; i >= 0; i--)
            {
              StandardCompany com = (StandardCompany)companys.get(i);
              if ((StringUtil.indexOfEx(com.getName(), name) < 0) || ((com.getId() != null) && (com.getId().intValue() == -1))) {
                companys.remove(i);
              }
            }
          } else {
            for (int i = companys.size() - 1; i >= 0; i--)
            {
              StandardCompany com = (StandardCompany)companys.get(i);
              if ((com.getId() != null) && (com.getId().intValue() == -1)) {
                companys.remove(i);
              }
            }
          }
          AjaxDto<StandardCompany> newCompanys = doSummary(companys, pagination);
          addCustomResponse("infos", newCompanys.getPageList());
          addCustomResponse("pagination", newCompanys.getPagination());
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadDriverList()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
        {
          AjaxDto<StandardDriver> driverList = getDrivers(null, null);
          List<PartStandardInfo> partDrivers = new ArrayList();
          if (driverList.getPageList() != null)
          {
            List<StandardDriver> drivers = driverList.getPageList();
            for (int i = 0; i < drivers.size(); i++)
            {
              PartStandardInfo info = new PartStandardInfo();
              StandardDriver driver = (StandardDriver)drivers.get(i);
              info.setId(driver.getId().toString());
              info.setName(driver.getName());
              info.setParentId(driver.getCompany().getId());
              partDrivers.add(info);
            }
          }
          addCustomResponse("infos", partDrivers);
        }
        else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
        {
          String companyId = getRequest().getParameter("companyId");
          String name = getRequest().getParameter("name");
          Pagination pagination = getPaginationEx();
          String condition = "";
          if ((companyId != null) && (!companyId.isEmpty())) {
            condition = condition + String.format(" and company.id = %d", new Object[] { Integer.valueOf(Integer.parseInt(companyId)) });
          }
          if ((name != null) && (!name.isEmpty())) {
            condition = String.format(" and ( jobNum like '%%%s%%' or name like '%%%s%%' or company.name like '%%%s%%')", new Object[] { name, name, name });
          }
          condition = condition + " order by company.id";
          AjaxDto<StandardDriver> driverList = getDrivers(condition, pagination);
          List<PartStandardInfo> partDrivers = new ArrayList();
          if (driverList.getPageList() != null)
          {
            List<StandardDriver> drivers = driverList.getPageList();
            for (int i = 0; i < drivers.size(); i++)
            {
              PartStandardInfo info = new PartStandardInfo();
              StandardDriver driver = (StandardDriver)drivers.get(i);
              info.setId(driver.getId().toString());
              info.setName(driver.getName());
              info.setParentId(driver.getCompany().getId());
              partDrivers.add(info);
            }
          }
          addCustomResponse("infos", partDrivers);
          addCustomResponse("pagination", driverList.getPagination());
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public AjaxDto<StandardCompany> doSummary(List<StandardCompany> companys, Pagination pagination)
  {
    int start = 0;int index = companys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardCompany> newCompanys = new ArrayList();
    for (int i = start; i < index; i++) {
      newCompanys.add((StandardCompany)companys.get(i));
    }
    AjaxDto<StandardCompany> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newCompanys);
    return dtoSummary;
  }
  
  public String loadUserVehicleList()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        AjaxDto<PartStandardInfo> vehicles = getUserDtoVehicle(userAccount.getId(), null, null, Boolean.valueOf(false), Boolean.valueOf(false), Boolean.valueOf(false), Boolean.valueOf(false), Boolean.valueOf(false), null);
        
        addCustomResponse("vehicles", vehicles.getPageList());
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getUserVehicleListEx()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
      }
      else
      {
        String companyId = getRequestString("companyId");
        String vehiIDNO = getRequest().getParameter("vehiIDNO");
        boolean isOil = getRequestString("isOil").equals("true");
        boolean isOBD = getRequestString("isOBD").equals("true");
        boolean isPeople = getRequestString("isPeople").equals("true");
        boolean isTpms = getRequestString("isTpms").equals("true");
        boolean isTemp = getRequestString("isTemp").equals("true");
        Pagination pagination = getPaginationEx();
        if ((companyId == null) || (companyId.equals(""))) {
          companyId = user.getCompany().getId().toString();
        }
        AjaxDto<PartStandardInfo> vehicles = getUserDtoVehicle(user.getId(), vehiIDNO, companyId, Boolean.valueOf(isOil), Boolean.valueOf(isOBD), Boolean.valueOf(isPeople), Boolean.valueOf(isTpms), Boolean.valueOf(isTemp), pagination);
        
        addCustomResponse("infos", vehicles.getPageList());
        addCustomResponse("pagination", vehicles.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getNavPage()
  {
    try
    {
      String clientLogin = getRequestString("clientLogin");
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
      else
      {
        ActionContext ctx = ActionContext.getContext();
        String roles = (String)ctx.getSession().get("privilege");
        List<UserSubPrivi> privis = new ArrayList();
        if (((clientLogin == null) || (clientLogin.isEmpty()) || (!clientLogin.equals("1"))) && (!BaseAction.getEnableShowClient()))
        {
          if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_MONITORING + ",") >= 0) {
            privis.add(new UserSubPrivi(Integer.valueOf(1), "weizhi", "LocationManagement/Location"));
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_REALTIMEVIDEO + ",") >= 0) {
            privis.add(new UserSubPrivi(Integer.valueOf(8), "shipin", "LocationManagement/Location"));
          }
          if (BaseAction.getEnableTrip()) {
            if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_LINE_MONITOR + ",") >= 0) {
              privis.add(new UserSubPrivi(Integer.valueOf(11), "xianlu", "LocationManagement/Location"));
            }
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_TRACK + ",") >= 0) {
            privis.add(new UserSubPrivi(Integer.valueOf(7), "guiji", "TrackManagement/Track"));
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_RECORD_BACK + ",") >= 0) {
            privis.add(new UserSubPrivi(Integer.valueOf(9), "luxiang", "VideoManagement/VideoReplay"));
          }
        }
        if ((roles.indexOf("," + StandardUserRole.PRIVI_PAGE_REPORT + ",") >= 0) || (isAdmin()) || (isMaster())) {
          privis.add(new UserSubPrivi(Integer.valueOf(2), "tongji", "StatisticalReports/StatisticalReports.html"));
        }
        if ((roles.indexOf("," + StandardUserRole.PRIVI_PAGE_OPERATION + ",") >= 0) || (isAdmin()) || (isMaster())) {
          privis.add(new UserSubPrivi(Integer.valueOf(3), "yunying", "OperationManagement/OperationManagement.html"));
        }
        if ((roles.indexOf("," + StandardUserRole.PRIVI_PAGE_INTERNAL + ",") < 0) && (!isAdmin())) {
          isMaster();
        }
        if ((roles.indexOf("," + StandardUserRole.PRIVI_PAGE_RULE + ",") >= 0) || (isAdmin()) || (isMaster())) {
          privis.add(new UserSubPrivi(Integer.valueOf(5), "guize", "RulesManagement/RulesManagement.html"));
        }
        if (BaseAction.getEnableHasReceipt()) {
          privis.add(new UserSubPrivi(Integer.valueOf(10), "denglu", ""));
        }
        if (isAdmin()) {
          privis.add(new UserSubPrivi(Integer.valueOf(6), "server", "ServerManagement/ServerManagement.html"));
        }
        addCustomResponse("pages", privis);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getOperationPage()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
      else
      {
        ActionContext ctx = ActionContext.getContext();
        String roles = (String)ctx.getSession().get("privilege");
        if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_OPERATION + ",") >= 0)
        {
          List<UserSubPrivi> privis = new ArrayList();
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_VEHICLE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(6), "AllVehicleInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_TEAM + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(8), "VehicleTeam", ""));
          }
          if (BaseAction.getEnableTrip()) {
            if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_LINE + ",") >= 0) || (isAdmin()) || (isMaster())) {
              privis.add(new UserSubPrivi(Integer.valueOf(12), "AllLineInfo", ""));
            }
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_USER + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(3), "AllUserInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_ROLE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(2), "AllRoleInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_COMPANY + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(1), "AllCompanyInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DEVICE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(5), "AllDeviceInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_SIM + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(4), "AllSIMInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DRIVER + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(7), "AllDriverInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_SAFE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(9), "AllSafeInfo", ""));
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_MATURITY + ",") >= 0) || (isAdmin()) || (isMaster())) {
            privis.add(new UserSubPrivi(Integer.valueOf(10), "MaturityInfo", ""));
          }
          if (BaseAction.getEnableHasReceipt()) {
            if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DOCUMENTS + ",") >= 0) || (isAdmin()) || (isMaster())) {
              privis.add(new UserSubPrivi(Integer.valueOf(11), "DocumentInfo", ""));
            }
          }
          addCustomResponse("pages", privis);
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
  
  public String getReportPage()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
      else
      {
        ActionContext ctx = ActionContext.getContext();
        String roles = (String)ctx.getSession().get("privilege");
        if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_REPORT + ",") >= 0)
        {
          List<UserPrivi> privis = new ArrayList();
          if (BaseAction.getEnableTrip())
          {
            UserPrivi tripMonthPrivi = new UserPrivi(Integer.valueOf(140), "tripmonth", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LINE_MONTH + ",") >= 0) {
              tripMonthPrivi.addSubPriviEx(Integer.valueOf(1401), "line-month", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_MONTH + ",") >= 0) {
              tripMonthPrivi.addSubPriviEx(Integer.valueOf(1403), "vehicle-month", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVER_MONTH + ",") >= 0) {
              tripMonthPrivi.addSubPriviEx(Integer.valueOf(1405), "driver-month", "");
            }
            if ((tripMonthPrivi.getListSubPrivi() != null) && (tripMonthPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tripMonthPrivi);
            }
            UserPrivi tripDailyPrivi = new UserPrivi(Integer.valueOf(141), "tripdaily", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LINE_DAILY + ",") >= 0) {
              tripDailyPrivi.addSubPriviEx(Integer.valueOf(1402), "line-daily", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_DAILY + ",") >= 0) {
              tripDailyPrivi.addSubPriviEx(Integer.valueOf(1404), "vehicle-daily", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVER_DAILY + ",") >= 0) {
              tripDailyPrivi.addSubPriviEx(Integer.valueOf(1406), "driver-daily", "");
            }
            if ((tripDailyPrivi.getListSubPrivi() != null) && (tripDailyPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tripDailyPrivi);
            }
            UserPrivi tripDetailPrivi = new UserPrivi(Integer.valueOf(142), "tripdetail", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIP + ",") >= 0) {
              tripDetailPrivi.addSubPriviEx(Integer.valueOf(1407), "trip-detail", "");
            }
            if ((tripDetailPrivi.getListSubPrivi() != null) && (tripDetailPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tripDetailPrivi);
            }
            UserPrivi tripPrivi = new UserPrivi(Integer.valueOf(143), "trip", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_STATION + ",") >= 0) {
              tripPrivi.addSubPriviEx(Integer.valueOf(1408), "station-detail", "");
            }
            if ((tripPrivi.getListSubPrivi() != null) && (tripPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tripPrivi);
            }
          }
//          if (BaseAction.getEnableHasDrivingBehavior())
//          {
//            UserPrivi drivingPrivi = new UserPrivi(Integer.valueOf(70), "driving", "");
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
//              drivingPrivi.addSubPriviEx(Integer.valueOf(701), "drivingBehavior-summary", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_DETAIL + ",") >= 0) {
//              drivingPrivi.addSubPriviEx(Integer.valueOf(702), "drivingBehavior-detail", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TRACK_DETAIL + ",") >= 0) {
//              drivingPrivi.addSubPriviEx(Integer.valueOf(12), "track-detail", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
//              drivingPrivi.addSubPriviEx(Integer.valueOf(703), "highspeed-summary", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
//              drivingPrivi.addSubPriviEx(Integer.valueOf(704), "highspeed-detail", "");
//            }
//            if (BaseAction.getEnableTrip())
//            {
//              if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
//                drivingPrivi.addSubPriviEx(Integer.valueOf(705), "slipstation-summary", "");
//              }
//              if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
//                drivingPrivi.addSubPriviEx(Integer.valueOf(706), "slipstation-detail", "");
//              }
//            }
//            if ((drivingPrivi.getListSubPrivi() != null) && (drivingPrivi.getListSubPrivi().size() > 0)) {
//              privis.add(drivingPrivi);
//            }
//          }
          if (BaseAction.getEnableReportLogin())
          {
            UserPrivi loginPrivi = new UserPrivi(Integer.valueOf(2), "login", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LOGIN_SUMMARY + ",") >= 0) {
              loginPrivi.addSubPriviEx(Integer.valueOf(21), "login-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LOGIN_DETAIL + ",") >= 0) {
              loginPrivi.addSubPriviEx(Integer.valueOf(22), "login-detail", "");
            }
            if ((loginPrivi.getListSubPrivi() != null) && (loginPrivi.getListSubPrivi().size() > 0)) {
              privis.add(loginPrivi);
            }
          }
//          if (BaseAction.getEnableReportAlarm())
//          {
//            UserPrivi alarmPrivi = new UserPrivi(Integer.valueOf(3), "alarm", "");
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_SUMMARY + ",") >= 0) {
//              alarmPrivi.addSubPriviEx(Integer.valueOf(31), "alarm-summary", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_DETAIL + ",") >= 0) {
//              alarmPrivi.addSubPriviEx(Integer.valueOf(32), "alarm-detail", "");
//            }
//            if ((alarmPrivi.getListSubPrivi() != null) && (alarmPrivi.getListSubPrivi().size() > 0)) {
//              privis.add(alarmPrivi);
//            }
//          }
          if (BaseAction.getEnableHasLiCheng())
          {
            UserPrivi lichengPrivi = new UserPrivi(Integer.valueOf(5), "licheng", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LICHENG_SUMMARY + ",") >= 0) {
              lichengPrivi.addSubPriviEx(Integer.valueOf(51), "licheng-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LICHENG_DETAIL + ",") >= 0) {
              lichengPrivi.addSubPriviEx(Integer.valueOf(52), "licheng-detail", "");
            }
            if ((lichengPrivi.getListSubPrivi() != null) && (lichengPrivi.getListSubPrivi().size() > 0)) {
              privis.add(lichengPrivi);
            }
          }
          if (BaseAction.getEnableHasDriving())
          {
            UserPrivi parkPrivi = new UserPrivi(Integer.valueOf(6), "park", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PARK_SUMMARY + ",") >= 0) {
              parkPrivi.addSubPriviEx(Integer.valueOf(61), "park-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PARK_DETAIL + ",") >= 0) {
              parkPrivi.addSubPriviEx(Integer.valueOf(62), "park-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ACC_SUMMARY + ",") >= 0) {
              parkPrivi.addSubPriviEx(Integer.valueOf(63), "acc-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ACC_DETAIL + ",") >= 0) {
              parkPrivi.addSubPriviEx(Integer.valueOf(64), "acc-detail", "");
            }
            if ((parkPrivi.getListSubPrivi() != null) && (parkPrivi.getListSubPrivi().size() > 0)) {
              privis.add(parkPrivi);
            }
          }
          if (BaseAction.getEnableReportFence())
          {
            UserPrivi fencePrivi = new UserPrivi(Integer.valueOf(7), "fence", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_FENCE_SUMMARY + ",") >= 0) {
              fencePrivi.addSubPriviEx(Integer.valueOf(71), "fence-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_FENCE_DETAIL + ",") >= 0) {
              fencePrivi.addSubPriviEx(Integer.valueOf(72), "fence-detail", "");
            }
            if ((fencePrivi.getListSubPrivi() != null) && (fencePrivi.getListSubPrivi().size() > 0)) {
              privis.add(fencePrivi);
            }
          }
          if (BaseAction.getEnableReportOil())
          {
            UserPrivi oilPrivi = new UserPrivi(Integer.valueOf(4), "oil", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OIL_SUMMARY + ",") >= 0) {
              oilPrivi.addSubPriviEx(Integer.valueOf(43), "oil-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OILTRACK_DETAIL + ",") >= 0) {
              oilPrivi.addSubPriviEx(Integer.valueOf(41), "oilTrack-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OILEXCEPTION_DETAIL + ",") >= 0) {
              oilPrivi.addSubPriviEx(Integer.valueOf(42), "oilException-detail", "");
            }
            if ((oilPrivi.getListSubPrivi() != null) && (oilPrivi.getListSubPrivi().size() > 0)) {
              privis.add(oilPrivi);
            }
          }
          if (BaseAction.getEnableHasMalfunction())
          {
            UserPrivi malfunctionPrivi = new UserPrivi(Integer.valueOf(40), "malfunction", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_MALFUNCTION_SUMMARY + ",") >= 0) {
              malfunctionPrivi.addSubPriviEx(Integer.valueOf(401), "malfunction-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_MALFUNCTION_DETAIL + ",") >= 0) {
              malfunctionPrivi.addSubPriviEx(Integer.valueOf(402), "malfunction-detail", "");
            }
            if ((malfunctionPrivi.getListSubPrivi() != null) && (malfunctionPrivi.getListSubPrivi().size() > 0)) {
              privis.add(malfunctionPrivi);
            }
          }
          //2016-6-15 修改 注销 系统报表 下拉菜单
//          if (BaseAction.getEnableHasVideo())
//          {
//            UserPrivi videoPrivi = new UserPrivi(Integer.valueOf(50), "video", "");
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VIDEO_SUMMARY + ",") >= 0) {
//              videoPrivi.addSubPriviEx(Integer.valueOf(501), "video-summary", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VIDEO_DETAIL + ",") >= 0) {
//              videoPrivi.addSubPriviEx(Integer.valueOf(502), "video-detail", "");
//            }
//            if ((videoPrivi.getListSubPrivi() != null) && (videoPrivi.getListSubPrivi().size() > 0)) {
//              privis.add(videoPrivi);
//            }
//          }
          if (BaseAction.getEnableReportIoin())
          {
            UserPrivi ioPrivi = new UserPrivi(Integer.valueOf(60), "io", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_IO_SUMMARY + ",") >= 0) {
              ioPrivi.addSubPriviEx(Integer.valueOf(601), "io-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_IO_DETAIL + ",") >= 0) {
              ioPrivi.addSubPriviEx(Integer.valueOf(602), "io-detail", "");
            }
            if ((ioPrivi.getListSubPrivi() != null) && (ioPrivi.getListSubPrivi().size() > 0)) {
              privis.add(ioPrivi);
            }
          }
//          if (BaseAction.getEnableReportStorage())
//          {
//            UserPrivi storagePrivi = new UserPrivi(Integer.valueOf(9), "storage", "");
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_DISK_ERROR_DETAIL + ",") >= 0) {
//              storagePrivi.addSubPriviEx(Integer.valueOf(91), "diskError-detail", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_HDD_HIGH_TEMPERATURE + ",") >= 0) {
//              storagePrivi.addSubPriviEx(Integer.valueOf(92), "diskHighTemperature-detail", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_HARDDISK_STATUS_INFORMATION + ",") >= 0) {
//              storagePrivi.addSubPriviEx(Integer.valueOf(93), "diskStatus-detail", "");
//            }
//            if ((storagePrivi.getListSubPrivi() != null) && (storagePrivi.getListSubPrivi().size() > 0)) {
//              privis.add(storagePrivi);
//            }
//          }
//          if (BaseAction.getEnableReportEquipment())
//          {
//            UserPrivi equipmentPrivi = new UserPrivi(Integer.valueOf(10), "equipment", "");
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VERSION_DETAIL + ",") >= 0) {
//              equipmentPrivi.addSubPriviEx(Integer.valueOf(101), "eqVersion-detail", "");
//            }
//            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OFFLINE_RECORDING_EQUIPMENT_UPGRADE + ",") >= 0) {
//              equipmentPrivi.addSubPriviEx(Integer.valueOf(102), "eqOfflineUpgrade-detail", "");
//            }
//            if ((equipmentPrivi.getListSubPrivi() != null) && (equipmentPrivi.getListSubPrivi().size() > 0)) {
//              privis.add(equipmentPrivi);
//            }
//          }
          if (BaseAction.getEnableHasMedia())
          {
            UserPrivi mediaPrivi = new UserPrivi(Integer.valueOf(20), "media", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_PHOTO + ",") >= 0) {
              mediaPrivi.addSubPriviEx(Integer.valueOf(201), "vehiclePhotos-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_AUDIO + ",") >= 0) {
              mediaPrivi.addSubPriviEx(Integer.valueOf(202), "vehicleAudio-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_VIDEO + ",") >= 0) {
              mediaPrivi.addSubPriviEx(Integer.valueOf(203), "vehicleVideo-detail", "");
            }
            if ((mediaPrivi.getListSubPrivi() != null) && (mediaPrivi.getListSubPrivi().size() > 0)) {
              privis.add(mediaPrivi);
            }
          }
          if (BaseAction.getEnableHasData())
          {
            UserPrivi dataPrivi = new UserPrivi(Integer.valueOf(30), "data", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DATA + ",") >= 0) {
              dataPrivi.addSubPriviEx(Integer.valueOf(301), "data-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_SMS_DETAIL + ",") >= 0) {
              dataPrivi.addSubPriviEx(Integer.valueOf(13), "sms-detail", "");
            }
            if ((dataPrivi.getListSubPrivi() != null) && (dataPrivi.getListSubPrivi().size() > 0)) {
              privis.add(dataPrivi);
            }
          }
          if (BaseAction.getEnableHasUserBehavior())
          {
            UserPrivi userOnlinePrivi = new UserPrivi(Integer.valueOf(80), "online", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERONLINE_SUMMARY + ",") >= 0) {
              userOnlinePrivi.addSubPriviEx(Integer.valueOf(801), "userOnline-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERONLINE_DETAIL + ",") >= 0) {
              userOnlinePrivi.addSubPriviEx(Integer.valueOf(802), "userOnline-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERLOG_DETAIL + ",") >= 0) {
              userOnlinePrivi.addSubPriviEx(Integer.valueOf(81), "user-log", "");
            }
            if ((userOnlinePrivi.getListSubPrivi() != null) && (userOnlinePrivi.getListSubPrivi().size() > 0)) {
              privis.add(userOnlinePrivi);
            }
          }
          if (BaseAction.getEnableHasTraffic())
          {
            UserPrivi peoplePrivi = new UserPrivi(Integer.valueOf(90), "people", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PEOPLE_SUMMARY + ",") >= 0) {
              peoplePrivi.addSubPriviEx(Integer.valueOf(901), "people-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PEOPLE_DETAIL + ",") >= 0) {
              peoplePrivi.addSubPriviEx(Integer.valueOf(902), "people-detail", "");
            }
            if ((peoplePrivi.getListSubPrivi() != null) && (peoplePrivi.getListSubPrivi().size() > 0)) {
              privis.add(peoplePrivi);
            }
          }
          if (BaseAction.getEnableHasTemperature())
          {
            UserPrivi tempPrivi = new UserPrivi(Integer.valueOf(100), "temp", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMP_SUMMARY + ",") >= 0) {
              tempPrivi.addSubPriviEx(Integer.valueOf(1001), "temp-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMPTRACK_DETAIL + ",") >= 0) {
              tempPrivi.addSubPriviEx(Integer.valueOf(1002), "tempTrack-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMPEXCEPTION_DETAIL + ",") >= 0) {
              tempPrivi.addSubPriviEx(Integer.valueOf(1003), "tempException-detail", "");
            }
            if ((tempPrivi.getListSubPrivi() != null) && (tempPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tempPrivi);
            }
          }
          if (BaseAction.getEnableHasSign())
          {
            UserPrivi signinPrivi = new UserPrivi(Integer.valueOf(120), "signin", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_SIGNIN_DETAIL + ",") >= 0) {
              signinPrivi.addSubPriviEx(Integer.valueOf(1201), "signin-detail", "");
            }
            if ((signinPrivi.getListSubPrivi() != null) && (signinPrivi.getListSubPrivi().size() > 0)) {
              privis.add(signinPrivi);
            }
          }
          if (BaseAction.getEnableHasReceipt())
          {
            UserPrivi invoicePrivi = new UserPrivi(Integer.valueOf(130), "invoice", "");
            invoicePrivi.addSubPriviEx(Integer.valueOf(1301), "invoice-summary", "");
            invoicePrivi.addSubPriviEx(Integer.valueOf(1302), "invoice-detail", "");
            privis.add(invoicePrivi);
          }
          if (BaseAction.getEnableTpms())
          {
            UserPrivi tpmsPrivi = new UserPrivi(Integer.valueOf(150), "tpms", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMS_SUMMARY + ",") >= 0) {
              tpmsPrivi.addSubPriviEx(Integer.valueOf(1501), "tpms-summary", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMS_DETAIL + ",") >= 0) {
              tpmsPrivi.addSubPriviEx(Integer.valueOf(1502), "tpms-detail", "");
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMSTRACK_DETAIL + ",") >= 0) {
              tpmsPrivi.addSubPriviEx(Integer.valueOf(1503), "tpmsTrack-detail", "");
            }
            if ((tpmsPrivi.getListSubPrivi() != null) && (tpmsPrivi.getListSubPrivi().size() > 0)) {
              privis.add(tpmsPrivi);
            }
          }
          if (BaseAction.getEnableHasOBD())
          {
            UserPrivi obdPrivi = new UserPrivi(Integer.valueOf(160), "obd", "");
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OBDTRACK_DETAIL + ",") >= 0) {
              obdPrivi.addSubPriviEx(Integer.valueOf(1601), "obdTrack-detail", "");
            }
            if ((obdPrivi.getListSubPrivi() != null) && (obdPrivi.getListSubPrivi().size() > 0)) {
              privis.add(obdPrivi);
            }
          }
          addCustomResponse("pages", privis);
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
  
  public String getMediaServer()
  {
    try
    {
      AjaxDto<ServerInfo> ajaxDto = this.serverService.getAllServer(Integer.valueOf(3), null);
      addCustomResponse("mediaServer", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getGateStoServer()
  {
    try
    {
      AjaxDto<ServerInfo> ajaxDtoGtae = this.serverService.getAllServer(Integer.valueOf(2), null);
      addCustomResponse("gatewayServer", ajaxDtoGtae.getPageList());
      
      AjaxDto<ServerInfo> ajaxDtoSto = this.serverService.getAllServer(Integer.valueOf(5), null);
      addCustomResponse("storageServer", ajaxDtoSto.getPageList());
      
      ServerInfo userServer = this.serverService.getOnlineServer(4);
      addCustomResponse("userServer", userServer);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getLoginServer()
  {
    try
    {
      AjaxDto<ServerInfo> ajaxDtoLogin = this.serverService.getAllServer(Integer.valueOf(1), null);
      addCustomResponse("loginServer", ajaxDtoLogin.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean checkPrivi()
  {
    return true;
  }
}
