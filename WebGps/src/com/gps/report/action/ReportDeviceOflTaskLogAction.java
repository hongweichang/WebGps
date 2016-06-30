package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.model.DeviceHardwareStatus;
import com.gps.report.model.DeviceOflTaskLog;
import com.gps.report.service.DeviceHardwareStatusService;
import com.gps.report.service.DeviceOflTaskLogService;
import com.gps.report.vo.DeviceQuery;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

public class ReportDeviceOflTaskLogAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DeviceOflTaskLogService deviceOflTaskLogService;
  private DeviceHardwareStatusService deviceHardwareStatusService;
  
  public DeviceOflTaskLogService getDeviceOflTaskLogService()
  {
    return this.deviceOflTaskLogService;
  }
  
  public void setDeviceOflTaskLogService(DeviceOflTaskLogService deviceOflTaskLogService)
  {
    this.deviceOflTaskLogService = deviceOflTaskLogService;
  }
  
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
    return findPrivilege(UserRole.PRIVI_REPORT_EQUIPMENT);
  }
  
  public String daily()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String nTaskStatus = getRequestString("nTaskStatus");
      String nFileType = getRequestString("nFileType");
      String devVerNum = getRequestString("devVerNum");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<DeviceOflTaskLog> list = this.deviceOflTaskLogService.queryDistinctOflTaskLog(beginDate, 
          endDate, query.getDevIdnos().split(","), Integer.valueOf(Integer.parseInt(nTaskStatus)), Integer.valueOf(Integer.parseInt(nFileType)), devVerNum, getPaginationEx());
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
  
  public String distinctHardwareStatus()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String devVerNum = getRequestString("version");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<DeviceHardwareStatus> list = this.deviceHardwareStatusService.queryDistinctHardwareStatus(beginDate, endDate, query.getDevIdnos().split(","), true, devVerNum, getPaginationEx());
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
  
  public String parameterConfiguration()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String nTaskStatus = getRequestString("nTaskStatus");
      String nType = getRequestString("nType");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<DeviceOflTaskLog> list = this.deviceOflTaskLogService.queryParameterConfiguration(beginDate, 
          endDate, query.getDevIdnos().split(","), Integer.valueOf(Integer.parseInt(nTaskStatus)), Integer.valueOf(Integer.parseInt(nType)), getPaginationEx());
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
  
  protected boolean isOflTaskLog()
  {
    String type = getRequest().getParameter("type");
    return type.equals("oflTaskLog");
  }
  
  protected boolean isVersion()
  {
    String type = getRequest().getParameter("type");
    return type.equals("version");
  }
  
  protected boolean isParameterConfiguration()
  {
    String type = getRequest().getParameter("type");
    return type.equals("parameterConfiguration");
  }
  
  protected String[] genDetailHeads()
  {
    if (isOflTaskLog())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("versionNumber");
      heads[3] = getText("versionName");
      heads[4] = getText("taskTime");
      heads[5] = getText("executionTime");
      heads[6] = getText("completion");
      return heads;
    }
    if (isVersion())
    {
      String[] heads = new String[4];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.time");
      heads[3] = getText("versionNumber");
      return heads;
    }
    if (isParameterConfiguration())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.type");
      heads[3] = getText("versionName");
      heads[4] = getText("taskTime");
      heads[5] = getText("executionTime");
      heads[6] = getText("completion");
      return heads;
    }
    return null;
  }
  
  protected String genDetailTitle()
  {
    if (isOflTaskLog()) {
      return getText("report.offlineRecordingEquipmentUpgrade");
    }
    if (isVersion()) {
      return getText("report.vehiclereleasedetails");
    }
    if (isParameterConfiguration()) {
      return getText("report.parameterConfigurationReport");
    }
    return "";
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String nTaskStatus = getRequestString("nTaskStatus");
    String devVerNum = getRequestString("devVerNum");
    String nType = getRequestString("nType");
    if (isOflTaskLog())
    {
      AjaxDto<DeviceOflTaskLog> ajaxDto = this.deviceOflTaskLogService.queryDistinctOflTaskLog(begintime, 
        endtime, devIdnos.split(","), Integer.valueOf(Integer.parseInt(nTaskStatus)), Integer.valueOf(2), devVerNum, null);
      genOflTaskLogExcelData(ajaxDto.getPageList(), toMap, export);
    }
    else if (isVersion())
    {
      AjaxDto<DeviceHardwareStatus> ajaxDto = this.deviceHardwareStatusService.queryDistinctHardwareStatus(begintime, endtime, devIdnos.split(","), true, devVerNum, null);
      genHardwareStatusExcelData(ajaxDto.getPageList(), toMap, export);
    }
    else if (isParameterConfiguration())
    {
      AjaxDto<DeviceOflTaskLog> ajaxDto = this.deviceOflTaskLogService.queryParameterConfiguration(begintime, 
        endtime, devIdnos.split(","), Integer.valueOf(Integer.parseInt(nTaskStatus)), Integer.valueOf(Integer.parseInt(nType)), null);
      genOflTaskLogExcelData(ajaxDto.getPageList(), toMap, export);
    }
  }
  
  protected void genOflTaskLogExcelData(List<DeviceOflTaskLog> lstAlarm, Integer toMap, ExportReport export)
  {
    if (((isOflTaskLog()) || (isParameterConfiguration())) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceOflTaskLog alarm = (DeviceOflTaskLog)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        String[] version = alarm.getStrParam().split(",");
        export.setCellValue(Integer.valueOf(j++), version[1]);
        if (isOflTaskLog()) {
          export.setCellValue(Integer.valueOf(j++), version[0]);
        } else if (isParameterConfiguration()) {
          if (alarm.getnFileType().intValue() == 3) {
            export.setCellValue(Integer.valueOf(j++), getText("parameterConfiguration"));
          } else if (alarm.getnFileType().intValue() == 4) {
            export.setCellValue(Integer.valueOf(j++), getText("wifiSiteConfiguration"));
          }
        }
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getDtCreateTask()));
        if (alarm.getnTaskStatus().intValue() == 0) {
          export.setCellValue(Integer.valueOf(j++), "");
        } else {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getDtEndTask()));
        }
        if ((isOflTaskLog()) || (isParameterConfiguration()))
        {
          String str = "";
          if (alarm.getnTaskStatus() != null) {
            switch (alarm.getnTaskStatus().intValue())
            {
            case 0: 
              str = getText("notPerformed");
              break;
            case 1: 
              str = getText("taskExecution");
              break;
            case 2: 
              str = getText("taskCompletion");
              break;
            case 3: 
              str = getText("taskFails");
            }
          }
          export.setCellValue(Integer.valueOf(j++), str);
        }
      }
    }
  }
  
  protected void genHardwareStatusExcelData(List<DeviceHardwareStatus> lstAlarm, Integer toMap, ExportReport export)
  {
    if ((isVersion()) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceHardwareStatus alarm = (DeviceHardwareStatus)lstAlarm.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(alarm.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(alarm.getDate()));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getDevVerNum());
      }
    }
  }
}
