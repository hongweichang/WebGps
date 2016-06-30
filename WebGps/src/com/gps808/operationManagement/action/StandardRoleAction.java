package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.action.BaseAction;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.user.vo.UserPrivi;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.opensymphony.xwork2.ActionContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardRoleAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String loadRoles()
  {
    try
    {
      String type = getRequestString("type");
      String name = getRequest().getParameter("name");
      String cid = getRequestString("cid");
      
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      if ((cid != null) && (!cid.isEmpty()) && (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(cid)))))
      {
        company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(cid)));
        cid = Integer.toString(company.getCompanyId());
        if (cid.equals("0")) {
          company = userAccount.getCompany();
        } else {
          company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(cid)));
        }
      }
      if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
      {
        AjaxDto<StandardUserRole> roleList = getUserRoles(company, isAdmin(), null, null, false);
        List<PartStandardInfo> partRoles = new ArrayList();
        if (roleList.getPageList() != null)
        {
          List<StandardUserRole> roles = roleList.getPageList();
          for (int i = 0; i < roles.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardUserRole role = (StandardUserRole)roles.get(i);
            info.setId(role.getId().toString());
            info.setName(role.getName());
            
            info.setParentId(Integer.valueOf(role.getCompany().getId().intValue() == -1 ? 0 : role.getCompany().getId().intValue()));
            partRoles.add(info);
          }
        }
        addCustomResponse("infos", partRoles);
      }
      else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
      {
        Pagination pagination = getPaginationEx();
        String condition = "";
        if ((name != null) && (!name.isEmpty())) {
          condition = String.format(" and (name like '%%%s%%' or company.name like '%%%s%%')", new Object[] { name, name });
        }
        AjaxDto<StandardUserRole> roleList = getUserRoles(company, isAdmin(), condition, pagination, false);
        if (roleList.getPageList() != null)
        {
          AjaxDto<StandardUserAccount> UserList = getUserAccounts(null, null);
          if (UserList.getPageList() != null)
          {
            List<StandardUserAccount> users = UserList.getPageList();
            for (int i = 0; i < roleList.getPageList().size(); i++)
            {
              String userIds = "";
              for (int j = 0; j < users.size(); j++)
              {
                StandardUserAccount user = (StandardUserAccount)users.get(j);
                if ((user.getRole() != null) && (user.getRole().getId().equals(((StandardUserRole)roleList.getPageList().get(i)).getId())))
                {
                  if (!userIds.isEmpty()) {
                    userIds = userIds + "_";
                  }
                  userIds = userIds + user.getId();
                }
              }
              ((StandardUserRole)roleList.getPageList().get(i)).setUserIds(userIds.toString());
            }
          }
        }
        addCustomResponse("infos", roleList.getPageList());
        addCustomResponse("pagination", roleList.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findUserRole()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardUserRole role = (StandardUserRole)this.standardUserService.getObject(StandardUserRole.class, Integer.valueOf(Integer.parseInt(id)));
        if (role == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), role.getCompany().getId())))
          {
            role.setPrivilege(getRolePrivilege2(role.getPrivilege()));
            addCustomResponse("role", role);
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
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String deleteUserRole()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if ((!isRole("32")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardUserRole role = (StandardUserRole)this.standardUserService.getObject(StandardUserRole.class, Integer.valueOf(Integer.parseInt(id)));
        if (role == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), role.getCompany().getId())))
          {
            List<StandardUserAccount> accountList = this.standardUserService.getAccountByRole(role.getId());
            if ((accountList != null) && (accountList.size() > 0))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(23));
            }
            else
            {
              this.standardUserService.delete(role);
              
              addRoleLog(Integer.valueOf(3), role);
              int roleId = role.getId() == null ? 0 : role.getId().intValue();
              this.notifyService.sendStandardInfoChange(3, 2, roleId, "");
            }
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
  
  public String mergeUserRole()
  {
    try
    {
      if ((!isRole("32")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String uid = getRequestString("uid") == null ? "" : getRequestString("uid");
        StandardUserRole role = new StandardUserRole();
        role = (StandardUserRole)AjaxUtils.getObject(getRequest(), role.getClass());
        role.setPrivilege(getRolePrivilege(role.getPrivilege()));
        if ((role.getName() == null) || (role.getName().isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else if (isExist(role))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(22));
        }
        else if (!uid.isEmpty())
        {
          StandardUserAccount user = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, Integer.valueOf(Integer.parseInt(uid)));
          if (user != null)
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), user.getCompany().getId()))) {
              if (user.getRole() == null)
              {
                if ((role.getCompany() == null) || (role.getCompany().getId() == null)) {
                  role.setCompany(userAccount.getCompany());
                }
                user.setRole(role);
                user = (StandardUserAccount)this.standardUserService.save(user);
                
                role = user.getRole();
                addRoleLog(Integer.valueOf(1), role);
                int roleId = role.getId() == null ? 0 : role.getId().intValue();
                this.notifyService.sendStandardInfoChange(1, 2, roleId, "");
                
                addUserLog(Integer.valueOf(4), Integer.valueOf(2), null, user.getId().toString(), user.getAccount(), null, null);
                sendUserAccountMsg(2, user);
              }
              else if (userAccount.getId().intValue() != user.getId().intValue())
              {
                StandardUserRole newRole = user.getRole();
                if ((role.getCompany() == null) || (role.getCompany().getId() == null)) {
                  newRole.setCompany(userAccount.getCompany());
                } else {
                  newRole.setCompany(role.getCompany());
                }
                newRole.setName(role.getName());
                newRole.setPrivilege(role.getPrivilege());
                this.standardUserService.save(newRole);
                
                addRoleLog(Integer.valueOf(2), newRole);
                int roleId = newRole.getId() == null ? 0 : newRole.getId().intValue();
                this.notifyService.sendStandardInfoChange(2, 2, roleId, "");
              }
            }
          }
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if (role.getId() != null)
          {
            StandardUserRole newRole = (StandardUserRole)this.standardUserService.getObject(StandardUserRole.class, role.getId());
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), newRole.getCompany().getId())))
            {
              newRole.setName(role.getName());
              newRole.setPrivilege(role.getPrivilege());
              if ((role.getCompany() == null) || (role.getCompany().getId() == null)) {
                newRole.setCompany(userAccount.getCompany());
              } else {
                newRole.setCompany(role.getCompany());
              }
              this.standardUserService.save(newRole);
              
              addRoleLog(Integer.valueOf(2), newRole);
              int roleId = newRole.getId() == null ? 0 : newRole.getId().intValue();
              this.notifyService.sendStandardInfoChange(2, 2, roleId, "");
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
            }
          }
          else
          {
            if ((role.getCompany() == null) || (role.getCompany().getId() == null)) {
              role.setCompany(userAccount.getCompany());
            }
            role = (StandardUserRole)this.standardUserService.save(role);
            
            addRoleLog(Integer.valueOf(1), role);
            int roleId = role.getId() == null ? 0 : role.getId().intValue();
            this.notifyService.sendStandardInfoChange(1, 2, roleId, "");
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
  
  public String getRolePage()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      if (user == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(2));
      }
      else
      {
        ActionContext ctx = ActionContext.getContext();
        String roles = (String)ctx.getSession().get("privilege");
        if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_ROLE + ",") >= 0) || (isAdmin()) || (isMaster()))
        {
          List<UserPrivi> privis = new ArrayList();
          
          UserPrivi mymapPrivi = new UserPrivi(Integer.valueOf(40), "mymap", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_MAP_MONITORING + ",") >= 0) {
            mymapPrivi.addSubPriviEx(Integer.valueOf(43), Integer.toString(StandardUserRole.PRIVI_MAP_MONITORING), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_MAP_MY_MAP_MANAGE + ",") >= 0) {
            mymapPrivi.addSubPriviEx(Integer.valueOf(41), Integer.toString(StandardUserRole.PRIVI_MAP_MY_MAP_MANAGE), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_MAP_SHARE_MAP + ",") >= 0) {
            mymapPrivi.addSubPriviEx(Integer.valueOf(42), Integer.toString(StandardUserRole.PRIVI_MAP_SHARE_MAP), "");
          }
          if ((mymapPrivi.getListSubPrivi() != null) && (mymapPrivi.getListSubPrivi().size() > 0)) {
            privis.add(mymapPrivi);
          }
          UserPrivi avmonitorPrivi = new UserPrivi(Integer.valueOf(30), "avmonitor", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(31), Integer.toString(StandardUserRole.PRIVI_VIDEO), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_SOUND + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(32), Integer.toBinaryString(StandardUserRole.PRIVI_VIDEO_SOUND), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_TALK + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(33), Integer.toString(StandardUserRole.PRIVI_VIDEO_TALK), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_MONITOR + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(34), Integer.toString(StandardUserRole.PRIVI_VIDEO_MONITOR), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_DEV_CAPTURE + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(35), Integer.toString(StandardUserRole.PRIVI_VIDEO_DEV_CAPTURE), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_PTZ + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(36), Integer.toString(StandardUserRole.PRIVI_VIDEO_PTZ), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_RECORD + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(37), Integer.toString(StandardUserRole.PRIVI_VIDEO_RECORD), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_VIDEO_LIGHTS + ",") >= 0) {
            avmonitorPrivi.addSubPriviEx(Integer.valueOf(38), Integer.toString(StandardUserRole.PRIVI_VIDEO_LIGHTS), "");
          }
          if ((avmonitorPrivi.getListSubPrivi() != null) && (avmonitorPrivi.getListSubPrivi().size() > 0)) {
            privis.add(avmonitorPrivi);
          }
          UserPrivi teminalPrivi = new UserPrivi(Integer.valueOf(60), "teminal", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_PARAMETER + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(61), Integer.toString(StandardUserRole.PRIVI_DEVICE_PARAMETER), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_INFOR + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(62), Integer.toString(StandardUserRole.PRIVI_DEVICE_INFOR), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_UPDATE + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(63), Integer.toString(StandardUserRole.PRIVI_DEVICE_UPDATE), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_3G_FLOW + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(64), Integer.toString(StandardUserRole.PRIVI_DEVICE_3G_FLOW), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_MOVE + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(65), Integer.toString(StandardUserRole.PRIVI_DEVICE_MOVE), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_DEVICE_OTHER + ",") >= 0) {
            teminalPrivi.addSubPriviEx(Integer.valueOf(66), Integer.toString(StandardUserRole.PRIVI_DEVICE_OTHER), "");
          }
          if ((teminalPrivi.getListSubPrivi() != null) && (teminalPrivi.getListSubPrivi().size() > 0)) {
            privis.add(teminalPrivi);
          }
          UserPrivi playBackPrivi = new UserPrivi(Integer.valueOf(10), "playBack", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_TRACK_BACK + ",") >= 0) {
            playBackPrivi.addSubPriviEx(Integer.valueOf(44), Integer.toString(StandardUserRole.PRIVI_TRACK_BACK), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_RECORD_BACK + ",") >= 0) {
            playBackPrivi.addSubPriviEx(Integer.valueOf(45), Integer.toString(StandardUserRole.PRIVI_RECORD_BACK), "");
          }
          if ((playBackPrivi.getListSubPrivi() != null) && (playBackPrivi.getListSubPrivi().size() > 0)) {
            privis.add(playBackPrivi);
          }
          UserPrivi reportPrivi = new UserPrivi(Integer.valueOf(190), "report", "");
          boolean flag = false;
          if (BaseAction.getEnableTrip())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LINE_MONTH + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_MONTH + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVER_MONTH + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19993), "1021", "");
              flag = false;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LINE_DAILY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_DAILY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVER_DAILY + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19994), "1022", "");
              flag = false;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIP + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19995), "1023", "");
              flag = false;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_STATION + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19996), "1024", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasDrivingBehavior())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DRIVING_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OVERSPEED_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OVERSPEED_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1996), "1015", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportLogin())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LOGIN_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LOGIN_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DAILYONLINE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_MONTHLYONLINE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ONLINE_RATE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(192), "1001", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportAlarm())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(193), "1002", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasLiCheng())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LICHENG_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_LICHENG_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(195), "1003", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasDriving())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PARK_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PARK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ACC_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ACC_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(196), "1004", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportFence())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_FENCE_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_FENCE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(197), "1005", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportOil())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OILTRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OILEXCEPTION_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OIL_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(194), "1006", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasMalfunction())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_MALFUNCTION_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_MALFUNCTION_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1993), "1012", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasVideo())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VIDEO_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VIDEO_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1994), "1013", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportIoin())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_IO_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_IO_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1995), "1014", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportStorage())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_DISK_ERROR_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARM_HDD_HIGH_TEMPERATURE + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_HARDDISK_STATUS_INFORMATION + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(198), "1007", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableReportEquipment())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VERSION_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OFFLINE_RECORDING_EQUIPMENT_UPGRADE + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(199), "1008", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasMedia())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_PHOTO + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_AUDIO + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_VEHICLE_VIDEO + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1990), "1009", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasData())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_DATA + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_SMS_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1991), "1010", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasUserBehavior())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERONLINE_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERONLINE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_ALARMLOG_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_USERLOG_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1997), "1016", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasTraffic())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PEOPLE_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_PEOPLE_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1998), "1017", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasMalfunction())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMP_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMPTRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TEMPTRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(1999), "1018", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasSign())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_SIGNIN_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19992), "1020", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableTpms())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMS_SUMMARY + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMS_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_TPMSTRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19997), "1025", "");
              flag = false;
            }
          }
          if (BaseAction.getEnableHasOBD())
          {
            if (roles.indexOf("," + StandardUserRole.PRIVI_REPORT_OBDTRACK_DETAIL + ",") >= 0) {
              flag = true;
            }
            if (flag)
            {
              reportPrivi.addSubPriviEx(Integer.valueOf(19998), "1026", "");
              flag = false;
            }
          }
          if ((reportPrivi.getListSubPrivi() != null) && (reportPrivi.getListSubPrivi().size() > 0)) {
            privis.add(reportPrivi);
          }
          UserPrivi operationPrivi = new UserPrivi(Integer.valueOf(20), "operationManagement", "");
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_VEHICLE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(26), Integer.toString(StandardUserRole.PRIVI_OPERATION_VEHICLE), "");
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DEVICE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(25), Integer.toString(StandardUserRole.PRIVI_OPERATION_DEVICE), "");
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_SIM + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(24), Integer.toString(StandardUserRole.PRIVI_OPERATION_SIM), "");
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DRIVER + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(27), Integer.toString(StandardUserRole.PRIVI_OPERATION_DRIVER), "");
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_SAFE + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(29), Integer.toString(StandardUserRole.PRIVI_OPERATION_SAFE), "");
          }
          if ((roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_MATURITY + ",") >= 0) || (isAdmin()) || (isMaster())) {
            operationPrivi.addSubPriviEx(Integer.valueOf(210), Integer.toString(StandardUserRole.PRIVI_OPERATION_MATURITY), "");
          }
          if ((BaseAction.getEnableHasReceipt()) && (
            (roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_DOCUMENTS + ",") >= 0) || (isAdmin()) || (isMaster()))) {
            operationPrivi.addSubPriviEx(Integer.valueOf(211), Integer.toString(StandardUserRole.PRIVI_OPERATION_DOCUMENTS), "");
          }
          if ((BaseAction.getEnableTrip()) && (
            (roles.indexOf("," + StandardUserRole.PRIVI_OPERATION_LINE + ",") >= 0) || (isAdmin()) || (isMaster()))) {
            operationPrivi.addSubPriviEx(Integer.valueOf(212), Integer.toString(StandardUserRole.PRIVI_OPERATION_LINE), "");
          }
          if ((operationPrivi.getListSubPrivi() != null) && (operationPrivi.getListSubPrivi().size() > 0)) {
            privis.add(operationPrivi);
          }
          UserPrivi rulePrivi = new UserPrivi(Integer.valueOf(15), "rule", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_PAGE_RULE + ",") >= 0) {
            rulePrivi.addSubPriviEx(Integer.valueOf(15), Integer.toString(StandardUserRole.PRIVI_PAGE_RULE), "");
          }
          if ((rulePrivi.getListSubPrivi() != null) && (rulePrivi.getListSubPrivi().size() > 0)) {
            privis.add(rulePrivi);
          }
          UserPrivi systemPrivi = new UserPrivi(Integer.valueOf(70), "system", "");
          if (roles.indexOf("," + StandardUserRole.PRIVI_SYSTEM_ALARM_LINK + ",") >= 0) {
            systemPrivi.addSubPriviEx(Integer.valueOf(71), Integer.toString(StandardUserRole.PRIVI_SYSTEM_ALARM_LINK), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_SYSTEM_SET + ",") >= 0) {
            systemPrivi.addSubPriviEx(Integer.valueOf(73), Integer.toString(StandardUserRole.PRIVI_SYSTEM_SET), "");
          }
          if (roles.indexOf("," + StandardUserRole.PRIVI_SYSTEM_RECORD_SET + ",") >= 0) {
            systemPrivi.addSubPriviEx(Integer.valueOf(74), Integer.toString(StandardUserRole.PRIVI_SYSTEM_RECORD_SET), "");
          }
          if ((systemPrivi.getListSubPrivi() != null) && (systemPrivi.getListSubPrivi().size() > 0)) {
            privis.add(systemPrivi);
          }
          addCustomResponse("pages", privis);
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
  
  private boolean isExist(StandardUserRole role)
  {
    StandardUserRole oldRole = this.standardUserService.getStandardUserRole(role.getName());
    if ((oldRole == null) || ((role.getId() != null) && (oldRole.getId().intValue() == role.getId().intValue()))) {
      return false;
    }
    return true;
  }
  
  protected void addRoleLog(Integer subType, StandardUserRole role)
  {
    addUserLog(Integer.valueOf(5), subType, null, role.getId().toString(), role.getName(), null, null);
  }
  
  protected void sendUserAccountMsg(int notifyType, StandardUserAccount user)
  {
    int userId = user.getId() == null ? 0 : user.getId().intValue();
    ActionContext ctx = ActionContext.getContext();
    String session = (String)ctx.getSession().get("userSession");
    this.notifyService.sendStandardInfoChange(notifyType, 3, userId, session);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
