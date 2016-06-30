package com.framework.utils;

import com.framework.logger.Logger;
import com.lowagie.text.DocumentException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.ss.usermodel.BuiltinFormats;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.ServletActionContext;

public class ExportReport
{
  public static final int EXPORT_TYPE_EXCEL = 1;
  public static final int EXPORT_TYPE_CSV = 2;
  public static final int EXPORT_TYPE_PDF = 3;
  public static final String EXCEL = "excel";
  public static final String CSV = "csv";
  public static final String PDF = "pdf";
  private final transient Logger log = Logger.getLogger(ExportReport.class);
  private String fileStream = "";
  private Integer exportType;
  private XSSFWorkbook wb;
  private XSSFSheet sheet;
  private List<Map<Object, Object>> lstData;
  private Map<Object, Object> map;
  private XSSFRow xssfRow;
  private String fileName;
  private String[] heads;
  private String title;
  private XSSFCellStyle cellStyle;
  
  public String getFileStream()
  {
    return this.fileStream;
  }
  
  public void setFileStream(String fileStream)
  {
    this.fileStream = fileStream;
  }
  
  private XSSFCellStyle getCellStyle()
  {
    if (this.cellStyle == null) {
      this.cellStyle = this.wb.createCellStyle();
    }
    return this.cellStyle;
  }
  
  public ExportReport(Integer exportType)
  {
    this.exportType = Integer.valueOf(exportType == null ? 1 : exportType.intValue());
  }
  
  public ExportReport(Integer exportType, String title, String[] heads)
    throws IOException, DocumentException
  {
    this.exportType = Integer.valueOf(exportType == null ? 1 : exportType.intValue());
    this.heads = heads;
    this.title = title;
    if (this.exportType.intValue() == 1)
    {
      this.wb = new XSSFWorkbook();
      this.sheet = this.wb.createSheet("sheet1");
      this.fileName = (title + ".xls");
    }
    else
    {
      this.lstData = new ArrayList();
      if (this.exportType.intValue() == 2) {
        this.fileName = (title + ".csv");
      } else if (this.exportType.intValue() == 3) {
        this.fileName = (title + ".pdf");
      }
    }
  }
  
  public void setExportData(Integer index)
  {
    if (this.exportType.intValue() == 1)
    {
      this.xssfRow = this.sheet.createRow(index.intValue());
    }
    else if ((this.exportType.intValue() == 2) || (this.exportType.intValue() == 3))
    {
      this.map = new HashMap();
      this.lstData.add(this.map);
    }
  }
  
  public void setCellValue(Integer index, Object value)
  {
    value = value == null ? "" : value;
    if (this.exportType.intValue() == 1)
    {
      Integer tmp27_26 = index;index = Integer.valueOf(tmp27_26.intValue() + 1);XSSFCell xssfCell = this.xssfRow.createCell(tmp27_26.intValue());
      setValue(xssfCell, value);
    }
    else if ((this.exportType.intValue() == 2) || (this.exportType.intValue() == 3))
    {
      this.map.put(Integer.valueOf(index.intValue() + 1), value);
    }
  }
  
  public void setCellValue(Integer index, Object value, Integer cellType)
  {
    value = value == null ? "" : value;
    if (this.exportType.intValue() == 1)
    {
      Integer tmp27_26 = index;index = Integer.valueOf(tmp27_26.intValue() + 1);XSSFCell xssfCell = this.xssfRow.createCell(tmp27_26.intValue());
      setValue(xssfCell, value);
      if (cellType != null) {
        xssfCell.setCellType(cellType.intValue());
      }
    }
    else if ((this.exportType.intValue() == 2) || (this.exportType.intValue() == 3))
    {
      this.map.put(Integer.valueOf(index.intValue() + 1), value);
    }
  }
  
  public void setCellValue(Integer index, Object value, String style)
  {
    value = value == null ? "" : value;
    if (this.exportType.intValue() == 1)
    {
      Integer tmp27_26 = index;index = Integer.valueOf(tmp27_26.intValue() + 1);XSSFCell xssfCell = this.xssfRow.createCell(tmp27_26.intValue());
      setValue(xssfCell, value);
      if ((style != null) && (!style.isEmpty()))
      {
        getCellStyle().setDataFormat((short) BuiltinFormats.getBuiltinFormat(style));
        xssfCell.setCellStyle(getCellStyle());
      }
    }
    else if ((this.exportType.intValue() == 2) || (this.exportType.intValue() == 3))
    {
      this.map.put(Integer.valueOf(index.intValue() + 1), value);
    }
  }
  
  public void setCellValue(Integer index, Object value, Integer cellType, String style)
  {
    value = value == null ? "" : value;
    if (this.exportType.intValue() == 1)
    {
      Integer tmp27_26 = index;index = Integer.valueOf(tmp27_26.intValue() + 1);XSSFCell xssfCell = this.xssfRow.createCell(tmp27_26.intValue());
      setValue(xssfCell, value);
      if (cellType != null) {
        xssfCell.setCellType(cellType.intValue());
      }
      if ((style != null) && (!style.isEmpty()))
      {
        getCellStyle().setDataFormat((short) BuiltinFormats.getBuiltinFormat(style));
        xssfCell.setCellStyle(getCellStyle());
      }
    }
    else if ((this.exportType.intValue() == 2) || (this.exportType.intValue() == 3))
    {
      this.map.put(Integer.valueOf(index.intValue() + 1), value);
    }
  }
  
  private void setValue(XSSFCell xssfCell, Object param)
  {
    if ((param instanceof Integer))
    {
      Integer value = Integer.valueOf(((Integer)param).intValue());
      xssfCell.setCellValue(value.intValue());
    }
    else if ((param instanceof String))
    {
      String s = (String)param;
      xssfCell.setCellValue(s);
    }
    else if ((param instanceof Double))
    {
      double d = ((Double)param).doubleValue();
      xssfCell.setCellValue(d);
    }
    else if ((param instanceof Float))
    {
      float f = ((Float)param).floatValue();
      xssfCell.setCellValue(f);
    }
    else if ((param instanceof Long))
    {
      long l = ((Long)param).longValue();
      xssfCell.setCellValue(l);
    }
    else if ((param instanceof Boolean))
    {
      boolean b = ((Boolean)param).booleanValue();
      xssfCell.setCellValue(b);
    }
    else if ((param instanceof Date))
    {
      Date d = (Date)param;
      xssfCell.setCellValue(d);
    }
    else if ((param instanceof Calendar))
    {
      Calendar value = (Calendar)param;
      xssfCell.setCellValue(value);
    }
  }
  
