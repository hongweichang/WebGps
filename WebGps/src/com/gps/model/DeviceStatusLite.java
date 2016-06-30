package com.gps.model;

import com.gps808.report.vo.StandardDeviceTrack;
import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

public class DeviceStatusLite
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private String id;
  private Integer net;
  private String gw;
  private Integer ol;
  private Integer s1;
  private Integer s2;
  private Integer s3;
  private Integer s4;
  private Integer t1;
  private Integer t2;
  private Integer t3;
  private Integer t4;
  private Integer yl;
  public Integer getGd() {
	return gd;
}

public void setGd(Integer gd) {
	this.gd = gd;
}

private Integer sp;
  private Integer hx;
  private Integer lng;
  private Integer lat;
  private Integer gd;
  private String mlng;
  private String mlat;
  private Integer pk;
  private Integer lc;
  private String gt;
  private Integer pt;
  private Integer dt;
  private Integer ac;
  private Integer ft;
  private Integer fdt;
  private String vid;
  private String imei;
  private String imsi;
  private String hv;
  private String sv;
  private Integer lid;
  private Integer drid;
  private Integer dct;
  private Integer sfg;
  private Integer snm;
  private Integer sst;
  private Integer or;
  private Integer os;
  private Integer ov;
  private Integer ojt;
  private Integer ost;
  private Integer ojm;
  private String po;
  public String getId()
  {
    return this.id;
  }
  
  public void setId(String id)
  {
    this.id = id;
  }
  
