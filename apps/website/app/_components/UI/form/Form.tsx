import type {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";
import { forwardRef } from "react";
import type { FormContextType } from "./FormContext";

export const Form = forwardRef<
  FormContextType,
  PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
      showErrorMessage?: boolean;
    }
  >
>((props, ref) => {
  const { showErrorMessage = true, ...formprops } = props;
  // const fieldsAtom=use
  return <></>;
});
Form.displayName = "Form";
