package com.gps808.operationManagement.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps808.model.line.StandardLineStationRelationStation;
import com.gps808.model.line.StandardStationInfo;
import com.gps808.operationManagement.dao.StandardLineDao;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardLineDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardLineDao
{
  public StandardLineStationRelationStation getLineStationRelation(Integer lineId, Integer stationId, Integer direct, Integer index, String condition)
  {
    if ((lineId == null) || (direct == null)) {
      return null;
    }
    StringBuffer sql = new StringBuffer(" from StandardLineStationRelationStation where 1 = 1 ");
    sql.append(String.format(" and lid = %d and direct = %d ", new Object[] { lineId, direct }));
    if (stationId != null) {
      sql.append(String.format(" and station.id = %d ", new Object[] { stationId }));
    }
    if (index != null) {
      sql.append(String.format(" and sindex = %d ", new Object[] { index }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardLineStationRelationStation> list = query.list();
    if (list.size() > 0) {
      return (StandardLineStationRelationStation)list.get(0);
    }
    return null;
  }
  
  public StandardStationInfo getStationInfo(String name, Integer direct, String condition)
  {
    if ((name == null) || (name.isEmpty()) || (direct == null)) {
      return null;
    }
    StringBuffer sql = new StringBuffer(" from StandardStationInfo where 1 = 1 ");
    sql.append(String.format(" and name = '%s' and direct = %d ", new Object[] { name, direct }));
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardStationInfo> list = query.list();
    if (list.size() > 0) {
      return (StandardStationInfo)list.get(0);
    }
    return null;
  }
  
  public Integer getMaxStationIndex(Integer lineId, Integer direct, String condition)
  {
    if ((lineId == null) || (direct == null)) {
      return null;
    }
    StringBuffer sql = new StringBuffer("select Max(StationIndex) from jt808_line_station_relation ");
    sql.append(String.format(" where LineID = %d and Direction = %d ", new Object[] { lineId, direct }));
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createSQLQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<Integer> list = query.list();
    if (list.size() > 0) {
      return (Integer)list.get(0);
    }
    return null;
  }
  
  public void batchSaveStationRelation(final List<StandardLineStationRelationStation> newLstRelation, final List<StandardLineStationRelationStation> delLstRelation)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if ((delLstRelation != null) && (delLstRelation.size() > 0)) {
          for (int i = 0; i < delLstRelation.size(); i++) {
            session.delete(delLstRelation.get(i));
          }
        }
        if ((newLstRelation != null) && (newLstRelation.size() > 0)) {
          for (int i = 0; i < newLstRelation.size(); i++) {
            session.merge(newLstRelation.get(i));
          }
        }
        tx.commit();
        return null;
      }
    });
  }
}
