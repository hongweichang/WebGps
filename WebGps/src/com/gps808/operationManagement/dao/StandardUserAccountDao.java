package com.gps808.operationManagement.dao;

import com.framework.web.dto.QueryScalar;
import com.gps.model.ServerInfo;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardAreaChina;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDeviceOflTask;
import com.gps808.model.StandardDeviceTirepressureStatus;
import com.gps808.model.StandardDeviceYouLiang;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardUserVehiPermitUser;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleSafe;
import com.gps808.operationManagement.vo.StandardUserVehiPermitExMore;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.VehicleLiteEx;
import java.util.List;

public abstract interface StandardUserAccountDao
{
  public abstract String getStandardUserAccountName(Integer paramInteger);
  
  public abstract StandardUserAccount getStandardUserAccountByAccount(String paramString);
  
  public abstract List<Integer> getCompanyIdList(Integer paramInteger, List<Integer> paramList, boolean paramBoolean);
  
  public abstract List<Integer> getChildIdList(Integer paramInteger);
  
  public abstract List<StandardCompany> getStandardCompanyList(List<Integer> paramList);
  
  public abstract List<StandardUserAccount> getStandardUser(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardUserRole> getStandardRole(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardSIMCardInfo> getStandardSIM(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardDevice> getStandardDevice(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardVehicle> getStandardVehicle(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardVehiDevRelation> getStandardVehiDevRelationList(String paramString1, String paramString2);
  
  public abstract List<StandardVehiDevRelationEx> getStandardVehiDevRelationExList(String paramString1, String paramString2);
  
  public abstract List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(String paramString1, String paramString2, List<QueryScalar> paramList, String paramString3, String paramString4);
  
  public abstract List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> paramList1, List<String> paramList2, List<QueryScalar> paramList, String paramString1, String paramString2);
  
  public abstract List<StandardDriver> getStandardDriver(Integer paramInteger, boolean paramBoolean);
  
  public abstract List<StandardUserVehiPermitEx> getAuthorizedUserVehicleList(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract List<StandardUserVehiPermitVehicle> getAuthorizedVehicleList(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract List<StandardUserVehiPermitExMore> getAuthorizedVehicleExMoreList(Integer paramInteger, String paramString1, List<QueryScalar> paramList, String paramString2, String paramString3);
  
  public abstract List<StandardUserVehiPermitUser> getPeimitVehicleUserList(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract void changePassword(Integer paramInteger, String paramString);
  
  public abstract StandardCompany getStandardCompany(String paramString);
  
  public abstract StandardCompany getCompanyByCustomerID(String paramString);
  
  public abstract MapMarker getStandardMark(String paramString);
  
  public abstract StandardAreaChina getStandardArea(String paramString, Integer paramInteger);
  
  public abstract List<StandardAreaChina> getAreaByParentId(Integer paramInteger);
  
  public abstract StandardDevice getStandardDevice(Integer paramInteger);
  
  public abstract StandardDevice getDeviceBySim(String paramString);
  
  public abstract StandardVehicle getStandardVehicle(Integer paramInteger);
  
  public abstract StandardUserAccount getStandardUserAccount(String paramString1, String paramString2);
  
  public abstract StandardUserRole getStandardUserRole(String paramString);
  
  public abstract StandardDriver getStandardDriver(String paramString);
  
  public abstract StandardSIMCardInfo getStandardSIMCardInfo(Integer paramInteger);
  
  public abstract void editUserVehiPermitEx(List<StandardUserVehiPermitEx> paramList1, List<StandardUserVehiPermitEx> paramList2);
  
  public abstract void mergeVehicle(List<StandardVehiDevRelation> paramList1, List<StandardVehiDevRelation> paramList2, List<StandardSIMCardInfo> paramList, List<StandardDevice> paramList3);
  
  public abstract void deleteVehicle(List<StandardStorageRelation> paramList, List<StandardVehiDevRelation> paramList1, List<StandardVehiRule> paramList2, StandardVehicle paramStandardVehicle, boolean paramBoolean);
  
  public abstract void deleteVehicleAndDevice(List<StandardStorageRelation> paramList, List<StandardVehiDevRelation> paramList1, List<StandardVehiRule> paramList2, StandardVehicle paramStandardVehicle);
  
  public abstract void deleteDevice(StandardDevice paramStandardDevice);
  
  public abstract void updateVehicle(List<StandardVehicle> paramList, List<StandardUserVehiPermitEx> paramList1, List<StandardVehiRule> paramList2);
  
  public abstract List<StandardVehicle> getVehicleList(Integer paramInteger);
  
  public abstract List<VehicleLiteEx> getVehicleList(String[] paramArrayOfString);
  
  public abstract void updateDevice(StandardDevice paramStandardDevice, StandardSIMCardInfo paramStandardSIMCardInfo1, StandardSIMCardInfo paramStandardSIMCardInfo2);
  
  public abstract void deleteServer(ServerInfo paramServerInfo, List<StandardStorageRelation> paramList);
  
  public abstract void updateVehicle(int paramInt, String paramString);
  
  public abstract List<StandardCompanyRelation> getCompanyRelation(Integer paramInteger1, Integer paramInteger2);
  
  public abstract List<StandardCompany> getCompanyTeamList(Integer paramInteger);
  
  public abstract StandardDeviceOflTask findDeviceOflTask(String paramString, Integer paramInteger);
  
  public abstract StandardDeviceYouLiang findDeviceYouLiang(String paramString);
  
  public abstract void delStorageRelation(StandardStorageRelation paramStandardStorageRelation, Integer paramInteger);
  
  public abstract List<StandardVehicleSafe> getAllVehicleSafes(List<String> paramList);
  
  public abstract List<String> getStandardVehiIdnoList(List<Integer> paramList, String paramString);
  
  public abstract StandardDeviceTirepressureStatus findTirepressureStatus(String paramString, Integer paramInteger);
}
