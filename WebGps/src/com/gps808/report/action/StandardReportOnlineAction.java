package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardReportSummary;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class StandardReportOnlineAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleDailyService vehicleDailyService;
  
  public StandardVehicleDailyService getVehicleDailyService()
  {
    return this.vehicleDailyService;
  }
  
  public void setVehicleDailyService(StandardVehicleDailyService vehicleDailyService)
  {
    this.vehicleDailyService = vehicleDailyService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected AjaxDto<StandardReportSummary> doOnline(String begintime, String endtime, String[] vehicles, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    List<StandardReportSummary> onlines = new ArrayList();
    if (isMonthlyOnline())
    {
      SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd");
      begintime = dfs.format(DateUtil.StrMonth2Date(begintime));
      endtime = dfs.format(DateUtil.dateIncrease(DateUtil.StrMonth2Date(endtime), Integer.valueOf(1), Integer.valueOf(0)));
      onlines = this.vehicleDailyService.queryMonthlyOnline(begintime, endtime, vehicles);
    }
    else if (isDailyOnline())
    {
      onlines = this.vehicleDailyService.queryCompanyDaily(begintime, endtime, vehicles, null);
    }
    int start = 0;int index = onlines.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(onlines.size());
      if (onlines.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardReportSummary> onlines2 = new ArrayList();
    for (int i = start; i < index; i++) {
      onlines2.add((StandardReportSummary)onlines.get(i));
    }
    AjaxDto<StandardReportSummary> dtoOnline = new AjaxDto();
    dtoOnline.setPagination(pagination);
    dtoOnline.setPageList(onlines2);
    return dtoOnline;
  }
  
  public String monthlyOnline()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isMonthDateValid(begintime)) || (!DateUtil.isMonthDateValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<StandardReportSummary> monthlyOnlines = doOnline(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        
        addCustomResponse("infos", monthlyOnlines.getPageList());
        addCustomResponse("pagination", monthlyOnlines.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String dailyOnline()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isMonthDateValid(begintime)) || (!DateUtil.isMonthDateValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        String[] companyIdnos = query.getVehiIdnos().split(",");
        AjaxDto<StandardReportSummary> dailyOnlines = doOnline(begintime, endtime, companyIdnos, getPaginationEx(), null, null, null, null);
        addCustomResponse("infos", dailyOnlines.getPageList());
        addCustomResponse("pagination", dailyOnlines.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String[] genSummaryHeads()
  {
    if (isMonthlyOnline())
    {
      String[] heads = new String[5];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.time");
      heads[4] = getText("report.login.loginrate");
      return heads;
    }
    if (isDailyOnline())
    {
      String[] heads = new String[4];
      heads[0] = getText("report.index");
      heads[1] = getText("report.company");
      heads[2] = getText("report.time");
      heads[3] = getText("report.login.loginrate");
      return heads;
    }
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("report.login.onlineCount");
    heads[6] = getText("report.login.disonlineCount");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardReportSummary> onlines = doOnline(begintime, endtime, vehiIdnos.split(","), null, null, null, null, null);
    if (isMonthlyOnline()) {
      for (int i = 1; i <= onlines.getPageList().size(); i++)
      {
        StandardReportSummary summary = (StandardReportSummary)onlines.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno());
        
        String plateColor = getText("other");
        switch (summary.getPlateType().intValue())
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
        
        export.setCellValue(Integer.valueOf(j++), summary.getParam1SumStr());
        
        DecimalFormat r = new DecimalFormat();
        r.applyPattern("#0.00");
        export.setCellValue(Integer.valueOf(j++), r.format(Float.parseFloat(summary.getLoginRate().toString()) * 100.0F) + "%");
      }
    } else if (isDailyOnline()) {
      for (int i = 1; i <= onlines.getPageList().size(); i++)
      {
        StandardReportSummary summary = (StandardReportSummary)onlines.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), summary.getName());
        
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(summary.getBeginTime()));
        
        DecimalFormat r = new DecimalFormat();
        r.applyPattern("#0.00");
        export.setCellValue(Integer.valueOf(j++), r.format(Float.parseFloat(summary.getLoginRate().toString()) * 100.0F) + "%");
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    if (isMonthlyOnline()) {
      return getText("report.monthlyOnline.title");
    }
    if (isDailyOnline()) {
      return getText("report.dailyOnline.title");
    }
    return getText("report.login.summary");
  }
  
  protected boolean isDailyOnline()
  {
    String type = getRequestString("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("dailyOnline"));
  }
  
  protected boolean isMonthlyOnline()
  {
    String type = getRequestString("type");
    return (type != null) && (type.equals("monthlyOnline"));
  }
}
