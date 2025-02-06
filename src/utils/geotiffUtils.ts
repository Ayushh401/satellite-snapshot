import * as GeoTIFF from 'geotiff';

export interface GeoTIFFMetadata {
  width: number;
  height: number;
  tileWidth?: number;
  tileHeight?: number;
  samplesPerPixel: number;
}

export const loadGeoTIFF = async (url: string): Promise<GeoTIFF.GeoTIFF> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await GeoTIFF.fromArrayBuffer(arrayBuffer);
  } catch (error) {
    console.error('Error loading GeoTIFF:', error);
    throw error;
  }
};

export const getGeoTIFFMetadata = async (tiff: GeoTIFF.GeoTIFF): Promise<GeoTIFFMetadata> => {
  const image = await tiff.getImage();
  return {
    width: image.getWidth(),
    height: image.getHeight(),
    tileWidth: image.getTileWidth(),
    tileHeight: image.getTileHeight(),
    samplesPerPixel: image.getSamplesPerPixel(),
  };
};

export const createImageFromGeoTIFF = async (tiff: GeoTIFF.GeoTIFF): Promise<HTMLCanvasElement> => {
  const image = await tiff.getImage();
  const data = await image.readRasters();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = image.getWidth();
  canvas.height = image.getHeight();
  
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  
  // Check if data[0] is a TypedArray
  const rasterData = data[0];
  if (!ArrayBuffer.isView(rasterData)) {
    throw new Error('Invalid raster data format');
  }
  
  // Now TypeScript knows rasterData is a TypedArray
  for (let i = 0; i < rasterData.length; i++) {
    const value = rasterData[i];
    const index = i * 4;
    imageData.data[index] = value;     // R
    imageData.data[index + 1] = value; // G
    imageData.data[index + 2] = value; // B
    imageData.data[index + 3] = 255;   // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};