package com.gps.system.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.system.dao.SysUsrInfoDao;
import com.gps.system.dao.SysUsrLogDao;
import com.gps.system.model.SysUsrInfo;
import com.gps.system.service.SysUserService;
import java.security.MessageDigest;

public class SysUserServiceImpl
  extends UniversalServiceImpl
  implements SysUserService
{
  private SysUsrInfoDao usrInfoDao;
  private SysUsrLogDao usrLogDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return SysUsrInfo.class;
  }
  
  public SysUsrInfoDao getUsrInfoDao()
  {
    return this.usrInfoDao;
  }
  
  public void setUsrInfoDao(SysUsrInfoDao usrInfoDao)
  {
    this.usrInfoDao = usrInfoDao;
  }
  
  public SysUsrLogDao getUsrLogDao()
  {
    return this.usrLogDao;
  }
  
  public void setUsrLogDao(SysUsrLogDao usrLogDao)
  {
    this.usrLogDao = usrLogDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public static String Md5Encoder(String s)
  {
    char[] hexDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
      'a', 'b', 'c', 'd', 'e', 'f' };
    try
    {
      byte[] strTemp = s.getBytes();
      
      MessageDigest mdTemp = MessageDigest.getInstance("MD5");
      mdTemp.update(strTemp);
      byte[] md = mdTemp.digest();
      int j = md.length;
      char[] str = new char[j * 2];
      int k = 0;
      for (int i = 0; i < j; i++)
      {
        byte b = md[i];
        
        str[(k++)] = hexDigits[(b >> 4 & 0xF)];
        str[(k++)] = hexDigits[(b & 0xF)];
      }
      return new String(str);
    }
    catch (Exception e) {}
    return null;
  }
  
  public SysUsrInfo getUserInfoByAccount(String username)
    throws Exception
  {
    return this.usrInfoDao.findByName(username);
  }
  
  public void saveUsrLogin(SysUsrInfo usr)
  {
    this.usrInfoDao.update(usr);
    
    this.usrLogDao.addUsrLog(usr.getId(), 
      Integer.valueOf(1), 
      Integer.valueOf(1), 
      usr.getLastLoginAddr(), null, null, null);
  }
  
  public SysUsrInfo getUsrInfo(Integer usrid)
  {
    return this.usrInfoDao.get(usrid);
  }
  
  public void saveUsrInfo(SysUsrInfo usr)
  {
    this.usrInfoDao.update(usr);
  }
  
  public void addSysUsrLog(Integer usrid, Integer mainType, Integer subType, String param1, String param2, String param3, String param4)
  {
    this.usrLogDao.addUsrLog(usrid, 
      mainType, 
      subType, 
      param1, param2, param3, param4);
  }
}
