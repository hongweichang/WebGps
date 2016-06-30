package com.gps.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.system.dao.AdAndNewsDao;
import com.gps.system.model.SysAd;
import com.gps.system.model.SysNews;
import com.gps.system.service.AdAndNewsService;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class AdAndNewsServiceImpl
  extends UniversalServiceImpl
  implements AdAndNewsService
{
  private AdAndNewsDao adAndNewsDao;
  private PaginationDao paginationDao;
  
  public AdAndNewsDao getAdAndNewsDao()
  {
    return this.adAndNewsDao;
  }
  
  public void setAdAndNewsDao(AdAndNewsDao adAndNewsDao)
  {
    this.adAndNewsDao = adAndNewsDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public Class getClazz()
  {
    return null;
  }
  
  public SysAd getAd(String idno)
  {
    return this.adAndNewsDao.getAd(idno);
  }
  
  public SysNews getNews(String idno)
  {
    return this.adAndNewsDao.getNews(idno);
  }
  
  public String save(Object obj)
  {
    return this.adAndNewsDao.save(obj);
  }
  
  public void update(Object obj)
  {
    this.adAndNewsDao.update(obj);
  }
  
  public void delete(Object obj)
  {
    this.adAndNewsDao.delete(obj);
  }
  
  public void batchDelete(List<Object> lists)
  {
    this.adAndNewsDao.batchDelete(lists);
  }
  
  public Object findByNameOrIdno(String entity, String name)
  {
    return this.adAndNewsDao.findByNameOrIdno(entity, name);
  }
  
  public Object findByIdno(String entity, String idno)
  {
    return this.adAndNewsDao.findByIdno(entity, idno);
  }
  
  public List<Object> findAll(String entity)
  {
    return this.adAndNewsDao.findAll(entity);
  }
  
  public AjaxDto<Object> getAdOrNewsList(String entity, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date d = new Date();
    Calendar rightNow = Calendar.getInstance();
    rightNow.setTime(d);
    
    Date dt = rightNow.getTime();
    String date = sdf.format(dt);
    String sql = "from " + entity + " where endTime >= '" + date + "'";
    if ((qtype != null) && (!qtype.isEmpty())) {
      sql = sql + " and " + qtype + " like '%" + queryFilter + "%'";
    }
    if ((sortname != null) && (!sortname.isEmpty())) {
      sql = sql + " order by " + sortname + " " + sortorder;
    }
    AjaxDto<Object> ajax = this.paginationDao.getPgntByQueryStr(sql, pagination);
    return ajax;
  }
  
  public List<Object> findPartList(String entity, String idno)
  {
    return this.adAndNewsDao.findPartList(entity, idno);
  }
}
