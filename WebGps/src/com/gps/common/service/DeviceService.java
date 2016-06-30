package com.gps.common.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceBrand;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.DeviceStatusLite;
import com.gps.model.DeviceType;
import com.gps.model.DeviceYouLiang;
import com.gps.vo.VehicleInfo;
import java.util.List;

public abstract interface DeviceService
  extends UniversalService
{
  public abstract int getRegistCount();
  
  public abstract long getServerConfig();
  
  public abstract int getDeviceCount(String paramString, Integer paramInteger1, Integer paramInteger2);
  
  public abstract int getStoreCount();
  
  public abstract AjaxDto<DeviceInfo> getDeviceList(String paramString1, Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, Pagination paramPagination, String paramString2);
  
  public abstract AjaxDto<DeviceBase> getClientDeviceList(String paramString, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceBase> getUserDeviceList(String paramString, Integer paramInteger1, Integer paramInteger2, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceInfo> getFreeStoRelationDeviceList(String paramString, Pagination paramPagination);
  
  public abstract AjaxDto<DeviceStatus> getDeviceStatus(List<DeviceBase> paramList);
  
  public abstract AjaxDto<DeviceStatus> getDeviceStatus(String[] paramArrayOfString);
  
  public abstract AjaxDto<DeviceStatusLite> getDeviceStatusLite(String[] paramArrayOfString);
  
  public abstract List<DeviceInfo> getDeviceIdnos(String[] paramArrayOfString);
  
  public abstract DeviceInfo findDeviceByIdno(String paramString);
  
  public abstract DeviceBase findDeviceByIdnoEx(String paramString);
  
  public abstract DeviceInfo getDeviceInfo(String paramString);
  
  public abstract Boolean addDeviceInfo(DeviceInfo paramDeviceInfo);
  
  public abstract Boolean batchAddDevice(List<DeviceInfo> paramList);
  
  public abstract void batchDelDevice(List<DeviceInfo> paramList);
  
  public abstract void editDeviceInfo(DeviceInfo paramDeviceInfo);
  
  public abstract void batchEditDevice(List<DeviceInfo> paramList);
  
  public abstract void delDeviceInfo(DeviceInfo paramDeviceInfo);
  
  public abstract void updateDeviceAccountId(String paramString, Integer paramInteger);
  
  public abstract void deleteDeviceNative(String paramString);
  
  public abstract AjaxDto<DeviceStatus> getStandardDeviceStatus(List<VehicleInfo> paramList);
  
  public abstract AjaxDto<DeviceType> getVehiType(Pagination paramPagination);
  
  public abstract DeviceType getVehiTypeByName(String paramString);
  
  public abstract List<DeviceBrand> getVehiBrand();
  
  public abstract DeviceBrand getVehiBrandByName(String paramString);
  
  public abstract void updateVehiTypeName(DeviceType paramDeviceType);
  
  public abstract void updateVehiBrandName(DeviceBrand paramDeviceBrand);
  
  public abstract DeviceYouLiang getDeviceYouLiang(String paramString);
}
