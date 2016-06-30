package com.gps808.monitor.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.model.DeviceStatusLite;
import com.gps808.model.StandardAlarmAudio;
import com.gps808.model.StandardAlarmMotion;
import com.gps808.model.StandardDownTask;
import com.gps808.model.StandardFixedTts;
import com.gps808.monitor.dao.StandardMonitorDao;
import com.gps808.monitor.service.StandardMonitorService;
import java.util.List;
import java.util.Map;

public class StandardMonitorServiceImpl
  extends UniversalServiceImpl
  implements StandardMonitorService
{
  private StandardMonitorDao standardMonitorDao;
  private PaginationDao paginationDao;
  
  public StandardMonitorDao getStandardMonitorDao()
  {
    return this.standardMonitorDao;
  }
  
  public void setStandardMonitorDao(StandardMonitorDao standardMonitorDao)
  {
    this.standardMonitorDao = standardMonitorDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public Class<StandardMonitorServiceImpl> getClazz()
  {
    return StandardMonitorServiceImpl.class;
  }
  
  public StandardFixedTts getStandardFixedTts(Integer userId, String content)
  {
    return this.standardMonitorDao.getStandardFixedTts(userId, content);
  }
  
  public List<StandardFixedTts> getStandardFixedTts(Integer userId)
  {
    return this.standardMonitorDao.getStandardFixedTts(userId);
  }
  
  public AjaxDto<StandardAlarmMotion> getAlarmMotionList(Integer userId, Integer scope, String vehiIdno, List<Integer> lstArmType, List<String> lstVehiIdno, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(String.format(" from StandardAlarmMotion where uid = %d ", new Object[] { userId }));
    if (scope != null) {
      sql.append(String.format(" and scp = %d ", new Object[] { scope }));
    }
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vid like '%%%s%%' ", new Object[] { vehiIdno }));
    }
    if ((lstArmType != null) && (lstArmType.size() > 0))
    {
      sql.append(String.format(" and (atp = %d ", new Object[] { lstArmType.get(0) }));
      for (int i = 1; i < lstArmType.size(); i++) {
        sql.append(String.format(" or atp = %d ", new Object[] { lstArmType.get(i) }));
      }
      sql.append(") ");
    }
    if ((lstVehiIdno != null) && (lstVehiIdno.size() > 0))
    {
      sql.append(String.format(" and (vid = '%s' ", new Object[] { lstArmType.get(0) }));
      for (int i = 1; i < lstArmType.size(); i++) {
        sql.append(String.format(" or vid = '%s' ", new Object[] { lstArmType.get(i) }));
      }
      sql.append(") ");
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public StandardAlarmMotion findAlarmMotion(Integer userId, String vehiIdno, Integer armType)
  {
    return this.standardMonitorDao.findAlarmMotion(userId, vehiIdno, armType);
  }
  
  public Map<Integer, StandardAlarmMotion> findAlarmMotion(Integer userId, String vehiIdno)
  {
    return this.standardMonitorDao.findAlarmMotion(userId, vehiIdno);
  }
  
  public AjaxDto<StandardAlarmAudio> getAudioList(List<Integer> lstUid, String name, String likeName, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardAlarmAudio where 1 = 1 ");
    if ((lstUid != null) && (lstUid.size() > 0))
    {
      sql.append(String.format(" and (uid = %d ", new Object[] { lstUid.get(0) }));
      for (int i = 1; i < lstUid.size(); i++) {
        sql.append(String.format(" or uid = %d ", new Object[] { lstUid.get(i) }));
      }
      sql.append(") ");
    }
    if ((name != null) && (!name.isEmpty())) {
      sql.append(String.format(" and sds = '%s' ", new Object[] { name }));
    }
    if ((likeName != null) && (!likeName.isEmpty())) {
      sql.append(String.format(" and sds like '%%%s%%' ", new Object[] { likeName }));
    }
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public AjaxDto<StandardDownTask> getDownTaskList(String vehiIdno, String begintime, String endtime, String condition, Pagination pagination)
  {
    StringBuffer sql = new StringBuffer(" from StandardDownTask where 1 = 1 ");
    if ((vehiIdno != null) && (!vehiIdno.isEmpty())) {
      sql.append(String.format(" and vid = '%s' ", new Object[] { vehiIdno }));
    }
    sql.append(String.format(" and btm >= '%s' and etm <= '%s' ", new Object[] { begintime, endtime }));
    if ((condition != null) && (!condition.isEmpty())) {
      sql.append(condition);
    }
    return this.paginationDao.getPgntByQueryStr(sql.toString(), pagination);
  }
  
  public List<DeviceStatusLite> getDeviceStatusLite(String[] devIdnos)
  {
    return this.standardMonitorDao.getDeviceStatusLite(devIdnos);
  }
}
