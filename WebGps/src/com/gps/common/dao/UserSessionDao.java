package com.gps.common.dao;

import com.gps.model.UserSession;

public abstract interface UserSessionDao
{
  public abstract int getOnlineCount(String paramString);
  
  public abstract UserSession getUserSession(String paramString);
}
