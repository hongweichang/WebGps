package com.gps.system.action;

import com.framework.encrypt.MD5EncryptUtils;
import com.framework.logger.Logger;
import com.framework.utils.AjaxUtils;
import com.framework.utils.DateUtil;
import com.framework.utils.StringUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.SysBaseAction;
import com.gps.common.service.AccountService;
import com.gps.common.service.DeviceService;
import com.gps.common.service.NotifyService;
import com.gps.common.service.UserService;
import com.gps.model.DeviceInfo;
import com.gps.model.DeviceStatus;
import com.gps.model.UserAccount;
import com.gps.model.UserInfo;
import com.gps.system.service.SysUserService;
import java.io.File;
import java.io.FileInputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class SysDeviceAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private static final int BATCH_IDNO_LENGTH = 3;
  private UserService userService;
  private NotifyService notifyService;
  private SysUserService sysUserService;
  private AccountService accountService;
  private File uploadFile;
  private String uploadFileFileName;
  private String uploadFileContentType;
  
  public UserService getUserService()
  {
    return this.userService;
  }
  
  public void setUserService(UserService userService)
  {
    this.userService = userService;
  }
  
  public NotifyService getNotifyService()
  {
    return this.notifyService;
  }
  
  public void setNotifyService(NotifyService notifyService)
  {
    this.notifyService = notifyService;
  }
  
  public SysUserService getSysUserService()
  {
    return this.sysUserService;
  }
  
  public void setSysUserService(SysUserService sysUserService)
  {
    this.sysUserService = sysUserService;
  }
  
  public AccountService getAccountService()
  {
    return this.accountService;
  }
  
  public void setAccountService(AccountService accountService)
  {
    this.accountService = accountService;
  }
  
  public File getUploadFile()
  {
    return this.uploadFile;
  }
  
  public void setUploadFile(File uploadFile)
  {
    this.uploadFile = uploadFile;
  }
  
  public String getUploadFileFileName()
  {
    return this.uploadFileFileName;
  }
  
  public void setUploadFileFileName(String uploadFileFileName)
  {
    this.uploadFileFileName = uploadFileFileName;
  }
  
  public String getUploadFileContentType()
  {
    return this.uploadFileContentType;
  }
  
  public void setUploadFileContentType(String uploadFileContentType)
  {
    this.uploadFileContentType = uploadFileContentType;
  }
  
  public String list()
    throws Exception
  {
    try
    {
      String name = getRequestString("name");
      String client = getRequestString("clientId");
      Integer clientId = null;
      if (client != null) {
        clientId = Integer.valueOf(Integer.parseInt(client));
      }
      String expire = getRequestString("expireDay");
      Integer expireDay = null;
      if (expire != null) {
        expireDay = Integer.valueOf(Integer.parseInt(expire));
      }
      String order = getRequestString("order");
      String condition = "";
      if ((order != null) && (order.equals("2"))) {
        condition = " order by dev_info.idno asc";
      } else if ((order != null) && (order.equals("1"))) {
        condition = " order by dev_info.idno desc";
      }
      AjaxDto<DeviceInfo> ajaxDto = this.deviceService.getDeviceList(name, clientId, null, expireDay, getPagination(), condition);
      if (ajaxDto.getPageList() != null) {
        for (DeviceInfo info : ajaxDto.getPageList()) {
          info.setPayBeginStr(DateUtil.dateSwitchDateString(info.getPayBegin()));
        }
      }
      addCustomResponse("devices", ajaxDto.getPageList());
      addCustomResponse("pagination", ajaxDto.getPagination());
      if ((clientId == null) || (clientId.equals(Integer.valueOf(0))))
      {
        addCustomResponse("manageCount", Integer.valueOf(this.deviceService.getRegistCount()));
        addCustomResponse("deviceTotal", Integer.valueOf(this.deviceService.getDeviceCount(null, null, null)));
        addCustomResponse("storeCount", Integer.valueOf(this.deviceService.getStoreCount()));
        
        long config = this.deviceService.getServerConfig();
        addCustomResponse("enableTracker", Boolean.valueOf(enableTracker(config)));
      }
      else
      {
        addCustomResponse("deviceCount", Integer.valueOf(this.deviceService.getDeviceCount(null, clientId, null)));
        addCustomResponse("clientCount", Integer.valueOf(this.userService.getUserCount(null, clientId, null)));
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public static String getDefaultIOInName(int ioCount)
  {
    StringBuilder ioName = new StringBuilder();
    for (int i = 0; i < ioCount; i++)
    {
      if (i != 0) {
        ioName.append(",");
      }
      ioName.append("IO_" + (i + 1));
    }
    return ioName.toString();
  }
  
  public static String getDefaultChnName(int chnNum)
  {
    StringBuilder chnName = new StringBuilder("");
    for (int i = 0; i < chnNum; i++)
    {
      if (i != 0) {
        chnName.append(",");
      }
      chnName.append("CH" + (i + 1));
    }
    return chnName.toString();
  }
  
  public static String saveChnName(int oldChnNum, String oldName, int newChnNum)
  {
    if ((oldName == null) || (oldName.isEmpty())) {
      return getDefaultChnName(newChnNum);
    }
    if (newChnNum > 0)
    {
      String[] arrName = oldName.split(",");
      StringBuilder chnName = new StringBuilder("");
      int nCopy = 0;
      if (newChnNum <= arrName.length) {
        nCopy = newChnNum;
      } else {
        nCopy = arrName.length;
      }
      for (int i = 0; i < nCopy; i++)
      {
        if (i != 0) {
          chnName.append(",");
        }
        chnName.append(arrName[i]);
      }
      if (newChnNum > arrName.length) {
        for (int i = arrName.length; i < newChnNum; i++)
        {
          chnName.append(",");
          chnName.append("CH" + (i + 1));
        }
      }
      return chnName.toString();
    }
    return "";
  }
  
  private void addOperatorLog(DeviceInfo devInfo, Integer type)
  {
    Integer usrid = getSessionSysUsrId();
    if (usrid != null) {
      this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(3), type, 
        devInfo.getId().toString(), devInfo.getIdno(), "", "");
    }
  }
  
  public static void updateUserAccount(DeviceInfo device)
  {
    device.getUserAccount().setAccount(device.getIdno());
    device.getUserAccount().setPassword(MD5EncryptUtils.encrypt("000000"));
    device.getUserAccount().setType(Integer.valueOf(1));
    Calendar cal = Calendar.getInstance();
    cal.set(2035, 12, 31);
    device.getUserAccount().setValidity(cal.getTime());
  }
  
  public static void initDevice(DeviceInfo device)
  {
    Calendar cal = Calendar.getInstance();
    device.setDateProduct(cal.getTime());
    if (device.getDevType().intValue() == 1) {
      device.setIcon(Integer.valueOf(1));
    } else if (device.getDevType().intValue() == 3) {
      device.setIcon(Integer.valueOf(7));
    } else {
      device.setIcon(Integer.valueOf(3));
    }
    if (device.getDevType().intValue() == 4) {
      device.setModule(Integer.valueOf(8));
    }
    if (device.getChnCount() == null) {
      device.setChnCount(Integer.valueOf(4));
    }
    device.setChnName(getDefaultChnName(device.getChnCount().intValue()));
    
    device.setIoInCount(Integer.valueOf(6));
    device.setIoInName(getDefaultIOInName(device.getIoInCount().intValue()));
    
    device.setTempCount(Integer.valueOf(0));
    device.setTempName("");
    
    device.setUserID(Integer.valueOf(0));
    
    device.setDevGroupId(Integer.valueOf(0));
    
    device.setUserSex(Integer.valueOf(1));
    device.setUserPost(Integer.valueOf(1));
  }
  
  protected boolean isEnableTracker()
  {
    if (getEnableMobile())
    {
      long config = this.deviceService.getServerConfig();
      return enableTracker(config);
    }
    return false;
  }
  
  protected boolean isDevTypeValid(Integer type)
  {
    boolean ret = true;
    if (type.equals(Integer.valueOf(1)))
    {
      if (!getEnableMdvr())
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
        ret = false;
      }
    }
    else if (type.equals(Integer.valueOf(2)))
    {
      if (!isEnableTracker())
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
        ret = false;
      }
    }
    else if (type.equals(Integer.valueOf(3)))
    {
      if (!getEnableDvr())
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
        ret = false;
      }
    }
    else if (type.equals(Integer.valueOf(4))) {
      if (!getEnablePad())
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(36));
        ret = false;
      }
    }
    return ret;
  }
  
  public String add()
    throws Exception
  {
    try
    {
      DeviceInfo device = new DeviceInfo();
      device = (DeviceInfo)AjaxUtils.getObject(getRequest(), device.getClass());
      
      device.setIdno(device.getIdno().toLowerCase());
      
      UserAccount account = this.accountService.findByAccount(device.getIdno());
      if ((account != null) || (this.accountService.isAccountUnvalid(device.getIdno())))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
      }
      else if (isDevTypeValid(device.getDevType()))
      {
        updateUserAccount(device);
        
        initDevice(device);
        if (!this.deviceService.addDeviceInfo(device).booleanValue())
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
        }
        else
        {
          DeviceInfo devAdd = null;
          try
          {
            devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
          }
          catch (Exception ex)
          {
            this.log.error(ex.getMessage(), ex);
            
            UserAccount acount = this.accountService.findByAccount(device.getIdno());
            if (acount != null)
            {
              this.deviceService.updateDeviceAccountId(device.getIdno(), acount.getId());
              try
              {
                devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
              }
              catch (Exception ex2)
              {
                this.deviceService.deleteDeviceNative(device.getIdno());
                addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
              }
            }
            else
            {
              this.log.error("SysDeviceAction add device auto increase id failed");
              this.deviceService.deleteDeviceNative(device.getIdno());
              addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
            }
          }
          if (devAdd != null)
          {
            addOperatorLog(devAdd, Integer.valueOf(1));
            this.notifyService.sendDeviceInfoChange(1, device.getIdno());
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
  
  public String get()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = this.deviceService.findDeviceByIdno(idno);
        if (device != null)
        {
          addCustomResponse("name", device.getUserAccount().getName());
          addCustomResponse("idno", device.getIdno());
          addCustomResponse("devType", device.getDevType());
          addCustomResponse("chnCount", device.getChnCount());
          addCustomResponse("simCard", device.getSimCard());
          addCustomResponse("dateProduct", device.getDateProduct());
          addCustomResponse("netAddrType", device.getNetAddrType());
          
          addCustomResponse("payEnable", device.getPayEnable());
          addCustomResponse("payBegin", device.getPayBegin());
          addCustomResponse("payPeriod", device.getPayPeriod());
          addCustomResponse("payMonth", device.getPayMonth());
          addCustomResponse("payDelayDay", device.getPayDelayDay());
          addCustomResponse("stoDay", device.getStoDay());
          
          addCustomResponse("enableTracker", Boolean.valueOf(isEnableTracker()));
          addCustomResponse("enableMdvr", Boolean.valueOf(getEnableMdvr()));
          addCustomResponse("enableDvr", Boolean.valueOf(getEnableDvr()));
          addCustomResponse("enablePad", Boolean.valueOf(getEnablePad()));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = this.deviceService.findDeviceByIdno(idno);
        if (device != null)
        {
          DeviceInfo saveDevice = new DeviceInfo();
          saveDevice = (DeviceInfo)AjaxUtils.getObject(getRequest(), saveDevice.getClass());
          
          device.getUserAccount().setName(saveDevice.getUserAccount().getName());
          
          Integer oldCount = device.getChnCount();
          device.setChnCount(saveDevice.getChnCount());
          if (!saveDevice.getDevType().equals(device.getDevType()))
          {
            if (saveDevice.getDevType().intValue() == 1)
            {
              device.setIcon(Integer.valueOf(1));
              device.setChnName(saveChnName(oldCount.intValue(), device.getChnName(), device.getChnCount().intValue()));
            }
            else if (saveDevice.getDevType().intValue() == 3)
            {
              device.setIcon(Integer.valueOf(7));
              device.setChnName(saveChnName(oldCount.intValue(), device.getChnName(), device.getChnCount().intValue()));
            }
            else
            {
              device.setChnCount(Integer.valueOf(0));
              device.setIcon(Integer.valueOf(3));
              device.setChnName(getDefaultChnName(device.getChnCount().intValue()));
            }
            device.setDevType(saveDevice.getDevType());
          }
          else
          {
            device.setChnName(saveChnName(oldCount.intValue(), device.getChnName(), device.getChnCount().intValue()));
          }
          if (saveDevice.getDevType().intValue() == 4) {
            device.setModule(Integer.valueOf(8));
          }
          device.setSimCard(saveDevice.getSimCard());
          device.setDateProduct(saveDevice.getDateProduct());
          device.setNetAddrType(saveDevice.getNetAddrType());
          device.setPayEnable(saveDevice.getPayEnable());
          device.setPayBegin(saveDevice.getPayBegin());
          device.setPayMonth(saveDevice.getPayMonth());
          device.setPayDelayDay(saveDevice.getPayDelayDay());
          device.setPayPeriod(saveDevice.getPayPeriod());
          device.setStoDay(saveDevice.getStoDay());
          device.setUpdateTime(new Date());
          
          this.deviceService.editDeviceInfo(device);
          this.notifyService.sendDeviceInfoChange(2, device.getIdno());
          addOperatorLog(device, Integer.valueOf(3));
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(9));
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
      String idno = getRequestString("idno");
      if ((idno == null) || (idno.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] delIdnos;
      
        if (idno.indexOf(",") != -1)
        {
          delIdnos = idno.split(",");
        }
        else
        {
          delIdnos = new String[1];
          delIdnos[0] = idno;
        }
        for (int i = 0; i < delIdnos.length; i++)
        {
          DeviceInfo device = this.deviceService.findDeviceByIdno(delIdnos[i]);
          if (device != null)
          {
            this.deviceService.delDeviceInfo(device);
            addOperatorLog(device, Integer.valueOf(3));
            if (device.getUserID().intValue() != 0) {
              this.notifyService.sendCliDeviceChange(3, device.getUserID().intValue());
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
            break;
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
  
  private int rightNumeric(String str)
  {
    int ret = 0;
    int i = str.length();
    do
    {
      if (!Character.isDigit(str.charAt(i))) {
        break;
      }
      ret++;i--;
    } while (i >= 0);
    return ret;
  }
  
  private int getBatchIdnoRight(String idno)
  {
    int right = rightNumeric(idno);
    if (right >= 8) {
      right = 8;
    }
    return right;
  }
  
  private int parseBatchIdno(String idno, int count)
  {
    int right = getBatchIdnoRight(idno);
    if (right >= 3)
    {
      int maxidno = 1;
      for (int i = 0; i < right; i++) {
        maxidno *= 10;
      }
      int length = idno.length();
      String str = idno.substring(length - right, length);
      int idnoInt = Integer.parseInt(str);
      if (idnoInt + count >= maxidno) {
        return -1;
      }
      return idnoInt;
    }
    if (right == idno.length()) {
      return Integer.parseInt(idno);
    }
    return -1;
  }
  
  private String getBatchAddIdno(int idno, int right, String left)
  {
    String str = String.format("%d", new Object[] { Integer.valueOf(idno) });
    int length = str.length();
    for (int i = length; i < right; i++) {
      str = "0" + str;
    }
    return left + str;
  }
  
  public String batchAdd()
    throws Exception
  {
    try
    {
      String addCount = getRequestString("count");
      if ((addCount == null) || (addCount.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = new DeviceInfo();
        device = (DeviceInfo)AjaxUtils.getObject(getRequest(), device.getClass());
        
        int batchCount = Integer.parseInt(addCount);
        int addIdno = parseBatchIdno(device.getIdno(), batchCount);
        if (addIdno < 0)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(14));
        }
        else if (isDevTypeValid(device.getDevType()))
        {
          int length = device.getIdno().length();
          int right = getBatchIdnoRight(device.getIdno());
          String strLeft = device.getIdno().substring(0, length - right);
          
          List<DeviceInfo> devlist = new ArrayList();
          for (int i = 0; i < batchCount; i++)
          {
            DeviceInfo dev = new DeviceInfo();
            
            dev.setIdno(getBatchAddIdno(addIdno + i, right, strLeft));
            dev.setSimCard(dev.getIdno());
            dev.setChnCount(device.getChnCount());
            dev.setDevType(device.getDevType());
            dev.setDateProduct(device.getDateProduct());
            dev.setPayEnable(device.getPayEnable());
            dev.setPayBegin(device.getPayBegin());
            dev.setPayPeriod(device.getPayPeriod());
            dev.setPayDelayDay(device.getPayDelayDay());
            dev.setPayMonth(device.getPayMonth());
            dev.setStoDay(device.getStoDay());
            
            initDevice(dev);
            
            UserAccount account = new UserAccount();
            account.setName(dev.getIdno());
            dev.setUserAccount(account);
            updateUserAccount(dev);
            devlist.add(dev);
          }
          try
          {
            if (!this.deviceService.batchAddDevice(devlist).booleanValue())
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
            }
            else
            {
              Integer usrid = getSessionSysUsrId();
              if (usrid != null) {
                this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(3), Integer.valueOf(4), 
                  device.getIdno(), String.format("%d", new Object[] { Integer.valueOf(batchCount) }), "", "");
              }
            }
          }
          catch (Exception ex)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
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
  
  public String getSale()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      boolean readClient = true;
      if ((idno != null) && (!idno.isEmpty()))
      {
        DeviceInfo device = this.deviceService.findDeviceByIdno(idno);
        if (device != null)
        {
          addCustomResponse("name", device.getUserAccount().getName());
          addCustomResponse("idno", device.getIdno());
          addCustomResponse("devType", device.getDevType());
          addCustomResponse("chnCount", device.getChnCount());
          addCustomResponse("simCard", device.getSimCard());
          addCustomResponse("dateProduct", device.getDateProduct());
          addCustomResponse("clientId", device.getUserID());
          
          addCustomResponse("payEnable", device.getPayEnable());
          addCustomResponse("payBegin", device.getPayBegin());
          addCustomResponse("payPeriod", device.getPayPeriod());
          addCustomResponse("payMonth", device.getPayMonth());
          addCustomResponse("payDelayDay", device.getPayDelayDay());
          addCustomResponse("stoDay", device.getStoDay());
          if (device.getUserInfo() != null) {
            addCustomResponse("owner", device.getUserInfo().getUserAccount().getName());
          } else {
            addCustomResponse("owner", "");
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
          readClient = false;
        }
      }
      if (readClient)
      {
        AjaxDto<UserInfo> ajaxUser = this.userService.getUserList(null, Integer.valueOf(0), null, null);
        addCustomResponse("clients", ajaxUser.getPageList());
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String sale()
    throws Exception
  {
    try
    {
      String idno = getRequestString("idno");
      String client = getRequestString("clientId");
      if ((idno == null) || (idno.isEmpty()) || (client == null) || (client.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        Integer clientId = Integer.valueOf(Integer.parseInt(client));
        UserInfo userInfo = null;
        boolean isSale = true;
        if (clientId.intValue() != 0)
        {
          userInfo = (UserInfo)this.userService.get(clientId);
          if (userInfo == null)
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
            isSale = false;
          }
        }
        if (isSale)
        {
          DeviceInfo saveDevice = new DeviceInfo();
          saveDevice = (DeviceInfo)AjaxUtils.getObject(getRequest(), saveDevice.getClass());
          String[] delIdnos;
         
          if (idno.indexOf(",") != -1)
          {
            delIdnos = idno.split(",");
          }
          else
          {
            delIdnos = new String[1];
            delIdnos[0] = idno;
          }
          Map<Integer, Integer> oldClient = new HashMap();
          boolean notify = false;
          for (int i = 0; i < delIdnos.length; i++)
          {
            DeviceInfo device = this.deviceService.findDeviceByIdno(delIdnos[i]);
            if (device != null)
            {
              if ((!device.getUserID().equals(Integer.valueOf(0))) && 
                (!device.getUserID().equals(clientId)) && 
                (oldClient.get(device.getUserID()) == null)) {
                oldClient.put(device.getUserID(), device.getUserID());
              }
              device.setUserID(clientId);
              
              device.setPayEnable(saveDevice.getPayEnable());
              device.setPayBegin(saveDevice.getPayBegin());
              device.setPayMonth(saveDevice.getPayMonth());
              device.setPayDelayDay(saveDevice.getPayDelayDay());
              device.setPayPeriod(saveDevice.getPayPeriod());
              device.setStoDay(saveDevice.getStoDay());
              
              device.setDevGroupId(Integer.valueOf(0));
              this.deviceService.editDeviceInfo(device);
              notify = true;
              
              Integer usrid = getSessionSysUsrId();
              if (usrid != null) {
                if (userInfo != null) {
                  this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(3), Integer.valueOf(5), 
                    device.getId().toString(), device.getIdno(), userInfo.getId().toString(), userInfo.getUserAccount().getAccount());
                } else {
                  this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(3), Integer.valueOf(5), 
                    device.getId().toString(), device.getIdno(), "0", "");
                }
              }
            }
            else
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
              break;
            }
          }
          if (userInfo != null) {
            addCustomResponse("client", userInfo.getUserAccount().getName());
          } else {
            addCustomResponse("client", "");
          }
          if (notify)
          {
            if (clientId.intValue() != 0) {
              this.notifyService.sendCliDeviceChange(1, clientId.intValue());
            }
            Set set = oldClient.entrySet();
            for (Iterator iter = set.iterator(); iter.hasNext();)
            {
              Map.Entry entry = (Map.Entry)iter.next();
              this.notifyService.sendCliDeviceChange(3, ((Integer)entry.getKey()).intValue());
            }
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
  
  protected boolean isExportMdvr()
  {
    String type = getRequestString("type");
    if ((type != null) && (type.equals("mdvr"))) {
      return true;
    }
    return false;
  }
  
  protected boolean isExportMobile()
  {
    String type = getRequestString("type");
    if ((type != null) && (type.equals("mobile"))) {
      return true;
    }
    return false;
  }
  
  protected boolean isExportAll()
  {
    String type = getRequestString("type");
    if ((type != null) && (type.equals("all"))) {
      return true;
    }
    return false;
  }
  
  protected String[] genExcelHeads()
  {
    if (isExportAll())
    {
      String[] heads = new String[12];
      int j = 0;
      
      heads[(j++)] = getText("report.index");
      heads[(j++)] = getText("terminal.name");
      heads[(j++)] = getText("terminal.idno");
      heads[(j++)] = getText("terminal.type");
      heads[(j++)] = getText("client");
      heads[(j++)] = getText("terminal.sim");
      heads[(j++)] = getText("terminal.pay.enable");
      heads[(j++)] = getText("terminal.pay.begin");
      heads[(j++)] = getText("terminal.pay.period");
      heads[(j++)] = getText("terminal.pay.month");
      heads[(j++)] = getText("terminal.pay.delay.day");
      heads[(j++)] = getText("terminal.pay.status");
      return heads;
    }
    if (isExportMobile())
    {
      String[] heads = new String[11];
      int j = 0;
      heads[(j++)] = getText("report.index");
      heads[(j++)] = getText("terminal.mobile.name");
      heads[(j++)] = getText("terminal.mobile.account");
      heads[(j++)] = getText("client");
      heads[(j++)] = getText("terminal.mobile.sex");
      heads[(j++)] = getText("terminal.mobile.userIdno");
      heads[(j++)] = getText("terminal.mobile.telephone");
      heads[(j++)] = getText("terminal.mobile.post");
      heads[(j++)] = getText("terminal.mobile.card");
      heads[(j++)] = getText("terminal.mobile.address");
      heads[(j++)] = getText("terminal.mobile.remarks");
      return heads;
    }
    String[] heads = new String[10];
    int j = 0;
    heads[(j++)] = getText("report.index");
    heads[(j++)] = getText("terminal.vehile.name");
    heads[(j++)] = getText("terminal.vehile.idno");
    heads[(j++)] = getText("client");
    heads[(j++)] = getText("terminal.vehile.channel");
    heads[(j++)] = getText("terminal.vehile.sim");
    heads[(j++)] = getText("terminal.vehile.driverName");
    heads[(j++)] = getText("terminal.vehile.driverTele");
    heads[(j++)] = getText("terminal.vehile.branch");
    heads[(j++)] = getText("terminal.vehile.vehiType");
    return heads;
  }
  
  protected AjaxDto<DeviceInfo> queryExcelDevice()
  {
    String name = getRequestString("name");
    String client = getRequestString("clientId");
    Integer clientId = null;
    if (client != null) {
      clientId = Integer.valueOf(Integer.parseInt(client));
    }
    String expire = getRequestString("expireDay");
    Integer expireDay = null;
    if (expire != null) {
      expireDay = Integer.valueOf(Integer.parseInt(expire));
    }
    Integer devType = null;
    if (isExportMdvr()) {
      devType = Integer.valueOf(1);
    } else if (isExportMobile()) {
      devType = Integer.valueOf(2);
    }
    String order = getRequestString("order");
    String condition = "";
    if ((order != null) && (order.equals("2"))) {
      condition = " order by payBegin asc";
    } else if ((order != null) && (order.equals("1"))) {
      condition = " order by payBegin desc";
    }
    return this.deviceService.getDeviceList(name, clientId, devType, expireDay, null, condition);
  }
  
  protected void genMobileData(HSSFSheet sheet)
  {
    AjaxDto<DeviceInfo> ajaxDto = queryExcelDevice();
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceInfo device = (DeviceInfo)ajaxDto.getPageList().get(i - 1);
        HSSFRow row = sheet.createRow(1 + i);
        int j = 0;
        
        HSSFCell cell = row.createCell(j++);
        cell.setCellValue(i);
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserAccount().getName());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserAccount().getAccount());
        
        cell = row.createCell(j++);
        if (device.getUserInfo() != null) {
          cell.setCellValue(device.getUserInfo().getUserAccount().getName());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(j++);
        if ((device.getUserSex() != null) && (device.getUserSex().equals(Integer.valueOf(2)))) {
          cell.setCellValue(getText("female"));
        } else {
          cell.setCellValue(getText("male"));
        }
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserIDNO());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getSimCard());
        
        cell = row.createCell(j++);
        if ((device.getUserPost() != null) && (device.getUserPost().equals(Integer.valueOf(1)))) {
          cell.setCellValue(getText("postCaptain"));
        } else {
          cell.setCellValue(getText("postMember"));
        }
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserCardID());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserAddress());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getRemarks());
      }
    }
  }
  
  protected void genVehicleData(HSSFSheet sheet)
  {
    AjaxDto<DeviceInfo> ajaxDto = queryExcelDevice();
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceInfo device = (DeviceInfo)ajaxDto.getPageList().get(i - 1);
        HSSFRow row = sheet.createRow(1 + i);
        int j = 0;
        
        HSSFCell cell = row.createCell(j++);
        cell.setCellValue(i);
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserAccount().getName());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getIdno());
        
        cell = row.createCell(j++);
        if (device.getUserInfo() != null) {
          cell.setCellValue(device.getUserInfo().getUserAccount().getName());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(j++);
        cell.setCellValue(device.getChnCount().intValue());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getSimCard());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getDriverName());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getDriverTele());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getVehiBand());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getVehiType());
      }
    }
  }
  
  protected void genTermalData(HSSFSheet sheet)
  {
    AjaxDto<DeviceInfo> ajaxDto = queryExcelDevice();
    if (ajaxDto.getPageList() != null) {
      for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
      {
        DeviceInfo device = (DeviceInfo)ajaxDto.getPageList().get(i - 1);
        HSSFRow row = sheet.createRow(1 + i);
        int j = 0;
        
        HSSFCell cell = row.createCell(j++);
        cell.setCellValue(i);
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getUserAccount().getName());
        
        cell = row.createCell(j++);
        cell.setCellValue(device.getIdno());
        
        cell = row.createCell(j++);
        if (1 == device.getDevType().intValue()) {
          cell.setCellValue(getText("terminal.type.mdvr"));
        } else if (2 == device.getDevType().intValue()) {
          cell.setCellValue(getText("terminal.type.mobile"));
        } else if (3 == device.getDevType().intValue()) {
          cell.setCellValue(getText("terminal.type.dvs"));
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(j++);
        if (device.getUserInfo() != null) {
          cell.setCellValue(device.getUserInfo().getUserAccount().getName());
        } else {
          cell.setCellValue("");
        }
        cell = row.createCell(j++);
        cell.setCellValue(device.getSimCard());
        
        cell = row.createCell(j++);
        boolean isPayEnable = false;
        if ((device.getPayEnable() != null) && (device.getPayEnable().intValue() == 1))
        {
          cell.setCellValue(getText("yes"));
          isPayEnable = true;
        }
        else
        {
          cell.setCellValue(getText("no"));
        }
        cell = row.createCell(j++);
        if (device.getPayBegin() != null) {
          cell.setCellValue(DateUtil.dateSwitchDateString(device.getPayBegin()));
        }
        cell = row.createCell(j++);
        if (device.getPayMonth() != null) {
          cell.setCellValue(device.getPayPeriod().intValue());
        }
        cell = row.createCell(j++);
        if (device.getPayMonth() != null) {
          cell.setCellValue(device.getPayMonth().intValue());
        }
        cell = row.createCell(j++);
        if (device.getPayDelayDay() != null) {
          cell.setCellValue(device.getPayDelayDay().intValue());
        }
        cell = row.createCell(j++);
        if (isPayEnable)
        {
          Date end = DateUtil.dateIncrease(device.getPayBegin(), device.getPayMonth(), device.getPayDelayDay());
          Date now = DateUtil.dateSameTime(new Date(), end);
          if (DateUtil.compareDate(now, end)) {
            cell.setCellValue(getText("terminal.pay.abnormal"));
          } else {
            cell.setCellValue(getText("terminal.pay.normal"));
          }
        }
        else
        {
          cell.setCellValue(getText("terminal.pay.normal"));
        }
      }
    }
  }
  
  protected void genExcelData(HSSFSheet sheet)
  {
    try
    {
      if (isExportAll()) {
        genTermalData(sheet);
      } else if (isExportMobile()) {
        genMobileData(sheet);
      } else {
        genVehicleData(sheet);
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected String genExcelTitle()
  {
    String curDate = DateUtil.dateSwitchString(new Date());
    curDate.replace(':', '-');
    if (isExportAll()) {
      return getText("terminal.title") + " - " + curDate;
    }
    if (isExportMobile()) {
      return getText("terminal.mobile.title") + " - " + curDate;
    }
    return getText("terminal.vehile.title") + " - " + curDate;
  }
  
  protected String getCellString(HSSFRow row, int i)
  {
    HSSFCell cell = row.getCell(i);
    if (cell != null) {
      return cell.toString().trim();
    }
    return "";
  }
  
  protected boolean importTerminalMobile(HSSFRow row, DeviceInfo device, int j)
  {
    device.setDevType(Integer.valueOf(2));
    
    initDevice(device);
    
    updateUserAccount(device);
    
    String sex = getCellString(row, j++);
    if (sex.equals(getText("female"))) {
      device.setUserSex(Integer.valueOf(2));
    } else {
      device.setUserSex(Integer.valueOf(1));
    }
    String userIdno = getCellString(row, j++);
    device.setUserIDNO(userIdno);
    
    device.setSimCard(getCellString(row, j++));
    
    String post = getCellString(row, j++);
    if (post.equals(getText("postCaptain"))) {
      device.setUserPost(Integer.valueOf(2));
    } else {
      device.setUserSex(Integer.valueOf(1));
    }
    device.setUserCardID(getCellString(row, j++));
    
    device.setUserAddress(getCellString(row, j++));
    
    device.setRemarks(getCellString(row, j++));
    if (!this.deviceService.addDeviceInfo(device).booleanValue()) {
      return false;
    }
    DeviceInfo devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
    addOperatorLog(devAdd, Integer.valueOf(1));
    return true;
  }
  
  protected boolean importTerminalMdvr(HSSFRow row, DeviceInfo device, int j)
  {
    device.setDevType(Integer.valueOf(1));
    
    initDevice(device);
    
    updateUserAccount(device);
    
    String name = getCellString(row, j++);
    if ((name != null) && (!name.isEmpty()))
    {
      UserInfo parentUser = this.userService.findByName(name);
      if (parentUser != null) {
        device.setUserID(parentUser.getId());
      }
    }
    String sim = getCellString(row, j++);
    String s = "";
    if (sim.indexOf(".") == -1) {
      s = sim;
    } else {
      s = sim.substring(0, sim.indexOf("."));
    }
    if (StringUtil.isNumeric(s)) {
      device.setSimCard(s);
    }
    String payEnable = getCellString(row, j++);
    if (payEnable.equals(getText("yes"))) {
      device.setPayEnable(Integer.valueOf(1));
    } else {
      device.setPayEnable(Integer.valueOf(0));
    }
    device.setPayBegin(DateUtil.StrDate2Date(getCellString(row, j++)));
    
    String payPeriodStr = getCellString(row, j++);
    String payPeriod = "";
    if (payPeriodStr.indexOf(".") == -1) {
      payPeriod = payPeriodStr;
    } else {
      payPeriod = payPeriodStr.substring(0, payPeriodStr.indexOf("."));
    }
    if ((payPeriod != null) && (!payPeriod.isEmpty())) {
      device.setPayPeriod(Integer.valueOf(Integer.parseInt(payPeriod)));
    }
    String payMonthStr = getCellString(row, j++);
    String payMonth = "";
    if (payMonthStr.indexOf(".") == -1) {
      payMonth = payMonthStr;
    } else {
      payMonth = payMonthStr.substring(0, payMonthStr.indexOf("."));
    }
    if ((payMonth != null) && (!payMonth.isEmpty())) {
      device.setPayMonth(Integer.valueOf(Integer.parseInt(payMonth)));
    }
    String payDelayDayStr = getCellString(row, j++);
    String payDelayDay = "";
    if (payDelayDayStr.indexOf(".") == -1) {
      payDelayDay = payDelayDayStr;
    } else {
      payDelayDay = payDelayDayStr.substring(0, payDelayDayStr.indexOf("."));
    }
    if ((payDelayDay != null) && (!payDelayDay.isEmpty())) {
      device.setPayDelayDay(Integer.valueOf(Integer.parseInt(payDelayDay)));
    }
    if (!this.deviceService.addDeviceInfo(device).booleanValue()) {
      return false;
    }
    DeviceInfo devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
    addOperatorLog(devAdd, Integer.valueOf(1));
    return true;
  }
  
  public String importExcel()
    throws Exception
  {
    try
    {
      String importType = getRequestString("importType");
      if (isDevTypeValid(Integer.valueOf(Integer.parseInt(importType))))
      {
        FileInputStream is = new FileInputStream(this.uploadFile);
        HSSFWorkbook wbs = new HSSFWorkbook(is);
        HSSFSheet childSheet = wbs.getSheetAt(0);
        List<UserAccount> failedAccount = new ArrayList();
        for (int i = 2; i < childSheet.getLastRowNum() + 1; i++)
        {
          HSSFRow row = childSheet.getRow(i);
          if (row != null)
          {
            int j = 0;
            
            j++;
            
            String namestr = getCellString(row, j++);
            String str = getCellString(row, j++);
            String name = "";
            if (namestr.indexOf(".") == -1) {
              name = namestr;
            } else {
              name = namestr.substring(0, namestr.indexOf("."));
            }
            String account = "";
            if (str.indexOf(".") == -1) {
              account = str;
            } else {
              account = str.substring(0, str.indexOf("."));
            }
            UserAccount userAccount = new UserAccount();
            userAccount.setName(name);
            userAccount.setAccount(account);
            if ((!name.isEmpty()) && (name.length() < 16) && (!account.isEmpty()) && (StringUtil.isNumAndChar(account)) && (account.length() < 32))
            {
              DeviceInfo device = new DeviceInfo();
              device.setIdno(account);
              device.setUserAccount(userAccount);
              UserAccount findAccount = this.accountService.findByAccount(device.getIdno());
              if ((findAccount == null) && (!this.accountService.isAccountUnvalid(device.getIdno())))
              {
                boolean ret = false;
                if ((importType != null) && (importType.equals("2")))
                {
                  ret = importTerminalMobile(row, device, j);
                }
                else
                {
                  String devType = getCellString(row, j++);
                  ret = importTerminalMdvr(row, device, j);
                }
                if (!ret) {
                  failedAccount.add(userAccount);
                }
              }
              else
              {
                failedAccount.add(userAccount);
                System.out.println("����������������������������admin, account:" + account);
              }
            }
            else
            {
              failedAccount.add(userAccount);
              System.out.println("����������������������name:" + name + ",account:" + account);
            }
            System.out.println("��������" + row.getLastCellNum());
          }
          addCustomResponse("accounts", failedAccount);
        }
        is.close();
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String getUnreg()
  {
    try
    {
      String idno = getRequestString("idno");
      if (idno.equals(""))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        DeviceInfo device = this.deviceService.findDeviceByIdno(idno);
        if (device == null)
        {
          String[] devIdnos = new String[1];
          devIdnos[0] = idno;
          AjaxDto<DeviceStatus> dto = this.deviceService.getDeviceStatus(devIdnos);
          if ((dto.getPageList() != null) && (dto.getPageList().size() > 0))
          {
            DeviceStatus status = (DeviceStatus)dto.getPageList().get(0);
            addCustomResponse("name", status.getDevIdno());
            addCustomResponse("idno", status.getDevIdno());
            addCustomResponse("devType", Integer.valueOf(1));
            
            AjaxDto<UserInfo> ajaxUser = this.userService.getUserList(null, Integer.valueOf(0), null, null);
            addCustomResponse("clients", ajaxUser.getPageList());
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(30));
          }
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(35));
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
  
  public String saveUnreg()
  {
    try
    {
      DeviceInfo device = new DeviceInfo();
      device = (DeviceInfo)AjaxUtils.getObject(getRequest(), device.getClass());
      
      DeviceInfo findDevice = this.deviceService.findDeviceByIdno(device.getIdno());
      if (findDevice != null)
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(35));
      }
      else
      {
        UserAccount account = this.accountService.findByAccount(device.getIdno());
        if ((account != null) || (this.accountService.isAccountUnvalid(device.getIdno())))
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(11));
        }
        else
        {
          updateUserAccount(device);
          
          initDevice(device);
          
          boolean error = false;
          boolean sale = false;
          String clientId = getRequestString("clientId");
          UserInfo userInfo = null;
          if (!clientId.equals(""))
          {
            Integer userId = Integer.valueOf(Integer.parseInt(clientId));
            if (userId.intValue() != 0)
            {
              userInfo = (UserInfo)this.userService.get(userId);
              if (userInfo == null)
              {
                addCustomResponse(ACTION_RESULT, Integer.valueOf(16));
                error = true;
              }
              else
              {
                device.setUserID(userId);
                
                device.setDevGroupId(Integer.valueOf(0));
                sale = true;
              }
            }
          }
          if (!error) {
            if (!this.deviceService.addDeviceInfo(device).booleanValue())
            {
              addCustomResponse(ACTION_RESULT, Integer.valueOf(13));
            }
            else
            {
              DeviceInfo devAdd = null;
              try
              {
                devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
              }
              catch (Exception ex)
              {
                this.log.error(ex.getMessage(), ex);
                
                UserAccount acount = this.accountService.findByAccount(device.getIdno());
                if (acount != null)
                {
                  this.deviceService.updateDeviceAccountId(device.getIdno(), acount.getId());
                  try
                  {
                    devAdd = this.deviceService.findDeviceByIdno(device.getIdno());
                  }
                  catch (Exception ex2)
                  {
                    this.deviceService.deleteDeviceNative(device.getIdno());
                    addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
                  }
                }
                else
                {
                  this.log.error("SysDeviceAction saveUnreg add device auto increase id failed");
                  this.deviceService.deleteDeviceNative(device.getIdno());
                  addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
                }
              }
              if (devAdd != null)
              {
                addOperatorLog(devAdd, Integer.valueOf(1));
                this.notifyService.sendDeviceInfoChange(1, device.getIdno());
                if (sale)
                {
                  Integer usrid = getSessionSysUsrId();
                  this.sysUserService.addSysUsrLog(usrid, Integer.valueOf(3), Integer.valueOf(5), 
                    devAdd.getId().toString(), devAdd.getIdno(), userInfo.getId().toString(), userInfo.getUserAccount().getAccount());
                  this.notifyService.sendCliDeviceChange(1, Integer.parseInt(clientId));
                }
              }
            }
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
