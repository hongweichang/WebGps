package com.gz.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gz.system.dao.GzUserInfoDao;
import com.gz.system.model.GzUserInfo;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class GzUserInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements GzUserInfoDao
{
  public GzUserInfo get(Integer id)
  {
    return 
      (GzUserInfo)getHibernateTemplate().get(GzUserInfo.class, id);
  }
  
  public String save(GzUserInfo gzu)
  {
    return (String)getHibernateTemplate()
      .save(gzu);
  }
  
  public void update(GzUserInfo gzu)
  {
    getHibernateTemplate().update(gzu);
  }
  
  public void delete(GzUserInfo gzu)
  {
    getHibernateTemplate().delete(gzu);
  }
  
  public void delete(Integer id)
  {
    getHibernateTemplate().delete(get(id));
  }
  
  public GzUserInfo findByName(String username)
  {
    String sql = String.format("from GzUserInfo where username = '%s'", new Object[] { username });
    Query query = getSession().createQuery(sql);
    if (query == null) {
      return null;
    }
    List<GzUserInfo> list = query.list();
    if (list.size() > 0) {
      return (GzUserInfo)list.get(0);
    }
    return null;
  }
  
  public GzUserInfo findById(Integer id)
  {
    String sql = String.format("from GzUserInfo where id = '%s'", new Object[] { id });
    List<GzUserInfo> gzblist = getHibernateTemplate().find(sql);
    if ((gzblist != null) && (gzblist.size() > 0)) {
      return (GzUserInfo)gzblist.get(0);
    }
    return null;
  }
  
  private String getQueryString(Integer id, String username)
  {
    if (id != null)
    {
      if ((username != null) && (!username.isEmpty())) {
        return String.format("from GzUserInfo where id = %d and username like '%%%s%%'", new Object[] {
          id, username });
      }
      return String.format("from GzUserInfo where id = %d", new Object[] { id });
    }
    if ((username != null) && (!username.isEmpty())) {
      return String.format("from GzUserInfo where username like '%%%s%%'", new Object[] { username });
    }
    return "from GzUserInfo";
  }
  
  public List<GzUserInfo> findAll()
  {
    return getHibernateTemplate().find("from GzUserInfo");
  }
  
  public int getUserCount(String hql)
  {
    List<GzUserInfo> devlist = getHibernateTemplate().find(hql);
    if (devlist != null) {
      return devlist.size();
    }
    return 0;
  }
}
