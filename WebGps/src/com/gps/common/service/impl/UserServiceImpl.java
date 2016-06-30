package com.gps.common.service.impl;

import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.dao.UserInfoDao;
import com.gps.common.dao.UserLogDao;
import com.gps.common.dao.UserSessionDao;
import com.gps.common.service.UserService;
import com.gps.model.BMapInfo;
import com.gps.model.GMapInfo;
import com.gps.model.LiveVideoSession;
import com.gps.model.RememberKey;
import com.gps.model.UserInfo;
import com.gps.model.UserLog;
import com.gps.model.UserSession;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import java.util.List;

public class UserServiceImpl
  extends UniversalServiceImpl
  implements UserService
{
  private UserInfoDao userInfoDao;
  private UserLogDao userLogDao;
  private PaginationDao paginationDao;
  private UserSessionDao userSessionDao;
  
  public Class getClazz()
  {
    return UserInfo.class;
  }
  
  public UserInfoDao getUserInfoDao()
  {
    return this.userInfoDao;
  }
  
  public void setUserInfoDao(UserInfoDao userInfoDao)
  {
    this.userInfoDao = userInfoDao;
  }
  
  public UserLogDao getUserLogDao()
  {
    return this.userLogDao;
  }
  
  public void setUserLogDao(UserLogDao userLogDao)
  {
    this.userLogDao = userLogDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public UserSessionDao getUserSessionDao()
  {
    return this.userSessionDao;
  }
  
  public void setUserSessionDao(UserSessionDao userSessionDao)
  {
    this.userSessionDao = userSessionDao;
  }
  
  public int getUserCount(String name, Integer parent, Integer roleId)
  {
    return this.paginationDao.getCountByQueryStr(getQueryString(name, parent, roleId)).intValue();
  }
  
  public int getClientUserCount()
  {
    return this.paginationDao.getCountByQueryStr(String.format("from UserInfo where parentId != %d", new Object[] { Integer.valueOf(0) })).intValue();
  }
  
  private String getQueryString(String name, Integer parent, Integer roleId)
  {
    StringBuffer strQuery = new StringBuffer("from UserInfo where 1 = 1 ");
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format("and (userAccount.name like '%%%s%%' or userAccount.account like '%%%s%%') ", new Object[] { name, name }));
    }
    if (parent != null) {
      strQuery.append(String.format("and parentId = %d ", new Object[] { parent }));
    }
    if (roleId != null) {
      strQuery.append(String.format("and roleId = %d ", new Object[] { roleId }));
    }
    return strQuery.toString();
  }
  
  public AjaxDto<UserInfo> getUserList(String name, Integer parent, Integer roleId, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(name, parent, roleId), pagination);
  }
  
  public UserInfo getUserInfoByAccount(String account)
    throws Exception
  {
    return this.userInfoDao.findByLoginName(account);
  }
  
  public UserInfo getUserInfoByAccount(Integer account)
    throws Exception
  {
    return this.userInfoDao.findByLoginAccout(account);
  }
  
  public UserSession getUserSession(String session)
  {
    return this.userSessionDao.getUserSession(session);
  }
  
  public void addUserLog(Integer userId, Integer mainType, Integer subType, String devIDNO, String param1, String param2, String param3, String param4)
  {
    this.userLogDao.addUserLog(userId, mainType, subType, devIDNO, param1, param2, param3, param4);
  }
  
  public UserLog getUserLoginLog(Integer userId, Integer mainType, Integer subType, String devIdno, String param3)
  {
    return this.userLogDao.getUserLoginLog(userId, mainType, subType, devIdno, param3);
  }
  
  public void updateUserLoginLog(Integer id, String param4)
  {
    this.userLogDao.updateUserLoginLog(id, param4);
  }
  
  public void updateUserAccountId(Integer userId, Integer accountId)
  {
    String queryString = String.format("update user_info set accountid = %d where id = %d", new Object[] { accountId, userId });
    this.paginationDao.execNativeSql(queryString);
  }
  
  public void deleteUserNative(Integer userId, String account)
  {
    String queryString = String.format("delete from user_info where id = %d", new Object[] { userId });
    this.paginationDao.execNativeSql(queryString);
    queryString = String.format("delete from account where account = '%s'", new Object[] { account });
    this.paginationDao.execNativeSql(queryString);
  }
  
  public LiveVideoSession findLiveVideoSession(Integer userid, String randParam)
  {
    return this.userLogDao.findLiveVideoSession(userid, randParam);
  }
  
  public LiveVideoSession findLiveVideoSessionById(Integer id)
  {
    return this.userLogDao.findLiveVideoSessionById(id);
  }
  
  public RememberKey findRememberKeyById(Integer id)
  {
    AjaxDto<RememberKey> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from RememberKey where accountId = %d", new Object[] { id }), null);
    List<RememberKey> keys = ajaxDto.getPageList();
    if ((keys != null) && (keys.size() > 0)) {
      return (RememberKey)keys.get(0);
    }
    return null;
  }
  
  public void deleteAllLive()
  {
    this.userLogDao.deleteAllLive();
  }
  
  public AjaxDto<BMapInfo> findAllBMapInfo(Pagination pagination)
  {
    AjaxDto<BMapInfo> ajaxDto = this.paginationDao.getPgntByQueryStr("from BMapInfo", pagination);
    return ajaxDto;
  }
  
  public BMapInfo findBMapInfoById(String id)
  {
    AjaxDto<BMapInfo> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from BMapInfo where gpsLatitude = '%s'", new Object[] { id }), null);
    List<BMapInfo> infos = ajaxDto.getPageList();
    if ((infos != null) && (infos.size() > 0)) {
      return (BMapInfo)infos.get(0);
    }
    return null;
  }
  
  public AjaxDto<GMapInfo> findAllGMapInfo(Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr("from GMapInfo", pagination);
  }
  
  public GMapInfo findGMapInfoById(String id)
  {
    AjaxDto<GMapInfo> ajaxDto = this.paginationDao.getPgntByQueryStr(String.format("from GMapInfo where gpsLatitude = '%s'", new Object[] { id }), null);
    List<GMapInfo> infos = ajaxDto.getPageList();
    if ((infos != null) && (infos.size() > 0)) {
      return (GMapInfo)infos.get(0);
    }
    return null;
  }
  
  public UserInfo findByName(String name)
  {
    return this.userInfoDao.findByName(name);
  }
  
  public List<Integer> getCompanyIdList(Integer companyId, List<Integer> lstLevel, boolean isAdmin)
  {
    return this.userLogDao.getCompanyIdList(companyId, lstLevel, isAdmin);
  }
  
  public List<StandardCompany> getStandardCompanyList(List<Integer> companyIds)
  {
    return this.userLogDao.getStandardCompanyList(companyIds);
  }
  
  public Integer getCompanyRelationCount(Integer companyId, Integer childId)
  {
    return this.userLogDao.getCompanyRelationCount(companyId, childId);
  }
  
  public List<String> getStandardVehiIdnoList(List<Integer> lstId, String condition)
  {
    return this.userLogDao.getStandardVehiIdnoList(lstId, condition);
  }
  
  public List<StandardUserVehiPermitEx> getAuthorizedVehicleList(Integer userId, String vehiIdno, String condition)
  {
    return this.userLogDao.getAuthorizedVehicleList(userId, vehiIdno, condition);
  }
  
  public List<StandardVehiDevRelationExMore> getStandardVehiDevRelationExMoreList(List<String> vehiIDNOs, List<String> devIDNOs, List<QueryScalar> scalars, String fieldCondition, String queryCondition)
  {
    return this.userLogDao.getStandardVehiDevRelationExMoreList(vehiIDNOs, devIDNOs, scalars, fieldCondition, queryCondition);
  }
  
  public AjaxDto<StandardVehicle> findAllVehicles(Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr("from StandardVehicle", pagination);
  }
}
