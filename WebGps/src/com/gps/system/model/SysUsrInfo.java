package com.gps.system.model;

import java.io.Serializable;
import java.util.Date;

public class SysUsrInfo
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  public static final String SESSION_SYSUSER = "sysuser";
  public static final String SESSION_USERID = "userid";
  public static final String SESSION_USERNAME = "username";
  public static final String SESSION_ROLE = "role";
  public static final String SESSION_LASTLOGINADDR = "logintime";
  public static final String SESSION_LASTLOGINTIME = "loginaddr";
  public static final String SESSION_DEVICE_UPDATE_PWD = "updatepwd";
  public static final Integer ROLE_TYPE_MGR = Integer.valueOf(1);
  public static final Integer ROLE_TYPE_USER = Integer.valueOf(2);
  private Integer id;
  private String name;
  private String password;
  private Short role;
  private String telephone;
  private String email;
  private Date lastLoginTime;
  private String lastLoginAddr;
  
  public SysUsrInfo() {}
  
  public SysUsrInfo(Integer id, String name, String password, Short role, String telephone, String email, Date lastLoginTime, String lastLoginAddr)
  {
    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
    this.telephone = telephone;
    this.email = email;
    this.lastLoginTime = lastLoginTime;
    this.lastLoginAddr = lastLoginAddr;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setPassword(String password)
  {
    this.password = password;
  }
  
  public String getPassword()
  {
    return this.password;
  }
  
  public void setRole(Short role)
  {
    this.role = role;
  }
  
  public Short getRole()
  {
    return this.role;
  }
  
  public void setTelephone(String telephone)
  {
    this.telephone = telephone;
  }
  
  public String getTelephone()
  {
    return this.telephone;
  }
  
  public void setEmail(String email)
  {
    this.email = email;
  }
  
  public String getEmail()
  {
    return this.email;
  }
  
  public void setLastLoginTime(Date lastLoginTime)
  {
    this.lastLoginTime = lastLoginTime;
  }
  
  public Date getLastLoginTime()
  {
    return this.lastLoginTime;
  }
  
  public void setLastLoginAddr(String lastLoginAddr)
  {
    this.lastLoginAddr = lastLoginAddr;
  }
  
  public String getLastLoginAddr()
  {
    return this.lastLoginAddr;
  }
  
  public boolean equals(Object obj)
  {
    if (this == obj) {
      return true;
    }
    if ((obj != null) && 
      (obj.getClass() == SysUsrInfo.class))
    {
      SysUsrInfo cmsusr = (SysUsrInfo)obj;
      return getName().equals(cmsusr.getName());
    }
    return false;
  }
  
  public int hashCode()
  {
    return this.name.hashCode();
  }
}
