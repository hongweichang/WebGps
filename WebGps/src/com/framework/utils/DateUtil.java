package com.framework.utils;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil
{
  public static String dateSwitchString(Date date)
  {
    SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String str = "";
    if (date != null) {
      str = formatDate.format(date);
    }
    return str;
  }
  
  public static String dateSwitchDateString(Date date)
  {
    SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
    String str = "";
    if (date != null) {
      str = formatDate.format(date);
    }
    return str;
  }
  
  public static String dateSwitchMonthDateString(Date date)
  {
    SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM");
    String str = "";
    if (date != null) {
      str = formatDate.format(date);
    }
    return str;
  }
  
  public static String secondSwitchHourString(int totalSecond, String hour, String minute, String second)
  {
    StringBuilder ret = new StringBuilder();
    if (totalSecond >= 3600) {
      ret.append(totalSecond / 3600 + hour);
    }
    totalSecond %= 3600;
    if (totalSecond / 60 > 0) {
      ret.append(totalSecond / 60 + minute);
    }
    totalSecond %= 60;
    if (totalSecond > 0) {
      ret.append(totalSecond + second);
    }
    return ret.toString();
  }
  
  public static String timestampSwitchString(Timestamp time)
  {
    Date date = null;
    if (time != null) {
      date = new Date(time.getTime());
    }
    return dateSwitchString(date);
  }
  
  public static boolean compareDate(Date date1, Date date2)
  {
    if (date1.after(date2)) {
      return true;
    }
    return false;
  }
  
  public static boolean isLongTimeValid(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    try
    {
      Date date = dfs.parse(time);
      return true;
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
    return false;
  }
  
  public static boolean isDateValid(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd");
    try
    {
      Date date = dfs.parse(time);
      return true;
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
    return false;
  }
  
  public static boolean isMonthDateValid(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM");
    try
    {
      Date date = dfs.parse(time);
      return true;
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
    return false;
  }
  
  public static int compareStrLongTime(String time1, String time2)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    try
    {
      Date date1 = dfs.parse(time1);
      Date date2 = dfs.parse(time2);
      return date1.compareTo(date2);
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
    return 2;
  }
  
  public static Date StrMonth2Date(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM");
    try
    {
      return dfs.parse(time);
    }
    catch (ParseException e) {}
    return null;
  }
  
  public static Date StrDate2Date(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd");
    try
    {
      return dfs.parse(time);
    }
    catch (ParseException e)
    {
      return null;
    }
    catch (Exception e) {}
    return null;
  }
  
  public static Date StrLongTime2Date(String time)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    try
    {
      return dfs.parse(time);
    }
    catch (ParseException e) {}
    return null;
  }
  
  public static Date StrDateToDateTime(String strDate)
  {
    SimpleDateFormat dfs = new SimpleDateFormat("HH:mm:ss");
    try
    {
      return dfs.parse(strDate);
    }
    catch (ParseException e) {}
    return null;
  }
  
  public static Date dateIncrease(Date date, Integer month, Integer day)
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(date);
    if ((month != null) && (month.intValue() != 0)) {
      calendar.add(2, month.intValue());
    }
    if ((day != null) && (day.intValue() != 0)) {
      calendar.add(5, day.intValue());
    }
    return calendar.getTime();
  }
  
  public static Date dateSameTime(Date dest, Date src)
  {
    Calendar calDest = Calendar.getInstance();
    calDest.setTime(dest);
    Calendar calSrc = Calendar.getInstance();
    calSrc.setTime(src);
    
    calDest.add(10, calSrc.get(10));
    calDest.add(12, calSrc.get(12));
    calDest.add(13, calSrc.get(13));
    return calDest.getTime();
  }
  
  public static String getMonthMaxDate(String monthDate)
  {
    String year = monthDate.substring(0, 4);
    String month = monthDate.substring(5, 7);
    
    Calendar calDest = Calendar.getInstance();
    calDest.set(Integer.parseInt(year), Integer.parseInt(month), 1);
    calDest.add(5, -1);
    return dateSwitchDateString(calDest.getTime());
  }
  
  public static boolean dateCompareStrLongTimeRange(String strB, String strE, int day)
  {
    Date db = StrLongTime2Date(strB);
    Date dE = StrLongTime2Date(strE);
    long sec = dE.getTime() / 1000L - db.getTime() / 1000L;
    if (sec > day * 24 * 60 * 60) {
      return true;
    }
    return false;
  }
}
