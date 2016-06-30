package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceBase;
import com.gps.model.DeviceBrand;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceType;
import com.gps.model.UserAccount;
import com.gps.model.UserAccountEx;
import com.gps.model.UserRole;
import com.gps.vehicle.vo.VehiCopy;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;

public class VehicleAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_VEHICLE);
  }
  
  protected void addVehiMgrLog(Integer subType, DeviceInfo device)
  {
    addUserLog(Integer.valueOf(6), subType, device.getIdno(), null, null, null, null);
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(1), getPagination());
      addCustomResponse("vehicles", ajaxDto.getPageList());
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
        if (device != null)
        {
          List<DeviceBrand> deviceBrands = this.deviceService.getAllObject(DeviceBrand.class);
          List<DeviceType> deviceTypes = this.deviceService.getAllObject(DeviceType.class);
          List<DeviceType> types = new ArrayList();
          for (int i = 0; i < deviceTypes.size(); i++)
          {
            DeviceType deviceType = (DeviceType)deviceTypes.get(i);
            if ((deviceType.getBrandId() != null) && (deviceType.getBrandId().intValue() != 0)) {
              types.add(deviceType);
            }
          }
          addCustomResponse("deviceBrands", deviceBrands);
          addCustomResponse("deviceTypes", types);
          addCustomResponse("vehicle", device);
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
          device.setVehiCompany(saveDevice.getVehiCompany());
          if ((saveDevice.getTypeId() != null) && (!saveDevice.getTypeId().equals(Integer.valueOf(0))))
          {
            DeviceType devtype = (DeviceType)this.deviceService.getObject(DeviceType.class, saveDevice.getTypeId());
            device.setVehiType(devtype.getName());
          }
          else
          {
            device.setVehiType("");
          }
          device.setTypeId(saveDevice.getTypeId());
          if ((saveDevice.getBandId() != null) && (!saveDevice.getBandId().equals(Integer.valueOf(0))))
          {
            DeviceBrand devBrand = (DeviceBrand)this.deviceService.getObject(DeviceBrand.class, saveDevice.getBandId());
            device.setVehiBand(devBrand.getName());
          }
          else
          {
            device.setVehiBand("");
          }
          device.setBandId(saveDevice.getBandId());
          
          device.setPlateColor(saveDevice.getPlateColor());
          device.setProductId(saveDevice.getProductId());
          device.setTerminalId(saveDevice.getTerminalId());
          device.setTerminalModel(saveDevice.getTerminalModel());
          
          device.setChnCount(saveDevice.getChnCount());
          device.setChnName(saveDevice.getChnName());
          device.setIoInCount(saveDevice.getIoInCount());
          device.setIoInName(saveDevice.getIoInName());
          device.setTempCount(saveDevice.getTempCount());
          device.setTempName(saveDevice.getTempName());
          device.setIcon(saveDevice.getIcon());
          device.setModule(saveDevice.getModule());
          
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
  
  public String copy()
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
          VehiCopy vehiCopy = new VehiCopy();
          vehiCopy = (VehiCopy)AjaxUtils.getObject(getRequest(), vehiCopy.getClass());
          String[] devIdno = vehiCopy.getDevIdnos().split(",");
          List<DeviceInfo> lstDevice = this.deviceService.getDeviceIdnos(devIdno);
          for (int i = 0; i < lstDevice.size(); i++)
          {
            DeviceInfo devInfo = (DeviceInfo)lstDevice.get(i);
            if (vehiCopy.getIcon().booleanValue()) {
              devInfo.setIcon(device.getIcon());
            }
            if (vehiCopy.getChannel().booleanValue())
            {
              devInfo.setChnCount(device.getChnCount());
              devInfo.setChnName(device.getChnName());
            }
            if (vehiCopy.getIo().booleanValue())
            {
              devInfo.setIoInCount(device.getIoInCount());
              devInfo.setIoInName(device.getIoInName());
            }
            if (vehiCopy.getTemperature().booleanValue())
            {
              devInfo.setTempCount(device.getTempCount());
              devInfo.setTempName(device.getTempName());
            }
            if (vehiCopy.getModule().booleanValue()) {
              devInfo.setModule(device.getModule());
            }
            if (vehiCopy.getCompany().booleanValue()) {
              devInfo.setVehiCompany(device.getVehiCompany());
            }
            if (vehiCopy.getBrand().booleanValue()) {
              if (device.getBandId() != null)
              {
                DeviceBrand deviceBrand = (DeviceBrand)this.deviceService.getObject(DeviceBrand.class, device.getBandId());
                devInfo.setBandId(device.getBandId());
                devInfo.setVehiBand(deviceBrand.getName());
              }
              else
              {
                devInfo.setVehiBand(device.getVehiBand());
              }
            }
            if (vehiCopy.getVehiType().booleanValue()) {
              if (device.getTypeId() != null)
              {
                DeviceType deviceType = (DeviceType)this.deviceService.getObject(DeviceType.class, device.getTypeId());
                devInfo.setTypeId(device.getTypeId());
                devInfo.setVehiType(deviceType.getName());
              }
              else
              {
                devInfo.setVehiType(device.getVehiType());
              }
            }
            if (vehiCopy.getPlateColor().booleanValue()) {
              devInfo.setPlateColor(device.getPlateColor());
            }
            if (vehiCopy.getFactoryCode().booleanValue()) {
              devInfo.setProductId(device.getProductId());
            }
            if (vehiCopy.getTerminalType().booleanValue()) {
              devInfo.setTerminalModel(device.getTerminalModel());
            }
          }
          this.deviceService.batchEditDevice(lstDevice);
          addVehiMgrLog(Integer.valueOf(3), device);
          for (int i = 0; i < lstDevice.size(); i++) {
            this.notifyService.sendDeviceInfoChange(2, ((DeviceInfo)lstDevice.get(i)).getIdno());
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
  
  public String saveName()
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
  
  public String addType()
    throws Exception
  {
    try
    {
      DeviceType saveType = new DeviceType();
      saveType = (DeviceType)AjaxUtils.getObject(getRequest(), saveType.getClass());
      DeviceType devtype = this.deviceService.getVehiTypeByName(saveType.getName());
      if (devtype == null)
      {
        DeviceType deviceType = new DeviceType();
        deviceType.setName(saveType.getName());
        deviceType.setBrandId(saveType.getBrandId());
        deviceType = (DeviceType)this.deviceService.save(deviceType);
        addCustomResponse("deviceType", deviceType);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(52));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getType()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      DeviceType deviceType = (DeviceType)this.deviceService.getObject(DeviceType.class, Integer.valueOf(Integer.parseInt(id)));
      addCustomResponse("vehiType", deviceType);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String listType()
    throws Exception
  {
    try
    {
      AjaxDto<DeviceType> ajaxDto = this.deviceService.getVehiType(getPagination());
      addCustomResponse("vehiTypes", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveType()
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
        DeviceType saveType = new DeviceType();
        saveType = (DeviceType)AjaxUtils.getObject(getRequest(), saveType.getClass());
        DeviceType devType = this.deviceService.getVehiTypeByName(saveType.getName());
        if ((devType == null) || (devType.getId().intValue() == Integer.parseInt(id)))
        {
          DeviceType deviceType = (DeviceType)this.deviceService.getObject(DeviceType.class, Integer.valueOf(Integer.parseInt(id)));
          deviceType.setName(saveType.getName());
          this.deviceService.updateVehiTypeName(deviceType);
          this.deviceService.save(deviceType);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(52));
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
  
  public String deleteType()
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
        DeviceType deviceType = (DeviceType)this.deviceService.getObject(DeviceType.class, Integer.valueOf(Integer.parseInt(id)));
        List<DeviceBase> devices = this.deviceService.getAllObject(DeviceBase.class);
        for (int i = 0; i < devices.size(); i++)
        {
          DeviceBase device = (DeviceBase)devices.get(i);
          if (device.getTypeId() == deviceType.getId())
          {
            device.setTypeId(null);
            this.deviceService.save(device);
          }
        }
        this.deviceService.delete(deviceType);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String addBrand()
    throws Exception
  {
    try
    {
      DeviceBrand saveBrand = new DeviceBrand();
      saveBrand = (DeviceBrand)AjaxUtils.getObject(getRequest(), saveBrand.getClass());
      DeviceBrand devBrand = this.deviceService.getVehiBrandByName(saveBrand.getName());
      if (devBrand == null)
      {
        DeviceBrand deviceBrand = new DeviceBrand();
        deviceBrand.setName(saveBrand.getName());
        deviceBrand = (DeviceBrand)this.deviceService.save(deviceBrand);
        addCustomResponse("deviceBrand", deviceBrand);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(53));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getBrand()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      DeviceBrand deviceBrand = (DeviceBrand)this.deviceService.getObject(DeviceBrand.class, Integer.valueOf(Integer.parseInt(id)));
      addCustomResponse("vehiBand", deviceBrand);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String listBrand()
    throws Exception
  {
    try
    {
      List<DeviceBrand> ajaxDto = this.deviceService.getVehiBrand();
      AjaxDto<DeviceType> ajaxDto1 = this.deviceService.getVehiType(null);
      List<DeviceType> types = new ArrayList();
      for (int i = 0; i < ajaxDto1.getPageList().size(); i++)
      {
        DeviceType deviceType = (DeviceType)ajaxDto1.getPageList().get(i);
        if ((deviceType.getBrandId() != null) && (deviceType.getBrandId().intValue() != 0)) {
          types.add(deviceType);
        }
      }
      addCustomResponse("vehiTypes", types);
      addCustomResponse("vehiBrands", ajaxDto);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveBrand()
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
        DeviceBrand saveBrand = new DeviceBrand();
        saveBrand = (DeviceBrand)AjaxUtils.getObject(getRequest(), saveBrand.getClass());
        DeviceBrand devBrand = this.deviceService.getVehiBrandByName(saveBrand.getName());
        if ((devBrand == null) || (devBrand.getId().intValue() == Integer.parseInt(id)))
        {
          DeviceBrand deviceBrand = (DeviceBrand)this.deviceService.getObject(DeviceBrand.class, Integer.valueOf(Integer.parseInt(id)));
          deviceBrand.setName(saveBrand.getName());
          this.deviceService.updateVehiBrandName(deviceBrand);
          this.deviceService.save(deviceBrand);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(53));
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
  
  public String deleteBrand()
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
        DeviceBrand deviceBrand = (DeviceBrand)this.deviceService.getObject(DeviceBrand.class, Integer.valueOf(Integer.parseInt(id)));
        List<DeviceBase> devices = this.deviceService.getAllObject(DeviceBase.class);
        for (int i = 0; i < devices.size(); i++)
        {
          DeviceBase device = (DeviceBase)devices.get(i);
          if (device.getBandId() == deviceBrand.getId())
          {
            device.setBandId(null);
            this.deviceService.save(device);
          }
        }
        this.deviceService.delete(deviceBrand);
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
    heads[1] = getText("terminal.vehile.name");
    heads[2] = getText("terminal.vehile.idno");
    heads[3] = getText("terminal.vehile.channel");
    heads[4] = getText("terminal.vehile.sim");
    heads[5] = getText("terminal.vehile.driverName");
    heads[6] = getText("terminal.vehile.driverTele");
    heads[7] = getText("terminal.vehile.branch");
    heads[8] = getText("terminal.vehile.vehiType");
    return heads;
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceBase> ajaxDto = getUserAllDevice(name, Integer.valueOf(1), null);
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
          cell.setCellValue(device.getVehiBand());
          
          cell = row.createCell(j++);
          if (device.getTypeId() != null)
          {
            DeviceType deviceType = (DeviceType)this.deviceService.getObject(DeviceType.class, device.getTypeId());
            cell.setCellValue(deviceType.getName());
          }
          else
          {
            cell.setCellValue(device.getVehiType());
          }
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
    return getText("terminal.vehile.title");
  }
}
