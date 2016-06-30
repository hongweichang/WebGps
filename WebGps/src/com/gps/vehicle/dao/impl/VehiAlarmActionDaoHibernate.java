package com.gps.vehicle.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.vehicle.dao.VehiAlarmActionDao;
import com.gps.vehicle.model.AlarmAction;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class VehiAlarmActionDaoHibernate
  extends HibernateDaoSupportEx
  implements VehiAlarmActionDao
{
  public AlarmAction findAlarmAction(String devIdno, Integer armType)
  {
    List<AlarmAction> alarmActions = getHibernateTemplate()
      .find(String.format(" from AlarmAction where devIdno = '%s' and armType = %d", new Object[] { devIdno, armType }));
    if ((alarmActions != null) && (alarmActions.size() >= 1)) {
      return (AlarmAction)alarmActions.get(0);
    }
    return null;
  }
  
  public Map<Integer, AlarmAction> getDeviceAlarmAction(String devIdno)
  {
    List<AlarmAction> alarmActions = getHibernateTemplate()
      .find(String.format(" from AlarmAction where devIdno = '%s'", new Object[] { devIdno }));
    if ((alarmActions != null) && (alarmActions.size() >= 1))
    {
      Map<Integer, AlarmAction> mapAction = new HashMap();
      for (int i = 0; i < alarmActions.size(); i++) {
        mapAction.put(((AlarmAction)alarmActions.get(i)).getArmType(), (AlarmAction)alarmActions.get(i));
      }
      return mapAction;
    }
    return null;
  }
  
  public void saveAlarmAction(final List<AlarmAction> lstArmAction)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < lstArmAction.size(); i++) {
          session.merge(lstArmAction.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
}
