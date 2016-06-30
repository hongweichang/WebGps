package com.gps.api.service.impl;

import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.api.model.AlarmImage;
import com.gps.api.service.AlarmImageService;

public class AlarmImageServiceImpl
  extends UniversalServiceImpl
  implements AlarmImageService
{
  public Class getClazz()
  {
    return AlarmImage.class;
  }
}
