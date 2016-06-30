package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps808.model.StandardDriverDaily;
import com.gps808.model.StandardDriverMonth;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicleDaily;
import com.gps808.model.StandardVehicleMonth;
import com.gps808.model.line.StandardLineDaily;
import com.gps808.model.line.StandardLineMonth;
import com.gps808.model.line.StandardStationReport;
import com.gps808.model.line.StandardTrip;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleLineService;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

public class StandardReportLineAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleLineService standardVehicleLineService;
  
  public StandardVehicleLineService getStandardVehicleLineService()
  {
    return this.standardVehicleLineService;
  }
  
  public void setStandardVehicleLineService(StandardVehicleLineService standardVehicleLineService)
  {
    this.standardVehicleLineService = standardVehicleLineService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String summary()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      boolean flag = true;
      if ((isDaily()) && ((begintime == null) || (endtime == null) || 
        (!DateUtil.isDateValid(begintime)) || (!DateUtil.isDateValid(endtime)))) {
        flag = false;
      } else if ((isMonthly()) && ((begintime == null) || (endtime == null) || 
        (!DateUtil.isMonthDateValid(begintime)) || (!DateUtil.isMonthDateValid(endtime)))) {
        flag = false;
      }
      if (!flag)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        if ((query.getVehiIdnos() == null) || (query.getVehiIdnos().isEmpty())) {
          return "success";
        }
        if (isDriver())
        {
          if (isDaily())
          {
            AjaxDto<StandardDriverDaily> driverDailys = this.standardVehicleLineService.queryDriverDailys(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardDriverDaily> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getDailyTopDriver(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardDriverDaily> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardDriverDaily summaryRank = (StandardDriverDaily)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardDriverDaily)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", driverDailys.getPageList());
            addCustomResponse("pagination", driverDailys.getPagination());
          }
          else
          {
            begintime = begintime + "-01";
            endtime = DateUtil.getMonthMaxDate(endtime);
            AjaxDto<StandardDriverMonth> driverMonths = this.standardVehicleLineService.queryDriverMonths(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardDriverMonth> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getMonthTopDriver(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardDriverMonth> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardDriverMonth summaryRank = (StandardDriverMonth)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardDriverMonth)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", driverMonths.getPageList());
            addCustomResponse("pagination", driverMonths.getPagination());
          }
        }
        else if (isVehicle())
        {
          if (isDaily())
          {
            AjaxDto<StandardVehicleDaily> vehicleDailys = this.standardVehicleLineService.queryVehicleDailys(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardVehicleDaily> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getDailyTopVehicle(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardVehicleDaily> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardVehicleDaily summaryRank = (StandardVehicleDaily)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardVehicleDaily)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", vehicleDailys.getPageList());
            addCustomResponse("pagination", vehicleDailys.getPagination());
          }
          else
          {
            begintime = begintime + "-01";
            endtime = DateUtil.getMonthMaxDate(endtime);
            AjaxDto<StandardVehicleMonth> vehicleMonths = this.standardVehicleLineService.queryVehicleMonths(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardVehicleMonth> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getMonthTopVehicle(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardVehicleMonth> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardVehicleMonth summaryRank = (StandardVehicleMonth)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardVehicleMonth)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", vehicleMonths.getPageList());
            addCustomResponse("pagination", vehicleMonths.getPagination());
          }
        }
        else if (isLine()) {
          if (isDaily())
          {
            AjaxDto<StandardLineDaily> lineDailys = this.standardVehicleLineService.queryLineDailys(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardLineDaily> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getDailyTopLine(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardLineDaily> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardLineDaily summaryRank = (StandardLineDaily)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardLineDaily)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", lineDailys.getPageList());
            addCustomResponse("pagination", lineDailys.getPagination());
          }
          else
          {
            begintime = begintime + "-01";
            endtime = DateUtil.getMonthMaxDate(endtime);
            AjaxDto<StandardLineMonth> lineMonths = this.standardVehicleLineService.queryLineMonths(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
            List<StandardLineMonth> summaryRanks = new ArrayList();
            summaryRanks = this.standardVehicleLineService.getMonthTopLine(begintime, endtime, query.getVehiIdnos().split(","));
            if ((summaryRanks != null) && (summaryRanks.size() > 0))
            {
              int j = 1;
              List<StandardLineMonth> ranks = new ArrayList();
              for (int i = 0; (i < summaryRanks.size()) && (i < 10); i++)
              {
                StandardLineMonth summaryRank = (StandardLineMonth)summaryRanks.get(i);
                if (i != 0)
                {
                  if (summaryRank.getTc() == ((StandardLineMonth)summaryRanks.get(i - 1)).getTc())
                  {
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                  else
                  {
                    j++;
                    summaryRank.setRank(Integer.valueOf(j));
                  }
                }
                else {
                  summaryRank.setRank(Integer.valueOf(j));
                }
                ranks.add(summaryRank);
              }
              addCustomResponse("summaryRanks", ranks);
            }
            addCustomResponse("infos", lineMonths.getPageList());
            addCustomResponse("pagination", lineMonths.getPagination());
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  private boolean isDaily()
  {
    String daily = getRequest().getParameter("status");
    return (daily != null) && (!daily.isEmpty()) && ("daily".equals(daily));
  }
  
  private boolean isMonthly()
  {
    String daily = getRequest().getParameter("status");
    return (daily != null) && (!daily.isEmpty()) && ("monthly".equals(daily));
  }
  
  private boolean isLine()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("line"));
  }
  
  private boolean isVehicle()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("vehi"));
  }
  
  private boolean isDriver()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("driver"));
  }
  
  protected String[] genSummaryHeads()
  {
    if (isLine())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.line");
      heads[2] = getText("report.alarm.date");
      heads[3] = getText("report.trip.total");
      heads[4] = getText("report.alarm.total.times");
      heads[5] = getText("report.licheng.all");
      heads[6] = getText("report.oil.all");
      return heads;
    }
    if (isVehicle())
    {
      String[] heads = new String[9];
      heads[0] = getText("report.index");
      heads[1] = getText("report.vehicle");
      heads[2] = getText("report.plateColor");
      heads[3] = getText("report.line");
      heads[4] = getText("report.alarm.date");
      heads[5] = getText("report.trip.total");
      heads[6] = getText("report.alarm.total.times");
      heads[7] = getText("report.licheng.all");
      heads[8] = getText("report.oil.all");
      return heads;
    }
    String[] heads = new String[7];
    heads[0] = getText("report.index");
    heads[1] = getText("vehicle.driver");
    heads[2] = getText("report.alarm.date");
    heads[3] = getText("report.trip.total");
    heads[4] = getText("report.alarm.total.times");
    heads[5] = getText("report.licheng.all");
    heads[6] = getText("report.oil.all");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isLine())
    {
      if (isMonthly())
      {
        begintime = begintime + "-01";
        endtime = DateUtil.getMonthMaxDate(endtime);
        AjaxDto<StandardLineMonth> lineMonths = this.standardVehicleLineService.queryLineMonths(begintime, endtime, vehiIdnos.split(","), null);
        if ((lineMonths.getPageList() != null) && (lineMonths.getPageList().size() > 0)) {
          for (int i = 1; i <= lineMonths.getPageList().size(); i++)
          {
            StandardLineMonth line = (StandardLineMonth)lineMonths.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), line.getLn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchMonthDateString(line.getDt()));
            export.setCellValue(Integer.valueOf(j++), line.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(line.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(line.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(line.getYh()));
          }
        }
      }
      else
      {
        AjaxDto<StandardLineDaily> lineDailys = this.standardVehicleLineService.queryLineDailys(begintime, endtime, vehiIdnos.split(","), null);
        if ((lineDailys.getPageList() != null) && (lineDailys.getPageList().size() > 0)) {
          for (int i = 1; i <= lineDailys.getPageList().size(); i++)
          {
            StandardLineDaily daily = (StandardLineDaily)lineDailys.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), daily.getLn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(daily.getDt()));
            export.setCellValue(Integer.valueOf(j++), daily.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(daily.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(daily.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(daily.getYh()));
          }
        }
      }
    }
    else if (isVehicle())
    {
      if (isMonthly())
      {
        begintime = begintime + "-01";
        endtime = DateUtil.getMonthMaxDate(endtime);
        AjaxDto<StandardVehicleMonth> vehicleMonths = this.standardVehicleLineService.queryVehicleMonths(begintime, endtime, vehiIdnos.split(","), null);
        if ((vehicleMonths.getPageList() != null) && (vehicleMonths.getPageList().size() > 0)) {
          for (int i = 1; i <= vehicleMonths.getPageList().size(); i++)
          {
            StandardVehicleMonth vehicle = (StandardVehicleMonth)vehicleMonths.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), vehicle.getVn());
            String plateColor = getText("other");
            switch (vehicle.getPt().intValue())
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
            export.setCellValue(Integer.valueOf(j++), vehicle.getLn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(vehicle.getDt()));
            export.setCellValue(Integer.valueOf(j++), vehicle.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(vehicle.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(vehicle.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(vehicle.getYh()));
          }
        }
      }
      else
      {
        AjaxDto<StandardVehicleDaily> vehicleDailys = this.standardVehicleLineService.queryVehicleDailys(begintime, endtime, vehiIdnos.split(","), null);
        if ((vehicleDailys.getPageList() != null) && (vehicleDailys.getPageList().size() > 0)) {
          for (int i = 1; i <= vehicleDailys.getPageList().size(); i++)
          {
            StandardVehicleDaily vehicle = (StandardVehicleDaily)vehicleDailys.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), vehicle.getVn());
            String plateColor = getText("other");
            switch (vehicle.getPt().intValue())
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
            export.setCellValue(Integer.valueOf(j++), vehicle.getLn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(vehicle.getDt()));
            export.setCellValue(Integer.valueOf(j++), vehicle.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(vehicle.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(vehicle.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(vehicle.getYh()));
          }
        }
      }
    }
    else if (isDriver()) {
      if (isMonthly())
      {
        begintime = begintime + "-01";
        endtime = DateUtil.getMonthMaxDate(endtime);
        AjaxDto<StandardDriverMonth> driverMonths = this.standardVehicleLineService.queryDriverMonths(begintime, endtime, vehiIdnos.split(","), null);
        if ((driverMonths.getPageList() != null) && (driverMonths.getPageList().size() > 0)) {
          for (int i = 1; i <= driverMonths.getPageList().size(); i++)
          {
            StandardDriverMonth driver = (StandardDriverMonth)driverMonths.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), driver.getDn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchMonthDateString(driver.getDt()));
            export.setCellValue(Integer.valueOf(j++), driver.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(driver.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(driver.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(driver.getYh()));
          }
        }
      }
      else
      {
        AjaxDto<StandardDriverDaily> driverDailys = this.standardVehicleLineService.queryDriverDailys(begintime, endtime, vehiIdnos.split(","), null);
        if ((driverDailys.getPageList() != null) && (driverDailys.getPageList().size() > 0)) {
          for (int i = 1; i <= driverDailys.getPageList().size(); i++)
          {
            StandardDriverDaily daily = (StandardDriverDaily)driverDailys.getPageList().get(i - 1);
            int j = 0;
            export.setExportData(Integer.valueOf(1 + i));
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
            export.setCellValue(Integer.valueOf(j++), daily.getDn());
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(daily.getDt()));
            export.setCellValue(Integer.valueOf(j++), daily.getTc());
            export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(daily.getWt().intValue(), getText("report.hour"), 
              getText("report.minute"), getText("report.second")));
            export.setCellValue(Integer.valueOf(j++), getLiChengEx(daily.getLc()), "0.000");
            export.setCellValue(Integer.valueOf(j++), getYouLiang(daily.getYh()));
          }
        }
      }
    }
  }
  
  protected String genSummaryTitle()
  {
    if (isLine())
    {
      if (isMonthly()) {
        return getText("report.line.trip.month");
      }
      return getText("report.line.trip.daily");
    }
    if (isVehicle())
    {
      if (isMonthly()) {
        return getText("report.vehicle.trip.month");
      }
      return getText("report.vehicle.trip.daily");
    }
    if (isMonthly()) {
      return getText("report.driver.trip.month");
    }
    return getText("report.driver.trip.daily");
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
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        if (isTrip())
        {
          AjaxDto<StandardTrip> ajaxDto = this.standardVehicleLineService.queryTripDetails(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          addCustomResponse("infos", ajaxDto.getPageList());
          addCustomResponse("pagination", ajaxDto.getPagination());
        }
        else if (isStation())
        {
          AjaxDto<StandardStationReport> ajaxDto = this.standardVehicleLineService.queryStationDetails(begintime, endtime, query.getVehiIdnos().split(","), getPaginationEx());
          if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
            for (int i = 0; i < ajaxDto.getPageList().size(); i++)
            {
              StandardStationReport stationReport = (StandardStationReport)ajaxDto.getPageList().get(i);
              if ((stationReport.getIt() != null) && (stationReport.getOt() != null)) {
                stationReport.setDt(getTimeDifference(stationReport.getOt().getTime() - stationReport.getIt().getTime()));
              } else {
                stationReport.setDt("");
              }
            }
          }
          addCustomResponse("infos", ajaxDto.getPageList());
          addCustomResponse("pagination", ajaxDto.getPagination());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  private boolean isTrip()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("trip"));
  }
  
  private boolean isStation()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (!type.isEmpty()) && (type.equals("station"));
  }
  
  protected String[] genDetailHeads()
  {
    if (isTrip())
    {
      String[] heads = new String[18];
      heads[0] = getText("report.index");
      heads[1] = getText("report.line");
      heads[2] = getText("report.vehicle");
      heads[3] = getText("report.plateColor");
      heads[4] = getText("report.alarm.date");
      heads[5] = getText("report.trip.total");
      heads[6] = getText("vehicle.driver");
      heads[7] = getText("line.station.qiDian");
      heads[8] = getText("line.station.zhongDian");
      heads[9] = getText("line.start.time");
      heads[10] = getText("line.end.time");
      heads[11] = getText("report.alarm.total.times");
      heads[12] = getText("report.licheng.all");
      heads[13] = getText("report.oil.all");
      heads[14] = getText("super.quasi.error");
      heads[15] = getText("slip.station");
      heads[16] = getText("line.over.speed");
      heads[17] = getText("cross.the.line");
      return heads;
    }
    String[] heads = new String[15];
    heads[0] = getText("report.index");
    heads[1] = getText("report.line");
    heads[2] = getText("line.direction");
    heads[3] = getText("report.vehicle");
    heads[4] = getText("report.plateColor");
    heads[5] = getText("vehicle.driver");
    heads[6] = getText("line.station");
    heads[7] = getText("line.stop.time");
    heads[8] = getText("line.stop.speed");
    heads[9] = getText("line.outbound.time");
    heads[10] = getText("line.outbound.speed");
    heads[11] = getText("when.long.stops");
    heads[12] = getText("line.speed.limit");
    heads[13] = getText("line.licheng");
    heads[14] = getText("line.youliang");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    if (isTrip())
    {
      AjaxDto<StandardTrip> ajaxDto = this.standardVehicleLineService.queryTripDetails(begintime, endtime, vehiIdnos.split(","), null);
      if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardTrip trip = (StandardTrip)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          export.setCellValue(Integer.valueOf(j++), trip.getLn());
          export.setCellValue(Integer.valueOf(j++), trip.getVn());
          String plateColor = getText("other");
          switch (trip.getPt().intValue())
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
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchDateString(trip.getGdt()));
          export.setCellValue(Integer.valueOf(j++), trip.getTt());
          export.setCellValue(Integer.valueOf(j++), trip.getDn());
          export.setCellValue(Integer.valueOf(j++), trip.getSn());
          export.setCellValue(Integer.valueOf(j++), trip.getEn());
          if (trip.getSt() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(trip.getSt()));
          }
          if (trip.getEt() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(trip.getEt()));
          }
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(trip.getWt().intValue(), getText("report.hour"), 
            getText("report.minute"), getText("report.second")));
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(trip.getLc()), "0.000");
          export.setCellValue(Integer.valueOf(j++), getYouLiang(trip.getYh()));
          export.setCellValue(Integer.valueOf(j++), DateUtil.secondSwitchHourString(trip.getDt().intValue(), getText("report.hour"), 
            getText("report.minute"), getText("report.second")));
          String[] str = trip.getAs().split(",");
          export.setCellValue(Integer.valueOf(j++), str[0]);
          export.setCellValue(Integer.valueOf(j++), str[1]);
          export.setCellValue(Integer.valueOf(j++), str[2]);
        }
      }
    }
    else
    {
      AjaxDto<StandardStationReport> ajaxDto = this.standardVehicleLineService.queryStationDetails(begintime, endtime, vehiIdnos.split(","), null);
      if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardStationReport station = (StandardStationReport)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          export.setCellValue(Integer.valueOf(j++), station.getLn());
          String direction = getText("line.up");
          if (station.getLd().intValue() == 1) {
            direction = getText("line.down");
          }
          export.setCellValue(Integer.valueOf(j++), direction);
          export.setCellValue(Integer.valueOf(j++), station.getVn());
          String plateColor = getText("other");
          switch (station.getPt().intValue())
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
          export.setCellValue(Integer.valueOf(j++), station.getDn());
          export.setCellValue(Integer.valueOf(j++), station.getSn());
          if (station.getIt() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(station.getIt()));
          }
          export.setCellValue(Integer.valueOf(j++), getSpeed(station.getIs(), Integer.valueOf(1)));
          if (station.getOt() != null) {
            export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(station.getOt()));
          }
          export.setCellValue(Integer.valueOf(j++), getSpeed(station.getOs(), Integer.valueOf(1)));
          if ((station.getIt() != null) && (station.getOt() != null)) {
            export.setCellValue(Integer.valueOf(j++), getTimeDifference(station.getOt().getTime() - station.getIt().getTime()));
          } else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          export.setCellValue(Integer.valueOf(j++), getSpeed(station.getLs(), Integer.valueOf(1)));
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(station.getLc()), "0.000");
          export.setCellValue(Integer.valueOf(j++), getYouLiang(station.getYl()));
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    if (isTrip()) {
      return getText("report.trip.detail");
    }
    return getText("report.station.detail");
  }
}
