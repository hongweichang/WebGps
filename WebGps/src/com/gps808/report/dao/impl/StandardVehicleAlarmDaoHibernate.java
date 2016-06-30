package com.gps808.report.dao.impl;

import com.framework.web.dao.HibernateDaoSupportEx;
import com.gps808.model.StandardDeviceAlarm;
import com.gps808.report.dao.StandardVehicleAlarmDao;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

public class StandardVehicleAlarmDaoHibernate
  extends HibernateDaoSupportEx
  implements StandardVehicleAlarmDao
{
  public List<StandardDeviceAlarm> summaryDeviceAlarm()
  {
    return null;
  }
  
  public StandardDeviceAlarm getStandardDeviceAlarm(String guid)
  {
    Query query = getSession().createQuery(String.format(" from StandardDeviceAlarm where guid = '%s'", new Object[] { guid }));
    if (query == null) {
      return null;
    }
    List<StandardDeviceAlarm> list = query.list();
    if (list.size() > 0) {
      return (StandardDeviceAlarm)list.get(0);
    }
    return null;
  }
  
  /* Error */
  public void updateStandardDeviceAlarm(List<String> lstGuid, Integer handleStatus, String handleContent)
  {
    // Byte code:
    //   0: new 70	java/lang/StringBuffer
    //   3: dup
    //   4: ldc 72
    //   6: iconst_2
    //   7: anewarray 28	java/lang/Object
    //   10: dup
    //   11: iconst_0
    //   12: aload_2
    //   13: aastore
    //   14: dup
    //   15: iconst_1
    //   16: aload_3
    //   17: aastore
    //   18: invokestatic 30	java/lang/String:format	(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
    //   21: invokespecial 74	java/lang/StringBuffer:<init>	(Ljava/lang/String;)V
    //   24: astore 4
    //   26: aload 4
    //   28: ldc 77
    //   30: iconst_1
    //   31: anewarray 28	java/lang/Object
    //   34: dup
    //   35: iconst_0
    //   36: aload_1
    //   37: iconst_0
    //   38: invokeinterface 53 2 0
    //   43: aastore
    //   44: invokestatic 30	java/lang/String:format	(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
    //   47: invokevirtual 79	java/lang/StringBuffer:append	(Ljava/lang/String;)Ljava/lang/StringBuffer;
    //   50: pop
    //   51: iconst_1
    //   52: istore 5
    //   54: goto +14 -> 68
    //   57: aload 4
    //   59: ldc 83
    //   61: invokevirtual 79	java/lang/StringBuffer:append	(Ljava/lang/String;)Ljava/lang/StringBuffer;
    //   64: pop
    //   65: iinc 5 1
    //   68: iload 5
    //   70: aload_1
    //   71: invokeinterface 47 1 0
    //   76: if_icmplt -19 -> 57
    //   79: aload 4
    //   81: ldc 85
    //   83: invokevirtual 79	java/lang/StringBuffer:append	(Ljava/lang/String;)Ljava/lang/StringBuffer;
    //   86: pop
    //   87: aload_0
    //   88: invokevirtual 87	com/gps808/report/dao/impl/StandardVehicleAlarmDaoHibernate:getHibernateTemplate	()Lorg/springframework/orm/hibernate3/HibernateTemplate;
    //   91: invokevirtual 91	org/springframework/orm/hibernate3/HibernateTemplate:getSessionFactory	()Lorg/hibernate/SessionFactory;
    //   94: invokeinterface 97 1 0
    //   99: astore 5
    //   101: aconst_null
    //   102: astore 6
    //   104: aload 5
    //   106: aload 4
    //   108: invokevirtual 103	java/lang/StringBuffer:toString	()Ljava/lang/String;
    //   111: invokeinterface 107 2 0
    //   116: astore 6
    //   118: iconst_0
    //   119: istore 7
    //   121: aload_1
    //   122: invokeinterface 47 1 0
    //   127: istore 8
    //   129: goto +27 -> 156
    //   132: aload 6
    //   134: iload 7
    //   136: aload_1
    //   137: iload 7
    //   139: invokeinterface 53 2 0
    //   144: checkcast 31	java/lang/String
    //   147: invokeinterface 111 3 0
    //   152: pop
    //   153: iinc 7 1
    //   156: iload 7
    //   158: iload 8
    //   160: if_icmplt -28 -> 132
    //   163: aload 6
    //   165: invokeinterface 117 1 0
    //   170: pop
    //   171: goto +21 -> 192
    //   174: astore 7
    //   176: aload 7
    //   178: athrow
    //   179: astore 9
    //   181: aload 5
    //   183: invokeinterface 120 1 0
    //   188: pop
    //   189: aload 9
    //   191: athrow
    //   192: aload 5
    //   194: invokeinterface 120 1 0
    //   199: pop
    //   200: return
    // Line number table:
    //   Java source line #49	-> byte code offset #0
    //   Java source line #50	-> byte code offset #26
    //   Java source line #51	-> byte code offset #51
    //   Java source line #52	-> byte code offset #57
    //   Java source line #51	-> byte code offset #65
    //   Java source line #54	-> byte code offset #79
    //   Java source line #56	-> byte code offset #87
    //   Java source line #57	-> byte code offset #101
    //   Java source line #59	-> byte code offset #104
    //   Java source line #60	-> byte code offset #118
    //   Java source line #61	-> byte code offset #132
    //   Java source line #60	-> byte code offset #153
    //   Java source line #63	-> byte code offset #163
    //   Java source line #64	-> byte code offset #171
    //   Java source line #65	-> byte code offset #176
    //   Java source line #66	-> byte code offset #179
    //   Java source line #67	-> byte code offset #181
    //   Java source line #68	-> byte code offset #189
    //   Java source line #67	-> byte code offset #192
    //   Java source line #69	-> byte code offset #200
    // Local variable table:
    //   start	length	slot	name	signature
    //   0	201	0	this	StandardVehicleAlarmDaoHibernate
    //   0	201	1	lstGuid	List<String>
    //   0	201	2	handleStatus	Integer
    //   0	201	3	handleContent	String
    //   24	83	4	sql	StringBuffer
    //   52	17	5	i	int
    //   99	94	5	session	Session
    //   102	62	6	query	org.hibernate.SQLQuery
    //   119	38	7	i	int
    //   174	3	7	re	RuntimeException
    //   127	32	8	j	int
    //   179	11	9	localObject	Object
    // Exception table:
    //   from	to	target	type
    //   104	171	174	java/lang/RuntimeException
    //   104	179	179	finally
  }
}
