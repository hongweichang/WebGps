package com.gps.report.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.gps.model.UserAccountEx;
import com.gps.model.UserRole;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.model.DispatchCommand;
import com.gps.report.service.DispatchCommandService;
import com.gps.report.vo.DeviceQuery;
import com.opensymphony.xwork2.ActionContext;
import java.util.List;
import java.util.Map;

public class ReportDispatchAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = 1L;
  private DispatchCommandService dispatchCommandService;
  
  public DispatchCommandService getDispatchCommandService()
  {
    return this.dispatchCommandService;
  }
  
  public void setDispatchCommandService(DispatchCommandService dispatchCommandService)
  {
    this.dispatchCommandService = dispatchCommandService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_REPORT_EXTEND_DISPATCH_DETAIL);
  }
  
  public String detail()
    throws Exception
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      String status = getRequestString("status");
      String queryFilter = getRequestString("query");
      String qtype = getRequestString("qtype");
      String sortname = getRequestString("sortname");
      String sortorder = getRequestString("sortorder");
      String toMap = getRequestString("toMap");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceQuery query = new DeviceQuery();
        query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        
        AjaxDto<DispatchCommand> ajaxDto = this.dispatchCommandService.queryDispatchCommand(begintime, endtime, 
          query.getDevIdnos().split(","), status, getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        List<DispatchCommand> dispatchCommands = ajaxDto.getPageList();
        if (dispatchCommands != null) {
          for (int i = 0; i < dispatchCommands.size(); i++)
          {
            DispatchCommand dispatchCommand = (DispatchCommand)dispatchCommands.get(i);
            dispatchCommand.setDtimeStr(DateUtil.dateSwitchString(dispatchCommand.getDtime()));
            if (isGpsValid(Integer.valueOf(1)))
            {
              int mapType;
              try
              {
                mapType = Integer.parseInt(toMap);
              }
              catch (Exception e)
              {
               
                mapType = 2;
              }
              dispatchCommand.setPosition(getMapPosition(dispatchCommand.getJingDu(), dispatchCommand.getWeiDu(), mapType));
            }
          }
        }
        addCustomResponse("infos", dispatchCommands);
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
  
  protected String[] genDetailHeads()
  {
    String[] heads = new String[9];
    heads[0] = getText("report.index");
    heads[1] = getText("report.terminal");
    heads[2] = getText("report.dispatch.user");
    heads[3] = getText("report.dispatch.time");
    heads[4] = getText("report.dispatch.command");
    heads[5] = getText("report.dispatch.position");
    heads[6] = getText("report.dispatch.status");
    heads[7] = getText("report.dispatch.completeTime");
    heads[8] = getText("report.dispatch.completeDesc");
    return heads;
  }
  
  protected void genDetailData(String begintime, String endtime, String queryFilter, String qtype, String sortname, String sortorder, Integer toMap, String devIdnos, ExportReport export)
  {
    String status = getRequestString("status");
    AjaxDto<DispatchCommand> ajaxDto = this.dispatchCommandService.queryDispatchCommand(begintime, endtime, 
      devIdnos.split(","), status, null, queryFilter, qtype, sortname, sortorder);
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DispatchCommand command = (DispatchCommand)ajaxDto.getPageList().get(i - 1);
        int j = 0;
        export.setExportData(Integer.valueOf(1 + i));
        
        export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
        
        export.setCellValue(Integer.valueOf(j++), getDeviceNameInSession(command.getDevIdno()));
        if (command.getUser() != null) {
          export.setCellValue(Integer.valueOf(j++), command.getUser().getName());
        } else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(command.getDtime()));
        
        export.setCellValue(Integer.valueOf(j++), command.getCommand());
        if (isGpsValid(Integer.valueOf(1)))
        {
          if (ActionContext.getContext().getSession().get("showlocation").equals(Boolean.valueOf(true))) {
            export.setCellValue(Integer.valueOf(j++), getMapPosition(command.getJingDu(), command.getWeiDu(), toMap.intValue()));
          } else if ((command.getJingDu() == null) || (command.getJingDu().intValue() == 0) || 
            (command.getWeiDu() == null) || (command.getWeiDu().intValue() == 0)) {
            export.setCellValue(Integer.valueOf(j++), "");
          } else {
            export.setCellValue(Integer.valueOf(j++), getPosition(command.getWeiDu(), command.getJingDu(), Integer.valueOf(1)));
          }
        }
        else {
          export.setCellValue(Integer.valueOf(j++), "");
        }
        if ((command.getStatus() != null) && (command.getStatus().equals(Integer.valueOf(2))))
        {
          export.setCellValue(Integer.valueOf(j++), getText("report.dispatch.completeFinished"));
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(command.getCompleteTime()));
          
          export.setCellValue(Integer.valueOf(j++), command.getCompleteDesc());
        }
      }
    }
  }
  
  protected String genDetailTitle()
  {
    return getText("report.dispatch.detail");
  }
}
