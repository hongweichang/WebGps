package com.gps808.operationManagement.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps808.model.line.StandardLineInfo;
import com.gps808.model.line.StandardLineStationRelation;
import com.gps808.model.line.StandardLineStationRelationStation;
import com.gps808.model.line.StandardStationInfo;
import java.util.List;

public abstract interface StandardLineService
  extends UniversalService
{
  public abstract AjaxDto<StandardLineInfo> getLineInfos(List<Integer> paramList, Integer paramInteger, String paramString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardLineInfo> getLineInfoList(List<Integer> paramList, Integer paramInteger, String paramString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardLineStationRelationStation> getLineStationInfos(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString, Pagination paramPagination);
  
  public abstract StandardLineStationRelationStation getLineStationRelation(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, Integer paramInteger4, String paramString);
  
  public abstract StandardStationInfo getStationInfo(String paramString1, Integer paramInteger, String paramString2);
  
  public abstract Integer getMaxStationIndex(Integer paramInteger1, Integer paramInteger2, String paramString);
  
  public abstract void batchSaveStationRelation(List<StandardLineStationRelationStation> paramList1, List<StandardLineStationRelationStation> paramList2);
  
  public abstract AjaxDto<StandardStationInfo> getStationInfos(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardLineStationRelation> getLineStationRelationInfos(List<Integer> paramList, String paramString, Pagination paramPagination);
  
  public abstract AjaxDto<StandardStationInfo> getStationInfos(List<Integer> paramList, Integer paramInteger, String paramString, Pagination paramPagination);
}
