package com.gz.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gz.system.dao.GzBkUserInfoDao;
import com.gz.system.model.GzBkUserInfo;
import com.gz.system.service.GzBkUserService;

public class GzBkUserServiceImpl
  extends UniversalServiceImpl
  implements GzBkUserService
{
  private GzBkUserInfoDao gzBkUserInfoDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return GzBkUserInfo.class;
  }
  
  public GzBkUserInfoDao getGzBkUserInfoDao()
  {
    return this.gzBkUserInfoDao;
  }
  
  public void setGzBkUserInfoDao(GzBkUserInfoDao gzBkUserInfoDao)
  {
    this.gzBkUserInfoDao = gzBkUserInfoDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public GzBkUserInfo getUserInfoByAccount(String name)
    throws Exception
  {
    return this.gzBkUserInfoDao.findByName(name);
  }
  
  public GzBkUserInfo getUsrInfo(Integer id)
  {
    return this.gzBkUserInfoDao.get(id);
  }
  
  public void saveUsrInfo(GzBkUserInfo gzb)
  {
    this.gzBkUserInfoDao.update(gzb);
  }
  
  public AjaxDto<GzBkUserInfo> getBkUserList(String name, Integer type, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(name, type), pagination);
  }
  
  private String getQueryString(String name, Integer type)
  {
    StringBuffer strQuery = new StringBuffer("from GzBkUserInfo where 1 = 1 ");
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format("and name like '%%%s%%' ", new Object[] { name }));
    }
    if (type.intValue() != 0) {
      strQuery.append(String.format("and type = %d ", new Object[] { type }));
    }
    return strQuery.toString();
  }
  
  public int getBkUserCount(String name, Integer type)
  {
    return this.paginationDao.getCountByQueryStr(getQueryString(name, type)).intValue();
  }
}
