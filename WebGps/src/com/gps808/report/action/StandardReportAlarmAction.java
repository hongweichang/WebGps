package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import com.gps808.report.vo.StandardSummaryRank;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;
import javax.servlet.http.HttpServletRequest;

public class StandardReportAlarmAction
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
      addCustomResponse("markers", this.vehicleAlarmService.getMarkerList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardReportSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.vehicleAlarmService.summaryDeviceAlarm(begintime, endtime, 
      vehicles, null, null, "group by VehiIDNO, ArmType, HandleStatus", null, null, null, null, 
      null, null);
    boolean isdriving = false;
    if ((isDriving()) || (isAcc())) {
      isdriving = true;
    }
    Map<String, StandardDeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary, isdriving);
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    for (int i = 0; i < vehicles.length; i++)
    {
      StandardReportSummary summary = new StandardReportSummary();
      summary.setVehiIdno(vehicles[i]);
      if (isMalfunction())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(18))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(202))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(203))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(204))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(205))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(206))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(207))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(208))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(209))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(215))), isdriving);
      }
      else if (isVideo())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(4))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(5))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(15))), isdriving);
      }
      else if (isIO())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(19))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(20))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(21))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(22))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(23))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(24))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(25))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(26))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(41))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(42))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(43))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(44))), isdriving);
      }
      else if (isFence())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(12))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(200))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(211))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(212))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(213))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(214))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(300))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(301))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(302))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(303))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(308))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(309))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(310))), isdriving);
      }
      else if (isDriving())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(11))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(304))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(305))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(307))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(306))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(151))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(210))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(311))), isdriving);
      }
      else if (isAcc())
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(16))), isdriving);
      }
      else
      {
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(1))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(2))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(200))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(201))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(202))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(203))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(204))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(205))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(206))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(207))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(208))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(209))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(210))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(14))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(211))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(212))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(213))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(214))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(215))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(216))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(217))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(8))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(218))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(219))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(151))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(11))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(16))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(49))), isdriving);
        
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(300))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(301))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(302))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(303))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(304))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(305))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(306))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(307))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(308))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(309))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(310))), isdriving);
        summaryAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(vehicles[i], Integer.valueOf(311))), isdriving);
      }
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
  
  protected AjaxDto<StandardReportSummary> doComSum(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    String chdIds = "";
    for (int i = 0; i < vehicles.length; i++)
    {
      List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
      if (childIds != null)
      {
        if (!chdIds.equals("")) {
          chdIds = chdIds + ",";
        }
        for (int j = 0; j < childIds.size(); j++) {
          chdIds = chdIds + childIds.get(j) + ",";
        }
        chdIds = chdIds + vehicles[i];
      }
    }
    String[] childComIds = chdIds.split(",");
    Set<String> set = new TreeSet();
    for (int i = 0; i < childComIds.length; i++) {
      set.add(childComIds[i]);
    }
    childComIds = (String[])set.toArray(new String[0]);
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.vehicleAlarmService.summaryComAlarm(begintime, endtime, 
      childComIds, null, null, "group by CompanyID, ArmType, HandleStatus", null, null, null, null, 
      null, null);
    Map<String, String> comAndPar = new HashMap();
    for (int i = 0; i < childComIds.length; i++)
    {
      String parIds = "";
      List<Integer> parentIds = findUserChildIdList(Integer.valueOf(Integer.parseInt(childComIds[i])));
      if (parentIds != null) {
        for (int j = 0; j < parentIds.size(); j++) {
          parIds = parIds + parentIds.get(j) + ",";
        }
      }
      parIds = parIds + childComIds[i];
      comAndPar.put(childComIds[i], parIds);
    }
    Boolean isdriving = Boolean.valueOf(false);
    if ((isDriving()) || (isAcc())) {
      isdriving = Boolean.valueOf(true);
    }
    Map<String, StandardDeviceAlarmSummary> mapAlarmSummary = listAlarmSumMapByComArmTypeKey(lstAlarmSummary, comAndPar, isdriving);
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    for (int i = 0; i < vehicles.length; i++)
    {
      StandardReportSummary summary = new StandardReportSummary();
      summary.setVehiIdno(vehicles[i]);
      summary.setCompanyId(Integer.valueOf(Integer.parseInt(vehicles[i])));
      if (isDriving())
      {
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 11), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 304), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 305), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 307), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 306), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 151), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 210), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 311), isdriving);
      }
      else
      {
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 1), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 2), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 200), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 201), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 202), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 203), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 204), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 205), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 206), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 207), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 208), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 209), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 210), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 14), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 211), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 212), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 213), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 214), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 215), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 216), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 217), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 8), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 218), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 219), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 151), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 11), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 16), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 49), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 300), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 301), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 302), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 303), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 304), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 305), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 306), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 307), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 308), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 309), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 310), isdriving);
        sumComAlarmReport(summary, (StandardDeviceAlarmSummary)mapAlarmSummary.get(vehicles[i] + "-" + 311), isdriving);
      }
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
  
  public void sumComAlarmReport(StandardReportSummary summary, StandardDeviceAlarmSummary alarmSummary, Boolean isdriving)
  {
    if (alarmSummary != null)
    {
      if ((summary.getBeginTime() == null) || (alarmSummary.getBeginTime().before(summary.getBeginTime()))) {
        summary.setBeginTime(alarmSummary.getBeginTime());
      }
      if ((alarmSummary.getEndTime() != null) && ((summary.getEndTime() == null) || (alarmSummary.getEndTime().after(summary.getEndTime())))) {
        summary.setEndTime(alarmSummary.getEndTime());
      }
      summary.setPlateType(alarmSummary.getPlateType());
      summary.setVehiColor(alarmSummary.getVehiColor());
      summary.setParam1Sum(alarmSummary.getParam1Sum());
      if (isdriving.booleanValue())
      {
        String[] countStrs = alarmSummary.getCountStr().split("/");
        summary.addCountStr(countStrs[0] + "/" + getTimeDifferenceEx(Integer.parseInt(countStrs[1])));
      }
      else
      {
        summary.addCountStr(alarmSummary.getCountStr());
      }
      summary.addCount(alarmSummary.getCount());
    }
    else
    {
      if (isdriving.booleanValue()) {
        summary.addCountStr("0/0" + getText("report.second"));
      } else {
        summary.addCountStr("0/0");
      }
      summary.addCount(Integer.valueOf(0));
    }
  }
  
  protected Map<String, StandardDeviceAlarmSummary> listAlarmSumMapByComArmTypeKey(List<StandardDeviceAlarmSummary> alarmSummary, Map<String, String> comAndPar, Boolean isdriving)
  {
    Map<String, StandardDeviceAlarmSummary> mapSummary = new HashMap();
    if (alarmSummary.size() == 1)
    {
      StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)alarmSummary.get(0);
      String parid = (String)comAndPar.get(summary.getCompanyId().toString());
      if ((parid != null) && (!parid.isEmpty()))
      {
        String[] parids = parid.split(",");
        for (int i = 0; i < parids.length; i++)
        {
          String key = parids[i] + "-" + summary.getArmType().toString();
          StandardDeviceAlarmSummary reportSummary = (StandardDeviceAlarmSummary)mapSummary.get(key);
          if (reportSummary == null)
          {
            reportSummary = new StandardDeviceAlarmSummary();
            reportSummary.setCompanyId(Integer.valueOf(Integer.parseInt(parids[i])));
          }
          if ((reportSummary.getBeginTime() == null) || (DateUtil.compareDate(reportSummary.getBeginTime(), summary.getBeginTime()))) {
            reportSummary.setBeginTime(summary.getBeginTime());
          }
          if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(summary.getEndTime(), reportSummary.getEndTime()))) {
            reportSummary.setEndTime(summary.getEndTime());
          }
          if ((summary.getHandleStatus() != null) && (summary.getHandleStatus().intValue() == 1))
          {
            if (isdriving.booleanValue())
            {
              if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
                summary.setCountStr("1/" + summary.getParam1Sum());
              } else {
                summary.setCountStr("1/0");
              }
            }
            else {
              summary.setCountStr("1/1");
            }
          }
          else if (isdriving.booleanValue())
          {
            if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
              summary.setCountStr("1/" + summary.getParam1Sum());
            } else {
              summary.setCountStr("1/0");
            }
          }
          else {
            summary.setCountStr("1/0");
          }
          mapSummary.put(key, summary);
        }
      }
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
        String parid = (String)comAndPar.get(summary.getCompanyId().toString());
        if ((parid != null) && (!parid.isEmpty()))
        {
          String[] parids = parid.split(",");
          for (int j = 0; j < parids.length; j++)
          {
            String key = parids[j] + "-" + summary.getArmType().toString();
            StandardDeviceAlarmSummary reportSummary = (StandardDeviceAlarmSummary)mapSummary.get(key);
            if (reportSummary == null)
            {
              reportSummary = new StandardDeviceAlarmSummary();
              reportSummary.setCompanyId(Integer.valueOf(Integer.parseInt(parids[j])));
              if (isdriving.booleanValue())
              {
                if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
                  reportSummary.setCountStr(handled.intValue() + unhandled.intValue() + "/" + summary.getParam1Sum());
                } else {
                  reportSummary.setCountStr(handled.intValue() + unhandled.intValue() + "/0");
                }
              }
              else {
                reportSummary.setCountStr(handled.intValue() + unhandled.intValue() + "/" + handled);
              }
              reportSummary.setCount(count);
            }
            else
            {
              String[] conutStr = reportSummary.getCountStr().split("/");
              if (isdriving.booleanValue())
              {
                if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
                  reportSummary.setCountStr(Integer.parseInt(conutStr[0]) + handled.intValue() + unhandled.intValue() + "/" + (Integer.parseInt(conutStr[1]) + summary.getParam1Sum().intValue()));
                } else {
                  reportSummary.setCountStr(Integer.parseInt(conutStr[0]) + handled.intValue() + unhandled.intValue() + "/" + (Integer.parseInt(conutStr[1]) + 0));
                }
              }
              else {
                reportSummary.setCountStr(Integer.parseInt(conutStr[0]) + handled.intValue() + unhandled.intValue() + "/" + (Integer.parseInt(conutStr[1]) + handled.intValue()));
              }
              reportSummary.setCount(Integer.valueOf(reportSummary.getCount().intValue() + count.intValue()));
            }
            if ((reportSummary.getBeginTime() == null) || (DateUtil.compareDate(reportSummary.getBeginTime(), summary.getBeginTime()))) {
              reportSummary.setBeginTime(summary.getBeginTime());
            }
            if ((summary.getEndTime() != null) && ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(summary.getEndTime(), reportSummary.getEndTime())))) {
              reportSummary.setEndTime(summary.getEndTime());
            }
            mapSummary.put(key, reportSummary);
          }
        }
      }
    }
    return mapSummary;
  }
  
  protected AjaxDto<StandardReportSummary> doDailySummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, null, null, " GPSDate, STime ", " asc", vehicles, null, null);
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    List<StandardDeviceDaily> deviceDailies = ajaxDto.getPageList();
    if (deviceDailies != null) {
      for (int i = 0; i < deviceDailies.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)deviceDailies.get(i);
        if (deviceDaily.getAlarmSum() != null)
        {
          StandardReportSummary reportSummary = new StandardReportSummary();
          reportSummary.setVehiIdno(deviceDaily.getVehiIdno() + "," + deviceDaily.getDate());
          reportSummary.setPlateType(deviceDaily.getPlateType());
          reportSummary.setBeginTime(deviceDaily.getStartTime());
          reportSummary.setEndTime(deviceDaily.getEndTime());
          String[] str;
          
          if (isDriving())
          {
            String[] alarms = deviceDaily.getAlarmSum().split(",");
            deviceDaily.setDrivingAlarmSum(alarms[25] + "," + alarms[31] + "," + alarms[32] + "," + alarms[34] + "," + alarms[33] + "," + alarms[24] + "," + alarms[12] + "," + alarms[38]);
            str = deviceDaily.getDrivingAlarmSum().split(",");
          }
          else
          {
            str = deviceDaily.getAlarmSum().split(",");
            String count27 = null;
            if (str.length < 40) {
              str = deviceDaily.getAlarmSum().concat(",0").split(",");
            }
            count27 = str[39];
            for (int j = str.length - 1; j > 26; j--) {
              str[j] = str[(j - 1)];
            }
            str[27] = count27;
          }
          List<String> countStrs = new ArrayList();
          for (int j = 0; j < str.length; j++) {
            countStrs.add(str[j]);
          }
          reportSummary.setCountStrs(countStrs);
          alarmSummarys.add(reportSummary);
        }
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
  
  protected AjaxDto<StandardReportSummary> doDailyComSum(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    String chdIds = "";
    for (int i = 0; i < vehicles.length; i++)
    {
      List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
      if (childIds != null)
      {
        if (!chdIds.equals("")) {
          chdIds = chdIds + ",";
        }
        for (int j = 0; j < childIds.size(); j++) {
          chdIds = chdIds + childIds.get(j) + ",";
        }
        chdIds = chdIds + vehicles[i];
      }
    }
    String[] childComIds = chdIds.split(",");
    Set<String> set = new TreeSet();
    for (int i = 0; i < childComIds.length; i++) {
      set.add(childComIds[i]);
    }
    childComIds = (String[])set.toArray(new String[0]);
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, null, null, " GPSDate, STime ", " asc", null, childComIds, null);
    Map<String, String> comAndPar = new HashMap();
    for (int i = 0; i < childComIds.length; i++)
    {
      String parIds = "";
      List<Integer> parentIds = findUserChildIdList(Integer.valueOf(Integer.parseInt(childComIds[i])));
      if (parentIds != null) {
        for (int j = 0; j < parentIds.size(); j++) {
          parIds = parIds + parentIds.get(j) + ",";
        }
      }
      parIds = parIds + childComIds[i];
      comAndPar.put(childComIds[i], parIds);
    }
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    Map<String, StandardReportSummary> summarysMap = new LinkedHashMap();
    List<StandardDeviceDaily> deviceDailies = ajaxDto.getPageList();
    if (deviceDailies != null) {
      for (int i = 0; i < deviceDailies.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)deviceDailies.get(i);
        if (deviceDaily.getAlarmSum() != null) {
          doReportComSumEx(summarysMap, deviceDaily, comAndPar, Boolean.valueOf(true));
        }
      }
    }
    for (Iterator<Map.Entry<String, StandardReportSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardReportSummary> entry = (Map.Entry)it.next();
      for (int i = 0; i < vehicles.length; i++) {
        if (((StandardReportSummary)entry.getValue()).getCompanyId().toString().equals(vehicles[i]))
        {
          StandardReportSummary summary = (StandardReportSummary)entry.getValue();
          List<String> countStrs = new ArrayList();
          for (int j = 0; j < summary.getCounts().size(); j++) {
            countStrs.add(((Integer)summary.getCounts().get(j)).toString());
          }
          summary.setCountStrs(countStrs);
          alarmSummarys.add(summary);
          break;
        }
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
  
  private void doReportComSumEx(Map<String, StandardReportSummary> summarysMap, StandardDeviceDaily deviceDaily, Map<String, String> comAndPar, Boolean isdaily)
  {
    String parid = (String)comAndPar.get(deviceDaily.getCompanyId().toString());
    if ((parid != null) && (!parid.isEmpty()))
    {
      String[] parids = parid.split(",");
      for (int i = 0; i < parids.length; i++)
      {
        String key = parids[i];
        if (isdaily.booleanValue()) {
          key = key + "," + deviceDaily.getDate();
        } else {
          key = key + "," + DateUtil.dateSwitchMonthDateString(deviceDaily.getDate());
        }
        StandardReportSummary reportSummary = (StandardReportSummary)summarysMap.get(key);
        if (reportSummary == null)
        {
          reportSummary = new StandardReportSummary();
          reportSummary.setVehiIdno(key);
          reportSummary.setCompanyId(Integer.valueOf(Integer.parseInt(parids[i])));
        }
        if ((reportSummary.getBeginTime() == null) || (DateUtil.compareDate(reportSummary.getBeginTime(), deviceDaily.getStartTime()))) {
          reportSummary.setBeginTime(deviceDaily.getStartTime());
        }
        if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(deviceDaily.getEndTime(), reportSummary.getEndTime()))) {
          reportSummary.setEndTime(deviceDaily.getEndTime());
        }
        String[] str;
        
        if (isDriving())
        {
          String[] alarms = deviceDaily.getAlarmSum().split(",");
          deviceDaily.setDrivingAlarmSum(alarms[25] + "," + alarms[31] + "," + alarms[32] + "," + alarms[34] + "," + alarms[33] + "," + alarms[24] + "," + alarms[12] + "," + alarms[38]);
          str = deviceDaily.getDrivingAlarmSum().split(",");
        }
        else
        {
          str = deviceDaily.getAlarmSum().split(",");
          String count27 = null;
          if (str.length < 40) {
            str = deviceDaily.getAlarmSum().concat(",0").split(",");
          }
          count27 = str[39];
          for (int j = str.length - 1; j > 26; j--) {
            str[j] = str[(j - 1)];
          }
          str[27] = count27;
        }
        List<Integer> summaryCounts = reportSummary.getCounts();
        if (summaryCounts == null)
        {
          summaryCounts = new ArrayList();
          for (int j = 0; j < str.length; j++) {
            summaryCounts.add(Integer.valueOf(Integer.parseInt(str[j])));
          }
        }
        else
        {
          for (int j = 0; j < str.length; j++) {
            summaryCounts.set(j, Integer.valueOf(((Integer)summaryCounts.get(j)).intValue() + Integer.parseInt(str[j])));
          }
        }
        reportSummary.setCounts(summaryCounts);
        
        summarysMap.put(key, reportSummary);
      }
    }
  }
  
  protected AjaxDto<StandardReportSummary> doMonthlySummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, null, null, " GPSDate, STime ", " asc", vehicles, null, null);
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    Map<String, StandardReportSummary> summarysMap = new LinkedHashMap();
    List<StandardDeviceDaily> deviceDailies = ajaxDto.getPageList();
    if ((deviceDailies != null) && (deviceDailies.size() > 0)) {
      for (int i = 0; i < deviceDailies.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)deviceDailies.get(i);
        if (deviceDaily.getAlarmSum() != null) {
          doStandardReportSummaryEx(summarysMap, deviceDaily);
        }
      }
    }
    for (Iterator<Map.Entry<String, StandardReportSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardReportSummary> entry = (Map.Entry)it.next();
      StandardReportSummary summary = (StandardReportSummary)entry.getValue();
      List<String> countStrs = new ArrayList();
      for (int j = 0; j < summary.getCounts().size(); j++) {
        countStrs.add(((Integer)summary.getCounts().get(j)).toString());
      }
      summary.setCountStrs(countStrs);
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
    List<StandardReportSummary> alarmSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      alarmSummarys2.add((StandardReportSummary)alarmSummarys.get(i));
    }
    AjaxDto<StandardReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(alarmSummarys2);
    return dtoSummary;
  }
  
  private void doStandardReportSummaryEx(Map<String, StandardReportSummary> summarysMap, StandardDeviceDaily deviceDaily)
  {
    String key = deviceDaily.getVehiIdno() + "," + DateUtil.dateSwitchMonthDateString(deviceDaily.getDate());
    StandardReportSummary reportSummary = (StandardReportSummary)summarysMap.get(key);
    if (reportSummary == null)
    {
      reportSummary = new StandardReportSummary();
      reportSummary.setVehiIdno(key);
      reportSummary.setPlateType(deviceDaily.getPlateType());
    }
    if ((reportSummary.getBeginTime() == null) || (DateUtil.compareDate(reportSummary.getBeginTime(), deviceDaily.getStartTime()))) {
      reportSummary.setBeginTime(deviceDaily.getStartTime());
    }
    if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(deviceDaily.getEndTime(), reportSummary.getEndTime()))) {
      reportSummary.setEndTime(deviceDaily.getEndTime());
    }
    String[] str;
    
    if (isDriving())
    {
      String[] alarms = deviceDaily.getAlarmSum().split(",");
      deviceDaily.setDrivingAlarmSum(alarms[25] + "," + alarms[31] + "," + alarms[32] + "," + alarms[34] + "," + alarms[33] + "," + alarms[24] + "," + alarms[12] + "," + alarms[38]);
      str = deviceDaily.getDrivingAlarmSum().split(",");
    }
    else
    {
      str = deviceDaily.getAlarmSum().split(",");
      String count27 = null;
      if (str.length < 40) {
        str = deviceDaily.getAlarmSum().concat(",0").split(",");
      }
      count27 = str[39];
      for (int j = str.length - 1; j > 26; j--) {
        str[j] = str[(j - 1)];
      }
      str[27] = count27;
    }
    List<Integer> summaryCounts = reportSummary.getCounts();
    if (summaryCounts == null)
    {
      summaryCounts = new ArrayList();
      for (int j = 0; j < str.length; j++) {
        summaryCounts.add(Integer.valueOf(Integer.parseInt(str[j])));
      }
    }
    else
    {
      for (int j = 0; j < str.length; j++) {
        summaryCounts.set(j, Integer.valueOf(((Integer)summaryCounts.get(j)).intValue() + Integer.parseInt(str[j])));
      }
    }
    reportSummary.setCounts(summaryCounts);
    
    summarysMap.put(key, reportSummary);
  }
  
  protected AjaxDto<StandardReportSummary> doMonthlyComSum(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    String chdIds = "";
    for (int i = 0; i < vehicles.length; i++)
    {
      List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
      if (childIds != null)
      {
        if (!chdIds.equals("")) {
          chdIds = chdIds + ",";
        }
        for (int j = 0; j < childIds.size(); j++) {
          chdIds = chdIds + childIds.get(j) + ",";
        }
        chdIds = chdIds + vehicles[i];
      }
    }
    String[] childComIds = chdIds.split(",");
    Set<String> set = new TreeSet();
    for (int i = 0; i < childComIds.length; i++) {
      set.add(childComIds[i]);
    }
    childComIds = (String[])set.toArray(new String[0]);
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, null, null, " GPSDate, STime ", " asc", null, childComIds, null);
    Map<String, String> comAndPar = new HashMap();
    for (int i = 0; i < childComIds.length; i++)
    {
      String parIds = "";
      List<Integer> parentIds = findUserChildIdList(Integer.valueOf(Integer.parseInt(childComIds[i])));
      if (parentIds != null) {
        for (int j = 0; j < parentIds.size(); j++) {
          parIds = parIds + parentIds.get(j) + ",";
        }
      }
      parIds = parIds + childComIds[i];
      comAndPar.put(childComIds[i], parIds);
    }
    List<StandardReportSummary> alarmSummarys = new ArrayList();
    Map<String, StandardReportSummary> summarysMap = new LinkedHashMap();
    List<StandardDeviceDaily> deviceDailies = ajaxDto.getPageList();
    if (deviceDailies != null) {
      for (int i = 0; i < deviceDailies.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)deviceDailies.get(i);
        if (deviceDaily.getAlarmSum() != null) {
          doReportComSumEx(summarysMap, deviceDaily, comAndPar, Boolean.valueOf(false));
        }
      }
    }
    Iterator<Map.Entry<String, StandardReportSummary>> it = summarysMap.entrySet().iterator();
    int i = 0;
    for ( it.hasNext(); i < vehicles.length;)
    {
      Map.Entry<String, StandardReportSummary> entry = (Map.Entry)it.next();
     
      if (((StandardReportSummary)entry.getValue()).getCompanyId().toString().equals(vehicles[i]))
      {
        StandardReportSummary summary = (StandardReportSummary)entry.getValue();
        List<String> countStrs = new ArrayList();
        for (int j = 0; j < summary.getCounts().size(); j++) {
          countStrs.add(((Integer)summary.getCounts().get(j)).toString());
        }
        summary.setCountStrs(countStrs);
        alarmSummarys.add(summary);
      }
      i++;
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
    for ( i = start; i < index; i++) {
      alarmSummarys2.add((StandardReportSummary)alarmSummarys.get(i));
    }
    AjaxDto<StandardReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(alarmSummarys2);
    return dtoSummary;
  }
  
  private boolean isDaily()
  {
    String daily = getRequest().getParameter("status");
    return (daily != null) && (!daily.isEmpty()) && ("daily".equals(daily));
  }
  
  private boolean isMonthly()
  {
    String daily = getRequest().getParameter("status");
    return (daily != null) && (!daily.isEmpty()) && ("monthly".equals(daily));
  }
  
  private boolean isSummary()
  {
    String daily = getRequest().getParameter("status");
    return (daily == null) || (daily.isEmpty()) || ("0".equals(daily));
  }
  
  public String summary()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String handleStatus = getRequestString("handleStatus");
      boolean flag = true;
      if ((isDaily()) && ((begintime == null) || (endtime == null) || 
        (!DateUtil.isDateValid(begintime)) || (!DateUtil.isDateValid(endtime)))) {
        flag = false;
      } else if ((isMonthly()) && ((begintime == null) || (endtime == null) || 
        (!DateUtil.isMonthDateValid(begintime)) || (!DateUtil.isMonthDateValid(endtime)))) {
        flag = false;
      } else if ((isSummary()) && ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))) {
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
        
        AjaxDto<StandardReportSummary> alarmSummarys = new AjaxDto();
        if (isDaily())
        {
          if ((handleStatus != null) && (!handleStatus.isEmpty()) && ("1".equals(handleStatus))) {
            alarmSummarys = doDailyComSum(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          } else {
            alarmSummarys = doDailySummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          }
        }
        else if (isMonthly())
        {
          begintime = begintime + "-01";
          endtime = DateUtil.getMonthMaxDate(endtime);
          if ((handleStatus != null) && (!handleStatus.isEmpty()) && ("1".equals(handleStatus))) {
            alarmSummarys = doMonthlyComSum(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          } else {
            alarmSummarys = doMonthlySummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          }
        }
        else
        {
          List<StandardSummaryRank> summaryRanks = new ArrayList();
          if ((handleStatus != null) && (!handleStatus.isEmpty()) && ("1".equals(handleStatus)))
          {
            alarmSummarys = doComSum(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            if (isDriving()) {
              summaryRanks = this.vehicleAlarmService.getTopCom(begintime, endtime, query.getVehiIdnos().split(","), getAlarmQueryType());
            }
          }
          else
          {
            alarmSummarys = doSummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            if (isDriving()) {
              summaryRanks = this.vehicleAlarmService.getTopVehi(begintime, endtime, query.getVehiIdnos().split(","), getAlarmQueryType());
            }
          }
          if ((summaryRanks != null) && (summaryRanks.size() > 0))
          {
            int j = 1;
            List<StandardSummaryRank> ranks = new ArrayList();
            for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
            {
              StandardSummaryRank summaryRank = (StandardSummaryRank)summaryRanks.get(i);
              if (i != 0)
              {
                if (summaryRank.getCount() == ((StandardSummaryRank)summaryRanks.get(i - 1)).getCount())
                {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                else
                {
                  j++;
                  summaryRank.setRank(Integer.valueOf(j));
                }
              }
              else {
                summaryRank.setRank(Integer.valueOf(j));
              }
              ranks.add(summaryRank);
            }
            addCustomResponse("summaryRanks", ranks);
          }
        }
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
        AjaxDto<StandardDeviceAlarm> ajaxDto = new AjaxDto();
        if ((lstArmType != null) && (lstArmType.size() > 0))
        {
          List<Integer> lstArmInfo = getArmInfo();
          StandardDeviceQuery query = new StandardDeviceQuery();
          query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
          String condition = "";
          if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
            condition = " and HandleStatus = " + handleStatus;
          }
          ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
            query.getVehiIdnos().split(","), lstArmType, lstArmInfo, condition + " order by ArmTimeStart asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        }
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
        {
          deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), true);
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            StandardDeviceAlarm alarm = (StandardDeviceAlarm)deviceAlarms.get(i);
            StandardVehicle vehicle = new StandardVehicle();
            switch (alarm.getArmType().intValue())
            {
            case 19: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 0) {
                  alarm.setArmTypeStr(ioNames[0] + getText("report.alarm"));
                }
              }
              break;
            case 20: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 1) {
                  alarm.setArmTypeStr(ioNames[1] + getText("report.alarm"));
                }
              }
              break;
            case 21: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 2) {
                  alarm.setArmTypeStr(ioNames[2] + getText("report.alarm"));
                }
              }
              break;
            case 22: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 3) {
                  alarm.setArmTypeStr(ioNames[3] + getText("report.alarm"));
                }
              }
              break;
            case 23: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 4) {
                  alarm.setArmTypeStr(ioNames[4] + getText("report.alarm"));
                }
              }
              break;
            case 24: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 5) {
                  alarm.setArmTypeStr(ioNames[5] + getText("report.alarm"));
                }
              }
              break;
            case 25: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 6) {
                  alarm.setArmTypeStr(ioNames[6] + getText("report.alarm"));
                }
              }
              break;
            case 26: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 7) {
                  alarm.setArmTypeStr(ioNames[7] + getText("report.alarm"));
                }
              }
              break;
            case 41: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 8) {
                  alarm.setArmTypeStr(ioNames[8] + getText("report.alarm"));
                }
              }
              break;
            case 42: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 9) {
                  alarm.setArmTypeStr(ioNames[9] + getText("report.alarm"));
                }
              }
              break;
            case 43: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 10) {
                  alarm.setArmTypeStr(ioNames[10] + getText("report.alarm"));
                }
              }
              break;
            case 44: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 11) {
                  alarm.setArmTypeStr(ioNames[11] + getText("report.alarm"));
                }
              }
              break;
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
    if (isMalfunction())
    {
      String[] heads = new String[13];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = (getText("report.singalLoss") + "/" + getText("report.handled"));
      heads[4] = (getText("report.GNSSModuleFailure") + "/" + getText("report.handled"));
      heads[5] = (getText("report.GNSSAntennaMissedOrCut") + "/" + getText("report.handled"));
      heads[6] = (getText("report.GNSSAntennaShort") + "/" + getText("report.handled"));
      heads[7] = (getText("report.mainSupplyUndervoltage") + "/" + getText("report.handled"));
      heads[8] = (getText("report.mainPowerFailure") + "/" + getText("report.handled"));
      heads[9] = (getText("report.LCDorDisplayFailure") + "/" + getText("report.handled"));
      heads[10] = (getText("report.TTSModuleFailure") + "/" + getText("report.handled"));
      heads[11] = (getText("report.cameraMalfunction") + "/" + getText("report.handled"));
      heads[12] = (getText("report.VSSFailure") + "/" + getText("report.handled"));
      return heads;
    }
    if (isVideo())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = (getText("report.alarmvideolost") + "/" + getText("report.handled"));
      heads[4] = (getText("report.alarmvideomask") + "/" + getText("report.handled"));
      heads[5] = (getText("report.alarmvideomotion") + "/" + getText("report.handled"));
      return heads;
    }
    if (isIO())
    {
      String[] heads = new String[15];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = (getText("report.alarm.io1") + "/" + getText("report.handled"));
      heads[4] = (getText("report.alarm.io2") + "/" + getText("report.handled"));
      heads[5] = (getText("report.alarm.io3") + "/" + getText("report.handled"));
      heads[6] = (getText("report.alarm.io4") + "/" + getText("report.handled"));
      heads[7] = (getText("report.alarm.io5") + "/" + getText("report.handled"));
      heads[8] = (getText("report.alarm.io6") + "/" + getText("report.handled"));
      heads[9] = (getText("report.alarm.io7") + "/" + getText("report.handled"));
      heads[10] = (getText("report.alarm.io8") + "/" + getText("report.handled"));
      heads[11] = (getText("report.alarm.io9") + "/" + getText("report.handled"));
      heads[12] = (getText("report.alarm.io10") + "/" + getText("report.handled"));
      heads[13] = (getText("report.alarm.io11") + "/" + getText("report.handled"));
      heads[14] = (getText("report.alarm.io12") + "/" + getText("report.handled"));
      return heads;
    }
    if (isFence())
    {
      String[] heads = new String[16];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = (getText("report.bounds") + "/" + getText("report.handled"));
      heads[4] = (getText("report.regionalSpeedingAlarm") + "/" + getText("report.handled"));
      heads[5] = (getText("report.outOfRegional") + "/" + getText("report.handled"));
      heads[6] = (getText("report.outOfLine") + "/" + getText("report.handled"));
      heads[7] = (getText("report.InadequateOrTooLongRoadTravelTime") + "/" + getText("report.handled"));
      heads[8] = (getText("report.routeDeviation") + "/" + getText("report.handled"));
      heads[9] = (getText("report.platform.regionalSpeedingAlarm") + "/" + getText("report.handled"));
      heads[10] = (getText("report.platform.regionalLowSpeedAlarm") + "/" + getText("report.handled"));
      heads[11] = (getText("report.platform.outOfRegional") + "/" + getText("report.handled"));
      heads[12] = (getText("report.platform.routeDeviation") + "/" + getText("report.handled"));
      heads[13] = (getText("report.platform.areaPoint") + "/" + getText("report.handled"));
      heads[14] = (getText("report.platform.lineOverSpeed") + "/" + getText("report.handled"));
      heads[15] = (getText("report.platform.lineLowSpeed") + "/" + getText("report.handled"));
      return heads;
    }
    if (isDriving())
    {
      if (isCompany())
      {
        if ((isDaily()) || (isMonthly()))
        {
          String[] heads = new String[11];
          heads[0] = getText("report.index");
          heads[1] = getText("report.company");
          heads[2] = getText("report.alarm.date");
          heads[3] = getText("report.speed.over");
          heads[4] = getText("report.platform.timeOverSpeedAlarm");
          heads[5] = getText("report.platform.timeLowSpeedAlarm");
          heads[6] = getText("report.platform.overtimeParking");
          heads[7] = getText("report.platform.fatigueDriving");
          heads[8] = getText("report.nightDriving");
          heads[9] = getText("report.cumulativeDayDrivingTimeout");
          heads[10] = getText("report.platform.roadLvlOverSpeed");
          return heads;
        }
        String[] heads = new String[10];
        heads[0] = getText("report.index");
        heads[1] = getText("report.company");
        heads[2] = getText("report.speed.over");
        heads[3] = (getText("report.platform.timeOverSpeedAlarm") + "/" + getText("report.alarm.total.times"));
        heads[4] = (getText("report.platform.timeLowSpeedAlarm") + "/" + getText("report.alarm.total.times"));
        heads[5] = (getText("report.platform.overtimeParking") + "/" + getText("report.alarm.total.times"));
        heads[6] = (getText("report.platform.fatigueDriving") + "/" + getText("report.alarm.total.times"));
        heads[7] = (getText("report.nightDriving") + "/" + getText("report.alarm.total.times"));
        heads[8] = (getText("report.cumulativeDayDrivingTimeout") + "/" + getText("report.alarm.total.times"));
        heads[9] = (getText("report.platform.roadLvlOverSpeed") + "/" + getText("report.alarm.total.times"));
        return heads;
      }
      if ((isDaily()) || (isMonthly()))
      {
        String[] heads = new String[12];
        heads[0] = getText("report.index");
        heads[1] = getText("report.vehicle");
        heads[2] = getText("report.plateColor");
        heads[3] = getText("report.alarm.date");
        heads[4] = getText("report.speed.over");
        heads[5] = getText("report.platform.timeOverSpeedAlarm");
        heads[6] = getText("report.platform.timeLowSpeedAlarm");
        heads[7] = getText("report.platform.overtimeParking");
        heads[8] = getText("report.platform.fatigueDriving");
        heads[9] = getText("report.nightDriving");
        heads[10] = getText("report.cumulativeDayDrivingTimeout");
        heads[11] = getText("report.platform.roadLvlOverSpeed");
        return heads;
      }
      String[] heads = new String[11];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = (getText("report.speed.over") + "/" + getText("report.alarm.total.times"));
      heads[4] = (getText("report.platform.timeOverSpeedAlarm") + "/" + getText("report.alarm.total.times"));
      heads[5] = (getText("report.platform.timeLowSpeedAlarm") + "/" + getText("report.alarm.total.times"));
      heads[6] = (getText("report.platform.overtimeParking") + "/" + getText("report.alarm.total.times"));
      heads[7] = (getText("report.platform.fatigueDriving") + "/" + getText("report.handled") + "/" + getText("report.alarm.total.times"));
      heads[8] = (getText("report.nightDriving") + "/" + getText("report.alarm.total.times"));
      heads[9] = (getText("report.cumulativeDayDrivingTimeout") + "/" + getText("report.alarm.total.times"));
      heads[10] = (getText("report.platform.roadLvlOverSpeed") + "/" + getText("report.alarm.total.times"));
      return heads;
    }
    if (isAcc())
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.acc.total");
      heads[4] = getText("report.alarm.total.times");
      return heads;
    }
    if (isCompany())
    {
      if ((isDaily()) || (isMonthly()))
      {
        String[] heads = new String[43];
        heads[0] = getText("report.index");
        heads[1] = getText("report.company");
        heads[2] = getText("report.alarm.date");
        heads[3] = getText("report.customAlarm");
        heads[4] = getText("report.emergencyAlarm");
        heads[5] = getText("report.regionalSpeedingAlarm");
        heads[6] = getText("report.earlyWarning");
        heads[7] = getText("report.GNSSModuleFailure");
        heads[8] = getText("report.GNSSAntennaMissedOrCut");
        heads[9] = getText("report.GNSSAntennaShort");
        heads[10] = getText("report.mainSupplyUndervoltage");
        heads[11] = getText("report.mainPowerFailure");
        heads[12] = getText("report.LCDorDisplayFailure");
        heads[13] = getText("report.TTSModuleFailure");
        heads[14] = getText("report.cameraMalfunction");
        heads[15] = getText("report.cumulativeDayDrivingTimeout");
        heads[16] = getText("report.overtimeParking");
        heads[17] = getText("report.outOfRegional");
        heads[18] = getText("report.outOfLine");
        heads[19] = getText("report.InadequateOrTooLongRoadTravelTime");
        heads[20] = getText("report.routeDeviation");
        heads[21] = getText("report.VSSFailure");
        heads[22] = getText("report.abnormalFuel");
        heads[23] = getText("report.antitheftDevice");
        heads[24] = getText("report.illegalIgnition");
        heads[25] = getText("report.illegalDisplacement");
        heads[26] = getText("report.rollover");
        heads[27] = getText("report.nightDriving");
        heads[28] = getText("report.speed.over");
        heads[29] = getText("report.alarm.acc");
        heads[30] = getText("report.alarm.fatigue");
        heads[31] = getText("report.platform.regionalSpeedingAlarm");
        heads[32] = getText("report.platform.regionalLowSpeedAlarm");
        heads[33] = getText("report.platform.outOfRegional");
        heads[34] = getText("report.platform.routeDeviation");
        heads[35] = getText("report.platform.timeOverSpeedAlarm");
        heads[36] = getText("report.platform.timeLowSpeedAlarm");
        heads[37] = getText("report.platform.fatigueDriving");
        heads[38] = getText("report.platform.overtimeParking");
        heads[39] = getText("report.platform.areaPoint");
        heads[40] = getText("report.platform.lineOverSpeed");
        heads[41] = getText("report.platform.lineLowSpeed");
        heads[42] = getText("report.platform.roadLvlOverSpeed");
        return heads;
      }
      String[] heads = new String[42];
      heads[0] = getText("report.index");
      heads[1] = getText("report.company");
      heads[2] = (getText("report.customAlarm") + "/" + getText("report.handled"));
      heads[3] = (getText("report.emergencyAlarm") + "/" + getText("report.handled"));
      heads[4] = (getText("report.regionalSpeedingAlarm") + "/" + getText("report.handled"));
      heads[5] = (getText("report.earlyWarning") + "/" + getText("report.handled"));
      heads[6] = (getText("report.GNSSModuleFailure") + "/" + getText("report.handled"));
      heads[7] = (getText("report.GNSSAntennaMissedOrCut") + "/" + getText("report.handled"));
      heads[8] = (getText("report.GNSSAntennaShort") + "/" + getText("report.handled"));
      heads[9] = (getText("report.mainSupplyUndervoltage") + "/" + getText("report.handled"));
      heads[10] = (getText("report.mainPowerFailure") + "/" + getText("report.handled"));
      heads[11] = (getText("report.LCDorDisplayFailure") + "/" + getText("report.handled"));
      heads[12] = (getText("report.TTSModuleFailure") + "/" + getText("report.handled"));
      heads[13] = (getText("report.cameraMalfunction") + "/" + getText("report.handled"));
      heads[14] = (getText("report.cumulativeDayDrivingTimeout") + "/" + getText("report.handled"));
      heads[15] = (getText("report.overtimeParking") + "/" + getText("report.handled"));
      heads[16] = (getText("report.outOfRegional") + "/" + getText("report.handled"));
      heads[17] = (getText("report.outOfLine") + "/" + getText("report.handled"));
      heads[18] = (getText("report.InadequateOrTooLongRoadTravelTime") + "/" + getText("report.handled"));
      heads[19] = (getText("report.routeDeviation") + "/" + getText("report.handled"));
      heads[20] = (getText("report.VSSFailure") + "/" + getText("report.handled"));
      heads[21] = (getText("report.abnormalFuel") + "/" + getText("report.handled"));
      heads[22] = (getText("report.antitheftDevice") + "/" + getText("report.handled"));
      heads[23] = (getText("report.illegalIgnition") + "/" + getText("report.handled"));
      heads[24] = (getText("report.illegalDisplacement") + "/" + getText("report.handled"));
      heads[25] = (getText("report.rollover") + "/" + getText("report.handled"));
      heads[26] = (getText("report.nightDriving") + "/" + getText("report.handled"));
      heads[27] = (getText("report.speed.over") + "/" + getText("report.handled"));
      heads[28] = (getText("report.alarm.acc") + "/" + getText("report.handled"));
      heads[29] = (getText("report.alarm.fatigue") + "/" + getText("report.handled"));
      heads[30] = (getText("report.platform.regionalSpeedingAlarm") + "/" + getText("report.handled"));
      heads[31] = (getText("report.platform.regionalLowSpeedAlarm") + "/" + getText("report.handled"));
      heads[32] = (getText("report.platform.outOfRegional") + "/" + getText("report.handled"));
      heads[33] = (getText("report.platform.routeDeviation") + "/" + getText("report.handled"));
      heads[34] = (getText("report.platform.timeOverSpeedAlarm") + "/" + getText("report.handled"));
      heads[35] = (getText("report.platform.timeLowSpeedAlarm") + "/" + getText("report.handled"));
      heads[36] = (getText("report.platform.fatigueDriving") + "/" + getText("report.handled"));
      heads[37] = (getText("report.platform.overtimeParking") + "/" + getText("report.handled"));
      heads[38] = (getText("report.platform.areaPoint") + "/" + getText("report.handled"));
      heads[39] = (getText("report.platform.lineOverSpeed") + "/" + getText("report.handled"));
      heads[40] = (getText("report.platform.lineLowSpeed") + "/" + getText("report.handled"));
      heads[41] = (getText("report.platform.roadLvlOverSpeed") + "/" + getText("report.handled"));
      return heads;
    }
    if ((isDaily()) || (isMonthly()))
    {
      String[] heads = new String[44];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.alarm.date");
      heads[4] = getText("report.customAlarm");
      heads[5] = getText("report.emergencyAlarm");
      heads[6] = getText("report.regionalSpeedingAlarm");
      heads[7] = getText("report.earlyWarning");
      heads[8] = getText("report.GNSSModuleFailure");
      heads[9] = getText("report.GNSSAntennaMissedOrCut");
      heads[10] = getText("report.GNSSAntennaShort");
      heads[11] = getText("report.mainSupplyUndervoltage");
      heads[12] = getText("report.mainPowerFailure");
      heads[13] = getText("report.LCDorDisplayFailure");
      heads[14] = getText("report.TTSModuleFailure");
      heads[15] = getText("report.cameraMalfunction");
      heads[16] = getText("report.cumulativeDayDrivingTimeout");
      heads[17] = getText("report.overtimeParking");
      heads[18] = getText("report.outOfRegional");
      heads[19] = getText("report.outOfLine");
      heads[20] = getText("report.InadequateOrTooLongRoadTravelTime");
      heads[21] = getText("report.routeDeviation");
      heads[22] = getText("report.VSSFailure");
      heads[23] = getText("report.abnormalFuel");
      heads[24] = getText("report.antitheftDevice");
      heads[25] = getText("report.illegalIgnition");
      heads[26] = getText("report.illegalDisplacement");
      heads[27] = getText("report.rollover");
      heads[28] = getText("report.nightDriving");
      heads[29] = getText("report.speed.over");
      heads[30] = getText("report.alarm.acc");
      heads[31] = getText("report.alarm.fatigue");
      heads[32] = getText("report.platform.regionalSpeedingAlarm");
      heads[33] = getText("report.platform.regionalLowSpeedAlarm");
      heads[34] = getText("report.platform.outOfRegional");
      heads[35] = getText("report.platform.routeDeviation");
      heads[36] = getText("report.platform.timeOverSpeedAlarm");
      heads[37] = getText("report.platform.timeLowSpeedAlarm");
      heads[38] = getText("report.platform.fatigueDriving");
      heads[39] = getText("report.platform.overtimeParking");
      heads[40] = getText("report.platform.areaPoint");
      heads[41] = getText("report.platform.lineOverSpeed");
      heads[42] = getText("report.platform.lineLowSpeed");
      heads[43] = getText("report.platform.roadLvlOverSpeed");
      return heads;
    }
    String[] heads = new String[43];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    
    heads[3] = (getText("report.customAlarm") + "/" + getText("report.handled"));
    heads[4] = (getText("report.emergencyAlarm") + "/" + getText("report.handled"));
    heads[5] = (getText("report.regionalSpeedingAlarm") + "/" + getText("report.handled"));
    heads[6] = (getText("report.earlyWarning") + "/" + getText("report.handled"));
    heads[7] = (getText("report.GNSSModuleFailure") + "/" + getText("report.handled"));
    heads[8] = (getText("report.GNSSAntennaMissedOrCut") + "/" + getText("report.handled"));
    heads[9] = (getText("report.GNSSAntennaShort") + "/" + getText("report.handled"));
    heads[10] = (getText("report.mainSupplyUndervoltage") + "/" + getText("report.handled"));
    heads[11] = (getText("report.mainPowerFailure") + "/" + getText("report.handled"));
    heads[12] = (getText("report.LCDorDisplayFailure") + "/" + getText("report.handled"));
    heads[13] = (getText("report.TTSModuleFailure") + "/" + getText("report.handled"));
    heads[14] = (getText("report.cameraMalfunction") + "/" + getText("report.handled"));
    heads[15] = (getText("report.cumulativeDayDrivingTimeout") + "/" + getText("report.handled"));
    heads[16] = (getText("report.overtimeParking") + "/" + getText("report.handled"));
    heads[17] = (getText("report.outOfRegional") + "/" + getText("report.handled"));
    heads[18] = (getText("report.outOfLine") + "/" + getText("report.handled"));
    heads[19] = (getText("report.InadequateOrTooLongRoadTravelTime") + "/" + getText("report.handled"));
    heads[20] = (getText("report.routeDeviation") + "/" + getText("report.handled"));
    heads[21] = (getText("report.VSSFailure") + "/" + getText("report.handled"));
    heads[22] = (getText("report.abnormalFuel") + "/" + getText("report.handled"));
    heads[23] = (getText("report.antitheftDevice") + "/" + getText("report.handled"));
    heads[24] = (getText("report.illegalIgnition") + "/" + getText("report.handled"));
    heads[25] = (getText("report.illegalDisplacement") + "/" + getText("report.handled"));
    heads[26] = (getText("report.rollover") + "/" + getText("report.handled"));
    heads[27] = (getText("report.nightDriving") + "/" + getText("report.handled"));
    heads[28] = (getText("report.speed.over") + "/" + getText("report.handled"));
    heads[29] = (getText("report.alarm.acc") + "/" + getText("report.handled"));
    heads[30] = (getText("report.alarm.fatigue") + "/" + getText("report.handled"));
    heads[31] = (getText("report.platform.regionalSpeedingAlarm") + "/" + getText("report.handled"));
    heads[32] = (getText("report.platform.regionalLowSpeedAlarm") + "/" + getText("report.handled"));
    heads[33] = (getText("report.platform.outOfRegional") + "/" + getText("report.handled"));
    heads[34] = (getText("report.platform.routeDeviation") + "/" + getText("report.handled"));
    heads[35] = (getText("report.platform.timeOverSpeedAlarm") + "/" + getText("report.handled"));
    heads[36] = (getText("report.platform.timeLowSpeedAlarm") + "/" + getText("report.handled"));
    heads[37] = (getText("report.platform.fatigueDriving") + "/" + getText("report.handled"));
    heads[38] = (getText("report.platform.overtimeParking") + "/" + getText("report.handled"));
    heads[39] = (getText("report.platform.areaPoint") + "/" + getText("report.handled"));
    heads[40] = (getText("report.platform.lineOverSpeed") + "/" + getText("report.handled"));
    heads[41] = (getText("report.platform.lineLowSpeed") + "/" + getText("report.handled"));
    heads[42] = (getText("report.platform.roadLvlOverSpeed") + "/" + getText("report.handled"));
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardReportSummary> alarmSummarys = new AjaxDto();
    if (isCompany())
    {
      if (isDaily())
      {
        alarmSummarys = doDailyComSum(begintime, endtime, vehiIdnos.split(","), null);
      }
      else if (isMonthly())
      {
        begintime = begintime + "-01";
        endtime = DateUtil.getMonthMaxDate(endtime);
        alarmSummarys = doMonthlyComSum(begintime, endtime, vehiIdnos.split(","), null);
      }
      else
      {
        alarmSummarys = doComSum(begintime, endtime, vehiIdnos.split(","), null);
      }
    }
    else if (isDaily())
    {
      alarmSummarys = doDailySummary(begintime, endtime, vehiIdnos.split(","), null);
    }
    else if (isMonthly())
    {
      begintime = begintime + "-01";
      endtime = DateUtil.getMonthMaxDate(endtime);
      alarmSummarys = doMonthlySummary(begintime, endtime, vehiIdnos.split(","), null);
    }
    else
    {
      alarmSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    }
    for (int i = 1; i <= alarmSummarys.getPageList().size(); i++)
    {
      StandardReportSummary summary = (StandardReportSummary)alarmSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      if (isCompany())
      {
        StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, summary.getCompanyId());
        export.setCellValue(Integer.valueOf(j++), company.getName());
        if ((isDaily()) || (isMonthly())) {
          if (isDaily()) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(summary.getBeginTime()));
          } else {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchMonthDateString(summary.getBeginTime()));
          }
        }
      }
      else
      {
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
        if ((isDaily()) || (isMonthly())) {
          if (isDaily()) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(summary.getBeginTime()));
          } else {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchMonthDateString(summary.getBeginTime()));
          }
        }
      }
      if (summary.getBeginTime() != null)
      {
        List<String> countStrs = summary.getCountStrs();
        
        int q = 40;
        if (isMalfunction()) {
          q = 10;
        } else if (isVideo()) {
          q = 3;
        } else if (isIO()) {
          q = 12;
        } else if (isFence()) {
          q = 13;
        } else if (isDriving()) {
          q = 8;
        } else if (isAcc()) {
          q = 1;
        }
        for (int k = 0; k < q; k++) {
          if (isAcc())
          {
            String[] str = ((String)countStrs.get(k)).split("\\/");
            if (str.length >= 2)
            {
              export.setCellValue(Integer.valueOf(j++), str[0]);
              export.setCellValue(Integer.valueOf(j++), str[1]);
            }
            else
            {
              export.setCellValue(Integer.valueOf(j++), str[0]);
              export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
            }
          }
          else
          {
            export.setCellValue(Integer.valueOf(j++), countStrs.get(k));
          }
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    if (isMalfunction()) {
      return getText("report.malfunction.summary");
    }
    if (isVideo()) {
      return getText("report.video.summary");
    }
    if (isIO()) {
      return getText("report.io.summary");
    }
    if (isFence()) {
      return getText("report.fence.summary");
    }
    if (isDriving()) {
      return getText("report.driving.summary");
    }
    if (isAcc()) {
      return getText("report.acc.summary");
    }
    if (isDaily()) {
      return getText("report.alarm.daily");
    }
    if (isMonthly()) {
      return getText("report.alarm.monthly");
    }
    return getText("report.alarm.summary");
  }
  
  protected boolean isCompany()
  {
    String type = getRequest().getParameter("handleStatus");
    return (type != null) && (type.equals("1"));
  }
  
  protected boolean isCustom()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("custom"));
  }
  
  protected boolean isUrgencyButton()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("urgencybutton"));
  }
  
  protected boolean isRegionalSpeeding()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("rsegionalSpeeding"));
  }
  
  protected boolean isEarlyWarning()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("earlyWarning"));
  }
  
  protected boolean isMalfunction()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("malfunction"));
  }
  
  protected boolean isSingalLoss()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("signalloss"));
  }
  
  protected boolean isGNSSModuleFailure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("GNSSModuleFailure"));
  }
  
  protected boolean isGNSSAntennaMissedOrCut()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("GNSSAntennaMissedOrCut"));
  }
  
  protected boolean isGNSSAntennaShort()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("GNSSAntennaShort"));
  }
  
  protected boolean isMainSupplyUndervoltage()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("mainSupplyUndervoltage"));
  }
  
  protected boolean isMainPowerFailure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("mainPowerFailure"));
  }
  
  protected boolean isLCDorDisplayFailure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("LCDorDisplayFailure"));
  }
  
  protected boolean isTTSModuleFailure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("TTSModuleFailure"));
  }
  
  protected boolean isCameraMalfunction()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cameraMalfunction"));
  }
  
  protected boolean isDrivingTimeout()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("drivingTimeou"));
  }
  
  protected boolean isOvertimeParking()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("overtimeParking"));
  }
  
  protected boolean isOutOfRegional()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("outOfRegional"));
  }
  
  protected boolean isOutOfLine()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("outOfLine"));
  }
  
  protected boolean isRoadTravelTime()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("roadTravelTime"));
  }
  
  protected boolean isRouteDeviation()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("routeDeviation"));
  }
  
  protected boolean isVSSFailure()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("VSSFailure"));
  }
  
  protected boolean isAbnormalFuel()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("abnormalFuel"));
  }
  
  protected boolean isAntitheftDevice()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("antitheftDevice"));
  }
  
  protected boolean isIllegalIgnition()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("illegalIgnition"));
  }
  
  protected boolean isIllegalDisplacement()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("illegalDisplacement"));
  }
  
  protected boolean isRollover()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("rollover"));
  }
  
  protected boolean isNightDriving()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("nightDriving"));
  }
  
  protected boolean isOverSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("overSpeed"));
  }
  
  protected boolean isVideo()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("video"));
  }
  
  protected boolean isVideoSignal()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("videosignal"));
  }
  
  protected boolean isVideoMask()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("videomask"));
  }
  
  protected boolean isVideoMotion()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("videomotion"));
  }
  
  protected boolean isIO()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io"));
  }
  
  protected boolean isIO1()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io1"));
  }
  
  protected boolean isIO2()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io2"));
  }
  
  protected boolean isIO3()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io3"));
  }
  
  protected boolean isIO4()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io4"));
  }
  
  protected boolean isIO5()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io5"));
  }
  
  protected boolean isIO6()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io6"));
  }
  
  protected boolean isIO7()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io7"));
  }
  
  protected boolean isIO8()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io7"));
  }
  
  protected boolean isIO9()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io9"));
  }
  
  protected boolean isIO10()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io10"));
  }
  
  protected boolean isIO11()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io11"));
  }
  
  protected boolean isIO12()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("io12"));
  }
  
  protected boolean isFence()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("fence"));
  }
  
  protected boolean isAcc()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("acc"));
  }
  
  protected boolean isDriving()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("driving"));
  }
  
  protected boolean isBounds()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("bounds"));
  }
  
  protected boolean isFatigue()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("fatigue"));
  }
  
  protected boolean isCMSAreaOverSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsAreaOverSpeed"));
  }
  
  protected boolean isCMSAreaLowSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsAreaLowSpeed"));
  }
  
  protected boolean isCMSAreaInOut()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsAreaInOut"));
  }
  
  protected boolean isCMSLineInOut()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsLineInOut"));
  }
  
  protected boolean isCMSOverSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsOverSpeed"));
  }
  
  protected boolean isCMSLowSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsLowSpeed"));
  }
  
  protected boolean isCMSFatigue()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsFatigue"));
  }
  
  protected boolean isCMSParkTooLong()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsParkTooLong"));
  }
  
  protected boolean isCMSAreaPoint()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsAreaPoint"));
  }
  
  protected boolean isCMSLineOverSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsLineOverSpeed"));
  }
  
  protected boolean isCMSLineLowSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsLineLowSpeed"));
  }
  
  protected boolean isCMSRoadLvlOverSpeed()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("cmsRoadLvlOverSpeed"));
  }
  
  protected boolean isAllReporting()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("allReporting"));
  }
  
  protected boolean isPractice()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("practice"));
  }
  
  protected boolean isInformationServices()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("informationServices"));
  }
  
  protected boolean isElectronicWaybill()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("electronicWaybill"));
  }
  
  protected boolean isCompressedDataReporting()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("compressedDataReporting"));
  }
  
  protected boolean isMultimediaEventInformation()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("multimediaEventInformation"));
  }
  
  protected boolean isDriverStatusCollection()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("driverStatusCollection"));
  }
  
  protected boolean isMalfunctionAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("malfunction"));
  }
  
  protected boolean isVideoAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("video"));
  }
  
  protected boolean isIOAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("io"));
  }
  
  protected boolean isFenceAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("fence"));
  }
  
  protected boolean isDrivingAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("driving"));
  }
  
  protected boolean isAccAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("acc"));
  }
  
  protected boolean isDataAlarm()
  {
    String type = getRequest().getParameter("maintype");
    return (type != null) && (type.equals("data"));
  }
  
  protected boolean isSourceDevice()
  {
    String source = getRequest().getParameter("status");
    return (source != null) && (source.equals("0"));
  }
  
  protected boolean isSourcePlatform()
  {
    String source = getRequest().getParameter("status");
    return (source != null) && (source.equals("1"));
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    if (isCustom())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(1));
      }
    }
    else if (isUrgencyButton())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(2));
      }
    }
    else if (isBounds())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(12));
      }
    }
    else if (isRegionalSpeeding())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(200));
      }
    }
    else if (isEarlyWarning())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(201));
      }
    }
    else if (isSingalLoss())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(18));
      }
    }
    else if (isGNSSModuleFailure())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(202));
      }
    }
    else if (isGNSSAntennaMissedOrCut())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(203));
      }
    }
    else if (isGNSSAntennaShort())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(204));
      }
    }
    else if (isMainSupplyUndervoltage())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(205));
      }
    }
    else if (isMainPowerFailure())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(206));
      }
    }
    else if (isLCDorDisplayFailure())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(207));
      }
    }
    else if (isTTSModuleFailure())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(208));
      }
    }
    else if (isCameraMalfunction())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(209));
      }
    }
    else if (isDrivingTimeout())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(210));
      }
    }
    else if (isOvertimeParking())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(14));
      }
    }
    else if (isOutOfRegional())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(211));
      }
    }
    else if (isOutOfLine())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(212));
      }
    }
    else if (isRoadTravelTime())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(213));
      }
    }
    else if (isRouteDeviation())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(214));
      }
    }
    else if (isVSSFailure())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(215));
      }
    }
    else if (isAbnormalFuel())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(216));
      }
    }
    else if (isAntitheftDevice())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(217));
      }
    }
    else if (isIllegalIgnition())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(8));
      }
    }
    else if (isIllegalDisplacement())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(218));
      }
    }
    else if (isRollover())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(219));
      }
    }
    else if (isNightDriving())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(151));
      }
    }
    else if (isOverSpeed())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(11));
      }
    }
    else if (isFatigue())
    {
      if (!isSourcePlatform()) {
        lstArmType.add(Integer.valueOf(49));
      }
    }
    else if (isCMSAreaOverSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(300));
      }
    }
    else if (isCMSAreaLowSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(301));
      }
    }
    else if (isCMSAreaInOut())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(302));
      }
    }
    else if (isCMSLineInOut())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(303));
      }
    }
    else if (isCMSOverSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(304));
      }
    }
    else if (isCMSLowSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(305));
      }
    }
    else if (isCMSFatigue())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(306));
      }
    }
    else if (isCMSParkTooLong())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(307));
      }
    }
    else if (isCMSAreaPoint())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(308));
      }
    }
    else if (isCMSLineOverSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(309));
      }
    }
    else if (isCMSLineLowSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(310));
      }
    }
    else if (isCMSRoadLvlOverSpeed())
    {
      if (!isSourceDevice()) {
        lstArmType.add(Integer.valueOf(311));
      }
    }
    else if (isAllReporting())
    {
      lstArmType.add(Integer.valueOf(113));
      lstArmType.add(Integer.valueOf(116));
    }
    else if ((isPractice()) || (isInformationServices()) || (isElectronicWaybill()) || (isCompressedDataReporting()) || (isMultimediaEventInformation()))
    {
      lstArmType.add(Integer.valueOf(113));
    }
    else if (isDriverStatusCollection())
    {
      lstArmType.add(Integer.valueOf(116));
    }
    else if (isMalfunction())
    {
      lstArmType.add(Integer.valueOf(18));
      lstArmType.add(Integer.valueOf(202));
      lstArmType.add(Integer.valueOf(203));
      lstArmType.add(Integer.valueOf(204));
      lstArmType.add(Integer.valueOf(205));
      lstArmType.add(Integer.valueOf(206));
      lstArmType.add(Integer.valueOf(207));
      lstArmType.add(Integer.valueOf(208));
      lstArmType.add(Integer.valueOf(209));
      lstArmType.add(Integer.valueOf(215));
    }
    else if (isFence())
    {
      lstArmType.add(Integer.valueOf(12));
      lstArmType.add(Integer.valueOf(200));
      lstArmType.add(Integer.valueOf(211));
      lstArmType.add(Integer.valueOf(212));
      lstArmType.add(Integer.valueOf(213));
      lstArmType.add(Integer.valueOf(214));
      lstArmType.add(Integer.valueOf(300));
      lstArmType.add(Integer.valueOf(301));
      lstArmType.add(Integer.valueOf(302));
      lstArmType.add(Integer.valueOf(303));
      lstArmType.add(Integer.valueOf(308));
      lstArmType.add(Integer.valueOf(309));
      lstArmType.add(Integer.valueOf(310));
    }
    else if (isVideo())
    {
      lstArmType.add(Integer.valueOf(4));
      lstArmType.add(Integer.valueOf(5));
      lstArmType.add(Integer.valueOf(15));
    }
    else if (isDriving())
    {
      lstArmType.add(Integer.valueOf(11));
      lstArmType.add(Integer.valueOf(304));
      lstArmType.add(Integer.valueOf(305));
      lstArmType.add(Integer.valueOf(307));
      lstArmType.add(Integer.valueOf(306));
      lstArmType.add(Integer.valueOf(151));
      lstArmType.add(Integer.valueOf(210));
      lstArmType.add(Integer.valueOf(311));
    }
    else if (isAcc())
    {
      lstArmType.add(Integer.valueOf(16));
    }
    else if (isVideoSignal())
    {
      lstArmType.add(Integer.valueOf(4));
    }
    else if (isVideoMask())
    {
      lstArmType.add(Integer.valueOf(5));
    }
    else if (isVideoMotion())
    {
      lstArmType.add(Integer.valueOf(15));
    }
    else if (isIO())
    {
      lstArmType.add(Integer.valueOf(19));
      lstArmType.add(Integer.valueOf(20));
      lstArmType.add(Integer.valueOf(21));
      lstArmType.add(Integer.valueOf(22));
      lstArmType.add(Integer.valueOf(23));
      lstArmType.add(Integer.valueOf(24));
      lstArmType.add(Integer.valueOf(25));
      lstArmType.add(Integer.valueOf(26));
      lstArmType.add(Integer.valueOf(41));
      lstArmType.add(Integer.valueOf(42));
      lstArmType.add(Integer.valueOf(43));
      lstArmType.add(Integer.valueOf(44));
    }
    else if (isIO1())
    {
      lstArmType.add(Integer.valueOf(19));
    }
    else if (isIO2())
    {
      lstArmType.add(Integer.valueOf(20));
    }
    else if (isIO3())
    {
      lstArmType.add(Integer.valueOf(21));
    }
    else if (isIO4())
    {
      lstArmType.add(Integer.valueOf(22));
    }
    else if (isIO5())
    {
      lstArmType.add(Integer.valueOf(23));
    }
    else if (isIO6())
    {
      lstArmType.add(Integer.valueOf(24));
    }
    else if (isIO7())
    {
      lstArmType.add(Integer.valueOf(25));
    }
    else if (isIO8())
    {
      lstArmType.add(Integer.valueOf(26));
    }
    else if (isIO9())
    {
      lstArmType.add(Integer.valueOf(41));
    }
    else if (isIO10())
    {
      lstArmType.add(Integer.valueOf(42));
    }
    else if (isIO11())
    {
      lstArmType.add(Integer.valueOf(43));
    }
    else if (isIO12())
    {
      lstArmType.add(Integer.valueOf(44));
    }
    else if (isSourceDevice())
    {
      lstArmType.add(Integer.valueOf(1));
      lstArmType.add(Integer.valueOf(2));
      lstArmType.add(Integer.valueOf(200));
      lstArmType.add(Integer.valueOf(201));
      lstArmType.add(Integer.valueOf(202));
      lstArmType.add(Integer.valueOf(203));
      lstArmType.add(Integer.valueOf(204));
      lstArmType.add(Integer.valueOf(205));
      lstArmType.add(Integer.valueOf(206));
      lstArmType.add(Integer.valueOf(207));
      lstArmType.add(Integer.valueOf(208));
      lstArmType.add(Integer.valueOf(209));
      lstArmType.add(Integer.valueOf(210));
      lstArmType.add(Integer.valueOf(14));
      lstArmType.add(Integer.valueOf(211));
      lstArmType.add(Integer.valueOf(212));
      lstArmType.add(Integer.valueOf(213));
      lstArmType.add(Integer.valueOf(214));
      lstArmType.add(Integer.valueOf(215));
      lstArmType.add(Integer.valueOf(216));
      lstArmType.add(Integer.valueOf(217));
      lstArmType.add(Integer.valueOf(8));
      lstArmType.add(Integer.valueOf(218));
      lstArmType.add(Integer.valueOf(219));
      lstArmType.add(Integer.valueOf(151));
      lstArmType.add(Integer.valueOf(11));
      lstArmType.add(Integer.valueOf(16));
      lstArmType.add(Integer.valueOf(49));
    }
    else if (isSourcePlatform())
    {
      lstArmType.add(Integer.valueOf(300));
      lstArmType.add(Integer.valueOf(301));
      lstArmType.add(Integer.valueOf(302));
      lstArmType.add(Integer.valueOf(303));
      lstArmType.add(Integer.valueOf(304));
      lstArmType.add(Integer.valueOf(305));
      lstArmType.add(Integer.valueOf(306));
      lstArmType.add(Integer.valueOf(307));
      lstArmType.add(Integer.valueOf(308));
      lstArmType.add(Integer.valueOf(309));
      lstArmType.add(Integer.valueOf(310));
      lstArmType.add(Integer.valueOf(311));
    }
    else
    {
      lstArmType.add(Integer.valueOf(1));
      lstArmType.add(Integer.valueOf(2));
      lstArmType.add(Integer.valueOf(200));
      lstArmType.add(Integer.valueOf(201));
      lstArmType.add(Integer.valueOf(202));
      lstArmType.add(Integer.valueOf(203));
      lstArmType.add(Integer.valueOf(204));
      lstArmType.add(Integer.valueOf(205));
      lstArmType.add(Integer.valueOf(206));
      lstArmType.add(Integer.valueOf(207));
      lstArmType.add(Integer.valueOf(208));
      lstArmType.add(Integer.valueOf(209));
      lstArmType.add(Integer.valueOf(210));
      lstArmType.add(Integer.valueOf(14));
      lstArmType.add(Integer.valueOf(211));
      lstArmType.add(Integer.valueOf(212));
      lstArmType.add(Integer.valueOf(213));
      lstArmType.add(Integer.valueOf(214));
      lstArmType.add(Integer.valueOf(215));
      lstArmType.add(Integer.valueOf(216));
      lstArmType.add(Integer.valueOf(217));
      lstArmType.add(Integer.valueOf(8));
      lstArmType.add(Integer.valueOf(218));
      lstArmType.add(Integer.valueOf(219));
      lstArmType.add(Integer.valueOf(151));
      lstArmType.add(Integer.valueOf(11));
      lstArmType.add(Integer.valueOf(16));
      lstArmType.add(Integer.valueOf(49));
      
      lstArmType.add(Integer.valueOf(300));
      lstArmType.add(Integer.valueOf(301));
      lstArmType.add(Integer.valueOf(302));
      lstArmType.add(Integer.valueOf(303));
      lstArmType.add(Integer.valueOf(304));
      lstArmType.add(Integer.valueOf(305));
      lstArmType.add(Integer.valueOf(306));
      lstArmType.add(Integer.valueOf(307));
      lstArmType.add(Integer.valueOf(308));
      lstArmType.add(Integer.valueOf(309));
      lstArmType.add(Integer.valueOf(310));
      lstArmType.add(Integer.valueOf(311));
    }
    return lstArmType;
  }
  
  protected List<Integer> getArmInfo()
  {
    List<Integer> lstArmInfo = new ArrayList();
    if (isPractice()) {
      lstArmInfo.add(Integer.valueOf(15));
    } else if (isInformationServices()) {
      lstArmInfo.add(Integer.valueOf(16));
    } else if (isElectronicWaybill()) {
      lstArmInfo.add(Integer.valueOf(17));
    } else if (isCompressedDataReporting()) {
      lstArmInfo.add(Integer.valueOf(18));
    } else if (isMultimediaEventInformation()) {
      lstArmInfo.add(Integer.valueOf(20));
    }
    return lstArmInfo;
  }
  
  protected String[] genDetailHeads()
  {
    if (isFenceAlarm())
    {
      String[] heads = new String[18];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.alarmType");
      heads[4] = getText("report.alarmSource");
      heads[5] = getText("report.fence.marker");
      heads[6] = getText("report.begintime");
      heads[7] = getText("report.endtime");
      heads[8] = getText("report.alarmLength");
      heads[9] = getText("report.alarm.startSpeed");
      heads[10] = getText("report.alarm.endSpeed");
      heads[11] = getText("report.normal.begin.position");
      heads[12] = getText("report.normal.end.position");
      heads[13] = getText("report.alarm.armInfo");
      heads[14] = getText("report.handleStatus");
      heads[15] = getText("report.handleuser");
      heads[16] = getText("report.handleContent");
      heads[17] = getText("report.handleTime");
      return heads;
    }
    if (isAccAlarm())
    {
      String[] heads = new String[8];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.begintime");
      heads[4] = getText("report.endtime");
      heads[5] = getText("report.timeLength");
      heads[6] = getText("report.normal.begin.position");
      heads[7] = getText("report.normal.end.position");
      return heads;
    }
    if (isDataAlarm())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.alarmType");
      heads[4] = getText("report.time");
      heads[5] = getText("report.content");
      return heads;
    }
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
  
  protected int getAlarmChannel(int armInfo)
  {
    int channel = 0;
    for (int i = 0; i < 16; i++) {
      if ((armInfo >> i & 0x1) > 0)
      {
        channel = i;
        break;
      }
    }
    return channel;
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
        if (!isAccAlarm())
        {
          if (alarm.getArmType().intValue() == 113)
          {
            export.setCellValue(Integer.valueOf(j++), getAlarmInfoName(alarm.getArmInfo().intValue()));
          }
          else if (alarm.getArmType().intValue() == 168)
          {
            export.setCellValue(Integer.valueOf(j++), getArmInfoName(alarm.getArmInfo().intValue()));
          }
          else
          {
            StandardVehicle vehicle = new StandardVehicle();
            switch (alarm.getArmType().intValue())
            {
            case 19: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 0) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[0] + getText("report.alarm"));
                }
              }
              break;
            case 20: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 1) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[1] + getText("report.alarm"));
                }
              }
              break;
            case 21: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 2) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[2] + getText("report.alarm"));
                }
              }
              break;
            case 22: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 3) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[3] + getText("report.alarm"));
                }
              }
              break;
            case 23: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 4) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[4] + getText("report.alarm"));
                }
              }
              break;
            case 24: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 5) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[5] + getText("report.alarm"));
                }
              }
              break;
            case 25: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 6) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[6] + getText("report.alarm"));
                }
              }
              break;
            case 26: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 7) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[7] + getText("report.alarm"));
                }
              }
              break;
            case 41: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 8) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[8] + getText("report.alarm"));
                }
              }
              break;
            case 42: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 9) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[9] + getText("report.alarm"));
                }
              }
              break;
            case 43: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 10) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[10] + getText("report.alarm"));
                }
              }
              break;
            case 44: 
              vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, alarm.getVehiIdno());
              if ((vehicle.getIoInName() != null) && (!vehicle.getIoInName().isEmpty()))
              {
                String[] ioNames = vehicle.getIoInName().split(",");
                if (ioNames.length > 11) {
                  export.setCellValue(Integer.valueOf(j++), ioNames[11] + getText("report.alarm"));
                }
              }
              break;
            case 27: 
            case 28: 
            case 29: 
            case 30: 
            case 31: 
            case 32: 
            case 33: 
            case 34: 
            case 35: 
            case 36: 
            case 37: 
            case 38: 
            case 39: 
            case 40: 
            default: 
              export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()));
            }
          }
          if (!isDataAlarm()) {
            export.setCellValue(Integer.valueOf(j++), alarm.getAlarmSource());
          }
        }
        if (isfence)
        {
          String areaName = "";
          for (int k = 0; k < markers.size(); k++) {
            if (((MapMarker)markers.get(k)).getId().intValue() == alarm.getParam2().intValue())
            {
              areaName = ((MapMarker)markers.get(k)).getName();
              break;
            }
          }
          export.setCellValue(Integer.valueOf(j++), areaName);
        }
        if (alarm.getArmTimeStart() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeStart()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (!isDataAlarm())
        {
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
          if (!isAccAlarm())
          {
            export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getStartSpeed(), alarm.getStartStatus1()));
            
            export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getEndSpeed(), alarm.getEndStatus1()));
          }
          export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
          
          export.setCellValue(Integer.valueOf(j++), alarm.getEndPosition());
          if (!isAccAlarm())
          {
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
        else
        {
          String pos = "";
          if (alarm.getArmType().intValue() == 113)
          {
            if (alarm.getArmInfo().intValue() == 15)
            {
              pos = "ID:" + alarm.getParam1();
            }
            else if (alarm.getArmInfo().intValue() == 16)
            {
              pos = getText("report.informationType") + alarm.getParam1();
              if (alarm.getParam2().intValue() == 0) {
                pos = pos + getText("report.cancel");
              } else if (alarm.getParam2().intValue() == 1) {
                pos = pos + getText("report.demand");
              }
            }
            else if (alarm.getArmInfo().intValue() == 17)
            {
              pos = alarm.getArmDesc() + alarm.getImgInfo();
            }
            else if (alarm.getArmInfo().intValue() == 18)
            {
              pos = alarm.getImgInfo();
            }
            else if (alarm.getArmInfo().intValue() == 20)
            {
              pos = "ID:" + alarm.getParam1();
              if (alarm.getParam2() != null)
              {
                int type = alarm.getParam2().intValue() & 0xFF;
                int format = alarm.getParam2().intValue() >> 8 & 0xFF;
                int event = alarm.getParam2().intValue() >> 16 & 0xFF;
                int aisle = alarm.getParam2().intValue() >> 24 & 0xFF;
                pos = pos + ";" + getText("report.mediaTypes");
                if (type == 1) {
                  pos = pos + getText("report.audio");
                } else if (type == 2) {
                  pos = pos + getText("report.video");
                } else {
                  pos = pos + getText("report.photo");
                }
                pos = pos + ";" + getText("report.codingFormat");
                if (format == 0) {
                  pos = pos + "JPEG";
                } else if (format == 1) {
                  pos = pos + "TIF";
                } else if (format == 2) {
                  pos = pos + "MP3";
                } else if (format == 3) {
                  pos = pos + "WAV";
                } else if (format == 4) {
                  pos = pos + "WMV";
                } else {
                  pos = pos + getText("vehicle.plateType.other");
                }
                pos = pos + ";" + getText("report.eventEntry");
                if (event == 0) {
                  pos = pos + getText("report.issuedInstructionsPlatform");
                } else if (event == 1) {
                  pos = pos + getText("report.timingAction");
                } else if (event == 2) {
                  pos = pos + getText("report.robberyAlarmTriggered");
                } else if (event == 3) {
                  pos = pos + getText("report.rolloverCollisionAlarmTriggered");
                } else {
                  pos = pos + getText("vehicle.plateType.other");
                }
                pos = pos + ";CH" + aisle;
              }
            }
          }
          else if (alarm.getArmType().intValue() == 116) {
            if (alarm.getArmDesc() != null)
            {
              String[] str = alarm.getArmDesc().split(";");
              pos = getText("report.driverName") + str[0] + ";" + getText("report.issuingOrganization") + str[1] + ";" + getText("report.IDCode") + str[2] + ";" + getText("report.qualificationCertificateCoding") + str[3];
            }
            else
            {
              pos = "";
            }
          }
          export.setCellValue(Integer.valueOf(j++), pos);
        }
      }
    }
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String handleStatus = getRequestString("handleStatus");
    String condition = "";
    if ((handleStatus != null) && (!handleStatus.isEmpty()) && (!"2".equals(handleStatus))) {
      condition = " and HandleStatus = " + handleStatus;
    }
    AjaxDto<StandardDeviceAlarm> ajaxDto = new AjaxDto();
    if ((getAlarmQueryType() != null) && (getAlarmQueryType().size() > 0)) {
      ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
        vehiIdnos.split(","), getAlarmQueryType(), getArmInfo(), condition + " order by ArmTimeStart asc", null, queryFilter, qtype, sortname, sortorder);
    }
    List<StandardDeviceAlarm> deviceAlarms = null;
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      deviceAlarms = handleDetailData(ajaxDto.getPageList(), toMap, true);
    }
    boolean isfence = false;
    if (isFenceAlarm()) {
      isfence = true;
    }
    List<MapMarker> markers = this.vehicleAlarmService.getMarkerList();
    genAlarmExcelData(deviceAlarms, export, isfence, markers);
  }
  
  protected String genDetailTitle()
  {
    if (isMalfunctionAlarm()) {
      return getText("report.title.malfunctionDetail");
    }
    if (isVideoAlarm()) {
      return getText("report.title.videoDetail");
    }
    if (isIOAlarm()) {
      return getText("report.title.ioDetail");
    }
    if (isFenceAlarm()) {
      return getText("report.title.fenceDetail");
    }
    if (isDrivingAlarm()) {
      return getText("report.title.drivingDetail");
    }
    if (isAccAlarm()) {
      return getText("report.title.accDetail");
    }
    if (isDataAlarm()) {
      return getText("report.title.dataDetail");
    }
    return getText("report.title.alarmDetail");
  }
}
