package com.framework.web.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.framework.web.dao.UniversalDao;
import java.io.Serializable;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class UniversalDaoImpl
  extends HibernateDaoSupportEx
  implements UniversalDao
{
  public Object get(Class clazz, Serializable id)
  {
    Object o = getHibernateTemplate().get(clazz, id);
    return o;
  }
  
  public List getAll(Class clazz)
  {
    return getHibernateTemplate().loadAll(clazz);
  }
  
  public void remove(Class clazz, Serializable id)
  {
    getHibernateTemplate().delete(get(clazz, id));
  }
  
 
public void removeList(final Class clazz, final List<Serializable> lstId)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < lstId.size(); i++)
        {
          Object o = UniversalDaoImpl.this.getHibernateTemplate().get(clazz, (Serializable)lstId.get(i));
          if (o != null) {
            UniversalDaoImpl.this.getHibernateTemplate().delete(o);
          }
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public Object save(Object o)
  {
    return getHibernateTemplate().merge(o);
  }
  

public void saveList(final List<Object> lstO)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < lstO.size(); i++) {
          UniversalDaoImpl.this.getHibernateTemplate().merge(lstO.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void delete(Object obj)
  {
    getHibernateTemplate().delete(obj);
  }
  
  public void batchDelete(List<Object> lists)
  {
    getHibernateTemplate().deleteAll(lists);
  }
}
