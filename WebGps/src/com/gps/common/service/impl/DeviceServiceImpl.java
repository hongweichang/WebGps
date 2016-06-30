package com.gps.common.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.action.BaseAction;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.common.dao.DevRegistDao;
import com.gps.common.dao.DeviceInfoDao;
import com.gps.common.service.DeviceService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceBrand;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.DeviceStatusLite;
import com.gps.model.DeviceTemp;
import com.gps.model.DeviceType;
import com.gps.model.DeviceYouLiang;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.vo.StandardDeviceInfo;
import com.gps.vo.VehicleInfo;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Hibernate;

public class DeviceServiceImpl
  extends UniversalServiceImpl
  implements DeviceService
{
  private DeviceInfoDao deviceInfoDao;
  private DevRegistDao devRegistDao;
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DeviceInfo.class;
  }
  
  public DeviceInfoDao getDeviceInfoDao()
  {
    return this.deviceInfoDao;
  }
  
  public void setDeviceInfoDao(DeviceInfoDao deviceInfoDao)
  {
    this.deviceInfoDao = deviceInfoDao;
  }
  
  public DevRegistDao getDevRegistDao()
  {
    return this.devRegistDao;
  }
  
  public void setDevRegistDao(DevRegistDao devRegistDao)
  {
    this.devRegistDao = devRegistDao;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public int getRegistCount()
  {
    return this.devRegistDao.getRegistNumber().intValue();
  }
  
  public long getServerConfig()
  {
    return this.devRegistDao.getServerConfig().longValue();
  }
  
  public int getDeviceCount(String name, Integer clientId, Integer groupId)
  {
    return this.deviceInfoDao.getDeviceCount(getQueryString(name, clientId, groupId, null, null, "DeviceInfo"));
  }
  
  public int getStoreCount()
  {
    return this.deviceInfoDao.getDeviceCount(String.format("from DeviceInfo where userID = %d", new Object[] { Integer.valueOf(0) }));
  }
  
  protected String getQueryString(String name, Integer clientId, Integer groupId, Integer devType, Integer expireDay, String table)
  {
    StringBuffer strQuery = new StringBuffer(String.format("from %s where 1 = 1 ", new Object[] { table }));
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format("and (userAccount.name like '%%%s%%' or idno like '%%%s%%' or simCard like '%%%s%%') ", new Object[] { name, name, name }));
    }
    if (clientId != null) {
      strQuery.append(String.format("and userId = %d ", new Object[] { clientId }));
    }
    if (groupId != null) {
      strQuery.append(String.format("and devGroupId = %d ", new Object[] { groupId }));
    }
    if (devType != null) {
      strQuery.append(String.format("and devType = %d ", new Object[] { devType }));
    }
    return strQuery.toString();
  }
  
  protected List<QueryScalar> getDeviceQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    
    scalars.add(new QueryScalar("id", Hibernate.INTEGER));
    scalars.add(new QueryScalar("idno", Hibernate.STRING));
    scalars.add(new QueryScalar("devType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("devSubType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("factory", Hibernate.INTEGER));
    scalars.add(new QueryScalar("icon", Hibernate.INTEGER));
    scalars.add(new QueryScalar("simCard", Hibernate.STRING));
    
    scalars.add(new QueryScalar("chnCount", Hibernate.INTEGER));
    scalars.add(new QueryScalar("chnName", Hibernate.STRING));
    scalars.add(new QueryScalar("ioInCount", Hibernate.INTEGER));
    scalars.add(new QueryScalar("ioInName", Hibernate.STRING));
    scalars.add(new QueryScalar("tempCount", Hibernate.INTEGER));
    scalars.add(new QueryScalar("tempName", Hibernate.STRING));
    
    scalars.add(new QueryScalar("userID", Hibernate.INTEGER));
    scalars.add(new QueryScalar("devGroupId", Hibernate.INTEGER));
    scalars.add(new QueryScalar("module", Hibernate.INTEGER));
    
    scalars.add(new QueryScalar("userSex", Hibernate.INTEGER));
    scalars.add(new QueryScalar("userCardID", Hibernate.STRING));
    scalars.add(new QueryScalar("userIDNO", Hibernate.STRING));
    
    scalars.add(new QueryScalar("userPost", Hibernate.INTEGER));
    scalars.add(new QueryScalar("userAddress", Hibernate.STRING));
    scalars.add(new QueryScalar("userEquip", Hibernate.INTEGER));
    scalars.add(new QueryScalar("Remarks", Hibernate.STRING));
    
    scalars.add(new QueryScalar("audioCodec", Hibernate.INTEGER));
    scalars.add(new QueryScalar("protocol", Hibernate.INTEGER));
    scalars.add(new QueryScalar("diskType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("netAddrType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("mapType", Hibernate.INTEGER));
    scalars.add(new QueryScalar("mapValid", Hibernate.INTEGER));
    scalars.add(new QueryScalar("jingDu", Hibernate.INTEGER));
    scalars.add(new QueryScalar("weiDu", Hibernate.INTEGER));
    scalars.add(new QueryScalar("payEnable", Hibernate.INTEGER));
    scalars.add(new QueryScalar("payBegin", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("payPeriod", Hibernate.INTEGER));
    scalars.add(new QueryScalar("payMonth", Hibernate.INTEGER));
    scalars.add(new QueryScalar("payDelayDay", Hibernate.INTEGER));
    
    scalars.add(new QueryScalar("name", Hibernate.STRING));
    scalars.add(new QueryScalar("account", Hibernate.STRING));
    scalars.add(new QueryScalar("password", Hibernate.STRING));
    scalars.add(new QueryScalar("type", Hibernate.INTEGER));
    scalars.add(new QueryScalar("validity", Hibernate.TIMESTAMP));
    return scalars;
  }
  
  protected DeviceInfo createDeviceInfo(DeviceTemp temp)
  {
    DeviceInfo device = new DeviceInfo();
    
    device.setId(temp.getId());
    device.setIdno(temp.getIdno());
    device.setDevType(temp.getDevType());
    device.setDevSubType(temp.getDevSubType());
    device.setFactory(temp.getFactory());
    device.setIcon(temp.getIcon());
    device.setChnCount(temp.getChnCount());
    device.setChnName(temp.getChnName());
    device.setIoInCount(temp.getIoInCount());
    device.setIoInName(temp.getIoInName());
    device.setTempCount(temp.getTempCount());
    device.setTempName(temp.getTempName());
    
    device.setSimCard(temp.getSimCard());
    device.setVehiBand(temp.getVehiBand());
    device.setVehiType(temp.getVehiType());
    device.setVehiUse(temp.getVehiUse());
    device.setVehiColor(temp.getVehiColor());
    device.setVehiCompany(temp.getVehiCompany());
    device.setDriverName(temp.getDriverName());
    device.setDriverTele(temp.getDriverTele());
    device.setDateProduct(temp.getDateProduct());
    
    device.setUserID(temp.getUserID());
    device.setDevGroupId(temp.getDevGroupId());
    device.setModule(temp.getModule());
    device.setUserSex(temp.getUserSex());
    device.setUserCardID(temp.getUserCardID());
    device.setUserIDNO(temp.getUserIDNO());
    device.setModule(temp.getUserPost());
    device.setUserAddress(temp.getUserAddress());
    device.setUserEquip(temp.getUserEquip());
    device.setRemarks(temp.getRemarks());
    
    device.setAudioCodec(temp.getAudioCodec());
    device.setProtocol(temp.getProtocol());
    device.setDiskType(temp.getDiskType());
    device.setNetAddrType(temp.getNetAddrType());
    device.setMapType(temp.getMapType());
    device.setMapValid(temp.getMapValid());
    device.setJingDu(temp.getJingDu());
    device.setWeiDu(temp.getWeiDu());
    
    device.setPayEnable(temp.getPayEnable());
    device.setPayBegin(temp.getPayBegin());
    device.setPayPeriod(temp.getPayPeriod());
    device.setPayMonth(temp.getPayMonth());
    device.setPayDelayDay(temp.getPayDelayDay());
    
    UserAccount account = new UserAccount();
    account.setName(temp.getName());
    account.setAccount(temp.getAccount());
    account.setPassword(temp.getPassword());
    account.setType(temp.getType());
    account.setValidity(temp.getValidity());
    device.setUserAccount(account);
    
    device.setUserInfo(null);
    
    return device;
  }
  
  public AjaxDto<DeviceInfo> getDeviceList(String name, Integer clientId, Integer devType, Integer expireDay, Pagination pagination, String condition)
  {
    StringBuffer strQuery = new StringBuffer(" select * from account,dev_info where account.account = dev_info.idno ");
    if ((name != null) && (!name.isEmpty())) {
      strQuery.append(String.format("and (account.name like '%%%s%%' or dev_info.idno like '%%%s%%' or dev_info.simCard like '%%%s%%') ", new Object[] { name, name, name }));
    }
    boolean queryClient = false;
    if (clientId != null)
    {
      strQuery.append(String.format("and dev_info.userId = %d ", new Object[] { clientId }));
      queryClient = true;
    }
    if (devType != null) {
      strQuery.append(String.format("and dev_info.devType = %d ", new Object[] { devType }));
    }
    if (expireDay != null)
    {
      if (!queryClient) {
        strQuery.append(String.format("and dev_info.userId != %d ", new Object[] { Integer.valueOf(0) }));
      }
      strQuery.append("and payEnable = 1 ");
      if (BaseAction.getEnableSqlServer())
      {
        if (expireDay.intValue() == 0)
        {
          strQuery.append("and ( (DATEDIFF(dd, payBegin + payMonth + payDelayDay,getdate())) <= 0 ) ");
        }
        else
        {
          strQuery.append("and ( ( DATEDIFF(dd, payBegin + payMonth + payDelayDay,getdate())) > 0  ) ");
          strQuery.append(String.format("and ( ( DATEDIFF(dd, payBegin + payMonth + payDelayDay,getdate())) <= %d  ) ", new Object[] { expireDay }));
        }
      }
      else if (expireDay.intValue() == 0)
      {
        strQuery.append("and ( TO_DAYS(payBegin + INTERVAL payMonth Month + INTERVAL payDelayDay Day) <= TO_DAYS(now()) ) ");
      }
      else
      {
        strQuery.append("and ( ( TO_DAYS(payBegin + INTERVAL payMonth Month + INTERVAL payDelayDay Day) ) - TO_DAYS(now()) > 0  ) ");
        strQuery.append(String.format("and ( ( TO_DAYS(payBegin + INTERVAL payMonth Month + INTERVAL payDelayDay Day) ) - TO_DAYS(now()) <= %d  ) ", new Object[] { expireDay }));
      }
    }
    if ((condition != null) && (!condition.isEmpty())) {
      strQuery.append(condition);
    }
    AjaxDto<DeviceTemp> ajax = this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getDeviceQueryScalar(), DeviceTemp.class, null);
    if (ajax == null) {
      return null;
    }
    AjaxDto<DeviceInfo> ajaxDto = new AjaxDto();
    ajaxDto.setPagination(ajax.getPagination());
    if (ajax.getPageList() != null)
    {
      AjaxDto<UserInfo> ajaxUser = this.paginationDao.getPgntByQueryStr("from UserInfo", null);
      Map<Integer, UserInfo> mapUser = new HashMap();
      if (ajaxUser.getPageList() != null) {
        for (int i = 0; i < ajaxUser.getPageList().size(); i++)
        {
          UserInfo user = (UserInfo)ajaxUser.getPageList().get(i);
          mapUser.put(user.getId(), user);
        }
      }
      List<DeviceInfo> devList = new ArrayList();
      for (int i = 0; i < ajax.getPageList().size(); i++)
      {
        DeviceInfo device = createDeviceInfo((DeviceTemp)ajax.getPageList().get(i));
        device.setUserInfo((UserInfo)mapUser.get(device.getUserID()));
        device.setPayBeginStr(DateUtil.dateSwitchDateString(device.getPayBegin()));
        devList.add(device);
      }
      ajaxDto.setPageList(devList);
    }
    return ajaxDto;
  }
  
  public AjaxDto<DeviceBase> getClientDeviceList(String name, Integer clientId, Integer devType, Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr(getQueryString(name, clientId, null, devType, null, "DeviceBase"), pagination);
  }
  
  public AjaxDto<DeviceBase> getUserDeviceList(String name, Integer accountId, Integer devType, Pagination pagination)
  {
    String query = getQueryString(name, null, null, devType, null, "DeviceBase");
    query = query + String.format(" and idno in (select devIdno from UserDevPermit where AccountId = %d)", new Object[] { accountId });
    return this.paginationDao.getPgntByQueryStr(query, pagination);
  }
  
  public AjaxDto<DeviceInfo> getFreeStoRelationDeviceList(String name, Pagination pagination)
  {
    String query = getQueryString(name, null, null, null, null, "DeviceInfo");
    query = query + String.format(" and idno not in (select devIdno from StorageRelation) ", new Object[0]);
    return this.paginationDao.getPgntByQueryStr(query, pagination);
  }
  
  public AjaxDto<DeviceStatus> getDeviceStatus(List<DeviceBase> lstDevice)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceStatus where 1 = 1 ");
    if (lstDevice.size() > 0)
    {
      for (int i = 0; i < lstDevice.size(); i++) {
        if (i == 0) {
          strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { ((DeviceBase)lstDevice.get(i)).getIdno() }));
        } else {
          strQuery.append(String.format("or devIdno = '%s' ", new Object[] { ((DeviceBase)lstDevice.get(i)).getIdno() }));
        }
      }
      strQuery.append(")");
    }
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), null);
  }
  
  public AjaxDto<DeviceStatus> getDeviceStatus(String[] devIdnos)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceStatus where 1 = 1 ");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          strQuery.append(String.format("and (devIdno = '%s' ", new Object[] { devIdnos[i] }));
        } else {
          strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIdnos[i] }));
        }
      }
      strQuery.append(")");
    }
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), null);
  }
  
  public AjaxDto<DeviceStatusLite> getDeviceStatusLite(String[] devIdnos)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceStatusLite where 1 = 1 ");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          strQuery.append(String.format("and (id = '%s' ", new Object[] { devIdnos[i] }));
        } else {
          strQuery.append(String.format("or id = '%s' ", new Object[] { devIdnos[i] }));
        }
      }
      strQuery.append(")");
    }
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), null);
  }
  
  public List<DeviceInfo> getDeviceIdnos(String[] devIdnos)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceInfo where 1 = 1 ");
    if (devIdnos.length > 0)
    {
      for (int i = 0; i < devIdnos.length; i++) {
        if (i == 0) {
          strQuery.append(String.format("and (idno = '%s' ", new Object[] { devIdnos[i] }));
        } else {
          strQuery.append(String.format("or idno = '%s' ", new Object[] { devIdnos[i] }));
        }
      }
      strQuery.append(")");
    }
    AjaxDto<DeviceInfo> ajaxDevs = this.paginationDao.getPgntByQueryStr(strQuery.toString(), null);
    return ajaxDevs.getPageList();
  }
  
  public DeviceInfo findDeviceByIdno(String idno)
  {
    return this.deviceInfoDao.findByIdno(idno);
  }
  
  public DeviceBase findDeviceByIdnoEx(String idno)
  {
    return this.deviceInfoDao.findByIdnoEx(idno);
  }
  
  public DeviceInfo getDeviceInfo(String idno)
  {
    return this.deviceInfoDao.get(idno);
  }
  
  public synchronized Boolean addDeviceInfo(DeviceInfo devInfo)
  {
    if (getDeviceCount(null, null, null) >= this.devRegistDao.getRegistNumber().intValue()) {
      return Boolean.valueOf(false);
    }
    this.deviceInfoDao.save(devInfo);
    return Boolean.valueOf(true);
  }
  
  public synchronized Boolean batchAddDevice(List<DeviceInfo> devlists)
  {
    if (getDeviceCount(null, null, null) + devlists.size() > this.devRegistDao.getRegistNumber().intValue()) {
      return Boolean.valueOf(false);
    }
    this.deviceInfoDao.batchSave(devlists);
    return Boolean.valueOf(true);
  }
  
  public void batchDelDevice(List<DeviceInfo> devlists)
  {
    this.deviceInfoDao.batchDelete(devlists);
  }
  
  public void editDeviceInfo(DeviceInfo devInfo)
  {
    this.deviceInfoDao.update(devInfo);
  }
  
  public void batchEditDevice(List<DeviceInfo> devlists)
  {
    this.deviceInfoDao.batchUpdate(devlists);
  }
  
  public void delDeviceInfo(DeviceInfo devInfo)
  {
    this.deviceInfoDao.delete(devInfo);
  }
  
  public void updateDeviceAccountId(String idno, Integer accountId)
  {
    this.paginationDao.execNativeSql(String.format("update dev_info set accountid = %d where idno = '%s'", new Object[] { accountId, idno }));
  }
  
  public void deleteDeviceNative(String idno)
  {
    String queryString = String.format("delete from dev_info where idno = '%s'", new Object[] { idno });
    this.paginationDao.execNativeSql(queryString);
    queryString = String.format("delete from account where account = '%s'", new Object[] { idno });
    this.paginationDao.execNativeSql(queryString);
  }
  
  public AjaxDto<DeviceStatus> getStandardDeviceStatus(List<VehicleInfo> vehicles)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceStatus where 1 = 1 ");
    if (vehicles.size() > 0)
    {
      int index = 0;
      for (int i = 0; i < vehicles.size(); i++)
      {
        List<StandardDeviceInfo> devices = ((VehicleInfo)vehicles.get(i)).getDevice();
        for (int j = 0; j < devices.size(); j++) {
          if (index == 0)
          {
            strQuery.append(String.format("and (devIDNO = '%s' ", new Object[] { ((StandardDeviceInfo)devices.get(j)).getDevIDNO() }));
            index++;
          }
          else
          {
            strQuery.append(String.format("or devIDNO = '%s' ", new Object[] { ((StandardDeviceInfo)devices.get(j)).getDevIDNO() }));
          }
        }
      }
      strQuery.append(")");
    }
    return this.paginationDao.getPgntByQueryStr(strQuery.toString(), null);
  }
  
  public AjaxDto<DeviceType> getVehiType(Pagination pagination)
  {
    return this.paginationDao.getPgntByQueryStr("from DeviceType", pagination);
  }
  
  public DeviceType getVehiTypeByName(String name)
  {
    return this.deviceInfoDao.findTypeByName(name);
  }
  
  public List<DeviceBrand> getVehiBrand()
  {
    return this.deviceInfoDao.findAllBrand();
  }
  
  public DeviceBrand getVehiBrandByName(String name)
  {
    return this.deviceInfoDao.findBrandByName(name);
  }
  
  public void updateVehiTypeName(DeviceType deviceType)
  {
    this.deviceInfoDao.updateVehiTypeName(deviceType);
  }
  
  public void updateVehiBrandName(DeviceBrand deviceBrand)
  {
    this.deviceInfoDao.updateVehiBrandName(deviceBrand);
  }
  
  public DeviceYouLiang getDeviceYouLiang(String devIdno)
  {
    return this.deviceInfoDao.findYouLiangByIdno(devIdno);
  }
}
