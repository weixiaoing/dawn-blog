import { Suspense, useMemo } from "react";
import { HighLighterPrismCdn } from "../../CodeHighlighter/codeHighlighter";

interface CodeBlockProps {
  lang: string | undefined;
  text: string;
  attrs?: string;
}
export default function MCodeBlock(props: CodeBlockProps) {
  const { lang, text, attrs } = props;
  const node = useMemo(() => {
    switch (lang) {
      //todo deferent lang deferent components

      //default render codeblock
      default: {
        const nextProps = { ...props };
        nextProps.text = formatCode(text);
        return <HighLighterPrismCdn {...nextProps}></HighLighterPrismCdn>;
      }
    }
  }, [lang, text]);
  // return <code className="bg-gray-200 p-2 rounded-md">{node}</code>;
  return (
    <Suspense
    // fallback={node}
    >
      {node}
    </Suspense>
  );
}

const formatCode = (code: string) => {
  const lines = code.split("\n");

  let minIndent = Number.MAX_SAFE_INTEGER;
  lines.forEach((line) => {
    // 计算每一行的最小缩进
    //不计算空行
    if (line.trim().length > 0) {
      const leadingsSpaces = line.match(/^ */)?.[0].length;
      if (leadingsSpaces === undefined) return;
      minIndent = Math.min(minIndent, leadingsSpaces);
    }
  });
  if (minIndent === Number.MAX_SAFE_INTEGER) return code;
  const formattedLines = lines.map((line) => {
    //空行保留
    if (line.trim().length === 0) {
      return line;
    } else {
      return line.slice(Math.max(0, minIndent));
    }
  });
  return formattedLines.join("\n");
};
