import { DecoratorNode } from 'lexical';

export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __url; // Custom URL for linking

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__url, node.__key);
  }

  static importJSON(serializedNode) {
    const { src, altText, url } = serializedNode;
    return $createImageNode(src, altText, url);
  }

  exportJSON() {
    return {
      src: this.__src,
      altText: this.__altText,
      url: this.__url,
      type: 'image',
      version: 1,
    };
  }

  constructor(src, altText, url, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__url = url;
  }

  createDOM(config) {
    const span = document.createElement('span');
    span.className = 'editor-image-container my-4 block text-center max-w-full mx-auto relative group';
    
    // Create the image element
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.className = 'max-w-full h-auto rounded-xl mx-auto border border-border-muted shadow-sm';
    
    // If it has a URL, wrap it in an anchor or add a badge
    if (this.__url) {
      const a = document.createElement('a');
      a.href = this.__url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'cursor-pointer inline-block relative';
      a.appendChild(img);
      
      // Add a small badge indicating it's a product link
      const badge = document.createElement('div');
      badge.className = 'absolute top-2 right-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity';
      badge.innerText = 'Product Link';
      a.appendChild(badge);
      
      span.appendChild(a);
    } else {
      span.appendChild(img);
    }

    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    // Return null because we handle rendering in createDOM for simplicity,
    // though React components can be returned here for interactive nodes.
    return null;
  }
}

export function $createImageNode(src, altText, url) {
  return new ImageNode(src, altText, url);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
