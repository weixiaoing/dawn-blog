import { useCurrentEditor } from "@tiptap/react";

import "./EditorMenu.css";
import SlashMenu from "./slashMenu";
export default function EditorMenu() {
  const editor = useCurrentEditor().editor;
  if (!editor) {
    return null;
  }
  return (
    <>
      {/* <BubbleMenu
        editor={null}
        className="shadow-md flex gap-1 py-1 px-2 rounded-xl bg-white BubbleMenu"
      >
        {" "}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
      </BubbleMenu> */}
      <SlashMenu />
    </>
  );
}
