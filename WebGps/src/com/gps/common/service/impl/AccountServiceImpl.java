package com.gps.common.service.impl;

import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.dao.UserAccountDao;
import com.gps.common.service.AccountService;
import com.gps.model.ResetPassword;
import com.gps.model.UserAccount;
import com.gps.util.ConvertUtil;
import com.gps.util.GoogleGpsFix;
import java.util.List;

public class AccountServiceImpl
  extends UniversalServiceImpl
  implements AccountService
{
  private UserAccountDao userAccountDao;
  private long googleFixInit = GoogleGpsFix.getTableIndex(0L, 0L);
  private long convertFixInit = ConvertUtil.getTableIndex(0L, 0L);
  
  public Class getClazz()
  {
    return UserAccount.class;
  }
  
  public UserAccountDao getUserAccountDao()
  {
    return this.userAccountDao;
  }
  
  public void setUserAccountDao(UserAccountDao userAccountDao)
  {
    this.userAccountDao = userAccountDao;
  }
  
  public UserAccount get(Integer id)
  {
    return this.userAccountDao.get(id);
  }
  
  public UserAccount findByAccount(String name)
  {
    return this.userAccountDao.findByAccount(name);
  }
  
  public boolean isAccountUnvalid(String account)
  {
    return (account.equals("admin")) || (account.equals("administrator"));
  }
  
  public List<Object> findDriverInfo(String padIdno)
  {
    return this.userAccountDao.findDriverInfo(padIdno);
  }
  
  public ResetPassword findResetSession(String account)
  {
    return this.userAccountDao.findResetSession(account);
  }
  
  public ResetPassword findResetSessionByAI(Integer id, String randParam, String account)
  {
    return this.userAccountDao.findResetSessionByAI(id, randParam, account);
  }
}
