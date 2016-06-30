package com.gps808.rule.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardVehiRule;
import com.gps808.rule.dao.StandardVehicleRuleDao;
import com.gps808.rule.service.StandardVehicleRuleService;
import java.util.List;

public class StandardVehicleRuleServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleRuleService
{
  StandardVehicleRuleDao vehicleRuleDao;
  PaginationDao paginationDao;
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public StandardVehicleRuleDao getVehicleRuleDao()
  {
    return this.vehicleRuleDao;
  }
  
  public void setVehicleRuleDao(StandardVehicleRuleDao vehicleRuleDao)
  {
    this.vehicleRuleDao = vehicleRuleDao;
  }
  
  public Class getClazz()
  {
    return StandardRuleMaintain.class;
  }
  
  private void appendCompanyCondition(StringBuffer sql, List<Integer> lstId)
  {
    sql.append(String.format(" and (  company.id = %d", new Object[] { lstId.get(0) }));
    for (int i = 1; i < lstId.size(); i++) {
      sql.append(String.format(" or company.id = %d", new Object[] { lstId.get(i) }));
    }
    sql.append(" ) ");
  }
  
  private void appendTypeCondition(StringBuffer sql, List<Integer> lstType)
  {
    sql.append(String.format(" and (  type = %d", new Object[] { lstType.get(0) }));
    for (int i = 1; i < lstType.size(); i++) {
      sql.append(String.format(" or type = %d", new Object[] { lstType.get(i) }));
    }
    sql.append(" ) ");
  }
  
  public AjaxDto<StandardRuleMaintain> getRuleList(List<Integer> lstId, List<Integer> lstType, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardRuleMaintain where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((lstType != null) && (lstType.size() > 0)) {
      appendTypeCondition(sql, lstType);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public StandardRuleMaintain getVehicleRuleByName(String name)
  {
    return this.vehicleRuleDao.getVehicleRuleByName(name);
  }
  
  public List<StandardVehiRule> getStandardVehiRulePermit(Integer ruleId, String vehiIdno, String condition)
  {
    return this.vehicleRuleDao.getStandardVehiRulePermit(ruleId, vehiIdno, condition);
  }
  
  public AjaxDto<StandardVehiRule> getStandardVehiRulePermit(Integer ruleId, String vehiIdno, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehiRule where 1 = 1 ");
    if (ruleId != null) {
      sql.append(String.format(" and id = %d ", new Object[] { ruleId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vehicle.vehiIDNO = '%s' ", new Object[] { vehiIdno }));
    }
    if (condition != null) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public void editVehiRulePermit(List<StandardVehiRule> addPermits, List<StandardVehiRule> delPermits)
  {
    this.vehicleRuleDao.editVehiRulePermit(addPermits, delPermits);
  }
  
  public List<MapMarker> getMapMarkerList(Integer companyId)
  {
    StringBuffer sql = new StringBuffer("from MapMarker");
    if (companyId != null) {
      sql.append(String.format(" where UserID = %d", new Object[] { companyId }));
    }
    AjaxDto ajaxDto = this.paginationDao.getPgntByQueryStr(sql.toString(), null);
    if (ajaxDto != null) {
      return ajaxDto.getPageList();
    }
    return null;
  }
  
  public AjaxDto<MapMarker> getAreaList(List<Integer> cids, Integer uid, List<Integer> lstId, String name, Boolean isadmin, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer("from MapMarker where 1=1 ");
    if (lstId != null) {
      if (lstId.size() == 1)
      {
        sql.append(String.format(" and markerType = %d", new Object[] { lstId.get(0) }));
      }
      else
      {
        sql.append(String.format(" and ( markerType = %d", new Object[] { lstId.get(0) }));
        for (int i = 1; i < lstId.size(); i++) {
          sql.append(String.format(" or markerType = %d", new Object[] { lstId.get(i) }));
        }
        sql.append(" ) ");
      }
    }
    sql.append(String.format(" and ( share = %d", new Object[] { Integer.valueOf(2) }));
    if ((cids != null) && (cids.size() > 0))
    {
      sql.append(String.format(" or ( UserID = %d", new Object[] { cids.get(0) }));
      for (int i = 1; i < cids.size(); i++) {
        sql.append(String.format(" or UserID = %d", new Object[] { cids.get(i) }));
      }
      sql.append(" ) ");
      sql.append(String.format(" and share = %d", new Object[] { Integer.valueOf(1) }));
    }
    if (isadmin.booleanValue()) {
      sql.append(String.format(" or share = %d", new Object[] { Integer.valueOf(1) }));
    }
    if (uid != null)
    {
      sql.append(String.format(" or ( creator = %d", new Object[] { uid }));
      sql.append(String.format(" and share = %d )", new Object[] { Integer.valueOf(0) }));
    }
    sql.append(" ) ");
    if (name != null) {
      sql.append(String.format(" and name like '%%%s%%'", new Object[] { name }));
    }
    sql.append(String.format(" and areaType = %d", new Object[] { Integer.valueOf(0) }));
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<StandardRuleMaintain> getRulesByArea(Integer markId)
  {
    StringBuffer sql = new StringBuffer("from StandardRuleMaintain");
    if (markId != null) {
      sql.append(String.format(" where markId = %d", new Object[] { markId }));
    }
    AjaxDto ajaxDto = this.paginationDao.getPgntByQueryStr(sql.toString(), null);
    if (ajaxDto != null) {
      return ajaxDto.getPageList();
    }
    return null;
  }
  
  public void deleteRule(List<StandardVehiRule> delPermits, StandardRuleMaintain rule)
  {
    this.vehicleRuleDao.deleteRule(delPermits, rule);
  }
}
