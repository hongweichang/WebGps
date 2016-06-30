package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.DeviceService;
import com.gps.model.DeviceAlarm;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceYouLiang;
import com.gps.model.UserRole;
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
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportOilAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DeviceDailyService deviceDailyService;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_OIL);
  }
  
  public DeviceDailyService getDeviceDailyService()
  {
    return this.deviceDailyService;
  }
  
  public void setDeviceDailyService(DeviceDailyService deviceDailyService)
  {
    this.deviceDailyService = deviceDailyService;
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
          int threshold = 0;
          DeviceInfo device = (DeviceInfo)this.deviceService.getObject(DeviceInfo.class, gps.getDevIdno());
          DeviceYouLiang youLiang = this.deviceService.getDeviceYouLiang(gps.getDevIdno());
          if (youLiang != null) {
            threshold = youLiang.getNc().intValue();
          }
          summary.setDevIdno(gps.getDevIdno());
          summary.setDriverName(device.getDriverName());
          Integer mileage = Integer.valueOf(0);
          Integer youliang = Integer.valueOf(0);
          int times = 0;
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
              int beginMile = begin.getLiCheng().intValue();
              int beginyou = 0;
              int btime = (int)DateUtil.StrLongTime2Date(begin.getGpsTime()).getTime() / 1000;
              int stime = btime;
              int endMile = 0;
              int etime = 0;
              int byou = 0;
              int avgyou = 0;
              String mtime = null;
              boolean flag = false;
              LinkedList<Integer> youList = new LinkedList();
              for (int j = 1; j < beginTracks.size(); j++) {
                if (beginTracks.get(j) != null)
                {
                  endMile = ((DeviceTrack)beginTracks.get(j)).getLiCheng().intValue();
                  etime = (int)DateUtil.StrLongTime2Date(((DeviceTrack)beginTracks.get(j)).getGpsTime()).getTime() / 1000;
                  if (endMile > beginMile) {
                    mileage = Integer.valueOf(mileage.intValue() + (endMile - beginMile));
                  }
                  if (etime - btime < 180)
                  {
                    times += etime - btime;
                  }
                  else
                  {
                    if (flag)
                    {
                      youliang = Integer.valueOf(youliang.intValue() + (((DeviceTrack)beginTracks.get(j - 1)).getYouLiang().intValue() - byou));
                      flag = false;
                      byou = ((DeviceTrack)beginTracks.get(j - 1)).getYouLiang().intValue();
                      mtime = ((DeviceTrack)beginTracks.get(j - 1)).getGpsTime();
                    }
                    youList.clear();
                    stime = etime;
                  }
                  if (etime - stime > 30)
                  {
                    if (((DeviceTrack)beginTracks.get(j - 1)).getYouLiang() != ((DeviceTrack)beginTracks.get(j)).getYouLiang())
                    {
                      if (beginyou == 0)
                      {
                        beginyou = ((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue();
                        byou = beginyou;
                        mtime = ((DeviceTrack)beginTracks.get(j)).getGpsTime();
                        if ((summary.getStartYouLiang() == null) || (summary.getStartYouLiang().intValue() == 0)) {
                          summary.setStartYouLiang(((DeviceTrack)beginTracks.get(j)).getYouLiang());
                        }
                      }
                      else if (etime - (int)DateUtil.StrLongTime2Date(mtime).getTime() / 1000 > 600)
                      {
                        byou = ((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue();
                        mtime = ((DeviceTrack)beginTracks.get(j)).getGpsTime();
                      }
                      else if (((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue() < byou)
                      {
                        byou = ((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue();
                        mtime = ((DeviceTrack)beginTracks.get(j)).getGpsTime();
                      }
                      if (youList.size() >= 5)
                      {
                        avgyou = (((Integer)youList.get(0)).intValue() + ((Integer)youList.get(1)).intValue() + ((Integer)youList.get(2)).intValue() + ((Integer)youList.get(3)).intValue() + ((Integer)youList.get(4)).intValue()) / 5;
                        if (((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue() - avgyou > threshold * 100)
                        {
                          if (!flag) {
                            flag = true;
                          }
                        }
                        else if (flag)
                        {
                          youliang = Integer.valueOf(youliang.intValue() + (((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue() - byou));
                          flag = false;
                          byou = ((DeviceTrack)beginTracks.get(j)).getYouLiang().intValue();
                          mtime = ((DeviceTrack)beginTracks.get(j)).getGpsTime();
                          youList.clear();
                        }
                        if (!youList.isEmpty()) {
                          youList.removeFirst();
                        }
                      }
                      youList.add(((DeviceTrack)beginTracks.get(j)).getYouLiang());
                    }
                  }
                  else
                  {
                    beginMile = endMile;
                    btime = etime;
                  }
                }
              }
              if ((flag) && (byou != 0)) {
                youliang = Integer.valueOf(youliang.intValue() + (end.getYouLiang().intValue() - byou));
              }
              if (threshold == 0) {
                youliang = Integer.valueOf(beginyou - end.getYouLiang().intValue());
              } else {
                youliang = Integer.valueOf(youliang.intValue() + (beginyou - end.getYouLiang().intValue()));
              }
              summary.setEndLiCheng(end.getLiCheng());
              summary.setEndJingDu(end.getJingDu());
              summary.setEndWeiDu(end.getWeiDu());
              summary.setEndGaoDu(end.getGaoDu());
              summary.setEndTime(DateUtil.StrLongTime2Date(end.getGpsTime()));
              summary.setEndTimeStr(end.getGpsTime());
              summary.setEndYouLiang(end.getYouLiang());
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
                  summary.setStartYouLiang(daily.getStartYouLiang());
                }
                mileage = Integer.valueOf(mileage.intValue() + kilometer);
              }
              youliang = Integer.valueOf(youliang.intValue() + daily.getYouLiang().intValue());
              times += daily.getWorkTime().intValue();
            }
            DeviceDaily endDaily = (DeviceDaily)dailys.get(dailys.size() - 1);
            summary.setEndLiCheng(endDaily.getEndLiCheng());
            summary.setEndJingDu(endDaily.getEndJingDu());
            summary.setEndWeiDu(endDaily.getEndWeiDu());
            summary.setEndGaoDu(endDaily.getEndGaoDu());
            summary.setEndTime(endDaily.getEndTime());
            summary.setEndTimeStr(endDaily.getEndTimeStr());
            summary.setEndYouLiang(endDaily.getEndYouLiang());
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
                summary.setStartLiCheng(begin.getLiCheng());
                summary.setStartJingDu(begin.getJingDu());
                summary.setStartWeiDu(begin.getWeiDu());
                summary.setStartGaoDu(begin.getGaoDu());
                summary.setStartTime(DateUtil.StrLongTime2Date(begin.getGpsTime()));
                summary.setStartTimeStr(begin.getGpsTime());
              }
              int beginMile = ((DeviceTrack)endTracks.get(0)).getLiCheng().intValue();
              int beginyou = 0;
              int btime = (int)DateUtil.StrLongTime2Date(((DeviceTrack)endTracks.get(0)).getGpsTime()).getTime() / 1000;
              int stime = btime;
              int endMile = 0;
              int etime = 0;
              int byou = 0;
              int avgyou = 0;
              int lyou = youliang.intValue();
              String mtime = null;
              boolean flag = false;
              LinkedList<Integer> youList = new LinkedList();
              for (int j = 1; j < endTracks.size(); j++) {
                if (endTracks.get(j) != null)
                {
                  endMile = ((DeviceTrack)endTracks.get(j)).getLiCheng().intValue();
                  etime = (int)DateUtil.StrLongTime2Date(((DeviceTrack)endTracks.get(j)).getGpsTime()).getTime() / 1000;
                  if (endMile > beginMile) {
                    mileage = Integer.valueOf(mileage.intValue() + (endMile - beginMile));
                  }
                  if (etime - btime < 180)
                  {
                    times += etime - btime;
                  }
                  else
                  {
                    if (flag)
                    {
                      youliang = Integer.valueOf(youliang.intValue() + (((DeviceTrack)endTracks.get(j - 1)).getYouLiang().intValue() - byou));
                      flag = false;
                      byou = ((DeviceTrack)endTracks.get(j - 1)).getYouLiang().intValue();
                      mtime = ((DeviceTrack)endTracks.get(j - 1)).getGpsTime();
                    }
                    youList.clear();
                    stime = etime;
                  }
                  if (etime - stime > 30)
                  {
                    if (((DeviceTrack)endTracks.get(j - 1)).getYouLiang() != ((DeviceTrack)endTracks.get(j)).getYouLiang())
                    {
                      if (beginyou == 0)
                      {
                        beginyou = ((DeviceTrack)endTracks.get(j)).getYouLiang().intValue();
                        byou = beginyou;
                        mtime = ((DeviceTrack)endTracks.get(j)).getGpsTime();
                        if ((summary.getStartYouLiang() == null) || (summary.getStartYouLiang().intValue() == 0)) {
                          summary.setStartYouLiang(((DeviceTrack)endTracks.get(j)).getYouLiang());
                        }
                      }
                      else if (etime - (int)DateUtil.StrLongTime2Date(mtime).getTime() / 1000 > 600)
                      {
                        byou = ((DeviceTrack)endTracks.get(j)).getYouLiang().intValue();
                        mtime = ((DeviceTrack)endTracks.get(j)).getGpsTime();
                      }
                      else if (((DeviceTrack)endTracks.get(j)).getYouLiang().intValue() < byou)
                      {
                        byou = ((DeviceTrack)endTracks.get(j)).getYouLiang().intValue();
                        mtime = ((DeviceTrack)endTracks.get(j)).getGpsTime();
                      }
                      if (youList.size() >= 5)
                      {
                        avgyou = (((Integer)youList.get(0)).intValue() + ((Integer)youList.get(1)).intValue() + ((Integer)youList.get(2)).intValue() + ((Integer)youList.get(3)).intValue() + ((Integer)youList.get(4)).intValue()) / 5;
                        if (((DeviceTrack)endTracks.get(j)).getYouLiang().intValue() - avgyou > threshold * 100)
                        {
                          if (!flag) {
                            flag = true;
                          }
                        }
                        else if (flag)
                        {
                          youliang = Integer.valueOf(youliang.intValue() + (((DeviceTrack)endTracks.get(j)).getYouLiang().intValue() - byou));
                          flag = false;
                          byou = ((DeviceTrack)endTracks.get(j)).getYouLiang().intValue();
                          mtime = ((DeviceTrack)endTracks.get(j - 1)).getGpsTime();
                          youList.clear();
                        }
                        if (!youList.isEmpty()) {
                          youList.removeFirst();
                        }
                      }
                      youList.add(((DeviceTrack)endTracks.get(j)).getYouLiang());
                    }
                  }
                  else
                  {
                    beginMile = endMile;
                    btime = etime;
                  }
                }
              }
              DeviceTrack end = (DeviceTrack)endTracks.get(endTracks.size() - 1);
              if ((flag) && (byou != 0)) {
                youliang = Integer.valueOf(youliang.intValue() + (end.getYouLiang().intValue() - byou));
              }
              if (threshold == 0) {
                youliang = Integer.valueOf(beginyou - end.getYouLiang().intValue() + lyou);
              } else {
                youliang = Integer.valueOf(youliang.intValue() + (beginyou - end.getYouLiang().intValue()));
              }
              summary.setEndLiCheng(end.getLiCheng());
              summary.setEndJingDu(end.getJingDu());
              summary.setEndWeiDu(end.getWeiDu());
              summary.setEndGaoDu(end.getGaoDu());
              summary.setEndTime(DateUtil.StrLongTime2Date(end.getGpsTime()));
              summary.setEndTimeStr(end.getGpsTime());
              summary.setEndYouLiang(end.getYouLiang());
            }
          }
          summary.setLiCheng(mileage);
          summary.setYouLiang(youliang);
          summary.setWorkTime(Integer.valueOf(times));
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
      queryGpsTrack(distance, null, pagination);
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
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String pagin = getJsonRequestString("pagin");
        Pagination pagination = null;
        if ((pagin != null) && (!"".equals(pagin))) {
          pagination = getPaginationEx();
        }
        AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getDevIdnos().split(","), getQueryType(oilType), " order by armTime ", pagination, queryFilter, qtype, sortname, sortorder);
        List<DeviceAlarm> deviceAlarms = ajaxDto.getPageList();
        if (deviceAlarms != null) {
          if (isGraph())
          {
            if (deviceAlarms.size() > 2) {
              for (int i = 1; i < deviceAlarms.size() - 2; i++)
              {
                boolean flag = true;
                while ((flag) && (i < deviceAlarms.size() - 2))
                {
                  int j = i + 1;
                  if ((((DeviceAlarm)deviceAlarms.get(i)).getArmInfo() != null) && (
                    (((DeviceAlarm)deviceAlarms.get(j)).getArmInfo() == null) || (
                    (((DeviceAlarm)deviceAlarms.get(i)).getArmInfo().intValue() == ((DeviceAlarm)deviceAlarms.get(j)).getArmInfo().intValue()) && 
                    (((DeviceAlarm)deviceAlarms.get(i)).getArmType().intValue() != ((DeviceAlarm)deviceAlarms.get(j)).getArmType().intValue())))) {
                    deviceAlarms.remove(j);
                  } else {
                    flag = false;
                  }
                }
              }
            }
          }
          else {
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
    String[] heads = new String[10];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.vehile.driverName");
    heads[2] = getText("report.vehicle");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.start.oil");
    heads[6] = getText("report.end.oil");
    heads[7] = getText("report.licheng.all");
    heads[8] = getText("report.oil.all");
    heads[9] = getText("report.times");
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
      
      export.setCellValue(Integer.valueOf(j++), summary.getDriverName());
      
      export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(summary.getDevIdno()));
      if (summary.getStartTime() != null)
      {
        export.setCellValue(Integer.valueOf(j++), summary.getStartTimeStr());
        
        export.setCellValue(Integer.valueOf(j++), summary.getEndTimeStr());
      }
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getStartYouLiang()));
      
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getEndYouLiang()));
      
      export.setCellValue(Integer.valueOf(j++), getLiChengEx(summary.getLiCheng()), "0.000");
      
      export.setCellValue(Integer.valueOf(j++), getYouLiang(summary.getYouLiang()));
      
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
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.oil.change");
    heads[4] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[5] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String oilType = getRequest().getParameter("oilType");
    AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
      devIdnos.split(","), getQueryType(oilType), " order by armTime ", null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        if (alarm.getArmType().equals(Integer.valueOf(46))) {
          export.setCellValue(Integer.valueOf(j++), getYouLiang(alarm.getArmInfo()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "-" + getYouLiang(alarm.getArmInfo()));
        }
        export.setCellValue(Integer.valueOf(j++), getLiCheng(alarm.getLiCheng()));
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
    return getText("report.oil.detail");
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.time");
    heads[3] = getText("report.currentYouLiang");
    heads[4] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[5] = getText("report.currentPosition");
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
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(track.getTrackTime())));
          
          export.setCellValue(Integer.valueOf(j++), getYouLiang(track.getYouLiang()));
          
          export.setCellValue(Integer.valueOf(j++), getLiCheng(track.getLiCheng()));
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
    return getText("report.oil.track");
  }
}
