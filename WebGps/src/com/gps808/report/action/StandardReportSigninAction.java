package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps808.model.StandardDriverSignin;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleMediaService;
import com.gps808.report.vo.StandardDeviceQuery;
import java.util.Date;
import java.util.List;

public class StandardReportSigninAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private StandardVehicleMediaService standardVehicleMediaService;
  
  public StandardVehicleMediaService getStandardVehicleMediaService()
  {
    return this.standardVehicleMediaService;
  }
  
  public void setStandardVehicleMediaService(StandardVehicleMediaService standardVehicleMediaService)
  {
    this.standardVehicleMediaService = standardVehicleMediaService;
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      String toMap = getRequestString("toMap");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isLongTimeValid(beginDate)) || (!DateUtil.isLongTimeValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        int mapType;
        try
        {
          mapType = Integer.parseInt(toMap);
        }
        catch (Exception e)
        {
          
          mapType = 2;
        }
        AjaxDto<StandardDriverSignin> dtoSummary = this.standardVehicleMediaService.queryDriverSignin(beginDate, endDate, query.getVehiIdnos().split(","), getPaginationEx());
        if ((dtoSummary.getPageList() != null) && (dtoSummary.getPageList().size() > 0))
        {
          List<StandardDriverSignin> driverSignins = dtoSummary.getPageList();
          for (int i = 0; i < driverSignins.size(); i++)
          {
            ((StandardDriverSignin)driverSignins.get(i)).setTl(getTimeDifference(((StandardDriverSignin)driverSignins.get(i)).getEt().getTime() - ((StandardDriverSignin)driverSignins.get(i)).getSt().getTime()));
            ((StandardDriverSignin)driverSignins.get(i)).setSp(getMapPositionEx(((StandardDriverSignin)driverSignins.get(i)).getSjd(), ((StandardDriverSignin)driverSignins.get(i)).getSwd(), mapType, Boolean.valueOf(true)));
            ((StandardDriverSignin)driverSignins.get(i)).setEp(getMapPositionEx(((StandardDriverSignin)driverSignins.get(i)).getEjd(), ((StandardDriverSignin)driverSignins.get(i)).getEwd(), mapType, Boolean.valueOf(true)));
          }
        }
        addCustomResponse("infos", dtoSummary.getPageList());
        addCustomResponse("pagination", dtoSummary.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[12];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.device.no");
    heads[4] = getText("report.driver.name");
    heads[5] = getText("report.driver.certificate");
    heads[6] = getText("report.begintime");
    heads[7] = getText("report.endtime");
    heads[8] = getText("report.normal.begin.position");
    heads[9] = getText("report.normal.end.position");
    heads[10] = getText("report.driver.times");
    heads[11] = getText("report.dispatch.status");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardDriverSignin> dtoSummary = this.standardVehicleMediaService.queryDriverSignin(begintime, endtime, vehiIdnos.split(","), null);
    List<StandardDriverSignin> signins = dtoSummary.getPageList();
    if (signins != null) {
      for (int i = 1; i <= signins.size(); i++)
      {
        StandardDriverSignin signin = (StandardDriverSignin)signins.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), signin.getVid());
        
        String plateColor = getText("other");
        switch (signin.getPt().intValue())
        {
        case 1: 
          plateColor = getText("blue.label");
          break;
        case 2: 
          plateColor = getText("yellow.label");
          break;
        case 3: 
          plateColor = getText("black.label");
          break;
        case 4: 
          plateColor = getText("white.label");
          break;
        case 0: 
          plateColor = getText("other");
          break;
        }
        export.setCellValue(Integer.valueOf(j++), plateColor);
        export.setCellValue(Integer.valueOf(j++), signin.getDid());
        export.setCellValue(Integer.valueOf(j++), signin.getDn());
        export.setCellValue(Integer.valueOf(j++), signin.getJn());
        if (signin.getSt() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(signin.getSt()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (signin.getEt() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(signin.getEt()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), getMapPositionEx(signin.getSjd(), signin.getSwd(), toMap.intValue(), Boolean.valueOf(true)));
        
        export.setCellValue(Integer.valueOf(j++), getMapPositionEx(signin.getEjd(), signin.getEwd(), toMap.intValue(), Boolean.valueOf(true)));
        export.setCellValue(Integer.valueOf(j++), getTimeDifference(signin.getEt().getTime() - signin.getSt().getTime()));
        String sign = getText("report.signin.abnormal");
        switch (signin.getPt().intValue())
        {
        case 1: 
          sign = getText("report.signin.normal");
          break;
        case 0: 
          sign = getText("report.signin.abnormal");
        }
        export.setCellValue(Integer.valueOf(j++), sign);
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.driver.signin");
  }
}
