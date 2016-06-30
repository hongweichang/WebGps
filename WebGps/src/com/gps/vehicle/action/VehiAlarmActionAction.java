package com.gps.vehicle.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.UserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.model.DeviceInfo;
import com.gps.model.UserRole;
import com.gps.report.vo.DeviceQuery;
import com.gps.vehicle.model.AlarmAction;
import com.gps.vehicle.service.AlarmActionService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VehiAlarmActionAction
  extends UserBaseAction
{
  private static final long serialVersionUID = 1L;
  private AlarmActionService alarmActionService;
  
  public AlarmActionService getAlarmActionService()
  {
    return this.alarmActionService;
  }
  
  public void setAlarmActionService(AlarmActionService alarmActionService)
  {
    this.alarmActionService = alarmActionService;
  }
  
  protected boolean checkPrivi()
  {
    return findPrivilege(UserRole.PRIVI_VEHIMGR_ALARM_ACTION);
  }
  
  protected void addAlarmActionLog(Integer subType, AlarmAction alarmAction)
  {
    addUserLog(Integer.valueOf(13), subType, alarmAction.getDevIdno(), alarmAction.getArmType().toString(), null, null, null);
  }
  
  protected boolean isEnableAutoDown()
  {
    long config = this.deviceService.getServerConfig();
    if (enableAutoDown(config)) {
      return true;
    }
    addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
    return false;
  }
  
  public String list()
    throws Exception
  {
    try
    {
      DeviceQuery query = new DeviceQuery();
      query = (DeviceQuery)AjaxUtils.getObject(getRequest(), query.getClass());
      if (!query.getDevIdnos().isEmpty())
      {
        String[] allDevices = query.getDevIdnos().split(",");
        AjaxDto<AlarmAction> ajaxDto = this.alarmActionService.getAlarmActionList(allDevices, getPaginationEx());
        addCustomResponse("actions", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
      else
      {
        addCustomResponse("actions", null);
        addCustomResponse("pagination", getPaginationEx());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String get()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        AlarmAction action = (AlarmAction)this.alarmActionService.get(Integer.valueOf(Integer.parseInt(id)));
        if (action != null) {
          addCustomResponse("action", action);
        } else {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String edit()
    throws Exception
  {
    try
    {
      AlarmAction alarmAction = new AlarmAction();
      alarmAction = (AlarmAction)AjaxUtils.getObject(getRequest(), alarmAction.getClass());
      
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String channel = alarmAction.getCaptureChannel() == null ? "" : alarmAction.getCaptureChannel();
        String recording = alarmAction.getRecordingTime() == null ? "" : alarmAction.getRecordingTime();
        if ("1".equals(channel))
        {
          channel = "";
          for (int i = 0; i < 8; i++)
          {
            if (i != 0) {
              channel = channel + "|";
            }
            channel = channel + i;
          }
        }
        else
        {
          channel = "";
          for (int i = 0; i < 7; i++) {
            channel = channel + "|";
          }
        }
        String recordingTime = "";
        for (int i = 0; i < 8; i++)
        {
          if (i != 0) {
            recordingTime = recordingTime + "|";
          }
          recordingTime = recordingTime + recording;
        }
        alarmAction.setCaptureChannel(channel);
        alarmAction.setRecordingTime(recordingTime);
        AlarmAction findAction = (AlarmAction)this.alarmActionService.get(Integer.valueOf(Integer.parseInt(id)));
        if (findAction != null)
        {
          alarmAction.setId(findAction.getId());
          alarmAction.setDevIdno(findAction.getDevIdno());
          alarmAction.setArmType(findAction.getArmType());
          if (findAction.getArmType().intValue() != 113) {
            alarmAction.setArmSubType(null);
          }
          this.alarmActionService.save(alarmAction);
          
          addAlarmActionLog(Integer.valueOf(2), alarmAction);
          this.notifyService.sendAlarmActionChange(2, alarmAction.getDevIdno());
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String save()
    throws Exception
  {
    try
    {
      AlarmAction alarmAction = new AlarmAction();
      alarmAction = (AlarmAction)AjaxUtils.getObject(getRequest(), alarmAction.getClass());
      String idnos = alarmAction.getDevIdno();
      String selArmTypes = alarmAction.getSelArmTypes();
      if ((idnos == null) || (idnos.isEmpty()) || (selArmTypes == null) || (selArmTypes.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] devIdno = idnos.split(",");
        String[] armType = selArmTypes.split(",");
        String channel = alarmAction.getCaptureChannel() == null ? "" : alarmAction.getCaptureChannel();
        String recording = alarmAction.getRecordingTime() == null ? "" : alarmAction.getRecordingTime();
        if ("1".equals(channel))
        {
          channel = "";
          for (int i = 0; i < 8; i++)
          {
            if (i != 0) {
              channel = channel + "|";
            }
            channel = channel + i;
          }
        }
        else
        {
          channel = "";
          for (int i = 0; i < 7; i++) {
            channel = channel + "|";
          }
        }
        String recordingTime = "";
        for (int i = 0; i < 8; i++)
        {
          if (i != 0) {
            recordingTime = recordingTime + "|";
          }
          recordingTime = recordingTime + recording;
        }
        List<Object> lstSave = new ArrayList();
        for (int i = 0; i < devIdno.length; i++)
        {
          DeviceInfo device = (DeviceInfo)this.deviceService.get(devIdno[i]);
          if (device != null)
          {
            Map<Integer, AlarmAction> mapAction = this.alarmActionService.getDeviceAlarmAction(devIdno[i]);
            alarmAction.setDevIdno(devIdno[i]);
            for (int j = 0; j < armType.length; j++)
            {
              AlarmAction newAction = new AlarmAction();
              newAction.setDevIdno(devIdno[i]);
              newAction.setArmType(Integer.valueOf(Integer.parseInt(armType[j])));
              newAction.setSmsSend(alarmAction.getSmsSend());
              newAction.setSmsAddress(alarmAction.getSmsAddress());
              newAction.setSmsContent(alarmAction.getSmsContent());
              newAction.setEmailSend(alarmAction.getEmailSend());
              newAction.setEmailAddress(alarmAction.getEmailAddress());
              newAction.setEmailContent(alarmAction.getEmailContent());
              newAction.setBeginTime(alarmAction.getBeginTime());
              newAction.setEndTime(alarmAction.getEndTime());
              newAction.setCaptureChannel(channel);
              newAction.setRecordingTime(recordingTime);
              if (Integer.parseInt(armType[j]) == 113) {
                newAction.setArmSubType(alarmAction.getArmSubType());
              }
              if (mapAction != null)
              {
                AlarmAction findAction = (AlarmAction)mapAction.get(Integer.valueOf(Integer.parseInt(armType[j])));
                if (findAction != null) {
                  newAction.setId(findAction.getId());
                }
              }
              lstSave.add(newAction);
            }
          }
        }
        this.alarmActionService.saveList(lstSave);
        for (int i = 0; i < devIdno.length; i++)
        {
          this.notifyService.sendAlarmActionChange(2, devIdno[i]);
          addUserLog(Integer.valueOf(13), Integer.valueOf(2), 
            devIdno[i], null, null, null, null);
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delete()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      String devIdno = getRequestString("devIdno");
      if ((id == null) || (id.isEmpty()) || (devIdno == null) || (devIdno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] ids = id.split(",");
        String[] devIdnos = devIdno.split(",");
        List<Serializable> lstIds = new ArrayList();
        int i = 0;
        for (i = 0; i < ids.length; i++)
        {
          Integer actionId = Integer.valueOf(Integer.parseInt(ids[i]));
          lstIds.add(actionId);
        }
        this.alarmActionService.removeList(lstIds);
        Map<String, String> mapDev = new HashMap();
        for (i = 0; i < ids.length; i++)
        {
          addUserLog(Integer.valueOf(13), Integer.valueOf(3), devIdnos[i], ids[i], null, null, null);
          if (mapDev.get(devIdnos[i]) == null)
          {
            mapDev.put(devIdnos[i], devIdnos[i]);
            this.notifyService.sendAlarmActionChange(3, devIdnos[i]);
          }
        }
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
