package com.framework.encrypt;

import java.security.SecureRandom;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

public class DESedeEncryptUtils
{
  private static final String ALGORIHM = "DESede";
  
  public static String encrypt(String text, String encryptKey)
  {
    try
    {
      SecureRandom sr = new SecureRandom();
      
      DESedeKeySpec dks = new DESedeKeySpec(encryptKey.getBytes());
      
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DESede");
      SecretKey securekey = keyFactory.generateSecret(dks);
      
      Cipher cipher = Cipher.getInstance("DESede");
      
      cipher.init(1, securekey, sr);
      
      return ConversionUtils.byte2hex(cipher.doFinal(text.getBytes()));
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    return null;
  }
  
  public static String dencrypt(String encryptTxt, String encryptKey)
  {
    try
    {
      SecureRandom sr = new SecureRandom();
      
      DESedeKeySpec dks = new DESedeKeySpec(encryptKey.getBytes());
      
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DESede");
      SecretKey securekey = keyFactory.generateSecret(dks);
      
      Cipher cipher = Cipher.getInstance("DESede");
      
      cipher.init(2, securekey, sr);
      
      return new String(cipher.doFinal(ConversionUtils.hex2byte(encryptTxt)));
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    return null;
  }
}
