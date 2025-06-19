import { mergeAttributes, Range } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageBlockView } from "./components/ImageBlockView";
import { Image as BaseImage } from "@tiptap/extension-image";



declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attributes: { src: string }) => ReturnType;
      setImageBlockAt: (attributes: {
        src: string;
        pos: number | Range;
      }) => ReturnType;
      setImageBlockAlign: (align: "left" | "center" | "right") => ReturnType;
      setImageBlockWidth: (width: number) => ReturnType;
    };
  }
}

export const ImageBlock = BaseImage.extend({
  name: "imageBlock",
  group: "block",
  defining: true,
  isolating: true,
  draggable: true,
  addAttributes() {
    return {
      uploading: {
        default: false,
        parseHTML: element => element.getAttribute('data-uploading'),
        renderHTML: attributes => ({
          'data-uploading': attributes.uploading,
        }),
      },
      placeholder: {
        default: false,
        parseHTML: element => element.getAttribute('data-placeholder'),
        renderHTML: attributes => ({
          'data-placeholder': attributes.placeholder,
        }),
      },
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
        }),
      },
      height: {
        default: "300px",
        parseHTML: (element) => element.getAttribute("data-height"),
        renderHTML: (attributes) => ({
          "data-height": attributes.height,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageBlock:
        (attrs) =>
          ({ commands }) => {
            return commands.insertContent({
              type: "imageBlock",
              attrs: { src: attrs.src },
            });
          },

      setImageBlockAt:
        (attrs) =>
          ({ commands }) => {
            return commands.insertContentAt(attrs.pos, {
              type: "imageBlock",
              attrs: { src: attrs.src },
            });
          },

      setImageBlockAlign:
        (align) =>
          ({ commands }) =>
            commands.updateAttributes("imageBlock", { align }),

      setImageBlockWidth:
        (width) =>
          ({ commands }) =>
            commands.updateAttributes("imageBlock", {
              width: `${Math.max(0, Math.min(100, width))}%`,
            }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },
});

export default ImageBlock;
