package com.framework.web.cache;

import java.util.List;
import java.util.Map;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

public class MyCacheLoader
{
  public static final String CACHE_BAIDUMAP = "baiduMap";
  public static final String CACHE_GOOGLEMAP = "googleMap";
  private static CacheManager manager = null;
  
  public static CacheManager getManager()
  {
    if (manager == null) {
      manager = CacheManager.create("src/ehcache.xml");
    }
    return manager;
  }
  
  public static void addCacheInfo(String name, String key, Object value)
  {
    Cache cache = getManager().getCache(name);
    cache.put(new Element(key, value));
    cache.flush();
  }
  
  public static void addCacheInfo(Cache cache, String key, Object value)
  {
    cache.put(new Element(key, value));
    cache.flush();
  }
  
  public static void addCacheInfo(String name, List<Map<String, Object>> lisValue)
  {
    Cache cache = getManager().getCache(name);
    if ((lisValue != null) && (lisValue.size() > 0)) {
      for (Map<String, Object> map : lisValue) {
        cache.put(new Element(map.get("key"), map.get("value")));
      }
    }
    cache.flush();
  }
  
  public static Object getCacheInfo(String name, String key)
  {
    if (key == null) {
      return null;
    }
    try
    {
      Cache cache = getManager().getCache(name);
      Element info = cache.get(key);
      return info == null ? null : info.getObjectValue();
    }
    catch (Exception e) {}
    return null;
  }
  
  public static Object getCacheInfoByCache(Cache cache, String key)
  {
    if (key == null) {
      return null;
    }
    try
    {
      Element info = cache.get(key);
      return info == null ? null : info.getObjectValue();
    }
    catch (Exception e) {}
    return null;
  }
  
  public static Cache getCache(String name)
  {
    Cache cache = getManager().getCache(name);
    return cache;
  }
  
  public static void delCacheInfo(String name, String key)
  {
    Cache cache = getManager().getCache(name);
    cache.remove(key);
  }
  
  public static void clearCache(String name)
  {
    Cache cache = getManager().getCache(name);
    cache.removeAll();
  }
  
  public static void delCache(String name)
  {
    getManager().removeCache(name);
  }
}
