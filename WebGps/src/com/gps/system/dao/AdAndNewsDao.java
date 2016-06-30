package com.gps.system.dao;

import com.gps.system.model.SysAd;
import com.gps.system.model.SysNews;
import java.util.List;

public abstract interface AdAndNewsDao
{
  public abstract SysAd getAd(String paramString);
  
  public abstract SysNews getNews(String paramString);
  
  public abstract String save(Object paramObject);
  
  public abstract void update(Object paramObject);
  
  public abstract void delete(Object paramObject);
  
  public abstract void batchDelete(List<Object> paramList);
  
  public abstract Object findByNameOrIdno(String paramString1, String paramString2);
  
  public abstract Object findByIdno(String paramString1, String paramString2);
  
  public abstract List<Object> findAll(String paramString);
  
  public abstract List<Object> findPartList(String paramString1, String paramString2);
}
