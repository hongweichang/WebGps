package com.gps.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.report.model.DeviceGps;
import com.gps.report.vo.DeviceMinMaxGps;
import com.gps.report.vo.DeviceTrack;
import java.util.Date;
import java.util.List;

public abstract interface DeviceGpsService
  extends UniversalService
{
  public abstract AjaxDto<DeviceTrack> queryDeviceGps(String paramString1, Date paramDate1, Date paramDate2, int paramInt1, int paramInt2, Pagination paramPagination, String paramString2)
    throws Exception;
  
  public abstract AjaxDto<DeviceMinMaxGps> queryDevGps(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5, String paramString6, String[] paramArrayOfString, Pagination paramPagination, String paramString7);
  
  public abstract AjaxDto<DeviceTrack> queryDateGps(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5, String paramString6, boolean paramBoolean, String[] paramArrayOfString, Pagination paramPagination, String paramString7);
  
  public abstract List<DeviceGps> queryDeviceTrack(String paramString1, String paramString2, boolean paramBoolean, String paramString3, String paramString4);
  
  public abstract void analyDeviceGps(DeviceGps paramDeviceGps, String paramString1, long paramLong1, long paramLong2, List<DeviceTrack> paramList, String paramString2);
  
  public abstract DeviceTrack searchDeviceTrack(List<DeviceTrack> paramList, boolean paramBoolean, int paramInt);
  
  public abstract List<DeviceTrack> resolveDeviceTrack(DeviceGps paramDeviceGps, String paramString1, String paramString2, String paramString3);
}
