package com.framework.utils;

import com.opensymphony.xwork2.ActionSupport;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Properties;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

public class SendEmailUtil
{
  private JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();
  private String emailHost = "";
  private String myEmail = "";
  private String myEmailAccount = "";
  private String myEnailPwd = "";
  private String emailPort = "";
  
  private void readEmailParam()
  {
    ServletContext context = ServletActionContext.getServletContext();
    String configEmailPath = context.getRealPath("/");
    
    String repStr = "tomcat\\\\webapps\\\\gpsweb\\\\";
    configEmailPath = configEmailPath.replaceAll(repStr, "");
    configEmailPath = configEmailPath + "libemail.ini";
    Configuration configEmail = new Configuration(configEmailPath);
    
    this.emailHost = configEmail.getValue("EMAILSTMP");
    this.myEmail = configEmail.getValue("EMAILUSER");
    String[] myEmails = this.myEmail.split("@");
    if (myEmails.length > 0) {
      this.myEmailAccount = myEmails[0];
    }
    this.myEnailPwd = configEmail.getValue("EMAILPWD");
    this.emailPort = configEmail.getValue("EMAILPORT");
  }
  
  private void setEmailAccount()
  {
    readEmailParam();
    
    this.senderImpl.setHost(this.emailHost);
    
    this.senderImpl.setUsername(this.myEmailAccount);
    
    this.senderImpl.setPassword(this.myEnailPwd);
    
    Properties prop = new Properties();
    
    prop.put("mail.smtp.auth", "true");
    prop.put("mail.smtp.timeout", "25000");
    if (this.emailHost.indexOf("gmail") > -1)
    {
      prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
      prop.put("mail.smtp.port", this.emailPort);
      prop.put("mail.smtp.socketFactory.fallback", "false");
      prop.put("mail.smtp.socketFactory.port", this.emailPort);
    }
    this.senderImpl.setJavaMailProperties(prop);
  }
  
  public String sendTxtEmail(String toEmail)
    throws MessagingException
  {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    setEmailAccount();
    mailMessage.setTo(toEmail);
    mailMessage.setFrom(this.myEmail);
    mailMessage.setSubject(" ���������������������� ");
    mailMessage.setText(" ���������������������������� ");
    
    this.senderImpl.send(mailMessage);
    return null;
  }
  
