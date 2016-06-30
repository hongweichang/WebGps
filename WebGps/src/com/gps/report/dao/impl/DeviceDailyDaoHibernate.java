package com.gps.report.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.report.dao.DeviceDailyDao;
import com.gps.report.model.DeviceDaily;
import java.util.List;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DeviceDailyDaoHibernate
  extends HibernateDaoSupportEx
  implements DeviceDailyDao
{
  public List<DeviceDaily> queryDistinctDaily(String queryString)
  {
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(queryString);
      
      query.setResultTransformer(Transformers.aliasToBean(DeviceDaily.class));
      return query.list();
    }
    catch (RuntimeException re)
    {
      throw re;
    }
    finally
    {
      session.close();
    }
  }
}
