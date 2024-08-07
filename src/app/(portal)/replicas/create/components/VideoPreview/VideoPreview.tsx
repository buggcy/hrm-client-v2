import React, { useMemo, useState } from 'react';

import { AlertTriangle, Download, RotateCw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const requirements = [
  { name: 'clearVoice', label: 'Clear voice without background noise' },
  { name: 'noBlocking', label: 'No hands or accessories blocking your face' },
  { name: 'headFocus', label: 'Head and upper body in clear focus' },
  {
    name: 'clothesNotBlending',
    label: 'Clothes not blending with background',
  },
];

export const VideoPreview: React.FC<{
  url?: string;
  file?: File | null;
  checkTitle: string;
  onDelete: () => void;
  onConfirm: () => void;
  onDownload?: () => void;
}> = ({ url, file, checkTitle, onDelete, onConfirm, onDownload }) => {
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    clearVoice: false,
    headFocus: false,
    noBlocking: false,
    clothesNotBlending: false,
  });
  const [error, setError] = useState(false);

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setCheckboxes({
      clearVoice: newCheckAll,
      headFocus: newCheckAll,
      noBlocking: newCheckAll,
      clothesNotBlending: newCheckAll,
    });
  };

  const handleCheckboxChange = (name: keyof typeof checkboxes) => {
    setCheckboxes(prev => {
      const newCheckboxes = { ...prev, [name]: !prev[name] };
      const allChecked = Object.values(newCheckboxes).every(Boolean);
      setCheckAll(allChecked);
      return newCheckboxes;
    });
  };

  const checkAllChecked = Object.values(checkboxes).every(Boolean);

  const videoUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : url;
  }, [file, url]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative aspect-video max-w-[35.25rem] overflow-hidden rounded-md border">
        <Button
          className="absolute right-2 top-2 z-10 size-8"
          variant="outline"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="size-4 text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
        {onDownload && (
          <Button
            className="absolute right-12 top-2 z-10 size-8"
            variant="outline"
            size="icon"
            onClick={onDownload}
          >
            <Download className="size-4" />
            <span className="sr-only">Download</span>
          </Button>
        )}

        {!error ? (
          videoUrl && (
            <video
              src={videoUrl}
              controls
              className="aspect-video object-contain"
              onError={() => {
                setError(true);
              }}
            />
          )
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-secondary">
            <span>
              <AlertTriangle className="size-8 text-destructive" />
            </span>
            <p className="text-center text-lg font-semibold text-destructive">
              Error loading video, make sure that the URL is accessible for
              download
            </p>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl rounded-md bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">{checkTitle}</h3>
          <div className="flex items-center">
            <Checkbox
              id="check-all"
              checked={checkAll}
              onCheckedChange={handleCheckAll}
            />
            <label htmlFor="check-all" className="ml-2 text-sm font-medium">
              Check all
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {requirements.map(({ name, label }) => (
            <div key={name} className="flex items-center">
              <Checkbox
                id={name}
                checked={checkboxes[name as keyof typeof checkboxes]}
                onCheckedChange={() =>
                  handleCheckboxChange(name as keyof typeof checkboxes)
                }
              />
              <label htmlFor={name} className="ml-2 text-sm font-medium">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onDelete}>
          <RotateCw className="size-4" /> Record Again
        </Button>
        <Button disabled={!checkAllChecked} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
