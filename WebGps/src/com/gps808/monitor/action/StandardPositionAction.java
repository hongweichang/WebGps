package com.gps808.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.DeviceStatusLite;
import com.gps.model.ServerInfo;
import com.gps.report.vo.DeviceQuery;
import com.gps.user.model.UserAlarmShield;
import com.gps.util.ConvertUtil;
import com.gps.util.GoogleGpsFix;
import com.gps.vo.GpsValue;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.monitor.service.StandardMonitorService;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.DeviceLiteMore;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import com.gps808.operationManagement.vo.VehicleLiteMore;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceAlarmEx;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.report.vo.StandardLichengSummary;
import com.opensymphony.xwork2.ActionContext;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import org.hibernate.type.StandardBasicTypes;

public class StandardPositionAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = -9186083421023326883L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_MONITORING.toString());
  }
  
  public String status()
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      String[] devices = query.getDevIdnos().split(",");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
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
          if (status.getGpsTime() != null) {
            status.setGpsTimeStr(DateUtil.dateSwitchString(status.getGpsTime()));
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
  
  public String statusEx()
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      String[] devices = query.getDevIdnos().split(",");
      List<DeviceStatusLite> lstStatus = this.standardMonitorService.getDeviceStatusLite(devices);
      if ((lstStatus != null) && (lstStatus.size() > 0))
      {
        ActionContext ctx = ActionContext.getContext();
        
        Map<String, String> mapStatusTime = (Map)ctx.getSession().get("mapStatusTime");
        if (mapStatusTime == null) {
          mapStatusTime = new HashMap();
        }
        String toMap = getRequestString("toMap");
        String loadAll = getRequestString("loadAll");
        boolean isLoadAll = (loadAll != null) && (loadAll.equals("1"));
        for (int i = lstStatus.size() - 1; i >= 0; i--)
        {
          DeviceStatusLite status = (DeviceStatusLite)lstStatus.get(i);
          
          String gpstime = status.getGt();
          String gpstime_ = (String)mapStatusTime.get(status.getId());
          if ((isLoadAll) || (((gpstime_ != null) && (!gpstime_.isEmpty())) || (((gpstime != null) && (!gpstime.isEmpty())) || (
            (gpstime_ != null) && (!gpstime_.isEmpty()) && (gpstime != null) && (!gpstime.isEmpty()) && 
            (DateUtil.compareStrLongTime(gpstime, gpstime_) > 0)))))
          {
            mapStatusTime.put(status.getId(), status.getGt());
            if (status.getLng() == null) {
              status.setLng(Integer.valueOf(0));
            }
            if (status.getLat() == null) {
              status.setLat(Integer.valueOf(0));
            }
            GpsValue gpsValue = ConvertUtil.convert(status.getLng(), status.getLat(), toMap);
            status.setMlng(gpsValue.getMapJingDu());
            status.setMlat(gpsValue.getMapWeiDu());
          }
          else
          {
            lstStatus.remove(i);
          }
        }
        ctx.getSession().put("mapStatusTime", mapStatusTime);
      }
      addCustomResponse("status", lstStatus);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String terminalStatus()
  {
    try
    {
      String devIdnos = getRequestString("devIdnos");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devIdnos.split(","));
      if (ajaxDto.getPageList() != null) {
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
          if (status.getJingDu() == null) {
            status.setJingDu(Integer.valueOf(0));
          }
          if (status.getWeiDu() == null) {
            status.setWeiDu(Integer.valueOf(0));
          }
          GpsValue gpsValue = GoogleGpsFix.fixCoordinate(status.getJingDu(), status.getWeiDu());
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
  
  public String queryDevice()
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceInfo> ajaxDto = this.deviceService.getDeviceList(name, null, null, null, null, null);
      addCustomResponse("devices", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String alarm()
  {
    boolean isException = false;
    try
    {
      DeviceQuery query = new DeviceQuery();
      try
      {
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
        isException = true;
      }
      if ((query != null) && (query.getDevIdnos() != null) && (!query.getDevIdnos().isEmpty()))
      {
        String toMap = getRequestString("toMap");
        try
        {
          URL url = new URL(String.format("http://%s:%d/66/11", new Object[] { this.notifyService.getUserServerLanAddr(), this.notifyService.getUserServerPort() }));
          HttpURLConnection httpConn = (HttpURLConnection)url.openConnection();
          httpConn.setDoInput(true);
          httpConn.setDoOutput(true);
          httpConn.setRequestMethod("POST");
          httpConn.setUseCaches(false);
          httpConn.setConnectTimeout(5000);
          httpConn.setReadTimeout(20000);
          
          List<String> lstIdnos = new ArrayList();
          String[] devices = query.getDevIdnos().split(",");
          for (int i = 0; i < devices.length; i++) {
            lstIdnos.add(devices[i]);
          }
          Map<String, Object> mapParam = new HashMap();
          mapParam.put("DevIDNO", lstIdnos);
          HttpServletRequest request = ServletActionContext.getRequest();
          mapParam.put("JSESSIONID", request.getRequestedSessionId());
          mapParam.put("toMap", toMap);
          String jsonParam = AjaxUtils.toJson(mapParam, false);
          
          DataOutputStream dos = new DataOutputStream(httpConn.getOutputStream());
          
          dos.write(jsonParam.getBytes());
          dos.flush();
          
          InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
          
          addCustomResponse(JSON_RESULT, inputReader);
        }
        catch (Exception ex)
        {
          this.log.info("StandardPositionAction read alarm failed\n");
        }
      }
      if (!isException) {
      
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      isException = true;
    }
    this.log.info("StandardPositionAction alarm exception 20151013\n");
    try
    {
      this.log.info("StandardPositionAction json=" + getRequest().getParameter("json"));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    label429:
    return "success";
  }
  
  protected boolean isPointInRect(double mapJingDu, double mapWeiDu, String mapJindDus, String mapWeiDus)
  {
    String[] lngs = mapJindDus.split(",");
    String[] lats = mapWeiDus.split(",");
    if ((lngs.length > 1) && (lats.length > 1))
    {
      double[] lstLng = { Double.parseDouble(lngs[0]), Double.parseDouble(lngs[1]) };
      double[] lstLat = { Double.parseDouble(lats[0]), Double.parseDouble(lats[1]) };
      if (lstLng[0] >= lstLng[1])
      {
        if ((mapJingDu > lstLng[0]) || (mapJingDu < lstLng[1])) {
          return false;
        }
      }
      else if ((mapJingDu < lstLng[0]) || (mapJingDu > lstLng[1])) {
        return false;
      }
      if (lstLat[0] >= lstLat[1])
      {
        if ((mapWeiDu > lstLat[0]) || (mapWeiDu < lstLat[1])) {
          return false;
        }
      }
      else if ((mapWeiDu < lstLat[0]) || (mapWeiDu > lstLat[1])) {
        return false;
      }
      return true;
    }
    return false;
  }
  
  protected void setTrackSummary(StandardLichengSummary trackSummary, StandardDeviceTrack track, boolean begin, boolean flag)
  {
    if (begin)
    {
      trackSummary.setVehiIdno(track.getVehiIdno());
      trackSummary.setStartTimeStr(track.getGpsTimeStr());
      trackSummary.setStartJingDu(track.getJingDu());
      trackSummary.setStartLiCheng(track.getLiCheng());
      trackSummary.setStartWeiDu(track.getWeiDu());
      trackSummary.setStartPosition(track.getPosition());
      if (flag) {
        trackSummary.setStartGaoDu(Integer.valueOf(1));
      } else {
        trackSummary.setStartGaoDu(Integer.valueOf(0));
      }
    }
    else
    {
      trackSummary.setEndTimeStr(track.getGpsTimeStr());
      trackSummary.setEndJingDu(track.getJingDu());
      trackSummary.setEndLiCheng(track.getLiCheng());
      trackSummary.setEndWeiDu(track.getWeiDu());
      trackSummary.setEndPosition(track.getPosition());
      if (flag) {
        trackSummary.setEndGaoDu(Integer.valueOf(1));
      } else {
        trackSummary.setEndGaoDu(Integer.valueOf(0));
      }
    }
  }
  
  public String queryVehicle()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String vehiIdnos = getRequest().getParameter("vehiIdno");
      String toMap = getRequestString("toMap");
      String jingdus = getRequestString("jingdu");
      String weidus = getRequestString("weidu");
      if ((begintime == null) || (endtime == null) || (vehiIdnos == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] vehiIdno = vehiIdnos.split(",");
        
        List<StandardLichengSummary> allTracks = new ArrayList();
        for (int i = 0; i < vehiIdno.length; i++)
        {
          String devIdno = getGPSDevIdno(vehiIdno[i]);
          AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno[i], DateUtil.StrLongTime2Date(begintime), 
            DateUtil.StrLongTime2Date(endtime), 0, 0, 0, 0, 0, 0, null, toMap, devIdno);
          List<StandardDeviceTrack> tracks = ajaxDto.getPageList();
          if (tracks != null)
          {
            StandardLichengSummary trackSummary = new StandardLichengSummary();
            StandardDeviceTrack lastTrack = new StandardDeviceTrack();
            boolean begin = true;
            boolean flag = true;
            for (int j = 0; j < tracks.size(); j++)
            {
              StandardDeviceTrack track = (StandardDeviceTrack)tracks.get(j);
              if ((track.getMapJingDu() != null) && (track.getMapWeiDu() != null))
              {
                lastTrack = track;
                if (isPointInRect(Double.parseDouble(track.getMapJingDu()), Double.parseDouble(track.getMapWeiDu()), jingdus, weidus))
                {
                  if (begin)
                  {
                    trackSummary = new StandardLichengSummary();
                    setTrackSummary(trackSummary, track, begin, flag);
                    begin = false;
                  }
                }
                else
                {
                  flag = false;
                  if (!begin)
                  {
                    setTrackSummary(trackSummary, track, begin, flag);
                    begin = true;
                    allTracks.add(trackSummary);
                  }
                }
              }
            }
            if ((!begin) && (lastTrack.getVehiIdno() != null))
            {
              setTrackSummary(trackSummary, lastTrack, begin, true);
              allTracks.add(trackSummary);
            }
          }
        }
        Pagination pagination = getPaginationEx();
        int start = 0;int index = allTracks.size();
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
        List<StandardLichengSummary> trackSummary = new ArrayList();
        for (int i = start; i < index; i++) {
          trackSummary.add((StandardLichengSummary)allTracks.get(i));
        }
        addCustomResponse("infos", trackSummary);
        addCustomResponse("pagination", pagination);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveAlarmShield()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      UserAlarmShield alarmShield = (UserAlarmShield)AjaxUtils.getObject(getRequest(), UserAlarmShield.class);
      alarmShield.setUserId(userAccount.getId());
      this.deviceService.save(alarmShield);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findAlarmShield()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      UserAlarmShield alarmShield = (UserAlarmShield)this.deviceService.getObject(UserAlarmShield.class, userAccount.getId());
      String armString = "";
      if (alarmShield != null) {
        armString = alarmShield.getArmString();
      }
      addCustomResponse("alarmShield", armString);
      ActionContext ctx = ActionContext.getContext();
      ctx.getSession().put("alarmShield", armString);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String[] genDetailHeads()
  {
    String infoType = getRequestString("infoType");
    if (infoType.equals("0"))
    {
      String[] heads = new String[4];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.company");
      heads[3] = getText("report.dispatch.status");
      return heads;
    }
    if (infoType.equals("1"))
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.company");
      heads[3] = getText("report.time");
      heads[4] = getText("report.position");
      return heads;
    }
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.company");
    heads[3] = getText("report.time");
    heads[4] = getText("monitor.offlineTime");
    heads[5] = getText("report.position");
    return heads;
  }
  
  public String detailStorageExcel()
  {
    String exportType = getRequestString("exportType") == null ? String.valueOf(1) : getRequestString("exportType");
    ExportReport export = null;
    try
    {
      if (this.hasExcelRight)
      {
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
          
          toMap = 2;
        }
        String title = genDetailTitle();
        
        String[] heads = genDetailHeads();
        
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)), title, heads);
        
        String infoType = getRequestString("infoType");
        if (infoType.equals("0")) {
          exportStorageTable(vehiIdnos, Integer.valueOf(toMap), export);
        } else if (infoType.equals("1")) {
          exportOfflineTable(vehiIdnos, Integer.valueOf(toMap), export);
        } else {
          exportDamageTable(vehiIdnos, Integer.valueOf(toMap), export);
        }
        this.excelStream = export.createStream();
      }
      else
      {
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)));
        this.excelStream = export.doExcelNoRight(this.excelError);
      }
      this.excelFile = export.getFileStream();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return export.getResult();
  }
  
  protected String genDetailTitle()
  {
    String infoType = getRequestString("infoType");
    if (infoType.equals("0")) {
      return getText("monitor.storageAlarm");
    }
    if (infoType.equals("1")) {
      return getText("monitor.offlineAlarm");
    }
    return getText("monitor.damageAlarm");
  }
  
  protected void exportStorageTable(String vehiIdno, Integer toMap, ExportReport export)
  {
    List<VehicleLiteMore> lstVehicle = getVehicleLiteMore(vehiIdno, toMap);
    ActionContext ctx = ActionContext.getContext();
    String alarmShield = ctx.getSession().get("alarmShield").toString();
    if ((lstVehicle != null) && (lstVehicle.size() > 0))
    {
      VehicleLiteMore vehicle = null;
      for (int i = 1; i <= lstVehicle.size(); i++)
      {
        vehicle = (VehicleLiteMore)lstVehicle.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getIdno());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getName());
        
        DeviceLiteMore device = vehicle.getVideoDevice();
        if (device != null)
        {
          device.setAlarmShield(alarmShield);
          Map<String, String> diskInfo = device.getDiskStatus();
          export.setCellValue(Integer.valueOf(j++), diskInfo.get("alarm"));
          diskInfo = null;
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        device = null;
        vehicle = null;
      }
    }
    lstVehicle = null;
  }
  
  protected void exportOfflineTable(String vehiIdno, Integer toMap, ExportReport export)
  {
    List<VehicleLiteMore> lstVehicle = getVehicleLiteMore(vehiIdno, toMap);
    if ((lstVehicle != null) && (lstVehicle.size() > 0))
    {
      VehicleLiteMore vehicle = null;
      for (int i = 1; i <= lstVehicle.size(); i++)
      {
        vehicle = (VehicleLiteMore)lstVehicle.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getIdno());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getName());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getGpsTimeString());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getLngLatStr());
        vehicle = null;
      }
    }
    lstVehicle = null;
  }
  
  protected void exportDamageTable(String vehiIdno, Integer toMap, ExportReport export)
  {
    List<VehicleLiteMore> lstVehicle = getVehicleLiteMore(vehiIdno, toMap);
    if ((lstVehicle != null) && (lstVehicle.size() > 0))
    {
      String damageTime = getRequestString("damageTime");
      VehicleLiteMore vehicle = null;
      for (int i = 1; i <= lstVehicle.size(); i++)
      {
        vehicle = (VehicleLiteMore)lstVehicle.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getIdno());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getName());
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getGpsTimeString());
        
        String offlineLong = "";
        if (damageTime != null)
        {
          long offlineTime = vehicle.getOfflineLong();
          if (offlineTime >= 3600000 * Integer.parseInt(damageTime)) {
            offlineLong = getTimeDifference(offlineTime);
          }
        }
        export.setCellValue(Integer.valueOf(j++), offlineLong);
        offlineLong = null;
        
        export.setCellValue(Integer.valueOf(j++), vehicle.getLngLatStr());
        vehicle = null;
      }
    }
    lstVehicle = null;
  }
  
  protected List<VehicleLiteMore> getVehicleLiteMore(String vehiIdno, Integer toMap)
  {
    String[] vehiIdnos = vehiIdno.split(",");
    List<String> lstVehiIdno = new ArrayList();
    for (int i = 0; i < vehiIdnos.length; i++) {
      lstVehiIdno.add(vehiIdnos[i]);
    }
    vehiIdno = null;
    Map<String, DeviceStatus> mapStatus = new HashMap();
    
    AjaxDto<DeviceStatus> ajaxDto = this.standardUserService.getDeviceOnlineList(null, null, true, null, null);
    if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
    {
      DeviceStatus status = null;
      int i = 0;
      for (int j = ajaxDto.getPageList().size(); i < j; i++)
      {
        status = (DeviceStatus)ajaxDto.getPageList().get(i);
        if (status.getGpsTime() != null) {
          status.setGpsTimeStr(DateUtil.dateSwitchString(status.getGpsTime()));
        }
        GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap.toString());
        status.setMapJingDu(gpsValue.getMapJingDu());
        status.setMapWeiDu(gpsValue.getMapWeiDu());
        if (status.getJingDu() == null) {
          status.setJingDu(Integer.valueOf(0));
        }
        if (status.getWeiDu() == null) {
          status.setWeiDu(Integer.valueOf(0));
        }
        mapStatus.put(status.getDevIdno(), status);
        status = null;
        gpsValue = null;
      }
      ajaxDto = null;
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devComId", StandardBasicTypes.INTEGER));
    List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, scalars, ", b.CompanyID as devComId ", ",jt808_device_info b where a.DevIDNO = b.DevIDNO ");
    lstVehiIdno = null;
    Map<String, List<DeviceLiteMore>> mapDevice = new HashMap();
    int i = 0;
    for (int j = relations.size(); i < j; i++)
    {
      StandardVehiDevRelationExMore relation = (StandardVehiDevRelationExMore)relations.get(i);
      DeviceLiteMore deviceLite = new DeviceLiteMore();
      deviceLite.setIdno(relation.getDevIdno());
      deviceLite.setParentId(relation.getDevComId());
      
      deviceLite.setModule(relation.getModule());
      
      deviceLite.setStatus((DeviceStatus)mapStatus.get(relation.getDevIdno()));
      if (mapDevice.get(relation.getVehiIdno()) == null)
      {
        List<DeviceLiteMore> devices = new ArrayList();
        devices.add(deviceLite);
        mapDevice.put(relation.getVehiIdno(), devices);
      }
      else
      {
        List<DeviceLiteMore> devices = (List)mapDevice.get(relation.getVehiIdno());
        devices.add(deviceLite);
        mapDevice.put(relation.getVehiIdno(), devices);
      }
      deviceLite = null;
      relation = null;
    }
    relations = null;
    List<VehicleLiteEx> vehicles = this.standardUserService.getVehicleList(vehiIdnos);
    vehiIdnos = null;
    
    List<VehicleLiteMore> lstLite = new ArrayList();
    VehicleLiteMore lite = null;
    VehicleLiteEx vehicle = null;
     i = 0;
    for (int j = vehicles.size(); i < j; i++)
    {
      lite = new VehicleLiteMore();
      vehicle = (VehicleLiteEx)vehicles.get(i);
      lite.setIdno(vehicle.getNm());
      lite.setParentId(vehicle.getPid());
      lite.setName(vehicle.getPnm());
      lite.setIcon(vehicle.getIc());
      List<DeviceLiteMore> devices = (List)mapDevice.get(vehicle.getNm());
      lite.setDevListMore(devices);
      if ((devices != null) && (devices.size() > 0))
      {
        lite.setDriverName(vehicle.getDn());
        lite.setDriverTele(vehicle.getDt());
        lstLite.add(lite);
      }
      vehicle = null;
      lite = null;
      devices = null;
    }
    vehicles = null;
    mapDevice = null;
    return lstLite;
  }
  
  public String queryAlarmDetail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), StandardDeviceQuery.class);
        
        List<Integer> lstArmType = new ArrayList();
        if ((query.getTypeIdno() != null) && (!query.getTypeIdno().isEmpty()))
        {
          String[] armTypes = query.getTypeIdno().split(",");
          for (int i = 0; i < armTypes.length; i++) {
            lstArmType.add(Integer.valueOf(Integer.parseInt(armTypes[i])));
          }
        }
        String condition = "";
        if ((query.getCondiIdno() != null) && (!query.getCondiIdno().isEmpty()) && (!"2".equals(query.getCondiIdno()))) {
          condition = " and HandleStatus = " + query.getCondiIdno();
        }
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, null, condition + " order by ArmTimeStart desc", getPaginationEx(), null, null, null, null);
        
        List<StandardDeviceAlarmEx> lstDeviceAlarm = new ArrayList();
        List<StandardDeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null)
        {
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
        addCustomResponse("infos", lstDeviceAlarm);
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveAlarmHandle()
  {
    try
    {
      StandardDeviceQuery alarm = new StandardDeviceQuery();
      try
      {
        alarm = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), alarm.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((alarm.getVehiIdnos() != null) && (!alarm.getVehiIdnos().isEmpty()))
      {
        ActionContext ctx = ActionContext.getContext();
        String handleUser = (String)ctx.getSession().get("userid");
        String handleTime = DateUtil.dateSwitchString(new Date());
        alarm.setCondiIdno(alarm.getCondiIdno().replaceAll("\\|", ""));
        String handleContent = handleUser + "|" + handleTime + "|" + alarm.getCondiIdno();
        String[] guids = alarm.getVehiIdnos().split(",");
        
        List<String> allGuids = new ArrayList();
        for (int i = 0; i < guids.length; i++) {
          allGuids.add(guids[i]);
        }
        this.vehicleAlarmService.updateStandardDeviceAlarm(allGuids, Integer.valueOf(1), handleContent);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
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
