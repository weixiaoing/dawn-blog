import UnderLineLink from "@/_components/UI/UnderLineLink/index";
import { compiler, RuleType, type MarkdownToJSX } from "markdown-to-jsx";
import { PropsWithChildren, Suspense, useMemo } from "react";
import MCodeBlock from "./renderers/MCodeBlock";
// import mdcontent from "./test.md?raw";
export interface MdProps {
  value?: string;

  // style?: React.CSSProperties
  // readonly renderers?: Record<string, Partial<MarkdownToJSX.Rule>>
  // wrapperProps?: React.DetailedHTMLProps<
  //   React.HTMLAttributes<HTMLDivElement>,
  //   HTMLDivElement
  // >
  // codeBlockFully?: boolean
  // className?: string
  // as?: React.ElementType

  // allowsScript?: boolean

  // removeWrapper?: boolean
}
export const Markdown: React.FC<
  MdProps & MarkdownToJSX.Options & PropsWithChildren
> = (props) => {
  let value = "";
  const node = useMemo(() => {
    const mdContent = props.children || value;
    if (!mdContent || typeof mdContent !== "string") return null;
    const mdElement = compiler(mdContent, {
      wrapper: null,
      overrides: {},
      renderRule(next, node, renderChildren, state) {
        switch (node.type) {
          case RuleType.codeBlock:
            return (
              <MCodeBlock
                key={state.key}
                text={node.text}
                lang={node.lang}
              ></MCodeBlock>
            );

          case RuleType.codeInline:
            return (
              <code
                key={state?.key}
                className="rounded not-prose bg-zinc-200 px-2 font-mono dark:bg-neutral-800"
              >
                {node.text}
              </code>
            );
          case RuleType.link: {
            return (
              <UnderLineLink
                target="_blank"
                className="underline"
                key={state.key}
                href={node.target}
              >
                {renderChildren(node.children, state)}
              </UnderLineLink>
            );
          }
          default:
            return next();
        }
      },
    });
    return mdElement;
  }, [value]);
  return (
    <Suspense>
      <div id="markdown" className=" ">
        {node}
      </div>
    </Suspense>
  );
};
