import { v2 as cloudinary } from "cloudinary";
import { requireUser } from "@/lib/server/authz";
import { badRequest, handleRouteError, ok } from "@/lib/server/http";
import { hasCloudinaryEnv } from "@/lib/server/env";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    if (!hasCloudinaryEnv()) {
      return badRequest({ message: "Cloudinary tidak dikonfigurasi. Hubungi administrator." });
    }

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (files.length === 0) {
      return badRequest({ message: "Tidak ada file yang diunggah." });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "summit-gear/profiles",
            resource_type: "image",
            transformation: { width: 400, height: 400, crop: "fill", gravity: "face" },
            format: "jpg",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!.secure_url);
          }
        );

        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return ok({ urls });
  } catch (error) {
    return handleRouteError(error);
  }
}
