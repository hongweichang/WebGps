package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import com.gps808.report.vo.StandardStationAlarm;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class StandardReportSlipStationAction
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
      vehicles, null, null, "group by VehiIDNO, ArmType, ArmInfo", null, null, null, null, 
      null, null);
    Map<String, StandardDeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary, false);
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    for (int i = 0; i < vehicles.length; i++)
    {
      StandardReportSummary summary = new StandardReportSummary();
      summary.setVehiIdno(vehicles[i]);
      summarySlipStationReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(118))));
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
  
  public void summarySlipStationReport(StandardReportSummary summary, StandardDeviceAlarmSummary alarmSummary)
  {
    if (alarmSummary != null)
    {
      if ((summary.getBeginTime() == null) || (alarmSummary.getBeginTime().before(summary.getBeginTime()))) {
        summary.setBeginTime(alarmSummary.getBeginTime());
      }
      if ((alarmSummary.getBeginTime() != null) && ((summary.getEndTime() == null) || (alarmSummary.getBeginTime().after(summary.getEndTime())))) {
        summary.setEndTime(alarmSummary.getEndTime());
      }
      summary.setPlateType(alarmSummary.getPlateType());
      summary.setCompanyId(alarmSummary.getArmInfo());
      summary.setVehiColor(alarmSummary.getVehiColor());
      summary.addCount(alarmSummary.getCount());
    }
    else
    {
      summary.addCount(Integer.valueOf(0));
    }
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
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        List<Integer> lstArmType = getAlarmQueryType();
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String condition = "";
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, null, condition + " order by ArmTimeStart asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        List<StandardStationAlarm> deviceAlarms = new ArrayList();
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          for (int i = 0; i < ajaxDto.getPageList().size(); i++)
          {
            StandardDeviceAlarm deviceAlarm = (StandardDeviceAlarm)ajaxDto.getPageList().get(i);
            String[] statusStart = handleFieldData(deviceAlarm.getStatusStart());
            int driverID = 0;
            if ((statusStart != null) && (statusStart.length > 16)) {
              driverID = Integer.parseInt(statusStart[16]);
            }
            int direction = 0;
            if ((statusStart != null) && (statusStart.length > 17)) {
              direction = Integer.parseInt(statusStart[17]);
            }
            int stationIndex = 0;
            if ((statusStart != null) && (statusStart.length > 20)) {
              stationIndex = Integer.parseInt(statusStart[20]);
            }
            StandardStationAlarm alarm = this.vehicleAlarmService.queryStationAlarm(deviceAlarm.getVehiIdno(), deviceAlarm.getArmInfo(), Integer.valueOf(driverID), Integer.valueOf(direction), Integer.valueOf(stationIndex), deviceAlarm.getParam1());
            if (alarm != null)
            {
              alarm.setDirection(Integer.valueOf(direction));
              alarm.setArmTime(deviceAlarm.getArmTimeStart());
              alarm.setLastTime(new Date(deviceAlarm.getParam2().intValue() * 1000L));
              if ((statusStart != null) && (statusStart.length > 9)) {
                alarm.setLiCheng(Integer.valueOf(Integer.parseInt(statusStart[9])));
              }
              if ((statusStart != null) && (statusStart.length > 10)) {
                alarm.setYouLiang(Integer.valueOf(Integer.parseInt(statusStart[10])));
              }
              alarm.setPlateType(deviceAlarm.getPlateType());
              if ((statusStart != null) && (statusStart.length > 4)) {
                alarm.setSpeed(Integer.valueOf(Integer.parseInt(statusStart[4])));
              }
              deviceAlarms.add(alarm);
            }
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
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.line");
    heads[2] = getText("report.vehicle");
    heads[3] = getText("report.plateColor");
    heads[4] = getText("report.begintime");
    heads[5] = getText("report.endtime");
    heads[6] = getText("report.alarm.total");
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
      StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, summary.getCompanyId());
      if ((company != null) && (company.getLevel().intValue() == 3)) {
        export.setCellValue(Integer.valueOf(j++), company.getName());
      } else {
        export.setCellValue(Integer.valueOf(j++), "");
      }
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
      export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
      export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
      export.setCellValue(Integer.valueOf(j++), summary.getCounts().get(0));
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.slipstation.summary");
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(118));
    return lstArmType;
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[13];
    heads[0] = getText("report.index");
    heads[1] = getText("report.line");
    heads[2] = getText("line.direction");
    heads[3] = getText("report.vehicle");
    heads[4] = getText("report.plateColor");
    heads[5] = getText("vehicle.driver");
    heads[6] = getText("line.station");
    heads[7] = getText("report.sliptsation.time");
    heads[8] = getText("report.currentSpeed");
    heads[9] = getText("report.currentLiCheng");
    heads[10] = getText("report.currentYouLiang");
    heads[11] = getText("report.last.station");
    heads[12] = getText("report.last.station.time");
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
      vehiIdnos.split(","), getAlarmQueryType(), null, condition + " order by ArmTimeStart asc", null, queryFilter, qtype, sortname, sortorder);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        StandardDeviceAlarm deviceAlarm = (StandardDeviceAlarm)ajaxDto.getPageList().get(i - 1);
        String[] statusStart = handleFieldData(deviceAlarm.getStatusStart());
        int driverID = 0;
        if ((statusStart != null) && (statusStart.length > 16)) {
          driverID = Integer.parseInt(statusStart[16]);
        }
        int direction = 0;
        if ((statusStart != null) && (statusStart.length > 17)) {
          direction = Integer.parseInt(statusStart[17]);
        }
        int stationIndex = 0;
        if ((statusStart != null) && (statusStart.length > 20)) {
          stationIndex = Integer.parseInt(statusStart[20]);
        }
        StandardStationAlarm alarm = this.vehicleAlarmService.queryStationAlarm(deviceAlarm.getVehiIdno(), deviceAlarm.getArmInfo(), Integer.valueOf(driverID), Integer.valueOf(direction), Integer.valueOf(stationIndex), deviceAlarm.getParam1());
        if (alarm != null)
        {
          alarm.setDirection(Integer.valueOf(direction));
          alarm.setArmTime(deviceAlarm.getArmTimeStart());
          alarm.setLastTime(new Date(deviceAlarm.getParam2().intValue() * 1000L));
          if ((statusStart != null) && (statusStart.length > 9)) {
            alarm.setLiCheng(Integer.valueOf(Integer.parseInt(statusStart[9])));
          }
          if ((statusStart != null) && (statusStart.length > 10)) {
            alarm.setYouLiang(Integer.valueOf(Integer.parseInt(statusStart[10])));
          }
          alarm.setPlateType(deviceAlarm.getPlateType());
          if ((statusStart != null) && (statusStart.length > 4)) {
            alarm.setSpeed(Integer.valueOf(Integer.parseInt(statusStart[4])));
          }
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          if (alarm.getLineName() != null) {
            export.setCellValue(Integer.valueOf(j++), alarm.getLineName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          String directionStr = getText("line.up");
          if (alarm.getDirection().intValue() == 1) {
            directionStr = getText("line.down");
          }
          export.setCellValue(Integer.valueOf(j++), directionStr);
          
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
          if (alarm.getDriverName() != null) {
            export.setCellValue(Integer.valueOf(j++), alarm.getDriverName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getStation() != null) {
            export.setCellValue(Integer.valueOf(j++), alarm.getStation());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getArmTime() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getSpeed() != null) {
            export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getSpeed(), Integer.valueOf(1)));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getLiCheng() != null) {
            export.setCellValue(Integer.valueOf(j++), getLiCheng(alarm.getLiCheng()));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getYouLiang() != null) {
            export.setCellValue(Integer.valueOf(j++), getYouLiang(alarm.getYouLiang()));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getLastStation() != null) {
            export.setCellValue(Integer.valueOf(j++), alarm.getLastStation());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getLastTime() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getLastTime()));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.slipstation.detail");
  }
}
