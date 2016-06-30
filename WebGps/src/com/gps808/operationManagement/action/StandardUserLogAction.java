package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.UserLogService;
import com.gps.model.UserLog;
import com.gps.user.vo.UserLogContent;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.ArrayList;
import java.util.List;

public class StandardUserLogAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private UserLogService userLogService;
  
  public UserLogService getUserLogService()
  {
    return this.userLogService;
  }
  
  public void setUserLogService(UserLogService userLogService)
  {
    this.userLogService = userLogService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected String getMainTypes()
  {
    StringBuffer mainType = new StringBuffer();
    mainType.append("1,");
    mainType.append("4,");
    mainType.append("5,");
    mainType.append("6,");
    mainType.append("15,");
    mainType.append("16,");
    mainType.append("17,");
    mainType.append("18,");
    mainType.append(19);
    return mainType.toString();
  }
  
  protected AjaxDto<UserLogContent> queryUserLog(String begintime, String endtime, Pagination pagination)
  {
    AjaxDto<StandardUserAccount> useList = getUserAccounts(null, null);
    List<StandardUserAccount> users = new ArrayList();
    if (useList.getPageList() != null) {
      users = useList.getPageList();
    }
    String user = getRequestString("userId");
    Integer userId = null;
    String[] userIdList = null;
    if ((user != null) && (!user.isEmpty()))
    {
      userId = Integer.valueOf(Integer.parseInt(user));
      if (userId.intValue() == 0)
      {
        userIdList = new String[users.size()];
        for (int i = 0; i < users.size(); i++) {
          userIdList[i] = ((StandardUserAccount)users.get(i)).getId().toString();
        }
      }
      else
      {
        userIdList = new String[1];
        userIdList[0] = user;
      }
    }
    String main = getRequestString("mainType");
    if ((main == null) || (main.isEmpty())) {
      main = getMainTypes();
    }
    String[] mainTypes = null;
    if ((main != null) && (!main.isEmpty())) {
      mainTypes = main.split(",");
    }
    AjaxDto<UserLog> ajaxDto = this.userLogService.queryUserLogEx(begintime, endtime, null, userIdList, mainTypes, null, pagination);
    List<UserLogContent> logContentList = new ArrayList();
    if (ajaxDto.getPageList() != null) {
      for (UserLog userlog : ajaxDto.getPageList())
      {
        UserLogContent logContent = new UserLogContent();
        if (userlog.getUserId() != null) {
          for (int i = 0; i < users.size(); i++) {
            if (userlog.getUserId().intValue() == ((StandardUserAccount)users.get(i)).getId().intValue())
            {
              logContent.setName(((StandardUserAccount)users.get(i)).getName());
              break;
            }
          }
        } else {
          logContent.setName(getText("system.common.unkown"));
        }
        if ((logContent.getName() == null) || (logContent.getName().isEmpty())) {
          logContent.setName(getText("system.common.unkown"));
        }
        logContent.setContent(getUsrLogContent(userlog.getMainType(), userlog.getSubType(), 
          userlog.getParam1(), userlog.getParam2(), userlog.getParam3(), userlog.getParam4()));
        logContent.setLogtime(DateUtil.dateSwitchString(userlog.getDtime()));
        logContentList.add(logContent);
      }
    }
    AjaxDto<UserLogContent> ajaxLog = new AjaxDto();
    ajaxLog.setPageList(logContentList);
    ajaxLog.setPagination(ajaxDto.getPagination());
    return ajaxLog;
  }
  
  public String query()
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
        AjaxDto<UserLogContent> ajaxLog = queryUserLog(begintime, endtime, getPaginationEx());
        addCustomResponse("infos", ajaxLog.getPageList());
        addCustomResponse("pagination", ajaxLog.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getUsrLogContent(Integer mainType, Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret = null;
    if (mainType.intValue() == 1) {
      ret = getLoginLog(subType, param1, param2, param3, param4);
    } else if (mainType.intValue() == 9) {
      ret = getFenceLog(subType, param1, param2, param3, param4);
    } else {
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getFenceLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
  
    switch (subType.intValue())
    {
    case 1: 
      ret = getText("user.log.fence.add", new String[] { getClientType(param3) });
      break;
    case 2: 
      ret = getText("user.log.fence.edit", new String[] { getClientType(param3) });
      break;
    case 3: 
      ret = getText("user.log.fence.del", new String[] { getClientType(param3) });
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getClientType(String type)
  {
    if ((type != null) && (!type.isEmpty())) {}
    String ret;
    
    switch (Integer.parseInt(type))
    {
    case 1: 
    case 4: 
      ret = getText("user.log.client.windows");
      break;
    case 2: 
    case 5: 
      ret = getText("user.log.client.web");
      break;
    case 3: 
    case 6: 
      ret = getText("user.log.client.moblie");
      break;
    default: 
       ret = getText("system.common.unkown");
      
       ret = getText("user.log.client.windows");
      break;
    }
    return ret;
  }
  
  protected String getLoginLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
   
    switch (subType.intValue())
    {
    case 1: 
      ret = getText("user.log.login.login", new String[] { param1, getClientType(param3) });
      break;
    case 2: 
      ret = getText("user.log.login.logout", new String[] { param1, getClientType(param3) });
      break;
    case 3: 
      ret = getText("user.log.login.interupt");
      break;
    case 4: 
      ret = getText("user.log.login.transfer", new String[] { param1 });
      break;
    case 5: 
      ret = getText("user.log.login.unkownuser", new String[] { param1 });
      break;
    case 6: 
      ret = getText("user.log.login.getsvrfailed");
      break;
    case 7: 
      ret = getText("user.log.login.modifypassword");
      break;
    case 8: 
      ret = getText("user.log.login.updateaccount");
      break;
    default: 
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String[] genDetailHeads()
  {
    if (isSMS())
    {
      String[] heads = new String[6];
      heads[0] = getText("report.index");
      heads[1] = getText("report.dispatch.user");
      heads[2] = getText("report.vehicle");
      heads[3] = getText("report.plateColor");
      heads[4] = getText("report.dispatch.time");
      heads[5] = getText("report.dispatch.command");
      return heads;
    }
    String[] heads = new String[4];
    heads[0] = getText("report.index");
    heads[1] = getText("user.log.name");
    heads[2] = getText("report.time");
    heads[3] = getText("user.log.content");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isSMS())
    {
      AjaxDto<UserLog> ajaxDto = querySmsLogDetail(begintime, endtime, vehiIdnos.split(","), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          UserLog userLog = (UserLog)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), userLog.getParam3());
          
          export.setCellValue(Integer.valueOf(j++), userLog.getParam4());
          
          String plateColor = getText("other");
          switch (userLog.getPlateType().intValue())
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
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(userLog.getDtime()));
          
          export.setCellValue(Integer.valueOf(j++), userLog.getParam1());
        }
      }
    }
    else
    {
      AjaxDto<UserLogContent> ajaxDto = queryUserLog(begintime, endtime, null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          UserLogContent log = (UserLogContent)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), log.getName());
          
          export.setCellValue(Integer.valueOf(j++), log.getLogtime());
          
          export.setCellValue(Integer.valueOf(j++), log.getContent());
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    if (isSMS()) {
      return getText("report.tts.detail");
    }
    return getText("user.log.detail");
  }
  
  protected boolean isSMS()
  {
    String type = getRequestString("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("sms"));
  }
  
  protected AjaxDto<UserLog> querySmsLogDetail(String begintime, String endtime, String[] devices, Pagination pagin)
  {
    Integer mainType = Integer.valueOf(2);
    String[] mianTypes = mainType.toString().split(",");
    AjaxDto<UserLog> ajaxDto = this.userLogService.querySMSLog(begintime, endtime, 
      devices, mianTypes, 
      Integer.valueOf(1), pagin);
    if (ajaxDto.getPageList() != null) {
      for (UserLog log : ajaxDto.getPageList())
      {
        log.setDtimeStr(DateUtil.dateSwitchString(log.getDtime()));
        StandardUserAccount user = (StandardUserAccount)this.userLogService.getObject(StandardUserAccount.class, log.getUserId());
        log.setParam3(user.getName());
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, log.getParam4());
        if (vehicle != null) {
          log.setPlateType(vehicle.getPlateType());
        }
      }
    }
    return ajaxDto;
  }
  
  public String smsLogDetail()
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
        AjaxDto<UserLog> ajaxDto = querySmsLogDetail(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
}
