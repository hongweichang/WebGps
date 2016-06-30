package com.gps808.vdo.Vo;

import java.io.Serializable;

public class ErrorLog
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String content;
  private String dtime;
  
  public void setContent(String content)
  {
    this.content = content;
  }
  
  public String getContent()
  {
    return this.content;
  }
  
  public void setDtime(String dtime)
  {
    this.dtime = dtime;
  }
  
  public String getDtime()
  {
    return this.dtime;
  }
}
