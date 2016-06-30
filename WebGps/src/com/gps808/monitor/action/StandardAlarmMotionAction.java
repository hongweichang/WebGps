package com.gps808.monitor.action;

import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.StandardUserBaseAction;
import com.gps.common.service.DeviceService;
import com.gps808.model.StandardAlarmAudio;
import com.gps808.model.StandardAlarmMotion;
import com.gps808.model.StandardUserRole;
import com.gps808.model.StandardVehicle;
import com.gps808.monitor.service.StandardMonitorService;
import com.gps808.operationManagement.service.StandardUserService;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class StandardAlarmMotionAction
  extends StandardUserBaseAction
{
  private static final long serialVersionUID = 1L;
  private List<File> simpleAudio;
  private String[] simpleAudioFileName;
  private List<String> simpleAudioContentType;
  
  public List<File> getSimpleAudio()
  {
    return this.simpleAudio;
  }
  
  public void setSimpleAudio(List<File> simpleAudio)
  {
    this.simpleAudio = simpleAudio;
  }
  
  public String[] getSimpleAudioFileName()
  {
    return this.simpleAudioFileName;
  }
  
  public void setSimpleAudioFileName(String[] simpleAudioFileName)
  {
    this.simpleAudioFileName = simpleAudioFileName;
  }
  
  public List<String> getSimpleAudioContentType()
  {
    return this.simpleAudioContentType;
  }
  
  public void setSimpleAudioContentType(List<String> simpleAudioContentType)
  {
    this.simpleAudioContentType = simpleAudioContentType;
  }
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_SYSTEM_ALARM_LINK.toString());
  }
  
  public String list()
  {
    try
    {
      String scopeStr = getRequestString("scope");
      String armType = getRequestString("armType");
      String vehiIdnoStr = getRequest().getParameter("vehiIdno");
      
      Integer scope = null;
      if ((scopeStr != null) && (!scopeStr.isEmpty())) {
        scope = Integer.valueOf(Integer.parseInt(scopeStr));
      }
      List<Integer> lstArmType = new ArrayList();
      if ((armType != null) && (!armType.isEmpty()))
      {
        String[] armTypes = armType.split(",");
        for (int i = 0; i < armTypes.length; i++) {
          lstArmType.add(Integer.valueOf(Integer.parseInt(armTypes[i])));
        }
      }
      String vehiIdno = null;
      List<String> lstVehiIdno = new ArrayList();
      if ((vehiIdnoStr != null) && (!vehiIdnoStr.isEmpty()))
      {
        String[] idnos = vehiIdnoStr.split(",");
        if (idnos.length > 1) {
          for (int i = 0; i < idnos.length; i++) {
            lstVehiIdno.add(idnos[i]);
          }
        } else {
          vehiIdno = vehiIdnoStr;
        }
      }
      String condition = " order by uptm desc";
      
      Integer userId = getSessionUserId();
      AjaxDto<StandardAlarmMotion> motions = this.standardMonitorService.getAlarmMotionList(userId, scope, vehiIdno, lstArmType, lstVehiIdno, condition, getPaginationEx());
      
      addCustomResponse("infos", motions.getPageList());
      addCustomResponse("pagination", motions.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String get()
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
        StandardAlarmMotion findMotion = (StandardAlarmMotion)this.standardMonitorService.getObject(StandardAlarmMotion.class, Integer.valueOf(Integer.parseInt(id)));
        if (findMotion != null) {
          addCustomResponse("motion", findMotion);
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
  
  private boolean isAudioFileExist(Integer userId, String name)
    throws UnsupportedEncodingException
  {
    String uploadPath = getServletContext().getRealPath("/808gps/LocationManagement/sounds/0");
    if ((name != null) && (!name.isEmpty()))
    {
      String myFileName = AjaxUtils.encode(name);
      File file = new File(uploadPath, myFileName + ".mp3");
      if ((file.exists()) && (file.isFile())) {
        return true;
      }
      uploadPath = getServletContext().getRealPath("/808gps/LocationManagement/sounds/" + userId);
      File file_ = new File(uploadPath, myFileName + ".mp3");
      if ((file_.exists()) && (file_.isFile())) {
        return true;
      }
    }
    return false;
  }
  
  public String save()
  {
    try
    {
      StandardAlarmMotion alarmMotion = new StandardAlarmMotion();
      alarmMotion = (StandardAlarmMotion)AjaxUtils.getObject(getRequest(), alarmMotion.getClass());
      String vehiIdnos = alarmMotion.getVid();
      String selArmTypes = alarmMotion.getSlatp();
      if ((selArmTypes == null) || (selArmTypes.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        Integer userId = getSessionUserId();
        if (!isAudioFileExist(userId, alarmMotion.getSds()))
        {
          alarmMotion.setSd(Integer.valueOf(0));
          alarmMotion.setSds("");
        }
        if ((vehiIdnos == null) || (vehiIdnos.isEmpty())) {
          vehiIdnos = "-1";
        }
        String[] vehiIdno = vehiIdnos.split(",");
        String[] armType = selArmTypes.split(",");
        List<Object> lstSave = new ArrayList();
        for (int i = 0; i < vehiIdno.length; i++)
        {
          boolean flag = false;
          if (vehiIdno[i].equals("-1"))
          {
            flag = true;
          }
          else
          {
            StandardVehicle vehicle = (StandardVehicle)this.standardMonitorService.getObject(StandardVehicle.class, vehiIdno[i]);
            if (vehicle != null) {
              flag = true;
            }
          }
          if (flag)
          {
            Map<Integer, StandardAlarmMotion> mapMotion = this.standardMonitorService.findAlarmMotion(userId, vehiIdno[i]);
            for (int j = 0; j < armType.length; j++)
            {
              StandardAlarmMotion newMotion = new StandardAlarmMotion();
              newMotion.setUid(userId);
              newMotion.setVid(vehiIdno[i]);
              if (vehiIdno[i].equals("-1")) {
                newMotion.setScp(Integer.valueOf(0));
              } else {
                newMotion.setScp(Integer.valueOf(1));
              }
              newMotion.setAtp(Integer.valueOf(Integer.parseInt(armType[j])));
              if (Integer.parseInt(armType[j]) == 113) {
                newMotion.setStp(alarmMotion.getStp());
              }
              newMotion.setIrd(alarmMotion.getIrd());
              if ((alarmMotion.getIrd() != null) && (alarmMotion.getIrd().intValue() == 1))
              {
                newMotion.setRch(alarmMotion.getRch());
                newMotion.setRtm(alarmMotion.getRtm());
                newMotion.setRdy(Integer.valueOf(0));
              }
              newMotion.setSd(alarmMotion.getSd());
              newMotion.setSds(alarmMotion.getSds());
              newMotion.setSam(alarmMotion.getSam());
              newMotion.setBtm(alarmMotion.getBtm());
              newMotion.setEtm(alarmMotion.getEtm());
              newMotion.setEnb(alarmMotion.getEnb());
              if (mapMotion != null)
              {
                StandardAlarmMotion findMotion = (StandardAlarmMotion)mapMotion.get(Integer.valueOf(Integer.parseInt(armType[j])));
                if (findMotion != null) {
                  newMotion.setId(findMotion.getId());
                }
              }
              lstSave.add(newMotion);
            }
          }
        }
        this.standardUserService.saveList(lstSave);
        for (int i = 0; i < vehiIdno.length; i++) {
          addUserLog(Integer.valueOf(13), Integer.valueOf(2), 
            vehiIdno[i], null, userId.toString(), null, null);
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
  {
    try
    {
      StandardAlarmMotion alarmMotion = new StandardAlarmMotion();
      alarmMotion = (StandardAlarmMotion)AjaxUtils.getObject(getRequest(), alarmMotion.getClass());
      
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        StandardAlarmMotion findMotion = (StandardAlarmMotion)this.standardMonitorService.getObject(StandardAlarmMotion.class, Integer.valueOf(Integer.parseInt(id)));
        Integer userId = getSessionUserId();
        if ((findMotion != null) && (userId.intValue() == findMotion.getUid().intValue()))
        {
          alarmMotion.setId(findMotion.getId());
          alarmMotion.setUid(findMotion.getUid());
          alarmMotion.setVid(findMotion.getVid());
          alarmMotion.setScp(findMotion.getScp());
          alarmMotion.setAtp(findMotion.getAtp());
          if (findMotion.getAtp().intValue() != 113) {
            alarmMotion.setStp("");
          }
          if (!isAudioFileExist(userId, alarmMotion.getSds()))
          {
            alarmMotion.setSd(Integer.valueOf(0));
            alarmMotion.setSds("");
          }
          this.standardUserService.save(alarmMotion);
          
          addUserLog(Integer.valueOf(13), Integer.valueOf(2), 
            findMotion.getVid(), null, userId.toString(), null, null);
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
        Integer userId = getSessionUserId();
        String[] ids = id.split(",");
        List<Object> alarmMotions = new ArrayList();
        List<String> vehiIdnos = new ArrayList();
        for (int i = 0; i < ids.length; i++)
        {
          StandardAlarmMotion findMotion = (StandardAlarmMotion)this.standardMonitorService.getObject(StandardAlarmMotion.class, Integer.valueOf(Integer.parseInt(ids[i])));
          if (userId.intValue() == findMotion.getUid().intValue())
          {
            alarmMotions.add(findMotion);
            vehiIdnos.add(findMotion.getVid());
          }
        }
        this.standardUserService.batchDelete(alarmMotions);
        for (int i = 0; i < vehiIdnos.size(); i++) {
          addUserLog(Integer.valueOf(13), Integer.valueOf(3), (String)vehiIdnos.get(i), ids[i], userId.toString(), null, null);
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
  
  public String findAlarmMotion()
  {
    try
    {
      String scopeStr = getRequestString("scope");
      String armType = getRequestString("armType");
      String vehiIdnoStr = getRequest().getParameter("vehiIdno");
      
      Integer scope = null;
      if ((scopeStr != null) && (!scopeStr.isEmpty())) {
        scope = Integer.valueOf(Integer.parseInt(scopeStr));
      }
      List<Integer> lstArmType = new ArrayList();
      if ((armType != null) && (!armType.isEmpty()))
      {
        String[] armTypes = armType.split(",");
        for (int i = 0; i < armTypes.length; i++) {
          lstArmType.add(Integer.valueOf(Integer.parseInt(armTypes[i])));
        }
      }
      String vehiIdno = null;
      List<String> lstVehiIdno = new ArrayList();
      if ((vehiIdnoStr != null) && (!vehiIdnoStr.isEmpty()))
      {
        String[] idnos = vehiIdnoStr.split(",");
        if (idnos.length > 1) {
          for (int i = 0; i < idnos.length; i++) {
            lstVehiIdno.add(idnos[i]);
          }
        } else {
          vehiIdno = vehiIdnoStr;
        }
      }
      Integer userId = getSessionUserId();
      AjaxDto<StandardAlarmMotion> motions = this.standardMonitorService.getAlarmMotionList(userId, scope, vehiIdno, lstArmType, lstVehiIdno, null, null);
      
      addCustomResponse("motions", motions.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String uploadAudio()
  {
    try
    {
      String name = getRequest().getParameter("name");
      String desc = getRequest().getParameter("desc");
      if ((name != null) && (!name.isEmpty()))
      {
        String myFileName = AjaxUtils.encode(name);
        List<Integer> lstUid = new ArrayList();
        Integer userId = getSessionUserId();
        lstUid.add(Integer.valueOf(0));
        lstUid.add(userId);
        AjaxDto<StandardAlarmAudio> audios = this.standardMonitorService.getAudioList(lstUid, name, null, null, null);
        if ((audios != null) && (audios.getPageList() != null) && (audios.getPageList().size() > 0))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(29));
          return "success";
        }
        for (int i = 0; i < this.simpleAudioFileName.length; i++)
        {
          String fileName = this.simpleAudioFileName[i];
          String fileType = (String)this.simpleAudioContentType.get(i);
          if (!fileName.equals("")) {
            if ((fileType.equals("audio/mpeg")) || (fileType.equals("audio/mp3")))
            {
              if (((File)this.simpleAudio.get(i)).length() > 102400L)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(41));
                return "success";
              }
              InputStream is = new FileInputStream((File)this.simpleAudio.get(i));
              String uploadPath = getServletContext().getRealPath("/808gps/LocationManagement/sounds/" + userId);
              File file = new File(uploadPath);
              if (!file.exists()) {
                file.mkdirs();
              }
              File toFile = new File(uploadPath, myFileName + ".mp3");
              OutputStream os = new FileOutputStream(toFile);
              byte[] buffer = new byte['?'];
              int length = 0;
              while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
              }
              is.close();
              os.close();
              
              InputStream is2 = new FileInputStream((File)this.simpleAudio.get(i));
              File toFile2 = new File(uploadPath, myFileName + ".ogg");
              OutputStream os2 = new FileOutputStream(toFile2);
              byte[] buffer2 = new byte['?'];
              int length2 = 0;
              while ((length2 = is2.read(buffer2)) > 0) {
                os2.write(buffer2, 0, length2);
              }
              is2.close();
              os2.close();
              
              StandardAlarmAudio audio = new StandardAlarmAudio();
              audio.setUid(userId);
              audio.setSds(name);
              audio.setDec(desc);
              this.deviceService.save(audio);
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(42));
              return "success";
            }
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
  
  public String getAudioPaginList()
  {
    try
    {
      String likeName = getRequest().getParameter("name");
      
      String condition = " order by uptm desc";
      
      List<Integer> lstUid = new ArrayList();
      Integer userId = getSessionUserId();
      lstUid.add(Integer.valueOf(0));
      lstUid.add(userId);
      AjaxDto<StandardAlarmAudio> audios = this.standardMonitorService.getAudioList(lstUid, null, likeName, condition, getPaginationEx());
      
      addCustomResponse("infos", audios.getPageList());
      addCustomResponse("pagination", audios.getPagination());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getAudioList()
  {
    try
    {
      String condition = " order by uptm desc";
      List<Integer> lstUid = new ArrayList();
      Integer userId = getSessionUserId();
      lstUid.add(Integer.valueOf(0));
      lstUid.add(userId);
      AjaxDto<StandardAlarmAudio> audios = this.standardMonitorService.getAudioList(lstUid, null, null, condition, null);
      
      addCustomResponse("audios", audios.getPageList());
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String deleteAudioFile()
  {
    try
    {
      String id = getRequestString("id");
      if ((id != null) && (!id.isEmpty()))
      {
        Integer userId = getSessionUserId();
        StandardAlarmAudio audio = (StandardAlarmAudio)this.standardMonitorService.getObject(StandardAlarmAudio.class, Integer.valueOf(Integer.parseInt(id)));
        if (audio.getUid().intValue() == userId.intValue())
        {
          String sds = audio.getSds();
          String myFileName = AjaxUtils.encode(sds);
          delFile("/808gps/LocationManagement/sounds/" + userId + "/" + myFileName + ".mp3");
          delFile("/808gps/LocationManagement/sounds/" + userId + "/" + myFileName + ".ogg");
          this.deviceService.delete(audio);
          
          String condition = String.format(" and sds = '%s' ", new Object[] { sds });
          AjaxDto<StandardAlarmMotion> motions = this.standardMonitorService.getAlarmMotionList(userId, null, null, null, null, condition, null);
          if ((motions != null) && (motions.getPageList() != null) && (motions.getPageList().size() > 0))
          {
            List<StandardAlarmMotion> lstmotions = motions.getPageList();
            List<Object> lstSave = new ArrayList();
            for (int i = 0; i < lstmotions.size(); i++)
            {
              StandardAlarmMotion motion = (StandardAlarmMotion)lstmotions.get(i);
              motion.setSd(Integer.valueOf(0));
              motion.setSds("");
              lstSave.add(motion);
            }
            this.deviceService.saveList(lstSave);
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(24));
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
