package com.gps.util;

import com.framework.web.cache.MyCacheLoader;
import com.gps.common.service.UserService;
import com.gps.model.BMapInfo;
import com.gps.model.GMapInfo;
import java.io.PrintStream;
import java.util.Date;

public final class GPSToPositionUtils
{
  private UserService userService;
  private static GoogleGeocoderUtil googleGeocoder;
  private static BMapGeocoderUtil BMapGeocoder;
  private static final int BMap = 2;
  private int toMap;
  private int type;
  private int coordtype;
  private String param;
  
  public static GoogleGeocoderUtil getGoogleGeocoder()
  {
    if (googleGeocoder == null) {
      googleGeocoder = new GoogleGeocoderUtil();
    }
    return googleGeocoder;
  }
  
  public static BMapGeocoderUtil getBMapGeocoder()
  {
    if (BMapGeocoder == null) {
      BMapGeocoder = new BMapGeocoderUtil();
    }
    return BMapGeocoder;
  }
  
  public int getToMap()
  {
    return this.toMap;
  }
  
  public void setToMap(int toMap)
  {
    this.toMap = toMap;
  }
  
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
  
  public String getParam()
  {
    return this.param;
  }
  
  public void setParam(String param)
  {
    this.param = param;
  }
  
  public GPSToPositionUtils(UserService userService)
  {
    this.userService = userService;
  }
  
  private boolean baidunetworkanomaly = false;
  private boolean googlenetworkanomaly = false;
  private int queryBaidu = 0;
  private int queryGoogle = 0;
  private int maxQueryBaidu = 1000;
  private int maxQueryGoogle = 1000;
  
  private String getInfo(String mapInfo)
  {
    String address = "";
    String param = getParam();
    if ((mapInfo != null) && (param != null) && (mapInfo.indexOf(param) > 0))
    {
      Integer beginIndex = Integer.valueOf(mapInfo.indexOf(":", mapInfo.indexOf(param)));
      Integer endIndex = Integer.valueOf(mapInfo.indexOf("\",", mapInfo.indexOf(param)));
      
      address = mapInfo.substring(beginIndex.intValue() + 1, endIndex.intValue()).replaceAll("\"", "");
    }
    return address;
  }
  
  private boolean isNetworkAnomaly(String mapInfo)
  {
    if ((mapInfo != null) && (mapInfo.equals("networkanomaly"))) {
      return true;
    }
    return false;
  }
  
  public String GPSToPosition(String address, Object locale)
  {
    if ((address == null) || (address.isEmpty()) || (address.equals(","))) {
      return "";
    }
    String position = findMapInfoByCache(address);
    if (!position.isEmpty()) {
      return position;
    }
    position = findMapInfoByDb(address);
    if (!position.isEmpty()) {
      return position;
    }
    String mapInfo = "";
    try
    {
      if (getToMap() == 2)
      {
        if (!this.baidunetworkanomaly)
        {
          getBMapGeocoder().setType(getType());
          getBMapGeocoder().setCoordtype(getCoordtype());
          mapInfo = getBMapGeocoder().geocodeByAddress(address);
          if (isNetworkAnomaly(mapInfo))
          {
            mapInfo = "";
            this.baidunetworkanomaly = true;
          }
        }
        else
        {
          this.queryBaidu += 1;
          if (this.queryBaidu > this.maxQueryBaidu)
          {
            this.queryBaidu = 0;
            this.baidunetworkanomaly = false;
          }
        }
      }
      else if (!this.googlenetworkanomaly)
      {
        getGoogleGeocoder().setType(getType());
        mapInfo = getGoogleGeocoder().geocodeByAddress(address, locale);
        if (isNetworkAnomaly(mapInfo))
        {
          mapInfo = "";
          this.googlenetworkanomaly = true;
        }
      }
      else
      {
        this.queryGoogle += 1;
        if (this.queryGoogle > this.maxQueryGoogle)
        {
          this.queryGoogle = 0;
          this.googlenetworkanomaly = false;
        }
      }
      position = getInfo(mapInfo);
      if (!mapInfo.isEmpty()) {
        addMapInfo(address, mapInfo, position);
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    finally
    {
      return position;
    }
  }
  
  private String findMapInfoByCache(String gpsLatitude)
  {
    String position = "";
    if (getToMap() == 2)
    {
      Object info = MyCacheLoader.getCacheInfo("baiduMap", gpsLatitude);
      position = info == null ? "" : info.toString();
    }
    else
    {
      Object info = MyCacheLoader.getCacheInfo("googleMap", gpsLatitude);
      position = info == null ? "" : info.toString();
    }
    return position;
  }
  
  private String findMapInfoByDb(String gpsLatitude)
  {
    String position = "";
    String infoStr = "";
    if (getToMap() == 2)
    {
      BMapInfo bMapInfo = this.userService.findBMapInfoById(gpsLatitude);
      if (bMapInfo != null)
      {
        position = bMapInfo.getPosition();
        if ((position == null) || (position.isEmpty())) {
          infoStr = bMapInfo.getBmapInfo();
        }
      }
    }
    else
    {
      GMapInfo gMapInfo = this.userService.findGMapInfoById(gpsLatitude);
      if (gMapInfo != null)
      {
        position = gMapInfo.getPosition();
        if ((position == null) || (position.isEmpty())) {
          infoStr = gMapInfo.getGmapInfo();
        }
      }
    }
    if ((infoStr != null) && (!infoStr.isEmpty()))
    {
      position = getInfo(infoStr);
      if ((position != null) && (!position.isEmpty())) {
        addMapInfo(gpsLatitude, infoStr, position);
      }
    }
    return position == null ? "" : position;
  }
  
  private synchronized void addMapInfo(String gpsLatitude, String mapInfo, String position)
  {
    if (getToMap() == 2)
    {
      MyCacheLoader.addCacheInfo("baiduMap", gpsLatitude, position);
      BMapInfo info = new BMapInfo(gpsLatitude, mapInfo, position);
      this.userService.save(info);
    }
    else
    {
      MyCacheLoader.addCacheInfo("googleMap", gpsLatitude, position);
      GMapInfo info = new GMapInfo(gpsLatitude, mapInfo, position);
      this.userService.save(info);
    }
  }
  
  public static void main(String[] args)
  {
    GPSToPositionUtils gps = new GPSToPositionUtils(null);
    gps.setType(2);
    gps.setToMap(2);
    gps.setCoordtype(3);
    gps.setParam("formatted_address");
    long stm = new Date().getTime();
    for (int i = 0; i < 2000; i++) {
      System.out.println(gps.GPSToPosition("30.2323230000,120.2323230000", null));
    }
    long etm = new Date().getTime();
    System.out.println((etm - stm) / 1000L);
  }
}
