package com.gps.report.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.model.DispatchCommand;
import com.gps.report.service.DispatchCommandService;

public class DispatchCommandServiceImpl
  extends UniversalServiceImpl
  implements DispatchCommandService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DispatchCommand.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected String getTableColumn(String qtype)
  {
    String column = "";
    if ((qtype != null) && (!qtype.isEmpty())) {
      if ("devIdno".equals(qtype)) {
        column = "DevIdno";
      } else {
        column = qtype;
      }
    }
    return column;
  }
  
  private String getQueryString(String dateB, String dateE, String[] devIdno, String status, String queryFilter, String qtype, String sortname, String sortorder)
  {
    StringBuffer strQuery = new StringBuffer("from DispatchCommand ");
    strQuery.append(String.format("where dtime BETWEEN '%s' and '%s' ", new Object[] { dateB, dateE }));
    appendDeviceCondition(strQuery, devIdno);
    if (status != null) {
      strQuery.append(String.format("status = %s ", new Object[] { status }));
    }
    String column = getTableColumn(qtype);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    sortname = getTableColumn(sortname);
    if (!sortname.isEmpty()) {
      strQuery.append(" order by " + sortname + " " + sortorder);
    }
    return strQuery.toString();
  }
  
  public AjaxDto<DispatchCommand> queryDispatchCommand(String dateB, String dateE, String[] devIdno, String status, Pagination pagination, String queryFilter, String qtype, String sortname, String sortorder)
  {
    String str = getQueryString(dateB, dateE, devIdno, status, queryFilter, qtype, sortname, sortorder);
    return this.paginationDao.getPgntByQueryStr(str, pagination);
  }
}
