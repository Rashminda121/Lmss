declare module "react-quill" {
  import { ComponentType } from "react";

  interface ReactQuillProps {
    value?: string;
    onChange?: (value: string) => void;
    theme?: string;
    // Add other props you need here
  }

  const ReactQuill: ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
