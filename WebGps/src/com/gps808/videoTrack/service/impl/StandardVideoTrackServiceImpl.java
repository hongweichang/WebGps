package com.gps808.videoTrack.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;
import com.gps808.videoTrack.dao.StandardVideoTrackDao;
import com.gps808.videoTrack.service.StandardVideoTrackService;

public class StandardVideoTrackServiceImpl
  extends UniversalServiceImpl
  implements StandardVideoTrackService
{
  private StandardVideoTrackDao videoTrackDao;
  private PaginationDao paginationDao;
  
  public StandardVideoTrackDao getVideoTrackDao()
  {
    return this.videoTrackDao;
  }
  
  public void setVideoTrackDao(StandardVideoTrackDao videoTrackDao)
  {
    this.videoTrackDao = videoTrackDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public Class getClazz()
  {
    return StandardVideoTrackServiceImpl.class;
  }
  
  public AjaxDto<StandardStorageDownTaskAll> getDownloadTaskAllList(Integer userId, String devIdno, Integer nfileStartTime, Integer nfileEndTime, Integer status, String taskTag, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskAll where 1 = 1");
    if (userId != null) {
      sql.append(String.format(" and uid = %d", new Object[] { userId }));
    }
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if (nfileStartTime != null) {
      sql.append(String.format(" and nfbtm >= %d", new Object[] { nfileStartTime }));
    }
    if (nfileEndTime != null) {
      sql.append(String.format(" and nfetm <= %d", new Object[] { nfileEndTime }));
    }
    if (status != null) {
      sql.append(String.format(" and stu = %d", new Object[] { status }));
    }
    if ((taskTag != null) && (!taskTag.isEmpty())) {
      sql.append(String.format(" and lab like '%%%s%%'", new Object[] { taskTag }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardStorageDownTaskAll> getDownloadTaskAllList(Integer userId, String devIdno, String fileStartTime, String fileEndTime, Integer status, String taskTag, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardStorageDownTaskAll where 1 = 1");
    if (userId != null) {
      sql.append(String.format(" and uid = %d", new Object[] { userId }));
    }
    if ((devIdno != null) && (!devIdno.isEmpty())) {
      sql.append(String.format(" and did = '%s'", new Object[] { devIdno }));
    }
    if ((fileStartTime != null) && (!fileStartTime.isEmpty())) {
      sql.append(String.format(" and fbtm >= '%s'", new Object[] { fileStartTime }));
    }
    if ((fileEndTime != null) && (!fileEndTime.isEmpty())) {
      sql.append(String.format(" and fetm <= '%s'", new Object[] { fileEndTime }));
    }
    if (status != null) {
      sql.append(String.format(" and stu = %d", new Object[] { status }));
    }
    if ((taskTag != null) && (!taskTag.isEmpty())) {
      sql.append(String.format(" and lab like '%%%s%%'", new Object[] { taskTag }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public void saveDownloadTaskInfo(StandardStorageDownTaskReal taskReal, StandardStorageDownTaskAll taskAll)
  {
    this.videoTrackDao.saveDownloadTaskInfo(taskReal, taskAll);
  }
  
  public StandardStorageDownTaskAll getDownTaskAll(String devIdno, String filePath, Integer nfBegTime, Integer nfEndTime, Integer chn)
  {
    return this.videoTrackDao.getDownTaskAll(devIdno, filePath, nfBegTime, nfEndTime, chn);
  }
  
  public StandardStorageDownTaskAll getDownTaskAll(String devIdno, String filePath, String fBegTime, String fEndTime, Integer chn)
  {
    return this.videoTrackDao.getDownTaskAll(devIdno, filePath, fBegTime, fEndTime, chn);
  }
  
  public StandardStorageDownTaskReal getDownTaskReal(String devIdno, String filePath, String fBegTime, String fEndTime, Integer chn)
  {
    return this.videoTrackDao.getDownTaskReal(devIdno, filePath, fBegTime, fEndTime, chn);
  }
}
