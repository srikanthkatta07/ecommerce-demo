export async function uploadImageToS3(productId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/products/${productId}/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return await response.text(); // The backend returns the image URL
}
