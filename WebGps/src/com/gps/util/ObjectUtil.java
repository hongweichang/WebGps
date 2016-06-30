package com.gps.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class ObjectUtil
{
  public static void copeField(Object obj1, Object obj2)
  {
    if ((obj1 == null) || (obj2 == null)) {
      return;
    }
    Class obj1Class = obj1.getClass();
    Method[] obj1methods = obj1Class.getDeclaredMethods();
    
    Class obj2Class = obj2.getClass();
    Method[] obj2methods = obj2Class.getDeclaredMethods();
    
    Map obj2MeMap = new HashMap();
    for (int i = 0; i < obj2methods.length; i++)
    {
      Method method = obj2methods[i];
      obj2MeMap.put(method.getName(), method);
    }
    for (int i = 0; i < obj1methods.length; i++)
    {
      String methodName = obj1methods[i].getName();
      if ((methodName != null) && (methodName.startsWith("get"))) {
        try
        {
          Object returnObj2 = obj2methods[i].invoke(obj2, 
            new Object[0]);
          if ((returnObj2 == null) || (returnObj2 == ""))
          {
            Object returnObj = obj1methods[i].invoke(obj1, 
              new Object[0]);
            
            Method obj2method = (Method)obj2MeMap.get("set" + 
              methodName.split("get")[1]);
            if ((returnObj != null) && (obj2method != null)) {
              obj2method.invoke(obj2, new Object[] { returnObj });
            }
          }
        }
        catch (Exception e)
        {
          e.printStackTrace();
        }
      }
    }
  }
  
  public static void clearObjectAttributes(Object obj, String[] strArr)
  {
    Field[] fields = obj.getClass().getDeclaredFields();
    Field[] arrayOfField1;
    int j = (arrayOfField1 = fields).length;
    for (int i = 0; i < j; i++)
    {
      Field field = arrayOfField1[i];
      field.setAccessible(true);
      try
      {
        if (strArr != null)
        {
          boolean flag = false;
          for ( i = 0; i < strArr.length; i++) {
            if (field.getName().equals(strArr[i])) {
              flag = true;
            }
          }
          if (flag) {
            field.set(obj, null);
          }
        }
        else
        {
          field.set(obj, null);
        }
      }
      catch (IllegalArgumentException e)
      {
        e.printStackTrace();
      }
      catch (IllegalAccessException e)
      {
        e.printStackTrace();
      }
    }
  }
}
