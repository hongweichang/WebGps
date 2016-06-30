package com.framework.web.action;

import com.framework.logger.Logger;
import java.io.File;
import java.util.List;

public class FileUploadAction
  extends BaseAction
{
  private String describe;
  private List<File> uploadFile;
  private List<String> uploadFileFileName;
  private List<String> uploadFileContentType;
  
  /* Error */
  public void upload()
  {
    // Byte code:
    //   0: iconst_0
    //   1: istore_1
    //   2: goto +234 -> 236
    //   5: aconst_null
    //   6: astore_2
    //   7: aconst_null
    //   8: astore_3
    //   9: aload_0
    //   10: getfield 24	com/framework/web/action/FileUploadAction:uploadFileFileName	Ljava/util/List;
    //   13: iload_1
    //   14: invokeinterface 26 2 0
    //   19: checkcast 32	java/lang/String
    //   22: astore 4
    //   24: aload 4
    //   26: ldc 34
    //   28: invokevirtual 36	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   31: ifne +176 -> 207
    //   34: new 40	java/io/FileInputStream
    //   37: dup
    //   38: aload_0
    //   39: getfield 42	com/framework/web/action/FileUploadAction:uploadFile	Ljava/util/List;
    //   42: iload_1
    //   43: invokeinterface 26 2 0
    //   48: checkcast 44	java/io/File
    //   51: invokespecial 46	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   54: astore 5
    //   56: new 49	java/io/FileOutputStream
    //   59: dup
    //   60: new 51	java/lang/StringBuilder
    //   63: dup
    //   64: ldc 53
    //   66: invokespecial 55	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   69: aload 4
    //   71: invokevirtual 58	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   74: invokevirtual 62	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   77: invokespecial 66	java/io/FileOutputStream:<init>	(Ljava/lang/String;)V
    //   80: astore 6
    //   82: new 67	java/io/BufferedInputStream
    //   85: dup
    //   86: aload 5
    //   88: invokespecial 69	java/io/BufferedInputStream:<init>	(Ljava/io/InputStream;)V
    //   91: astore_2
    //   92: new 72	java/io/BufferedOutputStream
    //   95: dup
    //   96: aload 6
    //   98: invokespecial 74	java/io/BufferedOutputStream:<init>	(Ljava/io/OutputStream;)V
    //   101: astore_3
    //   102: sipush 1024
    //   105: newarray <illegal type>
    //   107: astore 7
    //   109: iconst_m1
    //   110: istore 8
    //   112: goto +12 -> 124
    //   115: aload_3
    //   116: aload 7
    //   118: iconst_0
    //   119: iload 8
    //   121: invokevirtual 77	java/io/BufferedOutputStream:write	([BII)V
    //   124: aload_2
    //   125: aload 7
    //   127: invokevirtual 81	java/io/BufferedInputStream:read	([B)I
    //   130: dup
    //   131: istore 8
    //   133: iconst_m1
    //   134: if_icmpne -19 -> 115
    //   137: goto +70 -> 207
    //   140: astore 5
    //   142: aload 5
    //   144: invokevirtual 85	java/lang/Exception:printStackTrace	()V
    //   147: aload_2
    //   148: ifnull +7 -> 155
    //   151: aload_2
    //   152: invokevirtual 90	java/io/BufferedInputStream:close	()V
    //   155: aload_3
    //   156: ifnull +77 -> 233
    //   159: aload_3
    //   160: invokevirtual 93	java/io/BufferedOutputStream:close	()V
    //   163: goto +70 -> 233
    //   166: astore 10
    //   168: aload 10
    //   170: invokevirtual 94	java/io/IOException:printStackTrace	()V
    //   173: goto +60 -> 233
    //   176: astore 9
    //   178: aload_2
    //   179: ifnull +7 -> 186
    //   182: aload_2
    //   183: invokevirtual 90	java/io/BufferedInputStream:close	()V
    //   186: aload_3
    //   187: ifnull +17 -> 204
    //   190: aload_3
    //   191: invokevirtual 93	java/io/BufferedOutputStream:close	()V
    //   194: goto +10 -> 204
    //   197: astore 10
    //   199: aload 10
    //   201: invokevirtual 94	java/io/IOException:printStackTrace	()V
    //   204: aload 9
    //   206: athrow
    //   207: aload_2
    //   208: ifnull +7 -> 215
    //   211: aload_2
    //   212: invokevirtual 90	java/io/BufferedInputStream:close	()V
    //   215: aload_3
    //   216: ifnull +17 -> 233
    //   219: aload_3
    //   220: invokevirtual 93	java/io/BufferedOutputStream:close	()V
    //   223: goto +10 -> 233
    //   226: astore 10
    //   228: aload 10
    //   230: invokevirtual 94	java/io/IOException:printStackTrace	()V
    //   233: iinc 1 1
    //   236: iload_1
    //   237: aload_0
    //   238: getfield 24	com/framework/web/action/FileUploadAction:uploadFileFileName	Ljava/util/List;
    //   241: invokeinterface 97 1 0
    //   246: if_icmplt -241 -> 5
    //   249: return
    // Line number table:
    //   Java source line #22	-> byte code offset #0
    //   Java source line #23	-> byte code offset #5
    //   Java source line #24	-> byte code offset #7
    //   Java source line #25	-> byte code offset #9
    //   Java source line #27	-> byte code offset #24
    //   Java source line #28	-> byte code offset #34
    //   Java source line #29	-> byte code offset #56
    //   Java source line #30	-> byte code offset #82
    //   Java source line #31	-> byte code offset #92
    //   Java source line #32	-> byte code offset #102
    //   Java source line #33	-> byte code offset #109
    //   Java source line #34	-> byte code offset #112
    //   Java source line #35	-> byte code offset #115
    //   Java source line #34	-> byte code offset #124
    //   Java source line #38	-> byte code offset #137
    //   Java source line #39	-> byte code offset #142
    //   Java source line #42	-> byte code offset #147
    //   Java source line #43	-> byte code offset #155
    //   Java source line #44	-> byte code offset #163
    //   Java source line #45	-> byte code offset #168
    //   Java source line #40	-> byte code offset #176
    //   Java source line #42	-> byte code offset #178
    //   Java source line #43	-> byte code offset #186
    //   Java source line #44	-> byte code offset #194
    //   Java source line #45	-> byte code offset #199
    //   Java source line #47	-> byte code offset #204
    //   Java source line #42	-> byte code offset #207
    //   Java source line #43	-> byte code offset #215
    //   Java source line #44	-> byte code offset #223
    //   Java source line #45	-> byte code offset #228
    //   Java source line #22	-> byte code offset #233
    //   Java source line #49	-> byte code offset #249
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	250	0	this	FileUploadAction
    //   1	236	1	i	int
    //   6	206	2	bis	java.io.BufferedInputStream
    //   8	212	3	bos	java.io.BufferedOutputStream
    //   22	48	4	fileName	String
    //   54	33	5	fis	java.io.FileInputStream
    //   140	3	5	e	Exception
    //   80	17	6	fos	java.io.FileOutputStream
    //   107	19	7	b	byte[]
    //   110	22	8	len	int
    //   176	29	9	localObject	Object
    //   166	3	10	e	java.io.IOException
    //   197	3	10	e	java.io.IOException
    //   226	3	10	e	java.io.IOException
    // Exception table:
    //   from	to	target	type
    //   24	137	140	java/lang/Exception
    //   147	163	166	java/io/IOException
    //   24	147	176	finally
    //   178	194	197	java/io/IOException
    //   207	223	226	java/io/IOException
  }
  
  public String image()
    throws Exception
  {
    try
    {
      upload();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getDescribe()
  {
    return this.describe;
  }
  
  public void setDescribe(String describe)
  {
    this.describe = describe;
  }
  
  public List<File> getUploadFile()
  {
    return this.uploadFile;
  }
  
  public void setUploadFile(List<File> uploadFile)
  {
    this.uploadFile = uploadFile;
  }
  
  public List<String> getUploadFileFileName()
  {
    return this.uploadFileFileName;
  }
  
  public void setUploadFileFileName(List<String> uploadFileFileName)
  {
    this.uploadFileFileName = uploadFileFileName;
  }
  
  public List<String> getUploadFileContentType()
  {
    return this.uploadFileContentType;
  }
  
  public void setUploadFileContentType(List<String> uploadFileContentType)
  {
    this.uploadFileContentType = uploadFileContentType;
  }
}
