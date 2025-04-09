import { AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import { BsCodeSlash, BsImageFill, BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs";

import { createSuggestionsItems } from "@harshtalks/slash-tiptap";
const suggestions = createSuggestionsItems([
  // {
  //   title: "Text",
  //   searchTerms: ["paragraph"],
  //   command: ({ editor, range }) => {
  //     editor
  //       .chain()
  //       .focus()
  //       .deleteRange(range)
  //       .toggleNode("paragraph", "paragraph")
  //       .run();
  //   },
  // },
  {
    icon: <AiOutlineOrderedList />,
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    icon: <BsCodeSlash />,
    title: "Code",
    searchTerms: ["code"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCode().run();
    },
  },
  {
    icon: <BiCodeBlock />,
    title: "CodeBlock",
    searchTerms: ["codeblock"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
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
        .run();
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
        .run();
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
        .run();
    },
  },
  {
    icon: <BsImageFill />,
    title: "Image",
    searchTerms: ["Image"],
    command: ({ editor, range }) => {
      const url = window.prompt("Enter the image URL");
      if (url)
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    },
  },
]);

export default suggestions;
