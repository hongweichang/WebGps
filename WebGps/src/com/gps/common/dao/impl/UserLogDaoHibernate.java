package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.framework.web.dto.QueryScalar;
import com.gps.common.dao.UserLogDao;
import com.gps.model.LiveVideoSession;
import com.gps.model.UserLog;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
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

public class UserLogDaoHibernate
  extends HibernateDaoSupportEx
  implements UserLogDao
{
  public void addUserLog(final Integer userId, final Integer mainType, final Integer subType, final String devIDNO, final String param1, final String param2, final String param3, final String param4)
  {
    getHibernateTemplate().execute(new HibernateCallback()
    {
      public Object doInHibernate(Session session)
        throws HibernateException, SQLException
      {
        Transaction tx = session.beginTransaction();
        PreparedStatement st = session.connection().prepareCall("{call Proc_UsrLog_Add(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
        if (userId != null) {
          st.setInt(1, userId.intValue());
        } else {
          st.setInt(1, 0);
        }
        st.setInt(2, mainType.intValue());
        st.setInt(3, subType.intValue());
        if (devIDNO != null) {
          st.setString(4, devIDNO);
        } else {
          st.setString(4, "");
        }
        if (param1 != null) {
          st.setString(5, param1);
        } else {
          st.setString(5, "");
        }
        if (param2 != null) {
          st.setString(6, param2);
        } else {
          st.setString(6, "");
        }
        if (param3 != null) {
          st.setString(7, param3);
        } else {
          st.setString(7, "");
        }
        if (param4 != null) {
          st.setString(8, param4);
        } else {
          st.setString(8, "");
        }
        Timestamp tstamp = new Timestamp(new Date().getTime());
        st.setTimestamp(9, tstamp);
        st.execute();
        tx.commit();
        return null;
      }
    });
  }
  
  public UserLog getUserLoginLog(Integer userId, Integer mainType, Integer subType, String devIdno, String param3)
  {
    StringBuffer sql = new StringBuffer(" from UserLog where 1 = 1");
    if (userId != null) {
      sql.append(String.format(" and userId = %d ", new Object[] { userId }));
    }
    if (mainType != null) {
      sql.append(String.format(" and mainType = %d ", new Object[] { mainType }));
    }
    if (mainType != null) {
      sql.append(String.format(" and subType = %d ", new Object[] { subType }));
    }
    if (devIdno != null) {
      sql.append(String.format(" and devIdno = '%s' ", new Object[] { devIdno }));
    }
    if (param3 != null) {
      sql.append(String.format(" and param3 = '%s' ", new Object[] { param3 }));
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    List<UserLog> list = query.list();
    if (list.size() > 0) {
      return (UserLog)list.get(0);
    }
    return null;
  }
  
  public void updateUserLoginLog(Integer id, String param4)
  {
    Query query = getSession().createSQLQuery("update user_log set Param4 = ? where ID = ?");
    if (query == null) {
      return;
    }
    query.setString(0, param4);
    query.setInteger(1, id.intValue());
    
    query.executeUpdate();
  }
  
  public LiveVideoSession findLiveVideoSession(Integer userid, String randParam)
  {
    StringBuffer sql = new StringBuffer(" from LiveVideoSession where status = 0 and userid = ?");
    if ((randParam != null) && (!randParam.isEmpty())) {
      sql.append(" and randParam = ? ");
    }
    Query query = getSession().createQuery(sql.toString());
    if (query == null) {
      return null;
    }
    query.setInteger(0, userid.intValue());
    if ((randParam != null) && (!randParam.isEmpty())) {
      query.setString(1, randParam);
    }
    List<LiveVideoSession> list = query.list();
    if (list.size() > 0) {
      return (LiveVideoSession)list.get(0);
    }
    return null;
  }
  
  public LiveVideoSession findLiveVideoSessionById(Integer id)
  {
    return 
      (LiveVideoSession)getHibernateTemplate().get(LiveVideoSession.class, id);
  }
  
  public void deleteAllLive()
  {
    try
    {
      Query query = getSession().createSQLQuery("delete from live_video_session where status = 0 or status is null");
      if (query != null) {
        query.executeUpdate();
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
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
  
  public Integer getCompanyRelationCount(Integer companyId, Integer childId)
  {
    StringBuffer sql = new StringBuffer("select count(*) from jt808_company_relation where 1 = 1");
    if (companyId != null) {
      sql.append(String.format(" and CompanyID = %d", new Object[] { companyId }));
    }
    if (childId != null) {
      sql.append(String.format(" and ChildId = %d", new Object[] { childId }));
    }
    Query query = getSession().createSQLQuery(sql.toString());
    if (query == null) {
      return null;
    }
    Object result = query.uniqueResult();
    if (result != null) {
      return Integer.valueOf(Integer.parseInt(result.toString()));
    }
    return null;
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
  
  public List<StandardUserVehiPermitEx> getAuthorizedVehicleList(Integer userId, String vehiIdno, String condition)
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
}
