package com.gps.user.dao;

import com.gps.user.model.UserDevPermit;
import java.util.List;

public abstract interface UserDevPermitDao
{
  public abstract void editUserDevPermit(List<UserDevPermit> paramList1, List<UserDevPermit> paramList2);
  
  public abstract void delDevPermit(String[] paramArrayOfString);
}
