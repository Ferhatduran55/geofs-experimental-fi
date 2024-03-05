import { Toaster } from "solid-toast";
import { Portal } from "solid-js/web";

export default () => {
  return (
    <>
      <Portal mount={document.body}>
        <Toaster
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
    </>
  );
};
