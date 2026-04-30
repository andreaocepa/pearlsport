'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';

interface ArticleBodyProps {
  content: Record<string, any>;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
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
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-pearl-soft my-6 text-sm',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-warm-white border border-pearl-soft p-2 font-bold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-pearl-soft p-2',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-card my-6',
        },
      }),
    ],
    content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-dark-text prose-p:text-dark-text prose-a:text-pearl-red hover:prose-a:text-pearl-deep prose-img:rounded-card">
      <EditorContent editor={editor} />
    </div>
  );
}
