package com.gps.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.system.dao.SysUsrLogDao;
import com.gps.system.model.SysUsrLog;
import java.util.Date;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class SysUsrLogDaoHibernate
  extends HibernateDaoSupportEx
  implements SysUsrLogDao
{
  public Integer save(SysUsrLog log)
  {
    return (Integer)getHibernateTemplate()
      .save(log);
  }
  
  public Integer addUsrLog(Integer usrid, Integer mainType, Integer subType, String param1, String param2, String param3, String param4)
  {
    SysUsrLog usrlog = new SysUsrLog(usrid, mainType, subType, 
      param1, param2, param3, param4, new Date());
    return save(usrlog);
  }
  
  private String getTimeQuery(String begin, String end)
  {
    return String.format("from SysUsrLog where dtime BETWEEN '%s' and '%s'", new Object[] { begin, end });
  }
  
  public int getLogCount(String begin, String end)
  {
    List<SysUsrLog> usrlog = getHibernateTemplate()
      .find(getTimeQuery(begin, end));
    return usrlog.size();
  }
  
  public List<SysUsrLog> getLogList(String begin, String end, Integer pageIndex, Integer pageSize)
  {
    return findByPage(getTimeQuery(begin, end), 
      pageIndex.intValue() * pageSize.intValue(), pageSize.intValue());
  }
}
