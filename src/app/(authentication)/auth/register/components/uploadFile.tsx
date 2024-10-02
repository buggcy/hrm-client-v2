import React from 'react';

import { Label } from '@radix-ui/react-label';
import { Eye, Upload, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { MainFormData } from './VerifyCodeForm';

const Dropzone: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<MainFormData>();

  const addDoc = watch('educationalDocument.Additional_Documents');
  const fileErrors = errors.educationalDocument?.Additional_Documents;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setValue('educationalDocument.Additional_Documents', [
        ...addDoc,
        ...Array.from(files),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (typeof addDoc[index] === 'string') {
      setValue('educationalDocument.deletedAdditionalDocuments', [
        ...(watch('educationalDocument.deletedAdditionalDocuments') || []),
        addDoc[index],
      ]);
    }

    setValue(
      'educationalDocument.Additional_Documents',
      addDoc.filter((_: string | File, i: number) => i !== index),
    );
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📁';
    }
  };

  const getFileNameFromUrl = (url: string) => {
    const fileName = url.split('/').pop();
    return fileName ? decodeURIComponent(fileName) : 'Unknown File';
  };

  const getPreviewUrl = (fileOrUrl: File | string | null) => {
    if (fileOrUrl instanceof File) {
      return URL.createObjectURL(fileOrUrl);
    }
    return typeof fileOrUrl === 'string' ? fileOrUrl : '';
  };

  return (
    <div className="w-full">
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
              PDF, DOCX, JPG, and PNG. Please choose files under 200KB for
              upload.
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/jpg, application/pdf"
            multiple
          />
        </Label>
      </div>

      {addDoc && addDoc.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Uploaded Files</h3>
          <ul className="space-y-2">
            {addDoc.map((file: File | string, index: number) => (
              <React.Fragment key={index}>
                <li className="rounded-md bg-gray-50 p-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-gray-800">
                      <p>
                        {file instanceof File
                          ? getFileIcon(file.name)
                          : getFileIcon(getFileNameFromUrl(file))}{' '}
                        {file instanceof File
                          ? file.name
                          : getFileNameFromUrl(file)}{' '}
                      </p>
                      <a
                        href={getPreviewUrl(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 hover:text-primary"
                      >
                        <Eye className="my-auto size-4" />
                      </a>
                    </span>
                    <Button
                      variant="destructive-inverted"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      type="button"
                      className="my-auto ml-2"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </li>
                {fileErrors && fileErrors[index] && (
                  <p className="text-sm text-red-500">
                    {fileErrors[index].message}
                  </p>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
