package com.gz.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gz.system.dao.GzBillboardKeeperInfoDao;
import com.gz.system.model.GzBillboardKeeperInfo;
import com.gz.system.service.GzBillboardKeeperService;

public class GzBillboardKeeperServiceImpl
  extends UniversalServiceImpl
  implements GzBillboardKeeperService
{
  private GzBillboardKeeperInfoDao gzBillboardKeeperInfoDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return GzBillboardKeeperInfo.class;
  }
  
  public GzBillboardKeeperInfoDao getGzBillboardKeeperInfoDao()
  {
    return this.gzBillboardKeeperInfoDao;
  }
  
  public void setGzBillboardKeeperInfoDao(GzBillboardKeeperInfoDao gzBillboardKeeperInfoDao)
  {
    this.gzBillboardKeeperInfoDao = gzBillboardKeeperInfoDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public GzBillboardKeeperInfo getBillboardKeeperByAccount(String name)
    throws Exception
  {
    return this.gzBillboardKeeperInfoDao.findByName(name);
  }
  
  public GzBillboardKeeperInfo getBillboardKeeper(String id)
  {
    return this.gzBillboardKeeperInfoDao.get(id);
  }
  
  public void saveBillboardKeeper(GzBillboardKeeperInfo gzb)
  {
    this.gzBillboardKeeperInfoDao.update(gzb);
  }
  
  public AjaxDto<GzBillboardKeeperInfo> getBillboardKeeperList(String id, String name, String addr, Integer type, Integer flowtype, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(id, name, addr, type, flowtype), pagination);
  }
  
  private String getQueryString(String id, String name, String addr, Integer type, Integer flowtype)
  {
    StringBuffer strQuery = new StringBuffer("from GzBillboardKeeperInfo where 1 = 1 ");
    if ((id != null) && (!id.isEmpty())) {
      strQuery.append(String.format("and id like '%%%s%%' ", new Object[] { id }));
    }
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format("and name like '%%%s%%' ", new Object[] { name }));
    }
    if ((addr != null) && (!addr.isEmpty())) {
      strQuery.append(String.format("and addr like '%%%s%%' ", new Object[] { addr }));
    }
    if (type.intValue() != 0) {
      strQuery.append(String.format("and type = %d ", new Object[] { type }));
    }
    if (flowtype.intValue() != 0) {
      strQuery.append(String.format("and flowtype = %d ", new Object[] { flowtype }));
    }
    return strQuery.toString();
  }
  
  public int getBillboardKeeperCount(String id, String name, String addr, Integer type, Integer flowtype)
  {
    return this.paginationDao.getCountByQueryStr(getQueryString(id, name, addr, type, flowtype)).intValue();
  }
}
