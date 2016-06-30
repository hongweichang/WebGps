package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DispatchCommand;

public abstract interface DispatchCommandService
  extends UniversalService
{
  public abstract AjaxDto<DispatchCommand> queryDispatchCommand(String paramString1, String paramString2, String[] paramArrayOfString, String paramString3, Pagination paramPagination, String paramString4, String paramString5, String paramString6, String paramString7);
}
