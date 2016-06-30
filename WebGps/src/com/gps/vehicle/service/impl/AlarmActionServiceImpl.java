package com.gps.vehicle.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.vehicle.dao.VehiAlarmActionDao;
import com.gps.vehicle.model.AlarmAction;
import com.gps.vehicle.service.AlarmActionService;
import java.util.List;
import java.util.Map;

public class AlarmActionServiceImpl
  extends UniversalServiceImpl
  implements AlarmActionService
{
  private PaginationDao paginationDao;
  private VehiAlarmActionDao vehiAlarmActionDao;
  
  public VehiAlarmActionDao getVehiAlarmActionDao()
  {
    return this.vehiAlarmActionDao;
  }
  
  public void setVehiAlarmActionDao(VehiAlarmActionDao vehiAlarmActionDao)
  {
    this.vehiAlarmActionDao = vehiAlarmActionDao;
  }
  
  public Class getClazz()
  {
    return AlarmAction.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  private String getQueryString(String[] devIdnos)
  {
    StringBuilder builder = new StringBuilder("from AlarmAction where 1 = 1");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          builder.append(String.format(" and (devIdno = '%s'", new Object[] { devIdnos[i] }));
        } else {
          builder.append(String.format(" or devIdno = '%s'", new Object[] { devIdnos[i] }));
        }
      }
      builder.append(") ");
    }
    return builder.toString();
  }
  
  public AjaxDto<AlarmAction> getAlarmActionList(String[] devIdnos, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(devIdnos), pagination);
  }
  
  public AlarmAction findAlarmAction(String devIdno, Integer armType)
  {
    return this.vehiAlarmActionDao.findAlarmAction(devIdno, armType);
  }
  
  public Map<Integer, AlarmAction> getDeviceAlarmAction(String devIdno)
  {
    return this.vehiAlarmActionDao.getDeviceAlarmAction(devIdno);
  }
  
  public void saveAlarmAction(List<AlarmAction> lstArmAction)
  {
    this.vehiAlarmActionDao.saveAlarmAction(lstArmAction);
  }
}
