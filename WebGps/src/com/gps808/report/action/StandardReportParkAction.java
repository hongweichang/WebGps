package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.hibernate.type.StandardBasicTypes;

public class StandardReportParkAction
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
    return lstArmType;
  }
  
  protected Integer getAlarmType()
  {
    return Integer.valueOf(14);
  }
  
  protected AjaxDto<StandardReportSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    List<QueryScalar> countScalars = new ArrayList();
    countScalars.add(new QueryScalar("param1Sum", StandardBasicTypes.INTEGER));
    List<StandardDeviceAlarmSummary> lstAlarmSummary = this.vehicleAlarmService.summaryDeviceAlarm(begintime, endtime, 
      vehicles, getAlarmTypeList(), null, "group by VehiIDNO, ArmType, ArmInfo", "sum(UNIX_TIMESTAMP(ArmTimeEnd) - UNIX_TIMESTAMP(ArmTimeStart)) as param1Sum ", countScalars, null, null, null, null);
    Map<String, StandardReportSummary> mapAlarm = new HashMap();
    for (int i = 0; i < lstAlarmSummary.size(); i++)
    {
      StandardDeviceAlarmSummary alarmSummary = (StandardDeviceAlarmSummary)lstAlarmSummary.get(i);
      StandardReportSummary summary = (StandardReportSummary)mapAlarm.get(alarmSummary.getVehiIdno());
      if (summary == null) {
        summary = new StandardReportSummary();
      }
      summary.setVehiIdno(alarmSummary.getVehiIdno());
      summary.setPlateType(alarmSummary.getPlateType());
      if ((summary.getBeginTime() == null) || (DateUtil.compareDate(summary.getBeginTime(), alarmSummary.getBeginTime()))) {
        summary.setBeginTime(alarmSummary.getBeginTime());
      }
      if ((summary.getEndTime() == null) || (DateUtil.compareDate(alarmSummary.getEndTime(), summary.getEndTime()))) {
        summary.setEndTime(alarmSummary.getEndTime());
      }
      if ((alarmSummary.getArmInfo() != null) && (alarmSummary.getArmInfo().intValue() == 1))
      {
        summary.addCount(alarmSummary.getCount());
        summary.addCount(alarmSummary.getParam1Sum());
      }
      if ((alarmSummary.getArmInfo() != null) && (alarmSummary.getArmInfo().intValue() == 0))
      {
        summary.addCountStr(alarmSummary.getCount().toString());
        summary.addCountStr(alarmSummary.getParam1Sum().toString());
      }
      mapAlarm.put(alarmSummary.getVehiIdno(), summary);
    }
    int start = 0;int index = mapAlarm.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(mapAlarm.size());
      if (mapAlarm.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardReportSummary> parkSummarys = new ArrayList();
    Iterator<Map.Entry<String, StandardReportSummary>> iter = mapAlarm.entrySet().iterator();
    int i = 0;
    while (iter.hasNext())
    {
      Map.Entry<String, StandardReportSummary> entry = (Map.Entry)iter.next();
      if ((i >= start) && (i < index)) {
        parkSummarys.add((StandardReportSummary)entry.getValue());
      }
      i++;
      if (i >= index) {
        break;
      }
    }
    AjaxDto<StandardReportSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(parkSummarys);
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
        
        AjaxDto<StandardReportSummary> parkSummarys = doSummary(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
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
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        List<Integer> typeList = new ArrayList();
        if ((type != null) && (type.equals("1"))) {
          typeList.add(Integer.valueOf(1));
        } else if ((type != null) && (type.equals("0"))) {
          typeList.add(Integer.valueOf(0));
        }
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), getAlarmTypeList(), typeList, String.format(" and (UNIX_TIMESTAMP(armTimeEnd) - UNIX_TIMESTAMP(armTimeStart)) >= %s order by armTimeStart asc", new Object[] { parkTime }), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
        List<StandardDeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null) {
          for (int i = 0; i < deviceAlarms.size(); i++)
          {
            StandardDeviceAlarm deviceAlarm = (StandardDeviceAlarm)deviceAlarms.get(i);
            String[] statusStart = handleFieldData(deviceAlarm.getStatusStart());
            int mapType;
            try
            {
              mapType = Integer.parseInt(toMap);
            }
            catch (Exception e)
            {
             
              mapType = 2;
            }
            if ((statusStart.length > 5) && (statusStart.length > 6))
            {
              deviceAlarm.setStartJingDu(Integer.valueOf(Integer.parseInt(statusStart[5])));
              deviceAlarm.setStartWeiDu(Integer.valueOf(Integer.parseInt(statusStart[6])));
            }
            else
            {
              deviceAlarm.setStartJingDu(Integer.valueOf(0));
              deviceAlarm.setStartWeiDu(Integer.valueOf(0));
            }
            deviceAlarm.setTimeLength(Long.toString(deviceAlarm.getArmTimeEnd().getTime() - deviceAlarm.getArmTimeStart().getTime()));
            deviceAlarm.setStartPosition(handlePosition(statusStart, Integer.valueOf(mapType), true));
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
    String[] heads = new String[9];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.park.count");
    heads[6] = getText("report.park.totaltime");
    heads[7] = getText("report.idle.count");
    heads[8] = getText("report.idle.totaltime");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardReportSummary> parkSummarys = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    for (int i = 1; i <= parkSummarys.getPageList().size(); i++)
    {
      StandardReportSummary summary = (StandardReportSummary)parkSummarys.getPageList().get(i - 1);
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
        List<Integer> ioinCounts = summary.getCounts();
        if ((ioinCounts != null) && (ioinCounts.size() > 1))
        {
          export.setCellValue(Integer.valueOf(j++), ioinCounts.get(0));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(((Integer)ioinCounts.get(1)).intValue(), getText("report.hour"), getText("report.minute"), getText("report.second")));
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
        }
        List<String> countStrs = summary.getCountStrs();
        if ((countStrs != null) && (countStrs.size() > 1))
        {
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(Integer.parseInt((String)countStrs.get(0))));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(Integer.parseInt((String)countStrs.get(1)), getText("report.hour"), getText("report.minute"), getText("report.second")));
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.park.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.type");
    heads[4] = getText("report.begintime");
    heads[5] = getText("report.endtime");
    heads[6] = getText("report.times");
    heads[7] = getText("report.park.position");
    
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String parkTime = getRequestString("parkTime");
    String type = getRequestString("handleStatus");
    List<Integer> typeList = new ArrayList();
    if ((type != null) && (type.equals("1"))) {
      typeList.add(Integer.valueOf(1));
    } else if ((type != null) && (type.equals("0"))) {
      typeList.add(Integer.valueOf(0));
    }
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getAlarmTypeList(), typeList, String.format(" and (UNIX_TIMESTAMP(armTimeEnd) - UNIX_TIMESTAMP(armTimeStart)) >= %s order by armTimeStart asc", new Object[] { parkTime }), null, queryFilter, qtype, sortname, sortorder);
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
        if (alarm.getArmInfo().intValue() == 0) {
          export.setCellValue(Integer.valueOf(j++), getText("report.idle"));
        } else {
          export.setCellValue(Integer.valueOf(j++), getText("report.park"));
        }
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeStart()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTimeEnd()));
        
        export.setCellValue(Integer.valueOf(j++), getTimeDifference(alarm.getArmTimeEnd().getTime() - alarm.getArmTimeStart().getTime()));
        
        String[] statusStart = handleFieldData(alarm.getStatusStart());
        export.setCellValue(Integer.valueOf(j++), handlePosition(statusStart, toMap, true));
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.park.detail");
  }
}
