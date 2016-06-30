package com.framework.web.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.orm.hibernate3.SessionFactoryUtils;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public abstract class HibernateDaoSupportEx
  extends HibernateDaoSupport
{
  private JdbcTemplate jdbcTemplate;
  
  public Connection getConnection()
    throws SQLException
  {
    return getDataSource().getConnection();
  }
  
  public DataSource getDataSource()
  {
    return SessionFactoryUtils.getDataSource(getSessionFactory());
  }
  
  public void setJdbcTemplate(JdbcTemplate jdbcTemplate)
  {
    this.jdbcTemplate = jdbcTemplate;
  }
  
  public JdbcTemplate getJdbcTemplate()
  {
    if (this.jdbcTemplate == null) {
      this.jdbcTemplate = createJdbcTemplate();
    }
    return this.jdbcTemplate;
  }
  
  protected JdbcTemplate createJdbcTemplate()
  {
    DataSource dataSource = getDataSource();
    if (dataSource != null) {
      return new JdbcTemplate(dataSource);
    }
    return null;
  }
  
  public List findByPage(final String hql, final int offset, final int pageSize)
  {
    List list = getHibernateTemplate()
      .executeFind(new HibernateCallback()
      {
        public Object doInHibernate(Session session)
          throws HibernateException, SQLException
        {
          List result = session.createQuery(hql)
            .setFirstResult(offset)
            .setMaxResults(pageSize)
            .list();
          return result;
        }
      });
    return list;
  }
  
  public List findByPage(final String hql, final Object value, final int offset, final int pageSize)
  {
    List list = getHibernateTemplate()
      .executeFind(new HibernateCallback()
      {
        public Object doInHibernate(Session session)
          throws HibernateException, SQLException
        {
          List result = session.createQuery(hql)
          
            .setParameter(0, value)
            .setFirstResult(offset)
            .setMaxResults(pageSize)
            .list();
          return result;
        }
      });
    return list;
  }
  
  public List findByPage(final String hql, final Object[] values, final int offset, final int pageSize)
  {
    List list = getHibernateTemplate()
      .executeFind(new HibernateCallback()
      {
        public Object doInHibernate(Session session)
          throws HibernateException, SQLException
        {
          Query query = session.createQuery(hql);
          for (int i = 0; i < values.length; i++) {
            query.setParameter(i, values[i]);
          }
          List result = query.setFirstResult(offset)
            .setMaxResults(pageSize)
            .list();
          return result;
        }
      });
    return list;
  }
}
