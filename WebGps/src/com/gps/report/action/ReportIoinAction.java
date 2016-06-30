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
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.ReportSummary;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportIoinAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private static final int IOIN_COUNT = 12;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_IOIN);
  }
  
  protected AjaxDto<ReportSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    List<Integer> lstArmType = new ArrayList();
    for (int i = 0; i < 12; i++) {
      if (i < 8) {
        lstArmType.add(Integer.valueOf(19 + i));
      } else {
        lstArmType.add(Integer.valueOf(41 + i - 8));
      }
    }
    List<DeviceAlarmSummary> lstAlarmSummary = this.deviceAlarmService.summaryDeviceAlarm(begintime, endtime, 
      devices, lstArmType, null, "group by DevIDNO, ArmType", null, null, false, queryFilter, qtype, sortname, sortorder);
    Map<String, DeviceAlarmSummary> mapAlarmSummary = listAlarmSummary2mapByDeviceArmTypeKey(lstAlarmSummary);
    List<ReportSummary> ioinSummarys = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      ReportSummary summary = new ReportSummary();
      summary.setDevIdno(devices[i]);
      for (int j = 0; j < 12; j++)
      {
        int nArmType = 19 + j;
        if (j >= 8) {
          nArmType = 41 + j - 8;
        }
        summaryAlarmReport(summary, (DeviceAlarmSummary)mapAlarmSummary.get(getDeviceArmTypeKey(devices[i], Integer.valueOf(nArmType))));
      }
      if ((summary.getBeginTime() != null) && (summary.getEndTime() != null) && (summary.getCounts() != null)) {
        ioinSummarys.add(summary);
      }
    }
    int start = 0;int index = ioinSummarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(ioinSummarys.size());
      if (ioinSummarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<ReportSummary> ioinSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      ioinSummarys2.add((ReportSummary)ioinSummarys.get(i));
    }
    AjaxDto<ReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(ioinSummarys2);
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
        
        AjaxDto<ReportSummary> ioinSummarys = doSummary(begintime, endtime, query.getDevIdnos().split(","), getPaginationEx(), null, null, null, null);
        
        addCustomResponse("infos", ioinSummarys.getPageList());
        
        addCustomResponse("pagination", ioinSummarys.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected List<Integer> getIoinQueryType(String ioinType)
  {
    List<Integer> lstArmType = new ArrayList();
    Integer ioin = Integer.valueOf(Integer.parseInt(ioinType));
    if (ioin.intValue() == 0)
    {
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
    }
    else if (ioin.intValue() <= 8)
    {
      lstArmType.add(Integer.valueOf(19 + ioin.intValue() - 1));
      lstArmType.add(Integer.valueOf(69 + ioin.intValue() - 1));
    }
    else
    {
      lstArmType.add(Integer.valueOf(41 + ioin.intValue() - 8 - 1));
      lstArmType.add(Integer.valueOf(91 + ioin.intValue() - 8 - 1));
    }
    return lstArmType;
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String ioinType = getRequestString("ioinType");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (ioinType == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        List<Integer> lstArmType = getIoinQueryType(ioinType);
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
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[5];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.type");
    heads[4] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String ioinType = getRequest().getParameter("ioinType");
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getIoinQueryType(ioinType), null, null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        
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
    return getText("report.ioin.detail");
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[20];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    for (int i = 0; i < 12; i++) {
      heads[(4 + i)] = (getText("report.ioin.name") + (i + 1) + getText("report.labelCount"));
    }
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<ReportSummary> ioinSummarys = doSummary(begintime, endtime, devIdnos.split(","), null, null, null, null, null);
    for (int i = 1; i <= ioinSummarys.getPageList().size(); i++)
    {
      ReportSummary summary = (ReportSummary)ioinSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getBeginTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        List<Integer> ioinCOunts = summary.getCounts();
        for (int k = 0; k < 12; k++) {
          export.setCellValue(Integer.valueOf(j++), ioinCOunts.get(k));
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.ioin.summary");
  }
}
