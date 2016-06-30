package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.common.service.UserLogService;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.model.UserLog;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.vo.DeviceQuery;
import java.util.List;

public class ReportTtsAction
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
    return findPrivilege(UserRole.PRIVI_REPORT_DISPATCH);
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String userId = getRequestString("userId");
      
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<UserLog> ajaxDto = this.userLogService.queryUserLog(begintime, endtime, 
          query.getDevIdnos().split(","), userId, Integer.valueOf(2), 
          Integer.valueOf(1), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        if (ajaxDto.getPageList() != null) {
          for (UserLog log : ajaxDto.getPageList()) {
            log.setDtimeStr(DateUtil.dateSwitchString(log.getDtime()));
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
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
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[5];
    heads[0] = getText("report.index");
    heads[1] = getText("report.dispatch.user");
    heads[2] = getText("report.terminal");
    heads[3] = getText("report.dispatch.time");
    heads[4] = getText("report.dispatch.command");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String userId = getRequestString("userId");
    AjaxDto<UserLog> ajaxDto = this.userLogService.queryUserLog(begintime, endtime, 
      devIdnos.split(","), userId, Integer.valueOf(2), 
      Integer.valueOf(1), null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        UserLog userLog = (UserLog)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        if (userLog.getUserInfo() != null) {
          export.setCellValue(Integer.valueOf(j++), userLog.getUserInfo().getUserAccount().getName());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(userLog.getDevIdno()));
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(userLog.getDtime()));
        
        export.setCellValue(Integer.valueOf(j++), userLog.getParam1());
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.tts.detail");
  }
}