  public InputStream createStream()
    throws DocumentException, IOException
  {
    InputStream stream = null;
    if (this.exportType.intValue() == 1) {
      stream = createExcelStream();
    } else if (this.exportType.intValue() == 2) {
      stream = createCSVStream();
    } else if (this.exportType.intValue() == 3) {
      stream = createPdfStream();
    }
    makeFileName();
    return stream;
  }
  
  /* Error */
  private InputStream createCSVStream()
  {
	return null;
    // Byte code:
    //   0: aconst_null
    //   1: astore_1
    //   2: new 292	java/io/ByteArrayOutputStream
    //   5: dup
    //   6: invokespecial 294	java/io/ByteArrayOutputStream:<init>	()V
    //   9: astore_2
    //   10: new 295	java/util/LinkedHashMap
    //   13: dup
    //   14: invokespecial 297	java/util/LinkedHashMap:<init>	()V
    //   17: astore_3
    //   18: iconst_0
    //   19: istore 4
    //   21: goto +35 -> 56
    //   24: aload_0
    //   25: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   28: iload 4
    //   30: aaload
    //   31: ifnull +22 -> 53
    //   34: aload_3
    //   35: iload 4
    //   37: iconst_1
    //   38: iadd
    //   39: invokestatic 91	java/lang/Integer:valueOf	(I)Ljava/lang/Integer;
    //   42: aload_0
    //   43: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   46: iload 4
    //   48: aaload
    //   49: invokevirtual 298	java/util/LinkedHashMap:put	(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    //   52: pop
    //   53: iinc 4 1
    //   56: iload 4
    //   58: aload_0
    //   59: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   62: arraylength
    //   63: if_icmplt -39 -> 24
    //   66: aload_0
    //   67: aconst_null
    //   68: putfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   71: aload_3
    //   72: invokevirtual 299	java/util/LinkedHashMap:entrySet	()Ljava/util/Set;
    //   75: invokeinterface 303 1 0
    //   80: astore 4
    //   82: goto +55 -> 137
    //   85: aload 4
    //   87: invokeinterface 309 1 0
    //   92: checkcast 315	java/util/Map$Entry
    //   95: astore 5
    //   97: aload_2
    //   98: aload 5
    //   100: invokeinterface 317 1 0
    //   105: invokevirtual 320	java/lang/Object:toString	()Ljava/lang/String;
    //   108: invokevirtual 321	java/lang/String:getBytes	()[B
    //   111: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   114: aload 4
    //   116: invokeinterface 329 1 0
    //   121: ifeq +16 -> 137
    //   124: aload_2
    //   125: ldc_w 332
    //   128: invokevirtual 334	java/lang/String:toString	()Ljava/lang/String;
    //   131: invokevirtual 321	java/lang/String:getBytes	()[B
    //   134: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   137: aload 4
    //   139: invokeinterface 329 1 0
    //   144: ifne -59 -> 85
    //   147: aconst_null
    //   148: astore_3
    //   149: aload_2
    //   150: ldc_w 335
    //   153: invokevirtual 334	java/lang/String:toString	()Ljava/lang/String;
    //   156: invokevirtual 321	java/lang/String:getBytes	()[B
    //   159: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   162: aload_0
    //   163: getfield 139	com/framework/utils/ExportReport:lstData	Ljava/util/List;
    //   166: invokeinterface 337 1 0
    //   171: astore 4
    //   173: goto +178 -> 351
    //   176: aload 4
    //   178: invokeinterface 309 1 0
    //   183: checkcast 155	java/util/HashMap
    //   186: astore 5
    //   188: aload 5
    //   190: invokeinterface 338 1 0
    //   195: invokeinterface 303 1 0
    //   200: astore 6
    //   202: goto +116 -> 318
    //   205: aload 6
    //   207: invokeinterface 309 1 0
    //   212: checkcast 315	java/util/Map$Entry
    //   215: astore 7
    //   217: aload 7
    //   219: invokeinterface 317 1 0
    //   224: invokevirtual 320	java/lang/Object:toString	()Ljava/lang/String;
    //   227: ldc_w 332
    //   230: invokevirtual 339	java/lang/String:indexOf	(Ljava/lang/String;)I
    //   233: ifle +45 -> 278
    //   236: aload_2
    //   237: new 116	java/lang/StringBuilder
    //   240: dup
    //   241: ldc_w 342
    //   244: invokespecial 123	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   247: aload 7
    //   249: invokeinterface 317 1 0
    //   254: invokevirtual 320	java/lang/Object:toString	()Ljava/lang/String;
    //   257: invokevirtual 127	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   260: ldc_w 342
    //   263: invokevirtual 127	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   266: invokevirtual 131	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   269: invokevirtual 321	java/lang/String:getBytes	()[B
    //   272: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   275: goto +20 -> 295
    //   278: aload_2
    //   279: aload 7
    //   281: invokeinterface 317 1 0
    //   286: invokevirtual 320	java/lang/Object:toString	()Ljava/lang/String;
    //   289: invokevirtual 321	java/lang/String:getBytes	()[B
    //   292: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   295: aload 6
    //   297: invokeinterface 329 1 0
    //   302: ifeq +16 -> 318
    //   305: aload_2
    //   306: ldc_w 332
    //   309: invokevirtual 334	java/lang/String:toString	()Ljava/lang/String;
    //   312: invokevirtual 321	java/lang/String:getBytes	()[B
    //   315: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   318: aload 6
    //   320: invokeinterface 329 1 0
    //   325: ifne -120 -> 205
    //   328: aload 4
    //   330: invokeinterface 329 1 0
    //   335: ifeq +16 -> 351
    //   338: aload_2
    //   339: ldc_w 335
    //   342: invokevirtual 334	java/lang/String:toString	()Ljava/lang/String;
    //   345: invokevirtual 321	java/lang/String:getBytes	()[B
    //   348: invokevirtual 325	java/io/ByteArrayOutputStream:write	([B)V
    //   351: aload 4
    //   353: invokeinterface 329 1 0
    //   358: ifne -182 -> 176
    //   361: aload_0
    //   362: aconst_null
    //   363: putfield 139	com/framework/utils/ExportReport:lstData	Ljava/util/List;
    //   366: aload_2
    //   367: invokevirtual 344	java/io/ByteArrayOutputStream:flush	()V
    //   370: goto +103 -> 473
    //   373: astore_3
    //   374: aload_3
    //   375: invokevirtual 347	java/lang/Exception:printStackTrace	()V
    //   378: aload_0
    //   379: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   382: aload_3
    //   383: invokevirtual 352	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   386: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   389: new 359	java/io/ByteArrayInputStream
    //   392: dup
    //   393: aload_2
    //   394: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   397: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   400: astore_1
    //   401: aload_2
    //   402: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   405: goto +106 -> 511
    //   408: astore 9
    //   410: aload 9
    //   412: invokevirtual 347	java/lang/Exception:printStackTrace	()V
    //   415: aload_0
    //   416: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   419: aload 9
    //   421: invokevirtual 352	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   424: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   427: goto +84 -> 511
    //   430: astore 8
    //   432: new 359	java/io/ByteArrayInputStream
    //   435: dup
    //   436: aload_2
    //   437: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   440: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   443: astore_1
    //   444: aload_2
    //   445: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   448: goto +22 -> 470
    //   451: astore 9
    //   453: aload 9
    //   455: invokevirtual 347	java/lang/Exception:printStackTrace	()V
    //   458: aload_0
    //   459: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   462: aload 9
    //   464: invokevirtual 352	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   467: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   470: aload 8
    //   472: athrow
    //   473: new 359	java/io/ByteArrayInputStream
    //   476: dup
    //   477: aload_2
    //   478: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   481: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   484: astore_1
    //   485: aload_2
    //   486: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   489: goto +22 -> 511
    //   492: astore 9
    //   494: aload 9
    //   496: invokevirtual 347	java/lang/Exception:printStackTrace	()V
    //   499: aload_0
    //   500: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   503: aload 9
    //   505: invokevirtual 352	java/lang/Exception:getMessage	()Ljava/lang/String;
    //   508: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   511: aload_1
    //   512: areturn
    // Line number table:
    //   Java source line #253	-> byte code offset #0
    //   Java source line #254	-> byte code offset #2
    //   Java source line #257	-> byte code offset #10
    //   Java source line #258	-> byte code offset #18
    //   Java source line #259	-> byte code offset #24
    //   Java source line #260	-> byte code offset #34
    //   Java source line #258	-> byte code offset #53
    //   Java source line #263	-> byte code offset #66
    //   Java source line #265	-> byte code offset #71
    //   Java source line #266	-> byte code offset #85
    //   Java source line #267	-> byte code offset #97
    //   Java source line #268	-> byte code offset #114
    //   Java source line #269	-> byte code offset #124
    //   Java source line #265	-> byte code offset #137
    //   Java source line #272	-> byte code offset #147
    //   Java source line #273	-> byte code offset #149
    //   Java source line #275	-> byte code offset #162
    //   Java source line #276	-> byte code offset #176
    //   Java source line #277	-> byte code offset #188
    //   Java source line #278	-> byte code offset #205
    //   Java source line #279	-> byte code offset #217
    //   Java source line #280	-> byte code offset #236
    //   Java source line #281	-> byte code offset #275
    //   Java source line #282	-> byte code offset #278
    //   Java source line #284	-> byte code offset #295
    //   Java source line #285	-> byte code offset #305
    //   Java source line #277	-> byte code offset #318
    //   Java source line #288	-> byte code offset #328
    //   Java source line #289	-> byte code offset #338
    //   Java source line #275	-> byte code offset #351
    //   Java source line #292	-> byte code offset #361
    //   Java source line #293	-> byte code offset #366
    //   Java source line #294	-> byte code offset #370
    //   Java source line #295	-> byte code offset #374
    //   Java source line #296	-> byte code offset #378
    //   Java source line #299	-> byte code offset #389
    //   Java source line #300	-> byte code offset #401
    //   Java source line #301	-> byte code offset #405
    //   Java source line #302	-> byte code offset #410
    //   Java source line #303	-> byte code offset #415
    //   Java source line #297	-> byte code offset #430
    //   Java source line #299	-> byte code offset #432
    //   Java source line #300	-> byte code offset #444
    //   Java source line #301	-> byte code offset #448
    //   Java source line #302	-> byte code offset #453
    //   Java source line #303	-> byte code offset #458
    //   Java source line #305	-> byte code offset #470
    //   Java source line #299	-> byte code offset #473
    //   Java source line #300	-> byte code offset #485
    //   Java source line #301	-> byte code offset #489
    //   Java source line #302	-> byte code offset #494
    //   Java source line #303	-> byte code offset #499
    //   Java source line #306	-> byte code offset #511
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	513	0	this	ExportReport
    //   1	511	1	stream	InputStream
    //   9	477	2	os	ByteArrayOutputStream
    //   17	132	3	headMap	java.util.LinkedHashMap<Object, Object>
    //   373	10	3	e	Exception
    //   19	38	4	i	int
    //   80	58	4	propertyIterator	java.util.Iterator<java.util.Map.Entry<Object, Object>>
    //   171	181	4	iterator	java.util.Iterator<Map<Object, Object>>
    //   95	4	5	propertyEntry	java.util.Map.Entry<Object, Object>
    //   186	3	5	row	Map<Object, Object>
    //   200	119	6	propertyIterator	java.util.Iterator<java.util.Map.Entry<Object, Object>>
    //   215	65	7	propertyEntry	java.util.Map.Entry<Object, Object>
    //   430	41	8	localObject	Object
    //   408	12	9	e	Exception
    //   451	12	9	e	Exception
    //   492	12	9	e	Exception
    // Exception table:
    //   from	to	target	type
    //   10	370	373	java/lang/Exception
    //   389	405	408	java/lang/Exception
    //   10	389	430	finally
    //   432	448	451	java/lang/Exception
    //   473	489	492	java/lang/Exception
  }
  
