package com.framework.logger;

import org.apache.log4j.Level;

public class Logger
{
  org.apache.log4j.Logger log4jLogger = null;
  
  public static Logger getLogger(String arg)
  {
    Logger logger = new Logger();
    logger.log4jLogger = org.apache.log4j.Logger.getLogger(arg);
    return logger;
  }
  
  public static Logger getLogger(Class className)
  {
    return getLogger(className.getName());
  }
  
  public static Logger getLogger(Object object)
  {
    return getLogger(object.getClass().getName());
  }
  
  public void log(Level l, Object message)
  {
    this.log4jLogger.log(l, message);
  }
  
  public void log(Level l, Object message, Throwable e)
  {
    this.log4jLogger.log(l, message, e);
  }
  
  public void debug(Object message)
  {
    this.log4jLogger.debug(message);
  }
  
  public void debug(Object message, Throwable e)
  {
    this.log4jLogger.debug(message, e);
  }
  
  public void info(Object message)
  {
    this.log4jLogger.info(message);
  }
  
  public void info(Object message, Throwable e)
  {
    this.log4jLogger.info(message, e);
  }
  
  public void warn(Object message)
  {
    this.log4jLogger.warn(message);
  }
  
  public void warn(Object message, Throwable e)
  {
    this.log4jLogger.warn(message, e);
  }
  
  public void error(Object message)
  {
    this.log4jLogger.error(message);
  }
  
  public void error(Object message, Throwable e)
  {
    this.log4jLogger.error(message, e);
  }
  
  public void fatal(Object message)
  {
    this.log4jLogger.fatal(message);
  }
  
  public void fatal(Object message, Throwable e)
  {
    this.log4jLogger.fatal(message, e);
  }
  
  public boolean isDebugEnabled()
  {
    return this.log4jLogger.isDebugEnabled();
  }
  
  public boolean isInfoEnabled()
  {
    return this.log4jLogger.isInfoEnabled();
  }
}
