'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState, useEffect } from 'react';

interface CKEditorWrapperProps {
  initialData?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
}

export default function CKEditorWrapper({
  initialData = '',
  onChange,
  placeholder = 'Start typing your content...',
  height = '400px',
  readOnly = false
}: CKEditorWrapperProps) {
  const [editorData, setEditorData] = useState(initialData);

  useEffect(() => {
    setEditorData(initialData);
  }, [initialData]);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  const editorConfig = {
    placeholder: placeholder,
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    language: 'en'
  };

  return (
    <div className="ckeditor-wrapper" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={editorData}
        onChange={handleEditorChange}
        disabled={readOnly}
      />
      <style jsx>{`
        .ckeditor-wrapper .ck-editor__editable {
          min-height: ${height};
          max-height: 600px;
          overflow-y: auto;
        }
        .ckeditor-wrapper .ck-editor__editable_inline {
          border: none;
          padding: 1rem;
        }
        .ckeditor-wrapper .ck-toolbar {
          border-bottom: 1px solid #e2e8f0;
          border-radius: 8px 8px 0 0;
        }
        .ckeditor-wrapper .ck-content {
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
