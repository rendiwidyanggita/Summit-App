import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary jika API key tersedia di .env
if (process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Mengunggah buffer file ke Cloudinary.
 * @param fileBuffer Buffer dari file gambar.
 * @param filename Nama file opsional.
 * @param folder Folder tujuan di Cloudinary (opsional).
 * @returns Object berisi secure_url dari Cloudinary.
 */
export async function uploadToCloudinary(fileBuffer: Buffer, filename: string, folder: string = "summit-gear") {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename.replace(/\.[^/.]+$/, ""), // Hapus ekstensi
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed: no result"));
        resolve({ secure_url: result.secure_url });
      }
    );

    uploadStream.end(fileBuffer);
  });
}
