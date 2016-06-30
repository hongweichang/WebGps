package com.gps.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.system.dao.AdAndNewsDao;
import com.gps.system.model.SysAd;
import com.gps.system.model.SysNews;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class AdAndNewsDaoHibernate
  extends HibernateDaoSupportEx
  implements AdAndNewsDao
{
  public SysAd getAd(String idno)
  {
    return (SysAd)getHibernateTemplate().get(SysAd.class, Integer.valueOf(Integer.parseInt(idno)));
  }
  
  public SysNews getNews(String idno)
  {
    return (SysNews)getHibernateTemplate().get(SysNews.class, Integer.valueOf(Integer.parseInt(idno)));
  }
  
  public String save(Object obj)
  {
    return (String) getHibernateTemplate().save(obj);
  }
  
  public void update(Object obj)
  {
    getHibernateTemplate().update(obj);
  }
  
  public void delete(Object obj)
  {
    getHibernateTemplate().delete(obj);
  }
  
  public void batchDelete(List<Object> lists)
  {
    getHibernateTemplate().deleteAll(lists);
  }
  
  public Object findByNameOrIdno(String entity, String name)
  {
    String sql = "from " + entity + " where id like '%%%s%%' or userAccount.name like '%%%s%%'";
    sql = String.format(sql, new Object[] { name, name });
    List<Object> list = getHibernateTemplate().find(sql);
    if ((list != null) && (list.size() > 0)) {
      return list.get(0);
    }
    return null;
  }
  
  public Object findByIdno(String entity, String idno)
  {
    String sql = "from " + entity + " where id = ?";
    List<Object> list = getHibernateTemplate().find(sql, Integer.valueOf(Integer.parseInt(idno)));
    if ((list != null) && (list.size() > 0)) {
      return list.get(0);
    }
    return null;
  }
  
  public List<Object> findAll(String entity)
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date d = new Date();
    Calendar rightNow = Calendar.getInstance();
    rightNow.setTime(d);
    
    Date dt = rightNow.getTime();
    String date = sdf.format(dt);
    if ("SysAd".equals(entity))
    {
      String sql = "select id,atitle,AImgSrc from sys_ad where adays >= '" + date + "' order by atime desc";
      Query query = getSession().createSQLQuery(sql);
      if (query == null) {
        return null;
      }
      return query.list();
    }
    String sql = "from " + entity + " where endTime >= '" + date + "' order by atime desc";
    
    return getHibernateTemplate().find(sql);
  }
  
  public List<Object> findPartList(String entity, String idno)
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date d = new Date();
    Calendar rightNow = Calendar.getInstance();
    rightNow.setTime(d);
    Date dt = rightNow.getTime();
    String date = sdf.format(dt);
    String condition = "";
    if (entity.equals("SysAd"))
    {
      entity = "sys_ad";
      condition = ",AImgSrc";
    }
    else
    {
      entity = "sys_news";
    }
    String sql = "select * from (select 0 row,id,atitle" + condition + ",acontent,atime,adays from " + entity + " where adays >= '" + date + "' and atime > (select atime from sys_ad where id = '" + idno + "') order by atime asc LIMIT 1) as db1 " + 
      " union select 1 row,id,atitle,AImgSrc,acontent,atime,adays from " + entity + " where id = '" + idno + "'" + 
      " union select * from (select 2 row,id,atitle,AImgSrc,acontent,atime,adays from " + entity + " where  adays >= '" + date + "' and atime < (select atime from sys_ad where id = '" + idno + "') order by atime desc LIMIT 1) as db2 ";
    Query query = getSession().createSQLQuery(sql);
    if (query == null) {
      return null;
    }
    return query.list();
  }
}
