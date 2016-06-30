package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DevGroupService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceGroup;
import com.gps.model.DeviceInfo;
import com.gps.model.UserRole;
import com.gps.vo.DeviceIdnos;
import java.util.List;

public class VehiGroupAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_GROUP);
  }
  
  protected void addVehiGroupLog(Integer subType, DeviceGroup devGroup)
  {
    addUserLog(Integer.valueOf(7), subType, null, devGroup.getId().toString(), 
      devGroup.getName(), devGroup.getParentId().toString(), null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      getUserAllDeviceAndGroup();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String groupList()
    throws Exception
  {
    try
    {
      getClientAllGroup();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean isExistEqualNameGroup(int parentGroupId, String name, Integer exceptId)
  {
    List<DeviceGroup> lstGroup = null;
    if (parentGroupId == 0) {
      lstGroup = this.devGroupService.getGroupList(getClientId(), null);
    } else {
      lstGroup = this.devGroupService.getGroupList(getClientId(), Integer.valueOf(parentGroupId));
    }
    boolean ret = false;
    if (lstGroup != null) {
      for (int i = 0; i < lstGroup.size(); i++)
      {
        DeviceGroup group = (DeviceGroup)lstGroup.get(i);
        if ((exceptId == null) || 
        
          (!exceptId.equals(group.getId()))) {
          if (group.getName().equals(name))
          {
            ret = true;
            break;
          }
        }
      }
    }
    return ret;
  }
  
  public String add()
    throws Exception
  {
    try
    {
      DeviceGroup group = new DeviceGroup();
      group = (DeviceGroup)AjaxUtils.getObject(getRequest(), group.getClass());
      group.setUserId(getClientId());
      
      boolean error = false;
      if (group.getParentId().intValue() != 0)
      {
        DeviceGroup parentGroup = (DeviceGroup)this.devGroupService.get(group.getParentId());
        if (parentGroup == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
          error = true;
        }
      }
      if (!error) {
        if (isExistEqualNameGroup(group.getParentId().intValue(), group.getName(), null))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(34));
        }
        else
        {
          DeviceGroup addGroup = (DeviceGroup)this.devGroupService.save(group);
          addCustomResponse("id", addGroup.getId());
          
          addVehiGroupLog(Integer.valueOf(1), addGroup);
          this.notifyService.sendCliDeviceChange(2, getClientId().intValue());
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
        DeviceGroup devGroup = (DeviceGroup)this.devGroupService.get(Integer.valueOf(Integer.parseInt(id)));
        if (devGroup != null) {
          addCustomResponse("group", devGroup);
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
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
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceGroup devGroup = (DeviceGroup)this.devGroupService.get(Integer.valueOf(Integer.parseInt(id)));
        if (devGroup != null)
        {
          boolean error = false;
          DeviceGroup saveGroup = new DeviceGroup();
          saveGroup = (DeviceGroup)AjaxUtils.getObject(getRequest(), saveGroup.getClass());
          if (!devGroup.getName().equals(saveGroup.getName())) {
            if (isExistEqualNameGroup(devGroup.getParentId().intValue(), saveGroup.getName(), devGroup.getId()))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(34));
              error = true;
            }
          }
          if (!error)
          {
            devGroup.setName(saveGroup.getName());
            
            this.devGroupService.save(devGroup);
            
            addVehiGroupLog(Integer.valueOf(2), devGroup);
            this.notifyService.sendCliDeviceChange(2, getClientId().intValue());
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
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
  
  protected boolean isParentGroupExist(Integer parentId)
  {
    if (!parentId.equals(Integer.valueOf(0)))
    {
      DeviceGroup parentGroup = (DeviceGroup)this.devGroupService.get(parentId);
      if (parentGroup == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
        return false;
      }
    }
    return true;
  }
  
  public String move()
    throws Exception
  {
    try
    {
      DeviceGroup saveGroup = new DeviceGroup();
      saveGroup = (DeviceGroup)AjaxUtils.getObject(getRequest(), saveGroup.getClass());
      
      String groupId = getRequestString("groupId");
      if ((groupId != null) && (!groupId.isEmpty()))
      {
        DeviceGroup devGroup = (DeviceGroup)this.devGroupService.get(Integer.valueOf(Integer.parseInt(groupId)));
        if (devGroup != null)
        {
          if (isParentGroupExist(saveGroup.getParentId()))
          {
            devGroup.setParentId(saveGroup.getParentId());
            
            this.devGroupService.save(devGroup);
            
            addUserLog(Integer.valueOf(7), Integer.valueOf(4), null, devGroup.getId().toString(), 
              devGroup.getName(), groupId, devGroup.getParentId().toString());
            this.notifyService.sendCliDeviceChange(2, getClientId().intValue());
          }
        }
        else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
        }
      }
      else
      {
        String devIdno = getRequestString("devIdno");
        if ((devIdno != null) && (!devIdno.isEmpty()))
        {
          DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno);
          if (device != null)
          {
            if (isParentGroupExist(saveGroup.getParentId()))
            {
              Integer oldGroupId = device.getDevGroupId();
              device.setDevGroupId(saveGroup.getParentId());
              this.deviceService.save(device);
              
              addUserLog(Integer.valueOf(7), Integer.valueOf(5), device.getIdno(), 
                oldGroupId.toString(), saveGroup.getParentId().toString(), null, null);
              this.notifyService.sendCliDeviceChange(2, getClientId().intValue());
            }
          }
          else {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(25));
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
        DeviceGroup group = (DeviceGroup)this.devGroupService.get(Integer.valueOf(Integer.parseInt(id)));
        if (group != null)
        {
          List<DeviceGroup> groupList = this.devGroupService.getGroupList(null, group.getId());
          if ((groupList != null) && (groupList.size() > 0))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(27));
          }
          else
          {
            int devCount = this.deviceService.getDeviceCount(null, null, group.getId());
            if (devCount > 0)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(27));
            }
            else
            {
              this.devGroupService.remove(group.getId());
              addVehiGroupLog(Integer.valueOf(3), group);
              this.notifyService.sendCliDeviceChange(3, getClientId().intValue());
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
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
  
  protected void saveDeviceGroup(Integer groupId)
    throws Exception
  {
    DeviceIdnos devIdnos = new DeviceIdnos();
    devIdnos = (DeviceIdnos)AjaxUtils.getObject(getRequest(), devIdnos.getClass());
    
    String[] idnos = devIdnos.getDevIdnos().split(",");
    List<DeviceInfo> devList = this.deviceService.getDeviceIdnos(idnos);
    if ((idnos.length > 0) && (devList != null) && (devList.size() == idnos.length))
    {
      boolean saveClient = true;
      for (int i = 0; i < devList.size(); i++)
      {
        if (!((DeviceInfo)devList.get(i)).getUserID().equals(getClientId()))
        {
          saveClient = false;
          break;
        }
        ((DeviceInfo)devList.get(i)).setDevGroupId(groupId);
      }
      if (!saveClient)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        this.deviceService.batchEditDevice(devList);
        
        String param = "";
        if (devIdnos.getDevIdnos().length() > 254) {
          param = devIdnos.getDevIdnos().substring(0, 254);
        } else {
          param = devIdnos.getDevIdnos();
        }
        addUserLog(Integer.valueOf(7), Integer.valueOf(6), 
          null, groupId.toString(), param, null, null);
        this.notifyService.sendCliDeviceChange(2, getClientId().intValue());
      }
    }
    else
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
  }
  
  public String moveSelect()
  {
    try
    {
      String groupId = getRequestString("groupId");
      if ((groupId != null) && (!groupId.isEmpty()))
      {
        DeviceGroup devGroup = (DeviceGroup)this.devGroupService.get(Integer.valueOf(Integer.parseInt(groupId)));
        if (devGroup != null) {
          saveDeviceGroup(devGroup.getId());
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(26));
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
  
  public String removeSelect()
  {
    try
    {
      saveDeviceGroup(Integer.valueOf(0));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
}
