package com.gps808.model;

import java.io.Serializable;
import java.util.Date;

public class StandardDeviceOflTaskLog
  implements Serializable
{
  private static final long serialVersionUID = 48L;
  private Integer id;
  private String devIdno;
  private Date dtCreateTask;
  private Date dtExecutionTask;
  private Date dtEndTask;
  private Integer nTaskStatus;
  private Integer nFileType;
  private String strParam;
  private String strFileName;
  private String vehiIdno;
  
  public String getVehiIdno()
  {
    return this.vehiIdno;
  }
  
  public void setVehiIdno(String vehiIdno)
  {
    this.vehiIdno = vehiIdno;
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
  
  public Date getDtCreateTask()
  {
    return this.dtCreateTask;
  }
  
  public void setDtCreateTask(Date dtCreateTask)
  {
    this.dtCreateTask = dtCreateTask;
  }
  
  public Date getDtExecutionTask()
  {
    return this.dtExecutionTask;
  }
  
  public void setDtExecutionTask(Date dtExecutionTask)
  {
    this.dtExecutionTask = dtExecutionTask;
  }
  
  public Date getDtEndTask()
  {
    return this.dtEndTask;
  }
  
  public void setDtEndTask(Date dtEndTask)
  {
    this.dtEndTask = dtEndTask;
  }
  
  public Integer getnTaskStatus()
  {
    return this.nTaskStatus;
  }
  
  public void setnTaskStatus(Integer nTaskStatus)
  {
    this.nTaskStatus = nTaskStatus;
  }
  
  public Integer getnFileType()
  {
    return this.nFileType;
  }
  
  public void setnFileType(Integer nFileType)
  {
    this.nFileType = nFileType;
  }
  
  public String getStrParam()
  {
    return this.strParam;
  }
  
  public void setStrParam(String strParam)
  {
    this.strParam = strParam;
  }
  
  public String getStrFileName()
  {
    return this.strFileName;
  }
  
  public void setStrFileName(String strFileName)
  {
    this.strFileName = strFileName;
  }
  
  public static long getSerialversionuid()
  {
    return 48L;
  }
}
