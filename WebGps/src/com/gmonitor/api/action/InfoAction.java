package com.gmonitor.api.action;

import com.framework.web.action.BaseAction;
import java.io.File;
import javax.servlet.ServletContext;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;

public class InfoAction
  extends BaseAction
{
  private static boolean gIsReadInformation = false;
  
  protected String getConfigValue(PropertiesConfiguration config, String key, String def)
  {
    String value = config.getString(key);
    if ((value == null) || (value.isEmpty())) {
      return def;
    }
    return value;
  }
  
  protected String getLastestFile(String filePath, String fileSuffix)
  {
    String lastestFile = "";
    long lastModified = 0L;
    File file = new File(filePath);
    if (file.exists())
    {
      File[] files = file.listFiles();
      for (int i = 0; i < files.length; i++) {
        if (files[i].isFile())
        {
          String fileName = files[i].getName();
          int index = fileName.toUpperCase().lastIndexOf(fileSuffix.toUpperCase());
          if ((index != -1) && (index == fileName.length() - fileSuffix.length()) && 
            (files[i].lastModified() > lastModified))
          {
            lastestFile = files[i].getName();
            lastModified = files[i].lastModified();
          }
        }
      }
    }
    return lastestFile;
  }
  
  protected String getVersionDate(String date)
  {
    if (date.length() > 8) {
      return date.substring(0, 8);
    }
    return date;
  }
  
  public String getInfo()
  {
    if (!gIsReadInformation)
    {
      gIsReadInformation = true;
      
      ServletContext context = getServletContext();
      PropertiesConfiguration config = new PropertiesConfiguration();
      config.setEncoding("UTF-16");
      try
      {
        config.load(context.getRealPath("WEB-INF\\classes\\config\\gmonitor.properties"));
      }
      catch (ConfigurationException e)
      {
        e.printStackTrace();
      }
    }
    return "success";
  }
}
