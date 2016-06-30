package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.report.model.DeviceHardwareStatus;
import com.gps.report.model.DeviceOflTaskLog;
import com.gps.report.service.DeviceHardwareStatusService;
import com.gps.report.service.DeviceOflTaskLogService;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardReportDeviceOflTaskLogAction
  extends StandardReportBaseAction
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
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  private AjaxDto<DeviceOflTaskLog> getDeviceOflTaskLog(String begintime, String endtime, String[] vehiIdnos, Pagination pagin)
  {
    StringBuffer deviIdnos = new StringBuffer();
    Map<String, String> map = new HashMap();
    Map<String, Integer> plate = new HashMap();
    List<StandardVehiDevRelationExMore> relations = getPlateTypeRelation(vehiIdnos);
    if ((relations != null) && (relations.size() > 0))
    {
      int i = 0;
      for (int j = relations.size(); i < j; i++)
      {
        if (i != 0) {
          deviIdnos.append(",");
        }
        deviIdnos.append(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
        map.put(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno());
        plate.put(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getPlateType());
      }
    }
    String nTaskStatus = getRequestString("nTaskStatus");
    String nFileType = getRequestString("nFileType");
    String devVerNum = getRequestString("devVerNum");
    if ((nTaskStatus == null) || (nTaskStatus.isEmpty())) {
      nTaskStatus = "5";
    }
    AjaxDto<DeviceOflTaskLog> oflTaskLogs = this.deviceOflTaskLogService.queryDistinctOflTaskLog(begintime, 
      endtime, deviIdnos.toString().split(","), Integer.valueOf(Integer.parseInt(nTaskStatus)), 
      Integer.valueOf(Integer.parseInt(nFileType)), devVerNum, pagin);
    if (oflTaskLogs.getPageList() != null) {
      for (DeviceOflTaskLog log : oflTaskLogs.getPageList())
      {
        log.setVehiIdno((String)map.get(log.getDevIdno()));
        log.setPlateType((Integer)plate.get(log.getDevIdno()));
      }
    }
    return oflTaskLogs;
  }
  
  public String daily()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<DeviceOflTaskLog> oflTaskLogs = getDeviceOflTaskLog(beginDate, endDate, query.getVehiIdnos().split(","), getPaginationEx());
        
        addCustomResponse("infos", oflTaskLogs.getPageList());
        addCustomResponse("pagination", oflTaskLogs.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  private AjaxDto<DeviceHardwareStatus> getDeviceHardwareStatus(String begintime, String endtime, String[] vehiIdnos, Pagination pagin)
  {
    StringBuffer deviIdnos = new StringBuffer();
    Map<String, String> map = new HashMap();
    Map<String, Integer> plate = new HashMap();
    List<StandardVehiDevRelationExMore> relations = getPlateTypeRelation(vehiIdnos);
    if ((relations != null) && (relations.size() > 0))
    {
      int i = 0;
      for (int j = relations.size(); i < j; i++)
      {
        if (i != 0) {
          deviIdnos.append(",");
        }
        deviIdnos.append(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
        map.put(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno());
        plate.put(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getPlateType());
      }
    }
    String devVerNum = getRequestString("version");
    AjaxDto<DeviceHardwareStatus> hardwareStatus = this.deviceHardwareStatusService.queryDistinctHardwareStatus(begintime, 
      endtime, deviIdnos.toString().split(","), true, devVerNum, pagin);
    if (hardwareStatus.getPageList() != null) {
      for (DeviceHardwareStatus devStatus : hardwareStatus.getPageList())
      {
        devStatus.setVehiIdno((String)map.get(devStatus.getDevIdno()));
        devStatus.setPlateType((Integer)plate.get(devStatus.getDevIdno()));
      }
    }
    return hardwareStatus;
  }
  
  public String distinctHardwareStatus()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isDateValid(beginDate)) || (!DateUtil.isDateValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceHardwareStatus> hardwareStatus = getDeviceHardwareStatus(beginDate, endDate, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", hardwareStatus.getPageList());
        addCustomResponse("pagination", hardwareStatus.getPagination());
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
  
  protected String[] genDetailHeads()
  {
    if (isOflTaskLog())
    {
      String[] heads = new String[9];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.device");
      heads[4] = getText("versionName");
      heads[5] = getText("versionNumber");
      heads[6] = getText("taskTime");
      heads[7] = getText("executionTime");
      heads[8] = getText("completion");
      return heads;
    }
    if (isVersion())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.device");
      heads[4] = getText("report.time");
      heads[5] = getText("versionNumber");
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
    return "";
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isOflTaskLog())
    {
      AjaxDto<DeviceOflTaskLog> ajaxDto = getDeviceOflTaskLog(begintime, endtime, vehiIdnos.split(","), null);
      
      genOflTaskLogExcelData(ajaxDto.getPageList(), toMap, export);
    }
    else if (isVersion())
    {
      AjaxDto<DeviceHardwareStatus> ajaxDto = getDeviceHardwareStatus(begintime, endtime, vehiIdnos.split(","), null);
      genHardwareStatusExcelData(ajaxDto.getPageList(), toMap, export);
    }
  }
  
  protected void genOflTaskLogExcelData(List<DeviceOflTaskLog> lstAlarm, Integer toMap, ExportReport export)
  {
    if ((isOflTaskLog()) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        DeviceOflTaskLog alarm = (DeviceOflTaskLog)lstAlarm.get(i - 1);
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
        
        export.setCellValue(Integer.valueOf(j++), alarm.getDevIdno());
        
        String[] version = alarm.getStrParam().split(",");
        if (version.length > 1) {
          export.setCellValue(Integer.valueOf(j++), version[1]);
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (version.length > 0) {
          export.setCellValue(Integer.valueOf(j++), version[0]);
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getDtCreateTask()));
        if (alarm.getnTaskStatus().intValue() != 0) {
          export.setCellValue(Integer.valueOf(j++), "");
        } else {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(alarm.getDtEndTask()));
        }
        if (isOflTaskLog())
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
        
        export.setCellValue(Integer.valueOf(j++), alarm.getDevIdno());
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(alarm.getDate()));
        
        export.setCellValue(Integer.valueOf(j++), alarm.getDevVerNum());
      }
    }
  }
}
