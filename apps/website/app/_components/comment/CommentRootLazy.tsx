"use client";

import { ErrorBoundary } from "@/_components/common/ErrorBoundary";

import CommentRoot from "./CommentRoot";

const CommentRootLazy: typeof CommentRoot = (props) => {
  return (
    <ErrorBoundary>
      <CommentRoot {...props} />
    </ErrorBoundary>
  );
};
export default CommentRootLazy;
