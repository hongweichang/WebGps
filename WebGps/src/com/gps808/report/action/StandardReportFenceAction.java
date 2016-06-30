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
import com.gps808.report.service.StandardVehicleLoginService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.ArrayList;
import java.util.List;

public class StandardReportFenceAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected List<Integer> getAlarmTypeList()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(getAlarmType());
    lstArmType.add(Integer.valueOf(302));
    return lstArmType;
  }
  
  protected Integer getAlarmType()
  {
    return Integer.valueOf(211);
  }
  
  protected AjaxDto<StandardDeviceAlarmSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(11));
    lstArmType.add(Integer.valueOf(304));
    lstArmType.add(Integer.valueOf(305));
    lstArmType.add(Integer.valueOf(307));
    lstArmType.add(Integer.valueOf(306));
    lstArmType.add(Integer.valueOf(151));
    lstArmType.add(Integer.valueOf(210));
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.loginService.summaryDrivingBehavior(begintime, endtime, 
      vehicles, lstArmType, null, "ArmTimeStart", "asc");
    for (int i = 0; i < lstAlarmSummary.size(); i++)
    {
      StandardDeviceAlarmSummary devDrivingAlarm = (StandardDeviceAlarmSummary)lstAlarmSummary.get(i);
      devDrivingAlarm.setArmTypeStr(getAlarmTypeName(devDrivingAlarm.getArmType().intValue()));
    }
    int start = 0;int index = lstAlarmSummary.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(lstAlarmSummary.size());
      if (lstAlarmSummary.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardDeviceAlarmSummary> loginSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      loginSummarys2.add((StandardDeviceAlarmSummary)lstAlarmSummary.get(i));
    }
    AjaxDto<StandardDeviceAlarmSummary> dtoSummary = new AjaxDto();
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
        
        AjaxDto<StandardDeviceAlarmSummary> fenceSummarys = doSummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", fenceSummarys.getPageList());
        addCustomResponse("pagination", fenceSummarys.getPagination());
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
        
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), getAlarmTypeList(), null, " order by ArmTimeStart asc", getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        Integer mapType;
        try
        {
          mapType = Integer.valueOf(Integer.parseInt(toMap));
        }
        catch (Exception e)
        {
         
          mapType = Integer.valueOf(2);
        }
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          deviceAlarms = handleDetailData(ajaxDto.getPageList(), mapType, true);
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
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.type");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.alarm.total");
    heads[6] = getText("report.alarm.total.times");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardDeviceAlarmSummary> parkSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    for (int i = 1; i <= parkSummarys.getPageList().size(); i++)
    {
      StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)parkSummarys.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno());
      export.setCellValue(Integer.valueOf(j++), summary.getArmTypeStr());
      if (summary.getBeginTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        
        export.setCellValue(Integer.valueOf(j++), summary.getCount());
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(summary.getParam1Sum().intValue(), getText("report.hour"), getText("report.minute"), getText("report.second")));
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.driving.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.fence.begintime");
    heads[3] = getText("report.fence.endtime");
    heads[4] = getText("report.fence.alarmLength");
    heads[5] = getText("report.fence.begin.position");
    heads[6] = getText("report.fence.end.position");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getAlarmTypeList(), null, " order by ArmTimeStart asc", null, queryFilter, qtype, sortname, sortorder);
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
        export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
        
        export.setCellValue(Integer.valueOf(j++), alarm.getEndPosition());
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.fence.detail");
  }
}
