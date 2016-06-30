package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.DeviceInfoDao;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceBrand;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceType;
import com.gps.model.DeviceYouLiang;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DeviceInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements DeviceInfoDao
{
  public DeviceInfo get(String idno)
  {
    return 
      (DeviceInfo)getHibernateTemplate().get(DeviceInfo.class, idno);
  }
  
  public String save(DeviceInfo dev)
  {
    return (String)getHibernateTemplate()
      .save(dev);
  }
  
  public void batchSave(final List<DeviceInfo> devlists)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < devlists.size(); i++) {
          session.save(devlists.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void batchDelete(final List<DeviceInfo> devlists)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < devlists.size(); i++) {
          session.delete(devlists.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void update(DeviceInfo dev)
  {
    getHibernateTemplate().update(dev);
  }
  
  public void batchUpdate(final List<DeviceInfo> devlists)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        for (int i = 0; i < devlists.size(); i++) {
          session.update(devlists.get(i));
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void delete(DeviceInfo dev)
  {
    getHibernateTemplate().delete(dev);
  }
  
  public void delete(String idno)
  {
    getHibernateTemplate().delete(get(idno));
  }
  
  public DeviceInfo findByNameOrIdno(String name)
  {
    List<DeviceInfo> devlist = getHibernateTemplate()
      .find(String.format("from DeviceInfo where idno like '%%%s%%' or userAccount.name like '%%%s%%'", new Object[] { name, name }));
    if ((devlist != null) && (devlist.size() > 0)) {
      return (DeviceInfo)devlist.get(0);
    }
    return null;
  }
  
  public DeviceInfo findByIdno(String idno)
  {
    List<DeviceInfo> devlist = getHibernateTemplate().find(String.format("from DeviceInfo where idno = '%s'", new Object[] { idno }));
    if ((devlist != null) && (devlist.size() > 0)) {
      return (DeviceInfo)devlist.get(0);
    }
    return null;
  }
  
  public DeviceBase findByIdnoEx(String idno)
  {
    List<DeviceBase> devlist = getHibernateTemplate()
      .find("from DeviceBase where idno = ?", 
      idno);
    if ((devlist != null) && (devlist.size() > 0)) {
      return (DeviceBase)devlist.get(0);
    }
    return null;
  }
  
  private String getQueryString(Integer usrid, String name)
  {
    if (usrid != null)
    {
      if ((name != null) && (!name.isEmpty())) {
        return String.format("from DeviceInfo where userID = %d and (name like '%%%s%%' or idno like '%%%s%%')", new Object[] {
          usrid, name, name });
      }
      return String.format("from DeviceInfo where userID = %d", new Object[] { usrid });
    }
    if ((name != null) && (!name.isEmpty())) {
      return String.format("from DeviceInfo where name like '%%%s%%' or idno like '%%%s%%'", new Object[] { name, name });
    }
    return "from DeviceInfo";
  }
  
  public List<DeviceInfo> findAll()
  {
    return 
      getHibernateTemplate().find("from DeviceInfo");
  }
  
  public int getDeviceCount(String hql)
  {
    List<DeviceInfo> devlist = getHibernateTemplate().find(hql);
    if (devlist != null) {
      return devlist.size();
    }
    return 0;
  }
  
  public DeviceType findTypeByName(String name)
  {
    List<DeviceType> devtypes = getHibernateTemplate().find(String.format("from DeviceType where name = '%s'", new Object[] { name }));
    if ((devtypes != null) && (devtypes.size() > 0)) {
      return (DeviceType)devtypes.get(0);
    }
    return null;
  }
  
  public List<DeviceBrand> findAllBrand()
  {
    return getHibernateTemplate().find(String.format("from DeviceBrand", new Object[0]));
  }
  
  public DeviceBrand findBrandByName(String name)
  {
    List<DeviceBrand> devbrands = getHibernateTemplate().find(String.format("from DeviceBrand where name = '%s'", new Object[] { name }));
    if ((devbrands != null) && (devbrands.size() > 0)) {
      return (DeviceBrand)devbrands.get(0);
    }
    return null;
  }
  
  public void updateVehiTypeName(DeviceType deviceType)
  {
    Query query = getSession().createSQLQuery("update dev_info set VehiType = '" + deviceType.getName() + "' where TypeId = " + deviceType.getId());
    if (query != null) {
      query.executeUpdate();
    }
  }
  
  public void updateVehiBrandName(DeviceBrand deviceBrand)
  {
    Query query = getSession().createSQLQuery("update dev_info set VehiBand = '" + deviceBrand.getName() + "' where BandId = " + deviceBrand.getId());
    if (query != null) {
      query.executeUpdate();
    }
  }
  
  public DeviceYouLiang findYouLiangByIdno(String devIdno)
  {
    List<DeviceYouLiang> devyous = getHibernateTemplate().find(String.format("from DeviceYouLiang where DevIdno = '%s'", new Object[] { devIdno }));
    if ((devyous != null) && (devyous.size() > 0)) {
      return (DeviceYouLiang)devyous.get(0);
    }
    return null;
  }
}
