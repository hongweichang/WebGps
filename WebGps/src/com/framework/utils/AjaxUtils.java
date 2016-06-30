package com.framework.utils;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class AjaxUtils
{
  public static final int PAGE_RECORDS = 10;
  public static final int CSVFILE = 1;
  public static final int EXCELFILE = 2;
  public static final int PDFFILE = 3;
  public static final int RTFFILE = 4;
  public static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
  private static ObjectMapper mapper = new ObjectMapper();
  private static JsonFactory jsonFactory = new JsonFactory();
  
  public static <T> Object fromJson(String jsonAsString, Class<T> pojoClass)
    throws JsonMappingException, JsonParseException, IOException
  {
    Object o = null;
    try
    {
      o = mapper.readValue(jsonAsString, pojoClass);
    }
    catch (Exception e)
    {
      System.out.println(e);
    }
    return o;
  }
  
  public static <T> Object fromJson(FileReader fr, Class<T> pojoClass)
    throws JsonParseException, IOException
  {
    return mapper.readValue(fr, pojoClass);
  }
  
  public static String toJson(Object pojo, boolean prettyPrint)
    throws JsonMappingException, JsonGenerationException, IOException
  {
    StringWriter sw = new StringWriter();
    JsonGenerator jsonGenerator = jsonFactory.createJsonGenerator(sw);
    if (prettyPrint) {
      jsonGenerator.useDefaultPrettyPrinter();
    }
    mapper.writeValue(jsonGenerator, pojo);
    return sw.toString();
  }
  
  public static void toJson(Object pojo, FileWriter fw, boolean prettyPrint)
    throws JsonMappingException, JsonGenerationException, IOException
  {
    JsonGenerator jsonGenerator = jsonFactory.createJsonGenerator(fw);
    if (prettyPrint) {
      jsonGenerator.useDefaultPrettyPrinter();
    }
    mapper.writeValue(jsonGenerator, pojo);
  }
  
  public static String getJson(HttpServletRequest request)
    throws JsonMappingException, JsonGenerationException, IOException
  {
    String json = null;
    try
    {
      json = request.getParameter("json");
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return (json == null) || (json.equals("undefined")) ? toJson("", false) : decode(json);
  }
  
  public static String getJson(HttpServletRequest request, String param)
    throws JsonMappingException, JsonGenerationException, IOException
  {
    String json = request.getParameter(param);
    return (json == null) || (json.equals("undefined")) ? toJson("", false) : decode(json);
  }
  
  public static <T> Object getObject(String json, Class<T> object)
    throws JsonMappingException, JsonParseException, IOException
  {
    return fromJson(json, object);
  }
  
  public static <T> Object getObject(HttpServletRequest request, Class<T> object)
    throws JsonMappingException, JsonParseException, IOException
  {
    Object o = null;
    try
    {
      o = fromJson(getJson(request), object);
    }
    catch (Exception ex)
    {
      System.out.println(ex.getMessage());
    }
    return o;
  }
  
  public static <T> Object getObject(HttpServletRequest request, Class<T> object, String param)
    throws JsonMappingException, JsonParseException, IOException
  {
    return fromJson(getJson(request, param), object);
  }
  
  public static String encode(String str)
    throws UnsupportedEncodingException
  {
    return URLEncoder.encode(str, "UTF-8");
  }
  
  public static String decode(String str)
    throws UnsupportedEncodingException
  {
    return URLDecoder.decode(str, "UTF-8");
  }
  
  public static boolean isNumeric(String str)
  {
    int i = str.length();
    do
    {
      if (!Character.isDigit(str.charAt(i))) {
        return false;
      }
      i--;
    } while (i >= 0);
    return true;
  }
  
  public static boolean isInteger(String str)
  {
    Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
    return pattern.matcher(str).matches();
  }
}
