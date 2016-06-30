package com.gps.system.dao;

import com.gps.system.model.SysUsrInfo;
import java.util.List;

public abstract interface SysUsrInfoDao
{
  public abstract SysUsrInfo get(Integer paramInteger);
  
  public abstract Integer save(SysUsrInfo paramSysUsrInfo);
  
  public abstract void update(SysUsrInfo paramSysUsrInfo);
  
  public abstract void delete(SysUsrInfo paramSysUsrInfo);
  
  public abstract void delete(Integer paramInteger);
  
  public abstract List<SysUsrInfo> findAll();
  
  public abstract List<SysUsrInfo> findByNameAndPass(String paramString1, String paramString2);
  
  public abstract SysUsrInfo findByName(String paramString);
}
