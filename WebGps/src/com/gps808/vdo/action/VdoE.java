package com.gps808.vdo.action;

import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.system.model.ServerLog;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.vdo.Vo.ErrorLog;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class VdoE
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String errorList()
  {
    try
    {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
      Date dateNow = new Date();
      Calendar cl = Calendar.getInstance();
      cl.setTime(dateNow);
      cl.add(6, 1);
      cl.add(2, -1);
      Date dateFrom = cl.getTime();
      String begin = sdf.format(dateFrom) + " 00:00:00";
      String end = sdf.format(dateNow) + " 23:59:59";
      String type = getRequestString("type");
      AjaxDto<ServerLog> ajaxDto = this.standardUserService.getServerLog(begin, end, type);
      List<ErrorLog> errorLog = new ArrayList();
      if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
        for (int i = 0; i < ajaxDto.getPageList().size(); i++)
        {
          ErrorLog log = new ErrorLog();
          log.setContent(((ServerLog)ajaxDto.getPageList().get(i)).getContent());
          log.setDtime(DateUtil.dateSwitchString(((ServerLog)ajaxDto.getPageList().get(i)).getDtime()));
          errorLog.add(log);
        }
      }
      addCustomResponse("errorLog", errorLog);
    }
    catch (Exception localException) {}
    return "success";
  }
}
