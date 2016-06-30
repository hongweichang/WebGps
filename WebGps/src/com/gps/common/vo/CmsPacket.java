package com.gps.common.vo;

public class CmsPacket
{
  private static final byte PACKET_FLAG = 35;
  private static final byte PACKET_VERSION = 8;
  public static final int PACKET_HEAD_LENGTH = 48;
  private byte flag;
  private byte version;
  private byte msgType;
  private short subType;
  private int length;
  private byte result = 0;
  private int sequence;
  private byte[] packet = null;
  
  public CmsPacket(byte msgType, short subType, int sequence, byte[] data)
  {
    this.flag = 35;
    this.version = 8;
    this.msgType = msgType;
    this.subType = subType;
    this.length = (48 + data.length);
    this.sequence = sequence;
    fillPacket(data);
  }
  
  public CmsPacket(byte[] data, int length)
  {
    parsePacket(data, length);
  }
  
  public int getSequence()
  {
    return this.sequence;
  }
  
  public byte[] getPacket()
  {
    return this.packet;
  }
  
  public int getLength()
  {
    return this.length;
  }
  
  public boolean isRight()
  {
    return this.version == 8;
  }
  
  public void fillPacket(byte[] data)
  {
    this.packet = new byte[this.length];
    
    int index = 0;
    
    this.packet[(index++)] = this.flag;
    
    this.packet[(index++)] = this.version;
    
    this.packet[(index++)] = ((byte)(this.sequence & 0xFF));
    this.packet[(index++)] = ((byte)(this.sequence >> 8 & 0xFF));
    
    this.packet[(index++)] = this.result;
    
    this.packet[(index++)] = this.msgType;
    
    this.packet[(index++)] = ((byte)(this.subType & 0xFF));
    this.packet[(index++)] = ((byte)(this.subType >> 8 & 0xFF));
    
    this.packet[(index++)] = ((byte)(this.length & 0xFF));
    this.packet[(index++)] = ((byte)(this.length >> 8 & 0xFF));
    this.packet[(index++)] = ((byte)(this.length >> 16 & 0xFF));
    this.packet[(index++)] = ((byte)(this.length >> 24 & 0xFF));
    
    index += 34;
    
    index += 2;
    
    System.arraycopy(data, 0, this.packet, index, data.length);
  }
  
  public void parsePacket(byte[] packet, int length)
  {
    if ((packet[0] == 35) && (length >= 48))
    {
      int index = 0;
      
      this.flag = packet[(index++)];
      
      this.version = packet[(index++)];
      
      this.sequence = packet[(index++)];
      this.sequence |= packet[(index++)] << 8;
      
      this.result = packet[(index++)];
      
      this.msgType = packet[(index++)];
      
      this.subType = packet[(index++)];
      this.subType = ((short)(this.subType | packet[(index++)] << 8));
      
      this.length = packet[(index++)];
      this.length |= packet[(index++)] << 8;
      this.length |= packet[(index++)] << 16;
      this.length |= packet[(index++)] << 24;
      
      index += 34;
      
      index += 2;
    }
  }
}
