package com.gps.report.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.dao.DeviceNetFlowDao;
import com.gps.report.model.DeviceNetFlow;
import com.gps.report.service.DeviceNetFlowService;
import com.gps.report.vo.DeviceNetflowSummary;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Hibernate;

public class DeivceNetFlowServiceImpl
  extends UniversalServiceImpl
  implements DeviceNetFlowService
{
  private PaginationDao paginationDao;
  private DeviceNetFlowDao deviceNetFlowDao;
  
  public Class getClazz()
  {
    return DeviceNetFlow.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DeviceNetFlowDao getDeviceNetFlowDao()
  {
    return this.deviceNetFlowDao;
  }
  
  public void setDeviceNetFlowDao(DeviceNetFlowDao deviceNetFlowDao)
  {
    this.deviceNetFlowDao = deviceNetFlowDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIdno, Integer dayUsed, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceNetFlow ");
    strQuery.append(String.format("where dtime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIdno);
    if (dayUsed != null) {
      strQuery.append(String.format("curDayUsed >= %d ", new Object[] { dayUsed }));
    }
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
    StringBuffer strQuery = new StringBuffer("select A.DevIDNO as devIdno, A.DateStatistics as dtime, A.fCurDayUsed as curDayUsed");
    strQuery.append(", A.fDayLimit as dayLimit, A.fCurMonthUsed as curMonthUsed, A.fMonthLimit as monthLimit");
    strQuery.append(" from dev_flow_statistics A");
    if (isMaxDate) {
      strQuery.append(", (SELECT DevIDNO, MAX(DateStatistics) max_day FROM dev_flow_statistics ");
    } else {
      strQuery.append(", (SELECT DevIDNO, MIN(DateStatistics) max_day FROM dev_flow_statistics ");
    }
    strQuery.append(String.format("where DateStatistics >= '%s' and DateStatistics <= '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIDNO);
    strQuery.append("GROUP BY DevIDNO) B ");
    strQuery.append("WHERE A.DevIDNO = B.DevIDNO AND A.DateStatistics = B.max_day");
    return strQuery.toString();
  }
  
  public AjaxDto<DeviceNetflowSummary> queryDistinctNetFlow(String dateB, String dateE, String[] devIdno, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer strQuery = new StringBuffer("select DevIDNO as devIdno, sum(fCurDayUsed) as totalNetFlow, MIN(DateStatistics) as startTime, MAX(DateStatistics) as endTime from dev_flow_statistics ");
    strQuery.append(String.format("where DateStatistics >= '%s' and DateStatistics <= '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIdno);
    String column = getTableColumn(qtype);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    strQuery.append("GROUP BY DevIDNO");
    sortname = getTableColumn(sortname);
    if (!sortname.isEmpty()) {
      strQuery.append(" order by " + sortname + " " + sortorder);
    }
    String str = strQuery.toString();
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("startTime", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("totalNetFlow", Hibernate.FLOAT));
    StringBuffer countSql = new StringBuffer("select count(*) from (");
    countSql.append(str);
    countSql.append(") A");
    return this.paginationDao.getExtraByNativeSqlEx(str, pagination, scalars, DeviceNetflowSummary.class, countSql.toString());
  }
  
  public AjaxDto<DeviceNetFlow> queryNetFlow(String dateB, String dateE, String[] devIdno, Integer dayUsed, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    String str = getQueryString(dateB, dateE, devIdno, dayUsed, queryFilter, qtype, sortname, sortorder);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  protected String getTableColumn(String qtype)
  {
    String column = "";
    if ((qtype != null) && (!qtype.isEmpty())) {
      if ("devIdno".equals(qtype)) {
        column = "DevIdno";
      } else {
        column = qtype;
      }
    }
    return column;
  }
}
