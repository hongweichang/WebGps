package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardVehiIdnos;
import com.gps808.rule.service.StandardVehicleRuleService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StandardVehicleTeamAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
  
  public String loadCompanyTeams()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), null, isAdmin(), false, false);
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
            info.setLevel(company.getLevel());
            partCompanys.add(info);
          }
        }
        addCustomResponse("infos", partCompanys);
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
  
  public String list()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          List<PartStandardInfo> myVehicles = new ArrayList();
          StandardCompany company = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))) {
            company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          }
          if ((isAdmin()) && (company == null))
          {
            addCustomResponse("company", company);
            addCustomResponse("myVehicles", myVehicles);
          }
          else if (company == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            List<StandardVehicle> vehicles = new ArrayList();
            List<Integer> companys = new ArrayList();
            companys.add(company.getId());
            AjaxDto<StandardVehicle> vehicleList = getUserVehicles(null, companys, null, false, null);
            if (vehicleList.getPageList() != null) {
              vehicles = vehicleList.getPageList();
            }
            for (int i = 0; i < vehicles.size(); i++)
            {
              StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
              PartStandardInfo info = new PartStandardInfo();
              
              info.setId(vehicle.getId().toString());
              info.setName(vehicle.getVehiIDNO());
              info.setParentId(company.getId());
              myVehicles.add(info);
            }
            addCustomResponse("company", company);
            addCustomResponse("myVehicles", myVehicles);
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
  
  public String add()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardCompany team = new StandardCompany();
        team = (StandardCompany)AjaxUtils.getObject(getRequest(), team.getClass());
        
        StandardCompany company = null;
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), team.getParentId()))) {
          company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, team.getParentId());
        }
        if (company != null) {
          if (isExist(team))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
          }
          else
          {
            if (company.getLevel().intValue() == 2) {
              team.setCompanyId(company.getCompanyId());
            } else {
              team.setCompanyId(team.getParentId());
            }
            team.setLevel(Integer.valueOf(2));
            team = (StandardCompany)this.standardUserService.save(team);
            addCustomResponse("id", team.getId());
            
            addVehiTeamLog(Integer.valueOf(1), team);
            sendVehiTeamMsg(1, team, null);
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
  
  public String save()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          StandardCompany team = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))) {
            team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          }
          if ((team == null) || ((team.getLevel() != null) && (team.getLevel().intValue() == 1)))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            boolean flag = true;
            StandardCompany saveTeam = new StandardCompany();
            saveTeam = (StandardCompany)AjaxUtils.getObject(getRequest(), saveTeam.getClass());
            if ((!saveTeam.getName().equals(team.getName())) && 
              (isExist(saveTeam)))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
              flag = false;
            }
            if (flag)
            {
              team.setName(saveTeam.getName());
              
              team = (StandardCompany)this.standardUserService.save(team);
              
              addVehiTeamLog(Integer.valueOf(2), team);
              sendVehiTeamMsg(2, team, null);
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
  
  public String delete()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          StandardCompany team = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))) {
            team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          }
          if ((team == null) || ((team.getLevel() != null) && (team.getLevel().intValue() == 1)))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            AjaxDto<StandardVehicle> vehicleList = getUserVehicles(team.getId(), null, null, false, null);
            if ((vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(27));
            }
            else
            {
              this.standardUserService.delete(team);
              addVehiTeamLog(Integer.valueOf(3), team);
              sendVehiTeamMsg(3, team, null);
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
  
  public String move()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardCompany saveTeam = new StandardCompany();
        saveTeam = (StandardCompany)AjaxUtils.getObject(getRequest(), saveTeam.getClass());
        String groupId = getRequestString("groupId");
        if ((groupId != null) && (!groupId.isEmpty()))
        {
          StandardCompany team = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(groupId))))) {
            team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(groupId)));
          }
          if (team == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            Integer oldCompanyId = team.getCompanyId();
            StandardCompany oldCompany = (StandardCompany)this.deviceService.getObject(StandardCompany.class, oldCompanyId);
            
            boolean blag = false;
            List<StandardCompany> childcompanys = findUserCompanys(oldCompany, null, false, false, false);
            StandardCompany company = new StandardCompany();
            if (childcompanys != null) {
              for (int i = 0; i < childcompanys.size(); i++) {
                if (((StandardCompany)childcompanys.get(i)).getId().intValue() == saveTeam.getParentId().intValue())
                {
                  company = (StandardCompany)childcompanys.get(i);
                  blag = true;
                  break;
                }
              }
            }
            if (blag)
            {
              team.setParentId(saveTeam.getParentId());
              if (company.getLevel().intValue() == 2) {
                team.setCompanyId(company.getCompanyId());
              } else {
                team.setCompanyId(team.getParentId());
              }
              this.standardUserService.save(team);
              
              List<StandardVehicle> vehicleList = this.standardUserService.getVehicleList(team.getId());
              
              StringBuffer buffVehiIdno = new StringBuffer();
              
              List<StandardVehiRule> delRulePermits = new ArrayList();
              if (vehicleList != null) {
                for (int i = 0; i < vehicleList.size(); i++)
                {
                  delRulePermits.addAll(this.vehicleRuleService.getStandardVehiRulePermit(null, ((StandardVehicle)vehicleList.get(i)).getVehiIDNO(), null));
                  if (i > 0) {
                    buffVehiIdno.append(",");
                  }
                  buffVehiIdno.append(((StandardVehicle)vehicleList.get(i)).getVehiIDNO());
                }
              }
              this.standardUserService.updateVehicle(vehicleList, null, delRulePermits);
              
              addUserLog(Integer.valueOf(19), Integer.valueOf(4), null, team.getId().toString(), 
                team.getName(), oldCompanyId.toString(), team.getParentId().toString());
              sendVehiTeamMsg(2, team, buffVehiIdno.toString());
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(50));
            }
          }
        }
        else
        {
          String vehiIdno = getRequestString("vehiIdno");
          if ((vehiIdno != null) && (!vehiIdno.isEmpty()))
          {
            StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehiIdno);
            if (vehicle == null)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(25));
            }
            else
            {
              StandardCompany team = null;
              StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
              if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), saveTeam.getParentId()))) {
                team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, saveTeam.getParentId());
              }
              if (team == null)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
              }
              else
              {
                boolean delRule = true;
                if ((team.getId().equals(vehicle.getCompany().getId())) || (team.getParentId().equals(vehicle.getCompany().getId())) || 
                  ((team.getLevel().intValue() == 2) && (team.getCompanyId().intValue() == vehicle.getCompany().getId().intValue())) || (
                  (team.getLevel().intValue() == 2) && (team.getCompanyId().intValue() == vehicle.getCompany().getCompanyId().intValue()))) {
                  delRule = false;
                }
                Integer oldGroupId = vehicle.getCompany().getId();
                List<StandardUserVehiPermitEx> delPermits = delUserVehiPermit(vehicle, team);
                vehicle.setCompany(team);
                List<StandardVehicle> vehicleList = new ArrayList();
                vehicleList.add(vehicle);
                
                List<StandardVehiRule> delRulePermits = new ArrayList();
                if (delRule) {
                  delRulePermits.addAll(this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null));
                }
                this.standardUserService.updateVehicle(vehicleList, delPermits, delRulePermits);
                
                addUserLog(Integer.valueOf(19), Integer.valueOf(5), vehicle.getVehiIDNO(), 
                  oldGroupId.toString(), vehicle.getCompany().getId().toString(), null, null);
                sendVehiChangeTeamMsg(2, team, vehiIdno);
                
                List<Integer> lstUserId = new ArrayList();
                for (int i = 0; i < delPermits.size(); i++) {
                  if (!lstUserId.contains(((StandardUserVehiPermitEx)delPermits.get(i)).getUserId())) {
                    lstUserId.add(((StandardUserVehiPermitEx)delPermits.get(i)).getUserId());
                  }
                }
                for (int i = 0; i < lstUserId.size(); i++) {
                  updateCacheVehiRelationByUser((Integer)lstUserId.get(i));
                }
              }
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
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
  
  public String moveSelect()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String groupId = getRequestString("groupId");
        StandardVehiIdnos vehiIdnos = new StandardVehiIdnos();
        vehiIdnos = (StandardVehiIdnos)AjaxUtils.getObject(getRequest(), vehiIdnos.getClass());
        String[] idnos = vehiIdnos.getVehiIdnos().split(",");
        if (((groupId != null) && (!groupId.isEmpty())) || ((idnos.length > 0) && (!idnos[0].isEmpty())))
        {
          StandardCompany team = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(groupId))))) {
            team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(groupId)));
          }
          if (team == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else
          {
            StringBuffer buffVehiIdno = new StringBuffer();
            List<StandardVehicle> vehiList = new ArrayList();
            List<StandardUserVehiPermitEx> delPermits = new ArrayList();
            List<StandardVehiRule> delRulePermits = new ArrayList();
            for (int i = 0; i < idnos.length; i++)
            {
              StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, idnos[i]);
              delPermits.addAll(delUserVehiPermit(vehicle, team));
              boolean delRule = true;
              if ((team.getId().equals(vehicle.getCompany().getId())) || (team.getParentId().equals(vehicle.getCompany().getId())) || 
                ((team.getLevel().intValue() == 2) && (team.getCompanyId().intValue() == vehicle.getCompany().getId().intValue())) || (
                (team.getLevel().intValue() == 2) && (team.getCompanyId().intValue() == vehicle.getCompany().getCompanyId().intValue()))) {
                delRule = false;
              }
              if (delRule) {
                delRulePermits.addAll(this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null));
              }
              vehicle.setCompany(team);
              vehiList.add(vehicle);
              if (i > 0) {
                buffVehiIdno.append(",");
              }
              buffVehiIdno.append(idnos[i]);
            }
            if (vehiList.size() > 0)
            {
              this.standardUserService.updateVehicle(vehiList, delPermits, delRulePermits);
              String param = "";
              if (vehiIdnos.getVehiIdnos().length() > 254) {
                param = vehiIdnos.getVehiIdnos().substring(0, 254);
              } else {
                param = vehiIdnos.getVehiIdnos();
              }
              addUserLog(Integer.valueOf(19), Integer.valueOf(6), 
                null, param, groupId.toString(), null, null);
              sendVehiChangeTeamMsg(2, team, buffVehiIdno.toString());
              
              List<Integer> lstUserId = new ArrayList();
              for (int i = 0; i < delPermits.size(); i++) {
                if (!lstUserId.contains(((StandardUserVehiPermitEx)delPermits.get(i)).getUserId())) {
                  lstUserId.add(((StandardUserVehiPermitEx)delPermits.get(i)).getUserId());
                }
              }
              for (int i = 0; i < lstUserId.size(); i++) {
                updateCacheVehiRelationByUser((Integer)lstUserId.get(i));
              }
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
  
  public String removeSelect()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardVehiIdnos vehiIdnos = new StandardVehiIdnos();
        vehiIdnos = (StandardVehiIdnos)AjaxUtils.getObject(getRequest(), vehiIdnos.getClass());
        String[] idnos = vehiIdnos.getVehiIdnos().split(",");
        if ((idnos.length > 0) && (!idnos[0].isEmpty()))
        {
          List<Object> vehiList = new ArrayList();
          for (int i = 0; i < idnos.length; i++)
          {
            StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, idnos[i]);
            vehiList.add(vehicle);
          }
          if (vehiList.size() > 0)
          {
            for (int i = 0; i < vehiList.size(); i++)
            {
              StandardVehicle vehicle = (StandardVehicle)vehiList.get(i);
              if ((vehicle.getCompany().getLevel() != null) && (vehicle.getCompany().getLevel().intValue() == 2))
              {
                Integer parentId = vehicle.getCompany().getCompanyId();
                StandardCompany team = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, parentId);
                vehicle.setCompany(team);
              }
            }
            this.standardUserService.saveList(vehiList);
            String param = "";
            if (vehiIdnos.getVehiIdnos().length() > 254) {
              param = vehiIdnos.getVehiIdnos().substring(0, 254);
            } else {
              param = vehiIdnos.getVehiIdnos();
            }
            addUserLog(Integer.valueOf(19), Integer.valueOf(6), 
              null, param, null, null, null);
            sendVehiChangeTeamMsg(2, null, vehiIdnos.getVehiIdnos());
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
  
  public String loadVehiclesByCompany()
  {
    try
    {
      if ((!isRole("38")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String id = getRequestString("id");
        if ((id == null) || (id.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          List<PartStandardInfo> myVehicles = new ArrayList();
          StandardCompany company = null;
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))) {
            company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          }
          if (company == null)
          {
            if (isAdmin())
            {
              addCustomResponse("infos", null);
              addCustomResponse("pagination", null);
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
          }
          else
          {
            List<StandardVehicle> vehicles = new ArrayList();
            List<Integer> companys = new ArrayList();
            companys.add(company.getId());
            AjaxDto<StandardVehicle> vehicleList = getUserVehicles(null, companys, null, false, getPaginationEx());
            if (vehicleList.getPageList() != null) {
              vehicles = vehicleList.getPageList();
            }
            for (int i = 0; i < vehicles.size(); i++)
            {
              StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
              PartStandardInfo info = new PartStandardInfo();
              info.setId(vehicle.getVehiIDNO());
              info.setName(vehicle.getVehiIDNO());
              info.setParentId(company.getId());
              myVehicles.add(info);
            }
            addCustomResponse("infos", myVehicles);
            addCustomResponse("pagination", vehicleList.getPagination());
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
  
  public String loadCompanyTeamsCount()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), null, isAdmin(), false, false);
        List<PartStandardInfo> partCompanys = new ArrayList();
        Map<Integer, Integer> mapCompany = new HashMap();
        List<Integer> comapyIds = new ArrayList();
        if (companys != null)
        {
          for (int i = 0; i < companys.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardCompany company = (StandardCompany)companys.get(i);
            if (company.getId().intValue() != -1)
            {
              info.setId(company.getId().toString());
              info.setName(company.getName());
              info.setParentId(company.getParentId());
              info.setLevel(company.getLevel());
              info.setCompanyId(company.getCompanyId());
              partCompanys.add(info);
              
              mapCompany.put(company.getId(), Integer.valueOf(0));
              comapyIds.add(company.getId());
            }
          }
          AjaxDto<StandardVehicle> dtoVehicles = getUserVehicles(null, comapyIds, null, false, null);
          if ((dtoVehicles != null) && (dtoVehicles.getPageList() != null) && (dtoVehicles.getPageList().size() > 0))
          {
            List<StandardVehicle> vehicles = dtoVehicles.getPageList();
            for (int i = 0; i < vehicles.size(); i++) {
              mapCompany.put(((StandardVehicle)vehicles.get(i)).getCompany().getId(), Integer.valueOf(((Integer)mapCompany.get(((StandardVehicle)vehicles.get(i)).getCompany().getId())).intValue() + 1));
            }
          }
          for (int i = 0; i < partCompanys.size(); i++) {
            ((PartStandardInfo)partCompanys.get(i)).setCount((Integer)mapCompany.get(Integer.valueOf(Integer.parseInt(((PartStandardInfo)partCompanys.get(i)).getId()))));
          }
        }
        addCustomResponse("infos", partCompanys);
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
  
  private boolean isExist(StandardCompany company)
  {
    StandardCompany oldCompany = this.standardUserService.getStandardCompany(company.getName());
    if ((oldCompany == null) || ((company.getId() != null) && (oldCompany.getId().intValue() == company.getId().intValue()))) {
      return false;
    }
    return true;
  }
  
  protected void addVehiTeamLog(Integer subType, StandardCompany team)
  {
    addUserLog(Integer.valueOf(19), subType, null, team.getId().toString(), team.getName(), team.getParentId().toString(), null);
  }
  
  protected void sendVehiTeamMsg(int notifyType, StandardCompany team, String upVehiIdnos)
  {
    int teamId = team.getId() == null ? 0 : team.getId().intValue();
    this.notifyService.sendStandardInfoChange(notifyType, 9, teamId, "");
    if ((upVehiIdnos != null) && (!upVehiIdnos.isEmpty())) {
      doVehicleChange(true, upVehiIdnos, null);
    }
  }
  
  protected void sendVehiChangeTeamMsg(int notifyType, StandardCompany team, String upVehiIdnos)
  {
    this.notifyService.sendStandardInfoChange(notifyType, 10, 0, "");
    if ((upVehiIdnos != null) && (!upVehiIdnos.isEmpty())) {
      doVehicleChange(true, upVehiIdnos, null);
    }
  }
}
