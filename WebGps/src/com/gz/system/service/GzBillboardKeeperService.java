package com.gz.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gz.system.model.GzBillboardKeeperInfo;

public abstract interface GzBillboardKeeperService
  extends UniversalService
{
  public abstract GzBillboardKeeperInfo getBillboardKeeperByAccount(String paramString)
    throws Exception;
  
  public abstract GzBillboardKeeperInfo getBillboardKeeper(String paramString);
  
  public abstract void saveBillboardKeeper(GzBillboardKeeperInfo paramGzBillboardKeeperInfo);
  
  public abstract AjaxDto<GzBillboardKeeperInfo> getBillboardKeeperList(String paramString1, String paramString2, String paramString3, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination);
  
  public abstract int getBillboardKeeperCount(String paramString1, String paramString2, String paramString3, Integer paramInteger1, Integer paramInteger2);
}
