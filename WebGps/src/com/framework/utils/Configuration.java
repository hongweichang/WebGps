package com.framework.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Properties;

public class Configuration
{
  private Properties propertie;
  private FileInputStream inputFile;
  private FileOutputStream outputFile;
  
  public Configuration()
  {
    this.propertie = new Properties();
  }
  
  public Configuration(String filePath)
  {
    this.propertie = new Properties();
    try
    {
      this.inputFile = new FileInputStream(filePath.replace('/', '\\'));
      this.propertie.load(this.inputFile);
      this.inputFile.close();
    }
    catch (FileNotFoundException ex)
    {
      System.out.println("读取属性文件--->失败- 原因：文件路劲错误或者文件不存在");
      ex.printStackTrace();
    }
    catch (IOException ex)
    {
      System.out.println("装载文件--->失败!");
      ex.printStackTrace();
    }
  }
  
  public String getValue(String key)
  {
    if (this.propertie.containsKey(key))
    {
      String value = this.propertie.getProperty(key);
      return value;
    }
    return "";
  }
  
  public String getValue(String fileName, String key)
  {
    try
    {
      String value = "";
      this.inputFile = new FileInputStream(fileName);
      this.propertie.load(this.inputFile);
      this.inputFile.close();
      if (this.propertie.containsKey(key)) {
        return this.propertie.getProperty(key);
      }
      return value;
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
      return "";
    }
    catch (IOException e)
    {
      e.printStackTrace();
      return "";
    }
    catch (Exception ex)
    {
      ex.printStackTrace();
    }
    return "";
  }
  
  public void clear()
  {
    this.propertie.clear();
  }
  
  public void setValue(String key, String value)
  {
    this.propertie.setProperty(key, value);
  }
  
  public void saveFile(String fileName, String description)
  {
    try
    {
      this.outputFile = new FileOutputStream(fileName);
      this.propertie.store(this.outputFile, description);
      this.outputFile.close();
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
    }
    catch (IOException ioe)
    {
      ioe.printStackTrace();
    }
  }
  
  public static void main(String[] args)
  {
    Configuration rc = new Configuration("./config/test.properties");
    
    String ip = rc.getValue("ipp");
    String host = rc.getValue("host");
    String tab = rc.getValue("tab");
    
    System.out.println("ip = " + ip + "ip-test leng = " + "ip-test".length());
    System.out.println("ip's length = " + ip.length());
    System.out.println("host = " + host);
    System.out.println("tab = " + tab);
    
    Configuration cf = new Configuration();
    String ipp = cf.getValue("./config/test.properties", "ip");
    System.out.println("ipp = " + ipp);
    
    cf.setValue("min", "999");
    cf.setValue("max", "1000");
    cf.saveFile("./config/save.perperties", "test");
  }
}
