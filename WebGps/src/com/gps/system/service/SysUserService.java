package com.gps.system.service;

import com.framework.web.service.UniversalService;
import com.gps.system.model.SysUsrInfo;

public abstract interface SysUserService
  extends UniversalService
{
  public abstract SysUsrInfo getUserInfoByAccount(String paramString)
    throws Exception;
  
  public abstract void saveUsrLogin(SysUsrInfo paramSysUsrInfo);
  
  public abstract SysUsrInfo getUsrInfo(Integer paramInteger);
  
  public abstract void saveUsrInfo(SysUsrInfo paramSysUsrInfo);
  
  public abstract void addSysUsrLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2, String paramString3, String paramString4);
}
