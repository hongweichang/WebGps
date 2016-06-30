package com.framework.encrypt;

public class ConversionUtils
{
  public static String byte2hex(byte[] b)
  {
    String hs = "";
    String stmp = "";
    for (int n = 0; n < b.length; n++)
    {
      stmp = Integer.toHexString(b[n] & 0xFF);
      if (stmp.length() == 1) {
        hs = hs + "0" + stmp;
      } else {
        hs = hs + stmp;
      }
    }
    return hs.toUpperCase();
  }
  
  public static byte[] hex2byte(String hex)
    throws IllegalArgumentException
  {
    if (hex.length() % 2 != 0) {
      throw new IllegalArgumentException();
    }
    char[] arr = hex.toCharArray();
    byte[] b = new byte[hex.length() / 2];
    int i = 0;int j = 0;
    for (int l = hex.length(); i < l; j++)
    {
    	String swap = Integer.toString(arr[(i++)] + arr[i]);
//       swap = arr[(i++)] + arr[i];
      int byteint = Integer.parseUnsignedInt(swap, 16) & 0xFF;
      b[j] = new Integer(byteint).byteValue();i++;
    }
    return b;
  }
}
