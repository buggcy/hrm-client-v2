export const validateFile = (file: File | null): string => {
  const validTypes = [
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/svg+xml',
    'image/jpg',
    'video/quicktime',
    'video/x-msvideo',
    'application/pdf',
    'application/msword',
  ];

  const maxSize = 800 * 1024;

  let error = '';

  if (file && !validTypes.includes(file.type)) {
    error =
      'Invalid file type. Only JPG, SVG, JPEG, GIF, PNG, MOV, AVI, PDF and DOC are allowed.';
  } else if (file && file.size > maxSize) {
    error = 'File size exceeds the 800KB limit.';
  }

  return error;
};
