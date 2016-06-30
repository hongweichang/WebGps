package com.framework.utils;

public class NetworkUtil
{
  public static long ipToLong(String strIp)
  {
    long[] ip = new long[4];
    
    int position1 = strIp.indexOf(".");
    int position2 = strIp.indexOf(".", position1 + 1);
    int position3 = strIp.indexOf(".", position2 + 1);
    
    ip[0] = Long.parseLong(strIp.substring(0, position1));
    ip[1] = Long.parseLong(strIp.substring(position1 + 1, position2));
    ip[2] = Long.parseLong(strIp.substring(position2 + 1, position3));
    ip[3] = Long.parseLong(strIp.substring(position3 + 1));
    return (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
  }
  
  public static String longToIPOld(long longIp)
  {
    StringBuffer sb = new StringBuffer("");
    
    sb.append(String.valueOf(longIp & 0xFF));
    sb.append(".");
    
    sb.append(String.valueOf((longIp & 0xFFFFFF) >>> 8));
    sb.append(".");
    
    sb.append(String.valueOf((longIp & 0xFFFF) >>> 16));
    sb.append(".");
    
    sb.append(String.valueOf(longIp >>> 24 & 0xFF));
    return sb.toString();
  }
  
  public static String longToIP(long longIp)
  {
    StringBuffer sb = new StringBuffer("");
    
    sb.append(String.valueOf(longIp >> 0 & 0xFF));
    sb.append(".");
    
    sb.append(String.valueOf(longIp >> 8 & 0xFF));
    sb.append(".");
    
    sb.append(String.valueOf(longIp >> 16 & 0xFF));
    sb.append(".");
    
    sb.append(String.valueOf(longIp >> 24 & 0xFF));
    return sb.toString();
  }
}
