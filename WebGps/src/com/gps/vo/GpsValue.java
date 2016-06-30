package com.gps.vo;

public class GpsValue
{
  public static final int GPS_SCALE = 1000000;
  public static final String MAP_TYPE_GPS = "0";
  public static final String MAP_TYPE_GOOGLE = "1";
  public static final String MAP_TYPE_BAIDU = "2";
  private Integer jingDu;
  private Integer weiDu;
  private String mapJingDu;
  private String mapWeiDu;
  
  public GpsValue() {}
  
  public GpsValue(Integer jingDu, Integer weiDu)
  {
    this.jingDu = jingDu;
    this.weiDu = weiDu;
    this.mapJingDu = formatGps(this.jingDu);
    this.mapWeiDu = formatGps(this.weiDu);
  }
  
  public Integer getJingDu()
  {
    return this.jingDu;
  }
  
  public void setJingDu(Integer jingDu)
  {
    this.jingDu = jingDu;
  }
  
  public Integer getWeiDu()
  {
    return this.weiDu;
  }
  
  public void setWeiDu(Integer weiDu)
  {
    this.weiDu = weiDu;
  }
  
  public String getMapJingDu()
  {
    return this.mapJingDu;
  }
  
  public void setMapJingDu(String mapJingDu)
  {
    this.mapJingDu = mapJingDu;
  }
  
  public String getMapWeiDu()
  {
    return this.mapWeiDu;
  }
  
  public void setMapWeiDu(String mapWeiDu)
  {
    this.mapWeiDu = mapWeiDu;
  }
  
  protected String formatGps(Integer value)
  {
    Double temp = Double.valueOf(value.doubleValue() / 1000000.0D);
    return temp.toString();
  }
}
