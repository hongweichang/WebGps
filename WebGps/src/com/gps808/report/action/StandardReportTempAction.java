package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardDeviceTempSummary;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.report.vo.StandardVehicleAlarmInfo;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class StandardReportTempAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String markerLists()
    throws Exception
  {
    try
    {
      addCustomResponse("markers", this.vehicleAlarmService.getMapMarkerList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardDeviceTempSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    List<Integer> lstArmType = getAlarmQueryType();
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.vehicleAlarmService.summaryDeviceAlarm(begintime, endtime, 
      vehicles, lstArmType, null, "group by VehiIDNO, ArmType, ArmInfo, Param1", null, null, null, null, 
      "ArmTimeStartI", "ASC");
    Map<String, StandardDeviceTempSummary> summarysMap = new LinkedHashMap();
    List<StandardDeviceTempSummary> alarmSummarys = new ArrayList();
    if (lstAlarmSummary != null) {
      for (int i = 0; i < lstAlarmSummary.size(); i++)
      {
        StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)lstAlarmSummary.get(i);
        doReportSumEx(summarysMap, summary);
      }
    }
    for (Iterator<Map.Entry<String, StandardDeviceTempSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardDeviceTempSummary> entry = (Map.Entry)it.next();
      StandardDeviceTempSummary summary = (StandardDeviceTempSummary)entry.getValue();
      if (summary.getCount() == null)
      {
        summary.setCount(Integer.valueOf(0));
        summary.setParam1Sum(Integer.valueOf(0));
      }
      if (summary.getCount1() == null)
      {
        summary.setCount1(Integer.valueOf(0));
        summary.setParam2Sum(Integer.valueOf(0));
      }
      summary.setCountStr(getTimeDifferenceEx(summary.getParam1Sum().intValue()));
      summary.setArmTypeStr(getTimeDifferenceEx(summary.getParam2Sum().intValue()));
      if ((summary.getCountStr() == null) || (summary.getCountStr().isEmpty())) {
        summary.setCountStr("0" + getText("report.second"));
      }
      if ((summary.getArmTypeStr() == null) || (summary.getArmTypeStr().isEmpty())) {
        summary.setArmTypeStr("0" + getText("report.second"));
      }
      alarmSummarys.add(summary);
    }
    int start = 0;int index = alarmSummarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(alarmSummarys.size());
      if (alarmSummarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardDeviceTempSummary> alarmSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      alarmSummarys2.add((StandardDeviceTempSummary)alarmSummarys.get(i));
    }
    AjaxDto<StandardDeviceTempSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(alarmSummarys2);
    return dtoSummary;
  }
  
  private void doReportSumEx(Map<String, StandardDeviceTempSummary> summarysMap, StandardDeviceAlarmSummary summary)
  {
    String key = summary.getVehiIdno() + summary.getArmInfo();
    StandardDeviceTempSummary reportSummary = (StandardDeviceTempSummary)summarysMap.get(key);
    if (reportSummary == null)
    {
      String tempAttr = "";
      StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, summary.getVehiIdno());
      if (vehicle != null) {
        tempAttr = vehicle.getTempName();
      }
      reportSummary = new StandardDeviceTempSummary();
      reportSummary.setVehiIdno(summary.getVehiIdno());
      reportSummary.setArmInfo(summary.getArmInfo());
      reportSummary.setPlateType(summary.getPlateType());
      if ((tempAttr != null) && (!tempAttr.isEmpty()))
      {
        String[] temps = tempAttr.split(",");
        if (temps.length > summary.getArmInfo().intValue() + 1) {
          reportSummary.setVehiColor(temps[summary.getArmInfo().intValue()]);
        } else {
          reportSummary.setVehiColor("TEMP_" + (summary.getArmInfo().intValue() + 1));
        }
      }
      else
      {
        reportSummary.setVehiColor("TEMP_" + (summary.getArmInfo().intValue() + 1));
      }
    }
    if ((reportSummary.getBeginTime() == null) || (DateUtil.compareDate(reportSummary.getBeginTime(), summary.getBeginTime()))) {
      reportSummary.setBeginTime(summary.getBeginTime());
    }
    if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(summary.getEndTime(), reportSummary.getEndTime()))) {
      reportSummary.setEndTime(summary.getEndTime());
    }
    if (summary.getParam1().intValue() == 0)
    {
      reportSummary.setCount(summary.getCount());
      reportSummary.setParam1Sum(summary.getParam1Sum());
    }
    else
    {
      reportSummary.setCount1(summary.getCount());
      reportSummary.setParam2Sum(summary.getParam1Sum());
    }
    summarysMap.put(key, reportSummary);
  }
  
  public String summary()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      boolean flag = true;
      if ((begintime == null) || (endtime == null) || (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime))) {
        flag = false;
      }
      if (!flag)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<StandardDeviceTempSummary> alarmSummarys = new AjaxDto();
        alarmSummarys = doSummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", alarmSummarys.getPageList());
        addCustomResponse("pagination", alarmSummarys.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String handleStatus = getRequestString("handleStatus");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        int mapType;
        try
        {
          mapType = Integer.parseInt(toMap);
        }
        catch (Exception e)
        {
        
          mapType = 2;
        }
        List<Integer> lstArmType = getAlarmQueryType();
        List<Integer> lstArmInfo = getAlarmInfo();
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String condition = "";
        if ((lstArmInfo != null) && (lstArmInfo.size() > 0)) {
          condition = " and Param1 = " + lstArmInfo.get(0);
        }
        if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
          condition = " and HandleStatus = " + handleStatus;
        }
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, null, condition + " order by ArmTimeStart asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
        List<StandardDeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if ((deviceAlarms != null) && (deviceAlarms.size() > 0))
        {
          Map<Integer, String> mapUser = new HashMap();
          StandardDeviceAlarm deviceAlarm = null;
          String[] statusStart = null;
          String[] statusEnd = null;
          String[] handleInfo = null;
          StandardVehicleAlarmInfo vehicleAlarmInfo = new StandardVehicleAlarmInfo();
          vehicleAlarmInfo.setStandardUserService(this.standardUserService);
          vehicleAlarmInfo.setVehicleRuleService(this.vehicleRuleService);
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            deviceAlarm = (StandardDeviceAlarm)deviceAlarms.get(i);
            statusStart = handleFieldData(deviceAlarm.getStatusStart());
            statusEnd = handleFieldData(deviceAlarm.getStatusEnd());
            handleInfo = handleFieldData(deviceAlarm.getHandleInfo());
            if ((statusStart != null) && (statusStart.length > 0)) {
              deviceAlarm.setStartStatus1(Integer.valueOf(Integer.parseInt(statusStart[0])));
            }
            if ((statusEnd != null) && (statusEnd.length > 0)) {
              deviceAlarm.setEndStatus1(Integer.valueOf(Integer.parseInt(statusEnd[0])));
            }
            if ((statusStart != null) && (statusStart.length > 1)) {
              deviceAlarm.setStartStatus2(Integer.valueOf(Integer.parseInt(statusStart[1])));
            }
            if ((statusEnd != null) && (statusEnd.length > 1)) {
              deviceAlarm.setEndStatus2(Integer.valueOf(Integer.parseInt(statusEnd[1])));
            }
            if ((statusStart != null) && (statusStart.length > 9)) {
              deviceAlarm.setStartLiCheng(Integer.valueOf(Integer.parseInt(statusStart[9])));
            }
            if ((statusEnd != null) && (statusEnd.length > 9)) {
              deviceAlarm.setEndLiCheng(Integer.valueOf(Integer.parseInt(statusEnd[9])));
            }
            if ((deviceAlarm.getArmTimeStart() != null) && (deviceAlarm.getArmTimeEnd() != null)) {
              deviceAlarm.setTimeLength(getTimeDifference(deviceAlarm.getArmTimeEnd().getTime() - deviceAlarm.getArmTimeStart().getTime()));
            } else {
              deviceAlarm.setTimeLength("0" + getText("report.second"));
            }
            deviceAlarm.setStartPosition(handlePosition(statusStart, Integer.valueOf(mapType), true));
            deviceAlarm.setEndPosition(handlePosition(statusEnd, Integer.valueOf(mapType), true));
            if ((statusStart != null) && (statusStart.length > 6))
            {
              deviceAlarm.setStartJingDu(Integer.valueOf(Integer.parseInt(statusStart[5])));
              deviceAlarm.setStartWeiDu(Integer.valueOf(Integer.parseInt(statusStart[6])));
            }
            if ((statusEnd != null) && (statusEnd.length > 6))
            {
              deviceAlarm.setEndJingDu(Integer.valueOf(Integer.parseInt(statusEnd[5])));
              deviceAlarm.setEndWeiDu(Integer.valueOf(Integer.parseInt(statusEnd[6])));
            }
            if (deviceAlarm.getParam1().intValue() == 0) {
              deviceAlarm.setArmTypeStr(getText("report.high.temperature.alarm"));
            } else {
              deviceAlarm.setArmTypeStr(getText("report.low.temperature.alarm"));
            }
            if (handleInfo != null)
            {
              if (handleInfo.length > 0) {
                try
                {
                  deviceAlarm.setHandleuser(getUserName(mapUser, Integer.valueOf(Integer.parseInt(handleInfo[0]))));
                }
                catch (Exception e)
                {
                  deviceAlarm.setHandleuser(handleInfo[0]);
                }
              }
              if (handleInfo.length > 1) {
                deviceAlarm.setHandleTime(handleInfo[1]);
              }
              if (handleInfo.length > 2) {
                deviceAlarm.setHandleContent(handleInfo[2]);
              }
            }
            String tempAttr = "";
            StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, deviceAlarm.getVehiIdno());
            if (vehicle != null) {
              tempAttr = vehicle.getTempName();
            }
            if ((tempAttr != null) && (!tempAttr.isEmpty()))
            {
              String[] temps = tempAttr.split(",");
              if (temps.length > deviceAlarm.getArmInfo().intValue() + 1) {
                deviceAlarm.setAlarmSource(temps[deviceAlarm.getArmInfo().intValue()]);
              } else {
                deviceAlarm.setAlarmSource("TEMP_" + (deviceAlarm.getArmInfo().intValue() + 1));
              }
            }
            else
            {
              deviceAlarm.setAlarmSource("TEMP_" + (deviceAlarm.getArmInfo().intValue() + 1));
            }
            vehicleAlarmInfo.setAlarm(deviceAlarm);
            deviceAlarm.setArmInfoDesc(getText("report.current.temp") + ":" + Math.round(deviceAlarm.getParam2().intValue() / 100) / 100.0D);
          }
        }
        addCustomResponse("infos", deviceAlarms);
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
  
  protected String handlePosition(String[] statusInfo, Integer toMap, boolean nullToLatLng)
  {
    String position = "";
    if ((statusInfo != null) && (statusInfo.length > 0) && 
      (isGpsValid(Integer.valueOf(Integer.parseInt(statusInfo[0])))) && 
      (statusInfo.length > 6))
    {
      position = getMapPositionEx(Integer.valueOf(Integer.parseInt(statusInfo[5])), Integer.valueOf(Integer.parseInt(statusInfo[6])), toMap.intValue(), getSession().get("WW_TRANS_I18N_LOCALE"));
      if ((nullToLatLng) && (position.isEmpty()) && 
        (!statusInfo[6].equals("0")) && (!statusInfo[5].equals("0"))) {
        position = formatPosition(Integer.valueOf(Integer.parseInt(statusInfo[6]))) + "," + formatPosition(Integer.valueOf(Integer.parseInt(statusInfo[5])));
      }
    }
    return position;
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.probe.no");
    heads[4] = getText("report.ultrahigh.temperature");
    heads[5] = getText("report.UHT.long.time");
    heads[6] = getText("report.ultralow.temperature");
    heads[7] = getText("report.Ultralow.temperature");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardDeviceTempSummary> alarmSummarys = new AjaxDto();
    alarmSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    for (int i = 1; i <= alarmSummarys.getPageList().size(); i++)
    {
      StandardDeviceTempSummary summary = (StandardDeviceTempSummary)alarmSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno().split(",")[0]);
      
      String plateColor = getText("other");
      switch (summary.getPlateType().intValue())
      {
      case 1: 
        plateColor = getText("blue.label");
        break;
      case 2: 
        plateColor = getText("yellow.label");
        break;
      case 3: 
        plateColor = getText("black.label");
        break;
      case 4: 
        plateColor = getText("white.label");
        break;
      case 0: 
        plateColor = getText("other");
        break;
      }
      export.setCellValue(Integer.valueOf(j++), plateColor);
      
      export.setCellValue(Integer.valueOf(j++), summary.getVehiColor());
      
      export.setCellValue(Integer.valueOf(j++), summary.getCount());
      
      export.setCellValue(Integer.valueOf(j++), summary.getCountStr());
      
      export.setCellValue(Integer.valueOf(j++), summary.getCount1());
      
      export.setCellValue(Integer.valueOf(j++), summary.getArmTypeStr());
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.temp.summary");
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(9));
    return lstArmType;
  }
  
  protected List<Integer> getAlarmInfo()
  {
    List<Integer> lstArmInfo = new ArrayList();
    String type = getRequestString("type");
    if ((type != null) && (!type.isEmpty()) && (!type.equals("2"))) {
      if (type.equals("0")) {
        lstArmInfo.add(Integer.valueOf(0));
      } else {
        lstArmInfo.add(Integer.valueOf(1));
      }
    }
    return lstArmInfo;
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[15];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.alarmType");
    heads[4] = getText("report.probe.no");
    heads[5] = getText("report.begintime");
    heads[6] = getText("report.endtime");
    heads[7] = getText("report.alarmLength");
    heads[8] = getText("report.normal.begin.position");
    heads[9] = getText("report.normal.end.position");
    heads[10] = getText("report.alarm.armInfo");
    heads[11] = getText("report.handleStatus");
    heads[12] = getText("report.handleuser");
    heads[13] = getText("report.handleContent");
    heads[14] = getText("report.handleTime");
    return heads;
  }
  
  protected void genAlarmExcelData(List<StandardDeviceAlarm> lstAlarm, ExportReport export, boolean isfence, List<MapMarker> markers)
  {
    if (lstAlarm != null) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        StandardDeviceAlarm alarm = (StandardDeviceAlarm)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getVehiIdno());
        
        String plateColor = getText("other");
        switch (alarm.getPlateType().intValue())
        {
        case 1: 
          plateColor = getText("blue.label");
          break;
        case 2: 
          plateColor = getText("yellow.label");
          break;
        case 3: 
          plateColor = getText("black.label");
          break;
        case 4: 
          plateColor = getText("white.label");
          break;
        case 0: 
          plateColor = getText("other");
          break;
        }
        export.setCellValue(Integer.valueOf(j++), plateColor);
        if (alarm.getParam1().intValue() == 0) {
          alarm.setArmTypeStr(getText("report.high.temperature.alarm"));
        } else {
          alarm.setArmTypeStr(getText("report.low.temperature.alarm"));
        }
        export.setCellValue(Integer.valueOf(j++), alarm.getArmTypeStr());
        String tempAttr = "";
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
        if (vehicle != null) {
          tempAttr = vehicle.getTempName();
        }
        if ((tempAttr != null) && (!tempAttr.isEmpty()))
        {
          String[] temps = tempAttr.split(",");
          if (temps.length > alarm.getArmInfo().intValue() + 1) {
            export.setCellValue(Integer.valueOf(j++), temps[alarm.getArmInfo().intValue()]);
          } else {
            export.setCellValue(Integer.valueOf(j++), "TEMP_" + (alarm.getArmInfo().intValue() + 1));
          }
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), "TEMP_" + (alarm.getArmInfo().intValue() + 1));
        }
        if (alarm.getArmTimeStart() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeStart()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (alarm.getArmTimeEnd() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeEnd()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if ((alarm.getArmTimeStart() != null) && (alarm.getArmTimeEnd() != null)) {
          export.setCellValue(Integer.valueOf(j++), alarm.getTimeLength());
        } else {
          export.setCellValue(Integer.valueOf(j++), "0" + getText("report.second"));
        }
        export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getEndPosition());
        
        export.setCellValue(Integer.valueOf(j++), getText("report.current.temp") + ":" + Math.round(alarm.getParam2().intValue() / 100) / 100.0D);
        if ((alarm.getHandleStatus() != null) && (alarm.getHandleStatus().intValue() == 1)) {
          export.setCellValue(Integer.valueOf(j++), getText("report.handled"));
        } else {
          export.setCellValue(Integer.valueOf(j++), getText("report.unhandle"));
        }
        export.setCellValue(Integer.valueOf(j++), alarm.getHandleuser());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getHandleContent());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getHandleTime());
      }
    }
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String handleStatus = getRequestString("handleStatus");
    String condition = "";
    List<Integer> lstArmInfo = getAlarmInfo();
    if ((lstArmInfo != null) && (lstArmInfo.size() > 0)) {
      condition = " and Param1 = " + lstArmInfo.get(0);
    }
    if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
      condition = " and HandleStatus = " + handleStatus;
    }
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getAlarmQueryType(), null, condition + " order by ArmTimeStart asc", null, queryFilter, qtype, sortname, sortorder);
    List<StandardDeviceAlarm> deviceAlarms = null;
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      deviceAlarms = handleDetailData(ajaxDto.getPageList(), toMap, true);
    }
    boolean isfence = false;
    List<MapMarker> markers = this.vehicleAlarmService.getMapMarkerList();
    genAlarmExcelData(deviceAlarms, export, isfence, markers);
  }
  
  protected String genDetailTitle()
  {
    return getText("report.temp.detailException");
  }
  
  public String trackDetail()
    throws Exception
  {
    String distance = getRequestString("distance");
    if (distance == null)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
    else
    {
      String pagin = getJsonRequestString("pagin");
      Pagination pagination = null;
      if ((pagin != null) && (!"".equals(pagin))) {
        pagination = getPaginationEx();
      }
      queryGpsTrack(distance, null, pagination, Integer.valueOf(2));
    }
    return "success";
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("report.current.temp");
    heads[5] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[6] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export)
  {
    try
    {
      String devIdno = getTempDevIdno(vehiIdno);
      String time = getRequestString("time");
      String temperature = getRequestString("temperature");
      if ((time == null) || (time.isEmpty())) {
        time = "0";
      }
      if ((temperature == null) || (temperature.isEmpty())) {
        temperature = "0";
      }
      StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehiIdno);
      AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), 0, Integer.parseInt(time) * 1000, 0, 0, Integer.parseInt(temperature), vehicle.getTempCount().intValue(), null, null, devIdno);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardDeviceTrack track = (StandardDeviceTrack)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), track.getVehiIdno());
          
          String plateColor = getText("other");
          switch (track.getPlateType().intValue())
          {
          case 1: 
            plateColor = getText("blue.label");
            break;
          case 2: 
            plateColor = getText("yellow.label");
            break;
          case 3: 
            plateColor = getText("black.label");
            break;
          case 4: 
            plateColor = getText("white.label");
            break;
          case 0: 
            plateColor = getText("other");
            break;
          }
          export.setCellValue(Integer.valueOf(j++), plateColor);
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(track.getTrackTime())));
          
          String str = "";
          String names = vehicle.getTempName();
          if (vehicle.getTempCount() != null)
          {
            String[] nameArray = names.split(",");
            if (vehicle.getTempCount().intValue() >= 1) {
              if ((nameArray.length >= 1) && (nameArray[0] != null) && (!nameArray[0].isEmpty())) {
                str = str + nameArray[0] + ":" + getYouLiang(track.getTempSensor1());
              } else {
                str = str + "TEMP_1:" + getYouLiang(track.getTempSensor1());
              }
            }
            if (vehicle.getTempCount().intValue() >= 2)
            {
              str = str + ";";
              if ((nameArray.length >= 2) && (nameArray[1] != null) && (!nameArray[1].isEmpty())) {
                str = str + nameArray[1] + ":" + getYouLiang(track.getTempSensor2());
              } else {
                str = str + "TEMP_2:" + getYouLiang(track.getTempSensor2());
              }
            }
            if (vehicle.getTempCount().intValue() >= 3)
            {
              str = str + ";";
              if ((nameArray.length >= 3) && (nameArray[2] != null) && (!nameArray[2].isEmpty())) {
                str = str + nameArray[2] + ":" + getYouLiang(track.getTempSensor3());
              } else {
                str = str + "TEMP_3:" + getYouLiang(track.getTempSensor3());
              }
            }
            if (vehicle.getTempCount().intValue() >= 4)
            {
              str = str + ";";
              if ((nameArray.length >= 4) && (nameArray[3] != null) && (!nameArray[3].isEmpty())) {
                str = str + nameArray[3] + ":" + getYouLiang(track.getTempSensor4());
              } else {
                str = str + "TEMP_4:" + getYouLiang(track.getTempSensor4());
              }
            }
          }
          export.setCellValue(Integer.valueOf(j++), str);
          
          export.setCellValue(Integer.valueOf(j++), getLiCheng(track.getLiCheng()));
          if (isGpsValid(track.getStatus1())) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(track.getJingDu(), track.getWeiDu(), toMap.intValue(), true));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected String genGpstrackTitle()
  {
    return getText("report.temp.detail");
  }
}
