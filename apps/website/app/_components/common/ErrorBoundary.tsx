"use client";

import type { FC, PropsWithChildren } from "react";
import { ErrorBoundary as ErrorBoundaryLib } from "react-error-boundary";
import Button from "../UI/button";

const FallbackComponent = () => {
  return (
    <div className="flex w-full flex-col py-6 center">
      Something went wrong. Please contract to{" "}
      <a href="mailto:dawnot@foxmail.com">author</a>.
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload Page
      </Button>
    </div>
  );
};
export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundaryLib
      FallbackComponent={FallbackComponent}
      onError={(e) => {
        console.error(e);

        // TODO  sentry

        // captureException(e)
      }}
    >
      {children}
    </ErrorBoundaryLib>
  );
};
