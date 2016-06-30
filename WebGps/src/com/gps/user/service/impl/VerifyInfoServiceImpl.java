package com.gps.user.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.VerifyInfo;
import com.gps.user.service.VerifyInfoService;

public class VerifyInfoServiceImpl
  extends UniversalServiceImpl
  implements VerifyInfoService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return VerifyInfo.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
}
