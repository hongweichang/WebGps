package com.gps.system.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.system.dao.DownStationDao;
import com.gps.system.model.DownStation;
import java.util.List;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class DownStationDaoHibernate
  extends HibernateDaoSupportEx
  implements DownStationDao
{
  public DownStation findByName(String name)
  {
    List<DownStation> downStations = getHibernateTemplate()
      .find(" from DownStation where Name = ?", name);
    if ((downStations != null) && (downStations.size() >= 1)) {
      return (DownStation)downStations.get(0);
    }
    return null;
  }
  
  public DownStation findBySsid(String ssid)
  {
    List<DownStation> downStations = getHibernateTemplate()
      .find(" from DownStation where ssid like '%%%s%%'", ',' + ssid + ',');
    if ((downStations != null) && (downStations.size() >= 1)) {
      return (DownStation)downStations.get(0);
    }
    return null;
  }
}
