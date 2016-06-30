package com.gps.vo;

public class VehicleTeam
{
  private Integer id;
  private Integer parentId;
  private String name;
  private Integer level;
  
  public Integer getLevel()
  {
    return this.level;
  }
  
  public void setLevel(Integer level)
  {
    this.level = level;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
}
