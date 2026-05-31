// Devolve o URL correcto independentemente de ser ficheiro local ou Cloudinary
export const getFileUrl = (fileRef: string | null | undefined): string | null => {
    if (!fileRef) return null;
    if (fileRef.startsWith("http")) return fileRef; // Cloudinary URL
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileRef}`; // local
};
