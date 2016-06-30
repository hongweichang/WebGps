package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.model.DeviceNetFlow;
import com.gps.report.service.DeviceNetFlowService;
import com.gps.report.vo.DeviceNetflowSummary;
import com.gps.report.vo.DeviceQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportNetFlowAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DeviceNetFlowService deviceNetFlowService;
  
  public DeviceNetFlowService getDeviceNetFlowService()
  {
    return this.deviceNetFlowService;
  }
  
  public void setDeviceNetFlowService(DeviceNetFlowService deviceNetFlowService)
  {
    this.deviceNetFlowService = deviceNetFlowService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_NETFLOW);
  }
  
  protected Map<String, DeviceNetFlow> listDeviceNetFlow2map(List<DeviceNetFlow> listNetFlow)
  {
    Map<String, DeviceNetFlow> mapNetflow = new HashMap();
    for (int i = 0; i < listNetFlow.size(); i++)
    {
      DeviceNetFlow flow = (DeviceNetFlow)listNetFlow.get(i);
      mapNetflow.put(flow.getDevIdno(), flow);
    }
    return mapNetflow;
  }
  
  public String summary()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begindate");
      String endDate = getRequestString("enddate");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String[] allDevices = query.getDevIdnos().split(",");
        
        AjaxDto<DeviceNetflowSummary> ajaxDto = this.deviceNetFlowService.queryDistinctNetFlow(beginDate, endDate, allDevices, getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        if (ajaxDto.getPageList() != null) {
          for (DeviceNetflowSummary summary : ajaxDto.getPageList())
          {
            summary.setStartTimeStr(DateUtil.dateSwitchString(summary.getStartTime()));
            summary.setEndTimeStr(DateUtil.dateSwitchString(summary.getEndTime()));
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
    return "success";
  }
  
  public String daily()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begindate");
      String endDate = getRequestString("enddate");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceNetFlow> ajaxDto = this.deviceNetFlowService.queryNetFlow(beginDate, 
          endDate, query.getDevIdnos().split(","), null, getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        if (ajaxDto.getPageList() != null) {
          for (DeviceNetFlow netFlow : ajaxDto.getPageList()) {
            netFlow.setDtimeStr(DateUtil.dateSwitchDateString(netFlow.getDtime()));
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
    return "success";
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[5];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.begintime");
    heads[3] = getText("report.endtime");
    heads[4] = getText("report.netflow.total");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<DeviceNetflowSummary> ajaxDto = this.deviceNetFlowService.queryDistinctNetFlow(begintime, endtime, devIdnos.split(","), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
    List<DeviceNetflowSummary> listSummary = ajaxDto.getPageList();
    if (listSummary != null) {
      for (int i = 1; i <= listSummary.size(); i++)
      {
        DeviceNetflowSummary summary = (DeviceNetflowSummary)listSummary.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
        if (summary.getStartTime() != null)
        {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getStartTime()));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
          
          export.setCellValue(Integer.valueOf(j++), summary.getTotalNetFlow());
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.netflow.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.netflow.curDayUsed");
    heads[4] = getText("report.netflow.dayLimit");
    heads[5] = getText("report.netflow.curMonthUsed");
    heads[6] = getText("report.netflow.monthLimit");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<DeviceNetFlow> ajaxDto = this.deviceNetFlowService.queryNetFlow(begintime, 
      endtime, devIdnos.split(","), null, null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceNetFlow netFlow = (DeviceNetFlow)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(netFlow.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(netFlow.getDtime()));
        
        export.setCellValue(Integer.valueOf(j++), netFlow.getCurDayUsed());
        if (netFlow.getDayLimit() != null) {
          export.setCellValue(Integer.valueOf(j++), netFlow.getDayLimit());
        }
        export.setCellValue(Integer.valueOf(j++), netFlow.getCurMonthUsed());
        if (netFlow.getDayLimit() != null) {
          export.setCellValue(Integer.valueOf(j++), netFlow.getMonthLimit());
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.netflow.detail");
  }
}
