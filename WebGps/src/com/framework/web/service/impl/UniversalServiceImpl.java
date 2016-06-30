package com.framework.web.service.impl;

import com.framework.web.dao.UniversalDao;
import com.framework.web.service.UniversalService;
import java.io.Serializable;
import java.util.List;

public abstract class UniversalServiceImpl
  implements UniversalService
{
  private UniversalDao universalDao;
  
  public UniversalDao getUniversalDao()
  {
    return this.universalDao;
  }
  
  public void setUniversalDao(UniversalDao universalDao)
  {
    this.universalDao = universalDao;
  }
  
  public Object save(Object o)
  {
    if (getClazz() == null) {
      return null;
    }
    return this.universalDao.save(o);
  }
  
  public void saveList(List<Object> lstO)
  {
    this.universalDao.saveList(lstO);
  }
  
  public void remove(Serializable id)
  {
    if (getClazz() != null) {
      this.universalDao.remove(getClazz(), id);
    }
  }
  
  public void removeList(List<Serializable> lstId)
  {
    if (getClazz() != null) {
      this.universalDao.removeList(getClazz(), lstId);
    }
  }
  
  public Object get(Serializable id)
  {
    if (getClazz() == null) {
      return null;
    }
    return this.universalDao.get(getClazz(), id);
  }
  
  public List getAll()
  {
    if (getClazz() == null) {
      return null;
    }
    return this.universalDao.getAll(getClazz());
  }
  
  public Object getObject(Class cls, Serializable id)
  {
    if (cls == null) {
      return null;
    }
    return this.universalDao.get(cls, id);
  }
  
  public List getAllObject(Class cls)
  {
    if (cls == null) {
      return null;
    }
    return this.universalDao.getAll(cls);
  }
  
  public void delete(Object obj)
  {
    this.universalDao.delete(obj);
  }
  
  public void batchDelete(List<Object> lists)
  {
    this.universalDao.batchDelete(lists);
  }
  
  public abstract Class getClazz();
}
