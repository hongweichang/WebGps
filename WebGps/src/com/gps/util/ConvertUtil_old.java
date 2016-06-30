package com.gps.util;

import com.framework.utils.ByteArrayUtils;
import com.gps.vo.GpsValue;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.text.DecimalFormat;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

public class ConvertUtil_old
{
  public static final int TABLESIZE = 297000;
  private static double[] tableX = new double[297000];
  private static double[] tableY = new double[297000];
  
  public ConvertUtil_old()
  {
    loadFromFile();
  }
  
  protected void loadFromFile()
  {
    Resource res = new ClassPathResource("convert.tmp");
    try
    {
      InputStream inStream = res.getInputStream();
      byte[] data = new byte[8];
      int i = 0;
      while (inStream.read(data) == 8)
      {
        int offset = 0;
        int value = ByteArrayUtils.byteArray2int(data, offset);
        tableX[i] = (value / 1000000.0D);
        offset += 4;
        value = ByteArrayUtils.byteArray2int(data, offset);
        tableY[i] = (value / 1000000.0D);
        i++;
      }
      inStream.close();
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
  
  public static GpsValue fixConvertx(Integer jingdu, Integer weidu)
  {
    GpsValue gps = new GpsValue();
    if ((jingdu != null) && (weidu != null))
    {
      double x = jingdu.doubleValue() / 1000000.0D;
      double y = weidu.doubleValue() / 1000000.0D;
      
      double xout = x;
      double yout = y;
      if ((x >= 72.0D) && (x <= 137.9D) && (y >= 10.0D) && (y <= 53.9D))
      {
        long i = (long) ((x - 72.0D) * 10.0D);
        long j = (long) ((y - 10.0D) * 10.0D);
        
        long nTemp = (long) (((x - 72.0D) * 100.0D) % 10L);
        if (nTemp > 5L) {
          i += 1L;
        }
        nTemp = (long) (((y - 10.0D) * 100.0D) % 10L);
        if (nTemp > 5L) {
          j += 1L;
        }
        double dX = tableX[getTableIndex(i, j)];
        double dY = tableY[getTableIndex(i, j)];
        double x1 = 72.0D + i * 0.1D;
        double y1 = 10.0D + j * 0.1D;
        double pX = x - (x1 - dX);
        double pY = y - (y1 - dY);
        xout = pX;
        yout = pY;
      }
      DecimalFormat df = new DecimalFormat("#.000000");
      gps.setMapJingDu(df.format(xout).replace(',', '.'));
      gps.setMapWeiDu(df.format(yout).replace(',', '.'));
    }
    else
    {
      gps.setMapJingDu("0.0");
      gps.setMapWeiDu("0.0");
    }
    return gps;
  }
}
