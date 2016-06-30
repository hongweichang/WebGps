package com.gps.common.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps.common.dao.UserAccountDao;
import com.gps.model.ResetPassword;
import com.gps.model.UserAccount;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;

public class UserAccountDaoHibernate
  extends HibernateDaoSupportEx
  implements UserAccountDao
{
  public UserAccount get(Integer id)
  {
    return 
      (UserAccount)getHibernateTemplate().get(UserAccount.class, id);
  }
  
  public UserAccount findByAccount(String name)
  {
    List<UserAccount> usrlist = getHibernateTemplate()
      .find("from UserAccount where account = ?", 
      name);
    if (usrlist.size() > 0) {
      return (UserAccount)usrlist.get(0);
    }
    return null;
  }
  
  public List<Object> findDriverInfo(String padIdno)
  {
    String sql = "select a.VehicleIDNO,a.PadIDNO,a.PadPsw,b.DriverName,b.DriverPhone,b.DirverPicture as image,a.PlanStartTime as beginTime,a.PlanEndTime as endTime,a.CargoName as cargoName,a.CargoLength as cargoLength,a.CargoHeight as cargoHeight,a.CargoWidth as cargoWidth,a.CargoWeight as cargoWeight,a.AxisWeight as axisWeight,a.StartPoint as startPoint,a.EndPoint as endPoint  from tblzvehicleinfo b,tblzvehicletask a where a.VehicleIDNO = b.VehicleIDNO and a.PadIDNO = ? and a.Status = 0 ";
    
    Query query = getSession().createSQLQuery(sql);
    query.setString(0, padIdno);
    List<Object> list = query.list();
    return list;
  }
  
  public ResetPassword findResetSession(String account)
  {
    Query query = getSession().createQuery(" from ResetPassword where account = ? and endTime >= ? and status = 1");
    if (query == null) {
      return null;
    }
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String date = sdf.format(new Date());
    query.setString(0, account);
    query.setString(1, date);
    List<ResetPassword> list = query.list();
    if (list.size() > 0) {
      return (ResetPassword)list.get(0);
    }
    return null;
  }
  
  public ResetPassword findResetSessionByAI(Integer id, String randParam, String account)
  {
    Query query = getSession().createQuery(" from ResetPassword where id = ? and randParam = ? and account = ? and endTime >= ? and status = 1");
    if (query == null) {
      return null;
    }
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String date = sdf.format(new Date());
    query.setInteger(0, id.intValue());
    query.setString(1, randParam);
    query.setString(2, account);
    query.setString(3, date);
    List<ResetPassword> list = query.list();
    if (list.size() > 0) {
      return (ResetPassword)list.get(0);
    }
    return null;
  }
}
