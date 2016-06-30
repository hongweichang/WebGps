package com.gps808.videoTrack.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceStatus;
import com.gps808.model.StandardStorageDownTaskAll;
import com.gps808.model.StandardStorageDownTaskReal;
import com.gps808.model.StandardUserRole;
import com.gps808.videoTrack.service.StandardVideoTrackService;
import com.gps808.videoTrack.vo.StandardVideoQuery;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

public class StandardVideoTrackAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = -9186083421023326883L;
  protected StandardVideoTrackService videoTrackService;
  
  public StandardVideoTrackService getVideoTrackService()
  {
    return this.videoTrackService;
  }
  
  public void setVideoTrackService(StandardVideoTrackService videoTrackService)
  {
    this.videoTrackService = videoTrackService;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_RECORD_BACK.toString());
  }
  
  public String queryDeviceServer()
    throws Exception
  {
    try
    {
      StandardVideoQuery query = new StandardVideoQuery();
      try
      {
        query = (StandardVideoQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((query.getDid() != null) && (!query.getDid().isEmpty()) && (query.getLoc() != null))
      {
        boolean online = true;
        if (query.getLoc().intValue() == 1)
        {
          String[] devices = query.getDid().split(",");
          AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
          if (ajaxDto.getPageList() != null)
          {
            if ((((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline() == null) || (((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline().intValue() != 1)) {
              online = false;
            }
          }
          else {
            online = false;
          }
        }
        if (online)
        {
          HttpURLConnection httpConn = null;
          try
          {
            URL url = new URL(String.format("http:/%s/3/1?MediaType=2&DownType=2&DevIDNO=%s&Location=%d", new Object[] { this.notifyService.getLoginSvrAddress(), query.getDid(), query.getLoc() }));
            httpConn = (HttpURLConnection)url.openConnection();
            httpConn.setDoInput(true);
            httpConn.setConnectTimeout(3000);
            httpConn.setReadTimeout(7000);
            
            InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
            
            addCustomResponse(JSON_RESULT, inputReader);
          }
          catch (Exception ex)
          {
            this.log.info("StandardPositionAction read alarm failed");
            this.log.error(ex.getMessage(), ex);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(59));
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
  
  public String queryVideoTrackInfo()
  {
    try
    {
      StandardVideoQuery query = new StandardVideoQuery();
      try
      {
        query = (StandardVideoQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((query.getDid() != null) && (!query.getDid().isEmpty()) && (query.getLoc() != null) && (query.getFtp() != null) && 
        (query.getVtp() != null) && (query.getStm() != null) && (query.getAdr() != null) && (!query.getAdr().isEmpty()) && 
        (query.getChn() != null))
      {
        String strStm = DateUtil.dateSwitchString(query.getStm());
        String year = strStm.substring(0, 4);
        String month = strStm.substring(5, 7);
        String day = strStm.substring(8, 10);
        
        String etmDaily = "23:59:59";
        
        int stm = 0;
        int etm = 0;
        String[] temp = etmDaily.split(":");
        if (temp.length == 2) {
          etm = Integer.parseInt(temp[0]) * 3600 + Integer.parseInt(temp[1]) * 60;
        } else if (temp.length == 3) {
          etm = Integer.parseInt(temp[0]) * 3600 + Integer.parseInt(temp[1]) * 60 + Integer.parseInt(temp[2]);
        }
        HttpURLConnection httpConn = null;
        try
        {
          String htpUrl = String.format("http://%s/3/5?DownType=2&DevIDNO=%s&LOC=%d&CHN=%d&YEAR=%s&MON=%s&DAY=%s&RECTYPE=%d&FILEATTR=%d&BEG=%d&END=%d", new Object[] { query.getAdr(), query.getDid(), query.getLoc(), 
            query.getChn(), year, month, day, query.getVtp(), query.getFtp(), Integer.valueOf(stm), Integer.valueOf(etm) });
          URL url = new URL(htpUrl);
          httpConn = (HttpURLConnection)url.openConnection();
          httpConn.setDoInput(true);
          httpConn.setConnectTimeout(5000);
          httpConn.setReadTimeout(60000);
          
          InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
          
          addCustomResponse(JSON_RESULT, inputReader);
        }
        catch (Exception ex)
        {
          this.log.info("StandardPositionAction read alarm failed");
          this.log.error(ex.getMessage(), ex);
          addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
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
  
  public String queryDownloadServer()
    throws Exception
  {
    try
    {
      StandardVideoQuery query = new StandardVideoQuery();
      try
      {
        query = (StandardVideoQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((query.getDid() != null) && (!query.getDid().isEmpty()) && (query.getLoc() != null) && (query.getFtp() != null))
      {
        boolean online = true;
        if (query.getLoc().intValue() == 1)
        {
          String[] devices = query.getDid().split(",");
          AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
          if (ajaxDto.getPageList() != null)
          {
            if ((((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline() == null) || (((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline().intValue() != 1)) {
              online = false;
            }
          }
          else {
            online = false;
          }
        }
        if (online)
        {
          HttpURLConnection httpConn = null;
          try
          {
            URL url = new URL(String.format("http:/%s/3/1?MediaType=2&DownType=3&Location=%d&FileSvrID=%d&DevIDNO=%s", new Object[] { this.notifyService.getLoginSvrAddress(), query.getLoc(), query.getFtp(), query.getDid() }));
            httpConn = (HttpURLConnection)url.openConnection();
            httpConn.setDoInput(true);
            httpConn.setConnectTimeout(3000);
            httpConn.setReadTimeout(7000);
            
            InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
            
            addCustomResponse(JSON_RESULT, inputReader);
          }
          catch (Exception ex)
          {
            this.log.info("StandardPositionAction read alarm failed");
            this.log.error(ex.getMessage(), ex);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(59));
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
  
  public String queryReplayServer()
    throws Exception
  {
    try
    {
      StandardVideoQuery query = new StandardVideoQuery();
      try
      {
        query = (StandardVideoQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
      }
      if ((query.getDid() != null) && (!query.getDid().isEmpty()) && (query.getLoc() != null) && (query.getFtp() != null))
      {
        boolean online = true;
        if (query.getLoc().intValue() == 1)
        {
          String[] devices = query.getDid().split(",");
          AjaxDto<DeviceStatus> ajaxDto = this.deviceService.getDeviceStatus(devices);
          if (ajaxDto.getPageList() != null)
          {
            if ((((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline() == null) || (((DeviceStatus)ajaxDto.getPageList().get(0)).getOnline().intValue() != 1)) {
              online = false;
            }
          }
          else {
            online = false;
          }
        }
        if (online)
        {
          HttpURLConnection httpConn = null;
          try
          {
            URL url = new URL(String.format("http:/%s/3/1?MediaType=2&DownType=5&Location=%d&FileSvrID=%d&DevIDNO=%s", new Object[] { this.notifyService.getLoginSvrAddress(), query.getLoc(), query.getFtp(), query.getDid() }));
            httpConn = (HttpURLConnection)url.openConnection();
            httpConn.setDoInput(true);
            httpConn.setConnectTimeout(3000);
            httpConn.setReadTimeout(7000);
            
            InputStreamReader inputReader = new InputStreamReader(httpConn.getInputStream(), "UTF-8");
            
            addCustomResponse(JSON_RESULT, inputReader);
          }
          catch (Exception ex)
          {
            this.log.info("StandardPositionAction read alarm failed");
            this.log.error(ex.getMessage(), ex);
            addCustomResponse(ACTION_RESULT, Integer.valueOf(4));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(59));
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
  
  public String downloadTasklist()
  {
    try
    {
      String begintime = getRequestString("begintime");
      String endtime = getRequestString("endtime");
      if ((begintime == null) || (endtime == null) || 
        (!DateUtil.isLongTimeValid(begintime)) || (!DateUtil.isLongTimeValid(endtime)))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String devIdno = getRequest().getParameter("devIdno");
        String statusString = getRequestString("status");
        String taskTag = getRequest().getParameter("taskTag");
        
        Integer status = null;
        if ((statusString != null) && (!statusString.isEmpty())) {
          status = Integer.valueOf(Integer.parseInt(statusString));
        }
        AjaxDto<StandardStorageDownTaskAll> dtoTaskAll = this.videoTrackService.getDownloadTaskAllList(getSessionUserId(), 
          devIdno, Integer.valueOf((int)(DateUtil.StrLongTime2Date(begintime).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(endtime).getTime() / 1000L)), status, taskTag, " order by ctm desc ", getPaginationEx());
        
        addCustomResponse("infos", dtoTaskAll.getPageList());
        addCustomResponse("pagination", dtoTaskAll.getPagination());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String addDownloadTask()
  {
    try
    {
      StandardStorageDownTaskReal taskReal = new StandardStorageDownTaskReal();
      try
      {
        taskReal = (StandardStorageDownTaskReal)AjaxUtils.getObject(getRequest(), taskReal.getClass());
      }
      catch (Exception ex)
      {
        this.log.error(ex.getMessage(), ex);
        this.log.info("StandardPositionAction DeviceQuery AjaxUtils.getObject Failed json:" + getRequest().getParameter("json"));
      }
      if ((taskReal.getDid() != null) && (!taskReal.getDid().isEmpty()) && (taskReal.getFph() != null) && (!taskReal.getFph().isEmpty()) && 
        (taskReal.getFbtm() != null) && (taskReal.getFetm() != null) && (taskReal.getVtp() != null) && 
        (taskReal.getLen() != null) && (taskReal.getChn() != null) && (taskReal.getSbtm() != null) && (taskReal.getSetm() != null) && 
        (!DateUtil.compareDate(taskReal.getFbtm(), taskReal.getFetm())) && (!DateUtil.compareDate(taskReal.getSbtm(), taskReal.getSetm())))
      {
        taskReal.setFtp(Integer.valueOf(2));
        taskReal.setCtm(new Date());
        taskReal.setStu(Integer.valueOf(1));
        taskReal.setUid(getSessionUserId());
        
        StandardStorageDownTaskReal oldTaskReal = this.videoTrackService.getDownTaskReal(taskReal.getDid(), taskReal.getFph().replaceAll("\\\\", "\\\\\\\\"), DateUtil.dateSwitchString(taskReal.getFbtm()), DateUtil.dateSwitchString(taskReal.getFetm()), taskReal.getChn());
        StandardStorageDownTaskAll oldTaskAll = this.videoTrackService.getDownTaskAll(taskReal.getDid(), taskReal.getFph().replaceAll("\\\\", "\\\\\\\\"), Integer.valueOf((int)(taskReal.getFbtm().getTime() / 1000L)), Integer.valueOf((int)(taskReal.getFetm().getTime() / 1000L)), taskReal.getChn());
        if ((oldTaskReal == null) && (oldTaskAll == null))
        {
          StandardStorageDownTaskAll taskAll = new StandardStorageDownTaskAll();
          taskAll.setTaskInfo(taskReal);
          this.videoTrackService.saveDownloadTaskInfo(taskReal, taskAll);
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(58));
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
