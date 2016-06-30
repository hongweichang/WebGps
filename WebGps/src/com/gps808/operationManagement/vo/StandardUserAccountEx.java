package com.gps808.operationManagement.vo;

import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import java.util.Date;

public class StandardUserAccountEx
{
  private Integer id;
  private String nm;
  private String act;
  private Date vld;
  private Integer pid;
  private StandardUserRole role;
  private Integer stu;
  private Date utm;
  private Integer ism;
  private String pms;
  private Integer at;
  
  public StandardUserAccountEx() {}
  
  public StandardUserAccountEx(StandardUserAccount user)
  {
    this.id = user.getId();
    this.nm = user.getName();
    this.act = user.getAccount();
    this.vld = user.getValidity();
    if (user.getCompany() != null) {
      this.pid = user.getCompany().getId();
    }
    this.role = user.getRole();
    this.stu = user.getStatus();
    this.utm = user.getUpdateTime();
    this.ism = user.getIsMine();
    this.pms = user.getPermits();
    this.at = user.getAccountType();
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getNm()
  {
    return this.nm;
  }
  
  public void setNm(String nm)
  {
    this.nm = nm;
  }
  
  public String getAct()
  {
    return this.act;
  }
  
  public void setAct(String act)
  {
    this.act = act;
  }
  
  public Date getVld()
  {
    return this.vld;
  }
  
  public void setVld(Date vld)
  {
    this.vld = vld;
  }
  
  public Integer getPid()
  {
    return this.pid;
  }
  
  public void setPid(Integer pid)
  {
    this.pid = pid;
  }
  
  public StandardUserRole getRole()
  {
    return this.role;
  }
  
  public void setRole(StandardUserRole role)
  {
    this.role = role;
  }
  
  public Integer getStu()
  {
    return this.stu;
  }
  
  public void setStu(Integer stu)
  {
    this.stu = stu;
  }
  
  public Date getUtm()
  {
    return this.utm;
  }
  
  public void setUtm(Date utm)
  {
    this.utm = utm;
  }
  
  public Integer getIsm()
  {
    return this.ism;
  }
  
  public void setIsm(Integer ism)
  {
    this.ism = ism;
  }
  
  public String getPms()
  {
    return this.pms;
  }
  
  public void setPms(String pms)
  {
    this.pms = pms;
  }
  
  public Integer getAt()
  {
    return this.at;
  }
  
  public void setAt(Integer at)
  {
    this.at = at;
  }
}
