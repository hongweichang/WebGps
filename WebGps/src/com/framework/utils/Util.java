package com.framework.utils;

import java.text.SimpleDateFormat;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class Util
{
  private static long pkId;
  private static long sequenceId = Long.parseLong("1000");
  private static SimpleDateFormat formater = new SimpleDateFormat("yyMMddHHmmss");
  
  public static synchronized long getSequenceId()
  {
    long sequence = (Long) null;
    if (sequenceId < Long.parseLong("9999")) {
      sequenceId += 1L;
    } else {
      sequenceId = Long.parseLong("1000");
    }
    sequence = sequenceId;
    return sequence;
  }
  
  public static synchronized long getPkId()
  {
    long lTmp = System.currentTimeMillis();
    if (pkId < lTmp) {
      pkId = lTmp;
    } else {
      pkId += 1L;
    }
    return pkId;
  }
  
  public static String getValueFormCookie(HttpServletRequest request, String key)
  {
    Cookie[] cookie = request.getCookies();
    String value = null;
    if (cookie != null) {
      for (int i = 0; i < cookie.length; i++) {
        if (key.equals(cookie[i].getName()))
        {
          value = cookie[i].getValue();
          break;
        }
      }
    }
    return value;
  }
  
  public static String fixLengthBins(int digits, StringBuilder bins)
  {
    int len = bins.length();
    for (int i = 0; i < digits - len; i++) {
      bins.insert(0, '0');
    }
    return bins.toString();
  }
  
  public static void main(String[] args) {}
}
