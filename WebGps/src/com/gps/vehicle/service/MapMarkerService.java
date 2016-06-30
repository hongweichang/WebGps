package com.gps.vehicle.service;

import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.MapMarker;
import java.util.List;

public abstract interface MapMarkerService
  extends UniversalService
{
  public abstract List<MapMarker> getMapMarkerList(Integer paramInteger);
}
