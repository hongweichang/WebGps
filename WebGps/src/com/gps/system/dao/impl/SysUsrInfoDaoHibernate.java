package com.gps.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.system.dao.SysUsrInfoDao;
import com.gps.system.model.SysUsrInfo;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class SysUsrInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements SysUsrInfoDao
{
  public SysUsrInfo get(Integer id)
  {
    return 
      (SysUsrInfo)getHibernateTemplate().get(SysUsrInfo.class, id);
  }
  
  public Integer save(SysUsrInfo usr)
  {
    return (Integer)getHibernateTemplate()
      .save(usr);
  }
  
  public void update(SysUsrInfo usr)
  {
    getHibernateTemplate().update(usr);
  }
  
  public void delete(SysUsrInfo SysUsrInfo)
  {
    getHibernateTemplate().delete(SysUsrInfo);
  }
  
  public void delete(Integer id)
  {
    getHibernateTemplate().delete(get(id));
  }
  
  public List<SysUsrInfo> findAll()
  {
    return 
      getHibernateTemplate().find("from SysUsrInfo");
  }
  
  public List<SysUsrInfo> findByNameAndPass(String name, String password)
  {
    return 
      getHibernateTemplate().find("from SysUsrInfo where name = ? and pass = ?", 
      new String[] { name, password });
  }
  
  public SysUsrInfo findByName(String name)
  {
    List<SysUsrInfo> usrinfos = getHibernateTemplate()
      .find(" from SysUsrInfo where Name = ?", name);
    if ((usrinfos != null) && (usrinfos.size() >= 1)) {
      return (SysUsrInfo)usrinfos.get(0);
    }
    return null;
  }
}
