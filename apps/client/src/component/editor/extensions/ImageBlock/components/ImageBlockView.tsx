import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import clsx from "clsx";
import { useCallback, useRef } from "react";

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node
  updateAttributes: (attrs: Record<string, string>) => void
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
  const { editor, getPos, node } = props as ImageBlockViewProps & {
    node: Node & {
      attrs: {
        src: string
      }
    }
  }
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const { src } = node.attrs

  const wrapperClassName = clsx(
    node.attrs.align === "left" ? "ml-0" : "ml-auto",
    node.attrs.align === "right" ? "mr-0" : "mr-auto",
    node.attrs.align === "center" && "mx-auto"
  )

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [getPos, editor.commands])

  return (
    <NodeViewWrapper>
      <div
        className={wrapperClassName}
        style={{ width: "50px" }}
        data-drag-handle
      >
        <div contentEditable={false} ref={imageWrapperRef}>
          {/* <span>img</span> */}
          <img className="block" src={src} alt="" onClick={onClick} />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default ImageBlockView;
