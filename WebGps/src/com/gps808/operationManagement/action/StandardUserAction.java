package com.gps808.operationManagement.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserSession;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardUserVehiPermitUser;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardUserAccountEx;
import com.gps808.operationManagement.vo.StandardUserPermit;
import com.gps808.operationManagement.vo.StandardUserVehiPermitExMore;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.hibernate.type.StandardBasicTypes;

public class StandardUserAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String loadUsers()
  {
    try
    {
      String type = getRequestString("type");
      String name = getRequest().getParameter("name");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
        {
          AjaxDto<StandardUserAccount> userList = getUserAccounts(null, null);
          List<PartStandardInfo> partUsers = new ArrayList();
          if (userList.getPageList() != null)
          {
            List<StandardUserAccount> users = userList.getPageList();
            for (int i = 0; i < users.size(); i++)
            {
              PartStandardInfo info = new PartStandardInfo();
              StandardUserAccount user = (StandardUserAccount)users.get(i);
              info.setId(user.getId().toString());
              info.setName(user.getName());
              info.setParentId(user.getCompany().getId());
              partUsers.add(info);
            }
          }
          addCustomResponse("infos", partUsers);
        }
        else if ((type != null) && (!type.isEmpty()))
        {
          Pagination pagination = getPaginationEx();
          String condition = " and account <> 'admin' ";
          if ((name != null) && (!name.isEmpty())) {
            condition = condition + String.format(" and ( account like '%%%s%%' or name like '%%%s%%' or company.name like '%%%s%%') ", new Object[] { name, name, name });
          }
          AjaxDto<StandardUserAccountEx> userList = getUserAccountsEx(getUserAccounts(condition, pagination));
          addCustomResponse("infos", userList.getPageList());
          addCustomResponse("pagination", userList.getPagination());
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadUserList()
  {
    try
    {
      String name = getRequest().getParameter("name");
      String companyId = getRequestString("companyId");
      Pagination pagination = getPaginationEx();
      String condition = "";
      if ((name != null) && (!name.isEmpty())) {
        condition = condition + String.format(" and ( account like '%%%s%%' or name like '%%%s%%') ", new Object[] { name, name });
      }
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      List<Integer> lstId = new ArrayList();
      Integer userId = null;
      if ((companyId != null) && (!companyId.isEmpty()))
      {
        if ((!isAdmin()) && (Integer.parseInt(companyId) == userAccount.getCompany().getId().intValue())) {
          userId = userAccount.getId();
        } else {
          lstId.add(Integer.valueOf(Integer.parseInt(companyId)));
        }
      }
      else if (!isAdmin())
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        lstId = findUserCompanyIdList(userAccount.getCompany().getId(), lstLevel, isAdmin());
        userId = userAccount.getId();
      }
      AjaxDto<StandardUserAccountEx> userList = getUserAccountsEx(this.standardUserService.getStandardUsersList(lstId, userId, condition, pagination));
      addCustomResponse("infos", userList.getPageList());
      addCustomResponse("pagination", userList.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadCompanyVehicleList()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), false, false);
        List<PartStandardInfo> partCompanys = new ArrayList();
        for (int i = 0; i < companys.size(); i++)
        {
          PartStandardInfo info = new PartStandardInfo();
          StandardCompany company = (StandardCompany)companys.get(i);
          if (company.getId().intValue() != -1)
          {
            info.setId(company.getId().toString());
            info.setName(company.getName());
            info.setParentId(company.getParentId());
            partCompanys.add(info);
          }
        }
        AjaxDto<StandardVehicle> vehicles = getUserVehicles(userAccount.getCompany().getId(), null, null, isAdmin(), null);
        List<PartStandardInfo> partVehis = new ArrayList();
        if (vehicles.getPageList() != null) {
          for (int i = 0; i < vehicles.getPageList().size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardVehicle vehicle = (StandardVehicle)vehicles.getPageList().get(i);
            info.setId(vehicle.getId().toString());
            info.setName(vehicle.getVehiIDNO());
            if ((vehicle.getCompany().getLevel() != null) && (vehicle.getCompany().getLevel().intValue() == 2)) {
              info.setParentId(vehicle.getCompany().getCompanyId());
            } else {
              info.setParentId(vehicle.getCompany().getId());
            }
            partVehis.add(info);
          }
        }
        AjaxDto<StandardUserRole> roles = new AjaxDto();
        String companyId = getRequestString("companyId");
        if ((companyId != null) && (!companyId.equals("")))
        {
          StandardCompany com = new StandardCompany();
          com.setId(Integer.valueOf(Integer.parseInt(companyId)));
          roles = getUserRoles(com, false, null, null, true);
        }
        else
        {
          roles = getUserRoles(userAccount.getCompany(), false, null, null, true);
        }
        List<PartStandardInfo> partRoles = new ArrayList();
        if (roles.getPageList() != null) {
          for (int i = 0; i < roles.getPageList().size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardUserRole role = (StandardUserRole)roles.getPageList().get(i);
            info.setId(role.getId().toString());
            info.setName(role.getName());
            
            info.setParentId(Integer.valueOf(role.getCompany().getId().intValue() == -1 ? 0 : role.getCompany().getId().intValue()));
            partRoles.add(info);
          }
        }
        addCustomResponse("roles", partRoles);
        addCustomResponse("partVehis", partVehis);
        addCustomResponse("companys", partCompanys);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findUserAccount()
  {
    try
    {
      String id = getRequestString("id");
      String cid = getRequestString("cid");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(id)));
        if (user == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId())))
          {
            StandardCompany company = null;
            if ((cid == null) || (cid.isEmpty())) {
              company = user.getCompany();
            } else {
              company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(cid)));
            }
            if (user.getId().intValue() == userAccount.getId().intValue()) {
              user.setIsMine(Integer.valueOf(1));
            }
            if (user.getRole() != null) {
              user.getRole().setPrivilege(getRolePrivilege2(user.getRole().getPrivilege()));
            }
            StandardUserAccountEx userEx = new StandardUserAccountEx(user);
            
            addCustomResponse("user", userEx);
            addCustomResponse("company", company);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public String findVehicle()
  {
    try
    {
      String id = getRequestString("id");
      String cid = getRequestString("cid");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, id);
        if (vehicle == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            if ((cid != null) && (!cid.isEmpty())) {
              company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(cid)));
            }
            addCustomResponse("vehicle", vehicle);
            addCustomResponse("company", company);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public String deleteUserAccount()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(id)));
        if (user == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId()))) {
            if ((user.getAccount().equals("admin")) || (user.getId().intValue() == userAccount.getId().intValue()))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
            else
            {
              user.setRole(null);
              this.standardUserService.delete(user);
              addUserAccountLog(Integer.valueOf(3), user);
              sendUserAccountMsg(3, user);
            }
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
  
  public String changePassword()
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        String pwd = getRequestString("pwd");
        if ((id == null) || (id.isEmpty()) || (pwd == null) || (pwd.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          pwd = MD5EncryptUtils.encrypt(pwd);
          StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(id)));
          if (user == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId())))
            {
              this.standardUserService.changePassword(user.getId(), pwd);
              addUserAccountLog(Integer.valueOf(2), user);
              sendUserAccountMsg(2, user);
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
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
  
  public String mergeUserAccount()
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardUserAccount user = new StandardUserAccount();
        user = (StandardUserAccount)AjaxUtils.getObject(getRequest(), user.getClass());
        if (isExist(user, user.getAccount(), null))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(15));
        }
        else
        {
          String permits = user.getPermits();
          StandardUserRole role = null;
          if ((user.getRole() != null) && (user.getRole().getId() != null)) {
            role = (StandardUserRole)this.standardUserService.getObject(StandardUserRole.class, user.getRole().getId());
          }
          if ((user.getCompany() == null) || (user.getCompany().getId() == null)) {
            user.setCompany(null);
          }
          if ((user.getPassword() != null) && (!user.getPassword().isEmpty())) {
            user.setPassword(MD5EncryptUtils.encrypt(user.getPassword()));
          }
          if (user.getId() != null)
          {
            if ((user.getAccount() != null) && (user.getAccount().equals("admin")))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
            else
            {
              StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
              if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId())))
              {
                StandardUserAccount newUser = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, user.getId());
                user.setRole(role);
                if (user.getId().intValue() == userAccount.getId().intValue())
                {
                  user.setCompany(newUser.getCompany());
                  user.setRole(newUser.getRole());
                  user.setValidity(newUser.getValidity());
                }
                user.setPassword(newUser.getPassword());
                user.setCreateTime(newUser.getCreateTime());
                
                user.setAccountType(newUser.getAccountType());
                user = (StandardUserAccount)this.standardUserService.save(user);
                if (permits != null) {
                  setVehiPermit(user, permits);
                }
                addUserAccountLog(Integer.valueOf(2), user);
                sendUserAccountMsg(2, user);
              }
              else
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
              }
            }
          }
          else if (user.getId() == null)
          {
            user.setRole(role);
            user.setStatus(Integer.valueOf(1));
            user.setCreateTime(new Date());
            user.setAccountType(Integer.valueOf(0));
            StandardUserAccount newUser = (StandardUserAccount)this.standardUserService.save(user);
            if ((permits != null) && (!permits.isEmpty()))
            {
              String[] vehiIds = permits.split(",");
              for (int i = 0; i < vehiIds.length; i++) {
                if (vehiIds[i] != null)
                {
                  StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
                  permit.setUserId(newUser.getId());
                  permit.setVehiIdno(vehiIds[i]);
                  this.standardUserService.save(permit);
                }
              }
            }
            addUserAccountLog(Integer.valueOf(1), newUser);
            sendUserAccountMsg(1, newUser);
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
  
  public String getPermitVehicles()
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String isPermit = getRequestString("isPermit");
        String id = getRequestString("id");
        String companyId = getRequestString("companyId");
        String name = getRequest().getParameter("name");
        if ((id != null) && (!id.isEmpty()))
        {
          StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(id)));
          if (user == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId()))
            {
              List<Integer> companys = new ArrayList();
              if ((companyId == null) || (companyId.isEmpty())) {
                companys = findUserCompanyIdList(user.getCompany().getId(), null, false);
              } else {
                companys.add(Integer.valueOf(Integer.parseInt(companyId)));
              }
              String condition = "";
              if ((name != null) && (!name.isEmpty())) {
                condition = String.format(" and (vehicle.vehiIDNO like '%%%s%%')", new Object[] { name });
              }
              List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(user.getId(), null, condition);
              List<StandardVehicle> permitVehicles = new ArrayList();
              if ((vehiPermits != null) && (vehiPermits.size() > 0))
              {
                int i = 0;
                for (int j = vehiPermits.size(); i < j; i++)
                {
                  StandardVehicle vehicle = ((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle();
                  if ((companyId == null) || (companyId.isEmpty()))
                  {
                    if (companys.contains(vehicle.getCompany().getId())) {
                      permitVehicles.add(vehicle);
                    }
                  }
                  else if (vehicle.getCompany().getId().intValue() == Integer.parseInt(companyId)) {
                    permitVehicles.add(vehicle);
                  }
                }
              }
              Pagination pagination = getPaginationEx();
              if ((isPermit != null) && (isPermit.equals("1")))
              {
                AjaxDto<StandardVehicle> vehicles = doSummaryVehicleEx(permitVehicles, pagination);
                addCustomResponse("infos", vehicles.getPageList());
                addCustomResponse("pagination", vehicles.getPagination());
              }
              else
              {
                if ((name != null) && (!name.isEmpty())) {
                  condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
                }
                AjaxDto<StandardVehicle> dtoVehicleList = getUserVehicles(null, companys, condition, false, null);
                List<StandardVehicle> allVehicles = dtoVehicleList.getPageList();
                if ((allVehicles != null) && (allVehicles.size() > 0))
                {
                  int i = allVehicles.size() - 1;
                  for (int j = 0; i >= j; i--)
                  {
                    StandardVehicle vehicle = (StandardVehicle)allVehicles.get(i);
                    int ix = 0;
                    for (int jx = permitVehicles.size(); ix < jx; ix++)
                    {
                      StandardVehicle permitVehicle = (StandardVehicle)permitVehicles.get(ix);
                      if (vehicle.getVehiIDNO().equals(permitVehicle.getVehiIDNO()))
                      {
                        allVehicles.remove(i);
                        break;
                      }
                    }
                  }
                  AjaxDto<StandardVehicle> vehicleList = doSummaryVehicleEx(allVehicles, pagination);
                  addCustomResponse("infos", vehicleList.getPageList());
                  addCustomResponse("pagination", vehicleList.getPagination());
                }
                else
                {
                  addCustomResponse("infos", null);
                  addCustomResponse("pagination", null);
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
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
  
  public String getPermitUsers()
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String isPermit = getRequestString("isPermit");
        String id = getRequestString("id");
        String companyId = getRequestString("companyId");
        String name = getRequest().getParameter("name");
        if ((id != null) && (!id.isEmpty()))
        {
          StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, id);
          if (vehicle == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardCompany company = vehicle.getCompany();
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if (isBelongCompany(userAccount.getCompany().getId(), company.getId()))
            {
              List<StandardCompany> companys = new ArrayList();
              if ((companyId == null) || (companyId.isEmpty()))
              {
                StandardCompany compsdd = vehicle.getCompany();
                if (compsdd.getId().intValue() != userAccount.getCompany().getId().intValue()) {
                  companys.add(userAccount.getCompany());
                }
                companys.add(compsdd);
                do
                {
                  compsdd = (StandardCompany)this.deviceService.getObject(StandardCompany.class, compsdd.getParentId());
                  if (compsdd != null) {
                    companys.add(compsdd);
                  }
                  if (compsdd == null) {
                    break;
                  }
                } while (compsdd.getId().intValue() != userAccount.getCompany().getId().intValue());
              }
              else
              {
                company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(companyId)));
                companys.add(company);
              }
              List<Integer> companyIds = new ArrayList();
              for (int i = 0; i < companys.size(); i++) {
                if (companys.get(i) != null) {
                  companyIds.add(((StandardCompany)companys.get(i)).getId());
                }
              }
              String condition = "";
              if ((name != null) && (!name.isEmpty())) {
                condition = String.format(" and user.account like '%%%s%%'", new Object[] { name });
              }
              List<StandardUserVehiPermitUser> vehiPermits = this.standardUserService.getPeimitVehicleUserList(null, vehicle.getVehiIDNO(), condition);
              List<StandardUserAccount> users = new ArrayList();
              if ((vehiPermits != null) && (vehiPermits.size() > 0))
              {
                int i = 0;
                for (int j = vehiPermits.size(); i < j; i++)
                {
                  StandardUserAccount user = ((StandardUserVehiPermitUser)vehiPermits.get(i)).getUser();
                  if ((companyId == null) || (companyId.isEmpty()))
                  {
                    if (companyIds.contains(user.getCompany().getId())) {
                      users.add(user);
                    }
                  }
                  else if (user.getCompany().getId().intValue() == Integer.parseInt(companyId)) {
                    users.add(user);
                  }
                }
              }
              Pagination pagination = getPaginationEx();
              if ((isPermit != null) && (isPermit.equals("1")))
              {
                AjaxDto<StandardUserAccountEx> userAccounts = getUserAccountsEx(doSummaryUserEx(users, pagination));
                addCustomResponse("infos", userAccounts.getPageList());
                addCustomResponse("pagination", userAccounts.getPagination());
              }
              else
              {
                if ((name != null) && (!name.isEmpty())) {
                  condition = String.format(" and account like '%%%s%%'", new Object[] { name });
                }
                AjaxDto<StandardUserAccount> dtoUserList = getUserAccounts(condition, pagination);
                List<StandardUserAccount> allComUsers = dtoUserList.getPageList();
                List<StandardUserAccount> allUsers = new ArrayList();
                if ((allComUsers != null) && (allComUsers.size() > 0)) {
                  for (int i = 0; i < allComUsers.size(); i++)
                  {
                    StandardUserAccount user = (StandardUserAccount)allComUsers.get(i);
                    if (companyIds.contains(user.getCompany().getId())) {
                      allUsers.add(user);
                    }
                  }
                }
                if ((allUsers != null) && (allUsers.size() > 0))
                {
                  if ((companyId == null) || (companyId.isEmpty()))
                  {
                    int i = allUsers.size() - 1;
                    for (int j = 0; i >= j; i--)
                    {
                      StandardUserAccount user = (StandardUserAccount)allUsers.get(i);
                      if (user.getAccount().equals("admin"))
                      {
                        allUsers.remove(i);
                      }
                      else
                      {
                        int ix = 0;
                        for (int jx = users.size(); ix < jx; ix++)
                        {
                          StandardUserAccount user_ = (StandardUserAccount)users.get(ix);
                          if ((user.getId().equals(user_.getId())) || (user.getAccount().equals("admin")))
                          {
                            allUsers.remove(i);
                            break;
                          }
                        }
                      }
                    }
                  }
                  else
                  {
                    int i = allUsers.size() - 1;
                    for (int j = 0; i >= j; i--)
                    {
                      StandardUserAccount user = (StandardUserAccount)allUsers.get(i);
                      if ((user.getAccount().equals("admin")) || (user.getCompany().getId().intValue() != Integer.parseInt(companyId)))
                      {
                        allUsers.remove(i);
                      }
                      else
                      {
                        int ix = 0;
                        for (int jx = users.size(); ix < jx; ix++)
                        {
                          StandardUserAccount user_ = (StandardUserAccount)users.get(ix);
                          if ((user.getId().equals(user_.getId())) || (user.getAccount().equals("admin")))
                          {
                            allUsers.remove(i);
                            break;
                          }
                        }
                      }
                    }
                  }
                  AjaxDto<StandardUserAccountEx> userList = getUserAccountsEx(doSummaryUserEx(allUsers, pagination));
                  addCustomResponse("infos", userList.getPageList());
                  addCustomResponse("pagination", userList.getPagination());
                }
                else
                {
                  addCustomResponse("infos", null);
                  addCustomResponse("pagination", null);
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
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
  
  public String savePermitNew()
    throws Exception
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        String isPermit = getRequestString("isPermit");
        if ((id == null) || (id.isEmpty()) || (isPermit == null) || (isPermit.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(id)));
          if (user == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId())))
            {
              StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
              String vehiIdstr = userPermit.getPermits();
              if ((vehiIdstr != null) && (!vehiIdstr.isEmpty()))
              {
                AjaxDto<StandardVehicle> vehicleList = getUserVehicles(userAccount.getCompany().getId(), null, null, isAdmin(), null);
                if ((vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
                {
                  List<StandardVehicle> vehicles = vehicleList.getPageList();
                  
                  String[] vehiIds = vehiIdstr.split(",");
                  if (isPermit.equals("0"))
                  {
                    List<StandardUserVehiPermitEx> addPermits = new ArrayList();
                    for (int i = 0; i < vehiIds.length; i++)
                    {
                      StandardUserVehiPermitEx newPermit = new StandardUserVehiPermitEx();
                      newPermit.setUserId(user.getId());
                      for (int j = 0; j < vehicles.size(); j++) {
                        if (((StandardVehicle)vehicles.get(j)).getId().intValue() == Integer.parseInt(vehiIds[i]))
                        {
                          newPermit.setVehiIdno(((StandardVehicle)vehicles.get(j)).getVehiIDNO());
                          addPermits.add(newPermit);
                          break;
                        }
                      }
                    }
                    this.standardUserService.editUserVehiPermitEx(addPermits, null);
                  }
                  else if (isPermit.equals("1"))
                  {
                    List<QueryScalar> scalars = new ArrayList();
                    scalars.add(new QueryScalar("vehiId", StandardBasicTypes.INTEGER));
                    List<StandardUserVehiPermitExMore> vehiPermits = this.standardUserService.getAuthorizedVehicleExMoreList(user.getId(), null, scalars, ",b.ID as vehiId", ",jt808_vehicle_info b where a.VehiIDNO = b.VehiIDNO ");
                    
                    Map<String, String> savePermits = new HashMap();
                    for (int i = 0; i < vehiIds.length; i++) {
                      savePermits.put(vehiIds[i], vehiIds[i]);
                    }
                    List<StandardUserVehiPermitEx> delPermits = new ArrayList();
                    for (int i = 0; i < vehiPermits.size(); i++)
                    {
                      StandardUserVehiPermitExMore permitMore = (StandardUserVehiPermitExMore)vehiPermits.get(i);
                      if (savePermits.get(permitMore.getVehiId().toString()) != null)
                      {
                        StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
                        permit.setId(permitMore.getId());
                        permit.setUserId(permitMore.getUserId());
                        permit.setVehiIdno(permitMore.getVehiIdno());
                        delPermits.add(permit);
                      }
                    }
                    this.standardUserService.editUserVehiPermitEx(null, delPermits);
                  }
                  addUserAccountLog(Integer.valueOf(5), user);
                  sendUserPermitMsg(2, user.getId());
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
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
  
  public String saveUserPermit()
    throws Exception
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        String isPermit = getRequestString("isPermit");
        if ((id == null) || (id.isEmpty()) || (isPermit == null) || (isPermit.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, id);
          if (vehicle == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            StandardCompany company = vehicle.getCompany();
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
            {
              StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
              String vehiIdstr = userPermit.getPermits();
              if ((vehiIdstr != null) && (!vehiIdstr.isEmpty()))
              {
                AjaxDto<StandardUserAccount> userList = getUserAccounts(null, null);
                if ((userList.getPageList() != null) && (userList.getPageList().size() > 0))
                {
                  List<StandardUserAccount> users = userList.getPageList();
                  
                  String[] vehiIds = vehiIdstr.split(",");
                  if (isPermit.equals("0"))
                  {
                    List<StandardUserVehiPermitEx> addPermits = new ArrayList();
                    for (int i = 0; i < vehiIds.length; i++)
                    {
                      StandardUserVehiPermitEx newPermit = new StandardUserVehiPermitEx();
                      newPermit.setVehiIdno(vehicle.getVehiIDNO());
                      StandardUserAccount user = new StandardUserAccount();
                      for (int j = 0; j < users.size(); j++) {
                        if (((StandardUserAccount)users.get(j)).getId().intValue() == Integer.parseInt(vehiIds[i]))
                        {
                          user = (StandardUserAccount)users.get(j);
                          newPermit.setUserId(user.getId());
                          addPermits.add(newPermit);
                          break;
                        }
                      }
                    }
                    this.standardUserService.editUserVehiPermitEx(addPermits, null);
                    for (int i = 0; i < addPermits.size(); i++) {
                      sendUserPermitMsg(2, ((StandardUserVehiPermitEx)addPermits.get(i)).getUserId());
                    }
                  }
                  else if (isPermit.equals("1"))
                  {
                    List<StandardUserVehiPermitEx> vehiPermits = this.standardUserService.getAuthorizedUserVehicleList(null, vehicle.getVehiIDNO(), null);
                    
                    Map<String, String> savePermits = new HashMap();
                    for (int i = 0; i < vehiIds.length; i++) {
                      savePermits.put(vehiIds[i], vehiIds[i]);
                    }
                    List<StandardUserVehiPermitEx> delPermits = new ArrayList();
                    for (int i = 0; i < vehiPermits.size(); i++)
                    {
                      StandardUserVehiPermitEx permit = (StandardUserVehiPermitEx)vehiPermits.get(i);
                      if (savePermits.get(permit.getUserId().toString()) != null) {
                        delPermits.add(permit);
                      }
                    }
                    this.standardUserService.editUserVehiPermitEx(null, delPermits);
                    for (int i = 0; i < delPermits.size(); i++) {
                      sendUserPermitMsg(2, ((StandardUserVehiPermitEx)delPermits.get(i)).getUserId());
                    }
                  }
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
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
  
  public String getPermit()
    throws Exception
  {
    try
    {
      if ((!isRole("33")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String cid = getRequestString("cid");
        if ((cid == null) || (cid.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          StandardCompany company = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(cid))))) {
            company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(cid)));
          }
          if (company == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            AjaxDto<StandardVehicle> vehicles = getUserVehicles(company.getId(), null, null, isAdmin(), null);
            List<PartStandardInfo> partVehis = new ArrayList();
            if (vehicles.getPageList() != null) {
              for (int i = 0; i < vehicles.getPageList().size(); i++)
              {
                PartStandardInfo info = new PartStandardInfo();
                StandardVehicle vehicle = (StandardVehicle)vehicles.getPageList().get(i);
                info.setId(vehicle.getId().toString());
                info.setName(vehicle.getVehiIDNO());
                if ((vehicle.getCompany().getLevel() != null) && (vehicle.getCompany().getLevel().intValue() == 2)) {
                  info.setParentId(vehicle.getCompany().getCompanyId());
                } else {
                  info.setParentId(vehicle.getCompany().getId());
                }
                partVehis.add(info);
              }
            }
            addCustomResponse("company", company);
            addCustomResponse("partVehis", partVehis);
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
  
  private void setVehiPermit(StandardUserAccount user, String vehiIdstr)
  {
    AjaxDto<StandardVehicle> vehicleList = getUserVehicles(user.getCompany().getId(), null, null, isAdmin(), null);
    if ((vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
    {
      List<StandardVehicle> vehicles = vehicleList.getPageList();
      List<QueryScalar> scalars = new ArrayList();
      scalars.add(new QueryScalar("vehiId", StandardBasicTypes.INTEGER));
      List<StandardUserVehiPermitExMore> vehiPermits = this.standardUserService.getAuthorizedVehicleExMoreList(user.getId(), null, scalars, ",b.ID as vehiId", ",jt808_vehicle_info b where a.VehiIDNO = b.VehiIDNO ");
      
      String[] vehiIds = vehiIdstr.split(",");
      
      Map<String, String> savePermits = new HashMap();
      for (int i = 0; i < vehiIds.length; i++) {
        savePermits.put(vehiIds[i], vehiIds[i]);
      }
      List<StandardUserVehiPermitEx> delPermits = new ArrayList();
      for (int i = 0; i < vehiPermits.size(); i++)
      {
        StandardUserVehiPermitExMore permitMore = (StandardUserVehiPermitExMore)vehiPermits.get(i);
        if (savePermits.get(permitMore.getVehiId().toString()) == null)
        {
          StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
          permit.setId(permitMore.getId());
          permit.setUserId(permitMore.getUserId());
          permit.setVehiIdno(permitMore.getVehiIdno());
          delPermits.add(permit);
        }
      }
      Map<String, String> existPermits = new HashMap();
      for (int i = 0; i < vehiPermits.size(); i++)
      {
        StandardUserVehiPermitExMore permit = (StandardUserVehiPermitExMore)vehiPermits.get(i);
        existPermits.put(permit.getVehiId().toString(), permit.getVehiId().toString());
      }
      List<StandardUserVehiPermitEx> addPermits = new ArrayList();
      if ((vehiIdstr != null) && (!vehiIdstr.isEmpty())) {
        for (int i = 0; i < vehiIds.length; i++) {
          if (existPermits.get(vehiIds[i]) == null)
          {
            StandardUserVehiPermitEx newPermit = new StandardUserVehiPermitEx();
            newPermit.setUserId(user.getId());
            for (int j = 0; j < vehicles.size(); j++) {
              if (((StandardVehicle)vehicles.get(j)).getId().intValue() == Integer.parseInt(vehiIds[i]))
              {
                newPermit.setVehiIdno(((StandardVehicle)vehicles.get(j)).getVehiIDNO());
                addPermits.add(newPermit);
                break;
              }
            }
          }
        }
      }
      this.standardUserService.editUserVehiPermitEx(addPermits, delPermits);
    }
  }
  
  public String getOnlineClientCount()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      List<Integer> lstId = new ArrayList();
      if (!isAdmin())
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        lstId = findUserCompanyIdList(user.getCompany().getId(), lstLevel, false);
      }
      Integer onlineCount = this.standardUserService.getClientOnlineCount(lstId, isAdmin());
      addCustomResponse("onlineCount", onlineCount);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getOnlineClientList()
  {
    try
    {
      String name = getRequestString("name");
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      List<Integer> lstId = new ArrayList();
      if (!isAdmin())
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        lstId = findUserCompanyIdList(user.getCompany().getId(), lstLevel, false);
      }
      AjaxDto<StandardUserSession> ajaxDto = this.standardUserService.getClientOnlineList(lstId, isAdmin(), name, getPaginationEx());
      addCustomResponse("infos", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  private boolean isExist(StandardUserAccount user, String account, String name)
  {
    StandardUserAccount oldUser = this.standardUserService.getStandardUserAccount(account, name);
    if ((oldUser == null) || ((user.getId() != null) && (oldUser.getId().intValue() == user.getId().intValue()))) {
      return false;
    }
    return true;
  }
  
  protected void addUserAccountLog(Integer subType, StandardUserAccount user)
  {
    addUserLog(Integer.valueOf(4), subType, null, user.getId().toString(), user.getAccount(), null, null);
  }
  
  protected void sendUserAccountMsg(int notifyType, StandardUserAccount user)
  {
    int userId = user.getId() == null ? 0 : user.getId().intValue();
    ActionContext ctx = ActionContext.getContext();
    String session = (String)ctx.getSession().get("userSession");
    this.notifyService.sendStandardInfoChange(notifyType, 3, userId, session);
    if (notifyType == 3) {
      delCacheVehiRelationByUser(user.getId());
    }
  }
  
  protected void sendUserPermitMsg(int notifyType, Integer userId)
  {
    int userId_ = userId == null ? 0 : userId.intValue();
    ActionContext ctx = ActionContext.getContext();
    String session = (String)ctx.getSession().get("userSession");
    this.notifyService.sendStandardInfoChange(notifyType, 4, userId_, session);
    
    updateCacheVehiRelationByUser(Integer.valueOf(userId_));
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
