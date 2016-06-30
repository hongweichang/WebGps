package com.gps.common.dao;

import com.gps.model.DeviceBase;
import com.gps.model.DeviceBrand;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceType;
import com.gps.model.DeviceYouLiang;
import java.util.List;

public abstract interface DeviceInfoDao
{
  public abstract DeviceInfo get(String paramString);
  
  public abstract String save(DeviceInfo paramDeviceInfo);
  
  public abstract void batchSave(List<DeviceInfo> paramList);
  
  public abstract void batchDelete(List<DeviceInfo> paramList);
  
  public abstract void update(DeviceInfo paramDeviceInfo);
  
  public abstract void batchUpdate(List<DeviceInfo> paramList);
  
  public abstract void delete(DeviceInfo paramDeviceInfo);
  
  public abstract void delete(String paramString);
  
  public abstract DeviceInfo findByNameOrIdno(String paramString);
  
  public abstract DeviceInfo findByIdno(String paramString);
  
  public abstract DeviceBase findByIdnoEx(String paramString);
  
  public abstract List<DeviceInfo> findAll();
  
  public abstract int getDeviceCount(String paramString);
  
  public abstract DeviceType findTypeByName(String paramString);
  
  public abstract List<DeviceBrand> findAllBrand();
  
  public abstract DeviceBrand findBrandByName(String paramString);
  
  public abstract void updateVehiTypeName(DeviceType paramDeviceType);
  
  public abstract void updateVehiBrandName(DeviceBrand paramDeviceBrand);
  
  public abstract DeviceYouLiang findYouLiangByIdno(String paramString);
}
