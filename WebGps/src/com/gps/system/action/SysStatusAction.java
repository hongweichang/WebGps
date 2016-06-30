package com.gps.system.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.SysBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.ServerInfo;
import com.gps.model.UserSession;
import com.gps.system.service.SysStatusService;
import com.gps.system.vo.DeviceStatusContent;
import com.gps.util.ConvertUtil;
import com.gps.vo.GpsValue;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SysStatusAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private SysStatusService sysStatusService;
  private ServerService serverService;
  
  public SysStatusService getSysStatusService()
  {
    return this.sysStatusService;
  }
  
  public void setSysStatusService(SysStatusService sysStatusService)
  {
    this.sysStatusService = sysStatusService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  protected List<DeviceStatusContent> parseStatusContent(List<DeviceStatus> lstStatus, boolean readDevInfo)
  {
    List<DeviceStatusContent> status = new ArrayList();
    if (lstStatus != null)
    {
      Map<String, ServerInfo> mapServer = new HashMap();
      for (int i = 0; i < lstStatus.size(); i++)
      {
        DeviceStatusContent content = new DeviceStatusContent();
        
        DeviceStatus devStatus = (DeviceStatus)lstStatus.get(i);
        devStatus.setGpsTimeStr(DateUtil.dateSwitchString(devStatus.getGpsTime()));
        content.setDevStatus(devStatus);
        if (devStatus.getJingDu() == null) {
          devStatus.setJingDu(Integer.valueOf(0));
        }
        if (devStatus.getWeiDu() == null) {
          devStatus.setWeiDu(Integer.valueOf(0));
        }
        if (readDevInfo)
        {
          DeviceInfo devInfo = this.deviceService.getDeviceInfo(devStatus.getDevIdno());
          content.setDevInfo(devInfo);
        }
        if ((devStatus.getGwsvrIdno() != null) && (!devStatus.getGwsvrIdno().isEmpty()))
        {
          ServerInfo svrInfo = (ServerInfo)mapServer.get(devStatus.getGwsvrIdno());
          if (svrInfo == null)
          {
            svrInfo = (ServerInfo)this.serverService.get(devStatus.getGwsvrIdno());
            if (svrInfo != null) {
              mapServer.put(devStatus.getGwsvrIdno(), svrInfo);
            }
          }
          content.setSvrInfo(svrInfo);
        }
        status.add(content);
      }
    }
    return status;
  }
  
  public String deviceUnreg()
    throws Exception
  {
    try
    {
      AjaxDto<DeviceStatus> ajaxDto = this.sysStatusService.getDeviceUnregList(getPagination());
      List<DeviceStatusContent> status = parseStatusContent(ajaxDto.getPageList(), false);
      addCustomResponse("devices", status);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String deviceStatus()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceStatus> ajaxDto = this.sysStatusService.getDeviceOnlineList(name, getPagination());
      List<DeviceStatusContent> status = parseStatusContent(ajaxDto.getPageList(), true);
      addCustomResponse("devices", status);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String clientStatus()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<UserSession> ajaxDto = this.sysStatusService.getClientOnlineList(name, getPagination());
      addCustomResponse("clients", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String position()
    throws Exception
  {
    try
    {
      String jingDu = getRequestString("jingDu");
      String weiDu = getRequestString("weiDu");
      
      String toMap = getRequestString("toMap");
      GpsValue gpsValue = ConvertUtil.convert(Integer.valueOf(Integer.parseInt(jingDu)), Integer.valueOf(Integer.parseInt(weiDu)), toMap);
      addCustomResponse("gpsValue", gpsValue);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
