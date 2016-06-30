package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.SnapshotPlan;
import com.gps.vehicle.service.SnapshotPlanService;

public class SnapshotPlanServiceImpl
  extends UniversalServiceImpl
  implements SnapshotPlanService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return SnapshotPlan.class;
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
    StringBuilder builder = new StringBuilder("from SnapshotPlan where 1 = 1");
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
    builder.append(" and devIdno in (select devIdno from StorageRelation) ");
    return builder.toString();
  }
  
  public AjaxDto<SnapshotPlan> getSnapshotPlanList(String[] devIdnos, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(devIdnos), pagination);
  }
}
