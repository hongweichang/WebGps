package com.framework.web.service;

import java.io.Serializable;
import java.util.List;

public abstract interface UniversalService
{
  public abstract Object save(Object paramObject);
  
  public abstract void saveList(List<Object> paramList);
  
  public abstract void remove(Serializable paramSerializable);
  
  public abstract void removeList(List<Serializable> paramList);
  
  public abstract List getAll();
  
  public abstract Object get(Serializable paramSerializable);
  
  public abstract Object getObject(Class paramClass, Serializable paramSerializable);
  
  public abstract List getAllObject(Class paramClass);
  
  public abstract void delete(Object paramObject);
  
  public abstract void batchDelete(List<Object> paramList);
}