  /* Error */
  private InputStream createPdfStream()
  {
	return null;
    // Byte code:
    //   0: aconst_null
    //   1: astore_1
    //   2: new 388	com/lowagie/text/Document
    //   5: dup
    //   6: invokespecial 390	com/lowagie/text/Document:<init>	()V
    //   9: astore_2
    //   10: aconst_null
    //   11: astore_3
    //   12: ldc_w 391
    //   15: aconst_null
    //   16: invokestatic 393	java/io/File:createTempFile	(Ljava/lang/String;Ljava/lang/String;)Ljava/io/File;
    //   19: astore_3
    //   20: aload_2
    //   21: new 399	java/io/FileOutputStream
    //   24: dup
    //   25: aload_3
    //   26: invokespecial 401	java/io/FileOutputStream:<init>	(Ljava/io/File;)V
    //   29: invokestatic 404	com/lowagie/text/pdf/PdfWriter:getInstance	(Lcom/lowagie/text/Document;Ljava/io/OutputStream;)Lcom/lowagie/text/pdf/PdfWriter;
    //   32: pop
    //   33: aload_2
    //   34: invokevirtual 410	com/lowagie/text/Document:open	()V
    //   37: aload_0
    //   38: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   41: arraylength
    //   42: istore 4
    //   44: aload_0
    //   45: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   48: dup
    //   49: astore 8
    //   51: arraylength
    //   52: istore 7
    //   54: iconst_0
    //   55: istore 6
    //   57: goto +21 -> 78
    //   60: aload 8
    //   62: iload 6
    //   64: aaload
    //   65: astore 5
    //   67: aload 5
    //   69: ifnonnull +6 -> 75
    //   72: iinc 4 -1
    //   75: iinc 6 1
    //   78: iload 6
    //   80: iload 7
    //   82: if_icmplt -22 -> 60
    //   85: new 413	com/lowagie/text/pdf/PdfPTable
    //   88: dup
    //   89: iload 4
    //   91: invokespecial 415	com/lowagie/text/pdf/PdfPTable:<init>	(I)V
    //   94: astore 5
    //   96: aload 5
    //   98: ldc_w 417
    //   101: invokevirtual 418	com/lowagie/text/pdf/PdfPTable:setTotalWidth	(F)V
    //   104: aload 5
    //   106: iconst_0
    //   107: invokevirtual 422	com/lowagie/text/pdf/PdfPTable:setLockedWidth	(Z)V
    //   110: invokestatic 425	com/opensymphony/xwork2/ActionContext:getContext	()Lcom/opensymphony/xwork2/ActionContext;
    //   113: invokevirtual 431	com/opensymphony/xwork2/ActionContext:getSession	()Ljava/util/Map;
    //   116: ldc_w 435
    //   119: invokeinterface 437 2 0
    //   124: getstatic 441	java/util/Locale:CHINA	Ljava/util/Locale;
    //   127: invokevirtual 447	java/lang/Object:equals	(Ljava/lang/Object;)Z
    //   130: ifeq +18 -> 148
    //   133: ldc_w 450
    //   136: ldc_w 452
    //   139: iconst_0
    //   140: invokestatic 454	com/lowagie/text/pdf/BaseFont:createFont	(Ljava/lang/String;Ljava/lang/String;Z)Lcom/lowagie/text/pdf/BaseFont;
    //   143: astore 6
    //   145: goto +15 -> 160
    //   148: ldc_w 460
    //   151: ldc_w 462
    //   154: iconst_0
    //   155: invokestatic 454	com/lowagie/text/pdf/BaseFont:createFont	(Ljava/lang/String;Ljava/lang/String;Z)Lcom/lowagie/text/pdf/BaseFont;
    //   158: astore 6
    //   160: new 464	com/lowagie/text/Font
    //   163: dup
    //   164: aload 6
    //   166: invokespecial 466	com/lowagie/text/Font:<init>	(Lcom/lowagie/text/pdf/BaseFont;)V
    //   169: astore 7
    //   171: aload 7
    //   173: ldc_w 469
    //   176: invokevirtual 470	com/lowagie/text/Font:setSize	(F)V
    //   179: aload 7
    //   181: iconst_1
    //   182: invokevirtual 473	com/lowagie/text/Font:setStyle	(I)V
    //   185: new 464	com/lowagie/text/Font
    //   188: dup
    //   189: aload 6
    //   191: invokespecial 466	com/lowagie/text/Font:<init>	(Lcom/lowagie/text/pdf/BaseFont;)V
    //   194: astore 8
    //   196: aload 8
    //   198: ldc_w 469
    //   201: invokevirtual 470	com/lowagie/text/Font:setSize	(F)V
    //   204: aload 8
    //   206: iconst_0
    //   207: invokevirtual 473	com/lowagie/text/Font:setStyle	(I)V
    //   210: aconst_null
    //   211: astore 6
    //   213: aload 5
    //   215: iconst_5
    //   216: invokevirtual 476	com/lowagie/text/pdf/PdfPTable:setHorizontalAlignment	(I)V
    //   219: iconst_0
    //   220: istore 9
    //   222: goto +40 -> 262
    //   225: aload_0
    //   226: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   229: iload 9
    //   231: aaload
    //   232: ifnull +27 -> 259
    //   235: aload 5
    //   237: new 479	com/lowagie/text/Paragraph
    //   240: dup
    //   241: aload_0
    //   242: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   245: iload 9
    //   247: aaload
    //   248: invokevirtual 334	java/lang/String:toString	()Ljava/lang/String;
    //   251: aload 7
    //   253: invokespecial 481	com/lowagie/text/Paragraph:<init>	(Ljava/lang/String;Lcom/lowagie/text/Font;)V
    //   256: invokevirtual 484	com/lowagie/text/pdf/PdfPTable:addCell	(Lcom/lowagie/text/Phrase;)V
    //   259: iinc 9 1
    //   262: iload 9
    //   264: aload_0
    //   265: getfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   268: arraylength
    //   269: if_icmplt -44 -> 225
    //   272: aconst_null
    //   273: astore 7
    //   275: aload_0
    //   276: aconst_null
    //   277: putfield 103	com/framework/utils/ExportReport:heads	[Ljava/lang/String;
    //   280: aload_0
    //   281: getfield 139	com/framework/utils/ExportReport:lstData	Ljava/util/List;
    //   284: invokeinterface 337 1 0
    //   289: astore 9
    //   291: goto +93 -> 384
    //   294: aload 9
    //   296: invokeinterface 309 1 0
    //   301: checkcast 155	java/util/HashMap
    //   304: astore 10
    //   306: aload 10
    //   308: invokeinterface 338 1 0
    //   313: invokeinterface 303 1 0
    //   318: astore 11
    //   320: goto +39 -> 359
    //   323: aload 11
    //   325: invokeinterface 309 1 0
    //   330: checkcast 315	java/util/Map$Entry
    //   333: astore 12
    //   335: aload 5
    //   337: new 479	com/lowagie/text/Paragraph
    //   340: dup
    //   341: aload 12
    //   343: invokeinterface 317 1 0
    //   348: invokevirtual 320	java/lang/Object:toString	()Ljava/lang/String;
    //   351: aload 8
    //   353: invokespecial 481	com/lowagie/text/Paragraph:<init>	(Ljava/lang/String;Lcom/lowagie/text/Font;)V
    //   356: invokevirtual 484	com/lowagie/text/pdf/PdfPTable:addCell	(Lcom/lowagie/text/Phrase;)V
    //   359: aload 11
    //   361: invokeinterface 329 1 0
    //   366: ifne -43 -> 323
    //   369: aload 9
    //   371: invokeinterface 329 1 0
    //   376: ifeq +8 -> 384
    //   379: aload 5
    //   381: invokevirtual 488	com/lowagie/text/pdf/PdfPTable:completeRow	()V
    //   384: aload 9
    //   386: invokeinterface 329 1 0
    //   391: ifne -97 -> 294
    //   394: aconst_null
    //   395: astore 8
    //   397: aload_0
    //   398: aconst_null
    //   399: putfield 139	com/framework/utils/ExportReport:lstData	Ljava/util/List;
    //   402: aload_2
    //   403: aload 5
    //   405: invokevirtual 491	com/lowagie/text/Document:add	(Lcom/lowagie/text/Element;)Z
    //   408: pop
    //   409: aconst_null
    //   410: astore 5
    //   412: goto +445 -> 857
    //   415: astore 4
    //   417: aload 4
    //   419: invokevirtual 494	com/lowagie/text/DocumentException:printStackTrace	()V
    //   422: aload_0
    //   423: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   426: aload 4
    //   428: invokevirtual 495	com/lowagie/text/DocumentException:getMessage	()Ljava/lang/String;
    //   431: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   434: aload_2
    //   435: invokevirtual 496	com/lowagie/text/Document:isOpen	()Z
    //   438: ifeq +7 -> 445
    //   441: aload_2
    //   442: invokevirtual 499	com/lowagie/text/Document:close	()V
    //   445: new 500	java/io/FileInputStream
    //   448: dup
    //   449: aload_3
    //   450: invokespecial 502	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   453: astore 14
    //   455: new 292	java/io/ByteArrayOutputStream
    //   458: dup
    //   459: invokespecial 294	java/io/ByteArrayOutputStream:<init>	()V
    //   462: astore 15
    //   464: goto +10 -> 474
    //   467: aload 15
    //   469: iload 16
    //   471: invokevirtual 503	java/io/ByteArrayOutputStream:write	(I)V
    //   474: aload 14
    //   476: invokevirtual 505	java/io/FileInputStream:read	()I
    //   479: dup
    //   480: istore 16
    //   482: iconst_m1
    //   483: if_icmpne -16 -> 467
    //   486: aload 14
    //   488: invokevirtual 508	java/io/FileInputStream:close	()V
    //   491: aload 15
    //   493: invokevirtual 344	java/io/ByteArrayOutputStream:flush	()V
    //   496: goto +10 -> 506
    //   499: astore 17
    //   501: aload 17
    //   503: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   506: aload 15
    //   508: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   511: astore 17
    //   513: aload 15
    //   515: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   518: goto +10 -> 528
    //   521: astore 18
    //   523: aload 18
    //   525: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   528: new 359	java/io/ByteArrayInputStream
    //   531: dup
    //   532: aload 17
    //   534: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   537: astore_1
    //   538: aload_3
    //   539: invokevirtual 510	java/io/File:delete	()Z
    //   542: pop
    //   543: goto +445 -> 988
    //   546: astore 14
    //   548: aload 14
    //   550: invokevirtual 513	java/io/FileNotFoundException:printStackTrace	()V
    //   553: aload_0
    //   554: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   557: aload 14
    //   559: invokevirtual 516	java/io/FileNotFoundException:getMessage	()Ljava/lang/String;
    //   562: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   565: goto +423 -> 988
    //   568: astore 4
    //   570: aload 4
    //   572: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   575: aload_0
    //   576: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   579: aload 4
    //   581: invokevirtual 517	java/io/IOException:getMessage	()Ljava/lang/String;
    //   584: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   587: aload_2
    //   588: invokevirtual 496	com/lowagie/text/Document:isOpen	()Z
    //   591: ifeq +7 -> 598
    //   594: aload_2
    //   595: invokevirtual 499	com/lowagie/text/Document:close	()V
    //   598: new 500	java/io/FileInputStream
    //   601: dup
    //   602: aload_3
    //   603: invokespecial 502	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   606: astore 14
    //   608: new 292	java/io/ByteArrayOutputStream
    //   611: dup
    //   612: invokespecial 294	java/io/ByteArrayOutputStream:<init>	()V
    //   615: astore 15
    //   617: goto +10 -> 627
    //   620: aload 15
    //   622: iload 16
    //   624: invokevirtual 503	java/io/ByteArrayOutputStream:write	(I)V
    //   627: aload 14
    //   629: invokevirtual 505	java/io/FileInputStream:read	()I
    //   632: dup
    //   633: istore 16
    //   635: iconst_m1
    //   636: if_icmpne -16 -> 620
    //   639: aload 14
    //   641: invokevirtual 508	java/io/FileInputStream:close	()V
    //   644: aload 15
    //   646: invokevirtual 344	java/io/ByteArrayOutputStream:flush	()V
    //   649: goto +10 -> 659
    //   652: astore 17
    //   654: aload 17
    //   656: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   659: aload 15
    //   661: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   664: astore 17
    //   666: aload 15
    //   668: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   671: goto +10 -> 681
    //   674: astore 18
    //   676: aload 18
    //   678: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   681: new 359	java/io/ByteArrayInputStream
    //   684: dup
    //   685: aload 17
    //   687: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   690: astore_1
    //   691: aload_3
    //   692: invokevirtual 510	java/io/File:delete	()Z
    //   695: pop
    //   696: goto +292 -> 988
    //   699: astore 14
    //   701: aload 14
    //   703: invokevirtual 513	java/io/FileNotFoundException:printStackTrace	()V
    //   706: aload_0
    //   707: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   710: aload 14
    //   712: invokevirtual 516	java/io/FileNotFoundException:getMessage	()Ljava/lang/String;
    //   715: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   718: goto +270 -> 988
    //   721: astore 13
    //   723: aload_2
    //   724: invokevirtual 496	com/lowagie/text/Document:isOpen	()Z
    //   727: ifeq +7 -> 734
    //   730: aload_2
    //   731: invokevirtual 499	com/lowagie/text/Document:close	()V
    //   734: new 500	java/io/FileInputStream
    //   737: dup
    //   738: aload_3
    //   739: invokespecial 502	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   742: astore 14
    //   744: new 292	java/io/ByteArrayOutputStream
    //   747: dup
    //   748: invokespecial 294	java/io/ByteArrayOutputStream:<init>	()V
    //   751: astore 15
    //   753: goto +10 -> 763
    //   756: aload 15
    //   758: iload 16
    //   760: invokevirtual 503	java/io/ByteArrayOutputStream:write	(I)V
    //   763: aload 14
    //   765: invokevirtual 505	java/io/FileInputStream:read	()I
    //   768: dup
    //   769: istore 16
    //   771: iconst_m1
    //   772: if_icmpne -16 -> 756
    //   775: aload 14
    //   777: invokevirtual 508	java/io/FileInputStream:close	()V
    //   780: aload 15
    //   782: invokevirtual 344	java/io/ByteArrayOutputStream:flush	()V
    //   785: goto +10 -> 795
    //   788: astore 17
    //   790: aload 17
    //   792: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   795: aload 15
    //   797: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   800: astore 17
    //   802: aload 15
    //   804: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   807: goto +10 -> 817
    //   810: astore 18
    //   812: aload 18
    //   814: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   817: new 359	java/io/ByteArrayInputStream
    //   820: dup
    //   821: aload 17
    //   823: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   826: astore_1
    //   827: aload_3
    //   828: invokevirtual 510	java/io/File:delete	()Z
    //   831: pop
    //   832: goto +22 -> 854
    //   835: astore 14
    //   837: aload 14
    //   839: invokevirtual 513	java/io/FileNotFoundException:printStackTrace	()V
    //   842: aload_0
    //   843: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   846: aload 14
    //   848: invokevirtual 516	java/io/FileNotFoundException:getMessage	()Ljava/lang/String;
    //   851: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   854: aload 13
    //   856: athrow
    //   857: aload_2
    //   858: invokevirtual 496	com/lowagie/text/Document:isOpen	()Z
    //   861: ifeq +7 -> 868
    //   864: aload_2
    //   865: invokevirtual 499	com/lowagie/text/Document:close	()V
    //   868: new 500	java/io/FileInputStream
    //   871: dup
    //   872: aload_3
    //   873: invokespecial 502	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   876: astore 14
    //   878: new 292	java/io/ByteArrayOutputStream
    //   881: dup
    //   882: invokespecial 294	java/io/ByteArrayOutputStream:<init>	()V
    //   885: astore 15
    //   887: goto +10 -> 897
    //   890: aload 15
    //   892: iload 16
    //   894: invokevirtual 503	java/io/ByteArrayOutputStream:write	(I)V
    //   897: aload 14
    //   899: invokevirtual 505	java/io/FileInputStream:read	()I
    //   902: dup
    //   903: istore 16
    //   905: iconst_m1
    //   906: if_icmpne -16 -> 890
    //   909: aload 14
    //   911: invokevirtual 508	java/io/FileInputStream:close	()V
    //   914: aload 15
    //   916: invokevirtual 344	java/io/ByteArrayOutputStream:flush	()V
    //   919: goto +10 -> 929
    //   922: astore 17
    //   924: aload 17
    //   926: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   929: aload 15
    //   931: invokevirtual 361	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   934: astore 17
    //   936: aload 15
    //   938: invokevirtual 366	java/io/ByteArrayOutputStream:close	()V
    //   941: goto +10 -> 951
    //   944: astore 18
    //   946: aload 18
    //   948: invokevirtual 509	java/io/IOException:printStackTrace	()V
    //   951: new 359	java/io/ByteArrayInputStream
    //   954: dup
    //   955: aload 17
    //   957: invokespecial 364	java/io/ByteArrayInputStream:<init>	([B)V
    //   960: astore_1
    //   961: aload_3
    //   962: invokevirtual 510	java/io/File:delete	()Z
    //   965: pop
    //   966: goto +22 -> 988
    //   969: astore 14
    //   971: aload 14
    //   973: invokevirtual 513	java/io/FileNotFoundException:printStackTrace	()V
    //   976: aload_0
    //   977: getfield 81	com/framework/utils/ExportReport:log	Lcom/framework/logger/Logger;
    //   980: aload 14
    //   982: invokevirtual 516	java/io/FileNotFoundException:getMessage	()Ljava/lang/String;
    //   985: invokevirtual 355	com/framework/logger/Logger:error	(Ljava/lang/Object;)V
    //   988: aload_1
    //   989: areturn
    // Line number table:
    //   Java source line #314	-> byte code offset #0
    //   Java source line #315	-> byte code offset #2
    //   Java source line #316	-> byte code offset #10
    //   Java source line #318	-> byte code offset #12
    //   Java source line #319	-> byte code offset #20
    //   Java source line #320	-> byte code offset #33
    //   Java source line #321	-> byte code offset #37
    //   Java source line #322	-> byte code offset #44
    //   Java source line #323	-> byte code offset #67
    //   Java source line #324	-> byte code offset #72
    //   Java source line #322	-> byte code offset #75
    //   Java source line #327	-> byte code offset #85
    //   Java source line #329	-> byte code offset #96
    //   Java source line #331	-> byte code offset #104
    //   Java source line #334	-> byte code offset #110
    //   Java source line #335	-> byte code offset #133
    //   Java source line #336	-> byte code offset #145
    //   Java source line #337	-> byte code offset #148
    //   Java source line #339	-> byte code offset #160
    //   Java source line #341	-> byte code offset #171
    //   Java source line #343	-> byte code offset #179
    //   Java source line #344	-> byte code offset #185
    //   Java source line #345	-> byte code offset #196
    //   Java source line #346	-> byte code offset #204
    //   Java source line #347	-> byte code offset #210
    //   Java source line #349	-> byte code offset #213
    //   Java source line #351	-> byte code offset #219
    //   Java source line #352	-> byte code offset #225
    //   Java source line #353	-> byte code offset #235
    //   Java source line #351	-> byte code offset #259
    //   Java source line #356	-> byte code offset #272
    //   Java source line #357	-> byte code offset #275
    //   Java source line #358	-> byte code offset #280
    //   Java source line #359	-> byte code offset #294
    //   Java source line #360	-> byte code offset #306
    //   Java source line #361	-> byte code offset #323
    //   Java source line #362	-> byte code offset #335
    //   Java source line #360	-> byte code offset #359
    //   Java source line #364	-> byte code offset #369
    //   Java source line #365	-> byte code offset #379
    //   Java source line #358	-> byte code offset #384
    //   Java source line #368	-> byte code offset #394
    //   Java source line #369	-> byte code offset #397
    //   Java source line #370	-> byte code offset #402
    //   Java source line #371	-> byte code offset #409
    //   Java source line #372	-> byte code offset #412
    //   Java source line #373	-> byte code offset #417
    //   Java source line #374	-> byte code offset #422
    //   Java source line #379	-> byte code offset #434
    //   Java source line #380	-> byte code offset #441
    //   Java source line #383	-> byte code offset #445
    //   Java source line #384	-> byte code offset #455
    //   Java source line #389	-> byte code offset #464
    //   Java source line #390	-> byte code offset #467
    //   Java source line #389	-> byte code offset #474
    //   Java source line #392	-> byte code offset #486
    //   Java source line #393	-> byte code offset #491
    //   Java source line #394	-> byte code offset #496
    //   Java source line #395	-> byte code offset #501
    //   Java source line #398	-> byte code offset #506
    //   Java source line #400	-> byte code offset #513
    //   Java source line #401	-> byte code offset #518
    //   Java source line #402	-> byte code offset #523
    //   Java source line #404	-> byte code offset #528
    //   Java source line #406	-> byte code offset #538
    //   Java source line #407	-> byte code offset #543
    //   Java source line #408	-> byte code offset #548
    //   Java source line #409	-> byte code offset #553
    //   Java source line #375	-> byte code offset #568
    //   Java source line #376	-> byte code offset #570
    //   Java source line #377	-> byte code offset #575
    //   Java source line #379	-> byte code offset #587
    //   Java source line #380	-> byte code offset #594
    //   Java source line #383	-> byte code offset #598
    //   Java source line #384	-> byte code offset #608
    //   Java source line #389	-> byte code offset #617
    //   Java source line #390	-> byte code offset #620
    //   Java source line #389	-> byte code offset #627
    //   Java source line #392	-> byte code offset #639
    //   Java source line #393	-> byte code offset #644
    //   Java source line #394	-> byte code offset #649
    //   Java source line #395	-> byte code offset #654
    //   Java source line #398	-> byte code offset #659
    //   Java source line #400	-> byte code offset #666
    //   Java source line #401	-> byte code offset #671
    //   Java source line #402	-> byte code offset #676
    //   Java source line #404	-> byte code offset #681
    //   Java source line #406	-> byte code offset #691
    //   Java source line #407	-> byte code offset #696
    //   Java source line #408	-> byte code offset #701
    //   Java source line #409	-> byte code offset #706
    //   Java source line #378	-> byte code offset #721
    //   Java source line #379	-> byte code offset #723
    //   Java source line #380	-> byte code offset #730
    //   Java source line #383	-> byte code offset #734
    //   Java source line #384	-> byte code offset #744
    //   Java source line #389	-> byte code offset #753
    //   Java source line #390	-> byte code offset #756
    //   Java source line #389	-> byte code offset #763
    //   Java source line #392	-> byte code offset #775
    //   Java source line #393	-> byte code offset #780
    //   Java source line #394	-> byte code offset #785
    //   Java source line #395	-> byte code offset #790
    //   Java source line #398	-> byte code offset #795
    //   Java source line #400	-> byte code offset #802
    //   Java source line #401	-> byte code offset #807
    //   Java source line #402	-> byte code offset #812
    //   Java source line #404	-> byte code offset #817
    //   Java source line #406	-> byte code offset #827
    //   Java source line #407	-> byte code offset #832
    //   Java source line #408	-> byte code offset #837
    //   Java source line #409	-> byte code offset #842
    //   Java source line #411	-> byte code offset #854
    //   Java source line #379	-> byte code offset #857
    //   Java source line #380	-> byte code offset #864
    //   Java source line #383	-> byte code offset #868
    //   Java source line #384	-> byte code offset #878
    //   Java source line #389	-> byte code offset #887
    //   Java source line #390	-> byte code offset #890
    //   Java source line #389	-> byte code offset #897
    //   Java source line #392	-> byte code offset #909
    //   Java source line #393	-> byte code offset #914
    //   Java source line #394	-> byte code offset #919
    //   Java source line #395	-> byte code offset #924
    //   Java source line #398	-> byte code offset #929
    //   Java source line #400	-> byte code offset #936
    //   Java source line #401	-> byte code offset #941
    //   Java source line #402	-> byte code offset #946
    //   Java source line #404	-> byte code offset #951
    //   Java source line #406	-> byte code offset #961
    //   Java source line #407	-> byte code offset #966
    //   Java source line #408	-> byte code offset #971
    //   Java source line #409	-> byte code offset #976
    //   Java source line #412	-> byte code offset #988
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	990	0	this	ExportReport
    //   1	988	1	stream	InputStream
    //   9	856	2	document	com.lowagie.text.Document
    //   11	951	3	file	java.io.File
    //   42	48	4	size	int
    //   415	12	4	e	DocumentException
    //   568	12	4	e1	IOException
    //   65	3	5	string	String
    //   94	317	5	table	com.lowagie.text.pdf.PdfPTable
    //   55	28	6	i	int
    //   143	3	6	bfChinese	com.lowagie.text.pdf.BaseFont
    //   158	54	6	bfChinese	com.lowagie.text.pdf.BaseFont
    //   52	31	7	j	int
    //   169	105	7	thfont	com.lowagie.text.Font
    //   49	12	8	arrayOfString	String[]
    //   194	202	8	tdfont	com.lowagie.text.Font
    //   220	43	9	i	int
    //   289	96	9	iterator	java.util.Iterator<Map<Object, Object>>
    //   304	3	10	dqMap	Map<Object, Object>
    //   318	42	11	propertyIterator	java.util.Iterator<java.util.Map.Entry<Object, Object>>
    //   333	9	12	propertyEntry	java.util.Map.Entry<Object, Object>
    //   721	134	13	localObject	Object
    //   453	34	14	in	java.io.FileInputStream
    //   546	12	14	e2	java.io.FileNotFoundException
    //   606	34	14	in	java.io.FileInputStream
    //   699	12	14	e2	java.io.FileNotFoundException
    //   742	34	14	in	java.io.FileInputStream
    //   835	12	14	e2	java.io.FileNotFoundException
    //   876	34	14	in	java.io.FileInputStream
    //   969	12	14	e2	java.io.FileNotFoundException
    //   462	52	15	os	ByteArrayOutputStream
    //   615	52	15	os	ByteArrayOutputStream
    //   751	52	15	os	ByteArrayOutputStream
    //   885	52	15	os	ByteArrayOutputStream
    //   467	3	16	b	int
    //   480	3	16	b	int
    //   620	3	16	b	int
    //   633	3	16	b	int
    //   756	3	16	b	int
    //   769	3	16	b	int
    //   890	3	16	b	int
    //   903	3	16	b	int
    //   499	3	17	e1	IOException
    //   511	22	17	content	byte[]
    //   652	3	17	e1	IOException
    //   664	22	17	content	byte[]
    //   788	3	17	e1	IOException
    //   800	22	17	content	byte[]
    //   922	3	17	e1	IOException
    //   934	22	17	content	byte[]
    //   521	3	18	e	IOException
    //   674	3	18	e	IOException
    //   810	3	18	e	IOException
    //   944	3	18	e	IOException
    // Exception table:
    //   from	to	target	type
    //   12	412	415	com/lowagie/text/DocumentException
    //   464	496	499	java/io/IOException
    //   513	518	521	java/io/IOException
    //   445	543	546	java/io/FileNotFoundException
    //   12	412	568	java/io/IOException
    //   617	649	652	java/io/IOException
    //   666	671	674	java/io/IOException
    //   598	696	699	java/io/FileNotFoundException
    //   12	434	721	finally
    //   568	587	721	finally
    //   753	785	788	java/io/IOException
    //   802	807	810	java/io/IOException
    //   734	832	835	java/io/FileNotFoundException
    //   887	919	922	java/io/IOException
    //   936	941	944	java/io/IOException
    //   868	966	969	java/io/FileNotFoundException
  }
  
