package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.NotifyService;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardSIMCardInfoAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String loadSIMInfos()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
      {
        AjaxDto<StandardSIMCardInfo> simList = getSIMS(company, null, null);
        List<PartStandardInfo> partSims = new ArrayList();
        if (simList.getPageList() != null)
        {
          List<StandardSIMCardInfo> sims = simList.getPageList();
          for (int i = 0; i < sims.size(); i++)
          {
            StandardSIMCardInfo sim = (StandardSIMCardInfo)sims.get(i);
            if ((sim.getStatus() != null) && (sim.getStatus().intValue() != 0) && ((sim.getInstall() == null) || (sim.getInstall().intValue() == 0)))
            {
              PartStandardInfo info = new PartStandardInfo();
              info.setId(sim.getId().toString());
              info.setName(sim.getCardNum());
              info.setParentId(sim.getCompany().getId());
              partSims.add(info);
            }
          }
        }
        addCustomResponse("infos", partSims);
      }
      else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
      {
        String companyId = getRequest().getParameter("companyId");
        String num = getRequest().getParameter("num");
        String status = getRequest().getParameter("status");
        String install = getRequest().getParameter("install");
        String id = getRequest().getParameter("id");
        Pagination pagination = getPaginationEx();
        String condition = "";
        if ((companyId != null) && (!companyId.isEmpty())) {
          condition = condition + String.format(" and company.id = %d", new Object[] { Integer.valueOf(Integer.parseInt(companyId)) });
        }
        if ((status != null) && (!status.isEmpty()) && (!"2".equals(status))) {
          condition = condition + String.format(" and status = %d ", new Object[] { Integer.valueOf(Integer.parseInt(status)) });
        }
        if ((num != null) && (!num.isEmpty())) {
          condition = condition + String.format(" and (cardNum like '%%%s%%')", new Object[] { num });
        }
        if ((id != null) && (!id.isEmpty()) && (install != null) && (!install.isEmpty()) && (!"2".equals(install))) {
          condition = condition + String.format(" and (id = %d or install = %d)", new Object[] { Integer.valueOf(Integer.parseInt(id)), Integer.valueOf(Integer.parseInt(install)) });
        } else if ((install != null) && (!install.isEmpty()) && (!"2".equals(install))) {
          condition = condition + String.format(" and install = %d", new Object[] { Integer.valueOf(Integer.parseInt(install)) });
        }
        condition = condition + " order by company.id";
        AjaxDto<StandardSIMCardInfo> simList = getSIMS(company, condition, pagination);
        
        addCustomResponse("infos", simList.getPageList());
        addCustomResponse("pagination", simList.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findSIMInfo()
  {
    try
    {
      String id = getRequestString("id");
      String type = getRequestString("type");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardSIMCardInfo sim = this.standardUserService.getStandardSIMCardInfo(Integer.valueOf(Integer.parseInt(id)));
        if (sim == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), sim.getCompany().getId())))
          {
            addCustomResponse("sim", sim);
            if ((type != null) && (type.equals("edit")))
            {
              List<Integer> lstLevel = new ArrayList();
              lstLevel.add(Integer.valueOf(1));
              List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), false, false);
              List<PartStandardInfo> partCompanys = new ArrayList();
              for (int i = 0; i < companys.size(); i++)
              {
                PartStandardInfo info = new PartStandardInfo();
                StandardCompany comp = (StandardCompany)companys.get(i);
                if (comp.getId().intValue() != -1)
                {
                  info.setId(comp.getId().toString());
                  info.setName(comp.getName());
                  info.setParentId(comp.getParentId());
                  partCompanys.add(info);
                }
              }
              addCustomResponse("companys", partCompanys);
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
  
  public String deleteSIMInfo()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if ((!isRole("34")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardSIMCardInfo sim = this.standardUserService.getStandardSIMCardInfo(Integer.valueOf(Integer.parseInt(id)));
        if (sim == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), sim.getCompany().getId())))
          {
            if ((sim.getInstall() != null) && (sim.getInstall().intValue() == 1))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(47));
            }
            else
            {
              this.standardUserService.delete(sim);
              
              addSIMCardLog(Integer.valueOf(3), sim);
              this.notifyService.sendStandardInfoChange(3, 5, 0, sim.getCardNum());
            }
          }
          else {
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
  
  public String mergeSIMInfo()
  {
    try
    {
      if ((!isAdmin()) && (!isRole("34")))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardSIMCardInfo sim = new StandardSIMCardInfo();
        sim = (StandardSIMCardInfo)AjaxUtils.getObject(getRequest(), sim.getClass());
        if ((sim.getCompany() == null) || (sim.getCompany().getId() == null)) {
          sim.setCompany(null);
        }
        if ((sim.getCardNum() == null) || (sim.getCardNum().isEmpty()) || (sim.getCompany() == null) || (sim.getCompany().getId() == null))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else if (sim.getId() != null)
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), sim.getCompany().getId())))
          {
            StandardSIMCardInfo oldSim = this.standardUserService.getStandardSIMCardInfo(sim.getId());
            sim.setInstall(oldSim.getInstall());
            this.standardUserService.save(sim);
            
            addSIMCardLog(Integer.valueOf(2), sim);
            this.notifyService.sendStandardInfoChange(2, 5, 0, sim.getCardNum());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else if (isSIMExist(sim))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(49));
        }
        else
        {
          sim.setInstall(Integer.valueOf(0));
          sim = (StandardSIMCardInfo)this.standardUserService.save(sim);
          
          addSIMCardLog(Integer.valueOf(1), sim);
          this.notifyService.sendStandardInfoChange(1, 5, 0, sim.getCardNum());
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
  
  protected void addSIMCardLog(Integer subType, StandardSIMCardInfo simInfo)
  {
    addUserLog(Integer.valueOf(18), subType, null, null, simInfo.getCardNum(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