public Integer getNet()
  {
    return this.net;
  }
  
  public void setNet(Integer net)
  {
    this.net = net;
  }
  
  public String getGw()
  {
    return this.gw;
  }
  
  public void setGw(String gw)
  {
    this.gw = gw;
  }
  
  public Integer getOl()
  {
    return this.ol;
  }
  
  public void setOl(Integer ol)
  {
    this.ol = ol;
  }
  
  public Integer getS1()
  {
    return this.s1;
  }
  
  public void setS1(Integer s1)
  {
    this.s1 = s1;
  }
  
  public Integer getS2()
  {
    return this.s2;
  }
  
  public void setS2(Integer s2)
  {
    this.s2 = s2;
  }
  
  public Integer getS3()
  {
    return this.s3;
  }
  
  public void setS3(Integer s3)
  {
    this.s3 = s3;
  }
  
  public Integer getS4()
  {
    return this.s4;
  }
  
  public void setS4(Integer s4)
  {
    this.s4 = s4;
  }
  
  public Integer getT1()
  {
    return this.t1;
  }
  
  public void setT1(Integer t1)
  {
    this.t1 = t1;
  }
  
  public Integer getT2()
  {
    return this.t2;
  }
  
  public void setT2(Integer t2)
  {
    this.t2 = t2;
  }
  
  public Integer getT3()
  {
    return this.t3;
  }
  
  public void setT3(Integer t3)
  {
    this.t3 = t3;
  }
  
  public Integer getT4()
  {
    return this.t4;
  }
  
  public void setT4(Integer t4)
  {
    this.t4 = t4;
  }
  
  public Integer getSp()
  {
    return this.sp;
  }
  
  public void setSp(Integer sp)
  {
    this.sp = sp;
  }
  
  public Integer getHx()
  {
    return this.hx;
  }
  
  public void setHx(Integer hx)
  {
    this.hx = hx;
  }
  
  public Integer getLng()
  {
    return this.lng;
  }
  
  public void setLng(Integer lng)
  {
    this.lng = lng;
  }
  
  public Integer getLat()
  {
    return this.lat;
  }
  
  public void setLat(Integer lat)
  {
    this.lat = lat;
  }
  
  public String getMlng()
  {
    return this.mlng;
  }
  
  public void setMlng(String mlng)
  {
    this.mlng = mlng;
  }
  
  public String getMlat()
  {
    return this.mlat;
  }
  
  public void setMlat(String mlat)
  {
    this.mlat = mlat;
  }
  
  public Integer getPk()
  {
    return this.pk;
  }
  
  public void setPk(Integer pk)
  {
    this.pk = pk;
  }
  
  public Integer getLc()
  {
    return this.lc;
  }
  
  public void setLc(Integer lc)
  {
    this.lc = lc;
  }
  
  public String getGt()
  {
    return this.gt;
  }
  
  public void setGt(String gt)
  {
    this.gt = gt;
  }
  
  public Integer getPt()
  {
    return this.pt;
  }
  
  public void setPt(Integer pt)
  {
    this.pt = pt;
  }
  
  public Integer getDt()
  {
    return this.dt;
  }
  
  public void setDt(Integer dt)
  {
    this.dt = dt;
  }
  
  public Integer getAc()
  {
    return this.ac;
  }
  
  public void setAc(Integer ac)
  {
    this.ac = ac;
  }
  
  public Integer getFt()
  {
    return this.ft;
  }
  
  public void setFt(Integer ft)
  {
    this.ft = ft;
  }
  
  public Integer getFdt()
  {
    return this.fdt;
  }
  
  public void setFdt(Integer fdt)
  {
    this.fdt = fdt;
  }
  
  public Integer getYl()
  {
    return this.yl;
  }
  
  public void setYl(Integer yl)
  {
    this.yl = yl;
  }
  
  public String getVid()
  {
    return this.vid;
  }
  
  public void setVid(String vid)
  {
    this.vid = vid;
  }
  
  public String getImei()
  {
    return this.imei;
  }
  
  public void setImei(String imei)
  {
    this.imei = imei;
  }
  
  public String getImsi()
  {
    return this.imsi;
  }
  
  public void setImsi(String imsi)
  {
    this.imsi = imsi;
  }
  
  public String getHv()
  {
    return this.hv;
  }
  
  public void setHv(String hv)
  {
    this.hv = hv;
  }
  
  public String getSv()
  {
    return this.sv;
  }
  
  public void setSv(String sv)
  {
    this.sv = sv;
  }
  
  public String getPo()
  {
    return this.po;
  }
  
  public void setPo(String po)
  {
    this.po = po;
  }
  
  public Integer getLid()
  {
    return this.lid;
  }
  
  public void setLid(Integer lid)
  {
    this.lid = lid;
  }
  
  public Integer getDrid()
  {
    return this.drid;
  }
  
  public void setDrid(Integer drid)
  {
    this.drid = drid;
  }
  
  public Integer getDct()
  {
    return this.dct;
  }
  
  public void setDct(Integer dct)
  {
    this.dct = dct;
  }
  
  public Integer getSfg()
  {
    return this.sfg;
  }
  
  public void setSfg(Integer sfg)
  {
    this.sfg = sfg;
  }
  
  public Integer getSnm()
  {
    return this.snm;
  }
  
  public void setSnm(Integer snm)
  {
    this.snm = snm;
  }
  
  public Integer getSst()
  {
    return this.sst;
  }
  
  public void setSst(Integer sst)
  {
    this.sst = sst;
  }
  
  public Integer getOr()
  {
    return this.or;
  }
  
  public void setOr(Integer or)
  {
    this.or = or;
  }
  
  public Integer getOs()
  {
    return this.os;
  }
  
  public void setOs(Integer os)
  {
    this.os = os;
  }
  
  public Integer getOv()
  {
    return this.ov;
  }
  
  public void setOv(Integer ov)
  {
    this.ov = ov;
  }
  
  public Integer getOjt()
  {
    return this.ojt;
  }
  
  public void setOjt(Integer ojt)
  {
    this.ojt = ojt;
  }
  
  public Integer getOst()
  {
    return this.ost;
  }
  
  public void setOst(Integer ost)
  {
    this.ost = ost;
  }
  
  public Integer getOjm()
  {
    return this.ojm;
  }
  
  public void setOjm(Integer ojm)
  {
    this.ojm = ojm;
  }
  
  public void setStatusLite(StandardDeviceTrack track)
  {
    this.id = track.getDevIdno();
    this.s1 = track.getStatus1();
    this.s2 = track.getStatus2();
    this.s3 = track.getStatus3();
    this.s4 = track.getStatus4();
    this.t1 = track.getTempSensor1();
    this.t2 = track.getTempSensor2();
    this.t3 = track.getTempSensor3();
    this.t4 = track.getTempSensor4();
    this.yl = track.getYouLiang();
    this.sp = track.getSpeed();
    this.hx = track.getHuangXiang();
    this.lng = track.getJingDu();
    this.lat = track.getWeiDu();
    this.gd = track.getGaoDu();
    this.mlng = track.getMapJingDu();
    this.mlat = track.getMapWeiDu();
    this.pk = track.getParkTime();
    this.lc = track.getLiCheng();
    this.gt = track.getGpsTimeStr();
    this.po = track.getPosition();
  }
}
