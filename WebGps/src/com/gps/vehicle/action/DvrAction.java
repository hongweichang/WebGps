package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceInfo;
import com.gps.model.UserAccount;
import com.gps.model.UserAccountEx;
import com.gps.model.UserRole;
import java.util.List;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;

public class DvrAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_DVR);
  }
  
  protected void addVehiMgrLog(Integer subType, DeviceInfo device)
  {
    addUserLog(Integer.valueOf(14), subType, device.getIdno(), null, null, null, null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(3), getPagination());
      addCustomResponse("dvrs", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
      addCustomResponse("userMgr", Boolean.valueOf(hasPrivilege(UserRole.PRIVI_USERMGR_USER)));
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
        if (device != null) {
          addCustomResponse("dvr", device);
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(25));
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
        if (device != null)
        {
          DeviceInfo saveDevice = new DeviceInfo();
          saveDevice = (DeviceInfo)AjaxUtils.getObject(getRequest(), saveDevice.getClass());
          
          device.getUserAccount().setName(saveDevice.getUserAccount().getName());
          device.setSimCard(saveDevice.getSimCard());
          device.setDriverName(saveDevice.getDriverName());
          device.setDriverTele(saveDevice.getDriverTele());
          device.setRemarks(saveDevice.getRemarks());
          device.setChnCount(saveDevice.getChnCount());
          device.setChnName(saveDevice.getChnName());
          device.setIoInCount(saveDevice.getIoInCount());
          device.setIoInName(saveDevice.getIoInName());
          device.setTempCount(saveDevice.getTempCount());
          device.setTempName(saveDevice.getTempName());
          device.setUserAddress(saveDevice.getUserAddress());
          device.setRemarks(saveDevice.getRemarks());
          
          this.deviceService.save(device);
          
          addVehiMgrLog(Integer.valueOf(1), device);
          this.notifyService.sendDeviceInfoChange(2, device.getIdno());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(25));
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
  
  public String saveName()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        UserAccount account = new UserAccount();
        account = (UserAccount)AjaxUtils.getObject(getRequest(), account.getClass());
        DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
        if (device != null)
        {
          device.getUserAccount().setName(account.getName());
          this.deviceService.save(device);
          
          addVehiMgrLog(Integer.valueOf(1), device);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
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
    throws Exception
  {
    try
    {
      if (isAdminUser())
      {
        String idno = getRequestString("idno");
        if ((idno == null) || (idno.isEmpty()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
          if (device != null)
          {
            if (!device.getUserID().equals(Integer.valueOf(0)))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(39));
            }
            else
            {
              UserAccount account = new UserAccount();
              account = (UserAccount)AjaxUtils.getObject(getRequest(), account.getClass());
              device.getUserAccount().setName(account.getName());
              device.setUserID(getClientId());
              this.deviceService.save(device);
              
              addVehiMgrLog(Integer.valueOf(1), device);
              
              addCustomResponse("device", device);
            }
          }
          else {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
          }
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(40));
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
        if (device != null)
        {
          device.setUserID(Integer.valueOf(0));
          this.deviceService.save(device);
          
          addVehiMgrLog(Integer.valueOf(2), device);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
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
  
  protected String[] genExcelHeads()
  {
    String[] heads = new String[9];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.dvr.name");
    heads[2] = getText("terminal.vehile.idno");
    heads[3] = getText("terminal.vehile.channel");
    heads[4] = getText("terminal.vehile.sim");
    heads[5] = getText("terminal.dvr.linkman");
    heads[6] = getText("terminal.dvr.telephone");
    heads[7] = getText("terminal.dvr.address");
    heads[8] = getText("terminal.dvr.remarks");
    return heads;
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(3), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          DeviceBase device = (DeviceBase)ajaxDto.getPageList().get(i - 1);
          HSSFRow row = sheet.createRow(1 + i);
          int j = 0;
          
          HSSFCell cell = row.createCell(j++);
          cell.setCellValue(i);
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getUserAccount().getName());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getIdno());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getChnCount().intValue());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getSimCard());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getDriverName());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getDriverTele());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getUserAddress());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getRemarks());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected String genExcelTitle()
  {
    return getText("terminal.dvr.title");
  }
}
