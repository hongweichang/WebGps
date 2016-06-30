package com.gps.system.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.listener.UserBindingListener;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.action.BaseAction;
import com.gps.common.action.SysBaseAction;
import com.gps.system.model.SysUsrInfo;
import com.gps.system.service.SysUserService;
import com.gps.system.vo.Password;
import com.opensymphony.xwork2.ActionContext;
import java.util.Date;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

public class SysLoginAction
  extends SysBaseAction
{
  public static final int LOGIN_RET_SUCCESS = 0;
  public static final int LOGIN_RET_NAME_ERROR = 1;
  public static final int LOGIN_RET_PWD_ERROR = 2;
  public static final int LOGIN_RET_EXPIRE_ERROR = 3;
  public static final int LOGIN_RET_VERIFICATION_ERROR = 4;
  public static final int LOGIN_RET_EXCEPTION_ERROR = 5;
  private static final long serialVersionUID = 1L;
  private SysUserService sysUserService;
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  public String login()
    throws Exception
  {
    try
    {
      if (is808GPS)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        return "success";
      }
      String verificationCode = getRequestString("verificationCode");
      String code = (String)getSession().get("rand");
      if ((code == null) || (!verificationCode.equalsIgnoreCase(code)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
      }
      else
      {
        String userAccount = getRequestString("userAccount");
        String password = getRequestString("password");
        
        SysUsrInfo user = this.sysUserService.getUserInfoByAccount(userAccount);
        if (user == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
        }
        else
        {
          if ((password != null) && (!password.isEmpty())) {
            password = MD5EncryptUtils.encrypt(password);
          }
          if ((password != null) && ((password.equalsIgnoreCase(user.getPassword())) || (user.getPassword() == null)))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(0));
            
            HttpServletRequest request = ServletActionContext.getRequest();
            user.setLastLoginAddr(request.getRemoteAddr());
            user.setLastLoginTime(new Date());
            this.sysUserService.saveUsrLogin(user);
            
            getSession().put("sysuser", user);
            
            addCustomResponse("Account", user.getName());
            addCustomResponse("Role", user.getRole());
            
            ActionContext ctx = ActionContext.getContext();
            ctx.getSession().put("userid", user.getId().toString());
            ctx.getSession().put("username", user.getName());
            ctx.getSession().put("role", user.getRole().toString());
            ctx.getSession().put("sysuser", user.getName());
            ctx.getSession().put("updatepwd", Boolean.valueOf(BaseAction.getEnableUpdatePwd()));
            
            updateSessionLanguage();
            getSession().put("onlineUserBindingListener", new UserBindingListener(this.sysUserService, user, null));
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String logout()
    throws Exception
  {
    try
    {
      ActionContext ctx = ActionContext.getContext();
      String userid = (String)ctx.getSession().get("userid");
      HttpServletRequest request = ServletActionContext.getRequest();
      HttpSession session = request.getSession();
      
      session.invalidate();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(5));
    }
    return "success";
  }
  
  public String password()
    throws Exception
  {
    try
    {
      SysUsrInfo usr = getSessionUsr();
      if (usr != null)
      {
        Password password = new Password();
        password = (Password)AjaxUtils.getObject(getRequest(), password.getClass());
        if (!usr.getPassword().equalsIgnoreCase(MD5EncryptUtils.encrypt(password.getOldPwd())))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(19));
        }
        else
        {
          usr.setPassword(MD5EncryptUtils.encrypt(password.getNewPwd()));
          this.sysUserService.saveUsrInfo(usr);
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected SysUsrInfo getSessionUsr()
  {
    Integer sysUsrId = getSessionSysUsrId();
    if (sysUsrId != null)
    {
      SysUsrInfo usr = this.sysUserService.getUsrInfo(sysUsrId);
      return usr;
    }
    return null;
  }
  
  public String getAccount()
    throws Exception
  {
    try
    {
      SysUsrInfo usr = getSessionUsr();
      if (usr != null)
      {
        addCustomResponse("name", usr.getName());
        addCustomResponse("telephone", usr.getTelephone());
        addCustomResponse("email", usr.getEmail());
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveAccount()
    throws Exception
  {
    try
    {
      SysUsrInfo usr = getSessionUsr();
      if (usr != null)
      {
        SysUsrInfo newUsr = new SysUsrInfo();
        newUsr = (SysUsrInfo)AjaxUtils.getObject(getRequest(), newUsr.getClass());
        usr.setTelephone(newUsr.getTelephone());
        usr.setEmail(newUsr.getEmail());
        this.sysUserService.save(usr);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(20));
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
