package com.gps.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.system.dao.DownStationDao;
import com.gps.system.model.DownStation;
import com.gps.system.service.DownStationService;

public class DownStationServiceImpl
  extends UniversalServiceImpl
  implements DownStationService
{
  private PaginationDao paginationDao;
  private DownStationDao downStationDao;
  
  public Class getClazz()
  {
    return DownStation.class;
  }
  
  public DownStationDao getDownStationDao()
  {
    return this.downStationDao;
  }
  
  public void setDownStationDao(DownStationDao downStationDao)
  {
    this.downStationDao = downStationDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DownStation getStationByName(String name)
    throws Exception
  {
    return this.downStationDao.findByName(name);
  }
  
  public DownStation getStationBySsid(String ssid)
    throws Exception
  {
    return this.downStationDao.findByName(ssid);
  }
  
  public AjaxDto<DownStation> getAllStation(Pagination pagination)
    throws Exception
  {
    return this.paginationDao.getPgntByQueryStr("from DownStation", pagination);
  }
}
