package com.framework.exception;

public class SysException
  extends Throwable
{
  private static final long serialVersionUID = -8495283140194896459L;
  
  public SysException(String message)
  {
    super(message);
  }
  
  public SysException(String message, Throwable cause)
  {
    super(message, cause);
  }
  
  public SysException(Throwable cause)
  {
    super(cause);
  }
}
