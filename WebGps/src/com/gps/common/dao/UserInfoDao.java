package com.gps.common.dao;

import com.gps.model.UserInfo;

public abstract interface UserInfoDao
{
  public abstract UserInfo findByLoginName(String paramString);
  
  public abstract UserInfo findByLoginAccout(Integer paramInteger);
  
  public abstract UserInfo findByName(String paramString);
}
