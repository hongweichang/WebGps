package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardUserAccount;
import com.gps808.model.StandardVehicle;
import com.gps808.model.StandardVehicleInvoice;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.vo.StandardDeviceQuery;
import com.gps808.report.vo.StandardInvoiceSummary;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;
import javax.servlet.http.HttpServletRequest;

public class StandardReportInvoiceAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  public String detail()
    throws Exception
  {
    try
    {
      String beginDate = getRequestString("begintime");
      String endDate = getRequestString("endtime");
      if ((beginDate == null) || (endDate == null) || 
        (!DateUtil.isLongTimeValid(beginDate)) || (!DateUtil.isLongTimeValid(endDate)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
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
        AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(beginDate, endDate, query.getVehiIdnos().split(","), childIds, status, getPaginationEx());
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
  
  public String summary()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String handleStatus = getRequestString("handleStatus");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardDeviceQuery query = new StandardDeviceQuery();
        query = (StandardDeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        AjaxDto<StandardInvoiceSummary> invoiceAjaxDto = new AjaxDto();
        if ((handleStatus != null) && (!handleStatus.isEmpty()) && ("1".equals(handleStatus)))
        {
          String[] vehicles = query.getVehiIdnos().split(",");
          String chdIds = "";
          for (int i = 0; i < vehicles.length; i++)
          {
            List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
            if (childIds != null)
            {
              if (!chdIds.equals("")) {
                chdIds = chdIds + ",";
              }
              for (int j = 0; j < childIds.size(); j++) {
                chdIds = chdIds + childIds.get(j) + ",";
              }
              chdIds = chdIds + vehicles[i];
            }
          }
          String[] childComIds = chdIds.split(",");
          Set<String> set = new TreeSet();
          for (int i = 0; i < childComIds.length; i++) {
            set.add(childComIds[i]);
          }
          childComIds = (String[])set.toArray(new String[0]);
          List<Integer> comIds = new ArrayList();
          if ((childComIds != null) && (childComIds.length > 0)) {
            for (int i = 0; i < childComIds.length; i++) {
              comIds.add(Integer.valueOf(Integer.parseInt(childComIds[i])));
            }
          }
          AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(begintime, endtime, null, comIds, null, null);
          invoiceAjaxDto = doComSum(ajaxDto.getPageList(), query.getVehiIdnos().split(","), getPaginationEx());
        }
        else
        {
          AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(begintime, endtime, query.getVehiIdnos().split(","), null, null, null);
          invoiceAjaxDto = doSummary(ajaxDto.getPageList(), query.getVehiIdnos().split(","), getPaginationEx());
        }
        addCustomResponse("infos", invoiceAjaxDto.getPageList());
        addCustomResponse("pagination", invoiceAjaxDto.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  protected AjaxDto<StandardInvoiceSummary> doSummary(List<StandardVehicleInvoice> invoices, String[] vehicles, Pagination pagination)
  {
    List<StandardInvoiceSummary> summarys = new ArrayList();
    Map<String, StandardInvoiceSummary> summarysMap = new LinkedHashMap();
    if ((invoices != null) && (invoices.size() > 0)) {
      for (int i = invoices.size() - 1; i >= 0; i--)
      {
        StandardVehicleInvoice invoice = (StandardVehicleInvoice)invoices.get(i);
        doStandardReportSummaryEx(summarysMap, invoice);
      }
    }
    for (Iterator<Map.Entry<String, StandardInvoiceSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardInvoiceSummary> entry = (Map.Entry)it.next();
      StandardInvoiceSummary summary = (StandardInvoiceSummary)entry.getValue();
      summarys.add(summary);
    }
    int start = 0;int index = summarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(summarys.size());
      if (summarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardInvoiceSummary> summarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      summarys2.add((StandardInvoiceSummary)summarys.get(i));
    }
    AjaxDto<StandardInvoiceSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(summarys2);
    return dtoSummary;
  }
  
  private void doStandardReportSummaryEx(Map<String, StandardInvoiceSummary> summarysMap, StandardVehicleInvoice invoice)
  {
    String key = invoice.getVehicle().getVehiIDNO();
    StandardInvoiceSummary summary = (StandardInvoiceSummary)summarysMap.get(key);
    if (summary == null)
    {
      summary = new StandardInvoiceSummary();
      summary.setVehiIdno(key);
      summary.setPlateType(invoice.getVehicle().getPlateType());
      summary.setCount(Integer.valueOf(1));
      if (invoice.getCargoWeight() != null) {
        summary.setWeight(Double.valueOf(Double.parseDouble(invoice.getCargoWeight())));
      } else {
        summary.setWeight(Double.valueOf(0.0D));
      }
      Double liCheng = Double.valueOf(0.0D);
      if ((invoice.getEndLiCheng() != null) && (!invoice.getEndLiCheng().isEmpty()) && (invoice.getStartLiCheng() != null) && (!invoice.getStartLiCheng().isEmpty())) {
        liCheng = Double.valueOf(Double.parseDouble(invoice.getEndLiCheng()) - Double.parseDouble(invoice.getStartLiCheng()));
      }
      summary.setLiCheng(liCheng);
    }
    else
    {
      summary.setCount(Integer.valueOf(summary.getCount().intValue() + 1));
      if (invoice.getCargoWeight() != null) {
        summary.setWeight(Double.valueOf(summary.getWeight().doubleValue() + Double.parseDouble(invoice.getCargoWeight())));
      }
      Double liCheng = Double.valueOf(0.0D);
      if ((invoice.getEndLiCheng() != null) && (!invoice.getEndLiCheng().isEmpty()) && (invoice.getStartLiCheng() != null) && (!invoice.getStartLiCheng().isEmpty())) {
        liCheng = Double.valueOf(Double.parseDouble(invoice.getEndLiCheng()) - Double.parseDouble(invoice.getStartLiCheng()));
      }
      summary.setLiCheng(Double.valueOf(summary.getLiCheng().doubleValue() + liCheng.doubleValue()));
    }
    if ((summary.getStartTime() == null) || (DateUtil.compareDate(summary.getStartTime(), invoice.getSendStartTime()))) {
      summary.setStartTime(invoice.getSendStartTime());
    }
    if ((summary.getEndTime() == null) || (DateUtil.compareDate(invoice.getSendEndTime(), summary.getEndTime()))) {
      summary.setEndTime(invoice.getSendEndTime());
    }
    summarysMap.put(key, summary);
  }
  
  protected AjaxDto<StandardInvoiceSummary> doComSum(List<StandardVehicleInvoice> invoices, String[] vehicles, Pagination pagination)
  {
    String chdIds = "";
    for (int i = 0; i < vehicles.length; i++)
    {
      List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
      if (childIds != null)
      {
        if (!chdIds.equals("")) {
          chdIds = chdIds + ",";
        }
        for (int j = 0; j < childIds.size(); j++) {
          chdIds = chdIds + childIds.get(j) + ",";
        }
        chdIds = chdIds + vehicles[i];
      }
    }
    String[] childComIds = chdIds.split(",");
    Set<String> set = new TreeSet();
    for (int i = 0; i < childComIds.length; i++) {
      set.add(childComIds[i]);
    }
    childComIds = (String[])set.toArray(new String[0]);
    Map<String, String> comAndPar = new HashMap();
    for (int i = 0; i < childComIds.length; i++)
    {
      String parIds = "";
      List<Integer> parentIds = findUserChildIdList(Integer.valueOf(Integer.parseInt(childComIds[i])));
      if (parentIds != null) {
        for (int j = 0; j < parentIds.size(); j++) {
          parIds = parIds + parentIds.get(j) + ",";
        }
      }
      parIds = parIds + childComIds[i];
      comAndPar.put(childComIds[i], parIds);
    }
    List<StandardInvoiceSummary> summarys = new ArrayList();
    Map<String, StandardInvoiceSummary> summarysMap = new LinkedHashMap();
    if ((invoices != null) && (invoices.size() > 0)) {
      for (int i = invoices.size() - 1; i >= 0; i--)
      {
        StandardVehicleInvoice invoice = (StandardVehicleInvoice)invoices.get(i);
        doReportComSumEx(summarysMap, invoice, comAndPar, Boolean.valueOf(true));
      }
    }
    for (Iterator<Map.Entry<String, StandardInvoiceSummary>> it = summarysMap.entrySet().iterator(); it.hasNext();)
    {
      Map.Entry<String, StandardInvoiceSummary> entry = (Map.Entry)it.next();
      for (int i = 0; i < vehicles.length; i++) {
        if (((StandardInvoiceSummary)entry.getValue()).getVehiIdno().toString().equals(vehicles[i]))
        {
          StandardInvoiceSummary summary = (StandardInvoiceSummary)entry.getValue();
          summarys.add(summary);
          break;
        }
      }
    }
    int start = 0;int index = summarys.size();
    if (pagination != null)
    {
      pagination.setTotalRecords(summarys.size());
      if (summarys.size() >= pagination.getPageRecords())
      {
        index = pagination.getCurrentPage() * pagination.getPageRecords();
        if (index > pagination.getTotalRecords()) {
          index = pagination.getTotalRecords();
        }
      }
      start = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
      pagination = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), pagination.getTotalRecords(), pagination.getSortParams());
    }
    List<StandardInvoiceSummary> summarys2 = new ArrayList();
    for (int i = start; i < index; i++) {
      summarys2.add((StandardInvoiceSummary)summarys.get(i));
    }
    AjaxDto<StandardInvoiceSummary> dtoSummary = new AjaxDto();
    dtoSummary.setPagination(pagination);
    dtoSummary.setPageList(summarys2);
    return dtoSummary;
  }
  
  private void doReportComSumEx(Map<String, StandardInvoiceSummary> summarysMap, StandardVehicleInvoice invoice, Map<String, String> comAndPar, Boolean isdaily)
  {
    String parid = (String)comAndPar.get(invoice.getCompanyId().toString());
    if ((parid != null) && (!parid.isEmpty()))
    {
      String[] parids = parid.split(",");
      for (int i = 0; i < parids.length; i++)
      {
        String key = parids[i];
        StandardInvoiceSummary summary = (StandardInvoiceSummary)summarysMap.get(key);
        if (summary == null)
        {
          summary = new StandardInvoiceSummary();
          summary.setVehiIdno(key);
          summary.setCount(Integer.valueOf(1));
          summary.setWeight(Double.valueOf(Double.parseDouble(invoice.getCargoWeight())));
          Double liCheng = Double.valueOf(0.0D);
          if ((invoice.getEndLiCheng() != null) && (!invoice.getEndLiCheng().isEmpty()) && (invoice.getStartLiCheng() != null) && (!invoice.getStartLiCheng().isEmpty())) {
            liCheng = Double.valueOf(Double.parseDouble(invoice.getEndLiCheng()) - Double.parseDouble(invoice.getStartLiCheng()));
          }
          summary.setLiCheng(liCheng);
        }
        else
        {
          summary.setCount(Integer.valueOf(summary.getCount().intValue() + 1));
          summary.setWeight(Double.valueOf(summary.getWeight().doubleValue() + Double.parseDouble(invoice.getCargoWeight())));
          Double liCheng = Double.valueOf(0.0D);
          if ((invoice.getEndLiCheng() != null) && (!invoice.getEndLiCheng().isEmpty()) && (invoice.getStartLiCheng() != null) && (!invoice.getStartLiCheng().isEmpty())) {
            liCheng = Double.valueOf(Double.parseDouble(invoice.getEndLiCheng()) - Double.parseDouble(invoice.getStartLiCheng()));
          }
          summary.setLiCheng(Double.valueOf(summary.getLiCheng().doubleValue() + liCheng.doubleValue()));
        }
        if ((summary.getStartTime() == null) || (DateUtil.compareDate(summary.getStartTime(), invoice.getSendStartTime()))) {
          summary.setStartTime(invoice.getSendStartTime());
        }
        if ((summary.getEndTime() == null) || (DateUtil.compareDate(invoice.getSendEndTime(), summary.getEndTime()))) {
          summary.setEndTime(invoice.getSendEndTime());
        }
        summarysMap.put(key, summary);
      }
    }
  }
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[13];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("��������");
    heads[4] = getText("��������");
    heads[5] = getText("����(����)");
    heads[6] = getText("��������");
    heads[7] = getText("��������(kg)");
    heads[8] = getText("����(��)");
    heads[9] = getText("��������(��)");
    heads[10] = getText("������(��)");
    heads[11] = getText("������(��)");
    heads[12] = getText("��������(��)");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
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
    AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(begintime, endtime, vehiIdnos.split(","), childIds, status, null);
    List<StandardVehicleInvoice> invoices = ajaxDto.getPageList();
    if (invoices != null) {
      for (int i = 1; i <= invoices.size(); i++)
      {
        StandardVehicleInvoice invoice = (StandardVehicleInvoice)invoices.get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), invoice.getVehicle().getVehiIDNO());
        
        String plateColor = getText("other");
        switch (invoice.getVehicle().getPlateType().intValue())
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
        if (invoice.getSendStartTime() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(invoice.getSendStartTime()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if (invoice.getSendEndTime() != null) {
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(invoice.getSendEndTime()));
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if ((invoice.getEndLiCheng() != null) && (!invoice.getEndLiCheng().isEmpty()) && (invoice.getStartLiCheng() != null) && (!invoice.getStartLiCheng().isEmpty()))
        {
          Double end = Double.valueOf(Double.parseDouble(invoice.getEndLiCheng()));
          Double start = Double.valueOf(Double.parseDouble(invoice.getStartLiCheng()));
          Double licheng = Double.valueOf(end.doubleValue() - start.doubleValue());
          DecimalFormat df = new DecimalFormat("#0.00");
          export.setCellValue(Integer.valueOf(j++), df.format(licheng));
        }
        else
        {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), invoice.getCargoName());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getCargoWeight());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getUnitPrice());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getNuclearFees());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getParkingFee());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getRoadToll());
        
        export.setCellValue(Integer.valueOf(j++), invoice.getCollectionCosts());
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("��������������");
  }
  
  protected boolean isCompany()
  {
    String type = getRequest().getParameter("handleStatus");
    return (type != null) && (type.equals("1"));
  }
  
  protected String[] genSummaryHeads()
  {
    if (isCompany())
    {
      String[] heads = new String[7];
      heads[0] = getText("report.index");
      heads[1] = getText("report.company");
      heads[2] = getText("��������");
      heads[3] = getText("��������");
      heads[4] = getText("��������");
      heads[5] = getText("��������(kg)");
      heads[6] = getText("����(����)");
      return heads;
    }
    String[] heads = new String[8];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("��������");
    heads[4] = getText("��������");
    heads[5] = getText("��������");
    heads[6] = getText("��������(kg)");
    heads[7] = getText("����(����)");
    return heads;
  }
  
  protected void genSummaryData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String vehiIdnos, ExportReport export)
  {
    AjaxDto<StandardInvoiceSummary> invoiceAjaxDto = new AjaxDto();
    if (isCompany())
    {
      String[] vehicles = vehiIdnos.split(",");
      String chdIds = "";
      for (int i = 0; i < vehicles.length; i++)
      {
        List<Integer> childIds = findUserChildCompanyIdList(Integer.valueOf(Integer.parseInt(vehicles[i])), null, false);
        if (childIds != null)
        {
          if (!chdIds.equals("")) {
            chdIds = chdIds + ",";
          }
          for (int j = 0; j < childIds.size(); j++) {
            chdIds = chdIds + childIds.get(j) + ",";
          }
          chdIds = chdIds + vehicles[i];
        }
      }
      String[] childComIds = chdIds.split(",");
      Set<String> set = new TreeSet();
      for (int i = 0; i < childComIds.length; i++) {
        set.add(childComIds[i]);
      }
      childComIds = (String[])set.toArray(new String[0]);
      List<Integer> comIds = new ArrayList();
      if ((childComIds != null) && (childComIds.length > 0)) {
        for (int i = 0; i < childComIds.length; i++) {
          comIds.add(Integer.valueOf(Integer.parseInt(childComIds[i])));
        }
      }
      AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(begintime, endtime, null, comIds, null, null);
      invoiceAjaxDto = doComSum(ajaxDto.getPageList(), vehiIdnos.split(","), null);
    }
    else
    {
      AjaxDto<StandardVehicleInvoice> ajaxDto = this.standardUserService.getVehicleInvoices(begintime, endtime, vehiIdnos.split(","), null, null, null);
      invoiceAjaxDto = doSummary(ajaxDto.getPageList(), vehiIdnos.split(","), null);
    }
    for (int i = 1; i <= invoiceAjaxDto.getPageList().size(); i++)
    {
      StandardInvoiceSummary summary = (StandardInvoiceSummary)invoiceAjaxDto.getPageList().get(i - 1);
      int j = 0;
      export.setExportData(Integer.valueOf(1 + i));
      
      export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
      if (isCompany())
      {
        StandardCompany company = (StandardCompany)this.standardUserService.getObject(StandardCompany.class, Integer.valueOf(Integer.parseInt(summary.getVehiIdno())));
        export.setCellValue(Integer.valueOf(j++), company.getName());
      }
      else
      {
        export.setCellValue(Integer.valueOf(j++), summary.getVehiIdno().split(",")[0]);
        
        String plateColor = getText("other");
        switch (summary.getPlateType().intValue())
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
      }
      if (summary.getStartTime() != null) {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getStartTime()));
      } else {
        export.setCellValue(Integer.valueOf(j++), "");
      }
      if (summary.getEndTime() != null) {
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(summary.getEndTime()));
      } else {
        export.setCellValue(Integer.valueOf(j++), "");
      }
      export.setCellValue(Integer.valueOf(j++), summary.getCount());
      export.setCellValue(Integer.valueOf(j++), summary.getWeight());
      DecimalFormat df = new DecimalFormat("#0.00");
      export.setCellValue(Integer.valueOf(j++), df.format(summary.getLiCheng()));
    }
  }
  
  protected String genSummaryTitle()
  {
    return getText("��������������");
  }
}
