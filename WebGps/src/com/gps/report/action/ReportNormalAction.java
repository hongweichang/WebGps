package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.model.DeviceAlarm;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.model.DeviceDaily;
import com.gps.report.model.DeviceGps;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceDailyService;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceLichengSummary;
import com.gps.report.vo.DeviceMinMaxGps;
import com.gps.report.vo.DeviceQuery;
import com.gps.report.vo.DeviceTrack;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportNormalAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DeviceDailyService deviceDailyService;
  
  public DeviceDailyService getDeviceDailyService()
  {
    return this.deviceDailyService;
  }
  
  public void setDeviceDailyService(DeviceDailyService deviceDailyService)
  {
    this.deviceDailyService = deviceDailyService;
  }
  
  protected Map<String, DeviceDaily> listDeviceDaily2map(List<DeviceDaily> listDaily)
  {
    Map<String, DeviceDaily> mapDaily = new HashMap();
    for (int i = 0; i < listDaily.size(); i++)
    {
      DeviceDaily daily = (DeviceDaily)listDaily.get(i);
      mapDaily.put(daily.getDevIdno(), daily);
    }
    return mapDaily;
  }
  
  protected AjaxDto<DeviceLichengSummary> doSummary(String begintime, String endtime, String[] devices, Pagination pagination, Integer toMap)
  {
    List<DeviceDaily> beginDaily = this.deviceDailyService.queryDistinctDaily(begintime, endtime, false, devices, null);
    Map<String, DeviceDaily> mapBeginDaily = listDeviceDaily2map(beginDaily);
    
    List<DeviceDaily> endDaily = this.deviceDailyService.queryDistinctDaily(begintime, endtime, true, devices, null);
    Map<String, DeviceDaily> mapEndDaily = listDeviceDaily2map(endDaily);
    
    List<DeviceLichengSummary> listSummary = new ArrayList();
    for (int i = 0; i < devices.length; i++)
    {
      String device = devices[i];
      DeviceLichengSummary summary = new DeviceLichengSummary();
      summary.setDevIdno(device);
      
      DeviceDaily begin = (DeviceDaily)mapBeginDaily.get(device);
      DeviceDaily end = (DeviceDaily)mapEndDaily.get(device);
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
        summary.setStartTimeStr(DateUtil.dateSwitchString(begin.getStartTime()));
        if (isGpsValid(Integer.valueOf(1))) {
          if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
            summary.setStartPosition(getMapPosition(begin.getStartJingDu(), begin.getStartWeiDu(), toMap.intValue()));
          } else if ((begin.getStartJingDu() == null) || (begin.getStartJingDu().intValue() == 0) || 
            (begin.getStartWeiDu() == null) || (begin.getStartWeiDu().intValue() == 0)) {
            summary.setStartPosition("");
          } else {
            summary.setStartPosition(getPosition(begin.getStartJingDu(), begin.getStartWeiDu(), Integer.valueOf(1)));
          }
        }
        if (end != null)
        {
          summary.setEndLiCheng(end.getEndLiCheng());
          summary.setEndJingDu(end.getEndJingDu());
          summary.setEndWeiDu(end.getEndWeiDu());
          summary.setEndGaoDu(end.getEndGaoDu());
          summary.setEndTime(end.getEndTime());
          summary.setEndTimeStr(DateUtil.dateSwitchString(end.getEndTime()));
          if (isGpsValid(Integer.valueOf(1))) {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              summary.setEndPosition(getMapPosition(end.getEndJingDu(), end.getEndWeiDu(), toMap.intValue()));
            } else if ((end.getEndJingDu() == null) || (end.getEndJingDu().intValue() == 0) || 
              (end.getEndWeiDu() == null) || (end.getEndWeiDu().intValue() == 0)) {
              summary.setEndPosition("");
            } else {
              summary.setEndPosition(getPosition(end.getEndJingDu(), end.getEndWeiDu(), Integer.valueOf(1)));
            }
          }
        }
        listSummary.add(summary);
      }
    }
    int start = 0;int index = listSummary.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<DeviceLichengSummary> newSummary = new ArrayList();
    for (int i = start; i < index; i++) {
      newSummary.add((DeviceLichengSummary)listSummary.get(i));
    }
    AjaxDto<DeviceLichengSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newSummary);
    return dtoSummary;
  }
  
  protected Map<String, DeviceTrack> listDeviceTrack2map(List<DeviceTrack> listTrack)
  {
    Map<String, DeviceTrack> mapTrack = new HashMap();
    for (int i = 0; i < listTrack.size(); i++)
    {
      DeviceTrack track = (DeviceTrack)listTrack.get(i);
      if (track != null) {
        mapTrack.put(track.getDevIdno(), track);
      }
    }
    return mapTrack;
  }
  
  private void setSummary(DeviceLichengSummary summary, DeviceTrack begin, DeviceTrack end, int start, int toMap)
  {
    if (((begin != null) && (end != null) && (end.getLiCheng() != null) && (begin.getLiCheng() != null) && 
      (begin.getJingDu() != null) && (begin.getJingDu().intValue() != 0) && (begin.getWeiDu() != null) && 
      (begin.getWeiDu().intValue() != 0) && (end.getJingDu() != null) && (end.getJingDu().intValue() != 0) && 
      (end.getWeiDu() != null) && (end.getWeiDu().intValue() != 0)) || (start == 1))
    {
      summary.setLiCheng(Integer.valueOf(end.getLiCheng().intValue() - begin.getLiCheng().intValue()));
      
      summary.setStartLiCheng(begin.getLiCheng());
      summary.setStartJingDu(begin.getJingDu());
      summary.setStartWeiDu(begin.getWeiDu());
      summary.setStartGaoDu(begin.getGaoDu());
      summary.setStartTime(DateUtil.StrLongTime2Date(begin.getGpsTime()));
      summary.setStartTimeStr(begin.getGpsTime());
      if (isGpsValid(Integer.valueOf(1))) {
        if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
          summary.setStartPosition(getMapPosition(begin.getJingDu(), begin.getWeiDu(), toMap));
        } else if ((begin.getJingDu() == null) || (begin.getJingDu().intValue() == 0) || 
          (begin.getWeiDu() == null) || (begin.getWeiDu().intValue() == 0)) {
          summary.setStartPosition("");
        } else {
          summary.setStartPosition(getPosition(begin.getWeiDu(), begin.getJingDu(), Integer.valueOf(1)));
        }
      }
      summary.setEndLiCheng(end.getLiCheng());
      summary.setEndJingDu(end.getJingDu());
      summary.setEndWeiDu(end.getWeiDu());
      summary.setEndGaoDu(end.getGaoDu());
      summary.setEndTime(DateUtil.StrLongTime2Date(end.getGpsTime()));
      summary.setEndTimeStr(end.getGpsTime());
      if (isGpsValid(Integer.valueOf(1))) {
        if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
          summary.setEndPosition(getMapPosition(end.getJingDu(), end.getWeiDu(), toMap));
        } else if ((end.getJingDu() == null) || (end.getJingDu().intValue() == 0) || 
          (end.getWeiDu() == null) || (end.getWeiDu().intValue() == 0)) {
          summary.setEndPosition("");
        } else {
          summary.setEndPosition(getPosition(end.getWeiDu(), end.getJingDu(), Integer.valueOf(1)));
        }
      }
    }
  }
  
  private DeviceTrack getDeviceTrack(List<DeviceGps> dtoGps, String begintime, String endtime, boolean isMaxDate, int start)
  {
    for (int i = 0; i < dtoGps.size(); i++)
    {
      DeviceGps gps = (DeviceGps)dtoGps.get(i);
      List<DeviceTrack> gpstracks = new ArrayList();
      this.deviceGpsService.analyDeviceGps(gps, gps.getDevIdno(), DateUtil.StrLongTime2Date(begintime).getTime(), 
        DateUtil.StrLongTime2Date(endtime).getTime(), gpstracks, null);
      DeviceTrack track = this.deviceGpsService.searchDeviceTrack(gpstracks, isMaxDate, start);
      if ((track != null) && (track.getLiCheng() != null)) {
        return track;
      }
    }
    return null;
  }
  
  protected AjaxDto<DeviceLichengSummary> doSummaryEx(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String[] devices, Pagination pagination)
  {
    List<DeviceLichengSummary> listSummary = new ArrayList();
    AjaxDto<DeviceMinMaxGps> devGps = this.deviceGpsService.queryDevGps(begintime, endtime, queryFilter, qtype, sortname, sortorder, devices, pagination, null);
    if ((devGps.getPageList() != null) && (devGps.getPageList().size() > 0)) {
      for (int i = 0; i < devGps.getPageList().size(); i++) {
        try
        {
          DeviceMinMaxGps gps = (DeviceMinMaxGps)devGps.getPageList().get(i);
          DeviceLichengSummary summary = new DeviceLichengSummary();
          summary.setDevIdno(gps.getDevIdno());
          Integer mileage = Integer.valueOf(0);
          if (DateUtil.dateSwitchDateString(gps.getMinDate()).equals(begintime.substring(0, 10)))
          {
            DeviceGps beginGps = new DeviceGps();
            beginGps.setDevIdno(gps.getDevIdno());
            beginGps.setGpsData(gps.getMinData());
            beginGps.setGpsDate(gps.getMinDate());
            List<DeviceTrack> beginTracks = this.deviceGpsService.resolveDeviceTrack(beginGps, begintime, endtime, null);
            if ((beginTracks != null) && (beginTracks.size() > 0))
            {
              DeviceTrack begin = (DeviceTrack)beginTracks.get(0);
              DeviceTrack end = (DeviceTrack)beginTracks.get(beginTracks.size() - 1);
              summary.setStartLiCheng(begin.getLiCheng());
              summary.setStartJingDu(begin.getJingDu());
              summary.setStartWeiDu(begin.getWeiDu());
              summary.setStartGaoDu(begin.getGaoDu());
              summary.setStartTime(DateUtil.StrLongTime2Date(begin.getGpsTime()));
              summary.setStartTimeStr(begin.getGpsTime());
              int beginMile = ((DeviceTrack)beginTracks.get(0)).getLiCheng().intValue();
              int endMile = 0;
              for (int j = 1; j < beginTracks.size(); j++) {
                if (beginTracks.get(j) != null)
                {
                  endMile = ((DeviceTrack)beginTracks.get(j)).getLiCheng().intValue();
                  if (endMile > beginMile)
                  {
                    mileage = Integer.valueOf(mileage.intValue() + (endMile - beginMile));
                    beginMile = endMile;
                  }
                }
              }
              summary.setEndLiCheng(end.getLiCheng());
              summary.setEndJingDu(end.getJingDu());
              summary.setEndWeiDu(end.getWeiDu());
              summary.setEndGaoDu(end.getGaoDu());
              summary.setEndTime(DateUtil.StrLongTime2Date(end.getGpsTime()));
              summary.setEndTimeStr(end.getGpsTime());
            }
          }
          String[] idnos = { gps.getDevIdno() };
          AjaxDto<DeviceDaily> ajaxDto = this.deviceDailyService.queryDeviceDaily(DateUtil.dateSwitchDateString(DateUtil.dateIncrease(DateUtil.StrLongTime2Date(begintime), Integer.valueOf(0), Integer.valueOf(1))), 
            DateUtil.dateSwitchDateString(DateUtil.dateIncrease(DateUtil.StrLongTime2Date(endtime), Integer.valueOf(0), Integer.valueOf(-1))), null, null, null, null, idnos, null);
          List<DeviceDaily> dailys = ajaxDto.getPageList();
          if ((dailys != null) && (dailys.size() > 0))
          {
            for (int k = 0; k < dailys.size(); k++)
            {
              DeviceDaily daily = (DeviceDaily)dailys.get(k);
              int kilometer = daily.getEndLiCheng().intValue() - daily.getStartLiCheng().intValue();
              if (kilometer > 0)
              {
                if (mileage.intValue() == 0)
                {
                  summary.setStartLiCheng(daily.getStartLiCheng());
                  summary.setStartJingDu(daily.getStartJingDu());
                  summary.setStartWeiDu(daily.getStartWeiDu());
                  summary.setStartGaoDu(daily.getStartGaoDu());
                  summary.setStartTime(daily.getStartTime());
                  summary.setStartTimeStr(daily.getStartTimeStr());
                }
                mileage = Integer.valueOf(mileage.intValue() + kilometer);
              }
            }
            DeviceDaily endDaily = (DeviceDaily)dailys.get(dailys.size() - 1);
            summary.setEndLiCheng(endDaily.getEndLiCheng());
            summary.setEndJingDu(endDaily.getEndJingDu());
            summary.setEndWeiDu(endDaily.getEndWeiDu());
            summary.setEndGaoDu(endDaily.getEndGaoDu());
            summary.setEndTime(endDaily.getEndTime());
            summary.setEndTimeStr(endDaily.getEndTimeStr());
          }
          if ((!begintime.substring(0, 10).equals(endtime.substring(0, 10))) && 
            (DateUtil.dateSwitchDateString(gps.getMaxDate()).equals(endtime.substring(0, 10))))
          {
            DeviceGps endGps = new DeviceGps();
            endGps.setDevIdno(gps.getDevIdno());
            endGps.setGpsData(gps.getMaxData());
            endGps.setGpsDate(gps.getMaxDate());
            List<DeviceTrack> endTracks = this.deviceGpsService.resolveDeviceTrack(endGps, begintime, endtime, null);
            if ((endTracks != null) && (endTracks.size() > 0))
            {
              if (mileage.intValue() == 0)
              {
                DeviceTrack begin = (DeviceTrack)endTracks.get(0);
                summary.setDevIdno(begin.getDevIdno());
                summary.setStartLiCheng(begin.getLiCheng());
                summary.setStartJingDu(begin.getJingDu());
                summary.setStartWeiDu(begin.getWeiDu());
                summary.setStartGaoDu(begin.getGaoDu());
                summary.setStartTime(DateUtil.StrLongTime2Date(begin.getGpsTime()));
                summary.setStartTimeStr(begin.getGpsTime());
              }
              int beginMile = ((DeviceTrack)endTracks.get(0)).getLiCheng().intValue();
              int endMile = 0;
              for (int j = 1; j < endTracks.size(); j++) {
                if (endTracks.get(j) != null)
                {
                  endMile = ((DeviceTrack)endTracks.get(j)).getLiCheng().intValue();
                  if (endMile > beginMile)
                  {
                    mileage = Integer.valueOf(mileage.intValue() + (endMile - beginMile));
                    beginMile = endMile;
                  }
                }
              }
              DeviceTrack end = (DeviceTrack)endTracks.get(endTracks.size() - 1);
              
              summary.setEndLiCheng(end.getLiCheng());
              summary.setEndJingDu(end.getJingDu());
              summary.setEndWeiDu(end.getWeiDu());
              summary.setEndGaoDu(end.getGaoDu());
              summary.setEndTime(DateUtil.StrLongTime2Date(end.getGpsTime()));
              summary.setEndTimeStr(end.getGpsTime());
            }
          }
          summary.setLiCheng(mileage);
          if (isGpsValid(Integer.valueOf(1)))
          {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              summary.setStartPosition(getMapPosition(summary.getStartJingDu(), summary.getStartWeiDu(), toMap.intValue()));
            } else if ((summary.getStartJingDu() == null) || (summary.getStartJingDu().intValue() == 0) || 
              (summary.getStartWeiDu() == null) || (summary.getStartWeiDu().intValue() == 0)) {
              summary.setStartPosition("");
            } else {
              summary.setStartPosition(getPosition(summary.getStartWeiDu(), summary.getStartJingDu(), Integer.valueOf(1)));
            }
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              summary.setEndPosition(getMapPosition(summary.getEndJingDu(), summary.getEndWeiDu(), toMap.intValue()));
            } else if ((summary.getEndJingDu() == null) || (summary.getEndJingDu().intValue() == 0) || 
              (summary.getEndWeiDu() == null) || (summary.getEndWeiDu().intValue() == 0)) {
              summary.setEndPosition("");
            } else {
              summary.setEndPosition(getPosition(summary.getEndWeiDu(), summary.getEndJingDu(), Integer.valueOf(1)));
            }
          }
          List<DeviceGps> dtoGpsBegin = null;
          List<DeviceGps> dtoGpsEnd = null;
          DeviceTrack beginTrack = null;
          DeviceTrack endTrack = null;
          if (summary.getLiCheng() == null)
          {
            dtoGpsBegin = this.deviceGpsService.queryDeviceTrack(begintime, endtime, false, summary.getDevIdno(), null);
            dtoGpsEnd = this.deviceGpsService.queryDeviceTrack(begintime, endtime, true, summary.getDevIdno(), null);
            beginTrack = getDeviceTrack(dtoGpsBegin, begintime, endtime, false, 0);
            endTrack = getDeviceTrack(dtoGpsEnd, begintime, endtime, true, 0);
            setSummary(summary, beginTrack, endTrack, 0, toMap.intValue());
          }
          if (summary.getLiCheng() != null)
          {
            listSummary.add(summary);
          }
          else
          {
            beginTrack = getDeviceTrack(dtoGpsBegin, begintime, endtime, false, 1);
            endTrack = getDeviceTrack(dtoGpsEnd, begintime, endtime, true, 1);
            setSummary(summary, beginTrack, endTrack, 1, toMap.intValue());
            listSummary.add(summary);
          }
        }
        catch (Exception e)
        {
          e.printStackTrace();
        }
      }
    }
    AjaxDto<DeviceLichengSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(devGps.getPagination());
    dtoSummary.setPageList(listSummary);
    return dtoSummary;
  }
  
  public String summary()
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
        (!DateUtil.isLongTimeValid(beginDate)) || (!DateUtil.isLongTimeValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceLichengSummary> dtoSummary = doSummaryEx(beginDate, endDate, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), query.getDevIdnos().split(","), getPaginationEx());
        
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
  
  public String daily()
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
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceDaily> ajaxDto = this.deviceDailyService.queryDeviceDaily(beginDate, 
          endDate, queryFilter, qtype, sortname, sortorder, query.getDevIdnos().split(","), getPaginationEx());
        
        List<DeviceDaily> dailys = ajaxDto.getPageList();
        if (dailys != null) {
          for (int i = 0; i < dailys.size(); i++)
          {
            DeviceDaily daily = (DeviceDaily)dailys.get(i);
            daily.setStartTimeStr(DateUtil.dateSwitchString(daily.getStartTime()));
            daily.setEndTimeStr(DateUtil.dateSwitchString(daily.getEndTime()));
            daily.setDateStr(DateUtil.dateSwitchDateString(daily.getDate()));
            if (daily.getLiCheng() == null) {
              daily.setLiCheng(Integer.valueOf(daily.getEndLiCheng().intValue() - daily.getStartLiCheng().intValue()));
            }
            if (isGpsValid(Integer.valueOf(1)))
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
              daily.setStartPosition(getMapPosition(daily.getStartJingDu(), daily.getStartWeiDu(), mapType));
              daily.setEndPosition(getMapPosition(daily.getEndJingDu(), daily.getEndWeiDu(), mapType));
            }
          }
        }
        addCustomResponse("infos", dailys);
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
  
  public String updateDevDaily()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      String date = getRequestString("date");
      String licheng = getRequestString("licheng");
      String[] idnos = { devIdno };
      AjaxDto<DeviceDaily> dailys = this.deviceDailyService.queryDeviceDaily(date, date, null, null, null, null, idnos, null);
      if ((dailys.getPageList() != null) && (dailys.getPageList().size() > 0))
      {
        DeviceDaily daily = (DeviceDaily)dailys.getPageList().get(0);
        daily.setLiCheng(Integer.valueOf(Integer.parseInt(licheng)));
        this.deviceDailyService.save(daily);
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
    if (distance == null) {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    } else {
      queryGpsTrack(distance, null, getPaginationEx());
    }
    return "success";
  }
  
  public String ticketDetail()
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
        List<Integer> lstArmType = new ArrayList();
        lstArmType.add(Integer.valueOf(113));
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), lstArmType, " and armInfo = 13 ", getPaginationEx(), null, null, null, null);
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
  
  private boolean isTicket()
  {
    String type = getRequest().getParameter("type");
    if ((type != null) && (type.equals("ticket"))) {
      return true;
    }
    return false;
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[9];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = (getText("report.normal.total.licheng") + getLiChengUnit());
    heads[3] = getText("report.begintime");
    heads[4] = (getText("report.normal.begin.licheng") + getLiChengUnit());
    heads[5] = getText("report.normal.begin.position");
    heads[6] = getText("report.endtime");
    heads[7] = (getText("report.normal.end.licheng") + getLiChengUnit());
    heads[8] = getText("report.normal.end.position");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<DeviceLichengSummary> dtoSummary = doSummaryEx(begintime, endtime, queryFilter, qtype, sortname, sortorder, toMap, devIdnos.split(","), null);
    for (int i = 1; i <= dtoSummary.getPageList().size(); i++)
    {
      DeviceLichengSummary summary = (DeviceLichengSummary)dtoSummary.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getStartTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getLiCheng()), "0.000");
        
        export.setCellValue(Integer.valueOf(j++), summary.getStartTimeStr());
        
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getStartLiCheng()), "0.000");
        if (isGpsValid(Integer.valueOf(1))) {
          export.setCellValue(Integer.valueOf(j++), summary.getStartPosition());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), summary.getEndTimeStr());
        
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getEndLiCheng()), "0.000");
        if (isGpsValid(Integer.valueOf(1))) {
          export.setCellValue(Integer.valueOf(j++), summary.getEndPosition());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.normal.summary");
  }
  
  protected String[] genDetailHeads()
  {
    if (isTicket())
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.normal.ticket.peopleNumber");
      heads[4] = getText("report.normal.ticket.ticketed");
      return heads;
    }
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = (getText("report.normal.total.licheng") + getLiChengUnit());
    heads[4] = getText("report.begintime");
    heads[5] = getText("report.normal.begin.position");
    heads[6] = getText("report.endtime");
    heads[7] = getText("report.normal.end.position");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    if (isTicket())
    {
      List<Integer> lstArmType = new ArrayList();
      lstArmType.add(Integer.valueOf(113));
      AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
        devIdnos.split(","), lstArmType, " and armInfo = 13 ", null, null, null, null, null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(alarm.getArmTime()));
          
          export.setCellValue(Integer.valueOf(j++), alarm.getParam1());
          
          export.setCellValue(Integer.valueOf(j++), alarm.getParam2());
        }
      }
    }
    else
    {
      AjaxDto<DeviceDaily> ajaxDto = this.deviceDailyService.queryDeviceDaily(begintime, 
        endtime, queryFilter, qtype, sortname, sortorder, devIdnos.split(","), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          DeviceDaily daily = (DeviceDaily)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(daily.getDevIdno()));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(daily.getDate()));
          if (daily.getLiCheng() != null) {
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(daily.getLiCheng()), Integer.valueOf(0));
          } else {
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(Integer.valueOf(daily.getEndLiCheng().intValue() - daily.getStartLiCheng().intValue())), Integer.valueOf(0));
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(daily.getStartTime()));
          if (isGpsValid(Integer.valueOf(1)))
          {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              export.setCellValue(Integer.valueOf(j++), getMapPosition(daily.getStartJingDu(), daily.getStartWeiDu(), toMap.intValue()));
            } else if ((daily.getStartWeiDu() == null) || (daily.getStartWeiDu().intValue() == 0) || 
              (daily.getStartJingDu() == null) || (daily.getStartJingDu().intValue() == 0)) {
              export.setCellValue(Integer.valueOf(j++), "");
            } else {
              export.setCellValue(Integer.valueOf(j++), getPosition(daily.getStartWeiDu(), daily.getStartJingDu(), Integer.valueOf(1)));
            }
          }
          else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(daily.getEndTime()));
          if (isGpsValid(Integer.valueOf(1)))
          {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              export.setCellValue(Integer.valueOf(j++), getMapPosition(daily.getEndJingDu(), daily.getEndWeiDu(), toMap.intValue()));
            } else if ((daily.getEndWeiDu() == null) || (daily.getEndWeiDu().intValue() == 0) || 
              (daily.getEndJingDu() == null) || (daily.getEndJingDu().intValue() == 0)) {
              export.setCellValue(Integer.valueOf(j++), "");
            } else {
              export.setCellValue(Integer.valueOf(j++), getPosition(daily.getEndWeiDu(), daily.getEndJingDu(), Integer.valueOf(1)));
            }
          }
          else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    if (isTicket()) {
      return getText("report.normal.ticket.daily");
    }
    return getText("report.normal.daily");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.currentPosition");
    heads[4] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[5] = (getText("report.normal.total.licheng") + getLiChengUnit());
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String devIdno, ExportReport export)
  {
    try
    {
      String distance = getRequestString("distance");
      if (distance != null)
      {
        int meter = 0;
        if (!distance.isEmpty()) {
          meter = (int)(Double.parseDouble(distance) * 1000.0D);
        }
        int park = 0;
        AjaxDto<DeviceTrack> ajaxDto = this.deviceGpsService.queryDeviceGps(devIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, park, null, null);
        if (ajaxDto.getPageList() != null) {
          for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
          {
            DeviceTrack track = (DeviceTrack)ajaxDto.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            
            export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(track.getDevIdno()));
            if (track.getGpsTime() == null) {
              export.setCellValue(Integer.valueOf(j++), "");
            } else {
              export.setCellValue(Integer.valueOf(j++), track.getGpsTime());
            }
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
    return getText("report.normal.track");
  }
}
