package com.framework.jasperReports;

import com.framework.logger.Logger;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRHtmlExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRRtfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXmlExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.export.SimpleXmlExporterOutput;
import net.sf.jasperreports.web.util.WebHtmlResourceHandler;
import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;

public class ReportPrint
{
  private final transient Logger log = Logger.getLogger(ReportPrint.class);
  private JRExporter exporter = null;
  private JasperReport jasperReport;
  private Map parameters;
  private String reportTitle;
  private Map mapHeads;
  private String format;
  private String documentName;
  private String disposition;
  private String imageServletUrl;
  
  public JasperReport getJasperReport()
  {
    return this.jasperReport;
  }
  
  public void setJasperReport(JasperReport jasperReport)
  {
    this.jasperReport = jasperReport;
  }
  
  public Map getParameters()
  {
    return this.parameters;
  }
  
  public void setParameters(Map parameters)
  {
    if (this.parameters != null) {
      this.parameters.putAll(parameters);
    } else {
      this.parameters = parameters;
    }
  }
  
  public String getFormat()
  {
    return this.format;
  }
  
  public void setFormat(String format)
  {
    this.format = format;
  }
  
  public String getDocumentName()
  {
    return this.documentName;
  }
  
  public void setDocumentName(String documentName)
  {
    this.documentName = documentName;
  }
  
  public String getDisposition()
  {
    return this.disposition;
  }
  
  public void setDisposition(String disposition)
  {
    this.disposition = disposition;
  }
  
  public String getReportTitle()
  {
    return this.reportTitle;
  }
  
  public void setReportTitle(String reportTitle)
  {
    this.reportTitle = reportTitle;
  }
  
  public Map getMapHeads()
  {
    return this.mapHeads;
  }
  
  public void setMapHeads(Map mapHeads)
  {
    this.mapHeads = mapHeads;
  }
  
  public void addMapHeads(String key, Object value)
  {
    if (this.mapHeads == null) {
      this.mapHeads = new HashMap();
    }
    this.mapHeads.put(key, value);
  }
  
  public String getImageServletUrl()
  {
    return this.imageServletUrl;
  }
  
  public void setImageServletUrl(String imageServletUrl)
  {
    this.imageServletUrl = imageServletUrl;
  }
  
  private List listSource = null;
  private Map mapSource = null;
  
  public ReportPrint() {}
  
  public ReportPrint(JasperReport jasperReport, Map parameters)
  {
    this.jasperReport = jasperReport;
    this.parameters = parameters;
  }
  
  public void setDateSource(List source)
  {
    this.listSource = source;
  }
  
  public void addDateSource(Object obj)
  {
    if (this.listSource == null) {
      this.listSource = new ArrayList();
    }
    this.listSource.add(obj);
  }
  
  public void setExportData()
  {
    this.mapSource = new HashMap();
    this.listSource.add(this.mapSource);
  }
  
  public void setCellValue(String key, Object value)
  {
    this.mapSource.put(key, value);
  }
  
  public void exportReport()
    throws Exception
  {
    initParam();
    JRDataSource jrDataSource = new JRBeanCollectionDataSource(this.listSource);
    if (this.reportTitle != null) {
      this.parameters.put("ReportTitle", this.reportTitle);
    }
    if (this.mapHeads != null) {
      this.parameters.putAll(this.mapHeads);
    }
    if (this.imageServletUrl != null) {
      this.parameters.put("imageServletUrl", this.imageServletUrl);
    }
    JasperPrint jasperPrint = JasperFillManager.fillReport(this.jasperReport, this.parameters, jrDataSource);
    if (jasperPrint != null) {
      loadExportReport(jasperPrint);
    }
  }
  
