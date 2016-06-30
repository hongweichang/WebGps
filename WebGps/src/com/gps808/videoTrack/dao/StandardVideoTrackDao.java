package com.gps808.videoTrack.dao;

import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;

public abstract interface StandardVideoTrackDao
{
  public abstract void saveDownloadTaskInfo(StandardStorageDownTaskReal paramStandardStorageDownTaskReal, StandardStorageDownTaskAll paramStandardStorageDownTaskAll);
  
  public abstract StandardStorageDownTaskAll getDownTaskAll(String paramString1, String paramString2, Integer paramInteger1, Integer paramInteger2, Integer paramInteger3);
  
  public abstract StandardStorageDownTaskAll getDownTaskAll(String paramString1, String paramString2, String paramString3, String paramString4, Integer paramInteger);
  
  public abstract StandardStorageDownTaskReal getDownTaskReal(String paramString1, String paramString2, String paramString3, String paramString4, Integer paramInteger);
}
