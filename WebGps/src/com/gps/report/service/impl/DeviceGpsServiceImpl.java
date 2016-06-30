package com.gps.report.service.impl;

import com.framework.utils.ByteArrayUtils;
import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps.report.model.DeviceGps;
import com.gps.report.service.DeviceGpsService;
import com.gps.report.vo.DeviceMinMaxGps;
import com.gps.report.vo.DeviceTrack;
import com.gps.report.vo.TrackCompare;
import com.gps.util.ConvertUtil;
import com.gps.vo.GpsValue;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import org.hibernate.Hibernate;

public class DeviceGpsServiceImpl
  extends UniversalServiceImpl
  implements DeviceGpsService
{
  private PaginationDao paginationDao;
  
  public Class getClazz()
  {
    return DeviceGps.class;
  }
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public static Date analyTrackTime(long time)
  {
    byte year = (byte)(int)(time & 0x3F);
    byte month = (byte)(int)(time >> 6 & 0xF);
    byte day = (byte)(int)(time >> 10 & 0x1F);
    byte hour = (byte)(int)(time >> 15 & 0x1F);
    byte minute = (byte)(int)(time >> 20 & 0x3F);
    byte second = (byte)(int)(time >> 26 & 0x3F);
    Calendar c = Calendar.getInstance();
    c.set(2000 + year, month - 1, day, hour, minute, second);
    
    return c.getTime();
  }
  
  public static void analyDeviceStatus(int status, DeviceTrack track)
  {
    track.setIsParking(Boolean.valueOf((status >> 13 & 0x1) == 1));
  }
  
  public static void analyDeviceTrack(byte[] data, int offset, DeviceTrack track)
  {
    offset += 4;
    int temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    
    track.setSpeed(Integer.valueOf(temp & 0x3FFF));
    
    track.setYouLiang(Integer.valueOf(temp >> 14 & 0x3FFFF));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setLiCheng(Integer.valueOf(temp));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setHuangXiang(Integer.valueOf(temp & 0x1FF));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    track.setStatus1(Integer.valueOf(temp));
    offset += 4;
    analyDeviceStatus(temp, track);
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    track.setStatus2(Integer.valueOf(temp));
    offset += 4;
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    track.setStatus3(Integer.valueOf(temp));
    offset += 4;
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    track.setStatus4(Integer.valueOf(temp));
    offset += 4;
    
    short sTemp = ByteArrayUtils.byteArray2short(data, offset);
    offset += 2;
    track.setTempSensor1(Integer.valueOf(sTemp));
    
    sTemp = ByteArrayUtils.byteArray2short(data, offset);
    offset += 2;
    track.setTempSensor2(Integer.valueOf(sTemp));
    
    sTemp = ByteArrayUtils.byteArray2short(data, offset);
    offset += 2;
    track.setTempSensor3(Integer.valueOf(sTemp));
    
    sTemp = ByteArrayUtils.byteArray2short(data, offset);
    offset += 2;
    track.setTempSensor4(Integer.valueOf(sTemp));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setJingDu(Integer.valueOf(temp));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setWeiDu(Integer.valueOf(temp));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setGaoDu(Integer.valueOf(temp));
    
    temp = ByteArrayUtils.byteArray2int(data, offset);
    offset += 4;
    track.setParkTime(Integer.valueOf(temp));
  }
  
  public void analyDeviceGps(DeviceGps gps, String devIdno, long beginTime, long endTime, List<DeviceTrack> gpstracks, String toMap)
  {
    try
    {
      InputStream inStream = gps.getGpsData().getBinaryStream();
      long nLen = gps.getGpsData().length();
      int nSize = (int)nLen;
      byte[] data = new byte[nSize];
      inStream.read(data);
      inStream.close();
      
      int count = nSize / 72;
      if (count > 0)
      {
        int offset = 0;
        for (int i = 0; i < count; i++)
        {
          long date = ByteArrayUtils.byteArray2long(data, offset, 4);
          Date gpsTime = analyTrackTime(date);
          
          long gpsSecond = gpsTime.getTime();
          if ((gpsSecond >= beginTime) && (gpsSecond <= endTime))
          {
            DeviceTrack track = new DeviceTrack();
            track.setTrackTime(gpsSecond);
            track.setDevIdno(devIdno);
            track.setGpsTime(DateUtil.dateSwitchString(gpsTime));
            analyDeviceTrack(data, offset, track);
            if ((track.getStatus1() != null) && ((track.getStatus1().intValue() & 0x1) > 0))
            {
              GpsValue gpsValue = ConvertUtil.convert(track.getJingDu(), track.getWeiDu(), toMap);
              
              track.setMapJingDu(gpsValue.getMapJingDu());
              track.setMapWeiDu(gpsValue.getMapWeiDu());
            }
            gpstracks.add(track);
          }
          offset += 72;
        }
      }
      data = null;
    }
    catch (SQLException e)
    {
      e.printStackTrace();
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
  
  private List<DeviceTrack> filterDeviceTrack(List<DeviceTrack> gpstracks, int meter, int parkTime)
  {
    if (gpstracks.size() > 0)
    {
      Collections.sort(gpstracks, new TrackCompare());
      
      DeviceTrack track = (DeviceTrack)gpstracks.get(gpstracks.size() / 2);
      if (track.getLiCheng().equals(Integer.valueOf(0))) {
        return gpstracks;
      }
      List<DeviceTrack> lstTracks = new ArrayList();
      DeviceTrack lastTrack = (DeviceTrack)gpstracks.get(0);
      
      lstTracks.add(lastTrack);
      
      DeviceTrack firstPark = null;
      DeviceTrack lastPark = null;
      for (int i = 1; i < gpstracks.size(); i++)
      {
        track = (DeviceTrack)gpstracks.get(i);
        if (!track.getIsParking().booleanValue())
        {
          if (firstPark != null)
          {
            if ((parkTime != 0) && (lastPark.getParkTime().intValue() > parkTime))
            {
              firstPark.setParkTime(lastPark.getParkTime());
              lstTracks.add(firstPark);
              
              lastTrack = track;
            }
            firstPark = null;
            lastPark = null;
          }
          int temp = track.getLiCheng().intValue() - lastTrack.getLiCheng().intValue();
          if ((meter == 0) || (temp >= meter) || (temp < 0))
          {
            lastTrack = track;
            if ((meter == 0) || (temp >= meter)) {
              lstTracks.add(track);
            }
          }
        }
        else
        {
          if (firstPark == null) {
            firstPark = track;
          }
          lastPark = track;
        }
      }
      return lstTracks;
    }
    gpstracks = null;
    return null;
  }
  
  private String getQueryString(String dateB, String dateE, String devIdno)
  {
    StringBuffer strQuery = new StringBuffer("from DeviceGps ");
    
    strQuery.append(String.format("where gpsDate >= '%s' and gpsDate <= '%s' ", new Object[] {
      dateB, dateE }));
    strQuery.append(String.format("and DevIdno = '%s' ", new Object[] { devIdno }));
    return strQuery.toString();
  }
  
  public AjaxDto<DeviceTrack> queryDeviceGps(String devIdno, Date begin, Date end, int meter, int parkTime, Pagination pagination, String toMap)
    throws Exception
  {
    List<DeviceTrack> gpstracks = new ArrayList();
    
    AjaxDto<DeviceGps> ajaxDto = this.paginationDao.getPgntByQueryStr(getQueryString(DateUtil.dateSwitchDateString(begin), 
      DateUtil.dateSwitchDateString(end), devIdno), null);
    if ((ajaxDto.getPageList() != null) && (ajaxDto.getPageList().size() > 0)) {
      for (int i = 0; i < ajaxDto.getPageList().size(); i++)
      {
        DeviceGps gps = (DeviceGps)ajaxDto.getPageList().get(i);
        
        analyDeviceGps(gps, devIdno, begin.getTime(), end.getTime(), gpstracks, toMap);
      }
    }
    AjaxDto<DeviceTrack> ajaxTrack = new AjaxDto();
    
    List<DeviceTrack> tracks = filterDeviceTrack(gpstracks, meter, parkTime);
    
    int totalRecord = 0;
    if (tracks != null)
    {
      totalRecord = tracks.size();
      if (pagination != null)
      {
        if (tracks.size() < (pagination.getCurrentPage() - 1) * pagination.getPageRecords()) {
          pagination.setCurrentPage(1);
        }
        int offset = (pagination.getCurrentPage() - 1) * pagination.getPageRecords();
        int endOffset = pagination.getCurrentPage() * pagination.getPageRecords();
        List<DeviceTrack> retTracks = new ArrayList();
        for (int i = offset; (i < endOffset) && (i < tracks.size()); i++) {
          retTracks.add((DeviceTrack)tracks.get(i));
        }
        ajaxTrack.setPageList(retTracks);
      }
      else
      {
        ajaxTrack.setPageList(tracks);
      }
    }
    else if (pagination != null)
    {
      pagination.setCurrentPage(1);
    }
    if (pagination != null)
    {
      Pagination pagin = new Pagination(pagination.getPageRecords(), pagination.getCurrentPage(), totalRecord, pagination.getSortParams());
      ajaxTrack.setPagination(pagin);
    }
    return ajaxTrack;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] devIDNO)
  {
    strQuery.append(String.format(" and (devIdno = '%s' ", new Object[] { devIDNO[0] }));
    for (int i = 1; i < devIDNO.length; i++) {
      strQuery.append(String.format("or devIdno = '%s' ", new Object[] { devIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  protected List<QueryScalar> getDeviceGpsScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("gpsDate", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("gpsData", Hibernate.BLOB));
    return scalars;
  }
  
  protected List<QueryScalar> getDevGpsScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("devIdno", Hibernate.STRING));
    scalars.add(new QueryScalar("minDate", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("minData", Hibernate.BLOB));
    scalars.add(new QueryScalar("maxDate", Hibernate.TIMESTAMP));
    scalars.add(new QueryScalar("maxData", Hibernate.BLOB));
    return scalars;
  }
  
  protected String getTableColumn(String qtype)
  {
    String column = "";
    if ((qtype != null) && (!qtype.isEmpty())) {
      if ("devIdno".equals(qtype)) {
        column = "DevIdno";
      } else {
        column = qtype;
      }
    }
    return column;
  }
  
  public AjaxDto<DeviceMinMaxGps> queryDevGps(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, String[] devIdno, Pagination pagination, String toMap)
  {
    StringBuffer strQuery = new StringBuffer("SELECT A.DevIdno as devIdno, A.MinDate as minDate, A.MinData as minData, B.MaxDate as maxDate, B.MaxData as maxData FROM ");
    strQuery.append(" (SELECT C.DevIDNO, C.GPSDate as MinDate,C.GPSData as MinData from dev_gps C,(SELECT DevIDNO,MIN(GPSDate) as Min from dev_gps ");
    strQuery.append(String.format(" WHERE GPSDate >= '%s' and", new Object[] { dateB.substring(0, 10) }));
    strQuery.append(String.format(" GPSDate <= '%s' ", new Object[] { dateE.substring(0, 10) }));
    appendDeviceCondition(strQuery, devIdno);
    String column = getTableColumn(qtype);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    strQuery.append(" GROUP BY DevIDNO) D where C.GPSDate = D.Min and C.DevIDNO = D.DevIDNO) A,");
    strQuery.append(" (SELECT E.DevIDNO, E.GPSDate as MaxDate,E.GPSData as MaxData from dev_gps E,(SELECT DevIDNO,MAX(GPSDate) as Max from dev_gps ");
    strQuery.append(String.format(" WHERE GPSDate >= '%s' and", new Object[] { dateB.substring(0, 10) }));
    strQuery.append(String.format(" GPSDate <= '%s' ", new Object[] { dateE.substring(0, 10) }));
    appendDeviceCondition(strQuery, devIdno);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    strQuery.append(" GROUP BY DevIDNO) F where E.GPSDate = F.Max and E.DevIDNO = F.DevIDNO) B");
    strQuery.append(" WHERE A.DevIDNO = B.DevIDNO");
    sortname = getTableColumn(sortname);
    if (!sortname.isEmpty()) {
      strQuery.append(" order by A." + sortname + " " + sortorder);
    }
    AjaxDto<DeviceMinMaxGps> dtoGps = this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getDevGpsScalar(), DeviceMinMaxGps.class, null);
    return dtoGps;
  }
  
  public AjaxDto<DeviceTrack> queryDateGps(String dateB, String dateE, String queryFilter, String qtype, String sortname, String sortorder, boolean isMaxDate, String[] devIdno, Pagination pagination, String toMap)
  {
    StringBuffer strQuery = new StringBuffer("SELECT A.DevIdno as devIdno, A.gpsDate as gpsDate, A.gpsData as gpsData FROM dev_gps A, ");
    if (isMaxDate) {
      strQuery.append(" (SELECT DevIDNO, MAX(GPSDate) as max_day from dev_gps");
    } else {
      strQuery.append(" (SELECT DevIDNO, MIN(GPSDate) as max_day from dev_gps");
    }
    strQuery.append(String.format(" WHERE GPSDate >= '%s' and", new Object[] { dateB.substring(0, 10) }));
    strQuery.append(String.format(" GPSDate <= '%s' ", new Object[] { dateE.substring(0, 10) }));
    appendDeviceCondition(strQuery, devIdno);
    String column = getTableColumn(qtype);
    if (!column.isEmpty()) {
      strQuery.append(String.format("and " + column + " = %s ", new Object[] { queryFilter }));
    }
    strQuery.append(" GROUP BY DevIDNO) B");
    strQuery.append(" WHERE A.GPSDate = B.max_day and A.DevIDNO = B.DevIDNO");
    sortname = getTableColumn(sortname);
    if (!sortname.isEmpty()) {
      strQuery.append(" order by A." + sortname + " " + sortorder);
    }
    List<DeviceTrack> trackResult = new ArrayList();
    AjaxDto<DeviceGps> dtoGps = this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getDeviceGpsScalar(), DeviceGps.class, null);
    if ((dtoGps.getPageList() != null) && (dtoGps.getPageList().size() > 0)) {
      for (int i = 0; i < dtoGps.getPageList().size(); i++)
      {
        DeviceGps gps = (DeviceGps)dtoGps.getPageList().get(i);
        List<DeviceTrack> gpstracks = new ArrayList();
        analyDeviceGps(gps, gps.getDevIdno(), DateUtil.StrLongTime2Date(dateB).getTime(), 
          DateUtil.StrLongTime2Date(dateE).getTime(), gpstracks, toMap);
        
        DeviceTrack track = null;
        
        track = searchDeviceTrack(gpstracks, isMaxDate, 0);
        trackResult.add(track);
      }
    }
    AjaxDto<DeviceTrack> dtoGpsTrack = new AjaxDto();
    dtoGpsTrack.setPagination(dtoGps.getPagination());
    dtoGpsTrack.setPageList(trackResult);
    return dtoGpsTrack;
  }
  
  public DeviceTrack searchDeviceTrack(List<DeviceTrack> gpstracks, boolean isMaxDate, int start)
  {
    DeviceTrack track = new DeviceTrack();
    String devIdno = "";
    if (gpstracks.size() > 0) {
      devIdno = ((DeviceTrack)gpstracks.get(0)).getDevIdno();
    }
    while (gpstracks.size() > 0)
    {
      if (isMaxDate)
      {
        track = (DeviceTrack)gpstracks.get(gpstracks.size() - 1);
        if ((track.getLiCheng() != null) && (track.getJingDu() != null) && (track.getWeiDu() != null) && 
          (track.getLiCheng().intValue() != 0) && (track.getJingDu().intValue() != 0) && (track.getWeiDu().intValue() != 0)) {
          return track;
        }
        gpstracks.remove(gpstracks.size() - 1);
      }
      else
      {
        track = (DeviceTrack)gpstracks.get(0);
        if ((track.getLiCheng() != null) && (track.getJingDu() != null) && (track.getWeiDu() != null) && 
          (track.getJingDu().intValue() != 0) && (track.getWeiDu().intValue() != 0)) {
          return track;
        }
        gpstracks.remove(0);
      }
      if (start == 1) {
        return track;
      }
    }
    track = new DeviceTrack();
    track.setDevIdno(devIdno);
    return track;
  }
  
  public List<DeviceGps> queryDeviceTrack(String dateB, String dateE, boolean isMaxDate, String devIdno, String toMap)
  {
    StringBuffer strQuery = new StringBuffer("SELECT DevIdno as devIdno, gpsDate as gpsDate, gpsData as gpsData FROM dev_gps");
    strQuery.append(String.format(" WHERE GPSDate >= '%s' and", new Object[] { dateB.substring(0, 10) }));
    strQuery.append(String.format(" GPSDate <= '%s' ", new Object[] { dateE.substring(0, 10) }));
    strQuery.append(String.format(" and  DevIdno = '%s' ", new Object[] { devIdno }));
    AjaxDto<DeviceGps> dtoGps = this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), null, getDeviceGpsScalar(), DeviceGps.class, null);
    return dtoGps.getPageList();
  }
  
  public List<DeviceTrack> resolveDeviceTrack(DeviceGps gps, String dateB, String dateE, String toMap)
  {
    List<DeviceTrack> gpstracks = new ArrayList();
    analyDeviceGps(gps, gps.getDevIdno(), DateUtil.StrLongTime2Date(dateB).getTime(), 
      DateUtil.StrLongTime2Date(dateE).getTime(), gpstracks, toMap);
    return gpstracks;
  }
}
