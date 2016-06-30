package com.gps.common.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.UniversalService;
import com.gps.model.BMapInfo;
import com.gps.model.GMapInfo;
import com.gps.model.LiveVideoSession;
import com.gps.model.RememberKey;
import com.gps.model.UserInfo;
import com.gps.model.UserLog;
import com.gps.model.UserSession;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import java.util.List;

public abstract interface UserService
  extends UniversalService
{
  public abstract int getUserCount(String paramString, Integer paramInteger1, Integer paramInteger2);
  
  public abstract int getClientUserCount();
  
  public abstract AjaxDto<UserInfo> getUserList(String paramString, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination);
  
  public abstract UserInfo getUserInfoByAccount(String paramString)
    throws Exception;
  
  public abstract UserInfo getUserInfoByAccount(Integer paramInteger)
    throws Exception;
  
  public abstract UserSession getUserSession(String paramString);
  
  public abstract void addUserLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2, String paramString3, String paramString4, String paramString5);
  
  public abstract UserLog getUserLoginLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2);
  
  public abstract void updateUserLoginLog(Integer paramInteger, String paramString);
  
  public abstract void updateUserAccountId(Integer paramInteger1, Integer paramInteger2);
  
  public abstract void deleteUserNative(Integer paramInteger, String paramString);
  
  public abstract LiveVideoSession findLiveVideoSession(Integer paramInteger, String paramString);
  
  public abstract LiveVideoSession findLiveVideoSessionById(Integer paramInteger);
  
  public abstract RememberKey findRememberKeyById(Integer paramInteger);
  
  public abstract void deleteAllLive();
  
  public abstract AjaxDto<BMapInfo> findAllBMapInfo(Pagination paramPagination);
  
  public abstract BMapInfo findBMapInfoById(String paramString);
  
  public abstract AjaxDto<GMapInfo> findAllGMapInfo(Pagination paramPagination);
  
  public abstract GMapInfo findGMapInfoById(String paramString);
  
  public abstract UserInfo findByName(String paramString);
  
  public abstract List<Integer> getCompanyIdList(Integer paramInteger, List<Integer> paramList, boolean paramBoolean);
  
  public abstract List<StandardCompany> getStandardCompanyList(List<Integer> paramList);
  
  public abstract Integer getCompanyRelationCount(Integer paramInteger1, Integer paramInteger2);
  
  public abstract List<String> getStandardVehiIdnoList(List<Integer> paramList, String paramString);
  
  public abstract List<StandardUserVehiPermitEx> getAuthorizedVehicleList(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> paramList1, List<String> paramList2, List<QueryScalar> paramList, String paramString1, String paramString2);
  
  public abstract AjaxDto<StandardVehicle> findAllVehicles(Pagination paramPagination);
}
