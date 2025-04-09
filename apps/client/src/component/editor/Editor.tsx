import {
  enableKeyboardNavigation,
  Slash,
  SlashCmdProvider,
} from "@harshtalks/slash-tiptap";
import FileHandler from "@tiptap-pro/extension-file-handler";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorProvider, EditorProviderProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import { imgToGitCloud } from "../../api/imageUpload"
import "./code.css"
import EditorMenu from "./EditorMenu"
import ImageBlock from "./extensions/ImageBlock"
import "./index.css"
import suggestions from "./slashMenu/suggestions"
const lowlight = createLowlight(all)
const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Slash.configure({
    suggestion: {
      items: () => suggestions,
    },
  }),
  ImageBlock,
  Highlight,
  TaskItem,
  TaskList,
  Markdown,
  Image.configure({
    allowBase64: true,
  }),
  Placeholder.configure({
    placeholder: "Type '/' for commands",
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      files.forEach((file) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          currentEditor
            .chain()
            .setImageBlockAt({ pos, src: fileReader.result as string })
            .focus()
            .run()
        }
      })
    },
    onPaste: async (editor, files, pasteContent) => {
      files.forEach(async (file) => {
        if (pasteContent) {
          console.log(pasteContent)
          return false
        }
        try {
          const res = await imgToGitCloud(file)
          return editor
            .chain()
            .setImageBlockAt({ pos: editor.state.selection.anchor, src: res })
            .focus()
            .run()
        } catch (error) {
          console.log(error)
          return
        }
      })
    },
  }),
]
// const markdownoutpub=editor.storage.markdown.getMarkdown();
const Editor = (props: EditorProviderProps) => {

  return (
    <div className="container shadow-md p-2 relative flex flex-col flex-1 h-full overflow-hidden ">
      <SlashCmdProvider>
        <EditorProvider
          injectCSS={false}
          editorProps={{
            handleDOMEvents: {
              keydown: (_, v) => enableKeyboardNavigation(v),
            },
            attributes: {
              class: "m-h-full prose mx-auto max-w-full focus:outline-none  [&>*]:my-2",
            },
          }}
          autofocus
          extensions={extensions}
          {...props}
        >
          <EditorMenu />
        </EditorProvider>
      </SlashCmdProvider>
    </div>
  );
};
export default Editor;
