package com.gps.common.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.service.DevGroupService;
import com.gps.model.DeviceGroup;
import java.util.List;

public class DevGroupServiceImpl
  extends UniversalServiceImpl
  implements DevGroupService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DeviceGroup.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  private String getQueryString(Integer clientId, Integer groupId)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceGroup where 1 = 1 ");
    if (clientId != null) {
      strQuery.append(String.format("and userId = %d ", new Object[] { clientId }));
    }
    if (groupId != null) {
      strQuery.append(String.format("and parentId = %d ", new Object[] { groupId }));
    }
    return strQuery.toString();
  }
  
  public List<DeviceGroup> getGroupList(Integer clientId, Integer groupId)
  {
    AjaxDto<DeviceGroup> ajaxGroup = this.paginationDao.getPgntByQueryStr(getQueryString(clientId, groupId), null);
    return ajaxGroup.getPageList();
  }
}
