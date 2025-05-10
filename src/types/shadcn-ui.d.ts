declare module "@shadcn/ui" {
  import { ReactNode } from "react";

  export interface DialogProps {
    children: ReactNode;
  }

  export const Dialog: React.FC<DialogProps>;

  export interface DialogTriggerProps {
    children: ReactNode;
  }

  export const DialogTrigger: React.FC<DialogTriggerProps>;

  export interface DialogContentProps {
    children: ReactNode;
  }

  export const DialogContent: React.FC<DialogContentProps>;
}
