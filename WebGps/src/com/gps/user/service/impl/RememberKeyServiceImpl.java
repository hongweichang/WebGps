package com.gps.user.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.RememberKey;
import com.gps.user.service.RememberKeyService;
import java.util.List;

public class RememberKeyServiceImpl
  extends UniversalServiceImpl
  implements RememberKeyService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return RememberKey.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public RememberKey getRememberKey(String key)
  {
    AjaxDto<RememberKey> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from RememberKey where cookie = '%s'", new Object[] { key }), null);
    List<RememberKey> keys = ajaxDto.getPageList();
    if ((keys != null) && (keys.size() > 0)) {
      return (RememberKey)keys.get(0);
    }
    return null;
  }
  
  public RememberKey getRememberKey(Integer accountId)
  {
    AjaxDto<RememberKey> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from RememberKey where accountId = %d", new Object[] { accountId }), null);
    List<RememberKey> keys = ajaxDto.getPageList();
    if ((keys != null) && (keys.size() > 0)) {
      return (RememberKey)keys.get(0);
    }
    return null;
  }
}
