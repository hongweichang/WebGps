package com.framework.web.result;

import com.framework.exception.AppException;
import com.framework.utils.AjaxUtils;
import com.framework.web.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.ExceptionHolder;
import com.opensymphony.xwork2.util.ValueStack;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.lang.reflect.UndeclaredThrowableException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.dispatcher.StrutsResultSupport;

public class CustomJsonResult
  extends StrutsResultSupport
{
  private static final long serialVersionUID = 1L;
  private static final Log log = LogFactory.getLog(CustomJsonResult.class);
  
  protected void doExecute(String finalLocation, ActionInvocation invocation)
    throws Exception
  {
    BaseAction bas = (BaseAction)invocation.getAction();
    bas.clearErrorsAndMessages();
    
    HttpServletResponse response = (HttpServletResponse)invocation.getInvocationContext().get("com.opensymphony.xwork2.dispatcher.HttpServletResponse");
    response.setContentType("text/html;charset=UTF-8");
    
    String json = null;
    
    Map customResponseMap = (Map)invocation.getStack().findValue("customResponseMap");
    if (customResponseMap == null) {
      customResponseMap = new HashMap();
    }
    if (customResponseMap.get(BaseAction.ACTION_RESULT) == null)
    {
      boolean exception = false;
      ValueStack s = invocation.getStack();
      for (int i = s.size(); i > 0; i--)
      {
        Object obj = s.pop();
        if ((obj instanceof ExceptionHolder))
        {
          exception = true;
          customResponseMap.put(BaseAction.ACTION_RESULT, "-1");
          ExceptionHolder e = (ExceptionHolder)obj;
          Object o = e.getException();
          if ((o instanceof UndeclaredThrowableException)) {
            o = ((UndeclaredThrowableException)o).getUndeclaredThrowable();
          }
          if ((o instanceof AppException))
          {
            AppException ae = (AppException)o;
            customResponseMap.put(BaseAction.ACTION_RESULT, Integer.valueOf(ae.getErrorCode()));
            break;
          }
          if (!(o instanceof Exception)) {
            break;
          }
          customResponseMap.put(BaseAction.ACTION_RESULT, Integer.valueOf(1));
          
          break;
        }
      }
      if (!exception) {
        customResponseMap.put(BaseAction.ACTION_RESULT, Integer.valueOf(0));
      }
    }
    String callback = bas.getRequestString("callback");
    if ((callback != null) && (!callback.isEmpty()))
    {
      StringBuilder builder = new StringBuilder(callback);
      builder.append("(");
      if (customResponseMap.containsKey(BaseAction.JSON_RESULT))
      {
        InputStreamReader inputStream = (InputStreamReader)customResponseMap.get(BaseAction.JSON_RESULT);
        BufferedReader reader = new BufferedReader(inputStream);
        for (;;)
        {
          String tempStr = reader.readLine();
          if (tempStr == null) {
            break;
          }
          builder.append(tempStr);
        }
        reader.close();
      }
      else
      {
        builder.append(AjaxUtils.toJson(customResponseMap, false));
      }
      builder.append(")");
      json = builder.toString();
    }
    else if (customResponseMap.containsKey(BaseAction.JSON_RESULT))
    {
      StringBuilder builder = new StringBuilder("");
      InputStreamReader inputStream = (InputStreamReader)customResponseMap.get(BaseAction.JSON_RESULT);
      BufferedReader reader = new BufferedReader(inputStream);
      for (;;)
      {
        String tempStr = reader.readLine();
        if (tempStr == null) {
          break;
        }
        builder.append(tempStr);
      }
      reader.close();
      json = builder.toString();
    }
    else
    {
      json = AjaxUtils.toJson(customResponseMap, false);
    }
    PrintWriter pw = response.getWriter();
    pw.println(json);
  }
}
