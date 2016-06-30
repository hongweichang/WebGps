package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.MapFence;
import com.gps.vehicle.service.MapFenceService;
import java.util.List;

public class MapFenceServiceImpl
  extends UniversalServiceImpl
  implements MapFenceService
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
  
  private String getQueryString(String[] devIdnos, String markerId)
  {
    StringBuilder builder = new StringBuilder("from MapFence where 1 = 1");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          builder.append(String.format(" and (devIdno = '%s'", new Object[] { devIdnos[i] }));
        } else {
          builder.append(String.format(" or devIdno = '%s'", new Object[] { devIdnos[i] }));
        }
      }
      builder.append(")");
    }
    if (markerId != null) {
      builder.append(String.format(" and markerID = %s", new Object[] { markerId }));
    }
    return builder.toString();
  }
  
  public AjaxDto<MapFence> getMapFenceList(String[] devIdnos, String markerId, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(devIdnos, markerId), pagination);
  }
  
  public MapFence getMapFence(String devIdno, Integer markerId)
  {
    AjaxDto<MapFence> ajaxDto = this.paginationDao.getPgntByQueryStr(
      String.format("from MapFence where devIdno = '%s' and markerId = %d", new Object[] { devIdno, markerId }), null);
    if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      return (MapFence)ajaxDto.getPageList().get(0);
    }
    return null;
  }
}
