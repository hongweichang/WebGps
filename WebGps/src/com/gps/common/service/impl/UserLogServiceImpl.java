package com.gps.common.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.service.UserLogService;
import com.gps.model.UserLog;
import com.gps808.report.vo.StandardUserOnlineQuery;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.Hibernate;
import org.hibernate.type.StandardBasicTypes;

public class UserLogServiceImpl
  extends UniversalServiceImpl
  implements UserLogService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return UserLog.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    if ((devIDNO != null) && (devIDNO.length > 0))
    {
      strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
      for (int i = 1; i < devIDNO.length; i++) {
        strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
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
      } else {
        column = qtype;
      }
    }
    return column;
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIdno, String userId, Integer mainType, Integer subType, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer strQuery = new StringBuffer("from UserLog ");
    strQuery.append(String.format("where where dtimeI >= %d and dtimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, devIdno);
    if ((userId != null) && (!userId.equals("0"))) {
      strQuery.append(String.format("and userId = %s ", new Object[] { userId }));
    } else {
      strQuery.append("and userId != 0 ");
    }
    if (mainType != null) {
      strQuery.append(String.format("and mainType = %d ", new Object[] { mainType }));
    }
    if (subType != null) {
      strQuery.append(String.format("and subType = %d ", new Object[] { subType }));
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
  
  public AjaxDto<UserLog> queryUserLog(String dateB, String dateE, String[] devIdno, String userId, Integer mainType, Integer subType, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    String str = getQueryString(dateB, dateE, devIdno, userId, mainType, subType, queryFilter, qtype, sortname, sortorder);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
  
  public List<StandardUserOnlineQuery> queryUserOnlineSummary(String dateB, String dateE, String[] userIds, String isSummary)
  {
    StringBuffer strQuery = new StringBuffer();
    if (isSummary.equals("true")) {
      strQuery.append("SELECT b.Account as account,b.`Name` as name,c.`Name` as company,MIN(a.DTime) as beginTime,MAX(a.Param4) as endTime,SUM(IF(TIMESTAMPDIFF(SECOND,a.DTime,a.Param4) > 0, TIMESTAMPDIFF(SECOND,a.DTime,a.Param4), 0 )) AS times, COUNT(a.userId) as count FROM user_log a,jt808_account b,jt808_company_info c WHERE a.UserID = b.ID AND b.CompanyID = c.ID and a.MainType = 1 and a.SubType = 1 and (a.Param3 = 4 or a.Param3 = 5 or a.Param3 = 6) ");
    } else {
      strQuery.append("SELECT b.Account as account,b.`Name` as name,c.`Name` as company,a.DTime as beginTime,a.Param4 as endTime,TIMESTAMPDIFF(SECOND,a.DTime,a.Param4) AS times, a.Param3 as loginType FROM user_log a,jt808_account b,jt808_company_info c WHERE a.UserID = b.ID AND b.CompanyID = c.ID and a.MainType = 1 and a.SubType = 1 and (a.Param3 = 4 or a.Param3 = 5 or a.Param3 = 6) ");
    }
    strQuery.append(String.format("and a.DTimeI >= %d and a.DTimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    if ((userIds != null) && (userIds.length > 0))
    {
      strQuery.append(String.format("and (a.userId = %s ", new Object[] { userIds[0] }));
      for (int i = 1; i < userIds.length; i++) {
        strQuery.append(String.format("or a.userId = %s ", new Object[] { userIds[i] }));
      }
      strQuery.append(") ");
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("account", Hibernate.STRING));
    scalars.add(new QueryScalar("name", Hibernate.STRING));
    scalars.add(new QueryScalar("company", Hibernate.STRING));
    scalars.add(new QueryScalar("beginTime", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", Hibernate.TIMESTAMP));
    if (isSummary.equals("true"))
    {
      strQuery.append(" GROUP BY b.id");
      scalars.add(new QueryScalar("count", Hibernate.INTEGER));
    }
    else
    {
      scalars.add(new QueryScalar("loginType", Hibernate.INTEGER));
    }
    scalars.add(new QueryScalar("times", Hibernate.INTEGER));
    strQuery.append(" order BY a.DTimeI asc");
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), scalars, StandardUserOnlineQuery.class);
  }
  
  private String getQueryStringEx(String dateB, String dateE, String[] devIdno, String[] userIds, String[] mainTypes, Integer subType, String queryType)
  {
    StringBuffer strQuery = new StringBuffer();
    if ((queryType != null) && (queryType.equals("sms"))) {
      strQuery.append("select ID as id,UserID as userId,DevIDNO as devIdno,MainType as mainType,SubType as subType,Param1 as param1,Param2 as param2,Param3 as param3,Param4 as param4,DTime as dtime,DTimeI as dtimeI from user_log ");
    } else {
      strQuery.append("from UserLog ");
    }
    strQuery.append(String.format("where dtimeI >= %d and dtimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    if ((queryType != null) && (queryType.equals("sms"))) {
      appendVehicleCondition(strQuery, devIdno);
    } else {
      appendDeviceCondition(strQuery, devIdno);
    }
    if ((userIds != null) && (userIds.length > 0))
    {
      strQuery.append(String.format("and (userId = %s ", new Object[] { userIds[0] }));
      for (int i = 1; i < userIds.length; i++) {
        strQuery.append(String.format("or userId = %s ", new Object[] { userIds[i] }));
      }
      strQuery.append(") ");
    }
    if ((mainTypes != null) && (mainTypes.length > 0))
    {
      strQuery.append(String.format("and (mainType = %s ", new Object[] { Integer.valueOf(Integer.parseInt(mainTypes[0])) }));
      for (int i = 1; i < mainTypes.length; i++) {
        strQuery.append(String.format("or mainType = %s ", new Object[] { Integer.valueOf(Integer.parseInt(mainTypes[i])) }));
      }
      strQuery.append(") ");
    }
    if (subType != null) {
      strQuery.append(String.format("and subType = %d ", new Object[] { subType }));
    }
    strQuery.append(" order by dtime desc");
    return strQuery.toString();
  }
  
  public AjaxDto<UserLog> queryUserLogEx(String dateB, String dateE, String[] devIdno, String[] userIds, String[] mainTypes, Integer subType, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryStringEx(dateB, dateE, devIdno, userIds, mainTypes, subType, null), pagination);
  }
  
  protected void appendVehicleCondition(StringBuffer strQuery, String[] vehiIdno)
  {
    if ((vehiIdno != null) && (vehiIdno.length > 0))
    {
      strQuery.append(String.format("and (param4 = '%s' ", new Object[] { vehiIdno[0] }));
      for (int i = 1; i < vehiIdno.length; i++) {
        strQuery.append(String.format("or param4 = '%s' ", new Object[] { vehiIdno[i] }));
      }
      strQuery.append(") ");
    }
  }
  
  private List<QueryScalar> getUserLogQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("userId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("mainType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("subType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param1", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param2", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param3", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param4", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dtime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("dtimeI", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  public AjaxDto<UserLog> querySMSLog(String dateB, String dateE, String[] vehiIdno, String[] mainTypes, Integer subType, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getQueryStringEx(dateB, dateE, vehiIdno, null, mainTypes, subType, "sms"), pagination, getUserLogQueryScalar(), UserLog.class, null);
  }
}
