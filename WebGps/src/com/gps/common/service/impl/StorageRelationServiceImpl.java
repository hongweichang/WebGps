package com.gps.common.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.service.StorageRelationService;
import com.gps.model.StorageRelation;
import com.gps808.model.StandardStorageRelation;

public class StorageRelationServiceImpl
  extends UniversalServiceImpl
  implements StorageRelationService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return StorageRelation.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  private String getQueryString(String svrIdno, String devName)
  {
    StringBuffer strQuery = new StringBuffer(String.format("from StorageRelation where svrIdno = '%s'", new Object[] { svrIdno }));
    if ((devName != null) && (!devName.isEmpty())) {
      strQuery.append(String.format(" and devIdno like '%%%s%%'", new Object[] { devName }));
    }
    return strQuery.toString();
  }
  
  private String getDeviceQueryString(String[] devIdnos)
  {
    StringBuilder builder = new StringBuilder("from StorageRelation where 1 = 1");
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
  
  public int getRelationCount(String svrIdno)
  {
    return this.paginationDao.getCountByQueryStr(getQueryString(svrIdno, null)).intValue();
  }
  
  public AjaxDto<StorageRelation> getStoRelationList(String svrIdno, String devName, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(svrIdno, devName), pagination);
  }
  
  public AjaxDto<StorageRelation> getDeviceRelationList(String[] devIdnos)
  {
    return this.paginationDao.getPgntByQueryStr(getDeviceQueryString(devIdnos), null);
  }
  
  public AjaxDto<StandardStorageRelation> getStoRelationList(String svrIdno, String[] vehiIdnos, String condition, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer(" from StandardStorageRelation where 1 = 1 ");
    if ((svrIdno != null) && (!svrIdno.isEmpty())) {
      strQuery.append(String.format(" and svrIdno = '%s'", new Object[] { svrIdno }));
    }
    if ((vehiIdnos != null) && (vehiIdnos.length > 0))
    {
      for (int i = 0; i < vehiIdnos.length; i++) {
        if (i == 0) {
          strQuery.append(String.format(" and (vehiIdno = '%s'", new Object[] { vehiIdnos[i] }));
        } else {
          strQuery.append(String.format(" or vehiIdno = '%s'", new Object[] { vehiIdnos[i] }));
        }
      }
      strQuery.append(") ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      strQuery.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), pagination);
  }
}
