package com.framework.jasperReports;

import com.framework.logger.Logger;
import com.opensymphony.xwork2.ActionContext;
import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ConcurrentHashMap;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

public class ReportCreater
{
  private final transient Logger log = Logger.getLogger(ReportCreater.class);
  private String jasperReportPath;
  private String timeZone;
  private Map<String, JasperReport> jasperDesignMap = new ConcurrentHashMap();
  
  public void resetJasperDesignCache()
  {
    this.jasperDesignMap.clear();
  }
  
  public ReportPrint createReport(String reportKey)
    throws IOException
  {
    try
    {
      return _createReport(reportKey);
    }
    catch (JRException e)
    {
      this.log.error(e.getMessage());
      throw new IOException();
    }
  }
  
  private ReportPrint _createReport(String reportKey)
    throws JRException, IOException
  {
    JasperReport jasperReport = getJasperReport(reportKey);
    Map parameters = getParameters_(reportKey);
    ReportPrint reportPrint = new ReportPrint(jasperReport, parameters);
    return reportPrint;
  }
  
  private JasperReport getJasperReport(String reportKey)
    throws IOException, JRException
  {
    JasperReport jasperReport = null;
    if (this.jasperDesignMap.containsKey(reportKey))
    {
      jasperReport = (JasperReport)this.jasperDesignMap.get(reportKey);
    }
    else
    {
      jasperReport = getJasperReportFromFile(reportKey);
      this.jasperDesignMap.put(reportKey, jasperReport);
    }
    return jasperReport;
  }
  
  private JasperReport getJasperReportFromFile(String reportKey)
    throws IOException, JRException
  {
    String filePath = this.jasperReportPath + '\\' + reportKey + ".jasper";
    File reportFile = null;
    JasperReport jasperReport = null;
    
    reportFile = new File(filePath);
    if ((reportFile.exists()) && (reportFile.isFile())) {
      jasperReport = (JasperReport)JRLoader.loadObject(reportFile);
    }
    return jasperReport;
  }
  
  private Map getParameters_(String reportKey)
  {
    Map parameters = new HashMap();
    parameters.put("REPORT_LOCALE", ActionContext.getContext().getLocale());
    if (this.timeZone == null)
    {
      Calendar cal = Calendar.getInstance();
      TimeZone timeZone_ = cal.getTimeZone();
      this.timeZone = timeZone_.getID();
    }
    TimeZone tz = TimeZone.getTimeZone(this.timeZone);
    if (tz != null) {
      parameters.put("REPORT_TIME_ZONE", tz);
    }
    return parameters;
  }
  
  public String getJasperReportPath()
  {
    return this.jasperReportPath;
  }
  
  public void setJasperReportPath(String jasperReportPath)
  {
    this.jasperReportPath = jasperReportPath;
  }
  
  public String getTimeZone()
  {
    return this.timeZone;
  }
  
  public void setTimeZone(String timeZone)
  {
    this.timeZone = timeZone;
  }
}
