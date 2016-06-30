package com.gps808.operationManagement.vo;

import com.gps808.model.StandardCompany;

public class StandardVehicleMaturity
{
  private String vehiIDNO;
  private StandardCompany company;
  private Integer plateType;
  private String safe;
  private String driving;
  private String operating;
  private String service;
  private String status;
  
  public String getVehiIDNO()
  {
    return this.vehiIDNO;
  }
  
  public void setVehiIDNO(String vehiIDNO)
  {
    this.vehiIDNO = vehiIDNO;
  }
  
  public StandardCompany getCompany()
  {
    return this.company;
  }
  
  public void setCompany(StandardCompany company)
  {
    this.company = company;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public String getSafe()
  {
    return this.safe;
  }
  
  public void setSafe(String safe)
  {
    this.safe = safe;
  }
  
  public String getDriving()
  {
    return this.driving;
  }
  
  public void setDriving(String driving)
  {
    this.driving = driving;
  }
  
  public String getOperating()
  {
    return this.operating;
  }
  
  public void setOperating(String operating)
  {
    this.operating = operating;
  }
  
  public String getService()
  {
    return this.service;
  }
  
  public void setService(String service)
  {
    this.service = service;
  }
  
  public String getStatus()
  {
    return this.status;
  }
  
  public void setStatus(String status)
  {
    this.status = status;
  }
}