  public void loadExportReport(JasperPrint jasperPrint)
    throws Exception
  {
    HttpServletRequest request = ServletActionContext.getRequest();
    HttpServletResponse response = ServletActionContext.getResponse();
    if ("contype".equals(request.getHeader("User-Agent")))
    {
      try
      {
        response.setContentType("application/pdf");
        response.setContentLength(0);
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.close();
      }
      catch (IOException e)
      {
        this.log.error("Error writing report output: " + e.getMessage());
        throw new ServletException(e.getMessage(), e);
      }
      return;
    }
    byte[] output = null;
    try
    {
      response.reset();
      if ((this.disposition != null) || (this.documentName != null))
      {
        StringBuffer tmp = new StringBuffer();
        tmp.append(this.disposition != null ? this.disposition : "attachment");
        if (this.documentName != null)
        {
          tmp.append("; filename=");
          tmp.append(this.documentName);
          tmp.append(".");
          tmp.append(this.format.toLowerCase());
        }
        response.setHeader("Content-disposition", tmp.toString());
      }
      if (this.format.toLowerCase().equals("pdf"))
      {
        response.setContentType("application/pdf");
        this.exporter = new JRPdfExporter();
      }
      else if (this.format.toLowerCase().equals("csv"))
      {
        response.setContentType("text/csv");
        this.exporter = new JRCsvExporter();
      }
      else if (this.format.toLowerCase().equals("html"))
      {
        response.setContentType("text/html");
        this.exporter = new JRHtmlExporter();
      }
      else if (this.format.toLowerCase().equals("xls"))
      {
        response.setContentType("application/vnd.ms-excel");
        this.exporter = new JRXlsExporter();
      }
      else if (this.format.toLowerCase().equals("xml"))
      {
        response.setContentType("text/xml");
        this.exporter = new JRXmlExporter();
      }
      else if (this.format.toLowerCase().equals("rtf"))
      {
        response.setContentType("application/rtf");
        this.exporter = new JRRtfExporter();
      }
      else
      {
        throw new ServletException("Unknown report format: " + this.format);
      }
      output = exportReportToBytes(jasperPrint);
      response.setContentLength(output.length);
    }
    catch (ServletException e)
    {
      e.printStackTrace();
    }
    catch (JRException e)
    {
      e.printStackTrace();
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    writeReport(response, output);
  }
  
  private byte[] exportReportToBytes(JasperPrint jasperPrint)
    throws JRException
  {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    this.exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
    if (this.format.toLowerCase().equals("pdf"))
    {
      this.exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
    }
    else if (this.format.toLowerCase().equals("csv"))
    {
      this.exporter.setExporterOutput(new SimpleWriterExporterOutput(baos));
    }
    else if (this.format.toLowerCase().equals("html"))
    {
      SimpleHtmlExporterOutput exporterOutput = new SimpleHtmlExporterOutput(baos, "UTF-8");
      exporterOutput.setImageHandler(new WebHtmlResourceHandler("servlets.image?image={0}"));
      this.exporter.setExporterOutput(exporterOutput);
    }
    else if (this.format.toLowerCase().equals("xls"))
    {
      this.exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
      SimpleXlsReportConfiguration xlsReportConfiguration = new SimpleXlsReportConfiguration();
      xlsReportConfiguration.setOnePagePerSheet(Boolean.valueOf(true));
      xlsReportConfiguration.setRemoveEmptySpaceBetweenRows(Boolean.valueOf(false));
      xlsReportConfiguration.setDetectCellType(Boolean.valueOf(true));
      xlsReportConfiguration.setWhitePageBackground(Boolean.valueOf(false));
      this.exporter.setConfiguration(xlsReportConfiguration);
    }
    else if (this.format.toLowerCase().equals("xml"))
    {
      this.exporter.setExporterOutput(new SimpleXmlExporterOutput(baos));
    }
    else if (this.format.toLowerCase().equals("rtf"))
    {
      this.exporter.setExporterOutput(new SimpleWriterExporterOutput(baos));
    }
    this.exporter.exportReport();
    byte[] output = baos.toByteArray();
    return output;
  }
  
  /* Error */
  private void writeReport(HttpServletResponse response, byte[] output)
    throws Exception
  {
    // Byte code:
    //   0: aconst_null
    //   1: astore_3
    //   2: aload_2
    //   3: ifnull +48 -> 51
    //   6: aload_1
    //   7: invokeinterface 189 1 0
    //   12: astore_3
    //   13: aload_3
    //   14: aload_2
    //   15: invokevirtual 406	javax/servlet/ServletOutputStream:write	([B)V
    //   18: aload_3
    //   19: invokevirtual 410	javax/servlet/ServletOutputStream:flush	()V
    //   22: goto +29 -> 51
    //   25: astore 4
    //   27: aload_3
    //   28: ifnull +31 -> 59
    //   31: aload_3
    //   32: invokevirtual 193	javax/servlet/ServletOutputStream:close	()V
    //   35: goto +24 -> 59
    //   38: astore 5
    //   40: aload_3
    //   41: ifnull +7 -> 48
    //   44: aload_3
    //   45: invokevirtual 193	javax/servlet/ServletOutputStream:close	()V
    //   48: aload 5
    //   50: athrow
    //   51: aload_3
    //   52: ifnull +7 -> 59
    //   55: aload_3
    //   56: invokevirtual 193	javax/servlet/ServletOutputStream:close	()V
    //   59: return
    // Line number table:
    //   Java source line #395	-> byte code offset #0
    //   Java source line #397	-> byte code offset #2
    //   Java source line #398	-> byte code offset #6
    //   Java source line #399	-> byte code offset #13
    //   Java source line #400	-> byte code offset #18
    //   Java source line #402	-> byte code offset #22
    //   Java source line #406	-> byte code offset #27
    //   Java source line #407	-> byte code offset #31
    //   Java source line #405	-> byte code offset #38
    //   Java source line #406	-> byte code offset #40
    //   Java source line #407	-> byte code offset #44
    //   Java source line #409	-> byte code offset #48
    //   Java source line #406	-> byte code offset #51
    //   Java source line #407	-> byte code offset #55
    //   Java source line #410	-> byte code offset #59
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	60	0	this	ReportPrint
    //   0	60	1	response	HttpServletResponse
    //   0	60	2	output	byte[]
    //   1	55	3	outputStream	ServletOutputStream
    //   25	1	4	localIOException	IOException
    //   38	11	5	localObject	Object
    // Exception table:
    //   from	to	target	type
    //   2	22	25	java/io/IOException
    //   2	27	38	finally
  }
  
  private void initParam()
  {
    if (StringUtils.isEmpty(this.format)) {
      this.format = "pdf";
    }
    if (StringUtils.isEmpty(this.documentName)) {
      this.documentName = "example";
    }
    if (StringUtils.isEmpty(this.disposition)) {
      this.disposition = "attachment";
    }
    if ((this.imageServletUrl == null) || (this.imageServletUrl.isEmpty())) {
      this.imageServletUrl = "/images/";
    }
  }
}
