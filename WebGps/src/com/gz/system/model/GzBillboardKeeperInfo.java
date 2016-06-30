package com.gz.system.model;

import java.io.Serializable;

public class GzBillboardKeeperInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String id;
  private String name;
  private String addr;
  private Integer type;
  private Integer flowtype;
  
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
  
  public String getAddr()
  {
    return this.addr;
  }
  
  public void setAddr(String addr)
  {
    this.addr = addr;
  }
  
  public Integer getType()
  {
    return this.type;
  }
  
  public void setType(Integer type)
  {
    this.type = type;
  }
  
  public Integer getFlowtype()
  {
    return this.flowtype;
  }
  
  public void setFlowtype(Integer flowtype)
  {
    this.flowtype = flowtype;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
