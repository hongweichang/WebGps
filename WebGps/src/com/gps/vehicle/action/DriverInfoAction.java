package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.model.UserRole;
import com.gps.vehicle.model.DriverInfo;
import com.gps.vehicle.service.DriverInfoService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class DriverInfoAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private DriverInfoService driverInfoService;
  
  public DriverInfoService getDriverInfoService()
  {
    return this.driverInfoService;
  }
  
  public void setDriverInfoService(DriverInfoService driverInfoService)
  {
    this.driverInfoService = driverInfoService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_DRIVER);
  }
  
  protected void addDriverInfoLog(Integer subType, DriverInfo driver)
  {
    addUserLog(Integer.valueOf(15), subType, driver.getName(), null, null, null, null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DriverInfo> ajaxDto = this.driverInfoService.getDriverList(getSessionUserId(), name, getPaginationEx());
      addCustomResponse("drivers", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String add()
    throws Exception
  {
    try
    {
      DriverInfo driver = new DriverInfo();
      driver = (DriverInfo)AjaxUtils.getObject(getRequest(), driver.getClass());
      driver.setUserID(getSessionUserId());
      
      this.driverInfoService.save(driver);
      
      addDriverInfoLog(Integer.valueOf(1), driver);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String get()
    throws Exception
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
        DriverInfo driver = (DriverInfo)this.driverInfoService.get(Integer.valueOf(Integer.parseInt(id)));
        if (driver != null) {
          addCustomResponse("driver", driver);
        } else {
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
  
  public String save()
    throws Exception
  {
    try
    {
      DriverInfo driver = new DriverInfo();
      driver = (DriverInfo)AjaxUtils.getObject(getRequest(), driver.getClass());
      
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DriverInfo driverInfo = (DriverInfo)this.driverInfoService.get(Integer.valueOf(Integer.parseInt(id)));
        if ((driverInfo != null) && (driverInfo.getUserID().equals(getSessionUserId())))
        {
          driver.setUserID(getSessionUserId());
          driver.setId(driverInfo.getId());
          
          this.driverInfoService.save(driver);
          
          addDriverInfoLog(Integer.valueOf(2), driver);
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
  
  public String delete()
    throws Exception
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
        String[] ids = id.split(",");
        List<Serializable> lstIds = new ArrayList();
        int i = 0;
        for (i = 0; i < ids.length; i++) {
          lstIds.add(Integer.valueOf(Integer.parseInt(ids[i])));
        }
        this.driverInfoService.removeList(lstIds);
        for (i = 0; i < ids.length; i++) {
          addUserLog(Integer.valueOf(15), Integer.valueOf(3), ids[i], null, null, null, null);
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
}