  public String sendHtmlEmail(ActionSupport action, String toEmail, Integer sid, String randParam, String lang, String title)
    throws MessagingException, UnsupportedEncodingException
  {
    MimeMessage mailMessage = this.senderImpl.createMimeMessage();
    
    setEmailAccount();
    
    HttpServletRequest request = ServletActionContext.getRequest();
    String fullPath = request.getRequestURL().toString();
    String path = fullPath.replaceAll(request.getRequestURI(), "").trim();
    
    String subject = action.getText("user.login.resetPwd.resetNewPwd");
    String topeople = action.getText("user.login.resetPwd.hello", new String[] { toEmail });
    String content = action.getText("user.login.resetPwd.content", new String[] { URLDecoder.decode(title, "GBK") });
    String resetPwd = action.getText("user.login.resetPwd.reset");
    
    String text = "<html><head><base target='_blank'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body><table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr><td bgcolor='#f7f9fa' align='center' style='padding:22px 0 20px 0' class='responsive-table'><table border='0' cellpadding='0' cellspacing='0' style='background-color:f7f9fa; border-radius:3px;border:1px solid #dedede;margin:0 auto; background-color:#ffffff' width='552' class='responsive-table'><tbody><tr><td bgcolor='#0373d6' height='54' align='center' style='border-top-left-radius:3px;border-top-right-radius:3px;'><table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr><td align='center' class='zhwd-high-res-img-wrap zhwd-zhihu-logo'><a href='" + 
    
      path + "/ipcam/index.html?lang=" + lang + "'>" + 
      "<img src='" + path + "/ipcam/images/diy/logo.png' width='157' height='40' alt='Cam123' style='outline:none; display:block; border:none; font-size:14px; font-family:Hiragino Sans GB; color:#ffffff;'></a>" + 
      "</td></tr></tbody></table></td></tr><tr><td bgcolor='#ffffff' align='center' style='padding: 0 15px 0px 15px;'><table border='0' cellpadding='0' cellspacing='0' width='480' class='responsive-table'>" + 
      "<tbody><tr><td><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td><table cellpadding='0' cellspacing='0' border='0' align='left' class='responsive-table'>" + 
      "<tbody><tr><td width='550' align='left' valign='top'><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td bgcolor='#ffffff' align='left' style='background-color:#ffffff; font-size: 17px; color:#7b7b7b; padding:28px 0 0 0;line-height:25px;'>" + 
      "<b>" + topeople + "</b></td></tr><tr><td align='left' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 15px 0px 25px 0px'>" + content + 
      "</td></tr><tr><td style='border-top:1px #f1f4f6 solid; padding: 26px 0 32px 0;' align='center' class='padding'><table border='0' cellspacing='0' cellpadding='0' class='responsive-table'><tbody><tr><td><span style='font-family:Hiragino Sans GB;;font-size:17px;color:#0a82e4'>" + 
      "<a style='text-decoration:none;color:#ffffff;' href='" + path + "/ipcam/resetPWD.html?sid=" + sid + "&rand=" + randParam + "&account=" + toEmail + "&lang=" + lang + "' target='_blank'>" + 
      "<div style='padding:10px 25px 10px 25px;border-radius:3px;text-align:center;text-decoration:none;background-color:#0a82e4;color:#ffffff;font-size:17px;margin:0;white-space:nowrap'>" + resetPwd + 
      "</div></a></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>" + 
      "<style type='text/css'>body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}td, input, button, select, body{font-family:Helvetica, 'Microsoft Yahei', verdana}" + 
      "pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}th,td{font-family:arial,verdana,sans-serif;line-height:1.666}img{ border:0}header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}</style>" + 
      "<style id='ntes_link_color' type='text/css'>a,td a{color:#064977}</style></body></html>";
    
    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
    
    messageHelper.setTo(toEmail);
    messageHelper.setFrom(this.myEmail);
    messageHelper.setSubject(subject);
    
    messageHelper.setText(text, true);
    
    this.senderImpl.send(mailMessage);
    return null;
  }
  
  public String sendImgMail(String toEmail)
    throws MessagingException
  {
    MimeMessage mailMessage = this.senderImpl.createMimeMessage();
    setEmailAccount();
    
    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true);
    
    messageHelper.setTo(toEmail);
    messageHelper.setFrom(this.myEmail);
    messageHelper.setSubject("������������������!��");
    
    messageHelper.setText("<html><head></head><body><h1>hello!!spring image html mail</h1><img src=cid:aaa></body></html>", 
      true);
    FileSystemResource img = new FileSystemResource(new File("F:/6394d19djw1ejxtmbkp1uj20fo0m8wgx.jpg"));
    messageHelper.addInline("aaa", img);
    
    this.senderImpl.send(mailMessage);
    return null;
  }
  
  public String sendFileEmail(String toEmail)
    throws MessagingException
  {
    MimeMessage mailMessage = this.senderImpl.createMimeMessage();
    setEmailAccount();
    
    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
    
    messageHelper.setTo(toEmail);
    messageHelper.setFrom(this.myEmail);
    messageHelper.setSubject("������������������!��");
    
    messageHelper.setText("<html><head></head><body><h1>������������������������</h1></body></html>", true);
    
    FileSystemResource file = new FileSystemResource(new File("F:/JavaEmail.rar"));
    
    messageHelper.addAttachment("JavaEmail.rar", file);
    
    this.senderImpl.send(mailMessage);
    return null;
  }
  
  private static String convert(String str)
  {
    StringBuffer sb = new StringBuffer(1000);
    
    sb.setLength(0);
    for (int i = 0; i < str.length(); i++)
    {
      char c = str.charAt(i);
      if (c > '?')
      {
        sb.append("\\u");
        int j = c >>> '\b';
        String tmp = Integer.toHexString(j);
        if (tmp.length() == 1) {
          sb.append("0");
        }
        sb.append(tmp);
        j = c & 0xFF;
        tmp = Integer.toHexString(j);
        if (tmp.length() == 1) {
          sb.append("0");
        }
        sb.append(tmp);
      }
      else
      {
        sb.append(c);
      }
    }
    return new String(sb);
  }
}
