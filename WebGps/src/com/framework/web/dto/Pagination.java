package com.framework.web.dto;

import java.util.HashMap;

public class Pagination
{
  private int currentPage = 1;
  public int totalPages = 0;
  private int pageRecords = 20;
  private int totalRecords = 0;
  private int startRecord = 0;
  private int nextPage = 0;
  private int previousPage = 0;
  private boolean hasNextPage = false;
  private boolean hasPreviousPage = false;
  private HashMap<String, String> sortParams;
  
  public Pagination() {}
  
  public Pagination(int pageRecords, int currentPage, int totalRecords, HashMap<String, String> sortParams)
  {
    this.pageRecords = pageRecords;
    this.currentPage = (currentPage <= 1 ? 1 : currentPage);
    this.totalRecords = totalRecords;
    this.sortParams = sortParams;
    if (totalRecords % pageRecords == 0) {
      this.totalPages = (totalRecords / pageRecords);
    } else {
      this.totalPages = (totalRecords / pageRecords + 1);
    }
    if (currentPage >= this.totalPages)
    {
      this.hasNextPage = false;
      currentPage = this.totalPages;
    }
    else
    {
      this.hasNextPage = true;
    }
    if (currentPage <= 1)
    {
      this.hasPreviousPage = false;
      currentPage = 1;
    }
    else
    {
      this.hasPreviousPage = true;
    }
    this.startRecord = ((currentPage - 1) * pageRecords);
    
    this.nextPage = (currentPage + 1);
    if (this.nextPage >= this.totalPages) {
      this.nextPage = this.totalPages;
    }
    this.previousPage = (currentPage - 1);
    if (this.previousPage <= 1) {
      this.previousPage = 1;
    }
  }
  
  public boolean isHasNextPage()
  {
    return this.hasNextPage;
  }
  
  public boolean isHasPreviousPage()
  {
    return this.hasPreviousPage;
  }
  
  public int getNextPage()
  {
    return this.nextPage;
  }
  
  public void setNextPage(int nextPage)
  {
    this.nextPage = nextPage;
  }
  
  public int getPreviousPage()
  {
    return this.previousPage;
  }
  
  public void setPreviousPage(int previousPage)
  {
    this.previousPage = previousPage;
  }
  
  public int getCurrentPage()
  {
    return this.currentPage;
  }
  
  public void setCurrentPage(int currentPage)
  {
    this.currentPage = currentPage;
  }
  
  public int getPageRecords()
  {
    return this.pageRecords;
  }
  
  public void setPageRecords(int pageRecords)
  {
    this.pageRecords = pageRecords;
  }
  
  public int getTotalPages()
  {
    return this.totalPages;
  }
  
  public void setTotalPages(int totalPages)
  {
    this.totalPages = totalPages;
  }
  
  public int getTotalRecords()
  {
    return this.totalRecords;
  }
  
  public void setTotalRecords(int totalRecords)
  {
    this.totalRecords = totalRecords;
  }
  
  public void setHasNextPage(boolean hasNextPage)
  {
    this.hasNextPage = hasNextPage;
  }
  
  public void setHasPreviousPage(boolean hasPreviousPage)
  {
    this.hasPreviousPage = hasPreviousPage;
  }
  
  public int getStartRecord()
  {
    return this.startRecord;
  }
  
  public void setStartRecord(int startRecord)
  {
    this.startRecord = startRecord;
  }
  
  public HashMap<String, String> getSortParams()
  {
    return this.sortParams;
  }
  
  public void setSortParams(HashMap<String, String> sortParams)
  {
    this.sortParams = sortParams;
  }
}
