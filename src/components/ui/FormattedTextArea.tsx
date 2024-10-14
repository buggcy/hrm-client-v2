import React, { useRef } from 'react';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import './FormattedTextArea.css';

interface FormattedTextAreaProps {
  value: string;
  onChange: (content: string) => void;
}

const FormattedTextArea: React.FC<FormattedTextAreaProps> = ({
  value,
  onChange,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const handleChange = (content: string) => {
    onChange(content); // Pass the content to the parent component
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

  return (
    <div className="h-full">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
