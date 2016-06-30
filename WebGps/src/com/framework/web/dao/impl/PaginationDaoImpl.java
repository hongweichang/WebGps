package com.framework.web.dao.impl;

import com.framework.web.dao.HibernatePaginationCallback;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import java.util.List;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public class PaginationDaoImpl
  extends HibernateDaoSupport
  implements PaginationDao
{
  public Integer getCountByQueryStr(String queryString)
  {
    HibernateCallback action = new HibernatePaginationCallback(queryString, true);
    return (Integer)getHibernateTemplate().execute(action);
  }
  
  public AjaxDto getPgntByQueryStr(String queryString, Pagination pagination)
  {
    AjaxDto ajaxDto = null;
    HibernateCallback action = new HibernatePaginationCallback(queryString, pagination);
    ajaxDto = (AjaxDto)getHibernateTemplate().execute(action);
    return ajaxDto;
  }
  
  public AjaxDto getPgntByQueryStrEx(String queryString, Pagination pagination, String countString)
  {
    AjaxDto ajaxDto = null;
    HibernateCallback action = new HibernatePaginationCallback(queryString, pagination, countString);
    ajaxDto = (AjaxDto)getHibernateTemplate().execute(action);
    return ajaxDto;
  }
  
  public Integer getCountByNativeSql(String queryString)
  {
    HibernateCallback action = new HibernatePaginationCallback(queryString, true, true);
    return (Integer)getHibernateTemplate().execute(action);
  }
  
  public List getExtraByNativeSql(String queryString, List<QueryScalar> scalars, Class target)
  {
    Session session = getHibernateTemplate().getSessionFactory().openSession();
    SQLQuery query = null;
    try
    {
      query = session.createSQLQuery(queryString);
      for (int i = 0; i < scalars.size(); i++) {
        query.addScalar(((QueryScalar)scalars.get(i)).getValue(), ((QueryScalar)scalars.get(i)).getType());
      }
      query.setResultTransformer(Transformers.aliasToBean(target));
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
  public AjaxDto getExtraByNativeSqlEx(String queryString, Pagination pagination, List<QueryScalar> scalars, Class target, String countString)
  {
    AjaxDto ajaxDto = null;
    HibernateCallback action = new HibernatePaginationCallback(queryString, pagination, scalars, target, countString);
    ajaxDto = (AjaxDto)getHibernateTemplate().execute(action);
    return ajaxDto;
  }
  
  public AjaxDto getExtraByNativeEx(String queryString, Pagination pagination, List<QueryScalar> scalars, Class target)
  {
    AjaxDto ajaxDto = null;
    HibernateCallback action = new HibernatePaginationCallback(queryString, pagination, scalars, target);
    ajaxDto = (AjaxDto)getHibernateTemplate().execute(action);
    return ajaxDto;
  }
  
  /* Error */
  public void execNativeSql(String queryString)
  {
    // Byte code:
    //   0: iconst_0
    //   1: istore_2
    //   2: aload_0
    //   3: invokevirtual 23	com/framework/web/dao/impl/PaginationDaoImpl:getHibernateTemplate	()Lorg/springframework/orm/hibernate3/HibernateTemplate;
    //   6: invokevirtual 64	org/springframework/orm/hibernate3/HibernateTemplate:getSessionFactory	()Lorg/hibernate/SessionFactory;
    //   9: invokeinterface 68 1 0
    //   14: astore_3
    //   15: aload_3
    //   16: aload_1
    //   17: invokeinterface 74 2 0
    //   22: invokeinterface 161 1 0
    //   27: pop
    //   28: iconst_1
    //   29: istore_2
    //   30: goto +20 -> 50
    //   33: astore 4
    //   35: aload 4
    //   37: athrow
    //   38: astore 5
    //   40: aload_3
    //   41: invokeinterface 120 1 0
    //   46: pop
    //   47: aload 5
    //   49: athrow
    //   50: aload_3
    //   51: invokeinterface 120 1 0
    //   56: pop
    //   57: iload_2
    //   58: ireturn
    // Line number table:
    //   Java source line #130	-> byte code offset #0
    //   Java source line #131	-> byte code offset #2
    //   Java source line #133	-> byte code offset #15
    //   Java source line #134	-> byte code offset #28
    //   Java source line #135	-> byte code offset #30
    //   Java source line #136	-> byte code offset #35
    //   Java source line #137	-> byte code offset #38
    //   Java source line #138	-> byte code offset #40
    //   Java source line #139	-> byte code offset #47
    //   Java source line #138	-> byte code offset #50
    //   Java source line #140	-> byte code offset #57
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	59	0	this	PaginationDaoImpl
    //   0	59	1	queryString	String
    //   1	57	2	ret	boolean
    //   14	37	3	session	Session
    //   33	3	4	re	RuntimeException
    //   38	10	5	localObject	Object
    // Exception table:
    //   from	to	target	type
    //   15	30	33	java/lang/RuntimeException
    //   15	38	38	finally
  }
}
