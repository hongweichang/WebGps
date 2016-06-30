package com.gps.common.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.dao.ServerInfoDao;
import com.gps.common.service.ServerService;
import com.gps.model.ServerInfo;
import com.gps.system.vo.ServerStatus;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ServerServiceImpl
  extends UniversalServiceImpl
  implements ServerService
{
  private ServerInfoDao serverInfoDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return ServerInfo.class;
  }
  
  public ServerInfoDao getServerInfoDao()
  {
    return this.serverInfoDao;
  }
  
  public void setServerInfoDao(ServerInfoDao serverInfoDao)
  {
    this.serverInfoDao = serverInfoDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public AjaxDto<ServerInfo> getAllServer(Integer serverType, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(String.format("from ServerInfo where type = %d", new Object[] { serverType }), 
      pagination);
  }
  
  public int getServerCount(Integer serverType, Integer area)
  {
    StringBuilder builder = new StringBuilder(String.format("from ServerInfo where type = %d", new Object[] { serverType }));
    if (area != null) {
      builder.append(String.format(" and area = %d", new Object[] { area }));
    }
    return this.paginationDao.getCountByQueryStr(builder.toString()).intValue();
  }
  
  public Boolean getLoginSvrOnline()
  {
    return this.serverInfoDao.getOnline("1");
  }
  
  public ServerStatus getServerStatus(int serverType, String exceptIdno)
  {
    ServerStatus status = new ServerStatus(Integer.valueOf(0), Integer.valueOf(0));
    List<ServerInfo> svrList = this.serverInfoDao.findAll(Integer.valueOf(serverType));
    if (svrList != null)
    {
      Iterator<ServerInfo> it = svrList.iterator();
      int online = 0;
      int total = 0;
      while (it.hasNext())
      {
        ServerInfo svrInfo = (ServerInfo)it.next();
        if (!svrInfo.getIdno().equals(exceptIdno))
        {
          total++;
          if (svrInfo.getSvrSession() != null) {
            online++;
          }
        }
      }
      status.setTotal(Integer.valueOf(total));
      status.setOnline(Integer.valueOf(online));
    }
    return status;
  }
  
  public ServerInfo findServer(int svrId)
  {
    AjaxDto<ServerInfo> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from ServerInfo where id = %d", new Object[] { Integer.valueOf(svrId) }), null);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      return (ServerInfo)ajaxDto.getPageList().get(0);
    }
    return null;
  }
  
  protected ServerInfo getRandServer(List<ServerInfo> servers)
  {
    return (ServerInfo)servers.get((int)(Math.random() * 1000.0D) % servers.size());
  }
  
  public ServerInfo getOnlineServer(int serverType)
  {
    AjaxDto<ServerInfo> ajaxDto = getAllServer(Integer.valueOf(serverType), null);
    if ((ajaxDto.getPageList() != null) && (!ajaxDto.getPageList().isEmpty()))
    {
      List<ServerInfo> onlineList = new ArrayList();
      for (int i = 0; i < ajaxDto.getPageList().size(); i++)
      {
        ServerInfo server = (ServerInfo)ajaxDto.getPageList().get(i);
        if (server.getSvrSession() != null) {
          onlineList.add(server);
        }
      }
      if (onlineList.size() > 0) {
        return getRandServer(onlineList);
      }
      return getRandServer(ajaxDto.getPageList());
    }
    return null;
  }
}
