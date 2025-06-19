import { AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import { BsCodeSlash, BsImageFill, BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs";

import { createSuggestionsItems } from "@harshtalks/slash-tiptap";
const suggestions = createSuggestionsItems([
  // 有序列表渲染
  {
    icon: <AiOutlineOrderedList />,
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  // 局部代码格式渲染
  {
    icon: <BsCodeSlash />,
    title: "Code",
    searchTerms: ["code"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCode().run()
    },
  },
  //代码块渲染
  {
    icon: <BiCodeBlock />,
    title: "CodeBlock",
    searchTerms: ["codeblock"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    icon: <BsTypeH1 />,
    title: "Heading 1",
    searchTerms: ["Heading 1"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run()
    },
  },
  {
    icon: <BsTypeH2 />,
    title: "Heading 2",
    searchTerms: ["Heading 2"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run()
    },
  },
  {
    icon: <BsTypeH3 />,
    title: "Heading 3",
    searchTerms: ["Heading 3"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run()
    },
  },
  {
    icon: <BsImageFill />,
    title: "Image",
    searchTerms: ["Image"],
    command: ({ editor, range }) => {
      const url = window.prompt("Enter the image URL")
      if (url)
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
    },
  },
])

export default suggestions;
