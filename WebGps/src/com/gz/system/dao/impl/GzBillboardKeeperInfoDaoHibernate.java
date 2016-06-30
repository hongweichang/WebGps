package com.gz.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gz.system.dao.GzBillboardKeeperInfoDao;
import com.gz.system.model.GzBillboardKeeperInfo;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class GzBillboardKeeperInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements GzBillboardKeeperInfoDao
{
  public GzBillboardKeeperInfo get(String id)
  {
    return 
      (GzBillboardKeeperInfo)getHibernateTemplate().get(GzBillboardKeeperInfo.class, id);
  }
  
  public String save(GzBillboardKeeperInfo gzb)
  {
    return (String)getHibernateTemplate()
      .save(gzb);
  }
  
  public void update(GzBillboardKeeperInfo gzb)
  {
    getHibernateTemplate().update(gzb);
  }
  
  public void delete(GzBillboardKeeperInfo gzb)
  {
    getHibernateTemplate().delete(gzb);
  }
  
  public void delete(String id)
  {
    getHibernateTemplate().delete(get(id));
  }
  
  public GzBillboardKeeperInfo findByName(String name)
  {
    String sql = String.format("from GzBillboardKeeperInfo where name = '%s'", new Object[] { name });
    Query query = getSession().createQuery(sql);
    if (query == null) {
      return null;
    }
    List<GzBillboardKeeperInfo> list = query.list();
    if (list.size() > 0) {
      return (GzBillboardKeeperInfo)list.get(0);
    }
    return null;
  }
  
  public GzBillboardKeeperInfo findById(String id)
  {
    String sql = String.format("from GzBillboardKeeperInfo where id = '%s'", new Object[] { id });
    List<GzBillboardKeeperInfo> gzblist = getHibernateTemplate().find(sql);
    if ((gzblist != null) && (gzblist.size() > 0)) {
      return (GzBillboardKeeperInfo)gzblist.get(0);
    }
    return null;
  }
  
  private String getQueryString(String id, String name)
  {
    if (id != null)
    {
      if ((name != null) && (!name.isEmpty())) {
        return String.format("from GzBillboardKeeperInfo where id = %d and name like '%%%s%%'", new Object[] {
          id, name });
      }
      return String.format("from GzBillboardKeeperInfo where id = '%s'", new Object[] { id });
    }
    if ((name != null) && (!name.isEmpty())) {
      return String.format("from GzBillboardKeeperInfo where name like '%%%s%%'", new Object[] { name });
    }
    return "from GzBillboardKeeperInfo";
  }
  
  public List<GzBillboardKeeperInfo> findAll()
  {
    return getHibernateTemplate().find("from GzBillboardKeeperInfo");
  }
  
  public int getBillboardKeeperCount(String hql)
  {
    List<GzBillboardKeeperInfo> devlist = getHibernateTemplate().find(hql);
    if (devlist != null) {
      return devlist.size();
    }
    return 0;
  }
}
