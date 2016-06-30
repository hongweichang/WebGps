package com.gps808.rule.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardVehiRule;
import com.gps808.rule.dao.StandardVehicleRuleDao;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardVehicleRuleDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardVehicleRuleDao
{
  public StandardRuleMaintain getVehicleRuleByName(String name)
  {
    Query query = getSession().createQuery(String.format(" from StandardRuleMaintain where name = '%s'", new Object[] { name }));
    if (query == null) {
      return null;
    }
    List<StandardRuleMaintain> list = query.list();
    if (list.size() > 0) {
      return (StandardRuleMaintain)list.get(0);
    }
    return null;
  }
  
  public List<StandardVehiRule> getStandardVehiRulePermit(Integer ruleId, String vehiIdno, String condition)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehiRule where 1 =1 ");
    if (ruleId != null) {
      sql.append(String.format(" and rule.id = %d", new Object[] { ruleId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vehicle.vehiIDNO = '%s'", new Object[] { vehiIdno }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public void editVehiRulePermit(final List<StandardVehiRule> addPermits, final List<StandardVehiRule> delPermits)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if ((delPermits != null) && (delPermits.size() > 0)) {
          for (int i = 0; i < delPermits.size(); i++) {
            session.delete(delPermits.get(i));
          }
        }
        if ((addPermits != null) && (addPermits.size() > 0)) {
          for (int i = 0; i < addPermits.size(); i++) {
            session.save(addPermits.get(i));
          }
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void deleteRule(final List<StandardVehiRule> delPermits, final StandardRuleMaintain rule)
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
        session.delete(rule);
        tx.commit();
        return null;
      }
    });
  }
}
