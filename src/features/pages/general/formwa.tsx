"use client"; // Add this for Next.js App Router compatibility

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import Link from "@tiptap/extension-link";

interface FormWaProps {
  onChange: (html: string) => void;
  value: string;
  placeholder?: string;
}

export function FormWa({ onChange, value, placeholder = "Start typing..." }: FormWaProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          className: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          className: 'bg-blue-100 rounded px-1 py-0.5',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  function ToolbarButton({ 
    isActive, 
    onClick, 
    children 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`p-1.5 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="p-2 border-b border-gray-300 flex items-center space-x-2">
        <ToolbarButton 
          isActive={editor?.isActive('bold') || false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={editor?.isActive('italic') || false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={editor?.isActive('bulletList') || false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"></line>
            <line x1="9" y1="12" x2="20" y2="12"></line>
            <line x1="9" y1="18" x2="20" y2="18"></line>
            <circle cx="4" cy="6" r="2"></circle>
            <circle cx="4" cy="12" r="2"></circle>
            <circle cx="4" cy="18" r="2"></circle>
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={editor?.isActive('orderedList') || false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={editor?.isActive('code') || false}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </ToolbarButton>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-32 focus:outline-none"
      />
      
      <style jsx global>{`
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
  
  .ProseMirror {
    outline: none;
  }
  
  .ProseMirror ul {
    padding-left: 1.5em;
    list-style-type: disc;
  }
  
  .ProseMirror ol {
    padding-left: 1.5em;
    list-style-type: decimal;
  }
  
  .ProseMirror code {
    background-color: #f1f1f1;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
  
  /* Button styling for light blue buttons */
  .editor-toolbar button {
    background-color: #e6f2ff;
    border: 1px solid #cce6ff;
  }
  
  .editor-toolbar button:hover {
    background-color: #cce6ff;
  }
  
  .editor-toolbar button.is-active {
    background-color: #b3d9ff;
    border-color: #99ccff;
  }
`}</style>
    </div>
  );
}