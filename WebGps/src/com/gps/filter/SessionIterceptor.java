package com.gps.filter;

import com.framework.exception.AppException;
import com.framework.web.action.FileUploadAction;
import com.framework.web.action.RandomPictureAction;
import com.gps.common.action.ApiBaseAction;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.action.SysBaseAction;
import com.gps.common.action.UserBaseAction;
import com.gps.monitor.action.PositionAction;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.system.action.SysAdAndNewsAction;
import com.gps.system.action.SysLoginAction;
import com.gps.track.action.TrackAction;
import com.gps.user.action.LoginAction;
import com.gps808.api.action.StandardApiAction;
import com.gps808.operationManagement.action.StandardLoginAction;
import com.gps808.vdo.action.Status;
import com.gps808.vdo.action.Vdo;
import com.gps808.vdo.action.VdoE;
import com.gz.system.action.GzBkLoginAction;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.ActionProxy;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import java.util.Map;

public class SessionIterceptor
  extends AbstractInterceptor
{
  private static final long serialVersionUID = 2533467556093192572L;
  
  public String intercept(ActionInvocation invocation)
    throws Exception
  {
    Action action = (Action)invocation.getAction();
    if ((action instanceof SysLoginAction)) {
      return invocation.invoke();
    }
    if ((action instanceof RandomPictureAction)) {
      return invocation.invoke();
    }
    if ((action instanceof FileUploadAction)) {
      return invocation.invoke();
    }
    if ((action instanceof LoginAction)) {
      return invocation.invoke();
    }
    if ((action instanceof StandardLoginAction)) {
      return invocation.invoke();
    }
    if ((action instanceof PositionAction)) {
      return invocation.invoke();
    }
    if ((action instanceof TrackAction)) {
      return invocation.invoke();
    }
    if ((action instanceof ApiBaseAction)) {
      return invocation.invoke();
    }
    if ((action instanceof StandardApiAction)) {
      return invocation.invoke();
    }
    if ((action instanceof Vdo)) {
      return invocation.invoke();
    }
    if ((action instanceof VdoE)) {
      return invocation.invoke();
    }
    if ((action instanceof Status)) {
      return invocation.invoke();
    }
    if ((action instanceof SysAdAndNewsAction)) {
      return invocation.invoke();
    }
    if ((action instanceof GzBkLoginAction)) {
      return invocation.invoke();
    }
    Map session = ActionContext.getContext().getSession();
    if ((action instanceof SysBaseAction))
    {
      if (session.get("sysuser") == null) {
        throw new AppException(2);
      }
      return invocation.invoke();
    }
    if ((action instanceof UserBaseAction))
    {
      String method = invocation.getProxy().getMethod();
      if (((action instanceof ReportBaseAction)) && (method.indexOf("Excel") != -1))
      {
        ReportBaseAction reportAction = (ReportBaseAction)action;
        if (session.get("account") == null)
        {
          reportAction.setHasExcelRight(false);
          reportAction.setExcelError(reportAction.getText("report.excel.err.sessionunvalid"));
        }
        else if (!reportAction.hasOperatorPrivi())
        {
          reportAction.setHasExcelRight(false);
          reportAction.setExcelError(reportAction.getText("report.excel.err.noright"));
        }
        return invocation.invoke();
      }
      if (session.get("account") == null) {
        throw new AppException(2);
      }
      UserBaseAction userAction = (UserBaseAction)action;
      if (userAction.hasOperatorPrivi()) {
        return invocation.invoke();
      }
      throw new AppException(24);
    }
    if ((action instanceof StandardUserBaseAction))
    {
      if (session.get("userAccount") == null) {
        throw new AppException(2);
      }
      return invocation.invoke();
    }
    return invocation.invoke();
  }
}
