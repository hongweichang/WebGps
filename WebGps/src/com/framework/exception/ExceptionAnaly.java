package com.framework.exception;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.sql.BatchUpdateException;
import java.sql.SQLException;
import javax.servlet.http.HttpServletResponse;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.hibernate.HibernateException;
import org.springframework.dao.DataIntegrityViolationException;

public class ExceptionAnaly
{
  public static boolean DEBUG = false;
  
  public static void applicationExp(HttpServletResponse response, Exception exp)
  {
    try
    {
      Document document = DocumentHelper.createDocument();
      Element root = document.addElement("error");
      root.addElement("msg").addText(analy(exp));
      response.setContentType("application/xml;charset=UTF-8");
      PrintWriter out = response.getWriter();
      System.out.println(document.asXML());
      document.write(out);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
  
  public static String analy(Exception e)
  {
    e.printStackTrace();
    StringBuffer err_desc = new StringBuffer();
    String classname = null;
    String errMsg = null;
    err_desc.append("返回信息: ");
    if ((e instanceof DataIntegrityViolationException)) {
      errMsg = hibernateExp(e);
    } else {
      errMsg = e.getCause() == null ? e.getMessage() : e.getCause().getMessage();
    }
    if (errMsg.indexOf("Batch update returned unexpected row count from update") >= 0) {
      errMsg = "操作数据已被其他用户删除!";
    } else if (errMsg.indexOf("Cannot delete or update a parent row") >= 0) {
      errMsg = "操作数据被引入，不能删除!";
    } else if (errMsg.indexOf("Cannot add or update a child row") >= 0) {
      errMsg = "主操作数据可能已被其他用户删除!(建议您刷新一次页面)";
    } else if (errMsg.indexOf("Duplicate entry") >= 0) {
      errMsg = "操作数据已存在!";
    }
    err_desc.append(errMsg);
    if (DEBUG)
    {
      err_desc.append("<table width=\"100%\" border=\"0\" cellpadding=\"3\" cellspacing=\"1\" bgcolor=\"#C1E0FF\">");
      err_desc.append("<tr>");
      err_desc.append("<td bgcolor=\"#FFFFFF\">").append("��").append("</td>");
      err_desc.append("<td bgcolor=\"#FFFFFF\">").append("����").append("</td>");
      err_desc.append("<td bgcolor=\"#FFFFFF\">").append("����").append("</td>");
      err_desc.append("</tr>");
      StackTraceElement[] ste = e.getStackTrace();
      for (int i = 0; i < ste.length; i++)
      {
        classname = ste[i].getClassName();
        if ((classname.startsWith("cn.isdt")) && 
          (!classname.endsWith("ActionServlet")))
        {
          err_desc.append("<tr>");
          err_desc.append("<td bgcolor=\"#FFFFFF\">").append(classname.replaceAll("cn.isdt", "pack")).append("</td>");
          err_desc.append("<td bgcolor=\"#FFFFFF\">").append(ste[i].getMethodName()).append("</td>");
          err_desc.append("<td bgcolor=\"#FFFFFF\">").append(ste[i].getLineNumber()).append("</td>");
          err_desc.append("</tr>");
        }
      }
      err_desc.append("</table>");
    }
    return err_desc.toString();
  }
  
  private static String hibernateExp(Exception e)
  {
    Exception he;
    try
    {
      he = (HibernateException)e.getCause();
    }
    catch (Exception e1)
    {
//      Exception he;
      he = e;
    }
    if (((he.getCause() instanceof SQLException)) || 
      ((he.getCause() instanceof BatchUpdateException)))
    {
      SQLException sqe = (SQLException)he.getCause();
      return getExceptionMsgContent(sqe.getMessage());
    }
    return e.getMessage();
  }
  
  private static String getExceptionMsgContent(String exceptionCause)
  {
    return exceptionCause;
  }
}
