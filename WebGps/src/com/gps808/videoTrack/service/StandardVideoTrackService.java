package com.gps808.videoTrack.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;

public abstract interface StandardVideoTrackService
  extends UniversalService
{
  public abstract AjaxDto<StandardStorageDownTaskAll> getDownloadTaskAllList(Integer paramInteger1, String paramString1, String paramString2, String paramString3, Integer paramInteger2, String paramString4, String paramString5, Pagination paramPagination);
  
  public abstract AjaxDto<StandardStorageDownTaskAll> getDownloadTaskAllList(Integer paramInteger1, String paramString1, Integer paramInteger2, Integer paramInteger3, Integer paramInteger4, String paramString2, String paramString3, Pagination paramPagination);
  
  public abstract void saveDownloadTaskInfo(StandardStorageDownTaskReal paramStandardStorageDownTaskReal, StandardStorageDownTaskAll paramStandardStorageDownTaskAll);
  
  public abstract StandardStorageDownTaskAll getDownTaskAll(String paramString1, String paramString2, Integer paramInteger1, Integer paramInteger2, Integer paramInteger3);
  
  public abstract StandardStorageDownTaskAll getDownTaskAll(String paramString1, String paramString2, String paramString3, String paramString4, Integer paramInteger);
  
  public abstract StandardStorageDownTaskReal getDownTaskReal(String paramString1, String paramString2, String paramString3, String paramString4, Integer paramInteger);
}
