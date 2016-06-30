package com.gps808.report.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps808.model.StandardDriverSignin;
import com.gps808.model.StandardStoDevAvRecord;
import com.gps808.model.StandardStoDevSnapshotRecord;

public abstract interface StandardVehicleMediaService
  extends UniversalService
{
  public abstract AjaxDto<StandardStoDevSnapshotRecord> queryVehiclePhoto(String paramString1, String paramString2, String[] paramArrayOfString, Integer paramInteger, Pagination paramPagination);
  
  public abstract AjaxDto<StandardStoDevAvRecord> queryVehicleAudioOrVideo(String paramString1, String paramString2, String[] paramArrayOfString, Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, Pagination paramPagination);
  
  public abstract AjaxDto<StandardDriverSignin> queryDriverSignin(String paramString1, String paramString2, String[] paramArrayOfString, Pagination paramPagination);
}
