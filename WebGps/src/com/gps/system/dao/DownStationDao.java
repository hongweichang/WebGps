package com.gps.system.dao;

import com.gps.system.model.DownStation;

public abstract interface DownStationDao
{
  public abstract DownStation findByName(String paramString);
  
  public abstract DownStation findBySsid(String paramString);
}
