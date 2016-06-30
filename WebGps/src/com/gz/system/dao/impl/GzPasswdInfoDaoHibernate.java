package com.gz.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gz.system.dao.GzPasswdInfoDao;
import com.gz.system.model.GzPasswdInfo;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class GzPasswdInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements GzPasswdInfoDao
{
  public GzPasswdInfo get(String passwdid)
  {
    return 
      (GzPasswdInfo)getHibernateTemplate().get(GzPasswdInfo.class, passwdid);
  }
  
  public String save(GzPasswdInfo gzp)
  {
    return (String)getHibernateTemplate()
      .save(gzp);
  }
  
  public void update(GzPasswdInfo gzp)
  {
    getHibernateTemplate().update(gzp);
  }
  
  public void delete(GzPasswdInfo gzp)
  {
    getHibernateTemplate().delete(gzp);
  }
  
  public void delete(String passwdid)
  {
    getHibernateTemplate().delete(get(passwdid));
  }
  
  public GzPasswdInfo findByMonitorId(String monitorid)
  {
    String sql = String.format("from GzPasswdInfo where monitorid = '%s'", new Object[] { monitorid });
    Query query = getSession().createQuery(sql);
    if (query == null) {
      return null;
    }
    List<GzPasswdInfo> list = query.list();
    if (list.size() > 0) {
      return (GzPasswdInfo)list.get(0);
    }
    return null;
  }
  
  public GzPasswdInfo findById(String passwdid)
  {
    String sql = String.format("from GzPasswdInfo where passwdid = '%s'", new Object[] { passwdid });
    List<GzPasswdInfo> gzblist = getHibernateTemplate().find(sql);
    if ((gzblist != null) && (gzblist.size() > 0)) {
      return (GzPasswdInfo)gzblist.get(0);
    }
    return null;
  }
  
  private String getQueryString(String passwdid, String monitorid)
  {
    if ((passwdid != null) && (!passwdid.isEmpty()))
    {
      if ((monitorid != null) && (!monitorid.isEmpty())) {
        return String.format("from GzPasswdInfo where passwdid = %s and username like '%%%s%%'", new Object[] {
          passwdid, monitorid });
      }
      return String.format("from GzPasswdInfo where passwdid = %s", new Object[] { passwdid });
    }
    if ((monitorid != null) && (!monitorid.isEmpty())) {
      return String.format("from GzPasswdInfo where monitorid like '%%%s%%'", new Object[] { monitorid });
    }
    return "from GzPasswdInfo";
  }
  
  public List<GzPasswdInfo> findAll()
  {
    return getHibernateTemplate().find("from GzPasswdInfo");
  }
  
  public int getPasswdCount(String hql)
  {
    List<GzPasswdInfo> devlist = getHibernateTemplate().find(hql);
    if (devlist != null) {
      return devlist.size();
    }
    return 0;
  }
}
