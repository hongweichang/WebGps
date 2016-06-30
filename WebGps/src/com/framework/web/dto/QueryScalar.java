package com.framework.web.dto;

import org.hibernate.type.Type;

public class QueryScalar
{
  private String value;
  private Type type;
  
  public String getValue()
  {
    return this.value;
  }
  
  public void setValue(String value)
  {
    this.value = value;
  }
  
  public Type getType()
  {
    return this.type;
  }
  
  public void setType(Type type)
  {
    this.type = type;
  }
  
  public QueryScalar(String value, Type type)
  {
    this.value = value;
    this.type = type;
  }
}
