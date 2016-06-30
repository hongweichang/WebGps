package com.gps.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.action.BaseAction;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.dao.DeviceHardwareStatusDao;
import com.gps.report.model.DeviceHardwareStatus;
import com.gps.report.service.DeviceHardwareStatusService;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.Hibernate;

public class DeviceHardwareStatusServiceImpl
  extends UniversalServiceImpl
  implements DeviceHardwareStatusService
{
  private PaginationDao paginationDao;
  private DeviceHardwareStatusDao deviceHardwareStatusDao;
  
  public Class getClazz()
  {
    return DeviceHardwareStatus.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DeviceHardwareStatusDao getDeviceHardwareStatusDao()
  {
    return this.deviceHardwareStatusDao;
  }
  
  public void setDeviceHardwareStatusDao(DeviceHardwareStatusDao deviceHardwareStatusDao)
  {
    this.deviceHardwareStatusDao = deviceHardwareStatusDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and devIdno in( '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format(",'%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIDNO, String diskStatus)
  {
    StringBuffer strQuery = new StringBuffer(" from DeviceHardwareStatus ");
    strQuery.append(String.format("where DateI >= %d and DateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    if (diskStatus != null) {
      if (Integer.parseInt(diskStatus) == 0) {
        strQuery.append(String.format("and DiskStatus not like '%%%s%%' ", new Object[] { Integer.valueOf(1) }));
      } else if (Integer.parseInt(diskStatus) == 1) {
        strQuery.append(String.format("and DiskStatus like '%%%s%%' ", new Object[] { Integer.valueOf(1) }));
      }
    }
    appendDeviceCondition(strQuery, devIDNO);
    return strQuery.toString();
  }
  
  private String getDistinctQueryString(String dateB, String dateE, String[] devIDNO, boolean isMaxDate, String devVerNum)
  {
    StringBuffer strQuery = new StringBuffer("select A.DevIDNO as devIdno, A.Date as date, A.DevVerNum as devVerNum, A.UpdateTime as updateTime");
    strQuery.append(" from dev_hardware_status A");
    if (isMaxDate) {
      strQuery.append(", (SELECT DevIDNO, MAX(Date) max_day FROM dev_hardware_status ");
    } else {
      strQuery.append(", (SELECT DevIDNO, MIN(Date) max_day FROM dev_hardware_status ");
    }
    strQuery.append(String.format("where DateI >= %d and DateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    if (devVerNum != null) {
      strQuery.append(String.format("and DevVerNum like '%%%s%%' ", new Object[] { devVerNum }));
    }
    appendDeviceCondition(strQuery, devIDNO);
    strQuery.append("GROUP BY DevIDNO) B ");
    strQuery.append("WHERE A.DevIDNO = B.DevIDNO AND A.Date = B.max_day");
    return strQuery.toString();
  }
  
  public AjaxDto<DeviceHardwareStatus> queryHardwareStatus(String dateB, String dateE, String[] devIdno, String diskStatus, Pagination pagination)
  {
    String str = getQueryString(dateB, dateE, devIdno, diskStatus);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  public AjaxDto<DeviceHardwareStatus> queryDistinctHardwareStatus(String dateB, String dateE, String[] devIdno, boolean isMaxDate, String devVerNum, Pagination pagination)
  {
    String str = getDistinctQueryString(dateB, dateE, devIdno, isMaxDate, devVerNum);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    if (BaseAction.getEnableSqlServer())
    {
      scalars.add(new QueryScalar("date", Hibernate.DATE));
      scalars.add(new QueryScalar("updateTime", Hibernate.DATE));
    }
    else
    {
      scalars.add(new QueryScalar("date", Hibernate.TIMESTAMP));
      scalars.add(new QueryScalar("updateTime", Hibernate.TIMESTAMP));
    }
    scalars.add(new QueryScalar("devVerNum", Hibernate.STRING));
    return this.paginationDao.getExtraByNativeSqlEx(str, pagination, scalars, DeviceHardwareStatus.class, null);
  }
}
