package com.gps.system.dao;

import com.gps.system.model.ServerLog;
import java.util.List;

public abstract interface ServerLogDao
{
  public abstract int getLogCount(String paramString1, String paramString2);
  
  public abstract List<ServerLog> getLogList(String paramString1, String paramString2, Integer paramInteger1, Integer paramInteger2);
}
