package com.gps.user.vo;

import java.util.ArrayList;
import java.util.List;

public class UserPrivi
{
  private Integer privi;
  private String name;
  private String url;
  private List<UserSubPrivi> listSubPrivi;
  
  public UserPrivi() {}
  
  public UserPrivi(Integer privi)
  {
    this.privi = privi;
  }
  
  public UserPrivi(Integer privi, String url)
  {
    this.privi = privi;
    this.url = url;
  }
  
  public UserPrivi(Integer privi, String name, String url)
  {
    this.privi = privi;
    this.name = name;
    this.url = url;
  }
  
  public Integer getPrivi()
  {
    return this.privi;
  }
  
  public void setPrivi(Integer privi)
  {
    this.privi = privi;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getUrl()
  {
    return this.url;
  }
  
  public void setUrl(String url)
  {
    this.url = url;
  }
  
  public void setListSubPrivi(List<UserSubPrivi> listSubPrivi)
  {
    this.listSubPrivi = listSubPrivi;
  }
  
  public List<UserSubPrivi> getListSubPrivi()
  {
    return this.listSubPrivi;
  }
  
  public void addSubPrivi(Integer privi, String url)
  {
    if (this.listSubPrivi == null) {
      this.listSubPrivi = new ArrayList();
    }
    UserSubPrivi subPrivi = new UserSubPrivi();
    subPrivi.setPrivi(privi);
    subPrivi.setUrl(url);
    this.listSubPrivi.add(subPrivi);
  }
  
  public void addSubPriviEx(Integer privi, String name, String url)
  {
    if (this.listSubPrivi == null) {
      this.listSubPrivi = new ArrayList();
    }
    UserSubPrivi subPrivi = new UserSubPrivi();
    subPrivi.setPrivi(privi);
    subPrivi.setName(name);
    subPrivi.setUrl(url);
    this.listSubPrivi.add(subPrivi);
  }
}
