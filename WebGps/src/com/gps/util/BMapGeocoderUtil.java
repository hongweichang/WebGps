package com.gps.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import org.apache.log4j.Logger;

public final class BMapGeocoderUtil
{
  private static final int LATLNG = 2;
  private static final int BD09ll = 1;
  private static final int GCJ02ll = 2;
  private static final int WGS84ll = 3;
  private final String GOOGLEAPIURL = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0";
  private Logger log = Logger.getLogger(BMapGeocoderUtil.class.getName());
  private int type;
  private int coordtype;
  
  public int getType()
  {
    return this.type;
  }
  
  public void setType(int type)
  {
    this.type = type;
  }
  
  public int getCoordtype()
  {
    return this.coordtype;
  }
  
  public void setCoordtype(int coordtype)
  {
    this.coordtype = coordtype;
  }
  
  public String geocodeByAddress(String address)
    throws Exception
  {
    if ((address == null) || (address.equals(""))) {
      return null;
    }
    this.log.info("geocode By Address : " + address);
    this.log.info("Start geocode");
    HttpURLConnection con = null;
    StringBuffer strBuf = new StringBuffer();
    String result = "";
    try
    {
      this.log.info("Start open url");
      String urlPath = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&address=" + URLEncoder.encode(address, "UTF-8");
      if (getType() == 2)
      {
        urlPath = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&location=" + address;
        switch (getCoordtype())
        {
        case 1: 
          urlPath = urlPath + "&coordtype=bd09ll";
          break;
        case 2: 
          urlPath = urlPath + "&coordtype=gcj02ll";
          break;
        case 3: 
          urlPath = urlPath + "&coordtype=wgs84ll";
          break;
        }
      }
      this.log.info("url : " + urlPath);
      URL url = new URL(urlPath);
      con = (HttpURLConnection)url.openConnection();
      con.setConnectTimeout(3000);
      con.setReadTimeout(7000);
      this.log.info("End open url");
      con.connect();
      
      BufferedReader reader = new BufferedReader(new InputStreamReader(
        con.getInputStream(), "UTF-8"));
      String tempStr = "";
      while (tempStr != null)
      {
        strBuf.append(tempStr);
        tempStr = reader.readLine();
      }
      result = strBuf.toString();
      
      reader.close();
      this.log.info("End geocode");
    }
    catch (MalformedURLException e)
    {
      this.log.error(e);
    }
    catch (IOException e)
    {
      if ((e.getMessage() != null) && ((e.getMessage().toLowerCase().equals("api.map.baidu.com")) || 
        (e.getMessage().toLowerCase().equals("connect timed out")))) {
        result = "networkanomaly";
      }
      this.log.error(e);
    }
    finally
    {
      con.disconnect();
    }
    return result;
  }
  
  private String getAddress(String mapInfo, String param)
  {
    String address = "";
    if ((mapInfo != null) && (param != null) && (mapInfo.indexOf(param) > 0))
    {
      Integer beginIndex = Integer.valueOf(mapInfo.indexOf(":", mapInfo.indexOf(param)));
      Integer endIndex = Integer.valueOf(mapInfo.indexOf(",", mapInfo.indexOf(param)));
      
      address = mapInfo.substring(beginIndex.intValue() + 1, endIndex.intValue()).replaceAll("\"", "");
    }
    return address;
  }
  
  public static void main(String[] args)
    throws Exception
  {
    BMapGeocoderUtil instance = new BMapGeocoderUtil();
    try
    {
      instance.setType(2);
      instance.setCoordtype(3);
      String bean = instance.geocodeByAddress("22.787935,100.980639");
      System.out.println(bean);
      System.out.println(instance.getAddress(bean, "formatted_address"));
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
}
