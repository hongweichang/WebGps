package com.gz.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gz.system.model.GzUserInfo;

public abstract interface GzUserService
  extends UniversalService
{
  public abstract GzUserInfo getUserInfoByAccount(String paramString)
    throws Exception;
  
  public abstract GzUserInfo getUsrInfo(Integer paramInteger);
  
  public abstract void saveUsrInfo(GzUserInfo paramGzUserInfo);
  
  public abstract AjaxDto<GzUserInfo> getUserList(String paramString1, String paramString2, String paramString3, Pagination paramPagination);
  
  public abstract int getUserCount(String paramString1, String paramString2, String paramString3);
}
