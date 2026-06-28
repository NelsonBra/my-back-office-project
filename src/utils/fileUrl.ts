// Returns the correct URL regardless of whether it's a local file or Cloudinary
export const getFileUrl = (fileRef: string | null | undefined): string | null => {
    if (!fileRef) return null;
    if (fileRef.startsWith("http")) return fileRef; // Cloudinary or absolute URL

    // Decode in case the stored value has URL-encoded characters (e.g. "uploads%2Ffile.pdf")
    let decoded: string;
    try {
        decoded = decodeURIComponent(fileRef);
    } catch {
        decoded = fileRef;
    }

    // Strip "uploads/" prefix if already present to avoid "/uploads/uploads/..."
    const filename = decoded.startsWith("uploads/")
        ? decoded.slice("uploads/".length)
        : decoded;

    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${filename}`;
};
