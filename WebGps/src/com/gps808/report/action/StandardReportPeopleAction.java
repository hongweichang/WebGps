package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardStatisticsPeople;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardPeopleSummary;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StandardReportPeopleAction
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
  
  protected AjaxDto<StandardPeopleSummary> doSummary(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    Map<String, String> vehiLoadDev = getMapVehiDevRelation(vehicles, "people");
    StringBuffer devIdnos = new StringBuffer();
    Map<String, String> devLoadVehi = new HashMap();
    int i = 0;
    for (int j = vehicles.length; i < j; i++)
    {
      if (i != 0) {
        devIdnos.append(",");
      }
      devIdnos.append((String)vehiLoadDev.get(vehicles[i]));
      devLoadVehi.put((String)vehiLoadDev.get(vehicles[i]), vehicles[i]);
    }
    String[] idnos = devIdnos.toString().split(",");
    List<StandardPeopleSummary> standardPeopleSummaries = new ArrayList();
    AjaxDto<StandardStatisticsPeople> standardStatisticsPeoples = this.vehicleDailyService.queryStandardStatisticsPeopleDaily(begintime, endtime, idnos, null);
    if ((standardStatisticsPeoples.getPageList() != null) && (standardStatisticsPeoples.getPageList().size() > 0))
    {
      List<StandardStatisticsPeople> statisticsPeoples = standardStatisticsPeoples.getPageList();
      for ( i = 0; i < idnos.length; i++)
      {
        StandardPeopleSummary summary = new StandardPeopleSummary();
        String idno = idnos[i];
        summary.setVehiIdno((String)devLoadVehi.get(idno));
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, summary.getVehiIdno());
        if (vehicle != null) {
          summary.setPlateType(vehicle.getPlateType());
        }
        StandardStatisticsPeople start = null;
        StandardStatisticsPeople end = null;
        Integer upCur = Integer.valueOf(0);
        Integer downCur = Integer.valueOf(0);
        for (int j = 0; j < statisticsPeoples.size(); j++) {
          if (idno.equals(((StandardStatisticsPeople)statisticsPeoples.get(j)).getDevIdno()))
          {
            end = (StandardStatisticsPeople)statisticsPeoples.get(j);
            if (summary.getStartTimeStr() == null) {
              summary.setStartTimeStr(DateUtil.dateSwitchString(end.getStatisticsTime()));
            }
            if (start != null)
            {
              if (start.getUpPeople1().intValue() >= 0) {
                if (end.getUpPeople1().intValue() - start.getUpPeople1().intValue() > 0) {
                  upCur = Integer.valueOf(upCur.intValue() + (end.getUpPeople1().intValue() - start.getUpPeople1().intValue()));
                } else {
                  upCur = Integer.valueOf(upCur.intValue() + end.getUpPeople1().intValue());
                }
              }
              if (start.getUpPeople2().intValue() >= 0) {
                if (end.getUpPeople2().intValue() - start.getUpPeople2().intValue() > 0) {
                  upCur = Integer.valueOf(upCur.intValue() + (end.getUpPeople2().intValue() - start.getUpPeople2().intValue()));
                } else {
                  upCur = Integer.valueOf(upCur.intValue() + end.getUpPeople2().intValue());
                }
              }
              if (start.getUpPeople3().intValue() >= 0) {
                if (end.getUpPeople3().intValue() - start.getUpPeople3().intValue() > 0) {
                  upCur = Integer.valueOf(upCur.intValue() + (end.getUpPeople3().intValue() - start.getUpPeople3().intValue()));
                } else {
                  upCur = Integer.valueOf(upCur.intValue() + end.getUpPeople3().intValue());
                }
              }
              if (start.getUpPeople4().intValue() >= 0) {
                if (end.getUpPeople4().intValue() - start.getUpPeople4().intValue() > 0) {
                  upCur = Integer.valueOf(upCur.intValue() + (end.getUpPeople4().intValue() - start.getUpPeople4().intValue()));
                } else {
                  upCur = Integer.valueOf(upCur.intValue() + end.getUpPeople4().intValue());
                }
              }
              if (start.getDownPeople1().intValue() >= 0) {
                if (end.getDownPeople1().intValue() - start.getDownPeople1().intValue() > 0) {
                  downCur = Integer.valueOf(downCur.intValue() + (end.getDownPeople1().intValue() - start.getDownPeople1().intValue()));
                } else {
                  downCur = Integer.valueOf(downCur.intValue() + end.getDownPeople1().intValue());
                }
              }
              if (start.getDownPeople2().intValue() >= 0) {
                if (end.getDownPeople2().intValue() - start.getDownPeople2().intValue() > 0) {
                  downCur = Integer.valueOf(downCur.intValue() + (end.getDownPeople2().intValue() - start.getDownPeople2().intValue()));
                } else {
                  downCur = Integer.valueOf(downCur.intValue() + end.getDownPeople2().intValue());
                }
              }
              if (start.getDownPeople3().intValue() >= 0) {
                if (end.getDownPeople3().intValue() - start.getDownPeople3().intValue() > 0) {
                  downCur = Integer.valueOf(downCur.intValue() + (end.getDownPeople3().intValue() - start.getDownPeople3().intValue()));
                } else {
                  downCur = Integer.valueOf(downCur.intValue() + end.getDownPeople3().intValue());
                }
              }
              if (start.getDownPeople4().intValue() >= 0) {
                if (end.getDownPeople4().intValue() - start.getDownPeople4().intValue() > 0) {
                  downCur = Integer.valueOf(downCur.intValue() + (end.getDownPeople4().intValue() - start.getDownPeople4().intValue()));
                } else {
                  downCur = Integer.valueOf(downCur.intValue() + end.getDownPeople4().intValue());
                }
              }
            }
            start = end;
            summary.setEndTimeStr(DateUtil.dateSwitchString(end.getStatisticsTime()));
          }
        }
        summary.setUpPeople(upCur);
        summary.setDownPeople(downCur);
        summary.setIncrPeople(Integer.valueOf(upCur.intValue() - downCur.intValue()));
        if ((summary.getUpPeople().intValue() != 0) || (summary.getDownPeople().intValue() != 0)) {
          standardPeopleSummaries.add(summary);
        }
      }
    }
    int start = 0;int index = standardPeopleSummaries.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(standardPeopleSummaries.size());
      if (standardPeopleSummaries.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardPeopleSummary> loginSummarys2 = new ArrayList();
    for ( i = start; i < index; i++) {
      loginSummarys2.add((StandardPeopleSummary)standardPeopleSummaries.get(i));
    }
    AjaxDto<StandardPeopleSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(loginSummarys2);
    return dtoSummary;
  }
  
  public String summary()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isLongTimeValid(beginDate)) || (!DateUtil.isLongTimeValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<StandardPeopleSummary> dtoSummary = doSummary(beginDate, endDate, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", dtoSummary.getPageList());
        addCustomResponse("pagination", dtoSummary.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isLongTimeValid(beginDate)) || (!DateUtil.isLongTimeValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<StandardStatisticsPeople> dtoSummary = doDetail(beginDate, endDate, query.getVehiIdnos().split(","), getPaginationEx());
        addCustomResponse("infos", dtoSummary.getPageList());
        addCustomResponse("pagination", dtoSummary.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardStatisticsPeople> doDetail(String begintime, String endtime, String[] vehicles, Pagination pagination)
  {
    String tomap = getRequestString("toMap");
    Map<String, String> vehiLoadDev = getMapVehiDevRelation(vehicles, "people");
    StringBuffer devIdnos = new StringBuffer();
    Map<String, String> devLoadVehi = new HashMap();
    int i = 0;
    for (int j = vehicles.length; i < j; i++)
    {
      if (i != 0) {
        devIdnos.append(",");
      }
      devIdnos.append((String)vehiLoadDev.get(vehicles[i]));
      devLoadVehi.put((String)vehiLoadDev.get(vehicles[i]), vehicles[i]);
    }
    String[] idnos = devIdnos.toString().split(",");
    AjaxDto<StandardStatisticsPeople> standardStatisticsPeoples = this.vehicleDailyService.queryStandardStatisticsPeopleDaily(begintime, endtime, idnos, pagination);
    if ((standardStatisticsPeoples.getPageList() != null) && (standardStatisticsPeoples.getPageList().size() > 0))
    {
      List<StandardStatisticsPeople> peoples = standardStatisticsPeoples.getPageList();
      for ( i = 0; i < peoples.size(); i++)
      {
        StandardStatisticsPeople people = (StandardStatisticsPeople)peoples.get(i);
        people.setVehiIdno((String)devLoadVehi.get(people.getDevIdno()));
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, people.getVehiIdno());
        if (vehicle != null) {
          people.setPlateType(vehicle.getPlateType());
        }
        String position = getMapPositionEx(people.getJindu(), people.getWeidu(), Integer.parseInt(tomap), getSession().get("WW_TRANS_I18N_LOCALE"));
        people.setStartPosition(position);
      }
    }
    return standardStatisticsPeoples;
  }
  
  protected String[] genSummaryHeads()
  {
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.begintime");
    heads[4] = getText("report.endtime");
    heads[5] = getText("total.number.up");
    heads[6] = getText("total.number.down");
    heads[7] = getText("number.increments");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardPeopleSummary> dtoSummary = doSummary(begintime, endtime, vehiIdnos.split(","), null);
    if ((dtoSummary.getPageList() != null) && (dtoSummary.getPageList().size() > 0))
    {
      List<StandardPeopleSummary> list = dtoSummary.getPageList();
      for (int i = 1; i <= list.size(); i++)
      {
        StandardPeopleSummary people = (StandardPeopleSummary)list.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        export.setCellValue(Integer.valueOf(j++), people.getVehiIdno());
        
        String plateColor = getText("other");
        switch (people.getPlateType().intValue())
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
        export.setCellValue(Integer.valueOf(j++), people.getStartTimeStr());
        export.setCellValue(Integer.valueOf(j++), people.getEndTimeStr());
        export.setCellValue(Integer.valueOf(j++), people.getUpPeople());
        export.setCellValue(Integer.valueOf(j++), people.getDownPeople());
        export.setCellValue(Integer.valueOf(j++), people.getIncrPeople());
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("report.people.summary");
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[11];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = getText("report.currentPosition");
    heads[5] = getText("front.door.number.up");
    heads[6] = getText("front.door.number.down");
    heads[7] = getText("back.door.number.up");
    heads[8] = getText("back.door.number.down");
    heads[9] = getText("number.passengers");
    heads[10] = getText("number.increments");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardStatisticsPeople> dtoSummary = doDetail(begintime, endtime, vehiIdnos.split(","), null);
    if ((dtoSummary.getPageList() != null) && (dtoSummary.getPageList().size() > 0))
    {
      List<StandardStatisticsPeople> list = dtoSummary.getPageList();
      for (int i = 1; i <= list.size(); i++)
      {
        StandardStatisticsPeople people = (StandardStatisticsPeople)list.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        export.setCellValue(Integer.valueOf(j++), people.getVehiIdno());
        
        String plateColor = getText("other");
        switch (people.getPlateType().intValue())
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
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(people.getStatisticsTime()));
        export.setCellValue(Integer.valueOf(j++), people.getStartPosition());
        if (people.getUpPeople1().intValue() > 0)
        {
          export.setCellValue(Integer.valueOf(j++), people.getUpPeople1());
          export.setCellValue(Integer.valueOf(j++), people.getDownPeople1());
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), "");
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (people.getUpPeople2().intValue() > 0)
        {
          export.setCellValue(Integer.valueOf(j++), people.getUpPeople2());
          export.setCellValue(Integer.valueOf(j++), people.getDownPeople2());
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), "");
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), people.getCurPeople());
        export.setCellValue(Integer.valueOf(j++), people.getIncrPeople());
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.people.detail");
  }
}
