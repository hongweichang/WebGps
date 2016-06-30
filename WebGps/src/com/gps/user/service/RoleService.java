package com.gps.user.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.UserRole;

public abstract interface RoleService
  extends UniversalService
{
  public abstract UserRole findByName(String paramString, Integer paramInteger);
  
  public abstract AjaxDto<UserRole> getRoleList(String paramString, Integer paramInteger, Pagination paramPagination);
}
