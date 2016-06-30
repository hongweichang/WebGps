package com.gps808.operationManagement.dao;

import com.gps808.model.line.StandardLineStationRelationStation;
import com.gps808.model.line.StandardStationInfo;
import java.util.List;

public abstract interface StandardLineDao
{
  public abstract StandardLineStationRelationStation getLineStationRelation(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, Integer paramInteger4, String paramString);
  
  public abstract StandardStationInfo getStationInfo(String paramString1, Integer paramInteger, String paramString2);
  
  public abstract Integer getMaxStationIndex(Integer paramInteger1, Integer paramInteger2, String paramString);
  
  public abstract void batchSaveStationRelation(List<StandardLineStationRelationStation> paramList1, List<StandardLineStationRelationStation> paramList2);
}
