package com.framework.utils;

import java.io.InputStream;
import java.io.PrintStream;
import java.util.Properties;

public class GetProperties
{
  public static String getProperties(String str)
  {
    Properties property = new Properties();
    InputStream is = null;
    String s = null;
    try
    {
      is = GetProperties.class.getClassLoader().getResourceAsStream("config/jdbc.properties");
      property.load(is);
      s = property.getProperty(str);
    }
    catch (Exception e)
    {
      System.out.println("hi");
    }
    return s;
  }
  
  public static void main(String[] args)
  {
    System.out.println(getProperties("cookie.outTime"));
  }
}
