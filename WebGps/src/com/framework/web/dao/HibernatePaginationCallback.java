package com.framework.web.dao;

import com.framework.utils.AssertUtils;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateCallback;

public class HibernatePaginationCallback
  implements HibernateCallback<Object>
{
  private String hql = null;
  private String countHql = null;
  private Pagination pagination = null;
  private boolean queryTotalCount = false;
  private boolean isNativeSql = false;
  private List<QueryScalar> scalars = null;
  private Class target = null;
  
  public HibernatePaginationCallback(String hql, Pagination pagination)
  {
    this.hql = hql;
    this.pagination = pagination;
  }
  
  public HibernatePaginationCallback(String hql, boolean queryTotalCount)
  {
    this.hql = hql;
    this.queryTotalCount = queryTotalCount;
  }
  
  public HibernatePaginationCallback(String hql, boolean queryTotalCount, boolean isNativeSql)
  {
    this.hql = hql;
    this.queryTotalCount = queryTotalCount;
    this.isNativeSql = isNativeSql;
  }
  
  public HibernatePaginationCallback(String hql, Pagination pagination, String countHql)
  {
    this.hql = hql;
    this.pagination = pagination;
    this.countHql = countHql;
  }
  
  public HibernatePaginationCallback(String hql, Pagination pagination, List<QueryScalar> scalars, Class target)
  {
    this.hql = hql;
    this.pagination = pagination;
    this.scalars = scalars;
    this.target = target;
  }
  
  public HibernatePaginationCallback(String hql, Pagination pagination, List<QueryScalar> scalars, Class target, String countHql)
  {
    this.hql = hql;
    this.pagination = pagination;
    this.scalars = scalars;
    this.target = target;
    this.countHql = countHql;
  }
  
  protected int getRowsCount(Query countQuery)
  {
    int totalRows = 0;
    if (countQuery.uniqueResult() != null)
    {
      Object result = countQuery.uniqueResult();
      if ((result instanceof BigInteger)) {
        totalRows = ((BigInteger)result).intValue();
      } else if ((result instanceof Long)) {
        totalRows = ((Long)result).intValue();
      } else if ((result instanceof Integer)) {
        totalRows = ((Integer)result).intValue();
      } else {
        totalRows = 0;
      }
    }
    return totalRows;
  }
  
  public Object doInHibernate(Session session)
    throws HibernateException, SQLException
  {
    if (this.queryTotalCount)
    {
      Query countQuery = null;
      if (!this.isNativeSql) {
        countQuery = session.createQuery(getCountHqlByHql(this.hql));
      } else {
        countQuery = session.createSQLQuery(getCountHqlByHql(this.hql));
      }
      int totalRows = getRowsCount(countQuery);
      return new Integer(totalRows);
    }
    AjaxDto ajaxDto = new AjaxDto();
    if (this.pagination == null)
    {
      if (this.scalars == null)
      {
        Query query = session.createQuery(this.hql);
        List results = query.list();
        ajaxDto.setPageList(results);
      }
      else
      {
        SQLQuery query = session.createSQLQuery(this.hql);
        for (int i = 0; i < this.scalars.size(); i++) {
          query.addScalar(((QueryScalar)this.scalars.get(i)).getValue(), ((QueryScalar)this.scalars.get(i)).getType());
        }
        query.setResultTransformer(Transformers.aliasToBean(this.target));
        List results = query.list();
        ajaxDto.setPageList(results);
      }
      return ajaxDto;
    }
    Query countQuery = null;
    int totalRows = 0;
    if (this.countHql != null)
    {
      if (this.scalars == null) {
        countQuery = session.createQuery(this.countHql);
      } else {
        countQuery = session.createSQLQuery(this.countHql);
      }
    }
    else if (this.scalars == null) {
      countQuery = session.createQuery(getCountHqlByHql(this.hql));
    } else {
      countQuery = session.createSQLQuery(getCountHqlByHql(this.hql));
    }
    totalRows = getRowsCount(countQuery);
    if (countQuery.uniqueResult() != null)
    {
      Object result = countQuery.uniqueResult();
      if ((result instanceof BigInteger)) {
        totalRows = ((BigInteger)result).intValue();
      } else if ((result instanceof Long)) {
        totalRows = ((Long)result).intValue();
      } else if ((result instanceof Integer)) {
        totalRows = ((Integer)result).intValue();
      } else {
        totalRows = 0;
      }
    }
    this.pagination.setTotalRecords(totalRows);
    int totalpage = totalRows / this.pagination.getPageRecords();
    if (totalRows % this.pagination.getPageRecords() > 0) {
      totalpage++;
    }
    if ((this.pagination.getCurrentPage() > totalpage) || (this.pagination.getCurrentPage() < 1)) {
      this.pagination.setCurrentPage(totalpage);
    }
    this.pagination = new Pagination(this.pagination.getPageRecords(), this.pagination.getCurrentPage(), this.pagination.getTotalRecords(), this.pagination.getSortParams());
    ajaxDto.setPagination(this.pagination);
    if (totalRows > 0) {
      if (this.scalars == null)
      {
        this.hql = getSortHql(this.hql);
        Query query = session.createQuery(this.hql);
        query.setFirstResult(this.pagination.getPageRecords() * (this.pagination.getCurrentPage() - 1));
        query.setMaxResults(this.pagination.getPageRecords());
        List results = query.list();
        ajaxDto.setPageList(results);
      }
      else
      {
        SQLQuery query = session.createSQLQuery(this.hql);
        query.setFirstResult(this.pagination.getPageRecords() * (this.pagination.getCurrentPage() - 1));
        query.setMaxResults(this.pagination.getPageRecords());
        for (int i = 0; i < this.scalars.size(); i++) {
          query.addScalar(((QueryScalar)this.scalars.get(i)).getValue(), ((QueryScalar)this.scalars.get(i)).getType());
        }
        query.setResultTransformer(Transformers.aliasToBean(this.target));
        List results = query.list();
        ajaxDto.setPageList(results);
      }
    }
    return ajaxDto;
  }
  
  private String getSortHql(String hql)
  {
    if (AssertUtils.isNoNull(this.pagination.getSortParams()))
    {
      HashMap<String, String> sort = this.pagination.getSortParams();
      if (sort.size() > 0)
      {
        Set<String> keys = sort.keySet();
        StringBuffer sortBuffer = new StringBuffer();
        sortBuffer.append(" order by ");
        if (hql.indexOf("order by") > 0) {
          hql = hql.substring(0, hql.lastIndexOf("order by"));
        }
        for (String key : keys)
        {
          sortBuffer.append((String)sort.get(key));
          sortBuffer.append(" ");
        }
        hql = hql + sortBuffer.toString();
      }
    }
    return hql;
  }
  
  public String getHql()
  {
    return this.hql;
  }
  
  public void setHql(String hql)
  {
    this.hql = hql;
  }
  
  public String getCountHql()
  {
    return this.countHql;
  }
  
  public void setCountHql(String countHql)
  {
    this.countHql = countHql;
  }
  
  public Pagination getPagination()
  {
    return this.pagination;
  }
  
  public void setPagination(Pagination pagination)
  {
    this.pagination = pagination;
  }
  
  protected String getCountHqlByHql(String hql)
  {
    if ((hql == null) || ("".equals(hql))) {
      return null;
    }
    String countHqlRet = null;
    String tempHql = hql.toLowerCase();
    if (tempHql.indexOf("from ") != -1) {
      countHqlRet = "select count(*) " + hql.substring(tempHql.indexOf("from "), hql.length());
    } else {
      countHqlRet = "select count(*) " + hql;
    }
    if ((BaseAction.getEnableSqlServer()) && 
      (countHqlRet.indexOf("order ") != -1)) {
      countHqlRet = countHqlRet.substring(0, countHqlRet.indexOf("order "));
    }
    return countHqlRet;
  }
}
