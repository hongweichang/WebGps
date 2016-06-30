package com.gps.user.service.impl;

import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.user.model.UserAlarmShield;
import com.gps.user.service.UserAlarmShieldService;

public class UserAlarmShieldServiceImpl
  extends UniversalServiceImpl
  implements UserAlarmShieldService
{
  public Class getClazz()
  {
    return UserAlarmShield.class;
  }
}
