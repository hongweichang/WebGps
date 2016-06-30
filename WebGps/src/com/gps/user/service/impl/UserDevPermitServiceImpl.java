package com.gps.user.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.user.dao.UserDevPermitDao;
import com.gps.user.model.UserDevPermit;
import com.gps.user.model.UserDevPermitEx;
import com.gps.user.service.UserDevPermitService;
import java.util.List;

public class UserDevPermitServiceImpl
  extends UniversalServiceImpl
  implements UserDevPermitService
{
  private PaginationDao paginationDao;
  private UserDevPermitDao userDevPermitDao;
  
  public Class getClazz()
  {
    return UserDevPermit.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public UserDevPermitDao getUserDevPermitDao()
  {
    return this.userDevPermitDao;
  }
  
  public void setUserDevPermitDao(UserDevPermitDao userDevPermitDao)
  {
    this.userDevPermitDao = userDevPermitDao;
  }
  
  public List<UserDevPermit> getDevPermitList(Integer accountId)
  {
    AjaxDto<UserDevPermit> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from UserDevPermit where accountId = %d", new Object[] { accountId }), null);
    return ajaxDto.getPageList();
  }
  
  public AjaxDto<UserDevPermitEx> getPermitListByDevIDNO(String devIdno, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(String.format("from UserDevPermitEx where devIdno = '%s'", new Object[] { devIdno }), pagination);
  }
  
  public void editUserDevPermit(List<UserDevPermit> addPermits, List<UserDevPermit> delPermits)
  {
    this.userDevPermitDao.editUserDevPermit(addPermits, delPermits);
  }
  
  public void delDevPermit(String[] ids)
  {
    this.userDevPermitDao.delDevPermit(ids);
  }
}
