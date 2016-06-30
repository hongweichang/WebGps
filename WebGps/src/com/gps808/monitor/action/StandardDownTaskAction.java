package com.gps808.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps808.model.StandardDownTask;
import com.gps808.model.StandardUserRole;
import com.gps808.monitor.service.StandardMonitorService;
import javax.servlet.http.HttpServletRequest;

public class StandardDownTaskAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_MONITORING.toString());
  }
  
  public String getWifiDownTaskList()
  {
    try
    {
      String vehiIdno = getRequest().getParameter("vehiIdno");
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((vehiIdno == null) || (vehiIdno.isEmpty()) || (begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String status = getRequestString("status");
        String label = getRequest().getParameter("label");
        String condition = "";
        if ((status != null) && ((status.equals("0")) || (status.equals("1")) || (status.equals("2")))) {
          condition = condition + String.format(" and stu = %d ", new Object[] { Integer.valueOf(Integer.parseInt(status)) });
        }
        if ((label != null) && (!label.isEmpty())) {
          condition = condition + String.format(" and lab like '%%%s%%' ", new Object[] { label });
        }
        AjaxDto<StandardDownTask> dtoDownTask = this.standardMonitorService.getDownTaskList(vehiIdno, begintime, endtime, condition, getPaginationEx());
        
        addCustomResponse("infos", dtoDownTask.getPageList());
        addCustomResponse("pagination", dtoDownTask.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String saveWifiDownTask()
  {
    try
    {
      StandardDownTask task = new StandardDownTask();
      try
      {
        task = (StandardDownTask)AjaxUtils.getObject(getRequest(), task.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((task != null) && (task.getVid() != null) && (!task.getVid().isEmpty()) && (task.getTyp() != null) && 
        (task.getBtm() != null) && (task.getEtm() != null) && (DateUtil.compareDate(task.getEtm(), task.getBtm())))
      {
        task.setChn(Integer.valueOf(98));
        task.setStu(Integer.valueOf(0));
        this.standardMonitorService.save(task);
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
  
  public String deleteWifiDownTask()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (!id.isEmpty()))
      {
        String[] ids = id.split(",");
        for (int i = 0; i < ids.length; i++)
        {
          StandardDownTask task = (StandardDownTask)this.standardMonitorService.getObject(StandardDownTask.class, Integer.valueOf(Integer.parseInt(ids[i])));
          if (task != null) {
            this.standardMonitorService.delete(task);
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
}
