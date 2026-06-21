import { promises as fs } from "fs";
import path from "path";

import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { uploadToCloudinary } from "@/lib/server/upload-service";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files provided" }), { status: 400 });
    }

    const isCloudinaryConfigured = Boolean(process.env.CLOUDINARY_API_KEY);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      if (isCloudinaryConfigured) {
        // Upload ke Cloudinary
        const result = await uploadToCloudinary(buffer, filename);
        uploadedUrls.push(result.secure_url);
      } else {
        // Fallback: Upload ke penyimpanan lokal (public/uploads)
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        
        uploadedUrls.push(`/uploads/${filename}`);
      }
    }

    return ok({ urls: uploadedUrls });
  } catch (error) {
    return handleRouteError(error);
  }
}
