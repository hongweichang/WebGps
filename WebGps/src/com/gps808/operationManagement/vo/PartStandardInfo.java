package com.gps808.operationManagement.vo;

public class PartStandardInfo
{
  private String id;
  private String name;
  private Integer parentId;
  private Integer level;
  private Integer companyId;
  private Integer count;
  private Integer temp;
  private Integer obd;
  private Integer tpms;
  
  public Integer getLevel()
  {
    return this.level;
  }
  
  public void setLevel(Integer level)
  {
    this.level = level;
  }
  
  public String getId()
  {
    return this.id;
  }
  
  public void setId(String id)
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
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public Integer getCount()
  {
    return this.count;
  }
  
  public void setCount(Integer count)
  {
    this.count = count;
  }
  
  public Integer getTemp()
  {
    return this.temp;
  }
  
  public void setTemp(Integer temp)
  {
    this.temp = temp;
  }
  
  public Integer getObd()
  {
    return this.obd;
  }
  
  public void setObd(Integer obd)
  {
    this.obd = obd;
  }
  
  public Integer getTpms()
  {
    return this.tpms;
  }
  
  public void setTpms(Integer tpms)
  {
    this.tpms = tpms;
  }
}
