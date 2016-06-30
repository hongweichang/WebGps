package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.DeviceStatusDao;
import com.gps.model.DeviceStatus;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DeviceStatusDaoHibernate
  extends HibernateDaoSupportEx
  implements DeviceStatusDao
{
  private String getQueryString(String name)
  {
    StringBuffer str = new StringBuffer("from DeviceStatus WHERE online = 1");
    if (!name.equals("")) {
      str.append(String.format(" and (devInfo.name like '%%%s%%' or devIdno like '%%%s%%')", new Object[] { name, name }));
    }
    return str.toString();
  }
  
  public int getTotalCount()
  {
    List<DeviceStatus> devlist = getHibernateTemplate()
      .find("from DeviceStatus");
    return devlist.size();
  }
  
  public int getOnlineCount(String name)
  {
    List<DeviceStatus> devlist = getHibernateTemplate()
      .find(getQueryString(name));
    return devlist.size();
  }
}
