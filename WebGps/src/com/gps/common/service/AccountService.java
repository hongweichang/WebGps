package com.gps.common.service;

import com.framework.web.service.UniversalService;
import com.gps.model.ResetPassword;
import com.gps.model.UserAccount;
import java.util.List;

public abstract interface AccountService
  extends UniversalService
{
  public abstract UserAccount get(Integer paramInteger);
  
  public abstract UserAccount findByAccount(String paramString);
  
  public abstract boolean isAccountUnvalid(String paramString);
  
  public abstract List<Object> findDriverInfo(String paramString);
  
  public abstract ResetPassword findResetSession(String paramString);
  
  public abstract ResetPassword findResetSessionByAI(Integer paramInteger, String paramString1, String paramString2);
}
