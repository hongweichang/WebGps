package com.gps.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.system.dao.ServerLogDao;
import com.gps.system.model.ServerLog;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class ServerLogDaoHibernate
  extends HibernateDaoSupportEx
  implements ServerLogDao
{
  private String getTimeQuery(String begin, String end)
  {
    return String.format("from ServerLog where dtime BETWEEN '%s' and '%s'", new Object[] { begin, end });
  }
  
  public int getLogCount(String begin, String end)
  {
    List<ServerLog> svrlog = getHibernateTemplate()
      .find(getTimeQuery(begin, end));
    return svrlog.size();
  }
  
  public List<ServerLog> getLogList(String begin, String end, Integer pageIndex, Integer pageSize)
  {
    return findByPage(getTimeQuery(begin, end), 
      pageIndex.intValue() * pageSize.intValue(), pageSize.intValue());
  }
}
