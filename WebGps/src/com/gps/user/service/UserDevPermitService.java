package com.gps.user.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.user.model.UserDevPermit;
import com.gps.user.model.UserDevPermitEx;
import java.util.List;

public abstract interface UserDevPermitService
  extends UniversalService
{
  public abstract List<UserDevPermit> getDevPermitList(Integer paramInteger);
  
  public abstract AjaxDto<UserDevPermitEx> getPermitListByDevIDNO(String paramString, Pagination paramPagination);
  
  public abstract void editUserDevPermit(List<UserDevPermit> paramList1, List<UserDevPermit> paramList2);
  
  public abstract void delDevPermit(String[] paramArrayOfString);
}
