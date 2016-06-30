package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.utils.NetworkUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.vo.DailyCount;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.ReportSummary;
import com.opensymphony.xwork2.ActionContext;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportLoginAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_LOGIN);
  }
  
  protected AjaxDto<ReportSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(17));
    lstArmType.add(Integer.valueOf(67));
    List<DeviceAlarmSummary> lstAlarmSummary = this.deviceAlarmService.summaryDeviceAlarm(begintime, endtime, 
      devices, lstArmType, null, "group by DevIDNO, ArmType", null, null, false, queryFilter, qtype, sortname, sortorder);
    Map<String, DeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary);
    List<ReportSummary> loginSummarys = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      ReportSummary summary = new ReportSummary();
      summary.setDevIdno(devices[i]);
      
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(17))));
      
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(67))));
      if ((summary.getBeginTime() != null) && (summary.getEndTime() != null) && (summary.getCounts() != null)) {
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
    List<ReportSummary> loginSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      loginSummarys2.add((ReportSummary)loginSummarys.get(i));
    }
    AjaxDto<ReportSummary> dtoSummary = new AjaxDto();
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
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<ReportSummary> loginSummarys = doSummary(begintime, endtime, query.getDevIdnos().split(","), getPaginationEx(), null, null, null, null);
        
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
      String[] heads = new String[3];
      heads[0] = getText("report.index");
      heads[1] = getText("report.time");
      heads[2] = getText("report.login.loginrate");
      return heads;
    }
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = getText("report.login.onlineCount");
    heads[5] = getText("report.login.disonlineCount");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    if (!isLoginRate())
    {
      AjaxDto<ReportSummary> loginSummarys = doSummary(begintime, endtime, devIdnos.split(","), null, null, null, null, null);
      for (int i = 1; i <= loginSummarys.getPageList().size(); i++)
      {
        ReportSummary summary = (ReportSummary)loginSummarys.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
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
      String[] allDevice = devIdnos.split(",");
      List<DailyCount> dailys = doDailyRate(begintime, endtime, allDevice);
      if (dailys != null) {
        for (int i = 1; i <= dailys.size(); i++)
        {
          DailyCount daily = (DailyCount)dailys.get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(daily.getDtime()));
          
          double rate = daily.getCount().intValue();
          rate = rate * 100.0D / allDevice.length;
          DecimalFormat r = new DecimalFormat();
          r.applyPattern("#0.00");
          export.setCellValue(Integer.valueOf(j++), r.format(rate) + "%");
        }
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
  
  protected List<Integer> getLoginQueryType(String loginType)
  {
    List<Integer> lstArmType = new ArrayList();
    if (loginType.equals("1"))
    {
      lstArmType.add(Integer.valueOf(17));
    }
    else if (loginType.equals("2"))
    {
      lstArmType.add(Integer.valueOf(67));
    }
    else
    {
      lstArmType.add(Integer.valueOf(17));
      lstArmType.add(Integer.valueOf(67));
    }
    return lstArmType;
  }
  
  protected List<DailyCount> doDailyRate(String begintime, String endtime, String[] allDevices)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(17));
    
    Date begin = DateUtil.StrDate2Date(begintime);
    Date end = DateUtil.StrDate2Date(endtime);
    long DAY = 86400000L;
    endtime = DateUtil.dateSwitchDateString(new Date(end.getTime() + DAY));
    
    List<DailyCount> dailys = this.deviceAlarmService.queryDailyCount(begintime, endtime, 
      allDevices, lstArmType);
    Map<Date, DailyCount> mapDailys = new HashMap();
    for (int i = 0; i < dailys.size(); i++) {
      mapDailys.put(((DailyCount)dailys.get(i)).getDtime(), (DailyCount)dailys.get(i));
    }
    List<DailyCount> retDailys = new ArrayList();
    
    long totalDay = (end.getTime() - begin.getTime()) / DAY + 1L;
    for (int i = 0; i < totalDay; i++)
    {
      DailyCount daily = new DailyCount();
      daily.setDtime(new Date(begin.getTime() + i * DAY));
      daily.setDtimeStr(DateUtil.dateSwitchDateString(daily.getDtime()));
      DailyCount find = (DailyCount)mapDailys.get(daily.getDtime());
      if (find != null) {
        daily.setCount(find.getCount());
      } else {
        daily.setCount(Integer.valueOf(0));
      }
      retDailys.add(daily);
    }
    return retDailys;
  }
  
  public String daily()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isDateValid(begintime)) || (!DateUtil.isDateValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        String[] allDevices = query.getDevIdnos().split(",");
        Pagination pagination = getPaginationEx();
        String[] date = getPaginationDate(pagination, begintime, endtime);
        List<DailyCount> retDailys = doDailyRate(date[0], date[1], allDevices);
        
        Pagination pagin = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
        addCustomResponse("pagination", pagin);
        addCustomResponse("infos", retDailys);
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
      String loginType = getRequestString("loginType");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (loginType == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        List<Integer> lstArmType = getLoginQueryType(loginType);
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), lstArmType, " order by armTime ", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        List<DeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null) {
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            DeviceAlarm deviceAlarm = (DeviceAlarm)deviceAlarms.get(i);
            deviceAlarm.setArmTimeStr(DateUtil.dateSwitchString(deviceAlarm.getArmTime()));
            if (isGpsValid(deviceAlarm.getStatus1()))
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
              deviceAlarm.setPosition(getMapPosition(deviceAlarm.getJingDu(), deviceAlarm.getWeiDu(), mapType));
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
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.type");
    heads[4] = getText("report.login.netaddr");
    heads[5] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String loginType = getRequestString("loginType");
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getLoginQueryType(loginType), null, null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        String type;
        
        if (alarm.getArmType().equals(Integer.valueOf(17))) {
          type = getText("report.login.online");
        } else {
          type = getText("report.login.disonline");
        }
        export.setCellValue(Integer.valueOf(j++), type);
        if (alarm.getArmType().equals(Integer.valueOf(17))) {
          export.setCellValue(Integer.valueOf(j++), NetworkUtil.longToIP(alarm.getParam1().longValue()) + " " + alarm.getParam2());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (isGpsValid(alarm.getStatus1()))
        {
          if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(alarm.getJingDu(), alarm.getWeiDu(), toMap.intValue()));
          } else if ((alarm.getJingDu().intValue() == 0) || (alarm.getWeiDu().intValue() == 0)) {
            export.setCellValue(Integer.valueOf(j++), "");
          } else {
            export.setCellValue(Integer.valueOf(j++), getPosition(alarm.getWeiDu(), alarm.getJingDu(), alarm.getStatus1()));
          }
        }
        else {
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
