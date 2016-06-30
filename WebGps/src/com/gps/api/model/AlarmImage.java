package com.gps.api.model;

import java.util.Date;

public class AlarmImage
{
  private String guid;
  private String devIdno;
  private Date imageTime;
  private String imageUrl;
  private String imagePath;
  private String imageSvrIdno;
  
  public String getGuid()
  {
    return this.guid;
  }
  
  public void setGuid(String guid)
  {
    this.guid = guid;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Date getImageTime()
  {
    return this.imageTime;
  }
  
  public void setImageTime(Date imageTime)
  {
    this.imageTime = imageTime;
  }
  
  public String getImageUrl()
  {
    return this.imageUrl;
  }
  
  public void setImageUrl(String imageUrl)
  {
    this.imageUrl = imageUrl;
  }
  
  public String getImagePath()
  {
    return this.imagePath;
  }
  
  public void setImagePath(String imagePath)
  {
    this.imagePath = imagePath;
  }
  
  public String getImageSvrIdno()
  {
    return this.imageSvrIdno;
  }
  
  public void setImageSvrIdno(String imageSvrIdno)
  {
    this.imageSvrIdno = imageSvrIdno;
  }
}
