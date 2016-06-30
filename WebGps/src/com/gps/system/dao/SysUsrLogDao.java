package com.gps.system.dao;

import com.gps.system.model.SysUsrLog;
import java.util.List;

public abstract interface SysUsrLogDao
{
  public abstract Integer save(SysUsrLog paramSysUsrLog);
  
  public abstract Integer addUsrLog(Integer paramInteger1, Integer paramInteger2, Integer paramInteger3, String paramString1, String paramString2, String paramString3, String paramString4);
  
  public abstract int getLogCount(String paramString1, String paramString2);
  
  public abstract List<SysUsrLog> getLogList(String paramString1, String paramString2, Integer paramInteger1, Integer paramInteger2);
}
