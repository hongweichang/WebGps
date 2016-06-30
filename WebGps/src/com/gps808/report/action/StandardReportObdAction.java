package com.gps808.report.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ExportReport;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.gps808.model.StandardUserRole;
import com.gps808.report.action.base.StandardReportBaseAction;
import com.gps808.report.service.StandardVehicleGpsService;
import com.gps808.report.vo.StandardDeviceTrack;
import java.util.Date;
import java.util.List;

public class StandardReportObdAction
  extends StandardReportBaseAction
{
  private static final long serialVersionUID = 1L;
  
  protected boolean checkPrivi()
  {
    return isRole(StandardUserRole.PRIVI_PAGE_REPORT.toString());
  }
  
  public String track()
    throws Exception
  {
    String distance = getRequestString("distance");
    if (distance == null)
    {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    }
    else
    {
      String pagin = getJsonRequestString("pagin");
      Pagination pagination = null;
      if ((pagin != null) && (!"".equals(pagin))) {
        pagination = getPaginationEx();
      }
      queryGpsTrack(distance, null, pagination, null);
    }
    return "success";
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[16];
    heads[0] = getText("report.index");
    heads[1] = getText("report.vehicle");
    heads[2] = getText("report.plateColor");
    heads[3] = getText("report.time");
    heads[4] = (getText("report.normal.total.licheng") + getLiChengUnit());
    heads[5] = getText("report.currentPosition");
    heads[6] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[7] = getText("report.rotating.speed");
    heads[8] = getText("report.battery.voltage");
    heads[9] = getText("report.intake.air.temperature");
    heads[10] = getText("report.valve.position");
    heads[11] = getText("ACC");
    heads[12] = getText("report.clutch");
    heads[13] = getText("report.brake");
    heads[14] = getText("PTO");
    heads[15] = getText("report.emergency.brake");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, Integer toMap, String vehiIdno, ExportReport export)
  {
    try
    {
      String distance = getRequestString("distance");
      String time = getRequestString("time");
      String speed = getRequestString("speed");
      int meter = 0;
      int park = 0;
      if ((distance != null) && 
        (!distance.isEmpty())) {
        meter = (int)(Double.parseDouble(distance) * 1000.0D);
      }
      int interval = 0;
      if ((time != null) && (!time.isEmpty())) {
        interval = Integer.parseInt(time) * 1000;
      }
      int limit = 0;
      if ((speed != null) && (!speed.isEmpty())) {
        limit = Integer.parseInt(speed);
      }
      String devIdno = getGPSDevIdno(vehiIdno);
      AjaxDto<StandardDeviceTrack> ajaxDto = this.vehicleGpsService.queryDeviceGps(vehiIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), meter, interval, limit, park, 0, 0, null, null, devIdno);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          StandardDeviceTrack track = (StandardDeviceTrack)ajaxDto.getPageList().get(i - 1);
          int j = 0;
          export.setExportData(Integer.valueOf(1 + i));
          
          export.setCellValue(Integer.valueOf(j++), Integer.valueOf(i));
          
          export.setCellValue(Integer.valueOf(j++), track.getVehiIdno());
          
          String plateColor = getText("other");
          switch (track.getPlateType().intValue())
          {
          case 1: 
            plateColor = getText("blue.label");
            break;
          case 2: 
            plateColor = getText("yellow.label");
            break;
          case 3: 
            plateColor = getText("black.label");
            break;
          case 4: 
            plateColor = getText("white.label");
            break;
          case 0: 
            plateColor = getText("other");
            break;
          }
          export.setCellValue(Integer.valueOf(j++), plateColor);
          
          export.setCellValue(Integer.valueOf(j++), DateUtil.dateSwitchString(new Date(track.getTrackTime())));
          
          export.setCellValue(Integer.valueOf(j++), getLiChengEx(track.getLiCheng()));
          if (isGpsValid(track.getStatus1()))
          {
            if (DateUtil.StrLongTime2Date(endtime).getTime() - DateUtil.StrLongTime2Date(begintime).getTime() < 10800000L) {
              export.setCellValue(Integer.valueOf(j++), getMapPosition(track.getJingDu(), track.getWeiDu(), toMap.intValue(), true));
            } else {
              export.setCellValue(Integer.valueOf(j++), formatPosition(track.getWeiDu()) + "," + formatPosition(track.getJingDu()));
            }
          }
          else {
            export.setCellValue(Integer.valueOf(j++), "");
          }
          if (track.getObdSpeed() != null) {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(track.getObdSpeed().intValue()));
          } else {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          }
          if (track.getObdRpm() != null) {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(track.getObdRpm().intValue()));
          } else {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          }
          if (track.getOdbVotage() != null) {
            export.setCellValue(Integer.valueOf(j++), Double.valueOf(track.getOdbVotage().intValue() / 10.0D));
          } else {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          }
          if (track.getOdbJQTemp() != null) {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(track.getOdbJQTemp().intValue()));
          } else {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          }
          if (track.getOdbJQMPos() != null) {
            export.setCellValue(Integer.valueOf(j++), Double.valueOf(track.getOdbJQMPos().intValue() / 10.0D));
          } else {
            export.setCellValue(Integer.valueOf(j++), Integer.valueOf(0));
          }
          if (1 == (track.getOdbStatus().intValue() & 0x1)) {
            export.setCellValue(Integer.valueOf(j++), getText("report.open"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getText("report.report.close"));
          }
          if (1 == (track.getOdbStatus().intValue() >> 1 & 0x1)) {
            export.setCellValue(Integer.valueOf(j++), getText("report.open"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getText("report.report.close"));
          }
          if (1 == (track.getOdbStatus().intValue() >> 2 & 0x1)) {
            export.setCellValue(Integer.valueOf(j++), getText("report.open"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getText("report.report.close"));
          }
          if (1 == (track.getOdbStatus().intValue() >> 3 & 0x1)) {
            export.setCellValue(Integer.valueOf(j++), getText("report.open"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getText("report.report.close"));
          }
          if (1 == (track.getOdbStatus().intValue() >> 4 & 0x1)) {
            export.setCellValue(Integer.valueOf(j++), getText("yes"));
          } else {
            export.setCellValue(Integer.valueOf(j++), getText("no"));
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
    }
  }
  
  protected String genGpstrackTitle()
  {
    return getText("report.obd.detail");
  }
}
