package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.vo.DeviceQuery;
import com.gps.vehicle.model.MapMarker;
import com.gps.vehicle.service.MapMarkerService;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportFenceAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private MapMarkerService mapMarkerService;
  
  public MapMarkerService getMapMarkerService()
  {
    return this.mapMarkerService;
  }
  
  public void setMapMarkerService(MapMarkerService mapMarkerService)
  {
    this.mapMarkerService = mapMarkerService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_FENCE);
  }
  
  public String markerLists()
    throws Exception
  {
    try
    {
      addCustomResponse("markers", this.mapMarkerService.getMapMarkerList(getClientId()));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    String armType = getRequestString("armType");
    if ((armType != null) && (!armType.equals("0")))
    {
      Integer type = Integer.valueOf(Integer.parseInt(armType));
      lstArmType.add(type);
      lstArmType.add(Integer.valueOf(type.intValue() + 50));
    }
    else
    {
      lstArmType.add(Integer.valueOf(27));
      lstArmType.add(Integer.valueOf(28));
      lstArmType.add(Integer.valueOf(31));
      lstArmType.add(Integer.valueOf(32));
      lstArmType.add(Integer.valueOf(29));
      lstArmType.add(Integer.valueOf(30));
      lstArmType.add(Integer.valueOf(33));
      lstArmType.add(Integer.valueOf(34));
      lstArmType.add(Integer.valueOf(77));
      lstArmType.add(Integer.valueOf(78));
      lstArmType.add(Integer.valueOf(81));
      lstArmType.add(Integer.valueOf(82));
      lstArmType.add(Integer.valueOf(79));
      lstArmType.add(Integer.valueOf(80));
      lstArmType.add(Integer.valueOf(83));
      lstArmType.add(Integer.valueOf(84));
    }
    return lstArmType;
  }
  
  protected String getAlarmCondition()
  {
    String markerId = getRequestString("markerId");
    StringBuilder condition = new StringBuilder();
    if ((markerId != null) && (!markerId.equals("0"))) {
      condition.append(String.format("and param1 = %d ", new Object[] { Integer.valueOf(Integer.parseInt(markerId)) }));
    }
    return condition.toString();
  }
  
  public String alarmDetail()
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
          query.getDevIdnos().split(","), getAlarmQueryType(), getAlarmCondition(), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
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
  
  protected List<Integer> getAccessQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(107));
    return lstArmType;
  }
  
  protected String getAccessCondition()
  {
    String markerId = getRequestString("markerId");
    String parkTime = getRequestString("parkTime");
    StringBuilder condition = new StringBuilder();
    if ((parkTime != null) && (!parkTime.equals("0"))) {
      condition.append(String.format("and param4 >= %d ", new Object[] { Integer.valueOf(Integer.parseInt(parkTime) * 60) }));
    }
    if ((markerId != null) && (!markerId.equals("0"))) {
      condition.append(String.format("and param1 = %s ", new Object[] { markerId }));
    }
    return condition.toString();
  }
  
  public String queryEvent(List<Integer> lstArm)
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
          query.getDevIdnos().split(","), lstArm, getAccessCondition(), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
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
              deviceAlarm.setPosition2(getMapPosition(deviceAlarm.getParam2(), deviceAlarm.getParam3(), mapType));
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
  
  public String accessDetail()
    throws Exception
  {
    return queryEvent(getAccessQueryType());
  }
  
  protected List<Integer> getParkQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(108));
    return lstArmType;
  }
  
  public String parkDetail()
    throws Exception
  {
    return queryEvent(getParkQueryType());
  }
  
  protected boolean isAlarm()
  {
    String type = getRequest().getParameter("type");
    return type.equals("alarm");
  }
  
  protected boolean isAccess()
  {
    String type = getRequest().getParameter("type");
    return type.equals("access");
  }
  
  protected boolean isPark()
  {
    String type = getRequest().getParameter("type");
    return type.equals("park");
  }
  
  protected String[] genDetailHeads()
  {
    if (isAlarm())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.fence.marker");
      heads[4] = getText("report.type");
      heads[5] = getText("report.currentPosition");
      return heads;
    }
    if (isAccess())
    {
      String[] heads = new String[8];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.fence.marker");
      heads[3] = getText("report.fence.inTime");
      heads[4] = getText("report.fence.inPosition");
      heads[5] = getText("report.fence.outTime");
      heads[6] = getText("report.fence.outPosition");
      heads[7] = getText("report.fence.remainTime");
      return heads;
    }
    if (isPark())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.fence.marker");
      heads[3] = getText("report.begintime");
      heads[4] = getText("report.currentPosition");
      heads[5] = getText("report.endtime");
      heads[6] = getText("report.fence.parkTime");
      return heads;
    }
    return null;
  }
  
  protected String getAlarmTypeName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 27: 
    case 77: 
      ret = getText("report.fence.in");
      break;
    case 28: 
    case 78: 
      ret = getText("report.fence.out");
      break;
    case 31: 
    case 81: 
      ret = getText("report.fence.inLowspeed");
      break;
    case 32: 
    case 82: 
      ret = getText("report.fence.inLowspeed");
      break;
    case 29: 
    case 79: 
      ret = getText("report.fence.inOverspeed");
      break;
    case 30: 
    case 80: 
      ret = getText("report.fence.outOverspeed");
      break;
    case 33: 
    case 83: 
      ret = getText("report.fence.intPark");
      break;
    case 34: 
    case 84: 
      ret = getText("report.fence.outPark");
    }
    return ret;
  }
  
  protected void genAlarmExcelData(List<DeviceAlarm> lstAlarm, Integer toMap, ExportReport export)
  {
    if (lstAlarm != null)
    {
      List<MapMarker> lstMarkers = this.mapMarkerService.getMapMarkerList(getClientId());
      Map<Integer, MapMarker> mapMarkes = new HashMap();
      if ((lstMarkers != null) && (lstMarkers.size() > 0)) {
        for (int i = 0; i < lstMarkers.size(); i++) {
          mapMarkes.put(((MapMarker)lstMarkers.get(i)).getId(), (MapMarker)lstMarkers.get(i));
        }
      }
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        if (isAlarm())
        {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
          
          MapMarker marker = (MapMarker)mapMarkes.get(alarm.getParam1());
          if (marker != null) {
            export.setCellValue(Integer.valueOf(j++), marker.getName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (alarm.getArmType().intValue() <= 34) {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramBegin"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramEnd"));
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
        }
        else if (isAccess())
        {
          MapMarker marker = (MapMarker)mapMarkes.get(alarm.getParam1());
          if (marker != null) {
            export.setCellValue(Integer.valueOf(j++), marker.getName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
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
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(alarm.getArmTime().getTime() + alarm.getParam4().intValue() * 1000)));
          if (isGpsValid(alarm.getStatus1()))
          {
            if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
              export.setCellValue(Integer.valueOf(j++), getMapPosition(alarm.getParam2(), alarm.getParam3(), toMap.intValue()));
            } else if ((alarm.getParam2() == null) || (alarm.getParam2().intValue() == 0) || 
              (alarm.getParam3() == null) || (alarm.getParam3().intValue() == 0)) {
              export.setCellValue(Integer.valueOf(j++), "");
            } else {
              export.setCellValue(Integer.valueOf(j++), getPosition(alarm.getParam3(), alarm.getParam2(), alarm.getStatus1()));
            }
          }
          else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(alarm.getParam4().intValue(), getText("report.hour"), 
            getText("report.minute"), getText("report.second")));
        }
        else if (isPark())
        {
          MapMarker marker = (MapMarker)mapMarkes.get(alarm.getParam1());
          if (marker != null) {
            export.setCellValue(Integer.valueOf(j++), marker.getName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
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
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(alarm.getArmTime().getTime() + alarm.getParam4().intValue() * 1000)));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(alarm.getParam4().intValue(), getText("report.hour"), 
            getText("report.minute"), getText("report.second")));
        }
      }
    }
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<DeviceAlarm> ajaxDto = null;
    if (isAlarm()) {
      ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
        devIdnos.split(","), getAlarmQueryType(), getAlarmCondition(), null, null, null, null, null);
    } else if (isAccess()) {
      ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
        devIdnos.split(","), getAccessQueryType(), getAccessCondition(), null, null, null, null, null);
    } else if (isPark()) {
      ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
        devIdnos.split(","), getParkQueryType(), getAccessCondition(), null, null, null, null, null);
    }
    genAlarmExcelData(ajaxDto.getPageList(), toMap, export);
  }
  
  protected String genDetailTitle()
  {
    if (isAlarm()) {
      return getText("report.fence.alarmDetail");
    }
    if (isAccess()) {
      return getText("report.fence.accessDetail");
    }
    if (isPark()) {
      return getText("report.fence.parkDetail");
    }
    return "";
  }
}
