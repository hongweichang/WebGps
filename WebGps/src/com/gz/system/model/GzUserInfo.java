package com.gz.system.model;

import java.io.Serializable;

public class GzUserInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String username;
  private String password;
  private String companyname;
  private String phone;
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getUsername()
  {
    return this.username;
  }
  
  public void setUsername(String username)
  {
    this.username = username;
  }
  
  public String getPassword()
  {
    return this.password;
  }
  
  public void setPassword(String password)
  {
    this.password = password;
  }
  
  public String getCompanyname()
  {
    return this.companyname;
  }
  
  public void setCompanyname(String companyname)
  {
    this.companyname = companyname;
  }
  
  public String getPhone()
  {
    return this.phone;
  }
  
  public void setPhone(String phone)
  {
    this.phone = phone;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