  protected InputStream createExcelStream()
  {
    createExcelHead();
    for (int i = 0; i < this.heads.length; i++) {
      this.sheet.autoSizeColumn(i);
    }
    this.heads = null;
    
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    try
    {
      this.wb.write(os);
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    byte[] content = os.toByteArray();
    try
    {
      os.flush();
      os.close();
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    return new ByteArrayInputStream(content);
  }
  
  protected void createExcelHead()
  {
    try
    {
      XSSFRow row = this.sheet.createRow(0);
      XSSFCell cell = row.createCell(0);
      row.setHeight((short)900);
      this.sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (short)(this.heads.length - 1)));
      XSSFCellStyle style = this.wb.createCellStyle();
      style.setAlignment((short)2);
      style.setWrapText(true);
      
      XSSFFont cnFont = this.wb.createFont();
      cnFont.setFontHeightInPoints((short)16);
      cnFont.setFontName("Arial");
      style.setFont(cnFont);
      cell.setCellStyle(style);
      
      cell.setCellValue(this.title);
      
      cnFont = null;
      style = null;
      cell = null;
      row = null;
      row = this.sheet.createRow(1);
      for (int i = 0; i < this.heads.length; i++)
      {
        cell = row.createCell(i);
        style = this.wb.createCellStyle();
        cnFont = this.wb.createFont();
        cnFont.setFontHeightInPoints((short)10);
        cnFont.setFontName("Arial");
        cnFont.setBoldweight((short)700);
        style.setFont(cnFont);
        cell.setCellStyle(style);
        cell.setCellValue(this.heads[i]);
        cnFont = null;
        style = null;
        cell = null;
      }
      row = null;
    }
    catch (Exception ex)
    {
      ex.printStackTrace();
      this.log.error(ex.getMessage());
    }
  }
  
