package com.framework.encrypt;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileChannel.MapMode;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5EncryptUtils
{
  private static final String ALGORIHM = "MD5";
  
  public static String encrypt(String text)
  {
    if ((text != null) && (!"".equals(text))) {
      try
      {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] byteTmpe = md.digest(text.getBytes());
        return ConversionUtils.byte2hex(byteTmpe);
      }
      catch (NoSuchAlgorithmException e)
      {
        e.printStackTrace();
      }
    }
    return null;
  }
  
  public static boolean validateCheckSum(String encryptTxt, String encryptKey, String checkSum)
  {
    return checkSum.equalsIgnoreCase(getCheckSum(encryptTxt, encryptKey));
  }
  
  public static String getCheckSum(String encryptTxt, String encryptKey)
  {
    return encrypt(encryptKey + encryptTxt);
  }
  
  protected static char[] hexDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
  
  public static String getFileMD5String(File file)
    throws IOException
  {
    try
    {
      MessageDigest messagedigest = MessageDigest.getInstance("MD5");
      FileInputStream in = new FileInputStream(file);
      FileChannel ch = in.getChannel();
      MappedByteBuffer byteBuffer = ch.map(FileChannel.MapMode.READ_ONLY, 0L, 
        file.length());
      messagedigest.update(byteBuffer);
      return bufferToHex(messagedigest.digest()).toUpperCase();
    }
    catch (NoSuchAlgorithmException e)
    {
      e.printStackTrace();
    }
    return "";
  }
  
  private static String bufferToHex(byte[] bytes)
  {
    return bufferToHex(bytes, 0, bytes.length);
  }
  
  private static String bufferToHex(byte[] bytes, int m, int n)
  {
    StringBuffer stringbuffer = new StringBuffer(2 * n);
    int k = m + n;
    for (int l = m; l < k; l++) {
      appendHexPair(bytes[l], stringbuffer);
    }
    return stringbuffer.toString();
  }
  
  private static void appendHexPair(byte bt, StringBuffer stringbuffer)
  {
    char c0 = hexDigits[((bt & 0xF0) >> 4)];
    char c1 = hexDigits[(bt & 0xF)];
    stringbuffer.append(c0);
    stringbuffer.append(c1);
  }
  
  public static String fileMD5(String inputFile)
    throws IOException
  {
    int bufferSize = 262144;
    FileInputStream fileInputStream = null;
    DigestInputStream digestInputStream = null;
    try
    {
      MessageDigest messageDigest = MessageDigest.getInstance("MD5");
      
      fileInputStream = new FileInputStream(inputFile);
      digestInputStream = new DigestInputStream(fileInputStream, messageDigest);
      
      byte[] buffer = new byte[bufferSize];
      while (digestInputStream.read(buffer) > 0) {}
      messageDigest = digestInputStream.getMessageDigest();
      
      byte[] resultByteArray = messageDigest.digest();
      
      return ConversionUtils.byte2hex(resultByteArray);
    }
    catch (NoSuchAlgorithmException e)
    {
      return "";
    }
    finally
    {
      try
      {
        if (digestInputStream != null) {
          digestInputStream.close();
        }
      }
      catch (Exception localException4) {}
      try
      {
        if (fileInputStream != null) {
          fileInputStream.close();
        }
      }
      catch (Exception localException5) {}
    }
  }
}
