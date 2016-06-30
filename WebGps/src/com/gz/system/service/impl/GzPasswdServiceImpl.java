package com.gz.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gz.system.dao.GzPasswdInfoDao;
import com.gz.system.model.GzPasswdInfo;
import com.gz.system.service.GzPasswdService;

public class GzPasswdServiceImpl
  extends UniversalServiceImpl
  implements GzPasswdService
{
  private GzPasswdInfoDao gzPasswdInfoDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return GzPasswdInfo.class;
  }
  
  public GzPasswdInfoDao getGzPasswdInfoDao()
  {
    return this.gzPasswdInfoDao;
  }
  
  public void setGzPasswdInfoDao(GzPasswdInfoDao gzPasswdInfoDao)
  {
    this.gzPasswdInfoDao = gzPasswdInfoDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public GzPasswdInfo getPasswd(String passwdid)
  {
    return this.gzPasswdInfoDao.get(passwdid);
  }
  
  public void savePasswd(GzPasswdInfo gzp)
  {
    this.gzPasswdInfoDao.update(gzp);
  }
}
