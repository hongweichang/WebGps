package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.MapFence;
import com.gps.vehicle.model.MapMarker;
import com.gps.vehicle.service.MapMarkerService;
import java.util.List;

public class MapMarkerServiceImpl
  extends UniversalServiceImpl
  implements MapMarkerService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return MapFence.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public List<MapMarker> getMapMarkerList(Integer userId)
  {
    AjaxDto ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from MapMarker where UserID = %d", new Object[] { userId }), null);
    if (ajaxDto != null) {
      return ajaxDto.getPageList();
    }
    return null;
  }
}
