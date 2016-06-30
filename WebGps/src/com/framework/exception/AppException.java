package com.framework.exception;

import org.springframework.dao.DataAccessException;

public class AppException
  extends DataAccessException
{
  private static final long serialVersionUID = -8495283140194896459L;
  private int errorCode;
  private String msg = "未知错误";
  
  public AppException(String message)
  {
    super(message);
    this.errorCode = -99999;
    this.msg = message;
  }
  
  public AppException(int errorCode)
  {
    super("DataAccessException");
    this.errorCode = errorCode;
  }
  
  public AppException(int errorCode, String message)
  {
    super(message);
    this.errorCode = errorCode;
    this.msg = message;
  }
  
  public int getErrorCode()
  {
    return this.errorCode;
  }
  
  public void setErrorCode(int errorCode)
  {
    this.errorCode = errorCode;
  }
  
  public String getDescription()
  {
    return this.msg;
  }
}
