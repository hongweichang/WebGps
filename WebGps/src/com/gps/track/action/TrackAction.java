package com.gps.track.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.web.dto.AjaxDto;
import com.gps.report.action.base.ReportBaseAction;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceTrack;
import java.util.Date;
import java.util.List;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;

public class TrackAction
  extends ReportBaseAction
{
  private static final long serialVersionUID = -9186083421023326883L;
  
  protected boolean checkPrivi()
  {
    return true;
  }
  
  public String query()
    throws Exception
  {
    String distance = getRequestString("distance");
    String parkTime = getRequestString("parkTime");
    if ((distance == null) || (distance.isEmpty()) || 
      (parkTime == null) || (parkTime.isEmpty())) {
      addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
    } else {
      queryGpsTrack(distance, parkTime, null);
    }
    return "success";
  }
  
  protected String[] genGpstrackHeads()
  {
    String[] heads = new String[6];
    heads[0] = getText("report.index");
    heads[1] = getText("direction");
    heads[2] = getText("report.time");
    heads[3] = (getText("report.currentSpeed") + getSpeedUnit());
    heads[4] = (getText("report.currentLiCheng") + getLiChengUnit());
    heads[5] = getText("report.currentPosition");
    return heads;
  }
  
  protected void genGpstrackData(String begintime, String endtime, String devIdno, HSSFSheet sheet, String toMap)
  {
    try
    {
      AjaxDto<DeviceTrack> ajaxDto = this.deviceGpsService.queryDeviceGps(devIdno, DateUtil.StrLongTime2Date(begintime), 
        DateUtil.StrLongTime2Date(endtime), 0, 0, null, toMap);
      if (ajaxDto.getPageList() != null) {
        for (int i = 1; i <= ajaxDto.getPageList().size(); i++)
        {
          DeviceTrack track = (DeviceTrack)ajaxDto.getPageList().get(i - 1);
          HSSFRow row = sheet.createRow(1 + i);
          int j = 0;
          
          HSSFCell cell = row.createCell(j++);
          cell.setCellValue(i);
          
          cell = row.createCell(j++);
          cell.setCellValue(getDirectionString(track.getHuangXiang().intValue()));
          
          cell = row.createCell(j++);
          cell.setCellValue(DateUtil.dateSwitchString(new Date(track.getTrackTime())));
          
          cell = row.createCell(j++);
          cell.setCellValue(getSpeed(track.getSpeed(), track.getStatus1()));
          
          cell = row.createCell(j++);
          cell.setCellValue(getLiCheng(track.getLiCheng()));
          
          cell = row.createCell(j++);
          cell.setCellValue(getPosition(track.getJingDu(), track.getWeiDu(), track.getStatus1()));
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
    String devIdno = getRequestString("devIdnos");
    return getDeviceNameInSession(devIdno) + " - " + getText("report.track");
  }
}
