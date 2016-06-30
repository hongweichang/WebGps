package com.gps808.operationManagement.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.model.UserSession;
import com.gps808.operationManagement.dao.StandardUserSessionDao;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardUserSessionDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardUserSessionDao
{
  public UserSession getUserSession(String session)
  {
    String str = String.format("from UserSession where session = '%s'", new Object[] { session });
    
    List<UserSession> clilist = getHibernateTemplate().find(str);
    if ((clilist != null) && (clilist.size() > 0)) {
      return (UserSession)clilist.get(0);
    }
    return null;
  }
}
