'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, ImageIcon, Link as LinkIcon, Video } from 'lucide-react';

interface TiptapEditorProps {
  content: Record<string, any> | string;
  onChange: (content: Record<string, any>) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-card w-full h-auto my-6',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-pearl-red underline hover:text-pearl-deep transition-colors',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-card my-6',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write the story...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL (Ideally from Media Library)');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt('YouTube Video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="border border-pearl-soft rounded-card bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="bg-warm-white border-b border-pearl-soft p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-pearl-light text-pearl-red font-bold' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        
        <div className="w-px h-6 bg-pearl-soft mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md transition-colors font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md transition-colors font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        
        <div className="w-px h-6 bg-pearl-soft mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        
        <div className="w-px h-6 bg-pearl-soft mx-1" />

        <button
          onClick={setLink}
          className={`p-2 rounded-md transition-colors ${editor.isActive('link') ? 'bg-pearl-light text-pearl-red' : 'text-muted-text hover:bg-white hover:text-dark-text'}`}
          type="button"
          title="Insert Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded-md text-muted-text hover:bg-white hover:text-dark-text transition-colors"
          type="button"
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>
        <button
          onClick={addYoutube}
          className="p-2 rounded-md text-muted-text hover:bg-white hover:text-dark-text transition-colors"
          type="button"
          title="Insert YouTube Video"
        >
          <Video size={18} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-white cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
