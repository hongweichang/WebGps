package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.UserLogService;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.vo.StandardUserOnlineQuery;
import java.util.ArrayList;
import java.util.List;

public class StandardReportUserOnlineAction
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
  
  public String summary()
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
        AjaxDto<StandardUserOnlineQuery> UserOnline = doSummary(begintime, endtime, getPaginationEx(), "true");
        addCustomResponse("infos", UserOnline.getPageList());
        addCustomResponse("pagination", UserOnline.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardUserOnlineQuery> doSummary(String begintime, String endtime, Pagination pagination, String isSummary)
  {
    String[] userIdList = getUserIds();
    List<StandardUserOnlineQuery> userOnlineQueries = this.userLogService.queryUserOnlineSummary(begintime, endtime, userIdList, isSummary);
    if (!isSummary.equals("true")) {
      for (int i = 0; i < userOnlineQueries.size(); i++)
      {
        StandardUserOnlineQuery userOnline = (StandardUserOnlineQuery)userOnlineQueries.get(i);
        userOnline.setLoginTypeStr(getLoginInformation(userOnline.getLoginType()));
      }
    }
    int start = 0;int index = userOnlineQueries.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(userOnlineQueries.size());
      if (userOnlineQueries.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardUserOnlineQuery> loginSummarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      loginSummarys2.add((StandardUserOnlineQuery)userOnlineQueries.get(i));
    }
    AjaxDto<StandardUserOnlineQuery> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(loginSummarys2);
    return dtoSummary;
  }
  
  private String getLoginInformation(Integer loginType)
  {
    String ret = "";
    switch (loginType.intValue())
    {
    case 4: 
      ret = getText("user.log.client.windows");
      break;
    case 5: 
      ret = getText("user.log.client.web");
      break;
    case 6: 
      ret = getText("user.log.client.mobile");
    }
    return ret;
  }
  
  public String detail()
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
        AjaxDto<StandardUserOnlineQuery> UserOnline = doSummary(begintime, endtime, getPaginationEx(), "false");
        addCustomResponse("infos", UserOnline.getPageList());
        addCustomResponse("pagination", UserOnline.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String[] getUserIds()
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
    return userIdList;
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.mobile.account");
    heads[2] = getText("terminal.mobile.name");
    heads[3] = getText("vehicle.company");
    heads[4] = getText("report.begintime");
    heads[5] = getText("report.endtime");
    heads[6] = getText("report.alarm.total");
    heads[7] = getText("report.alarm.total.times");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardUserOnlineQuery> userOnlineQueries = doSummary(begintime, endtime, null, "true");
    List<StandardUserOnlineQuery> onlineQueries = userOnlineQueries.getPageList();
    if (onlineQueries != null) {
      for (int i = 1; i <= onlineQueries.size(); i++)
      {
        StandardUserOnlineQuery summary = (StandardUserOnlineQuery)onlineQueries.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        export.setCellValue(Integer.valueOf(j++), summary.getAccount());
        export.setCellValue(Integer.valueOf(j++), summary.getName());
        export.setCellValue(Integer.valueOf(j++), summary.getCompany());
        if (summary.getBeginTime() != null)
        {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getBeginTime()));
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
          export.setCellValue(Integer.valueOf(j++), summary.getCount());
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(summary.getTimes().intValue(), getText("report.hour"), getText("report.minute"), getText("report.second")));
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.userOnline.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.mobile.account");
    heads[2] = getText("terminal.mobile.name");
    heads[3] = getText("vehicle.company");
    heads[4] = getText("user.login.information");
    heads[5] = getText("report.begintime");
    heads[6] = getText("report.endtime");
    heads[7] = getText("report.times");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardUserOnlineQuery> userOnlineQueries = doSummary(begintime, endtime, null, "false");
    List<StandardUserOnlineQuery> onlineQueries = userOnlineQueries.getPageList();
    if (onlineQueries != null) {
      for (int i = 1; i <= onlineQueries.size(); i++)
      {
        StandardUserOnlineQuery userOnline = (StandardUserOnlineQuery)onlineQueries.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        export.setCellValue(Integer.valueOf(j++), userOnline.getAccount());
        export.setCellValue(Integer.valueOf(j++), userOnline.getName());
        export.setCellValue(Integer.valueOf(j++), userOnline.getCompany());
        export.setCellValue(Integer.valueOf(j++), userOnline.getLoginTypeStr());
        if (userOnline.getBeginTime() != null)
        {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(userOnline.getBeginTime()));
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(userOnline.getEndTime()));
          if (userOnline.getTimes() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(userOnline.getTimes().intValue(), getText("report.hour"), getText("report.minute"), getText("report.second")));
          }
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.userOnline.detail");
  }
}
