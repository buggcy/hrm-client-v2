export const downloadFile = (fileBlob: Blob, fileName: string): void => {
  const fileURL = window.URL.createObjectURL(fileBlob);

  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(fileURL);
};
