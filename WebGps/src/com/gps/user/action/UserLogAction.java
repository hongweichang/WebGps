package com.gps.user.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.UserLogService;
import com.gps.common.service.UserService;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.model.UserLog;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.user.vo.UserLogContent;
import java.util.ArrayList;
import java.util.List;

public class UserLogAction
  extends ReportBaseAction
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
    return findPrivilege(UserRole.PRIVI_USERMGR_LOG);
  }
  
  protected AjaxDto<UserLogContent> queryUserLog(String begintime, String endtime, Pagination pagination)
  {
    String user = getRequestString("userId");
    Integer userId = null;
    String[] userIdList = null;
    if ((user != null) && (!user.isEmpty()))
    {
      userId = Integer.valueOf(Integer.parseInt(user));
      if (userId.intValue() == 0)
      {
        AjaxDto<UserInfo> ajaxDto = getAllUser();
        userIdList = new String[ajaxDto.getPageList().size()];
        for (int i = 0; i < ajaxDto.getPageList().size(); i++) {
          userIdList[i] = ((UserInfo)ajaxDto.getPageList().get(i)).getId().toString();
        }
      }
      else
      {
        userIdList = new String[1];
        userIdList[0] = user;
      }
    }
    if (userIdList == null)
    {
      userIdList = new String[1];
      userIdList[0] = getClientId().toString();
    }
    String main = getRequestString("mainType");
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
        if (userlog.getUserInfo() != null) {
          logContent.setName(userlog.getUserInfo().getUserAccount().getName());
        } else {
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
        addCustomResponse("logs", ajaxLog.getPageList());
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
  
  protected AjaxDto<UserInfo> getAllUser()
  {
    AjaxDto<UserInfo> ajaxDto = UserBaseAction.userService.getUserList(null, getClientId(), null, null);
    UserInfo parent = (UserInfo)UserBaseAction.userService.get(getClientId());
    if (ajaxDto.getPageList() == null)
    {
      List<UserInfo> users = new ArrayList();
      ajaxDto.setPageList(users);
    }
    ajaxDto.getPageList().add(0, parent);
    return ajaxDto;
  }
  
  public String allUser()
    throws Exception
  {
    try
    {
      AjaxDto<UserInfo> ajaxDto = getAllUser();
      addCustomResponse("users", ajaxDto.getPageList());
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
    } else if (mainType.intValue() == 3) {
      ret = getMediaLog(subType, param1, param2, param3, param4);
    } else {
      ret = getText("system.common.unkown");
    }
    return ret;
  }
  
  protected String getMediaLog(Integer subType, String param1, String param2, String param3, String param4)
  {
    String ret;
    switch (subType.intValue())
    {
    case 1: 
       ret = getText("user.log.media.video") + param1;
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 2: 
       ret = getText("user.log.media.audio") + param1;
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 3: 
      ret = getText("user.log.media.tackback") + " ";
      if (param4.equals(Integer.valueOf(0))) {
        ret = ret + getText("user.log.media.tackback.begin");
      } else {
        ret = ret + getText("user.log.media.tackback.end");
      }
      break;
    case 4: 
       ret = getText("user.log.media.photo") + param1;
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 5: 
      ret = getText("user.log.media.recsearch");
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 6: 
       ret = getText("user.log.media.recdown") + param1;
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 7: 
     ret = getText("user.log.media.dlown");
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 9: 
      ret = getText("user.log.media.upload");
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 11: 
       ret = getText("user.log.media.upgrade");
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 12: 
       ret = getText("user.log.media.playback") + param1;
      if ((param4 != null) && (!param4.equals("0")) && (!param4.isEmpty())) {
        ret = ret + "," + getText("user.log.media.time") + param4;
      }
      break;
    case 8: 
    case 10: 
    default: 
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
      ret = getText("user.log.client.windows");
      break;
    case 2: 
      ret = getText("user.log.client.web");
      break;
    case 3: 
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
    String[] heads = new String[4];
    heads[0] = getText("report.index");
    heads[1] = getText("user.log.name");
    heads[2] = getText("report.time");
    heads[3] = getText("user.log.content");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    AjaxDto<UserLogContent> ajaxDto = queryUserLog(begintime, endtime, getPaginationEx());
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
  
  protected String genDetailTitle()
  {
    return getText("user.log.detail");
  }
}
