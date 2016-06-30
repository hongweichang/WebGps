package com.gps808.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.report.service.StandardVehicleLoginService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleLoginServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleLoginService
{
  private PaginationDao paginationDao;
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] vehiIDNO)
  {
    strQuery.append(String.format("and (b.VehiIDNO = '%s' ", new Object[] { vehiIDNO[0] }));
    for (int i = 1; i < vehiIDNO.length; i++) {
      strQuery.append(String.format("or b.VehiIDNO = '%s' ", new Object[] { vehiIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected void appendArmTypeCondition(StringBuffer strQuery, List<Integer> lstArmType)
  {
    if ((lstArmType != null) && (lstArmType.size() > 0))
    {
      strQuery.append(String.format("and (a.ArmType = %d ", new Object[] { lstArmType.get(0) }));
      for (int i = 1; i < lstArmType.size(); i++) {
        strQuery.append(String.format("or a.ArmType = %d ", new Object[] { lstArmType.get(i) }));
      }
      strQuery.append(") ");
    }
  }
  
  private void getQueryString(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, String condition, StringBuffer strQuery, String group, String queryFilter, String qtype, String sortname, String sortorder)
  {
    strQuery.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    
    appendDeviceCondition(strQuery, vehiIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    if ((condition != null) && (!condition.isEmpty())) {
      strQuery.append(condition);
    }
    if ((qtype != null) && (!qtype.isEmpty())) {
      strQuery.append(String.format("and a." + qtype + " = %s ", new Object[] { queryFilter }));
    }
    if ((group != null) && (!group.isEmpty())) {
      strQuery.append(group);
    }
    if ((sortname != null) && (!sortname.isEmpty())) {
      strQuery.append(" order by a." + sortname + " " + sortorder);
    }
  }
  
  private void getQueryDrivingString(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, StringBuffer strQuery)
  {
    strQuery.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    strQuery.append("  GROUP BY b.id,a.ArmType");
  }
  
  public List<StandardDeviceAlarmSummary> summaryDeviceAlarm(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, String condition, String group, String countCond, List<QueryScalar> countScalars, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer();
    if ((countCond != null) && (!countCond.isEmpty())) {
      sql.append("select b.VehiIDNO as vehiIdno, b.plateType as plateType,a.ArmType as armType,a.ArmTimeStart as beginTime,a.ArmTimeEnd as endTime,a.HandleStatus as handleStatus,b.PlateType as plateType,b.VehiColor as vehiColor," + 
      
        countCond + " from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    } else {
      sql.append("select b.VehiIDNO as vehiIdno, b.plateType as plateType,a.ArmType as armType,a.ArmTimeStart as beginTime,a.ArmTimeEnd as endTime,a.HandleStatus as handleStatus,b.PlateType as plateType,b.VehiColor as vehiColor from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    }
    getQueryString(dateB, dateE, vehiIdno, lstArmType, condition, 
      sql, group, queryFilter, qtype, sortname, sortorder);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("beginTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("handleStatus", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiColor", StandardBasicTypes.STRING));
    if (countScalars != null) {
      for (int i = 0; i < countScalars.size(); i++) {
        scalars.add((QueryScalar)countScalars.get(i));
      }
    }
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardDeviceAlarmSummary.class);
  }
  
  public List<StandardDeviceAlarmSummary> summaryDrivingBehavior(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, Pagination pagination, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer("select b.VehiIDNO as vehiIdno,b.PlateType as plateType,a.ArmType as armType,Min(a.ArmTimeStart) as beginTime,Max(a.ArmTimeStart) as endTime,COUNT(a.VehiID) as count,SUM(IF( TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd) > 0, TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd), 0 )) AS param1Sum from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    
    getQueryDrivingString(dateB, dateE, vehiIdno, lstArmType, sql);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("beginTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param1Sum", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardDeviceAlarmSummary.class);
  }
  
  public AjaxDto<StandardDeviceAlarm> queryDeviceAlarm(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, String condition, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer("select b.VehiIDNO as vehiIdno,a.ArmType as armType,a.ArmInfo as armInfo,a.ArmTimeStart as armTimeStart,a.ArmTimeEnd as armTimeEnd,a.HandleStatus as handleStatus,a.HandleInfo as handleInfo,a.StatusStart as statusStart,a.StatusEnd as statusEnd,a.Param1 as param1,a.Param2 as param2,b.PlateType as plateType,b.VehiColor as vehiColor  from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    
    getQueryString(dateB, dateE, devIdno, lstArmType, condition, sql, null, queryFilter, qtype, sortname, sortorder);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("armInfo", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armTimeStart", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("armTimeEnd", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("handleStatus", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("handleInfo", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiColor", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("statusStart", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("statusEnd", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param1", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param2", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSqlEx(sql.toString(), pagination, scalars, StandardDeviceAlarm.class, null);
  }
  
  public Class getClazz()
  {
    return null;
  }
}
