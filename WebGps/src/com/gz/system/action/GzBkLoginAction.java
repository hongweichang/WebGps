package com.gz.system.action;

import com.framework.logger.Logger;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.gz.system.model.GzBkUserInfo;
import com.gz.system.model.GzPasswdInfo;
import com.gz.system.model.GzUserInfo;
import com.gz.system.service.GzBkUserService;
import com.gz.system.service.GzPasswdService;
import com.gz.system.service.GzUserService;
import com.opensymphony.xwork2.ActionContext;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class GzBkLoginAction
  extends BaseAction
{
  public static final int LOGIN_RET_SUCCESS = 0;
  public static final int LOGIN_RET_NAME_ERROR = 1;
  public static final int LOGIN_RET_PWD_ERROR = 2;
  public static final int LOGIN_RET_EXPIRE_ERROR = 3;
  public static final int LOGIN_RET_VERIFICATION_ERROR = 4;
  public static final int LOGIN_RET_EXCEPTION_ERROR = 5;
  public static final int RET_EXCEPTION_ERROR = 6;
  public static final int RET_ACCOUNT_EXIST = 7;
  public static final int RET_TYPE_PARAM = 8;
  public static final int RET_ID_PARAM = 9;
  public static final int RET_CLIENT_NO_EXIST = 10;
  public static final int RET_NO_PRIVILIGE = 11;
  public static final int RET_IS_ADMIN = 12;
  public static final int RET_PASS_WORD = 13;
  public static final int RET_PASSWD_EXIST = 14;
  private static final long serialVersionUID = 1L;
  private GzBkUserService gzBkUserService;
  private GzUserService gzUserService;
  private GzPasswdService gzPasswdService;
  
  public GzBkUserService getGzBkUserService()
  {
    return this.gzBkUserService;
  }
  
  public void setGzBkUserService(GzBkUserService gzBkUserService)
  {
    this.gzBkUserService = gzBkUserService;
  }
  
  public GzUserService getGzUserService()
  {
    return this.gzUserService;
  }
  
  public void setGzUserService(GzUserService gzUserService)
  {
    this.gzUserService = gzUserService;
  }
  
  public String login()
    throws Exception
  {
    try
    {
      String verificationCode = "1";
      String code = "1";
      if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
      {
        addCustomResponse("result", Integer.valueOf(4));
      }
      else
      {
        String name = getRequestString("name");
        String password = getRequestString("password");
        
        GzBkUserInfo user = this.gzBkUserService.getUserInfoByAccount(name);
        if (user == null)
        {
          addCustomResponse("result", Integer.valueOf(1));
        }
        else if ((password != null) && (password.equals(user.getPassword())))
        {
          addCustomResponse("result", Integer.valueOf(0));
          
          getSession().put("bkuser", user);
          
          addCustomResponse("bkuser", user);
          
          ActionContext ctx = ActionContext.getContext();
          ctx.getSession().put("backid", user.getId().toString());
          ctx.getSession().put("name", user.getName());
        }
        else
        {
          addCustomResponse("result", Integer.valueOf(2));
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(5));
    }
    return "success";
  }
  
  public String logout()
    throws Exception
  {
    try
    {
      HttpSession session = getRequest().getSession();
      session.invalidate();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(5));
    }
    return "success";
  }
  
  public String add()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 3)
      {
        GzBkUserInfo bkuser = new GzBkUserInfo();
        String name = getRequestString("name");
        String password = getRequestString("password");
        String type = getRequestString("type");
        if ((Integer.parseInt(type) == 1) || (Integer.parseInt(type) == 2))
        {
          bkuser.setName(name);
          bkuser.setPassword(password);
          bkuser.setType(Integer.valueOf(Integer.parseInt(type)));
          
          GzBkUserInfo account = this.gzBkUserService.getUserInfoByAccount(name);
          if (account != null)
          {
            addCustomResponse("result", Integer.valueOf(7));
          }
          else
          {
            GzBkUserInfo gzBkUserInfo = null;
            try
            {
              gzBkUserInfo = (GzBkUserInfo)this.gzBkUserService.save(bkuser);
            }
            catch (Exception ex)
            {
              this.log.error(ex.getMessage(), ex);
            }
          }
        }
        else
        {
          addCustomResponse("result", Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String save()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 3)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
        }
        else
        {
          GzBkUserInfo client = (GzBkUserInfo)this.gzBkUserService.get(Integer.valueOf(Integer.parseInt(id)));
          if (client != null)
          {
            if (!client.getName().equals("admin"))
            {
              String name = getRequestString("name");
              GzBkUserInfo account = this.gzBkUserService.getUserInfoByAccount(name);
              if ((account != null) && (!account.getId().toString().equals(id)))
              {
                addCustomResponse("result", Integer.valueOf(7));
              }
              else
              {
                String password = getRequestString("password");
                String type = getRequestString("type");
                if ((Integer.parseInt(type) == 1) || (Integer.parseInt(type) == 2))
                {
                  client.setName(name);
                  client.setPassword(password);
                  client.setType(Integer.valueOf(Integer.parseInt(type)));
                }
                else
                {
                  addCustomResponse("result", Integer.valueOf(8));
                }
                this.gzBkUserService.save(client);
              }
            }
            else
            {
              addCustomResponse("result", Integer.valueOf(12));
            }
          }
          else {
            addCustomResponse("result", Integer.valueOf(10));
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String delete()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 3)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
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
            GzBkUserInfo client = (GzBkUserInfo)this.gzBkUserService.get(Integer.valueOf(Integer.parseInt(delIds[i])));
            if (client != null)
            {
              if (!client.getName().equals("admin")) {
                this.gzBkUserService.remove(client.getId());
              } else {
                addCustomResponse("result", Integer.valueOf(12));
              }
            }
            else
            {
              addCustomResponse("result", Integer.valueOf(10));
              break;
            }
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String get()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 3)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
        }
        else
        {
          Integer clientId = Integer.valueOf(Integer.parseInt(id));
          GzBkUserInfo client = (GzBkUserInfo)this.gzBkUserService.get(clientId);
          if (client != null)
          {
            addCustomResponse("bkuser", client);
            
            ActionContext ctx = ActionContext.getContext();
            ctx.getSession().put("backid", client.getId().toString());
            ctx.getSession().put("name", client.getName());
          }
          else
          {
            addCustomResponse("result", Integer.valueOf(10));
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String list()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 3)
      {
        String name = getRequestString("name");
        String type = getRequestString("type");
        Integer ont = null;
        if ((type != null) && (!type.isEmpty()))
        {
          ont = Integer.valueOf(Integer.parseInt(type));
          if ((ont.intValue() != 1) || (ont.intValue() != 2) || (ont.intValue() != 3)) {
            ont = Integer.valueOf(0);
          }
        }
        else
        {
          ont = Integer.valueOf(0);
        }
        AjaxDto<GzBkUserInfo> ajaxDto = this.gzBkUserService.getBkUserList(name, ont, getRequestPagination());
        addCustomResponse("clients", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
        addCustomResponse("clientCount", Integer.valueOf(this.gzBkUserService.getBkUserCount(name, ont)));
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String userLogin()
    throws Exception
  {
    try
    {
      String verificationCode = "1";
      String code = "1";
      if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
      {
        addCustomResponse("result", Integer.valueOf(4));
      }
      else
      {
        String username = getRequestString("username");
        String password = getRequestString("password");
        
        GzUserInfo user = this.gzUserService.getUserInfoByAccount(username);
        if (user == null)
        {
          addCustomResponse("result", Integer.valueOf(1));
        }
        else if ((password != null) && (password.equals(user.getPassword())))
        {
          addCustomResponse("result", Integer.valueOf(0));
          
          getSession().put("user", user);
          
          addCustomResponse("user", user);
          
          ActionContext ctx = ActionContext.getContext();
          ctx.getSession().put("id", user.getId().toString());
          ctx.getSession().put("username", user.getUsername());
        }
        else
        {
          addCustomResponse("result", Integer.valueOf(2));
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(5));
    }
    return "success";
  }
  
  public String addUser()
    throws Exception
  {
    try
    {
      GzBkUserInfo bkuser = (GzBkUserInfo)getSession().get("bkuser");
      if (bkuser.getType().intValue() == 1)
      {
        GzUserInfo user = new GzUserInfo();
        String username = getRequestString("username");
        String password = getRequestString("password");
        String companyname = getRequestString("companyname");
        String phone = getRequestString("phone");
        if (password.length() == 6)
        {
          user.setUsername(username);
          user.setPassword(password);
          user.setCompanyname(companyname);
          user.setPhone(phone);
          
          GzUserInfo account = this.gzUserService.getUserInfoByAccount(username);
          if (account != null)
          {
            addCustomResponse("result", Integer.valueOf(7));
          }
          else
          {
            GzUserInfo gzUserInfo = null;
            try
            {
              gzUserInfo = (GzUserInfo)this.gzUserService.save(user);
            }
            catch (Exception ex)
            {
              this.log.error(ex.getMessage(), ex);
            }
          }
        }
        else
        {
          addCustomResponse("result", Integer.valueOf(13));
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String saveUser()
    throws Exception
  {
    try
    {
      GzBkUserInfo bkuser = (GzBkUserInfo)getSession().get("bkuser");
      if (bkuser.getType().intValue() == 1)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
        }
        else
        {
          GzUserInfo client = (GzUserInfo)this.gzUserService.get(Integer.valueOf(Integer.parseInt(id)));
          if (client != null)
          {
            String username = getRequestString("username");
            GzUserInfo account = this.gzUserService.getUserInfoByAccount(username);
            if ((account != null) && (!account.getId().toString().equals(id)))
            {
              addCustomResponse("result", Integer.valueOf(7));
            }
            else
            {
              String password = getRequestString("password");
              String companyname = getRequestString("companyname");
              String phone = getRequestString("phone");
              client.setUsername(username);
              client.setPassword(password);
              client.setCompanyname(companyname);
              client.setPhone(phone);
              this.gzUserService.save(client);
            }
          }
          else
          {
            addCustomResponse("result", Integer.valueOf(10));
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String deleteUser()
    throws Exception
  {
    try
    {
      GzBkUserInfo bkuser = (GzBkUserInfo)getSession().get("bkuser");
      if (bkuser.getType().intValue() == 1)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
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
            GzUserInfo client = (GzUserInfo)this.gzUserService.get(Integer.valueOf(Integer.parseInt(delIds[i])));
            if (client != null)
            {
              this.gzUserService.remove(client.getId());
            }
            else
            {
              addCustomResponse("result", Integer.valueOf(10));
              break;
            }
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String getUser()
    throws Exception
  {
    try
    {
      GzBkUserInfo bkuser = (GzBkUserInfo)getSession().get("bkuser");
      if (bkuser.getType().intValue() == 1)
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse("result", Integer.valueOf(9));
        }
        else
        {
          Integer clientId = Integer.valueOf(Integer.parseInt(id));
          GzUserInfo client = (GzUserInfo)this.gzUserService.get(clientId);
          if (client != null)
          {
            addCustomResponse("user", client);
            
            ActionContext ctx = ActionContext.getContext();
            ctx.getSession().put("id", client.getId().toString());
            ctx.getSession().put("username", client.getUsername());
          }
          else
          {
            addCustomResponse("result", Integer.valueOf(10));
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String userList()
    throws Exception
  {
    try
    {
      GzBkUserInfo user = (GzBkUserInfo)getSession().get("bkuser");
      if (user.getType().intValue() == 1)
      {
        String username = getRequestString("username");
        String companyname = getRequestString("companyname");
        String phone = getRequestString("phone");
        AjaxDto<GzUserInfo> ajaxDto = this.gzUserService.getUserList(username, companyname, phone, getRequestPagination());
        addCustomResponse("clients", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
        addCustomResponse("clientCount", Integer.valueOf(this.gzUserService.getUserCount(username, companyname, phone)));
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
  
  public String addPasswd()
    throws Exception
  {
    try
    {
      GzBkUserInfo bkuser = (GzBkUserInfo)getSession().get("bkuser");
      if (bkuser.getType().intValue() == 1)
      {
        GzPasswdInfo passwd = new GzPasswdInfo();
        String passwdid = getRequestString("passwdid");
        String monitorid = getRequestString("monitorid");
        String startdate = getRequestString("startdate");
        String enddate = getRequestString("enddate");
        
        GzPasswdInfo account = this.gzPasswdService.getPasswd(passwdid);
        if (account != null)
        {
          addCustomResponse("result", Integer.valueOf(14));
        }
        else
        {
          GzPasswdInfo gzPasswdInfo = null;
          try
          {
            gzPasswdInfo = (GzPasswdInfo)this.gzPasswdService.save(passwd);
          }
          catch (Exception ex)
          {
            this.log.error(ex.getMessage(), ex);
          }
        }
      }
      else
      {
        addCustomResponse("result", Integer.valueOf(11));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse("result", Integer.valueOf(6));
    }
    return "success";
  }
}
