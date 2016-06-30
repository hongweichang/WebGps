package com.gps808.operationManagement.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.line.StandardLineInfo;
import com.gps808.model.line.StandardLineStationRelation;
import com.gps808.model.line.StandardLineStationRelationStation;
import com.gps808.model.line.StandardStationInfo;
import com.gps808.operationManagement.dao.StandardLineDao;
import com.gps808.operationManagement.service.StandardLineService;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardLineServiceImpl
  extends UniversalServiceImpl
  implements StandardLineService
{
  private StandardLineDao standardLineDao;
  private PaginationDao paginationDao;
  
  public StandardLineDao getStandardLineDao()
  {
    return this.standardLineDao;
  }
  
  public void setStandardLineDao(StandardLineDao standardLineDao)
  {
    this.standardLineDao = standardLineDao;
  }
  
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
    return StandardLineInfo.class;
  }
  
  private List<QueryScalar> getLineInfoScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("enable", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("type", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ticket", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("price", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upLen", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upTotalT", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upItlN", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upItlP", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upFirst", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("upLast", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnLen", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnTotalT", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnItlN", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnItlP", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnFirst", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dnLast", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("remark", StandardBasicTypes.STRING));
    
    scalars.add(new QueryScalar("upLng", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("upLat", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dnLng", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dnLat", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("mapTp", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  public AjaxDto<StandardLineInfo> getLineInfos(List<Integer> lstComapnyId, Integer isEnable, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer("select a.LineID as id, a.IsEnable as enable, a.Type as type, a.TicketMode as ticket");
    sql.append(", a.TicketPrice as price, a.Up_Length as upLen, a.Up_Time_Count_Second as upTotalT, a.Up_Time_Interval_Normal_Second as upItlN");
    sql.append(", a.Up_Time_Interval_Peak_Second as upItlP, a.Up_Time_First_bus as upFirst, a.Up_Time_Last_bus as upLast");
    sql.append(", a.Down_Length as dnLen, a.Down_Time_Count_Second as dnTotalT, a.Down_Time_Interval_Normal_Second as dnItlN");
    sql.append(", a.Down_Time_Interval_Peak_Second as dnItlP, a.Down_Time_First_bus as dnFirst, a.Down_Time_Last_bus as dnLast");
    sql.append(", a.Up_JingDu as upLng, a.Up_WeiDu as upLat, a.Down_JingDu as dnLng, a.Down_WeiDu as dnLat, a.MapType as mapTp");
    sql.append(", a.Remark as remark, b.Name as name, b.ParentCompanyID as pid, b.Abbreviation as abbr from jt808_line_info a, jt808_company_info b ");
    sql.append(" where a.LineID = b.ID and b.Level = 3 ");
    if (isEnable != null) {
      sql.append(String.format(" and a.IsEnable = %d ", new Object[] { isEnable }));
    }
    if ((lstComapnyId != null) && (lstComapnyId.size() > 0))
    {
      sql.append(String.format(" and b.ParentCompanyID in (%d", new Object[] { lstComapnyId.get(0) }));
      for (int i = 1; i < lstComapnyId.size(); i++) {
        sql.append(String.format(", %d", new Object[] { lstComapnyId.get(i) }));
      }
      sql.append(" ) ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    List<QueryScalar> scalars = getLineInfoScalar();
    scalars.add(new QueryScalar("name", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("abbr", StandardBasicTypes.STRING));
    
    return this.paginationDao.getExtraByNativeSqlEx(sql.toString(), pagination, scalars, StandardLineInfo.class, null);
  }
  
  public AjaxDto<StandardLineInfo> getLineInfoList(List<Integer> lstLineId, Integer isEnable, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardLineInfo where 1 = 1");
    if (isEnable != null) {
      sql.append(String.format(" and enable = %d ", new Object[] { isEnable }));
    }
    if ((lstLineId != null) && (lstLineId.size() > 0))
    {
      sql.append(String.format(" and id in (%d", new Object[] { lstLineId.get(0) }));
      for (int i = 1; i < lstLineId.size(); i++) {
        sql.append(String.format(", %d", new Object[] { lstLineId.get(i) }));
      }
      sql.append(" ) ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardLineStationRelationStation> getLineStationInfos(Integer lineId, Integer direct, Integer isEnable, String condition, Pagination pagination)
  {
    if ((lineId == null) || (direct == null)) {
      return null;
    }
    StringBuffer sql = new StringBuffer(" from StandardLineStationRelationStation where 1 = 1");
    sql.append(String.format(" and lid = %d ", new Object[] { lineId }));
    sql.append(String.format(" and direct = %d ", new Object[] { direct }));
    if (isEnable != null) {
      sql.append(String.format(" and station.enable = %d ", new Object[] { isEnable }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public StandardLineStationRelationStation getLineStationRelation(Integer lineId, Integer stationId, Integer direct, Integer index, String condition)
  {
    return this.standardLineDao.getLineStationRelation(lineId, stationId, direct, index, condition);
  }
  
  public StandardStationInfo getStationInfo(String name, Integer direct, String condition)
  {
    return this.standardLineDao.getStationInfo(name, direct, condition);
  }
  
  public Integer getMaxStationIndex(Integer lineId, Integer direct, String condition)
  {
    return this.standardLineDao.getMaxStationIndex(lineId, direct, condition);
  }
  
  public void batchSaveStationRelation(List<StandardLineStationRelationStation> newLstRelation, List<StandardLineStationRelationStation> delLstRelation)
  {
    this.standardLineDao.batchSaveStationRelation(newLstRelation, delLstRelation);
  }
  
  public AjaxDto<StandardStationInfo> getStationInfos(Integer sid, Integer direct, Integer isEnable, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardStationInfo where 1 = 1");
    if (sid != null) {
      sql.append(String.format(" and id = %d ", new Object[] { sid }));
    }
    if (direct != null) {
      sql.append(String.format(" and direct = %d ", new Object[] { direct }));
    }
    if (isEnable != null) {
      sql.append(String.format(" and enable = %d ", new Object[] { isEnable }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardLineStationRelation> getLineStationRelationInfos(List<Integer> lstLineId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardLineStationRelation where 1 = 1");
    if ((lstLineId == null) || (lstLineId.size() == 0)) {
      return null;
    }
    sql.append(String.format(" and lid in( %d", new Object[] { lstLineId.get(0) }));
    for (int i = 1; i < lstLineId.size(); i++) {
      sql.append(String.format(",%d", new Object[] { lstLineId.get(i) }));
    }
    sql.append(") ");
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardStationInfo> getStationInfos(List<Integer> lstSId, Integer isEnable, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardStationInfo where 1 = 1");
    if ((lstSId == null) || (lstSId.size() == 0)) {
      return null;
    }
    sql.append(String.format(" and id in( %d", new Object[] { lstSId.get(0) }));
    for (int i = 1; i < lstSId.size(); i++) {
      sql.append(String.format(",%d", new Object[] { lstSId.get(i) }));
    }
    sql.append(") ");
    if (isEnable != null) {
      sql.append(String.format(" and enable = %d ", new Object[] { isEnable }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
}
