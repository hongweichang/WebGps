package com.gps.common.dao;

import com.framework.web.dto.QueryScalar;
import com.gps.model.LiveVideoSession;
import com.gps.model.UserLog;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import java.util.List;

public abstract interface UserLogDao
{
  public abstract void addUserLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2, String paramString3, String paramString4, String paramString5);
  
  public abstract UserLog getUserLoginLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2);
  
  public abstract void updateUserLoginLog(Integer paramInteger, String paramString);
  
  public abstract LiveVideoSession findLiveVideoSession(Integer paramInteger, String paramString);
  
  public abstract LiveVideoSession findLiveVideoSessionById(Integer paramInteger);
  
  public abstract void deleteAllLive();
  
  public abstract List<Integer> getCompanyIdList(Integer paramInteger, List<Integer> paramList, boolean paramBoolean);
  
  public abstract List<StandardCompany> getStandardCompanyList(List<Integer> paramList);
  
  public abstract Integer getCompanyRelationCount(Integer paramInteger1, Integer paramInteger2);
  
  public abstract List<String> getStandardVehiIdnoList(List<Integer> paramList, String paramString);
  
  public abstract List<StandardUserVehiPermitEx> getAuthorizedVehicleList(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> paramList1, List<String> paramList2, List<QueryScalar> paramList, String paramString1, String paramString2);
}
