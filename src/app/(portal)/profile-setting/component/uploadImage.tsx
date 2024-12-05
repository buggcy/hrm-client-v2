import React, { useRef, useState } from 'react';

import { UploadCloud } from 'lucide-react';
import AvatarEditor from 'react-avatar-editor';
import { Accept, useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  initialAvatar: string;
  onSave: (image: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ initialAvatar, onSave }) => {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const editorRef = useRef<AvatarEditor | null>(null);
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null as string | null,
    zoom: 1,
    updatedImg: initialAvatar,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPicture(prev => ({ ...prev, zoom: parseFloat(event.target.value) }));
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const canvasScaled = editorRef.current.getImageScaledToCanvas();
    const croppedImg: string = canvasScaled.toDataURL();

    try {
      const response = await fetch(croppedImg);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      const file = new File([blob], 'avatar.png', { type: 'image/png' });

      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        onSave(fileContent);
      };
      reader.onerror = err => {
        console.error('Error reading file:', err);
      };
      reader.readAsDataURL(file);
      setPicture(prev => ({
        ...prev,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg,
      }));
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPicture(prev => ({
      ...prev,
      img: URL.createObjectURL(file),
      cropperOpen: true,
    }));
    setUploadedFiles(prev => [...prev, file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] } as Accept,
  });

  return (
    <div>
      {uploadedFiles.length === 0 ? (
        <div {...getRootProps()} className="outline-none">
          <Input {...getInputProps()} />
          <div className="flex cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <UploadCloud size={20} />
            <p className="ml-2">
              {isDragActive
                ? 'Drop the files here...'
                : 'Click or drag  image to upload'}
            </p>
          </div>
        </div>
      ) : null}

      {picture.cropperOpen && (
        <div>
          <AvatarEditor
            ref={editorRef}
            image={picture.img!}
            width={200}
            height={200}
            border={50}
            color={[255, 255, 255, 0.6]}
            scale={picture.zoom}
          />
          <Input
            type="range"
            className="mt-4"
            min={1}
            max={10}
            step={0.1}
            value={picture.zoom}
            onChange={handleSliderChange}
            aria-label="Zoom level"
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
