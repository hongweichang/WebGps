package com.gps.report.service.impl;

import com.framework.web.action.BaseAction;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.DeviceAlarm;
import com.gps.report.dao.DeviceAlarmDao;
import com.gps.report.service.DeviceAlarmService;
import com.gps.report.vo.DailyCount;
import com.gps.report.vo.DeviceAlarmSummary;
import com.gps.system.model.SysNews;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.hibernate.Hibernate;

public class DeviceAlarmServiceImpl
  extends UniversalServiceImpl
  implements DeviceAlarmService
{
  private PaginationDao paginationDao;
  private DeviceAlarmDao deviceAlarmDao;
  
  public Class getClazz()
  {
    return DeviceAlarm.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public DeviceAlarmDao getDeviceAlarmDao()
  {
    return this.deviceAlarmDao;
  }
  
  public void setDeviceAlarmDao(DeviceAlarmDao deviceAlarmDao)
  {
    this.deviceAlarmDao = deviceAlarmDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected void appendArmTypeCondition(StringBuffer strQuery, List<Integer> lstArmType)
  {
    if ((lstArmType != null) && (lstArmType.size() > 0))
    {
      strQuery.append(String.format("and (armType = %d ", new Object[] { lstArmType.get(0) }));
      for (int i = 1; i < lstArmType.size(); i++) {
        strQuery.append(String.format("or armType = %d ", new Object[] { lstArmType.get(i) }));
      }
      strQuery.append(") ");
    }
  }
  
  protected String getTableColumn(String qtype)
  {
    String column = "";
    if ((qtype != null) && (!qtype.isEmpty())) {
      if ("devIdno".equals(qtype)) {
        column = "DevIdno";
      } else if ("date".equals(qtype)) {
        column = "date";
      } else if ("beginTime".equals(qtype)) {
        column = "beginTime";
      } else if ("endTime".equals(qtype)) {
        column = "endTime";
      } else if ("armTime".equals(qtype)) {
        column = "ArmTime";
      } else {
        column = qtype;
      }
    }
    return column;
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, String condition, String fromTable, String group, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer strQuery = new StringBuffer(fromTable);
    strQuery.append(String.format("where armTime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    if ((condition != null) && (!condition.isEmpty())) {
      strQuery.append(condition);
    }
    if ((group != null) && (!group.isEmpty()))
    {
      strQuery.append(group);
    }
    else if ((condition == null) || (condition.isEmpty()))
    {
      sortname = getTableColumn(sortname);
      if (!sortname.isEmpty()) {
        strQuery.append(" order by " + sortname + " " + sortorder);
      } else {
        strQuery.append(" order by armTime ASC");
      }
    }
    return strQuery.toString();
  }
  
  public List<DeviceAlarmSummary> summaryDeviceAlarm(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, String condition, String group, String countCond, List<QueryScalar> countScalars, boolean armInfo, String queryFilter, String qtype, String sortname, String sortorder)
  {
    String query = "";
    List<QueryScalar> scalars = new ArrayList();
    String sql = "select count(*) as count, DevIDNO as devIdno, ArmType as armType, min(ArmTime) as beginTime, max(ArmTime) as endTime";
    if (armInfo)
    {
      sql = sql + ", ArmInfo as armInfo ";
      scalars.add(new QueryScalar("armInfo", Hibernate.INTEGER));
    }
    if ((countCond != null) && (!countCond.isEmpty())) {
      query = String.format(sql + ", %s from dev_alarm ", new Object[] { countCond });
    } else {
      query = sql + " from dev_alarm ";
    }
    String str = getQueryString(dateB, dateE, devIdno, lstArmType, condition, 
      query, group, queryFilter, qtype, sortname, sortorder);
    scalars.add(new QueryScalar("count", Hibernate.INTEGER));
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("armType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("beginTime", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", Hibernate.TIMESTAMP));
    if (countScalars != null) {
      for (int i = 0; i < countScalars.size(); i++) {
        scalars.add((QueryScalar)countScalars.get(i));
      }
    }
    return this.paginationDao.getExtraByNativeSql(str, scalars, DeviceAlarmSummary.class);
  }
  
  public List<DailyCount> queryDailyCount(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType)
  {
    List<QueryScalar> scalars = new ArrayList();
    StringBuffer builder;
    if (BaseAction.getEnableSqlServer())
    {
       builder = new StringBuffer("SELECT convert(char(10),ArmTime,120) AS dtime,COUNT(DISTINCT DevIDNO) AS count from dev_alarm where ");
      builder.append(String.format("ArmTime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
      appendArmTypeCondition(builder, lstArmType);
      appendDeviceCondition(builder, devIdno);
      builder.append("GROUP BY convert(char(10),ArmTime,120)");
      
      scalars.add(new QueryScalar("count", Hibernate.INTEGER));
      scalars.add(new QueryScalar("dtime", Hibernate.DATE));
    }
    else
    {
      builder = new StringBuffer("SELECT DATE(ArmTime) AS dtime,COUNT(DISTINCT DevIDNO) AS count from dev_alarm where ");
      builder.append(String.format("ArmTime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
      appendArmTypeCondition(builder, lstArmType);
      appendDeviceCondition(builder, devIdno);
      builder.append("GROUP BY dtime");
      
      scalars.add(new QueryScalar("count", Hibernate.INTEGER));
      scalars.add(new QueryScalar("dtime", Hibernate.TIMESTAMP));
    }
    return this.paginationDao.getExtraByNativeSql(builder.toString(), scalars, DailyCount.class);
  }
  
  public AjaxDto<DeviceAlarm> queryDeviceAlarm(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, String condition, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    String str = getQueryString(dateB, dateE, devIdno, lstArmType, condition, "from DeviceAlarm ", null, queryFilter, qtype, sortname, sortorder);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  public AjaxDto<DeviceAlarm> queryDeviceAlarmList(String updateTime, List<Integer> lstArmType, String condition, Pagination pagination)
  {
    StringBuffer str = new StringBuffer(String.format(" from DeviceAlarm where createTime > '%s' ", new Object[] { updateTime }));
    appendArmTypeCondition(str, lstArmType);
    return this.paginationDao.getPgntByQueryStr(str.toString(), null);
  }
  
  public AjaxDto<SysNews> queryNews(String id, String condition, Pagination pagination)
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date d = new Date();
    Calendar rightNow = Calendar.getInstance();
    rightNow.setTime(d);
    Date dt = rightNow.getTime();
    String date = sdf.format(dt);
    StringBuffer str = new StringBuffer(String.format("from SysNews where endTime >= '%s'", new Object[] { date }));
    if (id != null) {
      str.append(String.format(" and id = %s", new Object[] { id }));
    }
    return this.paginationDao.getPgntByQueryStr(str.toString(), null);
  }
  
  public AjaxDto<DeviceAlarm> queryDeviceAlarmMobileList(String startTime, String endTime, List<Integer> lstArmType, String[] devIdno, String type, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from DeviceAlarm ");
    sql.append(String.format(" where armTime BETWEEN '%s' and '%s' ", new Object[] { startTime, endTime }));
    appendArmTypeCondition(sql, lstArmType);
    appendDeviceCondition(sql, devIdno);
    if ((type != null) && (!type.isEmpty())) {
      if ("1".equals(type)) {
        sql.append(String.format(" and handleUserID = %s ", new Object[] { type }));
      } else {
        sql.append(String.format(" and (handleUserID is null or handleUserID = %s)", new Object[] { type }));
      }
    }
    sql.append(" and armInfo = 0 order by armTime desc");
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<DeviceAlarm> queryDeviceAlarm(List<String> guid)
  {
    return this.deviceAlarmDao.queryDeviceAlarm(guid);
  }
}
