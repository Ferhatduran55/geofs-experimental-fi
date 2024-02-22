import { Toaster as ToastContainer } from "solid-toast";
import { Portal } from "solid-js/web";

export const Toaster = () => {
  return (
    <Portal mount={document.body}>
      <ToastContainer
        position="top-right"
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </Portal>
  );
};
