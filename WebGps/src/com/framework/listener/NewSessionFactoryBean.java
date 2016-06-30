package com.framework.listener;

import com.framework.logger.Logger;
import com.framework.web.dao.HibernateDaoSupportEx;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Properties;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;

public class NewSessionFactoryBean
  extends LocalSessionFactoryBean
{
  private final transient Logger log = Logger.getLogger(NewSessionFactoryBean.class);
  
  protected SessionFactory newSessionFactory(Configuration config)
    throws HibernateException
  {
    try
    {
      String configPath = getConfigPath();
      
      loadLuZhengXML(config, configPath);
      
      loadLineManagementXML(config, configPath);
    }
    catch (Exception ex)
    {
      ex.printStackTrace();
      this.log.error(ex.getMessage(), ex);
    }
    this.log.info("构建sessionFactory...");
    return config.buildSessionFactory();
  }
  
  protected String getConfigPath()
    throws UnsupportedEncodingException, URISyntaxException
  {
    URL url = HibernateDaoSupportEx.class.getResource("/");
    String mainPath = URLDecoder.decode(url.toURI().toString(), "utf-8").replaceAll("file:/", "");
    File file = new File(mainPath);
    String configPath = file.getParentFile().getParentFile().getParentFile().getParentFile().getParentFile().getAbsolutePath();
    configPath = configPath + "\\HibernateConfig.ini";
    
    return configPath;
  }
  
  protected void loadLuZhengXML(Configuration config, String configPath)
    throws UnsupportedEncodingException, URISyntaxException
  {
    String luzheng = getValue(configPath, "LUZHENG");
    if ((luzheng != null) && (!luzheng.isEmpty()))
    {
      URL url = HibernateDaoSupportEx.class.getResource("/com/gps/more/model/");
      String xmlPath = URLDecoder.decode(url.toURI().toString(), "utf-8").replaceAll("file:/", "");
      
      String[] list = luzheng.split("\\|");
      if ((list != null) && (list.length > 0)) {
        for (int i = 0; i < list.length; i++)
        {
          String fileName = xmlPath + list[i] + ".hbm.xml";
          File xmlFile = new File(fileName);
          if ((xmlFile.exists()) && (xmlFile.isFile()))
          {
            config.addFile(xmlFile);
            this.log.info("添加动态映射文件" + xmlFile.toString() + "到Configuration中...");
          }
        }
      }
    }
  }
  
  protected void loadLineManagementXML(Configuration config, String configPath)
    throws UnsupportedEncodingException, URISyntaxException
  {
    String line = getValue(configPath, "LINEMANAGE");
    if ((line != null) && (!line.isEmpty()))
    {
      URL url = HibernateDaoSupportEx.class.getResource("/com/gps808/model/line/");
      String xmlPath = URLDecoder.decode(url.toURI().toString(), "utf-8").replaceAll("file:/", "");
      
      String[] list = line.split("\\|");
      if ((list != null) && (list.length > 0)) {
        for (int i = 0; i < list.length; i++)
        {
          String fileName = xmlPath + list[i] + ".hbm.xml";
          File xmlFile = new File(fileName);
          if ((xmlFile.exists()) && (xmlFile.isFile()))
          {
            config.addFile(xmlFile);
            this.log.info("添加动态映射文件" + xmlFile.toString() + "到Configuration中...");
          }
        }
      }
    }
  }
  
  public String getValue(String fileName, String key)
  {
    try
    {
      File file = new File(fileName);
      if ((file.exists()) && (file.isFile()))
      {
        String value = "";
        FileInputStream inputFile = new FileInputStream(fileName);
        Properties propertie = new Properties();
        propertie.load(inputFile);
        inputFile.close();
        if (propertie.containsKey(key)) {
          return propertie.getProperty(key);
        }
        return value;
      }
      return "";
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
}
