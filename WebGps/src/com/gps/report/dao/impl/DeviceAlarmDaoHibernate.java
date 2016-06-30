package com.gps.report.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.model.DeviceAlarm;
import com.gps.report.dao.DeviceAlarmDao;
import com.gps.report.vo.DeviceAlarmSummary;
import java.util.List;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DeviceAlarmDaoHibernate
  extends HibernateDaoSupportEx
  implements DeviceAlarmDao
{
  public List<DeviceAlarmSummary> summaryDeviceAlarm(String queryString)
  {
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(queryString);
      query.addScalar("count", Hibernate.INTEGER);
      query.addScalar("beginTime", Hibernate.DATE);
      query.addScalar("endTime", Hibernate.DATE);
      
      query.setResultTransformer(Transformers.aliasToBean(DeviceAlarmSummary.class));
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
  
  public List<DeviceAlarm> queryDeviceAlarm(List<String> guid)
  {
    StringBuffer sql = new StringBuffer(" from DeviceAlarm ");
    for (int i = 0; i < guid.size(); i++)
    {
      if (i == 0) {
        sql.append(" where guid in(");
      }
      if (i != 0) {
        sql.append(",");
      }
      sql.append(String.format("'%s'", new Object[] { guid.get(i) }));
      if (i == guid.size() - 1) {
        sql.append(")");
      }
    }
    return getHibernateTemplate().find(sql.toString());
  }
}
