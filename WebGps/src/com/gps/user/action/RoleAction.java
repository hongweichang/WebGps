package com.gps.user.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.NotifyService;
import com.gps.common.service.UserService;
import com.gps.model.UserRole;
import com.gps.user.service.RoleService;

public class RoleAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private RoleService roleService;
  
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
    return findPrivilege(UserRole.PRIVI_USERMGR_ROLE);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<UserRole> ajaxDto = this.roleService.getRoleList(name, getClientId(), getPagination());
      addCustomResponse("roles", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void addRoleMgrLog(Integer subType, UserRole role)
  {
    addUserLog(Integer.valueOf(5), subType, null, role.getId().toString(), role.getName(), null, null);
  }
  
  public String add()
    throws Exception
  {
    try
    {
      UserRole role = new UserRole();
      role = (UserRole)AjaxUtils.getObject(getRequest(), role.getClass());
      
      UserRole findRole = this.roleService.findByName(role.getName(), getClientId());
      if (findRole != null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
      else
      {
        role.setUserId(getClientId());
        String privilege = role.getPrivilege();
        if (!privilege.isEmpty()) {
          privilege = "," + privilege + ",";
        }
        role.setPrivilege(privilege);
        
        UserRole addRole = (UserRole)this.roleService.save(role);
        
        addRoleMgrLog(Integer.valueOf(1), addRole);
        this.notifyService.sendRoleChange(1, addRole.getId().intValue());
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
        Integer roleId = Integer.valueOf(Integer.parseInt(id));
        UserRole role = (UserRole)this.roleService.get(roleId);
        if (role != null)
        {
          addCustomResponse("privilege", role.getPrivilege());
          addCustomResponse("name", role.getName());
          addCustomResponse("remarks", role.getRemarks());
          
          readServerConfig();
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(21));
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
        UserRole role = (UserRole)this.roleService.get(Integer.valueOf(Integer.parseInt(id)));
        if (role != null)
        {
          UserRole saveRole = new UserRole();
          saveRole = (UserRole)AjaxUtils.getObject(getRequest(), saveRole.getClass());
          boolean save = true;
          if (!role.getName().equals(saveRole.getName()))
          {
            UserRole findRole = this.roleService.findByName(saveRole.getName(), getClientId());
            if (findRole != null)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(22));
              save = false;
            }
          }
          if (save)
          {
            role.setName(saveRole.getName());
            role.setRemarks(saveRole.getRemarks());
            String privilege = saveRole.getPrivilege();
            if (!privilege.isEmpty()) {
              privilege = "," + privilege + ",";
            }
            role.setPrivilege(privilege);
            
            this.roleService.save(role);
            
            addRoleMgrLog(Integer.valueOf(2), role);
            this.notifyService.sendRoleChange(2, role.getId().intValue());
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(21));
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
          UserRole role = (UserRole)this.roleService.get(Integer.valueOf(Integer.parseInt(delIds[i])));
          if (role != null)
          {
            if (userService.getUserCount(null, getClientId(), role.getId()) > 0)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(23));
              break;
            }
            this.roleService.remove(role.getId());
            addRoleMgrLog(Integer.valueOf(3), role);
            this.notifyService.sendRoleChange(3, role.getId().intValue());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(21));
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
}
