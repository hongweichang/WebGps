package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.DriverInfo;
import com.gps.vehicle.service.DriverInfoService;

public class DriverInfoServiceImpl
  extends UniversalServiceImpl
  implements DriverInfoService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DriverInfo.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public AjaxDto<DriverInfo> getDriverList(Integer userId, String name, Pagination pagination)
  {
    StringBuilder builder = new StringBuilder(String.format("from DriverInfo where userID = %d", new Object[] { userId }));
    if (name != null) {
      builder.append(String.format(" and (name like '%%%s%%' or telephone like '%%%s%%' or licence like '%%%s%%')", new Object[] { name, name, name }));
    }
    return this.paginationDao.getPgntByQueryStr(builder.toString(), pagination);
  }
}
