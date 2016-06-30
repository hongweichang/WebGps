package com.gz.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gz.system.dao.GzUserInfoDao;
import com.gz.system.model.GzUserInfo;
import com.gz.system.service.GzUserService;

public class GzUserServiceImpl
  extends UniversalServiceImpl
  implements GzUserService
{
  private GzUserInfoDao gzUserInfoDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return GzUserInfo.class;
  }
  
  public GzUserInfoDao getGzUserInfoDao()
  {
    return this.gzUserInfoDao;
  }
  
  public void setGzUserInfoDao(GzUserInfoDao gzUserInfoDao)
  {
    this.gzUserInfoDao = gzUserInfoDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public GzUserInfo getUserInfoByAccount(String username)
    throws Exception
  {
    return this.gzUserInfoDao.findByName(username);
  }
  
  public GzUserInfo getUsrInfo(Integer id)
  {
    return this.gzUserInfoDao.get(id);
  }
  
  public void saveUsrInfo(GzUserInfo gzu)
  {
    this.gzUserInfoDao.update(gzu);
  }
  
  public AjaxDto<GzUserInfo> getUserList(String username, String companyname, String phone, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(username, companyname, phone), pagination);
  }
  
  private String getQueryString(String username, String companyname, String phone)
  {
    StringBuffer strQuery = new StringBuffer("from GzUserInfo where 1 = 1 ");
    if ((username != null) && (!username.isEmpty())) {
      strQuery.append(String.format("and username like '%%%s%%' ", new Object[] { username }));
    }
    if ((companyname != null) && (!companyname.isEmpty())) {
      strQuery.append(String.format("and companyname like '%%%s%%' ", new Object[] { companyname }));
    }
    if ((phone != null) && (!phone.isEmpty())) {
      strQuery.append(String.format("and phone like '%%%s%%' ", new Object[] { phone }));
    }
    return strQuery.toString();
  }
  
  public int getUserCount(String username, String companyname, String phone)
  {
    return this.paginationDao.getCountByQueryStr(getQueryString(username, companyname, phone)).intValue();
  }
}
