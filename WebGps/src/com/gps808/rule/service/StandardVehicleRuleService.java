package com.gps808.rule.service;

import com.framework.web.dto.AjaxDto;
import com.framework.web.dto.Pagination;
import com.framework.web.service.UniversalService;
import com.gps.vehicle.model.MapMarker;
import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardVehiRule;
import java.util.List;

public abstract interface StandardVehicleRuleService
  extends UniversalService
{
  public abstract AjaxDto<StandardRuleMaintain> getRuleList(List<Integer> paramList1, List<Integer> paramList2, String paramString, Pagination paramPagination);
  
  public abstract StandardRuleMaintain getVehicleRuleByName(String paramString);
  
  public abstract List<StandardVehiRule> getStandardVehiRulePermit(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract AjaxDto<StandardVehiRule> getStandardVehiRulePermit(Integer paramInteger, String paramString1, String paramString2, Pagination paramPagination);
  
  public abstract void editVehiRulePermit(List<StandardVehiRule> paramList1, List<StandardVehiRule> paramList2);
  
  public abstract List<MapMarker> getMapMarkerList(Integer paramInteger);
  
  public abstract AjaxDto<MapMarker> getAreaList(List<Integer> paramList1, Integer paramInteger, List<Integer> paramList2, String paramString1, Boolean paramBoolean, String paramString2, Pagination paramPagination);
  
  public abstract List<StandardRuleMaintain> getRulesByArea(Integer paramInteger);
  
  public abstract void deleteRule(List<StandardVehiRule> paramList, StandardRuleMaintain paramStandardRuleMaintain);
}
