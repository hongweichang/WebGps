package com.gps.common.service;

import com.framework.web.service.UniversalService;
import com.gps.model.StorageRelationEx;
import java.util.List;

public abstract interface StorageRelationServiceEx
  extends UniversalService
{
  public abstract List<StorageRelationEx> getStoRelationList(String[] paramArrayOfString);
}
