package com.gps808.model;

public class StandardRuleMaintain
{
  public static final int RULE_FATIGUE = 1;
  public static final int RULE_FORBIDINTO = 2;
  public static final int RULE_FORBIDOUT = 3;
  public static final int RULE_AREASPEED = 4;
  public static final int RULE_PERIODSPEED = 5;
  public static final int RULE_PARKINGTOOLONG = 6;
  public static final int RULE_LINEOFFSET = 7;
  public static final int RULE_TIMINGPICTURE = 8;
  public static final int RULE_TIMERRECORDING = 9;
  public static final int RULE_WIFIDOWNLOAD = 10;
  public static final int RULE_LINERANGELIMIT = 11;
  public static final int RULE_KEYPOINT = 12;
  public static final int RULE_ALARMLINKAGE = 13;
  public static final int RULE_ROADGRADE = 14;
  private Integer id;
  private String name;
  private Integer markId;
  private StandardCompany company;
  private Integer type;
  private Integer armType;
  private Integer beginTime;
  private Integer endTime;
  private String text;
  private String param;
  private String selatp;
  private Integer areaType;
  private Integer parentId;
  
  public String getSelatp()
  {
    return this.selatp;
  }
  
  public void setSelatp(String selatp)
  {
    this.selatp = selatp;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public Integer getArmType()
  {
    return this.armType;
  }
  
  public void setArmType(Integer armType)
  {
    this.armType = armType;
  }
  
  public Integer getBeginTime()
  {
    return this.beginTime;
  }
  
  public void setBeginTime(Integer beginTime)
  {
    this.beginTime = beginTime;
  }
  
  public Integer getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Integer endTime)
  {
    this.endTime = endTime;
  }
  
  public String getText()
  {
    return this.text;
  }
  
  public void setText(String text)
  {
    this.text = text;
  }
  
  public String getParam()
  {
    return this.param;
  }
  
  public void setParam(String param)
  {
    this.param = param;
  }
  
  public Integer getMarkId()
  {
    return this.markId;
  }
  
  public void setMarkId(Integer markId)
  {
    this.markId = markId;
  }
  
  public Integer getAreaType()
  {
    return this.areaType;
  }
  
  public void setAreaType(Integer areaType)
  {
    this.areaType = areaType;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
}
