package com.gps.common.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.StorageRelation;
import com.gps808.model.StandardStorageRelation;

public abstract interface StorageRelationService
  extends UniversalService
{
  public abstract int getRelationCount(String paramString);
  
  public abstract AjaxDto<StorageRelation> getStoRelationList(String paramString1, String paramString2, Pagination paramPagination);
  
  public abstract AjaxDto<StandardStorageRelation> getStoRelationList(String paramString1, String[] paramArrayOfString, String paramString2, Pagination paramPagination);
}
