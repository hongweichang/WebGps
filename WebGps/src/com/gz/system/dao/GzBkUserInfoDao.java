package com.gz.system.dao;

import com.gz.system.model.GzBkUserInfo;
import java.util.List;

public abstract interface GzBkUserInfoDao
{
  public abstract GzBkUserInfo get(Integer paramInteger);
  
  public abstract String save(GzBkUserInfo paramGzBkUserInfo);
  
  public abstract void update(GzBkUserInfo paramGzBkUserInfo);
  
  public abstract void delete(GzBkUserInfo paramGzBkUserInfo);
  
  public abstract void delete(Integer paramInteger);
  
  public abstract GzBkUserInfo findByName(String paramString);
  
  public abstract GzBkUserInfo findById(Integer paramInteger);
  
  public abstract List<GzBkUserInfo> findAll();
  
  public abstract int getBkUserCount(String paramString);
}
