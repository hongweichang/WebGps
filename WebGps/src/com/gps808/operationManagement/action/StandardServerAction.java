package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.ServerService;
import com.gps.common.service.StorageRelationService;
import com.gps.model.ServerInfo;
import com.gps.system.model.DownStation;
import com.gps.system.service.DownStationService;
import com.gps.system.service.SysUserService;
import com.gps.system.vo.ServerStatus;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardVehicle;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.StandardUserPermit;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

public class StandardServerAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  private NotifyService notifyService;
  private SysUserService sysUserService;
  private DownStationService downStationService;
  
  public DownStationService getDownStationService()
  {
    return this.downStationService;
  }
  
  public void setDownStationService(DownStationService downStationService)
  {
    this.downStationService = downStationService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  protected boolean isSvrTypeValid(Integer svrType)
  {
    boolean ret = true;
    if (svrType.equals(Integer.valueOf(7))) {
      ret = isEnableAutoDown();
    } else if (svrType.equals(Integer.valueOf(5))) {
      ret = isEnableStorage();
    }
    return ret;
  }
  
  public String allserver()
    throws Exception
  {
    try
    {
      addCustomResponse("loginServerStatus", this.serverService.getLoginSvrOnline());
      ServerStatus svrStatus = this.serverService.getServerStatus(2, "1");
      addCustomResponse("serverGatewayCount", svrStatus.getTotal());
      addCustomResponse("serverGatewayOnline", svrStatus.getOnline());
      svrStatus = this.serverService.getServerStatus(4, "1");
      addCustomResponse("serverUserCount", svrStatus.getTotal());
      addCustomResponse("serverUserOnline", svrStatus.getOnline());
      svrStatus = this.serverService.getServerStatus(3, "1");
      addCustomResponse("serverMediaCount", svrStatus.getTotal());
      addCustomResponse("serverMediaOnline", svrStatus.getOnline());
      svrStatus = this.serverService.getServerStatus(5, "1");
      addCustomResponse("serverStorageCount", svrStatus.getTotal());
      addCustomResponse("serverStorageOnline", svrStatus.getOnline());
      svrStatus = this.serverService.getServerStatus(7, "1");
      addCustomResponse("serverDownloadCount", svrStatus.getTotal());
      addCustomResponse("serverDownloadOnline", svrStatus.getOnline());
      
      long config = this.deviceService.getServerConfig();
      addCustomResponse("enableAutoDown", Boolean.valueOf(enableAutoDown(config)));
      addCustomResponse("enableStorage", Boolean.valueOf(enableStorage(config)));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loginGet()
    throws Exception
  {
    try
    {
      ServerInfo loginsvr = (ServerInfo)this.serverService.get("1");
      if (loginsvr.getSvrSession() != null) {
        addCustomResponse("status", Boolean.valueOf(true));
      } else {
        addCustomResponse("status", Boolean.valueOf(false));
      }
      addCustomResponse("lanAddress", loginsvr.getLanip());
      addCustomResponse("deviceIp", loginsvr.getDeviceIp());
      addCustomResponse("deviceIp2", loginsvr.getDeviceIp2());
      addCustomResponse("devicePort", loginsvr.getDevicePort());
      addCustomResponse("clientIp", loginsvr.getClientIp());
      addCustomResponse("clientIp2", loginsvr.getClientIp2());
      addCustomResponse("clientPort", loginsvr.getClientPort());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loginSave()
    throws Exception
  {
    try
    {
      ServerInfo svrinfo = new ServerInfo();
      svrinfo = (ServerInfo)AjaxUtils.getObject(getRequest(), svrinfo.getClass());
      ServerInfo loginsvr = (ServerInfo)this.serverService.get("1");
      
      loginsvr.setClientIp(svrinfo.getClientIp());
      loginsvr.setClientIp2(svrinfo.getClientIp2());
      loginsvr.setClientPort(svrinfo.getClientPort());
      loginsvr.setDeviceIp(svrinfo.getDeviceIp());
      loginsvr.setDeviceIp2(svrinfo.getDeviceIp2());
      loginsvr.setDevicePort(svrinfo.getDevicePort());
      loginsvr.setLanip(svrinfo.getLanip());
      this.serverService.save(loginsvr);
      this.notifyService.updateLoginSvrAddress(loginsvr);
      this.notifyService.sendStandardInfoChange(2, 15, loginsvr.getType().intValue(), svrinfo.getIdno());
      addOperatorLog(loginsvr, Integer.valueOf(1));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean isDownStation(Integer svrtype)
  {
    return svrtype.intValue() == 7;
  }
  
  private void addOperatorLog(ServerInfo svrInfo, Integer type)
  {
    Integer usrid = getSessionUserId();
    if (usrid != null) {
      this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(2), type, 
        svrInfo.getType().toString(), svrInfo.getId().toString(), svrInfo.getIdno(), "");
    }
  }
  
  private void addDownStationLog(DownStation station, Integer type)
  {
    Integer usrid = getSessionUserId();
    if (usrid != null) {
      this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(2), type, 
        station.getId().toString(), station.getName(), "", "");
    }
  }
  
  private void addStorageRelationLog(ServerInfo svrInfo, String devIdno, Integer type)
  {
    Integer usrid = getSessionUserId();
    if (usrid != null) {
      this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(2), type, 
        svrInfo.getId().toString(), svrInfo.getIdno(), devIdno, "");
    }
  }
  
  private boolean isServerDown(Integer svrType)
  {
    return svrType.intValue() == 7;
  }
  
  private boolean checkServerDown(Integer type, Integer area)
  {
    boolean valid = true;
    if (isServerDown(type))
    {
      DownStation station = (DownStation)this.downStationService.get(area);
      if (station == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(33));
        valid = false;
      }
    }
    return valid;
  }
  
  public String delete()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.equals("1")))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        ServerInfo svrinfo = (ServerInfo)this.serverService.get(idno);
        if (svrinfo != null)
        {
          if (svrinfo.getType().intValue() == 5)
          {
            AjaxDto<StandardStorageRelation> relations = this.storageRelationService.getStoRelationList(idno, null, null, null);
            this.standardUserService.deleteServer(svrinfo, relations.getPageList());
          }
          else
          {
            this.serverService.remove(svrinfo.getIdno());
          }
          addOperatorLog(svrinfo, Integer.valueOf(4));
          this.notifyService.sendStandardInfoChange(3, 15, svrinfo.getType().intValue(), svrinfo.getIdno());
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
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
      String svrtype = getRequestString("svrtype");
      if (svrtype == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        Integer type = Integer.valueOf(Integer.parseInt(svrtype));
        if (isSvrTypeValid(type))
        {
          if ((type.equals(Integer.valueOf(2))) || (type.equals(Integer.valueOf(3))) || 
            (type.equals(Integer.valueOf(4))) || (type.equals(Integer.valueOf(7))) || 
            (type.equals(Integer.valueOf(5))))
          {
            ServerInfo newsvr = new ServerInfo();
            newsvr = (ServerInfo)AjaxUtils.getObject(getRequest(), newsvr.getClass());
            newsvr.setType(type);
            
            boolean valid = checkServerDown(type, newsvr.getArea());
            if (valid)
            {
              ServerInfo svrinfo = (ServerInfo)this.serverService.get(newsvr.getIdno());
              if (svrinfo != null)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
              }
              else
              {
                this.serverService.save(newsvr);
                ServerInfo addsvr = (ServerInfo)this.serverService.get(newsvr.getIdno());
                addOperatorLog(addsvr, Integer.valueOf(2));
                this.notifyService.sendStandardInfoChange(1, 15, addsvr.getType().intValue(), addsvr.getIdno());
              }
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(10));
          }
        }
        else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
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
      String idno = getRequestString("idno");
      if (idno == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        ServerInfo svrinfo = (ServerInfo)this.serverService.get(idno);
        if (svrinfo != null)
        {
          addCustomResponse("name", svrinfo.getName());
          addCustomResponse("idno", svrinfo.getIdno());
          addCustomResponse("area", svrinfo.getArea());
          addCustomResponse("lanAddress", svrinfo.getLanip());
          addCustomResponse("deviceIp", svrinfo.getDeviceIp());
          addCustomResponse("devicePort", svrinfo.getDevicePort());
          addCustomResponse("clientIp", svrinfo.getClientIp());
          addCustomResponse("clientPort", svrinfo.getClientPort());
          addCustomResponse("clientIp2", svrinfo.getClientIp2());
          addCustomResponse("deviceIp2", svrinfo.getDeviceIp2());
          addCustomResponse("clientPortOther", svrinfo.getClientPortOther());
          addCustomResponse("offlineTimeout", svrinfo.getOfflineTimeout());
          if (isServerDown(svrinfo.getType()))
          {
            List<DownStation> stations = this.downStationService.getAll();
            addCustomResponse("stations", stations);
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
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
      if (idno == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        ServerInfo svrinfo = (ServerInfo)this.serverService.get(idno);
        if (svrinfo != null)
        {
          ServerInfo savesvr = new ServerInfo();
          savesvr = (ServerInfo)AjaxUtils.getObject(getRequest(), savesvr.getClass());
          boolean save = true;
          
          save = checkServerDown(svrinfo.getType(), savesvr.getArea());
          if (save)
          {
            svrinfo.setName(savesvr.getName());
            svrinfo.setIdno(savesvr.getIdno());
            svrinfo.setClientIp(savesvr.getClientIp());
            svrinfo.setClientIp2(savesvr.getClientIp2());
            svrinfo.setClientPort(savesvr.getClientPort());
            svrinfo.setDeviceIp(savesvr.getDeviceIp());
            svrinfo.setDeviceIp2(savesvr.getDeviceIp2());
            svrinfo.setDevicePort(savesvr.getDevicePort());
            svrinfo.setLanip(savesvr.getLanip());
            svrinfo.setArea(savesvr.getArea());
            svrinfo.setClientPortOther(savesvr.getClientPortOther());
            if (savesvr.getOfflineTimeout() != null) {
              svrinfo.setOfflineTimeout(savesvr.getOfflineTimeout());
            }
            this.serverService.save(svrinfo);
            addOperatorLog(svrinfo, Integer.valueOf(3));
            this.notifyService.sendStandardInfoChange(2, 15, svrinfo.getType().intValue(), svrinfo.getIdno());
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
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
  
  public String allStation()
    throws Exception
  {
    try
    {
      List<DownStation> stations = this.downStationService.getAll();
      addCustomResponse("stations", stations);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected boolean isStationSsidExist(String ssid)
    throws Exception
  {
    DownStation station = this.downStationService.getStationBySsid(ssid);
    if (station != null) {
      return true;
    }
    return false;
  }
  
  protected boolean isEnableStorage()
  {
    long config = this.deviceService.getServerConfig();
    if (enableStorage(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
  }
  
  protected boolean isEnableAutoDown()
  {
    long config = this.deviceService.getServerConfig();
    if (enableAutoDown(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
  }
  
  public String addStation()
    throws Exception
  {
    try
    {
      if (isEnableAutoDown())
      {
        DownStation station = new DownStation();
        station = (DownStation)AjaxUtils.getObject(getRequest(), station.getClass());
        
        DownStation findStation = this.downStationService.getStationByName(station.getName());
        if (findStation != null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
        }
        else if (isStationSsidExist(station.getSsid()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(31));
        }
        else
        {
          DownStation addStation = (DownStation)this.downStationService.save(station);
          addDownStationLog(addStation, Integer.valueOf(7));
          this.notifyService.sendStandardInfoChange(1, 16, addStation.getId().intValue(), "");
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
  
  public String getStation()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if (id == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DownStation station = (DownStation)this.downStationService.get(Integer.valueOf(Integer.parseInt(id)));
        if (station != null) {
          addCustomResponse("station", station);
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
  
  public String saveStation()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if (id == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DownStation station = (DownStation)this.downStationService.get(Integer.valueOf(Integer.parseInt(id)));
        if (station != null)
        {
          DownStation saveStation = new DownStation();
          saveStation = (DownStation)AjaxUtils.getObject(getRequest(), saveStation.getClass());
          boolean save = true;
          if (!saveStation.getName().equals(station.getName()))
          {
            DownStation findStation = this.downStationService.getStationByName(saveStation.getName());
            if (findStation != null)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
              save = false;
            }
          }
          if (save) {
            if ((!saveStation.getSsid().equals(station.getSsid())) && (isStationSsidExist(saveStation.getSsid())))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(31));
              save = false;
            }
          }
          if (save)
          {
            saveStation.setId(station.getId());
            this.downStationService.save(saveStation);
            addDownStationLog(saveStation, Integer.valueOf(8));
            this.notifyService.sendStandardInfoChange(2, 16, saveStation.getId().intValue(), "");
          }
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
  
  public String deleteStation()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if (id == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DownStation station = (DownStation)this.downStationService.get(Integer.valueOf(Integer.parseInt(id)));
        if (station != null)
        {
          if (this.serverService.getServerCount(Integer.valueOf(7), station.getId()) > 0)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(32));
          }
          else
          {
            this.downStationService.remove(station.getId());
            addDownStationLog(station, Integer.valueOf(9));
            this.notifyService.sendStandardInfoChange(3, 16, station.getId().intValue(), "");
          }
        }
        else {
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
  
  public String getStoreRelList()
    throws Exception
  {
    try
    {
      String idno = getRequestString("id");
      if (idno == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        ServerInfo svrinfo = (ServerInfo)this.serverService.get(idno);
        String name = getRequest().getParameter("name");
        String companyId = getRequestString("companyId");
        String isRelation = getRequestString("isRelation");
        if (svrinfo != null)
        {
          String condition = "";
          if ((name != null) && (!name.isEmpty())) {
            condition = String.format(" and vehiIdno like '%%%s%%'", new Object[] { name });
          }
          AjaxDto<StandardStorageRelation> ajaxRel = this.storageRelationService.getStoRelationList(null, null, condition, null);
          
          Pagination pagination = getPaginationEx();
          if ((isRelation != null) && (isRelation.equals("1")))
          {
            List<StandardVehicle> permitVehicles = new ArrayList();
            if ((ajaxRel.getPageList() != null) && (ajaxRel.getPageList().size() > 0))
            {
              List<StandardStorageRelation> lstRel = ajaxRel.getPageList();
              int i = 0;
              for (int j = lstRel.size(); i < j; i++)
              {
                StandardStorageRelation stoRel = (StandardStorageRelation)lstRel.get(i);
                if (stoRel.getSvrIdno().equals(idno)) {
                  if ((companyId != null) && (!companyId.isEmpty()))
                  {
                    if (stoRel.getVehicle().getCompany().getId().equals(Integer.valueOf(Integer.parseInt(companyId)))) {
                      permitVehicles.add(stoRel.getVehicle());
                    }
                  }
                  else {
                    permitVehicles.add(stoRel.getVehicle());
                  }
                }
              }
            }
            AjaxDto<StandardVehicle> vehicles = doSummaryVehicleEx(permitVehicles, pagination);
            addCustomResponse("infos", vehicles.getPageList());
            addCustomResponse("pagination", vehicles.getPagination());
          }
          else
          {
            List<StandardVehicle> permitVehicles = new ArrayList();
            if ((ajaxRel.getPageList() != null) && (ajaxRel.getPageList().size() > 0))
            {
              List<StandardStorageRelation> lstRel = ajaxRel.getPageList();
              int i = 0;
              for (int j = lstRel.size(); i < j; i++) {
                permitVehicles.add(((StandardStorageRelation)lstRel.get(i)).getVehicle());
              }
            }
            if ((name != null) && (!name.isEmpty())) {
              condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
            }
            boolean isAdmin = false;
            List<Integer> companys = new ArrayList();
            if ((companyId != null) && (!companyId.isEmpty())) {
              companys.add(Integer.valueOf(Integer.parseInt(companyId)));
            } else {
              isAdmin = true;
            }
            AjaxDto<StandardVehicle> dtoVehicleList = getUserVehicles(null, companys, condition, isAdmin, null);
            
            List<StandardVehicle> allVehicles = dtoVehicleList.getPageList();
            if ((allVehicles != null) && (allVehicles.size() > 0))
            {
              int i = allVehicles.size() - 1;
              for (int j = 0; i >= j; i--)
              {
                StandardVehicle vehicle = (StandardVehicle)allVehicles.get(i);
                int ix = 0;
                for (int jx = permitVehicles.size(); ix < jx; ix++)
                {
                  StandardVehicle permitVehicle = (StandardVehicle)permitVehicles.get(ix);
                  if (vehicle.getVehiIDNO().equals(permitVehicle.getVehiIDNO()))
                  {
                    allVehicles.remove(i);
                    break;
                  }
                }
              }
              AjaxDto<StandardVehicle> vehicleList = doSummaryVehicleEx(allVehicles, pagination);
              addCustomResponse("infos", vehicleList.getPageList());
              addCustomResponse("pagination", vehicleList.getPagination());
            }
            else
            {
              addCustomResponse("infos", null);
              addCustomResponse("pagination", null);
            }
          }
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
  
  public String saveStoreRel()
    throws Exception
  {
    try
    {
      String svrIdno = getRequestString("id");
      String isRelation = getRequestString("isRelation");
      
      StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
      String vehiIdstr = userPermit.getPermits();
      if ((vehiIdstr == null) || (vehiIdstr.isEmpty()) || 
        (svrIdno == null) || (svrIdno.isEmpty()) || 
        (isRelation == null) || (isRelation.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] vehiIds;
        
        if (vehiIdstr.indexOf(",") != -1)
        {
          vehiIds = vehiIdstr.split(",");
        }
        else
        {
          vehiIds = new String[1];
          vehiIds[0] = vehiIdstr;
        }
        ServerInfo svrinfo = (ServerInfo)this.serverService.get(svrIdno);
        if (svrinfo != null)
        {
          if (isRelation.equals("0"))
          {
            boolean isAdd = false;
            for (int i = 0; i < vehiIds.length; i++)
            {
              StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(vehiIds[i])));
              if (vehicle != null)
              {
                StandardStorageRelation relation = new StandardStorageRelation();
                relation.setSvrIdno(svrIdno);
                relation.setVehiIdno(vehicle.getVehiIDNO());
                this.storageRelationService.save(relation);
                isAdd = true;
                addStorageRelationLog(svrinfo, vehicle.getVehiIDNO(), Integer.valueOf(10));
              }
            }
            if (isAdd) {
              this.notifyService.sendStandardInfoChange(1, 14, svrinfo.getType().intValue(), svrinfo.getIdno());
            }
          }
          else if (isRelation.equals("1"))
          {
            boolean isDel = false;
            for (int i = 0; i < vehiIds.length; i++)
            {
              StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(vehiIds[i])));
              if (vehicle != null)
              {
                StandardStorageRelation relation = new StandardStorageRelation();
                relation.setVehiIdno(vehicle.getVehiIDNO());
                relation.setSvrIdno(svrIdno);
                this.standardUserService.delStorageRelation(relation, Integer.valueOf(9));
                isDel = true;
                addStorageRelationLog(svrinfo, vehicle.getVehiIDNO(), Integer.valueOf(11));
              }
            }
            if (isDel) {
              this.notifyService.sendStandardInfoChange(3, 14, svrinfo.getType().intValue(), svrinfo.getIdno());
            }
          }
        }
        else {
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
  
  public String serverConfig()
    throws Exception
  {
    try
    {
      long config = this.deviceService.getServerConfig();
      addCustomResponse("enableFence", Boolean.valueOf(enableFence(config)));
      addCustomResponse("enableSms", Boolean.valueOf(enableSms(config)));
      addCustomResponse("enableAutoDown", Boolean.valueOf(enableAutoDown(config)));
      addCustomResponse("enable3GFlow", Boolean.valueOf(enable3GFlow(config)));
      addCustomResponse("enablePhone", Boolean.valueOf(enablePhone(config)));
      addCustomResponse("enablePlayback", Boolean.valueOf(enablePlayback(config)));
      addCustomResponse("enableStorage", Boolean.valueOf(enableStorage(config)));
      addCustomResponse("enableTracker", Boolean.valueOf(enableTracker(config)));
      addCustomResponse("enableMdvr", Boolean.valueOf(getEnableMdvr()));
      addCustomResponse("enableDvr", Boolean.valueOf(getEnableDvr()));
      addCustomResponse("enablePad", Boolean.valueOf(getEnablePad()));
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String standardStationList()
    throws Exception
  {
    try
    {
      AjaxDto<DownStation> ajaxDto = this.downStationService.getAllStation(getPaginationEx());
      addCustomResponse("infos", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String standardServerList()
    throws Exception
  {
    try
    {
      String svrtype = getRequestString("svrtype");
      if (svrtype == null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        Integer type = Integer.valueOf(Integer.parseInt(svrtype));
        AjaxDto<ServerInfo> ajaxDto = this.serverService.getAllServer(type, getPaginationEx());
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
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
    return isAdmin();
  }
}
