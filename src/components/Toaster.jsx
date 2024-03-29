import { Toaster } from "solid-sonner";
import { Portal } from "solid-js/web";

import "@styles/sonner.css";

export default () => {
  return (
    <>
      <Portal mount={document.body}>
        <Toaster position="top-right" gap={8} expand={false} richColors />
      </Portal>
    </>
  );
};
