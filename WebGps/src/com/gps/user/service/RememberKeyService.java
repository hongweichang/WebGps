package com.gps.user.service;

import com.framework.web.service.UniversalService;
import com.gps.model.RememberKey;

public abstract interface RememberKeyService
  extends UniversalService
{
  public abstract RememberKey getRememberKey(String paramString);
  
  public abstract RememberKey getRememberKey(Integer paramInteger);
}
