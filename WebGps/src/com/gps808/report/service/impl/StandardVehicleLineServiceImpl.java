package com.gps808.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.StandardDriverDaily;
import com.gps808.model.StandardDriverMonth;
import com.gps808.model.StandardVehicleDaily;
import com.gps808.model.StandardVehicleMonth;
import com.gps808.model.line.StandardLineDaily;
import com.gps808.model.line.StandardLineMonth;
import com.gps808.model.line.StandardStationReport;
import com.gps808.model.line.StandardTrip;
import com.gps808.report.service.StandardVehicleLineService;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleLineServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleLineService
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
  
  public Class getClazz()
  {
    return null;
  }
  
  private List<QueryScalar> getLineQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("lid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dt", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("tc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("lc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("yh", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("wt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("as", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ln", StandardBasicTypes.STRING));
    return scalars;
  }
  
  private List<QueryScalar> getDriverQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("did", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dt", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("tc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("lc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("yh", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("wt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("as", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dn", StandardBasicTypes.STRING));
    return scalars;
  }
  
  private List<QueryScalar> getVehicleQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dt", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("tc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("lc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("yh", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("wt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("as", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("ln", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pt", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  protected void appendLineCondition(StringBuffer strQuery, String[] vehiIDNO)
  {
    strQuery.append(String.format("and b.ID in ( %d ", new Object[] { Integer.valueOf(Integer.parseInt(vehiIDNO[0])) }));
    for (int i = 1; i < vehiIDNO.length; i++) {
      strQuery.append(String.format(", %d ", new Object[] { Integer.valueOf(Integer.parseInt(vehiIDNO[i])) }));
    }
    strQuery.append(") ");
  }
  
  public AjaxDto<StandardLineDaily> queryLineDailys(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as lid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as ln from jt808_line_trip_daily a, jt808_company_info b ");
    
    strQuery.append("where a.LineID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getLineQueryScalar(), StandardLineDaily.class, null);
  }
  
  public AjaxDto<StandardLineMonth> queryLineMonths(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as lid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as ln from jt808_line_trip_monthly a, jt808_company_info b ");
    
    strQuery.append("where a.LineID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getLineQueryScalar(), StandardLineMonth.class, null);
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] vehiIDNO)
  {
    strQuery.append(String.format("and b.VehiIDNO in ( '%s' ", new Object[] { vehiIDNO[0] }));
    for (int i = 1; i < vehiIDNO.length; i++) {
      strQuery.append(String.format(", '%s' ", new Object[] { vehiIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  public AjaxDto<StandardVehicleDaily> queryVehicleDailys(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as vid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.VehiIDNO as vn, b.PlateType as pt, c.Name as ln from jt808_vehi_trip_daily a, jt808_vehicle_info b, jt808_company_info c ");
    
    strQuery.append("where a.VehiID = b.ID and b.CompanyID = c.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getVehicleQueryScalar(), StandardVehicleDaily.class, null);
  }
  
  public AjaxDto<StandardVehicleMonth> queryVehicleMonths(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as vid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.VehiIDNO as vn, b.PlateType as pt, c.Name as ln from jt808_vehi_trip_monthly a, jt808_vehicle_info b, jt808_company_info c ");
    
    strQuery.append("where a.VehiID = b.ID and b.CompanyID = c.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getVehicleQueryScalar(), StandardVehicleMonth.class, null);
  }
  
  public AjaxDto<StandardDriverDaily> queryDriverDailys(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as did, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as dn from jt808_driver_trip_daily a, jt808_driver_info b ");
    
    strQuery.append("where a.DriverID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getDriverQueryScalar(), StandardDriverDaily.class, null);
  }
  
  public AjaxDto<StandardDriverMonth> queryDriverMonths(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as did, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as dn from jt808_driver_trip_monthly a, jt808_driver_info b ");
    
    strQuery.append("where a.DriverID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by GPSDate desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getDriverQueryScalar(), StandardDriverMonth.class, null);
  }
  
  public List<StandardLineMonth> getMonthTopLine(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as lid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as ln from jt808_line_trip_monthly a, jt808_company_info b ");
    
    strQuery.append("where a.LineID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getLineQueryScalar(), StandardLineMonth.class);
  }
  
  public List<StandardLineDaily> getDailyTopLine(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as lid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as ln from jt808_line_trip_daily a, jt808_company_info b ");
    
    strQuery.append("where a.LineID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getLineQueryScalar(), StandardLineDaily.class);
  }
  
  public List<StandardVehicleMonth> getMonthTopVehicle(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as vid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.VehiIDNO as vn, b.PlateType as pt, c.Name as ln from jt808_vehi_trip_monthly a, jt808_vehicle_info b, jt808_company_info c ");
    
    strQuery.append("where a.VehiID = b.ID and b.CompanyID = c.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getVehicleQueryScalar(), StandardVehicleMonth.class);
  }
  
  public List<StandardVehicleDaily> getDailyTopVehicle(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as vid, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.VehiIDNO as vn, b.PlateType as pt, c.Name as ln from jt808_vehi_trip_daily a, jt808_vehicle_info b, jt808_company_info c ");
    
    strQuery.append("where a.VehiID = b.ID and b.CompanyID = c.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getVehicleQueryScalar(), StandardVehicleDaily.class);
  }
  
  public List<StandardDriverMonth> getMonthTopDriver(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as did, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as dn from jt808_driver_trip_monthly a, jt808_driver_info b ");
    
    strQuery.append("where a.DriverID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getDriverQueryScalar(), StandardDriverMonth.class);
  }
  
  public List<StandardDriverDaily> getDailyTopDriver(String dateB, String dateE, String[] vehiIdno)
  {
    StringBuffer strQuery = new StringBuffer("select b.ID as did, a.GPSDate as dt, a.TripCount as tc, a.LiCheng as lc, a.YouHao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.GPSDateI as dti, b.Name as dn from jt808_driver_trip_daily a, jt808_driver_info b ");
    
    strQuery.append("where a.DriverID = b.ID");
    strQuery.append(String.format(" and GPSDateI >= %d and GPSDateI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrDate2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrDate2Date(dateE).getTime() / 1000L)) }));
    appendLineCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by TripCount desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), getDriverQueryScalar(), StandardDriverDaily.class);
  }
  
  public AjaxDto<StandardTrip> queryTripDetails(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select a.LineID as lid, a.VehiID as vid, a.DriverID as did, a.LineDirection as ld, a.GpsDate as gdt, a.TripTime as tt, a.STime as st, a.SStataionIdex as si, a.ETime as et, a.EStataionIdex as ei, a.LiCheng as lc, a.Youhao as yh, a.WorkTime as wt, a.AlarmSum as 'as', a.DeviationTime as dt, a.STimeI as sti, a.ETimeI as eti, d.Name as ln, b.VehiIDNO as vn, b.PlateType as pt,c.Name as dn, g.Name as sn, h.Name as en from jt808_trip_info a LEFT JOIN jt808_vehicle_info b ON a.VehiID = b.ID LEFT JOIN jt808_driver_info c ON a.DriverID = c.ID LEFT JOIN jt808_company_info d ON a.LineID = d.ID LEFT JOIN jt808_line_station_relation e ON a.LineID = e.LineID and a.LineDirection = e.Direction and a.SStataionIdex = e.StationIndex LEFT JOIN jt808_line_station_relation f ON a.LineID = f.LineID and a.LineDirection = f.Direction and a.EStataionIdex = f.StationIndex LEFT JOIN jt808_station_info g ON e.StationID = g.ID LEFT JOIN jt808_station_info h ON f.StationID = h.ID where 1 = 1");
    
    strQuery.append(String.format(" and a.STimeI >= %d and a.STimeI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("lid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("did", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ld", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("gdt", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("tt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("st", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("si", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("et", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("ei", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("lc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("yh", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("wt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("as", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("sti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("eti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ln", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("vn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("sn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("en", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, scalars, StandardTrip.class, null);
  }
  
  public AjaxDto<StandardStationReport> queryStationDetails(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select a.LineID as lid, a.VehiID as vid, a.DriverID as did, a.LineDirection as ld, a.StationFlag as sf, a.StationIndex as si, a.In_Time as it, a.In_Speed as 'is', a.Out_Time as ot, a.Out_Speed as os, a.LimitSpeed as ls, a.LiCheng as lc, a.YouLiang as yl, a.ReportTime as rt, a.ReportTimeI as rti, a.UpdateTime as ut, d.Name as ln, b.VehiIDNO as vn, b.PlateType as pt,c.Name as dn, g.Name as sn from jt808_station_report a LEFT JOIN jt808_vehicle_info b ON a.VehiID = b.ID LEFT JOIN jt808_driver_info c ON a.DriverID = c.ID LEFT JOIN jt808_company_info d ON a.LineID = d.ID LEFT JOIN jt808_line_station_relation e ON a.LineID = e.LineID and a.LineDirection = e.Direction and a.StationIndex = e.StationIndex LEFT JOIN jt808_station_info g ON e.StationID = g.ID where 1 = 1");
    
    strQuery.append(String.format(" and a.ReportTimeI >= %d and a.ReportTimeI <=%d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("lid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("did", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ld", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("sf", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("si", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("it", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("is", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ot", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("os", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ls", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("lc", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("yl", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("rt", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("rti", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ut", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("ln", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("vn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pt", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("sn", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, scalars, StandardStationReport.class, null);
  }
}
