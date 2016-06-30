package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.DevRegistDao;
import com.gps.model.DevRegist;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DevRegistDaoHibernate
  extends HibernateDaoSupportEx
  implements DevRegistDao
{
  public Integer getRegistNumber()
  {
    List<DevRegist> devregs = getHibernateTemplate().find(" from DevRegist");
    if (devregs.size() > 0) {
      return ((DevRegist)devregs.get(0)).getNumber();
    }
    return Integer.valueOf(20);
  }
  
  public Long getServerConfig()
  {
    List<DevRegist> devregs = getHibernateTemplate().find(" from DevRegist");
    if (devregs.size() > 0) {
      return ((DevRegist)devregs.get(0)).getSvrConfig();
    }
    return Long.valueOf(0L);
  }
}
