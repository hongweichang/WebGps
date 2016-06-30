package com.framework.web.dao;

import java.io.Serializable;
import java.util.List;

public abstract interface UniversalDao
{
  public abstract List getAll(Class paramClass);
  
  public abstract Object get(Class paramClass, Serializable paramSerializable);
  
  public abstract Object save(Object paramObject);
  
  public abstract void saveList(List<Object> paramList);
  
  public abstract void remove(Class paramClass, Serializable paramSerializable);
  
  public abstract void removeList(Class paramClass, List<Serializable> paramList);
  
  public abstract void delete(Object paramObject);
  
  public abstract void batchDelete(List<Object> paramList);
}
