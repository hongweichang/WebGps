package com.gps808.report.service.impl;

import com.framework.utils.DateUtil;
import com.framework.web.dao.PaginationDao;
import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.dto.QueryScalar;
import com.framework.web.service.impl.UniversalServiceImpl;
import com.gps808.model.StandardDriverSignin;
import com.gps808.model.StandardStoDevAvRecord;
import com.gps808.model.StandardStoDevSnapshotRecord;
import com.gps808.report.service.StandardVehicleMediaService;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.type.StandardBasicTypes;

public class StandardVehicleMediaServiceImpl
  extends UniversalServiceImpl
  implements StandardVehicleMediaService
{
  private PaginationDao paginationDao;
  
  public PaginationDao getPaginationDao()
  {
    return this.paginationDao;
  }
  
  public void setPaginationDao(PaginationDao paginationDao)
  {
    this.paginationDao = paginationDao;
  }
  
  public Class getClazz()
  {
    return null;
  }
  
  protected void appendDeviceCondition(StringBuffer strQuery, String[] vehiIDNO)
  {
    strQuery.append(String.format("and (b.VehiIDNO = '%s' ", new Object[] { vehiIDNO[0] }));
    for (int i = 1; i < vehiIDNO.length; i++) {
      strQuery.append(String.format("or b.VehiIDNO = '%s' ", new Object[] { vehiIDNO[i] }));
    }
    strQuery.append(") ");
  }
  
  private List<QueryScalar> getStandardStoDevSnapshotRecordQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("channel", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("fileType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("encode", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("filePath", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("fileOffset", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("fileSize", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("fileTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("svrId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("GPSStatus", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("alarmType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("alarmParam", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("updateTime", StandardBasicTypes.DATE));
    return scalars;
  }
  
  public AjaxDto<StandardStoDevSnapshotRecord> queryVehiclePhoto(String dateB, String dateE, String[] vehiIdno, Integer fileType, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.VehiIDNO as vehiIdno, a.DevIDNO as devIdno, a.Channel as channel, a.FileType as fileType, a.Encode as encode, a.FilePath as filePath, a.FileOffset as fileOffset, a.FileSize as fileSize, a.FileTime as fileTime, a.SvrID as svrId, a.GPSStatus as GPSStatus, a.AlarmType as alarmType, a.AlarmParam as alarmParam, a.UpdateTime as updateTime from jt808_sto_dev_snapshot_record a, jt808_vehicle_info b ");
    
    strQuery.append("where a.vehiID = b.ID");
    strQuery.append(String.format(" and fileTimeI >= %d and fileTimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    strQuery.append(String.format("and vehiIdno = '%s' ", vehiIdno));
    if ((fileType.intValue() == 1) || (fileType.intValue() == 0)) {
      strQuery.append(String.format("and fileType = '%s' ", new Object[] { fileType }));
    }
    strQuery.append(String.format(" order by fileTime desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getStandardStoDevSnapshotRecordQueryScalar(), StandardStoDevSnapshotRecord.class, null);
  }
  
  private List<QueryScalar> getStandardStoDevAvRecordQueryScalar()
  {
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("vehiIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("devIdno", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("channel", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("fileType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("mediaType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("filePath", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("fileSize", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("fileSTime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("fileETime", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("status", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("svrId", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("alarmType", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("alarmParam", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("updateTime", StandardBasicTypes.DATE));
    return scalars;
  }
  
  public AjaxDto<StandardStoDevAvRecord> queryVehicleAudioOrVideo(String dateB, String dateE, String[] vehiIdno, Integer fileType, Integer mediaType, Integer status, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.VehiIDNO as vehiIdno, a.DevIDNO as devIdno, a.Channel as channel, a.FileType as fileType, a.MediaType as mediaType, a.FilePath as filePath, a.FileSize as fileSize, a.FileSTime as fileSTime, a.FileETime as fileETime, a.Status as status, a.SvrID as svrId, a.AlarmType as alarmType, a.AlarmParam as alarmParam, a.UpdateTime as updateTime from jt808_sto_dev_av_record a, jt808_vehicle_info b ");
    
    strQuery.append("where a.vehiID = b.ID");
    strQuery.append(String.format(" and fileSTimeI >= %d and fileSTimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    strQuery.append(String.format("and vehiIdno = '%s' ", vehiIdno));
    if ((fileType.intValue() == 1) || (fileType.intValue() == 0)) {
      strQuery.append(String.format("and fileType = '%s' ", new Object[] { fileType }));
    }
    strQuery.append(String.format("and mediaType = '%s' ", new Object[] { mediaType }));
    strQuery.append(String.format("and status = '%s' ", new Object[] { status }));
    strQuery.append(String.format(" order by fileSTime desc ", new Object[0]));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, getStandardStoDevAvRecordQueryScalar(), StandardStoDevAvRecord.class, null);
  }
  
  public AjaxDto<StandardDriverSignin> queryDriverSignin(String dateB, String dateE, String[] vehiIdno, Pagination pagination)
  {
    StringBuffer strQuery = new StringBuffer("select b.VehiIDNO as vid, b.PlateType as pt, a.JobNum as jn, a.Name as dn, c.DevIDNO as did, c.STime as st, c.SJingDu as sjd, c.SWeiDu as swd, c.ETime as et, c.EJingDu as ejd, c.EWeiDu as ewd, c.SignStatus as ss from jt808_driver_info a, jt808_vehicle_info b, jt808_driver_signin c ");
    
    strQuery.append("where a.ID = c.DriverID and b.ID = c.VehiID");
    strQuery.append(String.format(" and c.STimeI >= %d and c.STimeI <= %d ", new Object[] { Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateB).getTime() / 1000L)), Integer.valueOf((int)(DateUtil.StrLongTime2Date(dateE).getTime() / 1000L)) }));
    appendDeviceCondition(strQuery, vehiIdno);
    strQuery.append(String.format(" order by c.STimeI desc ", new Object[0]));
    List<QueryScalar> scalars = new ArrayList();
    scalars.add(new QueryScalar("st", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("sjd", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("swd", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("et", StandardBasicTypes.TIMESTAMP));
    scalars.add(new QueryScalar("ejd", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ewd", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("ss", StandardBasicTypes.INTEGER));
    scalars.add(new QueryScalar("jn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("dn", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("did", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("vid", StandardBasicTypes.STRING));
    scalars.add(new QueryScalar("pt", StandardBasicTypes.INTEGER));
    return this.paginationDao.getExtraByNativeSqlEx(strQuery.toString(), pagination, scalars, StandardDriverSignin.class, null);
  }
}
