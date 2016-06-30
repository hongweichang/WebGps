package com.gps.user.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.user.dao.UserDevPermitDao;
import com.gps.user.model.UserDevPermit;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class UserDevPermitDaoHibernate
  extends HibernateDaoSupportEx
  implements UserDevPermitDao
{
  public void editUserDevPermit(final List<UserDevPermit> addPermits, final List<UserDevPermit> delPermits)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < delPermits.size(); i++) {
          session.delete(delPermits.get(i));
        }
        for (int i = 0; i < addPermits.size(); i++) {
          session.save(addPermits.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
  
  private String getQueryString(String[] ids)
  {
    if (ids.length > 0)
    {
      StringBuilder strQuery = new StringBuilder("");
      for (int i = 0; i < ids.length; i++) {
        if (i != ids.length - 1) {
          strQuery.append(String.format("id = %s or ", new Object[] { ids[i] }));
        } else {
          strQuery.append(String.format("id = %s", new Object[] { ids[i] }));
        }
      }
      return strQuery.toString();
    }
    return "";
  }
  
  public void delDevPermit(String[] ids)
  {
    StringBuilder strQuery = new StringBuilder("from UserDevPermitEx where id in (");
    for (int i = 0; i < ids.length; i++)
    {
      strQuery.append("'");
      strQuery.append(ids[i]);
      strQuery.append("'");
      if (i != ids.length - 1) {
        strQuery.append(",");
      }
    }
    strQuery.append(")");
    List list = getHibernateTemplate().find(strQuery.toString());
    if (list.size() > 0) {
      getHibernateTemplate().deleteAll(list);
    }
  }
}
