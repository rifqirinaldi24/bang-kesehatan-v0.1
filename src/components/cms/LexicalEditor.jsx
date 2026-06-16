import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TRANSFORMERS, $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { ImageNode } from './ImageNode';
import LexicalToolbar from './LexicalToolbar';
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'mb-4 text-on-surface leading-relaxed',
  quote: 'border-l-4 border-primary-container pl-4 italic text-on-surface-variant my-4',
  heading: {
    h1: 'font-headline-lg text-headline-lg font-bold mt-8 mb-4 text-on-surface',
    h2: 'font-headline-md text-headline-md font-bold mt-6 mb-3 text-on-surface',
    h3: 'font-headline-sm text-headline-sm font-bold mt-4 mb-2 text-on-surface',
  },
  list: {
    ul: 'list-disc pl-6 mb-4 text-on-surface marker:text-primary',
    ol: 'list-decimal pl-6 mb-4 text-on-surface marker:text-primary',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  link: 'text-primary hover:underline cursor-pointer',
};

function Placeholder() {
  return <div className="absolute top-[64px] left-8 text-outline-variant pointer-events-none">Start writing the medical article here...</div>;
}

// Plugin to inject initial HTML or content if needed
function InitialContentPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        $convertFromMarkdownString(initialContent, TRANSFORMERS);
      });
    }
  }, [editor, initialContent]);
  return null;
}

export default function LexicalEditor({ initialContent, onChange }) {
  const initialConfig = {
    namespace: 'BangKesehatanEditor',
    theme,
    onError: (error) => console.error(error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      AutoLinkNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      ImageNode
    ]
  };

  return (
    <div className="relative border border-border-muted rounded-xl bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all overflow-hidden flex flex-col h-full min-h-[500px]">
      <LexicalComposer initialConfig={initialConfig}>
        <LexicalToolbar />
        <div className="relative flex-1 p-8 overflow-y-auto min-h-[400px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-full font-body-lg text-body-lg text-on-surface" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <InitialContentPlugin initialContent={initialContent} />
          {onChange && (
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const markdown = $convertToMarkdownString(TRANSFORMERS);
                  onChange(markdown);
                });
              }}
            />
          )}
        </div>
      </LexicalComposer>
    </div>
  );
}
