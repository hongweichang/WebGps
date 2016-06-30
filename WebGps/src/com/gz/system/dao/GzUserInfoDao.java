package com.gz.system.dao;

import com.gz.system.model.GzUserInfo;
import java.util.List;

public abstract interface GzUserInfoDao
{
  public abstract GzUserInfo get(Integer paramInteger);
  
  public abstract String save(GzUserInfo paramGzUserInfo);
  
  public abstract void update(GzUserInfo paramGzUserInfo);
  
  public abstract void delete(GzUserInfo paramGzUserInfo);
  
  public abstract void delete(Integer paramInteger);
  
  public abstract GzUserInfo findByName(String paramString);
  
  public abstract GzUserInfo findById(Integer paramInteger);
  
  public abstract List<GzUserInfo> findAll();
  
  public abstract int getUserCount(String paramString);
}
