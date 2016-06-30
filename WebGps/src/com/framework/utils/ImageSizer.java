package com.framework.utils;

import com.gif4j.GifDecoder;
import com.gif4j.GifEncoder;
import com.gif4j.GifImage;
import com.gif4j.GifTransformer;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import java.awt.Component;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

public class ImageSizer
{
  public static final MediaTracker tracker = new MediaTracker(new Component()
  {
    private static final long serialVersionUID = 1234162663955668507L;
  });
  
  public static void resize(File originalFile, File resizedFile, int width, int height, String format)
    throws IOException
  {
    if ((format != null) && ("gif".equals(format.toLowerCase())))
    {
      GifImage gifImage = GifDecoder.decode(originalFile);
      GifImage resizedGifImage2 = GifTransformer.resize(gifImage, width, height, true);
      GifEncoder.encode(resizedGifImage2, resizedFile, true);
      return;
    }
    FileInputStream fis = new FileInputStream(originalFile);
    ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
    int readLength = -1;
    int bufferSize = 1024;
    byte[] bytes = new byte[bufferSize];
    while ((readLength = fis.read(bytes, 0, bufferSize)) != -1) {
      byteStream.write(bytes, 0, readLength);
    }
    byte[] in = byteStream.toByteArray();
    fis.close();
    byteStream.close();
    
    Image inputImage = Toolkit.getDefaultToolkit().createImage(in);
    waitForImage(inputImage);
    int imageWidth = inputImage.getWidth(null);
    if (imageWidth < 1) {
      throw new IllegalArgumentException("image width " + imageWidth + " is out of range");
    }
    int imageHeight = inputImage.getHeight(null);
    if (imageHeight < 1) {
      throw new IllegalArgumentException("image height " + imageHeight + " is out of range");
    }
    Image outputImage = inputImage.getScaledInstance(width, height, 1);
    checkImage(outputImage);
    encode(new FileOutputStream(resizedFile), outputImage, format);
  }
  
  private static void checkImage(Image image)
  {
    waitForImage(image);
    int imageWidth = image.getWidth(null);
    if (imageWidth < 1) {
      throw new IllegalArgumentException("image width " + imageWidth + " is out of range");
    }
    int imageHeight = image.getHeight(null);
    if (imageHeight < 1) {
      throw new IllegalArgumentException("image height " + imageHeight + " is out of range");
    }
  }
  
  private static void waitForImage(Image image)
  {
    try
    {
      tracker.addImage(image, 0);
      tracker.waitForID(0);
      tracker.removeImage(image, 0);
    }
    catch (InterruptedException e)
    {
      e.printStackTrace();
    }
  }
  
  private static void encode(OutputStream outputStream, Image outputImage, String format)
    throws IOException
  {
    int outputWidth = outputImage.getWidth(null);
    if (outputWidth < 1) {
      throw new IllegalArgumentException("output image width " + outputWidth + " is out of range");
    }
    int outputHeight = outputImage.getHeight(null);
    if (outputHeight < 1) {
      throw new IllegalArgumentException("output image height " + outputHeight + " is out of range");
    }
    BufferedImage bi = new BufferedImage(outputWidth, outputHeight, 
      1);
    Graphics2D biContext = bi.createGraphics();
    biContext.drawImage(outputImage, 0, 0, null);
    ImageIO.write(bi, format, outputStream);
    outputStream.flush();
  }
  
  private static void resize2(File originalFile, File resizedFile, int newWidth, int newHeight, float quality)
    throws IOException
  {
    if ((quality < 0.0F) || (quality > 1.0F)) {
      throw new IllegalArgumentException("Quality has to be between 0 and 1");
    }
    ImageIcon ii = new ImageIcon(originalFile.getCanonicalPath());
    Image i = ii.getImage();
    Image resizedImage = null;
    int iWidth = i.getWidth(null);
    int iHeight = i.getHeight(null);
    if (iWidth > iHeight) {
      resizedImage = i.getScaledInstance(newWidth, newWidth * newHeight / iWidth, 4);
    } else {
      resizedImage = i.getScaledInstance(newWidth * newHeight / iHeight, newWidth, 4);
    }
    Image temp = new ImageIcon(resizedImage).getImage();
    
    BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), 
      1);
    
    Graphics g = bufferedImage.createGraphics();
    
    float softenFactor = 0.05F;
    float[] softenArray = { 0.0F, softenFactor, 0.0F, softenFactor, 1.0F - softenFactor * 4.0F, softenFactor, 0.0F, softenFactor, 0.0F };
    Kernel kernel = new Kernel(3, 3, softenArray);
    ConvolveOp cOp = new ConvolveOp(kernel, 1, null);
    bufferedImage = cOp.filter(bufferedImage, null);
    
    FileOutputStream out = new FileOutputStream(resizedFile);
    
    JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
    JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(bufferedImage);
    param.setQuality(quality, true);
    encoder.setJPEGEncodeParam(param);
    encoder.encode(bufferedImage);
  }
}
