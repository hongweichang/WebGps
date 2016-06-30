package com.gps.user.vo;

public class UserSubPrivi
{
  private Integer privi;
  private String name;
  private String url;
  
  public String getUrl()
  {
    return this.url;
  }
  
  public void setUrl(String url)
  {
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
  
  public UserSubPrivi() {}
  
  public UserSubPrivi(Integer privi, String name, String url)
  {
    this.privi = privi;
    this.name = name;
    this.url = url;
  }
}
