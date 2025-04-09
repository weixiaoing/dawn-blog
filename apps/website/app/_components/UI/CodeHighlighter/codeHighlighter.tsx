"use client";
import clsx from "clsx";
import { FC, ReactEventHandler, useCallback, useRef } from "react";
import styles from "./codeHighlighter.module.css";
interface Props {
  lang?: string;
  text: string;
}
export const stopPropagation: ReactEventHandler<any> = (e) =>
  e.stopPropagation();
export const HighLighterPrismCdn: FC<Props> = (props) => {
  const { lang, text } = props;
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    //todo toast sucess
  }, [text]);
  const ref = useRef<HTMLElement>(null);
  // 是否使用高亮
  // useLoadHighlighter(ref)
  return (
    <div className={styles["code-wrap"]} onCopy={stopPropagation}>
      <pre
        className={clsx(styles["code-pre"], "line-numbers ", "relative")}
        data-start="1"
      >
        <span className={"absolute bottom-2 right-2 text-xs"} aria-hidden>
          {lang?.toUpperCase()}
        </span>
        <code
          id={styles["code"]}
          className={`language-${lang ?? "markup"}  !bg-transparent`}
          ref={ref}
        >
          {text}
        </code>
      </pre>
      <button className={styles["copy-tip"]} onClick={handleCopy} aria-hidden>
        <span className="text-white">Copy</span>
      </button>
    </div>
  );
};
