package com.framework.utils;

import java.util.List;
import java.util.Map;

import com.sun.org.apache.xpath.internal.operations.Equals;

public class AssertUtils
{
  public static boolean isNull(Object object)
  {
    if (("".equals(object)) || (object == null)) {
      return true;
    }
    return false;
  }
  
  public static boolean isNull(Object[] objects)
  {
    if (objects.length > 0) {
      for (int i = 0; i < objects.length; i++) {
        if ((!"".equals(objects[i])) && (objects[i] != null)) {
          return false;
        }
      }
    }
    return true;
  }
  
  public static boolean isNoNull(Object object)
  {
    if (("".equals(object)) || (object == null)) {
      return false;
    }
    return true;
  }
  
  public static boolean isNoNull(List list)
  {
    return list != null;
  }
  
  public static boolean isNoNull(Map map)
  {
    if (map == null) {
      return false;
    }
    return true;
  }
  
  public static boolean isNoNull(Object[] objects)
  {
    if (objects.length > 0) {
      for (int i = 0; i < objects.length; i++)
      {
        if (!isNoNull(objects[i])) {
          return false;
        }
        if (objects[i].getClass().toString().substring(6, 8).equals("[L"))
        {
          Object[] obj = (Object[])objects[i];
          if (!isNoNull(obj[i])) {
            return false;
          }
          if (!isNoNull(obj)) {
            return false;
          }
        }
        else if (objects[i].getClass().toString().substring(6, 16).equals("java.util."))
        {
          if ((objects[i] instanceof List))
          {
            List list = (List)objects[i];
            if (!isNoNull(list)) {
              return false;
            }
          }
          else if ((objects[i] instanceof Map))
          {
            Map map = (Map)objects[i];
            if (!isNoNull(map)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  
  public static boolean isAllTrue(boolean[] booleans)
  
  {
    for (int i = 0; i < booleans.length; i++) {
      if (booleans[i] ) {
        return false;
      }
    }
    return true;
  }
}
