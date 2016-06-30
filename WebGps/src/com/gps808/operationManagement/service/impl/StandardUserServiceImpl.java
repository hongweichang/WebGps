package com.gps808.operationManagement.service.impl;

import com.framework.web.action.BaseAction;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.DeviceStatus;
import com.gps.model.DeviceStatusLite;
import com.gps.model.ServerInfo;
import com.gps.model.UserSession;
import com.gps.system.model.ServerLog;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardAreaChina;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardDeviceOflFile;
import com.gps808.model.StandardDeviceOflTask;
import com.gps808.model.StandardDeviceTirepressureStatus;
import com.gps808.model.StandardDeviceYouLiang;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardDriverEx;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserSession;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardUserVehiPermitUser;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleInvoice;
import com.gps808.model.StandardVehicleReceipt;
import com.gps808.model.StandardVehicleSafe;
import com.gps808.operationManagement.dao.StandardUserAccountDao;
import com.gps808.operationManagement.dao.StandardUserSessionDao;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardDeviceEx;
import com.gps808.operationManagement.vo.StandardSendVehicle;
import com.gps808.operationManagement.vo.StandardUserVehiPermitExMore;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardUserServiceImpl
  extends UniversalServiceImpl
  implements StandardUserService
{
  private StandardUserAccountDao standardUserAccountDao;
  private PaginationDao paginationDao;
  private StandardUserSessionDao standardUserSessionDao;
  
  public StandardUserSessionDao getStandardUserSessionDao()
  {
    return this.standardUserSessionDao;
  }
  
  public void setStandardUserSessionDao(StandardUserSessionDao standardUserSessionDao)
  {
    this.standardUserSessionDao = standardUserSessionDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public StandardUserAccountDao getStandardUserAccountDao()
  {
    return this.standardUserAccountDao;
  }
  
  public void setStandardUserAccountDao(StandardUserAccountDao standardUserAccountDao)
  {
    this.standardUserAccountDao = standardUserAccountDao;
  }
  
  public Class getClazz()
  {
    return StandardUserAccount.class;
  }
  
  public UserSession getUserSession(String session)
  {
    return this.standardUserSessionDao.getUserSession(session);
  }
  
  public String getStandardUserAccountName(Integer userId)
  {
    return this.standardUserAccountDao.getStandardUserAccountName(userId);
  }
  
  public StandardUserAccount getStandardUserAccountByAccount(String account)
  {
    return this.standardUserAccountDao.getStandardUserAccountByAccount(account);
  }
  
  public List<Integer> getCompanyIdList(Integer companyId, List<Integer> lstLevel, boolean isAdmin)
  {
    return this.standardUserAccountDao.getCompanyIdList(companyId, lstLevel, isAdmin);
  }
  
  public List<Integer> getChildIdList(Integer companyId)
  {
    return this.standardUserAccountDao.getChildIdList(companyId);
  }
  
  public List<StandardCompany> getStandardCompanyList(List<Integer> companyIds)
  {
    return this.standardUserAccountDao.getStandardCompanyList(companyIds);
  }
  
  public AjaxDto<StandardCompany> getStandardCompanyByName(String name, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(String.format(" from StandardCompany where name like '%%%s%%'", new Object[] { name }), pagination);
  }
  
  private void appendCompanyCondition(StringBuffer sql, List<Integer> lstId)
  {
    sql.append(String.format(" and (  company.id = %d", new Object[] { lstId.get(0) }));
    for (int i = 1; i < lstId.size(); i++) {
      sql.append(String.format(" or company.id = %d", new Object[] { lstId.get(i) }));
    }
    sql.append(" ) ");
  }
  
  private void appendComCondition(StringBuffer sql, List<Integer> lstId)
  {
    sql.append(String.format(" and (  CompanyID = %d", new Object[] { lstId.get(0) }));
    for (int i = 1; i < lstId.size(); i++) {
      sql.append(String.format(" or CompanyID= %d", new Object[] { lstId.get(i) }));
    }
    sql.append(" ) ");
  }
  
  public AjaxDto<StandardUserAccount> getStandardUserList(List<Integer> lstId, Integer userId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserAccount where 1 = 1 and accountType <>  1 ");
    if ((lstId != null) && (lstId.size() > 0))
    {
      sql.append(String.format(" and (  company.id = %d", new Object[] { lstId.get(0) }));
      for (int i = 1; i < lstId.size(); i++) {
        sql.append(String.format(" or company.id = %d", new Object[] { lstId.get(i) }));
      }
      if (userId != null) {
        sql.append(String.format(" or id = %d", new Object[] { userId }));
      }
      sql.append(" ) ");
    }
    else if (userId != null)
    {
      sql.append(String.format(" and id = %d ", new Object[] { userId }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardUserAccount> getStandardUsersList(List<Integer> lstId, Integer userId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserAccount where 1 = 1");
    if ((lstId != null) && (lstId.size() > 0))
    {
      sql.append(String.format(" and (  company.id = %d", new Object[] { lstId.get(0) }));
      for (int i = 1; i < lstId.size(); i++) {
        sql.append(String.format(" or company.id = %d", new Object[] { lstId.get(i) }));
      }
      if (userId != null) {
        sql.append(String.format(" or id = %d", new Object[] { userId }));
      }
      sql.append(" ) ");
    }
    else if (userId != null)
    {
      sql.append(String.format(" and id = %d ", new Object[] { userId }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardUserRole> getStandardRoleList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserRole where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardSIMCardInfo> getStandardSIMList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardSIMCardInfo where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardDevice> getStandardDeviceList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardDevice where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<StandardDeviceEx> getUserDeviceList(Integer uid, Integer cid, String devIDNO, Integer instell, Integer id)
  {
    StringBuffer sql = new StringBuffer(" select c.ID as id, c.DevIDNO as devIDNO, c.CompanyID as companyId, c.DevType as devType, c.SerialID as serialID, c.Brand as brand, c.Model as model, c.InstallTime as stlTm, c.Install as install, b.VehiIDNO as vehiIdno from jt808_user_vehicle_permit a, jt808_vehicle_device_relation b, jt808_device_info c where a.VehiIDNO = b.VehiIDNO and b.DevIDNO = c.DevIDNO ");
    if (uid != null) {
      sql.append(String.format(" and a.AccountID = %d ", new Object[] { uid }));
    }
    if (cid != null) {
      sql.append(String.format(" and c.CompanyID = %d ", new Object[] { cid }));
    }
    if ((devIDNO != null) && (!devIDNO.equals(""))) {
      sql.append(String.format(" and (c.DevIDNO like '%%%s%%' or c.SerialID like '%%%s%%') ", new Object[] { devIDNO, devIDNO }));
    }
    if ((id != null) && (instell != null) && (2 != instell.intValue())) {
      sql.append(String.format(" and (c.ID = %d or c.Install = %d)", new Object[] { id, instell }));
    } else if ((instell != null) && (2 != instell.intValue())) {
      sql.append(String.format(" and c.Install = %d", new Object[] { instell }));
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("devIDNO", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("companyId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("devType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("serialID", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("brand", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("model", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("stlTm", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("install", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardDeviceEx.class);
  }
  
  public AjaxDto<StandardVehicle> getStandardVehicleList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehicle where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<StandardVehicle> getVehicleMaturitys(List<Integer> lstId, String begin, String end, String condition)
  {
    StringBuffer sql = new StringBuffer(" select VehiIDNO as vehiIDNO, CompanyID as id, PlateType as plateType, PayBegin as payBegin, PayPeriod as payPeriod, SafeEndDate as safeDate, DrivingEndDate as drivingDate, OperatingEndDate as operatingDate from jt808_vehicle_info where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendComCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    if ((begin != null) && (!begin.equals("")) && (end != null) && (!end.equals("")))
    {
      sql.append(String.format(" and ( SafeEndDate >= '%s' and SafeEndDate <='%s' ", new Object[] { begin, end }));
      sql.append(String.format(" or DrivingEndDate >= '%s' and DrivingEndDate <='%s' ", new Object[] { begin, end }));
      sql.append(String.format(" or OperatingEndDate >= '%s' and OperatingEndDate <='%s' ", new Object[] { begin, end }));
      sql.append(String.format(" or DATE_ADD(PayBegin, INTERVAL PayPeriod MONTH) >= '%s' and DATE_ADD(PayBegin, INTERVAL PayPeriod MONTH) <='%s' ", new Object[] { begin, end }));
      sql.append(" )");
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIDNO", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("payBegin", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("payPeriod", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("safeDate", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("drivingDate", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("operatingDate", StandardBasicTypes.TIMESTAMP));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, StandardVehicle.class);
  }
  
  public List<StandardVehiDevRelation> getStandardVehiDevRelationList(String vehiIDNO, String devIDNO)
  {
    return this.standardUserAccountDao.getStandardVehiDevRelationList(vehiIDNO, devIDNO);
  }
  
  public List<StandardVehiDevRelationEx> getStandardVehiDevRelationExList(String vehiIDNO, String devIDNO)
  {
    return this.standardUserAccountDao.getStandardVehiDevRelationExList(vehiIDNO, devIDNO);
  }
  
  public List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(String vehiIDNO, String devIDNO, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    return this.standardUserAccountDao.getStandardVehiDevRelationExMoreList(vehiIDNO, devIDNO, scalars, fieldCondition, queryCondition);
  }
  
  public List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> vehiIDNOs, List<String> devIDNOs, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    return this.standardUserAccountDao.getStandardVehiDevRelationExMoreList(vehiIDNOs, devIDNOs, scalars, fieldCondition, queryCondition);
  }
  
  public AjaxDto<StandardDriver> getStandardDriverList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardDriver where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0)) {
      appendCompanyCondition(sql, lstId);
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardDriverEx> getStandardDriverExList(List<Integer> lstId, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardDriverEx where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0))
    {
      sql.append(String.format(" and pid in(%d", new Object[] { lstId.get(0) }));
      for (int i = 1; i < lstId.size(); i++) {
        sql.append(String.format(",%d", new Object[] { lstId.get(i) }));
      }
      sql.append(" ) ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<StandardUserVehiPermitEx> getAuthorizedUserVehicleList(Integer userId, String vehiIdno, String condition)
  {
    return this.standardUserAccountDao.getAuthorizedUserVehicleList(userId, vehiIdno, condition);
  }
  
  public List<StandardUserVehiPermitVehicle> getAuthorizedVehicleList(Integer userId, String vehiIdno, String condition)
  {
    return this.standardUserAccountDao.getAuthorizedVehicleList(userId, vehiIdno, condition);
  }
  
  public List<PartStandardInfo> getRulePermitVehi(Integer uid, Integer ruleId, String name)
  {
    StringBuffer sql = new StringBuffer(" select a.ID as id, a.VehiIDNO as name, a.CompanyID as parentId from jt808_vehicle_info a, jt808_user_vehicle_permit b, jt808_vehicle_rule c where a.VehiIDNO = b. VehiIDNO and a.VehiIDNO = c.VehiIDNO ");
    if (uid != null) {
      sql.append(String.format(" and b.AccountID = %d ", new Object[] { uid }));
    }
    if (ruleId != null) {
      sql.append(String.format(" and c.RuleID = %d ", new Object[] { ruleId }));
    }
    if ((name != null) && (!name.isEmpty())) {
      sql.append(String.format(" and (a.VehiIDNO like '%%%s%%')", new Object[] { name }));
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("name", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("parentId", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, PartStandardInfo.class);
  }
  
  public List<PartStandardInfo> getStoRelationPermitVehi(Integer uid, String name)
  {
    StringBuffer sql = new StringBuffer(" select a.ID as id, a.VehiIDNO as name, a.CompanyID as parentId from jt808_vehicle_info a, jt808_user_vehicle_permit b, jt808_storage_relation c where a.VehiIDNO = b. VehiIDNO and a.VehiIDNO = c.VehiIDNO ");
    if (uid != null) {
      sql.append(String.format(" and b.AccountID = %d ", new Object[] { uid }));
    }
    if ((name != null) && (!name.isEmpty())) {
      sql.append(String.format(" and (a.VehiIDNO like '%%%s%%')", new Object[] { name }));
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("name", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("parentId", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(sql.toString(), scalars, PartStandardInfo.class);
  }
  
  public List<StandardUserVehiPermitExMore> getAuthorizedVehicleExMoreList(Integer userId, String vehiIdno, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    return this.standardUserAccountDao.getAuthorizedVehicleExMoreList(userId, vehiIdno, scalars, fieldCondition, queryCondition);
  }
  
  public List<StandardUserVehiPermitUser> getPeimitVehicleUserList(Integer userId, String vehiIdno, String condition)
  {
    return this.standardUserAccountDao.getPeimitVehicleUserList(userId, vehiIdno, condition);
  }
  
  public void changePassword(Integer id, String pwd)
  {
    this.standardUserAccountDao.changePassword(id, pwd);
  }
  
  public StandardCompany getStandardCompany(String name)
  {
    return this.standardUserAccountDao.getStandardCompany(name);
  }
  
  public StandardCompany getCompanyByCustomerID(String CustomerID)
  {
    return this.standardUserAccountDao.getCompanyByCustomerID(CustomerID);
  }
  
  public MapMarker getStandardMark(String name)
  {
    return this.standardUserAccountDao.getStandardMark(name);
  }
  
  public StandardAreaChina getStandardArea(String name, Integer parentId)
  {
    return this.standardUserAccountDao.getStandardArea(name, parentId);
  }
  
  public List<MapMarker> getAreaByParentId()
  {
    StringBuffer strQuery = new StringBuffer("select ID as id, TypeId as markerType, Name as name, ParentID as parentId, AreaName as areaName, AreaType as areaType from map_marker");
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("name", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("parentId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("areaName", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("areaType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("markerType", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), scalars, MapMarker.class);
  }
  
  public StandardDevice getStandardDevice(Integer id)
  {
    return this.standardUserAccountDao.getStandardDevice(id);
  }
  
  public StandardDevice getDeviceBySim(String simCard)
  {
    return this.standardUserAccountDao.getDeviceBySim(simCard);
  }
  
  public StandardVehicle getStandardVehicle(Integer id)
  {
    return this.standardUserAccountDao.getStandardVehicle(id);
  }
  
  public StandardUserAccount getStandardUserAccount(String account, String name)
  {
    return this.standardUserAccountDao.getStandardUserAccount(account, name);
  }
  
  public StandardUserRole getStandardUserRole(String name)
  {
    return this.standardUserAccountDao.getStandardUserRole(name);
  }
  
  public StandardDriver getStandardDriver(String jobNum)
  {
    return this.standardUserAccountDao.getStandardDriver(jobNum);
  }
  
  public StandardSIMCardInfo getStandardSIMCardInfo(Integer id)
  {
    return this.standardUserAccountDao.getStandardSIMCardInfo(id);
  }
  
  public void editUserVehiPermitEx(List<StandardUserVehiPermitEx> addPermits, List<StandardUserVehiPermitEx> delPermits)
  {
    this.standardUserAccountDao.editUserVehiPermitEx(addPermits, delPermits);
  }
  
  public void mergeVehicle(List<StandardVehiDevRelation> addRelation, List<StandardVehiDevRelation> delRelations, List<StandardSIMCardInfo> delSimInfos, List<StandardDevice> delDevices)
  {
    this.standardUserAccountDao.mergeVehicle(addRelation, delRelations, delSimInfos, delDevices);
  }
  
  public void deleteVehicle(List<StandardStorageRelation> storageRelations, List<StandardVehiDevRelation> deRelations, List<StandardVehiRule> delRulePermits, StandardVehicle vehicle, boolean deldev)
  {
    this.standardUserAccountDao.deleteVehicle(storageRelations, deRelations, delRulePermits, vehicle, deldev);
  }
  
  public void deleteVehicleAndDevice(List<StandardStorageRelation> storageRelations, List<StandardVehiDevRelation> deRelations, List<StandardVehiRule> delRulePermits, StandardVehicle vehicle)
  {
    this.standardUserAccountDao.deleteVehicleAndDevice(storageRelations, deRelations, delRulePermits, vehicle);
  }
  
  public void deleteDevice(StandardDevice device)
  {
    this.standardUserAccountDao.deleteDevice(device);
  }
  
  public void updateVehicle(List<StandardVehicle> vehicleList, List<StandardUserVehiPermitEx> delPermits, List<StandardVehiRule> delRulePermits)
  {
    this.standardUserAccountDao.updateVehicle(vehicleList, delPermits, delRulePermits);
  }
  
  public List<StandardVehicle> getVehicleList(Integer companyId)
  {
    return this.standardUserAccountDao.getVehicleList(companyId);
  }
  
  public List<VehicleLiteEx> getVehicleList(String[] vehiIdnos)
  {
    return this.standardUserAccountDao.getVehicleList(vehiIdnos);
  }
  
  public void updateDevice(StandardDevice device, StandardSIMCardInfo simInfo, StandardSIMCardInfo delSimInfo)
  {
    this.standardUserAccountDao.updateDevice(device, simInfo, delSimInfo);
  }
  
  public Integer getDeviceCount()
  {
    return this.paginationDao.getCountByNativeSql("select * from jt808_device_info ");
  }
  
  protected String getDeviceUnregSql(String name)
  {
    StringBuffer query = new StringBuffer("select dev_status.* from dev_status left join jt808_device_info on dev_status.DevIDNO = jt808_device_info.DevIDNO where jt808_device_info.DevIDNO is null and dev_status.online = 1");
    if ((name != null) && (!name.isEmpty())) {
      query.append(String.format(" and dev_status.DevIDNO like '%%%s%%'", new Object[] { name }));
    }
    return query.toString();
  }
  
  public Integer getDeviceUnregCount()
  {
    return this.paginationDao.getCountByNativeSql(getDeviceUnregSql(""));
  }
  
  private List<QueryScalar> getDeviceStatusQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("network", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("netName", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("gwsvrIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("online", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("status1", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("status2", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("status3", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("status4", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("tempSensor1", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("tempSensor2", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("tempSensor3", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("tempSensor4", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("speed", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("hangXiang", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("jingDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("weiDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("gaoDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("mapJingDu", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("mapWeiDu", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("parkTime", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("liCheng", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("gpsTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("ip", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("port", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("protocol", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("factoryDevType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("updateTime", StandardBasicTypes.TIMESTAMP));
    return scalars;
  }
  
  public AjaxDto<DeviceStatus> getDeviceUnregList(String name, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getDeviceUnregSql(name), pagination, getDeviceStatusQueryScalar(), DeviceStatus.class, null);
  }
  
  protected String getDeviceOnlineSql(List<Integer> lstId, Boolean isOnline, boolean isAdmin, String name)
  {
    StringBuffer strQuery = new StringBuffer("select dev_status.* from dev_status ");
    if ((isAdmin) || (BaseAction.isAllowManageDevice))
    {
      if ((name != null) && (!name.isEmpty()))
      {
        strQuery.append(String.format(", (select jt808_device_info.DevIDNO as idno from jt808_device_info  where jt808_device_info.DevIDNO like '%%%s%%' ) B ", new Object[] { name }));
        strQuery.append("where dev_status.DevIDNO = B.idno ");
      }
      else
      {
        strQuery.append("left join jt808_device_info on dev_status.DevIDNO = jt808_device_info.DevIDNO where jt808_device_info.DevIDNO is not null ");
      }
    }
    else
    {
      if ((name != null) && (!name.isEmpty()))
      {
        strQuery.append(String.format(", jt808_device_info where jt808_device_info.DevIDNO like '%%%s%%' ", new Object[] { name }));
        strQuery.append(" and dev_status.DevIDNO = jt808_device_info.DevIDNO ");
      }
      else
      {
        strQuery.append(", jt808_device_info where dev_status.DevIDNO = jt808_device_info.DevIDNO ");
      }
      if ((lstId != null) && (lstId.size() > 0))
      {
        strQuery.append(String.format(" and ( jt808_device_info.CompanyId = %d ", new Object[] { lstId.get(0) }));
        int i = 1;
        for (int j = lstId.size(); i < j; i++) {
          strQuery.append(String.format(" or jt808_device_info.CompanyId = %d ", new Object[] { lstId.get(i) }));
        }
        strQuery.append(" ) ");
      }
    }
    if (isOnline != null) {
      if (isOnline.booleanValue()) {
        strQuery.append(" and dev_status.online = 1 ");
      } else {
        strQuery.append(" and dev_status.online = 0 ");
      }
    }
    return strQuery.toString();
  }
  
  protected String getUserDeviceOnlineSql(Integer uid, Boolean isOnline, String name)
  {
    StringBuffer strQuery = new StringBuffer("select a.* from dev_status a ");
    
    strQuery.append(String.format(", jt808_device_info b, jt808_user_vehicle_permit c, jt808_vehicle_device_relation d where c.VehiIDNO = d.VehiIDNO and d.DevIDNO = b.DevIDNO and b.DevIDNO  = a.DevIDNO  ", new Object[0]));
    if (uid != null) {
      strQuery.append(String.format(" and c.AccountID = %d ", new Object[] { uid }));
    }
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format(" and b.DevIDNO like '%%%s%%' ", new Object[] { name }));
    }
    if (isOnline != null) {
      if (isOnline.booleanValue()) {
        strQuery.append(" and a.online = 1 ");
      } else {
        strQuery.append(" and a.online = 0 ");
      }
    }
    return strQuery.toString();
  }
  
  public Integer getDeviceOnlineCount(List<Integer> lstId, boolean isAdmin)
  {
    return this.paginationDao.getCountByNativeSql(getDeviceOnlineSql(lstId, Boolean.valueOf(true), isAdmin, ""));
  }
  
  public Integer getUserDeviceOnlineCount(Integer uid)
  {
    return this.paginationDao.getCountByNativeSql(getUserDeviceOnlineSql(uid, Boolean.valueOf(true), ""));
  }
  
  public AjaxDto<DeviceStatus> getDeviceOnlineList(List<Integer> lstId, Boolean isOnline, boolean isAdmin, String name, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getDeviceOnlineSql(lstId, isOnline, isAdmin, name), pagination, getDeviceStatusQueryScalar(), DeviceStatus.class, null);
  }
  
  public AjaxDto<DeviceStatus> getUserDeviceOnlineList(Integer uid, Boolean isOnline, String name, Pagination pagination)
  {
    return this.paginationDao.getExtraByNativeSqlEx(getUserDeviceOnlineSql(uid, isOnline, name), pagination, getDeviceStatusQueryScalar(), DeviceStatus.class, null);
  }
  
  public AjaxDto<DeviceStatusLite> getDeviceStatusLite(List<String> lstId, Boolean isOnline, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from DeviceStatusLite where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0))
    {
      sql.append(String.format(" and id in('%s'", new Object[] { lstId.get(0) }));
      for (int i = 1; i < lstId.size(); i++) {
        sql.append(String.format(",'%s'", new Object[] { lstId.get(i) }));
      }
      sql.append(") ");
    }
    if (isOnline != null) {
      if (isOnline.booleanValue()) {
        sql.append(" and ol = 1 ");
      } else {
        sql.append(" and ol = 0 ");
      }
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<DeviceStatusLite> getDeviceStatusLite(Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(" from DeviceStatusLite ", pagination);
  }
  
  public AjaxDto<DeviceStatusLite> getDeviceStatusLite(Boolean isOnline, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from DeviceStatusLite ");
    if (isOnline != null) {
      if (isOnline.booleanValue()) {
        sql.append(" where ol = 1");
      } else {
        sql.append(" where ol = 0 or ol is null");
      }
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public Integer getClientOnlineCount(List<Integer> lstId, boolean isAdmin)
  {
    return this.paginationDao.getCountByQueryStr(getOnlineClientQueryString(lstId, isAdmin, "").toString());
  }
  
  private String getOnlineClientQueryString(List<Integer> lstId, boolean isAdmin, String name)
  {
    StringBuffer str = new StringBuffer("from StandardUserSession where 1 = 1 ");
    if ((name != null) && (!name.equals(""))) {
      str.append(String.format(" and userAccount.account like '%%%s%%' or userAccount.name like '%%%s%%'", new Object[] { name, name }));
    }
    if ((!isAdmin) && 
      (lstId != null) && (lstId.size() > 0))
    {
      str.append(String.format(" and ( userAccount.company.id = %d ", new Object[] { lstId.get(0) }));
      int i = 1;
      for (int j = lstId.size(); i < j; i++) {
        str.append(String.format(" or userAccount.company.id = %d ", new Object[] { lstId.get(i) }));
      }
      str.append(" ) ");
    }
    return str.toString();
  }
  
  public AjaxDto<StandardUserSession> getClientOnlineList(List<Integer> lstId, boolean isAdmin, String usrname, Pagination pagination)
  {
    AjaxDto<StandardUserSession> ajaxDto = new AjaxDto();
    ajaxDto = this.paginationDao.getPgntByQueryStr(getOnlineClientQueryString(lstId, isAdmin, usrname), pagination);
    return ajaxDto;
  }
  
  public void deleteServer(ServerInfo server, List<StandardStorageRelation> delRelations)
  {
    this.standardUserAccountDao.deleteServer(server, delRelations);
  }
  
  public void updateVehicle(int vehiId, String vehiIdno)
  {
    this.standardUserAccountDao.updateVehicle(vehiId, vehiIdno);
  }
  
  public List<StandardCompanyRelation> getCompanyRelation(Integer companyId, Integer childId)
  {
    return this.standardUserAccountDao.getCompanyRelation(companyId, childId);
  }
  
  public List<StandardCompany> getCompanyTeamList(Integer companyId)
  {
    return this.standardUserAccountDao.getCompanyTeamList(companyId);
  }
  
  public StandardDeviceOflTask getDeviceOflTask(String devIdno, Integer fileType)
  {
    return this.standardUserAccountDao.findDeviceOflTask(devIdno, fileType);
  }
  
  public AjaxDto<StandardDeviceOflFile> getFileListByName(String begintime, String endtime, Integer protocol, Integer factoryType, Integer fileType, String sp, Pagination pagination)
  {
    StringBuffer query = new StringBuffer(" from StandardDeviceOflFile where 1 = 1");
    if ((begintime != null) && (endtime != null)) {
      query.append(String.format("and upl BETWEEN '%s' and '%s' ", new Object[] { begintime, endtime }));
    }
    if (protocol != null) {
      query.append(String.format("and np = %d ", new Object[] { protocol }));
    }
    if (factoryType != null) {
      query.append(String.format("and fat = %d ", new Object[] { factoryType }));
    }
    if (fileType != null) {
      query.append(String.format("and ft = %d ", new Object[] { fileType }));
    }
    if ((sp != null) && (!sp.isEmpty())) {
      query.append(String.format("and sp like '%%%s%%' ", new Object[] { sp }));
    }
    query.append(" order by upl DESC");
    return this.paginationDao.getPgntByQueryStr(query.toString(), pagination);
  }
  
  public StandardDeviceYouLiang getDeviceYouLiang(String devIdno)
  {
    return this.standardUserAccountDao.findDeviceYouLiang(devIdno);
  }
  
  public void delStorageRelation(StandardStorageRelation Relation, Integer ruleType)
  {
    this.standardUserAccountDao.delStorageRelation(Relation, ruleType);
  }
  
  public List<StandardVehicleSafe> getAllVehicleSafes(List<String> lstVehiIdno)
  {
    return this.standardUserAccountDao.getAllVehicleSafes(lstVehiIdno);
  }
  
  public AjaxDto<StandardVehicleReceipt> getVehicleReceipts(List<Integer> childIds, String status, Pagination pagination)
  {
    StringBuffer query = new StringBuffer(String.format(" from StandardVehicleReceipt where 1 = 1", new Object[0]));
    query.append(String.format("and (CompanyID = %d ", new Object[] { childIds.get(0) }));
    for (int i = 1; i < childIds.size(); i++) {
      query.append(String.format("or CompanyID = %d ", new Object[] { childIds.get(i) }));
    }
    query.append(") ");
    if ((status != null) && (!status.equals("0"))) {
      query.append(String.format(" and status = %d", new Object[] { Integer.valueOf(Integer.parseInt(status)) }));
    }
    query.append(" order by updateTime DESC");
    return this.paginationDao.getPgntByQueryStr(query.toString(), pagination);
  }
  
  public AjaxDto<StandardVehicleInvoice> getVehicleInvoices(String dateB, String dateE, String[] vehiIdno, List<Integer> childIds, String status, Pagination pagination)
  {
    StringBuffer query = new StringBuffer(String.format(" from StandardVehicleInvoice where 1 = 1", new Object[0]));
    if ((dateB != null) && (!dateB.isEmpty()) && (dateE != null) && (!dateE.isEmpty())) {
      query.append(String.format("and sendStartTime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
    }
    if ((vehiIdno != null) && (vehiIdno.length > 0))
    {
      query.append(String.format("and (vehicle.vehiIDNO = '%s' ", new Object[] { vehiIdno[0] }));
      for (int i = 1; i < vehiIdno.length; i++) {
        query.append(String.format("or vehicle.vehiIDNO = '%s' ", new Object[] { vehiIdno[i] }));
      }
      query.append(") ");
    }
    if ((childIds != null) && (childIds.size() > 0))
    {
      query.append(String.format("and (CompanyID = %d ", new Object[] { childIds.get(0) }));
      for (int i = 1; i < childIds.size(); i++) {
        query.append(String.format("or CompanyID = %d ", new Object[] { childIds.get(i) }));
      }
      query.append(") ");
    }
    if ((status != null) && (!status.isEmpty()) && (!status.equals("0"))) {
      query.append(String.format(" and status = %d", new Object[] { Integer.valueOf(Integer.parseInt(status)) }));
    }
    query.append(" order by sendStartTime DESC");
    return this.paginationDao.getPgntByQueryStr(query.toString(), pagination);
  }
  
  public List<StandardSendVehicle> getVehicles(List<Integer> lsdcompanys, String name, String status)
  {
    StringBuffer strQuery = new StringBuffer("SELECT a.ID as id,a.VehiIDNO as vid,a.CompanyID as cid,a.PlateType as ptp, c.JingDu as jingDu,c.WeiDu as weiDu,c.Online as ol, c.GPSTime as tm, d.Status as stu from jt808_vehicle_info a,jt808_vehicle_device_relation b,dev_status c,beacon d WHERE b.VehiIDNO = a.VehiIDNO and b.DevIDNO = c.DevIDNO and b.DevIDNO = d.DevIDNO ");
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format(" and ( a.VehiIDNO like '%%%s%%' and d.DevIDNO like '%%%s%%' )", new Object[] { name, name }));
    }
    if ((status != null) && (!status.isEmpty()) && (!"0".equals(status))) {
      strQuery.append(String.format(" and d.Status = %d ", new Object[] { Integer.valueOf(Integer.parseInt(status)) }));
    }
    if ((lsdcompanys != null) && (lsdcompanys.size() > 0))
    {
      strQuery.append(String.format(" and ( a.CompanyID = %d ", new Object[] { lsdcompanys.get(0) }));
      for (int i = 1; i < lsdcompanys.size(); i++) {
        strQuery.append(String.format(" or a.CompanyID = %d ", new Object[] { lsdcompanys.get(i) }));
      }
      strQuery.append(")");
    }
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vid", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("cid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("stu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ptp", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("jingDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("weiDu", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ol", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("tm", StandardBasicTypes.DATE));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), scalars, StandardSendVehicle.class);
  }
  
  public List<String> getStandardVehiIdnoList(List<Integer> lstId, String condition)
  {
    return this.standardUserAccountDao.getStandardVehiIdnoList(lstId, condition);
  }
  
  public AjaxDto<StandardDeviceAlarm> getAlarmByDevidno(String devIdno, List<Integer> lstArmType)
  {
    Pagination pagination = new Pagination();
    pagination.setCurrentPage(1);
    pagination.setPageRecords(50);
    StringBuffer query = new StringBuffer(String.format(" from StandardDeviceAlarm where 1 = 1", new Object[0]));
    query.append(String.format(" and devIdno = '%s' ", new Object[] { devIdno }));
    if ((lstArmType != null) && (lstArmType.size() > 0))
    {
      query.append(String.format("and (ArmType = %d ", new Object[] { lstArmType.get(0) }));
      for (int i = 1; i < lstArmType.size(); i++) {
        query.append(String.format("or ArmType = %d ", new Object[] { lstArmType.get(i) }));
      }
      query.append(") ");
    }
    query.append(" order by ArmTimeStart DESC");
    return this.paginationDao.getPgntByQueryStr(query.toString(), pagination);
  }
  
  public AjaxDto<ServerLog> getServerLog(String begin, String end, String type)
  {
    Pagination pagination = new Pagination();
    StringBuffer query = new StringBuffer(String.format(" from ServerLog where svrid = 9999", new Object[0]));
    query.append(String.format(" and dtime >= '%s' and dtime <= '%s' ", new Object[] { begin, end }));
    if ((type == null) || (type.equals("")) || (!type.equals("all"))) {
      query.append(String.format(" and action <> 0", new Object[0]));
    }
    query.append(" order by dtime DESC");
    return this.paginationDao.getPgntByQueryStr(query.toString(), pagination);
  }
  
  public void executePartition(String sql)
  {
    this.paginationDao.execNativeSql(sql);
  }
  
  public StandardDeviceTirepressureStatus getDeviceTirepressureStatus(String devIdno, Integer type)
  {
    return this.standardUserAccountDao.findTirepressureStatus(devIdno, type);
  }
  
  public List<StandardUserAccount> getAccountByRole(Integer roleId)
  {
    StringBuffer strQuery = new StringBuffer("SELECT ID as id from jt808_account WHERE 1 = 1 ");
    strQuery.append(String.format("and UserRoleID = %d ", new Object[] { roleId }));
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSql(strQuery.toString(), scalars, StandardUserAccount.class);
  }
}
