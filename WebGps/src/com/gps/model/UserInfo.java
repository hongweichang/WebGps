package com.gps.model;

public class UserInfo
{
  public static final int CLIENT_PARENT_NULL = 0;
  public static final String SESSION_USER = "user";
  public static final String SESSION_ACCOUNT = "account";
  public static final String SESSION_ACCOUNTID = "accountid";
  public static final String SESSION_USERID = "userid";
  public static final String SESSION_USERNAME = "username";
  public static final String SESSION_CLIENTID = "clientid";
  public static final String SESSION_PRIVILEGE = "privilege";
  public static final String SESSION_DEVICE_NAME = "device_name_";
  public static final String SESSION_DEVICE_IOIN = "device_io_";
  public static final String SESSION_DEVICE_TEMPSENSOR = "device_tempsensor_";
  public static final String SESSION_DEVICE_CHANNEL = "device_channel_";
  public static final String SESSION_DEVICE_SHOW_LOCATION = "showlocation";
  public static final String SESSION_DEVICE_UPDATE_PWD = "updatepwd";
  public static final String DEFAULT_PASSWORD = "000000";
  public static final Integer DEFAULT_ROLE = Integer.valueOf(0);
  public static final Integer USER_ADMIN = Integer.valueOf(1);
  public static final Integer USER_DEMO = Integer.valueOf(2);
  private Integer id;
  private UserAccount userAccount;
  private Integer parentId;
  private String linkMan;
  private String telephone;
  private String address;
  private String email;
  private Integer isAdmin;
  private Integer roleId;
  private UserRole userRole;
  private String url;
  private Integer pwdStatus;
  
  public String getUrl()
  {
    return this.url;
  }
  
  public void setUrl(String url)
  {
    this.url = url;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public Integer getAccountId()
  {
    return this.userAccount.getId();
  }
  
  public UserAccount getUserAccount()
  {
    return this.userAccount;
  }
  
  public void setUserAccount(UserAccount userAccount)
  {
    this.userAccount = userAccount;
  }
  
  public Integer getParentId()
  {
    return this.parentId;
  }
  
  public void setParentId(Integer parentId)
  {
    this.parentId = parentId;
  }
  
  public String getLinkMan()
  {
    return this.linkMan;
  }
  
  public void setLinkMan(String linkMan)
  {
    this.linkMan = linkMan;
  }
  
  public String getTelephone()
  {
    return this.telephone;
  }
  
  public void setTelephone(String telephone)
  {
    this.telephone = telephone;
  }
  
  public String getAddress()
  {
    return this.address;
  }
  
  public void setAddress(String address)
  {
    this.address = address;
  }
  
  public String getEmail()
  {
    return this.email;
  }
  
  public void setEmail(String email)
  {
    this.email = email;
  }
  
  public Integer getIsAdmin()
  {
    return this.isAdmin;
  }
  
  public void setIsAdmin(Integer isAdmin)
  {
    this.isAdmin = isAdmin;
  }
  
  public Integer getRoleId()
  {
    return this.roleId;
  }
  
  public void setRoleId(Integer roleId)
  {
    this.roleId = roleId;
  }
  
  public UserRole getUserRole()
  {
    return this.userRole;
  }
  
  public void setUserRole(UserRole userRole)
  {
    this.userRole = userRole;
  }
  
  public Integer getPwdStatus()
  {
    return this.pwdStatus;
  }
  
  public void setPwdStatus(Integer pwdStatus)
  {
    this.pwdStatus = pwdStatus;
  }
}
