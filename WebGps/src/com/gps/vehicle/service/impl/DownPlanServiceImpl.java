package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.DownPlan;
import com.gps.vehicle.service.DownPlanService;

public class DownPlanServiceImpl
  extends UniversalServiceImpl
  implements DownPlanService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DownPlan.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  private String getQueryString(String[] devIdnos)
  {
    StringBuilder builder = new StringBuilder("from DownPlan where 1 = 1");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          builder.append(String.format(" and (devIdno = '%s'", new Object[] { devIdnos[i] }));
        } else {
          builder.append(String.format(" or devIdno = '%s'", new Object[] { devIdnos[i] }));
        }
      }
      builder.append(") ");
    }
    return builder.toString();
  }
  
  public AjaxDto<DownPlan> getDownPlanList(String[] devIdnos, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(devIdnos), pagination);
  }
}