  public InputStream doExcelNoRight(String excelError)
    throws UnsupportedEncodingException
  {
    InputStream stream = new ByteArrayInputStream(new byte[0]);
    if (this.exportType.equals(Integer.valueOf(1))) {
      this.fileName = (excelError + ".xlsx");
    } else if (this.exportType.equals(Integer.valueOf(2))) {
      this.fileName = (excelError + ".csv");
    } else if (this.exportType.equals(Integer.valueOf(3))) {
      this.fileName = (excelError + ".pdf");
    }
    makeFileName();
    return stream;
  }
  
  private void makeFileName()
    throws UnsupportedEncodingException
  {
    String str = ServletActionContext.getRequest().getHeader("USER-AGENT");
    if ((str.indexOf("Firefox") != -1) || (str.indexOf("Safari") != -1))
    {
      this.fileStream = new String(this.fileName.getBytes("utf-8"), "ISO8859-1");
    }
    else if (str.indexOf("MSIE 6.0") != -1)
    {
      String temp = this.fileName.replace(':', '-');
      this.fileStream = URLEncoder.encode(temp, "utf-8").replace('+', '-');
    }
    else
    {
      this.fileStream = toUtf8String(this.fileName);
    }
  }
  
  private String toUtf8String(String s)
  {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < s.length(); i++)
    {
      char c = s.charAt(i);
      if ((c >= 0) && (c <= '?'))
      {
        sb.append(c);
      }
      else
      {
        byte[] b;
        try
        {
          b = Character.toString(c).getBytes("utf-8");
        }
        catch (Exception ex)
        {
//          byte[] b;
          this.log.error(ex.getMessage());
          b = new byte[0];
        }
        for (int j = 0; j < b.length; j++)
        {
          int k = b[j];
          if (k < 0) {
            k += 256;
          }
          sb.append("%" + Integer.toHexString(k).toUpperCase());
        }
      }
    }
    return sb.toString();
  }
  
  public String getResult()
  {
    if (this.exportType.intValue() == 1) {
      return "excel";
    }
    if (this.exportType.intValue() == 2) {
      return "csv";
    }
    if (this.exportType.intValue() == 3) {
      return "pdf";
    }
    return "";
  }
}
