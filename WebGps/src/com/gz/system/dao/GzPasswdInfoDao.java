package com.gz.system.dao;

import com.gz.system.model.GzPasswdInfo;
import java.util.List;

public abstract interface GzPasswdInfoDao
{
  public abstract GzPasswdInfo get(String paramString);
  
  public abstract String save(GzPasswdInfo paramGzPasswdInfo);
  
  public abstract void update(GzPasswdInfo paramGzPasswdInfo);
  
  public abstract void delete(GzPasswdInfo paramGzPasswdInfo);
  
  public abstract void delete(String paramString);
  
  public abstract GzPasswdInfo findByMonitorId(String paramString);
  
  public abstract GzPasswdInfo findById(String paramString);
  
  public abstract List<GzPasswdInfo> findAll();
  
  public abstract int getPasswdCount(String paramString);
}
