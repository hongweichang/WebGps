package com.gps.util;

import java.io.PrintStream;
import org.jfree.ui.RectangleInsets;

public class GpsInChina
{
  private static RectangleInsets[] region = {
    new RectangleInsets(49.2204D, 79.4462D, 42.8899D, 96.33D), 
    new RectangleInsets(54.1415D, 109.6872D, 39.3742D, 135.0002D), 
    new RectangleInsets(42.8899D, 73.1246D, 29.5297D, 124.143255D), 
    new RectangleInsets(29.5297D, 82.9684D, 26.7186D, 97.0352D), 
    new RectangleInsets(29.5297D, 97.0253D, 20.414096D, 124.367395D), 
    new RectangleInsets(20.414096D, 107.975793D, 17.871542D, 111.744104D) };
  private static RectangleInsets[] exclude = {
    new RectangleInsets(25.398623D, 119.921265D, 21.785006D, 122.497559D), 
    new RectangleInsets(22.284D, 101.8652D, 20.0988D, 106.665D), 
    new RectangleInsets(21.5422D, 106.4525D, 20.4878D, 108.051D), 
    new RectangleInsets(55.8175D, 109.0323D, 50.3257D, 119.127D), 
    new RectangleInsets(55.8175D, 127.4568D, 49.5574D, 137.0227D), 
    new RectangleInsets(44.8922D, 131.2662D, 42.5692D, 137.0227D) };
  
  private static boolean InRectangle(RectangleInsets rect, double jingDu, double weiDu)
  {
    return (rect.getRight() >= jingDu) && (rect.getLeft() <= jingDu) && (rect.getTop() >= weiDu) && (rect.getBottom() <= weiDu);
  }
  
  public static boolean IsInsideChina(double jingDu, double weiDu)
  {
    for (int i = 0; i < region.length; i++) {
      if (InRectangle(region[i], jingDu, weiDu))
      {
        for (int j = 0; j < exclude.length; j++) {
          if (InRectangle(exclude[j], jingDu, weiDu)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  
  public static void main(String[] s)
  {
    System.out.println(IsInsideChina(100.427555D, 13.87482D));
    System.out.println(IsInsideChina(108.938981D, 22.955045D));
    System.out.println(IsInsideChina(81.0D, 33.3D));
  }
}
