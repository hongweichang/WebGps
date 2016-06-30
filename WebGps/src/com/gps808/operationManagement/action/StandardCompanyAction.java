package com.gps808.operationManagement.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.StringUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardCompanyAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String loadUserCompanys()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
        {
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
          List<PartStandardInfo> partCompanys = new ArrayList();
          for (int i = 0; i < companys.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardCompany company = (StandardCompany)companys.get(i);
            if ((company.getId() != null) && (company.getId().intValue() != -1))
            {
              info.setId(company.getId().toString());
              info.setName(company.getName());
              info.setParentId(company.getParentId());
              partCompanys.add(info);
            }
          }
          addCustomResponse("infos", partCompanys);
        }
        else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
        {
          List<StandardCompany> companys = new ArrayList();
          Pagination pagination = getPaginationEx();
          String name = getRequest().getParameter("name");
          String companyId = getRequestString("companyId");
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          if ((companyId != null) && (!companyId.isEmpty()))
          {
            StandardCompany company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(companyId)));
            companys = findUserCompanys(company, lstLevel, false, true, true);
          }
          else
          {
            companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, true);
          }
          if ((name != null) && (!name.isEmpty())) {
            for (int i = companys.size() - 1; i >= 0; i--)
            {
              StandardCompany company = (StandardCompany)companys.get(i);
              if ((StringUtil.indexOfEx(company.getName(), name) < 0) || ((company.getId() != null) && (company.getId().intValue() == -1))) {
                companys.remove(i);
              }
            }
          } else {
            for (int i = companys.size() - 1; i >= 0; i--)
            {
              StandardCompany company = (StandardCompany)companys.get(i);
              if ((company.getId() != null) && (company.getId().intValue() == -1)) {
                companys.remove(i);
              }
            }
          }
          AjaxDto<StandardCompany> newCompanys = doCompanySummary(companys, pagination);
          addCustomResponse("infos", newCompanys.getPageList());
          addCustomResponse("pagination", newCompanys.getPagination());
        }
      }
      else {
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
  
  private boolean isExistChildCompany(StandardCompany company, List<Integer> lstLevel)
  {
    boolean flag = false;
    List<Integer> companyIds = findUserChildCompanyIdList(company.getId(), lstLevel, false);
    if ((companyIds != null) && (companyIds.size() > 0)) {
      flag = true;
    }
    return flag;
  }
  
  private boolean isExistOtherInfo(StandardCompany company)
  {
    boolean flag = false;
    List<Integer> lstId = findUserChildCompanyIdList(company.getId(), null, false);
    if ((lstId != null) && (lstId.size() > 0)) {
      flag = true;
    } else {
      lstId = new ArrayList();
    }
    lstId.add(company.getId());
    if (!flag)
    {
      AjaxDto<StandardUserAccount> users = this.standardUserService.getStandardUserList(lstId, null, null, null);
      if ((users != null) && (users.getPageList() != null) && (users.getPageList().size() > 0)) {
        flag = true;
      }
    }
    if (!flag)
    {
      AjaxDto<StandardDevice> devices = this.standardUserService.getStandardDeviceList(lstId, null, null);
      if ((devices != null) && (devices.getPageList() != null) && (devices.getPageList().size() > 0)) {
        flag = true;
      }
    }
    if (!flag)
    {
      AjaxDto<StandardSIMCardInfo> sims = this.standardUserService.getStandardSIMList(lstId, null, null);
      if ((sims != null) && (sims.getPageList() != null) && (sims.getPageList().size() > 0)) {
        flag = true;
      }
    }
    if (!flag)
    {
      AjaxDto<StandardVehicle> vehicles = this.standardUserService.getStandardVehicleList(lstId, null, null);
      if ((vehicles != null) && (vehicles.getPageList() != null) && (vehicles.getPageList().size() > 0)) {
        flag = true;
      }
    }
    if (!flag)
    {
      AjaxDto<StandardUserRole> roles = this.standardUserService.getStandardRoleList(lstId, null, null);
      if ((roles != null) && (roles.getPageList() != null) && (roles.getPageList().size() > 0)) {
        flag = true;
      }
    }
    if (!flag)
    {
      AjaxDto<StandardDriver> drivers = this.standardUserService.getStandardDriverList(lstId, null, null);
      if ((drivers != null) && (drivers.getPageList() != null) && (drivers.getPageList().size() > 0)) {
        flag = true;
      }
    }
    return flag;
  }
  
  public String findCompany()
  {
    try
    {
      String id = getRequestString("id");
      String type = getRequestString("type");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id)))))
        {
          StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          if (company == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            List<Integer> lstLevel = new ArrayList();
            lstLevel.add(Integer.valueOf(1));
            if ((type != null) && (type.equals("edit")))
            {
              List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), false, false);
              List<PartStandardInfo> partCompanys = new ArrayList();
              for (int i = 0; i < companys.size(); i++)
              {
                PartStandardInfo info = new PartStandardInfo();
                StandardCompany comp = (StandardCompany)companys.get(i);
                if ((comp.getId() != null) && (comp.getId().intValue() != -1))
                {
                  info.setId(comp.getId().toString());
                  info.setName(comp.getName());
                  info.setParentId(comp.getParentId());
                  partCompanys.add(info);
                }
              }
              addCustomResponse("companys", partCompanys);
            }
            if ((!isAdmin()) && (company.getId().equals(userAccount.getCompany().getId()))) {
              company.setIsMine(Integer.valueOf(1));
            }
            company.setParentName(getParentCompanyName(company.getParentId()));
            List<StandardUserAccount> accountList = new ArrayList();
            if (company.getAccountID() != null)
            {
              StandardUserAccount account = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, company.getAccountID());
              accountList.add(account);
            }
            else
            {
              List<Integer> ids = new ArrayList();
              ids.add(company.getId());
              AjaxDto<StandardUserAccount> accounts = this.standardUserService.getStandardUserList(ids, null, null, null);
              accountList = accounts.getPageList();
            }
            addCustomResponse("company", company);
            addCustomResponse("accountList", accountList);
            addCustomResponse("isExistChild", Boolean.valueOf(isExistChildCompany(company, lstLevel)));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public String deleteCompany()
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
        if ((isAdmin()) || ((isRole("31")) && (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))))
        {
          StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          if (company == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else if (userAccount.getCompany().getId().equals(Integer.valueOf(Integer.parseInt(id))))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
          }
          else if (isExistOtherInfo(company))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(45));
          }
          else
          {
            Integer uid = company.getAccountID();
            this.standardUserService.delete(company);
            StandardUserAccount account = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, uid);
            this.standardUserService.delete(account);
            
            addCompanyLog(Integer.valueOf(3), company);
            int companyId = company.getId() == null ? 0 : company.getId().intValue();
            this.notifyService.sendStandardInfoChange(3, 1, companyId, "");
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public String mergeCompany()
  {
    try
    {
      if ((!isRole("31")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        boolean flag = false;
        int merge = 0;
        StandardCompany company = new StandardCompany();
        company = (StandardCompany)AjaxUtils.getObject(getRequest(), company.getClass());
        if (isExist(company))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getParentId())) || (
            (userAccount.getCompany().getParentId().intValue() == company.getParentId().intValue()) && 
            (userAccount.getCompany().getId().intValue() == company.getId().intValue())))
          {
            if ((isAdmin()) && (company.getParentId() == null)) {
              company.setParentId(Integer.valueOf(0));
            }
            company.setCompanyId(company.getParentId());
            company.setLevel(Integer.valueOf(1));
            if (company.getId() != null)
            {
              StandardUserAccount account = (StandardUserAccount)this.standardUserService.getObject(StandardUserAccount.class, company.getAccountID());
              if (company.getValidity() != null) {
                account.setValidity(company.getValidity());
              }
              account.setAccountType(Integer.valueOf(1));
              this.standardUserService.save(account);
              this.standardUserService.save(company);
              flag = true;
              merge = 2;
            }
            else
            {
              StandardUserAccount account = this.standardUserService.getStandardUserAccount(company.getAbbreviation(), null);
              if (account == null)
              {
                account = new StandardUserAccount();
                account.setAccount(company.getAbbreviation());
                account.setName(company.getAbbreviation());
                account.setName(company.getAbbreviation());
                account.setPassword(MD5EncryptUtils.encrypt(company.getPassword()));
                account.setStatus(Integer.valueOf(1));
                account.setAccountType(Integer.valueOf(1));
                account.setValidity(company.getValidity());
                company.setAbbreviation("");
                company = (StandardCompany)this.standardUserService.save(company);
                account.setCompany(company);
                account = (StandardUserAccount)this.standardUserService.save(account);
                company.setAccountID(account.getId());
                company = (StandardCompany)this.standardUserService.save(company);
                flag = true;
                merge = 1;
              }
              else
              {
                merge = 3;
                addCustomResponse(ACTION_RESULT, Integer.valueOf(15));
              }
            }
            if ((flag) && (merge == 1))
            {
              addCompanyLog(Integer.valueOf(1), company);
              int companyId = company.getId() == null ? 0 : company.getId().intValue();
              this.notifyService.sendStandardInfoChange(1, 1, companyId, "");
            }
            else if ((flag) && (merge == 2))
            {
              addCompanyLog(Integer.valueOf(2), company);
              int companyId = company.getId() == null ? 0 : company.getId().intValue();
              this.notifyService.sendStandardInfoChange(2, 1, companyId, "");
            }
            else if (merge != 3)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  private boolean isExist(StandardCompany company)
  {
    StandardCompany oldCompany = this.standardUserService.getStandardCompany(company.getName());
    if ((oldCompany == null) || ((company.getId() != null) && (oldCompany.getId().equals(company.getId())))) {
      return false;
    }
    return true;
  }
  
  protected void addCompanyLog(Integer subType, StandardCompany company)
  {
    addUserLog(Integer.valueOf(16), subType, null, company.getId().toString(), company.getName(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
