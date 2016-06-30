package com.framework.listener;

import com.framework.utils.DateUtil;
import com.gps.common.service.UserService;
import com.gps.model.LiveVideoSession;
import com.gps.model.RememberKey;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.system.model.SysUsrInfo;
import com.gps.system.service.SysUserService;
import com.gps.user.action.LoginAction;
import com.gps808.model.StandardUserAccount;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import org.apache.struts2.ServletActionContext;

public class UserBindingListener
  extends LoginAction
  implements HttpSessionBindingListener
{
  private static final long serialVersionUID = 1L;
  private static String ONLINEUSERLIST = "onlineUserList";
  private UserService userService;
  private SysUserService sysUserService;
  private Integer param;
  private Integer userId;
  private Integer accountId;
  private String str;
  private Object object;
  private Integer userLogId;
  
  public UserBindingListener(Object obj1, Object obj2, Integer param)
  {
    if ((obj1 instanceof UserService)) {
      this.userService = ((UserService)obj1);
    } else if ((obj1 instanceof SysUserService)) {
      this.sysUserService = ((SysUserService)obj1);
    }
    if ((obj2 instanceof UserInfo))
    {
      this.userId = ((UserInfo)obj2).getId();
      this.accountId = ((UserInfo)obj2).getAccountId();
      this.str = ("用户：" + ((UserInfo)obj2).getUserAccount().getAccount() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof SysUsrInfo))
    {
      this.userId = ((SysUsrInfo)obj2).getId();
      this.str = ("后台用户：" + ((SysUsrInfo)obj2).getName() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof UserAccount))
    {
      this.userId = ((UserAccount)obj2).getId();
      this.str = ("用户：" + ((UserAccount)obj2).getAccount() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof StandardUserAccount))
    {
      this.userId = ((StandardUserAccount)obj2).getId();
      this.str = ("用户：" + ((StandardUserAccount)obj2).getAccount() + "编号：" + this.userId);
    }
    this.object = obj2;
    this.param = param;
  }
  
  public UserBindingListener(Object obj1, Object obj2, Integer param1, Integer param2)
  {
    if ((obj1 instanceof UserService)) {
      this.userService = ((UserService)obj1);
    } else if ((obj1 instanceof SysUserService)) {
      this.sysUserService = ((SysUserService)obj1);
    }
    if ((obj2 instanceof UserInfo))
    {
      this.userId = ((UserInfo)obj2).getId();
      this.accountId = ((UserInfo)obj2).getAccountId();
      this.str = ("用户：" + ((UserInfo)obj2).getUserAccount().getAccount() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof SysUsrInfo))
    {
      this.userId = ((SysUsrInfo)obj2).getId();
      this.str = ("后台用户：" + ((SysUsrInfo)obj2).getName() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof UserAccount))
    {
      this.userId = ((UserAccount)obj2).getId();
      this.str = ("用户：" + ((UserAccount)obj2).getAccount() + "编号：" + this.userId);
    }
    else if ((obj2 instanceof StandardUserAccount))
    {
      this.userId = ((StandardUserAccount)obj2).getId();
      this.str = ("用户：" + ((StandardUserAccount)obj2).getAccount() + "编号：" + this.userId);
    }
    this.object = obj2;
    this.param = param1;
    this.userLogId = param2;
  }
  
  public void valueBound(HttpSessionBindingEvent event)
  {
    HttpSession session = event.getSession();
    ServletContext application = session.getServletContext();
    
    List<String> onlineUserList = (List)application.getAttribute(ONLINEUSERLIST);
    if (onlineUserList == null)
    {
      onlineUserList = new ArrayList();
      application.setAttribute(ONLINEUSERLIST, onlineUserList);
    }
    List<String> synonlineUserList = Collections.synchronizedList(onlineUserList);
    synonlineUserList.add(session.getId());
    if ((this.object instanceof UserInfo))
    {
      session.removeAttribute("sysuser");
      session.removeAttribute("userAccount");
    }
    else if ((this.object instanceof SysUsrInfo))
    {
      session.removeAttribute("account");
      session.removeAttribute("userAccount");
    }
    else if ((this.object instanceof UserAccount))
    {
      session.removeAttribute("sysuser");
      session.removeAttribute("userAccount");
    }
    else if ((this.object instanceof StandardUserAccount))
    {
      session.removeAttribute("sysuser");
      session.removeAttribute("account");
    }
    System.out.println(this.str + "登陆。");
  }
  
  public void valueUnbound(HttpSessionBindingEvent event)
  {
    HttpSession session = event.getSession();
    ServletContext application = session.getServletContext();
    try
    {
      List<String> synonlineUserList = Collections.synchronizedList((List)application.getAttribute(ONLINEUSERLIST));
      if ((synonlineUserList != null) && (synonlineUserList.size() > 0)) {
        synonlineUserList.remove(session.getId());
      }
    }
    catch (NullPointerException localNullPointerException) {}
    String ip = "";
    try
    {
      ip = ServletActionContext.getRequest().getRemoteAddr();
    }
    catch (Exception localException) {}
    if ((this.param != null) && (this.userService != null))
    {
      LiveVideoSession liveVideo = this.userService.findLiveVideoSessionById(this.param);
      if (liveVideo != null)
      {
        liveVideo.setStatus(Integer.valueOf(1));
        this.userService.save(liveVideo);
      }
    }
    if ((this.userId != null) && (this.userService != null))
    {
      this.userService.addUserLog(this.userId, Integer.valueOf(1), 
        Integer.valueOf(2), session.getId(), ip, null, String.format("%d", new Object[] { Integer.valueOf(5) }), null);
      if (this.userLogId != null) {
        this.userService.updateUserLoginLog(this.userLogId, DateUtil.dateSwitchString(new Date()));
      }
    }
    if ((this.userId != null) && (this.sysUserService != null)) {
      this.sysUserService.addSysUsrLog(this.userId, Integer.valueOf(1), 
        Integer.valueOf(2), ip, null, null, null);
    }
    if ((this.accountId != null) && (this.userService != null))
    {
      RememberKey key = this.userService.findRememberKeyById(this.accountId);
      if (key != null) {
        this.userService.delete(key);
      }
    }
    System.out.println(this.str + "退出。");
  }
}
