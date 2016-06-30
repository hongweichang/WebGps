package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps808.model.StandardStoDevAvRecord;
import com.gps808.model.StandardStoDevSnapshotRecord;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleMediaService;
import com.gps808.report.vo.StandardDeviceQuery;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;

public class StandardReportMediaAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleMediaService standardVehicleMediaService;
  private ByteArrayInputStream inputStream;
  private FileInputStream fileInputStream;
  
  public StandardVehicleMediaService getStandardVehicleMediaService()
  {
    return this.standardVehicleMediaService;
  }
  
  public void setStandardVehicleMediaService(StandardVehicleMediaService standardVehicleMediaService)
  {
    this.standardVehicleMediaService = standardVehicleMediaService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String photoList()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String fileType = getRequestString("filetype");
      String toMap = getRequestString("toMap");
      if ((fileType == null) || (fileType.equals(""))) {
        fileType = "2";
      }
      StandardDeviceQuery query = new StandardDeviceQuery();
      query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
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
        AjaxDto<StandardStoDevSnapshotRecord> ajaxDto = this.standardVehicleMediaService.queryVehiclePhoto(begintime, endtime, 
          query.getVehiIdnos().split(","), Integer.valueOf(Integer.parseInt(fileType)), getPaginationEx());
        List<StandardStoDevSnapshotRecord> deviceSnapshotRecords = ajaxDto.getPageList();
        if (deviceSnapshotRecords != null) {
          for (int i = 0; i < deviceSnapshotRecords.size(); i++)
          {
            StandardStoDevSnapshotRecord deviceSnapshotRecord = (StandardStoDevSnapshotRecord)deviceSnapshotRecords.get(i);
            String[] status = handleFieldData(deviceSnapshotRecord.getGPSStatus());
            deviceSnapshotRecord.setPosition(handlePosition(status, Integer.valueOf(mapType), true));
            if ((status != null) && (status.length > 5) && (status.length > 6))
            {
              deviceSnapshotRecord.setJingDu(Integer.valueOf(Integer.parseInt(status[5])));
              deviceSnapshotRecord.setWeiDu(Integer.valueOf(Integer.parseInt(status[6])));
            }
            deviceSnapshotRecord.setChannel(Integer.valueOf(deviceSnapshotRecord.getChannel().intValue() + 1));
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  /* Error */
  public String getImage()
  {
	  return "Error";
    // Byte code:
    //   0: aload_0
    //   1: ldc -28
    //   3: invokevirtual 55	com/gps808/report/action/StandardReportMediaAction:getRequestString	(Ljava/lang/String;)Ljava/lang/String;
    //   6: astore_1
    //   7: aload_0
    //   8: ldc -26
    //   10: invokevirtual 55	com/gps808/report/action/StandardReportMediaAction:getRequestString	(Ljava/lang/String;)Ljava/lang/String;
    //   13: invokestatic 111	java/lang/Integer:parseInt	(Ljava/lang/String;)I
    //   16: istore_2
    //   17: aload_0
    //   18: ldc -24
    //   20: invokevirtual 55	com/gps808/report/action/StandardReportMediaAction:getRequestString	(Ljava/lang/String;)Ljava/lang/String;
    //   23: invokestatic 111	java/lang/Integer:parseInt	(Ljava/lang/String;)I
    //   26: istore_3
    //   27: aconst_null
    //   28: astore 4
    //   30: iload_3
    //   31: newarray <illegal type>
    //   33: astore 5
    //   35: new 234	java/io/RandomAccessFile
    //   38: dup
    //   39: aload_1
    //   40: ldc -20
    //   42: invokespecial 238	java/io/RandomAccessFile:<init>	(Ljava/lang/String;Ljava/lang/String;)V
    //   45: astore 6
    //   47: aload 6
    //   49: iload_2
    //   50: i2l
    //   51: invokevirtual 241	java/io/RandomAccessFile:seek	(J)V
    //   54: aload 6
    //   56: aload 5
    //   58: iconst_0
    //   59: iload_3
    //   60: invokevirtual 245	java/io/RandomAccessFile:read	([BII)I
    //   63: pop
    //   64: aload 6
    //   66: invokevirtual 249	java/io/RandomAccessFile:close	()V
    //   69: new 252	java/io/ByteArrayOutputStream
    //   72: dup
    //   73: invokespecial 254	java/io/ByteArrayOutputStream:<init>	()V
    //   76: astore 4
    //   78: aload 4
    //   80: aload 5
    //   82: invokevirtual 255	java/io/ByteArrayOutputStream:write	([B)V
    //   85: bipush 60
    //   87: istore 7
    //   89: bipush 20
    //   91: istore 8
    //   93: new 259	java/awt/image/BufferedImage
    //   96: dup
    //   97: iload 7
    //   99: iload 8
    //   101: iconst_1
    //   102: invokespecial 261	java/awt/image/BufferedImage:<init>	(III)V
    //   105: astore 9
    //   107: aload 4
    //   109: invokestatic 264	javax/imageio/ImageIO:createImageOutputStream	(Ljava/lang/Object;)Ljavax/imageio/stream/ImageOutputStream;
    //   112: astore 10
    //   114: aload 9
    //   116: ldc_w 270
    //   119: aload 10
    //   121: invokestatic 272	javax/imageio/ImageIO:write	(Ljava/awt/image/RenderedImage;Ljava/lang/String;Ljavax/imageio/stream/ImageOutputStream;)Z
    //   124: pop
    //   125: aload 10
    //   127: invokeinterface 275 1 0
    //   132: new 278	java/io/ByteArrayInputStream
    //   135: dup
    //   136: aload 4
    //   138: invokevirtual 280	java/io/ByteArrayOutputStream:toByteArray	()[B
    //   141: invokespecial 284	java/io/ByteArrayInputStream:<init>	([B)V
    //   144: astore 11
    //   146: aload_0
    //   147: aload 11
    //   149: invokevirtual 286	com/gps808/report/action/StandardReportMediaAction:setInputStream	(Ljava/io/ByteArrayInputStream;)V
    //   152: goto +73 -> 225
    //   155: astore 5
    //   157: aload 5
    //   159: invokevirtual 290	java/io/FileNotFoundException:printStackTrace	()V
    //   162: aload 4
    //   164: invokevirtual 295	java/io/ByteArrayOutputStream:close	()V
    //   167: goto +73 -> 240
    //   170: astore 13
    //   172: aload 13
    //   174: invokevirtual 296	java/io/IOException:printStackTrace	()V
    //   177: goto +63 -> 240
    //   180: astore 5
    //   182: aload 5
    //   184: invokevirtual 296	java/io/IOException:printStackTrace	()V
    //   187: aload 4
    //   189: invokevirtual 295	java/io/ByteArrayOutputStream:close	()V
    //   192: goto +48 -> 240
    //   195: astore 13
    //   197: aload 13
    //   199: invokevirtual 296	java/io/IOException:printStackTrace	()V
    //   202: goto +38 -> 240
    //   205: astore 12
    //   207: aload 4
    //   209: invokevirtual 295	java/io/ByteArrayOutputStream:close	()V
    //   212: goto +10 -> 222
    //   215: astore 13
    //   217: aload 13
    //   219: invokevirtual 296	java/io/IOException:printStackTrace	()V
    //   222: aload 12
    //   224: athrow
    //   225: aload 4
    //   227: invokevirtual 295	java/io/ByteArrayOutputStream:close	()V
    //   230: goto +10 -> 240
    //   233: astore 13
    //   235: aload 13
    //   237: invokevirtual 296	java/io/IOException:printStackTrace	()V
    //   240: ldc_w 299
    //   243: areturn
    // Line number table:
    //   Java source line #98	-> byte code offset #0
    //   Java source line #99	-> byte code offset #7
    //   Java source line #100	-> byte code offset #17
    //   Java source line #102	-> byte code offset #27
    //   Java source line #104	-> byte code offset #30
    //   Java source line #106	-> byte code offset #35
    //   Java source line #107	-> byte code offset #47
    //   Java source line #108	-> byte code offset #54
    //   Java source line #109	-> byte code offset #64
    //   Java source line #111	-> byte code offset #69
    //   Java source line #112	-> byte code offset #78
    //   Java source line #114	-> byte code offset #85
    //   Java source line #115	-> byte code offset #93
    //   Java source line #116	-> byte code offset #101
    //   Java source line #115	-> byte code offset #102
    //   Java source line #118	-> byte code offset #107
    //   Java source line #119	-> byte code offset #114
    //   Java source line #120	-> byte code offset #125
    //   Java source line #121	-> byte code offset #132
    //   Java source line #122	-> byte code offset #138
    //   Java source line #121	-> byte code offset #141
    //   Java source line #123	-> byte code offset #146
    //   Java source line #124	-> byte code offset #152
    //   Java source line #125	-> byte code offset #157
    //   Java source line #130	-> byte code offset #162
    //   Java source line #131	-> byte code offset #167
    //   Java source line #132	-> byte code offset #172
    //   Java source line #126	-> byte code offset #180
    //   Java source line #127	-> byte code offset #182
    //   Java source line #130	-> byte code offset #187
    //   Java source line #131	-> byte code offset #192
    //   Java source line #132	-> byte code offset #197
    //   Java source line #128	-> byte code offset #205
    //   Java source line #130	-> byte code offset #207
    //   Java source line #131	-> byte code offset #212
    //   Java source line #132	-> byte code offset #217
    //   Java source line #134	-> byte code offset #222
    //   Java source line #130	-> byte code offset #225
    //   Java source line #131	-> byte code offset #230
    //   Java source line #132	-> byte code offset #235
    //   Java source line #135	-> byte code offset #240
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	244	0	this	StandardReportMediaAction
    //   6	34	1	filePath	String
    //   16	34	2	fileOffset	int
    //   26	34	3	fileSize	int
    //   28	198	4	byteStream	java.io.ByteArrayOutputStream
    //   33	48	5	bytes	byte[]
    //   155	3	5	e	FileNotFoundException
    //   180	3	5	e	java.io.IOException
    //   45	20	6	raf	java.io.RandomAccessFile
    //   87	11	7	width	int
    //   91	9	8	height	int
    //   105	10	9	image	java.awt.image.BufferedImage
    //   112	14	10	imageOut	javax.imageio.stream.ImageOutputStream
    //   144	4	11	input	ByteArrayInputStream
    //   205	18	12	localObject	Object
    //   170	3	13	e	java.io.IOException
    //   195	3	13	e	java.io.IOException
    //   215	3	13	e	java.io.IOException
    //   233	3	13	e	java.io.IOException
    // Exception table:
    //   from	to	target	type
    //   30	152	155	java/io/FileNotFoundException
    //   162	167	170	java/io/IOException
    //   30	152	180	java/io/IOException
    //   187	192	195	java/io/IOException
    //   30	162	205	finally
    //   180	187	205	finally
    //   207	212	215	java/io/IOException
    //   225	230	233	java/io/IOException
  }
  
  public String audioList()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String fileType = getRequestString("filetype");
      if ((fileType == null) || (fileType.equals(""))) {
        fileType = "2";
      }
      StandardDeviceQuery query = new StandardDeviceQuery();
      query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        AjaxDto<StandardStoDevAvRecord> ajaxDto = this.standardVehicleMediaService.queryVehicleAudioOrVideo(begintime, endtime, 
          query.getVehiIdnos().split(","), Integer.valueOf(Integer.parseInt(fileType)), Integer.valueOf(2), Integer.valueOf(1), getPaginationEx());
        List<StandardStoDevAvRecord> deviceSnapshotRecords = ajaxDto.getPageList();
        if (deviceSnapshotRecords != null) {
          for (int i = 0; i < deviceSnapshotRecords.size(); i++)
          {
            StandardStoDevAvRecord deviceSnapshotRecord = (StandardStoDevAvRecord)deviceSnapshotRecords.get(i);
            deviceSnapshotRecord.setChannel(Integer.valueOf(deviceSnapshotRecord.getChannel().intValue() + 1));
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String videoList()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String fileType = getRequestString("filetype");
      if ((fileType == null) || (fileType.equals(""))) {
        fileType = "2";
      }
      StandardDeviceQuery query = new StandardDeviceQuery();
      query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if ((begintime == null) || (endtime == null) || (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        AjaxDto<StandardStoDevAvRecord> ajaxDto = this.standardVehicleMediaService.queryVehicleAudioOrVideo(begintime, endtime, 
          query.getVehiIdnos().split(","), Integer.valueOf(Integer.parseInt(fileType)), Integer.valueOf(1), Integer.valueOf(1), getPaginationEx());
        List<StandardStoDevAvRecord> deviceSnapshotRecords = ajaxDto.getPageList();
        if (deviceSnapshotRecords != null) {
          for (int i = 0; i < deviceSnapshotRecords.size(); i++)
          {
            StandardStoDevAvRecord deviceSnapshotRecord = (StandardStoDevAvRecord)deviceSnapshotRecords.get(i);
            deviceSnapshotRecord.setChannel(Integer.valueOf(deviceSnapshotRecord.getChannel().intValue() + 1));
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getMedia()
  {
    String filePath = getRequestString("filePath");
    try
    {
      File file = new File(filePath);
      FileInputStream input = new FileInputStream(file);
      String[] medias = filePath.split("/");
      this.excelFile = medias[(medias.length - 1)];
      setFileInputStream(input);
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
    }
    return "media";
  }
  
  public ByteArrayInputStream getInputStream()
  {
    return this.inputStream;
  }
  
  public void setInputStream(ByteArrayInputStream inputStream)
  {
    this.inputStream = inputStream;
  }
  
  public FileInputStream getFileInputStream()
  {
    return this.fileInputStream;
  }
  
  public void setFileInputStream(FileInputStream fileInputStream)
  {
    this.fileInputStream = fileInputStream;
  }
}
