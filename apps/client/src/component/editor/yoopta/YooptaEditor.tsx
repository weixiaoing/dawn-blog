import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor"
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list"
import Image from "@yoopta/image"
import Paragraph from "@yoopta/paragraph"
import parse from "@yoopta/exports"
import Embed from "@yoopta/embed"
import Link from "@yoopta/link"
import File from "@yoopta/file"
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists"
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks"
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings"
import Code from "@yoopta/code"
import Table from "@yoopta/table"

import { useCallback, useMemo, useRef, useState } from "react"
import { imgToGitCloud } from "../../../api/imageUpload"
import UploadItem from "../../upload/UploadItem"
const plugins = [
  Paragraph,
  Image.extend({
    options: {
      async onUpload(file) {
        const res = await imgToGitCloud(file)
        return {
          src: res,
          alt: file.name,
          sizes: {
            width: 500,
            height: 500,
          },
        }
      },
    },
  }),
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Code,
  NumberedList,
  BulletedList,
  TodoList,
  Embed,
  Link,
  File,
  Table,
]

const marks = [Bold, Italic, CodeMark, Underline, Strike, Highlight]

const TOOLS = {
  ActoinMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
}

export default function CustomEditor({
  editor,
  defaultValue,
  onChange,
}: {
  editor: YooEditor
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  const [value, setValue] = useState<YooptaContentValue>(() => {
    return parse.markdown.deserialize(editor, defaultValue || "")
  })
  const selectionRef = useRef(null)

  const onChangeHandler = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    onChange?.(parse.markdown.serialize(editor, value))
    setValue(value)
  }

  return (
    <div className="min-h-[500px] " ref={selectionRef}>
      <YooptaEditor
        width={"100%"}
        style={{ paddingBottom: "300px" }}
        editor={editor}
        placeholder="Type text.."
        value={value}
        onChange={onChangeHandler}
        marks={marks}
        selectionBoxRoot={selectionRef}
        autoFocus
        // custome
        tools={TOOLS}
        plugins={plugins}
      />
    </div>
  )
}
