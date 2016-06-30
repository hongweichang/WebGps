package com.gps.system.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.SysBaseAction;
import com.gps.common.service.ServerService;
import com.gps.model.ServerInfo;
import com.gps.system.model.ServerLog;
import com.gps.system.model.SysUsrInfo;
import com.gps.system.model.SysUsrLog;
import com.gps.system.service.SysLogService;
import com.gps.system.vo.SysLogContent;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SysLogAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private SysLogService sysLogService;
  private ServerService serverService;
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public SysLogService getSysLogService()
  {
    return this.sysLogService;
  }
  
  public void setSysLogService(SysLogService sysLogService)
  {
    this.sysLogService = sysLogService;
  }
  
  private String getServerTypeName(String type)
  {
    Integer svrtype = Integer.valueOf(Integer.parseInt(type));
    String ret;
   
    switch (svrtype.intValue())
    {
    case 2: 
      ret = getText("system.server.gatewayserver");
      break;
    case 4: 
      ret = getText("system.server.usrmgrserver");
      break;
    case 3: 
      ret = getText("system.server.mediaserver");
      break;
    case 5: 
      ret = getText("system.server.storageserver");
      break;
    case 7: 
      ret = getText("system.server.downserver");
      break;
    case 6: 
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getLoginLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
   
    switch (subType.intValue())
    {
    case 1: 
      ret = getText("system.log.sysusr.login", new String[] { param1 });
      break;
    case 2: 
      ret = getText("system.log.sysusr.logout");
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getServerLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
  
    switch (subType.intValue())
    {
    case 1: 
      ret = getText("system.log.sysusr.server.login");
      break;
    case 2: 
      ret = getText("system.log.sysusr.server.add", 
        new String[] { getServerTypeName(param1), param3 });
      break;
    case 3: 
      ret = getText("system.log.sysusr.server.edit", 
        new String[] { getServerTypeName(param1), param3 });
      break;
    case 4: 
      ret = getText("system.log.sysusr.server.del", 
        new String[] { getServerTypeName(param1), param3 });
      break;
    case 5: 
      ret = getText("system.log.sysusr.server.sysdb");
      break;
    case 6: 
      ret = getText("system.log.sysusr.server.gpsdb", 
        new String[] { param1, param2 });
      break;
    case 7: 
      ret = getText("system.log.sysusr.server.downstation.add", 
        new String[] { param1, param2 });
      break;
    case 8: 
      ret = getText("system.log.sysusr.server.downstation.edit", 
        new String[] { param1, param2 });
      break;
    case 9: 
      ret = getText("system.log.sysusr.server.downstation.del", 
        new String[] { param1, param2 });
      break;
    case 10: 
      ret = getText("system.log.sysusr.server.storagerelation.add", 
        new String[] { param1, param2, param3 });
      break;
    case 11: 
      ret = getText("system.log.sysusr.server.storagerelation.del", 
        new String[] { param1, param2, param3 });
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getDeviceLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;

    switch (subType.intValue())
    {
    case 1: 
      ret = getText("system.log.sysusr.device.add", new String[] { param2 });
      break;
    case 2: 
      ret = getText("system.log.sysusr.device.edit", new String[] { param2 });
      break;
    case 3: 
      ret = getText("system.log.sysusr.device.del", new String[] { param2 });
      break;
    case 4: 
      ret = getText("system.log.sysusr.device.batchadd", new String[] { param1, param2 });
      break;
    case 5: 
      ret = getText("system.log.sysusr.device.sale", new String[] { param2, param4 });
      break;
    case 6: 
      ret = getText("system.log.sysusr.device.resale", new String[] { param2, param3, param4 });
      break;
    case 7: 
      ret = getText("system.log.sysusr.device.batchdel", new String[] { param1 });
      break;
    case 8: 
      ret = getText("system.log.sysusr.device.batchsale", new String[] { param1, param2 });
      break;
    case 9: 
      ret = getText("system.log.sysusr.device.batchresale", new String[] { param1, param2, param3 });
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getClientLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
   
    switch (subType.intValue())
    {
    case 1: 
      ret = getText("system.log.sysusr.client.add", new String[] { param2 });
      break;
    case 2: 
      ret = getText("system.log.sysusr.client.edit", new String[] { param2 });
      break;
    case 3: 
      ret = getText("system.log.sysusr.client.del", new String[] { param2 });
      break;
    case 4: 
      ret = getText("system.log.sysusr.client.resetpwd", new String[] { param2 });
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  public String getSysUsrLogContent(Integer mainType, Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret = null;
    if (mainType.intValue() == 1) {
      ret = getLoginLog(subType, param1, param2, param3, param4);
    } else if (mainType.intValue() == 2) {
      ret = getServerLog(subType, param1, param2, param3, param4);
    } else if (mainType.intValue() == 3) {
      ret = getDeviceLog(subType, param1, param2, param3, param4);
    } else if (mainType.intValue() == 4) {
      ret = getClientLog(subType, param1, param2, param3, param4);
    } else {
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  private boolean checkQueryTime(String begintime, String endtime)
  {
    if ((begintime == null) || (!DateUtil.isLongTimeValid(begintime)) || (endtime == null) || (!DateUtil.isLongTimeValid(endtime)))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(6));
      return false;
    }
    if (DateUtil.compareStrLongTime(begintime, endtime) > 0)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(7));
      return false;
    }
    return true;
  }
  
  public String querySysuser()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if (checkQueryTime(begintime, endtime))
      {
        AjaxDto<SysUsrLog> ajaxDto = this.sysLogService.getSysUsrLogList(begintime, endtime, getPagination());
        List<SysLogContent> logContentList = new ArrayList();
        if (ajaxDto.getPageList() != null) {
          for (SysUsrLog syslog : ajaxDto.getPageList())
          {
            SysLogContent logContent = new SysLogContent();
            if (syslog.getSysUsr() != null) {
              logContent.setName(syslog.getSysUsr().getName());
            } else {
              logContent.setName(getText("system.common.unkown"));
            }
            logContent.setContent(getSysUsrLogContent(syslog.getMainType(), syslog.getSubType(), 
              syslog.getParam1(), syslog.getParam2(), syslog.getParam3(), syslog.getParam4()));
            logContent.setLogtime(DateUtil.dateSwitchString(syslog.getDtime()));
            logContentList.add(logContent);
          }
        }
        addCustomResponse("log", logContentList);
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
  
  public String getServerActionContent(Integer type)
  {
    String str;

    switch (type.intValue())
    {
    case 1: 
      str = getText("system.log.server.start");
      break;
    case 2: 
      str = getText("system.log.server.stop");
      break;
    case 3: 
      str = getText("system.log.server.login");
      break;
    case 4: 
      str = getText("system.log.server.logout");
      break;
    case 5: 
      str = getText("system.log.server.online");
      break;
    case 6: 
      str = getText("system.log.server.offline");
      break;
    default: 
      str = getText("system.common.unkown");
    }
    return str;
  }
  
  public String queryServer()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if (checkQueryTime(begintime, endtime))
      {
        AjaxDto<ServerLog> ajaxDto = this.sysLogService.getServerLogList(begintime, endtime, getPagination());
        List<SysLogContent> logContentList = new ArrayList();
        if (ajaxDto.getPageList() != null)
        {
          Map<Integer, ServerInfo> mapSvr = new HashMap();
          for (ServerLog svrlog : ajaxDto.getPageList())
          {
            SysLogContent logContent = new SysLogContent();
            ServerInfo svrInfo = (ServerInfo)mapSvr.get(svrlog.getSvrid());
            if (svrInfo == null)
            {
              svrInfo = this.serverService.findServer(svrlog.getSvrid().intValue());
              if (svrInfo == null)
              {
                svrInfo = new ServerInfo();
                svrInfo.setName(getText("system.common.unkown"));
              }
              mapSvr.put(svrlog.getSvrid(), svrInfo);
            }
            logContent.setName(svrInfo.getName());
            logContent.setContent(getServerActionContent(svrlog.getAction()));
            logContent.setLogtime(DateUtil.dateSwitchString(svrlog.getDtime()));
            logContentList.add(logContent);
          }
        }
        addCustomResponse("log", logContentList);
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
}
