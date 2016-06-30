package com.gps808.rule.dao;

import com.gps808.model.StandardRuleMaintain;
import com.gps808.model.StandardVehiRule;
import java.util.List;

public abstract interface StandardVehicleRuleDao
{
  public abstract StandardRuleMaintain getVehicleRuleByName(String paramString);
  
  public abstract List<StandardVehiRule> getStandardVehiRulePermit(Integer paramInteger, String paramString1, String paramString2);
  
  public abstract void editVehiRulePermit(List<StandardVehiRule> paramList1, List<StandardVehiRule> paramList2);
  
  public abstract void deleteRule(List<StandardVehiRule> paramList, StandardRuleMaintain paramStandardRuleMaintain);
}
