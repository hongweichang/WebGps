package com.gps.vo;

import java.util.List;

public class VehicleInfo
{
  private Integer id;
  private String vehiIDNO;
  private Integer companyId;
  private Integer plateType;
  private String vehiColor;
  private Integer icon;
  private Integer chnCount;
  private String chnName;
  private List<StandardDeviceInfo> device;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getVehiIDNO()
  {
    return this.vehiIDNO;
  }
  
  public void setVehiIDNO(String vehiIDNO)
  {
    this.vehiIDNO = vehiIDNO;
  }
  
  public Integer getCompanyId()
  {
    return this.companyId;
  }
  
  public void setCompanyId(Integer companyId)
  {
    this.companyId = companyId;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public String getVehiColor()
  {
    return this.vehiColor;
  }
  
  public void setVehiColor(String vehiColor)
  {
    this.vehiColor = vehiColor;
  }
  
  public Integer getIcon()
  {
    return this.icon;
  }
  
  public void setIcon(Integer icon)
  {
    this.icon = icon;
  }
  
  public List<StandardDeviceInfo> getDevice()
  {
    return this.device;
  }
  
  public void setDevice(List<StandardDeviceInfo> device)
  {
    this.device = device;
  }
  
  public String getChnName()
  {
    return this.chnName;
  }
  
  public void setChnName(String chnName)
  {
    this.chnName = chnName;
  }
  
  public Integer getChnCount()
  {
    return this.chnCount;
  }
  
  public void setChnCount(Integer chnCount)
  {
    this.chnCount = chnCount;
  }
}
