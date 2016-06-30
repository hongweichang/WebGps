package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.report.vo.DeviceLichengSummary;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.report.vo.StandardLichengSummary;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;

public class StandardReportLiChengAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected Map<String, StandardDeviceDaily> listDeviceDaily2map(List<StandardDeviceDaily> listDaily)
  {
    Map<String, StandardDeviceDaily> mapDaily = new HashMap();
    for (int i = 0; i < listDaily.size(); i++)
    {
      StandardDeviceDaily daily = (StandardDeviceDaily)listDaily.get(i);
      mapDaily.put(daily.getVehiIdno(), daily);
    }
    return mapDaily;
  }
  
  protected List<DeviceLichengSummary> doSummary(String begintime, String endtime, String[] devices)
  {
    List<StandardDeviceDaily> beginDaily = this.vehicleDailyService.queryDistinctDaily(begintime, endtime, false, devices, null);
    Map<String, StandardDeviceDaily> mapBeginDaily = listDeviceDaily2map(beginDaily);
    
    List<StandardDeviceDaily> endDaily = this.vehicleDailyService.queryDistinctDaily(begintime, endtime, true, devices, null);
    Map<String, StandardDeviceDaily> mapEndDaily = listDeviceDaily2map(endDaily);
    
    List<DeviceLichengSummary> listSummary = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      String device = devices[i];
      DeviceLichengSummary summary = new DeviceLichengSummary();
      summary.setDevIdno(device);
      
      StandardDeviceDaily begin = (StandardDeviceDaily)mapBeginDaily.get(device);
      StandardDeviceDaily end = (StandardDeviceDaily)mapEndDaily.get(device);
      if (begin != null)
      {
        if (end != null) {
          summary.setLiCheng(Integer.valueOf(end.getEndLiCheng().intValue() - begin.getStartLiCheng().intValue()));
        } else {
          summary.setLiCheng(Integer.valueOf(0));
        }
        summary.setStartLiCheng(begin.getStartLiCheng());
        summary.setStartJingDu(begin.getStartJingDu());
        summary.setStartWeiDu(begin.getStartWeiDu());
        summary.setStartGaoDu(begin.getStartGaoDu());
        summary.setStartTime(begin.getStartTime());
        if (end != null)
        {
          summary.setEndLiCheng(end.getEndLiCheng());
          summary.setEndJingDu(end.getEndJingDu());
          summary.setEndWeiDu(end.getEndWeiDu());
          summary.setEndGaoDu(end.getEndGaoDu());
          summary.setEndTime(end.getEndTime());
        }
      }
      listSummary.add(summary);
    }
    return listSummary;
  }
  
  protected Map<String, StandardDeviceTrack> listDeviceTrack2map(List<StandardDeviceTrack> listTrack)
  {
    Map<String, StandardDeviceTrack> mapTrack = new HashMap();
    for (int i = 0; i < listTrack.size(); i++)
    {
      StandardDeviceTrack track = (StandardDeviceTrack)listTrack.get(i);
      if (track != null) {
        mapTrack.put(track.getVehiIdno(), track);
      }
    }
    return mapTrack;
  }
  
  protected AjaxDto<StandardLichengSummary> doSummaryEx(String begintime, String endtime, Integer toMap, String[] vehicles, Pagination pagination)
  {
    List<StandardLichengSummary> listSummary = new ArrayList();
    AjaxDto<StandardDeviceDaily> ajaxDaily = this.vehicleDailyService.queryDeviceDaily(begintime, endtime, null, null, " GPSDate", " asc", vehicles, null, null);
    List<StandardDeviceDaily> dailys = ajaxDaily.getPageList();
    Map<String, StandardLichengSummary> summarysMap = new LinkedHashMap();
    if ((dailys != null) && (dailys.size() > 0)) {
      for (int i = 0; i < dailys.size(); i++)
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
    for (int i = start; i < index; i++) {
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
    }
    if ((reportSummary.getEndTime() == null) || (DateUtil.compareDate(deviceDaily.getEndTime(), reportSummary.getEndTime())))
    {
      reportSummary.setEndTime(deviceDaily.getEndTime());
      reportSummary.setEndLiCheng(deviceDaily.getEndLiCheng());
      reportSummary.setEndJingDu(deviceDaily.getEndJingDu());
      reportSummary.setEndWeiDu(deviceDaily.getEndWeiDu());
      reportSummary.setEndGaoDu(deviceDaily.getEndGaoDu());
    }
    Integer miles = reportSummary.getLiCheng();
    if (miles == null) {
      miles = Integer.valueOf(deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue());
    } else {
      miles = Integer.valueOf(miles.intValue() + (deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue()));
    }
    reportSummary.setLiCheng(miles);
    if (isGpsValid(Integer.valueOf(1)))
    {
      reportSummary.setStartPosition(getMapPosition(reportSummary.getStartJingDu(), reportSummary.getStartWeiDu(), toMap.intValue(), true));
      reportSummary.setEndPosition(getMapPosition(reportSummary.getEndJingDu(), reportSummary.getEndWeiDu(), toMap.intValue(), true));
    }
    summarysMap.put(key, reportSummary);
  }
  
  public String summary()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      int toMap;
      try
      {
        toMap = Integer.parseInt(getRequestString("toMap"));
      }
      catch (Exception e)
      {
  
        toMap = 2;
      }
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<StandardLichengSummary> dtoSummary = doSummaryEx(beginDate, endDate, Integer.valueOf(toMap), query.getVehiIdnos().split(","), getPaginationEx());
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
  
  private AjaxDto<StandardDeviceDaily> doDetail(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String[] vehiIdnos, Pagination pagination)
  {
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, queryFilter, qtype, " GPSDate", " asc", vehiIdnos, null, pagination);
    if (ajaxDto.getPageList() != null) {
      for (int i = 0; i < ajaxDto.getPageList().size(); i++)
      {
        StandardDeviceDaily daily = (StandardDeviceDaily)ajaxDto.getPageList().get(i);
        daily.setLiCheng(Integer.valueOf(daily.getEndLiCheng().intValue() - daily.getStartLiCheng().intValue()));
        if (isGpsValid(Integer.valueOf(1)))
        {
          daily.setStartPosition(getMapPosition(daily.getStartJingDu(), daily.getStartWeiDu(), toMap.intValue(), true));
          daily.setEndPosition(getMapPosition(daily.getEndJingDu(), daily.getEndWeiDu(), toMap.intValue(), true));
        }
      }
    }
    return ajaxDto;
  }
  
  private void doStandardLichengSummaryEx(Map<String, StandardLichengSummary> summarysMap, StandardDeviceDaily deviceDaily)
  {
    String key = deviceDaily.getVehiIdno() + "," + DateUtil.dateSwitchMonthDateString(deviceDaily.getDate());
    StandardLichengSummary lichengSummary = (StandardLichengSummary)summarysMap.get(key);
    if (lichengSummary == null)
    {
      lichengSummary = new StandardLichengSummary();
      lichengSummary.setVehiIdno(deviceDaily.getVehiIdno());
      lichengSummary.setPlateType(deviceDaily.getPlateType());
    }
    if ((lichengSummary.getStartTime() == null) || (DateUtil.compareDate(lichengSummary.getStartTime(), deviceDaily.getStartTime())))
    {
      lichengSummary.setStartTime(deviceDaily.getStartTime());
      lichengSummary.setStartLiCheng(deviceDaily.getStartLiCheng());
      lichengSummary.setStartJingDu(deviceDaily.getStartJingDu());
      lichengSummary.setStartWeiDu(deviceDaily.getStartWeiDu());
      lichengSummary.setStartGaoDu(deviceDaily.getStartGaoDu());
    }
    if ((lichengSummary.getEndTime() == null) || (DateUtil.compareDate(deviceDaily.getEndTime(), lichengSummary.getEndTime())))
    {
      lichengSummary.setEndTime(deviceDaily.getEndTime());
      lichengSummary.setEndLiCheng(deviceDaily.getEndLiCheng());
      lichengSummary.setEndJingDu(deviceDaily.getEndJingDu());
      lichengSummary.setEndWeiDu(deviceDaily.getEndWeiDu());
      lichengSummary.setEndGaoDu(deviceDaily.getEndGaoDu());
    }
    if (lichengSummary.getLiCheng() == null) {
      lichengSummary.setLiCheng(Integer.valueOf(0));
    }
    if (deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue() > 0) {
      lichengSummary.setLiCheng(Integer.valueOf(deviceDaily.getEndLiCheng().intValue() - deviceDaily.getStartLiCheng().intValue() + lichengSummary.getLiCheng().intValue()));
    }
    summarysMap.put(key, lichengSummary);
  }
  
  private AjaxDto<StandardLichengSummary> doMonthDetail(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String[] vehiIdnos, Pagination pagination)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd");
    begintime = dfs.format(DateUtil.StrMonth2Date(begintime));
    endtime = dfs.format(DateUtil.dateIncrease(DateUtil.StrMonth2Date(endtime), Integer.valueOf(1), Integer.valueOf(0)));
    AjaxDto<StandardDeviceDaily> ajaxDto = this.vehicleDailyService.queryDeviceDaily(begintime, 
      endtime, null, null, " GPSDate", " asc", vehiIdnos, null, null);
    Map<String, StandardLichengSummary> summarysMap = new LinkedHashMap();
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
    {
      List<StandardDeviceDaily> deviceDailies = ajaxDto.getPageList();
      for (int i = 0; i < deviceDailies.size(); i++)
      {
        StandardDeviceDaily deviceDaily = (StandardDeviceDaily)deviceDailies.get(i);
        doStandardLichengSummaryEx(summarysMap, deviceDaily);
      }
    }
    List<StandardLichengSummary> listDaily = new ArrayList();
    for (Iterator<Map.Entry<String, StandardLichengSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardLichengSummary> entry = (Map.Entry)it.next();
      StandardLichengSummary summary = (StandardLichengSummary)entry.getValue();
      listDaily.add(summary);
    }
    int start = 0;int index = listDaily.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(listDaily.size());
      if (listDaily.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardLichengSummary> listDaily2 = new ArrayList();
    for (int i = start; i < index; i++)
    {
      StandardLichengSummary daily = (StandardLichengSummary)listDaily.get(i);
      if (isGpsValid(Integer.valueOf(1)))
      {
        daily.setStartPosition(getMapPosition(daily.getStartJingDu(), daily.getStartWeiDu(), toMap.intValue(), true));
        daily.setEndPosition(getMapPosition(daily.getEndJingDu(), daily.getEndWeiDu(), toMap.intValue(), true));
      }
      listDaily2.add(daily);
    }
    AjaxDto<StandardLichengSummary> dtoMonthly = new AjaxDto();
    dtoMonthly.setPagination(pagination);
    dtoMonthly.setPageList(listDaily2);
    return dtoMonthly;
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      boolean flag = true;
      if ((isDaily()) && ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))) {
        flag = false;
      } else if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isMonthDateValid(beginDate)) || (!DateUtil.isMonthDateValid(endDate))) {
        flag = false;
      }
      if (!flag)
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
        if (isDaily())
        {
          AjaxDto<StandardDeviceDaily> ajaxDto = doDetail(beginDate, endDate, queryFilter, qtype, sortname, sortorder, Integer.valueOf(mapType), query.getVehiIdnos().split(","), getPaginationEx());
          addCustomResponse("infos", ajaxDto.getPageList());
          addCustomResponse("pagination", ajaxDto.getPagination());
        }
        else
        {
          AjaxDto<StandardLichengSummary> ajaxDto = doMonthDetail(beginDate, endDate, queryFilter, qtype, sortname, sortorder, Integer.valueOf(mapType), query.getVehiIdnos().split(","), getPaginationEx());
          addCustomResponse("infos", ajaxDto.getPageList());
          addCustomResponse("pagination", ajaxDto.getPagination());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String track()
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
      queryGpsTrack(distance, null, pagination, null);
    }
    return "success";
  }
  
  public String speedDetail()
    throws Exception
  {
    String pagin = getJsonRequestString("pagin");
    Pagination pagination = null;
    if ((pagin != null) && (!"".equals(pagin))) {
      pagination = getPaginationEx();
    }
    queryGpsTrack(null, null, pagination, null);
    return "success";
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[10];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = (getText("report.normal.total.licheng") + getLiChengUnit());
    heads[4] = getText("report.begintime");
    heads[5] = (getText("report.normal.begin.licheng") + getLiChengUnit());
    heads[6] = getText("report.normal.begin.position");
    heads[7] = getText("report.endtime");
    heads[8] = (getText("report.normal.end.licheng") + getLiChengUnit());
    heads[9] = getText("report.normal.end.position");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardLichengSummary> dtoSummary = doSummaryEx(begintime, endtime, toMap, vehiIdnos.split(","), null);
    setGenData(dtoSummary.getPageList(), export);
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.normal.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[11];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.alarm.date");
    heads[4] = (getText("report.normal.total.licheng") + getLiChengUnit());
    heads[5] = getText("report.begintime");
    heads[6] = (getText("report.normal.begin.licheng") + getLiChengUnit());
    heads[7] = getText("report.normal.begin.position");
    heads[8] = getText("report.endtime");
    heads[9] = (getText("report.normal.end.licheng") + getLiChengUnit());
    heads[10] = getText("report.normal.end.position");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isDaily())
    {
      AjaxDto<StandardDeviceDaily> ajaxDto = doDetail(begintime, endtime, queryFilter, qtype, " date", " asc", toMap, vehiIdnos.split(","), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardDeviceDaily daily = (StandardDeviceDaily)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), daily.getVehiIdno());
          
          String plateColor = getText("other");
          switch (daily.getPlateType().intValue())
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
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(daily.getStartTime()));
          
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(Integer.valueOf(daily.getEndLiCheng().intValue() - daily.getStartLiCheng().intValue())), Integer.valueOf(0));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(daily.getStartTime()));
          
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(daily.getStartLiCheng()), "0.000");
          if (isGpsValid(Integer.valueOf(1))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(daily.getStartJingDu(), daily.getStartWeiDu(), toMap.intValue(), true));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(daily.getEndTime()));
          
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(daily.getEndLiCheng()), "0.000");
          if (isGpsValid(Integer.valueOf(1))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(daily.getEndJingDu(), daily.getEndWeiDu(), toMap.intValue(), true));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
      }
    }
    else
    {
      AjaxDto<StandardLichengSummary> ajaxDto = doMonthDetail(begintime, endtime, queryFilter, qtype, sortname, sortorder, toMap, vehiIdnos.split(","), null);
      if (ajaxDto.getPageList() != null) {
        setGenData(ajaxDto.getPageList(), export);
      }
    }
  }
  
  protected String genDetailTitle()
  {
    if (isDaily()) {
      return getText("report.normal.daily");
    }
    return getText("report.normal.monthly");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("report.currentPosition");
    heads[5] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[6] = (getText("report.normal.total.licheng") + getLiChengUnit());
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export)
  {
    try
    {
      String distance = getRequestString("distance");
      String time = getRequestString("time");
      String speed = getRequestString("speed");
      int meter = 0;
      int park = 0;
      if ((distance != null) && 
        (!distance.isEmpty())) {
        meter = (int)(Double.parseDouble(distance) * 1000.0D);
      }
      int interval = 0;
      if ((time != null) && (!time.isEmpty())) {
        interval = Integer.parseInt(time) * 1000;
      }
      int limit = 0;
      if ((speed != null) && (!speed.isEmpty())) {
        limit = Integer.parseInt(speed);
      }
      String devIdno = getGPSDevIdno(vehiIdno);
      if ((isSpeedDetail()) || ((isTrackDetail()) && (distance != null)))
      {
        AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, interval, limit, park, 0, 0, null, null, devIdno);
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
            if (isGpsValid(track.getStatus1()))
            {
              if (DateUtil.StrLongTime2Date(endtime).getTime() - DateUtil.StrLongTime2Date(begintime).getTime() < 10800000L) {
                export.setCellValue(Integer.valueOf(j++), getMapPosition(track.getJingDu(), track.getWeiDu(), toMap.intValue(), true));
              } else {
                export.setCellValue(Integer.valueOf(j++), formatPosition(track.getWeiDu()) + "," + formatPosition(track.getJingDu()));
              }
            }
            else {
              export.setCellValue(Integer.valueOf(j++), "");
            }
            export.setCellValue(Integer.valueOf(j++), getSpeedEx(track.getSpeed(), track.getStatus1()));
            
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(track.getLiCheng()));
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
    if (isSpeedDetail()) {
      return getText("report.normal.speedDetail");
    }
    return getText("report.normal.track");
  }
  
  private boolean isDaily()
  {
    String daily = getRequest().getParameter("type");
    return (daily == null) || (daily.isEmpty()) || ("daily".equals(daily));
  }
  
  private boolean isSpeedDetail()
  {
    String speedDetail = getRequest().getParameter("type");
    return (speedDetail != null) && (speedDetail.equals("speedDetail"));
  }
  
  private boolean isTrackDetail()
  {
    String trackDetail = getRequest().getParameter("type");
    return (trackDetail != null) && (trackDetail.equals("trackDetail"));
  }
  
  private void setGenData(List<StandardLichengSummary> list, ExportReport export)
  {
    for (int i = 1; i <= list.size(); i++)
    {
      StandardLichengSummary summary = (StandardLichengSummary)list.get(i - 1);
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
      if (summary.getStartTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getLiCheng()), "0.000");
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getStartTime()));
        
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getStartLiCheng()), "0.000");
        if (isGpsValid(Integer.valueOf(1))) {
          export.setCellValue(Integer.valueOf(j++), summary.getStartPosition());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getEndLiCheng()), "0.000");
        if (isGpsValid(Integer.valueOf(1))) {
          export.setCellValue(Integer.valueOf(j++), summary.getEndPosition());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
      }
    }
  }
}
