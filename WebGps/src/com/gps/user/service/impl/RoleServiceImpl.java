package com.gps.user.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.UserRole;
import com.gps.user.service.RoleService;
import java.util.List;

public class RoleServiceImpl
  extends UniversalServiceImpl
  implements RoleService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return UserRole.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  private String getQueryString(String name, Integer clientId)
  {
    if ((name != null) && (!name.isEmpty())) {
      return String.format("from UserRole where userId = %d and name like '%%%s%%'", new Object[] {
        clientId, name, name });
    }
    return String.format("from UserRole where userId = %d", new Object[] { clientId });
  }
  
  public UserRole findByName(String name, Integer clientId)
  {
    AjaxDto<UserRole> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from UserRole where userId = %d and name = '%s'", new Object[] { clientId, name }), null);
    List<UserRole> roles = ajaxDto.getPageList();
    if ((roles != null) && (roles.size() > 0)) {
      return (UserRole)roles.get(0);
    }
    return null;
  }
  
  public AjaxDto<UserRole> getRoleList(String name, Integer clientId, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(name, clientId), pagination);
  }
}
