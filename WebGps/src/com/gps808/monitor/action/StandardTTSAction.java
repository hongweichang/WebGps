package com.gps808.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.report.vo.DeviceQuery;
import com.gps808.model.StandardFixedTts;
import com.gps808.model.StandardUserRole;
import com.gps808.monitor.service.StandardMonitorService;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;

public class StandardTTSAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_MONITORING.toString());
  }
  
  public String addFixedTtsInfo()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_OTHER.toString()))
      {
        StandardFixedTts tts = new StandardFixedTts();
        try
        {
          tts = (StandardFixedTts)AjaxUtils.getObject(getRequest(), tts.getClass());
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
        }
        if ((tts.getContent() != null) && (!tts.getContent().isEmpty()))
        {
          Integer userId = getSessionUserId();
          StandardFixedTts oldTts = this.standardMonitorService.getStandardFixedTts(userId, tts.getContent());
          if (oldTts == null)
          {
            tts.setUserId(userId);
            this.deviceService.save(tts);
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delFixedTtsInfo()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_OTHER.toString()))
      {
        String ttsId = getRequestString("ttsId");
        if ((ttsId != null) && (!ttsId.isEmpty()))
        {
          StandardFixedTts tts = (StandardFixedTts)this.standardMonitorService.getObject(StandardFixedTts.class, Integer.valueOf(Integer.parseInt(ttsId)));
          if (tts != null) {
            this.deviceService.delete(tts);
          } else {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getFixedTtsInfoList()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_OTHER.toString()))
      {
        Integer userId = getSessionUserId();
        List<StandardFixedTts> lstTts = this.standardMonitorService.getStandardFixedTts(userId);
        addCustomResponse("infos", lstTts);
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String sendTtsInformation()
  {
    try
    {
      if (isRole(StandardUserRole.PRIVI_DEVICE_OTHER.toString()))
      {
        DeviceQuery query = new DeviceQuery();
        try
        {
          query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
        }
        catch (Exception ex)
        {
          this.log.error(ex.getMessage(), ex);
        }
        if ((query.getDevIdnos() != null) && (!query.getDevIdnos().isEmpty()) && 
          (query.getTypeIdno() != null) && (!query.getTypeIdno().isEmpty()) && 
          (query.getCondiIdno() != null) && (!query.getCondiIdno().isEmpty())) {
          try
          {
            URL url = new URL(String.format("http://%s/2/5", new Object[] { query.getCondiIdno() }));
            HttpURLConnection httpConn = (HttpURLConnection)url.openConnection();
            httpConn.setDoInput(true);
            httpConn.setDoOutput(true);
            httpConn.setRequestMethod("POST");
            httpConn.setUseCaches(false);
            httpConn.setConnectTimeout(5000);
            httpConn.setReadTimeout(60000);
            
            Map<String, Object> mapParam = new HashMap();
            mapParam.put("DevIDNO", query.getDevIdnos());
            HttpServletRequest request = ServletActionContext.getRequest();
            mapParam.put("JSESSION", request.getRequestedSessionId());
            mapParam.put("Text", query.getTypeIdno());
            String jsonParam = AjaxUtils.toJson(mapParam, false);
            
            DataOutputStream dos = new DataOutputStream(httpConn.getOutputStream());
            
            dos.write(jsonParam.getBytes());
            dos.flush();
            
            InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
            addCustomResponse(JSON_RESULT, inputReader);
            
            addUserLog(Integer.valueOf(2), 
              Integer.valueOf(1), query.getDevIdnos(), query.getTypeIdno(), null, 
              String.format("%d", new Object[] { Integer.valueOf(2) }), query.getSourceIdno());
          }
          catch (Exception ex)
          {
            this.log.info("StandardPositionAction read alarm failed");
            addCustomResponse(ACTION_RESULT, Integer.valueOf(3));
          }
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
        }
      }
      else
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
