package com.gps.system.model;

import java.io.Serializable;
import java.util.Date;

public class SysNews
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String title;
  private String content;
  private Date atime;
  private Date endTime;
  private String atimeStr;
  private String endTimeStr;
  
  public String getAtimeStr()
  {
    return this.atimeStr;
  }
  
  public void setAtimeStr(String atimeStr)
  {
    this.atimeStr = atimeStr;
  }
  
  public String getEndTimeStr()
  {
    return this.endTimeStr;
  }
  
  public void setEndTimeStr(String endTimeStr)
  {
    this.endTimeStr = endTimeStr;
  }
  
  public Date getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Date endTime)
  {
    this.endTime = endTime;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getTitle()
  {
    return this.title;
  }
  
  public void setTitle(String title)
  {
    this.title = title;
  }
  
  public String getContent()
  {
    return this.content;
  }
  
  public void setContent(String content)
  {
    this.content = content;
  }
  
  public Date getAtime()
  {
    return this.atime;
  }
  
  public void setAtime(Date atime)
  {
    this.atime = atime;
  }
}
