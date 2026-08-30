/**
 * Compress image to target file size using canvas-based compression.
 * Iteratively reduces quality until target size is achieved.
 *
 * @param file - The image file to compress (JPEG or PNG)
 * @param targetSizeKB - Target size in KB (default: 100)
 * @param maxDimension - Max width/height in pixels (default: 1024)
 * @returns Promise<File> - Compressed image file
 */
export async function compressImageToTarget(
  file: File,
  targetSizeKB: number = 100,
  maxDimension: number = 1024,
): Promise<File> {
  const targetBytes = targetSizeKB * 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      // Scale down if image is too large
      const scale = Math.min(
        maxDimension / img.width,
        maxDimension / img.height,
        1,
      );

      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Determine format and MIME type
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const fileExtension = mimeType === "image/png" ? "png" : "jpg";

      // Start with medium quality and iteratively reduce
      let quality = 0.8;
      const minQuality = 0.1;
      const qualityStep = 0.1;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed"));
              return;
            }

            // Check if we've reached target size
            if (blob.size <= targetBytes || quality <= minQuality) {
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
              return;
            }

            // Reduce quality and try again
            quality = Math.max(quality - qualityStep, minQuality);
            tryCompress();
          },
          mimeType,
          quality,
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file before compression.
 * Checks MIME type and file size.
 *
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns { valid: boolean, error?: string }
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5,
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  // Check MIME type
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG and PNG files are allowed",
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}
