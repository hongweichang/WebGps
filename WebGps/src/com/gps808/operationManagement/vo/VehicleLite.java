package com.gps808.operationManagement.vo;

import java.util.List;

public class VehicleLite
{
  protected String id;
  protected String idno;
  protected String name;
  protected Integer parentId;
  protected Integer icon;
  protected String driverName;
  protected String driverTele;
  protected List<DeviceLite> devList;
  
  public List<DeviceLite> getDevList()
  {
    return this.devList;
  }
  
  public void setDevList(List<DeviceLite> devList)
  {
    this.devList = devList;
  }
  
  public void addDevList(DeviceLite device)
  {
    this.devList.add(device);
  }
  
  public String getDriverName()
  {
    return this.driverName;
  }
  
  public void setDriverName(String driverName)
  {
    this.driverName = driverName;
  }
  
  public String getDriverTele()
  {
    return this.driverTele;
  }
  
  public void setDriverTele(String driverTele)
  {
    this.driverTele = driverTele;
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
  
  public String getIdno()
  {
    return this.idno;
  }
  
  public void setIdno(String idno)
  {
    this.idno = idno;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
  
  public Integer getIcon()
  {
    return this.icon;
  }
  
  public void setIcon(Integer icon)
  {
    this.icon = icon;
  }
}
