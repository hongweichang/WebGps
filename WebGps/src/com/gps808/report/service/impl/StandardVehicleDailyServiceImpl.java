package com.gps808.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.StandardDeviceDaily;
import com.gps808.model.StandardStatisticsPeople;
import com.gps808.report.dao.StandardVehicleDailyDao;
import com.gps808.report.service.StandardVehicleDailyService;
import com.gps808.report.vo.StandardReportSummary;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleDailyServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleDailyService
{
  private PaginationDao paginationDao;
  private StandardVehicleDailyDao vehicleDailyDao;
  
  public Class getClazz()
  {
    return StandardVehicleDailyDao.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public StandardVehicleDailyDao getVehicleDailyDao()
  {
    return this.vehicleDailyDao;
  }
  
  public void setVehicleDailyDao(StandardVehicleDailyDao vehicleDailyDao)
  {
    this.vehicleDailyDao = vehicleDailyDao;
  }
  
  protected void appendVehicleCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (C.vehiIDNO = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or C.vehiIDNO = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected void appendCompanyCondition(StringBuffer strQuery, String[] companyIds)
  {
    strQuery.append(String.format("and (C.CompanyID = %d ", new Object[] { Integer.valueOf(Integer.parseInt(companyIds[0])) }));
    for (int i = 1; i < companyIds.length; i++) {
      strQuery.append(String.format("or C.CompanyID = %d ", new Object[] { Integer.valueOf(Integer.parseInt(companyIds[i])) }));
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
  
  private String getQueryString(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, String[] vehiIdno, String[] companyIds)
  {
    StringBuffer strQuery = new StringBuffer("select C.VehiIDNO as vehiIdno, C.PlateType as plateType,C.CompanyID as companyId, A.GPSDate as date, A.STime as startTime, A.SJingDu as startJingDu, A.SWeiDu as startWeiDu, A.SGaoDu as startGaoDu, A.SLiCheng as startLiCheng, A.SYouLiang as startYouLiang, A.ETime as endTime, A.EJingDu as endJingDu, A.EWeiDu as endWeiDu, A.EGaoDu as endGaoDu, A.ELiCheng as endLiCheng, A.EYouLiang as endYouLiang, A.AYouLiang as addYouLiang, A.RYouLiang as reduceYouLiang, A.UWifiLiuLiang as uploadWifiLiuLiang, A.DWifiLiuLiang as downWifiLiuLiang, A.USimLiuLiang as uploadSimLiuLiang, A.DSimLiuLiang as downSimLiuLiang, A.YouHao as youLiang, A.WorkTime as workTime, A.AlarmSum as alarmSum from jt808_vehicle_daily A, jt808_vehicle_info C ");
    
    strQuery.append("where A.vehiId = C.id ");
    strQuery.append(String.format("and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    if (vehiIdno != null) {
      appendVehicleCondition(strQuery, vehiIdno);
    }
    if (companyIds != null) {
      appendCompanyCondition(strQuery, companyIds);
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
  
  private String getDistinctQueryString(String dateB, String dateE, boolean isMaxDate, String[] vehiIDNO, boolean distinct)
  {
    StringBuffer strQuery = new StringBuffer("select D.VehiIDNO as vehiIdno, D.PlateType as plateType, A.GPSDate as date, A.STime as startTime");
    strQuery.append(", A.SJingDu as startJingDu, A.SWeiDu as startWeiDu, A.SGaoDu as startGaoDu, A.SLiCheng as startLiCheng, A.SYouLiang as startYouLiang");
    strQuery.append(", A.ETime as endTime, A.EJingDu as endJingDu, A.EWeiDu as endWeiDu, A.EGaoDu as endGaoDu, A.ELiCheng as endLiCheng, A.EYouLiang as endYouLiang");
    strQuery.append(", A.AYouLiang as addYouLiang, A.RYouLiang as reduceYouLiang, A.UWifiLiuLiang as uploadWifiLiuLiang, A.DWifiLiuLiang as downWifiLiuLiang");
    strQuery.append(", A.USimLiuLiang as uploadSimLiuLiang, A.DSimLiuLiang as downSimLiuLiang");
    strQuery.append(" from jt808_vehicle_daily A");
    if (isMaxDate) {
      strQuery.append(", (SELECT VehiID, MAX(GPSDate) max_day FROM jt808_vehicle_daily E");
    } else {
      strQuery.append(", (SELECT VehiID, MIN(GPSDate) max_day FROM jt808_vehicle_daily E");
    }
    strQuery.append(",jt808_vehicle_info C ");
    strQuery.append(" WHERE E.VehiID = C.ID ");
    strQuery.append(String.format("and GPSDateI >= %d and GPSDateI < %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendVehicleCondition(strQuery, vehiIDNO);
    strQuery.append("GROUP BY VehiID) B ");
    strQuery.append(",jt808_vehicle_info D ");
    strQuery.append("WHERE A.VehiID = B.VehiID AND A.VehiID = D.ID AND A.GPSDate = B.max_day order by A.GPSDate asc");
    return strQuery.toString();
  }
  
  public List<StandardDeviceDaily> queryDistinctDaily(String dateB, String dateE, boolean isMaxDate, String[] vehiIDNO, Pagination pagination)
  {
    return this.vehicleDailyDao.queryDistinctDaily(getDistinctQueryString(dateB, dateE, isMaxDate, vehiIDNO, true));
  }
  
  private List<QueryScalar> getStandardDeviceDailyQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("companyId", StandardBasicTypes.INTEGER));
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
    scalars.add(new QueryScalar("youLiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("workTime", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("alarmSum", StandardBasicTypes.STRING));
    return scalars;
  }
  
  public AjaxDto<StandardDeviceDaily> queryDeviceDaily(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, String[] vehiIdno, String[] companyIds, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getQueryString(dateB, dateE, queryFilter, qtype, sortname, sortorder, vehiIdno, companyIds), pagination, getStandardDeviceDailyQueryScalar(), StandardDeviceDaily.class, null);
  }
  
  public List<StandardReportSummary> queryMonthlyOnline(String dateB, String dateE, String[] vehiIdno)
  {
    return this.vehicleDailyDao.queryMonthlyOnline(dateB, dateE, vehiIdno);
  }
  
  public List<StandardReportSummary> queryCompanyDaily(String dateB, String dateE, String[] companyIdnos, String condition)
  {
    return this.vehicleDailyDao.queryCompanyDaily(dateB, dateE, companyIdnos, condition);
  }
  
  public AjaxDto<StandardStatisticsPeople> queryStandardStatisticsPeopleDaily(String dateB, String dateE, String[] devIdnos, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("");
    strQuery.append(" from StandardStatisticsPeople ");
    strQuery.append(String.format("where (statisticsTime >= '%s' and statisticsTime <= '%s') ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIdnos);
    strQuery.append(" order by statisticsTime ");
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), pagination);
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
}
