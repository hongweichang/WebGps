package com.gps808.operationManagement.dao;

import com.gps.model.UserSession;

public abstract interface StandardUserSessionDao
{
  public abstract UserSession getUserSession(String paramString);
}
