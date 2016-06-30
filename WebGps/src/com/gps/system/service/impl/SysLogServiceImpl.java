package com.gps.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.system.dao.ServerLogDao;
import com.gps.system.dao.SysUsrLogDao;
import com.gps.system.model.ServerLog;
import com.gps.system.model.SysUsrLog;
import com.gps.system.service.SysLogService;

public class SysLogServiceImpl
  extends UniversalServiceImpl
  implements SysLogService
{
  private ServerLogDao serverLogDao;
  private SysUsrLogDao sysUsrLogDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return ServerLog.class;
  }
  
  public ServerLogDao getServerLogDao()
  {
    return this.serverLogDao;
  }
  
  public void setServerLogDao(ServerLogDao serverLogDao)
  {
    this.serverLogDao = serverLogDao;
  }
  
  public SysUsrLogDao getSysUsrLogDao()
  {
    return this.sysUsrLogDao;
  }
  
  public void setSysUsrLogDao(SysUsrLogDao sysUsrLogDao)
  {
    this.sysUsrLogDao = sysUsrLogDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public AjaxDto<ServerLog> getServerLogList(String begin, String end, Pagination pagination)
  {
    AjaxDto<ServerLog> ajaxDto = new AjaxDto();
    ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from ServerLog where dtime BETWEEN '%s' and '%s'", new Object[] { begin, end }), 
      pagination);
    return ajaxDto;
  }
  
  public AjaxDto<SysUsrLog> getSysUsrLogList(String begin, String end, Pagination pagination)
  {
    AjaxDto<SysUsrLog> ajaxDto = new AjaxDto();
    ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from SysUsrLog where dtime BETWEEN '%s' and '%s' order by dtime desc", new Object[] { begin, end }), 
      pagination);
    return ajaxDto;
  }
}
