"use client";
import { useIsClient } from "../../../hooks/common/is-client";

export const ClientOnly = (props: any) => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <>{props.children}</>;
};
