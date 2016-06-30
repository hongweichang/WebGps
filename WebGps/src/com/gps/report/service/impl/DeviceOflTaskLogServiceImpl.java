package com.gps.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.dao.DeviceOflTaskLogDao;
import com.gps.report.model.DeviceOflTaskLog;
import com.gps.report.service.DeviceOflTaskLogService;
import java.util.Date;

public class DeviceOflTaskLogServiceImpl
  extends UniversalServiceImpl
  implements DeviceOflTaskLogService
{
  private PaginationDao paginationDao;
  private DeviceOflTaskLogDao deviceOflTaskLogDao;
  
  public Class getClazz()
  {
    return DeviceOflTaskLog.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DeviceOflTaskLogDao getDeviceOflTaskLogDao()
  {
    return this.deviceOflTaskLogDao;
  }
  
  public void setDeviceOflTaskLogDao(DeviceOflTaskLogDao deviceOflTaskLogDao)
  {
    this.deviceOflTaskLogDao = deviceOflTaskLogDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and devIdno in( '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format(",'%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  private String getDistinctQueryString(String dateB, String dateE, String[] devIDNO, Integer nTaskStatus, Integer nFileType, String devVerNum)
  {
    StringBuffer strQuery = new StringBuffer("");
    strQuery.append(" from DeviceOflTaskLog ");
    strQuery.append(String.format("where ((dtCreateTaskI >= %d and dtCreateTaskI <= %d) ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    strQuery.append(String.format("or (dtEndTaskI >= %d and dtEndTaskI <= %d)) ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    if ((nTaskStatus.intValue() == 0) || (nTaskStatus.intValue() == 2)) {
      strQuery.append(String.format("and nTaskStatus = '%s' ", new Object[] { nTaskStatus }));
    }
    strQuery.append(String.format("and nFileType = '%s' ", new Object[] { nFileType }));
    if (devVerNum != "") {
      strQuery.append(String.format("and strParam like '%%%s%%' ", new Object[] { devVerNum }));
    }
    appendDeviceCondition(strQuery, devIDNO);
    return strQuery.toString();
  }
  
  public AjaxDto<DeviceOflTaskLog> queryDistinctOflTaskLog(String dateB, String dateE, String[] devIdno, Integer nTaskStatus, Integer nFileType, String devVerNum, Pagination pagination)
  {
    String str = getDistinctQueryString(dateB, dateE, devIdno, nTaskStatus, nFileType, devVerNum);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  public AjaxDto<DeviceOflTaskLog> queryParameterConfiguration(String dateB, String dateE, String[] devIdno, Integer nTaskStatus, Integer nFileType, Pagination pagination)
  {
    String str = getQueryString(dateB, dateE, devIdno, nTaskStatus, nFileType);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIDNO, Integer nTaskStatus, Integer nFileType)
  {
    StringBuffer strQuery = new StringBuffer("");
    strQuery.append(" from DeviceOflTaskLog ");
    strQuery.append(String.format("where ((dtCreateTaskI >= %d and dtCreateTaskI <= %d) ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    strQuery.append(String.format("or (dtEndTaskI >= %d and dtEndTaskI <= %d)) ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    if ((nTaskStatus.intValue() == 0) || (nTaskStatus.intValue() == 2)) {
      strQuery.append(String.format("and nTaskStatus = '%s' ", new Object[] { nTaskStatus }));
    }
    if (nFileType.intValue() == 0) {
      strQuery.append(String.format("and (nFileType = '%s' or nFileType = '%s') ", new Object[] { Integer.valueOf(3), Integer.valueOf(4) }));
    } else {
      strQuery.append(String.format("and nFileType = '%s' ", new Object[] { nFileType }));
    }
    appendDeviceCondition(strQuery, devIDNO);
    return strQuery.toString();
  }
}
