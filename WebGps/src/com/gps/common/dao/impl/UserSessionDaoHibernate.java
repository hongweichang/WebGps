package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.UserSessionDao;
import com.gps.model.UserSession;

import java.util.ArrayList;
import java.util.List;

import org.springframework.orm.hibernate3.HibernateOperations;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class UserSessionDaoHibernate
  extends HibernateDaoSupportEx
  implements UserSessionDao
{
  private String getQueryString(String name)
  {
    StringBuffer str = new StringBuffer("from UserSession");
    if ((name != null) && (!name.equals(""))) {
      str.append(String.format(" where userInfo.userAccount.name like '%%%s%%' or userInfo.userAccount.account like '%%%s%%'", new Object[] { name, name }));
    }
    return str.toString();
  }
  
  public int getOnlineCount(String name)
  {
    List<UserSession> clilist = getHibernateTemplate().find(getQueryString(name));
    return clilist.size();
  }
  
  public UserSession getUserSession(String session)
  {
	 List<UserSession> clilist = getHibernateTemplate().find(String.format("from UserSession where session = '%s'",new Object[]{session}));
	
    if (clilist.size() > 0) {
    	return clilist.get(0);
    }
    return null;
  }
}
