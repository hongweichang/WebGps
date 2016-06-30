package com.gps808.videoTrack.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;
import com.gps808.videoTrack.dao.StandardVideoTrackDao;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardVideoTrackDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardVideoTrackDao
{
  public void saveDownloadTaskInfo(final StandardStorageDownTaskReal taskReal, final StandardStorageDownTaskAll taskAll)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (taskReal != null) {
          session.merge(taskReal);
        }
        if (taskAll != null) {
          session.merge(taskAll);
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public StandardStorageDownTaskAll getDownTaskAll(String devIdno, String filePath, Integer nfBegTime, Integer nfEndTime, Integer chn)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskAll where 1 = 1");
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if ((filePath != null) && (!filePath.isEmpty())) {
      sql.append(String.format(" and fph = '%s'", new Object[] { filePath }));
    }
    if (nfBegTime != null) {
      sql.append(String.format(" and nfbtm = %d", new Object[] { nfBegTime }));
    }
    if (nfEndTime != null) {
      sql.append(String.format(" and nfetm = %d", new Object[] { nfEndTime }));
    }
    if (chn != null) {
      sql.append(String.format(" and chn = %d", new Object[] { chn }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardStorageDownTaskAll> list = query.list();
    if (list.size() > 0) {
      return (StandardStorageDownTaskAll)list.get(0);
    }
    return null;
  }
  
  public StandardStorageDownTaskAll getDownTaskAll(String devIdno, String filePath, String fBegTime, String fEndTime, Integer chn)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskAll where 1 = 1");
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if ((filePath != null) && (!filePath.isEmpty())) {
      sql.append(String.format(" and fph = '%s'", new Object[] { filePath }));
    }
    if ((fBegTime != null) && (!fBegTime.isEmpty())) {
      sql.append(String.format(" and fbtm = '%s'", new Object[] { fBegTime }));
    }
    if ((fEndTime != null) && (!fEndTime.isEmpty())) {
      sql.append(String.format(" and fetm = '%s'", new Object[] { fEndTime }));
    }
    if (chn != null) {
      sql.append(String.format(" and chn = %d", new Object[] { chn }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardStorageDownTaskAll> list = query.list();
    if (list.size() > 0) {
      return (StandardStorageDownTaskAll)list.get(0);
    }
    return null;
  }
  
  public StandardStorageDownTaskReal getDownTaskReal(String devIdno, String filePath, Integer nfBegTime, Integer nfEndTime, Integer chn)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskReal where 1 = 1");
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if ((filePath != null) && (!filePath.isEmpty())) {
      sql.append(String.format(" and fph = '%s'", new Object[] { filePath }));
    }
    if (nfBegTime != null) {
      sql.append(String.format(" and fbtm = %d", new Object[] { nfBegTime }));
    }
    if (nfEndTime != null) {
      sql.append(String.format(" and fetm = %d", new Object[] { nfEndTime }));
    }
    if (chn != null) {
      sql.append(String.format(" and chn = %d", new Object[] { chn }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardStorageDownTaskReal> list = query.list();
    if (list.size() > 0) {
      return (StandardStorageDownTaskReal)list.get(0);
    }
    return null;
  }
  
  public StandardStorageDownTaskReal getDownTaskReal(String devIdno, String filePath, String fBegTime, String fEndTime, Integer chn)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskReal where 1 = 1");
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if ((filePath != null) && (!filePath.isEmpty())) {
      sql.append(String.format(" and fph = '%s'", new Object[] { filePath }));
    }
    if ((fBegTime != null) && (!fBegTime.isEmpty())) {
      sql.append(String.format(" and fbtm = '%s'", new Object[] { fBegTime }));
    }
    if ((fEndTime != null) && (!fEndTime.isEmpty())) {
      sql.append(String.format(" and fetm = '%s'", new Object[] { fEndTime }));
    }
    if (chn != null) {
      sql.append(String.format(" and chn = %d", new Object[] { chn }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardStorageDownTaskReal> list = query.list();
    if (list.size() > 0) {
      return (StandardStorageDownTaskReal)list.get(0);
    }
    return null;
  }
}
