package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.utils.NetworkUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleLoginService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class StandardReportLoginAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected AjaxDto<StandardReportSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(17));
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.loginService.summaryDeviceAlarm(begintime, endtime, 
      vehicles, lstArmType, " order by ArmTimeStartI ", null, null, null, queryFilter, qtype, sortname, sortorder);
    List<StandardReportSummary> loginSummarys = new ArrayList();
    for (int i = 0; i < vehicles.length; i++)
    {
      StandardReportSummary summary = new StandardReportSummary();
      summary.setVehiIdno(vehicles[i]);
      int online = 0;
      int unonline = 0;
      long time = 0L;
      for (int j = 0; j < lstAlarmSummary.size(); j++) {
        if (((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getVehiIdno().equals(vehicles[i]))
        {
          summary.setPlateType(((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getPlateType());
          online++;
          if ((summary.getBeginTime() == null) || (((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getBeginTime().before(summary.getBeginTime()))) {
            summary.setBeginTime(((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getBeginTime());
          }
          if ((((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getEndTime() != null) && 
            (((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getEndTime().getTime() <= DateUtil.StrLongTime2Date(endtime).getTime()))
          {
            unonline++;
            if ((summary.getEndTime() == null) || (((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getEndTime().after(summary.getEndTime()))) {
              summary.setEndTime(((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getEndTime());
            }
            time += ((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getEndTime().getTime() - ((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getBeginTime().getTime();
          }
          else
          {
            Integer x = getNextValiDate(j, lstAlarmSummary, vehicles[i]);
            if (x != null)
            {
              time += ((StandardDeviceAlarmSummary)lstAlarmSummary.get(x.intValue())).getBeginTime().getTime() - ((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getBeginTime().getTime();
              j = x.intValue() - 1;
            }
            else
            {
              time += DateUtil.StrLongTime2Date(endtime).getTime() - ((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getBeginTime().getTime();
              j = lstAlarmSummary.size();
            }
          }
        }
      }
      
      long stime = DateUtil.StrLongTime2Date(endtime).getTime() - DateUtil.StrLongTime2Date(begintime).getTime();
     
      double rate = Double.parseDouble(Long.toString(time)) / Double.parseDouble(Long.toString(stime));
      if (rate == 0.0D) {
        summary.setParam1SumStr("0.0001");
      } else {
        summary.setParam1SumStr(Double.toString(rate));
      }
      summary.addCount(Integer.valueOf(online));
      summary.addCount(Integer.valueOf(unonline));
      if ((summary.getBeginTime() != null) && (summary.getCounts() != null)) {
        loginSummarys.add(summary);
      }
    }
    int start = 0;int index = loginSummarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(loginSummarys.size());
      if (loginSummarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardReportSummary> loginSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      loginSummarys2.add((StandardReportSummary)loginSummarys.get(i));
    }
    AjaxDto<StandardReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(loginSummarys2);
    return dtoSummary;
  }
  
  public String summary()
    throws Exception
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
        
        AjaxDto<StandardReportSummary> loginSummarys = doSummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx(), null, null, null, null);
        
        addCustomResponse("infos", loginSummarys.getPageList());
        addCustomResponse("pagination", loginSummarys.getPagination());
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
    if (isLoginRate())
    {
      String[] heads = new String[4];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.login.loginrate");
      return heads;
    }
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.login.onlineCount");
    heads[6] = getText("report.login.disonlineCount");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (!isLoginRate())
    {
      AjaxDto<StandardReportSummary> loginSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null, null, null, null, null);
      for (int i = 1; i <= loginSummarys.getPageList().size(); i++)
      {
        StandardReportSummary summary = (StandardReportSummary)loginSummarys.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno());
        
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
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
          List<Integer> loginCounts = summary.getCounts();
          
          export.setCellValue(Integer.valueOf(j++), loginCounts.get(0));
          
          export.setCellValue(Integer.valueOf(j++), loginCounts.get(1));
        }
      }
    }
    else
    {
      AjaxDto<StandardReportSummary> loginSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null, null, null, null, null);
      for (int i = 1; i <= loginSummarys.getPageList().size(); i++)
      {
        StandardReportSummary summary = (StandardReportSummary)loginSummarys.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno());
        
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
        
        DecimalFormat r = new DecimalFormat();
        r.applyPattern("#0.00");
        export.setCellValue(Integer.valueOf(j++), r.format(Float.parseFloat(summary.getParam1SumStr().toString()) * 100.0F) + "%");
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    if (isLoginRate()) {
      return getText("report.login.rate");
    }
    return getText("report.login.summary");
  }
  
  protected boolean isLoginRate()
  {
    String type = getRequestString("type");
    return (type != null) && (type.equals("rate"));
  }
  
  protected List<Integer> getLoginQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(17));
    return lstArmType;
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
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        int mapType;
        try
        {
          mapType = Integer.parseInt(toMap);
        }
        catch (Exception e)
        {
          
          mapType = 2;
        }
        List<Integer> lstArmType = getLoginQueryType();
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.loginService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, " order by ArmTimeStartI asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        List<StandardDeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null) {
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            StandardDeviceAlarm deviceAlarm = (StandardDeviceAlarm)deviceAlarms.get(i);
            String[] statusStart = handleFieldData(deviceAlarm.getStatusStart());
            String[] statusEnd = handleFieldData(deviceAlarm.getStatusEnd());
            deviceAlarm.setStartPosition(handlePosition(statusStart, Integer.valueOf(mapType), true));
            deviceAlarm.setEndPosition(handlePosition(statusEnd, Integer.valueOf(mapType), true));
            if ((statusStart != null) && (statusStart.length > 5) && (statusStart.length > 6))
            {
              deviceAlarm.setStartJingDu(Integer.valueOf(Integer.parseInt(statusStart[5])));
              deviceAlarm.setStartWeiDu(Integer.valueOf(Integer.parseInt(statusStart[6])));
            }
            if ((statusEnd != null) && (statusEnd.length > 5) && (statusEnd.length > 6))
            {
              deviceAlarm.setEndJingDu(Integer.valueOf(Integer.parseInt(statusEnd[5])));
              deviceAlarm.setEndWeiDu(Integer.valueOf(Integer.parseInt(statusEnd[6])));
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
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = (getText("report.login.online") + getText("report.time"));
    heads[4] = (getText("report.login.online") + getText("report.position"));
    heads[5] = (getText("report.login.disonline") + getText("report.time"));
    heads[6] = (getText("report.login.disonline") + getText("report.position"));
    heads[7] = getText("report.login.netaddr");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getLoginQueryType(), null, " order by ArmTimeStartI asc", null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        StandardDeviceAlarm alarm = (StandardDeviceAlarm)ajaxDto.getPageList().get(i - 1);
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
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeStart()));
        
        String[] statusStart = handleFieldData(alarm.getStatusStart());
        export.setCellValue(Integer.valueOf(j++), handlePosition(statusStart, toMap, true));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeEnd()));
        
        String[] statusEnd = handleFieldData(alarm.getStatusEnd());
        export.setCellValue(Integer.valueOf(j++), handlePosition(statusEnd, toMap, true));
        if (alarm.getArmType().equals(Integer.valueOf(17))) {
          export.setCellValue(Integer.valueOf(j++), NetworkUtil.longToIP(alarm.getParam1().longValue()) + " " + alarm.getParam2());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.login.detail");
  }
}
