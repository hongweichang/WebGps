package com.gps.report.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.dao.DeviceDailyDao;
import com.gps.report.model.DeviceDaily;
import com.gps.report.service.DeviceDailyService;
import java.util.List;

public class DeviceDailyServiceImpl
  extends UniversalServiceImpl
  implements DeviceDailyService
{
  private PaginationDao paginationDao;
  private DeviceDailyDao deviceDailyDao;
  
  public Class getClazz()
  {
    return DeviceDaily.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DeviceDailyDao getDeviceDailyDao()
  {
    return this.deviceDailyDao;
  }
  
  public void setDeviceDailyDao(DeviceDailyDao deviceDailyDao)
  {
    this.deviceDailyDao = deviceDailyDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected String getTableColumn(String qtype)
  {
    String column = "";
    if ((qtype != null) && (!qtype.isEmpty())) {
      if ("devIdno".equals(qtype)) {
        column = "DevIdno";
      } else if ("date".equals(qtype)) {
        column = "date";
      } else if ("startTime".equals(qtype)) {
        column = "startTime";
      } else if ("endTime".equals(qtype)) {
        column = "endTime";
      } else {
        column = qtype;
      }
    }
    return column;
  }
  
  private String getQueryString(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, String[] devIDNO)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceDaily ");
    
    strQuery.append(String.format("where date >= '%s' and date <= '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIDNO);
    String column = getTableColumn(qtype);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    sortname = getTableColumn(sortname);
    if (!sortname.isEmpty()) {
      strQuery.append(" order by " + sortname + " " + sortorder);
    }
    return strQuery.toString();
  }
  
  private String getDistinctQueryString(String dateB, String dateE, boolean isMaxDate, String[] devIDNO, boolean distinct)
  {
    StringBuffer strQuery = new StringBuffer("select A.DevIDNO as devIdno, A.GPSDate as date, A.STime as startTime");
    strQuery.append(", A.SJingDu as startJingDu, A.SWeiDu as startWeiDu, A.SGaoDu as startGaoDu, A.SLiCheng as startLiCheng, A.SYouLiang as startYouLiang");
    strQuery.append(", A.ETime as endTime, A.EJingDu as endJingDu, A.EWeiDu as endWeiDu, A.EGaoDu as endGaoDu, A.ELiCheng as endLiCheng, A.EYouLiang as endYouLiang");
    strQuery.append(", A.AYouLiang as addYouLiang, A.RYouLiang as reduceYouLiang, A.UWifiLiuLiang as uploadWifiLiuLiang, A.DWifiLiuLiang as downWifiLiuLiang");
    strQuery.append(", A.USimLiuLiang as uploadSimLiuLiang, A.DSimLiuLiang as downSimLiuLiang");
    strQuery.append(" from dev_daily A");
    if (isMaxDate) {
      strQuery.append(", (SELECT DevIDNO, MAX(GPSDate) max_day FROM dev_daily ");
    } else {
      strQuery.append(", (SELECT DevIDNO, MIN(GPSDate) max_day FROM dev_daily ");
    }
    strQuery.append(String.format("where GPSDate >= '%s' and GPSDate <= '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIDNO);
    strQuery.append("GROUP BY DevIDNO) B ");
    strQuery.append("WHERE A.DevIDNO = B.DevIDNO AND A.GPSDate = B.max_day");
    return strQuery.toString();
  }
  
  public List<DeviceDaily> queryDistinctDaily(String dateB, String dateE, boolean isMaxDate, String[] devIdno, Pagination pagination)
  {
    String str = getDistinctQueryString(dateB, dateE, isMaxDate, devIdno, true);
    return this.deviceDailyDao.queryDistinctDaily(str);
  }
  
  public AjaxDto<DeviceDaily> queryDeviceDaily(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, String[] devIdno, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(dateB, dateE, queryFilter, qtype, sortname, sortorder, devIdno), pagination);
  }
}
