package com.gz.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gz.system.dao.GzBkUserInfoDao;
import com.gz.system.model.GzBkUserInfo;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class GzBkUserInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements GzBkUserInfoDao
{
  public GzBkUserInfo get(Integer id)
  {
    return 
      (GzBkUserInfo)getHibernateTemplate().get(GzBkUserInfo.class, id);
  }
  
  public String save(GzBkUserInfo gzb)
  {
    return (String)getHibernateTemplate()
      .save(gzb);
  }
  
  public void update(GzBkUserInfo gzb)
  {
    getHibernateTemplate().update(gzb);
  }
  
  public void delete(GzBkUserInfo gzb)
  {
    getHibernateTemplate().delete(gzb);
  }
  
  public void delete(Integer id)
  {
    getHibernateTemplate().delete(get(id));
  }
  
  public GzBkUserInfo findByName(String name)
  {
    String sql = String.format("from GzBkUserInfo where name = '%s'", new Object[] { name });
    Query query = getSession().createQuery(sql);
    if (query == null) {
      return null;
    }
    List<GzBkUserInfo> list = query.list();
    if (list.size() > 0) {
      return (GzBkUserInfo)list.get(0);
    }
    return null;
  }
  
  public GzBkUserInfo findById(Integer id)
  {
    String sql = String.format("from GzBkUserInfo where id = '%s'", new Object[] { id });
    List<GzBkUserInfo> gzblist = getHibernateTemplate().find(sql);
    if ((gzblist != null) && (gzblist.size() > 0)) {
      return (GzBkUserInfo)gzblist.get(0);
    }
    return null;
  }
  
  private String getQueryString(Integer id, String name)
  {
    if (id != null)
    {
      if ((name != null) && (!name.isEmpty())) {
        return String.format("from GzBkUserInfo where id = %d and name like '%%%s%%'", new Object[] {
          id, name });
      }
      return String.format("from GzBkUserInfo where id = %d", new Object[] { id });
    }
    if ((name != null) && (!name.isEmpty())) {
      return String.format("from GzBkUserInfo where name like '%%%s%%'", new Object[] { name });
    }
    return "from GzBkUserInfo";
  }
  
  public List<GzBkUserInfo> findAll()
  {
    return getHibernateTemplate().find("from GzBkUserInfo");
  }
  
  public int getBkUserCount(String hql)
  {
    List<GzBkUserInfo> devlist = getHibernateTemplate().find(hql);
    if (devlist != null) {
      return devlist.size();
    }
    return 0;
  }
}
