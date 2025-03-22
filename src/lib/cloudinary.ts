export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('folder', 'vazzuniverse/thumbnail');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dazayhg7s/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload gagal');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw error;
  }
};
