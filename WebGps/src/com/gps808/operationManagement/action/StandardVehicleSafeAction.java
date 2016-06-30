package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleSafe;
import com.gps808.operationManagement.service.StandardUserService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardVehicleSafeAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  private List<StandardVehicleSafe> getAllVehicleSafeList(List<StandardVehicle> vehicleList)
  {
    List<StandardVehicleSafe> vehicleSafes = new ArrayList();
    if ((vehicleList != null) && (vehicleList.size() > 0))
    {
      List<String> lstVehiIdno = new ArrayList();
      int lstSize = vehicleList.size();
      for (int i = 0; i < lstSize; i++)
      {
        StandardVehicle vehicle = (StandardVehicle)vehicleList.get(i);
        lstVehiIdno.add(vehicle.getVehiIDNO());
      }
      vehicleSafes = this.standardUserService.getAllVehicleSafes(lstVehiIdno);
    }
    return vehicleSafes;
  }
  
  public String loadVehicleSafes()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      
      String name = getRequest().getParameter("name");
      Pagination pagination = getPaginationEx();
      String condition = "";
      if ((name != null) && (!name.isEmpty())) {
        condition = condition + String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
      }
      AjaxDto<StandardVehicle> vehicleList = getUserVehicles(company.getId(), null, condition, isAdmin(), null);
      
      List<StandardVehicleSafe> lstVehicleListSafe = getAllVehicleSafeList(vehicleList.getPageList());
      
      int start = 0;int index = lstVehicleListSafe.size();
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
        start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
        pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
      }
      List<StandardVehicleSafe> newVehicleSafes = new ArrayList();
      for (int i = start; i < index; i++) {
        newVehicleSafes.add((StandardVehicleSafe)lstVehicleListSafe.get(i));
      }
      addCustomResponse("infos", newVehicleSafes);
      addCustomResponse("pagination", pagination);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findVehicelSafe()
  {
    try
    {
      String id = getRequest().getParameter("id");
      StandardVehicleSafe vehicleSafe = (StandardVehicleSafe)this.standardUserService.getObject(StandardVehicleSafe.class, Integer.valueOf(Integer.parseInt(id)));
      addCustomResponse("safe", vehicleSafe);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String deleteVehicelSafe()
  {
    try
    {
      String id = getRequest().getParameter("id");
      StandardVehicleSafe vehicleSafe = (StandardVehicleSafe)this.standardUserService.getObject(StandardVehicleSafe.class, Integer.valueOf(Integer.parseInt(id)));
      this.standardUserService.delete(vehicleSafe);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String mergeVehicleSafeNew()
  {
    try
    {
      StandardVehicleSafe safe = new StandardVehicleSafe();
      safe = (StandardVehicleSafe)AjaxUtils.getObject(getRequest(), safe.getClass());
      List<StandardVehicle> vehicleList = new ArrayList();
      vehicleList.add(safe.getVehicle());
      List<StandardVehicleSafe> lstVehicleListSafe = getAllVehicleSafeList(vehicleList);
      if ((safe.getId() == null) && ((lstVehicleListSafe == null) || (lstVehicleListSafe.size() == 0))) {
        this.standardUserService.save(safe);
      } else if ((safe.getId() != null) && (lstVehicleListSafe != null) && (lstVehicleListSafe.size() > 0) && 
        (safe.getId().intValue() == ((StandardVehicleSafe)lstVehicleListSafe.get(0)).getId().intValue())) {
        this.standardUserService.save(safe);
      } else {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(61));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
