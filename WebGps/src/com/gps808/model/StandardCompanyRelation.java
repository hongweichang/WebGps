package com.gps808.model;

import java.util.Date;

public class StandardCompanyRelation
{
  private Integer id;
  private Integer companyId;
  private Integer childId;
  private Date updateTime;
  
  public StandardCompanyRelation() {}
  
  public StandardCompanyRelation(Integer companyId, Integer childId)
  {
    this.companyId = companyId;
    this.childId = childId;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public Integer getChildId()
  {
    return this.childId;
  }
  
  public void setChildId(Integer childId)
  {
    this.childId = childId;
  }
  
  public Date getUpdateTime()
  {
    return this.updateTime;
  }
  
  public void setUpdateTime(Date updateTime)
  {
    this.updateTime = updateTime;
  }
}
