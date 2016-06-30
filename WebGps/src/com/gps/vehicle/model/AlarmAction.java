package com.gps.vehicle.model;

import java.io.Serializable;

public class AlarmAction
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private Integer id;
  private String devIdno;
  private Integer armType;
  private String armSubType;
  private Integer smsSend;
  private String smsAddress;
  private String smsContent;
  private Integer emailSend;
  private String emailAddress;
  private String emailContent;
  private Integer recSave;
  private Integer recDelay;
  private Integer recChannel;
  private Integer beginTime;
  private Integer endTime;
  private String captureChannel;
  private String recordingTime;
  private String selArmTypes;
  
  public String getSelArmTypes()
  {
    return this.selArmTypes;
  }
  
  public void setSelArmTypes(String selArmTypes)
  {
    this.selArmTypes = selArmTypes;
  }
  
  public Integer getId()
  {
    return this.id;
  }
  
  public void setId(Integer id)
  {
    this.id = id;
  }
  
  public String getDevIdno()
  {
    return this.devIdno;
  }
  
  public void setDevIdno(String devIdno)
  {
    this.devIdno = devIdno;
  }
  
  public Integer getArmType()
  {
    return this.armType;
  }
  
  public void setArmType(Integer armType)
  {
    this.armType = armType;
  }
  
  public String getArmSubType()
  {
    return this.armSubType;
  }
  
  public void setArmSubType(String armSubType)
  {
    this.armSubType = armSubType;
  }
  
  public Integer getSmsSend()
  {
    return this.smsSend;
  }
  
  public void setSmsSend(Integer smsSend)
  {
    this.smsSend = smsSend;
  }
  
  public String getSmsAddress()
  {
    return this.smsAddress;
  }
  
  public void setSmsAddress(String smsAddress)
  {
    this.smsAddress = smsAddress;
  }
  
  public String getSmsContent()
  {
    return this.smsContent;
  }
  
  public void setSmsContent(String smsContent)
  {
    this.smsContent = smsContent;
  }
  
  public Integer getEmailSend()
  {
    return this.emailSend;
  }
  
  public void setEmailSend(Integer emailSend)
  {
    this.emailSend = emailSend;
  }
  
  public String getEmailAddress()
  {
    return this.emailAddress;
  }
  
  public void setEmailAddress(String emailAddress)
  {
    this.emailAddress = emailAddress;
  }
  
  public String getEmailContent()
  {
    return this.emailContent;
  }
  
  public void setEmailContent(String emailContent)
  {
    this.emailContent = emailContent;
  }
  
  public Integer getRecSave()
  {
    return this.recSave;
  }
  
  public void setRecSave(Integer recSave)
  {
    this.recSave = recSave;
  }
  
  public Integer getRecDelay()
  {
    return this.recDelay;
  }
  
  public void setRecDelay(Integer recDelay)
  {
    this.recDelay = recDelay;
  }
  
  public Integer getRecChannel()
  {
    return this.recChannel;
  }
  
  public void setRecChannel(Integer recChannel)
  {
    this.recChannel = recChannel;
  }
  
  public Integer getBeginTime()
  {
    return this.beginTime;
  }
  
  public void setBeginTime(Integer beginTime)
  {
    this.beginTime = beginTime;
  }
  
  public Integer getEndTime()
  {
    return this.endTime;
  }
  
  public void setEndTime(Integer endTime)
  {
    this.endTime = endTime;
  }
  
  public String getCaptureChannel()
  {
    return this.captureChannel;
  }
  
  public void setCaptureChannel(String captureChannel)
  {
    this.captureChannel = captureChannel;
  }
  
  public String getRecordingTime()
  {
    return this.recordingTime;
  }
  
  public void setRecordingTime(String recordingTime)
  {
    this.recordingTime = recordingTime;
  }
  
  public int hashCode()
  {
    int prime = 31;
    int result = 1;
    result = 31 * result + (this.devIdno == null ? 0 : this.devIdno.hashCode());
    result = 31 * result + (this.armType == null ? 0 : this.armType.hashCode());
    return result;
  }
  
  public boolean equals(Object obj)
  {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (getClass() != obj.getClass()) {
      return false;
    }
    AlarmAction other = (AlarmAction)obj;
    if (this.devIdno == null)
    {
      if (other.devIdno != null) {
        return false;
      }
    }
    else if (!this.devIdno.equals(other.devIdno)) {
      return false;
    }
    if (this.armType == null)
    {
      if (other.armType != null) {
        return false;
      }
    }
    else if (!this.armType.equals(other.armType)) {
      return false;
    }
    return true;
  }
}
