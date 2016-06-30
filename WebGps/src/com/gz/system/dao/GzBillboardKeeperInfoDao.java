package com.gz.system.dao;

import com.gz.system.model.GzBillboardKeeperInfo;
import java.util.List;

public abstract interface GzBillboardKeeperInfoDao
{
  public abstract GzBillboardKeeperInfo get(String paramString);
  
  public abstract String save(GzBillboardKeeperInfo paramGzBillboardKeeperInfo);
  
  public abstract void update(GzBillboardKeeperInfo paramGzBillboardKeeperInfo);
  
  public abstract void delete(GzBillboardKeeperInfo paramGzBillboardKeeperInfo);
  
  public abstract void delete(String paramString);
  
  public abstract GzBillboardKeeperInfo findByName(String paramString);
  
  public abstract GzBillboardKeeperInfo findById(String paramString);
  
  public abstract List<GzBillboardKeeperInfo> findAll();
  
  public abstract int getBillboardKeeperCount(String paramString);
}
