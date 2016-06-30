package com.gps.util;

import com.gps.vo.GpsValue;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import org.apache.log4j.Logger;

public final class GoogleGeocoderUtil
{
  private static final int LATLNG = 2;
  private final String GOOGLEAPIURL = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true";
  private Logger log = Logger.getLogger(GoogleGeocoderUtil.class.getName());
  private int type;
  
  public int getType()
  {
    return this.type;
  }
  
  public void setType(int type)
  {
    this.type = type;
  }
  
  private String getInfo(String mapInfo, String param)
  {
    String address = "";
    if ((mapInfo != null) && (param != null) && (mapInfo.indexOf(param) > 0))
    {
      Integer beginIndex = Integer.valueOf(mapInfo.indexOf(":", mapInfo.indexOf(param)));
      Integer endIndex = Integer.valueOf(mapInfo.indexOf("\",", mapInfo.indexOf(param)));
      
      address = mapInfo.substring(beginIndex.intValue() + 1, endIndex.intValue()).replaceAll("\"", "");
    }
    return address;
  }
  
  public String geocodeByAddress(String address, Object locale)
    throws Exception
  {
    if ((address == null) || (address.equals(""))) {
      return null;
    }
    this.log.info("geocode By Address : " + address);
    BufferedReader in = null;
    HttpURLConnection httpConn = null;
    String result = "";
    try
    {
      String urlPath = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=" + URLEncoder.encode(address, "UTF-8");
      if (getType() == 2) {
        urlPath = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=" + address;
      }
      if (locale != null) {
        urlPath = urlPath + "&language=" + locale.toString();
      }
      this.log.info("url : " + urlPath);
      URL url = new URL(urlPath);
      httpConn = (HttpURLConnection)url.openConnection();
      httpConn.setDoInput(true);
      httpConn.setConnectTimeout(3000);
      httpConn.setReadTimeout(7000);
      in = new BufferedReader(new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
      String line;
      while ((line = in.readLine()) != null)
      {
       
        result = result + line;
      }
      in.close();
    }
    catch (MalformedURLException e)
    {
      this.log.error(e);
    }
    catch (IOException e)
    {
      if ((e.getMessage() != null) && ((e.getMessage().toLowerCase().equals("maps.googleapis.com")) || 
        (e.getMessage().toLowerCase().equals("connect timed out")))) {
        result = "networkanomaly";
      }
      this.log.error(e);
    }
    finally
    {
      if (in == null) {
        
      }
    }
    try
    {
      in.close();
    }
    catch (IOException e)
    {
      this.log.error(e);
    }
    finally
    {
    	if (httpConn != null) {
    		httpConn.disconnect();
    	}
      return result;
    }
    
   
  }
  
  public static void main(String[] args)
    throws Exception
  {
    GoogleGeocoderUtil instance = new GoogleGeocoderUtil();
    try
    {
      GpsValue gps = GoogleGpsFix.fixCoordinate(Integer.valueOf(100980639), Integer.valueOf(22787935));
      instance.setType(2);
      String bean = instance.geocodeByAddress("22.787935,100.980639", null);
      System.out.println(bean);
      System.out.println(instance.getInfo(bean, "formatted_address"));
      String bean2 = instance.geocodeByAddress(gps.getMapWeiDu() + "," + gps.getMapJingDu(), null);
      System.out.println(instance.getInfo(bean2, "formatted_address"));
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
}
