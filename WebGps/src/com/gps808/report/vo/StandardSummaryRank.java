package com.gps808.report.vo;

public class StandardSummaryRank
{
  private String vehiIdno;
  private Integer companyId;
  private Integer count;
  private Integer rank;
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
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
  
  public Integer getRank()
  {
    return this.rank;
  }
  
  public void setRank(Integer rank)
  {
    this.rank = rank;
  }
}
