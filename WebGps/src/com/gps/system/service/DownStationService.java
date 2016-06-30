package com.gps.system.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.system.model.DownStation;

public abstract interface DownStationService
  extends UniversalService
{
  public abstract DownStation getStationByName(String paramString)
    throws Exception;
  
  public abstract DownStation getStationBySsid(String paramString)
    throws Exception;
  
  public abstract AjaxDto<DownStation> getAllStation(Pagination paramPagination)
    throws Exception;
}
