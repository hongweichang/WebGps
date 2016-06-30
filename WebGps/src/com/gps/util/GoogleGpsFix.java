package com.gps.util;

import com.gps.vo.GpsValue;
import java.io.PrintStream;
import java.text.DecimalFormat;

public class GoogleGpsFix
{
  private static double pi = 3.141592653589793D;
  private static double a = 6378245.0D;
  private static double ee = 0.006693421622965943D;
  
  public static GpsValue fixCoordinate(Integer jingDu, Integer weiDu)
  {
    GpsValue gps = new GpsValue();
    if ((jingDu == null) || (weiDu == null))
    {
      gps.setMapJingDu("0.0");
      gps.setMapWeiDu("0.0");
    }
    else if (GpsInsideChina.IsInsideChina(jingDu.intValue(), weiDu.intValue()))
    {
      gps = fixCoordinate_(jingDu, weiDu);
    }
    else
    {
      double mapJingDu = formatPositionToDouble(jingDu).doubleValue();
      double mapWeiDu = formatPositionToDouble(weiDu).doubleValue();
      gps.setMapJingDu(formatPositionToStr(Double.valueOf(mapJingDu)));
      gps.setMapWeiDu(formatPositionToStr(Double.valueOf(mapWeiDu)));
    }
    return gps;
  }
  
  public static GpsValue fixCoordinate_(Integer jingDu, Integer weiDu)
  {
    GpsValue gps = new GpsValue();
    if ((jingDu == null) || (weiDu == null))
    {
      gps.setMapJingDu("0.0");
      gps.setMapWeiDu("0.0");
    }
    else
    {
      double mapJingDu = formatPositionToDouble(jingDu).doubleValue();
      double mapWeiDu = formatPositionToDouble(weiDu).doubleValue();
      double dWeidu = transformLat(mapJingDu - 105.0D, mapWeiDu - 35.0D);
      double dJingDu = transformLon(mapJingDu - 105.0D, mapWeiDu - 35.0D);
      double radJingDu = mapWeiDu / 180.0D * pi;
      double magic = Math.sin(radJingDu);
      magic = 1.0D - ee * magic * magic;
      double sqrtMagic = Math.sqrt(magic);
      dWeidu = dWeidu * 180.0D / (a * (1.0D - ee) / (magic * sqrtMagic) * pi);
      dJingDu = dJingDu * 180.0D / (a / sqrtMagic * Math.cos(radJingDu) * pi);
      mapWeiDu += dWeidu;
      mapJingDu += dJingDu;
      gps.setMapJingDu(formatPositionToStr(Double.valueOf(mapJingDu)));
      gps.setMapWeiDu(formatPositionToStr(Double.valueOf(mapWeiDu)));
    }
    return gps;
  }
  
  public static int getTableIndex(long i, long j)
  {
    return (int)(i + 660L * j);
  }
  
  private static double transformLat(double x, double y)
  {
    double ret = -100.0D + 2.0D * x + 3.0D * y + 0.2D * y * y + 0.1D * x * y + 0.2D * Math.sqrt(Math.abs(x));
    ret += (20.0D * Math.sin(6.0D * x * pi) + 20.0D * Math.sin(2.0D * x * pi)) * 2.0D / 3.0D;
    ret += (20.0D * Math.sin(y * pi) + 40.0D * Math.sin(y / 3.0D * pi)) * 2.0D / 3.0D;
    ret += (160.0D * Math.sin(y / 12.0D * pi) + 320.0D * Math.sin(y * pi / 30.0D)) * 2.0D / 3.0D;
    return ret;
  }
  
  private static double transformLon(double x, double y)
  {
    double ret = 300.0D + x + 2.0D * y + 0.1D * x * x + 0.1D * x * y + 0.1D * Math.sqrt(Math.abs(x));
    ret += (20.0D * Math.sin(6.0D * x * pi) + 20.0D * Math.sin(2.0D * x * pi)) * 2.0D / 3.0D;
    ret += (20.0D * Math.sin(x * pi) + 40.0D * Math.sin(x / 3.0D * pi)) * 2.0D / 3.0D;
    ret += (150.0D * Math.sin(x / 12.0D * pi) + 300.0D * Math.sin(x / 30.0D * pi)) * 2.0D / 3.0D;
    return ret;
  }
  
  private static Double formatPositionToDouble(Integer position)
  {
    if (position != null)
    {
      double db = position.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000000");
      return Double.valueOf(Double.parseDouble(format.format(db / 1000000.0D).replace(',', '.').replaceAll(",", ".")));
    }
    return Double.valueOf(0.0D);
  }
  
  private static String formatPositionToStr(Double position)
  {
    if (position != null)
    {
      double db = position.doubleValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000000");
      return format.format(db).replace(',', '.').replaceAll(",", ".");
    }
    return "";
  }
  
  public static void main(String[] args)
  {
    GpsValue gps = fixCoordinate(Integer.valueOf(113900764), Integer.valueOf(2222222));
    System.out.println(gps.getMapJingDu() + "," + gps.getMapWeiDu());
  }
}
