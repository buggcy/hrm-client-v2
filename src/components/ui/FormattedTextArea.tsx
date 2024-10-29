import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
import './FormattedTextArea.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface FormattedTextAreaProps {
  value: string;
  onChange: (content: string) => void;
}

const FormattedTextArea: React.FC<FormattedTextAreaProps> = ({
  value,
  onChange,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (content: string) => {
    onChange(content);
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'list',
    'bullet',
    'bold',
    'italic',
    'underline',
    'align',
    'link',
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full">
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          direction: 'ltr',
          height: '150px',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'hsl(var(--border))',
        }}
      />
    </div>
  );
};

export default FormattedTextArea;
