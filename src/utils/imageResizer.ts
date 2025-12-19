/**
 * Converts HEIC/HEIF file to JPEG
 * @param file - The HEIC/HEIF file to convert
 * @returns Promise<File> - Converted JPEG file
 */
async function convertHeicToJpeg(file: File): Promise<File> {
  // Dynamically import heic2any only on client side
  if (typeof window === 'undefined') {
    throw new Error('HEIC conversion is only available in the browser');
  }
  
  try {
    const convert = (await import('heic2any')).default;
    const convertedBlobs = await convert({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });
    
    // heic2any returns Blob | Blob[], take the first result if array
    const blob: Blob = Array.isArray(convertedBlobs) ? convertedBlobs[0] : convertedBlobs;
    
    if (!(blob instanceof Blob)) {
      throw new Error('Invalid conversion result');
    }
    
    // Create a new File from the blob
    const fileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], fileName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    throw new Error(`Failed to convert HEIC file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Resizes an image file to a maximum width and height while maintaining aspect ratio
 * @param file - The image file to resize
 * @param maxWidth - Maximum width in pixels (default: 800)
 * @param maxHeight - Maximum height in pixels (default: 800)
 * @param quality - JPEG quality 0-1 (default: 0.9)
 * @returns Promise<File> - Resized image file
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.9
): Promise<File> {
  // Check if file is HEIC/HEIF format
  const isHeic = file.type === 'image/heic' || 
                 file.type === 'image/heif' ||
                 /\.(heic|heif)$/i.test(file.name);
  
  // Convert HEIC to JPEG first
  let imageFile = file;
  if (isHeic) {
    try {
      imageFile = await convertHeicToJpeg(file);
    } catch (error) {
      throw new Error(`Error converting HEIC file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        // Check if resizing is needed
        if (width <= maxWidth && height <= maxHeight) {
          // No resizing needed, return converted file (or original if not HEIC)
          resolve(imageFile);
          return;
        }
        
        // Calculate aspect ratio
        const aspectRatio = width / height;
        
        // Resize maintaining aspect ratio
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            // Create new file with same name but ensure .jpg extension
            const fileName = imageFile.name.replace(/\.[^/.]+$/, '.jpg');
            const resizedFile = new File([blob], fileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(resizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
}

