package com.gps808.operationManagement.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.StringUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.StorageRelationService;
import com.gps.model.DeviceStatusLite;
import com.gps.model.UserAccount;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.util.ObjectUtil;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDevice;
import com.gps808.model.StandardDriver;
import com.gps808.model.StandardSIMCardInfo;
import com.gps808.model.StandardStorageRelation;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardUserVehiPermitEx;
import com.gps808.model.StandardUserVehiPermitVehicle;
import com.gps808.model.StandardVehiDevRelation;
import com.gps808.model.StandardVehiRule;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleInvoice;
import com.gps808.model.StandardVehicleReceipt;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardSendVehicle;
import com.gps808.operationManagement.vo.StandardUserPermit;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.operationManagement.vo.StandardVehicleEx;
import com.gps808.operationManagement.vo.StandardVehicleMaturity;
import com.gps808.rule.service.StandardVehicleRuleService;
import com.opensymphony.xwork2.ActionContext;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.hibernate.type.StandardBasicTypes;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class StandardVehicleAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  private List<StandardVehicleEx> getAllVehicleList(AjaxDto<StandardVehicle> vehicleList, Boolean isOnline, String idno)
  {
    List<StandardVehicleEx> lstOnlineVehicleListEx = new ArrayList();
    List<StandardVehicleEx> lstVehicleListEx = new ArrayList();
    if ((vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
    {
      List<String> lstVehiIdno = new ArrayList();
      int lstSize = vehicleList.getPageList().size();
      for (int i = 0; i < lstSize; i++)
      {
        StandardVehicle vehicle = (StandardVehicle)vehicleList.getPageList().get(i);
        lstVehiIdno.add(vehicle.getVehiIDNO());
      }
      Map<String, List<PartStandardInfo>> mapVehiIdnoDevList = new HashMap();
      
      List<QueryScalar> scalars = new ArrayList();
      scalars.add(new QueryScalar("devId", StandardBasicTypes.INTEGER));
      List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(lstVehiIdno, null, scalars, ",b.id as devId", ",jt808_device_info b where a.DevIDNO = b.DevIDNO");
      
      Map<String, Integer> mapDeviIdnoOnline = new HashMap();
      
      Map<String, String> mapDeviIdnoTime = new HashMap();
      if ((relations != null) && (relations.size() > 0))
      {
        AjaxDto<DeviceStatusLite> ajaxDto = this.standardUserService.getDeviceStatusLite(isOnline, null);
        if ((ajaxDto != null) && (ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0))
        {
          List<DeviceStatusLite> lstDevLite = ajaxDto.getPageList();
          int lstDevLiteSize = lstDevLite.size();
          for (int i = 0; i < lstDevLiteSize; i++)
          {
            if ((((DeviceStatusLite)lstDevLite.get(i)).getOl() != null) && (((DeviceStatusLite)lstDevLite.get(i)).getOl().intValue() == 1)) {
              mapDeviIdnoOnline.put(((DeviceStatusLite)lstDevLite.get(i)).getId().toString(), ((DeviceStatusLite)lstDevLite.get(i)).getOl());
            }
            if (((DeviceStatusLite)lstDevLite.get(i)).getGt() != null) {
              mapDeviIdnoTime.put(((DeviceStatusLite)lstDevLite.get(i)).getId().toString(), ((DeviceStatusLite)lstDevLite.get(i)).getGt());
            }
          }
        }
        int lstRel = relations.size();
        for (int i = 0; i < lstRel; i++)
        {
          StandardVehiDevRelationExMore relation = (StandardVehiDevRelationExMore)relations.get(i);
          PartStandardInfo info = new PartStandardInfo();
          info.setId(relation.getDevId().toString());
          info.setName(relation.getDevIdno());
          if (mapVehiIdnoDevList.get(relation.getVehiIdno()) != null)
          {
            List<PartStandardInfo> lstDevlist = (List)mapVehiIdnoDevList.get(relation.getVehiIdno());
            lstDevlist.add(info);
          }
          else
          {
            List<PartStandardInfo> lstDevlist = new ArrayList();
            lstDevlist.add(info);
            mapVehiIdnoDevList.put(relation.getVehiIdno(), lstDevlist);
          }
        }
      }
      boolean isDefAdd = false;
      if ((idno == null) || (idno.isEmpty())) {
        isDefAdd = true;
      }
      List<Integer> lstComapnyId = null;
      if ((idno != null) && (!idno.isEmpty()))
      {
        AjaxDto<StandardCompany> dtoCompany = this.standardUserService.getStandardCompanyByName(idno, null);
        if ((dtoCompany != null) && (dtoCompany.getPageList() != null) && (dtoCompany.getPageList().size() > 0))
        {
          lstComapnyId = new ArrayList();
          int i = 0;
          for (int j = dtoCompany.getPageList().size(); i < j; i++) {
            lstComapnyId.add(((StandardCompany)dtoCompany.getPageList().get(i)).getId());
          }
        }
      }
      boolean isAdd = false;
      for (int i = 0; i < lstSize; i++)
      {
        StandardVehicleEx vehicleEx = new StandardVehicleEx();
        StandardVehicle vehicle = (StandardVehicle)vehicleList.getPageList().get(i);
        vehicleEx.setId(vehicle.getId());
        vehicleEx.setVid(vehicle.getVehiIDNO());
        vehicleEx.setCor(vehicle.getVehiColor());
        vehicleEx.setStu(vehicle.getStatus());
        vehicleEx.setPtp(vehicle.getPlateType());
        vehicleEx.setItm(DateUtil.dateSwitchString(vehicle.getStlTm()));
        if (vehicle.getPayPeriod() != null) {
          vehicleEx.setStm(DateUtil.dateSwitchDateString(DateUtil.dateIncrease(vehicle.getPayBegin(), vehicle.getPayPeriod(), null)));
        } else {
          vehicleEx.setStm(getText("service.no.maturity"));
        }
        PartStandardInfo com = new PartStandardInfo();
        com.setId(vehicle.getCompany().getId().toString());
        com.setName(vehicle.getCompany().getName());
        com.setLevel(vehicle.getCompany().getLevel());
        com.setParentId(vehicle.getCompany().getParentId());
        com.setCompanyId(vehicle.getCompany().getCompanyId());
        vehicleEx.setCom(com);
        
        isAdd = false;
        if ((!isDefAdd) && (lstComapnyId != null)) {
          if ((com.getLevel() != null) && (!com.getLevel().equals(Integer.valueOf(1))) && (lstComapnyId.contains(com.getCompanyId()))) {
            isAdd = true;
          } else if (lstComapnyId.contains(vehicle.getCompany().getId())) {
            isAdd = true;
          }
        }
        if ((!isDefAdd) && (!isAdd) && (StringUtil.indexOfEx(vehicle.getVehiIDNO(), idno) >= 0)) {
          isAdd = true;
        }
        int online = 0;
        if (mapVehiIdnoDevList.get(vehicle.getVehiIDNO()) != null)
        {
          List<PartStandardInfo> lstDevlist = (List)mapVehiIdnoDevList.get(vehicle.getVehiIDNO());
          vehicleEx.setDevList(lstDevlist);
          for (int j = 0; j < lstDevlist.size(); j++)
          {
            if ((mapDeviIdnoOnline.get(((PartStandardInfo)lstDevlist.get(j)).getName()) != null) && (((Integer)mapDeviIdnoOnline.get(((PartStandardInfo)lstDevlist.get(j)).getName())).intValue() == 1)) {
              online = 1;
            }
            if ((vehicleEx.getTm() == null) || ((mapDeviIdnoTime.get(((PartStandardInfo)lstDevlist.get(j)).getName()) != null) && (DateUtil.compareDate(DateUtil.StrLongTime2Date((String)mapDeviIdnoTime.get(((PartStandardInfo)lstDevlist.get(j)).getName())), DateUtil.StrLongTime2Date(vehicleEx.getTm()))))) {
              vehicleEx.setTm((String)mapDeviIdnoTime.get(((PartStandardInfo)lstDevlist.get(j)).getName()));
            }
            if ((!isDefAdd) && (!isAdd) && (StringUtil.indexOfEx(((PartStandardInfo)lstDevlist.get(j)).getName(), idno) >= 0)) {
              isAdd = true;
            }
          }
        }
        vehicleEx.setOl(Integer.valueOf(online));
        if ((isDefAdd) || (isAdd)) {
          if (online == 1) {
            lstOnlineVehicleListEx.add(vehicleEx);
          } else {
            lstVehicleListEx.add(vehicleEx);
          }
        }
      }
    }
    if (isOnline == null)
    {
      lstOnlineVehicleListEx.addAll(lstVehicleListEx);
      return lstOnlineVehicleListEx;
    }
    if (isOnline.booleanValue()) {
      return lstOnlineVehicleListEx;
    }
    return lstVehicleListEx;
  }
  
  public String loadVehicles()
  {
    try
    {
      String type = getRequestString("type");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      if ((type != null) && (!type.isEmpty()) && ("0".equals(type)))
      {
        List<PartStandardInfo> partVehicles = new ArrayList();
        if ((isAdmin()) || (isMaster()))
        {
          AjaxDto<StandardVehicle> vehicleList = getUserVehicles(company.getId(), null, null, isAdmin(), null);
          if (vehicleList.getPageList() != null)
          {
            List<StandardVehicle> vehicles = vehicleList.getPageList();
            for (int i = 0; i < vehicles.size(); i++)
            {
              PartStandardInfo info = new PartStandardInfo();
              StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
              info.setId(vehicle.getVehiIDNO().toString());
              info.setName(vehicle.getVehiIDNO());
              info.setParentId(vehicle.getCompany().getId());
              partVehicles.add(info);
            }
          }
        }
        else
        {
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(userAccount.getId(), null, null);
          for (int i = 0; i < vehiPermits.size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardVehicle vehicle = ((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle();
            info.setId(vehicle.getVehiIDNO().toString());
            info.setName(vehicle.getVehiIDNO());
            info.setParentId(vehicle.getCompany().getId());
            partVehicles.add(info);
          }
        }
        addCustomResponse("vehicles", partVehicles);
      }
      else if ((type != null) && (!type.isEmpty()) && (!"0".equals(type)))
      {
        String name = getRequest().getParameter("name");
        String status = getRequest().getParameter("status");
        Pagination pagination = getPaginationEx();
        String condition = "";
        
        AjaxDto<StandardVehicle> vehicleList = new AjaxDto();
        if ((isAdmin()) || (isMaster()))
        {
          if ((status != null) && (!status.isEmpty()) && (!"4".equals(status)) && (!"5".equals(status))) {
            condition = condition + String.format(" and status = %d ", new Object[] { Integer.valueOf(Integer.parseInt(status)) });
          }
          vehicleList = getUserVehicles(company.getId(), null, condition, isAdmin(), null);
        }
        else
        {
          if ((status != null) && (!status.isEmpty()) && (!"4".equals(status)) && (!"5".equals(status))) {
            condition = condition + String.format(" and vehicle.status = %d ", new Object[] { Integer.valueOf(Integer.parseInt(status)) });
          }
          List<StandardVehicle> vehicles = new ArrayList();
          List<StandardUserVehiPermitVehicle> vehiPermits = this.standardUserService.getAuthorizedVehicleList(userAccount.getId(), null, condition);
          for (int i = 0; i < vehiPermits.size(); i++) {
            vehicles.add(((StandardUserVehiPermitVehicle)vehiPermits.get(i)).getVehicle());
          }
          vehicleList.setPageList(vehicles);
        }
        Boolean isOnline = null;
        if ((status != null) && (!status.isEmpty()) && ("5".equals(status))) {
          isOnline = Boolean.valueOf(true);
        }
        List<StandardVehicleEx> lstVehicleListEx = getAllVehicleList(vehicleList, isOnline, name);
        
        AjaxDto<StandardVehicleEx> dtoVehicleEx = doSummaryVehicleLiteEx(lstVehicleListEx, pagination);
        
        addCustomResponse("infos", dtoVehicleEx.getPageList());
        addCustomResponse("pagination", dtoVehicleEx.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadVehicleMaturitys()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      String name = getRequest().getParameter("name");
      String begin = getRequestString("begin");
      String end = getRequestString("end");
      String condition = "";
      if ((name != null) && (!name.isEmpty())) {
        condition = condition + String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
      }
      List<StandardVehicle> vehicles = getVehiclesMaturity(userAccount.getCompany().getId(), begin, end, null, condition, isAdmin());
      List<StandardVehicleMaturity> vehicleMaturities = new ArrayList();
      Pagination pagination = getPaginationEx();
      if (vehicles != null)
      {
        int start = 0;int index = vehicles.size();
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
        for (int i = start; i < index; i++)
        {
          StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
          StandardCompany scompany = new StandardCompany();
          scompany.setId(vehicle.getId());
          vehicle.setCompany(scompany);
          StandardVehicleMaturity maturity = new StandardVehicleMaturity();
          maturity.setVehiIDNO(vehicle.getVehiIDNO());
          maturity.setCompany(vehicle.getCompany());
          maturity.setPlateType(vehicle.getPlateType());
          String status = "";
          if ((vehicle.getSafeDate() != null) && (!DateUtil.dateSwitchDateString(vehicle.getSafeDate()).equals("1970-01-01")))
          {
            maturity.setSafe(DateUtil.dateSwitchDateString(vehicle.getSafeDate()));
            Long day = Long.valueOf((vehicle.getSafeDate().getTime() - new Date().getTime()) / 1000L / 60L / 60L / 24L);
            if ((status != null) && (!status.equals(""))) {
              status = status + ";";
            }
            if (day.longValue() < 0L) {
              status = status + getText("safe.maturity.expired");
            } else if (day.longValue() == 0L) {
              status = status + getText("safe.maturity.today");
            } else {
              status = status + getText("safe.maturity.duration", new String[] { day.toString() });
            }
          }
          else
          {
            maturity.setSafe(getText("safe.no.maturity"));
          }
          if ((vehicle.getDrivingDate() != null) && (!DateUtil.dateSwitchDateString(vehicle.getDrivingDate()).equals("1970-01-01")))
          {
            maturity.setDriving(DateUtil.dateSwitchDateString(vehicle.getDrivingDate()));
            Long day = Long.valueOf((vehicle.getDrivingDate().getTime() - new Date().getTime()) / 1000L / 60L / 60L / 24L);
            if ((status != null) && (!status.equals(""))) {
              status = status + ";";
            }
            if (day.longValue() < 0L) {
              status = status + getText("driving.maturity.expired");
            } else if (day.longValue() == 0L) {
              status = status + getText("driving.maturity.today");
            } else {
              status = status + getText("driving.maturity.duration", new String[] { day.toString() });
            }
          }
          else
          {
            maturity.setDriving(getText("driving.no.maturity"));
          }
          if ((vehicle.getOperatingDate() != null) && (!DateUtil.dateSwitchDateString(vehicle.getOperatingDate()).equals("1970-01-01")))
          {
            maturity.setOperating(DateUtil.dateSwitchDateString(vehicle.getOperatingDate()));
            Long day = Long.valueOf((vehicle.getOperatingDate().getTime() - new Date().getTime()) / 1000L / 60L / 60L / 24L);
            if ((status != null) && (!status.equals(""))) {
              status = status + ";";
            }
            if (day.longValue() < 0L) {
              status = status + getText("operating.maturity.expired");
            } else if (day.longValue() == 0L) {
              status = status + getText("operating.maturity.today");
            } else {
              status = status + getText("operating.maturity.duration", new String[] { day.toString() });
            }
          }
          else
          {
            maturity.setOperating(getText("operating.no.maturity"));
          }
          if (vehicle.getPayPeriod() != null)
          {
            maturity.setService(DateUtil.dateSwitchDateString(DateUtil.dateIncrease(vehicle.getPayBegin(), vehicle.getPayPeriod(), null)));
            Long day = Long.valueOf((DateUtil.dateIncrease(vehicle.getPayBegin(), vehicle.getPayPeriod(), null).getTime() - new Date().getTime()) / 1000L / 60L / 60L / 24L);
            if ((status != null) && (!status.equals(""))) {
              status = status + ";";
            }
            if (day.longValue() < 0L) {
              status = status + getText("service.maturity.expired");
            } else if (day.longValue() == 0L) {
              status = status + getText("service.maturity.today");
            } else {
              status = status + getText("service.maturity.duration", new String[] { day.toString() });
            }
          }
          else
          {
            maturity.setService(getText("service.no.maturity"));
          }
          maturity.setStatus(status);
          vehicleMaturities.add(maturity);
        }
      }
      addCustomResponse("infos", vehicleMaturities);
      addCustomResponse("pagination", pagination);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadVehicleInvoices()
  {
    try
    {
      String status = getRequest().getParameter("status");
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      List<Integer> childIds = findUserCompanyIdList(company.getId(), null, isAdmin());
      List<Integer> parentIds = findUserChildIdList(company.getId());
      if ((parentIds != null) && (parentIds.size() > 0)) {
        for (int i = 0; i < parentIds.size(); i++) {
          childIds.add((Integer)parentIds.get(i));
        }
      }
      AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(null, null, null, childIds, status, getPaginationEx());
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
  
  public String findInvoice()
  {
    String id = getRequestString("id");
    try
    {
      StandardVehicleInvoice receipt = (StandardVehicleInvoice)this.standardUserService.getObject(StandardVehicleInvoice.class, Integer.valueOf(Integer.parseInt(id)));
      addCustomResponse("receipt", receipt);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delInvoice()
  {
    String id = getRequestString("id");
    try
    {
      StandardVehicleInvoice invoice = new StandardVehicleInvoice();
      invoice.setId(Integer.valueOf(Integer.parseInt(id)));
      this.standardUserService.delete(invoice);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String margeInvoice()
  {
    try
    {
      StandardVehicleInvoice invoice = new StandardVehicleInvoice();
      invoice = (StandardVehicleInvoice)AjaxUtils.getObject(getRequest(), invoice.getClass());
      this.standardUserService.save(invoice);
      if (invoice.getReceiptId() != null)
      {
        StandardVehicleReceipt receipt = (StandardVehicleReceipt)this.standardUserService.getObject(StandardVehicleReceipt.class, invoice.getReceiptId());
        receipt.setSendStatus(Integer.valueOf(1));
        receipt.setStatus(Integer.valueOf(2));
        this.standardUserService.save(receipt);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String margeInvoiceVehicle()
  {
    try
    {
      StandardVehicleInvoice invoice = new StandardVehicleInvoice();
      invoice = (StandardVehicleInvoice)AjaxUtils.getObject(getRequest(), invoice.getClass());
      StandardVehicleInvoice old_invoice = (StandardVehicleInvoice)this.standardUserService.getObject(StandardVehicleInvoice.class, invoice.getId());
      if (old_invoice != null)
      {
        StandardVehicle vehicle = this.standardUserService.getStandardVehicle(invoice.getVehicle().getId());
        old_invoice.setVehicle(vehicle);
        this.standardUserService.save(old_invoice);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadVehicleApplys()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      List<Integer> childIds = findUserCompanyIdList(company.getId(), null, isAdmin());
      String status = getRequest().getParameter("status");
      AjaxDto<StandardVehicleReceipt> ajaxDto = this.standardUserService.getVehicleReceipts(childIds, status, getPaginationEx());
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
  
  public String findApply()
  {
    String id = getRequestString("id");
    try
    {
      StandardVehicleReceipt receipt = (StandardVehicleReceipt)this.standardUserService.getObject(StandardVehicleReceipt.class, Integer.valueOf(Integer.parseInt(id)));
      addCustomResponse("receipt", receipt);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delApply()
  {
    String id = getRequestString("id");
    try
    {
      StandardVehicleReceipt receipt = new StandardVehicleReceipt();
      receipt.setId(Integer.valueOf(Integer.parseInt(id)));
      this.standardUserService.delete(receipt);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String margeApply()
  {
    try
    {
      StandardVehicleReceipt receipt = new StandardVehicleReceipt();
      receipt = (StandardVehicleReceipt)AjaxUtils.getObject(getRequest(), receipt.getClass());
      this.standardUserService.save(receipt);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadCompanyVehicles()
  {
    try
    {
      String type = getRequestString("type") == null ? "0" : getRequestString("type");
      String isPermit = getRequestString("isPermit");
      String name = getRequestString("name");
      if (type.equals("0"))
      {
        List<String> lstVehiIdno = new ArrayList();
        ActionContext ctx = ActionContext.getContext();
        ctx.getSession().put("permitVehicle", lstVehiIdno);
      }
      String companyid = getRequestString("companyid");
      StandardCompany company = (StandardCompany)this.deviceService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(companyid)));
      
      ActionContext ctx = ActionContext.getContext();
      
      List<String> lstVehiIdno = (List)ctx.getSession().get("permitVehicle");
      if (lstVehiIdno == null) {
        lstVehiIdno = new ArrayList();
      }
      AjaxDto<StandardVehicle> vehicleList = new AjaxDto();
      
      String condition = "";
      if (lstVehiIdno.size() > 0)
      {
        for (int i = 0; i < lstVehiIdno.size(); i++)
        {
          condition = condition + String.format(" '%s' ", new Object[] { lstVehiIdno.get(i) });
          if (i != lstVehiIdno.size() - 1) {
            condition = condition + ",";
          }
        }
        if ((isPermit != null) && (isPermit.equals("1"))) {
          condition = " and vehiIDNO in( " + condition + " ) ";
        } else {
          condition = " and vehiIDNO not in( " + condition + " ) ";
        }
        if ((name != null) && (!name.isEmpty())) {
          condition = condition + String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
        }
        vehicleList = getUserVehicles(company.getId(), null, condition, false, getPaginationEx());
      }
      else if ((isPermit == null) || (!isPermit.equals("1")))
      {
        if ((name != null) && (!name.isEmpty())) {
          condition = condition + String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
        }
        vehicleList = getUserVehicles(company.getId(), null, condition, false, getPaginationEx());
      }
      List<PartStandardInfo> partVehiPermits = new ArrayList();
      if (vehicleList.getPageList() != null)
      {
        List<StandardVehicle> vehicles = vehicleList.getPageList();
        for (int i = 0; i < vehicles.size(); i++)
        {
          PartStandardInfo info = new PartStandardInfo();
          StandardVehicle vehicle = (StandardVehicle)vehicles.get(i);
          info.setId(vehicle.getVehiIDNO());
          info.setName(vehicle.getVehiIDNO());
          info.setParentId(vehicle.getCompany().getId());
          partVehiPermits.add(info);
        }
      }
      addCustomResponse("infos", partVehiPermits);
      addCustomResponse("pagination", vehicleList.getPagination());
      addCustomResponse("permitCount", Integer.valueOf(lstVehiIdno.size()));
      String permitVehi = "";
      if (lstVehiIdno.size() > 0) {
        for (int i = 0; i < lstVehiIdno.size(); i++) {
          if (i != lstVehiIdno.size() - 1) {
            permitVehi = permitVehi + (String)lstVehiIdno.get(i) + ",";
          } else {
            permitVehi = permitVehi + (String)lstVehiIdno.get(i);
          }
        }
      }
      addCustomResponse("permitVehi", permitVehi);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String savePermitVehicles()
  {
    try
    {
      String isPermit = getRequestString("isPermit");
      StandardUserPermit userPermit = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
      String vehiIdnos = userPermit.getPermits();
      ActionContext ctx = ActionContext.getContext();
      
      List<String> lstVehiIdno = (List)ctx.getSession().get("permitVehicle");
      if (lstVehiIdno == null) {
        lstVehiIdno = new ArrayList();
      }
      if ((isPermit != null) && (isPermit.equals("0")))
      {
        if ((vehiIdnos != null) && (!vehiIdnos.isEmpty()))
        {
          String[] vehis = vehiIdnos.split(",");
          for (int i = 0; i < vehis.length; i++) {
            lstVehiIdno.add(vehis[i]);
          }
        }
      }
      else if ((vehiIdnos != null) && (!vehiIdnos.isEmpty()))
      {
        String[] vehis = vehiIdnos.split(",");
        for (int i = 0; i < vehis.length; i++) {
          if (lstVehiIdno.contains(vehis[i])) {
            lstVehiIdno.remove(vehis[i]);
          }
        }
      }
      ctx.getSession().put("permitVehicle", lstVehiIdno);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadCompanyDeviceList()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), false, false);
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
            if ((sim.getStatus() != null) && (sim.getStatus().intValue() != 0) && (
              (sim.getInstall() == null) || (
              (sim.getInstall() != null) && (sim.getInstall().intValue() == 0))))
            {
              PartStandardInfo info = new PartStandardInfo();
              info.setId(sim.getId().toString());
              info.setName(sim.getCardNum());
              info.setParentId(sim.getCompany().getId());
              partSims.add(info);
            }
          }
        }
        addCustomResponse("sims", partSims);
        
        AjaxDto<StandardDevice> deviceList = getDevices(userAccount.getCompany(), null, null);
        List<PartStandardInfo> partDevices = new ArrayList();
        if (deviceList.getPageList() != null)
        {
          List<StandardDevice> devices = deviceList.getPageList();
          for (int i = 0; i < devices.size(); i++)
          {
            StandardDevice device = (StandardDevice)devices.get(i);
            if ((device.getInstall() == null) || (device.getInstall().intValue() == 0))
            {
              PartStandardInfo info = new PartStandardInfo();
              info.setId(device.getId().toString());
              info.setName(device.getDevIDNO());
              info.setParentId(device.getCompany().getId());
              if (device.getSimInfo() != null) {
                info.setLevel(device.getSimInfo().getId());
              }
              partDevices.add(info);
            }
          }
        }
        addCustomResponse("devices", partDevices);
        
        AjaxDto<StandardDriver> drivers = getDrivers(null, null);
        List<PartStandardInfo> partDrivers = new ArrayList();
        if (drivers.getPageList() != null) {
          for (int i = 0; i < drivers.getPageList().size(); i++)
          {
            PartStandardInfo info = new PartStandardInfo();
            StandardDriver driver = (StandardDriver)drivers.getPageList().get(i);
            info.setId(driver.getId().toString());
            info.setName(driver.getName());
            info.setParentId(driver.getCompany().getId());
            partDrivers.add(info);
          }
        }
        addCustomResponse("drivers", partDrivers);
      }
      else
      {
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
  
  public String findVehicle()
  {
    try
    {
      String id = getRequestString("id");
      String type = getRequestString("type");
      if ((id != null) && (!id.isEmpty()))
      {
        StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(id)));
        if (vehicle == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
             if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            List<StandardVehiDevRelation> relations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
            addCustomResponse("relations", relations);
            addCustomResponse("vehicle", vehicle);
            if ((type != null) && (type.equals("edit")))
            {
              List<Integer> lstLevel = new ArrayList();
              lstLevel.add(Integer.valueOf(1));
              List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), false, false);
              List<PartStandardInfo> partCompanys = new ArrayList();
              for (int i = 0; i < companys.size(); i++)
              {
                PartStandardInfo info = new PartStandardInfo();
                company = (StandardCompany)companys.get(i);
                if ((company.getId() != null) && (company.getId().intValue() != -1))
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
  
  public String deleteVehicle()
  {
    try
    {
      String id = getRequestString("id");
      String deldev = getRequestString("deldev");
      if (((id == null) || (id.isEmpty())) && ((deldev == null) || (deldev.isEmpty())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if (!isRole("36"))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(id)));
        if (vehicle == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            List<StandardVehiDevRelation> deRelations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
            List<StandardVehiRule> delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null);
            String[] vehiIdnos = { vehicle.getVehiIDNO() };
            AjaxDto<StandardStorageRelation> relations = this.storageRelationService.getStoRelationList(null, vehiIdnos, null, null);
            if (deldev.equals("1")) {
              this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, true);
            } else {
              this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, false);
            }
            sendVehicleMsg(null, deRelations, null, null, vehicle.getVehiIDNO());
            addVehicleLog(Integer.valueOf(2), vehicle);
            this.notifyService.sendStandardInfoChange(3, 7, 0, vehicle.getVehiIDNO());
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
  
  public String deleteVehicles()
  {
    try
    {
      String ids = getRequestString("ids");
      String deldev = getRequestString("deldev");
      if (((ids == null) || (ids.isEmpty())) && ((deldev == null) || (deldev.isEmpty())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if (!isRole("36"))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String[] vehids = ids.split(",");
        for (int i = 0; i < vehids.length; i++)
        {
          StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(vehids[i])));
          if (vehicle != null)
          {
            StandardCompany company = vehicle.getCompany();
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
            {
              List<StandardVehiDevRelation> deRelations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
              List<StandardVehiRule> delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null);
              String[] vehiIdnos = { vehicle.getVehiIDNO() };
              AjaxDto<StandardStorageRelation> relations = this.storageRelationService.getStoRelationList(null, vehiIdnos, null, null);
              if (deldev.equals("1")) {
                this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, true);
              } else {
                this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, false);
              }
              sendVehicleMsg(null, deRelations, null, null, vehicle.getVehiIDNO());
              addVehicleLog(Integer.valueOf(2), vehicle);
              this.notifyService.sendStandardInfoChange(3, 7, 0, vehicle.getVehiIDNO());
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
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
  
  public String deleteVehicleAndDevice()
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if (!isRole("36"))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(id)));
        if (vehicle == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardCompany company = vehicle.getCompany();
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), company.getId())))
          {
            List<StandardVehiDevRelation> deRelations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
            
            List<StandardVehiRule> delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, vehicle.getVehiIDNO(), null);
            String[] vehiIdnos = { vehicle.getVehiIDNO() };
            AjaxDto<StandardStorageRelation> relations = this.storageRelationService.getStoRelationList(null, vehiIdnos, null, null);
            
            this.standardUserService.deleteVehicle(relations.getPageList(), deRelations, delRulePermits, vehicle, true);
            
            sendVehicleMsg(null, deRelations, null, null, vehicle.getVehiIDNO());
            addVehicleLog(Integer.valueOf(2), vehicle);
            this.notifyService.sendStandardInfoChange(3, 7, 0, vehicle.getVehiIDNO());
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
  
  public String addInfo()
  {
    try
    {
      String type = getRequestString("type");
      if (type == null) {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      } else if (type.equals("simInfo"))
      {
        if ((!isRole("34")) && (!isAdmin()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardSIMCardInfo simInfo = new StandardSIMCardInfo();
          simInfo = (StandardSIMCardInfo)AjaxUtils.getObject(getRequest(), simInfo.getClass());
          simInfo.setRegistrationTime(new Date());
          simInfo.setStatus(Integer.valueOf(1));
          if (isSIMExist(simInfo))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(49));
            return "success";
          }
          simInfo.setInstall(Integer.valueOf(0));
          simInfo = (StandardSIMCardInfo)this.standardUserService.save(simInfo);
          addCustomResponse("id", simInfo.getId());
          addCustomResponse("name", simInfo.getCardNum());
          this.notifyService.sendStandardInfoChange(1, 5, 0, simInfo.getCardNum());
          addUserLog(Integer.valueOf(18), Integer.valueOf(1), null, null, simInfo.getCardNum(), null, null);
        }
      }
      else if (type.equals("device"))
      {
        if ((!isRole("35")) && (!isAdmin()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardDevice device = new StandardDevice();
          device = (StandardDevice)AjaxUtils.getObject(getRequest(), device.getClass());
          device.setDevType(Integer.valueOf(5));
          if (isDeviceExist(device))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(39));
            return "success";
          }
          device.setDevIDNO(device.getDevIDNO().toLowerCase());
          device.setInstall(Integer.valueOf(0));
          device.setSerialID(device.getDevIDNO());
          if (!isAllowManageDevice) {
            if (isAdmin())
            {
              Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
              Integer manageCount = Integer.valueOf(registCount == null ? 0 : registCount.intValue());
              int deviceTotal = 0;
              List<StandardDevice> devices = this.standardUserService.getStandardDeviceList(null, null, null).getPageList();
              if (devices != null) {
                deviceTotal = devices.size();
              }
              int addCount = manageCount.intValue() - deviceTotal;
              if (addCount <= 0)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
                return "success";
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
              return "success";
            }
          }
          device = (StandardDevice)this.standardUserService.save(device);
          addCustomResponse("id", device.getId());
          addCustomResponse("name", device.getDevIDNO());
          this.notifyService.sendStandardInfoChange(2, 6, 0, device.getDevIDNO());
          addUserLog(Integer.valueOf(17), Integer.valueOf(1), null, null, device.getDevIDNO(), null, null);
        }
      }
      else if (type.equals("driver")) {
        if ((!isRole("37")) && (!isAdmin()))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
        }
        else
        {
          StandardDriver driver = new StandardDriver();
          driver = (StandardDriver)AjaxUtils.getObject(getRequest(), driver.getClass());
          if (isDriverExist(driver))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(48));
            return "success";
          }
          driver.setRushDate(new Date());
          driver.setValidity(new Date());
          driver = (StandardDriver)this.standardUserService.save(driver);
          addCustomResponse("id", driver.getId());
          addCustomResponse("name", driver.getJobNum());
          
          addUserLog(Integer.valueOf(15), Integer.valueOf(1), null, driver.getId().toString(), driver.getJobNum(), null, null);
          this.notifyService.sendStandardInfoChange(1, 8, 0, driver.getJobNum());
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
  
  public String quickNewVehicle()
  {
    try
    {
      if ((!isRole("36")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardVehicle vehicle = new StandardVehicle();
        vehicle = (StandardVehicle)AjaxUtils.getObject(getRequest(), vehicle.getClass());
        if ((vehicle.getCompany() == null) || (vehicle.getCompany().getId() == null)) {
          vehicle.setCompany(null);
        }
        if ((((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice() != null) && (((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevIDNO() != null) && (!((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevIDNO().isEmpty()))
        {
          Integer idnobf = ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getIdnobf();
          if (idnobf != null)
          {
            Integer idnobg = ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getIdnobg();
            String idno = ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevIDNO();
            StandardDevice new_device = ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice();
            String dev = new_device.getDevIDNO().toLowerCase();
            StandardVehicle vehicle2 = null;
            StandardDevice newdevice = null;
            Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
            int manageCount = registCount == null ? 0 : registCount.intValue();
            int deviceTotal = 0;
            List<StandardDevice> devices = this.standardUserService.getStandardDeviceList(null, null, null).getPageList();
            if (devices != null) {
              deviceTotal = devices.size();
            }
            int addCount = manageCount - deviceTotal - idnobg.intValue() + idnobf.intValue() - 1;
            if (addCount < 0)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
              return "success";
            }
            for (int i = idnobf.intValue(); i <= idnobg.intValue(); i++)
            {
              vehicle2 = new StandardVehicle();
              ObjectUtil.copeField(vehicle, vehicle2);
              vehicle2.setVehiIDNO(idno + doDevIdnoUtil(i));
              StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, dev + doDevIdnoUtil(i));
              if (device == null)
              {
                newdevice = new StandardDevice();
                newdevice.setDevIDNO(dev + doDevIdnoUtil(i));
                newdevice.setInstall(Integer.valueOf(0));
                
                newdevice.setDevType(new_device.getDevType());
                newdevice.setCompany(vehicle.getCompany());
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setDevice(newdevice);
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setVehicle(vehicle2);
                this.standardUserService.save(newdevice);
                newdevice = null;
              }
              else
              {
                if (device.getInstall().intValue() == 1) {
                  continue;
                }
                device.setCompany(vehicle.getCompany());
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setDevice(device);
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setVehicle(vehicle2);
              }
              if (isExist(vehicle2))
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
              }
              else
              {
                vehicle2.setPlateType(Integer.valueOf(2));
                vehicle2.setStatus(Integer.valueOf(0));
                vehicle2.setPayBegin(new Date());
                vehicle2.setStlTm(new Date());
                this.standardUserService.save(vehicle2);
                device = ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).getDevice();
                device.setInstall(Integer.valueOf(1));
                device.setStlTm(new Date());
                this.standardUserService.save(device);
                StandardVehicle newVehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehicle2.getVehiIDNO());
                boolean flag = true;
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setMainDev(Integer.valueOf(1));
                ((StandardVehiDevRelation)vehicle2.getRelations().get(0)).setId(null);
                if (flag) {
                  this.standardUserService.mergeVehicle(vehicle2.getRelations(), null, null, null);
                }
                String userid = getRequestString("userid");
                if ((userid != null) && (!userid.isEmpty()))
                {
                  String[] uids = userid.split(",");
                  for (int j = 0; j < uids.length; j++)
                  {
                    int userId = Integer.parseInt(uids[j]);
                    StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
                    permit.setUserId(Integer.valueOf(userId));
                    permit.setVehiIdno(newVehicle.getVehiIDNO());
                    this.standardUserService.save(permit);
                  }
                }
                if (flag) {
                  sendVehicleMsg(vehicle2.getRelations(), null, null, newVehicle.getVehiIDNO(), null);
                }
                addVehicleLog(Integer.valueOf(4), vehicle2);
                this.notifyService.sendStandardInfoChange(1, 7, 0, vehicle2.getVehiIDNO());
                vehicle2 = null;
              }
            }
          }
          else
          {
            StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevIDNO().toLowerCase());
            if (device == null)
            {
              Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
              int manageCount = registCount == null ? 0 : registCount.intValue();
              int deviceTotal = 0;
              List<StandardDevice> devices = this.standardUserService.getStandardDeviceList(null, null, null).getPageList();
              if (devices != null) {
                deviceTotal = devices.size();
              }
              int addCount = manageCount - deviceTotal;
              if (addCount <= 0)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
                return "success";
              }
              StandardDevice newdevice = new StandardDevice();
              newdevice.setDevIDNO(((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevIDNO().toLowerCase());
              newdevice.setInstall(Integer.valueOf(0));
              
              newdevice.setDevType(((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice().getDevType());
              newdevice.setCompany(vehicle.getCompany());
              ((StandardVehiDevRelation)vehicle.getRelations().get(0)).setDevice(newdevice);
              ((StandardVehiDevRelation)vehicle.getRelations().get(0)).setVehicle(vehicle);
              this.standardUserService.save(newdevice);
            }
            else
            {
              if (device.getInstall().intValue() == 1)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(54));
                return "success";
              }
              device.setCompany(vehicle.getCompany());
              ((StandardVehiDevRelation)vehicle.getRelations().get(0)).setDevice(device);
              ((StandardVehiDevRelation)vehicle.getRelations().get(0)).setVehicle(vehicle);
            }
            if (isExist(vehicle))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
            }
            else
            {
              vehicle.setPlateType(Integer.valueOf(2));
              vehicle.setStatus(Integer.valueOf(0));
              vehicle.setPayBegin(new Date());
              vehicle.setStlTm(new Date());
              this.standardUserService.save(vehicle);
              device = ((StandardVehiDevRelation)vehicle.getRelations().get(0)).getDevice();
              device.setInstall(Integer.valueOf(1));
              device.setStlTm(new Date());
              this.standardUserService.save(device);
              StandardVehicle newVehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehicle.getVehiIDNO());
              boolean flag = true;
              ((StandardVehiDevRelation)vehicle.getRelations().get(0)).setMainDev(Integer.valueOf(1));
              if (flag) {
                this.standardUserService.mergeVehicle(vehicle.getRelations(), null, null, null);
              }
              String userid = getRequestString("userid");
              if ((userid != null) && (!userid.isEmpty()))
              {
                String[] uids = userid.split(",");
                for (int i = 0; i < uids.length; i++)
                {
                  int userId = Integer.parseInt(uids[i]);
                  StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
                  permit.setUserId(Integer.valueOf(userId));
                  permit.setVehiIdno(newVehicle.getVehiIDNO());
                  this.standardUserService.save(permit);
                }
              }
              if (flag) {
                sendVehicleMsg(vehicle.getRelations(), null, null, newVehicle.getVehiIDNO(), null);
              }
              addVehicleLog(Integer.valueOf(4), vehicle);
              this.notifyService.sendStandardInfoChange(1, 7, 0, vehicle.getVehiIDNO());
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
          return "success";
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
  
  public String mergeVehicleNew()
  {
    try
    {
      if ((!isRole("36")) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StandardVehicle vehicle = new StandardVehicle();
        vehicle = (StandardVehicle)AjaxUtils.getObject(getRequest(), vehicle.getClass());
        if ((vehicle.getCompany() == null) || (vehicle.getCompany().getId() == null)) {
          vehicle.setCompany(null);
        }
        List<StandardVehiDevRelation> old_relations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
        List<StandardVehiDevRelation> new_relations = vehicle.getRelations();
        List<StandardVehiDevRelation> del_relations = new ArrayList();
        List<StandardSIMCardInfo> delSimInfos = new ArrayList();
        List<StandardDevice> delDevices = new ArrayList();
        if (old_relations != null)
        {
          delSimInfos = changeSimInfosNew(new_relations, old_relations);
          delDevices = changeDevicesNew(new_relations, old_relations);
          for (int i = 0; i < old_relations.size(); i++)
          {
            boolean del = true;
            for (int j = 0; j < new_relations.size(); j++)
            {
              StandardVehiDevRelation relation = (StandardVehiDevRelation)new_relations.get(j);
              if ((relation.getId() != null) && (relation.getId().equals(((StandardVehiDevRelation)old_relations.get(i)).getId()))) {
                del = false;
              }
            }
            if (del) {
              del_relations.add((StandardVehiDevRelation)old_relations.get(i));
            }
          }
        }
        for (int j = 0; j < new_relations.size(); j++)
        {
          StandardVehiDevRelation relation = (StandardVehiDevRelation)new_relations.get(j);
          if ((relation.getDevice() != null) && (relation.getDevice().getDevIDNO() != null) && (!relation.getDevice().getDevIDNO().isEmpty()))
          {
            StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, relation.getDevice().getDevIDNO());
            if ((relation.getDevice().getSimInfo() != null) && (relation.getDevice().getSimInfo().getCardNum() != null) && 
              (!relation.getDevice().getSimInfo().getCardNum().isEmpty()))
            {
              StandardSIMCardInfo simInfo = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, relation.getDevice().getSimInfo().getCardNum());
              simInfo.setInstall(Integer.valueOf(1));
              simInfo.setCompany(vehicle.getCompany());
              device.setSimInfo(simInfo);
            }
            device.setStlTm(new Date());
            device.setInstall(Integer.valueOf(1));
            device.setCompany(vehicle.getCompany());
            relation.setDevice(device);
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
            return "success";
          }
        }
        if ((vehicle.getDriver() == null) || (vehicle.getDriver().getId() == null))
        {
          vehicle.setDriver(null);
        }
        else
        {
          StandardDriver driver = (StandardDriver)this.standardUserService.getObject(StandardDriver.class, vehicle.getDriver().getId());
          driver.setCompany(vehicle.getCompany());
          vehicle.setDriver(driver);
        }
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if (vehicle.getId() != null)
        {
          StandardVehicle oldVehicle = this.standardUserService.getStandardVehicle(vehicle.getId());
          if (oldVehicle == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            if ((oldVehicle.getCompany().getLevel().intValue() == 2) && (oldVehicle.getCompany().getCompanyId().intValue() == vehicle.getCompany().getId().intValue())) {
              vehicle.setCompany(oldVehicle.getCompany());
            }
            List<StandardUserVehiPermitEx> delPermits = delUserVehiPermit(oldVehicle, vehicle.getCompany());
            
            boolean delRule = true;
            if (oldVehicle.getCompany().getId().equals(vehicle.getCompany().getId())) {
              delRule = false;
            }
            if ((!oldVehicle.getVehiIDNO().equals(vehicle.getVehiIDNO())) || (oldVehicle.getVehiIDNO() != vehicle.getVehiIDNO())) {
              this.standardUserService.updateVehicle(oldVehicle.getId().intValue(), vehicle.getVehiIDNO());
            }
            List<StandardVehicle> vehicleList = new ArrayList();
            vehicleList.add(vehicle);
            List<StandardVehiRule> delRulePermits = new ArrayList();
            if (delRule) {
              delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, oldVehicle.getVehiIDNO(), null);
            }
            this.standardUserService.updateVehicle(vehicleList, delPermits, delRulePermits);
            
            boolean flag = true;
            for (int j = 0; j < new_relations.size(); j++)
            {
              StandardVehiDevRelation relation = (StandardVehiDevRelation)new_relations.get(j);
              if (j == 0) {
                relation.setMainDev(Integer.valueOf(1));
              } else {
                relation.setMainDev(Integer.valueOf(0));
              }
              relation.setVehicle(vehicle);
              if (relation.getDevice() == null) {
                flag = false;
              }
              StandardDevice device = relation.getDevice();
              for (int k = 0; k < del_relations.size(); k++) {
                if ((device.getDevIDNO() != null) && (!device.getDevIDNO().isEmpty()) && 
                  (device.getDevIDNO().equals(((StandardVehiDevRelation)del_relations.get(k)).getDevice().getDevIDNO())))
                {
                  Integer oldId = relation.getId();
                  relation.setId(((StandardVehiDevRelation)del_relations.get(k)).getId());
                  if (oldId == null)
                  {
                    del_relations.remove(k);
                    break;
                  }
                  ((StandardVehiDevRelation)del_relations.get(k)).setId(oldId);
                  
                  break;
                }
              }
            }
            if (flag)
            {
              this.standardUserService.mergeVehicle(new_relations, del_relations, delSimInfos, delDevices);
              sendVehicleMsg(new_relations, null, delDevices, vehicle.getVehiIDNO(), null);
            }
            addVehicleLog(Integer.valueOf(1), vehicle);
            this.notifyService.sendStandardInfoChange(2, 7, 0, vehicle.getVehiIDNO());
          }
        }
        else if (isExist(vehicle))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
        }
        else
        {
          this.standardUserService.save(vehicle);
          StandardVehicle newVehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehicle.getVehiIDNO());
          
          boolean flag = true;
          for (int i = 0; i < new_relations.size(); i++)
          {
            if (i == 0) {
              ((StandardVehiDevRelation)new_relations.get(i)).setMainDev(Integer.valueOf(1));
            } else {
              ((StandardVehiDevRelation)new_relations.get(i)).setMainDev(Integer.valueOf(0));
            }
            ((StandardVehiDevRelation)new_relations.get(i)).setVehicle(newVehicle);
            if (((StandardVehiDevRelation)new_relations.get(i)).getDevice() == null) {
              flag = false;
            }
          }
          if (flag) {
            this.standardUserService.mergeVehicle(new_relations, del_relations, delSimInfos, delDevices);
          }
          if (!isAdmin())
          {
            StandardUserVehiPermitEx permit = new StandardUserVehiPermitEx();
            permit.setUserId(userAccount.getId());
            permit.setVehiIdno(newVehicle.getVehiIDNO());
            this.standardUserService.save(permit);
          }
          if (flag) {
            sendVehicleMsg(new_relations, del_relations, null, vehicle.getVehiIDNO(), null);
          }
          addVehicleLog(Integer.valueOf(4), vehicle);
          this.notifyService.sendStandardInfoChange(1, 7, 0, vehicle.getVehiIDNO());
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
  
  public String exitVehiCompany()
  {
    try
    {
      String vehiIds = getRequestString("vehiIds");
      if ((vehiIds == null) || (vehiIds.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if (!isRole("36"))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        StringBuffer buffVehiIdno = new StringBuffer();
        String[] vehids = vehiIds.split(",");
        StandardVehicle vehi = new StandardVehicle();
        vehi = (StandardVehicle)AjaxUtils.getObject(getRequest(), vehi.getClass());
        if ((vehi.getCompany() == null) || (vehi.getCompany().getId() == null)) {
          vehi.setCompany(null);
        }
        boolean flag = false;
        for (int i = 0; i < vehids.length; i++)
        {
          StandardVehicle vehicle = this.standardUserService.getStandardVehicle(Integer.valueOf(Integer.parseInt(vehids[i])));
          vehicle.setCompany(vehi.getCompany());
          if (vehicle != null)
          {
            if (buffVehiIdno.length() > 0) {
              buffVehiIdno.append(",");
            }
            buffVehiIdno.append(vehicle.getVehiIDNO());
            
            List<StandardVehiDevRelation> relations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
            for (int j = 0; j < relations.size(); j++)
            {
              StandardVehiDevRelation relation = (StandardVehiDevRelation)relations.get(j);
              if ((relation.getDevice() != null) && (relation.getDevice().getDevIDNO() != null) && (!relation.getDevice().getDevIDNO().isEmpty()))
              {
                StandardDevice device = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, relation.getDevice().getDevIDNO());
                if ((relation.getDevice().getSimInfo() != null) && (relation.getDevice().getSimInfo().getCardNum() != null) && 
                  (!relation.getDevice().getSimInfo().getCardNum().isEmpty()))
                {
                  StandardSIMCardInfo simInfo = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, relation.getDevice().getSimInfo().getCardNum());
                  simInfo.setCompany(vehi.getCompany());
                  device.setSimInfo(simInfo);
                }
                device.setCompany(vehi.getCompany());
                relation.setDevice(device);
              }
              else
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
                return "success";
              }
            }
            if ((vehicle.getDriver() == null) || (vehicle.getDriver().getId() == null))
            {
              vehicle.setDriver(null);
            }
            else
            {
              StandardDriver driver = (StandardDriver)this.standardUserService.getObject(StandardDriver.class, vehicle.getDriver().getId());
              driver.setCompany(vehi.getCompany());
              vehicle.setDriver(driver);
            }
            if (vehicle.getId() != null)
            {
              StandardVehicle oldVehicle = this.standardUserService.getStandardVehicle(vehicle.getId());
              if (oldVehicle == null)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
              }
              else
              {
                List<StandardUserVehiPermitEx> delPermits = delUserVehiPermit(oldVehicle, vehicle.getCompany());
                
                boolean delRule = true;
                if (oldVehicle.getCompany().getId().equals(vehicle.getCompany().getId())) {
                  delRule = false;
                }
                if ((!oldVehicle.getVehiIDNO().equals(vehicle.getVehiIDNO())) || (oldVehicle.getVehiIDNO() != vehicle.getVehiIDNO())) {
                  this.standardUserService.updateVehicle(oldVehicle.getId().intValue(), vehicle.getVehiIDNO());
                }
                List<StandardVehicle> vehicleList = new ArrayList();
                vehicleList.add(vehicle);
                List<StandardVehiRule> delRulePermits = new ArrayList();
                if (delRule) {
                  delRulePermits = this.vehicleRuleService.getStandardVehiRulePermit(null, oldVehicle.getVehiIDNO(), null);
                }
                this.standardUserService.updateVehicle(vehicleList, delPermits, delRulePermits);
                addVehicleLog(Integer.valueOf(1), vehicle);
                this.notifyService.sendStandardInfoChange(2, 7, 0, vehicle.getVehiIDNO());
                
                flag = true;
              }
            }
          }
        }
        if (flag) {
          doVehicleChange(true, buffVehiIdno.toString(), null);
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
  
  protected void sendVehicleMsg(List<StandardVehiDevRelation> addrelations, List<StandardVehiDevRelation> del_relations, List<StandardDevice> delDevices, String upVehiIdnos, String delVehiIdnos)
  {
    if (addrelations != null) {
      for (int j = 0; j < addrelations.size(); j++)
      {
        StandardVehiDevRelation relation = (StandardVehiDevRelation)addrelations.get(j);
        StandardDevice device = relation.getDevice();
        if (device.getId() == null)
        {
          this.notifyService.sendStandardInfoChange(2, 6, 0, device.getDevIDNO());
          addUserLog(Integer.valueOf(17), Integer.valueOf(1), null, null, device.getDevIDNO(), null, null);
        }
        if (device.getSimInfo() != null)
        {
          StandardSIMCardInfo simInfo = device.getSimInfo();
          if (simInfo.getId() == null)
          {
            this.notifyService.sendStandardInfoChange(1, 5, 0, simInfo.getCardNum());
            addUserLog(Integer.valueOf(18), Integer.valueOf(1), null, null, simInfo.getCardNum(), null, null);
          }
        }
        this.notifyService.sendStandardInfoChange(1, 11, 0, device.getDevIDNO());
      }
    }
    if (del_relations != null) {
      for (int j = 0; j < del_relations.size(); j++) {
        this.notifyService.sendStandardInfoChange(3, 11, 0, ((StandardVehiDevRelation)del_relations.get(j)).getDevice().getDevIDNO());
      }
    }
    if (delDevices != null) {
      for (int j = 0; j < delDevices.size(); j++) {
        this.notifyService.sendStandardInfoChange(3, 11, 0, ((StandardDevice)delDevices.get(j)).getDevIDNO());
      }
    }
    doVehicleChange(true, upVehiIdnos, delVehiIdnos);
  }
  
  private boolean isExist(StandardVehicle vehicle)
  {
    StandardVehicle oldVehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehicle.getVehiIDNO());
    if ((oldVehicle == null) || ((vehicle.getId() != null) && (oldVehicle.getId().equals(vehicle.getId())))) {
      return false;
    }
    return true;
  }
  
  public String getUsers()
  {
    String companyid = getRequestString("companyid");
    List<Integer> lstId = new ArrayList();
    lstId.add(Integer.valueOf(Integer.parseInt(companyid)));
    AjaxDto<StandardUserAccount> users = this.standardUserService.getStandardUserList(lstId, null, null, null);
    addCustomResponse("users", users.getPageList());
    return "success";
  }
  
  protected void addVehicleLog(Integer subType, StandardVehicle vehicle)
  {
    addUserLog(Integer.valueOf(6), subType, vehicle.getVehiIDNO(), null, null, null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      genVehicleData(sheet);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected void genVehicleData(HSSFSheet sheet)
  {
    if (!isImport())
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      AjaxDto<StandardVehicle> ajaxDto = getUserVehicles(company.getId(), null, null, isAdmin(), null);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardVehicle vehicle = (StandardVehicle)ajaxDto.getPageList().get(i - 1);
          HSSFRow row = sheet.createRow(1 + i);
          int j = 0;
          
          HSSFCell cell = row.createCell(j++);
          cell.setCellValue(i);
          
          cell = row.createCell(j++);
          cell.setCellValue(vehicle.getVehiIDNO());
          
          cell = row.createCell(j++);
          if (vehicle.getCompany().getLevel().intValue() == 1)
          {
            cell.setCellValue(vehicle.getCompany().getName());
          }
          else
          {
            StandardCompany com = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, vehicle.getCompany().getCompanyId());
            cell.setCellValue(com.getName());
          }
          cell = row.createCell(j++);
          Integer type = vehicle.getPlateType();
          if (type.intValue() == 1) {
            cell.setCellValue(getText("vehicle.plateType.blue"));
          } else if (type.intValue() == 2) {
            cell.setCellValue(getText("vehicle.plateType.yellow"));
          } else if (type.intValue() == 3) {
            cell.setCellValue(getText("vehicle.plateType.black"));
          } else if (type.intValue() == 4) {
            cell.setCellValue(getText("vehicle.plateType.white"));
          } else if (type.intValue() == 0) {
            cell.setCellValue(getText("vehicle.plateType.other"));
          }
          StandardDriver driver = vehicle.getDriver();
          if (driver != null)
          {
            cell = row.createCell(j++);
            cell.setCellValue(driver.getJobNum());
            
            cell = row.createCell(j++);
            cell.setCellValue(driver.getContact());
          }
          else
          {
            cell = row.createCell(j++);
            cell.setCellValue("");
            cell = row.createCell(j++);
            cell.setCellValue("");
          }
          cell = row.createCell(j++);
          cell.setCellValue(vehicle.getChnCount().intValue());
          cell = row.createCell(j++);
          cell.setCellValue(DateUtil.dateSwitchString(vehicle.getStlTm()));
          cell = row.createCell(j++);
          if (vehicle.getPayPeriod() != null) {
            cell.setCellValue(DateUtil.dateSwitchDateString(DateUtil.dateIncrease(vehicle.getPayBegin(), vehicle.getPayPeriod(), null)));
          } else {
            cell.setCellValue("");
          }
          List<StandardVehiDevRelation> relations = this.standardUserService.getStandardVehiDevRelationList(vehicle.getVehiIDNO(), null);
          if ((relations != null) && (relations.size() > 0)) {
            for (int k = 0; k < relations.size(); k++)
            {
              StandardDevice device = ((StandardVehiDevRelation)relations.get(k)).getDevice();
              
              cell = row.createCell(j++);
              cell.setCellValue(device.getDevIDNO());
              
              cell = row.createCell(j++);
              if ((((StandardVehiDevRelation)relations.get(k)).getModule().intValue() >> 0 & 0x1) <= 0) {
                cell.setCellValue(getText("vehicle.devType.Gps"));
              } else if ((((StandardVehiDevRelation)relations.get(k)).getModule().intValue() >> 0 & 0x1) >= 0) {
                cell.setCellValue(getText("vehicle.devType.video"));
              } else {
                cell.setCellValue("");
              }
              if (device.getSimInfo() != null)
              {
                cell = row.createCell(j++);
                cell.setCellValue(device.getSimInfo().getCardNum());
              }
              else
              {
                cell = row.createCell(j++);
                cell.setCellValue("");
              }
            }
          }
        }
      }
    }
  }
  
  protected boolean isImport()
  {
    String type = getRequest().getParameter("type");
    return (type != null) && (type.equals("import"));
  }
  
  protected String genExcelTitle()
  {
    if (!isImport())
    {
      String curDate = DateUtil.dateSwitchString(new Date());
      curDate.replace(':', '-');
      return getText("vehicle.title") + " - " + curDate;
    }
    return getText("vehicle.download.template");
  }
  
  protected String[] genExcelHeads()
  {
    if (isImport())
    {
      String[] heads = new String[13];
      int j = 0;
      heads[(j++)] = getText("report.index");
      heads[(j++)] = getText("vehicle.vehiIDNO");
      heads[(j++)] = getText("vehicle.company");
      heads[(j++)] = getText("vehicle.plateType");
      heads[(j++)] = getText("vehicle.driver");
      heads[(j++)] = getText("vehicle.driverTelephone");
      heads[(j++)] = getText("vehicle.relation.chnAttr");
      heads[(j++)] = getText("vehicle.device1.devIDNO");
      heads[(j++)] = getText("vehicle.device1.devType");
      heads[(j++)] = getText("vehicle.device1.SIM");
      heads[(j++)] = getText("vehicle.device2.devIDNO");
      heads[(j++)] = getText("vehicle.device2.devType");
      heads[(j++)] = getText("vehicle.device2.SIM");
      return heads;
    }
    String[] heads = new String[15];
    int j = 0;
    heads[(j++)] = getText("report.index");
    heads[(j++)] = getText("vehicle.vehiIDNO");
    heads[(j++)] = getText("vehicle.company");
    heads[(j++)] = getText("vehicle.plateType");
    heads[(j++)] = getText("vehicle.driver");
    heads[(j++)] = getText("vehicle.driverTelephone");
    heads[(j++)] = getText("vehicle.relation.chnAttr");
    heads[(j++)] = getText("vehicle.install.time");
    heads[(j++)] = getText("vehicle.service.endtime");
    heads[(j++)] = getText("vehicle.device1.devIDNO");
    heads[(j++)] = getText("vehicle.device1.devType");
    heads[(j++)] = getText("vehicle.device1.SIM");
    heads[(j++)] = getText("vehicle.device2.devIDNO");
    heads[(j++)] = getText("vehicle.device2.devType");
    heads[(j++)] = getText("vehicle.device2.SIM");
    return heads;
  }
  
  public String importExcel()
    throws Exception
  {
    try
    {
      FileInputStream is = new FileInputStream(this.uploadFile);
      HSSFWorkbook wbs = new HSSFWorkbook(is);
      HSSFSheet childSheet = wbs.getSheetAt(0);
      List<UserAccount> failedAccount = new ArrayList();
      StringBuffer buffVehiIdno = new StringBuffer();
      for (int i = 2; i < childSheet.getLastRowNum() + 1; i++)
      {
        HSSFRow row = childSheet.getRow(i);
        if (row != null)
        {
          int j = 0;
          
          j++;
          
          String veIDNO = getExcelCellString(row, j++);
          if ((veIDNO != null) && (!veIDNO.isEmpty()))
          {
            String vehiIDNO = "";
            if (veIDNO.indexOf(".") == -1) {
              vehiIDNO = veIDNO;
            } else {
              vehiIDNO = veIDNO.substring(0, veIDNO.indexOf("."));
            }
            if (buffVehiIdno.length() > 0) {
              buffVehiIdno.append(",");
            }
            buffVehiIdno.append(vehiIDNO);
            
            String comName = getExcelCellString(row, j++);
            if ((comName != null) && (!comName.isEmpty()))
            {
              StandardCompany company = this.standardUserService.getStandardCompany(comName);
              if (company != null)
              {
                StandardVehicle vehicle = (StandardVehicle)this.standardUserService.getObject(StandardVehicle.class, vehiIDNO);
                if (vehicle == null)
                {
                  StandardVehicle new_vehicle = new StandardVehicle();
                  new_vehicle.setCompany(company);
                  new_vehicle.setVehiIDNO(vehiIDNO);
                  String color = getExcelCellString(row, j++);
                  if ((color != "") && (color.equals(getText("vehicle.plateType.blue")))) {
                    new_vehicle.setPlateType(Integer.valueOf(1));
                  } else if ((color != "") && (color.equals(getText("vehicle.plateType.yellow")))) {
                    new_vehicle.setPlateType(Integer.valueOf(2));
                  } else if ((color != "") && (color.equals(getText("vehicle.plateType.black")))) {
                    new_vehicle.setPlateType(Integer.valueOf(3));
                  } else if ((color != "") && (color.equals(getText("vehicle.plateType.white")))) {
                    new_vehicle.setPlateType(Integer.valueOf(4));
                  } else if ((color != "") && (color.equals(getText("vehicle.plateType.other")))) {
                    new_vehicle.setPlateType(Integer.valueOf(0));
                  }
                  String jobNum = getExcelCellString(row, j++);
                  String phone = getExcelCellString(row, j++);
                  if ((jobNum != null) && (!jobNum.isEmpty()))
                  {
                    StandardDriver driver = this.standardUserService.getStandardDriver(jobNum);
                    if (driver != null)
                    {
                      if ((phone != null) && (!phone.isEmpty()))
                      {
                        String contact = "";
                        if (phone.indexOf(".") == -1) {
                          contact = phone;
                        } else {
                          contact = phone.substring(0, phone.indexOf("."));
                        }
                        driver.setContact(contact);
                      }
                      new_vehicle.setDriver(driver);
                    }
                  }
                  String chn = getExcelCellString(row, j++);
                  String chnAt = "";
                  if (chn.indexOf(".") == -1) {
                    chnAt = chn;
                  } else {
                    chnAt = chn.substring(0, chn.indexOf("."));
                  }
                  String chnName = "";
                  String chnAttr = "";
                  for (int k = 1; k < Integer.parseInt(chnAt) + 1; k++)
                  {
                    chnName = chnName + "CH" + k;
                    chnAttr = chnAttr + k;
                    if (k != Integer.parseInt(chnAt))
                    {
                      chnName = chnName + ",";
                      chnAttr = chnAttr + ",";
                    }
                  }
                  new_vehicle.setChnCount(Integer.valueOf(Integer.parseInt(chnAt)));
                  new_vehicle.setChnName(chnName);
                  String deIDNO1 = getExcelCellString(row, j++);
                  String devType1 = getExcelCellString(row, j++);
                  String SIM1 = getExcelCellString(row, j++);
                  String deIDNO2 = getExcelCellString(row, j++);
                  String devType2 = getExcelCellString(row, j++);
                  String SIM2 = getExcelCellString(row, j++);
                  if ((deIDNO1 != null) && (!deIDNO1.isEmpty()))
                  {
                    String devIDNO1 = "";
                    if (deIDNO1.indexOf(".") == -1) {
                      devIDNO1 = deIDNO1;
                    } else {
                      devIDNO1 = deIDNO1.substring(0, deIDNO1.indexOf("."));
                    }
                    StandardDevice device1 = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devIDNO1.toLowerCase());
                    if ((device1 != null) && (device1.getInstall().intValue() == 1)) {
                      continue;
                    }
                    StandardSIMCardInfo new_sim1 = new StandardSIMCardInfo();
                    if ((SIM1 != null) && (!SIM1.isEmpty()))
                    {
                      String Sim1 = "";
                      if (SIM1.indexOf(".") == -1) {
                        Sim1 = SIM1;
                      } else {
                        Sim1 = SIM1.substring(0, SIM1.indexOf("."));
                      }
                      StandardSIMCardInfo sim1 = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, Sim1);
                      if ((sim1 != null) && (sim1.getInstall().intValue() == 1)) {
                        continue;
                      }
                      if (sim1 == null)
                      {
                        new_sim1.setCardNum(Sim1);
                        new_sim1.setRegistrationTime(new Date());
                      }
                      else
                      {
                        new_sim1 = sim1;
                      }
                      new_sim1.setCompany(company);
                      new_sim1.setStatus(Integer.valueOf(1));
                      new_sim1.setInstall(Integer.valueOf(1));
                    }
                    else
                    {
                      new_sim1 = null;
                    }
                    if ((deIDNO2 != null) && (!deIDNO2.isEmpty()))
                    {
                      String devIDNO2 = "";
                      if (deIDNO2.indexOf(".") == -1) {
                        devIDNO2 = deIDNO2;
                      } else {
                        devIDNO2 = deIDNO2.substring(0, deIDNO2.indexOf("."));
                      }
                      StandardDevice device2 = (StandardDevice)this.standardUserService.getObject(StandardDevice.class, devIDNO2.toLowerCase());
                      if ((device2 != null) && (device2.getInstall().intValue() == 1)) {
                        continue;
                      }
                      List<StandardVehiDevRelation> relations = new ArrayList();
                      StandardVehiDevRelation relation1 = new StandardVehiDevRelation();
                      StandardVehiDevRelation relation2 = new StandardVehiDevRelation();
                      StandardSIMCardInfo new_sim2 = new StandardSIMCardInfo();
                      if ((SIM2 != null) && (!SIM2.isEmpty()))
                      {
                        String Sim2 = "";
                        if (SIM2.indexOf(".") == -1) {
                          Sim2 = SIM2;
                        } else {
                          Sim2 = SIM2.substring(0, SIM2.indexOf("."));
                        }
                        StandardSIMCardInfo sim2 = (StandardSIMCardInfo)this.standardUserService.getObject(StandardSIMCardInfo.class, Sim2);
                        if ((sim2 != null) && (sim2.getInstall().intValue() == 1)) {
                          continue;
                        }
                        if (sim2 == null)
                        {
                          new_sim2.setCardNum(Sim2);
                          new_sim2.setRegistrationTime(new Date());
                        }
                        else
                        {
                          new_sim2 = sim2;
                        }
                        new_sim2.setCompany(company);
                        new_sim2.setStatus(Integer.valueOf(1));
                        new_sim2.setInstall(Integer.valueOf(1));
                      }
                      else
                      {
                        new_sim2 = null;
                      }
                      StandardDevice new_device1 = new StandardDevice();
                      StandardDevice new_device2 = new StandardDevice();
                      if ((device1 == null) && (device2 == null))
                      {
                        Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
                        int manageCount = registCount == null ? 0 : registCount.intValue();
                        int deviceTotal = 0;
                        List<StandardDevice> devices = this.standardUserService.getStandardDeviceList(null, null, null).getPageList();
                        if (devices != null) {
                          deviceTotal = devices.size();
                        }
                        int addCount = manageCount - deviceTotal - 1;
                        if (addCount <= 0)
                        {
                          addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
                          return "success";
                        }
                        new_device1.setDevIDNO(devIDNO1.toLowerCase());
                        new_device1.setInstall(Integer.valueOf(1));
                        new_device1.setStlTm(new Date());
                        if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else
                        {
                          new_device1.setDevType(Integer.valueOf(7));
                          relation1.setModule(Integer.valueOf(361));
                        }
                        new_device1.setCompany(company);
                        new_device1.setSimInfo(new_sim1);
                        new_device2.setDevIDNO(devIDNO2.toLowerCase());
                        new_device2.setInstall(Integer.valueOf(1));
                        new_device2.setStlTm(new Date());
                        if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device2.setDevType(Integer.valueOf(5));
                          relation2.setModule(Integer.valueOf(40));
                        }
                        else if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.video"))))
                        {
                          new_device2.setDevType(Integer.valueOf(7));
                          relation2.setModule(Integer.valueOf(361));
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else if (new_device1.getDevType().intValue() == 5)
                        {
                          new_device2.setDevType(Integer.valueOf(7));
                          relation2.setModule(Integer.valueOf(361));
                        }
                        else
                        {
                          new_device2.setDevType(Integer.valueOf(5));
                          relation2.setModule(Integer.valueOf(40));
                        }
                        new_device2.setCompany(company);
                        new_device2.setSimInfo(new_sim2);
                        if (new_sim1 != null) {
                          this.standardUserService.save(new_sim1);
                        }
                        if (new_sim2 != null) {
                          this.standardUserService.save(new_sim2);
                        }
                        this.standardUserService.save(new_device1);
                        this.standardUserService.save(new_device2);
                        relation1.setDevice(new_device1);
                        relation1.setChnAttr(chnAttr);
                        relation1.setVehicle(new_vehicle);
                        relation1.setMainDev(Integer.valueOf(1));
                        relation2.setDevice(new_device2);
                        relation2.setVehicle(new_vehicle);
                        relations.add(relation1);
                        relations.add(relation2);
                        new_vehicle.setRelations(relations);
                      }
                      else if ((device1 == null) || (device2 == null))
                      {
                        Integer registCount = Integer.valueOf(this.deviceService.getRegistCount());
                        int manageCount = registCount == null ? 0 : registCount.intValue();
                        int deviceTotal = 0;
                        List<StandardDevice> devices = this.standardUserService.getStandardDeviceList(null, null, null).getPageList();
                        if (devices != null) {
                          deviceTotal = devices.size();
                        }
                        int addCount = manageCount - deviceTotal;
                        if (addCount <= 0)
                        {
                          addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
                          return "success";
                        }
                        if (device1 == null)
                        {
                          new_device1.setDevIDNO(devIDNO1.toLowerCase());
                          new_device1.setInstall(Integer.valueOf(1));
                          if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                          {
                            new_device1.setDevType(Integer.valueOf(5));
                            relation1.setModule(Integer.valueOf(40));
                          }
                          else
                          {
                            new_device1.setDevType(Integer.valueOf(7));
                            relation1.setModule(Integer.valueOf(361));
                          }
                          new_device1.setCompany(company);
                          new_device1.setSimInfo(new_sim1);
                        }
                        else
                        {
                          new_device1 = device1;
                          new_device1.setInstall(Integer.valueOf(1));
                          if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                          {
                            new_device1.setDevType(Integer.valueOf(5));
                            relation1.setModule(Integer.valueOf(40));
                          }
                          else
                          {
                            new_device1.setDevType(Integer.valueOf(7));
                            relation1.setModule(Integer.valueOf(361));
                          }
                          new_device1.setCompany(company);
                          StandardSIMCardInfo old_sim1 = new_device1.getSimInfo();
                          if (old_sim1 != null)
                          {
                            old_sim1.setStatus(Integer.valueOf(0));
                            old_sim1.setInstall(Integer.valueOf(0));
                            this.standardUserService.save(old_sim1);
                          }
                          new_device1.setSimInfo(new_sim1);
                        }
                        if (device2 == null)
                        {
                          new_device2.setDevIDNO(devIDNO1.toLowerCase());
                          new_device2.setInstall(Integer.valueOf(1));
                          if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.Gps"))))
                          {
                            new_device2.setDevType(Integer.valueOf(5));
                            relation2.setModule(Integer.valueOf(40));
                          }
                          else if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.video"))))
                          {
                            new_device2.setDevType(Integer.valueOf(7));
                            relation2.setModule(Integer.valueOf(361));
                            new_device1.setDevType(Integer.valueOf(5));
                            relation1.setModule(Integer.valueOf(40));
                          }
                          else if (new_device1.getDevType().intValue() == 5)
                          {
                            new_device2.setDevType(Integer.valueOf(7));
                            relation2.setModule(Integer.valueOf(361));
                          }
                          else
                          {
                            new_device2.setDevType(Integer.valueOf(5));
                            relation2.setModule(Integer.valueOf(40));
                          }
                          new_device2.setCompany(company);
                          new_device2.setSimInfo(new_sim2);
                        }
                        else
                        {
                          new_device2 = device2;
                          new_device2.setInstall(Integer.valueOf(1));
                          if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.Gps"))))
                          {
                            new_device2.setDevType(Integer.valueOf(5));
                            relation2.setModule(Integer.valueOf(40));
                          }
                          else if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.video"))))
                          {
                            new_device2.setDevType(Integer.valueOf(7));
                            relation2.setModule(Integer.valueOf(361));
                            new_device1.setDevType(Integer.valueOf(5));
                            relation1.setModule(Integer.valueOf(40));
                          }
                          else if (new_device1.getDevType().intValue() == 5)
                          {
                            new_device2.setDevType(Integer.valueOf(7));
                            relation2.setModule(Integer.valueOf(361));
                          }
                          else
                          {
                            new_device2.setDevType(Integer.valueOf(5));
                            relation2.setModule(Integer.valueOf(40));
                          }
                          new_device2.setCompany(company);
                          StandardSIMCardInfo old_sim2 = new_device2.getSimInfo();
                          if (old_sim2 != null)
                          {
                            old_sim2.setStatus(Integer.valueOf(0));
                            old_sim2.setInstall(Integer.valueOf(0));
                            this.standardUserService.save(old_sim2);
                          }
                          new_device2.setSimInfo(new_sim2);
                        }
                        if (new_sim1 != null) {
                          this.standardUserService.save(new_sim1);
                        }
                        if (new_sim2 != null) {
                          this.standardUserService.save(new_sim2);
                        }
                        this.standardUserService.save(new_device1);
                        this.standardUserService.save(new_device2);
                        new_device2.setCompany(company);
                        relation1.setDevice(new_device1);
                        relation1.setChnAttr(chnAttr);
                        relation1.setVehicle(new_vehicle);
                        relation1.setMainDev(Integer.valueOf(1));
                        relation2.setDevice(new_device2);
                        relation2.setVehicle(new_vehicle);
                        relations.add(relation1);
                        relations.add(relation2);
                        new_vehicle.setRelations(relations);
                      }
                      else
                      {
                        new_device1 = device1;
                        new_device1.setInstall(Integer.valueOf(1));
                        if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else
                        {
                          new_device1.setDevType(Integer.valueOf(7));
                          relation1.setModule(Integer.valueOf(361));
                        }
                        new_device1.setCompany(company);
                        StandardSIMCardInfo old_sim1 = new_device1.getSimInfo();
                        if (old_sim1 != null)
                        {
                          old_sim1.setStatus(Integer.valueOf(0));
                          old_sim1.setInstall(Integer.valueOf(0));
                          this.standardUserService.save(old_sim1);
                        }
                        new_device1.setSimInfo(new_sim1);
                        new_device2 = device2;
                        new_device2.setInstall(Integer.valueOf(1));
                        if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device2.setDevType(Integer.valueOf(5));
                          relation2.setModule(Integer.valueOf(40));
                        }
                        else if ((devType2 != "") && (devType2.equals(getText("vehicle.devType.video"))))
                        {
                          new_device2.setDevType(Integer.valueOf(7));
                          relation2.setModule(Integer.valueOf(361));
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else if (new_device1.getDevType().intValue() == 5)
                        {
                          new_device2.setDevType(Integer.valueOf(7));
                          relation2.setModule(Integer.valueOf(361));
                        }
                        else
                        {
                          new_device2.setDevType(Integer.valueOf(5));
                          relation2.setModule(Integer.valueOf(40));
                        }
                        new_device2.setCompany(company);
                        StandardSIMCardInfo old_sim2 = new_device2.getSimInfo();
                        if (old_sim2 != null)
                        {
                          old_sim2.setStatus(Integer.valueOf(0));
                          old_sim2.setInstall(Integer.valueOf(0));
                          this.standardUserService.save(old_sim2);
                        }
                        new_device2.setSimInfo(new_sim2);
                        if (new_sim1 != null) {
                          this.standardUserService.save(new_sim1);
                        }
                        if (new_sim2 != null) {
                          this.standardUserService.save(new_sim2);
                        }
                        this.standardUserService.save(new_device1);
                        this.standardUserService.save(new_device2);
                        new_device2.setCompany(company);
                        relation1.setDevice(new_device1);
                        relation1.setChnAttr(chnAttr);
                        relation1.setVehicle(new_vehicle);
                        relation1.setMainDev(Integer.valueOf(1));
                        relation2.setDevice(new_device2);
                        relation2.setVehicle(new_vehicle);
                        relations.add(relation1);
                        relations.add(relation2);
                        new_vehicle.setRelations(relations);
                      }
                    }
                    else
                    {
                      StandardDevice new_device1 = new StandardDevice();
                      List<StandardVehiDevRelation> relations = new ArrayList();
                      StandardVehiDevRelation relation1 = new StandardVehiDevRelation();
                      if (device1 == null)
                      {
                        new_device1.setDevIDNO(devIDNO1.toLowerCase());
                        new_device1.setInstall(Integer.valueOf(1));
                        if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else
                        {
                          new_device1.setDevType(Integer.valueOf(7));
                          relation1.setModule(Integer.valueOf(361));
                        }
                        new_device1.setCompany(company);
                        new_device1.setSimInfo(new_sim1);
                      }
                      else
                      {
                        new_device1 = device1;
                        new_device1.setInstall(Integer.valueOf(1));
                        if ((devType1 != "") && (devType1.equals(getText("vehicle.devType.Gps"))))
                        {
                          new_device1.setDevType(Integer.valueOf(5));
                          relation1.setModule(Integer.valueOf(40));
                        }
                        else
                        {
                          new_device1.setDevType(Integer.valueOf(7));
                          relation1.setModule(Integer.valueOf(361));
                        }
                        new_device1.setCompany(company);
                        StandardSIMCardInfo old_sim1 = new_device1.getSimInfo();
                        if (old_sim1 != null)
                        {
                          old_sim1.setStatus(Integer.valueOf(0));
                          old_sim1.setInstall(Integer.valueOf(0));
                          this.standardUserService.save(old_sim1);
                        }
                        new_device1.setSimInfo(new_sim1);
                      }
                      if (new_sim1 != null) {
                        this.standardUserService.save(new_sim1);
                      }
                      this.standardUserService.save(new_device1);
                      relation1.setDevice(new_device1);
                      relation1.setChnAttr(chnAttr);
                      relation1.setVehicle(new_vehicle);
                      relation1.setMainDev(Integer.valueOf(1));
                      relations.add(relation1);
                      new_vehicle.setRelations(relations);
                    }
                  }
                  new_vehicle.setStatus(Integer.valueOf(0));
                  new_vehicle.setPayBegin(new Date());
                  new_vehicle.setStlTm(new Date());
                  this.standardUserService.save(new_vehicle);
                  boolean flag = true;
                  ((StandardVehiDevRelation)new_vehicle.getRelations().get(0)).setMainDev(Integer.valueOf(1));
                  if (flag) {
                    this.standardUserService.mergeVehicle(new_vehicle.getRelations(), null, null, null);
                  }
                  if (flag) {
                    sendVehicleMsg(new_vehicle.getRelations(), null, null, buffVehiIdno.toString(), null);
                  }
                  addVehicleLog(Integer.valueOf(4), new_vehicle);
                  this.notifyService.sendStandardInfoChange(1, 7, 0, new_vehicle.getVehiIDNO());
                }
              }
              System.out.println("��������" + row.getLastCellNum());
            }
            else
            {
              addCustomResponse("accounts", failedAccount);
            }
          }
        }
      }
      is.close();
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadSendVehicles()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      String name = getRequest().getParameter("name");
      String status = getRequest().getParameter("status");
      String toMap = getRequest().getParameter("toMap");
      Pagination pagination = getPaginationEx();
      List<Integer> lsdcompanys = this.standardUserService.getCompanyIdList(company.getId(), null, isAdmin());
      
      List<StandardSendVehicle> vehicleList = this.standardUserService.getVehicles(lsdcompanys, name, status);
      
      int start = 0;int index = vehicleList.size();
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
      List<StandardSendVehicle> newVehicles = new ArrayList();
      int mapType;
      try
      {
        mapType = Integer.parseInt(toMap);
      }
      catch (Exception e)
      {
       
        mapType = 2;
      }
      for (int i = start; i < index; i++)
      {
        String position = ReportBaseAction.S_getMapPosition(((StandardSendVehicle)vehicleList.get(i)).getJingDu(), ((StandardSendVehicle)vehicleList.get(i)).getWeiDu(), mapType, isSessChinese(), getSession().get("WW_TRANS_I18N_LOCALE"));
        if ((position.isEmpty()) && 
          (((StandardSendVehicle)vehicleList.get(i)).getJingDu() != null) && (((StandardSendVehicle)vehicleList.get(i)).getWeiDu() != null) && (((StandardSendVehicle)vehicleList.get(i)).getJingDu().intValue() != 0) && (((StandardSendVehicle)vehicleList.get(i)).getWeiDu().intValue() != 0)) {
          position = formatPosition(((StandardSendVehicle)vehicleList.get(i)).getWeiDu()) + "," + formatPosition(((StandardSendVehicle)vehicleList.get(i)).getJingDu());
        }
        ((StandardSendVehicle)vehicleList.get(i)).setPosition(position);
        newVehicles.add((StandardSendVehicle)vehicleList.get(i));
      }
      addCustomResponse("infos", newVehicles);
      addCustomResponse("pagination", pagination);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadSendInvoVehis()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      String name = getRequest().getParameter("name");
      String status = getRequest().getParameter("status");
      Pagination pagination = getPaginationEx();
      List<Integer> lsdcompanys = this.standardUserService.getCompanyIdList(company.getId(), null, isAdmin());
      
      List<StandardSendVehicle> lstVehicle = this.standardUserService.getVehicles(lsdcompanys, name, status);
      
      int start = 0;int index = lstVehicle.size();
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
      List<PartStandardInfo> partVehicle = new ArrayList();
      for (int i = start; i < index; i++)
      {
        PartStandardInfo info = new PartStandardInfo();
        StandardSendVehicle vehicle = (StandardSendVehicle)lstVehicle.get(i);
        info.setId(vehicle.getVid());
        info.setName(vehicle.getVid());
        info.setParentId(vehicle.getCid());
        partVehicle.add(info);
      }
      addCustomResponse("infos", partVehicle);
      addCustomResponse("pagination", pagination);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String loadSendInvoiceVehicles()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      List<Integer> lsdcompanys = this.standardUserService.getCompanyIdList(company.getId(), null, isAdmin());
      
      List<StandardSendVehicle> lstVehicle = this.standardUserService.getVehicles(lsdcompanys, null, null);
      
      List<PartStandardInfo> partVehicle = new ArrayList();
      if ((lstVehicle != null) && (lstVehicle.size() > 0)) {
        for (int i = 0; i < lstVehicle.size(); i++)
        {
          PartStandardInfo info = new PartStandardInfo();
          StandardSendVehicle vehicle = (StandardSendVehicle)lstVehicle.get(i);
          info.setId(vehicle.getVid());
          info.setName(vehicle.getVid());
          info.setParentId(vehicle.getCid());
          partVehicle.add(info);
        }
      }
      addCustomResponse("vehicles", partVehicle);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String formatPosition(Integer position)
  {
    if (position != null)
    {
      double db = position.intValue();
      DecimalFormat format = new DecimalFormat();
      format.applyPattern("#0.000000");
      return format.format(db / 1000000.0D).replace(',', '.');
    }
    return "";
  }
  
  public String issInvoice()
  {
    String id = getRequestString("id");
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      StandardCompany company = userAccount.getCompany();
      StandardVehicleInvoice receipt = (StandardVehicleInvoice)this.standardUserService.getObject(StandardVehicleInvoice.class, Integer.valueOf(Integer.parseInt(id)));
      if (receipt != null)
      {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        Element theBook = null;Element root = null;
        factory.setIgnoringElementContentWhitespace(true);
        DocumentBuilder db = factory.newDocumentBuilder();
        Document xmldoc = db.newDocument();
        Node node = xmldoc.createElement("Parameter");
        xmldoc.appendChild(node);
        root = xmldoc.getDocumentElement();
        theBook = xmldoc.createElement("Order");
        theBook.setAttribute("Depart", company.getName());
        theBook.setAttribute("Goods", receipt.getCargoName());
        theBook.setAttribute("SendID", receipt.getSentCarSingleNum());
        theBook.setAttribute("SendPersion", receipt.getSentCarPeople());
        theBook.setAttribute("Driver", receipt.getDriverName());
        theBook.setAttribute("NO", receipt.getVehicle().getVehiIDNO());
        theBook.setAttribute("Company", receipt.getCarriageUnit());
        theBook.setAttribute("DispatchTime", DateUtil.dateSwitchString(receipt.getSendStartTime()));
        theBook.setAttribute("ReturnTime", DateUtil.dateSwitchString(receipt.getSendEndTime()));
        theBook.setAttribute("BeforeKilometers", receipt.getStartLiCheng());
        theBook.setAttribute("AfterKilometers", receipt.getEndLiCheng());
        theBook.setAttribute("DeparturePlace", receipt.getDeparture());
        theBook.setAttribute("Destination", receipt.getDestination());
        theBook.setAttribute("CustomerName", receipt.getClientName());
        theBook.setAttribute("telephone", receipt.getContactsAndPhone());
        theBook.setAttribute("CustomerAaddress", receipt.getCustomerAddress());
        String server = "";
        if (receipt.getServers().intValue() == 0) {
          server = getText("arrival.gate");
        } else {
          server = getText("station.to.door");
        }
        theBook.setAttribute("serviceMode", server);
        theBook.setAttribute("GoodsName", receipt.getCargoName());
        theBook.setAttribute("weight", receipt.getCargoWeight());
        String quantity = "";
        if (receipt.getCargoNum() != null) {
          quantity = receipt.getCargoNum().toString();
        }
        theBook.setAttribute("Quantity", quantity);
        theBook.setAttribute("Volume", receipt.getCargoVolume());
        theBook.setAttribute("InvoiceNo.", receipt.getFreightInvoiceNo());
        theBook.setAttribute("ScatteredNumber", receipt.getScatteredSingleNum());
        String number = "";
        if (receipt.getCargoNum() != null) {
          number = receipt.getBoxNum().toString();
        }
        String box = "";
        if (receipt.getBox().intValue() == 0) {
          box = "T20";
        } else {
          box = "T40";
        }
        theBook.setAttribute("Model1", box);
        theBook.setAttribute("Number", number);
        theBook.setAttribute("No.1", receipt.getBoxNumOne());
        theBook.setAttribute("No.2", receipt.getBoxNumTwo());
        theBook.setAttribute("TicketMileage", receipt.getTicketRecordMile());
        theBook.setAttribute("ActualMileage", receipt.getActualMileAcess());
        theBook.setAttribute("UnitPrice", receipt.getUnitPrice());
        theBook.setAttribute("Cost", receipt.getNuclearFees());
        theBook.setAttribute("ParkingRate", receipt.getParkingFee());
        theBook.setAttribute("TollRoad", receipt.getRoadToll());
        theBook.setAttribute("Lowercase", receipt.getCollectionCosts());
        theBook.setAttribute("TS", receipt.getSafeTip());
        theBook.setAttribute("BZ", receipt.getExplanation());
        root.appendChild(theBook);
        TransformerFactory transFactory = TransformerFactory.newInstance();
        Transformer transformer = transFactory.newTransformer();
        transformer.setOutputProperty("encoding", "utf-8");
        transformer.setOutputProperty("indent", "yes");
        DOMSource source = new DOMSource();
        source.setNode(xmldoc);
        StreamResult result = new StreamResult();
        result.setOutputStream(new FileOutputStream("paiche.xml"));
        transformer.transform(source, result);
        
        HttpServletRequest request = ServletActionContext.getRequest();
        List<StandardVehiDevRelation> relations = this.standardUserService.getStandardVehiDevRelationList(receipt.getVehicle().getVehiIDNO(), null);
        URL url = new URL(String.format("http://%s:%d/2/66?JSESSIONID=%s&DevIDNO=%s", new Object[] { "192.168.1.222", this.notifyService.getUserServerPort(), request.getRequestedSessionId(), ((StandardVehiDevRelation)relations.get(0)).getDevice().getDevIDNO() }));
        HttpURLConnection httpConn = (HttpURLConnection)url.openConnection();
        httpConn.setDoInput(true);
        httpConn.setDoOutput(true);
        httpConn.setRequestMethod("POST");
        httpConn.setUseCaches(false);
        httpConn.setConnectTimeout(5000);
        httpConn.setReadTimeout(60000);
        
        String jsonParam = "\r\n\r\n";
        DataOutputStream dos = new DataOutputStream(httpConn.getOutputStream());
        dos.write(jsonParam.getBytes());
        
        FileInputStream is = new FileInputStream("paiche.xml");
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
        
        addUserLog(Integer.valueOf(2), 
          Integer.valueOf(28), ((StandardDevice)receipt.getVehicle().getDevices().get(0)).getDevIDNO(), null, null, 
          String.format("%d", new Object[] { Integer.valueOf(2) }), null);
      }
    }
    catch (ParserConfigurationException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    catch (TransformerConfigurationException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    catch (TransformerException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    catch (MalformedURLException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    catch (IOException e)
    {
      e.printStackTrace();
      addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
    }
    return "success";
  }
}
