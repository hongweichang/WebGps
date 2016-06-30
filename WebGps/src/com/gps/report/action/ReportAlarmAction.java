package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.utils.StringUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.ReportSummary;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportAlarmAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_ALARM);
  }
  
  AjaxDto<ReportSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(16));
    lstArmType.add(Integer.valueOf(18));
    lstArmType.add(Integer.valueOf(2));
    lstArmType.add(Integer.valueOf(6));
    lstArmType.add(Integer.valueOf(15));
    lstArmType.add(Integer.valueOf(4));
    lstArmType.add(Integer.valueOf(3));
    lstArmType.add(Integer.valueOf(155));
    lstArmType.add(Integer.valueOf(159));
    lstArmType.add(Integer.valueOf(161));
    lstArmType.add(Integer.valueOf(166));
    
    List<DeviceAlarmSummary> lstAlarmSummary = this.deviceAlarmService.summaryDeviceAlarm(begintime, endtime, 
      devices, lstArmType, null, "group by DevIDNO, ArmType", null, null, false, null, null, null, null);
    Map<String, DeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary);
    List<ReportSummary> alarmSummarys = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      ReportSummary summary = new ReportSummary();
      summary.setDevIdno(devices[i]);
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(16))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(18))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(2))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(6))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(15))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(4))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(3))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(155))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(159))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(10))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(161))));
      summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(166))));
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
    List<ReportSummary> alarmSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      alarmSummarys2.add((ReportSummary)alarmSummarys.get(i));
    }
    AjaxDto<ReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(alarmSummarys2);
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
        
        AjaxDto<ReportSummary> alarmSummarys = doSummary(begintime, endtime, query.getDevIdnos().split(","), getPaginationEx());
        
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
  
  public String alarmDetail(List<Integer> lstArmType)
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
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), lstArmType, null, getPaginationEx(), queryFilter, qtype, sortname, sortorder);
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
  
  public String allDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(11));
    lstArmType.add(Integer.valueOf(61));
    for (int i = 0; i < 12; i++) {
      if (i < 8)
      {
        lstArmType.add(Integer.valueOf(19 + i));
        lstArmType.add(Integer.valueOf(69 + i));
      }
      else
      {
        lstArmType.add(Integer.valueOf(41 + i - 8));
        lstArmType.add(Integer.valueOf(91 + i - 8));
      }
    }
    lstArmType.add(Integer.valueOf(16));
    lstArmType.add(Integer.valueOf(66));
    lstArmType.add(Integer.valueOf(18));
    lstArmType.add(Integer.valueOf(68));
    lstArmType.add(Integer.valueOf(2));
    lstArmType.add(Integer.valueOf(52));
    lstArmType.add(Integer.valueOf(6));
    lstArmType.add(Integer.valueOf(56));
    lstArmType.add(Integer.valueOf(15));
    lstArmType.add(Integer.valueOf(65));
    lstArmType.add(Integer.valueOf(4));
    lstArmType.add(Integer.valueOf(54));
    lstArmType.add(Integer.valueOf(3));
    lstArmType.add(Integer.valueOf(53));
    lstArmType.add(Integer.valueOf(155));
    lstArmType.add(Integer.valueOf(156));
    lstArmType.add(Integer.valueOf(159));
    lstArmType.add(Integer.valueOf(160));
    lstArmType.add(Integer.valueOf(161));
    lstArmType.add(Integer.valueOf(10));
    lstArmType.add(Integer.valueOf(60));
    lstArmType.add(Integer.valueOf(157));
    lstArmType.add(Integer.valueOf(158));
    lstArmType.add(Integer.valueOf(166));
    lstArmType.add(Integer.valueOf(167));
    return alarmDetail(lstArmType);
  }
  
  public String gpssinnalDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(18));
    lstArmType.add(Integer.valueOf(68));
    return alarmDetail(lstArmType);
  }
  
  public String urgencyButtonDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(2));
    lstArmType.add(Integer.valueOf(52));
    return alarmDetail(lstArmType);
  }
  
  public String doorOpenDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(6));
    lstArmType.add(Integer.valueOf(56));
    return alarmDetail(lstArmType);
  }
  
  public String motionDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(15));
    lstArmType.add(Integer.valueOf(65));
    return alarmDetail(lstArmType);
  }
  
  public String shakeDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(3));
    lstArmType.add(Integer.valueOf(53));
    return alarmDetail(lstArmType);
  }
  
  public String videoLostDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(4));
    lstArmType.add(Integer.valueOf(54));
    return alarmDetail(lstArmType);
  }
  
  public String fatigueDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(49));
    lstArmType.add(Integer.valueOf(99));
    return alarmDetail(lstArmType);
  }
  
  public String accDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(16));
    lstArmType.add(Integer.valueOf(66));
    return alarmDetail(lstArmType);
  }
  
  public String nightDrivingDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(151));
    lstArmType.add(Integer.valueOf(152));
    return alarmDetail(lstArmType);
  }
  
  public String upsCutDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(155));
    lstArmType.add(Integer.valueOf(156));
    return alarmDetail(lstArmType);
  }
  
  public String boardOpenedDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(159));
    lstArmType.add(Integer.valueOf(160));
    return alarmDetail(lstArmType);
  }
  
  public String turnOffDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(161));
    return alarmDetail(lstArmType);
  }
  
  public String simLostDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(166));
    lstArmType.add(Integer.valueOf(167));
    return alarmDetail(lstArmType);
  }
  
  public String extendAlarmDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    String armType = getRequestString("armType");
    if ((armType == null) || (armType.isEmpty()) || (armType.equals("0")))
    {
      lstArmType.add(Integer.valueOf(35));
      lstArmType.add(Integer.valueOf(36));
    }
    else
    {
      lstArmType.add(Integer.valueOf(Integer.parseInt(armType)));
    }
    return alarmDetail(lstArmType);
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[15];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = (getText("report.alarm.accon") + getText("report.labelCount"));
    heads[5] = (getText("report.alarm.gpssignnal") + getText("report.labelCount"));
    heads[6] = (getText("report.alarm.urgencybutton") + getText("report.labelCount"));
    heads[7] = (getText("report.alarm.opendoor") + getText("report.labelCount"));
    heads[9] = (getText("report.alarm.motion") + getText("report.labelCount"));
    heads[8] = (getText("report.alarm.videolost") + getText("report.labelCount"));
    heads[10] = (getText("report.alarm.shake") + getText("report.labelCount"));
    heads[11] = (getText("report.alarm.upsCut") + getText("report.labelCount"));
    heads[12] = (getText("report.alarm.boardOpened") + getText("report.labelCount"));
    heads[13] = (getText("report.alarm.turnOff") + getText("report.labelCount"));
    heads[14] = (getText("report.alarm.simLost") + getText("report.labelCount"));
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<ReportSummary> alarmSummarys = doSummary(begintime, endtime, devIdnos.split(","), null);
    for (int i = 1; i <= alarmSummarys.getPageList().size(); i++)
    {
      ReportSummary summary = (ReportSummary)alarmSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getBeginTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        List<Integer> counts = summary.getCounts();
        for (int k = 0; k < 11; k++) {
          export.setCellValue(Integer.valueOf(j++), counts.get(k));
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.alarm.summary");
  }
  
  protected boolean isGpsSignnal()
  {
    String type = getRequest().getParameter("type");
    return type.equals("gpssignnal");
  }
  
  protected boolean isUrgencyButton()
  {
    String type = getRequest().getParameter("type");
    return type.equals("urgencybutton");
  }
  
  protected boolean isDoorOpen()
  {
    String type = getRequest().getParameter("type");
    return type.equals("dooropen");
  }
  
  protected boolean isMotion()
  {
    String type = getRequest().getParameter("type");
    return type.equals("motion");
  }
  
  protected boolean isShake()
  {
    String type = getRequest().getParameter("type");
    return type.equals("shake");
  }
  
  protected boolean isVideoLost()
  {
    String type = getRequest().getParameter("type");
    return type.equals("videoLost");
  }
  
  protected boolean isFatigue()
  {
    String type = getRequest().getParameter("type");
    return type.equals("fatigue");
  }
  
  protected boolean isExtendAlarm()
  {
    String type = getRequest().getParameter("type");
    return type.equals("extendAlarm");
  }
  
  protected boolean isAcc()
  {
    String type = getRequest().getParameter("type");
    return type.equals("acc");
  }
  
  protected boolean isNightDriving()
  {
    String type = getRequest().getParameter("type");
    return type.equals("night");
  }
  
  protected boolean isUPSCut()
  {
    String type = getRequest().getParameter("type");
    return type.equals("upsCut");
  }
  
  protected boolean isBoardOpened()
  {
    String type = getRequest().getParameter("type");
    return type.equals("boardOpened");
  }
  
  protected boolean isTurnOff()
  {
    String type = getRequest().getParameter("type");
    return type.equals("turnOff");
  }
  
  protected boolean isAll()
  {
    String type = getRequest().getParameter("type");
    return type.equals("all");
  }
  
  protected boolean isSimLost()
  {
    String type = getRequest().getParameter("type");
    return type.equals("simlost");
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    if (isGpsSignnal())
    {
      lstArmType.add(Integer.valueOf(18));
      lstArmType.add(Integer.valueOf(68));
    }
    else if (isUrgencyButton())
    {
      lstArmType.add(Integer.valueOf(2));
      lstArmType.add(Integer.valueOf(52));
    }
    else if (isDoorOpen())
    {
      lstArmType.add(Integer.valueOf(6));
      lstArmType.add(Integer.valueOf(56));
    }
    else if (isMotion())
    {
      lstArmType.add(Integer.valueOf(15));
      lstArmType.add(Integer.valueOf(65));
    }
    else if (isShake())
    {
      lstArmType.add(Integer.valueOf(3));
      lstArmType.add(Integer.valueOf(53));
    }
    else if (isVideoLost())
    {
      lstArmType.add(Integer.valueOf(4));
      lstArmType.add(Integer.valueOf(54));
    }
    else if (isFatigue())
    {
      lstArmType.add(Integer.valueOf(49));
      lstArmType.add(Integer.valueOf(99));
    }
    else if (isAcc())
    {
      lstArmType.add(Integer.valueOf(16));
      lstArmType.add(Integer.valueOf(66));
    }
    else if (isNightDriving())
    {
      lstArmType.add(Integer.valueOf(151));
      lstArmType.add(Integer.valueOf(152));
    }
    else if (isUPSCut())
    {
      lstArmType.add(Integer.valueOf(155));
      lstArmType.add(Integer.valueOf(156));
    }
    else if (isBoardOpened())
    {
      lstArmType.add(Integer.valueOf(159));
      lstArmType.add(Integer.valueOf(160));
    }
    else if (isTurnOff())
    {
      lstArmType.add(Integer.valueOf(161));
    }
    else if (isAll())
    {
      lstArmType.add(Integer.valueOf(11));
      lstArmType.add(Integer.valueOf(61));
      for (int i = 0; i < 12; i++) {
        if (i < 8)
        {
          lstArmType.add(Integer.valueOf(19 + i));lstArmType.add(Integer.valueOf(69 + i));
        }
        else
        {
          lstArmType.add(Integer.valueOf(41 + i - 8));
          lstArmType.add(Integer.valueOf(91 + i - 8));
        }
      }
      lstArmType.add(Integer.valueOf(16));
      lstArmType.add(Integer.valueOf(66));
      lstArmType.add(Integer.valueOf(18));
      lstArmType.add(Integer.valueOf(68));
      lstArmType.add(Integer.valueOf(2));
      lstArmType.add(Integer.valueOf(52));
      lstArmType.add(Integer.valueOf(6));
      lstArmType.add(Integer.valueOf(56));
      lstArmType.add(Integer.valueOf(15));
      lstArmType.add(Integer.valueOf(65));
      lstArmType.add(Integer.valueOf(4));
      lstArmType.add(Integer.valueOf(54));
      lstArmType.add(Integer.valueOf(3));
      lstArmType.add(Integer.valueOf(53));
      lstArmType.add(Integer.valueOf(155));
      lstArmType.add(Integer.valueOf(156));
      lstArmType.add(Integer.valueOf(159));
      lstArmType.add(Integer.valueOf(160));
      lstArmType.add(Integer.valueOf(161));
      lstArmType.add(Integer.valueOf(10));
      lstArmType.add(Integer.valueOf(60));
      lstArmType.add(Integer.valueOf(157));
      lstArmType.add(Integer.valueOf(158));
      lstArmType.add(Integer.valueOf(166));
      lstArmType.add(Integer.valueOf(167));
    }
    else if (isSimLost())
    {
      lstArmType.add(Integer.valueOf(166));
      lstArmType.add(Integer.valueOf(167));
    }
    else if (isExtendAlarm())
    {
      String armType = getRequestString("armType");
      if ((armType == null) || (armType.isEmpty()) || (armType.equals("0")))
      {
        lstArmType.add(Integer.valueOf(35));
        lstArmType.add(Integer.valueOf(36));
      }
      else
      {
        lstArmType.add(Integer.valueOf(Integer.parseInt(armType)));
      }
    }
    return lstArmType;
  }
  
  protected String[] genDetailHeads()
  {
    if ((isGpsSignnal()) || (isUrgencyButton()) || (isDoorOpen()) || (isFatigue()) || (isAcc()) || (isNightDriving()) || (isUPSCut()) || (isBoardOpened()) || (isTurnOff()) || (isSimLost()))
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.type");
      heads[4] = getText("report.currentPosition");
      return heads;
    }
    if ((isShake()) || (isAll()))
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.type");
      heads[4] = getText("report.content");
      heads[5] = getText("report.currentPosition");
      return heads;
    }
    if ((isMotion()) || (isVideoLost()))
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.channel.name");
      heads[4] = getText("report.type");
      heads[5] = getText("report.currentPosition");
      return heads;
    }
    if (isExtendAlarm())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.terminal");
      heads[2] = getText("report.time");
      heads[3] = getText("report.type");
      heads[4] = getText("report.currentPosition");
      heads[5] = getText("report.desc");
      return heads;
    }
    return null;
  }
  
  protected String getAlarmTypeName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 18: 
    case 68: 
      ret = getText("report.alarm.gpssignnal");
      break;
    case 6: 
    case 56: 
      ret = getText("report.alarm.opendoor");
      break;
    case 3: 
    case 53: 
      ret = getText("report.alarm.shake");
      break;
    case 15: 
    case 65: 
      ret = getText("report.alarm.motion");
      break;
    case 2: 
    case 52: 
      ret = getText("report.alarm.urgencybutton");
      break;
    case 10: 
    case 60: 
      ret = getText("report.alarm.diskerror");
      break;
    case 4: 
    case 54: 
      ret = getText("report.alarm.videolost");
      break;
    case 49: 
    case 99: 
      ret = getText("report.alarm.fatigue");
      break;
    case 16: 
      ret = getText("report.alarm.accon");
      break;
    case 66: 
      ret = getText("report.alarm.accoff");
      break;
    case 35: 
      ret = getText("report.alarm.fire");
      break;
    case 36: 
      ret = getText("report.alarm.panic");
      break;
    case 151: 
    case 152: 
      ret = getText("report.alarm.nightDriving");
      break;
    case 155: 
    case 156: 
      ret = getText("report.alarm.upsCut");
      break;
    case 157: 
    case 158: 
      ret = getText("report.alarm.highTemperature");
      break;
    case 159: 
    case 160: 
      ret = getText("report.alarm.boardOpened");
      break;
    case 161: 
      ret = getText("report.alarm.turnOff");
      break;
    case 166: 
    case 167: 
      ret = getText("report.alarm.simLost");
    }
    return ret;
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
  
  protected void genAlarmExcelData(List<DeviceAlarm> lstAlarm, Integer toMap, ExportReport export)
  {
    if (((isGpsSignnal()) || (isUrgencyButton()) || (isDoorOpen()) || (isMotion()) || (isShake()) || (isExtendAlarm()) || 
      (isFatigue()) || (isVideoLost()) || (isAcc()) || (isNightDriving()) || (isUPSCut()) || (isBoardOpened()) || (isTurnOff()) || (isAll()) || (isSimLost())) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        if ((isMotion()) || (isVideoLost())) {
          export.setCellValue(Integer.valueOf(j++), getDeviceChannelInSession(alarm.getDevIdno(), getAlarmChannel(alarm.getArmInfo().intValue())));
        }
        if ((isExtendAlarm()) || (isAcc()) || (isTurnOff())) {
          export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()));
        } else if (isAll())
        {
          if ((alarm.getArmType().intValue() == 16) || 
            (alarm.getArmType().intValue() == 66) || 
            (alarm.getArmType().intValue() == 161))
          {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()));
          }
          else if ((alarm.getArmType().intValue() == 11) || 
            (alarm.getArmType().intValue() == 61))
          {
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
          }
          else if ((alarm.getArmType().intValue() == 11) || 
            (alarm.getArmType().intValue() == 18) || 
            (alarm.getArmType().intValue() == 2) || 
            (alarm.getArmType().intValue() == 6) || 
            (alarm.getArmType().intValue() == 15) || 
            (alarm.getArmType().intValue() == 4) || 
            (alarm.getArmType().intValue() == 3) || 
            (alarm.getArmType().intValue() == 155) || 
            (alarm.getArmType().intValue() == 159) || 
            (alarm.getArmType().intValue() == 157) || 
            (alarm.getArmType().intValue() == 10) || 
            (alarm.getArmType().intValue() == 166))
          {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramBegin"));
          }
          else if ((alarm.getArmType().intValue() == 61) || 
            (alarm.getArmType().intValue() == 68) || 
            (alarm.getArmType().intValue() == 52) || 
            (alarm.getArmType().intValue() == 56) || 
            (alarm.getArmType().intValue() == 65) || 
            (alarm.getArmType().intValue() == 54) || 
            (alarm.getArmType().intValue() == 53) || 
            (alarm.getArmType().intValue() == 156) || 
            (alarm.getArmType().intValue() == 160) || 
            (alarm.getArmType().intValue() == 158) || 
            (alarm.getArmType().intValue() == 60) || 
            (alarm.getArmType().intValue() == 167))
          {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramEnd"));
          }
          else
          {
            int ioinIndex = 0;
            String type;
           
            if (alarm.getArmType().intValue() <= 26)
            {
              ioinIndex = alarm.getArmType().intValue() - 19;
              type = getText("report.alramBegin");
            }
            else
            {
             
              if (alarm.getArmType().intValue() <= 44)
              {
                ioinIndex = alarm.getArmType().intValue() - 41 + 8;
                type = getText("report.alramBegin");
              }
              else
              {
                
                if (alarm.getArmType().intValue() <= 76)
                {
                  ioinIndex = alarm.getArmType().intValue() - 69;
                  type = getText("report.alramEnd");
                }
                else
                {
                  ioinIndex = alarm.getArmType().intValue() - 91 + 8;
                  type = getText("report.alramEnd");
                }
              }
            }
            export.setCellValue(Integer.valueOf(j++), getDeviceIoinInSession(alarm.getDevIdno(), ioinIndex) + "  " + type);
          }
        }
        else if ((alarm.getArmType().intValue() <= 26) || 
          (alarm.getArmType().intValue() == 155) || 
          (alarm.getArmType().intValue() == 49) || 
          (alarm.getArmType().intValue() == 151) || 
          (alarm.getArmType().intValue() == 159) || 
          (alarm.getArmType().intValue() == 166)) {
          export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramBegin"));
        } else {
          export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramEnd"));
        }
        if (isShake())
        {
          int armInfo = 0;
          if (alarm.getArmInfo() != null) {
            armInfo = alarm.getArmInfo().intValue();
          }
          ArrayList<String> dirInfo = new ArrayList();
          if ((armInfo >> 0 & 0x1) > 0) {
            dirInfo.add("X");
          }
          if ((armInfo >> 1 & 0x1) > 0) {
            dirInfo.add("Y");
          }
          if ((armInfo >> 2 & 0x1) > 0) {
            dirInfo.add("Z");
          }
          if ((dirInfo.size() != 0) && (dirInfo.size() > 0))
          {
            String[] stringArr = new String[dirInfo.size()];
            dirInfo.toArray(stringArr);
            export.setCellValue(Integer.valueOf(j++), getText("direction") + " " + StringUtil.join(stringArr, ", "));
          }
          else
          {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
        else if (isAll())
        {
          if ((alarm.getArmType().intValue() == 11) || (alarm.getArmType().intValue() == 61))
          {
            export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getSpeed(), alarm.getStatus1()));
          }
          else if ((alarm.getArmType().intValue() == 15) || 
            (alarm.getArmType().intValue() == 4) || 
            (alarm.getArmType().intValue() == 65) || 
            (alarm.getArmType().intValue() == 54))
          {
            export.setCellValue(Integer.valueOf(j++), getDeviceChannelInSession(alarm.getDevIdno(), getAlarmChannel(alarm.getArmInfo().intValue())));
          }
          else if ((alarm.getArmType().intValue() == 16) || 
            (alarm.getArmType().intValue() == 66) || 
            (alarm.getArmType().intValue() == 161) || 
            (alarm.getArmType().intValue() == 18) || 
            (alarm.getArmType().intValue() == 2) || 
            (alarm.getArmType().intValue() == 6) || 
            (alarm.getArmType().intValue() == 3) || 
            (alarm.getArmType().intValue() == 155) || 
            (alarm.getArmType().intValue() == 159) || 
            (alarm.getArmType().intValue() == 10) || 
            (alarm.getArmType().intValue() == 166) || 
            (alarm.getArmType().intValue() == 68) || 
            (alarm.getArmType().intValue() == 52) || 
            (alarm.getArmType().intValue() == 56) || 
            (alarm.getArmType().intValue() == 53) || 
            (alarm.getArmType().intValue() == 156) || 
            (alarm.getArmType().intValue() == 160) || 
            (alarm.getArmType().intValue() == 60) || 
            (alarm.getArmType().intValue() == 167))
          {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()));
          }
          else if ((alarm.getArmType().intValue() == 157) || 
            (alarm.getArmType().intValue() == 158))
          {
            String str = "";
            if (alarm.getArmInfo() != null) {
              str = str + getText("dardnumbers") + (alarm.getArmInfo().intValue() + 1) + ", ";
            }
            if (alarm.getParam1() != null) {
              switch (alarm.getParam1().intValue())
              {
              case 1: 
                str = str + getText("report.type") + ":" + getText("sdcard");
                break;
              case 2: 
                str = str + getText("report.type") + ":" + getText("harddisk");
                break;
              case 3: 
                str = str + getText("report.type") + ":" + getText("ssd");
              }
            }
            if (alarm.getParam2() != null) {
              str = str + ", " + getText("report.tempsensor.name") + ":" + alarm.getParam2() + " ";
            }
            export.setCellValue(Integer.valueOf(j++), str);
          }
          else
          {
            int ioinIndex = 0;
            String type;
            
            if (alarm.getArmType().intValue() <= 26)
            {
              ioinIndex = alarm.getArmType().intValue() - 19;
              type = getText("report.alramBegin");
            }
            else
            {
           
              if (alarm.getArmType().intValue() <= 44)
              {
                ioinIndex = alarm.getArmType().intValue() - 41 + 8;
                type = getText("report.alramBegin");
              }
              else
              {
               
                if (alarm.getArmType().intValue() <= 76)
                {
                  ioinIndex = alarm.getArmType().intValue() - 69;
                  type = getText("report.alramEnd");
                }
                else
                {
                  ioinIndex = alarm.getArmType().intValue() - 91 + 8;
                  type = getText("report.alramEnd");
                }
              }
            }
            export.setCellValue(Integer.valueOf(j++), getDeviceIoinInSession(alarm.getDevIdno(), ioinIndex) + "  " + type);
          }
        }
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
        if (isExtendAlarm()) {
          export.setCellValue(Integer.valueOf(j++), alarm.getArmDesc());
        }
      }
    }
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getAlarmQueryType(), null, null, queryFilter, qtype, sortname, sortorder);
    genAlarmExcelData(ajaxDto.getPageList(), toMap, export);
  }
  
  protected String genDetailTitle()
  {
    if (isGpsSignnal()) {
      return getText("report.alarm.detail.gpssignnal");
    }
    if (isUrgencyButton()) {
      return getText("report.alarm.detail.urgencybutton");
    }
    if (isDoorOpen()) {
      return getText("report.alarm.detail.opendoor");
    }
    if (isMotion()) {
      return getText("report.alarm.detail.motion");
    }
    if (isShake()) {
      return getText("report.alarm.detail.shake");
    }
    if (isVideoLost()) {
      return getText("report.alarm.detail.videolost");
    }
    if (isFatigue()) {
      return getText("report.alarm.detail.fatigue");
    }
    if (isExtendAlarm()) {
      return getText("report.alarm.detail.extend");
    }
    if (isAcc()) {
      return getText("report.alarm.detail.acc");
    }
    if (isNightDriving()) {
      return getText("report.alarm.detail.nightdriving");
    }
    if (isUPSCut()) {
      return getText("report.alarm.detail.upscut");
    }
    if (isBoardOpened()) {
      return getText("report.alarm.detail.boardopened");
    }
    if (isTurnOff()) {
      return getText("report.alarm.detail.turnoff");
    }
    if (isAll()) {
      return getText("report.alarm.detail.all");
    }
    if (isSimLost()) {
      return getText("report.alarm.detail.simlost");
    }
    return "";
  }
}
