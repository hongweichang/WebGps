package com.framework.utils;

public class ByteArrayUtils
{
  public static long byteArray2long(byte[] data, int offset)
  {
    return byteArray2long(data, offset, 8);
  }
  
  public static long byteArray2long(byte[] data, int offset, int count)
  {
    long ret = 0L;
    for (int i = count - 1; i >= 0; i--)
    {
      ret <<= 8;
      ret |= data[(offset + i)] & 0xFF;
    }
    return ret;
  }
  
  public static int byteArray2int(byte[] data, int offset)
  {
    return byteArray2int(data, offset, 4);
  }
  
  public static int byteArray2int(byte[] data, int offset, int count)
  {
    int ret = 0;
    for (int i = count - 1; i >= 0; i--)
    {
      ret <<= 8;
      ret |= data[(offset + i)] & 0xFF;
    }
    return ret;
  }
  
  public static short byteArray2short(byte[] data, int offset)
  {
    return byteArray2short(data, offset, 2);
  }
  
  public static short byteArray2short(byte[] data, int offset, int count)
  {
    short ret = 0;
    for (int i = 1; i >= 0; i--)
    {
      ret = (short)(ret << 8);
      ret = (short)(ret | data[(offset + i)] & 0xFF);
    }
    return ret;
  }
}
