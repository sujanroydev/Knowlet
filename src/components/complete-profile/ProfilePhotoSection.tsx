import { useState } from "react";
import { toast } from "sonner";

interface ProfilePhotoSectionProps {
  picture: string;
  username: string;
  onChange: (url: string) => void;
}

function compressWithCanvas(
  file: File,
  quality = 0.7,
  maxSize = 512,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
}

export default function ProfilePhotoSection({
  picture,
  username,
  onChange,
}: ProfilePhotoSectionProps) {
  const [uploading, setUploading] = useState(false);

  const upload = async (originalImage: File | undefined) => {
    try {
      if (!originalImage) {
        toast.info("Select an image first");
        return;
      }

      if (!originalImage.type.startsWith("image/jpeg")) {
        alert("Only jpg allowed");
        return;
      }

      if (originalImage.size > 5 * 1024 * 1024) {
        alert("Image too large");
        return;
      }

      setUploading(true);
      const compressedImage = await compressWithCanvas(originalImage);

      const fileName = `${username.replaceAll("@", "").toLowerCase()}.jpg`;
      const filePath = `users/${fileName}`;

      const formData = new FormData();
      formData.append("image", compressedImage);
      formData.append("file-path", filePath);

      const res = await fetch("api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const { data, error } = await res.json();
      setUploading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      console.log(data.imageUrl);
    } catch (error) {
      toast.error("Failed to Upload");
    }
  };

  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Profile Picture</h2>

      <div className="flex items-center gap-4">
        <img
          src={picture || "/images/demo_pp.jpg"}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover"
        />

        <input
          onChange={(e) => upload(e.target.files?.[0])}
          type="file"
          accept="image/jpeg"
        />
      </div>
    </section>
  );
}
