package com.gps.common.dao;

import com.gps.model.ServerInfo;
import java.util.List;

public abstract interface ServerInfoDao
{
  public abstract List<ServerInfo> findAll(Integer paramInteger);
  
  public abstract Boolean getOnline(String paramString);
}
