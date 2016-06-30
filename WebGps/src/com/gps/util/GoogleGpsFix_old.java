package com.gps.util;

import com.gps.vo.GpsValue;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.util.Scanner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

public class GoogleGpsFix_old
{
  public static final int TABLESIZE = 297000;
  private static double[] tableX = new double[297000];
  private static double[] tableY = new double[297000];
  
  public GoogleGpsFix_old()
  {
    loadFromFile();
  }
  
  protected void loadFromFile()
  {
    Resource res = new ClassPathResource("google.table");
    try
    {
      Scanner sc = new Scanner(res.getFile());
      int i = 0;
      while (sc.hasNextDouble())
      {
        tableX[i] = (sc.nextDouble() / 100000.0D);
        tableY[i] = (sc.nextDouble() / 100000.0D);
        
        i++;
      }
    }
    catch (FileNotFoundException e)
    {
      System.err.println(e);
    }
    catch (IOException e)
    {
      System.err.println(e);
    }
  }
  
  public static int getTableIndex(long i, long j)
  {
    return (int)(i + 660L * j);
  }
  
  public static GpsValue fixCoordinate(Integer jingdu, Integer weidu)
  {
    GpsValue gps = new GpsValue();
    if ((jingdu != null) && (weidu != null))
    {
      double x = jingdu.doubleValue() / 1000000.0D;
      double y = weidu.doubleValue() / 1000000.0D;
      
      double xtry = x;
      double ytry = y;
      for (long k = 0L; k < 10L; k += 1L)
      {
        if ((xtry < 72.0D) || (xtry > 137.9D) || (ytry < 10.0D) || (ytry > 54.9D)) {
          break;
        }
        long i = (long) ((xtry - 72.0D) * 10.0D);
        long j = (long) ((ytry - 10.0D) * 10.0D);
        
        double x1 = tableX[getTableIndex(i, j)];
        double y1 = tableY[getTableIndex(i, j)];
        double x2 = tableX[getTableIndex(i + 1L, j)];
        double y2 = tableY[getTableIndex(i + 1L, j)];
        double x3 = tableX[getTableIndex(i + 1L, j + 1L)];
        double y3 = tableY[getTableIndex(i + 1L, j + 1L)];
        double x4 = tableX[getTableIndex(i, j + 1L)];
        double y4 = tableY[getTableIndex(i, j + 1L)];
        
        double t = (xtry - 72.0D - 0.1D * i) * 10.0D;
        double u = (ytry - 10.0D - 0.1D * j) * 10.0D;
        
        double dx = (1.0D - t) * (1.0D - u) * x1 + t * (1.0D - u) * x2 + t * u * x3 + (1.0D - t) * u * x4 - xtry;
        double dy = (1.0D - t) * (1.0D - u) * y1 + t * (1.0D - u) * y2 + t * u * y3 + (1.0D - t) * u * y4 - ytry;
        
        xtry = (xtry + x - dx) / 2.0D;
        ytry = (ytry + y - dy) / 2.0D;
      }
      xtry = x + (x - xtry);
      ytry = y + (y - ytry);
      
      DecimalFormat df = new DecimalFormat("#.000000");
      gps.setMapJingDu(df.format(xtry).replace(',', '.'));
      gps.setMapWeiDu(df.format(ytry).replace(',', '.'));
    }
    else
    {
      gps.setMapJingDu("0.0");
      gps.setMapWeiDu("0.0");
    }
    return gps;
  }
}
