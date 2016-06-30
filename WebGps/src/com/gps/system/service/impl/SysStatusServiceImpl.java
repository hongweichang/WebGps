package com.gps.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.DeviceStatus;
import com.gps.model.UserSession;
import com.gps.system.service.SysStatusService;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Hibernate;

public class SysStatusServiceImpl
  extends UniversalServiceImpl
  implements SysStatusService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return UserSession.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  protected String getDeviceUnregSql()
  {
    String query = "select dev_status.* from dev_status left join dev_info on dev_status.DevIDNO = dev_info.IDNO where dev_info.IDNO is null and dev_status.online = 1";
    return query;
  }
  
  protected String getDeviceOnlineSql(String name)
  {
    StringBuffer strQuery = new StringBuffer("select dev_status.* from dev_status ");
    if ((name != null) && (!name.isEmpty()))
    {
      strQuery.append(String.format(", (select dev_info.idno as idno from dev_info, account where dev_info.idno = account.Account and (dev_info.idno like '%%%s%%' or account.Name like '%%%s%%')) B ", new Object[] { name, name }));
      strQuery.append("where dev_status.DevIDNO = B.idno ");
    }
    else
    {
      strQuery.append("left join dev_info on dev_status.DevIDNO = dev_info.IDNO where dev_info.IDNO is not null ");
    }
    strQuery.append("and dev_status.online = 1 ");
    return strQuery.toString();
  }
  
  public Integer getDeviceUnregCount()
  {
    return this.paginationDao.getCountByNativeSql(getDeviceUnregSql());
  }
  
  protected List<QueryScalar> getStatusQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("network", Hibernate.INTEGER));
    scalars.add(new QueryScalar("netName", Hibernate.STRING));
    scalars.add(new QueryScalar("gwsvrIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("online", Hibernate.INTEGER));
    scalars.add(new QueryScalar("status1", Hibernate.INTEGER));
    scalars.add(new QueryScalar("status2", Hibernate.INTEGER));
    scalars.add(new QueryScalar("status3", Hibernate.INTEGER));
    scalars.add(new QueryScalar("status4", Hibernate.INTEGER));
    scalars.add(new QueryScalar("tempSensor1", Hibernate.INTEGER));
    scalars.add(new QueryScalar("tempSensor2", Hibernate.INTEGER));
    scalars.add(new QueryScalar("tempSensor3", Hibernate.INTEGER));
    scalars.add(new QueryScalar("tempSensor4", Hibernate.INTEGER));
    scalars.add(new QueryScalar("speed", Hibernate.INTEGER));
    scalars.add(new QueryScalar("hangXiang", Hibernate.INTEGER));
    scalars.add(new QueryScalar("jingDu", Hibernate.INTEGER));
    scalars.add(new QueryScalar("weiDu", Hibernate.INTEGER));
    scalars.add(new QueryScalar("gaoDu", Hibernate.INTEGER));
    scalars.add(new QueryScalar("mapJingDu", Hibernate.STRING));
    scalars.add(new QueryScalar("mapWeiDu", Hibernate.STRING));
    scalars.add(new QueryScalar("parkTime", Hibernate.INTEGER));
    scalars.add(new QueryScalar("liCheng", Hibernate.INTEGER));
    scalars.add(new QueryScalar("gpsTime", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("ip", Hibernate.STRING));
    scalars.add(new QueryScalar("port", Hibernate.INTEGER));
    scalars.add(new QueryScalar("updateTime", Hibernate.TIMESTAMP));
    return scalars;
  }
  
  public AjaxDto<DeviceStatus> getDeviceUnregList(Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getDeviceUnregSql(), pagination, getStatusQueryScalar(), DeviceStatus.class, null);
  }
  
  private String getDeviceQueryString(String name)
  {
    String str = "from DeviceStatus WHERE online = 1";
    
    return str;
  }
  
  public Integer getDeviceOnlineCount()
  {
    return this.paginationDao.getCountByNativeSql(getDeviceOnlineSql(""));
  }
  
  public AjaxDto<DeviceStatus> getDeviceOnlineList(String name, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getDeviceOnlineSql(name), pagination, getStatusQueryScalar(), DeviceStatus.class, null);
  }
  
  private String getClientQueryString(String name)
  {
    String str = "from UserSession";
    if ((name != null) && (!name.equals(""))) {
      str = str + String.format(" where userInfo.userAccount.name like '%%%s%%' or userInfo.userAccount.account like '%%%s%%'", new Object[] { name, name });
    }
    return str;
  }
  
  public Integer getClientOnlineCount()
  {
    return this.paginationDao.getCountByQueryStr("from UserSession");
  }
  
  public AjaxDto<UserSession> getClientOnlineList(String usrname, Pagination pagination)
  {
    AjaxDto<UserSession> ajaxDto = new AjaxDto();
    ajaxDto = this.paginationDao.getPgntByQueryStr(getClientQueryString(usrname), pagination);
    return ajaxDto;
  }
}
