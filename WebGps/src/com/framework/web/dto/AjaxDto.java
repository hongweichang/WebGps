package com.framework.web.dto;

import java.util.List;

public class AjaxDto<T>
{
  private List<T> pageList;
  private Pagination pagination;
  
  public List<T> getPageList()
  {
    return this.pageList;
  }
  
  public void setPageList(List<T> pageList)
  {
    this.pageList = pageList;
  }
  
  public Pagination getPagination()
  {
    return this.pagination;
  }
  
  public void setPagination(Pagination pagination)
  {
    this.pagination = pagination;
  }
}
