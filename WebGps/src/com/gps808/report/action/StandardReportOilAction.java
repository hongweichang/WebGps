package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.report.vo.StandardLichengSummary;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;

public class StandardReportOilAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleDailyService vehicleDailyService;
  
  public StandardVehicleDailyService getVehicleDailyService()
  {
    return this.vehicleDailyService;
  }
  
  public void setVehicleDailyService(StandardVehicleDailyService vehicleDailyService)
  {
    this.vehicleDailyService = vehicleDailyService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String trackDetail()
    throws Exception
  {
    String distance = getRequestString("distance");
    if (distance == null)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
    else
    {
      String pagin = getJsonRequestString("pagin");
      Pagination pagination = null;
      if ((pagin != null) && (!"".equals(pagin))) {
        pagination = getPaginationEx();
      }
      queryGpsTrack(distance, null, pagination, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected List<Integer> getQueryType(String oilType)
  {
    List<Integer> lstArmType = new ArrayList();
    if (oilType.equals("1"))
    {
      lstArmType.add(Integer.valueOf(46));
    }
    else if (oilType.equals("2"))
    {
      lstArmType.add(Integer.valueOf(47));
    }
    else
    {
      lstArmType.add(Integer.valueOf(46));
      lstArmType.add(Integer.valueOf(47));
    }
    return lstArmType;
  }
  
  public String summary()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      int toMap;
      try
      {
        toMap = Integer.parseInt(getRequestString("toMap"));
      }
      catch (Exception e)
      {
       
        toMap = 2;
      }
      if ((begintime == null) || (endtime == null) || (!DateUtil.isDateValid(begintime)) || (!DateUtil.isDateValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<StandardLichengSummary> dtoSummary = doSummaryEx(begintime, endtime, Integer.valueOf(toMap), query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", dtoSummary.getPageList());
        addCustomResponse("pagination", dtoSummary.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardLichengSummary> doSummaryEx(String begintime, String endtime, Integer toMap, String[] vehicles, Pagination pagination)
  {
    Map<String, String> vehiLoadDev = getMapVehiDevRelation(vehicles, "oil");
    StringBuffer devIdnos = new StringBuffer();
    int i = 0;
    for (int j = vehicles.length; i < j; i++)
    {
      if (i != 0) {
        devIdnos.append(",");
      }
      devIdnos.append((String)vehiLoadDev.get(vehicles[i]));
    }
    List<StandardLichengSummary> listSummary = new ArrayList();
    AjaxDto<StandardDeviceDaily> ajaxDaily = this.vehicleDailyService.queryDeviceDaily(begintime, endtime, null, null, " GPSDate", " asc", vehicles, null, null);
    List<StandardDeviceDaily> dailys = ajaxDaily.getPageList();
    Map<String, StandardLichengSummary> summarysMap = new LinkedHashMap();
    if ((dailys != null) && (dailys.size() > 0)) {
      for ( i = 0; i < dailys.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)dailys.get(i);
        if ((deviceDaily.getStartLiCheng() != null) && (deviceDaily.getEndLiCheng() != null)) {
          doStandardReportSummaryEx(summarysMap, deviceDaily, toMap);
        }
      }
    }
    for (Iterator<Map.Entry<String, StandardLichengSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardLichengSummary> entry = (Map.Entry)it.next();
      StandardLichengSummary summary = (StandardLichengSummary)entry.getValue();
      listSummary.add(summary);
    }
    int start = 0;int index = listSummary.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(listSummary.size());
      if (listSummary.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardLichengSummary> listSummary2 = new ArrayList();
    for ( i = start; i < index; i++) {
      listSummary2.add((StandardLichengSummary)listSummary.get(i));
    }
    AjaxDto<StandardLichengSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(listSummary2);
    return dtoSummary;
  }
  
  private void doStandardReportSummaryEx(Map<String, StandardLichengSummary> summarysMap, StandardDeviceDaily deviceDaily, Integer toMap)
  {
    String key = deviceDaily.getVehiIdno();
    StandardLichengSummary reportSummary = (StandardLichengSummary)summarysMap.get(key);
    if (reportSummary == null)
    {
      reportSummary = new StandardLichengSummary();
      reportSummary.setVehiIdno(key);
      reportSummary.setPlateType(deviceDaily.getPlateType());
    }
    if ((reportSummary.getStartTime() == null) || (DateUtil.compareDate(reportSummary.getStartTime(), deviceDaily.getStartTime())))
    {
      reportSummary.setStartTime(deviceDaily.getStartTime());
      reportSummary.setStartLiCheng(deviceDaily.getStartLiCheng());
      reportSummary.setStartJingDu(deviceDaily.getStartJingDu());
      reportSummary.setStartWeiDu(deviceDaily.getStartWeiDu());
      reportSummary.setStartGaoDu(deviceDaily.getStartGaoDu());
      reportSummary.setStartYouLiang(deviceDaily.getStartYouLiang());
    }
    if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(deviceDaily.getEndTime(), reportSummary.getEndTime())))
    {
      reportSummary.setEndTime(deviceDaily.getEndTime());
      reportSummary.setEndLiCheng(deviceDaily.getEndLiCheng());
      reportSummary.setEndJingDu(deviceDaily.getEndJingDu());
      reportSummary.setEndWeiDu(deviceDaily.getEndWeiDu());
      reportSummary.setEndGaoDu(deviceDaily.getEndGaoDu());
      reportSummary.setEndYouLiang(deviceDaily.getEndYouLiang());
    }
    Integer miles = reportSummary.getLiCheng();
    Integer youliang = reportSummary.getYouLiang();
    Integer times = reportSummary.getWorkTime();
    Integer addYou = reportSummary.getAddYouLiang();
    if (miles == null) {
      miles = Integer.valueOf(deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue());
    } else {
      miles = Integer.valueOf(miles.intValue() + (deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue()));
    }
    if (youliang == null) {
      youliang = deviceDaily.getYouLiang();
    } else {
      youliang = Integer.valueOf(youliang.intValue() + deviceDaily.getYouLiang().intValue());
    }
    if (times == null) {
      times = deviceDaily.getWorkTime();
    } else {
      times = Integer.valueOf(times.intValue() + deviceDaily.getWorkTime().intValue());
    }
    if (addYou == null) {
      addYou = deviceDaily.getAddYouLiang();
    } else {
      addYou = Integer.valueOf(addYou.intValue() + deviceDaily.getAddYouLiang().intValue());
    }
    if ((miles.intValue() != 0) || (youliang.intValue() != 0) || (times.intValue() != 0) || (addYou.intValue() != 0))
    {
      reportSummary.setLiCheng(miles);
      reportSummary.setYouLiang(youliang);
      reportSummary.setWorkTime(times);
      reportSummary.setAddYouLiang(addYou);
      if (isGpsValid(Integer.valueOf(1)))
      {
        reportSummary.setStartPosition(getMapPosition(reportSummary.getStartJingDu(), reportSummary.getStartWeiDu(), toMap.intValue(), true));
        reportSummary.setEndPosition(getMapPosition(reportSummary.getEndJingDu(), reportSummary.getEndWeiDu(), toMap.intValue(), true));
      }
      summarysMap.put(key, reportSummary);
    }
  }
  
  public String exceptionDetail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String oilType = getRequestString("oilType");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (oilType == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String pagin = getJsonRequestString("pagin");
        Pagination pagination = null;
        if ((pagin != null) && (!"".equals(pagin))) {
          pagination = getPaginationEx();
        }
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), getQueryType(oilType), null, " order by ArmTimeStart asc", pagination, queryFilter, qtype, sortname, sortorder);
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
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
          if (isGraph())
          {
            deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), false);
            if (deviceAlarms.size() > 2) {
              for (int i = 1; i < deviceAlarms.size() - 2; i++)
              {
                boolean flag = true;
                while ((flag) && (i < deviceAlarms.size() - 2))
                {
                  int j = i + 1;
                  if ((((StandardDeviceAlarm)deviceAlarms.get(i)).getArmInfo() != null) && (
                    (((StandardDeviceAlarm)deviceAlarms.get(j)).getArmInfo() == null) || (
                    (((StandardDeviceAlarm)deviceAlarms.get(i)).getArmInfo() == ((StandardDeviceAlarm)deviceAlarms.get(j)).getArmInfo()) && 
                    (((StandardDeviceAlarm)deviceAlarms.get(i)).getArmType().intValue() != ((StandardDeviceAlarm)deviceAlarms.get(j)).getArmType().intValue())))) {
                    deviceAlarms.remove(j);
                  } else {
                    flag = false;
                  }
                }
              }
            }
          }
          else
          {
            deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), true);
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
    String[] heads = new String[13];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.vehile.driverName");
    heads[2] = getText("report.vehicle");
    heads[3] = getText("report.plateColor");
    heads[4] = getText("report.begintime");
    heads[5] = getText("report.endtime");
    heads[6] = getText("report.start.oil");
    heads[7] = getText("report.end.oil");
    heads[8] = getText("report.licheng.all");
    heads[9] = getText("report.oil.all");
    heads[10] = getText("report.oil.add");
    heads[11] = getText("report.oil.fuel");
    heads[12] = getText("report.times");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<StandardLichengSummary> dtoSummary = doSummaryEx(begintime, endtime, toMap, devIdnos.split(","), null);
    for (int i = 1; i <= dtoSummary.getPageList().size(); i++)
    {
      StandardLichengSummary summary = (StandardLichengSummary)dtoSummary.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), summary.getDriver());
      
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
      if (summary.getStartTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getStartTime()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
      }
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getStartYouLiang()));
      
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getEndYouLiang()));
      
      export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getLiCheng()), "0.000");
      
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getYouLiang()));
      
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getAddYouLiang()));
      if (summary.getLiCheng().intValue() != 0)
      {
        DecimalFormat format = new DecimalFormat();
        format.applyPattern("#0.00");
        export.setCellValue(Integer.valueOf(j++), format.format(Double.parseDouble(getYouLiang(Integer.valueOf(summary.getYouLiang().intValue() * 100))) / getLiChengEx(summary.getLiCheng()).doubleValue()));
      }
      else
      {
        export.setCellValue(Integer.valueOf(j++), "0.00");
      }
      export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(summary.getWorkTime().intValue(), getText("report.hour"), 
        getText("report.minute"), getText("report.second")));
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.oil.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("report.oil.change");
    heads[5] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[6] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String oilType = getRequest().getParameter("oilType");
    AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
      vehiIdnos.split(","), getQueryType(oilType), null, " order by ArmTimeStart asc ", null, queryFilter, qtype, sortname, sortorder);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
    {
      List<StandardDeviceAlarm> deviceAlarms = handleDetailData(ajaxDto.getPageList(), toMap, true);
      for (int i = 1; i <= deviceAlarms.size(); i++)
      {
        StandardDeviceAlarm alarm = (StandardDeviceAlarm)deviceAlarms.get(i - 1);
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
        if (alarm.getArmType().equals(Integer.valueOf(46))) {
          export.setCellValue(Integer.valueOf(j++), getYouLiang(alarm.getArmInfo()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "-" + getYouLiang(alarm.getArmInfo()));
        }
        export.setCellValue(Integer.valueOf(j++), getLiCheng(alarm.getStartLiCheng()));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.oil.detail");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("report.currentYouLiang");
    heads[5] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[6] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export)
  {
    try
    {
      String devIdno = getOilDevIdno(vehiIdno);
      String distance = getRequestString("distance");
      if ((distance == null) || (distance.isEmpty())) {
        distance = "0";
      }
      AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), (int)(Double.parseDouble(distance) * 1000.0D), 0, 0, 0, 0, 0, null, null, devIdno);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardDeviceTrack track = (StandardDeviceTrack)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), track.getVehiIdno());
          
          String plateColor = getText("other");
          switch (track.getPlateType().intValue())
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
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(track.getTrackTime())));
          
          export.setCellValue(Integer.valueOf(j++), getYouLiang(track.getYouLiang()));
          
          export.setCellValue(Integer.valueOf(j++), getLiCheng(track.getLiCheng()));
          if (isGpsValid(track.getStatus1())) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(track.getJingDu(), track.getWeiDu(), toMap.intValue(), true));
          } else {
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
    return getText("report.oil.track");
  }
}
