package com.gps.util;

import com.gps.vo.GpsValue;
import java.text.DecimalFormat;

public class ConvertUtil
{
  private static double x_pi = 52.35987755982988D;
  
  public static GpsValue fixConvert(Integer jingDu, Integer weiDu)
  {
    GpsValue gps = new GpsValue();
    gps = GoogleGpsFix.fixCoordinate_(jingDu, weiDu);
    if (("0.0".equals(gps.getMapJingDu())) && ("0.0".equals(gps.getMapWeiDu())))
    {
      gps.setMapJingDu("");
      gps.setMapWeiDu("");
      return gps;
    }
    double x = Double.parseDouble(gps.getMapJingDu());double y = Double.parseDouble(gps.getMapWeiDu());
    double z = Math.sqrt(x * x + y * y) + 2.0E-5D * Math.sin(y * x_pi);
    double theta = Math.atan2(y, x) + 3.0E-6D * Math.cos(x * x_pi);
    double mapJingDu = z * Math.cos(theta) + 0.0065D;
    double mapWeiDu = z * Math.sin(theta) + 0.006D;
    gps.setMapJingDu(formatPosition(Double.valueOf(mapJingDu)));
    gps.setMapWeiDu(formatPosition(Double.valueOf(mapWeiDu)));
    return gps;
  }
  
  public static int getTableIndex(long i, long j)
  {
    return (int)(i + 660L * j);
  }
  
  private static String formatPosition(Double position)
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
  
  public static GpsValue convert(Integer jingdu, Integer weidu, String toMap)
  {
    if ((toMap != null) && (toMap.equals("2"))) {
      return fixConvert(jingdu, weidu);
    }
    return GoogleGpsFix.fixCoordinate(jingdu, weidu);
  }
}
