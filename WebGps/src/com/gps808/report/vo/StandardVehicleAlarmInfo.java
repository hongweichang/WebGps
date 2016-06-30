package com.gps808.report.vo;

import com.framework.logger.Logger;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.QueryScalar;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardCompany;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.model.StandardVehiDevRelationEx;
import com.gps808.operationManagement.service.StandardUserService;
import com.gps808.operationManagement.vo.StandardVehiDevRelationExMore;
import com.gps808.rule.service.StandardVehicleRuleService;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.LocaleProvider;
import com.opensymphony.xwork2.TextProvider;
import com.opensymphony.xwork2.TextProviderFactory;
import com.opensymphony.xwork2.inject.Container;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleAlarmInfo
  implements LocaleProvider
{
  private transient TextProvider textProvider;
  private Container container;
  private final transient Logger log = Logger.getLogger(StandardVehicleAlarmInfo.class);
  private StandardDeviceAlarm alarm;
  private StandardUserService standardUserService;
  private StandardVehicleRuleService vehicleRuleService;
  private Map<Integer, String> mapArea;
  
  public Locale getLocale()
  {
    ActionContext ctx = ActionContext.getContext();
    if (ctx != null) {
      return ctx.getLocale();
    }
    if (this.log.isDebugEnabled()) {
      this.log.error("Action context not initialized");
    }
    return null;
  }
  
  private TextProvider getTextProvider()
  {
    if (this.textProvider == null)
    {
      TextProviderFactory tpf = new TextProviderFactory();
      if (this.container != null) {
        this.container.inject(tpf);
      }
      this.textProvider = tpf.createInstance(getClass(), this);
    }
    return this.textProvider;
  }
  
  public String getText(String aTextName)
  {
    return getTextProvider().getText(aTextName);
  }
  
  public StandardVehicleAlarmInfo() {}
  
  public StandardVehicleAlarmInfo(StandardDeviceAlarm alarm)
  {
    this.alarm = alarm;
  }
  
  public void setAlarm(StandardDeviceAlarm alarm)
  {
    this.alarm = alarm;
  }
  
  public void setStandardUserService(StandardUserService standardUserService)
  {
    this.standardUserService = standardUserService;
  }
  
  public void setVehicleRuleService(StandardVehicleRuleService vehicleRuleService)
  {
    this.vehicleRuleService = vehicleRuleService;
  }
  
  public String getSignalLossAlarm(int armType)
  {
    return "";
  }
  
  public String getUserDefineAlarm(int armType)
  {
    return "";
  }
  
  public String getIOAlarm(int io, int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      List<QueryScalar> scalars = new ArrayList();
      scalars.add(new QueryScalar("ioInName", StandardBasicTypes.STRING));
      List<StandardVehiDevRelationExMore> relations = this.standardUserService.getStandardVehiDevRelationExMoreList(null, this.alarm.getDevIdno(), scalars, ", b.IOInName as ioInName ", ",jt808_vehicle_info b where a.VehiIDNO = b.VehiIDNO ");
      StandardVehiDevRelationExMore relation = null;
      if ((relations != null) && (relations.size() > 0))
      {
        relation = (StandardVehiDevRelationExMore)relations.get(0);
        if ((relation.getIoInAttr() != null) && (!relation.getIoInAttr().isEmpty()))
        {
          String[] ioInName = relation.getIoInName().split(",");
          if (ioInName.length >= io + 1) {
            strDesc = ioInName[io];
          } else {
            strDesc = "IO_" + (io + 1);
          }
        }
        else
        {
          strDesc = "IO_" + (io + 1);
        }
      }
    }
    return strDesc;
  }
  
  public String getUrgencyButtonAlarm(int armType)
  {
    String strDesc = "";
    if ((this.alarm != null) && 
      (armType == 2)) {
      if (this.alarm.getParam1().intValue() == 1) {
        strDesc = " 1 " + getText("report.second");
      } else if (this.alarm.getParam1().intValue() == 5) {
        strDesc = " 5 " + getText("report.second");
      }
    }
    return strDesc;
  }
  
  public String getShakeAlarm(int armType)
  {
    return "";
  }
  
  public String getOvertimeParkAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      if (this.alarm.getParam2().intValue() != 0) {
        strDesc = getText("report.park.time") + ": " + getTimeDifference(this.alarm.getParam2().intValue() * 1000);
      } else {
        strDesc = getText("report.park.time") + ": " + getTimeDifference(this.alarm.getArmInfo().intValue() * 1000);
      }
      strDesc = strDesc + "," + getText("report.alarm.setTimeLong") + ": " + getTimeDifference(this.alarm.getParam1().intValue() * 1000);
    }
    return strDesc;
  }
  
  public String getVideoLostAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      strDesc = getChnString(this.alarm.getDevIdno(), this.alarm.getArmInfo().intValue());
    }
    return strDesc;
  }
  
  public String getVideoMaskAlarm(int armType)
  {
    return "";
  }
  
  public String getDoorOpenLawlessAlarm(int armType)
  {
    return "";
  }
  
  public String getWrongPwdAlarm(int armType)
  {
    return "";
  }
  
  public String getFireLowlessAlarm(int armType)
  {
    return "";
  }
  
  public String getTemperatorAlarm(int armType)
  {
    String strDesc = "";
    if ((this.alarm != null) && (armType == 9))
    {
      if (this.alarm.getArmInfo().intValue() == 0) {
        strDesc = getText("report.alarm.deviceTemp");
      } else if (this.alarm.getArmInfo().intValue() == 1) {
        strDesc = getText("report.alarm.moterTemp");
      } else if (this.alarm.getArmInfo().intValue() == 2) {
        strDesc = getText("report.alarm.coachTemp");
      }
      strDesc = 
      
        strDesc + strDesc + ": " + getTempString(this.alarm.getParam1().intValue()) + ", " + getText("report.alarm.minTemp") + ": " + getTempString(this.alarm.getParam2().intValue()) + ", " + getText("report.alarm.maxTemp") + ": " + getTempString(this.alarm.getParam3().intValue());
    }
    return strDesc;
  }
  
  public String getDiskErrAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      strDesc = getDiskType(this.alarm.getArmInfo().intValue());
    }
    return strDesc;
  }
  
  public String getOverSpeedAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      if (this.alarm.getParam3().intValue() / 10.0D > 0.0D)
      {
        strDesc = strDesc + getText("report.alarm.alarmSpeed") + ": " + getSpeedString(this.alarm.getStartSpeed());
        strDesc = strDesc + ", " + getText("report.alarm.minSpeed") + ": " + getSpeedString(this.alarm.getParam2());
        strDesc = strDesc + ", " + getText("report.alarm.maxSpeed") + ": " + getSpeedString(this.alarm.getParam3());
      }
      else
      {
        strDesc = strDesc + getText("report.alarm.alarmSpeed") + ": " + getSpeedString(this.alarm.getStartSpeed());
      }
    }
    return strDesc;
  }
  
  public String getNightDrivingAlarm(int armType)
  {
    return "";
  }
  
  public String getGatheringAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      if (armType == 153)
      {
        strDesc = strDesc + getText("report.alarm.durationTime") + "(" + this.alarm.getParam1() + getText("report.second") + ")";
        strDesc = strDesc + ", " + getText("report.alarm.vehicleNumber") + "(" + this.alarm.getParam2() + ")";
      }
      else
      {
        strDesc = strDesc + getText("report.alarm.durationTime") + "(" + this.alarm.getParam1() + getText("report.second") + ")";
      }
    }
    return strDesc;
  }
  
  public String getUSPCutAlarm(int armType)
  {
    return "";
  }
  
  public String getHddHighTempAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = strDesc + getText("harddisk") + (this.alarm.getArmInfo().intValue() + 1);
      
      strDesc = strDesc + ", " + getDiskType(this.alarm.getParam1().intValue());
      
      strDesc = strDesc + ", " + getText("report.tempsensor.name") + "(" + this.alarm.getParam2() + getText("report.alarm.tempUnit") + ")";
    }
    return strDesc;
  }
  
  public String getBeBoOpenedAlarm(int armType)
  {
    return "";
  }
  
  public String getTurnOffAlarm(int armType)
  {
    return "";
  }
  
  public String getDiskSpaceAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = strDesc + getText("harddisk") + (this.alarm.getArmInfo().intValue() + 1);
      
      strDesc = strDesc + ", " + getDiskType(this.alarm.getParam1().intValue());
      
      strDesc = strDesc + ", " + getText("report.alarm.allCapacity") + "(" + this.alarm.getParam2() + "MB" + ")";
      
      strDesc = strDesc + ", " + getText("report.alarm.surCapacity") + "(" + this.alarm.getParam3() + "MB" + ")";
    }
    return strDesc;
  }
  
  public String getSimLostAlarm(int armType)
  {
    return "";
  }
  
  public String getBeyondBoundsAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      if (this.alarm.getArmInfo().intValue() == 0) {
        strDesc = getText("report.alarm.beyondBoundsInto");
      } else {
        strDesc = getText("report.alarm.beyondBoundsOut");
      }
      strDesc = strDesc + ", " + getText("report.alarm.beyondBoundsNo") + ": " + this.alarm.getParam1();
    }
    return strDesc;
  }
  
  public String getDoorAbnormalAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      if (this.alarm.getArmInfo().intValue() == 0) {
        strDesc = getText("report.alarm.doorAbnormal1");
      } else if (this.alarm.getArmInfo().intValue() == 1) {
        strDesc = getText("report.alarm.doorAbnormal2");
      } else if (this.alarm.getArmInfo().intValue() == 2) {
        strDesc = getText("report.alarm.doorAbnormal3");
      }
    }
    return strDesc;
  }
  
  public String getOnlineAlarm(int armType)
  {
    return "";
  }
  
  public String getACCAlarm(int armType)
  {
    return "";
  }
  
  public String getMotionAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      strDesc = getChnString(this.alarm.getDevIdno(), this.alarm.getArmInfo().intValue());
    }
    return strDesc;
  }
  
  public String getOilAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      if ((armType == 46) || (armType == 86)) {
        strDesc = getText("report.oil.add");
      } else {
        strDesc = getText("report.oil.oilDec");
      }
      strDesc = getText("report.alarm.oilBegin") + ": " + getOilString(this.alarm.getParam1()) + ", " + strDesc + ": " + getOilString(this.alarm.getArmInfo());
    }
    return strDesc;
  }
  
  public String getFatigueAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      switch (this.alarm.getArmInfo().intValue())
      {
      case 0: 
        break;
      case 1: 
        strDesc = getText("report.alarm.fatigueType1");
        break;
      case 2: 
        strDesc = getText("report.alarm.fatigueType2");
        break;
      case 3: 
        strDesc = getText("report.alarm.fatigueType3");
        break;
      case 4: 
        strDesc = getText("report.alarm.fatigueType4");
      }
    }
    return strDesc;
  }
  
  public String getCMSAreaOverSpeedAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = getAreaType(this.alarm.getParam1().intValue(), this.alarm.getParam2().intValue());
      strDesc = strDesc + ", " + getText("report.alarm.thresholdSpeed") + "(" + getSpeedString(Integer.valueOf(this.alarm.getParam3().intValue() * 10)) + 
        "), " + getText("report.alarm.currentSpeed") + "(" + getSpeedString(this.alarm.getStartSpeed()) + ")";
    }
    return strDesc;
  }
  
  public String getCMSRoadLelOverSpeedAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = strDesc + getRoadLel(this.alarm.getParam1().intValue());
      strDesc = strDesc + ", " + getText("report.alarm.thresholdSpeed") + "(" + getSpeedString(Integer.valueOf(this.alarm.getParam3().intValue() * 10)) + 
        "), " + getText("report.alarm.currentSpeed") + "(" + getSpeedString(this.alarm.getStartSpeed()) + ")";
    }
    return strDesc;
  }
  
  public String getCMSAreaInOutAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = getAreaType(this.alarm.getParam1().intValue(), this.alarm.getParam2().intValue());
      if (this.alarm.getParam3().intValue() == 0) {
        strDesc = strDesc + ", " + getText("direction") + "(" + getText("report.alarm.into") + ")";
      } else if (this.alarm.getParam3().intValue() == 1) {
        strDesc = strDesc + ", " + getText("direction") + "(" + getText("report.alarm.out") + ")";
      }
    }
    return strDesc;
  }
  
  public String getCMSTimeOverSpeedAlarm(int armType)
  {
    return "";
  }
  
  public String getCMSTimeLowSpeedAlarm(int armType)
  {
    return "";
  }
  
  public String getCMSFatigueAlarm(int armType)
  {
    return "";
  }
  
  public String getCMSParkTooLongAlarm(int armType)
  {
    return "";
  }
  
  public String getCMSAreaPointAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = getAreaType(this.alarm.getParam1().intValue(), this.alarm.getParam2().intValue());
      if (this.alarm.getParam3().intValue() == 0) {
        strDesc = strDesc + ", " + getText("report.alarm.notArrive");
      } else if (this.alarm.getParam3().intValue() == 1) {
        strDesc = strDesc + ", " + getText("report.alarm.notLeave");
      }
    }
    return strDesc;
  }
  
  public String getEventFileUpload(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      int recType = 0;
      int size = 0;
      int chn = 0;
      String desc = "";
      if (armType == 109)
      {
        recType = this.alarm.getParam2().intValue();
        size = this.alarm.getParam1().intValue();
        chn = this.alarm.getParam4().intValue();
        desc = this.alarm.getArmDesc();
      }
      else if (armType == 130)
      {
        recType = this.alarm.getParam3().intValue();
        size = this.alarm.getParam2().intValue();
        chn = this.alarm.getParam1().intValue();
        desc = this.alarm.getImgInfo();
      }
      strDesc = getText("report.alarm.recordType") + ": " + getRecordTypeStr(recType) + ", ";
      strDesc = strDesc + getText("report.alarm.recordSize") + ": " + getFileSize(size) + ", ";
      strDesc = strDesc + getText("report.channel.name") + ": " + getChnString(this.alarm.getDevIdno(), chn) + ", ";
      strDesc = strDesc + getText("report.alarm.recordName") + ": " + desc;
    }
    return strDesc;
  }
  
  public String getDriverInfo(int armType)
  {
    return "";
  }
  
  public String getEventStationInfo(int armType)
  {
    return "";
  }
  
  public String getFenceAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = getAreaType(this.alarm.getParam1().intValue(), this.alarm.getParam2().intValue());
      switch (armType)
      {
      case 29: 
      case 30: 
      case 31: 
      case 32: 
      case 79: 
      case 80: 
      case 81: 
      case 82: 
        strDesc = strDesc + ", " + getText("report.alarm.alarmSpeed") + ": " + getSpeedString(this.alarm.getStartSpeed());
        strDesc = strDesc + ", " + getText("report.alarm.minSpeed") + ": " + getSpeedString(this.alarm.getParam2());
        strDesc = strDesc + ", " + getText("report.alarm.maxSpeed") + ": " + getSpeedString(this.alarm.getParam3());
      }
    }
    return strDesc;
  }
  
  public String getAreaOverSpeedAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null) {
      strDesc = getAreaType(this.alarm.getParam1().intValue(), this.alarm.getParam2().intValue());
    }
    return strDesc;
  }
  
  public String getWarningAlarm(int armType)
  {
    return "";
  }
  
  public String getGNSSModuleFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getGNSSAntennaMissedOrCutAlarm(int armType)
  {
    return "";
  }
  
  public String getGNSSAntennaShortAlarm(int armType)
  {
    return "";
  }
  
  public String getSupplyUndervoltageAlarm(int armType)
  {
    return "";
  }
  
  public String getPowerFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getLCDFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getTTSModuleFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getCameraFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getDrivingTimeoutAlarm(int armType)
  {
    return "";
  }
  
  public String getRoadTravelTimeAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      strDesc = getText("report.alarm.lineName") + "(" + getAreaName(this.alarm.getParam1()) + "), ";
      strDesc = strDesc + getText("report.time") + "(" + this.alarm.getParam2() + getText("report.second") + ")";
    }
    return strDesc;
  }
  
  public String getRouteDeviationAlarm(int armType)
  {
    return "";
  }
  
  public String getVSSFailureAlarm(int armType)
  {
    return "";
  }
  
  public String getAbnormalFuelAlarm(int armType)
  {
    return "";
  }
  
  public String getAntitheftDeviceAlarm(int armType)
  {
    return "";
  }
  
  public String getIllegalDisplacementAlarm(int armType)
  {
    return "";
  }
  
  public String getRolloverAlarm(int armType)
  {
    return "";
  }
  
  public String getTpmsAlarm(int armType)
  {
    String strDesc = "";
    if (this.alarm != null)
    {
      if (this.alarm.getParam1() != null) {
        strDesc = getText("report.current.temperature") + ":" + this.alarm.getParam1().intValue() / 10.0D + getText("report.alarm.tempUnit") + ";";
      } else {
        strDesc = getText("report.current.temperature") + ":0" + getText("report.alarm.tempUnit") + ";";
      }
      if (this.alarm.getParam2() != null) {
        strDesc = strDesc + getText("report.the.current.tire.pressure") + ":" + this.alarm.getParam2().intValue() / 10.0D + "P;";
      } else {
        strDesc = strDesc + getText("report.the.current.tire.pressure") + ":0P;";
      }
      if (this.alarm.getParam3() != null) {
        strDesc = strDesc + getText("report.current.voltage") + ":" + this.alarm.getParam3().intValue() / 10.0D + "V;";
      } else {
        strDesc = strDesc + getText("report.current.voltage") + ":0V;";
      }
    }
    return strDesc;
  }
  
  public String getFormatMDVRAlarmString(int armType)
  {
    switch (armType)
    {
    case 18: 
    case 68: 
      return getSignalLossAlarm(armType);
    case 1: 
    case 51: 
      return getUserDefineAlarm(armType);
    case 19: 
    case 69: 
      return getIOAlarm(0, armType);
    case 20: 
    case 70: 
      return getIOAlarm(1, armType);
    case 21: 
    case 71: 
      return getIOAlarm(2, armType);
    case 22: 
    case 72: 
      return getIOAlarm(3, armType);
    case 23: 
    case 73: 
      return getIOAlarm(4, armType);
    case 24: 
    case 74: 
      return getIOAlarm(5, armType);
    case 25: 
    case 75: 
      return getIOAlarm(6, armType);
    case 26: 
    case 76: 
      return getIOAlarm(7, armType);
    case 41: 
    case 91: 
      return getIOAlarm(8, armType);
    case 42: 
    case 92: 
      return getIOAlarm(9, armType);
    case 43: 
    case 93: 
      return getIOAlarm(10, armType);
    case 44: 
    case 94: 
      return getIOAlarm(11, armType);
    case 2: 
    case 52: 
      return getUrgencyButtonAlarm(armType);
    case 3: 
    case 53: 
      return getShakeAlarm(armType);
    case 14: 
    case 64: 
      return getOvertimeParkAlarm(armType);
    case 4: 
    case 54: 
      return getVideoLostAlarm(armType);
    case 5: 
    case 55: 
      return getVideoMaskAlarm(armType);
    case 6: 
    case 56: 
      return getDoorOpenLawlessAlarm(armType);
    case 7: 
    case 57: 
      return getWrongPwdAlarm(armType);
    case 8: 
    case 58: 
      return getFireLowlessAlarm(armType);
    case 9: 
    case 59: 
      return getTemperatorAlarm(armType);
    case 10: 
    case 60: 
      return getDiskErrAlarm(armType);
    case 11: 
    case 61: 
      return getOverSpeedAlarm(armType);
    case 151: 
    case 152: 
      return getNightDrivingAlarm(armType);
    case 153: 
    case 154: 
      return getGatheringAlarm(armType);
    case 155: 
    case 156: 
      return getUSPCutAlarm(armType);
    case 157: 
    case 158: 
      return getHddHighTempAlarm(armType);
    case 159: 
    case 160: 
      return getBeBoOpenedAlarm(armType);
    case 161: 
      return getTurnOffAlarm(armType);
    case 162: 
    case 163: 
      return getDiskSpaceAlarm(armType);
    case 166: 
    case 167: 
      return getSimLostAlarm(armType);
    case 12: 
    case 62: 
      return getBeyondBoundsAlarm(armType);
    case 13: 
    case 63: 
      return getDoorAbnormalAlarm(armType);
    case 17: 
    case 67: 
      return getOnlineAlarm(armType);
    case 16: 
    case 66: 
      return getACCAlarm(armType);
    case 15: 
    case 65: 
      return getMotionAlarm(armType);
    case 46: 
    case 47: 
    case 86: 
    case 87: 
      return getOilAlarm(armType);
    case 49: 
    case 99: 
      return getFatigueAlarm(armType);
    case 300: 
    case 301: 
    case 350: 
    case 351: 
      return getCMSAreaOverSpeedAlarm(armType);
    case 302: 
    case 303: 
    case 352: 
    case 353: 
      return getCMSAreaInOutAlarm(armType);
    case 304: 
    case 354: 
      return getCMSTimeOverSpeedAlarm(armType);
    case 305: 
    case 355: 
      return getCMSTimeLowSpeedAlarm(armType);
    case 306: 
    case 356: 
      return getCMSFatigueAlarm(armType);
    case 307: 
    case 357: 
      return getCMSParkTooLongAlarm(armType);
    case 308: 
    case 358: 
      return getCMSAreaPointAlarm(armType);
    case 309: 
    case 310: 
    case 359: 
    case 360: 
      return getCMSAreaOverSpeedAlarm(armType);
    case 311: 
      return getCMSRoadLelOverSpeedAlarm(armType);
    case 101: 
      return "";
    case 102: 
      return "";
    case 103: 
      return "";
    case 104: 
      return "";
    case 105: 
      return "";
    case 106: 
      return "";
    case 107: 
      return "";
    case 108: 
      return "";
    case 109: 
      return getEventFileUpload(armType);
    case 111: 
      return "";
    case 114: 
      return "";
    case 115: 
      return "";
    case 116: 
      return getDriverInfo(armType);
    case 130: 
      return getEventFileUpload(armType);
    case 110: 
      return getEventStationInfo(armType);
    case 113: 
      return "";
    case 132: 
      return "";
    case 27: 
    case 28: 
    case 29: 
    case 30: 
    case 31: 
    case 32: 
    case 33: 
    case 34: 
    case 77: 
    case 78: 
    case 79: 
    case 80: 
    case 81: 
    case 82: 
    case 83: 
    case 84: 
      return getFenceAlarm(armType);
    case 200: 
    case 250: 
      return getAreaOverSpeedAlarm(armType);
    case 201: 
    case 251: 
      return getWarningAlarm(armType);
    case 202: 
    case 252: 
      return getGNSSModuleFailureAlarm(armType);
    case 203: 
    case 253: 
      return getGNSSAntennaMissedOrCutAlarm(armType);
    case 204: 
    case 254: 
      return getGNSSAntennaShortAlarm(armType);
    case 205: 
    case 255: 
      return getSupplyUndervoltageAlarm(armType);
    case 206: 
    case 256: 
      return getPowerFailureAlarm(armType);
    case 207: 
    case 257: 
      return getLCDFailureAlarm(armType);
    case 208: 
    case 258: 
      return getTTSModuleFailureAlarm(armType);
    case 209: 
    case 259: 
      return getCameraFailureAlarm(armType);
    case 210: 
    case 260: 
      return getDrivingTimeoutAlarm(armType);
    case 211: 
    case 212: 
    case 261: 
    case 262: 
      return getCMSAreaInOutAlarm(armType);
    case 213: 
    case 263: 
      return getRoadTravelTimeAlarm(armType);
    case 214: 
    case 264: 
      return getRouteDeviationAlarm(armType);
    case 215: 
    case 265: 
      return getVSSFailureAlarm(armType);
    case 216: 
    case 266: 
      return getAbnormalFuelAlarm(armType);
    case 217: 
    case 267: 
      return getAntitheftDeviceAlarm(armType);
    case 218: 
    case 268: 
      return getIllegalDisplacementAlarm(armType);
    case 219: 
    case 269: 
      return getRolloverAlarm(armType);
    case 168: 
      return getTpmsAlarm(armType);
    }
    return getText("system.common.unkown");
  }
  
  private String getChnString(String devIdno, int armInfo)
  {
    List<String> strName = new ArrayList();
    List<StandardVehiDevRelationEx> relations = this.standardUserService.getStandardVehiDevRelationExList(null, devIdno);
    if ((relations != null) && (relations.size() > 0))
    {
      StandardVehiDevRelationEx relation = (StandardVehiDevRelationEx)relations.get(0);
      String[] chnName = relation.getChnAttr().split(",");
      for (int i = 0; i < chnName.length; i++) {
        if ((armInfo >> i & 0x1) > 0) {
          strName.add(chnName[i]);
        }
      }
    }
    return strName.toString();
  }
  
  private String getTempString(int temp)
  {
    DecimalFormat format = new DecimalFormat();
    format.applyPattern("#0.0");
    return format.format(temp / 100) + getText("report.alarm.tempUnit");
  }
  
  private String getSpeedString(Integer speed)
  {
    DecimalFormat format = new DecimalFormat();
    format.applyPattern("#0.0");
    return format.format(speed.intValue() / 10) + getText("report.alarm.speed.unit.km");
  }
  
  private String getOilString(Integer oil)
  {
    DecimalFormat format = new DecimalFormat();
    format.applyPattern("#0.00");
    return format.format(oil.intValue() / 100) + getText("report.alarm.oil.unit");
  }
  
  private String getDiskType(int type)
  {
    String strdisk = "";
    switch (type)
    {
    case 0: 
    case 1: 
      strdisk = getText("report.alarm.hardType") + "(" + getText("sdcard") + ")";
      break;
    case 2: 
      strdisk = getText("report.alarm.hardType") + "(" + getText("harddisk") + ")";
      break;
    case 3: 
      strdisk = getText("report.alarm.hardType") + "(" + getText("ssd") + ")";
    }
    return strdisk;
  }
  
  private List<Integer> findUserCompanys(Integer companyId, boolean isAdmin)
  {
    Integer parentId = null;
    if (!isAdmin) {
      parentId = companyId;
    }
    List<Integer> lstLevel = new ArrayList();
    lstLevel.add(Integer.valueOf(1));
    List<Integer> lstCompanyId = this.standardUserService.getCompanyIdList(parentId, lstLevel, isAdmin);
    if ((isAdmin) && (lstCompanyId != null)) {
      for (int i = 0; i < lstCompanyId.size(); i++) {
        if (((Integer)lstCompanyId.get(i)).intValue() == -1)
        {
          lstCompanyId.remove(i);
          break;
        }
      }
    }
    if (!isAdmin) {
      lstCompanyId.add(companyId);
    }
    return lstCompanyId;
  }
  
  private String getAreaName(Integer areaId)
  {
    if (this.mapArea == null)
    {
      this.mapArea = new HashMap();
      ActionContext ctx = ActionContext.getContext();
      int userId = Integer.parseInt((String)ctx.getSession().get("userid"));
      String account = (String)ctx.getSession().get("account808");
      StandardCompany company = (StandardCompany)ctx.getSession().get("company");
      boolean isadmin = false;
      if ((account != null) && (account.equals("admin"))) {
        isadmin = true;
      }
      List<Integer> lstId = new ArrayList();
      lstId.add(Integer.valueOf(2));
      lstId.add(Integer.valueOf(3));
      lstId.add(Integer.valueOf(10));
      lstId.add(Integer.valueOf(4));
      lstId.add(Integer.valueOf(1));
      List<Integer> cids = findUserCompanys(company.getId(), isadmin);
      AjaxDto<MapMarker> areaMarker = this.vehicleRuleService.getAreaList(cids, Integer.valueOf(userId), lstId, null, Boolean.valueOf(isadmin), null, null);
      if ((areaMarker != null) && (areaMarker.getPageList() != null) && (areaMarker.getPageList().size() > 0)) {
        for (int i = 0; i < areaMarker.getPageList().size(); i++) {
          this.mapArea.put(((MapMarker)areaMarker.getPageList().get(i)).getId(), ((MapMarker)areaMarker.getPageList().get(i)).getName());
        }
      }
    }
    if (this.mapArea.get(areaId) != null) {
      return ((String)this.mapArea.get(areaId)).toString();
    }
    return areaId.toString();
  }
  
  private String getAreaType(int param1, int param2)
  {
    String str = "";
    switch (param1)
    {
    case 0: 
      str = getText("report.alarm.positionType") + "(" + getText("report.alarm.positionUndefine") + ")";
      break;
    case 1: 
      str = getText("report.alarm.areaName") + "(" + getAreaName(Integer.valueOf(param2)) + "), " + getText("report.alarm.positionType") + "(" + getText("report.alarm.positionCircle") + ")";
      break;
    case 2: 
      str = getText("report.alarm.areaName") + "(" + getAreaName(Integer.valueOf(param2)) + "), " + getText("report.alarm.positionType") + "(" + getText("report.alarm.positionRect") + ")";
      break;
    case 3: 
      str = getText("report.alarm.areaName") + "(" + getAreaName(Integer.valueOf(param2)) + "), " + getText("report.alarm.positionType") + "(" + getText("report.alarm.positionPoligon") + ")";
      break;
    case 4: 
      str = getText("report.alarm.lineName") + "(" + getAreaName(Integer.valueOf(param2)) + "), " + getText("report.alarm.positionType") + "(" + getText("report.alarm.positionLine") + ")";
    }
    return str;
  }
  
  private String getRoadLel(int param1)
  {
    String str = getText("road.type");
    switch (param1)
    {
    case 1: 
      str = str + getText("road.highway");
      break;
    case 2: 
      str = str + getText("road.urban.highway");
      break;
    case 3: 
      str = str + getText("road.state");
      break;
    case 4: 
      str = str + getText("road.province");
      break;
    case 5: 
      str = str + getText("road.county");
      break;
    case 6: 
      str = str + getText("road.townvillage");
      break;
    case 7: 
      str = str + getText("road.other");
      break;
    case 8: 
      str = str + getText("road.nine");
      break;
    case 9: 
      str = str + getText("road.ferry");
      break;
    case 10: 
      str = str + getText("road.pedestrian");
    }
    return str;
  }
  
  private String getRecordTypeStr(int type)
  {
    if (type == 1) {
      return getText("report.alarm.rectypeAlarm");
    }
    return getText("report.alarm.rectypeNormal");
  }
  
  private String getFileSize(int size)
  {
    DecimalFormat format = new DecimalFormat();
    format.applyPattern("#0.00");
    return format.format(size * 1.0D / 1024.0D / 1024.0D) + "MB";
  }
  
  protected String getTimeDifference(long millisecond)
  {
    String difValue = "";
    long days = millisecond / 86400000L;
    long hours = millisecond / 3600000L - days * 24L;
    long minutes = millisecond / 60000L - days * 24L * 60L - hours * 60L;
    long seconds = millisecond / 1000L - days * 24L * 60L * 60L - hours * 60L * 60L - minutes * 60L;
    if (days != 0L) {
      difValue = difValue + days + getText("report.day");
    }
    if (hours != 0L) {
      difValue = difValue + " " + hours + getText("report.hour");
    }
    if (minutes != 0L) {
      difValue = difValue + " " + minutes + getText("report.minute");
    }
    if (seconds != 0L) {
      difValue = difValue + " " + seconds + getText("report.second");
    }
    return difValue;
  }
}
