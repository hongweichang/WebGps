package com.gps808.report.dao.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.HibernateDaoSupportEx;
import com.framework.web.dto.QueryScalar;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.report.dao.StandardVehicleDailyDao;
import com.gps808.report.vo.StandardReportSummary;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardVehicleDailyDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardVehicleDailyDao
{
  private List<QueryScalar> getStandardDeviceDailyQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("date", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("startTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("startJingDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("startWeiDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("startGaoDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("startLiCheng", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("startYouLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("endTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("endJingDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("endWeiDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("endGaoDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("endLiCheng", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("endYouLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("addYouLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("reduceYouLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("uploadWifiLiuLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("downWifiLiuLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("uploadSimLiuLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("downSimLiuLiang", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  public List<StandardDeviceDaily> queryDistinctDaily(String queryString)
  {
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(queryString);
      List<QueryScalar> scalars = getStandardDeviceDailyQueryScalar();
      for (int i = 0; i < scalars.size(); i++) {
        query.addScalar(((QueryScalar)scalars.get(i)).getValue(), ((QueryScalar)scalars.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(StandardDeviceDaily.class));
      return query.list();
    }
    catch (RuntimeException re)
    {
      throw re;
    }
    finally
    {
      session.close();
    }
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] vehiIdno)
  {
    strQuery.append(String.format("and (b.vehiIDNO = '%s' ", new Object[] { vehiIdno[0] }));
    for (int i = 1; i < vehiIdno.length; i++) {
      strQuery.append(String.format("or b.vehiIDNO = '%s' ", new Object[] { vehiIdno[i] }));
    }
    strQuery.append(") ");
  }
  
  private String getQueryString(String dateB, String dateE, String[] vehiIdno, int month)
  {
    StringBuffer strQuery = new StringBuffer();
    if (month > 0)
    {
      String str = "select b.VehiIDNO as vehiIdno,b.PlateType as plateType,LEFT(a.GPSDate,7) as param1SumStr,";
      str = str + "count(*)/TIMESTAMPDIFF(day,'" + dateB + "',DATE_add('" + dateB + "',INTERVAL 1 month)) loginRate  from jt808_vehicle_daily a,jt808_vehicle_info b where a.vehiID = b.ID and GPSDate >= '" + dateB + "' and GPSDate < DATE_add('" + dateB + "',INTERVAL 1 month) ";
      strQuery.append(str);
      appendDeviceCondition(strQuery, vehiIdno);
      strQuery.append(" group by VehiID ");
    }
    if (month > 1)
    {
      String str = " union all ";
      str = str + " select b.VehiIDNO as vehiIdno,b.PlateType as plateType,LEFT(a.GPSDate,7) as param1SumStr,";
      str = str + "count(*)/TIMESTAMPDIFF(day,DATE_add('" + dateB + "',INTERVAL 1 month),DATE_add('" + dateB + "',INTERVAL 2 month)) loginRate from jt808_vehicle_daily a,jt808_vehicle_info b where a.vehiID = b.ID and GPSDate >= DATE_add('" + dateB + "',INTERVAL 1 month) and GPSDate < DATE_add('" + dateB + "',INTERVAL 2 month) ";
      strQuery.append(str);
      appendDeviceCondition(strQuery, vehiIdno);
      strQuery.append(" group by VehiID ");
    }
    if (month > 2)
    {
      String str = " union all";
      str = str + " select b.VehiIDNO as vehiIdno,b.PlateType as plateType,LEFT(a.GPSDate,7) as param1SumStr,";
      str = str + "count(*)/TIMESTAMPDIFF(day,DATE_add('" + dateB + "',INTERVAL 2 month),DATE_add('" + dateB + "',INTERVAL 3 month)) loginRate from jt808_vehicle_daily a,jt808_vehicle_info b where a.vehiID = b.ID and GPSDate >= DATE_add('" + dateB + "',INTERVAL 2 month) and GPSDate < DATE_add('" + dateB + "',INTERVAL 3 month) ";
      strQuery.append(str);
      appendDeviceCondition(strQuery, vehiIdno);
      strQuery.append(" group by VehiID ");
    }
    return strQuery.toString();
  }
  
  public List<StandardReportSummary> queryMonthlyOnline(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer sql = new StringBuffer();
    if (DateUtil.dateSwitchDateString(DateUtil.dateIncrease(DateUtil.StrDate2Date(dateB), Integer.valueOf(1), Integer.valueOf(0))).equals(dateE)) {
      sql.append(getQueryString(dateB, dateE, vehiIdno, 1));
    } else if (DateUtil.dateSwitchDateString(DateUtil.dateIncrease(DateUtil.StrDate2Date(dateB), Integer.valueOf(2), Integer.valueOf(0))).equals(dateE)) {
      sql.append(getQueryString(dateB, dateE, vehiIdno, 2));
    } else {
      sql.append(getQueryString(dateB, dateE, vehiIdno, 3));
    }
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      query.addScalar("vehiIdno", StandardBasicTypes.STRING);
      query.addScalar("plateType", StandardBasicTypes.INTEGER);
      query.addScalar("param1SumStr", StandardBasicTypes.STRING);
      query.addScalar("loginRate", StandardBasicTypes.BIG_DECIMAL);
      query.setResultTransformer(Transformers.aliasToBean(StandardReportSummary.class));
      return query.list();
    }
    catch (RuntimeException re)
    {
      throw re;
    }
    finally
    {
      session.close();
    }
  }
  
  public List<StandardReportSummary> queryCompanyDaily(String dateB, String dateE, String[] companyIdnos, String condition)
  {
    StringBuffer sql = new StringBuffer("select Sum(f.count)/h.sum1 loginRate,f.beginTime beginTime,h.name name,f.companyId companyId from ");
    sql.append("(select count(*) count,a.GPSDate beginTime,CASE when c.LEVEL <> 1 then c.CompanyId ELSE c.ID end companyId ");
    sql.append(" from jt808_vehicle_daily a, jt808_vehicle_info b,jt808_company_info c where b.CompanyId = c.ID ");
    sql.append("and a.VehiID = b.ID ");
    
    StringBuffer sqlEID = new StringBuffer();
    if ((companyIdnos != null) && (companyIdnos.length > 0))
    {
      StringBuffer sqlID = new StringBuffer(String.format(" or c.Id in (%s", new Object[] { companyIdnos[0] }));
      sql.append(String.format(" and (c.CompanyId in(%s", new Object[] { companyIdnos[0] }));
      sqlEID.append(String.format(" and e.companyID in(%s", new Object[] { companyIdnos[0] }));
      for (int i = 1; i < companyIdnos.length; i++)
      {
        sql.append(String.format(",%s", new Object[] { companyIdnos[i] }));
        sqlID.append(String.format(",%s", new Object[] { companyIdnos[i] }));
        sqlEID.append(String.format(",%s", new Object[] { companyIdnos[i] }));
      }
      sql.append(") ");
      sqlID.append(") ");
      sqlEID.append(") ");
      sql.append(sqlID);
      sql.append(") ");
    }
    sql.append(String.format(" and a.GPSDate >= '%s' and a.GPSDate <='%s' ", new Object[] { dateB, dateE }));
    sql.append(" group by a.GPSDate,b.CompanyID ) f , ");
    sql.append(" (select e.companyId companyId,m.Name name,count(*) sum1 from jt808_vehicle_info d,");
    sql.append(" (select Id,CASE when LEVEL <> 1 then CompanyId ELSE ID end companyId from jt808_company_info) e");
    sql.append(" ,jt808_company_info m where e.companyId = m.ID ");
    sql.append(" and d.companyId = e.Id ");
    sql.append(sqlEID);
    sql.append(" group by e.companyId) h where f.companyId = h.companyId ");
    sql.append(" group by f.beginTime,f.companyId ORDER BY f.beginTime,f.companyId ");
    
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      query.addScalar("name", StandardBasicTypes.STRING);
      query.addScalar("companyId", StandardBasicTypes.INTEGER);
      query.addScalar("beginTime", StandardBasicTypes.DATE);
      query.addScalar("loginRate", StandardBasicTypes.BIG_DECIMAL);
      query.setResultTransformer(Transformers.aliasToBean(StandardReportSummary.class));
      return query.list();
    }
    catch (RuntimeException re)
    {
      throw re;
    }
    finally
    {
      session.close();
    }
  }
}
