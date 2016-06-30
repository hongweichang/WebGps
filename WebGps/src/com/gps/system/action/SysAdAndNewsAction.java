package com.gps.system.action;

import com.framework.logger.Logger;
import com.framework.utils.DateUtil;
import com.framework.utils.ImageSizer;
import com.framework.web.dto.AjaxDto;
import com.gps.common.action.SysBaseAction;
import com.gps.system.model.SysAd;
import com.gps.system.model.SysNews;
import com.gps.system.service.AdAndNewsService;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SysAdAndNewsAction
  extends SysBaseAction
{
  private static final long serialVersionUID = 1L;
  private AdAndNewsService adAndNewsService;
  private List<File> simplePicture;
  private String[] simplePictureFileName;
  private List<String> simplePictureContentType;
  private File upload;
  private String uploadContentType;
  private String uploadFileName;
  
  public List<String> getSimplePictureContentType()
  {
    return this.simplePictureContentType;
  }
  
  public void setSimplePictureContentType(List<String> simplePictureContentType)
  {
    this.simplePictureContentType = simplePictureContentType;
  }
  
  public List<File> getSimplePicture()
  {
    return this.simplePicture;
  }
  
  public void setSimplePicture(List<File> simplePicture)
  {
    this.simplePicture = simplePicture;
  }
  
  public String[] getSimplePictureFileName()
  {
    return this.simplePictureFileName;
  }
  
  public void setSimplePictureFileName(String[] simplePictureFileName)
  {
    this.simplePictureFileName = simplePictureFileName;
  }
  
  public AdAndNewsService getAdAndNewsService()
  {
    return this.adAndNewsService;
  }
  
  public void setAdAndNewsService(AdAndNewsService adAndNewsService)
  {
    this.adAndNewsService = adAndNewsService;
  }
  
  public File getUpload()
  {
    return this.upload;
  }
  
  public void setUpload(File upload)
  {
    this.upload = upload;
  }
  
  public String getUploadContentType()
  {
    return this.uploadContentType;
  }
  
  public void setUploadContentType(String uploadContentType)
  {
    this.uploadContentType = uploadContentType;
  }
  
  public String getUploadFileName()
  {
    return this.uploadFileName;
  }
  
  public void setUploadFileName(String uploadFileName)
  {
    this.uploadFileName = uploadFileName;
  }
  
  public String list()
    throws Exception
  {
    String adType = getRequest().getParameter("adType");
    String name = getRequestString("name");
    String type = getRequestString("type");
    String queryFilter = getRequest().getParameter("query");
    String qtype = getRequestString("qtype");
    String sortname = getRequestString("sortname");
    String sortorder = getRequestString("sortorder");
    
    String entity = "";
    if (("ad".equals(adType)) || ("����".equals(adType))) {
      entity = "SysAd";
    } else {
      entity = "SysNews";
    }
    try
    {
      if ((type != null) && ("1".equals(type)))
      {
        AjaxDto<Object> ajaxDto = this.adAndNewsService.getAdOrNewsList(entity, getPaginationEx(), queryFilter, qtype, sortname, sortorder);
        if (ajaxDto.getPageList() != null) {
          for (Object obj : ajaxDto.getPageList()) {
            if (entity.equals("SysAd"))
            {
              ((SysAd)obj).setAtimeStr(DateUtil.dateSwitchString(((SysAd)obj).getAtime()));
              ((SysAd)obj).setEndTimeStr(DateUtil.dateSwitchString(((SysAd)obj).getEndTime()));
            }
            else
            {
              ((SysNews)obj).setAtimeStr(DateUtil.dateSwitchString(((SysNews)obj).getAtime()));
              ((SysNews)obj).setEndTimeStr(DateUtil.dateSwitchString(((SysNews)obj).getEndTime()));
            }
          }
        }
        addCustomResponse("infos", ajaxDto.getPageList());
        addCustomResponse("pagination", ajaxDto.getPagination());
      }
      else
      {
        Object obj = this.adAndNewsService.findAll(entity);
        addCustomResponse("adOrNews", obj);
      }
    }
    catch (Exception e)
    {
      this.log.error(e.getMessage(), e);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String get()
    throws Exception
  {
    try
    {
      String adType = getRequestString("adType");
      String id = getRequestString("id");
      String type = getRequestString("type");
      String entity = "";
      if (("ad".equals(adType)) || ("����".equals(adType))) {
        entity = "SysAd";
      } else {
        entity = "SysNews";
      }
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else if (("ad".equals(adType)) || ("����".equals(adType)))
      {
        if ("one".equals(type))
        {
          SysAd ad = this.adAndNewsService.getAd(id);
          addCustomResponse("adOrNews", ad);
        }
        else
        {
          List<Object> ads = this.adAndNewsService.findPartList(entity, id);
          addCustomResponse("adOrNews", ads);
        }
      }
      else if ("one".equals(type))
      {
        SysNews news = this.adAndNewsService.getNews(id);
        addCustomResponse("adOrNews", news);
      }
      else
      {
        List<Object> news = this.adAndNewsService.findPartList(entity, id);
        addCustomResponse("adOrNews", news);
      }
    }
    catch (Exception e)
    {
      this.log.error(e.getMessage(), e);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String save()
    throws Exception
  {
    try
    {
      String adType = getRequest().getParameter("adType");
      String id = getRequestString("id");
      
      String title = getRequest().getParameter("title");
      String content = getRequest().getParameter("contentTextArea");
      String endTime = getRequest().getParameter("validity");
      Object obj;
     
      if (("ad".equals(adType)) || ("����".equals(adType)))
      {
        SysAd sysAd = new SysAd();
        if ((id != null) && (!id.isEmpty())) {
          sysAd = this.adAndNewsService.getAd(id);
        }
        sysAd.setTitle(title);
        sysAd.setContent(content);
        sysAd.setEndTime(DateUtil.StrDate2Date(endTime));
        String src = getRequest().getParameter("src");
        sysAd.setAtime(new Date());
        if (("".equals(src)) || (src == null))
        {
          src = upload();
          if (("".equals(src)) || (src == null)) {
            return "error";
          }
          delFile(sysAd.getSrc());
        }
        sysAd.setSrc(src);
        obj = sysAd;
      }
      else
      {
        SysNews sysNews = new SysNews();
        sysNews.setTitle(title);
        sysNews.setContent(content);
        sysNews.setEndTime(DateUtil.StrDate2Date(endTime));
        sysNews.setAtime(new Date());
        if ((id != null) && (!id.isEmpty())) {
          sysNews.setId(Integer.valueOf(Integer.parseInt(id)));
        }
        obj = sysNews;
      }
      if ((id != null) && (!id.isEmpty())) {
        this.adAndNewsService.update(obj);
      } else {
        this.adAndNewsService.save(obj);
      }
      addCustomResponse("adOrNews", obj);
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String delete()
    throws Exception
  {
    try
    {
      String id = getRequestString("id");
      if ((id == null) || (id.isEmpty()))
      {
        addCustomResponse(ACTION_RESULT, Integer.valueOf(8));
      }
      else
      {
        String[] delIds;
       
        if (id.indexOf(",") != -1)
        {
          delIds = id.split(",");
        }
        else
        {
          delIds = new String[1];
          delIds[0] = id;
        }
        String adType = getRequest().getParameter("adType");
        String entity = "";
        if (("ad".equals(adType)) || ("����".equals(adType))) {
          entity = "SysAd";
        } else {
          entity = "SysNews";
        }
        for (int i = 0; i < delIds.length; i++)
        {
          Object obj = this.adAndNewsService.findByIdno(entity, delIds[i]);
          if (obj != null)
          {
            this.adAndNewsService.delete(obj);
            if (("ad".equals(adType)) || ("����".equals(adType))) {
              delFile(((SysAd)obj).getSrc());
            }
          }
          else
          {
            addCustomResponse(ACTION_RESULT, Integer.valueOf(12));
            break;
          }
        }
      }
    }
    catch (Exception ex)
    {
      this.log.error(ex.getMessage(), ex);
      addCustomResponse(ACTION_RESULT, Integer.valueOf(1));
    }
    return "success";
  }
  
  public String upload()
    throws IOException
  {
    String myFileName = "";
    for (int i = 0; i < this.simplePictureFileName.length; i++)
    {
      String fileName = this.simplePictureFileName[i];
      String fileType = (String)this.simplePictureContentType.get(i);
      if (!fileName.equals(""))
      {
        String expandedName = "";
        if ((fileType.equals("image/pjpeg")) || (fileType.equals("image/jpeg")))
        {
          expandedName = ".jpg";
        }
        else if ((fileType.equals("image/png")) || (fileType.equals("image/x-png")))
        {
          expandedName = ".png";
        }
        else if (fileType.equals("image/gif"))
        {
          expandedName = ".gif";
        }
        else if (fileType.equals("image/bmp"))
        {
          expandedName = ".bmp";
        }
        else
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(42));
          return null;
        }
        if (((File)this.simplePicture.get(i)).length() > 1048576L)
        {
          addCustomResponse(ACTION_RESULT, Integer.valueOf(41));
          return null;
        }
        InputStream is = new FileInputStream((File)this.simplePicture.get(i));
        String uploadPath = getServletContext().getRealPath("/upload/image");
        String newfileName = UUID.randomUUID().toString();
        newfileName = newfileName + expandedName;
        File file = new File(uploadPath);
        if (!file.exists()) {
          file.mkdirs();
        }
        File toFile = new File(uploadPath, newfileName);
        OutputStream os = new FileOutputStream(toFile);
        byte[] buffer = new byte['?'];
        int length = 0;
        while ((length = is.read(buffer)) > 0) {
          os.write(buffer, 0, length);
        }
        myFileName = newfileName;
        is.close();
        os.close();
        String ext = getExt(this.simplePictureFileName[i]);
        ImageSizer.resize(new File(uploadPath + "\\" + newfileName), new File(uploadPath + "\\" + newfileName), 1280, 560, ext);
      }
    }
    return myFileName;
  }
  
  public String fileUpload()
    throws IOException
  {
    getResponse().setCharacterEncoding("utf-8");
    PrintWriter out = getResponse().getWriter();
    
    String callback = getRequest().getParameter("CKEditorFuncNum");
    String expandedName = "";
    if ((this.uploadContentType.equals("image/pjpeg")) || (this.uploadContentType.equals("image/jpeg")))
    {
      expandedName = ".jpg";
    }
    else if ((this.uploadContentType.equals("image/png")) || (this.uploadContentType.equals("image/x-png")))
    {
      expandedName = ".png";
    }
    else if (this.uploadContentType.equals("image/gif"))
    {
      expandedName = ".gif";
    }
    else if (this.uploadContentType.equals("image/bmp"))
    {
      expandedName = ".bmp";
    }
    else
    {
      out.println("<script type=\"text/javascript\">");
      out.println("window.parent.CKEDITOR.tools.callFunction(" + callback + ",''," + "'����������������������.jpg/.gif/.bmp/.png������');");
      out.println("</script>");
      return null;
    }
    if (this.upload.length() > 614400L)
    {
      out.println("<script type=\"text/javascript\">");
      out.println("window.parent.CKEDITOR.tools.callFunction(" + callback + ",''," + "'����������������600k');");
      out.println("</script>");
      return null;
    }
    InputStream is = new FileInputStream(this.upload);
    String uploadPath = getServletContext().getRealPath("/upload/uploadImg");
    String fileName = UUID.randomUUID().toString();
    fileName = fileName + expandedName;
    File file = new File(uploadPath);
    if (!file.exists()) {
      file.mkdirs();
    }
    File toFile = new File(uploadPath, fileName);
    OutputStream os = new FileOutputStream(toFile);
    byte[] buffer = new byte['?'];
    int length = 0;
    while ((length = is.read(buffer)) > 0) {
      os.write(buffer, 0, length);
    }
    is.close();
    os.close();
    
    out.println("<script type=\"text/javascript\">");
    out.println("window.parent.CKEDITOR.tools.callFunction(" + callback + ",'" + "../upload/uploadImg/" + fileName + "','')");
    out.println("</script>");
    return null;
  }
  
  public static boolean validateImageFileType(File formFile, String fileName)
  {
    if (formFile != null)
    {
      String ext = getExt(fileName);
      
      List<String> arrowType = Arrays.asList(new String[] { "image/bmp", "image/png", "image/gif", "image/jpg", "image/jpeg", "image/pjpeg" });
      
      List<String> arrowExtension = Arrays.asList(new String[] { "gif", "jpg", "bmp", "png", "jpeg" });
      return arrowExtension.contains(ext);
    }
    return true;
  }
  
  public static String getExt(String fileName)
  {
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  }
  
  public void delFile(String path)
  {
    String tmpFile = getServletContext().getRealPath("/upload/image/" + path);
    File file = new File(tmpFile);
    file.delete();
  }
}
