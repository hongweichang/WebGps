package com.gps808.operationManagement.vo;

import com.gps808.model.StandardVehiDevRelationEx;

public class StandardVehiDevRelationExMore
  extends StandardVehiDevRelationEx
{
  private Integer devId;
  private Integer devComId;
  private Integer nflt;
  private String cardNum;
  private String ioInName;
  private String chnName;
  private String tempName;
  private Integer plateType;
  
  public Integer getDevId()
  {
    return this.devId;
  }
  
  public void setDevId(Integer devId)
  {
    this.devId = devId;
  }
  
  public Integer getDevComId()
  {
    return this.devComId;
  }
  
  public void setDevComId(Integer devComId)
  {
    this.devComId = devComId;
  }
  
  public String getCardNum()
  {
    return this.cardNum;
  }
  
  public void setCardNum(String cardNum)
  {
    this.cardNum = cardNum;
  }
  
  public String getIoInName()
  {
    return this.ioInName;
  }
  
  public void setIoInName(String ioInName)
  {
    this.ioInName = ioInName;
  }
  
  public String getChnName()
  {
    return this.chnName;
  }
  
  public void setChnName(String chnName)
  {
    this.chnName = chnName;
  }
  
  public String getTempName()
  {
    return this.tempName;
  }
  
  public void setTempName(String tempName)
  {
    this.tempName = tempName;
  }
  
  public Integer getPlateType()
  {
    return this.plateType;
  }
  
  public void setPlateType(Integer plateType)
  {
    this.plateType = plateType;
  }
  
  public Integer getNflt()
  {
    return this.nflt;
  }
  
  public void setNflt(Integer nflt)
  {
    this.nflt = nflt;
  }
}
