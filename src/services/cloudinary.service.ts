import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  private cloudinary: typeof cloudinary;

  constructor() {
    // Configure Cloudinary from CLOUDINARY_URL env var
    // Format: cloudinary://api_key:api_secret@cloud_name
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl) {
      try {
        const urlParts = cloudinaryUrl.replace('cloudinary://', '').split('@');
        const credentials = urlParts[0].split(':');
        cloudinary.config({
          cloud_name: urlParts[1],
          api_key: credentials[0],
          api_secret: credentials[1],
        });
      } catch (configError) {
        console.error('Cloudinary configuration error:', configError);
        throw new Error('Failed to configure Cloudinary from CLOUDINARY_URL');
      }
    } else {
      // Fallback to individual env vars if CLOUDINARY_URL is not set
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });
    }
    this.cloudinary = cloudinary;
  }

  private sanitizeFolderName(folderName: string): string {
    let sanitized = folderName.replace(/[^a-zA-Z0-9\-_\/]/g, '_');
    sanitized = sanitized.replace(/_+/g, '_');
    sanitized = sanitized.trim().replace(/^_+|_+$/g, '');
    return sanitized;
  }

  async singleUpload(file: File, options: { folder?: string; [key: string]: any }): Promise<string> {
    if (options.folder) {
      options.folder = this.sanitizeFolderName(options.folder);
      if (process.env.APP_ENV !== 'prod') {
        options.folder = `test/${options.folder}`;
      }
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(new Error(`File upload failed: ${error.message}`));
            } else {
              resolve(result!.secure_url);
            }
          }
        );

        uploadStream.end(buffer);
      });
    } catch (error: any) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async multiUpload(files: File[], options: { folder?: string; [key: string]: any }): Promise<string[]> {
    if (options.folder) {
      if (process.env.APP_ENV !== 'prod') {
        options.folder = `test/${options.folder}`;
      }
    }

    const results: string[] = [];

    for (const file of files) {
      try {
        const url = await this.singleUpload(file, options);
        results.push(url);
      } catch (error: any) {
        throw new Error(`File upload failed: ${error.message}`);
      }
    }

    return results;
  }
}

