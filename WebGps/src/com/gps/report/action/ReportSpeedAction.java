package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.DeviceTrack;
import com.gps.report.vo.ReportSummary;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportSpeedAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_SPEED);
  }
  
  protected String getSpeedSummaryKey(String devIdno, Integer armInfo)
  {
    return devIdno + "-" + armInfo;
  }
  
  protected Map<String, DeviceAlarmSummary> listAlarmSummary2map(List<DeviceAlarmSummary> alarmSummary)
  {
    Map<String, DeviceAlarmSummary> mapSummary = new HashMap();
    for (int i = 0; i < alarmSummary.size(); i++)
    {
      DeviceAlarmSummary summary = (DeviceAlarmSummary)alarmSummary.get(i);
      mapSummary.put(getSpeedSummaryKey(summary.getDevIdno(), summary.getArmInfo()), summary);
    }
    return mapSummary;
  }
  
  protected AjaxDto<ReportSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(11));
    List<DeviceAlarmSummary> lstAlarmSummary = this.deviceAlarmService.summaryDeviceAlarm(begintime, endtime, 
      devices, lstArmType, null, "group by DevIDNO, ArmInfo, ArmType", null, null, true, queryFilter, qtype, sortname, sortorder);
    Map<String, DeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2map(lstAlarmSummary);
    List<ReportSummary> speedSummarys = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      ReportSummary summary = new ReportSummary();
      summary.setDevIdno(devices[i]);
      
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getSpeedSummaryKey(devices[i], Integer.valueOf(0))));
      
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getSpeedSummaryKey(devices[i], Integer.valueOf(1))));
      if ((summary.getBeginTime() != null) && (summary.getEndTime() != null) && (summary.getCounts() != null)) {
        speedSummarys.add(summary);
      }
    }
    int start = 0;int index = speedSummarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(speedSummarys.size());
      if (speedSummarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<ReportSummary> speedSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      speedSummarys2.add((ReportSummary)speedSummarys.get(i));
    }
    AjaxDto<ReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(speedSummarys2);
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
        
        AjaxDto<ReportSummary> speedSummarys = doSummary(begintime, endtime, query.getDevIdnos().split(","), getPaginationEx(), null, null, null, null);
        addCustomResponse("infos", speedSummarys.getPageList());
        
        addCustomResponse("pagination", speedSummarys.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected List<Integer> getSpeedQueryType(String speedAlarmType)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(11));
    lstArmType.add(Integer.valueOf(61));
    return lstArmType;
  }
  
  protected String getAlarmCondition(String speedAlarmType)
  {
    String condition = "";
    if (speedAlarmType.equals("1")) {
      condition = "and armInfo = 0 ";
    } else if (speedAlarmType.equals("2")) {
      condition = "and armInfo = 1 ";
    }
    return condition;
  }
  
  public String alarm()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String speedAlarmType = getRequestString("speedAlarmType");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (speedAlarmType == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), getSpeedQueryType(speedAlarmType), getAlarmCondition(speedAlarmType), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
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
  
  public String detail()
    throws Exception
  {
    queryGpsTrack(null, null, getPaginationEx());
    return "success";
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = getText("report.speed.total");
    heads[5] = getText("report.speed.totalOver");
    heads[6] = getText("report.speed.totalLow");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<ReportSummary> speedSummarys = doSummary(begintime, endtime, devIdnos.split(","), null, null, null, null, null);
    for (int i = 1; i <= speedSummarys.getPageList().size(); i++)
    {
      ReportSummary summary = (ReportSummary)speedSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getBeginTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        List<Integer> speedCounts = summary.getCounts();
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(((Integer)speedCounts.get(0)).intValue() + ((Integer)speedCounts.get(1)).intValue()));
        
        export.setCellValue(Integer.valueOf(j++), speedCounts.get(0));
        
        export.setCellValue(Integer.valueOf(j++), speedCounts.get(1));
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.speed.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[4] = getText("report.speed.type");
    heads[5] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String speedAlarmType = getRequestString("speedAlarmType");
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getSpeedQueryType(speedAlarmType), getAlarmCondition(speedAlarmType), null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        
        export.setCellValue(Integer.valueOf(j++), getSpeed(Integer.valueOf(alarm.getParam1().intValue() / 10), alarm.getStatus1()));
        String type;
        
        if (alarm.getArmInfo().equals(Integer.valueOf(0))) {
          type = getText("report.speed.over");
        } else {
          type = getText("report.speed.low");
        }
        if (alarm.getArmType().equals(Integer.valueOf(11))) {
          type = type + "  " + getText("report.alramBegin");
        } else {
          type = type + "  " + getText("report.alramEnd");
        }
        export.setCellValue(Integer.valueOf(j++), type);
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
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.speed.detail");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[5];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[4] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String devIdno, ExportReport export)
  {
    try
    {
      AjaxDto<DeviceTrack> ajaxDto = this.deviceGpsService.queryDeviceGps(devIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), 0, 0, null, null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          DeviceTrack track = (DeviceTrack)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(track.getDevIdno()));
          
          export.setCellValue(Integer.valueOf(j++), track.getGpsTime());
          
          export.setCellValue(Integer.valueOf(j++), getSpeed(track.getSpeed(), track.getStatus1()));
          if (isGpsValid(track.getStatus1()))
          {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              export.setCellValue(Integer.valueOf(j++), getMapPosition(track.getJingDu(), track.getWeiDu(), toMap.intValue()));
            } else if ((track.getJingDu() == null) || (track.getJingDu().intValue() == 0) || 
              (track.getWeiDu() == null) || (track.getWeiDu().intValue() == 0)) {
              export.setCellValue(Integer.valueOf(j++), "");
            } else {
              export.setCellValue(Integer.valueOf(j++), getPosition(track.getWeiDu(), track.getJingDu(), track.getStatus1()));
            }
          }
          else {
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
    return getText("report.speed.track");
  }
}
