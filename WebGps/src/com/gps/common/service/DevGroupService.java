package com.gps.common.service;

import com.framework.web.service.UniversalService;
import com.gps.model.DeviceGroup;
import java.util.List;

public abstract interface DevGroupService
  extends UniversalService
{
  public abstract List<DeviceGroup> getGroupList(Integer paramInteger1, Integer paramInteger2);
}
