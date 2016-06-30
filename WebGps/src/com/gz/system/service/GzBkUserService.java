package com.gz.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gz.system.model.GzBkUserInfo;

public abstract interface GzBkUserService
  extends UniversalService
{
  public abstract GzBkUserInfo getUserInfoByAccount(String paramString)
    throws Exception;
  
  public abstract GzBkUserInfo getUsrInfo(Integer paramInteger);
  
  public abstract void saveUsrInfo(GzBkUserInfo paramGzBkUserInfo);
  
  public abstract AjaxDto<GzBkUserInfo> getBkUserList(String paramString, Integer paramInteger, Pagination paramPagination);
  
  public abstract int getBkUserCount(String paramString, Integer paramInteger);
}
