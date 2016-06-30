package com.gz.system.service;

import com.framework.web.service.UniversalService;
import com.gz.system.model.GzPasswdInfo;

public abstract interface GzPasswdService
  extends UniversalService
{
  public abstract GzPasswdInfo getPasswd(String paramString);
  
  public abstract void savePasswd(GzPasswdInfo paramGzPasswdInfo);
}
