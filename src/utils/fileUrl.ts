// Returns the correct URL regardless of whether it's a local file or Cloudinary
export const getFileUrl = (fileRef: string | null | undefined): string | null => {
    if (!fileRef) return null;
    if (fileRef.startsWith("http")) return fileRef; // Cloudinary or absolute URL
    // Avoid duplicating the "uploads/" prefix if it's already in the stored path
    const path = fileRef.startsWith("uploads/") ? fileRef : `uploads/${fileRef}`;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
};
