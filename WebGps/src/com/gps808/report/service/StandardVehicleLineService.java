package com.gps808.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps808.model.StandardDriverDaily;
import com.gps808.model.StandardDriverMonth;
import com.gps808.model.StandardVehicleDaily;
import com.gps808.model.StandardVehicleMonth;
import com.gps808.model.line.StandardLineDaily;
import com.gps808.model.line.StandardLineMonth;
import com.gps808.model.line.StandardStationReport;
import com.gps808.model.line.StandardTrip;
import java.util.List;

public abstract interface StandardVehicleLineService
  extends UniversalService
{
  public abstract AjaxDto<StandardLineDaily> queryLineDailys(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardLineMonth> queryLineMonths(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardVehicleDaily> queryVehicleDailys(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardVehicleMonth> queryVehicleMonths(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardDriverDaily> queryDriverDailys(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardDriverMonth> queryDriverMonths(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract List<StandardLineMonth> getMonthTopLine(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardLineDaily> getDailyTopLine(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardVehicleMonth> getMonthTopVehicle(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardVehicleDaily> getDailyTopVehicle(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardDriverMonth> getMonthTopDriver(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract List<StandardDriverDaily> getDailyTopDriver(String paramString1, String paramString2, String[] paramArrayOfString);
  
  public abstract AjaxDto<StandardTrip> queryTripDetails(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardStationReport> queryStationDetails(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
}
