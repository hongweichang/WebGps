package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.UserInfoDao;
import com.gps.model.UserInfo;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class UserInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements UserInfoDao
{
  public UserInfo findByLoginName(String name)
  {
    List<UserInfo> usrlist = getHibernateTemplate()
      .find("from UserInfo where userAccount.account = ?", 
      name);
    if (usrlist.size() > 0) {
      return (UserInfo)usrlist.get(0);
    }
    return null;
  }
  
  public UserInfo findByLoginAccout(Integer accountId)
  {
    List<UserInfo> usrlist = getHibernateTemplate()
      .find("from UserInfo where userAccount.id = ?", 
      accountId);
    if (usrlist.size() > 0) {
      return (UserInfo)usrlist.get(0);
    }
    return null;
  }
  
  public UserInfo findByName(String name)
  {
    List<UserInfo> usrlist = getHibernateTemplate()
      .find("from UserInfo where userAccount.name = ?", 
      name);
    if (usrlist.size() > 0) {
      return (UserInfo)usrlist.get(0);
    }
    return null;
  }
}
