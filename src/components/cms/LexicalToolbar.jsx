import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND, 
  UNDO_COMMAND, 
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $insertNodes
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createImageNode } from './ImageNode';

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:', 'https://');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertImage = () => {
    const src = prompt('Enter Image URL:', 'https://');
    if (src) {
      const isProduct = confirm('Is this a product image? (Click OK to add product link)');
      let linkUrl = null;
      if (isProduct) {
        linkUrl = prompt('Enter Product Link URL:', 'https://');
      }
      editor.update(() => {
        const imageNode = $createImageNode(src, 'Article Image', linkUrl);
        $insertNodes([imageNode]);
      });
    }
  };

  return (
    <div className="bg-surface-container-lowest border-b border-border-muted p-2 flex flex-wrap gap-1 items-center sticky top-0 z-20">
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(UNDO_COMMAND, undefined); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Undo"
      >
        <span className="material-symbols-outlined text-[18px]">undo</span>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(REDO_COMMAND, undefined); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Redo"
      >
        <span className="material-symbols-outlined text-[18px]">redo</span>
      </button>
      
      <div className="w-px h-6 bg-border-muted mx-2"></div>

      {/* Headings */}
      <button 
        onClick={(e) => { e.preventDefault(); formatHeading('h1'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer font-bold text-sm transition-colors"
        title="Heading 1"
      >
        H1
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); formatHeading('h2'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer font-bold text-sm transition-colors"
        title="Heading 2"
      >
        H2
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); formatHeading('h3'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer font-bold text-sm transition-colors"
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-border-muted mx-2"></div>
      
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Bold"
      >
        <span className="material-symbols-outlined text-[18px]">format_bold</span>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Italic"
      >
        <span className="material-symbols-outlined text-[18px]">format_italic</span>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Underline"
      >
        <span className="material-symbols-outlined text-[18px]">format_underlined</span>
      </button>
      
      <div className="w-px h-6 bg-border-muted mx-2"></div>
      
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Align Left"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_left</span>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Align Center"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_center</span>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant cursor-pointer transition-colors"
        title="Align Right"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_right</span>
      </button>

      <div className="w-px h-6 bg-border-muted mx-2"></div>

      {/* Insert Link */}
      <button 
        onClick={(e) => { e.preventDefault(); insertLink(); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-primary cursor-pointer transition-colors"
        title="Insert Link"
      >
        <span className="material-symbols-outlined text-[18px]">link</span>
      </button>

      {/* Insert Image */}
      <button 
        onClick={(e) => { e.preventDefault(); insertImage(); }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low text-primary cursor-pointer transition-colors"
        title="Insert Image (Product Link)"
      >
        <span className="material-symbols-outlined text-[18px]">image</span>
      </button>

    </div>
  );
}
