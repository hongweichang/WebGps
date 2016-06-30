package com.gps808.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.report.dao.StandardVehicleAlarmDao;
import com.gps808.report.service.StandardVehicleAlarmService;
import com.gps808.report.vo.StandardDeviceAlarmSummary;
import com.gps808.report.vo.StandardStationAlarm;
import com.gps808.report.vo.StandardSummaryRank;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleAlarmServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleAlarmService
{
  private PaginationDao paginationDao;
  private StandardVehicleAlarmDao standardVehicleAlarmDao;
  
  public StandardVehicleAlarmDao getStandardVehicleAlarmDao()
  {
    return this.standardVehicleAlarmDao;
  }
  
  public void setStandardVehicleAlarmDao(StandardVehicleAlarmDao standardVehicleAlarmDao)
  {
    this.standardVehicleAlarmDao = standardVehicleAlarmDao;
  }
  
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
  
  protected void appendComCondition(StringBuffer strQuery, String[] vehiIDNO)
  {
    strQuery.append(String.format("and (b.CompanyID = %d ", new Object[] { Integer.valueOf(Integer.parseInt(vehiIDNO[0])) }));
    for (int i = 1; i < vehiIDNO.length; i++) {
      strQuery.append(String.format("or b.CompanyID = %d ", new Object[] { Integer.valueOf(Integer.parseInt(vehiIDNO[i])) }));
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
  
  private void getQueryString(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, List<Integer> lstArmInfo, String condition, StringBuffer strQuery, String group, String queryFilter, String qtype, String sortname, String sortorder)
  {
    strQuery.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    
    appendDeviceCondition(strQuery, vehiIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    if ((lstArmInfo != null) && (lstArmInfo.size() > 0))
    {
      strQuery.append(String.format("and (a.ArmInfo = %d ", new Object[] { lstArmInfo.get(0) }));
      strQuery.append(") ");
    }
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
  
  private void getComQueryString(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, List<Integer> lstArmInfo, String condition, StringBuffer strQuery, String group, String queryFilter, String qtype, String sortname, String sortorder)
  {
    strQuery.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    
    appendComCondition(strQuery, vehiIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    if ((lstArmInfo != null) && (lstArmInfo.size() > 0))
    {
      strQuery.append(String.format("and (a.ArmInfo = %d ", new Object[] { lstArmInfo.get(0) }));
      strQuery.append(") ");
    }
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
  
  public List<StandardDeviceAlarmSummary> summaryDeviceAlarm(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, String condition, String group, String countCond, List<QueryScalar> countScalars, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer();
    if ((countCond != null) && (!countCond.isEmpty())) {
      sql.append("select count(*) as count,SUM(IF( TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd) > 0, TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd), 0 )) AS param1Sum,b.VehiIDNO as vehiIdno,a.ArmType as armType,a.ArmInfo as armInfo,Min(a.ArmTimeStart) as beginTime,Max(a.ArmTimeEnd) as endTime,a.HandleStatus as handleStatus,a.Param1 as param1,b.PlateType as plateType,b.VehiColor as vehiColor," + 
      
        countCond + " from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    } else {
      sql.append("select count(*) as count,SUM(IF( TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd) > 0, TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd), 0 )) AS param1Sum,b.VehiIDNO as vehiIdno,a.ArmType as armType,a.ArmInfo as armInfo,a.ArmTimeStart as beginTime,a.ArmTimeEnd as endTime,a.HandleStatus as handleStatus,a.Param1 as param1,b.PlateType as plateType,b.PlateType as plateType,b.VehiColor as vehiColor from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    }
    getQueryString(dateB, dateE, vehiIdno, lstArmType, null, condition, 
      sql, group, queryFilter, qtype, sortname, sortorder);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param1Sum", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armInfo", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("beginTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("endTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("handleStatus", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiColor", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param1", StandardBasicTypes.INTEGER));
    if (countScalars != null) {
      for (int i = 0; i < countScalars.size(); i++) {
        scalars.add((QueryScalar)countScalars.get(i));
      }
    }
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardDeviceAlarmSummary.class);
  }
  
  public List<StandardSummaryRank> getTopVehi(String dateB, String dateE, String[] vehiIdno, List<Integer> armTypes)
  {
    StringBuffer sql = new StringBuffer();
    sql.append("select count(*) as count, b.VehiIDNO as vehiIdno from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    sql.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(sql, vehiIdno);
    appendArmTypeCondition(sql, armTypes);
    sql.append(" group by b.VehiIDNO");
    sql.append(" order by count desc");
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardSummaryRank.class);
  }
  
  public List<StandardDeviceAlarmSummary> summaryComAlarm(String dateB, String dateE, String[] vehiIdno, List<Integer> lstArmType, String condition, String group, String countCond, List<QueryScalar> countScalars, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer();
    if ((countCond != null) && (!countCond.isEmpty())) {
      sql.append("select count(*) as count,SUM(IF( TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd) > 0, TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd), 0 )) AS param1Sum,b.CompanyID as companyId,a.ArmType as armType,a.ArmInfo as armInfo,Min(a.ArmTimeStart) as beginTime,Max(a.ArmTimeEnd) as endTime,a.HandleStatus as handleStatus,b.PlateType as plateType,b.VehiColor as vehiColor," + 
      
        countCond + " from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    } else {
      sql.append("select count(*) as count,SUM(IF( TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd) > 0, TIMESTAMPDIFF(SECOND,a.ArmTimeStart,a.ArmTimeEnd), 0 )) AS param1Sum,b.CompanyID as companyId,a.ArmType as armType,a.ArmInfo as armInfo,a.ArmTimeStart as beginTime,a.ArmTimeEnd as endTime,a.HandleStatus as handleStatus,b.PlateType as plateType,b.PlateType as plateType,b.VehiColor as vehiColor from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    }
    getComQueryString(dateB, dateE, vehiIdno, lstArmType, null, condition, 
      sql, group, queryFilter, qtype, sortname, sortorder);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param1Sum", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("companyId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armInfo", StandardBasicTypes.INTEGER));
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
  
  public List<StandardSummaryRank> getTopCom(String dateB, String dateE, String[] vehiIdno, List<Integer> armTypes)
  {
    StringBuffer sql = new StringBuffer();
    sql.append("select count(*) as count, b.CompanyID as companyId from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    sql.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendComCondition(sql, vehiIdno);
    appendArmTypeCondition(sql, armTypes);
    sql.append(" group by b.CompanyID");
    sql.append(" order by count desc");
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("companyId", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardSummaryRank.class);
  }
  
  private List<QueryScalar> getStandardDeviceAlarmQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("guid", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("armInfo", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armTimeStart", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("armTimeEnd", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("handleStatus", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("handleInfo", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("statusStart", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("statusEnd", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("param1", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param2", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param3", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("param4", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("armDesc", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("imgInfo", StandardBasicTypes.STRING));
    return scalars;
  }
  
  public AjaxDto<StandardDeviceAlarm> queryDeviceAlarm(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, List<Integer> lstArmInfo, String condition, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer sql = new StringBuffer("select a.DevIDNO as devIdno,a.Guid as guid,b.VehiIDNO as vehiIdno,a.ArmType as armType,a.ArmInfo as armInfo,a.ArmTimeStart as armTimeStart,a.ArmTimeEnd as armTimeEnd,a.HandleStatus as handleStatus,a.HandleInfo as handleInfo,a.StatusStart as statusStart,a.StatusEnd as statusEnd,a.param1 as param1,a.param2 as param2,a.param3 as param3,a.param4 as param4,a.ArmDesc as armDesc,a.ImageInfo as imgInfo,b.PlateType as plateType,b.VehiColor as vehiColor  from jt808_vehicle_alarm a,jt808_vehicle_info b where a.VehiID = b.ID");
    
    getQueryString(dateB, dateE, devIdno, lstArmType, lstArmInfo, condition, sql, null, queryFilter, qtype, sortname, sortorder);
    List<QueryScalar> scalars = getStandardDeviceAlarmQueryScalar();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiColor", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSqlEx(sql.toString(), pagination, scalars, StandardDeviceAlarm.class, null);
  }
  
  public StandardStationAlarm queryStationAlarm(String vehiIdno, Integer lineID, Integer driverID, Integer direction, Integer stationIndex, Integer lastIndex)
  {
    StringBuffer sql = new StringBuffer("select a.VehiIDNO as vehiIdno, b.Name as driverName, c.Name as lineName, f.Name as station, g.Name as lastStation from jt808_vehicle_info a ");
    sql.append(String.format("LEFT JOIN jt808_driver_info b ON b.ID = %d ", new Object[] { driverID }));
    sql.append(String.format("LEFT JOIN jt808_company_info c ON c.ID = %d ", new Object[] { lineID }));
    sql.append(String.format("LEFT JOIN jt808_line_station_relation d ON d.LineID = %d and d.Direction = %d and d.StationIndex = %d ", new Object[] { lineID, direction, stationIndex }));
    sql.append(String.format("LEFT JOIN jt808_line_station_relation e ON e.LineID = %d and e.Direction = %d and e.StationIndex = %d ", new Object[] { lineID, direction, lastIndex }));
    sql.append(String.format("LEFT JOIN jt808_station_info f ON d.StationID = f.ID LEFT JOIN jt808_station_info g ON e.StationID = g.ID where a.VehiIDNO = '%s'", new Object[] { vehiIdno }));
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("driverName", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("lineName", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("station", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("lastStation", StandardBasicTypes.STRING));
    AjaxDto<StandardStationAlarm> ajaxDto = this.paginationDao.getExtraByNativeSqlEx(sql.toString(), null, scalars, StandardStationAlarm.class, null);
    if ((ajaxDto != null) && (ajaxDto.getPageList().size() > 0)) {
      return (StandardStationAlarm)ajaxDto.getPageList().get(0);
    }
    return null;
  }
  
  protected void appendDeviceConditionEx(StringBuffer strQuery, String[] devIdno)
  {
    strQuery.append(String.format("and (a.DevIDNO = '%s' ", new Object[] { devIdno[0] }));
    for (int i = 1; i < devIdno.length; i++) {
      strQuery.append(String.format("or a.DevIDNO = '%s' ", new Object[] { devIdno[i] }));
    }
    strQuery.append(") ");
  }
  
  private void getDeviceQueryString(String dateB, String dateE, String[] deviIdno, List<Integer> lstArmType, List<Integer> lstArmInfo, String condition, StringBuffer strQuery)
  {
    strQuery.append(String.format(" and a.ArmTimeStartI >= %d and a.ArmTimeStartI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceConditionEx(strQuery, deviIdno);
    appendArmTypeCondition(strQuery, lstArmType);
    if ((lstArmInfo != null) && (lstArmInfo.size() > 0))
    {
      strQuery.append(String.format("and (a.ArmInfo = %d ", new Object[] { lstArmInfo.get(0) }));
      strQuery.append(") ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      strQuery.append(condition);
    }
  }
  
  public AjaxDto<StandardDeviceAlarm> queryDeviceAlarmByDevice(String dateB, String dateE, String[] devIdno, List<Integer> lstArmType, List<Integer> lstArmInfo, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer("select a.DevIDNO as devIdno,a.Guid as guid,a.ArmType as armType,a.ArmInfo as armInfo,a.ArmTimeStart as armTimeStart,a.ArmTimeEnd as armTimeEnd,a.HandleStatus as handleStatus,a.HandleInfo as handleInfo,a.StatusStart as statusStart,a.StatusEnd as statusEnd,a.param1 as param1,a.param2 as param2,a.param3 as param3,a.param4 as param4,a.ArmDesc as armDesc,a.ImageInfo as imgInfo from jt808_vehicle_alarm a where 1 = 1");
    
    getDeviceQueryString(dateB, dateE, devIdno, lstArmType, lstArmInfo, condition, sql);
    List<QueryScalar> scalars = getStandardDeviceAlarmQueryScalar();
    return this.paginationDao.getExtraByNativeSqlEx(sql.toString(), pagination, scalars, StandardDeviceAlarm.class, null);
  }
  
  public StandardDeviceAlarm getStandardDeviceAlarm(String guid)
  {
    return this.standardVehicleAlarmDao.getStandardDeviceAlarm(guid);
  }
  
  public void updateStandardDeviceAlarm(List<String> lstGuid, Integer handleStatus, String handleContent)
  {
    this.standardVehicleAlarmDao.updateStandardDeviceAlarm(lstGuid, handleStatus, handleContent);
  }
  
  public Class getClazz()
  {
    return null;
  }
  
  public List<MapMarker> getMapMarkerList()
  {
    AjaxDto ajaxDto = this.paginationDao.getPgntByQueryStr("from MapMarker", null);
    if (ajaxDto != null) {
      return ajaxDto.getPageList();
    }
    return null;
  }
  
  public List<MapMarker> getMarkerList()
  {
    StringBuffer sql = new StringBuffer();
    sql.append("select ID as id, Name as name from map_marker");
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("name", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, MapMarker.class);
  }
}
