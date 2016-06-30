package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.model.DeviceAlarm;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.model.DeviceHardwareStatus;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceHardwareStatusService;
import com.gps.report.vo.DeviceQuery;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class ReportHardwareStatusAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DeviceHardwareStatusService deviceHardwareStatusService;
  
  public DeviceHardwareStatusService getDeviceHardwareStatusService()
  {
    return this.deviceHardwareStatusService;
  }
  
  public void setDeviceHardwareStatusService(DeviceHardwareStatusService deviceHardwareStatusService)
  {
    this.deviceHardwareStatusService = deviceHardwareStatusService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_STORAGE);
  }
  
  public String diskerrorDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(10));
    lstArmType.add(Integer.valueOf(60));
    return alarmDetail(lstArmType);
  }
  
  public String highTemperatureDetail()
    throws Exception
  {
    List<Integer> lstArmType = new ArrayList();
    lstArmType.add(Integer.valueOf(157));
    lstArmType.add(Integer.valueOf(158));
    return alarmDetail(lstArmType);
  }
  
  public String alarmDetail(List<Integer> lstArmType)
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
      if ((begintime == null) || (endtime == null) || (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
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
  
  public String daily()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String diskStatus = getRequestString("diskStatus");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<DeviceHardwareStatus> list = this.deviceHardwareStatusService.queryHardwareStatus(beginDate, 
          endDate, query.getDevIdnos().split(","), diskStatus, getPaginationEx());
        if (list.getPageList() != null) {
          for (int i = 0; i < list.getPageList().size(); i++) {
            ((DeviceHardwareStatus)list.getPageList().get(i)).setDateStr(DateUtil.dateSwitchDateString(((DeviceHardwareStatus)list.getPageList().get(i)).getDate()));
          }
        }
        addCustomResponse("infos", list.getPageList());
        addCustomResponse("pagination", list.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean isHardwareStatus()
  {
    String type = getRequest().getParameter("type");
    return type.equals("hardwareStatus");
  }
  
  protected boolean isDiskError()
  {
    String type = getRequest().getParameter("type");
    return type.equals("diskerror");
  }
  
  protected boolean isHighTemperature()
  {
    String type = getRequest().getParameter("type");
    return type.equals("highTemperature");
  }
  
  protected List<Integer> getAlarmQueryType()
  {
    List<Integer> lstArmType = new ArrayList();
    if (isDiskError())
    {
      lstArmType.add(Integer.valueOf(10));
      lstArmType.add(Integer.valueOf(60));
    }
    else if (isHighTemperature())
    {
      lstArmType.add(Integer.valueOf(157));
      lstArmType.add(Integer.valueOf(158));
    }
    return lstArmType;
  }
  
  protected String[] genDetailHeads()
  {
    if (isHardwareStatus())
    {
      String[] heads = new String[4];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.harddiskstatusinformation");
      return heads;
    }
    if (isHighTemperature())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.type");
      heads[4] = getText("report.content");
      heads[5] = getText("report.currentPosition");
      return heads;
    }
    if (isDiskError())
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("report.type");
      heads[4] = getText("report.currentPosition");
      return heads;
    }
    return null;
  }
  
  protected String getAlarmTypeName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 10: 
    case 60: 
      ret = getText("report.alarm.diskerror");
      break;
    case 157: 
    case 158: 
      ret = getText("report.alarm.highTemperature");
    }
    return ret;
  }
  
  protected String genDetailTitle()
  {
    if (isHardwareStatus()) {
      return getText("report.harddiskstatusinformationdetail");
    }
    if (isDiskError()) {
      return getText("report.alarm.detail.diskerror");
    }
    if (isHighTemperature()) {
      return getText("report.alarm.detail.hightemperature");
    }
    return "";
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    if (isHardwareStatus())
    {
      String diskStatus = getRequestString("diskStatus");
      AjaxDto<DeviceHardwareStatus> ajaxDto = this.deviceHardwareStatusService.queryHardwareStatus(begintime, 
        endtime, devIdnos.split(","), diskStatus, null);
      genHardwareStatusExcelData(ajaxDto.getPageList(), toMap, export);
    }
    else if ((isDiskError()) || (isHighTemperature()))
    {
      AjaxDto<DeviceAlarm> ajaxDto = this.deviceAlarmService.queryDeviceAlarm(begintime, endtime, 
        devIdnos.split(","), getAlarmQueryType(), null, null, queryFilter, qtype, sortname, sortorder);
      genAlarmExcelData(ajaxDto.getPageList(), toMap, export);
    }
  }
  
  protected void genAlarmExcelData(List<DeviceAlarm> lstAlarm, Integer toMap, ExportReport export)
  {
    if (((isDiskError()) || (isHighTemperature())) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceAlarm alarm = (DeviceAlarm)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getArmTime()));
        if ((alarm.getArmType().intValue() == 10) || 
          (alarm.getArmType().intValue() == 157)) {
          export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramBegin"));
        } else {
          export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()) + "  " + getText("report.alramEnd"));
        }
        if (isHighTemperature())
        {
          String str = "";
          if (alarm.getArmInfo() != null) {
            str = str + getText("dardnumbers") + (alarm.getArmInfo().intValue() + 1) + ", ";
          }
          if (alarm.getParam1() != null) {
            switch (alarm.getParam1().intValue())
            {
            case 1: 
              str = str + getText("report.type") + ":" + getText("sdcard");
              break;
            case 2: 
              str = str + getText("report.type") + ":" + getText("harddisk");
              break;
            case 3: 
              str = str + getText("report.type") + ":" + getText("ssd");
            }
          }
          if (alarm.getParam2() != null) {
            str = str + ", " + getText("report.tempsensor.name") + ":" + alarm.getParam2() + " ";
          }
          export.setCellValue(Integer.valueOf(j++), str);
        }
        if (isGpsValid(alarm.getStatus1()))
        {
          if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(alarm.getJingDu(), alarm.getWeiDu(), toMap.intValue()));
          } else if ((alarm.getJingDu() == null) || (alarm.getJingDu().intValue() == 0) || 
            (alarm.getWeiDu() == null) || (alarm.getWeiDu().intValue() == 0)) {
            export.setCellValue(Integer.valueOf(j++), "");
          } else {
            export.setCellValue(Integer.valueOf(j++), getPosition(alarm.getWeiDu(), alarm.getJingDu(), Integer.valueOf(1)));
          }
        }
        else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
      }
    }
  }
  
  protected void genHardwareStatusExcelData(List<DeviceHardwareStatus> lstAlarm, Integer toMap, ExportReport export)
  {
    if ((isHardwareStatus()) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceHardwareStatus alarm = (DeviceHardwareStatus)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(alarm.getDate()));
        
        String str = "";
        if ((alarm.getDiskStatus() != null) && (alarm.getDiskAllVolume() != null) && (alarm.getDiskLeftVolume() != null) && (alarm.getDiskSerialNum() != null))
        {
          String[] arrStatus = alarm.getDiskStatus().split(",");
          String[] arrAllVolume = alarm.getDiskAllVolume().split(",");
          String[] arrLeftVolume = alarm.getDiskLeftVolume().split(",");
          String[] arrSerialNum = alarm.getDiskSerialNum().split(",");
          String[] arrDiskType = alarm.getDiskType().split(",");
          for (int k = 0; k < arrDiskType.length; k++)
          {
            String disk = getText("harddisk");
            if (arrDiskType[k].equals("1")) {
              disk = getText("sdcard");
            } else if (arrDiskType[k].equals("2")) {
              disk = getText("harddisk");
            } else if (arrDiskType[k].equals("3")) {
              disk = getText("ssd");
            } else if (arrDiskType[k].equals("4")) {
              disk = getText("mirror");
            }
            disk = disk + (k + 1) + "  ";
            
            String serial = "";
            if (arrSerialNum.length > k) {
              serial = getText("serialNumber") + ":" + arrSerialNum[k] + ",";
            }
            String space = getText("totalCapacity") + ":" + Math.round(Integer.parseInt(arrAllVolume[k]) / 1000.0D * 100.0D) / 10.0D + "," + getText("remainingSpace") + ":" + Math.round(Integer.parseInt(arrLeftVolume[k]) / 1000.0D * 100.0D) / 10.0D + ";   ";
            str = str + disk + serial + space;
          }
        }
        export.setCellValue(Integer.valueOf(j++), str);
      }
    }
  }
}
