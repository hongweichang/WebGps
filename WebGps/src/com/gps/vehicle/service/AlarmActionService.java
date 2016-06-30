package com.gps.vehicle.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.AlarmAction;
import java.util.List;
import java.util.Map;

public abstract interface AlarmActionService
  extends UniversalService
{
  public abstract AjaxDto<AlarmAction> getAlarmActionList(String[] paramArrayOfString, Pagination paramPagination);
  
  public abstract AlarmAction findAlarmAction(String paramString, Integer paramInteger);
  
  public abstract Map<Integer, AlarmAction> getDeviceAlarmAction(String paramString);
  
  public abstract void saveAlarmAction(List<AlarmAction> paramList);
}
