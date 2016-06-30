package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.ServerInfoDao;
import com.gps.model.ServerInfo;
import com.gps.model.ServerSession;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class ServerInfoDaoHibernate
  extends HibernateDaoSupportEx
  implements ServerInfoDao
{
  public ServerInfo get(String idno)
  {
    return 
      (ServerInfo)getHibernateTemplate().get(ServerInfo.class, idno);
  }
  
  public Integer save(ServerInfo svr)
  {
    return (Integer)getHibernateTemplate()
      .save(svr);
  }
  
  public void update(ServerInfo svr)
  {
    getHibernateTemplate().update(svr);
  }
  
  public void delete(ServerInfo svr)
  {
    getHibernateTemplate().delete(svr);
  }
  
  public void delete(String idno)
  {
    getHibernateTemplate().delete(get(idno));
  }
  
  private String getQueryString(Integer serverType)
  {
    if (serverType.intValue() != -1) {
      return String.format("from ServerInfo where type = %d", new Object[] { serverType });
    }
    return "from ServerInfo";
  }
  
  public List<ServerInfo> findAll(Integer serverType)
  {
    return getHibernateTemplate().find(getQueryString(serverType));
  }
  
  public int getServerCount(Integer serverType)
  {
    List<ServerInfo> svrlist = findAll(serverType);
    if (svrlist != null) {
      return svrlist.size();
    }
    return 0;
  }
  
  public Boolean getOnline(String idno)
  {
    List<ServerSession> lstSess = getHibernateTemplate().find(" from ServerSession where svridno = ?", idno);
    if (lstSess.size() > 0) {
      return Boolean.valueOf(true);
    }
    return Boolean.valueOf(false);
  }
}
