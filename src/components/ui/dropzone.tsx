import React, { ChangeEvent, useState } from 'react';

import { Input } from '@/components/ui/input';

import { cn } from '@/utils';

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onError'
  > {
  onChange: (files: FileList | null) => void;
  onError?: (message: string) => void;
}

const hasFileWithUnacceptedType = (files: FileList, accept?: string) => {
  if (!accept) return true;

  const acceptTypes = accept
    .split(',')
    .map(type => type.trim())
    .filter(Boolean);
  const acceptGeneralTypePrefixes = acceptTypes
    .filter(type => type.endsWith('/*'))
    .map(type => type.replace('/*', ''));

  return Array.from(files).some(
    file =>
      acceptTypes.includes(file.type) ||
      acceptGeneralTypePrefixes.some(prefix => file.type.startsWith(prefix)),
  );
};

export const Dropzone = React.forwardRef<HTMLInputElement, DropzoneProps>(
  ({ className, onChange, onError, children, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!props.multiple && e.dataTransfer.files.length > 1)
        return onError?.('Only one file is allowed');

      if (!hasFileWithUnacceptedType(e.dataTransfer.files, props.accept))
        return onError?.('Invalid file type');

      onChange(e.dataTransfer.files);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.files);
    };

    return (
      <div
        className={cn(
          'border border-transparent p-4',
          {
            'rounded-md border-dashed border-primary': isDragging,
          },
          className,
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <Input
          ref={ref}
          type="file"
          tabIndex={-1}
          className="mx-auto size-0 p-0 opacity-0"
          onChange={handleChange}
          {...props}
        />
        {children}
      </div>
    );
  },
);

Dropzone.displayName = 'Dropzone';
