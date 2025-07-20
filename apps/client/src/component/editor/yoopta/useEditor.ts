import { createYooptaEditor } from "@yoopta/editor";
import { useCallback, useMemo, useState } from "react";
import { updatePost } from "../../../api/post";

type EditorStatusType = "loading" | "success" | "error"

export default function useEditor() {
    const editor = useMemo(() => createYooptaEditor(), [])
    const [status, setStatus] = useState<EditorStatusType>("success")

    const updateEditor = useCallback(async (id: string) => {
        setStatus("loading")
        const res = await updatePost(id, { content: editor.getMarkdown(editor.getEditorValue()) })
        if (res.code == 1)
            setStatus("success")
        else setStatus("success")
    }, [editor])

    return { editor, status, setStatus, updateEditor }
}