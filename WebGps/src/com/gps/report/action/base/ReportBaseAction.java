package com.gps.report.action.base;

import com.framework.listener.MyServletContextListener;
import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.UserBaseAction;
import com.gps.model.UserRole;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.report.vo.DeviceTrack;
import com.gps.report.vo.ReportSummary;
import com.gps.util.GPSToPositionUtils;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ReportBaseAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  protected DeviceGpsService deviceGpsService;
  protected DeviceAlarmService deviceAlarmService;
  private static GPSToPositionUtils GPSToPosition;
  
  public DeviceGpsService getDeviceGpsService()
  {
    return this.deviceGpsService;
  }
  
  public void setDeviceGpsService(DeviceGpsService deviceGpsService)
  {
    this.deviceGpsService = deviceGpsService;
  }
  
  public DeviceAlarmService getDeviceAlarmService()
  {
    return this.deviceAlarmService;
  }
  
  public void setDeviceAlarmService(DeviceAlarmService deviceAlarmService)
  {
    this.deviceAlarmService = deviceAlarmService;
  }
  
  public static GPSToPositionUtils getGPSToPosition()
  {
    if (GPSToPosition == null) {
      if (userService == null) {
        GPSToPosition = new GPSToPositionUtils(MyServletContextListener.getUserService());
      } else {
        GPSToPosition = new GPSToPositionUtils(userService);
      }
    }
    return GPSToPosition;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_NORMAL);
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
  
  protected String getDeviceArmTypeKey(String devIdno, Integer armType)
  {
    return devIdno + "-" + armType;
  }
  
  protected Map<String, DeviceAlarmSummary> listAlarmSummary2mapByDeviceArmTypeKey(List<DeviceAlarmSummary> alarmSummary)
  {
    Map<String, DeviceAlarmSummary> mapSummary = new HashMap();
    for (int i = 0; i < alarmSummary.size(); i++)
    {
      DeviceAlarmSummary summary = (DeviceAlarmSummary)alarmSummary.get(i);
      mapSummary.put(getDeviceArmTypeKey(summary.getDevIdno(), summary.getArmType()), summary);
    }
    return mapSummary;
  }
  
  public void summaryAlarmReport(ReportSummary summary, DeviceAlarmSummary alarmSummary)
  {
    if (alarmSummary != null)
    {
      if ((summary.getBeginTime() == null) || (alarmSummary.getBeginTime().before(summary.getBeginTime())))
      {
        summary.setBeginTime(alarmSummary.getBeginTime());
        summary.setBeginTimeStr(DateUtil.dateSwitchString(alarmSummary.getBeginTime()));
      }
      if ((summary.getEndTime() == null) || (alarmSummary.getEndTime().after(summary.getEndTime())))
      {
        summary.setEndTime(alarmSummary.getEndTime());
        summary.setEndTimeStr(DateUtil.dateSwitchString(alarmSummary.getEndTime()));
      }
      summary.setParam1Sum(alarmSummary.getParam1Sum());
      summary.addCount(alarmSummary.getCount());
    }
    else
    {
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
  
  protected void queryGpsTrack(String distance, String parkTime, Pagination pagination)
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String devIdno = getRequestString("devIdno");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || (devIdno == null) || 
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
        AjaxDto<DeviceTrack> ajaxDto = this.deviceGpsService.queryDeviceGps(devIdno, DateUtil.StrLongTime2Date(begintime), 
          DateUtil.StrLongTime2Date(endtime), meter, park, pagination, toMap);
        
        List<DeviceTrack> tracks = ajaxDto.getPageList();
        if (tracks != null)
        {
          boolean flag;
          if (isGraph())
          {
            if (tracks.size() > 2) {
              for (int i = 1; i < tracks.size() - 2; i++)
              {
                flag = true;
                while ((flag) && (i < tracks.size() - 2))
                {
                  int j = i + 1;
                  if ((((DeviceTrack)tracks.get(i)).getYouLiang() != null) && (
                    (((DeviceTrack)tracks.get(j)).getYouLiang() == null) || 
                    (((DeviceTrack)tracks.get(i)).getYouLiang().intValue() == ((DeviceTrack)tracks.get(j)).getYouLiang().intValue()))) {
                    tracks.remove(j);
                  } else {
                    flag = false;
                  }
                }
              }
            }
          }
          else {
            for (DeviceTrack track : tracks) {
              if (isGpsValid(track.getStatus1()))
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
                track.setPosition(getMapPosition(track.getJingDu(), track.getWeiDu(), mapType));
              }
            }
          }
        }
        addCustomResponse("infos", tracks);
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
  
  protected static String formatPosition(Integer position)
  {
    if (position != null)
    {
      double db = position.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000000");
      return format.format(db / 1000000.0D).replace(',', '.');
    }
    return "";
  }
  
  protected boolean isGpsValid(Integer status1)
  {
    if ((status1.intValue() & 0x1) == 1) {
      return true;
    }
    return false;
  }
  
  protected String getPosition(Integer jingDu, Integer weiDu, Integer status1)
  {
    if ((isGpsValid(status1)) && (jingDu != null) && (weiDu != null)) {
      return formatPosition(jingDu) + "," + formatPosition(weiDu);
    }
    return "";
  }
  
  protected String getSpeed(Integer speed, Integer status1)
  {
    if (isGpsValid(status1))
    {
      double db = speed.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.0");
      return format.format(db / 10.0D);
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
  
  protected String getLiCheng(Integer licheng)
  {
    if ((licheng != null) && (licheng.intValue() >= 0))
    {
      double db = licheng.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000");
      return format.format(db / 1000.0D);
    }
    return "0";
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
  
  protected void genDetailDataEx(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export) {}
  
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genDetailData(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), devIdnos, export);
        
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genDetailDataEx(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), devIdnos, sheet, wb);
        
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
  
  protected void genSummaryDataEx(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export) {}
  
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genSummaryData(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), devIdnos, export);
        
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genSummaryDataEx(begintime, endtime, queryFilter, qtype, sortname, sortorder, Integer.valueOf(toMap), devIdnos, sheet, wb);
        
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
  
  protected void genGpstrackDataEx(String begintime, String endtime, Integer toMap, String devIdno, HSSFSheet sheet, HSSFWorkbook wb) {}
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String devIdno, ExportReport export) {}
  
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genGpstrackData(begintime, endtime, Integer.valueOf(toMap), devIdnos, export);
        
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
        String devIdnos = getRequest().getParameter("devIdnos");
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
        
        genGpstrackDataEx(begintime, endtime, Integer.valueOf(toMap), devIdnos, sheet, wb);
        
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
  
  public static String S_getMapPosition(Integer jingDu, Integer weiDu, int mapType, boolean isChinese, Object locale)
  {
    boolean isGeoAddress = false;
    if (getEnableGeoAddress()) {
      isGeoAddress = true;
    } else if (getEnableGeoByLanguage()) {
      if (isChinese) {
        isGeoAddress = true;
      }
    }
    if (isGeoAddress)
    {
      getGPSToPosition().setToMap(mapType);
      getGPSToPosition().setType(2);
      getGPSToPosition().setParam("formatted_address");
      if (mapType == 2) {
        getGPSToPosition().setCoordtype(3);
      }
      return getGPSToPosition().GPSToPosition(formatPosition(weiDu) + "," + formatPosition(jingDu), locale);
    }
    return formatPosition(weiDu) + "," + formatPosition(jingDu);
  }
  
  public String getMapPosition(Integer jingDu, Integer weiDu, int mapType)
  {
    return S_getMapPosition(jingDu, weiDu, mapType, isSessChinese(), getSession().get("WW_TRANS_I18N_LOCALE"));
  }
}
