
// src/utils/uploadImage.ts
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  folderName: string // dynamic folder name
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderName, // e.g., 'products/electronics'
          public_id: fileName,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }
      )
      .end(fileBuffer);
  });
};
