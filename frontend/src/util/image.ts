export const generateBase64FromImage = (imageFile: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      // Check if the result is defined and of the correct type
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(imageFile);
  });
};