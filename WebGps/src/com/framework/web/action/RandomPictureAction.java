package com.framework.web.action;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.Random;
import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

public class RandomPictureAction
  extends BaseAction
{
  private static final long serialVersionUID = -3218893860152265456L;
  private ByteArrayInputStream inputStream;
  
  public String execute()
    throws Exception
  {
    int width = 60;int height = 20;
    
    BufferedImage image = new BufferedImage(width, height, 
      1);
    
    Graphics g = image.getGraphics();
    
    Random random = new Random();
    
    g.setColor(getRandColor(200, 250));
    g.fillRect(0, 0, width, height);
    
    g.setFont(new Font("Times New Roman", 0, 18));
    
    g.setColor(getRandColor(160, 200));
    for (int i = 0; i < 155; i++)
    {
      int x = random.nextInt(width);
      int y = random.nextInt(height);
      int xl = random.nextInt(12);
      int yl = random.nextInt(12);
      g.drawLine(x, y, x + xl, y + yl);
    }
    String sRand = "";
    for (int i = 0; i < 4; i++)
    {
      String rand = String.valueOf(random.nextInt(10));
      sRand = sRand + rand;
      
      g.setColor(new Color(20 + random.nextInt(110), 20 + random
        .nextInt(110), 20 + random.nextInt(110)));
      
      g.drawString(rand, 13 * i + 6, 16);
    }
    getSession().put("rand", sRand);
    
    g.dispose();
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    ImageOutputStream imageOut = ImageIO.createImageOutputStream(output);
    ImageIO.write(image, "JPEG", imageOut);
    imageOut.close();
    ByteArrayInputStream input = new ByteArrayInputStream(output
      .toByteArray());
    
    setInputStream(input);
    return "success";
  }
  
  private Color getRandColor(int fc, int bc)
  {
    Random random = new Random();
    if (fc > 255) {
      fc = 255;
    }
    if (bc > 255) {
      bc = 255;
    }
    int r = fc + random.nextInt(bc - fc);
    int g = fc + random.nextInt(bc - fc);
    int b = fc + random.nextInt(bc - fc);
    return new Color(r, g, b);
  }
  
  public void setInputStream(ByteArrayInputStream inputStream)
  {
    this.inputStream = inputStream;
  }
  
  public ByteArrayInputStream getInputStream()
  {
    return this.inputStream;
  }
}
