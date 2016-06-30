package com.gps.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.ServerService;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.ServerInfo;
import com.gps.report.vo.DeviceQuery;
import com.gps.util.ConvertUtil;
import com.gps.util.GoogleGpsFix;
import com.gps.vo.GpsValue;
import java.util.List;

public class PositionAction
  extends UserBaseAction
{
  private static final long serialVersionUID = -9186083421023326883L;
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String status()
    throws Exception
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      String[] devices = query.getDevIdnos().split(",");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
      if (ajaxDto.getPageList() != null)
      {
        String toMap = getRequestString("toMap");
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
          if (status.getGpsTime() != null) {
            status.setGpsTimeStr(DateUtil.dateSwitchString(status.getGpsTime()));
          }
          if (status.getJingDu() == null) {
            status.setJingDu(Integer.valueOf(0));
          }
          if (status.getWeiDu() == null) {
            status.setWeiDu(Integer.valueOf(0));
          }
          GpsValue gpsValue = ConvertUtil.convert(status.getJingDu(), status.getWeiDu(), toMap);
          status.setMapJingDu(gpsValue.getMapJingDu());
          status.setMapWeiDu(gpsValue.getMapWeiDu());
        }
      }
      addCustomResponse("status", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String terminalStatus()
    throws Exception
  {
    try
    {
      String devIdnos = getRequestString("devIdnos");
      AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devIdnos.split(","));
      if (ajaxDto.getPageList() != null) {
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          DeviceStatus status = (DeviceStatus)ajaxDto.getPageList().get(i);
          if (status.getJingDu() == null) {
            status.setJingDu(Integer.valueOf(0));
          }
          if (status.getWeiDu() == null) {
            status.setWeiDu(Integer.valueOf(0));
          }
          GpsValue gpsValue = GoogleGpsFix.fixCoordinate(status.getJingDu(), status.getWeiDu());
          status.setMapJingDu(gpsValue.getMapJingDu());
          status.setMapWeiDu(gpsValue.getMapWeiDu());
        }
      }
      addCustomResponse("status", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String gwayAddr()
    throws Exception
  {
    try
    {
      ServerInfo server = this.serverService.getOnlineServer(2);
      addCustomResponse("server", server);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String queryDevice()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceInfo> ajaxDto = this.deviceService.getDeviceList(name, null, null, null, null, null);
      addCustomResponse("devices", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
