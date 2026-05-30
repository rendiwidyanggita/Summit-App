"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-secondary">
        <Image src={selectedImage} alt={alt} fill priority className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={cn("relative aspect-square overflow-hidden rounded-md border bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selectedImage === image && "border-primary")}
            onClick={() => setSelectedImage(image)}
            aria-label={`Lihat gambar produk ${index + 1}`}
          >
            <Image src={image} alt={`${alt} ${index + 1}`} fill className="object-cover" sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}
