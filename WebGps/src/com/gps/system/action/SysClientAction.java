package com.gps.system.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.SysBaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.UserService;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.system.service.SysUserService;
import com.opensymphony.xwork2.ActionContext;
import java.util.Calendar;
import java.util.Map;

public class SysClientAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private UserService userService;
  private NotifyService notifyService;
  private SysUserService sysUserService;
  private AccountService accountService;
  
  public UserService getUserService()
  {
    return this.userService;
  }
  
  public void setUserService(UserService userService)
  {
    this.userService = userService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      String parent = getRequestString("parentId");
      Integer parentId = null;
      if ((parent != null) && (!parent.isEmpty())) {
        parentId = Integer.valueOf(Integer.parseInt(parent));
      } else {
        parentId = Integer.valueOf(0);
      }
      AjaxDto<UserInfo> ajaxDto = this.userService.getUserList(name, parentId, null, getPagination());
      addCustomResponse("clients", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
      addCustomResponse("clientCount", Integer.valueOf(this.userService.getUserCount(null, Integer.valueOf(0), null)));
      if ((parentId != null) && (!parentId.equals(Integer.valueOf(0)))) {
        addCustomResponse("userCount", Integer.valueOf(this.userService.getUserCount(null, parentId, null)));
      } else {
        addCustomResponse("userCount", Integer.valueOf(this.userService.getClientUserCount()));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  private void addOperatorLog(UserInfo clientInfo, Integer type)
  {
    Integer sysusrid = getSessionSysUsrId();
    if (sysusrid != null) {
      this.sysUserService.addSysUsrLog(sysusrid, Integer.valueOf(4), type, 
        clientInfo.getId().toString(), clientInfo.getUserAccount().getAccount(), "", "");
    }
  }
  
  protected void updateUserAccount(UserInfo client)
  {
    setDefaultPassword(client);
    client.getUserAccount().setType(Integer.valueOf(2));
    Calendar cal = Calendar.getInstance();
    cal.set(2036, 12, 31);
    client.getUserAccount().setValidity(cal.getTime());
    client.setParentId(Integer.valueOf(0));
    client.setIsAdmin(Integer.valueOf(1));
    client.setRoleId(UserInfo.DEFAULT_ROLE);
  }
  
  protected void setDefaultPassword(UserInfo client)
  {
    client.getUserAccount().setPassword(MD5EncryptUtils.encrypt("000000"));
  }
  
  public String add()
    throws Exception
  {
    try
    {
      UserInfo client = new UserInfo();
      client = (UserInfo)AjaxUtils.getObject(getRequest(), client.getClass());
      
      UserAccount account = this.accountService.findByAccount(client.getUserAccount().getAccount());
      if ((account != null) || (this.accountService.isAccountUnvalid(client.getUserAccount().getAccount())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(15));
      }
      else
      {
        updateUserAccount(client);
        if (ActionContext.getContext().getSession().get("updatepwd").equals(Boolean.valueOf(true))) {
          client.setPwdStatus(Integer.valueOf(0));
        } else {
          client.setPwdStatus(Integer.valueOf(1));
        }
        this.log.error("SysClientAction add updateUserAccount");
        Calendar calendar = Calendar.getInstance();
        this.log.error(DateUtil.dateSwitchString(calendar.getTime()));
        this.log.error(DateUtil.dateSwitchString(client.getUserAccount().getValidity()));
        UserInfo addUser = null;
        try
        {
          addUser = (UserInfo)this.userService.save(client);
        }
        catch (Exception ex)
        {
          this.log.error("SysClientAction add auto increase id failed");
          this.log.error(ex.getMessage(), ex);
        }
        if (addUser != null) {
          try
          {
            this.userService.get(addUser.getId());
          }
          catch (Exception ex)
          {
            this.log.error(ex.getMessage(), ex);
            
            UserAccount acount = this.accountService.findByAccount(client.getUserAccount().getAccount());
            if (acount != null)
            {
              this.userService.updateUserAccountId(addUser.getId(), acount.getId());
              try
              {
                this.userService.get(addUser.getId());
              }
              catch (Exception ex2)
              {
                this.userService.deleteUserNative(addUser.getId(), client.getUserAccount().getAccount());
                addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
              }
            }
            else
            {
              this.log.error("SysClientAction add client auto increase id failed");
              this.userService.deleteUserNative(addUser.getId(), client.getUserAccount().getAccount());
              addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
            }
          }
        }
        if (addUser != null)
        {
          addOperatorLog(addUser, Integer.valueOf(1));
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
        UserInfo client = (UserInfo)this.userService.get(clientId);
        if (client != null)
        {
          addCustomResponse("name", client.getUserAccount().getName());
          addCustomResponse("account", client.getUserAccount().getAccount());
          addCustomResponse("linkMan", client.getLinkMan());
          addCustomResponse("telephone", client.getTelephone());
          addCustomResponse("email", client.getEmail());
          addCustomResponse("address", client.getAddress());
          addCustomResponse("url", client.getUrl());
          String statics = getRequestString("statics");
          if ((statics != null) && (statics.equals("1")))
          {
            addCustomResponse("deviceCount", Integer.valueOf(this.deviceService.getDeviceCount(null, clientId, null)));
            addCustomResponse("userCount", Integer.valueOf(this.userService.getUserCount(null, clientId, null)));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
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
        UserInfo client = (UserInfo)this.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (client != null)
        {
          UserInfo saveClient = new UserInfo();
          saveClient = (UserInfo)AjaxUtils.getObject(getRequest(), saveClient.getClass());
          
          client.getUserAccount().setName(saveClient.getUserAccount().getName());
          
          client.setLinkMan(saveClient.getLinkMan());
          client.setTelephone(saveClient.getTelephone());
          client.setEmail(saveClient.getEmail());
          client.setAddress(saveClient.getAddress());
          client.setUrl(saveClient.getUrl());
          
          this.userService.save(client);
          
          addOperatorLog(client, Integer.valueOf(2));
          this.notifyService.sendClientChange(2, client.getId().intValue());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
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
          UserInfo client = (UserInfo)this.userService.get(Integer.valueOf(Integer.parseInt(delIds[i])));
          if (client != null)
          {
            if (this.deviceService.getDeviceCount(null, client.getId(), null) > 0)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(17));
              break;
            }
            if (this.userService.getUserCount(null, client.getId(), null) > 0)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(18));
              break;
            }
            this.userService.remove(client.getId());
            addOperatorLog(client, Integer.valueOf(3));
            this.notifyService.sendClientChange(3, client.getId().intValue());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
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
        UserInfo client = (UserInfo)this.userService.get(Integer.valueOf(Integer.parseInt(id)));
        if (client != null)
        {
          setDefaultPassword(client);
          this.userService.save(client);
          addOperatorLog(client, Integer.valueOf(4));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
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
