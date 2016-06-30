package com.gps808.operationManagement.action;

import com.framework.jasperReports.ReportCreater;
import com.framework.jasperReports.ReportPrint;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.StringUtil;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.util.ConvertUtil;
import com.gps.util.ObjectUtil;
import com.gps.vo.GpsValue;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.model.line.StandardLineInfo;
import com.gps808.model.line.StandardLineStationRelation;
import com.gps808.model.line.StandardLineStationRelationStation;
import com.gps808.model.line.StandardStationInfo;
import com.gps808.operationManagement.service.StandardLineService;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.PartStandardInfo;
import com.gps808.operationManagement.vo.StandardUserPermit;
import com.gps808.report.vo.StandardDeviceQuery;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class StandardLineAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  protected static final String LINE_UP = "s";
  protected static final String LINE_DOWN = "x";
  
  public String loadUserCompanyTeams()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        List<Integer> lstLevel = new ArrayList();
        lstLevel.add(Integer.valueOf(1));
        lstLevel.add(Integer.valueOf(2));
        List<StandardCompany> companys = findUserCompanys(userAccount.getCompany(), lstLevel, isAdmin(), true, false);
        List<PartStandardInfo> partCompanys = new ArrayList();
        for (int i = 0; i < companys.size(); i++)
        {
          PartStandardInfo info = new PartStandardInfo();
          StandardCompany company = (StandardCompany)companys.get(i);
          if ((company.getId() != null) && (company.getId().intValue() != -1))
          {
            info.setId(company.getId().toString());
            info.setName(company.getName());
            info.setParentId(company.getParentId());
            info.setLevel(company.getLevel());
            partCompanys.add(info);
          }
        }
        addCustomResponse("infos", partCompanys);
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
  
  public String loadUserLines()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        Pagination pagination = getPaginationEx();
        String name = getRequest().getParameter("name");
        String companyId = getRequestString("companyId");
        
        List<Integer> lstComapnyId = new ArrayList();
        if (!isParamNull(companyId)) {
          lstComapnyId = findUserCompanyIdList(Integer.valueOf(Integer.parseInt(companyId)), null, isAdmin());
        } else {
          lstComapnyId = findUserCompanyIdList(userAccount.getCompany().getId(), null, isAdmin());
        }
        AjaxDto<StandardLineInfo> lines = null;
        if (isParamNull(name))
        {
          lines = this.standardLineService.getLineInfos(lstComapnyId, Integer.valueOf(1), null, pagination);
        }
        else
        {
          lines = this.standardLineService.getLineInfos(lstComapnyId, Integer.valueOf(1), null, null);
          if ((lines != null) && (lines.getPageList() != null) && (lines.getPageList().size() > 0))
          {
            List<Integer> lstComapnyId_ = new ArrayList();
            AjaxDto<StandardCompany> dtoCompany = this.standardUserService.getStandardCompanyByName(name, null);
            if ((dtoCompany != null) && (dtoCompany.getPageList() != null) && (dtoCompany.getPageList().size() > 0))
            {
              int i = 0;
              for (int j = dtoCompany.getPageList().size(); i < j; i++) {
                lstComapnyId_.add(((StandardCompany)dtoCompany.getPageList().get(i)).getId());
              }
            }
            boolean isDel = true;
            List<StandardLineInfo> lstLineInfo = lines.getPageList();
            for (int i = lstLineInfo.size() - 1; i >= 0; i--)
            {
              isDel = true;
              if (StringUtil.indexOfEx(((StandardLineInfo)lstLineInfo.get(i)).getName(), name) >= 0) {
                isDel = false;
              }
              if ((lstComapnyId_ != null) && (lstComapnyId_.contains(((StandardLineInfo)lstLineInfo.get(i)).getPid()))) {
                isDel = false;
              }
              if (isDel) {
                lstLineInfo.remove(i);
              }
            }
            lines = doSummaryLineInfo(lstLineInfo, pagination);
          }
        }
        addCustomResponse("infos", lines.getPageList());
        addCustomResponse("pagination", lines.getPagination());
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
  
  public String findLineInfo()
  {
    try
    {
      String id = getRequestString("id");
      if (!isParamNull(id))
      {
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id)))))
        {
          StandardCompany line = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          if (line == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardLineInfo lineMore = (StandardLineInfo)this.standardLineService.getObject(StandardLineInfo.class, line.getId());
            lineMore.setName(line.getName());
            lineMore.setPid(line.getParentId());
            lineMore.setAbbr(line.getAbbreviation());
            
            addCustomResponse("line", lineMore);
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public String deleteLineInfo()
  {
    try
    {
      String id = getRequestString("id");
      if (isParamNull(id))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || ((isRole(StandardUserRole.PRIVI_OPERATION_LINE.toString())) && (isBelongCompany(userAccount.getCompany().getId(), Integer.valueOf(Integer.parseInt(id))))))
        {
          StandardCompany line = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          if (line == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            AjaxDto<StandardVehicle> vehicleList = getUserVehicles(line.getId(), null, null, false, null);
            if ((vehicleList.getPageList() != null) && (vehicleList.getPageList().size() > 0))
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(64));
            }
            else
            {
              StandardLineInfo lineMore = (StandardLineInfo)this.standardLineService.getObject(StandardLineInfo.class, line.getId());
              
              this.standardUserService.delete(line);
              
              lineMore.setEnable(Integer.valueOf(0));
              this.standardLineService.save(lineMore);
              
              addLineLog(Integer.valueOf(3), line);
              int lineId = line.getId() == null ? 0 : line.getId().intValue();
              this.notifyService.sendStandardInfoChange(3, 19, lineId, "");
            }
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  private boolean isCheckLineParamNull(StandardLineInfo line)
  {
    if ((line == null) || (isParamNull(line.getName())) || (isParamNull(line.getPid())) || (isParamNull(line.getType())) || 
      (isParamNull(line.getDnFirst())) || (isParamNull(line.getDnItlN())) || (isParamNull(line.getDnItlP())) || 
      (isParamNull(line.getDnLast())) || (isParamNull(line.getDnLen())) || (isParamNull(line.getDnTotalT())) || 
      (isParamNull(line.getPrice())) || (isParamNull(line.getTicket())) || (isParamNull(line.getType())) || 
      (isParamNull(line.getUpFirst())) || (isParamNull(line.getUpItlN())) || (isParamNull(line.getUpItlP())) || 
      (isParamNull(line.getUpLast())) || (isParamNull(line.getUpLen())) || (isParamNull(line.getUpTotalT()))) {
      return true;
    }
    return false;
  }
  
  public String mergeLineInfo()
  {
    try
    {
      if ((!isRole(StandardUserRole.PRIVI_OPERATION_LINE.toString())) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        boolean flag = false;
        int merge = 0;
        StandardLineInfo lineMore = new StandardLineInfo();
        try
        {
          lineMore = (StandardLineInfo)AjaxUtils.getObject(getRequest(), StandardLineInfo.class);
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        if (isCheckLineParamNull(lineMore))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else if (isLineExist(lineMore))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), lineMore.getPid())))
          {
            if ((isAdmin()) && (lineMore.getPid() == null)) {
              lineMore.setPid(Integer.valueOf(0));
            }
            StandardCompany line = new StandardCompany();
            line.setId(lineMore.getId());
            line.setName(lineMore.getName());
            line.setLevel(Integer.valueOf(3));
            line.setParentId(lineMore.getPid());
            line.setAbbreviation(lineMore.getAbbr());
            
            StandardCompany parentCompany = (StandardCompany)this.deviceService.getObject(StandardCompany.class, lineMore.getPid());
            if (parentCompany.getLevel().intValue() == 1) {
              line.setCompanyId(parentCompany.getId());
            } else {
              line.setCompanyId(parentCompany.getCompanyId());
            }
            if (lineMore.getId() != null)
            {
              StandardLineInfo oldLineMore = (StandardLineInfo)this.standardLineService.getObject(StandardLineInfo.class, lineMore.getId());
              
              ObjectUtil.copeField(oldLineMore, lineMore);
              lineMore.setEnable(Integer.valueOf(1));
              this.standardUserService.save(lineMore);
              
              line = (StandardCompany)this.standardUserService.save(line);
              
              flag = true;
              merge = 2;
            }
            else
            {
              line = (StandardCompany)this.standardUserService.save(line);
              lineMore.setId(line.getId());
              lineMore.setEnable(Integer.valueOf(1));
              
              this.standardUserService.save(lineMore);
              flag = true;
              merge = 1;
              addCustomResponse("lineId", line.getId());
            }
            if ((flag) && (merge == 1))
            {
              addLineLog(Integer.valueOf(1), line);
              int lineId = line.getId() == null ? 0 : line.getId().intValue();
              this.notifyService.sendStandardInfoChange(1, 19, lineId, "");
            }
            else if ((flag) && (merge == 2))
            {
              addLineLog(Integer.valueOf(2), line);
              int lineId = line.getId() == null ? 0 : line.getId().intValue();
              this.notifyService.sendStandardInfoChange(2, 19, lineId, "");
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
            }
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
  
  private boolean isLineExist(StandardLineInfo line)
  {
    StandardCompany oldline = this.standardUserService.getStandardCompany(line.getName());
    if ((oldline == null) || ((oldline.getId() != null) && (oldline.getId().equals(line.getId())))) {
      return false;
    }
    StandardLineInfo oldLineMore = (StandardLineInfo)this.standardLineService.getObject(StandardLineInfo.class, oldline.getId());
    if ((oldLineMore == null) && (oldline.getLevel() != null) && (oldline.getLevel().intValue() == 3))
    {
      this.standardUserService.delete(oldline);
      return false;
    }
    return true;
  }
  
  public String getPermitVehicles()
  {
    try
    {
      if ((!isRole(StandardUserRole.PRIVI_OPERATION_LINE.toString())) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        String isPermit = getRequestString("isAssign");
        String id = getRequestString("id");
        String companyId = getRequestString("companyId");
        String name = getRequest().getParameter("name");
        if (!isParamNull(id))
        {
          StandardCompany line = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
          if (line == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
          else
          {
            StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
            if (isBelongCompany(userAccount.getCompany().getId(), line.getId()))
            {
              String condition = "";
              if (!isParamNull(name)) {
                condition = String.format(" and (vehiIDNO like '%%%s%%')", new Object[] { name });
              }
              List<Integer> companys = new ArrayList();
              if (isParamNull(companyId))
              {
                if ((!isParamNull(isPermit)) && (isPermit.equals("1")))
                {
                  companys.add(line.getId());
                }
                else
                {
                  StandardCompany company = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, line.getCompanyId());
                  companys = findUserCompanyIdList(company.getId(), null, false);
                  companys.remove(line.getId());
                }
              }
              else if ((!isParamNull(isPermit)) && (isPermit.equals("1")))
              {
                companys.add(line.getId());
              }
              else
              {
                companys.add(Integer.valueOf(Integer.parseInt(companyId)));
                condition = condition + String.format(" and company.id <> %d ", new Object[] { line.getId() });
              }
              AjaxDto<StandardVehicle> vehicleList = getUserVehicles(null, companys, condition, isAdmin(), getPaginationEx());
              List<PartStandardInfo> lstVehicle = new ArrayList();
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
                  lstVehicle.add(info);
                }
              }
              addCustomResponse("infos", lstVehicle);
              addCustomResponse("pagination", vehicleList.getPagination());
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
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveLineVehicle()
  {
    try
    {
      String id = getRequestString("id");
      String isAssign = getRequestString("isAssign");
      if ((isParamNull(id)) || (isParamNull(isAssign)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardCompany line = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
        if (line == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if (isBelongCompany(userAccount.getCompany().getId(), line.getId()))
          {
            StandardUserPermit lineAssign = (StandardUserPermit)AjaxUtils.getObject(getRequest(), StandardUserPermit.class);
            if ((lineAssign.getPermits() != null) && (!lineAssign.getPermits().isEmpty()))
            {
              String[] idnos = lineAssign.getPermits().split(",");
              StringBuffer condition = new StringBuffer(String.format(" and vehiIDNO in('%s'", new Object[] { idnos[0] }));
              for (int i = 1; i < idnos.length; i++) {
                condition.append(String.format(", '%s'", new Object[] { idnos[i] }));
              }
              condition.append(" ) ");
              AjaxDto<StandardVehicle> dtoVehicles = this.standardUserService.getStandardVehicleList(null, condition.toString(), null);
              if ((dtoVehicles.getPageList() != null) && (dtoVehicles.getPageList().size() > 0))
              {
                Integer parentId = line.getId();
                if (isAssign.equals("1")) {
                  parentId = line.getParentId();
                }
                List<Object> vehicleList = new ArrayList();
                for (int i = 0; i < dtoVehicles.getPageList().size(); i++)
                {
                  ((StandardVehicle)dtoVehicles.getPageList().get(i)).getCompany().setId(parentId);
                  vehicleList.add(dtoVehicles.getPageList().get(i));
                }
                this.standardLineService.saveList(vehicleList);
              }
            }
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
  
  public String loadUserStations()
  {
    try
    {
      StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
      if (userAccount != null)
      {
        Pagination pagination = getPaginationEx();
        String name = getRequest().getParameter("name");
        String lid = getRequestString("lid");
        String direct = getRequestString("direct");
        String toMap = getRequestString("toMap");
        if ((isParamNull(lid)) || (isParamNull(direct)))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          String condition = "";
          if (!isParamNull(name)) {
            condition = String.format(" and station.name like '%%%s%%' ", new Object[] { name });
          }
          condition = condition + " order by sindex asc ";
          
          AjaxDto<StandardLineStationRelationStation> stationRelation = this.standardLineService.getLineStationInfos(Integer.valueOf(Integer.parseInt(lid)), 
            Integer.valueOf(Integer.parseInt(direct)), Integer.valueOf(1), condition, pagination);
          List<StandardLineStationRelationStation> relations = stationRelation.getPageList();
          if ((relations != null) && (relations.size() > 0))
          {
            StandardStationInfo station = null;
            GpsValue gpsValue = null;
            for (int i = 0; i < relations.size(); i++)
            {
              station = ((StandardLineStationRelationStation)relations.get(i)).getStation();
              if ((station.getLngIn() != null) && (station.getLatIn() != null) && 
                (station.getLngIn().intValue() != 0) && (station.getLatIn().intValue() != 0))
              {
                gpsValue = ConvertUtil.convert(station.getLngIn(), station.getLatIn(), toMap);
                if ((gpsValue.getMapJingDu() != null) && (!gpsValue.getMapJingDu().isEmpty())) {
                  station.setLngIn(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapJingDu()) * 1000000.0D)));
                }
                if ((gpsValue.getMapWeiDu() != null) && (!gpsValue.getMapWeiDu().isEmpty())) {
                  station.setLatIn(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapWeiDu()) * 1000000.0D)));
                }
              }
              if ((station.getLngOut() != null) && (station.getLatOut() != null) && 
                (station.getLngOut().intValue() != 0) && (station.getLatOut().intValue() != 0))
              {
                gpsValue = ConvertUtil.convert(station.getLngOut(), station.getLatOut(), toMap);
                if ((gpsValue.getMapJingDu() != null) && (!gpsValue.getMapJingDu().isEmpty())) {
                  station.setLngOut(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapJingDu()) * 1000000.0D)));
                }
                if ((gpsValue.getMapWeiDu() != null) && (!gpsValue.getMapWeiDu().isEmpty())) {
                  station.setLatOut(Integer.valueOf((int)(Double.parseDouble(gpsValue.getMapWeiDu()) * 1000000.0D)));
                }
              }
            }
          }
          addCustomResponse("infos", relations);
          addCustomResponse("pagination", stationRelation.getPagination());
        }
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
  
  public String findStationRelationInfo()
  {
    try
    {
      String id = getRequestString("id");
      if (!isParamNull(id))
      {
        StandardLineStationRelationStation relation = (StandardLineStationRelationStation)this.standardLineService.getObject(StandardLineStationRelationStation.class, Integer.valueOf(Integer.parseInt(id)));
        if (relation == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          
          StandardCompany lineInfo = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, relation.getLid());
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), lineInfo.getParentId()))) {
            addCustomResponse("relation", relation);
          } else {
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
  
  public String deleteStationInfo()
  {
    try
    {
      String id = getRequestString("id");
      if (isParamNull(id))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardLineStationRelationStation relation = (StandardLineStationRelationStation)this.standardLineService.getObject(StandardLineStationRelationStation.class, Integer.valueOf(Integer.parseInt(id)));
        if (relation == null)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
        else
        {
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          
          StandardCompany lineInfo = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, relation.getLid());
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), lineInfo.getParentId())))
          {
            this.standardLineService.delete(relation);
            
            AjaxDto<StandardLineStationRelationStation> delDtoRelation = this.standardLineService.getLineStationInfos(lineInfo.getId(), relation.getDirect(), Integer.valueOf(1), null, null);
            List<StandardLineStationRelationStation> lstRelation = delDtoRelation.getPageList();
            delDtoRelation = null;
            for (int i = 0; i < lstRelation.size(); i++) {
              if (((StandardLineStationRelationStation)lstRelation.get(i)).getSindex().intValue() >= relation.getSindex().intValue()) {
                ((StandardLineStationRelationStation)lstRelation.get(i)).setSindex(Integer.valueOf(((StandardLineStationRelationStation)lstRelation.get(i)).getSindex().intValue() - 1));
              }
            }
            this.standardLineService.batchSaveStationRelation(lstRelation, null);
            
            updateStationSum(relation.getLid(), relation.getDirect(), -1, false);
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
  
  private void updateStationSum(Integer lid, Integer direct, int sum, boolean isClear)
  {
    StandardLineInfo line_ = (StandardLineInfo)this.standardLineService.getObject(StandardLineInfo.class, lid);
    if (line_ != null) {
      if (direct.intValue() == 0)
      {
        if (isClear) {
          line_.setUpSum(Integer.valueOf(sum));
        } else {
          line_.setUpSum(Integer.valueOf(line_.getUpSum() == null ? sum : line_.getUpSum().intValue() + sum));
        }
      }
      else if (isClear) {
        line_.setDnSum(Integer.valueOf(sum));
      } else {
        line_.setDnSum(Integer.valueOf(line_.getDnSum() == null ? sum : line_.getDnSum().intValue() + sum));
      }
    }
    this.standardLineService.save(line_);
  }
  
  private boolean isCheckStationParamNull(StandardLineStationRelationStation relation)
  {
    if ((relation == null) || (relation.getStation() == null)) {
      return true;
    }
    StandardStationInfo station = relation.getStation();
    if ((isParamNull(station.getName())) || (isParamNull(station.getAngleIn())) || (isParamNull(station.getAngleOut())) || 
      (isParamNull(station.getDirect())) || (isParamNull(station.getLatIn())) || (isParamNull(station.getLatOut())) || 
      (isParamNull(station.getLngIn())) || (isParamNull(station.getLngOut())) || 
      (isParamNull(relation.getStype())) || (isParamNull(relation.getSindex())) || (isParamNull(relation.getDirect())) || 
      (isParamNull(relation.getLid()))) {
      return true;
    }
    return false;
  }
  
  private List<Object> getChangeRelation(StandardLineStationRelationStation relation)
  {
    List<Object> lstRelations_ = new ArrayList();
    
    AjaxDto<StandardLineStationRelationStation> stationRelation = this.standardLineService.getLineStationInfos(relation.getLid(), 
      relation.getDirect(), Integer.valueOf(1), " order by sindex asc ", null);
    if ((stationRelation != null) && (stationRelation.getPageList() != null) && (stationRelation.getPageList().size() > 0))
    {
      List<StandardLineStationRelationStation> lstRelation_ = stationRelation.getPageList();
      stationRelation = null;
      
      Integer oldSindex = Integer.valueOf(-1);
      if (relation.getId() != null)
      {
        boolean isChange = false;
        for (int i = lstRelation_.size() - 1; i >= 0; i--)
        {
          if (((StandardLineStationRelationStation)lstRelation_.get(i)).getId().equals(relation.getId()))
          {
            oldSindex = ((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex();
            lstRelation_.remove(i);
            isChange = true;
          }
          if ((oldSindex != null) && (isChange)) {
            break;
          }
        }
      }
      if (oldSindex != null) {
        if ((oldSindex.intValue() >= relation.getSindex().intValue()) || (oldSindex.intValue() == -1)) {
          for (int i = 0; i < lstRelation_.size(); i++) {
            if ((relation.getSindex().intValue() <= ((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue()) && (
              (((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue() <= oldSindex.intValue()) || (oldSindex.intValue() == -1)))
            {
              ((StandardLineStationRelationStation)lstRelation_.get(i)).setSindex(Integer.valueOf(((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue() + 1));
              lstRelations_.add(lstRelation_.get(i));
            }
          }
        } else if (oldSindex.intValue() < relation.getSindex().intValue()) {
          for (int i = 0; i < lstRelation_.size(); i++) {
            if ((oldSindex.intValue() <= ((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue()) && 
              (((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue() <= relation.getSindex().intValue()))
            {
              ((StandardLineStationRelationStation)lstRelation_.get(i)).setSindex(Integer.valueOf(((StandardLineStationRelationStation)lstRelation_.get(i)).getSindex().intValue() - 1));
              lstRelations_.add(lstRelation_.get(i));
            }
          }
        }
      }
    }
    return lstRelations_;
  }
  
  public String mergeStationInfo()
  {
    try
    {
      if ((!isRole(StandardUserRole.PRIVI_OPERATION_LINE.toString())) && (!isAdmin()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
      else
      {
        boolean flag = false;
        
        StandardLineStationRelationStation relation = new StandardLineStationRelationStation();
        try
        {
          relation = (StandardLineStationRelationStation)AjaxUtils.getObject(getRequest(), StandardLineStationRelationStation.class);
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        if (isCheckStationParamNull(relation))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
        else
        {
          relation.setSindex(Integer.valueOf(relation.getSindex().intValue() - 1));
          
          StandardCompany lineInfo = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, relation.getLid());
          StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
          if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), lineInfo.getParentId())))
          {
            StandardStationInfo station = relation.getStation();
            
            StandardStationInfo oldStation = this.standardLineService.getStationInfo(station.getName(), station.getDirect(), null);
            if (oldStation != null) {
              station.setId(oldStation.getId());
            }
            boolean isFlag = true;
            if (!isParamNull(station.getId()))
            {
              StandardLineStationRelationStation oldRelation = this.standardLineService.getLineStationRelation(relation.getLid(), 
                station.getId(), relation.getDirect(), null, null);
              if ((oldRelation != null) && (!oldRelation.getId().equals(relation.getId()))) {
                isFlag = false;
              }
            }
            if (!isFlag)
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
            }
            else
            {
              List<Object> lstRelation = new ArrayList();
              StandardLineStationRelationStation oldRelation_ = this.standardLineService.getLineStationRelation(relation.getLid(), 
                null, relation.getDirect(), relation.getSindex(), null);
              if ((oldRelation_ == null) && (!isParamNull(station.getId()))) {
                oldRelation_ = this.standardLineService.getLineStationRelation(relation.getLid(), 
                  station.getId(), relation.getDirect(), null, null);
              }
              Integer maxIndex = this.standardLineService.getMaxStationIndex(relation.getLid(), relation.getDirect(), null);
              if ((oldRelation_ != null) || (relation.getId() != null))
              {
                if ((maxIndex != null) && (relation.getSindex().intValue() > maxIndex.intValue())) {
                  relation.setSindex(maxIndex);
                }
                lstRelation = getChangeRelation(relation);
              }
              else if (maxIndex == null)
              {
                relation.setSindex(Integer.valueOf(0));
              }
              else
              {
                relation.setSindex(Integer.valueOf(maxIndex.intValue() + 1));
              }
              if (!isParamNull(station.getId()))
              {
                ObjectUtil.copeField(oldStation, station);
                
                station.setEnable(Integer.valueOf(1));
                station = (StandardStationInfo)this.standardLineService.save(station);
                
                relation.setStation(station);
                
                lstRelation.add(relation);
                this.standardLineService.saveList(lstRelation);
                flag = true;
              }
              else
              {
                station.setEnable(Integer.valueOf(1));
                
                station = (StandardStationInfo)this.standardLineService.save(station);
                
                relation.setStation(station);
                
                lstRelation.add(relation);
                this.standardLineService.saveList(lstRelation);
                
                updateStationSum(relation.getLid(), relation.getDirect(), 1, false);
                
                flag = true;
              }
              if (!flag) {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
              }
            }
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
  
  public String importStationExcel()
    throws Exception
  {
    try
    {
      if ((!this.uploadFile.isFile()) || (!this.uploadFile.exists()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(44));
      }
      else
      {
        String lid = getRequestString("lid");
        
        String[] fileNames = this.uploadFileFileName.trim().toLowerCase().split("\\.");
        if (!fileNames[(fileNames.length - 1)].equals("xls"))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(42));
        }
        else
        {
          String fileName_ = fileNames[0].trim();
          
          String lineName = fileName_.substring(0, fileName_.length() - 1);
          
          int lineDirect = 0;
          if (fileName_.endsWith("x")) {
            lineDirect = 1;
          }
          StandardCompany lineInfo = this.standardUserService.getStandardCompany(lineName);
          if (lineInfo == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(62));
          }
          else if (!lineInfo.getId().toString().equals(lid))
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(63));
          }
          else
          {
            List<String> failedStation = new ArrayList();
            String failed = "";
            
            List<StandardLineStationRelationStation> lstRelation = new ArrayList();
            
            FileInputStream is = new FileInputStream(this.uploadFile);
            HSSFWorkbook wbs = new HSSFWorkbook(is);
            HSSFSheet childSheet = wbs.getSheetAt(0);
            HSSFRow row = null;
            for (int i = 2; i < childSheet.getLastRowNum() + 1; i++)
            {
              row = childSheet.getRow(i);
              if (row != null)
              {
                int j = 0;
                
                String sName = getExcelCellDecimalString(row, j++);
                failed = sName;
                
                String sDirect = getExcelCellDecimalString(row, j++);
                
                String sType = getExcelCellDecimalString(row, j++);
                
                String lngIn = getExcelCellString(row, j++);
                
                String latIn = getExcelCellString(row, j++);
                
                String angleIn = getExcelCellDecimalString(row, j++);
                
                String lngOut = getExcelCellString(row, j++);
                
                String latOut = getExcelCellString(row, j++);
                
                String angleOut = getExcelCellDecimalString(row, j++);
                
                String speed = getExcelCellString(row, j++);
                
                String len = getExcelCellString(row, j++);
                
                StandardLineStationRelationStation relation = new StandardLineStationRelationStation();
                try
                {
                  relation.setSindex(Integer.valueOf(i - 2));
                  relation.setDirect(Integer.valueOf(lineDirect));
                  relation.setLen(Integer.valueOf((int)(Double.parseDouble(len) * 1000.0D)));
                  relation.setLid(lineInfo.getId());
                  relation.setSpeed(Integer.valueOf((int)(Double.parseDouble(speed) * 10.0D)));
                  relation.setStype(getStationType(sType));
                  StandardStationInfo station = new StandardStationInfo();
                  station.setName(sName);
                  station.setDirect(getStationDirect(sDirect));
                  station.setEnable(Integer.valueOf(1));
                  station.setAngleIn(Integer.valueOf(Integer.parseInt(angleIn)));
                  station.setAngleOut(Integer.valueOf(Integer.parseInt(angleOut)));
                  station.setLatIn(Integer.valueOf((int)(Double.parseDouble(latIn) * 1000000.0D)));
                  station.setLatOut(Integer.valueOf((int)(Double.parseDouble(latOut) * 1000000.0D)));
                  station.setLngIn(Integer.valueOf((int)(Double.parseDouble(lngIn) * 1000000.0D)));
                  station.setLngOut(Integer.valueOf((int)(Double.parseDouble(lngOut) * 1000000.0D)));
                  
                  StandardStationInfo oldStation = this.standardLineService.getStationInfo(station.getName(), station.getDirect(), null);
                  if (oldStation != null) {
                    station.setId(oldStation.getId());
                  }
                  relation.setStation(station);
                  
                  StandardLineStationRelationStation oldRelation = this.standardLineService.getLineStationRelation(relation.getLid(), 
                    relation.getStation().getId(), relation.getDirect(), null, null);
                  if (oldRelation != null) {
                    relation.setId(oldRelation.getId());
                  }
                  station = (StandardStationInfo)this.standardLineService.save(station);
                  relation.setStation(station);
                  
                  lstRelation.add(relation);
                }
                catch (Exception e)
                {
                  if ((failed != null) && (!failed.isEmpty())) {
                    failedStation.add(failed);
                  }
                  e.printStackTrace();
                }
              }
            }
            if (lstRelation.size() > 0)
            {
              AjaxDto<StandardLineStationRelationStation> delDtoRelation = this.standardLineService.getLineStationInfos(lineInfo.getId(), Integer.valueOf(lineDirect), Integer.valueOf(1), null, null);
              List<StandardLineStationRelationStation> delLstRelation = delDtoRelation.getPageList();
              delDtoRelation = null;
              for (int i = 0; i < lstRelation.size(); i++) {
                for (int j = 0; j < delLstRelation.size(); j++) {
                  if ((((StandardLineStationRelationStation)lstRelation.get(i)).getId() != null) && 
                    (((StandardLineStationRelationStation)lstRelation.get(i)).getId().equals(((StandardLineStationRelationStation)delLstRelation.get(j)).getId())))
                  {
                    delLstRelation.remove(j);
                    break;
                  }
                }
              }
              updateStationSum(Integer.valueOf(Integer.parseInt(lid)), Integer.valueOf(lineDirect), lstRelation.size(), true);
              this.standardLineService.batchSaveStationRelation(lstRelation, delLstRelation);
            }
            addCustomResponse("failedStation", failedStation);
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
  
  protected String genExcelTitle()
  {
    String id = getRequestString("id");
    String direct = getRequestString("direct");
    try
    {
      StandardCompany line = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(id)));
      if (line != null)
      {
        if (direct != null) {
          if (direct.equals("0")) {
            direct = "S";
          } else if (direct.equals("1")) {
            direct = "X";
          }
        }
        return line.getName() + direct;
      }
      return null;
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
    return null;
  }
  
  protected String[] genExcelHeads()
  {
    String[] heads = new String[12];
    int j = 0;
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������";
    heads[(j++)] = "��������������/����";
    heads[(j++)] = "����������������";
    return heads;
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      genStationData(sheet);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected void genStationData(HSSFSheet sheet)
  {
    String lid = getRequestString("id");
    String direct = getRequestString("direct");
    
    AjaxDto<StandardLineStationRelationStation> stationRelation = this.standardLineService.getLineStationInfos(Integer.valueOf(Integer.parseInt(lid)), 
      Integer.valueOf(Integer.parseInt(direct)), Integer.valueOf(1), " order by sindex asc ", null);
    if ((stationRelation != null) && (stationRelation.getPageList() != null))
    {
      int i = 0;
      for (int j = stationRelation.getPageList().size(); i < j; i++)
      {
        StandardLineStationRelationStation relation = (StandardLineStationRelationStation)stationRelation.getPageList().get(i);
        HSSFRow row = sheet.createRow(2 + i);
        int k = 0;
        
        HSSFCell cell = row.createCell(k++);
        cell.setCellValue(relation.getSindex().intValue() + 1);
        
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(relation.getStation().getName());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(getStationDirectEx(relation.getStation().getDirect()));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        cell.setCellValue(getStationTypeEx(relation.getStype()));
        
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(formatPosition(relation.getStation().getLngIn()));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(formatPosition(relation.getStation().getLatIn()));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(relation.getStation().getAngleIn().intValue());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(formatPosition(relation.getStation().getLngOut()));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(formatPosition(relation.getStation().getLngOut()));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        if (relation.getStation() != null) {
          cell.setCellValue(relation.getStation().getAngleOut().intValue());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(k++);
        cell.setCellValue(getSpeed(relation.getSpeed(), Integer.valueOf(1)));
        
        cell = row.createCell(k++);
        cell.setCellValue(getLiCheng(relation.getLen()));
      }
    }
  }
  
  private Integer getStationType(String typeName)
  {
    if (!isParamNull(typeName))
    {
      if (typeName.equals("������")) {
        return Integer.valueOf(0);
      }
      if (typeName.equals("������")) {
        return Integer.valueOf(1);
      }
      if (typeName.equals("����")) {
        return Integer.valueOf(2);
      }
      if (typeName.equals("����")) {
        return Integer.valueOf(3);
      }
      if (typeName.equals("����")) {
        return Integer.valueOf(4);
      }
      if (typeName.equals("������")) {
        return Integer.valueOf(5);
      }
    }
    return null;
  }
  
  private String getStationTypeEx(Integer type)
  {
    if (!isParamNull(type)) {
      switch (type.intValue())
      {
      case 0: 
        return "������";
      case 1: 
        return "������";
      case 2: 
        return "����";
      case 3: 
        return "����";
      case 4: 
        return "����";
      case 5: 
        return "������";
      }
    }
    return "";
  }
  
  private Integer getStationDirect(String directName)
  {
    if (!isParamNull(directName))
    {
      if (directName.equals("��")) {
        return Integer.valueOf(0);
      }
      if (directName.equals("��")) {
        return Integer.valueOf(1);
      }
      if (directName.equals("��")) {
        return Integer.valueOf(2);
      }
      if (directName.equals("��")) {
        return Integer.valueOf(3);
      }
    }
    return null;
  }
  
  private String getStationDirectEx(Integer direct)
  {
    if (!isParamNull(direct)) {
      switch (direct.intValue())
      {
      case 0: 
        return "��";
      case 1: 
        return "��";
      case 2: 
        return "��";
      case 3: 
        return "��";
      }
    }
    return "";
  }
  
  public String saveMoveStation()
  {
    try
    {
      StandardDeviceQuery stations = new StandardDeviceQuery();
      try
      {
        stations = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), StandardDeviceQuery.class);
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      if ((stations != null) && (!isParamNull(stations.getVehiIdnos())) && 
        (!isParamNull(stations.getCondiIdno())) && 
        (!isParamNull(stations.getSourceIdno())) && 
        (!isParamNull(stations.getTypeIdno())))
      {
        AjaxDto<StandardLineStationRelationStation> stationRelation = this.standardLineService.getLineStationInfos(Integer.valueOf(Integer.parseInt(stations.getVehiIdnos())), 
          Integer.valueOf(Integer.parseInt(stations.getCondiIdno())), Integer.valueOf(1), null, null);
        if ((stationRelation != null) && (stationRelation.getPageList() != null) && 
          (stationRelation.getPageList().size() > 0))
        {
          String[] ids = stations.getSourceIdno().split(",");
          
          String[] indexs = stations.getTypeIdno().split(",");
          
          int max = ids.length;
          if (max > indexs.length) {
            max = indexs.length;
          }
          Map<Integer, Integer> mapRelation = new HashMap();
          for (int i = 0; i < max; i++) {
            mapRelation.put(Integer.valueOf(Integer.parseInt(ids[i])), Integer.valueOf(Integer.parseInt(indexs[i])));
          }
          List<StandardLineStationRelationStation> lstRelation = stationRelation.getPageList();
          stationRelation = null;
          for (int i = lstRelation.size() - 1; i >= 0; i--) {
            if (mapRelation.get(((StandardLineStationRelationStation)lstRelation.get(i)).getId()) != null) {
              ((StandardLineStationRelationStation)lstRelation.get(i)).setSindex((Integer)mapRelation.get(((StandardLineStationRelationStation)lstRelation.get(i)).getId()));
            } else {
              lstRelation.remove(i);
            }
          }
          this.standardLineService.batchSaveStationRelation(lstRelation, null);
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
  
  public String searchStations()
  {
    try
    {
      String name = getRequest().getParameter("name");
      if (!isParamNull(name))
      {
        String condition = String.format(" and (name like '%%%s%%' or abbr like '%%%s%%' or remark like '%%%s%%') ", new Object[] { name, name, name });
        AjaxDto<StandardStationInfo> staDto = this.standardLineService.getStationInfos(null, null, Integer.valueOf(1), condition, getPaginationEx());
        addCustomResponse("infos", staDto.getPageList());
        addCustomResponse("pagination", staDto.getPagination());
      }
      else
      {
        addCustomResponse("infos", null);
        addCustomResponse("pagination", null);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveLineStationRelation()
  {
    try
    {
      String lid = getRequestString("lid");
      String direct = getRequestString("direct");
      String sid = getRequestString("sid");
      if ((!isParamNull(lid)) && (!isParamNull(direct)) && (!isParamNull(sid)))
      {
        StandardCompany lineInfo = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(lid)));
        StandardUserAccount userAccount = (StandardUserAccount)getSession().get("userAccount");
        if ((isAdmin()) || (isBelongCompany(userAccount.getCompany().getId(), lineInfo.getParentId())))
        {
          StandardLineStationRelationStation relation = this.standardLineService.getLineStationRelation(Integer.valueOf(Integer.parseInt(lid)), 
            Integer.valueOf(Integer.parseInt(sid)), Integer.valueOf(Integer.parseInt(direct)), null, null);
          if (relation == null)
          {
            StandardLineStationRelation relation_ = new StandardLineStationRelation();
            relation_.setLid(Integer.valueOf(Integer.parseInt(lid)));
            relation_.setSid(Integer.valueOf(Integer.parseInt(sid)));
            relation_.setDirect(Integer.valueOf(Integer.parseInt(direct)));
            
            Integer maxIndex = this.standardLineService.getMaxStationIndex(relation_.getLid(), relation_.getDirect(), null);
            if (maxIndex == null) {
              maxIndex = Integer.valueOf(0);
            } else {
              maxIndex = Integer.valueOf(maxIndex.intValue() + 1);
            }
            relation_.setSindex(maxIndex);
            relation_.setLen(Integer.valueOf(0));
            relation_.setSpeed(Integer.valueOf(0));
            relation_.setStype(Integer.valueOf(3));
            
            this.standardLineService.save(relation_);
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
  
  public void report()
  {
    try
    {
      String format = getRequestString("format");
      String name = getRequestString("name");
      String lid = getRequestString("id");
      String direct = getRequestString("direct");
      String disposition = getRequestString("disposition");
      
      String reportTitle = "";
      StandardCompany line = (StandardCompany)this.standardLineService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(lid)));
      if (line != null)
      {
        reportTitle = line.getName();
        if (direct != null) {
          if (direct.equals("0")) {
            reportTitle = reportTitle + "S";
          } else if (direct.equals("1")) {
            reportTitle = reportTitle + "X";
          }
        }
      }
      AjaxDto<StandardLineStationRelationStation> stationRelation = this.standardLineService.getLineStationInfos(Integer.valueOf(Integer.parseInt(lid)), 
        Integer.valueOf(Integer.parseInt(direct)), Integer.valueOf(1), " order by sindex asc ", null);
      List<Map> list = new ArrayList();
      if ((stationRelation != null) && (stationRelation.getPageList() != null))
      {
        int i = 0;
        for (int j = stationRelation.getPageList().size(); i < j; i++)
        {
          StandardLineStationRelationStation relation = (StandardLineStationRelationStation)stationRelation.getPageList().get(i);
          Map map = new HashMap();
          map.put("sindex", relation.getSindex());
          map.put("name", relation.getStation().getName());
          map.put("direct", getStationDirectEx(relation.getStation().getDirect()));
          map.put("stype", getStationTypeEx(relation.getStype()));
          map.put("lngIn", formatPosition(relation.getStation().getLngIn()));
          map.put("latIn", formatPosition(relation.getStation().getLatIn()));
          map.put("angleIn", relation.getStation().getAngleIn());
          map.put("speed", getSpeed(relation.getSpeed(), Integer.valueOf(1)));
          map.put("len", getLiCheng(relation.getLen()));
          list.add(map);
        }
      }
      Map mapHeads = new HashMap();
      mapHeads.put("sindex", "��������");
      mapHeads.put("name", "��������");
      mapHeads.put("direct", "��������");
      mapHeads.put("stype", "��������");
      mapHeads.put("lngIn", "��������");
      mapHeads.put("latIn", "��������");
      mapHeads.put("angleIn", "��������");
      mapHeads.put("speed", "��������");
      mapHeads.put("len", "������������");
      
      ReportPrint print = null;
      try
      {
        print = getReportCreate().createReport(name);
        
        print.setMapHeads(mapHeads);
        print.setReportTitle(reportTitle);
        print.setDateSource(list);
        
        print.setFormat(format);
        print.setDocumentName(name);
        print.setDisposition(disposition);
        print.exportReport();
      }
      catch (IOException e)
      {
        e.printStackTrace();
      }
      catch (ServletException e)
      {
        e.printStackTrace();
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
      return;
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
  }
  
  protected void addLineLog(Integer subType, StandardCompany line)
  {
    addUserLog(Integer.valueOf(21), subType, null, line.getId().toString(), line.getName(), null, null);
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_OPERATION.toString());
  }
}
