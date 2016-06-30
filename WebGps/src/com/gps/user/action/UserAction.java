package com.gps.user.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.UserService;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.model.UserRole;
import com.gps.user.model.UserDevPermit;
import com.gps.user.service.RoleService;
import com.gps.user.service.UserDevPermitService;
import com.gps.user.vo.UserPermit;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private AccountService accountService;
  private RoleService roleService;
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public RoleService getRoleService()
  {
    return this.roleService;
  }
  
  public void setRoleService(RoleService roleService)
  {
    this.roleService = roleService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_USERMGR_USER);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      String role = getRequestString("roleId");
      Integer roleId = null;
      if ((role != null) && (!role.isEmpty())) {
        roleId = Integer.valueOf(Integer.parseInt(role));
      }
      AjaxDto<UserInfo> ajaxDto = UserBaseAction.userService.getUserList(name, getClientId(), roleId, getPagination());
      addCustomResponse("users", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void updateUserAccount(UserInfo user)
  {
    user.getUserAccount().setType(Integer.valueOf(2));
    user.setIsAdmin(Integer.valueOf(0));
    user.setParentId(getClientId());
  }
  
  protected void setDefaultPassword(UserInfo client)
  {
    client.getUserAccount().setPassword(MD5EncryptUtils.encrypt("000000"));
  }
  
  protected void addUserMgrLog(Integer subType, UserInfo user)
  {
    addUserLog(Integer.valueOf(4), subType, null, user.getAccountId().toString(), user.getUserAccount().getName(), null, null);
  }
  
  public String allRoles()
    throws Exception
  {
    try
    {
      AjaxDto<UserRole> ajaxDto = this.roleService.getRoleList(null, getClientId(), null);
      addCustomResponse("roles", ajaxDto.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String add()
    throws Exception
  {
    try
    {
      UserInfo user = new UserInfo();
      user = (UserInfo)AjaxUtils.getObject(getRequest(), user.getClass());
      
      UserAccount account = this.accountService.findByAccount(user.getUserAccount().getAccount());
      if ((account != null) || (this.accountService.isAccountUnvalid(user.getUserAccount().getAccount())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(15));
      }
      else
      {
        Integer isAdmin = user.getIsAdmin();
        
        updateUserAccount(user);
        user.getUserAccount().setPassword(MD5EncryptUtils.encrypt(user.getUserAccount().getPassword()));
        if ((isAdmin != null) && (isAdmin.equals(UserInfo.USER_DEMO))) {
          user.setIsAdmin(UserInfo.USER_DEMO);
        }
        if (ActionContext.getContext().getSession().get("updatepwd").equals(Boolean.valueOf(true))) {
          user.setPwdStatus(Integer.valueOf(0));
        } else {
          user.setPwdStatus(Integer.valueOf(1));
        }
        UserInfo addUser = null;
        try
        {
          addUser = (UserInfo)UserBaseAction.userService.save(user);
        }
        catch (Exception ex)
        {
          this.log.error("UserAction add auto increase id failed");
          this.log.error(ex.getMessage(), ex);
        }
        if (addUser != null) {
          try
          {
            UserBaseAction.userService.get(addUser.getId());
          }
          catch (Exception ex)
          {
            this.log.error(ex.getMessage(), ex);
            
            UserAccount acount = this.accountService.findByAccount(user.getUserAccount().getAccount());
            if (acount != null)
            {
              UserBaseAction.userService.updateUserAccountId(addUser.getId(), acount.getId());
              try
              {
                UserBaseAction.userService.get(addUser.getId());
              }
              catch (Exception ex2)
              {
                UserBaseAction.userService.deleteUserNative(addUser.getId(), user.getUserAccount().getAccount());
                addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
              }
            }
            else
            {
              this.log.error("UserAction add user auto increase id failed");
              UserBaseAction.userService.deleteUserNative(addUser.getId(), user.getUserAccount().getAccount());
              addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
            }
          }
        }
        if (addUser != null)
        {
          addUserMgrLog(Integer.valueOf(1), addUser);
          this.notifyService.sendClientChange(1, addUser.getId().intValue());
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
  
  public String get()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        Integer clientId = Integer.valueOf(Integer.parseInt(id));
        UserInfo client = (UserInfo)UserBaseAction.userService.get(clientId);
        if (client != null)
        {
          addCustomResponse("name", client.getUserAccount().getName());
          addCustomResponse("account", client.getUserAccount().getAccount());
          addCustomResponse("roleId", client.getRoleId());
          addCustomResponse("linkMan", client.getLinkMan());
          addCustomResponse("telephone", client.getTelephone());
          addCustomResponse("email", client.getEmail());
          addCustomResponse("address", client.getAddress());
          addCustomResponse("url", client.getUrl());
          addCustomResponse("isAdmin", client.getIsAdmin());
          addCustomResponse("validity", client.getUserAccount().getValidity());
          
          AjaxDto<UserRole> ajaxDtoRole = this.roleService.getRoleList(null, getClientId(), null);
          addCustomResponse("roles", ajaxDtoRole.getPageList());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
  
  public String save()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          UserInfo saveClient = new UserInfo();
          saveClient = (UserInfo)AjaxUtils.getObject(getRequest(), saveClient.getClass());
          
          user.getUserAccount().setName(saveClient.getUserAccount().getName());
          user.getUserAccount().setValidity(saveClient.getUserAccount().getValidity());
          
          user.setLinkMan(saveClient.getLinkMan());
          user.setTelephone(saveClient.getTelephone());
          user.setEmail(saveClient.getEmail());
          user.setAddress(saveClient.getAddress());
          user.setUrl(saveClient.getUrl());
          user.setRoleId(saveClient.getRoleId());
          if (!saveClient.getRoleId().equals(UserInfo.DEFAULT_ROLE))
          {
            UserRole role = (UserRole)this.roleService.get(saveClient.getRoleId());
            addCustomResponse("rolename", role.getName());
          }
          else
          {
            addCustomResponse("rolename", "");
          }
          if ((saveClient.getIsAdmin() != null) && (saveClient.getIsAdmin().equals(UserInfo.USER_DEMO))) {
            user.setIsAdmin(UserInfo.USER_DEMO);
          } else {
            user.setIsAdmin(Integer.valueOf(0));
          }
          UserBaseAction.userService.save(user);
          
          addUserMgrLog(Integer.valueOf(2), user);
          this.notifyService.sendClientChange(2, user.getId().intValue());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
  
  public String delete()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] delIds;
       
        if (id.indexOf(",") != -1)
        {
          delIds = id.split(",");
        }
        else
        {
          delIds = new String[1];
          delIds[0] = id;
        }
        for (int i = 0; i < delIds.length; i++)
        {
          UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(delIds[i])));
          if (user != null)
          {
            UserBaseAction.userService.remove(user.getId());
            addUserMgrLog(Integer.valueOf(3), user);
            this.notifyService.sendClientChange(3, user.getId().intValue());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
            break;
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
  
  public String resetPwd()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          setDefaultPassword(user);
          UserBaseAction.userService.save(user);
          addUserMgrLog(Integer.valueOf(4), user);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
  
  public String editPwd()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      String pwd = getRequestString("pwd");
      if ((id == null) || (id.isEmpty()) || (pwd == null) || (pwd.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          user.getUserAccount().setPassword(MD5EncryptUtils.encrypt(pwd));
          UserBaseAction.userService.save(user);
          addUserMgrLog(Integer.valueOf(4), user);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
  
  public String userEditPwd()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      String pwd = getRequestString("pwd");
      if ((id == null) || (id.isEmpty()) || (pwd == null) || (pwd.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          user.getUserAccount().setPassword(MD5EncryptUtils.encrypt(pwd));
          user.setPwdStatus(Integer.valueOf(1));
          UserBaseAction.userService.save(user);
          addUserMgrLog(Integer.valueOf(4), user);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          getClientAllDeviceAndGroup();
          List<UserDevPermit> devPermits = this.userDevPermitService.getDevPermitList(user.getUserAccount().getId());
          addCustomResponse("permits", devPermits);
          addCustomResponse("username", user.getUserAccount().getName());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
  
  public String savePermit()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserInfo user = (UserInfo)UserBaseAction.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (user != null)
        {
          UserPermit userPermit = new UserPermit();
          userPermit = (UserPermit)AjaxUtils.getObject(getRequest(), userPermit.getClass());
          List<UserDevPermit> devPermits = this.userDevPermitService.getDevPermitList(user.getAccountId());
          
          String[] devIdnos = userPermit.getPermits().split(",");
          
          Map savePermits = new HashMap();
          for (int i = 0; i < devIdnos.length; i++) {
            savePermits.put(devIdnos[i], devIdnos[i]);
          }
          List<UserDevPermit> delPermits = new ArrayList();
          for (int i = 0; i < devPermits.size(); i++)
          {
            UserDevPermit permit = (UserDevPermit)devPermits.get(i);
            if (savePermits.get(permit.getDevIdno()) == null) {
              delPermits.add(permit);
            }
          }
          Map existPermits = new HashMap();
          for (int i = 0; i < devPermits.size(); i++)
          {
            UserDevPermit permit = (UserDevPermit)devPermits.get(i);
            existPermits.put(permit.getDevIdno(), permit.getDevIdno());
          }
          List<UserDevPermit> addPermits = new ArrayList();
          for (int i = 0; i < devIdnos.length; i++) {
            if (existPermits.get(devIdnos[i]) == null)
            {
              UserDevPermit newPermit = new UserDevPermit();
              newPermit.setAccountId(user.getAccountId());
              newPermit.setDevIdno(devIdnos[i]);
              addPermits.add(newPermit);
            }
          }
          this.userDevPermitService.editUserDevPermit(addPermits, delPermits);
          
          addUserMgrLog(Integer.valueOf(5), user);
          this.notifyService.sendCliDeviceChange(2, user.getId().intValue());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
}
