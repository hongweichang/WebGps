package com.gps808.monitor.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.DeviceStatusLite;
import com.gps808.model.StandardAlarmAudio;
import com.gps808.model.StandardAlarmMotion;
import com.gps808.model.StandardDownTask;
import com.gps808.model.StandardFixedTts;
import java.util.List;
import java.util.Map;

public abstract interface StandardMonitorService
  extends UniversalService
{
  public abstract StandardFixedTts getStandardFixedTts(Integer paramInteger, String paramString);
  
  public abstract List<StandardFixedTts> getStandardFixedTts(Integer paramInteger);
  
  public abstract AjaxDto<StandardAlarmMotion> getAlarmMotionList(Integer paramInteger1, Integer paramInteger2, String paramString1, List<Integer> paramList, List<String> paramList1, String paramString2, Pagination paramPagination);
  
  public abstract StandardAlarmMotion findAlarmMotion(Integer paramInteger1, String paramString, Integer paramInteger2);
  
  public abstract Map<Integer, StandardAlarmMotion> findAlarmMotion(Integer paramInteger, String paramString);
  
  public abstract AjaxDto<StandardAlarmAudio> getAudioList(List<Integer> paramList, String paramString1, String paramString2, String paramString3, Pagination paramPagination);
  
  public abstract AjaxDto<StandardDownTask> getDownTaskList(String paramString1, String paramString2, String paramString3, String paramString4, Pagination paramPagination);
  
  public abstract List<DeviceStatusLite> getDeviceStatusLite(String[] paramArrayOfString);
}
