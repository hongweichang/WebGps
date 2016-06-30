package com.gps.vehicle.action;

import com.framework.encrypt.MD5EncryptUtils;
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
import com.gps.user.model.UserDevPermit;
import com.gps.user.service.UserDevPermitService;
import com.gps.user.vo.UserPermit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;

public class TerminalMobileAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private UserDevPermitService userDevPermitService;
  
  public UserDevPermitService getUserDevPermitService()
  {
    return this.userDevPermitService;
  }
  
  public void setUserDevPermitService(UserDevPermitService userDevPermitService)
  {
    this.userDevPermitService = userDevPermitService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_MOBILE);
  }
  
  protected void addMobileMgrLog(Integer subType, DeviceInfo device)
  {
    addUserLog(Integer.valueOf(10), subType, device.getIdno(), null, null, null, null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(2), getPagination());
      addCustomResponse("terminals", ajaxDto.getPageList());
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
          addCustomResponse("terminal", device);
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
  
  protected boolean isEnableTracker()
  {
    long config = this.deviceService.getServerConfig();
    if (enableTracker(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
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
      else if (isEnableTracker())
      {
        DeviceInfo device = (DeviceInfo)this.deviceService.get(idno);
        if (device != null)
        {
          DeviceInfo saveDevice = new DeviceInfo();
          saveDevice = (DeviceInfo)AjaxUtils.getObject(getRequest(), saveDevice.getClass());
          
          device.getUserAccount().setName(saveDevice.getUserAccount().getName());
          device.setSimCard(saveDevice.getSimCard());
          device.setUserSex(saveDevice.getUserSex());
          device.setUserCardID(saveDevice.getUserCardID());
          device.setUserIDNO(saveDevice.getUserIDNO());
          device.setUserPost(saveDevice.getUserPost());
          device.setUserEquip(saveDevice.getUserEquip());
          device.setUserAddress(saveDevice.getUserAddress());
          device.setRemarks(saveDevice.getRemarks());
          
          this.deviceService.save(device);
          
          addMobileMgrLog(Integer.valueOf(1), device);
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
  
  protected DeviceInfo getRequestDevice()
  {
    DeviceInfo device = null;
    String idno = getRequestString("idno");
    if ((idno == null) || (idno.isEmpty()))
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
    else
    {
      device = (DeviceInfo)this.deviceService.get(idno);
      if (device == null) {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
      }
    }
    return device;
  }
  
  public String resetPwd()
    throws Exception
  {
    try
    {
      DeviceInfo device = getRequestDevice();
      if (device != null)
      {
        device.getUserAccount().setPassword(MD5EncryptUtils.encrypt("000000"));
        this.deviceService.save(device);
        addMobileMgrLog(Integer.valueOf(2), device);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getPermit()
    throws Exception
  {
    try
    {
      DeviceInfo device = getRequestDevice();
      if (device != null)
      {
        getClientAllDeviceAndGroup();
        List<UserDevPermit> devPermits = this.userDevPermitService.getDevPermitList(device.getUserAccount().getId());
        addCustomResponse("permits", devPermits);
        addCustomResponse("username", device.getUserAccount().getName());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String savePermit()
    throws Exception
  {
    try
    {
      DeviceInfo device = getRequestDevice();
      if (device != null)
      {
        UserPermit userPermit = new UserPermit();
        userPermit = (UserPermit)AjaxUtils.getObject(getRequest(), userPermit.getClass());
        List<UserDevPermit> devPermits = this.userDevPermitService.getDevPermitList(device.getUserAccount().getId());
        
        String[] devIdnos = userPermit.getPermits().split(",");
        
        Map savePermits = new HashMap();
        for (int i = 0; i < devIdnos.length; i++) {
          savePermits.put(devIdnos[i], devIdnos[i]);
        }
        List<UserDevPermit> delPermits = new ArrayList();
        for (int i = 0; i < devPermits.size(); i++)
        {
          UserDevPermit permit = (UserDevPermit)devPermits.get(i);
          if (savePermits.get(permit.getDevIdno()) == null) {
            delPermits.add(permit);
          }
        }
        Map existPermits = new HashMap();
        for (int i = 0; i < devPermits.size(); i++)
        {
          UserDevPermit permit = (UserDevPermit)devPermits.get(i);
          existPermits.put(permit.getDevIdno(), permit.getDevIdno());
        }
        List<UserDevPermit> addPermits = new ArrayList();
        for (int i = 0; i < devIdnos.length; i++) {
          if (existPermits.get(devIdnos[i]) == null)
          {
            UserDevPermit newPermit = new UserDevPermit();
            newPermit.setAccountId(device.getUserAccount().getId());
            newPermit.setDevIdno(devIdnos[i]);
            addPermits.add(newPermit);
          }
        }
        this.userDevPermitService.editUserDevPermit(addPermits, delPermits);
        
        addMobileMgrLog(Integer.valueOf(3), device);
        this.notifyService.sendTerminalDeviceChange(2, device.getUserAccount().getId().intValue());
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
    String[] heads = new String[10];
    heads[0] = getText("report.index");
    heads[1] = getText("terminal.mobile.name");
    heads[2] = getText("terminal.mobile.account");
    heads[3] = getText("terminal.mobile.sex");
    heads[4] = getText("terminal.mobile.userIdno");
    heads[5] = getText("terminal.mobile.telephone");
    heads[6] = getText("terminal.mobile.post");
    heads[7] = getText("terminal.mobile.card");
    heads[8] = getText("terminal.mobile.address");
    heads[9] = getText("terminal.mobile.remarks");
    return heads;
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(2), null);
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
          cell.setCellValue(device.getUserAccount().getAccount());
          
          cell = row.createCell(j++);
          if ((device.getUserSex() != null) && (device.getUserSex().equals(Integer.valueOf(2)))) {
            cell.setCellValue(getText("female"));
          } else {
            cell.setCellValue(getText("male"));
          }
          cell = row.createCell(j++);
          cell.setCellValue(device.getUserIDNO());
          
          cell = row.createCell(j++);
          cell.setCellValue(device.getSimCard());
          
          cell = row.createCell(j++);
          if ((device.getUserPost() != null) && (device.getUserPost().equals(Integer.valueOf(1)))) {
            cell.setCellValue(getText("postCaptain"));
          } else {
            cell.setCellValue(getText("postMember"));
          }
          cell = row.createCell(j++);
          cell.setCellValue(device.getUserCardID());
          
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
    return getText("terminal.mobile.title");
  }
}
