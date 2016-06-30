package com.gps808.report.action.base;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.util.GPSToPositionUtils;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.service.StandardVehicleLoginService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardDeviceTrack;
import com.gps808.report.vo.StandardReportSummary;
import com.gps808.report.vo.StandardVehicleAlarmInfo;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.hibernate.type.StandardBasicTypes;

public class StandardReportBaseAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  protected StandardVehicleGpsService vehicleGpsService;
  protected StandardVehicleAlarmService vehicleAlarmService;
  protected StandardVehicleLoginService loginService;
  protected StandardVehicleDailyService vehicleDailyService;
  
  public StandardVehicleDailyService getVehicleDailyService()
  {
    return this.vehicleDailyService;
  }
  
  public void setVehicleDailyService(StandardVehicleDailyService vehicleDailyService)
  {
    this.vehicleDailyService = vehicleDailyService;
  }
  
  public StandardVehicleLoginService getLoginService()
  {
    return this.loginService;
  }
  
  public void setLoginService(StandardVehicleLoginService loginService)
  {
    this.loginService = loginService;
  }
  
  public StandardVehicleGpsService getVehicleGpsService()
  {
    return this.vehicleGpsService;
  }
  
  public void setVehicleGpsService(StandardVehicleGpsService vehicleGpsService)
  {
    this.vehicleGpsService = vehicleGpsService;
  }
  
  public StandardVehicleAlarmService getVehicleAlarmService()
  {
    return this.vehicleAlarmService;
  }
  
  public void setVehicleAlarmService(StandardVehicleAlarmService vehicleAlarmService)
  {
    this.vehicleAlarmService = vehicleAlarmService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  protected String[] getPaginationDevice(Pagination pagination, String[] devIdnos)
  {
    int offset = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
    if ((offset < 0) || (devIdnos.length < offset))
    {
      pagination.setCurrentPage(1);
      offset = 0;
    }
    int endOffset = offset + pagination.getPageRecords();
    if (endOffset > devIdnos.length) {
      endOffset = devIdnos.length;
    }
    String[] devLists = new String[endOffset - offset];
    int j = 0;
    for (int i = offset; i < endOffset; i++)
    {
      devLists[j] = devIdnos[i];
      j++;
    }
    return devLists;
  }
  
  protected String[] getPaginationDate(Pagination pagination, String begintime, String endtime)
  {
    Date begin = DateUtil.StrDate2Date(begintime);
    Date end = DateUtil.StrDate2Date(endtime);
    long DAY = 86400000L;
    long dayNumber = (end.getTime() - begin.getTime()) / DAY + 1L;
    pagination.setTotalRecords((int)dayNumber);
    
    int offset = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
    if ((offset < 0) || (dayNumber < offset))
    {
      pagination.setCurrentPage(1);
      offset = 0;
    }
    int endOffset = offset + pagination.getPageRecords();
    if (endOffset > dayNumber) {
      endOffset = (int)dayNumber;
    }
    String[] timeLists = new String[3];
    long btime = begin.getTime() + offset * DAY;
    long etime = begin.getTime() + (endOffset - 1) * DAY;
    timeLists[0] = DateUtil.dateSwitchDateString(new Date(btime));
    timeLists[1] = DateUtil.dateSwitchDateString(new Date(etime));
    timeLists[2] = String.format("%d", new Object[] { Integer.valueOf(endOffset - offset) });
    return timeLists;
  }
  
  protected String getDeviceArmTypeKey(String vehiIdno, Integer armType)
  {
    return vehiIdno + "-" + armType;
  }
  
  protected Map<String, StandardDeviceAlarmSummary> listAlarmSummary2mapByDeviceArmTypeKey(List<StandardDeviceAlarmSummary> alarmSummary, boolean isdriving)
  {
    Map<String, StandardDeviceAlarmSummary> mapSummary = new HashMap();
    if (alarmSummary.size() == 1)
    {
      StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)alarmSummary.get(0);
      if ((summary.getHandleStatus() != null) && (summary.getHandleStatus().intValue() == 1))
      {
        if (isdriving)
        {
          if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
            summary.setCountStr("1/" + getTimeDifferenceEx(summary.getParam1Sum().intValue()));
          } else {
            summary.setCountStr("1/0" + getText("report.second"));
          }
        }
        else {
          summary.setCountStr("1/1");
        }
      }
      else if (isdriving)
      {
        if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
          summary.setCountStr("1/" + getTimeDifferenceEx(summary.getParam1Sum().intValue()));
        } else {
          summary.setCountStr("1/0" + getText("report.second"));
        }
      }
      else {
        summary.setCountStr("1/0");
      }
      mapSummary.put(getDeviceArmTypeKey(summary.getVehiIdno(), summary.getArmType()), summary);
    }
    else
    {
      for (int i = 0; i < alarmSummary.size(); i++)
      {
        Integer handled = Integer.valueOf(0);
        Integer unhandled = Integer.valueOf(0);
        StandardDeviceAlarmSummary summary = (StandardDeviceAlarmSummary)alarmSummary.get(i);
        Integer count = summary.getCount();
        if ((summary.getHandleStatus() != null) && (summary.getHandleStatus().intValue() == 1)) {
          handled = Integer.valueOf(handled.intValue() + summary.getCount().intValue());
        } else {
          unhandled = Integer.valueOf(unhandled.intValue() + summary.getCount().intValue());
        }
        for (int j = i + 1; j < alarmSummary.size(); j++)
        {
          StandardDeviceAlarmSummary summary2 = (StandardDeviceAlarmSummary)alarmSummary.get(j);
          if ((summary.getVehiIdno().equals(summary2.getVehiIdno())) && (summary.getArmType().equals(summary2.getArmType())))
          {
            if ((summary2.getHandleStatus() != null) && (summary2.getHandleStatus().intValue() == 1)) {
              handled = Integer.valueOf(handled.intValue() + summary2.getCount().intValue());
            } else {
              unhandled = Integer.valueOf(unhandled.intValue() + summary2.getCount().intValue());
            }
            count = Integer.valueOf(count.intValue() + summary2.getCount().intValue());
            alarmSummary.remove(j);
          }
        }
        if (isdriving)
        {
          if ((summary.getParam1Sum() != null) && (summary.getParam1Sum().intValue() != 0)) {
            summary.setCountStr(handled.intValue() + unhandled.intValue() + "/" + getTimeDifferenceEx(summary.getParam1Sum().intValue()));
          } else {
            summary.setCountStr(handled.intValue() + unhandled.intValue() + "/0" + getText("report.second"));
          }
        }
        else {
          summary.setCountStr(handled.intValue() + unhandled.intValue() + "/" + handled);
        }
        summary.setCount(count);
        mapSummary.put(getDeviceArmTypeKey(summary.getVehiIdno(), summary.getArmType()), summary);
      }
    }
    return mapSummary;
  }
  
  public void summaryAlarmReport(StandardReportSummary summary, StandardDeviceAlarmSummary alarmSummary, boolean isdriving)
  {
    if (alarmSummary != null)
    {
      if ((summary.getBeginTime() == null) || (alarmSummary.getBeginTime().before(summary.getBeginTime()))) {
        summary.setBeginTime(alarmSummary.getBeginTime());
      }
      if ((alarmSummary.getEndTime() != null) && ((summary.getEndTime() == null) || (alarmSummary.getEndTime().after(summary.getEndTime())))) {
        summary.setEndTime(alarmSummary.getEndTime());
      }
      summary.setPlateType(alarmSummary.getPlateType());
      summary.setVehiColor(alarmSummary.getVehiColor());
      summary.setParam1Sum(alarmSummary.getParam1Sum());
      summary.addCountStr(alarmSummary.getCountStr());
      summary.addCount(alarmSummary.getCount());
    }
    else
    {
      if (isdriving) {
        summary.addCountStr("0/0" + getText("report.second"));
      } else {
        summary.addCountStr("0/0");
      }
      summary.addCount(Integer.valueOf(0));
    }
  }
  
  protected boolean isGraph()
  {
    String type = getRequestString("type");
    if ((type != null) && (type.equals("graph"))) {
      return true;
    }
    return false;
  }
  
  protected boolean isGraphSpeed()
  {
    String type = getRequestString("type");
    if ((type != null) && (type.equals("graphSpeed"))) {
      return true;
    }
    return false;
  }
  
  protected String getOilDevIdno(String vehiIdno)
  {
    String devIdno = null;
    List<StandardVehiDevRelationEx> ralation = this.standardUserService.getStandardVehiDevRelationExList(vehiIdno, null);
    if ((ralation != null) && (ralation.size() > 0)) {
      for (StandardVehiDevRelationEx standardVehiDevRelation : ralation)
      {
        String module = Integer.toString(standardVehiDevRelation.getModule().intValue(), 2);
        while (module.length() < 9) {
          module = "0" + module;
        }
        if (module.substring(1, 2).equals("1")) {
          devIdno = standardVehiDevRelation.getDevIdno();
        }
      }
    }
    return devIdno;
  }
  
  protected String getTempDevIdno(String vehiIdno)
  {
    String devIdno = null;
    List<StandardVehiDevRelationEx> ralation = this.standardUserService.getStandardVehiDevRelationExList(vehiIdno, null);
    if ((ralation != null) && (ralation.size() > 0)) {
      for (StandardVehiDevRelationEx standardVehiDevRelation : ralation)
      {
        String temp = standardVehiDevRelation.getTempAttr();
        if ((temp != null) && (!temp.isEmpty())) {
          devIdno = standardVehiDevRelation.getDevIdno();
        }
      }
    }
    return devIdno;
  }
  
  protected Integer getTempNum(String vehiIdno)
  {
    int number = 0;
    List<StandardVehiDevRelationEx> ralation = this.standardUserService.getStandardVehiDevRelationExList(vehiIdno, null);
    if ((ralation != null) && (ralation.size() > 0)) {
      for (StandardVehiDevRelationEx standardVehiDevRelation : ralation)
      {
        String temp = standardVehiDevRelation.getTempAttr();
        if ((temp != null) && (!temp.isEmpty())) {
          number = temp.split(",").length;
        }
      }
    }
    return Integer.valueOf(number);
  }
  
  protected String getGPSDevIdno(String vehiIdno)
  {
    String devIdno = null;
    List<StandardVehiDevRelationEx> ralation = this.standardUserService.getStandardVehiDevRelationExList(vehiIdno, null);
    if ((ralation != null) && (ralation.size() > 0)) {
      if (ralation.size() > 1) {
        for (StandardVehiDevRelationEx standardVehiDevRelation : ralation) {
          if ((standardVehiDevRelation.getModule().intValue() >> 0 & 0x1) <= 0) {
            return standardVehiDevRelation.getDevIdno();
          }
        }
      } else if (ralation.size() == 1) {
        return ((StandardVehiDevRelationEx)ralation.get(0)).getDevIdno();
      }
    }
    return devIdno;
  }
  
  protected void queryGpsTrack(String distance, String parkTime, Pagination pagination, Integer type)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String vehiIdno = getRequest().getParameter("vehiIdno");
      String toMap = getRequestString("toMap");
      String time = getRequestString("time");
      String speed = getRequestString("speed");
      String temperature = getRequestString("temperature");
      if ((begintime == null) || (endtime == null) || (vehiIdno == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        int meter = 0;
        if ((distance != null) && (!distance.isEmpty())) {
          meter = (int)(Double.parseDouble(distance) * 1000.0D);
        }
        int park = 0;
        if ((parkTime != null) && (!parkTime.isEmpty())) {
          park = Integer.parseInt(parkTime);
        }
        String devIdno = null;
        if ((type != null) && (type.intValue() == 1)) {
          devIdno = getOilDevIdno(vehiIdno);
        } else if ((type != null) && (type.intValue() == 2)) {
          devIdno = getTempDevIdno(vehiIdno);
        } else {
          devIdno = getGPSDevIdno(vehiIdno);
        }
        int interval = 0;
        if ((time != null) && (!time.isEmpty())) {
          interval = Integer.parseInt(time) * 1000;
        }
        int limit = 0;
        if ((speed != null) && (!speed.isEmpty())) {
          limit = Integer.parseInt(speed);
        }
        int temp = 0;
        if ((temperature != null) && (!temperature.isEmpty())) {
          temp = Integer.parseInt(temperature);
        }
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehiIdno);
        int tempCount = 0;
        if ((vehicle != null) && (vehicle.getTempCount() != null)) {
          tempCount = vehicle.getTempCount().intValue();
        }
        AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, interval, limit, park, temp, tempCount, pagination, toMap, devIdno);
        
        List<StandardDeviceTrack> tracks = ajaxDto.getPageList();
        if ((tracks != null) && (tracks.size() > 0)) {
          if (isGraph())
          {
            if (tracks.size() > 2) {
              for (int i = 1; i < tracks.size() - 2; i++)
              {
                boolean flag = true;
                while ((flag) && (i < tracks.size() - 2))
                {
                  int j = i + 1;
                  if ((((StandardDeviceTrack)tracks.get(i)).getYouLiang() != null) && (
                    (((StandardDeviceTrack)tracks.get(j)).getYouLiang() == null) || 
                    (((StandardDeviceTrack)tracks.get(i)).getYouLiang().intValue() == ((StandardDeviceTrack)tracks.get(j)).getYouLiang().intValue()))) {
                    tracks.remove(j);
                  } else {
                    flag = false;
                  }
                }
              }
            }
          }
          else if (!isGraphSpeed()) {
            for (int i = 0; i < tracks.size(); i++)
            {
              StandardDeviceTrack track = (StandardDeviceTrack)tracks.get(i);
              if ((track != null) && (isGpsValid(track.getStatus1())))
              {
                int mapType;
                try
                {
                  mapType = Integer.parseInt(toMap);
                }
                catch (Exception e)
                {
                  
                  mapType = 2;
                }
                track.setPosition(getMapPosition(track.getJingDu(), track.getWeiDu(), mapType, true));
              }
            }
          }
        }
        addCustomResponse("infos", tracks);
        addCustomResponse("vehicle", vehicle);
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
  
  protected String getPosition(Integer jingDu, Integer weiDu, Integer status1)
  {
    if ((isGpsValid(status1)) && (jingDu != null) && (weiDu != null)) {
      return formatPosition(jingDu) + "," + formatPosition(weiDu);
    }
    return "";
  }
  
  protected Double getSpeedEx(Integer speed, Integer status1)
  {
    if (isGpsValid(status1))
    {
      double db = speed.intValue() * 1.0D;
      return Double.valueOf(db / 10.0D);
    }
    return Double.valueOf(0.0D);
  }
  
  protected Double getLiChengEx(Integer licheng)
  {
    if ((licheng != null) && (licheng.intValue() >= 0))
    {
      double db = licheng.intValue();
      db /= 1000.0D;
      return Double.valueOf(db);
    }
    return Double.valueOf(0.0D);
  }
  
  protected String getYouLiang(Integer youLiang)
  {
    double db = youLiang.intValue();
    DecimalFormat format = new DecimalFormat();
    format.applyPattern("#0.00");
    return format.format(db / 100.0D);
  }
  
  protected String getSpeedUnit()
  {
    return getText("report.speed.unit.km");
  }
  
  protected String getLiChengUnit()
  {
    return getText("report.licheng.unit.km");
  }
  
  protected String[] genDetailHeads()
  {
    return null;
  }
  
  protected void genDetailDataEx(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export) {}
  
  protected String genDetailTitle()
  {
    return null;
  }
  
  public String detailExcel()
    throws Exception
  {
    String exportType = getRequestString("exportType") == null ? String.valueOf(1) : getRequestString("exportType");
    ExportReport export = null;
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        String queryFilter = getRequestString("query");
        String qtype = getRequestString("qtype");
        String sortname = getRequestString("sortname");
        String sortorder = getRequestString("sortorder");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
        
          toMap = 2;
        }
        String title = genDetailTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genDetailHeads();
        
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)), title, heads);
        
        genDetailData(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), vehiIdnos, export);
        
        this.excelStream = export.createStream();
      }
      else
      {
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)));
        this.excelStream = export.doExcelNoRight(this.excelError);
      }
      this.excelFile = export.getFileStream();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return export.getResult();
  }
  
  public String detailExcelEx()
    throws Exception
  {
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        String queryFilter = getRequestString("query");
        String qtype = getRequestString("qtype");
        String sortname = getRequestString("sortname");
        String sortorder = getRequestString("sortorder");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
         
          toMap = 2;
        }
        String title = genDetailTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genDetailHeads();
        
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("sheet1");
        
        genDetailDataEx(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), vehiIdnos, sheet, wb);
        
        this.excelStream = createExcelStream(wb, sheet, heads, title);
        String file = title + ".xls";
        makeExcelName(file);
      }
      else
      {
        doExcelNoRight();
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "excel";
  }
  
  protected String[] genSummaryHeads()
  {
    return null;
  }
  
  protected void genSummaryDataEx(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export) {}
  
  protected String genSummaryTitle()
  {
    return null;
  }
  
  public String summaryExcel()
    throws Exception
  {
    String exportType = getRequestString("exportType") == null ? String.valueOf(1) : getRequestString("exportType");
    ExportReport export = null;
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        String queryFilter = getRequestString("query");
        String qtype = getRequestString("qtype");
        String sortname = getRequestString("sortname");
        String sortorder = getRequestString("sortorder");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
          
          toMap = 2;
        }
        String title = genSummaryTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genSummaryHeads();
        
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)), title, heads);
        
        genSummaryData(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), vehiIdnos, export);
        
        this.excelStream = export.createStream();
      }
      else
      {
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)));
        this.excelStream = export.doExcelNoRight(this.excelError);
      }
      this.excelFile = export.getFileStream();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return export.getResult();
  }
  
  public String summaryExcelEx()
    throws Exception
  {
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        String queryFilter = getRequestString("query");
        String qtype = getRequestString("qtype");
        String sortname = getRequestString("sortname");
        String sortorder = getRequestString("sortorder");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
      
          toMap = 2;
        }
        String title = genSummaryTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genSummaryHeads();
        
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("sheet1");
        
        genSummaryDataEx(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), vehiIdnos, sheet, wb);
        
        this.excelStream = createExcelStream(wb, sheet, heads, title);
        String file = title + ".xls";
        makeExcelName(file);
      }
      else
      {
        doExcelNoRight();
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "excel";
  }
  
  protected String[] genGpstrackHeads()
  {
    return null;
  }
  
  protected void genGpstrackDataEx(String begintime, String endtime, Integer toMap, String vehiIdno, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export) {}
  
  protected String genGpstrackTitle()
  {
    return null;
  }
  
  public String gpstrackExcel()
    throws Exception
  {
    String exportType = getRequestString("exportType") == null ? String.valueOf(1) : getRequestString("exportType");
    ExportReport export = null;
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
          toMap = 2;
        }
        String title = genGpstrackTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genGpstrackHeads();
        
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)), title, heads);
        
        genGpstrackData(begintime, endtime, Integer.valueOf(toMap), vehiIdnos, export);
        
        this.excelStream = export.createStream();
      }
      else
      {
        export = new ExportReport(Integer.valueOf(Integer.parseInt(exportType)));
        this.excelStream = export.doExcelNoRight(this.excelError);
      }
      this.excelFile = export.getFileStream();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return export.getResult();
  }
  
  public String gpstrackExcelEx()
    throws Exception
  {
    try
    {
      if (this.hasExcelRight)
      {
        String begintime = getRequest().getParameter("begintime");
        String endtime = getRequest().getParameter("endtime");
        String vehiIdnos = getRequest().getParameter("vehiIdnos");
        int toMap;
        try
        {
          toMap = Integer.parseInt(getRequestString("toMap"));
        }
        catch (Exception e)
        {
      
          toMap = 2;
        }
        String title = genGpstrackTitle() + " - " + begintime + " - " + endtime;
        
        String[] heads = genGpstrackHeads();
        
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("sheet1");
        
        genGpstrackDataEx(begintime, endtime, Integer.valueOf(toMap), vehiIdnos, sheet, wb);
        
        this.excelStream = createExcelStream(wb, sheet, heads, title);
        String file = title + ".xls";
        makeExcelName(file);
      }
      else
      {
        doExcelNoRight();
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return "excel";
  }
  
  protected String handlePosition(String[] statusInfo, Integer toMap, boolean nullToLatLng)
  {
    String position = "";
    if ((statusInfo != null) && (statusInfo.length > 0) && 
      (isGpsValid(Integer.valueOf(Integer.parseInt(statusInfo[0])))) && 
      (statusInfo.length > 6))
    {
      position = getMapPositionEx(Integer.valueOf(Integer.parseInt(statusInfo[5])), Integer.valueOf(Integer.parseInt(statusInfo[6])), toMap.intValue(), getSession().get("WW_TRANS_I18N_LOCALE"));
      if ((nullToLatLng) && (position.isEmpty()) && 
        (!statusInfo[6].equals("0")) && (!statusInfo[5].equals("0"))) {
        position = formatPosition(Integer.valueOf(Integer.parseInt(statusInfo[6]))) + "," + formatPosition(Integer.valueOf(Integer.parseInt(statusInfo[5])));
      }
    }
    return position;
  }
  
  protected String handlePositionEx(String[] statusInfo, Integer toMap)
  {
    return ReportBaseAction.S_getMapPosition(Integer.valueOf(Integer.parseInt(statusInfo[5])), Integer.valueOf(Integer.parseInt(statusInfo[6])), toMap.intValue(), isSessChinese(), getSession().get("WW_TRANS_I18N_LOCALE"));
  }
  
  protected String[] handleFieldData(String fieldStr)
  {
    if ((fieldStr != null) && (!fieldStr.isEmpty())) {
      return fieldStr.split("\\|");
    }
    return null;
  }
  
  protected String getTimeDifference(long millisecond)
  {
    String difValue = "";
    long days = millisecond / 86400000L;
    long hours = millisecond / 3600000L - days * 24L;
    long minutes = millisecond / 60000L - days * 24L * 60L - hours * 60L;
    long seconds = millisecond / 1000L - days * 24L * 60L * 60L - hours * 60L * 60L - minutes * 60L;
    if (days != 0L) {
      difValue = difValue + days + getText("report.day");
    }
    if (hours != 0L) {
      difValue = difValue + " " + hours + getText("report.hour");
    }
    if (minutes != 0L) {
      difValue = difValue + " " + minutes + getText("report.minute");
    }
    if (seconds != 0L) {
      difValue = difValue + " " + seconds + getText("report.second");
    }
    return difValue;
  }
  
  protected String getTimeDifferenceEx(long second)
  {
    String difValue = "";
    long days = second / 86400L;
    long hours = second / 3600L - days * 24L;
    long minutes = second / 60L - days * 24L * 60L - hours * 60L;
    long seconds = second - days * 24L * 60L * 60L - hours * 60L * 60L - minutes * 60L;
    if (days != 0L) {
      difValue = difValue + days + getText("report.day");
    }
    if (hours != 0L) {
      difValue = difValue + " " + hours + getText("report.hour");
    }
    if (minutes != 0L) {
      difValue = difValue + " " + minutes + getText("report.minute");
    }
    if (seconds != 0L) {
      difValue = difValue + " " + seconds + getText("report.second");
    }
    return difValue;
  }
  
  protected String getUserName(Map<Integer, String> mapUser, Integer userId)
  {
    if ((mapUser == null) || (mapUser.size() == 0))
    {
      AjaxDto<StandardUserAccount> dtoUsers = this.standardUserService.getStandardUsersList(null, null, null, null);
      List<StandardUserAccount> lstUser = dtoUsers.getPageList();
      if (mapUser == null) {
        mapUser = new HashMap();
      }
      for (int i = 0; i < lstUser.size(); i++) {
        mapUser.put(((StandardUserAccount)lstUser.get(i)).getId(), ((StandardUserAccount)lstUser.get(i)).getAccount());
      }
    }
    return (String)mapUser.get(userId);
  }
  
  protected List<StandardDeviceAlarm> handleDetailData(List<StandardDeviceAlarm> deviceAlarms, Integer toMap, boolean isMap)
  {
    Map<Integer, String> mapUser = new HashMap();
    StandardDeviceAlarm deviceAlarm = null;
    String[] statusStart = null;
    String[] statusEnd = null;
    String[] handleInfo = null;
    StandardVehicleAlarmInfo vehicleAlarmInfo = new StandardVehicleAlarmInfo();
    vehicleAlarmInfo.setStandardUserService(this.standardUserService);
    vehicleAlarmInfo.setVehicleRuleService(this.vehicleRuleService);
    for (int i = 0; i < deviceAlarms.size(); i++)
    {
      deviceAlarm = (StandardDeviceAlarm)deviceAlarms.get(i);
      statusStart = handleFieldData(deviceAlarm.getStatusStart());
      statusEnd = handleFieldData(deviceAlarm.getStatusEnd());
      handleInfo = handleFieldData(deviceAlarm.getHandleInfo());
      if ((statusStart != null) && (statusStart.length > 0)) {
        deviceAlarm.setStartStatus1(Integer.valueOf(Integer.parseInt(statusStart[0])));
      }
      if ((statusEnd != null) && (statusEnd.length > 0)) {
        deviceAlarm.setEndStatus1(Integer.valueOf(Integer.parseInt(statusEnd[0])));
      }
      if ((statusStart != null) && (statusStart.length > 1)) {
        deviceAlarm.setStartStatus2(Integer.valueOf(Integer.parseInt(statusStart[1])));
      }
      if ((statusEnd != null) && (statusEnd.length > 1)) {
        deviceAlarm.setEndStatus2(Integer.valueOf(Integer.parseInt(statusEnd[1])));
      }
      if ((statusStart != null) && (statusStart.length > 4)) {
        deviceAlarm.setStartSpeed(Integer.valueOf(Integer.parseInt(statusStart[4])));
      }
      if ((statusEnd != null) && (statusEnd.length > 4)) {
        deviceAlarm.setEndSpeed(Integer.valueOf(Integer.parseInt(statusEnd[4])));
      }
      if ((statusStart != null) && (statusStart.length > 9)) {
        deviceAlarm.setStartLiCheng(Integer.valueOf(Integer.parseInt(statusStart[9])));
      }
      if ((statusEnd != null) && (statusEnd.length > 9)) {
        deviceAlarm.setEndLiCheng(Integer.valueOf(Integer.parseInt(statusEnd[9])));
      }
      if ((deviceAlarm.getArmTimeStart() != null) && (deviceAlarm.getArmTimeEnd() != null)) {
        deviceAlarm.setTimeLength(getTimeDifference(deviceAlarm.getArmTimeEnd().getTime() - deviceAlarm.getArmTimeStart().getTime()));
      }
      if (isMap)
      {
        deviceAlarm.setStartPosition(handlePositionEx(statusStart, toMap));
        deviceAlarm.setEndPosition(handlePositionEx(statusEnd, toMap));
      }
      if ((statusStart != null) && (statusStart.length > 6))
      {
        deviceAlarm.setStartJingDu(Integer.valueOf(Integer.parseInt(statusStart[5])));
        deviceAlarm.setStartWeiDu(Integer.valueOf(Integer.parseInt(statusStart[6])));
      }
      if ((statusEnd != null) && (statusEnd.length > 6))
      {
        deviceAlarm.setEndJingDu(Integer.valueOf(Integer.parseInt(statusEnd[5])));
        deviceAlarm.setEndWeiDu(Integer.valueOf(Integer.parseInt(statusEnd[6])));
      }
      if (deviceAlarm.getArmType().intValue() == 113) {
        deviceAlarm.setArmTypeStr(getAlarmInfoName(deviceAlarm.getArmInfo().intValue()));
      } else if (deviceAlarm.getArmType().intValue() == 168) {
        deviceAlarm.setArmTypeStr(getArmInfoName(deviceAlarm.getArmInfo().intValue()));
      } else {
        deviceAlarm.setArmTypeStr(getAlarmTypeName(deviceAlarm.getArmType().intValue()));
      }
      deviceAlarm.setAlarmSource(getAlarmSource(deviceAlarm.getArmType().intValue()));
      if (handleInfo != null)
      {
        if (handleInfo.length > 0) {
          try
          {
            deviceAlarm.setHandleuser(getUserName(mapUser, Integer.valueOf(Integer.parseInt(handleInfo[0]))));
          }
          catch (Exception e)
          {
            deviceAlarm.setHandleuser(handleInfo[0]);
          }
        }
        if (handleInfo.length > 1) {
          deviceAlarm.setHandleTime(handleInfo[1]);
        }
        if (handleInfo.length > 2) {
          deviceAlarm.setHandleContent(handleInfo[2]);
        }
      }
      vehicleAlarmInfo.setAlarm(deviceAlarm);
      deviceAlarm.setArmInfoDesc(vehicleAlarmInfo.getFormatMDVRAlarmString(deviceAlarm.getArmType().intValue()));
    }
    return deviceAlarms;
  }
  
  protected String getAlarmTypeName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 1: 
      ret = getText("report.customAlarm");
      break;
    case 2: 
      ret = getText("report.alarm.urgencybutton");
      break;
    case 200: 
      ret = getText("report.regionalSpeedingAlarm");
      break;
    case 201: 
      ret = getText("report.earlyWarning");
      break;
    case 18: 
      ret = getText("report.singalLoss");
      break;
    case 202: 
      ret = getText("report.GNSSModuleFailure");
      break;
    case 203: 
      ret = getText("report.GNSSAntennaMissedOrCut");
      break;
    case 204: 
      ret = getText("report.GNSSAntennaShort");
      break;
    case 205: 
      ret = getText("report.mainSupplyUndervoltage");
      break;
    case 206: 
      ret = getText("report.mainPowerFailure");
      break;
    case 207: 
      ret = getText("report.LCDorDisplayFailure");
      break;
    case 208: 
      ret = getText("report.TTSModuleFailure");
      break;
    case 209: 
      ret = getText("report.cameraMalfunction");
      break;
    case 210: 
      ret = getText("report.cumulativeDayDrivingTimeout");
      break;
    case 14: 
      ret = getText("report.overtimeParking");
      break;
    case 211: 
      ret = getText("report.outOfRegional");
      break;
    case 212: 
      ret = getText("report.outOfLine");
      break;
    case 213: 
      ret = getText("report.InadequateOrTooLongRoadTravelTime");
      break;
    case 214: 
      ret = getText("report.routeDeviation");
      break;
    case 215: 
      ret = getText("report.VSSFailure");
      break;
    case 216: 
      ret = getText("report.abnormalFuel");
      break;
    case 217: 
      ret = getText("report.antitheftDevice");
      break;
    case 8: 
      ret = getText("report.illegalIgnition");
      break;
    case 218: 
      ret = getText("report.illegalDisplacement");
      break;
    case 219: 
      ret = getText("report.rollover");
      break;
    case 151: 
      ret = getText("report.nightDriving");
      break;
    case 11: 
      ret = getText("report.speed.over");
      break;
    case 300: 
      ret = getText("report.platform.regionalSpeedingAlarm");
      break;
    case 301: 
      ret = getText("report.platform.regionalLowSpeedAlarm");
      break;
    case 302: 
      ret = getText("report.platform.outOfRegional");
      break;
    case 303: 
      ret = getText("report.platform.routeDeviation");
      break;
    case 304: 
      ret = getText("report.platform.timeOverSpeedAlarm");
      break;
    case 305: 
      ret = getText("report.platform.timeLowSpeedAlarm");
      break;
    case 306: 
      ret = getText("report.platform.fatigueDriving");
      break;
    case 307: 
      ret = getText("report.platform.overtimeParking");
      break;
    case 308: 
      ret = getText("report.platform.areaPoint");
      break;
    case 12: 
      ret = getText("report.bounds");
      break;
    case 309: 
      ret = getText("report.platform.lineOverSpeed");
      break;
    case 310: 
      ret = getText("report.platform.lineLowSpeed");
      break;
    case 311: 
      ret = getText("report.platform.roadLvlOverSpeed");
      break;
    case 116: 
      ret = getText("report.driverStatusCollection");
      break;
    case 4: 
      ret = getText("report.alarmvideolost");
      break;
    case 5: 
      ret = getText("report.alarmvideomask");
      break;
    case 15: 
      ret = getText("report.alarmvideomotion");
      break;
    case 19: 
      ret = getText("report.alarm.io1");
      break;
    case 20: 
      ret = getText("report.alarm.io2");
      break;
    case 21: 
      ret = getText("report.alarm.io3");
      break;
    case 22: 
      ret = getText("report.alarm.io4");
      break;
    case 23: 
      ret = getText("report.alarm.io5");
      break;
    case 24: 
      ret = getText("report.alarm.io6");
      break;
    case 25: 
      ret = getText("report.alarm.io7");
      break;
    case 26: 
      ret = getText("report.alarm.io8");
      break;
    case 41: 
      ret = getText("report.alarm.io9");
      break;
    case 42: 
      ret = getText("report.alarm.io10");
      break;
    case 43: 
      ret = getText("report.alarm.io11");
      break;
    case 44: 
      ret = getText("report.alarm.io12");
      break;
    case 16: 
      ret = getText("report.alarm.acc");
      break;
    case 49: 
      ret = getText("report.alarm.fatigue");
    }
    return ret;
  }
  
  protected String getAlarmSource(int type)
  {
    String ret = "";
    switch (type)
    {
    case 1: 
    case 2: 
    case 4: 
    case 5: 
    case 8: 
    case 11: 
    case 12: 
    case 14: 
    case 15: 
    case 16: 
    case 18: 
    case 19: 
    case 20: 
    case 21: 
    case 22: 
    case 23: 
    case 24: 
    case 25: 
    case 26: 
    case 41: 
    case 42: 
    case 43: 
    case 44: 
    case 49: 
    case 151: 
    case 168: 
    case 200: 
    case 201: 
    case 202: 
    case 203: 
    case 204: 
    case 205: 
    case 206: 
    case 207: 
    case 208: 
    case 209: 
    case 210: 
    case 211: 
    case 212: 
    case 213: 
    case 214: 
    case 215: 
    case 216: 
    case 217: 
    case 218: 
    case 219: 
      ret = getText("report.device");
      break;
    case 300: 
    case 301: 
    case 302: 
    case 303: 
    case 304: 
    case 305: 
    case 306: 
    case 307: 
    case 308: 
    case 309: 
    case 310: 
    case 311: 
      ret = getText("report.platform");
    }
    return ret;
  }
  
  protected String getAlarmInfoName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 15: 
      ret = getText("report.practice");
      break;
    case 16: 
      ret = getText("report.informationServices");
      break;
    case 17: 
      ret = getText("report.electronicWaybill");
      break;
    case 18: 
      ret = getText("report.compressedDataReporting");
      break;
    case 20: 
      ret = getText("report.multimediaEventInformation");
    }
    return ret;
  }
  
  protected String getArmInfoName(int type)
  {
    String ret = "";
    switch (type)
    {
    case 1: 
      ret = getText("report.battery.voltage");
      break;
    case 2: 
      ret = getText("report.tire.pressure.abnormal");
      break;
    case 3: 
      ret = getText("report.temperature.anomalies");
    }
    return ret;
  }
  
  protected Integer getNextValiDate(int i, List<StandardDeviceAlarmSummary> lstAlarmSummary, String vehiIdno)
  {
    Integer x = null;
    for (int j = i + 1; j < lstAlarmSummary.size(); j++) {
      if (((StandardDeviceAlarmSummary)lstAlarmSummary.get(j)).getVehiIdno().equals(vehiIdno)) {
        return Integer.valueOf(j);
      }
    }
    return x;
  }
  
  public String getMapPosition(Integer jingDu, Integer weiDu, int mapType, boolean nullToLatLng)
  {
    String position = ReportBaseAction.S_getMapPosition(jingDu, weiDu, mapType, isSessChinese(), getSession().get("WW_TRANS_I18N_LOCALE"));
    if ((nullToLatLng) && (position.isEmpty()) && 
      (jingDu != null) && (weiDu != null) && (jingDu.intValue() != 0) && (weiDu.intValue() != 0)) {
      position = formatPosition(weiDu) + "," + formatPosition(jingDu);
    }
    return position;
  }
  
  protected List<StandardVehiDevRelationExMore> getPlateTypeRelation(String[] vehiIdnos)
  {
    List<String> lstVehiIdno = new ArrayList();
    if ((vehiIdnos != null) && (vehiIdnos.length > 0))
    {
      int i = 0;
      for (int j = vehiIdnos.length; i < j; i++) {
        lstVehiIdno.add(vehiIdnos[i]);
      }
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    return this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, scalars, ", b.PlateType as plateType ", ",jt808_vehicle_info b where a.VehiIDNO = b.VehiIDNO ");
  }
  
  protected Map<String, String> getMapVehiDevRelation(String[] vehiIdnos, String type)
  {
    Map<String, String> mapVehiDev = new HashMap();
    if ((type != null) && (!type.isEmpty()))
    {
      List<String> lstVehiIdno = new ArrayList();
      if ((vehiIdnos != null) && (vehiIdnos.length > 0))
      {
        int i = 0;
        for (int j = vehiIdnos.length; i < j; i++) {
          lstVehiIdno.add(vehiIdnos[i]);
        }
      }
      List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, null, null, null);
      if ((relations != null) && (relations.size() > 0))
      {
        int i = 0;
        for (int j = relations.size(); i < j; i++) {
          if (type.equals("gps"))
          {
            String devIdno = (String)mapVehiDev.get(((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno());
            if ((devIdno != null) && (!devIdno.isEmpty()))
            {
              if ((((StandardVehiDevRelationExMore)relations.get(i)).getModule().intValue() >> 0 & 0x1) <= 0) {
                mapVehiDev.put(((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
              }
            }
            else {
              mapVehiDev.put(((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
            }
          }
          else if (type.equals("people"))
          {
            if ((((StandardVehiDevRelationExMore)relations.get(i)).getModule().intValue() >> 10 & 0x1) > 0) {
              mapVehiDev.put(((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
            }
          }
          else if ((type.equals("oil")) && 
            ((((StandardVehiDevRelationExMore)relations.get(i)).getModule().intValue() >> 7 & 0x1) > 0))
          {
            mapVehiDev.put(((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno());
          }
        }
      }
    }
    return mapVehiDev;
  }
  
  protected String getMapPositionEx(Integer jingDu, Integer weiDu, int mapType, Object locale)
  {
    ReportBaseAction.getGPSToPosition().setToMap(mapType);
    ReportBaseAction.getGPSToPosition().setType(2);
    ReportBaseAction.getGPSToPosition().setParam("formatted_address");
    if (mapType == 2) {
      ReportBaseAction.getGPSToPosition().setCoordtype(3);
    }
    return ReportBaseAction.getGPSToPosition().GPSToPosition(formatPosition(weiDu) + "," + formatPosition(jingDu), locale);
  }
}
