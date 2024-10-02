import React from 'react';

import { Label } from '@radix-ui/react-label';
import { Upload } from 'lucide-react';

const Dropzone: React.FC = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log(files[0]);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-secondary-foreground hover:border-primary hover:bg-background"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <Upload className="mb-2 size-8" />

          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF, DOCX, JPG, and PNG. Please choose files under 200KB for upload.
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </Label>
    </div>
  );
};

export default Dropzone;
