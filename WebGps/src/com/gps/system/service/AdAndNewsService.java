package com.gps.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.system.model.SysAd;
import com.gps.system.model.SysNews;
import java.util.List;

public abstract interface AdAndNewsService
  extends UniversalService
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
  
  public abstract AjaxDto<Object> getAdOrNewsList(String paramString1, Pagination paramPagination, String paramString2, String paramString3, String paramString4, String paramString5);
  
  public abstract List<Object> findPartList(String paramString1, String paramString2);
}
