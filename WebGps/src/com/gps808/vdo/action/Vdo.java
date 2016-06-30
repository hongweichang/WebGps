package com.gps808.vdo.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.StorageRelationService;
import com.gps.system.model.ServerLog;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.rule.service.StandardVehicleRuleService;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;

public class Vdo
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String OBUonline()
    throws Exception
  {
    HttpServletRequest request = ServletActionContext.getRequest();
    String url = getBackUrl(request);
    try
    {
      String customerID = getRequestString("CustomerID");
      String customerName = getRequestString("CustomerName");
      String gsmNo = getRequestString("GsmNo");
      String deviceUID = getRequestString("DeviceUID");
      String carNo = getRequestString("CarNo");
      String carType = getRequestString("CarType");
      if ((gsmNo != null) && (!gsmNo.isEmpty()) && (deviceUID != null) && (!deviceUID.isEmpty()))
      {
        if ((carNo == null) || (carNo.isEmpty())) {
          carNo = deviceUID;
        }
        StandardSIMCardInfo oldSim = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, gsmNo);
        if (oldSim != null)
        {
          ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(1), url + ";resultMsg:GsmNo already exists!", new Date());
          this.standardUserService.save(log);
          resultMsg(Integer.valueOf(0), "OK", new Object());
          return "success";
        }
        StandardDevice oldDevice = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, deviceUID);
        if (oldDevice != null)
        {
          ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(2), url + ";resultMsg:DeviceUID already exists!", new Date());
          this.standardUserService.save(log);
          resultMsg(Integer.valueOf(0), "OK", new Object());
          return "success";
        }
        StandardUserAccount user = this.standardUserService.getStandardUserAccount("admin@" + customerID, null);
        if (((customerName != null) && (!customerName.isEmpty())) || ((customerID != null) && (!customerID.isEmpty())))
        {
          StandardCompany company = new StandardCompany();
          if ((customerName == null) && (customerName.isEmpty())) {
            company = this.standardUserService.getStandardCompany(customerID);
          } else {
            company = this.standardUserService.getStandardCompany(customerName);
          }
          if (company == null)
          {
            StandardCompany com = new StandardCompany();
            if ((customerName == null) && (customerName.isEmpty())) {
              com.setName(customerID);
            } else {
              com.setName(customerName);
            }
            com.setCustomerID(customerID);
            com.setLevel(Integer.valueOf(1));
            com.setCompanyId(Integer.valueOf(0));
            com.setParentId(Integer.valueOf(0));
            company = (StandardCompany)this.standardUserService.save(com);
            if ((customerID != null) && (user == null))
            {
              StandardUserAccount account = new StandardUserAccount();
              account.setAccount("admin@" + customerID);
              account.setCompany(company);
              account.setName("admin@" + customerID);
              account.setPassword(MD5EncryptUtils.encrypt("000000"));
              account.setAccountType(Integer.valueOf(1));
              user = (StandardUserAccount)this.standardUserService.save(account);
            }
          }
          else if (((company.getCustomerID() == null) || (company.getCustomerID().isEmpty())) && (customerID != null) && (!customerID.isEmpty()))
          {
            company.setCustomerID(customerID);
            if (user == null)
            {
              StandardUserAccount account = new StandardUserAccount();
              account.setAccount("admin@" + customerID);
              account.setCompany(company);
              account.setName("admin@" + customerID);
              account.setPassword(MD5EncryptUtils.encrypt("000000"));
              account.setAccountType(Integer.valueOf(1));
              user = (StandardUserAccount)this.standardUserService.save(account);
            }
          }
          else if ((company.getCustomerID() != null) && (!company.getCustomerID().isEmpty()))
          {
            user = this.standardUserService.getStandardUserAccount("admin@" + company.getCustomerID(), null);
            if (user == null)
            {
              StandardUserAccount account = new StandardUserAccount();
              account.setAccount("admin@" + customerID);
              account.setCompany(company);
              account.setName("admin@" + customerID);
              account.setPassword(MD5EncryptUtils.encrypt("000000"));
              account.setAccountType(Integer.valueOf(1));
              user = (StandardUserAccount)this.standardUserService.save(account);
            }
          }
          StandardSIMCardInfo sim = new StandardSIMCardInfo();
          sim.setCardNum(gsmNo);
          sim.setCompany(company);
          sim.setInstall(Integer.valueOf(1));
          sim.setStatus(Integer.valueOf(1));
          sim.setRegistrationTime(new Date());
          StandardDevice device = new StandardDevice();
          device.setDevIDNO(deviceUID);
          device.setCompany(company);
          device.setInstall(Integer.valueOf(1));
          device.setSimInfo(sim);
          StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, carNo);
          if (vehicle == null) {
            vehicle = new StandardVehicle();
          }
          vehicle.setPlateType(Integer.valueOf(2));
          vehicle.setStatus(Integer.valueOf(0));
          vehicle.setPayBegin(new Date());
          vehicle.setStlTm(new Date());
          vehicle.setVehiType(carType);
          vehicle.setVehiIDNO(carNo);
          vehicle.setIcon(Integer.valueOf(1));
          vehicle.setCompany(company);
          vehicle = (StandardVehicle)this.standardUserService.save(vehicle);
          if (user != null)
          {
            StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
            permit.setUserId(user.getId());
            permit.setVehiIdno(vehicle.getVehiIDNO());
            this.standardUserService.save(permit);
          }
          List<StandardVehiDevRelation> oldRelations = getStandardUserService().getStandardVehiDevRelationList(carNo, null);
          List<StandardVehiDevRelation> relationList = new ArrayList();
          StandardVehiDevRelation relation = new StandardVehiDevRelation();
          relation.setDevice(device);
          relation.setVehicle(vehicle);
          relation.setModule(Integer.valueOf(361));
          relationList.add(relation);
          List<StandardSIMCardInfo> delSimInfos = new ArrayList();
          List<StandardDevice> delDevices = new ArrayList();
          if (oldRelations != null)
          {
            delSimInfos = changeSimInfosNew(relationList, oldRelations);
            delDevices = changeDevicesNew(relationList, oldRelations);
          }
          this.standardUserService.mergeVehicle(relationList, oldRelations, delSimInfos, delDevices);
          if ((delDevices != null) && (delDevices.size() > 0)) {
            this.standardUserService.deleteDevice((StandardDevice)delDevices.get(0));
          }
          if ((delSimInfos != null) && (delSimInfos.size() > 0)) {
            this.standardUserService.delete(delSimInfos.get(0));
          }
          ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(0), url + ";resultMsg:OK", new Date());
          this.standardUserService.save(log);
          resultMsg(Integer.valueOf(0), "OK", new Object());
        }
        else
        {
          ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(3), url + ";resultMsg:CustomerName is null and CustomerID is null!", new Date());
          this.standardUserService.save(log);
          resultMsg(Integer.valueOf(0), "OK", new Object());
        }
      }
      else
      {
        ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(4), url + ";resultMsg:Request parameter is incorrect!", new Date());
        this.standardUserService.save(log);
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      ServerLog log = new ServerLog(null, Integer.valueOf(9999), Integer.valueOf(4), url + ";resultMsg:Request parameter is incorrect!", new Date());
      this.standardUserService.save(log);
      resultMsg(Integer.valueOf(0), "OK", new Object());
    }
    return "success";
  }
  
  private List<StandardSIMCardInfo> changeSimInfosNew(List<StandardVehiDevRelation> newSimInfos, List<StandardVehiDevRelation> oldSimInfos)
  {
    List<StandardSIMCardInfo> infos = new ArrayList();
    for (int i = 0; i < oldSimInfos.size(); i++)
    {
      boolean flag = true;
      if ((((StandardVehiDevRelation)oldSimInfos.get(i)).getDevice() != null) && (((StandardVehiDevRelation)oldSimInfos.get(i)).getDevice().getSimInfo() != null)) {
        for (int j = 0; j < newSimInfos.size(); j++) {
          if ((((StandardVehiDevRelation)newSimInfos.get(j)).getDevice() != null) && (((StandardVehiDevRelation)newSimInfos.get(j)).getDevice().getSimInfo() != null) && 
            (((StandardVehiDevRelation)oldSimInfos.get(i)).getDevice().getSimInfo().getCardNum() != null) && 
            (((StandardVehiDevRelation)newSimInfos.get(j)).getDevice().getSimInfo().getCardNum() != null) && 
            (((StandardVehiDevRelation)oldSimInfos.get(i)).getDevice().getSimInfo().getCardNum().equals(((StandardVehiDevRelation)newSimInfos.get(j)).getDevice().getSimInfo().getCardNum()))) {
            flag = false;
          }
        }
      } else {
        flag = false;
      }
      if (flag) {
        infos.add(((StandardVehiDevRelation)oldSimInfos.get(i)).getDevice().getSimInfo());
      }
    }
    return infos;
  }
  
  private List<StandardDevice> changeDevicesNew(List<StandardVehiDevRelation> newDevices, List<StandardVehiDevRelation> oldDevices)
  {
    List<StandardDevice> infos = new ArrayList();
    for (int i = 0; i < oldDevices.size(); i++)
    {
      boolean flag = true;
      if (((StandardVehiDevRelation)oldDevices.get(i)).getDevice() != null) {
        for (int j = 0; j < newDevices.size(); j++) {
          if ((((StandardVehiDevRelation)newDevices.get(j)).getDevice() != null) && 
            (((StandardVehiDevRelation)oldDevices.get(i)).getDevice().getDevIDNO() != null) && 
            (((StandardVehiDevRelation)newDevices.get(j)).getDevice().getDevIDNO() != null) && 
            (((StandardVehiDevRelation)oldDevices.get(i)).getDevice().getDevIDNO().equals(((StandardVehiDevRelation)newDevices.get(j)).getDevice().getDevIDNO()))) {
            flag = false;
          }
        }
      } else {
        flag = false;
      }
      if (flag) {
        infos.add(((StandardVehiDevRelation)oldDevices.get(i)).getDevice());
      }
    }
    return infos;
  }
  
  public String Updateobu()
    throws Exception
  {
    try
    {
      String gsmNo = getRequestString("GsmNo");
      resultMsg(Integer.valueOf(0), "OK", new Object());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String Modifyobu()
    throws Exception
  {
    try
    {
      String gsmNo = getRequestString("GsmNo");
      String stateID = getRequestString("StateID");
      if ((gsmNo != null) && (!gsmNo.isEmpty()) && (stateID != null) && (!stateID.isEmpty()))
      {
        StandardSIMCardInfo sim = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, gsmNo);
        if (sim == null)
        {
          resultMsg(Integer.valueOf(0), "OK", new Object());
          return "success";
        }
        StandardDevice device = this.standardUserService.getDeviceBySim(gsmNo);
        List<StandardVehiDevRelation> relationList = this.standardUserService.getStandardVehiDevRelationList(null, device.getDevIDNO());
        if (relationList != null)
        {
          StandardVehicle vehicle = ((StandardVehiDevRelation)relationList.get(0)).getVehicle();
          if (stateID.equals("1"))
          {
            vehicle.setStatus(Integer.valueOf(2));
            this.standardUserService.save(vehicle);
          }
          else if (stateID.equals("2"))
          {
            vehicle.setStatus(Integer.valueOf(0));
            this.standardUserService.save(vehicle);
          }
          else if (stateID.equals("3"))
          {
            List<StandardVehiDevRelation> deRelations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
            List<StandardVehiRule> delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null);
            String[] vehiIdnos = { vehicle.getVehiIDNO() };
            AjaxDto<StandardStorageRelation> relations = this.storageRelationService.getStoRelationList(null, vehiIdnos, null, null);
            this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, true);
            this.standardUserService.delete(sim);
          }
        }
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
      else
      {
        resultMsg(Integer.valueOf(8), "Request parameter is incorrect!", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String ChangeOwner()
    throws Exception
  {
    try
    {
      String gsmNo = getRequestString("GsmNo");
      String customerID = getRequestString("CustomerID");
      String customerName = getRequestString("CustomerName");
      resultMsg(Integer.valueOf(0), "OK", new Object());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String ChangeCID()
    throws Exception
  {
    try
    {
      String oldCustomerID = getRequestString("oldCustomerID");
      String customerID = getRequestString("CustomerID");
      if ((oldCustomerID != null) && (!oldCustomerID.isEmpty()) && (customerID != null) && (!customerID.isEmpty()))
      {
        StandardCompany company = this.standardUserService.getCompanyByCustomerID(oldCustomerID);
        if (company == null)
        {
          resultMsg(Integer.valueOf(30), "oldCustomerID does not exist", new Object());
          return "success";
        }
        StandardCompany com = this.standardUserService.getCompanyByCustomerID(customerID);
        if (com != null)
        {
          resultMsg(Integer.valueOf(4), "CustomerID already exist", new Object());
          return "success";
        }
        company.setCustomerID(customerID);
        this.standardUserService.save(company);
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
      else
      {
        resultMsg(Integer.valueOf(8), "Request parameter is incorrect!", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String ChangeCName()
    throws Exception
  {
    try
    {
      String customerID = getRequestString("CustomerID");
      String customerName = getRequestString("CustomerName");
      if ((customerName != null) && (!customerName.isEmpty()) && (customerID != null) && (!customerID.isEmpty()))
      {
        StandardCompany com = this.standardUserService.getCompanyByCustomerID(customerID);
        if (com == null)
        {
          resultMsg(Integer.valueOf(30), "CustomerID does not exist", new Object());
          return "success";
        }
        if ((com.getName() == null) || (com.getName().isEmpty()))
        {
          resultMsg(Integer.valueOf(2), "error", new Object());
          return "success";
        }
        StandardCompany company = this.standardUserService.getStandardCompany(customerName);
        if (company != null)
        {
          resultMsg(Integer.valueOf(4), "CustomerName already exist", new Object());
          return "success";
        }
        com.setName(customerName);
        this.standardUserService.save(com);
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
      else
      {
        resultMsg(Integer.valueOf(8), "Request parameter is incorrect!", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String UpdateDeviceUID()
    throws Exception
  {
    try
    {
      String gsmNo = getRequestString("GsmNo");
      String deviceUID = getRequestString("DeviceUID");
      if ((gsmNo != null) && (!gsmNo.isEmpty()) && (deviceUID != null) && (!deviceUID.isEmpty()))
      {
        StandardSIMCardInfo oldSim = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, gsmNo);
        if (oldSim == null)
        {
          resultMsg(Integer.valueOf(30), "GsmNo does not exists!", new Object());
          return "success";
        }
        StandardDevice oldDevice = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, deviceUID);
        if (oldDevice != null)
        {
          resultMsg(Integer.valueOf(39), "DeviceUID already exists!", new Object());
          return "success";
        }
        StandardDevice device = this.standardUserService.getDeviceBySim(gsmNo);
        List<StandardVehiDevRelation> relationList = this.standardUserService.getStandardVehiDevRelationList(null, device.getDevIDNO());
        if (relationList != null)
        {
          ((StandardVehiDevRelation)relationList.get(0)).getVehicle();
          StandardDevice newdevice = new StandardDevice();
          newdevice.setDevIDNO(deviceUID);
          newdevice.setCompany(oldSim.getCompany());
          newdevice.setInstall(Integer.valueOf(1));
          newdevice.setSimInfo(oldSim);
          ((StandardVehiDevRelation)relationList.get(0)).setDevice(newdevice);
          ((StandardVehiDevRelation)relationList.get(0)).setModule(Integer.valueOf(361));
          List<StandardDevice> devices = new ArrayList();
          devices.add(device);
          this.standardUserService.mergeVehicle(relationList, null, null, devices);
          this.standardUserService.delete(device);
        }
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
      else
      {
        resultMsg(Integer.valueOf(8), "Request parameter is incorrect!", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  public String UpdateCarNo()
    throws Exception
  {
    try
    {
      String gsmNo = getRequestString("GsmNo");
      String carNo = getRequestString("CarNo");
      if ((gsmNo != null) && (!gsmNo.isEmpty()) && (carNo != null) && (!carNo.isEmpty()))
      {
        StandardVehicle oldVehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, carNo);
        if (oldVehicle != null)
        {
          resultMsg(Integer.valueOf(11), "CarNo already exists!", new Object());
          return "success";
        }
        StandardDevice device = this.standardUserService.getDeviceBySim(gsmNo);
        List<StandardVehiDevRelation> relationList = this.standardUserService.getStandardVehiDevRelationList(null, device.getDevIDNO());
        if (relationList != null)
        {
          StandardVehicle vehicle = ((StandardVehiDevRelation)relationList.get(0)).getVehicle();
          this.standardUserService.updateVehicle(vehicle.getId().intValue(), carNo);
        }
        resultMsg(Integer.valueOf(0), "OK", new Object());
      }
      else
      {
        resultMsg(Integer.valueOf(8), "Request parameter is incorrect!", new Object());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      resultMsg(Integer.valueOf(1), "Request parameter is incorrect!", new Object());
    }
    return "success";
  }
  
  protected void resultMsg(Integer code, String msg, Object object)
  {
    addCustomResponse("resultCode", code);
    addCustomResponse("resultMsg", msg);
    addCustomResponse("extraInfo", new HashMap());
  }
  
  public String codeToString(String str)
  {
    try
    {
      return URLDecoder.decode(str, "UTF-8");
    }
    catch (Exception e) {}
    return str;
  }
  
  public String getBackUrl(HttpServletRequest request)
    throws Exception
  {
    String strBackUrl = "";
    try
    {
      strBackUrl = 
        "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + request.getServletPath() + "?" + codeToString(request.getQueryString());
    }
    catch (Exception e)
    {
      throw e;
    }
    return strBackUrl;
  }
}
