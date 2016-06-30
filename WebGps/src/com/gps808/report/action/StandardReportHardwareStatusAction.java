package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.report.model.DeviceHardwareStatus;
import com.gps.report.service.DeviceHardwareStatusService;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardReportHardwareStatusAction
  extends StandardReportBaseAction
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
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String diskErrorDetail()
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
  
  private String alarmDetail(List<Integer> lstArmType)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
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
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
          query.getVehiIdnos().split(","), lstArmType, null, " order by ArmTimeStart asc", getPaginationEx(), null, null, null, null);
        
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), true);
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
  
  public AjaxDto<DeviceHardwareStatus> getDeviceHardwareStatus(String begintime, String endtime, String[] vehiIdnos, Pagination pagin)
  {
    String diskStatus = getRequestString("status");
    if ((diskStatus == null) || (diskStatus.isEmpty())) {
      diskStatus = "2";
    }
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
    AjaxDto<DeviceHardwareStatus> hardwareStatus = this.deviceHardwareStatusService.queryHardwareStatus(begintime, 
      endtime, deviIdnos.toString().split(","), diskStatus, pagin);
    if (hardwareStatus.getPageList() != null) {
      for (DeviceHardwareStatus devStatus : hardwareStatus.getPageList())
      {
        devStatus.setVehiIdno((String)map.get(devStatus.getDevIdno()));
        devStatus.setPlateType((Integer)plate.get(devStatus.getDevIdno()));
      }
    }
    return hardwareStatus;
  }
  
  public String daily()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isDateValid(begintime)) || (!DateUtil.isDateValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DeviceHardwareStatus> hardwareStatus = getDeviceHardwareStatus(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
        
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
  
  protected boolean isHardwareStatus()
  {
    String type = getRequest().getParameter("type");
    return type.equals("hardwareStatus");
  }
  
  protected boolean isDiskError()
  {
    String type = getRequest().getParameter("type");
    return type.equals("diskError");
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
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.device");
      heads[4] = getText("report.time");
      heads[5] = getText("report.harddiskstatusinformation");
      return heads;
    }
    if (isHighTemperature())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.time");
      heads[4] = getText("report.type");
      heads[5] = getText("report.content");
      heads[6] = getText("report.currentPosition");
      return heads;
    }
    if (isDiskError())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.time");
      heads[4] = getText("report.type");
      heads[5] = getText("report.currentPosition");
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
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isHardwareStatus())
    {
      AjaxDto<DeviceHardwareStatus> ajaxDto = getDeviceHardwareStatus(begintime, endtime, vehiIdnos.split(","), null);
      
      genHardwareStatusExcelData(ajaxDto.getPageList(), export);
    }
    else if ((isDiskError()) || (isHighTemperature()))
    {
      AjaxDto<StandardDeviceAlarm> ajaxDto = this.vehicleAlarmService.queryDeviceAlarm(begintime, endtime, 
        vehiIdnos.split(","), getAlarmQueryType(), null, " order by ArmTimeStart asc", null, null, null, null, null);
      
      List<StandardDeviceAlarm> deviceAlarms = null;
      if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
        deviceAlarms = handleDetailData(ajaxDto.getPageList(), toMap, true);
      }
      genAlarmExcelData(deviceAlarms, toMap, export);
    }
  }
  
  protected void genAlarmExcelData(List<StandardDeviceAlarm> lstAlarm, Integer toMap, ExportReport export)
  {
    if (((isDiskError()) || (isHighTemperature())) && 
      (lstAlarm != null)) {
      for (int i = 1; i <= lstAlarm.size(); i++)
      {
        StandardDeviceAlarm alarm = (StandardDeviceAlarm)lstAlarm.get(i - 1);
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
        
        export.setCellValue(Integer.valueOf(j++), getAlarmTypeName(alarm.getArmType().intValue()));
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
        if (isGpsValid(alarm.getStartStatus1())) {
          export.setCellValue(Integer.valueOf(j++), alarm.getStartPosition());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
      }
    }
  }
  
  protected void genHardwareStatusExcelData(List<DeviceHardwareStatus> lstAlarm, ExportReport export)
  {
    if ((isHardwareStatus()) && 
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
        
        String str = "";
        if ((alarm.getDiskStatus() != null) && (alarm.getDiskAllVolume() != null) && (alarm.getDiskLeftVolume() != null) && (alarm.getDiskSerialNum() != null))
        {
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
