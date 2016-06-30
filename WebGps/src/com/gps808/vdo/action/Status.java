package com.gps808.vdo.action;

import com.framework.logger.Logger;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.model.DeviceStatusLite;
import com.gps.model.ServerInfo;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.vo.StandardVehicleAlarmInfo;
import java.util.ArrayList;
import java.util.List;

public class Status
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String getUserServer()
  {
    try
    {
      AjaxDto<ServerInfo> ajaxDtoGtae = this.serverService.getAllServer(Integer.valueOf(4), null);
      addCustomResponse("userServer", ajaxDtoGtae.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getAlarm()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devIdno);
      if (device != null)
      {
        int mapType = 2;
        AjaxDto<StandardDeviceAlarm> ajaxDto = this.standardUserService.getAlarmByDevidno(devIdno, getAlarmQueryType());
        List<StandardDeviceAlarm> deviceAlarms = null;
        if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
          deviceAlarms = handleDetailData(ajaxDto.getPageList(), Integer.valueOf(mapType), true);
        }
        addCustomResponse("infos", deviceAlarms);
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(21));
      }
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
    lstArmType.add(Integer.valueOf(4));
    lstArmType.add(Integer.valueOf(18));
    lstArmType.add(Integer.valueOf(17));
    lstArmType.add(Integer.valueOf(60));
    return lstArmType;
  }
  
  protected List<StandardDeviceAlarm> handleDetailData(List<StandardDeviceAlarm> deviceAlarms, Integer toMap, boolean isMap)
  {
    StandardDeviceAlarm deviceAlarm = null;
    StandardVehicleAlarmInfo vehicleAlarmInfo = new StandardVehicleAlarmInfo();
    vehicleAlarmInfo.setStandardUserService(this.standardUserService);
    vehicleAlarmInfo.setVehicleRuleService(this.vehicleRuleService);
    for (int i = 0; i < deviceAlarms.size(); i++)
    {
      deviceAlarm = (StandardDeviceAlarm)deviceAlarms.get(i);
      deviceAlarm.setArmTypeStr(getAlarmTypeName(deviceAlarm.getArmType().intValue()));
      vehicleAlarmInfo.setAlarm(deviceAlarm);
    }
    return deviceAlarms;
  }
  
  protected String getAlarmTypeName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 4: 
      ret = "���l�G��";
      break;
    case 18: 
      ret = "GPS�����G��";
      break;
    case 17: 
      ret = "������";
      break;
    case 60: 
      ret = "���P�e�`";
    }
    return ret;
  }
  
  public String getStatus()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      String number = getRequestString("number");
      StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devIdno);
      if (device == null) {
        device = this.standardUserService.getDeviceBySim(number);
      }
      if (device != null)
      {
        List<StandardVehiDevRelation> relationList = this.standardUserService.getStandardVehiDevRelationList(null, device.getDevIDNO());
        if (relationList != null)
        {
          StandardVehicle vehicle = ((StandardVehiDevRelation)relationList.get(0)).getVehicle();
          addCustomResponse("vehicle", vehicle);
        }
        String[] devIdnos = new String[1];
        devIdnos[0] = device.getDevIDNO();
        AjaxDto<DeviceStatusLite> dtoAjax = this.deviceService.getDeviceStatusLite(devIdnos);
        DeviceStatusLite status = null;
        if ((dtoAjax.getPageList() != null) && (dtoAjax.getPageList().size() >= 1))
        {
          status = (DeviceStatusLite)dtoAjax.getPageList().get(0);
          addCustomResponse("status", status);
        }
        addCustomResponse("device", device);
      }
      else
      {
        addCustomResponse("device", null);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getGPSStatus()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      String[] devIdnos = new String[1];
      devIdnos[0] = devIdno;
      AjaxDto<DeviceStatusLite> dtoAjax = this.deviceService.getDeviceStatusLite(devIdnos);
      DeviceStatusLite status = null;
      if ((dtoAjax.getPageList() != null) && (dtoAjax.getPageList().size() >= 1))
      {
        status = (DeviceStatusLite)dtoAjax.getPageList().get(0);
        addCustomResponse("status", status);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
