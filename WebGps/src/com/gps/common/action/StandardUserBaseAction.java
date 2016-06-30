package com.gps.common.action;

import com.framework.listener.MyServletContextListener;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.common.service.StorageRelationService;
import com.gps.common.service.UserService;
import com.gps.model.ServerInfo;
import com.gps.model.UserSession;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardCompanyRelation;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehicle;
import com.gps808.model.line.StandardLineInfo;
import com.gps808.monitor.service.StandardMonitorService;
import com.gps808.operationManagement.service.StandardLineService;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardUserAccountEx;
import com.gps808.operationManagement.vo.StandardVehicleEx;
import com.gps808.rule.service.StandardVehicleRuleService;
import com.opensymphony.xwork2.ActionContext;
import java.io.File;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;

public abstract class StandardUserBaseAction
  extends BaseAction
{
  private static final long serialVersionUID = 1L;
  protected StandardUserService standardUserService;
  protected static UserService userService;
  protected NotifyService notifyService;
  protected StandardVehicleRuleService vehicleRuleService;
  protected DeviceService deviceService;
  protected StorageRelationService storageRelationService;
  protected ServerService serverService;
  protected StandardMonitorService standardMonitorService;
  protected StandardLineService standardLineService;
  protected File uploadFile;
  protected String uploadFileFileName;
  protected String uploadFileContentType;
  
  public StandardMonitorService getStandardMonitorService()
  {
    return this.standardMonitorService;
  }
  
  public void setStandardMonitorService(StandardMonitorService standardMonitorService)
  {
    this.standardMonitorService = standardMonitorService;
  }
  
  public ServerService getServerService()
  {
    return this.serverService;
  }
  
  public void setServerService(ServerService serverService)
  {
    this.serverService = serverService;
  }
  
  public StorageRelationService getStorageRelationService()
  {
    return this.storageRelationService;
  }
  
  public void setStorageRelationService(StorageRelationService storageRelationService)
  {
    this.storageRelationService = storageRelationService;
  }
  
  public DeviceService getDeviceService()
  {
    return this.deviceService;
  }
  
  public void setDeviceService(DeviceService deviceService)
  {
    this.deviceService = deviceService;
  }
  
  public StandardVehicleRuleService getVehicleRuleService()
  {
    return this.vehicleRuleService;
  }
  
  public void setVehicleRuleService(StandardVehicleRuleService vehicleRuleService)
  {
    this.vehicleRuleService = vehicleRuleService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public StandardUserService getStandardUserService()
  {
    return this.standardUserService;
  }
  
  public void setStandardUserService(StandardUserService standardUserService)
  {
    this.standardUserService = standardUserService;
  }
  
  
public UserService getUserService()
  {
    return this.userService;
  }
  
public void setUserService(UserService userService)
  {
   this.userService = userService;
  }
  
  public StandardLineService getStandardLineService()
  {
    return this.standardLineService;
  }
  
  public void setStandardLineService(StandardLineService standardLineService)
  {
    this.standardLineService = standardLineService;
  }
  
  public File getUploadFile()
  {
    return this.uploadFile;
  }
  
  public void setUploadFile(File uploadFile)
  {
    this.uploadFile = uploadFile;
  }
  
  public String getUploadFileFileName()
  {
    return this.uploadFileFileName;
  }
  
  public void setUploadFileFileName(String uploadFileFileName)
  {
    this.uploadFileFileName = uploadFileFileName;
  }
  
  public String getUploadFileContentType()
  {
    return this.uploadFileContentType;
  }
  
  public void setUploadFileContentType(String uploadFileContentType)
  {
    this.uploadFileContentType = uploadFileContentType;
  }
  
  protected String getExcelCellString(HSSFRow row, int i)
  {
    HSSFCell cell = row.getCell(i);
    if (cell != null) {
      return cell.toString().trim();
    }
    return "";
  }
  
  protected String getExcelCellDecimalString(HSSFRow row, int i)
  {
    HSSFCell cell = row.getCell(i);
    if (cell != null)
    {
      String value = cell.toString().trim();
      if (value.indexOf(".") == -1) {
        return value;
      }
      return value.substring(0, value.indexOf("."));
    }
    return "";
  }
  
  protected String formatPosition(Integer position)
  {
    if (position != null)
    {
      double db = position.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000000");
      return format.format(db / 1000000.0D).replace(',', '.');
    }
    return "";
  }
  
  protected boolean isGpsValid(Integer status1)
  {
    if ((status1 != null) && ((status1.intValue() & 0x1) == 1)) {
      return true;
    }
    return false;
  }
  
  protected String getSpeed(Integer speed, Integer status1)
  {
    if (isGpsValid(status1))
    {
      double db = speed.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.0");
      return format.format(db / 10.0D);
    }
    return "";
  }
  
  protected String getLiCheng(Integer licheng)
  {
    if ((licheng != null) && (licheng.intValue() >= 0))
    {
      double db = licheng.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000");
      return format.format(db / 1000.0D);
    }
    return "0";
  }
  
  protected void updateSessionPrivilege(StandardUserAccount userAccount)
  {
    ActionContext ctx = ActionContext.getContext();
    if ((isAdmin()) || (isMaster())) {
      ctx.getSession().put("privilege", StandardUserRole.getUserRole());
    } else if ((userAccount != null) && (userAccount.getRole() != null)) {
      ctx.getSession().put("privilege", userAccount.getRole().getPrivilege());
    } else {
      ctx.getSession().put("privilege", "");
    }
  }
  
  protected Integer getSessionUserId()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String s = (String)ctx.getSession().get("userid");
    if (s != null)
    {
      Integer usrid = Integer.valueOf(Integer.parseInt(s));
      if (usrid != null) {
        return usrid;
      }
    }
    return null;
  }
  
  protected void addUserLog(Integer mainType, Integer subType, String vehiIDNO, String param1, String param2, String param3, String param4)
  {
    Integer userId = getSessionUserId();
    if (userId != null) {
      userService.addUserLog(userId, mainType, subType, 
        vehiIDNO, param1, param2, param3, param4);
    }
  }
  
  protected boolean isRole(String role)
  {
    if ((isAdmin()) || (isMaster())) {
      return true;
    }
    ActionContext ctx = ActionContext.getContext();
    String roleStr = (String)ctx.getSession().get("privilege");
    if (roleStr != null)
    {
      String find = "," + role.toString() + ",";
      int index = roleStr.indexOf(find);
      if (index >= 0) {
        return true;
      }
      return false;
    }
    return false;
  }
  
  protected boolean isAdmin()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String account = (String)ctx.getSession().get("account808");
    if ((account != null) && (account.equals("admin"))) {
      return true;
    }
    return false;
  }
  
  protected boolean isMaster()
  {
    ActionContext ctx = ActionContext.getContext();
    
    String userId = (String)ctx.getSession().get("userid");
    StandardCompany company = (StandardCompany)ctx.getSession().get("company");
    if ((company.getAccountID() != null) && (Integer.parseInt(userId) == company.getAccountID().intValue())) {
      return true;
    }
    return false;
  }
  
  protected int gpsGetDirection(int huangXiang)
  {
    return (huangXiang + 22) / 45 & 0x7;
  }
  
  protected String getDirectionString(int huangXiang)
  {
    int direction = gpsGetDirection(huangXiang);
    String str = "";
    switch (direction)
    {
    case 0: 
      str = getText("north");
      break;
    case 1: 
      str = getText("northEast");
      break;
    case 2: 
      str = getText("east");
      break;
    case 3: 
      str = getText("southEast");
      break;
    case 4: 
      str = getText("south");
      break;
    case 5: 
      str = getText("southWest");
      break;
    case 6: 
      str = getText("west");
      break;
    case 7: 
      str = getText("northWest");
      break;
    }
    return str;
  }
  
  protected String getAccountName(Integer userId)
  {
    if (userId != null) {
      return this.standardUserService.getStandardUserAccountName(userId);
    }
    return null;
  }
  
  protected String getParentCompanyName(Integer id)
  {
    StandardCompany parentComp = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, id);
    if (parentComp != null) {
      return parentComp.getName();
    }
    return "";
  }
  
  protected List<Integer> findUserChildCompanyIdList(Integer companyId, List<Integer> lstLevel, boolean isAdmin)
  {
    return this.standardUserService.getCompanyIdList(companyId, lstLevel, isAdmin);
  }
  
  protected List<Integer> findUserChildIdList(Integer companyId)
  {
    return this.standardUserService.getChildIdList(companyId);
  }
  
  protected List<Integer> findUserCompanyIdList(Integer companyId, List<Integer> lstLevel, boolean isAdmin)
  {
    if (isAdmin) {
      return findUserChildCompanyIdList(companyId, lstLevel, isAdmin);
    }
    List<Integer> lstCompanyId = findUserChildCompanyIdList(companyId, lstLevel, isAdmin);
    if (lstCompanyId == null) {
      lstCompanyId = new ArrayList();
    }
    lstCompanyId.add(companyId);
    return lstCompanyId;
  }
  
  protected List<StandardCompany> findUserChildCompanys(StandardCompany company, List<Integer> lstLevel, boolean isAdmin, boolean isParentName, boolean isAccountName)
  {
    List<StandardCompany> companys = new ArrayList();
    Integer parentId = null;
    if (!isAdmin) {
      parentId = company.getId();
    }
    List<Integer> lstCompanyId = this.standardUserService.getCompanyIdList(parentId, lstLevel, isAdmin);
    if ((lstCompanyId != null) && (lstCompanyId.size() > 0)) {
      companys = this.standardUserService.getStandardCompanyList(lstCompanyId);
    }
    if (companys != null) {
      for (int i = companys.size() - 1; i >= 0; i--)
      {
        StandardCompany compy = (StandardCompany)companys.get(i);
        if (isParentName) {
          compy.setParentName(getParentCompanyName(compy.getParentId()));
        }
        if (isAccountName) {
          compy.setAccountName(getAccountName(compy.getAccountID()));
        }
        compy.setIsMine(Integer.valueOf(0));
        if (compy.getId().intValue() == -1) {
          companys.remove(i);
        }
      }
    }
    return companys;
  }
  
  protected List<StandardCompany> findUserCompanys(StandardCompany company, List<Integer> lstLevel, boolean isAdmin, boolean isParentName, boolean isAccountName)
  {
    List<StandardCompany> companys = findUserChildCompanys(company, lstLevel, isAdmin, isParentName, isAccountName);
    if (companys == null) {
      companys = new ArrayList();
    }
    if (!isAdmin)
    {
      if (isParentName) {
        company.setParentName(getParentCompanyName(company.getParentId()));
      }
      if (isAccountName) {
        company.setAccountName(getAccountName(company.getAccountID()));
      }
      company.setIsMine(Integer.valueOf(1));
      if (lstLevel != null)
      {
        if (lstLevel.contains(Integer.valueOf(3)))
        {
          if (company.getLevel().intValue() == 3) {
            companys.add(company);
          }
        }
        else {
          companys.add(company);
        }
      }
      else {
        companys.add(company);
      }
    }
    return companys;
  }
  
  protected AjaxDto<StandardCompany> doCompanySummary(List<StandardCompany> companys, Pagination pagination)
  {
    int start = 0;int index = companys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardCompany> newCompanys = new ArrayList();
    for (int i = start; i < index; i++) {
      newCompanys.add((StandardCompany)companys.get(i));
    }
    AjaxDto<StandardCompany> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newCompanys);
    return dtoSummary;
  }
  
  protected AjaxDto<StandardUserRole> getUserRoles(StandardCompany company, boolean isAdmin, String condition, Pagination pagination, boolean vihicle)
  {
    List<Integer> lstId = new ArrayList();
    if (!isAdmin) {
      if (!vihicle) {
        lstId = findUserCompanyIdList(company.getId(), null, false);
      } else {
        lstId.add(company.getId());
      }
    }
    return this.standardUserService.getStandardRoleList(lstId, condition, pagination);
  }
  
  protected AjaxDto<StandardSIMCardInfo> getSIMS(StandardCompany company, String condition, Pagination pagination)
  {
    List<Integer> lstId = new ArrayList();
    if (!isAdmin()) {
      lstId = findUserCompanyIdList(company.getId(), null, false);
    }
    return this.standardUserService.getStandardSIMList(lstId, condition, pagination);
  }
  
  protected AjaxDto<StandardDevice> getDevices(StandardCompany company, String condition, Pagination pagination)
  {
    List<Integer> lstId = new ArrayList();
    if (!isAdmin()) {
      lstId = findUserCompanyIdList(company.getId(), null, false);
    }
    return this.standardUserService.getStandardDeviceList(lstId, condition, pagination);
  }
  
  protected AjaxDto<StandardVehicle> getUserVehicles(Integer companyId, List<Integer> companyIds, String condition, boolean isAdmin, Pagination pagination)
  {
    if ((!isAdmin) && (companyIds == null)) {
      companyIds = findUserCompanyIdList(companyId, null, isAdmin);
    }
    return this.standardUserService.getStandardVehicleList(companyIds, condition, pagination);
  }
  
  protected AjaxDto<StandardVehicle> getVehicles(StandardCompany company, List<StandardCompany> companys, String condition, boolean isAdmin, Pagination pagination)
  {
    List<Integer> lstId = new ArrayList();
    if ((!isAdmin) && (companys == null)) {
      companys = findUserCompanys(company, null, isAdmin, false, false);
    }
    if ((companys != null) && (companys.size() > 0)) {
      for (int i = 0; i < companys.size(); i++) {
        lstId.add(((StandardCompany)companys.get(i)).getId());
      }
    }
    return this.standardUserService.getStandardVehicleList(lstId, condition, pagination);
  }
  
  protected List<StandardVehicle> getVehiclesMaturity(Integer companyId, String begin, String end, List<Integer> companyIds, String condition, boolean isAdmin)
  {
    List<StandardVehicle> vehicles = new ArrayList();
    if ((!isAdmin) && (companyIds == null)) {
      companyIds = findUserCompanyIdList(companyId, null, isAdmin);
    }
    vehicles = this.standardUserService.getVehicleMaturitys(companyIds, begin, end, condition);
    return vehicles;
  }
  
  public AjaxDto<StandardVehicle> doSummaryVehicleEx(List<StandardVehicle> vehicles, Pagination pagination)
  {
    int start = 0;int index = vehicles.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      if (pagination.getCurrentPage() == 0) {
        pagination.setCurrentPage(1);
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardVehicle> newVehicles = new ArrayList();
    for (int i = start; i < index; i++) {
      newVehicles.add((StandardVehicle)vehicles.get(i));
    }
    AjaxDto<StandardVehicle> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newVehicles);
    return dtoSummary;
  }
  
  public AjaxDto<StandardVehicleEx> doSummaryVehicleLiteEx(List<StandardVehicleEx> vehicleExs, Pagination pagination)
  {
    int start = 0;int index = vehicleExs.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardVehicleEx> newVehicles = new ArrayList();
    for (int i = start; i < index; i++) {
      newVehicles.add((StandardVehicleEx)vehicleExs.get(i));
    }
    AjaxDto<StandardVehicleEx> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newVehicles);
    return dtoSummary;
  }
  
  public AjaxDto<StandardUserAccount> doSummaryUserEx(List<StandardUserAccount> users, Pagination pagination)
  {
    int start = 0;int index = users.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardUserAccount> newUsers = new ArrayList();
    for (int i = start; i < index; i++) {
      newUsers.add((StandardUserAccount)users.get(i));
    }
    AjaxDto<StandardUserAccount> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newUsers);
    return dtoSummary;
  }
  
  protected AjaxDto<StandardUserAccount> getUserAccounts(String condition, Pagination pagination)
  {
    StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
    AjaxDto<StandardUserAccount> users = new AjaxDto();
    boolean isAdmin = isAdmin();
    List<Integer> lstId = new ArrayList();
    if (!isAdmin)
    {
      List<Integer> lstLevel = new ArrayList();
      lstLevel.add(Integer.valueOf(1));
      lstId = findUserCompanyIdList(userAccount.getCompany().getId(), lstLevel, false);
    }
    users = this.standardUserService.getStandardUsersList(lstId, null, condition, pagination);
    if ((!isAdmin) && 
      (users.getPageList() != null)) {
      for (int i = 0; i < users.getPageList().size(); i++) {
        if (((StandardUserAccount)users.getPageList().get(i)).getId().intValue() == userAccount.getId().intValue())
        {
          ((StandardUserAccount)users.getPageList().get(i)).setIsMine(Integer.valueOf(1));
          break;
        }
      }
    }
    return users;
  }
  
  protected AjaxDto<StandardUserAccountEx> getUserAccountsEx(AjaxDto<StandardUserAccount> dtoUsers)
  {
    List<StandardUserAccountEx> lstUserEx = new ArrayList();
    if ((dtoUsers != null) && (dtoUsers.getPageList() != null) && (dtoUsers.getPageList().size() > 0))
    {
      int lstUsers = dtoUsers.getPageList().size();
      for (int i = 0; i < lstUsers; i++)
      {
        StandardUserAccount user = (StandardUserAccount)dtoUsers.getPageList().get(i);
        StandardUserAccountEx userEx = new StandardUserAccountEx(user);
        lstUserEx.add(userEx);
      }
    }
    AjaxDto<StandardUserAccountEx> dtoUsersEx = new AjaxDto();
    dtoUsersEx.setPageList(lstUserEx);
    dtoUsersEx.setPagination(dtoUsers.getPagination());
    return dtoUsersEx;
  }
  
  protected AjaxDto<StandardDriver> getDrivers(String condition, Pagination pagination)
  {
    StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
    List<Integer> lstId = new ArrayList();
    if (!isAdmin())
    {
      List<Integer> lstLevel = new ArrayList();
      lstLevel.add(Integer.valueOf(1));
      lstId = findUserCompanyIdList(userAccount.getCompany().getId(), lstLevel, false);
    }
    return this.standardUserService.getStandardDriverList(lstId, condition, pagination);
  }
  
  public AjaxDto<StandardLineInfo> doSummaryLineInfo(List<StandardLineInfo> lstLineInfo, Pagination pagination)
  {
    int start = 0;int index = lstLineInfo.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(index);
      if (index >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardLineInfo> newLineInfos = new ArrayList();
    for (int i = start; i < index; i++) {
      newLineInfos.add((StandardLineInfo)lstLineInfo.get(i));
    }
    AjaxDto<StandardLineInfo> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(newLineInfos);
    return dtoSummary;
  }
  
  protected boolean isSIMExist(StandardSIMCardInfo sim)
  {
    StandardSIMCardInfo oldSim = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, sim.getCardNum());
    if ((oldSim == null) || ((sim.getId() != null) && (oldSim.getId().intValue() == sim.getId().intValue()) && ((oldSim.getInstall() == null) || (oldSim.getInstall().intValue() == 0)))) {
      return false;
    }
    return true;
  }
  
  protected boolean isDeviceExist(StandardDevice device)
  {
    StandardDevice oldDevice = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, device.getDevIDNO());
    if ((oldDevice == null) || ((device.getId() != null) && (oldDevice.getId().intValue() == device.getId().intValue()) && ((oldDevice.getInstall() == null) || (oldDevice.getInstall().intValue() == 0)))) {
      return false;
    }
    return true;
  }
  
  protected boolean isDriverExist(StandardDriver driver)
  {
    StandardDriver oldDriver = this.standardUserService.getStandardDriver(driver.getJobNum());
    if ((oldDriver == null) || ((driver.getId() != null) && (oldDriver.getId().intValue() == driver.getId().intValue()))) {
      return false;
    }
    return true;
  }
  
  protected List<StandardUserVehiPermitEx> delUserVehiPermit(StandardVehicle vehicle, StandardCompany company)
  {
    List<StandardUserVehiPermitEx> delPermits = new ArrayList();
    if (((vehicle.getCompany().getLevel() == null) || (vehicle.getCompany().getLevel().intValue() != 1) || (!vehicle.getCompany().getId().equals(company.getParentId()))) && 
      ((vehicle.getCompany().getLevel() == null) || (vehicle.getCompany().getLevel().intValue() != 2) || (!vehicle.getCompany().getParentId().equals(company.getId()))) && 
      (vehicle.getCompany().getId().intValue() != company.getId().intValue()))
    {
      int companyId = vehicle.getCompany().getId().intValue();
      if ((vehicle.getCompany().getLevel() != null) && (vehicle.getCompany().getLevel().intValue() == 2)) {
        companyId = vehicle.getCompany().getCompanyId().intValue();
      }
      boolean flag = true;
      
      List<Integer> lstComapnyId = findUserChildCompanyIdList(Integer.valueOf(companyId), null, false);
      if (lstComapnyId != null) {
        for (int i = 0; i < lstComapnyId.size(); i++) {
          if (((Integer)lstComapnyId.get(i)).intValue() == company.getId().intValue())
          {
            flag = false;
            break;
          }
        }
      }
      if (flag)
      {
        lstComapnyId.add(Integer.valueOf(companyId));
        AjaxDto<StandardUserAccount> userList = this.standardUserService.getStandardUserList(lstComapnyId, null, null, null);
        List<StandardUserAccount> users = new ArrayList();
        if (userList != null) {
          users = userList.getPageList();
        }
        List<StandardUserVehiPermitEx> vehiPermits = this.standardUserService.getAuthorizedUserVehicleList(null, vehicle.getVehiIDNO(), null);
        for (int i = 0; i < vehiPermits.size(); i++) {
          for (int j = 0; j < users.size(); j++) {
            if (((StandardUserVehiPermitEx)vehiPermits.get(i)).getUserId().intValue() == ((StandardUserAccount)users.get(j)).getId().intValue()) {
              delPermits.add((StandardUserVehiPermitEx)vehiPermits.get(i));
            }
          }
        }
      }
    }
    return delPermits;
  }
  
  protected void addUserLog(Integer subType, StandardUserRole role)
  {
    addUserLog(Integer.valueOf(5), subType, role.getName(), null, null, null, null);
  }
  
  protected boolean isBelongCompany(Integer companyId, Integer childId)
  {
    if ((companyId != null) && (childId != null))
    {
      if ((companyId.intValue() == -1) || (companyId.intValue() == childId.intValue())) {
        return true;
      }
      StandardCompany company = (StandardCompany)this.vehicleRuleService.getObject(StandardCompany.class, childId);
      if (company == null) {
        return false;
      }
      if (companyId.intValue() == company.getCompanyId().intValue()) {
        return true;
      }
      if ((company.getLevel() != null) && ((company.getLevel().intValue() == 2) || (company.getLevel().intValue() == 2))) {
        company = (StandardCompany)this.vehicleRuleService.getObject(StandardCompany.class, company.getCompanyId());
      }
      List<StandardCompanyRelation> relations = this.standardUserService.getCompanyRelation(companyId, company.getId());
      if ((relations != null) && (relations.size() > 0)) {
        return true;
      }
    }
    return false;
  }
  
  public String loadPaginVehicleList()
  {
    try
    {
      if ((!isRole("38")) && (!isRole("5")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        Pagination pagination = getPaginationEx();
        AjaxDto<StandardVehicle> vehicleList = getUserVehicles(userAccount.getCompany().getId(), null, null, isAdmin(), pagination);
        List<PartStandardInfo> partVehicles = new ArrayList();
        if (vehicleList.getPageList() != null)
        {
          List<StandardVehicle> vehicles = vehicleList.getPageList();
          for (int i = 0; i < vehicles.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
            info.setId(vehicle.getVehiIDNO().toString());
            info.setName(vehicle.getVehiIDNO());
            info.setParentId(vehicle.getCompany().getId());
            partVehicles.add(info);
          }
        }
        addCustomResponse("vehicles", partVehicles);
        addCustomResponse("pagination", vehicleList.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String getRolePrivilege(String privilege)
  {
    if (privilege != null)
    {
      if (privilege.indexOf(",1001,") >= 0) {
        privilege = privilege.replace("1001", "24,25,26,27,28");
      }
      if (privilege.indexOf(",1002,") >= 0) {
        privilege = privilege.replace("1002", "29,210");
      }
      if (privilege.indexOf(",1003,") >= 0) {
        privilege = privilege.replace("1003", "211,212");
      }
      if (privilege.indexOf(",1004,") >= 0) {
        privilege = privilege.replace("1004", "213,214,241,242");
      }
      if (privilege.indexOf(",1005,") >= 0) {
        privilege = privilege.replace("1005", "215,216");
      }
      if (privilege.indexOf(",1006,") >= 0) {
        privilege = privilege.replace("1006", "217,218,228");
      }
      if (privilege.indexOf(",1007,") >= 0) {
        privilege = privilege.replace("1007", "219,220,221");
      }
      if (privilege.indexOf(",1008,") >= 0) {
        privilege = privilege.replace("1008", "222,223");
      }
      if (privilege.indexOf(",1009,") >= 0) {
        privilege = privilege.replace("1009", "224,225,226");
      }
      if (privilege.indexOf(",1010,") >= 0) {
        privilege = privilege.replace("1010", "23,227");
      }
      if (privilege.indexOf(",1012,") >= 0) {
        privilege = privilege.replace("1012", "229,230");
      }
      if (privilege.indexOf(",1013,") >= 0) {
        privilege = privilege.replace("1013", "231,232");
      }
      if (privilege.indexOf(",1014,") >= 0) {
        privilege = privilege.replace("1014", "233,234");
      }
      if (privilege.indexOf(",1015,") >= 0) {
        privilege = privilege.replace("1015", "22,235,236,257,258,259,260,");
      }
      if (privilege.indexOf(",1016,") >= 0) {
        privilege = privilege.replace("1016", "237,238,671,672");
      }
      if (privilege.indexOf(",1017,") >= 0) {
        privilege = privilege.replace("1017", "239,240");
      }
      if (privilege.indexOf(",1018,") >= 0) {
        privilege = privilege.replace("1018", "243,244,245");
      }
      if (privilege.indexOf(",1019,") >= 0) {
        privilege = privilege.replace("1019", "246,247");
      }
      if (privilege.indexOf(",1020,") >= 0) {
        privilege = privilege.replace("1020", "248");
      }
      if (privilege.indexOf(",1021,") >= 0) {
        privilege = privilege.replace("1021", "249,251,253");
      }
      if (privilege.indexOf(",1022,") >= 0) {
        privilege = privilege.replace("1022", "250,252,254");
      }
      if (privilege.indexOf(",1023,") >= 0) {
        privilege = privilege.replace("1023", "255");
      }
      if (privilege.indexOf(",1024,") >= 0) {
        privilege = privilege.replace("1024", "256");
      }
      if (privilege.indexOf(",1025,") >= 0) {
        privilege = privilege.replace("1025", "261,262,264");
      }
      if (privilege.indexOf(",1026,") >= 0) {
        privilege = privilege.replace("1026", "263");
      }
      if ((privilege.indexOf(",22,") >= 0) || (privilege.indexOf(",23,") >= 0) || 
        (privilege.indexOf(",24,") >= 0) || (privilege.indexOf(",25,") >= 0) || (privilege.indexOf(",26,") >= 0) || 
        (privilege.indexOf(",27,") >= 0) || (privilege.indexOf(",28,") >= 0) || (privilege.indexOf(",29,") >= 0) || 
        (privilege.indexOf(",210,") >= 0) || (privilege.indexOf(",211,") >= 0) || (privilege.indexOf(",212,") >= 0) || 
        (privilege.indexOf(",213,") >= 0) || (privilege.indexOf(",214,") >= 0) || (privilege.indexOf(",215,") >= 0) || 
        (privilege.indexOf(",216,") >= 0) || (privilege.indexOf(",217,") >= 0) || (privilege.indexOf(",218,") >= 0) || 
        (privilege.indexOf(",219,") >= 0) || (privilege.indexOf(",220,") >= 0) || (privilege.indexOf(",221,") >= 0) || 
        (privilege.indexOf(",222,") >= 0) || (privilege.indexOf(",223,") >= 0) || (privilege.indexOf(",224,") >= 0) || 
        (privilege.indexOf(",225,") >= 0) || (privilege.indexOf(",226,") >= 0) || (privilege.indexOf(",227,") >= 0) || 
        (privilege.indexOf(",228,") >= 0) || (privilege.indexOf(",229,") >= 0) || (privilege.indexOf(",230,") >= 0) || 
        (privilege.indexOf(",231,") >= 0) || (privilege.indexOf(",232,") >= 0) || (privilege.indexOf(",233,") >= 0) || 
        (privilege.indexOf(",234,") >= 0) || (privilege.indexOf(",235,") >= 0) || (privilege.indexOf(",236,") >= 0) || 
        (privilege.indexOf(",237,") >= 0) || (privilege.indexOf(",238,") >= 0) || (privilege.indexOf(",671,") >= 0) || 
        (privilege.indexOf(",672,") >= 0) || (privilege.indexOf(",239,") >= 0) || (privilege.indexOf(",240,") >= 0) || 
        (privilege.indexOf(",241,") >= 0) || (privilege.indexOf(",242,") >= 0) || (privilege.indexOf(",243,") >= 0) || 
        (privilege.indexOf(",244,") >= 0) || (privilege.indexOf(",245,") >= 0) || (privilege.indexOf(",246,") >= 0) || 
        (privilege.indexOf(",247,") >= 0) || (privilege.indexOf(",248,") >= 0) || (privilege.indexOf(",249,") >= 0) || 
        (privilege.indexOf(",250,") >= 0) || (privilege.indexOf(",251,") >= 0) || (privilege.indexOf(",252,") >= 0) || 
        (privilege.indexOf(",253,") >= 0) || (privilege.indexOf(",254,") >= 0) || (privilege.indexOf(",255,") >= 0) || 
        (privilege.indexOf(",256,") >= 0) || (privilege.indexOf(",257,") >= 0) || (privilege.indexOf(",258,") >= 0) || 
        (privilege.indexOf(",259,") >= 0) || (privilege.indexOf(",260,") >= 0) || (privilege.indexOf(",261,") >= 0) || 
        (privilege.indexOf(",262,") >= 0) || (privilege.indexOf(",264,") >= 0) || (privilege.indexOf(",263,") >= 0)) {
        privilege = privilege + "2,";
      }
      if ((privilege.indexOf(",611,") >= 0) || (privilege.indexOf(",612,") >= 0) || (privilege.indexOf(",613,") >= 0)) {
        privilege = privilege + "1,";
      }
      if ((privilege.indexOf(",31,") >= 0) || (privilege.indexOf(",32,") >= 0) || (privilege.indexOf(",33,") >= 0) || 
        (privilege.indexOf(",34,") >= 0) || (privilege.indexOf(",35,") >= 0) || (privilege.indexOf(",36,") >= 0) || 
        (privilege.indexOf(",37,") >= 0) || (privilege.indexOf(",38,") >= 0)) {
        privilege = privilege + "3,";
      }
      if ((privilege.indexOf(",631,") >= 0) || (privilege.indexOf(",641,") >= 0)) {
        privilege = privilege + "6,";
      }
      if ((privilege.indexOf(",621,") >= 0) || (privilege.indexOf(",622,") >= 0) || (privilege.indexOf(",623,") >= 0) || 
        (privilege.indexOf(",624,") >= 0) || (privilege.indexOf(",625,") >= 0) || (privilege.indexOf(",626,") >= 0) || 
        (privilege.indexOf(",627,") >= 0) || (privilege.indexOf(",628,") >= 0)) {
        privilege = privilege + "7,";
      }
    }
    return privilege;
  }
  
  protected String getRolePrivilege2(String privilege)
  {
    if (privilege != null)
    {
      if (privilege.indexOf(",24,25,26,27,28,") >= 0) {
        privilege = privilege.replace("24,25,26,27,28", "1001");
      }
      if (privilege.indexOf(",29,210,") >= 0) {
        privilege = privilege.replace("29,210", "1002");
      }
      if (privilege.indexOf(",211,212,") >= 0) {
        privilege = privilege.replace("211,212", "1003");
      }
      if (privilege.indexOf(",213,214,241,242,") >= 0) {
        privilege = privilege.replace("213,214,241,242", "1004");
      }
      if (privilege.indexOf(",215,216,") >= 0) {
        privilege = privilege.replace("215,216", "1005");
      }
      if (privilege.indexOf(",217,218,228,") >= 0) {
        privilege = privilege.replace("217,218,228", "1006");
      }
      if (privilege.indexOf(",219,220,221,") >= 0) {
        privilege = privilege.replace("219,220,221", "1007");
      }
      if (privilege.indexOf(",222,223,") >= 0) {
        privilege = privilege.replace("222,223", "1008");
      }
      if (privilege.indexOf(",224,225,226,") >= 0) {
        privilege = privilege.replace("224,225,226", "1009");
      }
      if (privilege.indexOf(",23,227,") >= 0) {
        privilege = privilege.replace("23,227", "1010");
      }
      if (privilege.indexOf(",229,230,") >= 0) {
        privilege = privilege.replace("229,230", "1012");
      }
      if (privilege.indexOf(",231,232,") >= 0) {
        privilege = privilege.replace("231,232", "1013");
      }
      if (privilege.indexOf(",233,234,") >= 0) {
        privilege = privilege.replace("233,234", "1014");
      }
      if (privilege.indexOf(",22,235,236,257,258,259,260,") >= 0) {
        privilege = privilege.replace("22,235,236,257,258,259,260", "1015");
      }
      if (privilege.indexOf(",22,235,236,") >= 0) {
        privilege = privilege.replace("22,235,236", "1015");
      }
      if (privilege.indexOf(",237,238,671,672,") >= 0) {
        privilege = privilege.replace("237,238,671,672", "1016");
      }
      if (privilege.indexOf(",239,240,") >= 0) {
        privilege = privilege.replace("239,240", "1017");
      }
      if (privilege.indexOf("243,244,245") >= 0) {
        privilege = privilege.replace("243,244,245", "1018");
      }
      if (privilege.indexOf(",246,247,") >= 0) {
        privilege = privilege.replace("236,247", "1019");
      }
      if (privilege.indexOf(",248,") >= 0) {
        privilege = privilege.replace("248", "1020");
      }
      if (privilege.indexOf(",249,251,253,") >= 0) {
        privilege = privilege.replace("249,251,253", "1021");
      }
      if (privilege.indexOf(",250,252,254,") >= 0) {
        privilege = privilege.replace("250,252,254", "1022");
      }
      if (privilege.indexOf(",255,") >= 0) {
        privilege = privilege.replace("255", "1023");
      }
      if (privilege.indexOf(",256,") >= 0) {
        privilege = privilege.replace("256", "1024");
      }
      if (privilege.indexOf(",261,262,264,") >= 0) {
        privilege = privilege.replace("261,262,264", "1025");
      }
      if (privilege.indexOf(",263,") >= 0) {
        privilege = privilege.replace("263", "1026");
      }
    }
    return privilege;
  }
  
  protected void addUserSession(HttpServletRequest request, Integer userId, String sessionId)
  {
    UserSession mySession = new UserSession();

    UserSession oldSession = userService.getUserSession(sessionId);
 
    if (oldSession != null) {
      mySession.setId(oldSession.getId());
    }
    String svrIdno = "U1";
    AjaxDto<ServerInfo> ajaxDto = this.serverService.getAllServer(Integer.valueOf(4), null);
    if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      svrIdno = ((ServerInfo)ajaxDto.getPageList().get(0)).getIdno();
    }
    mySession.setSession(sessionId);
    mySession.setUserid(userId);
    mySession.setUsrSvrIdno(svrIdno);
    mySession.setClientIP(request.getRemoteHost());
    mySession.setPort(Integer.valueOf(request.getRemotePort()));
    mySession.setStatus(Integer.valueOf(1));
    mySession.setType(Integer.valueOf(1));
    mySession.setUpdateTime(new Date());
    this.deviceService.save(mySession);
  }
  
  public String listMarker()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      List<Integer> lstId = new ArrayList();
      lstId.add(Integer.valueOf(2));
      lstId.add(Integer.valueOf(3));
      lstId.add(Integer.valueOf(10));
      lstId.add(Integer.valueOf(4));
      lstId.add(Integer.valueOf(1));
      boolean isadmin = isAdmin();
      List<Integer> lstLevel = new ArrayList();
      lstLevel.add(Integer.valueOf(1));
      List<Integer> cids = findUserCompanyIdList(user.getCompany().getId(), lstLevel, isadmin);
      AjaxDto<MapMarker> areaMarker = this.vehicleRuleService.getAreaList(cids, user.getId(), lstId, null, Boolean.valueOf(isadmin), null, null);
      addCustomResponse("markers", areaMarker.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String markerLists()
    throws Exception
  {
    try
    {
      addCustomResponse("markers", this.standardUserService.getAreaByParentId());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findArea()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (id != ""))
      {
        MapMarker mark = (MapMarker)this.vehicleRuleService.getObject(MapMarker.class, Integer.valueOf(Integer.parseInt(id)));
        addCustomResponse("marker", mark);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  /* Error */
  protected String uploadAreaImage(String fileName)
    throws java.io.IOException
  {
	return uploadFileFileName;
    // Byte code:
    //   0: ldc -126
    //   2: astore_2
    //   3: aload_0
    //   4: aload_0
    //   5: getfield 104	com/gps/common/action/StandardUserBaseAction:uploadFileFileName	Ljava/lang/String;
    //   8: invokevirtual 1244	com/gps/common/action/StandardUserBaseAction:isParamNull	(Ljava/lang/Object;)Z
    //   11: ifne +399 -> 410
    //   14: ldc -126
    //   16: astore_3
    //   17: aload_0
    //   18: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   21: ldc_w 1247
    //   24: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   27: ifne +16 -> 43
    //   30: aload_0
    //   31: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   34: ldc_w 1249
    //   37: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   40: ifeq +10 -> 50
    //   43: ldc_w 1251
    //   46: astore_3
    //   47: goto +90 -> 137
    //   50: aload_0
    //   51: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   54: ldc_w 1253
    //   57: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   60: ifne +16 -> 76
    //   63: aload_0
    //   64: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   67: ldc_w 1255
    //   70: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   73: ifeq +10 -> 83
    //   76: ldc_w 1257
    //   79: astore_3
    //   80: goto +57 -> 137
    //   83: aload_0
    //   84: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   87: ldc_w 1259
    //   90: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   93: ifeq +10 -> 103
    //   96: ldc_w 1261
    //   99: astore_3
    //   100: goto +37 -> 137
    //   103: aload_0
    //   104: getfield 109	com/gps/common/action/StandardUserBaseAction:uploadFileContentType	Ljava/lang/String;
    //   107: ldc_w 1263
    //   110: invokevirtual 303	java/lang/String:equals	(Ljava/lang/Object;)Z
    //   113: ifeq +10 -> 123
    //   116: ldc_w 1265
    //   119: astore_3
    //   120: goto +17 -> 137
    //   123: aload_0
    //   124: getstatic 703	com/gps/common/action/StandardUserBaseAction:ACTION_RESULT	Ljava/lang/String;
    //   127: bipush 42
    //   129: invokestatic 258	java/lang/Integer:valueOf	(I)Ljava/lang/Integer;
    //   132: invokevirtual 706	com/gps/common/action/StandardUserBaseAction:addCustomResponse	(Ljava/lang/String;Ljava/lang/Object;)V
    //   135: aconst_null
    //   136: areturn
    //   137: aload_0
    //   138: getfield 98	com/gps/common/action/StandardUserBaseAction:uploadFile	Ljava/io/File;
    //   141: invokevirtual 1267	java/io/File:length	()J
    //   144: ldc2_w 1273
    //   147: lcmp
    //   148: ifle +17 -> 165
    //   151: aload_0
    //   152: getstatic 703	com/gps/common/action/StandardUserBaseAction:ACTION_RESULT	Ljava/lang/String;
    //   155: bipush 41
    //   157: invokestatic 258	java/lang/Integer:valueOf	(I)Ljava/lang/Integer;
    //   160: invokevirtual 706	com/gps/common/action/StandardUserBaseAction:addCustomResponse	(Ljava/lang/String;Ljava/lang/Object;)V
    //   163: aconst_null
    //   164: areturn
    //   165: new 1275	java/io/FileInputStream
    //   168: dup
    //   169: aload_0
    //   170: getfield 98	com/gps/common/action/StandardUserBaseAction:uploadFile	Ljava/io/File;
    //   173: invokespecial 1277	java/io/FileInputStream:<init>	(Ljava/io/File;)V
    //   176: astore 4
    //   178: aload_0
    //   179: invokevirtual 1279	com/gps/common/action/StandardUserBaseAction:getServletContext	()Ljavax/servlet/ServletContext;
    //   182: ldc_w 1283
    //   185: invokeinterface 1285 2 0
    //   190: astore 5
    //   192: new 283	java/lang/StringBuilder
    //   195: dup
    //   196: aload_1
    //   197: invokestatic 1037	java/lang/String:valueOf	(Ljava/lang/Object;)Ljava/lang/String;
    //   200: invokespecial 287	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   203: aload_3
    //   204: invokevirtual 290	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   207: invokevirtual 294	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   210: astore_2
    //   211: new 1268	java/io/File
    //   214: dup
    //   215: aload 5
    //   217: invokespecial 1290	java/io/File:<init>	(Ljava/lang/String;)V
    //   220: astore 6
    //   222: aload 6
    //   224: invokevirtual 1291	java/io/File:exists	()Z
    //   227: ifne +9 -> 236
    //   230: aload 6
    //   232: invokevirtual 1294	java/io/File:mkdirs	()Z
    //   235: pop
    //   236: new 1268	java/io/File
    //   239: dup
    //   240: aload 5
    //   242: aload_2
    //   243: invokespecial 1297	java/io/File:<init>	(Ljava/lang/String;Ljava/lang/String;)V
    //   246: astore 7
    //   248: aconst_null
    //   249: astore 8
    //   251: new 1300	java/io/FileOutputStream
    //   254: dup
    //   255: aload 7
    //   257: invokespecial 1302	java/io/FileOutputStream:<init>	(Ljava/io/File;)V
    //   260: astore 8
    //   262: sipush 1024
    //   265: newarray <illegal type>
    //   267: astore 9
    //   269: iconst_0
    //   270: istore 10
    //   272: goto +13 -> 285
    //   275: aload 8
    //   277: aload 9
    //   279: iconst_0
    //   280: iload 10
    //   282: invokevirtual 1303	java/io/OutputStream:write	([BII)V
    //   285: aload 4
    //   287: aload 9
    //   289: invokevirtual 1309	java/io/InputStream:read	([B)I
    //   292: dup
    //   293: istore 10
    //   295: ifgt -20 -> 275
    //   298: goto +79 -> 377
    //   301: astore 9
    //   303: ldc -126
    //   305: astore_2
    //   306: aload 9
    //   308: invokevirtual 1315	java/io/FileNotFoundException:printStackTrace	()V
    //   311: aload 4
    //   313: invokevirtual 1320	java/io/InputStream:close	()V
    //   316: aload 8
    //   318: ifnull +74 -> 392
    //   321: aload 8
    //   323: invokevirtual 1323	java/io/OutputStream:close	()V
    //   326: goto +66 -> 392
    //   329: astore 9
    //   331: ldc -126
    //   333: astore_2
    //   334: aload 9
    //   336: invokevirtual 1324	java/io/IOException:printStackTrace	()V
    //   339: aload 4
    //   341: invokevirtual 1320	java/io/InputStream:close	()V
    //   344: aload 8
    //   346: ifnull +46 -> 392
    //   349: aload 8
    //   351: invokevirtual 1323	java/io/OutputStream:close	()V
    //   354: goto +38 -> 392
    //   357: astore 11
    //   359: aload 4
    //   361: invokevirtual 1320	java/io/InputStream:close	()V
    //   364: aload 8
    //   366: ifnull +8 -> 374
    //   369: aload 8
    //   371: invokevirtual 1323	java/io/OutputStream:close	()V
    //   374: aload 11
    //   376: athrow
    //   377: aload 4
    //   379: invokevirtual 1320	java/io/InputStream:close	()V
    //   382: aload 8
    //   384: ifnull +8 -> 392
    //   387: aload 8
    //   389: invokevirtual 1323	java/io/OutputStream:close	()V
    //   392: new 283	java/lang/StringBuilder
    //   395: dup
    //   396: ldc_w 1325
    //   399: invokespecial 287	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   402: aload_2
    //   403: invokevirtual 290	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   406: invokevirtual 294	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   409: astore_2
    //   410: aload_2
    //   411: areturn
    // Line number table:
    //   Java source line #1326	-> byte code offset #0
    //   Java source line #1327	-> byte code offset #3
    //   Java source line #1328	-> byte code offset #14
    //   Java source line #1329	-> byte code offset #17
    //   Java source line #1331	-> byte code offset #43
    //   Java source line #1332	-> byte code offset #47
    //   Java source line #1334	-> byte code offset #76
    //   Java source line #1335	-> byte code offset #80
    //   Java source line #1336	-> byte code offset #96
    //   Java source line #1337	-> byte code offset #100
    //   Java source line #1338	-> byte code offset #116
    //   Java source line #1339	-> byte code offset #120
    //   Java source line #1340	-> byte code offset #123
    //   Java source line #1341	-> byte code offset #135
    //   Java source line #1343	-> byte code offset #137
    //   Java source line #1344	-> byte code offset #151
    //   Java source line #1345	-> byte code offset #163
    //   Java source line #1347	-> byte code offset #165
    //   Java source line #1348	-> byte code offset #178
    //   Java source line #1350	-> byte code offset #192
    //   Java source line #1351	-> byte code offset #211
    //   Java source line #1352	-> byte code offset #222
    //   Java source line #1353	-> byte code offset #230
    //   Java source line #1355	-> byte code offset #236
    //   Java source line #1356	-> byte code offset #248
    //   Java source line #1358	-> byte code offset #251
    //   Java source line #1359	-> byte code offset #262
    //   Java source line #1360	-> byte code offset #269
    //   Java source line #1361	-> byte code offset #272
    //   Java source line #1362	-> byte code offset #275
    //   Java source line #1361	-> byte code offset #285
    //   Java source line #1364	-> byte code offset #298
    //   Java source line #1365	-> byte code offset #303
    //   Java source line #1366	-> byte code offset #306
    //   Java source line #1371	-> byte code offset #311
    //   Java source line #1372	-> byte code offset #316
    //   Java source line #1373	-> byte code offset #321
    //   Java source line #1367	-> byte code offset #329
    //   Java source line #1368	-> byte code offset #331
    //   Java source line #1369	-> byte code offset #334
    //   Java source line #1371	-> byte code offset #339
    //   Java source line #1372	-> byte code offset #344
    //   Java source line #1373	-> byte code offset #349
    //   Java source line #1370	-> byte code offset #357
    //   Java source line #1371	-> byte code offset #359
    //   Java source line #1372	-> byte code offset #364
    //   Java source line #1373	-> byte code offset #369
    //   Java source line #1375	-> byte code offset #374
    //   Java source line #1371	-> byte code offset #377
    //   Java source line #1372	-> byte code offset #382
    //   Java source line #1373	-> byte code offset #387
    //   Java source line #1376	-> byte code offset #392
    //   Java source line #1378	-> byte code offset #410
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	412	0	this	StandardUserBaseAction
    //   0	412	1	fileName	String
    //   2	409	2	newfileName	String
    //   16	188	3	expandedName	String
    //   176	202	4	is	java.io.InputStream
    //   190	51	5	uploadPath	String
    //   220	11	6	file	File
    //   246	10	7	toFile	File
    //   249	139	8	os	java.io.OutputStream
    //   267	21	9	buffer	byte[]
    //   301	6	9	e	java.io.FileNotFoundException
    //   329	6	9	e	java.io.IOException
    //   270	24	10	length	int
    //   357	18	11	localObject	Object
    // Exception table:
    //   from	to	target	type
    //   251	298	301	java/io/FileNotFoundException
    //   251	298	329	java/io/IOException
    //   251	311	357	finally
    //   329	339	357	finally
  }
  
  protected void delFile(String path)
  {
    String tmpFile = getServletContext().getRealPath(path);
    File file = new File(tmpFile);
    if ((file.exists()) && (file.isFile())) {
      file.delete();
    }
  }
  
  public String addMark()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      Integer companyId = user.getCompany().getId();
      if (isAdmin()) {
        companyId = Integer.valueOf(0);
      }
      MapMarker mark = (MapMarker)AjaxUtils.getObject(getRequest(), MapMarker.class);
      
      MapMarker marker = this.standardUserService.getStandardMark(mark.getName());
      if (marker != null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(55));
      }
      else
      {
        mark.setCreator(user.getId());
        mark.setUserID(companyId);
        mark.setAreaId(Integer.valueOf(0));
        mark.setParentId(Integer.valueOf(0));
        mark.setAreaType(Integer.valueOf(0));
        mark.setAreaName(null);
        mark = (MapMarker)this.vehicleRuleService.save(mark);
        addCustomResponse("markId", mark.getId());
        
        String fileName = uploadAreaImage(mark.getId().toString());
        if (!isParamNull(fileName))
        {
          mark.setImage(fileName);
          this.vehicleRuleService.save(mark);
        }
        addCustomResponse("image", fileName);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String editMark()
  {
    try
    {
      MapMarker mark = (MapMarker)AjaxUtils.getObject(getRequest(), MapMarker.class);
      if (mark.getId() == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        MapMarker marker = this.standardUserService.getStandardMark(mark.getName());
        if ((marker != null) && (mark.getId().intValue() != marker.getId().intValue()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(55));
        }
        else
        {
          MapMarker oldMark = (MapMarker)this.vehicleRuleService.getObject(MapMarker.class, mark.getId());
          if (!isParamNull(this.uploadFileFileName)) {
            delFile("/" + oldMark.getImage());
          }
          String fileName = uploadAreaImage(oldMark.getId().toString());
          if (fileName != null)
          {
            if (isParamNull(fileName)) {
              mark.setImage(oldMark.getImage());
            } else {
              mark.setImage(fileName);
            }
            mark.setCreator(oldMark.getCreator());
            mark.setUserID(oldMark.getUserID());
            mark.setAreaId(oldMark.getAreaId());
            mark.setParentId(oldMark.getParentId());
            mark.setAreaType(oldMark.getAreaType());
            mark.setAreaName(oldMark.getAreaName());
            this.vehicleRuleService.save(mark);
            addCustomResponse("image", mark.getImage());
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String deleteArea()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (id != ""))
      {
        List<StandardRuleMaintain> rules = this.vehicleRuleService.getRulesByArea(Integer.valueOf(Integer.parseInt(id)));
        if (rules.size() > 0)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(56));
        }
        else
        {
          MapMarker mark = (MapMarker)this.vehicleRuleService.getObject(MapMarker.class, Integer.valueOf(Integer.parseInt(id)));
          this.vehicleRuleService.delete(mark);
          
          delFile("/" + mark.getImage());
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String[] getChannelParamToDev(String paramType, String paramAttr, String paramName)
  {
    String[] param = new String[2];
    if ((paramAttr == null) || (paramAttr.isEmpty()))
    {
      param[0] = "0";
      param[1] = "";
    }
    else
    {
      if (paramName == null) {
        paramName = "";
      }
      String[] chnNames = paramName.split(",");
      String[] chns = paramAttr.split(",");
      String chnName_dev = "";
      int m = 0;
      for (int n = chns.length; m < n; m++)
      {
        if (chnNames.length < m + 1) {
          chnName_dev = chnName_dev + paramType + (m + 1);
        } else {
          chnName_dev = chnName_dev + chnNames[m].toString();
        }
        if (m != n - 1) {
          chnName_dev = chnName_dev + ",";
        }
      }
      param[0] = Integer.toString(chns.length);
      param[1] = chnName_dev;
    }
    return param;
  }
  
  protected boolean isParamNull(Object obj)
  {
    if (obj != null) {
      if ((obj instanceof String))
      {
        if (!((String)obj).isEmpty()) {
          return false;
        }
      }
      else if ((obj instanceof Integer))
      {
        if (!((Integer)obj).toString().isEmpty()) {
          return false;
        }
      }
      else if ((obj instanceof Date))
      {
        if (!((Date)obj).toString().isEmpty()) {
          return false;
        }
      }
      else if ((obj instanceof Long))
      {
        if (!((Long)obj).toString().isEmpty()) {
          return false;
        }
      }
      else if ((obj instanceof Double))
      {
        if (!((Double)obj).toString().isEmpty()) {
          return false;
        }
      }
      else if (((obj instanceof Float)) && 
        (!((Float)obj).toString().isEmpty())) {
        return false;
      }
    }
    return true;
  }
  
  protected void doVehicleChange(boolean change, String upVehiIdnos, String delVehiIdnos)
  {
    MyServletContextListener.setVehicleChange(change, upVehiIdnos, delVehiIdnos);
  }
  
  protected void updateCacheVehiRelationByUser(Integer userId)
  {
    try
    {
      MyServletContextListener.updateCacheVehiRelationByUser(userId);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
  
  protected void delCacheVehiRelationByUser(Integer userId)
  {
    try
    {
      MyServletContextListener.delCacheVehiRelationByUser(userId);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
  
  protected abstract boolean checkPrivi();
}
