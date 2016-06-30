package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.ReportSummary;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.hibernate.Hibernate;

public class ReportParkAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_PARK);
  }
  
  protected List<Integer> getAlarmTypeList(String type)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(getAlarmType(type));
    return lstArmType;
  }
  
  protected Integer getAlarmType(String type)
  {
    if ((type != null) && (type.equals("1"))) {
      return Integer.valueOf(102);
    }
    return Integer.valueOf(101);
  }
  
  protected AjaxDto<ReportSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination)
  {
    String type = getRequestString("type");
    Integer armType = getAlarmType(type);
    List<QueryScalar> countScalars = new ArrayList();
    countScalars.add(new QueryScalar("param1Sum", Hibernate.INTEGER));
    List<DeviceAlarmSummary> lstAlarmSummary = this.deviceAlarmService.summaryDeviceAlarm(begintime, endtime, 
      devices, getAlarmTypeList(type), null, "group by DevIDNO, ArmType", "sum(param2) as param1Sum ", countScalars, false, null, null, null, null);
    
    Map<String, DeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary);
    List<ReportSummary> parkSummarys = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      ReportSummary summary = new ReportSummary();
      summary.setDevIdno(devices[i]);
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], armType)));
      if ((summary.getBeginTime() != null) && (summary.getEndTime() != null) && (summary.getCounts() != null)) {
        parkSummarys.add(summary);
      }
    }
    int start = 0;int index = parkSummarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(parkSummarys.size());
      if (parkSummarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<ReportSummary> parkSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      parkSummarys2.add((ReportSummary)parkSummarys.get(i));
    }
    AjaxDto<ReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(parkSummarys2);
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
        
        AjaxDto<ReportSummary> parkSummarys = doSummary(begintime, endtime, query.getDevIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", parkSummarys.getPageList());
        
        addCustomResponse("pagination", parkSummarys.getPagination());
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
      String type = getRequestString("type");
      String parkTime = getRequestString("parkTime");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (parkTime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), getAlarmTypeList(type), String.format("and Param1 >= %s order by armTime asc ", new Object[] { parkTime }), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
        List<DeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null) {
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            DeviceAlarm deviceAlarm = (DeviceAlarm)deviceAlarms.get(i);
            deviceAlarm.setArmTimeStr(DateUtil.dateSwitchString(new Date(deviceAlarm.getArmTime().getTime() - deviceAlarm.getParam2().intValue() * 1000)));
            deviceAlarm.setGpsTimeStr(DateUtil.dateSwitchString(deviceAlarm.getArmTime()));
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
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = getText("report.park.count");
    heads[5] = getText("report.park.totaltime");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<ReportSummary> parkSummarys = doSummary(begintime, endtime, devIdnos.split(","), null);
    for (int i = 1; i <= parkSummarys.getPageList().size(); i++)
    {
      ReportSummary summary = (ReportSummary)parkSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getBeginTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        
        List<Integer> ioinCOunts = summary.getCounts();
        export.setCellValue(Integer.valueOf(j++), ioinCOunts.get(0));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(summary.getParam1Sum().intValue(), getText("report.hour"), 
          getText("report.minute"), getText("report.second")));
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    String type = getRequestString("type");
    if ((type != null) && (!type.isEmpty())) {
      return getText("report.park.summary.accon");
    }
    return getText("report.park.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = getText("report.park.time");
    heads[5] = getText("report.park.position");
    heads[6] = (getText("report.currentLiCheng") + getLiChengUnit());
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String type = getRequestString("type");
    String parkTime = getRequestString("parkTime");
    
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getAlarmTypeList(type), String.format("and Param1 >= %s order by armTime asc ", new Object[] { parkTime }), null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(alarm.getArmTime().getTime() - alarm.getParam1().intValue() * 1000)));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(alarm.getParam1().intValue(), getText("report.hour"), 
          getText("report.minute"), getText("report.second")));
        if (isGpsValid(alarm.getStatus1()))
        {
          if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(alarm.getJingDu(), alarm.getWeiDu(), toMap.intValue()));
          } else if ((alarm.getJingDu() == null) || (alarm.getJingDu().intValue() == 0) || 
            (alarm.getWeiDu() == null) || (alarm.getWeiDu().intValue() == 0)) {
            export.setCellValue(Integer.valueOf(j++), "");
          } else {
            export.setCellValue(Integer.valueOf(j++), getPosition(alarm.getWeiDu(), alarm.getJingDu(), alarm.getStatus1()));
          }
        }
        else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), getLiCheng(alarm.getLiCheng()));
      }
    }
  }
  
  protected String genDetailTitle()
  {
    String type = getRequestString("type");
    if ((type != null) && (!type.isEmpty())) {
      return getText("report.park.detail.accon");
    }
    return getText("report.park.detail");
  }
}
