package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.NotifyService;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardDriverAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String loadDrivers()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
        {
          AjaxDto<StandardDriver> driverList = getDrivers(null, null);
          List<PartStandardInfo> partDrivers = new ArrayList();
          if (driverList.getPageList() != null)
          {
            List<StandardDriver> drivers = driverList.getPageList();
            for (int i = 0; i < drivers.size(); i++)
            {
              PartStandardInfo info = new PartStandardInfo();
              StandardDriver driver = (StandardDriver)drivers.get(i);
              info.setId(driver.getId().toString());
              info.setName(driver.getName());
              info.setParentId(driver.getCompany().getId());
              partDrivers.add(info);
            }
          }
          addCustomResponse("infos", partDrivers);
        }
        else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
        {
          String companyId = getRequest().getParameter("companyId");
          String name = getRequest().getParameter("name");
          Pagination pagination = getPaginationEx();
          String condition = "";
          if ((companyId != null) && (!companyId.isEmpty())) {
            condition = condition + String.format(" and company.id = %d", new Object[] { Integer.valueOf(Integer.parseInt(companyId)) });
          }
          if ((name != null) && (!name.isEmpty())) {
            condition = String.format(" and ( jobNum like '%%%s%%' or name like '%%%s%%' or company.name like '%%%s%%')", new Object[] { name, name, name });
          }
          condition = condition + " order by company.id";
          AjaxDto<StandardDriver> driverList = getDrivers(condition, pagination);
          addCustomResponse("infos", driverList.getPageList());
          addCustomResponse("pagination", driverList.getPagination());
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
  
  public String findDriver()
  {
    try
    {
      String id = getRequestString("id");
      String type = getRequestString("type");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardDriver driver = (StandardDriver)this.standardUserService.getObject(StandardDriver.class, Integer.valueOf(Integer.parseInt(id)));
        if (driver == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), driver.getCompany().getId())))
          {
            addCustomResponse("driver", driver);
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
  
  public String deleteDriver()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if ((!isAdmin()) && (!isRole("37")))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardDriver driver = (StandardDriver)this.standardUserService.getObject(StandardDriver.class, Integer.valueOf(Integer.parseInt(id)));
        if (driver == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if (isBelongCompany(userAccount.getCompany().getId(), driver.getCompany().getId()))
          {
            this.standardUserService.delete(driver);
            
            addDriverLog(Integer.valueOf(3), driver);
            this.notifyService.sendStandardInfoChange(3, 8, 0, driver.getJobNum());
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
  
  public String mergeDriver()
  {
    try
    {
      StandardDriver driver = new StandardDriver();
      driver = (StandardDriver)AjaxUtils.getObject(getRequest(), driver.getClass());
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if ((isAdmin()) || ((isRole("37")) && (isBelongCompany(userAccount.getCompany().getId(), driver.getCompany().getId()))))
      {
        if (isDriverExist(driver))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(48));
        }
        else
        {
          if ((driver.getCompany() == null) || (driver.getCompany().getId() == null)) {
            driver.setCompany(null);
          }
          if (driver.getId() != null)
          {
            this.standardUserService.save(driver);
            
            addDriverLog(Integer.valueOf(2), driver);
            this.notifyService.sendStandardInfoChange(2, 8, 0, driver.getJobNum());
          }
          else
          {
            driver = (StandardDriver)this.standardUserService.save(driver);
            
            addDriverLog(Integer.valueOf(1), driver);
            this.notifyService.sendStandardInfoChange(1, 8, 0, driver.getJobNum());
          }
        }
      }
      else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected void addDriverLog(Integer subType, StandardDriver driver)
  {
    addUserLog(Integer.valueOf(15), subType, null, driver.getId().toString(), driver.getJobNum(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
