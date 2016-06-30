package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceStatus;
import com.gps.model.ServerInfo;
import com.gps.util.ObjectUtil;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDeviceOflFile;
import com.gps808.model.StandardDeviceOflTask;
import com.gps808.model.StandardDeviceOflTaskLog;
import com.gps808.model.StandardDeviceTirepressureStatus;
import com.gps808.model.StandardDeviceYouLiang;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.ResultServer;
import com.gps808.operationManagement.vo.ServerInfoResult;
import com.gps808.operationManagement.vo.StandardDeviceEx;
import com.gps808.operationManagement.vo.StandardDeviceStatusContent;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.opensymphony.xwork2.ActionContext;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class StandardDeviceAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  private File uploadFile;
  private String uploadFileFileName;
  
  public File getUploadFile()
  {
    return this.uploadFile;
  }
  
  public void setUploadFile(File uploadFile)
  {
    this.uploadFile = uploadFile;
  }
  
  public String getUploadFileFileName()
  {
    return this.uploadFileFileName;
  }
  
  public void setUploadFileFileName(String uploadFileFileName)
  {
    this.uploadFileFileName = uploadFileFileName;
  }
  
  public String loadDevices()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
      {
        List<PartStandardInfo> partDevices = new ArrayList();
        if ((isAdmin()) || (isMaster()))
        {
          AjaxDto<StandardDevice> deviceList = getDevices(company, null, null);
          if (deviceList.getPageList() != null)
          {
            List<StandardDevice> devices = deviceList.getPageList();
            for (int i = 0; i < devices.size(); i++)
            {
              StandardDevice device = (StandardDevice)devices.get(i);
              if ((device.getInstall() == null) || (device.getInstall().equals(Integer.valueOf(0))))
              {
                PartStandardInfo info = new PartStandardInfo();
                info.setId(device.getId().toString());
                info.setName(device.getDevIDNO());
                info.setParentId(device.getCompany().getId());
                partDevices.add(info);
              }
            }
          }
        }
        addCustomResponse("infos", partDevices);
      }
      else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
      {
        String companyId = getRequest().getParameter("companyId");
        String devIDNO = getRequest().getParameter("devIDNO");
        String install = getRequest().getParameter("install");
        String id = getRequest().getParameter("id");
        AjaxDto<StandardDeviceEx> deviceList = new AjaxDto();
        if ((isAdmin()) || (isMaster()))
        {
          AjaxDto<StandardDevice> dtoDeviceList = new AjaxDto();
          Pagination pagination = getPaginationEx();
          String condition = "";
          if ((companyId != null) && (!companyId.isEmpty())) {
            condition = condition + String.format(" and company.id = %d", new Object[] { Integer.valueOf(Integer.parseInt(companyId)) });
          }
          if ((devIDNO != null) && (!devIDNO.isEmpty())) {
            condition = String.format(" and (devIDNO like '%%%s%%' or serialID like '%%%s%%') ", new Object[] { devIDNO, devIDNO });
          }
          if ((id != null) && (!id.isEmpty()) && (install != null) && (!install.isEmpty()) && (!"2".equals(install))) {
            condition = condition + String.format(" and (id = %d or install = %d)", new Object[] { Integer.valueOf(Integer.parseInt(id)), Integer.valueOf(Integer.parseInt(install)) });
          } else if ((install != null) && (!install.isEmpty()) && (!"2".equals(install))) {
            condition = condition + String.format(" and install = %d", new Object[] { Integer.valueOf(Integer.parseInt(install)) });
          }
          condition = condition + " order by company.id";
          dtoDeviceList = getDevices(company, condition, pagination);
          if ((dtoDeviceList.getPageList() != null) && (dtoDeviceList.getPageList().size() > 0))
          {
            List<String> lstDevIdno = new ArrayList();
            int lstSize = dtoDeviceList.getPageList().size();
            for (int i = 0; i < lstSize; i++)
            {
              StandardDevice device = (StandardDevice)dtoDeviceList.getPageList().get(i);
              lstDevIdno.add(device.getDevIDNO());
            }
            Map<String, String> mapDevIdnoVehi = new HashMap();
            
            List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(null, lstDevIdno, null, null, null);
            if ((relations != null) && (relations.size() > 0))
            {
              int lstRel = relations.size();
              for (int i = 0; i < lstRel; i++) {
                mapDevIdnoVehi.put(((StandardVehiDevRelationExMore)relations.get(i)).getDevIdno(), ((StandardVehiDevRelationExMore)relations.get(i)).getVehiIdno());
              }
            }
            List<StandardDeviceEx> deviceListEx = new ArrayList();
            for (int i = 0; i < lstSize; i++)
            {
              StandardDeviceEx deviceEx = new StandardDeviceEx();
              deviceEx.setDevice((StandardDevice)dtoDeviceList.getPageList().get(i));
              deviceEx.setVehiIdno((String)mapDevIdnoVehi.get(deviceEx.getDevIDNO()));
              deviceListEx.add(deviceEx);
            }
            deviceList.setPageList(deviceListEx);
            deviceList.setPagination(dtoDeviceList.getPagination());
          }
        }
        else
        {
          Integer cid = null;
          if ((companyId != null) && (!companyId.isEmpty())) {
            cid = Integer.valueOf(Integer.parseInt(companyId));
          }
          Integer ist = null;
          if ((install != null) && (!install.isEmpty())) {
            ist = Integer.valueOf(Integer.parseInt(install));
          }
          Integer devid = null;
          if ((id != null) && (!id.isEmpty())) {
            devid = Integer.valueOf(Integer.parseInt(id));
          }
          List<StandardDeviceEx> deviceListEx = this.standardUserService.getUserDeviceList(userAccount.getId(), cid, devIDNO, ist, devid);
          Pagination pagination = getPaginationEx();
          int start = 0;int index = deviceListEx.size();
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
          List<StandardDeviceEx> deviceExs = new ArrayList();
          for (int i = start; i < index; i++) {
            deviceExs.add((StandardDeviceEx)deviceListEx.get(i));
          }
          deviceList.setPageList(deviceExs);
          deviceList.setPagination(pagination);
        }
        addCustomResponse("infos", deviceList.getPageList());
        addCustomResponse("pagination", deviceList.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String findDevice()
  {
    try
    {
      String id = getRequestString("id");
      String type = getRequestString("type");
      if (((id != null) && (!id.isEmpty())) || ((type != null) && (!type.isEmpty())))
      {
        if ((id != null) && (!id.isEmpty()))
        {
          StandardDevice device = this.standardUserService.getStandardDevice(Integer.valueOf(Integer.parseInt(id)));
          if (device == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), device.getCompany().getId()))) {
              addCustomResponse("device", device);
            } else {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
          }
        }
        if ((type != null) && (type.equals("edit")))
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
          List<PartStandardInfo> partCompanys = new ArrayList();
          for (int i = 0; i < companys.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardCompany company = (StandardCompany)companys.get(i);
            if (!company.getId().equals(Integer.valueOf(-1)))
            {
              info.setId(company.getId().toString());
              info.setName(company.getName());
              info.setParentId(company.getParentId());
              partCompanys.add(info);
            }
          }
          addCustomResponse("companys", partCompanys);
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
  
  public String deleteDevice()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if ((!isRole("35")) && (!isAllowManageDevice))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardDevice device = this.standardUserService.getStandardDevice(Integer.valueOf(Integer.parseInt(id)));
        if (device == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), device.getCompany().getId())))
          {
            if ((device.getInstall() != null) && (device.getInstall().intValue() == 1))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(47));
            }
            else
            {
              this.standardUserService.deleteDevice(device);
              
              addDeviceLog(Integer.valueOf(3), device);
              this.notifyService.sendStandardInfoChange(3, 6, 0, device.getDevIDNO());
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
  
  public String mergeDeviceNew()
  {
    try
    {
      StandardDevice device = new StandardDevice();
      device = (StandardDevice)AjaxUtils.getObject(getRequest(), device.getClass());
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if ((isAdmin()) || ((isRole("35")) && (isBelongCompany(userAccount.getCompany().getId(), device.getCompany().getId()))))
      {
        if ((device.getDevIDNO() == null) || (device.getDevIDNO().isEmpty()) || (device.getCompany() == null) || (device.getCompany().getId() == null))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          device.setDevIDNO(device.getDevIDNO().toLowerCase());
          if (device.getId() == null)
          {
            if (isAllowManageDevice)
            {
              device.setInstall(Integer.valueOf(0));
              if ((device.getDevIDNO() != null) && (!device.getDevIDNO().isEmpty()) && 
                (device.getIdnobf() != null) && (device.getIdnobg() != null))
              {
                String idno = device.getDevIDNO();
                for (int i = device.getIdnobf().intValue(); i <= device.getIdnobg().intValue(); i++)
                {
                  device.setDevIDNO(idno + doDevIdnoUtil(i));
                  if (!isDeviceExist(device))
                  {
                    this.standardUserService.save(device);
                    
                    addDeviceLog(Integer.valueOf(1), device);
                    this.notifyService.sendStandardInfoChange(1, 6, 0, device.getDevIDNO());
                  }
                }
              }
              else if (!isDeviceExist(device))
              {
                StandardSIMCardInfo simInfo = device.getSimInfo();
                if ((simInfo != null) && (simInfo.getCardNum() != null) && (!simInfo.getCardNum().isEmpty()))
                {
                  simInfo = (StandardSIMCardInfo)this.standardUserService.getObject(simInfo.getClass(), device.getSimInfo().getCardNum());
                  simInfo.setCompany(device.getCompany());
                  simInfo.setInstall(Integer.valueOf(1));
                  device.setSimInfo(simInfo);
                }
                else
                {
                  simInfo = null;
                }
                this.standardUserService.updateDevice(device, simInfo, null);
                
                addDeviceLog(Integer.valueOf(1), device);
                this.notifyService.sendStandardInfoChange(1, 6, 0, device.getDevIDNO());
              }
              else
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(39));
              }
            }
            else if (isAdmin())
            {
              Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
              int manageCount = registCount == null ? 0 : registCount.intValue();
              Integer deviceTotal = this.standardUserService.getDeviceCount();
              if (deviceTotal == null) {
                deviceTotal = Integer.valueOf(0);
              }
              int addCount = manageCount - deviceTotal.intValue();
              if (addCount <= 0)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
              }
              else
              {
                device.setInstall(Integer.valueOf(0));
                if ((device.getDevIDNO() != null) && (!device.getDevIDNO().isEmpty()) && 
                  (device.getIdnobf() != null) && (device.getIdnobg() != null))
                {
                  String idno = device.getDevIDNO();
                  for (int i = device.getIdnobf().intValue(); i <= device.getIdnobg().intValue(); i++)
                  {
                    device.setDevIDNO(idno + doDevIdnoUtil(i));
                    if ((!isDeviceExist(device)) && 
                      (addCount > 0))
                    {
                      this.standardUserService.save(device);
                      addCount--;
                      
                      addDeviceLog(Integer.valueOf(1), device);
                      this.notifyService.sendStandardInfoChange(1, 6, 0, device.getDevIDNO());
                    }
                  }
                }
                else if (!isDeviceExist(device))
                {
                  StandardSIMCardInfo simInfo = device.getSimInfo();
                  if ((simInfo != null) && (simInfo.getCardNum() != null) && (!simInfo.getCardNum().isEmpty()))
                  {
                    simInfo = (StandardSIMCardInfo)this.standardUserService.getObject(simInfo.getClass(), device.getSimInfo().getCardNum());
                    simInfo.setCompany(device.getCompany());
                    simInfo.setInstall(Integer.valueOf(1));
                    device.setSimInfo(simInfo);
                  }
                  else
                  {
                    simInfo = null;
                  }
                  this.standardUserService.updateDevice(device, simInfo, null);
                  
                  addDeviceLog(Integer.valueOf(1), device);
                  this.notifyService.sendStandardInfoChange(1, 6, 0, device.getDevIDNO());
                }
                else
                {
                  addCustomResponse(ACTION_RESULT, Integer.valueOf(39));
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
          }
          else
          {
            StandardDevice oldDevice = this.standardUserService.getStandardDevice(device.getId());
            if (oldDevice == null)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
            }
            else
            {
              StandardSIMCardInfo simInfo = device.getSimInfo();
              if ((simInfo != null) && (simInfo.getCardNum() != null) && (!simInfo.getCardNum().isEmpty()))
              {
                simInfo = (StandardSIMCardInfo)this.standardUserService.getObject(simInfo.getClass(), device.getSimInfo().getCardNum());
                simInfo.setCompany(device.getCompany());
                simInfo.setInstall(Integer.valueOf(1));
                device.setSimInfo(simInfo);
              }
              else
              {
                simInfo = null;
              }
              ObjectUtil.copeField(oldDevice, device);
              this.standardUserService.updateDevice(device, simInfo, oldDevice.getSimInfo());
              
              addDeviceLog(Integer.valueOf(2), device);
              this.notifyService.sendStandardInfoChange(2, 6, 0, device.getDevIDNO());
            }
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
  
  public String loadComSimInfos()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      
      List<Integer> lstLevel = new ArrayList();
      lstLevel.add(Integer.valueOf(1));
      List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
      List<PartStandardInfo> partCompanys = new ArrayList();
      for (int i = 0; i < companys.size(); i++)
      {
        PartStandardInfo info = new PartStandardInfo();
        StandardCompany company = (StandardCompany)companys.get(i);
        if (company.getId().intValue() != -1)
        {
          info.setId(company.getId().toString());
          info.setName(company.getName());
          info.setParentId(company.getParentId());
          partCompanys.add(info);
        }
      }
      addCustomResponse("companys", partCompanys);
      
      AjaxDto<StandardSIMCardInfo> simList = getSIMS(userAccount.getCompany(), null, null);
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
      addCustomResponse("simInfos", partSims);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getDeviceCountInfo()
  {
    try
    {
      if (isAdmin())
      {
        Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
        Integer manageCount = Integer.valueOf(registCount == null ? 0 : registCount.intValue());
        Integer deviceTotal = this.standardUserService.getDeviceCount();
        
        Integer onlineCount = this.standardUserService.getDeviceOnlineCount(null, isAdmin());
        addCustomResponse("onlineCount", onlineCount);
        
        Integer unregCount = this.standardUserService.getDeviceUnregCount();
        addCustomResponse("unregCount", unregCount);
        
        ActionContext ctx = ActionContext.getContext();
        ctx.getSession().put("manageCount", manageCount);
        ctx.getSession().put("deviceTotal", deviceTotal);
        
        addCustomResponse("manageCount", manageCount);
        addCustomResponse("deviceTotal", deviceTotal);
      }
      else
      {
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
  
  public String getUnregDeviceCount()
  {
    try
    {
      Integer unregCount = this.standardUserService.getDeviceUnregCount();
      addCustomResponse("unregCount", unregCount);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getOnlineDeviceCount()
  {
    try
    {
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      Integer onlineCount = Integer.valueOf(0);
      if ((isAdmin()) || (isMaster()))
      {
        List<Integer> lstId = new ArrayList();
        if (!isAdmin())
        {
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          lstId = findUserCompanyIdList(user.getCompany().getId(), lstLevel, false);
        }
        onlineCount = this.standardUserService.getDeviceOnlineCount(lstId, isAdmin());
      }
      else
      {
        onlineCount = this.standardUserService.getUserDeviceOnlineCount(user.getId());
      }
      addCustomResponse("onlineCount", onlineCount);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected List<StandardDeviceStatusContent> parseStatusContent(List<DeviceStatus> lstStatus, boolean readDevInfo)
  {
    List<StandardDeviceStatusContent> status = new ArrayList();
    if (lstStatus != null)
    {
      Map<String, ServerInfo> mapServer = new HashMap();
      for (int i = 0; i < lstStatus.size(); i++)
      {
        StandardDeviceStatusContent content = new StandardDeviceStatusContent();
        
        DeviceStatus devStatus = (DeviceStatus)lstStatus.get(i);
        devStatus.setGpsTimeStr(DateUtil.dateSwitchString(devStatus.getGpsTime()));
        content.setDevStatus(devStatus);
        if (devStatus.getJingDu() == null) {
          devStatus.setJingDu(Integer.valueOf(0));
        }
        if (devStatus.getWeiDu() == null) {
          devStatus.setWeiDu(Integer.valueOf(0));
        }
        if (readDevInfo)
        {
          StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devStatus.getDevIdno());
          content.setDevice(device);
        }
        if ((devStatus.getGwsvrIdno() != null) && (!devStatus.getGwsvrIdno().isEmpty()))
        {
          ServerInfo svrInfo = (ServerInfo)mapServer.get(devStatus.getGwsvrIdno());
          if (svrInfo == null)
          {
            svrInfo = (ServerInfo)this.standardUserService.getObject(ServerInfo.class, devStatus.getGwsvrIdno());
            if (svrInfo != null) {
              mapServer.put(devStatus.getGwsvrIdno(), svrInfo);
            }
          }
          content.setSvrInfo(svrInfo);
        }
        status.add(content);
      }
    }
    return status;
  }
  
  public String getUnregDeviceList()
  {
    try
    {
      String name = getRequestString("name");
      AjaxDto<DeviceStatus> ajaxDto = this.standardUserService.getDeviceUnregList(name, getPaginationEx());
      List<StandardDeviceStatusContent> status = parseStatusContent(ajaxDto.getPageList(), false);
      addCustomResponse("infos", status);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getOnlineDeviceList()
  {
    try
    {
      String name = getRequestString("name");
      StandardUserAccount user = (StandardUserAccount)getSession().get("userAccount");
      AjaxDto<DeviceStatus> ajaxDto = new AjaxDto();
      if ((isAdmin()) || (isMaster()))
      {
        List<Integer> lstId = new ArrayList();
        if (!isAdmin())
        {
          List<Integer> lstLevel = new ArrayList();
          lstLevel.add(Integer.valueOf(1));
          lstId = findUserCompanyIdList(user.getCompany().getId(), lstLevel, false);
        }
        ajaxDto = this.standardUserService.getDeviceOnlineList(lstId, Boolean.valueOf(true), isAdmin(), name, getPaginationEx());
      }
      else
      {
        ajaxDto = this.standardUserService.getUserDeviceOnlineList(user.getId(), Boolean.valueOf(true), name, getPaginationEx());
      }
      List<StandardDeviceStatusContent> status = parseStatusContent(ajaxDto.getPageList(), true);
      addCustomResponse("infos", status);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getFileUpgrade()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      String protocol = getRequestString("protocol");
      String factoryType = getRequestString("factoryType");
      String isUpgrade = getRequestString("isUpgrade");
      if ((factoryType == null) || (factoryType.isEmpty())) {
        factoryType = "0";
      }
      if ((isUpgrade == "true") || (isUpgrade.equals("true")))
      {
        StandardDeviceOflTask task = this.standardUserService.getDeviceOflTask(devIdno, Integer.valueOf(2));
        if (task != null)
        {
          StandardDeviceOflFile file = (StandardDeviceOflFile)this.standardUserService.getObject(StandardDeviceOflFile.class, task.getFid());
          addCustomResponse("file", file);
        }
        Pagination page = new Pagination();
        page.setCurrentPage(1);
        page.setPageRecords(10);
        AjaxDto<StandardDeviceOflFile> oflFiles = this.standardUserService.getFileListByName(null, null, Integer.valueOf(Integer.parseInt(protocol)), Integer.valueOf(Integer.parseInt(factoryType)), Integer.valueOf(2), null, page);
        addCustomResponse("oflTask", task);
        addCustomResponse("oflFiles", oflFiles.getPageList());
      }
      else
      {
        StandardDeviceOflTask photo = this.standardUserService.getDeviceOflTask(devIdno, Integer.valueOf(1));
        StandardDeviceOflTask config = this.standardUserService.getDeviceOflTask(devIdno, Integer.valueOf(3));
        if (photo != null)
        {
          StandardDeviceOflFile photoFile = (StandardDeviceOflFile)this.standardUserService.getObject(StandardDeviceOflFile.class, photo.getFid());
          addCustomResponse("photoFile", photoFile);
        }
        if (config != null)
        {
          StandardDeviceOflFile configFile = (StandardDeviceOflFile)this.standardUserService.getObject(StandardDeviceOflFile.class, config.getFid());
          addCustomResponse("configFile", configFile);
        }
        Pagination page = new Pagination();
        page.setCurrentPage(1);
        page.setPageRecords(10);
        AjaxDto<StandardDeviceOflFile> photoFiles = this.standardUserService.getFileListByName(null, null, Integer.valueOf(Integer.parseInt(protocol)), Integer.valueOf(Integer.parseInt(factoryType)), Integer.valueOf(1), null, page);
        AjaxDto<StandardDeviceOflFile> configFiles = this.standardUserService.getFileListByName(null, null, Integer.valueOf(Integer.parseInt(protocol)), Integer.valueOf(Integer.parseInt(factoryType)), Integer.valueOf(3), null, page);
        addCustomResponse("photo", photo);
        addCustomResponse("config", config);
        addCustomResponse("photoFiles", photoFiles.getPageList());
        addCustomResponse("configFiles", configFiles.getPageList());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getTpmsStatus()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      StandardDeviceTirepressureStatus tpmsStatus = this.standardUserService.getDeviceTirepressureStatus(devIdno, Integer.valueOf(101));
      addCustomResponse("tpmsStatus", tpmsStatus);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveFileUpgrade()
  {
    try
    {
      if ((isAdmin()) || (isRole("653")))
      {
        StandardDeviceOflTask newTask = new StandardDeviceOflTask();
        newTask = (StandardDeviceOflTask)AjaxUtils.getObject(getRequest(), newTask.getClass());
        StandardDeviceOflTaskLog taskLog = new StandardDeviceOflTaskLog();
        taskLog.setDevIdno(newTask.getDid());
        taskLog.setDtCreateTask(newTask.getCt());
        taskLog.setnTaskStatus(newTask.getTs());
        taskLog.setnFileType(newTask.getFt());
        StandardDeviceOflFile file = (StandardDeviceOflFile)this.standardUserService.getObject(StandardDeviceOflFile.class, newTask.getFid());
        taskLog.setStrParam(file.getSp());
        taskLog.setStrFileName(file.getFn());
        int change = 0;
        if (newTask.getId() != null) {
          change = 2;
        } else {
          change = 1;
        }
        this.standardUserService.save(newTask);
        this.standardUserService.save(taskLog);
        this.notifyService.sendStandardInfoChange(change, 17, newTask.getFt().intValue(), newTask.getDid());
      }
      else
      {
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
  
  public String saveOtherUpgrade()
  {
    try
    {
      if ((isAdmin()) || (isRole("653")))
      {
        String devIdnos = getRequestString("devIdnos");
        String[] devList = devIdnos.split(",");
        StandardDeviceOflTask newTask = new StandardDeviceOflTask();
        StandardDeviceOflTaskLog taskLog = new StandardDeviceOflTaskLog();
        newTask = (StandardDeviceOflTask)AjaxUtils.getObject(getRequest(), newTask.getClass());
        taskLog.setDtCreateTask(newTask.getCt());
        taskLog.setnTaskStatus(newTask.getTs());
        taskLog.setnFileType(newTask.getFt());
        StandardDeviceOflFile file = (StandardDeviceOflFile)this.standardUserService.getObject(StandardDeviceOflFile.class, newTask.getFid());
        taskLog.setStrParam(file.getSp());
        taskLog.setStrFileName(file.getFn());
        for (int i = 0; i < devList.length; i++)
        {
          StandardDeviceOflTask deviceOflTask = this.standardUserService.getDeviceOflTask(devList[i], newTask.getFt());
          int change = 0;
          if (deviceOflTask != null)
          {
            newTask.setId(deviceOflTask.getId());
            change = 2;
          }
          else
          {
            newTask.setId(null);
            change = 1;
          }
          newTask.setDid(devList[i]);
          taskLog.setDevIdno(devList[i]);
          this.standardUserService.save(newTask);
          this.standardUserService.save(taskLog);
          this.notifyService.sendStandardInfoChange(change, 17, 0, newTask.getDid());
        }
      }
      else
      {
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
  
  public String getOilConfig()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      StandardDeviceYouLiang deviceYouLiang = this.standardUserService.getDeviceYouLiang(devIdno);
      addCustomResponse("deviceYouLiang", deviceYouLiang);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveOilConfig()
  {
    try
    {
      StandardDeviceYouLiang devYou = new StandardDeviceYouLiang();
      devYou = (StandardDeviceYouLiang)AjaxUtils.getObject(getRequest(), devYou.getClass());
      int change = 0;
      if (devYou.getId() != null) {
        change = 2;
      } else {
        change = 1;
      }
      this.standardUserService.save(devYou);
      this.notifyService.sendStandardInfoChange(change, 18, 0, devYou.getDid());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveOtherOilConfig()
  {
    try
    {
      String devIdnos = getRequestString("devIdnos");
      String[] devList = devIdnos.split(",");
      StandardDeviceYouLiang devYou = new StandardDeviceYouLiang();
      devYou = (StandardDeviceYouLiang)AjaxUtils.getObject(getRequest(), devYou.getClass());
      for (int i = 0; i < devList.length; i++)
      {
        StandardDeviceYouLiang deviceYouLiang = this.standardUserService.getDeviceYouLiang(devList[i]);
        int change = 0;
        if (deviceYouLiang != null)
        {
          devYou.setId(deviceYouLiang.getId());
          change = 2;
        }
        else
        {
          devYou.setId(null);
          change = 1;
        }
        devYou.setDid(devList[i]);
        this.standardUserService.save(devYou);
        this.notifyService.sendStandardInfoChange(change, 18, 0, devYou.getDid());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getFileList()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String protocol = getRequestString("protocol");
      String factoryType = getRequestString("factoryType");
      String fileType = getRequestString("fileType");
      String sp = getRequestString("sp");
      if ((factoryType == null) || (factoryType.isEmpty())) {
        factoryType = "0";
      }
      AjaxDto<StandardDeviceOflFile> ajaxDto = this.standardUserService.getFileListByName(begintime, endtime, Integer.valueOf(Integer.parseInt(protocol)), Integer.valueOf(Integer.parseInt(factoryType)), Integer.valueOf(Integer.parseInt(fileType)), sp, getPaginationEx());
      List<StandardDeviceOflFile> files = ajaxDto.getPageList();
      addCustomResponse("infos", files);
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String uploadFile()
  {
    try
    {
      String devIdno = getRequestString("devIdno");
      String protocol = getRequestString("protocol");
      String factoryType = getRequestString("factoryType");
      String fileType = getRequestString("fileType");
      String param = getRequestString("param");
      if ((factoryType == null) || (factoryType.isEmpty())) {
        factoryType = "0";
      }
      if (fileType.equals("2"))
      {
        if (this.uploadFile.length() > 52428800L)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(41));
          return "success";
        }
      }
      else if (this.uploadFile.length() > 1048576L)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(41));
        return "success";
      }
      URL mediaUrl = new URL(String.format("http:/%s/3/1?MediaType=3&DevIDNO=%s", new Object[] { getNotifyService().getLoginSvrAddress(), devIdno }));
      HttpURLConnection httpConnMedia = (HttpURLConnection)mediaUrl.openConnection();
      httpConnMedia.setDoInput(true);
      httpConnMedia.setDoOutput(true);
      httpConnMedia.setUseCaches(false);
      httpConnMedia.setConnectTimeout(5000);
      httpConnMedia.setReadTimeout(60000);
      InputStreamReader inputReaderMedia = new InputStreamReader(httpConnMedia.getInputStream(), "UTF-8");
      StringBuilder builder = new StringBuilder("");
      BufferedReader reader = new BufferedReader(inputReaderMedia);
      for (;;)
      {
        String tempStr = reader.readLine();
        if (tempStr == null) {
          break;
        }
        builder.append(tempStr);
      }
      reader.close();
      String json = builder.toString();
      ServerInfoResult serverResult = (ServerInfoResult)AjaxUtils.fromJson(json, ServerInfoResult.class);
      if ((serverResult != null) && (serverResult.getResult().intValue() == 0))
      {
        StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devIdno);
        FileInputStream is = new FileInputStream(this.uploadFile);
        URL url = new URL(String.format("http://%s:%d/3/7", new Object[] { serverResult.getServer().getLanip(), serverResult.getServer().getClientPort() }));
        HttpURLConnection httpConn = (HttpURLConnection)url.openConnection();
        httpConn.setDoInput(true);
        httpConn.setDoOutput(true);
        httpConn.setRequestMethod("POST");
        httpConn.setUseCaches(false);
        httpConn.setConnectTimeout(5000);
        httpConn.setReadTimeout(60000);
        
        Map<String, String> mapParam = new HashMap();
        mapParam.put("DevIDNO", devIdno);
        mapParam.put("Type", "7");
        mapParam.put("FileName", this.uploadFileFileName);
        mapParam.put("DevType", Integer.toString(device.getDevType()));
        int subType = 0;
        if (device.getDevSubType() != null) {
          subType = device.getDevSubType().intValue();
        }
        mapParam.put("DevSubType", Integer.toString(subType));
        mapParam.put("FileLength", Long.toString(this.uploadFile.length()));
        mapParam.put("FileType", fileType);
        mapParam.put("Protocol", protocol);
        mapParam.put("FactoryType", factoryType);
        mapParam.put("Param", param);
        
        String jsonParam = AjaxUtils.toJson(mapParam, false);
        jsonParam = jsonParam + "\r\n\r\n";
        DataOutputStream dos = new DataOutputStream(httpConn.getOutputStream());
        dos.write(jsonParam.getBytes());
        
        byte[] bytes = new byte[102400];
        int n;
        while ((n = is.read(bytes)) != -1)
        {
         
          dos.write(bytes, 0, n);
        }
        dos.flush();
        InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
        
        dos.close();
        is.close();
        addCustomResponse(JSON_RESULT, inputReader);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(60));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(57));
    }
    return "success";
  }
  
  private String doDevIdnoUtil(int id)
  {
    String str = "";
    if (id < 10) {
      str = "000" + id;
    } else if ((id >= 10) && (id < 100)) {
      str = "00" + id;
    } else if ((id >= 100) && (id < 1000)) {
      str = "0" + id;
    } else {
      str = Integer.toString(id);
    }
    return str;
  }
  
  protected void addDeviceLog(Integer subType, StandardDevice device)
  {
    addUserLog(Integer.valueOf(17), subType, null, null, device.getDevIDNO(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
