package com.gps808.rule.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.NotifyService;
import com.gps.common.service.StorageRelationService;
import com.gps.util.ObjectUtil;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardAreaChina;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardUserPermit;
import com.gps808.rule.service.StandardVehicleRuleService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardVehicleRuleAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  private List<Integer> getRuleType()
  {
    List<Integer> typeList = new ArrayList();
    String ruleTypes = getRequestString("ruleType");
    if ((ruleTypes != null) && (!ruleTypes.isEmpty()))
    {
      String[] types = ruleTypes.split(",");
      for (int i = 0; i < types.length; i++) {
        if (types[i].equals("fatigue")) {
          typeList.add(Integer.valueOf(1));
        } else if (types[i].equals("forbidInto")) {
          typeList.add(Integer.valueOf(2));
        } else if (types[i].equals("forbidOut")) {
          typeList.add(Integer.valueOf(3));
        } else if (types[i].equals("areaSpeed")) {
          typeList.add(Integer.valueOf(4));
        } else if (types[i].equals("periodSpeed")) {
          typeList.add(Integer.valueOf(5));
        } else if (types[i].equals("parkingTooLong")) {
          typeList.add(Integer.valueOf(6));
        } else if (types[i].equals("lineOffset")) {
          typeList.add(Integer.valueOf(7));
        } else if (types[i].equals("timingPicture")) {
          typeList.add(Integer.valueOf(8));
        } else if (types[i].equals("timerRecording")) {
          typeList.add(Integer.valueOf(9));
        } else if (types[i].equals("roadGrade")) {
          typeList.add(Integer.valueOf(14));
        } else if (types[i].equals("wifiDownload")) {
          typeList.add(Integer.valueOf(10));
        } else if (types[i].equals("linerangelimit")) {
          typeList.add(Integer.valueOf(11));
        } else if (types[i].equals("keypoint")) {
          typeList.add(Integer.valueOf(12));
        } else if (types[i].equals("alarmMotion")) {
          typeList.add(Integer.valueOf(13));
        }
      }
    }
    return typeList;
  }
  
  public String loadVehicleRules()
  {
    try
    {
      String type = getRequestString("type");
      String name = getRequest().getParameter("name");
      String armType = getRequestString("armType");
      List<Integer> lstType = getRuleType();
      if (lstType.size() == 0)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        List<Integer> lstId = new ArrayList();
        if (!isAdmin())
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          lstId = findUserCompanyIdList(userAccount.getCompany().getId(), lstLevel, false);
        }
        Pagination pagination = null;
        String condition = "";
        if ((type != null) && (type.equals("1")))
        {
          pagination = getPaginationEx();
          if ((armType != null) && (!armType.isEmpty())) {
            condition = String.format(" and armType = %d ", new Object[] { Integer.valueOf(Integer.parseInt(armType)) });
          }
          if ((name != null) && (!name.isEmpty())) {
            condition = condition + String.format(" and name like '%%%s%%' ", new Object[] { name });
          }
        }
        AjaxDto<StandardRuleMaintain> ruleList = this.vehicleRuleService.getRuleList(lstId, lstType, condition, pagination);
        
        addCustomResponse("infos", ruleList.getPageList());
        addCustomResponse("pagination", ruleList.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findVehicleRule()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardRuleMaintain rule = (StandardRuleMaintain)this.vehicleRuleService.getObject(StandardRuleMaintain.class, Integer.valueOf(Integer.parseInt(id)));
        if (rule != null)
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), rule.getCompany().getId()))) {
            addCustomResponse("rule", rule);
          } else {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  public String delVehicleRule()
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
        StandardRuleMaintain rule = (StandardRuleMaintain)this.vehicleRuleService.getObject(StandardRuleMaintain.class, Integer.valueOf(Integer.parseInt(id)));
        if (rule != null)
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), rule.getCompany().getId())))
          {
            List<StandardVehiRule> rulePermits = this.vehicleRuleService.getStandardVehiRulePermit(rule.getId(), null, null);
            this.vehicleRuleService.deleteRule(rulePermits, rule);
            
            addRuleLog(Integer.valueOf(3), rule, null);
            int ruleId = rule.getId() == null ? 0 : rule.getId().intValue();
            this.notifyService.sendStandardInfoChange(3, 12, ruleId, "");
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  public String mergeVehicleRule()
  {
    try
    {
      StandardRuleMaintain rule = new StandardRuleMaintain();
      rule = (StandardRuleMaintain)AjaxUtils.getObject(getRequest(), rule.getClass());
      if (isExistsRule(rule))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(51));
      }
      else if (rule.getId() != null)
      {
        StandardRuleMaintain oldRule = (StandardRuleMaintain)this.vehicleRuleService.getObject(StandardRuleMaintain.class, rule.getId());
        if (oldRule == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), oldRule.getCompany().getId())))
          {
            rule.setCompany(oldRule.getCompany());
            rule.setArmType(oldRule.getArmType());
            this.vehicleRuleService.save(rule);
            
            addRuleLog(Integer.valueOf(2), rule, null);
            int ruleId = rule.getId() == null ? 0 : rule.getId().intValue();
            this.notifyService.sendStandardInfoChange(2, 12, ruleId, "");
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
        }
      }
      else
      {
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        rule.setCompany(userAccount.getCompany());
        String selArmTypes = rule.getSelatp();
        if (rule.getType().intValue() != 13) {
          selArmTypes = "0";
        }
        if ((selArmTypes == null) || (selArmTypes.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String[] armType = selArmTypes.split(",");
          for (int i = 0; i < armType.length; i++)
          {
            StandardRuleMaintain newRule = new StandardRuleMaintain();
            ObjectUtil.copeField(rule, newRule);
            newRule.setArmType(Integer.valueOf(Integer.parseInt(armType[i])));
            if ((rule.getType().intValue() == 13) && (i > 0)) {
              newRule.setName(rule.getName() + "-" + i);
            }
            if (!isExistsRule(newRule))
            {
              newRule = (StandardRuleMaintain)this.vehicleRuleService.save(newRule);
              
              addRuleLog(Integer.valueOf(1), newRule, null);
              int ruleId = newRule.getId() == null ? 0 : newRule.getId().intValue();
              this.notifyService.sendStandardInfoChange(1, 12, ruleId, "");
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
  
  public String getAssignVehicles()
  {
    try
    {
      String isAssign = getRequestString("isAssign");
      String id = getRequestString("id");
      String name = getRequest().getParameter("name");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardRuleMaintain rule = (StandardRuleMaintain)this.standardUserService.getObject(StandardRuleMaintain.class, Integer.valueOf(Integer.parseInt(id)));
        if (rule == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), rule.getCompany().getId())))
          {
            String condition = "";
            if ((name != null) && (!name.isEmpty())) {
              condition = String.format(" and (vehicle.vehiIDNO like '%%%s%%')", new Object[] { name });
            }
            List<PartStandardInfo> permitVehicles = new ArrayList();
            if ((isAdmin()) || (isMaster()))
            {
              List<StandardVehiRule> rulePermits = this.vehicleRuleService.getStandardVehiRulePermit(Integer.valueOf(Integer.parseInt(id)), null, condition);
              if ((rulePermits != null) && (rulePermits.size() > 0))
              {
                int i = 0;
                for (int j = rulePermits.size(); i < j; i++)
                {
                  StandardVehicle vehicle = ((StandardVehiRule)rulePermits.get(i)).getVehicle();
                  PartStandardInfo partInfo = new PartStandardInfo();
                  partInfo.setId(vehicle.getId().toString());
                  partInfo.setName(vehicle.getVehiIDNO());
                  partInfo.setParentId(vehicle.getCompany().getId());
                  permitVehicles.add(partInfo);
                }
              }
            }
            else
            {
              permitVehicles = this.standardUserService.getRulePermitVehi(userAccount.getId(), Integer.valueOf(Integer.parseInt(id)), name);
            }
            Pagination pagination = getPaginationEx();
            if ((isAssign != null) && (isAssign.equals("1")))
            {
              int start = 0;int index = permitVehicles.size();
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
              List<PartStandardInfo> newVehicles = new ArrayList();
              for (int i = start; i < index; i++) {
                newVehicles.add((PartStandardInfo)permitVehicles.get(i));
              }
              addCustomResponse("infos", newVehicles);
              addCustomResponse("pagination", pagination);
            }
            else
            {
              List<Integer> companys = this.standardUserService.getCompanyIdList(rule.getCompany().getId(), null, isAdmin());
              if (!isAdmin()) {
                companys.add(rule.getCompany().getId());
              }
              List<PartStandardInfo> allVehicles = new ArrayList();
              String ruleType = getRequestString("ruleType");
              if ((ruleType != null) && (ruleType.equals("timerRecording")))
              {
                if ((isAdmin()) || (isMaster()))
                {
                  if ((name != null) && (!name.isEmpty())) {
                    condition = String.format(" and (vehicle.vehiIDNO like '%%%s%%')", new Object[] { name });
                  }
                  if (!isAdmin())
                  {
                    condition = condition + String.format(" and ( vehicle.company.id = %d ", new Object[] { companys.get(0) });
                    if (companys.size() > 1)
                    {
                      int i = 0;
                      for (int j = companys.size(); i < j; i++) {
                        condition = condition + String.format(" or vehicle.company.id = %d ", new Object[] { companys.get(i) });
                      }
                    }
                    condition = condition + " ) ";
                  }
                  else
                  {
                    companys = null;
                  }
                  AjaxDto<StandardStorageRelation> dtoRelations = this.storageRelationService.getStoRelationList(null, null, condition, null);
                  List<StandardStorageRelation> relations = dtoRelations.getPageList();
                  if ((relations != null) && (relations.size() > 0)) {
                    for (StandardStorageRelation relation : relations)
                    {
                      StandardVehicle vehicle = relation.getVehicle();
                      PartStandardInfo partInfo = new PartStandardInfo();
                      partInfo.setId(vehicle.getId().toString());
                      partInfo.setName(vehicle.getVehiIDNO());
                      partInfo.setParentId(vehicle.getCompany().getId());
                      allVehicles.add(partInfo);
                    }
                  }
                }
                else
                {
                  allVehicles = this.standardUserService.getStoRelationPermitVehi(userAccount.getId(), name);
                }
              }
              else if ((isAdmin()) || (isMaster()))
              {
                if ((name != null) && (!name.isEmpty())) {
                  condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
                }
                if (isAdmin()) {
                  companys = null;
                }
                AjaxDto<StandardVehicle> dtoVehicleList = getUserVehicles(null, companys, condition, isAdmin(), null);
                List<StandardVehicle> vehicles = dtoVehicleList.getPageList();
                if ((vehicles != null) && (vehicles.size() > 0)) {
                  for (int i = 0; i < vehicles.size(); i++)
                  {
                    StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
                    PartStandardInfo partInfo = new PartStandardInfo();
                    partInfo.setId(vehicle.getId().toString());
                    partInfo.setName(vehicle.getVehiIDNO());
                    partInfo.setParentId(vehicle.getCompany().getId());
                    allVehicles.add(partInfo);
                  }
                }
              }
              else
              {
                List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(userAccount.getId(), null, null);
                if ((vehiPermits != null) && (vehiPermits.size() > 0)) {
                  for (int i = 0; i < vehiPermits.size(); i++)
                  {
                    StandardVehicle vehicle = ((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle();
                    PartStandardInfo partInfo = new PartStandardInfo();
                    partInfo.setId(vehicle.getId().toString());
                    partInfo.setName(vehicle.getVehiIDNO());
                    partInfo.setParentId(vehicle.getCompany().getId());
                    allVehicles.add(partInfo);
                  }
                }
              }
              if ((allVehicles != null) && (allVehicles.size() > 0))
              {
                int i = allVehicles.size() - 1;
                for (int j = 0; i >= j; i--)
                {
                  PartStandardInfo vehicle = (PartStandardInfo)allVehicles.get(i);
                  int ix = 0;
                  for (int jx = permitVehicles.size(); ix < jx; ix++)
                  {
                    PartStandardInfo permitVehicle = (PartStandardInfo)permitVehicles.get(ix);
                    if (vehicle.getId().equals(permitVehicle.getId()))
                    {
                      allVehicles.remove(i);
                      break;
                    }
                  }
                }
                int start = 0;int index = allVehicles.size();
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
                List<PartStandardInfo> newVehicles = new ArrayList();
                for ( i = start; i < index; i++) {
                  newVehicles.add((PartStandardInfo)allVehicles.get(i));
                }
                addCustomResponse("infos", newVehicles);
                addCustomResponse("pagination", pagination);
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
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveRulePermitNew()
  {
    try
    {
      String id = getRequestString("id");
      String isAssign = getRequestString("isAssign");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardRuleMaintain rule = (StandardRuleMaintain)this.vehicleRuleService.getObject(StandardRuleMaintain.class, Integer.valueOf(Integer.parseInt(id)));
        if (rule == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), rule.getCompany().getId())))
          {
            StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
            String vehiIdstr = userPermit.getPermits();
            if ((vehiIdstr != null) && (!vehiIdstr.isEmpty()))
            {
              List<Integer> companys = this.standardUserService.getCompanyIdList(rule.getCompany().getId(), null, isAdmin());
              if (!isAdmin()) {
                companys.add(rule.getCompany().getId());
              }
              if (isAdmin()) {
                companys = null;
              }
              AjaxDto<StandardVehicle> vehicleList = getUserVehicles(null, companys, null, isAdmin(), null);
              if ((vehicleList != null) && (vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
              {
                List<StandardVehicle> vehicles = vehicleList.getPageList();
                
                String[] vehiIds = vehiIdstr.split(",");
                if (isAssign.equals("0"))
                {
                  List<StandardVehiRule> addPermits = new ArrayList();
                  for (int i = 0; i < vehiIds.length; i++)
                  {
                    StandardVehiRule newPermit = new StandardVehiRule();
                    newPermit.setRule(rule);
                    StandardVehicle vehicle = new StandardVehicle();
                    for (int j = 0; j < vehicles.size(); j++) {
                      if (((StandardVehicle)vehicles.get(j)).getId().intValue() == Integer.parseInt(vehiIds[i]))
                      {
                        vehicle = (StandardVehicle)vehicles.get(j);
                        newPermit.setVehicle(vehicle);
                        addPermits.add(newPermit);
                        break;
                      }
                    }
                  }
                  this.vehicleRuleService.editVehiRulePermit(addPermits, null);
                  for (int i = 0; i < addPermits.size(); i++) {
                    addRuleLog(Integer.valueOf(4), rule, ((StandardVehiRule)addPermits.get(i)).getVehicle());
                  }
                }
                else if (isAssign.equals("1"))
                {
                  List<StandardVehiRule> rulePermits = this.vehicleRuleService.getStandardVehiRulePermit(rule.getId(), null, null);
                  
                  Map<String, String> savePermits = new HashMap();
                  for (int i = 0; i < vehiIds.length; i++) {
                    savePermits.put(vehiIds[i], vehiIds[i]);
                  }
                  List<StandardVehiRule> delPermits = new ArrayList();
                  for (int i = 0; i < rulePermits.size(); i++)
                  {
                    StandardVehiRule permit = (StandardVehiRule)rulePermits.get(i);
                    if (savePermits.get(permit.getVehicle().getId().toString()) != null) {
                      delPermits.add(permit);
                    }
                  }
                  this.vehicleRuleService.editVehiRulePermit(null, delPermits);
                  for (int i = 0; i < delPermits.size(); i++) {
                    addRuleLog(Integer.valueOf(4), rule, ((StandardVehiRule)delPermits.get(i)).getVehicle());
                  }
                }
                int ruleId = rule.getId() == null ? 0 : rule.getId().intValue();
                this.notifyService.sendStandardInfoChange(2, 13, ruleId, "");
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
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String listKeyPoints()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      Integer companyId = user.getCompany().getId();
      if (isAdmin()) {
        companyId = null;
      }
      addCustomResponse("keyPoints", this.vehicleRuleService.getMapMarkerList(companyId));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String listMark()
  {
    try
    {
      String markType = getRequestString("markType");
      String name = getRequest().getParameter("name");
      if ((markType != null) && (markType != ""))
      {
        int type = Integer.parseInt(markType);
        List<Integer> lstId = new ArrayList();
        if (type == 3)
        {
          lstId.add(Integer.valueOf(2));
          lstId.add(Integer.valueOf(3));
          lstId.add(Integer.valueOf(10));
        }
        else if (type == 2)
        {
          lstId.add(Integer.valueOf(4));
        }
        else if (type == 1)
        {
          lstId.add(Integer.valueOf(1));
        }
        StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
        boolean isadmin = isAdmin();
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        List<Integer> cids = findUserCompanyIdList(user.getCompany().getId(), lstLevel, isadmin);
        AjaxDto<MapMarker> areaMarker = this.vehicleRuleService.getAreaList(cids, user.getId(), lstId, name, Boolean.valueOf(isadmin), null, getPaginationEx());
        addCustomResponse("infos", areaMarker.getPageList());
        addCustomResponse("pagination", areaMarker.getPagination());
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
  
  public String addCityOrZone()
  {
    try
    {
      StandardAreaChina area = new StandardAreaChina();
      area = (StandardAreaChina)AjaxUtils.getObject(getRequest(), area.getClass());
      String name = area.getCity();
      if ((name != null) && (!name.equals("")))
      {
        StandardAreaChina areaChina = this.standardUserService.getStandardArea(name, null);
        if ((areaChina != null) && (areaChina.getParentId().intValue() == 0))
        {
          String zone = area.getZone();
          if ((zone != null) && (!zone.equals("")))
          {
            StandardAreaChina oldareaChina = this.standardUserService.getStandardArea(zone, areaChina.getId());
            if ((oldareaChina != null) && (oldareaChina.getParentId().intValue() != 0))
            {
              area.setName(oldareaChina.getName());
              area.setId(oldareaChina.getId());
            }
            else
            {
              area.setName(zone);
            }
            area.setParentId(areaChina.getId());
          }
          else
          {
            area.setName(areaChina.getName());
            area.setId(areaChina.getId());
            area.setParentId(Integer.valueOf(0));
          }
        }
        else if ((area.getZone() == null) || (area.getZone().equals("")))
        {
          area.setName(area.getCity());
          area.setParentId(Integer.valueOf(0));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        area.setAreaName(area.getCity() + area.getZone());
        this.vehicleRuleService.save(area);
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
  
  public String loadCompanyRules()
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
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id)))))
        {
          StandardCompany company = (StandardCompany)this.vehicleRuleService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          List<PartStandardInfo> rules = getRuleList(company);
          for (int i = rules.size() - 1; i >= 0; i--) {
            if ((((PartStandardInfo)rules.get(i)).getParentId().intValue() == 8) || 
              (((PartStandardInfo)rules.get(i)).getParentId().intValue() == 9)) {
              rules.remove(i);
            }
          }
          addCustomResponse("ruleList", rules);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  protected List<PartStandardInfo> getRuleList(StandardCompany company)
  {
    List<Integer> lstId = new ArrayList();
    if (company != null)
    {
      lstId.add(company.getId());
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      lstId.add(userAccount.getCompany().getId());
    }
    else
    {
      lstId.add(Integer.valueOf(0));
    }
    AjaxDto<StandardRuleMaintain> ruleList = this.vehicleRuleService.getRuleList(lstId, null, null, null);
    List<PartStandardInfo> infos = new ArrayList();
    if ((ruleList != null) && (ruleList.getPageList() != null)) {
      for (StandardRuleMaintain rule : ruleList.getPageList())
      {
        PartStandardInfo info = new PartStandardInfo();
        info.setId(rule.getId().toString());
        info.setName(rule.getName());
        info.setParentId(rule.getType());
        infos.add(info);
      }
    }
    return infos;
  }
  
  public String loadRulesByVehicle()
  {
    try
    {
      String vehiIdno = getRequestString("vehiIdno");
      if ((vehiIdno == null) || (vehiIdno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardVehicle vehicle = (StandardVehicle)this.vehicleRuleService.getObject(StandardVehicle.class, vehiIdno);
        if (vehicle != null)
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            List<PartStandardInfo> rules = getRuleList(company);
            String[] vehiIdnos = { vehiIdno };
            AjaxDto<StandardStorageRelation> dtoRelations = this.storageRelationService.getStoRelationList(null, vehiIdnos, null, null);
            List<StandardStorageRelation> relations = dtoRelations.getPageList();
            if ((relations == null) || (relations.size() == 0)) {
              for (int i = rules.size() - 1; i >= 0; i--) {
                if ((((PartStandardInfo)rules.get(i)).getParentId().intValue() == 8) || 
                  (((PartStandardInfo)rules.get(i)).getParentId().intValue() == 9)) {
                  rules.remove(i);
                }
              }
            }
            addCustomResponse("ruleList", rules);
            List<StandardVehiRule> permits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehiIdno, null);
            List<PartStandardInfo> infos = new ArrayList();
            if (permits != null) {
              for (StandardVehiRule permit : permits)
              {
                PartStandardInfo info = new PartStandardInfo();
                info.setId(permit.getRule().getId().toString());
                info.setName(permit.getRule().getName());
                info.setParentId(permit.getRule().getType());
                infos.add(info);
              }
            }
            addCustomResponse("myRuleList", infos);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  public String saveVehicleRulePermit()
  {
    try
    {
      String vehiIdno = getRequestString("vehiIdno");
      if ((vehiIdno == null) || (vehiIdno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardVehicle vehicle = (StandardVehicle)this.vehicleRuleService.getObject(StandardVehicle.class, vehiIdno);
        if (vehicle != null)
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
            setSaveVehicleRulePermit(vehicle, userPermit.getPermits(), company);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
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
  
  protected void setSaveVehicleRulePermit(StandardVehicle vehicle, String ruleIdStr, StandardCompany company)
  {
    List<StandardVehiRule> rulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null);
    
    String[] ruleIds = ruleIdStr.split(",");
    
    List<StandardVehiRule> delPermits = new ArrayList();
    
    List<StandardVehiRule> addPermits = new ArrayList();
    
    List<Integer> addId = new ArrayList();
    if (ruleIds.length > 0)
    {
      for (int i = 0; i < ruleIds.length; i++) {
        if (!ruleIds[i].isEmpty())
        {
          boolean flag = false;
          for (int j = 0; j < rulePermits.size(); j++) {
            if (Integer.parseInt(ruleIds[i]) == ((StandardVehiRule)rulePermits.get(j)).getRule().getId().intValue())
            {
              rulePermits.remove(j);
              flag = true;
              break;
            }
          }
          if (!flag) {
            addId.add(Integer.valueOf(Integer.parseInt(ruleIds[i])));
          }
        }
      }
      if (rulePermits != null) {
        delPermits.addAll(rulePermits);
      }
      List<Integer> lstId = new ArrayList();
      lstId.add(company.getId());
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      lstId.add(userAccount.getCompany().getId());
      AjaxDto<StandardRuleMaintain> ruleList = this.vehicleRuleService.getRuleList(lstId, null, null, null);
      List<StandardRuleMaintain> rules = new ArrayList();
      if ((ruleList != null) && (ruleList.getPageList() != null)) {
        rules = ruleList.getPageList();
      }
      for (int i = 0; i < addId.size(); i++)
      {
        StandardVehiRule newPermit = new StandardVehiRule();
        newPermit.setVehicle(vehicle);
        StandardRuleMaintain rule = new StandardRuleMaintain();
        for (int j = 0; j < rules.size(); j++) {
          if (((StandardRuleMaintain)rules.get(j)).getId().intValue() == ((Integer)addId.get(i)).intValue())
          {
            rule = (StandardRuleMaintain)rules.get(j);
            newPermit.setRule(rule);
            addPermits.add(newPermit);
            break;
          }
        }
      }
    }
    else
    {
      delPermits.addAll(rulePermits);
    }
    this.vehicleRuleService.editVehiRulePermit(addPermits, delPermits);
    for (int i = 0; i < addPermits.size(); i++) {
      addRuleLog(Integer.valueOf(4), ((StandardVehiRule)addPermits.get(i)).getRule(), vehicle);
    }
    int vehiIdno = vehicle.getId() == null ? 0 : vehicle.getId().intValue();
    this.notifyService.sendStandardInfoChange(2, 13, vehiIdno, "");
  }
  
  private boolean isExistsRule(StandardRuleMaintain rule)
  {
    StandardRuleMaintain oldRule = this.vehicleRuleService.getVehicleRuleByName(rule.getName());
    if ((oldRule == null) || ((rule.getId() != null) && (oldRule.getId() == rule.getId()))) {
      return false;
    }
    return true;
  }
  
  protected void addRuleLog(Integer subType, StandardRuleMaintain rule, StandardVehicle vehicle)
  {
    String vehiIdno = "";
    if (vehicle != null) {
      vehiIdno = vehicle.getVehiIDNO();
    }
    addUserLog(Integer.valueOf(20), subType, vehiIdno, rule.getId().toString(), rule.getName(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_RULE.toString());
  }
}
