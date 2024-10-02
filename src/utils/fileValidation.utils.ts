export const validateFile = (file: File | null): string => {
  const validTypes = [
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/svg+xml',
    'image/jpg',
    'video/quicktime',
    'video/x-msvideo',
  ];

  const maxSize = 200 * 1024; // 200KB

  let error = '';

  if (file && !validTypes.includes(file.type)) {
    error =
      'Invalid file type. Only JPG, SVG, JPEG, GIF, PNG, MOV, and AVI are allowed.';
  } else if (file && file.size > maxSize) {
    error = 'File size exceeds the 200KB limit.';
  }

  return error;
};
