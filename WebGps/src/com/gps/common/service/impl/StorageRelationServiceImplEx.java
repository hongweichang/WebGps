package com.gps.common.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.service.StorageRelationServiceEx;
import com.gps.model.StorageRelationEx;
import java.util.List;

public class StorageRelationServiceImplEx
  extends UniversalServiceImpl
  implements StorageRelationServiceEx
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return StorageRelationEx.class;
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
  
  public List<StorageRelationEx> getStoRelationList(String[] devIdnos)
  {
    AjaxDto<StorageRelationEx> ajaxDto = this.paginationDao.getPgntByQueryStr(getQueryString(devIdnos), null);
    return ajaxDto.getPageList();
  }
}
