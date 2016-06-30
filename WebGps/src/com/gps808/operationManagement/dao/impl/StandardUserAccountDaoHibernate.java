package com.gps808.operationManagement.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.framework.web.dto.QueryScalar;
import com.gps.model.ServerInfo;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardAreaChina;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDeviceOflTask;
import com.gps808.model.StandardDeviceTirepressureStatus;
import com.gps808.model.StandardDeviceYouLiang;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardUserVehiPermitUser;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleSafe;
import com.gps808.operationManagement.dao.StandardUserAccountDao;
import com.gps808.operationManagement.vo.StandardUserVehiPermitExMore;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class StandardUserAccountDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardUserAccountDao
{
  public String getStandardUserAccountName(Integer userId)
  {
    Query query = getSession().createSQLQuery(String.format("select Account from jt808_account where id = %d", new Object[] { userId }));
    if (query == null) {
      return null;
    }
    List<String> list = query.list();
    if (list.size() > 0) {
      return (String)list.get(0);
    }
    return null;
  }
  
  public StandardUserAccount getStandardUserAccountByAccount(String account)
  {
    Query query = getSession().createQuery(" from StandardUserAccount where account = ?");
    if (query == null) {
      return null;
    }
    query.setString(0, account);
    
    List<StandardUserAccount> list = query.list();
    if (list.size() > 0) {
      return (StandardUserAccount)list.get(0);
    }
    return null;
  }
  
  public List<Integer> getCompanyIdList(Integer companyId, List<Integer> lstLevel, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer();
    if (isAdmin)
    {
      sql.append("select ID from jt808_company_info where 1 = 1 and id <> -1");
      if ((lstLevel != null) && (lstLevel.size() > 0))
      {
        sql.append(String.format(" and Level in( %d", new Object[] { lstLevel.get(0) }));
        for (int i = 1; i < lstLevel.size(); i++) {
          sql.append(String.format(", %d", new Object[] { lstLevel.get(i) }));
        }
        sql.append(") ");
      }
    }
    else if ((lstLevel != null) && (lstLevel.size() > 0))
    {
      sql.append("select ID from jt808_company_info where 1 = 1");
      sql.append(String.format(" and Level in( %d", new Object[] { lstLevel.get(0) }));
      for (int i = 1; i < lstLevel.size(); i++) {
        sql.append(String.format(", %d", new Object[] { lstLevel.get(i) }));
      }
      sql.append(") ");
      if (companyId != null)
      {
        sql.append(" and ID in ( ");
        sql.append(String.format("select ChildId from jt808_company_relation where CompanyId = %d and ChildId <> -1", new Object[] { companyId }));
        sql.append(" )");
      }
    }
    else if (companyId != null)
    {
      sql.append(String.format("select ChildId from jt808_company_relation where CompanyId = %d and ChildId <> -1", new Object[] { companyId }));
    }
    Query query = getSession().createSQLQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<Integer> getChildIdList(Integer companyId)
  {
    StringBuffer sql = new StringBuffer();
    if (companyId != null) {
      sql.append(String.format("select CompanyId from jt808_company_relation where ChildId = %d", new Object[] { companyId }));
    }
    Query query = getSession().createSQLQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardCompany> getStandardCompanyList(List<Integer> companyIds)
  {
    StringBuffer sql = new StringBuffer(" from StandardCompany where 1 = 1");
    if ((companyIds != null) && (companyIds.size() > 0))
    {
      sql.append(" and id in (?");
      for (int i = 1; i < companyIds.size(); i++) {
        sql.append(",?");
      }
      sql.append(")");
    }
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    Query query = null;
    try
    {
      query = session.createQuery(sql.toString());
      if ((companyIds != null) && (companyIds.size() > 0))
      {
        int i = 0;
        for (int j = companyIds.size(); i < j; i++) {
          query.setInteger(i, ((Integer)companyIds.get(i)).intValue());
        }
      }
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
  
  public List<StandardUserAccount> getStandardUser(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserAccount ");
    if (!isAdmin) {
      sql.append(String.format(" where account <> 'admin' and company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardUserRole> getStandardRole(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserRole");
    if (!isAdmin) {
      sql.append(String.format(" where company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardSIMCardInfo> getStandardSIM(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardSIMCardInfo ");
    if (!isAdmin) {
      sql.append(String.format(" where company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardDevice> getStandardDevice(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardDevice ");
    if (!isAdmin) {
      sql.append(String.format(" where company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardVehicle> getStandardVehicle(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehicle ");
    if (!isAdmin) {
      sql.append(String.format(" where company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardVehiDevRelation> getStandardVehiDevRelationList(String vehiIDNO, String devIDNO)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehiDevRelation where 1 = 1 ");
    if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
      sql.append(String.format(" and vehicle.vehiIDNO = '%s'", new Object[] { vehiIDNO }));
    }
    if ((devIDNO != null) && (!devIDNO.isEmpty())) {
      sql.append(String.format(" and device.devIDNO = '%s'", new Object[] { devIDNO }));
    }
    sql.append(" order by mainDev desc");
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardVehiDevRelationEx> getStandardVehiDevRelationExList(String vehiIDNO, String devIDNO)
  {
    StringBuffer sql = new StringBuffer(" from StandardVehiDevRelationEx where 1 = 1 ");
    if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
      sql.append(String.format(" and vehiIdno = '%s'", new Object[] { vehiIDNO }));
    }
    if ((devIDNO != null) && (!devIDNO.isEmpty())) {
      sql.append(String.format(" and devIdno = '%s'", new Object[] { devIDNO }));
    }
    sql.append(" order by mainDev desc");
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  private StringBuffer getRelationExMoreSql(String fieldCondition, String queryCondition)
  {
    StringBuffer sql = new StringBuffer("select a.ID as id,a.VehiIDNO as vehiIdno, a.DevIDNO as devIdno, a.MainDevFlag as mainDev");
    sql.append(", a.ChnAttr as chnAttr, a.IOInAttr as ioInAttr, a.IOOutAttr as ioOutAttr, a.TempAttr as tempAttr, a.Module as module");
    if ((fieldCondition != null) && (!fieldCondition.isEmpty())) {
      sql.append(fieldCondition);
    }
    sql.append(" from jt808_vehicle_device_relation a");
    if ((queryCondition != null) && (!queryCondition.isEmpty())) {
      sql.append(queryCondition);
    } else {
      sql.append(" where 1 = 1 ");
    }
    return sql;
  }
  
  private List<QueryScalar> getStandardVehiDevRelationExQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("mainDev", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("chnAttr", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("ioInAttr", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("ioOutAttr", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("tempAttr", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("module", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  protected List<QueryScalar> getRelationExMoreScalar(List<QueryScalar> scalars)
  {
    List<QueryScalar> retScalars = getStandardVehiDevRelationExQueryScalar();
    if ((scalars != null) && (scalars.size() > 0)) {
      retScalars.addAll(scalars);
    }
    return retScalars;
  }
  
  public List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(String vehiIDNO, String devIDNO, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    StringBuffer sql = getRelationExMoreSql(fieldCondition, queryCondition);
    if ((vehiIDNO != null) && (!vehiIDNO.isEmpty())) {
      sql.append(String.format(" and a.VehiIDNO = '%s'", new Object[] { vehiIDNO }));
    }
    if ((devIDNO != null) && (!devIDNO.isEmpty())) {
      sql.append(String.format(" and a.DevIDNO = '%s'", new Object[] { devIDNO }));
    }
    sql.append(" order by a.MainDevFlag desc");
    List<QueryScalar> scalars_ = getRelationExMoreScalar(scalars);
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      for (int i = 0; i < scalars_.size(); i++) {
        query.addScalar(((QueryScalar)scalars_.get(i)).getValue(), ((QueryScalar)scalars_.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(StandardVehiDevRelationExMore.class));
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
  
  public List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> vehiIDNOs, List<String> devIDNOs, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    StringBuffer sql = getRelationExMoreSql(fieldCondition, queryCondition);
    if ((vehiIDNOs != null) && (vehiIDNOs.size() > 0))
    {
      sql.append(" and a.VehiIDNO in (?");
      int i = 1;
      for (int j = vehiIDNOs.size(); i < j; i++) {
        sql.append(",?");
      }
      sql.append(" ) ");
    }
    if ((devIDNOs != null) && (devIDNOs.size() > 0))
    {
      sql.append(" and a.DevIDNO in (?");
      int i = 1;
      for (int j = devIDNOs.size(); i < j; i++) {
        sql.append(",?");
      }
      sql.append(" ) ");
    }
    sql.append(" order by a.MainDevFlag desc");
    List<QueryScalar> scalars_ = getRelationExMoreScalar(scalars);
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      if ((vehiIDNOs != null) && (vehiIDNOs.size() > 0))
      {
        int i = 0;
        for (int j = vehiIDNOs.size(); i < j; i++) {
          query.setString(i, (String)vehiIDNOs.get(i));
        }
      }
      if ((devIDNOs != null) && (devIDNOs.size() > 0))
      {
        int index = 0;
        if ((vehiIDNOs != null) && (vehiIDNOs.size() > 0)) {
          index = vehiIDNOs.size();
        }
        int i = 0;
        for (int j = devIDNOs.size(); i < j; index++)
        {
          query.setString(index, (String)devIDNOs.get(i));i++;
        }
      }
      for (int i = 0; i < scalars_.size(); i++) {
        query.addScalar(((QueryScalar)scalars_.get(i)).getValue(), ((QueryScalar)scalars_.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(StandardVehiDevRelationExMore.class));
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
  
  public List<StandardDriver> getStandardDriver(Integer companyId, boolean isAdmin)
  {
    StringBuffer sql = new StringBuffer(" from StandardDriver ");
    if (!isAdmin) {
      sql.append(String.format(" where company.id = %d", new Object[] { companyId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardUserVehiPermitEx> getAuthorizedUserVehicleList(Integer userId, String vehiIdno, String condition)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserVehiPermitEx where 1 = 1 ");
    if (userId != null) {
      sql.append(String.format(" and userId = %d", new Object[] { userId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vehiIdno = '%s'", new Object[] { vehiIdno }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardUserVehiPermitVehicle> getAuthorizedVehicleList(Integer userId, String vehiIdno, String condition)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserVehiPermitVehicle where 1 = 1 ");
    if (userId != null) {
      sql.append(String.format(" and userId = %d", new Object[] { userId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vehicle.vehiIDNO = '%s'", new Object[] { vehiIdno }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  private StringBuffer getUserVehiRelationExMoreSql(String fieldCondition, String queryCondition)
  {
    StringBuffer sql = new StringBuffer("select a.ID as id,a.VehiIDNO as vehiIdno,a.AccountID as userId");
    if ((fieldCondition != null) && (!fieldCondition.isEmpty())) {
      sql.append(fieldCondition);
    }
    sql.append(" from jt808_user_vehicle_permit a");
    if ((queryCondition != null) && (!queryCondition.isEmpty())) {
      sql.append(queryCondition);
    } else {
      sql.append(" where 1 = 1 ");
    }
    return sql;
  }
  
  private List<QueryScalar> getStandardUserVehiPermitExQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("userId", StandardBasicTypes.INTEGER));
    return scalars;
  }
  
  protected List<QueryScalar> getUserVehiRelationExMoreScalar(List<QueryScalar> scalars)
  {
    List<QueryScalar> retScalars = getStandardUserVehiPermitExQueryScalar();
    if ((scalars != null) && (scalars.size() > 0)) {
      retScalars.addAll(scalars);
    }
    return retScalars;
  }
  
  public List<StandardUserVehiPermitExMore> getAuthorizedVehicleExMoreList(Integer userId, String vehiIdno, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    StringBuffer sql = getUserVehiRelationExMoreSql(fieldCondition, queryCondition);
    if (userId != null) {
      sql.append(String.format(" and a.AccountID = %d", new Object[] { userId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and a.VehiIDNO = '%s'", new Object[] { vehiIdno }));
    }
    List<QueryScalar> scalars_ = getUserVehiRelationExMoreScalar(scalars);
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      for (int i = 0; i < scalars_.size(); i++) {
        query.addScalar(((QueryScalar)scalars_.get(i)).getValue(), ((QueryScalar)scalars_.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(StandardUserVehiPermitExMore.class));
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
  
  public List<StandardUserVehiPermitUser> getPeimitVehicleUserList(Integer userId, String vehiIdno, String condition)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserVehiPermitUser where 1 = 1 ");
    if (userId != null) {
      sql.append(String.format(" and user.id = %d", new Object[] { userId }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vehiIdno = '%s'", new Object[] { vehiIdno }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public void changePassword(Integer id, String pwd)
  {
    Query query = getSession().createSQLQuery(String.format(" update jt808_account set Password = '%s' where ID = %d", new Object[] { pwd, id }));
    if (query == null) {
      return;
    }
    query.executeUpdate();
  }
  
  public StandardCompany getStandardCompany(String name)
  {
    Query query = getSession().createQuery(String.format(" from StandardCompany where name = '%s'", new Object[] { name }));
    if (query == null) {
      return null;
    }
    List<StandardCompany> list = query.list();
    if (list.size() > 0) {
      return (StandardCompany)list.get(0);
    }
    return null;
  }
  
  public StandardCompany getCompanyByCustomerID(String CustomerID)
  {
    Query query = getSession().createQuery(String.format(" from StandardCompany where customerID = '%s'", new Object[] { CustomerID }));
    if (query == null) {
      return null;
    }
    List<StandardCompany> list = query.list();
    if (list.size() > 0) {
      return (StandardCompany)list.get(0);
    }
    return null;
  }
  
  public MapMarker getStandardMark(String name)
  {
    Query query = getSession().createQuery(String.format(" from MapMarker where name = '%s'", new Object[] { name }));
    if (query == null) {
      return null;
    }
    List<MapMarker> list = query.list();
    if (list.size() > 0) {
      return (MapMarker)list.get(0);
    }
    return null;
  }
  
  public StandardAreaChina getStandardArea(String name, Integer parentId)
  {
    StringBuffer sql = new StringBuffer(String.format(" from StandardAreaChina where name = '%s'", new Object[] { name }));
    if (parentId != null) {
      sql.append(String.format(" and parentId = %d", new Object[] { parentId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardAreaChina> list = query.list();
    if (list.size() > 0) {
      return (StandardAreaChina)list.get(0);
    }
    return null;
  }
  
  public List<StandardAreaChina> getAreaByParentId(Integer parentId)
  {
    Query query = getSession().createQuery(String.format(" from MapMarker where parentId = %d and areaType = 1", new Object[] { parentId }));
    if (query == null) {
      return null;
    }
    List<StandardAreaChina> list = query.list();
    if (list.size() > 0) {
      return list;
    }
    return null;
  }
  
  public StandardDevice getStandardDevice(Integer id)
  {
    Query query = getSession().createQuery(String.format(" from StandardDevice where id = %d", new Object[] { id }));
    if (query == null) {
      return null;
    }
    List<StandardDevice> list = query.list();
    if (list.size() > 0) {
      return (StandardDevice)list.get(0);
    }
    return null;
  }
  
  public StandardDevice getDeviceBySim(String simCard)
  {
    Query query = getSession().createQuery(String.format(" from StandardDevice where simInfo.cardNum = '%s'", new Object[] { simCard }));
    if (query == null) {
      return null;
    }
    List<StandardDevice> list = query.list();
    if (list.size() > 0) {
      return (StandardDevice)list.get(0);
    }
    return null;
  }
  
  public StandardVehicle getStandardVehicle(Integer id)
  {
    Query query = getSession().createQuery(String.format(" from StandardVehicle where id = %d ", new Object[] { id }));
    if (query == null) {
      return null;
    }
    List<StandardVehicle> list = query.list();
    if (list.size() > 0) {
      return (StandardVehicle)list.get(0);
    }
    return null;
  }
  
  public StandardUserAccount getStandardUserAccount(String account, String name)
  {
    StringBuffer sql = new StringBuffer(" from StandardUserAccount where 1 = 1");
    boolean isParam = false;
    if ((account != null) && (!account.isEmpty()))
    {
      isParam = true;
      sql.append(String.format(" and ( account = '%s' ", new Object[] { account }));
    }
    if ((name != null) && (!name.isEmpty())) {
      sql.append(String.format(" and name = '%s' ", new Object[] { account }));
    }
    if (isParam) {
      sql.append(")");
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<StandardUserAccount> list = query.list();
    if (list.size() > 0) {
      return (StandardUserAccount)list.get(0);
    }
    return null;
  }
  
  public StandardUserRole getStandardUserRole(String name)
  {
    Query query = getSession().createQuery(String.format(" from StandardUserRole where name = '%s'", new Object[] { name }));
    if (query == null) {
      return null;
    }
    List<StandardUserRole> list = query.list();
    if (list.size() > 0) {
      return (StandardUserRole)list.get(0);
    }
    return null;
  }
  
  public StandardDriver getStandardDriver(String jobNum)
  {
    Query query = getSession().createQuery(String.format(" from StandardDriver where jobNum = '%s'", new Object[] { jobNum }));
    if (query == null) {
      return null;
    }
    List<StandardDriver> list = query.list();
    if (list.size() > 0) {
      return (StandardDriver)list.get(0);
    }
    return null;
  }
  
  public StandardSIMCardInfo getStandardSIMCardInfo(Integer id)
  {
    Query query = getSession().createQuery(String.format(" from StandardSIMCardInfo where id = %d", new Object[] { id }));
    if (query == null) {
      return null;
    }
    List<StandardSIMCardInfo> list = query.list();
    if (list.size() > 0) {
      return (StandardSIMCardInfo)list.get(0);
    }
    return null;
  }
  
  public void editUserVehiPermitEx(final List<StandardUserVehiPermitEx> addPermits, final List<StandardUserVehiPermitEx> delPermits)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if ((delPermits != null) && (delPermits.size() > 0)) {
          for (int i = 0; i < delPermits.size(); i++) {
            session.delete(delPermits.get(i));
          }
        }
        if ((addPermits != null) && (addPermits.size() > 0)) {
          for (int i = 0; i < addPermits.size(); i++) {
            session.save(addPermits.get(i));
          }
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void mergeVehicle(final List<StandardVehiDevRelation> addRelations, final List<StandardVehiDevRelation> delRelations, final List<StandardSIMCardInfo> delSimInfos, final List<StandardDevice> delDevices)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (delSimInfos != null) {
          for (int i = 0; i < delSimInfos.size(); i++)
          {
            StandardSIMCardInfo simInfo = (StandardSIMCardInfo)delSimInfos.get(i);
            simInfo.setInstall(Integer.valueOf(0));
            session.update(simInfo);
          }
        }
        if (delDevices != null) {
          for (int i = 0; i < delDevices.size(); i++)
          {
            StandardDevice device = (StandardDevice)delDevices.get(i);
            device.setSimInfo(null);
            device.setInstall(Integer.valueOf(0));
            device.setStlTm(null);
            session.update(device);
          }
        }
        if (delRelations != null) {
          for (int i = 0; i < delRelations.size(); i++) {
            session.delete(delRelations.get(i));
          }
        }
        for (int i = 0; i < addRelations.size(); i++)
        {
          StandardVehiDevRelation relation = (StandardVehiDevRelation)addRelations.get(i);
          StandardSIMCardInfo simInfo = ((StandardVehiDevRelation)addRelations.get(i)).getDevice().getSimInfo();
          if (simInfo != null) {
            simInfo = (StandardSIMCardInfo)session.merge(simInfo);
          }
          StandardDevice device = ((StandardVehiDevRelation)addRelations.get(i)).getDevice();
          device.setSimInfo(simInfo);
          device = (StandardDevice)session.merge(device);
          relation.setDevice(device);
          session.merge(relation);
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void deleteVehicle(final List<StandardStorageRelation> storageRelations, final List<StandardVehiDevRelation> deRelations, final List<StandardVehiRule> delRulePermits, final StandardVehicle vehicle, final boolean deldev)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (storageRelations != null) {
          for (int i = 0; i < storageRelations.size(); i++) {
            session.delete(storageRelations.get(i));
          }
        }
        for (int i = 0; i < deRelations.size(); i++)
        {
          StandardDevice device = ((StandardVehiDevRelation)deRelations.get(i)).getDevice();
          session.delete(deRelations.get(i));
          if (device != null)
          {
            StandardSIMCardInfo simInfo = device.getSimInfo();
            if (simInfo != null)
            {
              simInfo.setInstall(Integer.valueOf(0));
              session.update(simInfo);
            }
            if (deldev)
            {
              session.delete(device);
            }
            else
            {
              device.setSimInfo(null);
              device.setInstall(Integer.valueOf(0));
              device.setStlTm(null);
              session.update(device);
            }
          }
        }
        if (delRulePermits != null) {
          for (int i = 0; i < delRulePermits.size(); i++) {
            session.delete(delRulePermits.get(i));
          }
        }
        session.delete(vehicle);
        tx.commit();
        return null;
      }
    });
  }
  
  public void deleteVehicleAndDevice(final List<StandardStorageRelation> storageRelations, final List<StandardVehiDevRelation> deRelations, final List<StandardVehiRule> delRulePermits, final StandardVehicle vehicle)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (storageRelations != null) {
          for (int i = 0; i < storageRelations.size(); i++) {
            session.delete(storageRelations.get(i));
          }
        }
        for (int i = 0; i < deRelations.size(); i++)
        {
          StandardDevice device = ((StandardVehiDevRelation)deRelations.get(i)).getDevice();
          session.delete(deRelations.get(i));
          if (device != null)
          {
            StandardSIMCardInfo simInfo = device.getSimInfo();
            if (simInfo != null)
            {
              simInfo.setInstall(Integer.valueOf(0));
              session.update(simInfo);
            }
            session.delete(device);
          }
        }
        if (delRulePermits != null) {
          for (int i = 0; i < delRulePermits.size(); i++) {
            session.delete(delRulePermits.get(i));
          }
        }
        session.delete(vehicle);
        tx.commit();
        return null;
      }
    });
  }
  
  public void deleteDevice(final StandardDevice device)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        
        StandardSIMCardInfo simInfo = device.getSimInfo();
        if (simInfo != null)
        {
          simInfo.setInstall(Integer.valueOf(0));
          session.update(simInfo);
        }
        session.delete(device);
        tx.commit();
        return null;
      }
    });
  }
  
  public void updateVehicle(final List<StandardVehicle> vehicleList, final List<StandardUserVehiPermitEx> delPermits, final List<StandardVehiRule> delRulePermits)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (delRulePermits != null) {
          for (int i = 0; i < delRulePermits.size(); i++) {
            session.delete(delRulePermits.get(i));
          }
        }
        if (delPermits != null) {
          for (int i = 0; i < delPermits.size(); i++) {
            session.delete(delPermits.get(i));
          }
        }
        for (int i = 0; i < vehicleList.size(); i++)
        {
          StandardVehicle vehicle = (StandardVehicle)vehicleList.get(i);
          session.update(vehicle);
          StandardCompany company = vehicle.getCompany();
          if ((company.getLevel() != null) && (company.getLevel().intValue() == 2)) {
            company = (StandardCompany)StandardUserAccountDaoHibernate.this.getHibernateTemplate().get(StandardCompany.class, company.getCompanyId());
          }
          List<StandardVehiDevRelation> relations = StandardUserAccountDaoHibernate.this.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
          if (relations != null) {
            for (StandardVehiDevRelation relation : relations)
            {
              StandardDevice device = relation.getDevice();
              device.setCompany(company);
              if (device.getSimInfo() != null)
              {
                StandardSIMCardInfo sim = device.getSimInfo();
                sim.setCompany(company);
                session.update(sim);
              }
              session.update(device);
            }
          }
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public List<StandardVehicle> getVehicleList(Integer companyId)
  {
    Query query = getSession().createQuery(String.format(" from StandardVehicle where company.id = %d", new Object[] { companyId }));
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  private List<QueryScalar> getVehicleLiteExQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("nm", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pid", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("pnm", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("ic", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("dn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dt", StandardBasicTypes.STRING));
    return scalars;
  }
  
  private StringBuffer getVehicleLiteExQueryStringBuffer()
  {
    StringBuffer sql = new StringBuffer();
    sql.append("select a.VehiIDNO as nm,a.CompanyID as pid,b.Name as pnm,");
    sql.append("a.Icon as ic,c.Name as dn,c.JobNum as dt from");
    sql.append(" jt808_vehicle_info a left join jt808_driver_info c on a.DriverId = c.ID,");
    sql.append("jt808_company_info b where a.CompanyID = b.ID ");
    return sql;
  }
  
  public List<VehicleLiteEx> getVehicleList(String[] vehiIdnos)
  {
    StringBuffer sql = getVehicleLiteExQueryStringBuffer();
    if ((vehiIdnos != null) && (vehiIdnos.length > 0))
    {
      sql.append(" and a.VehiIDNO in (?");
      int i = 1;
      for (int j = vehiIdnos.length; i < j; i++) {
        sql.append(",?");
      }
      sql.append(" ) ");
    }
    List<QueryScalar> scalars_ = getVehicleLiteExQueryScalar();
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      if ((vehiIdnos != null) && (vehiIdnos.length > 0))
      {
        int i = 0;
        for (int j = vehiIdnos.length; i < j; i++) {
          query.setString(i, vehiIdnos[i]);
        }
      }
      for (int i = 0; i < scalars_.size(); i++) {
        query.addScalar(((QueryScalar)scalars_.get(i)).getValue(), ((QueryScalar)scalars_.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(VehicleLiteEx.class));
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
  
  public void updateDevice(final StandardDevice device, final StandardSIMCardInfo simInfo, final StandardSIMCardInfo delSimInfo)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (delSimInfo != null)
        {
          delSimInfo.setInstall(Integer.valueOf(0));
          session.update(delSimInfo);
        }
        if (simInfo != null) {
          session.merge(simInfo);
        }
        if (device != null) {
          session.merge(device);
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void deleteServer(final ServerInfo server, final List<StandardStorageRelation> delRelations)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (server != null) {
          session.delete(server);
        }
        if ((delRelations != null) && (delRelations.size() > 0)) {
          for (int i = 0; i < delRelations.size(); i++) {
            session.delete(delRelations.get(i));
          }
        }
        tx.commit();
        return null;
      }
    });
  }
  
  public void updateVehicle(int vehiId, String vehiIdno)
  {
    Query query = getSession().createSQLQuery(String.format(" update jt808_vehicle_info set VehiIDNO = '%s' where ID = %d", new Object[] { vehiIdno, Integer.valueOf(vehiId) }));
    query.executeUpdate();
  }
  
  public List<StandardCompanyRelation> getCompanyRelation(Integer companyId, Integer childId)
  {
    StringBuffer sql = new StringBuffer(" from StandardCompanyRelation where 1 = 1");
    if (companyId != null) {
      sql.append(String.format(" and companyId = %d", new Object[] { companyId }));
    }
    if (childId != null) {
      sql.append(String.format(" and childId = %d", new Object[] { childId }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public List<StandardCompany> getCompanyTeamList(Integer companyId)
  {
    String sql = " from StandardCompany where level = 2";
    if (companyId != null) {
      sql = sql + String.format(" and companyId = %d", new Object[] { companyId });
    }
    Query query = getSession().createQuery(sql);
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public StandardDeviceOflTask findDeviceOflTask(String devIdno, Integer fileType)
  {
    List<StandardDeviceOflTask> tasks = getHibernateTemplate().find(String.format("from StandardDeviceOflTask where devIdno = '%s' and ft = %d", new Object[] { devIdno, fileType }));
    if ((tasks != null) && (tasks.size() > 0)) {
      return (StandardDeviceOflTask)tasks.get(0);
    }
    return null;
  }
  
  public StandardDeviceYouLiang findDeviceYouLiang(String devIdno)
  {
    List<StandardDeviceYouLiang> youLiangs = getHibernateTemplate().find(String.format("from StandardDeviceYouLiang where devIdno = '%s'", new Object[] { devIdno }));
    if ((youLiangs != null) && (youLiangs.size() > 0)) {
      return (StandardDeviceYouLiang)youLiangs.get(0);
    }
    return null;
  }
  
  public void delStorageRelation(final StandardStorageRelation Relation, final Integer ruleType)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        if (Relation != null)
        {
          String sql = "delete A from jt808_vehicle_rule A,jt808_rule_maintain B where A.VehiIDNO = ? and ";
          sql = sql + " A.ruleID = B.ID and B.Type = ?";
          Query query = session.createSQLQuery(sql);
          if (query != null)
          {
            query.setString(0, Relation.getVehiIdno());
            query.setInteger(1, ruleType.intValue());
            query.executeUpdate();
          }
          session.delete(Relation);
        }
        tx.commit();
        return null;
      }
    });
  }
  
  private List<QueryScalar> getStandardVehicleSafeQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("id", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("safeCom", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("agent", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("telephone", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("startTime", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("endTime", StandardBasicTypes.DATE));
    scalars.add(new QueryScalar("count", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("price", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("discount", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("actualPrice", StandardBasicTypes.DOUBLE));
    scalars.add(new QueryScalar("remark", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("updateTime", StandardBasicTypes.DATE));
    return scalars;
  }
  
  public List<StandardVehicleSafe> getAllVehicleSafes(List<String> lstVehiIdno)
  {
    StringBuffer sql = new StringBuffer("select a.ID as id,a.VehiIDNO as vehiIdno,a.SafeCom as safeCom,");
    sql.append("a.Agent as agent,a.Telephone as telephone,a.StartTime as startTime,a.EndTime as endTime,");
    sql.append("a.Count as count,a.Price as price,a.Discount as discount,a.ActualPrice as actualPrice,");
    sql.append("a.Remark as remark,a.UpdateTime as updateTime");
    sql.append(",b.PlateType as plateType,b.CompanyID as companyId");
    sql.append(" from jt808_vehicle_safe a,jt808_vehicle_info b where a.VehiIDNO = b.VehiIDNO ");
    if ((lstVehiIdno != null) && (lstVehiIdno.size() > 0))
    {
      sql.append(" and a.VehiIDNO in (?");
      int i = 1;
      for (int j = lstVehiIdno.size(); i < j; i++) {
        sql.append(",?");
      }
      sql.append(" ) ");
    }
    List<QueryScalar> scalars_ = getStandardVehicleSafeQueryScalar();
    scalars_.add(new QueryScalar("plateType", StandardBasicTypes.INTEGER));
    scalars_.add(new QueryScalar("companyId", StandardBasicTypes.INTEGER));
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(sql.toString());
      if ((lstVehiIdno != null) && (lstVehiIdno.size() > 0))
      {
        int i = 0;
        for (int j = lstVehiIdno.size(); i < j; i++) {
          query.setString(i, (String)lstVehiIdno.get(i));
        }
      }
      for (int i = 0; i < scalars_.size(); i++) {
        query.addScalar(((QueryScalar)scalars_.get(i)).getValue(), ((QueryScalar)scalars_.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(StandardVehicleSafe.class));
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
  
  public List<String> getStandardVehiIdnoList(List<Integer> lstId, String condition)
  {
    StringBuffer sql = new StringBuffer("select VehiIDNO from jt808_vehicle_info where 1 = 1 ");
    if ((lstId != null) && (lstId.size() > 0))
    {
      sql.append(String.format(" and (  CompanyID = %d", new Object[] { lstId.get(0) }));
      for (int i = 1; i < lstId.size(); i++) {
        sql.append(String.format(" or CompanyID = %d", new Object[] { lstId.get(i) }));
      }
      sql.append(" ) ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    Query query = getSession().createSQLQuery(sql.toString());
    if (query == null) {
      return null;
    }
    return query.list();
  }
  
  public StandardDeviceTirepressureStatus findTirepressureStatus(String devIdno, Integer type)
  {
    List<StandardDeviceTirepressureStatus> status = getHibernateTemplate().find(String.format("from StandardDeviceTirepressureStatus where devIdno = '%s' and type = %d", new Object[] { devIdno, type }));
    if ((status != null) && (status.size() > 0)) {
      return (StandardDeviceTirepressureStatus)status.get(0);
    }
    return null;
  }
}
