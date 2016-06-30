package com.framework.web.dao;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.HibernateException;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

public class HibernateNativeSQLPgntCallback
  implements HibernateCallback<Object>
{
  private String nativeSQL = null;
  private Pagination pagination = null;
  private Map<String, Class> entityClasses = null;
  private Map condition = null;
  
  public HibernateNativeSQLPgntCallback(String nativeSQL, Pagination pagination)
  {
    this(nativeSQL, pagination, null, null);
  }
  
  public HibernateNativeSQLPgntCallback(String nativeSQL, Pagination pagination, Map<String, Class> entityClasses, Map condition)
  {
    this.nativeSQL = nativeSQL;
    this.pagination = pagination;
    this.entityClasses = entityClasses;
    this.condition = condition;
  }
  
  public Object doInHibernate(Session session)
    throws HibernateException, SQLException
  {
    AjaxDto ajaxDto = new AjaxDto();
    ajaxDto.setPagination(this.pagination);
    SQLQuery countSQLQuery = 
      session.createSQLQuery(getCountSQLBySQL(getNativeSQL()));
    setSQLQueryCondition(countSQLQuery);
    int totalRows = ((Long)countSQLQuery.uniqueResult()).intValue();
    this.pagination.setTotalRecords(totalRows);
    this.pagination = new Pagination(this.pagination.getPageRecords(), this.pagination.getCurrentPage(), this.pagination.getTotalRecords(), this.pagination.getSortParams());
    ajaxDto.setPagination(this.pagination);
    if (totalRows > 0)
    {
      SQLQuery query = session.createSQLQuery(this.nativeSQL);
      setSQLQueryCondition(query);
      setQueryEntityClasses(query);
      query.setFirstResult(this.pagination.getPageRecords() * (this.pagination.getCurrentPage() - 1));
      query.setMaxResults(this.pagination.getPageRecords());
      List results = query.list();
      ajaxDto.setPageList(results);
    }
    return ajaxDto;
  }
  
  public String getNativeSQL()
  {
    return this.nativeSQL;
  }
  
  public void setNativeSQL(String nativeSQL)
  {
    this.nativeSQL = nativeSQL;
  }
  
  public static String getCountSQLBySQL(String sql)
  {
    if ((sql == null) || ("".equals(sql))) {
      return null;
    }
    String countSQL = null;
    String tempSQL = sql.toLowerCase();
    if (tempSQL.indexOf(" from ") != -1) {
      countSQL = "select count(*) " + sql.substring(tempSQL.indexOf(" from "), sql.length());
    }
    return countSQL;
  }
  
  public Map<String, Class> getEntityClasses()
  {
    return this.entityClasses;
  }
  
  public void setEntityClasses(Map<String, Class> entityClasses)
  {
    this.entityClasses = entityClasses;
  }
  
  public Pagination getPagination()
  {
    return this.pagination;
  }
  
  public void setPagination(Pagination pagination)
  {
    this.pagination = pagination;
  }
  
  public Map getCondition()
  {
    return this.condition;
  }
  
  public void setCondition(Map condition)
  {
    this.condition = condition;
  }
  
  private void setSQLQueryCondition(SQLQuery sqlQuery)
  {
    if (this.condition != null) {
      sqlQuery.setProperties(this.condition);
    }
  }
  
  private void setQueryEntityClasses(SQLQuery sqlQuery)
  {
    if ((this.entityClasses != null) && (this.entityClasses.size() > 0))
    {
      Set<String> keySet = this.entityClasses.keySet();
      for (String key : keySet) {
        sqlQuery.addEntity(key, (Class)this.entityClasses.get(key));
      }
    }
  }
}
