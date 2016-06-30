package com.framework.utils;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil
{
  public static synchronized File createFileDir(String sDir)
  {
    File file = new File(sDir);
    if (!file.exists()) {
      file.mkdirs();
    }
    return file;
  }
  
  public static void deleteAnnexFile(String fileUrlPaths)
    throws Exception
  {
    if ((fileUrlPaths == null) || (fileUrlPaths.trim().length() == 0)) {
      return;
    }
    String[] filepaths = fileUrlPaths.split(",");
    for (int i = 0; i < filepaths.length; i++)
    {
      String fileFullPath = SystemUtil.CONTEXT_REAL_PATH + 
        urlSeparatorToOs(filepaths[i]);
      File file = new File(fileFullPath);
      if ((file.exists()) && 
        (!file.delete())) {
        throw new Exception("file can't delete!");
      }
    }
  }
  
  public static String getExistAnnexFile(String fileUrlPaths)
  {
    if ((fileUrlPaths == null) || (fileUrlPaths.trim().length() == 0)) {
      return null;
    }
    StringBuffer existFiles = new StringBuffer();
    
    String[] filepaths = fileUrlPaths.split(",");
    for (int i = 0; i < filepaths.length; i++)
    {
      String fileFullPath = SystemUtil.CONTEXT_REAL_PATH + 
        urlSeparatorToOs(filepaths[i]);
      File file = new File(fileFullPath);
      if (file.exists())
      {
        if (existFiles.length() > 0) {
          existFiles.append(",");
        }
        existFiles.append(filepaths[i]);
      }
    }
    return existFiles.toString();
  }
  
  public static String urlSeparatorToOs(String url)
  {
    if (!SystemUtil.OS_SEPARATOR.equals("/"))
    {
      StringBuffer realUrl = new StringBuffer(url);
      int pos = realUrl.indexOf("/");
      while (pos >= 0)
      {
        realUrl.replace(pos, pos + 1, SystemUtil.OS_SEPARATOR);
        pos = realUrl.indexOf("/");
      }
      return realUrl.toString();
    }
    return url;
  }
  
  public static boolean isNumeric(String str)
  {
    Pattern pattern = Pattern.compile("[0-9]*");
    return pattern.matcher(str).matches();
  }
  
  public static boolean isCharacter(String str)
  {
    Pattern pattern = Pattern.compile("^[A-Za-z]+$");
    return pattern.matcher(str).matches();
  }
  
  public static boolean isNumAndChar(String str)
  {
    Pattern pattern = Pattern.compile("^[\\da-zA-Z]*$");
    return pattern.matcher(str).matches();
  }
  
  public static String join(Object[] array, String separator)
  {
    if (array == null) {
      return null;
    }
    int arraySize = array.length;
    int bufSize = arraySize == 0 ? 0 : ((array[0] == null ? 16 : array[0].toString().length()) + 1) * arraySize;
    StringBuffer buf = new StringBuffer(bufSize);
    for (int i = 0; i < arraySize; i++)
    {
      if (i > 0) {
        buf.append(separator);
      }
      if (array[i] != null) {
        buf.append(array[i]);
      }
    }
    return buf.toString();
  }
  
  public static int indexOfEx(String contValue, String str)
  {
    return contValue.toLowerCase().indexOf(str.toLowerCase());
  }
}
