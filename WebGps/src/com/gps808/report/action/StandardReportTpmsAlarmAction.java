package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import com.gps808.report.vo.StandardTpmsTrack;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardReportTpmsAlarmAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected AjaxDto<StandardReportSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.vehicleAlarmService.summaryDeviceAlarm(begintime, endtime, 
      vehicles, getAlarmQueryType(), null, "group by VehiIDNO, ArmType, ArmInfo, HandleStatus", null, null, null, null, 
      null, null);
    Map<String, StandardDeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary);
    
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    for (int i = 0; i < vehicles.length; i++)
    {
      StandardReportSummary summary = new StandardReportSummary();
      summary.setVehiIdno(vehicles[i]);
      summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(1))), false);
      summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(2))), false);
      summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(3))), false);
      if (summary.getEndTime() == null) {
        summary.setEndTime(DateUtil.StrLongTime2Date(endtime));
      }
      if ((summary.getBeginTime() != null) && (summary.getEndTime() != null) && (summary.getCounts() != null)) {
        alarmSummarys.add(summary);
      }
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
    List<StandardReportSummary> alarmSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      alarmSummarys2.add((StandardReportSummary)alarmSummarys.get(i));
    }
    AjaxDto<StandardReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(alarmSummarys2);
    return dtoSummary;
  }
  
  protected Map<String, StandardDeviceAlarmSummary> listAlarmSummary2mapByDeviceArmTypeKey(List<StandardDeviceAlarmSummary> alarmSummary)
  {
    Map<String, StandardDeviceAlarmSummary> mapSummary = new HashMap();
    if (alarmSummary.size() == 1)
    {
      StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)alarmSummary.get(0);
      if ((summary.getHandleStatus() != null) && (summary.getHandleStatus().intValue() == 1)) {
        summary.setCountStr("1/1");
      } else {
        summary.setCountStr("1/0");
      }
      mapSummary.put(getDeviceArmTypeKey(summary.getVehiIdno(), summary.getArmInfo()), summary);
    }
    else
    {
      for (int i = 0; i < alarmSummary.size(); i++)
      {
        Integer handled = Integer.valueOf(0);
        Integer unhandled = Integer.valueOf(0);
        StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)alarmSummary.get(i);
        Integer count = summary.getCount();
        if ((summary.getHandleStatus() != null) && (summary.getHandleStatus().intValue() == 1)) {
          handled = Integer.valueOf(handled.intValue() + summary.getCount().intValue());
        } else {
          unhandled = Integer.valueOf(unhandled.intValue() + summary.getCount().intValue());
        }
        for (int j = i + 1; j < alarmSummary.size(); j++)
        {
          StandardDeviceAlarmSummary summary2 = (StandardDeviceAlarmSummary)alarmSummary.get(j);
          if ((summary.getVehiIdno().equals(summary2.getVehiIdno())) && (summary.getArmInfo().equals(summary2.getArmInfo())))
          {
            if ((summary2.getHandleStatus() != null) && (summary2.getHandleStatus().intValue() == 1)) {
              handled = Integer.valueOf(handled.intValue() + summary2.getCount().intValue());
            } else {
              unhandled = Integer.valueOf(unhandled.intValue() + summary2.getCount().intValue());
            }
            count = Integer.valueOf(count.intValue() + summary2.getCount().intValue());
            alarmSummary.remove(j);
          }
        }
        summary.setCountStr(handled.intValue() + unhandled.intValue() + "/" + handled);
        summary.setCount(count);
        mapSummary.put(getDeviceArmTypeKey(summary.getVehiIdno(), summary.getArmInfo()), summary);
      }
    }
    return mapSummary;
  }
  
  public String summary()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<StandardReportSummary> alarmSummarys = new AjaxDto();
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
        List<Integer> lstArmInfo = getArmInfo();
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String condition = "";
        if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
          condition = " and HandleStatus = " + handleStatus;
        }
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, lstArmInfo, condition + " order by ArmTimeStart asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), true);
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
  
  public String track()
    throws Exception
  {
    String pagin = getJsonRequestString("pagin");
    Pagination pagination = null;
    if ((pagin != null) && (!"".equals(pagin))) {
      pagination = getPaginationEx();
    }
    queryTpmsGpsTrack(pagination);
    return "success";
  }
  
  protected void queryTpmsGpsTrack(Pagination pagination)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String vehiIdno = getRequest().getParameter("vehiIdno");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (vehiIdno == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        AjaxDto<StandardTpmsTrack> ajaxDto = this.vehicleGpsService.queryTpmsGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), pagination, toMap, null);
        List<StandardTpmsTrack> gpstracks = ajaxDto.getPageList();
        if ((gpstracks != null) && (gpstracks.size() > 0)) {
          for (int i = 0; i < gpstracks.size(); i++)
          {
            StandardTpmsTrack track = (StandardTpmsTrack)gpstracks.get(i);
            List<Integer> battery = track.getTireBatterys();
            List<Integer> press = track.getTirePress();
            List<Integer> temperures = track.getTemperures();
            if ((track != null) && (track.getTireCount().intValue() > 0))
            {
              String leftInfo = "";
              String rightInfo = "";
              for (int j = 0; j < track.getTireCount().intValue() / 2; j++)
              {
                if ((leftInfo != null) && (!leftInfo.isEmpty())) {
                  leftInfo = leftInfo + ";";
                }
                if ((rightInfo != null) && (!rightInfo.isEmpty())) {
                  rightInfo = rightInfo + ";";
                }
                if (j % 2 == 0)
                {
                  if (j != 0) {
                    leftInfo = leftInfo + "<br/>";
                  }
                  rightInfo = rightInfo + "<br/>";
                }
                if ((((Integer)battery.get(j)).intValue() != 0) || (((Integer)press.get(j)).intValue() != 0) || (((Integer)temperures.get(j)).intValue() != 0)) {
                  leftInfo = 
                    leftInfo + getText("report.left") + (j + 1) + ":(" + getText("report.current.voltage") + ":" + ((Integer)battery.get(j)).intValue() / 10.0D + "V;" + getText("report.the.current.tire.pressure") + ":" + ((Integer)press.get(j)).intValue() / 10.0D + "P;" + getText("report.current.temperature") + ":" + ((Integer)temperures.get(j)).intValue() / 10.0D + getText("report.alarm.tempUnit") + ")";
                } else {
                  leftInfo = leftInfo + getText("report.right") + (j + 1) + ":" + getText("invalid");
                }
                if ((((Integer)battery.get(j + 10)).intValue() != 0) || (((Integer)press.get(j + 10)).intValue() != 0) || (((Integer)temperures.get(j + 10)).intValue() != 0)) {
                  rightInfo = 
                    rightInfo + getText("report.right") + (j + 1) + ":(" + getText("report.current.voltage") + ":" + ((Integer)battery.get(j + 10)).intValue() / 10.0D + "V;" + getText("report.the.current.tire.pressure") + ":" + ((Integer)press.get(j + 10)).intValue() / 10.0D + "P;" + getText("report.current.temperature") + ":" + ((Integer)temperures.get(j + 10)).intValue() / 10.0D + getText("report.alarm.tempUnit") + ")";
                } else {
                  rightInfo = rightInfo + getText("report.right") + (j + 1) + ":" + getText("invalid");
                }
              }
              if ((leftInfo != null) && (!leftInfo.isEmpty())) {
                track.setTireInfoDesc(leftInfo);
              }
              if ((rightInfo != null) && (!rightInfo.isEmpty())) {
                if ((track.getTireInfoDesc() != null) && (!track.getTireInfoDesc().isEmpty())) {
                  track.setTireInfoDesc(track.getTireInfoDesc() + ";" + rightInfo);
                } else {
                  track.setTireInfoDesc(rightInfo);
                }
              }
            }
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = (getText("report.voltage.warning.times") + "/" + getText("report.handled"));
    heads[4] = (getText("report.tire.pressure.abnormal.times") + "/" + getText("report.handled"));
    heads[5] = (getText("report.temperature.anomalies.times") + "/" + getText("report.handled"));
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardReportSummary> alarmSummarys = new AjaxDto();
    alarmSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    for (int i = 1; i <= alarmSummarys.getPageList().size(); i++)
    {
      StandardReportSummary summary = (StandardReportSummary)alarmSummarys.getPageList().get(i - 1);
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
      if (summary.getBeginTime() != null)
      {
        List<String> countStrs = summary.getCountStrs();
        
        int q = 3;
        for (int k = 0; k < q; k++) {
          export.setCellValue(Integer.valueOf(j++), countStrs.get(k));
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.tire.pressure.monitoring.summary");
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(168));
    return lstArmType;
  }
  
  protected boolean isBattery()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("battery"));
  }
  
  protected boolean isTirepressure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("tirepressure"));
  }
  
  protected boolean isTemperature()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("temperature"));
  }
  
  protected List<Integer> getArmInfo()
  {
    List<Integer> lstArmInfo = new ArrayList();
    if (isBattery()) {
      lstArmInfo.add(Integer.valueOf(1));
    } else if (isTirepressure()) {
      lstArmInfo.add(Integer.valueOf(2));
    } else if (isTemperature()) {
      lstArmInfo.add(Integer.valueOf(3));
    }
    return lstArmInfo;
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[17];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.alarmType");
    heads[4] = getText("report.alarmSource");
    heads[5] = getText("report.begintime");
    heads[6] = getText("report.endtime");
    heads[7] = getText("report.alarmLength");
    heads[8] = getText("report.alarm.startSpeed");
    heads[9] = getText("report.alarm.endSpeed");
    heads[10] = getText("report.normal.begin.position");
    heads[11] = getText("report.normal.end.position");
    heads[12] = getText("report.alarm.armInfo");
    heads[13] = getText("report.handleStatus");
    heads[14] = getText("report.handleuser");
    heads[15] = getText("report.handleContent");
    heads[16] = getText("report.handleTime");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String handleStatus = getRequestString("handleStatus");
    String condition = "";
    if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
      condition = " and HandleStatus = " + handleStatus;
    }
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getAlarmQueryType(), getArmInfo(), condition + " order by ArmTimeStart asc", null, queryFilter, qtype, sortname, sortorder);
    List<StandardDeviceAlarm> deviceAlarms = null;
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      deviceAlarms = handleDetailData(ajaxDto.getPageList(), toMap, true);
    }
    if (deviceAlarms != null) {
      for (int i = 1; i <= deviceAlarms.size(); i++)
      {
        StandardDeviceAlarm alarm = (StandardDeviceAlarm)deviceAlarms.get(i - 1);
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
        
        export.setCellValue(Integer.valueOf(j++), getArmInfoName(alarm.getArmInfo().intValue()));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getAlarmSource());
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
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getStartSpeed(), alarm.getStartStatus1()));
        
        export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getEndSpeed(), alarm.getEndStatus1()));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getEndPosition());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getArmInfoDesc());
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
  
  protected String genDetailTitle()
  {
    return getText("report.tire.pressure.monitoring.detail");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[5];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("tire.pressure.monitoring.information");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export)
  {
    try
    {
      AjaxDto<StandardTpmsTrack> ajaxDto = this.vehicleGpsService.queryTpmsGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), null, toMap.toString(), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardTpmsTrack track = (StandardTpmsTrack)ajaxDto.getPageList().get(i - 1);
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
          List<Integer> battery = track.getTireBatterys();
          List<Integer> press = track.getTirePress();
          List<Integer> temperures = track.getTemperures();
          String leftInfo = "";
          String rightInfo = "";
          for (int k = 0; k < track.getTireCount().intValue() / 2; k++)
          {
            if ((leftInfo != null) && (!leftInfo.isEmpty())) {
              leftInfo = leftInfo + ";";
            }
            if ((((Integer)battery.get(k)).intValue() != 0) || (((Integer)press.get(k)).intValue() != 0) || (((Integer)temperures.get(k)).intValue() != 0)) {
              leftInfo = 
                leftInfo + getText("report.left") + (k + 1) + ":(" + getText("report.current.voltage") + ":" + ((Integer)battery.get(k)).intValue() / 10.0D + "V;" + getText("report.the.current.tire.pressure") + ":" + ((Integer)press.get(k)).intValue() / 10.0D + "P;" + getText("report.current.temperature") + ":" + ((Integer)temperures.get(k)).intValue() / 10.0D + getText("report.alarm.tempUnit") + ")";
            } else {
              leftInfo = leftInfo + getText("report.right") + (k + 1) + ":" + getText("invalid");
            }
            if ((rightInfo != null) && (!rightInfo.isEmpty())) {
              rightInfo = rightInfo + ";";
            }
            if ((((Integer)battery.get(k + 10)).intValue() != 0) || (((Integer)press.get(k + 10)).intValue() != 0) || (((Integer)temperures.get(k + 10)).intValue() != 0)) {
              rightInfo = 
                rightInfo + getText("report.right") + (k + 1) + ":(" + getText("report.current.voltage") + ":" + ((Integer)battery.get(k + 10)).intValue() / 10.0D + "V;" + getText("report.the.current.tire.pressure") + ":" + ((Integer)press.get(k + 10)).intValue() / 10.0D + "P;" + getText("report.current.temperature") + ":" + ((Integer)temperures.get(k + 10)).intValue() / 10.0D + getText("report.alarm.tempUnit") + ")";
            } else {
              rightInfo = rightInfo + getText("report.right") + (k + 1) + ":" + getText("invalid");
            }
          }
          if ((leftInfo != null) && (!leftInfo.isEmpty())) {
            track.setTireInfoDesc(leftInfo);
          }
          if ((rightInfo != null) && (!rightInfo.isEmpty())) {
            if ((track.getTireInfoDesc() != null) && (!track.getTireInfoDesc().isEmpty())) {
              export.setCellValue(Integer.valueOf(j++), track.getTireInfoDesc() + ";" + rightInfo);
            } else {
              export.setCellValue(Integer.valueOf(j++), rightInfo);
            }
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
    return getText("tire.pressure.monitoring.details");
  }
}
