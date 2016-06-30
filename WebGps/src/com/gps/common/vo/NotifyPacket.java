package com.gps.common.vo;

public class NotifyPacket
{
  private long lastSendTime;
  private int sendcount = 0;
  private CmsPacket cmsPacket;
  
  public NotifyPacket(CmsPacket cmsPacket)
  {
    this.lastSendTime = System.currentTimeMillis();
    this.cmsPacket = cmsPacket;
  }
  
  public long getLastSendTime()
  {
    return this.lastSendTime;
  }
  
  public int getSequence()
  {
    return this.cmsPacket.getSequence();
  }
  
  public long getSendCount()
  {
    return this.sendcount;
  }
  
  public CmsPacket getCmsPacket()
  {
    return this.cmsPacket;
  }
  
  public void setCmsPacket(CmsPacket cmsPacket)
  {
    this.cmsPacket = cmsPacket;
  }
  
  public void addSendCount()
  {
    this.sendcount += 1;
    this.lastSendTime = System.currentTimeMillis();
  }
  
  public byte[] getData()
  {
    return this.cmsPacket.getPacket();
  }
  
  public int getLength()
  {
    return this.cmsPacket.getLength();
  }
}
