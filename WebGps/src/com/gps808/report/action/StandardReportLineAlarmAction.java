package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceAlarmEx;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class StandardReportLineAlarmAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleGpsService vehicleGpsService;
  
  public StandardVehicleGpsService getVehicleGpsService()
  {
    return this.vehicleGpsService;
  }
  
  public void setVehicleGpsService(StandardVehicleGpsService vehicleGpsService)
  {
    this.vehicleGpsService = vehicleGpsService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String summary()
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
        String[] vids = query.getVehiIdnos().split(",");
        String dids = "";
        for (int i = 0; i < vids.length; i++)
        {
          String devIdno = null;
          devIdno = getGPSDevIdno(vids[i]);
          if (i != 0) {
            dids = dids + ",";
          }
          dids = dids + devIdno;
        }
        String alarmTime = getRequestString("alarmTime");
        String speed = getRequestString("speed");
        String rate = getRequestString("rate");
        String toMap = getRequestString("toMap");
        AjaxDto<StandardDeviceAlarmSummary> ajaxDto = this.vehicleGpsService.queryLineDeviceAlarmSummary(begintime, endtime, vids, alarmTime, speed, rate, dids, toMap, getPaginationEx());
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
    if (BaseAction.getEnableTrip())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.line");
      heads[2] = getText("report.vehicle");
      heads[3] = getText("report.plateColor");
      heads[4] = getText("report.begintime");
      heads[5] = getText("report.endtime");
      heads[6] = getText("report.alarm.total");
      return heads;
    }
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.alarm.total");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String alarmTime = getRequestString("alarmTime");
    String speed = getRequestString("speed");
    String rate = getRequestString("rate");
    String[] vids = vehiIdnos.split(",");
    String dids = "";
    for (int i = 0; i < vids.length; i++)
    {
      String devIdno = null;
      devIdno = getGPSDevIdno(vids[i]);
      if (i != 0) {
        dids = dids + ",";
      }
      dids = dids + devIdno;
    }
    AjaxDto<StandardDeviceAlarmSummary> ajaxDto = this.vehicleGpsService.queryLineDeviceAlarmSummary(begintime, endtime, vids, alarmTime, speed, rate, dids, toMap.toString(), null);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        if (BaseAction.getEnableTrip())
        {
          StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, summary.getCompanyId());
          if ((company != null) && (company.getLevel().intValue() == 3)) {
            export.setCellValue(Integer.valueOf(j++), company.getName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
        }
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
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
        export.setCellValue(Integer.valueOf(j++), summary.getCount());
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.overspeed.summary");
  }
  
  public String detail()
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
        String[] vids = query.getVehiIdnos().split(",");
        String dids = "";
        for (int i = 0; i < vids.length; i++)
        {
          String devIdno = null;
          devIdno = getGPSDevIdno(vids[i]);
          if (i != 0) {
            dids = dids + ",";
          }
          dids = dids + devIdno;
        }
        String alarmTime = getRequestString("alarmTime");
        String speed = getRequestString("speed");
        String rate = getRequestString("rate");
        String toMap = getRequestString("toMap");
        AjaxDto<StandardDeviceAlarmEx> ajaxDto = this.vehicleGpsService.queryLineDeviceAlarmDetail(begintime, endtime, vids, alarmTime, speed, rate, dids, toMap, getPaginationEx());
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          for (int i = 0; i < ajaxDto.getPageList().size(); i++)
          {
            StandardDeviceAlarmEx alarm = (StandardDeviceAlarmEx)ajaxDto.getPageList().get(i);
            alarm.setDesc(getTimeDifference(alarm.getEtm().getTime() - alarm.getStm().getTime()));
            alarm.setSmlat(getMapPositionEx(alarm.getSlng(), alarm.getSlat(), Integer.parseInt(toMap), getSession().get("WW_TRANS_I18N_LOCALE")));
            alarm.setEmlat(getMapPositionEx(alarm.getElng(), alarm.getElat(), Integer.parseInt(toMap), getSession().get("WW_TRANS_I18N_LOCALE")));
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
  
  protected String[] genDetailHeads()
  {
    if (BaseAction.getEnableTrip())
    {
      String[] heads = new String[14];
      heads[0] = getText("report.index");
      heads[1] = getText("report.line");
      heads[2] = getText("line.direction");
      heads[3] = getText("report.vehicle");
      heads[4] = getText("report.plateColor");
      heads[5] = getText("report.begintime");
      heads[6] = getText("report.endtime");
      heads[7] = getText("speed.length");
      heads[8] = getText("report.alarm.startSpeed");
      heads[9] = getText("report.normal.begin.licheng");
      heads[10] = getText("report.normal.begin.position");
      heads[11] = getText("report.alarm.endSpeed");
      heads[12] = getText("report.normal.end.licheng");
      heads[13] = getText("report.normal.end.position");
      return heads;
    }
    String[] heads = new String[12];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("speed.length");
    heads[6] = getText("report.alarm.startSpeed");
    heads[7] = getText("report.normal.begin.licheng");
    heads[8] = getText("report.normal.begin.position");
    heads[9] = getText("report.alarm.endSpeed");
    heads[10] = getText("report.normal.end.licheng");
    heads[11] = getText("report.normal.end.position");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    String alarmTime = getRequestString("alarmTime");
    String speed = getRequestString("speed");
    String rate = getRequestString("rate");
    String[] vids = vehiIdnos.split(",");
    String dids = "";
    for (int i = 0; i < vids.length; i++)
    {
      String devIdno = null;
      devIdno = getGPSDevIdno(vids[i]);
      if (i != 0) {
        dids = dids + ",";
      }
      dids = dids + devIdno;
    }
    AjaxDto<StandardDeviceAlarmEx> ajaxDto = this.vehicleGpsService.queryLineDeviceAlarmDetail(begintime, endtime, vids, alarmTime, speed, rate, dids, toMap.toString(), null);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        StandardDeviceAlarmEx alarm = (StandardDeviceAlarmEx)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        if (BaseAction.getEnableTrip())
        {
          StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, alarm.getP1());
          if ((company != null) && (company.getLevel().intValue() == 3)) {
            export.setCellValue(Integer.valueOf(j++), company.getName());
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          String direction = getText("line.up");
          if (alarm.getP2().intValue() == 1) {
            direction = getText("line.down");
          }
          export.setCellValue(Integer.valueOf(j++), direction);
        }
        export.setCellValue(Integer.valueOf(j++), alarm.getVid());
        
        String plateColor = getText("other");
        switch (alarm.getP3().intValue())
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
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getStm()));
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getEtm()));
        export.setCellValue(Integer.valueOf(j++), getTimeDifference(alarm.getEtm().getTime() - alarm.getStm().getTime()));
        export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getSsp(), Integer.valueOf(1)));
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(alarm.getSlc()), "0.000");
        export.setCellValue(Integer.valueOf(j++), getMapPositionEx(alarm.getSlng(), alarm.getSlat(), toMap.intValue(), getSession().get("WW_TRANS_I18N_LOCALE")));
        export.setCellValue(Integer.valueOf(j++), getSpeed(alarm.getEsp(), Integer.valueOf(1)));
        export.setCellValue(Integer.valueOf(j++), getLiChengEx(alarm.getElc()), "0.000");
        export.setCellValue(Integer.valueOf(j++), getMapPositionEx(alarm.getElng(), alarm.getElat(), toMap.intValue(), getSession().get("WW_TRANS_I18N_LOCALE")));
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.overspeed.detail");
  }
}
