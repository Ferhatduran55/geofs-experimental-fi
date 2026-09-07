import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

class ModalManagerImpl {
  public isOpenSignal;
  private setIsOpen;
  public propsSignal;
  private setProps;

  constructor() {
    const [isOpen, setIsOpen] = createSignal(false);
    const [props, setProps] = createSignal<ModalProps | null>(null);

    this.isOpenSignal = isOpen;
    this.setIsOpen = setIsOpen;
    this.propsSignal = props;
    this.setProps = setProps;
  }

  show(props: ModalProps) {
    const finalProps = {
      type: "default" as ModalType,
      position: "center" as ModalPosition,
      overlay: true,
      width: "max-w-4xl",
      ...props,
    };

    this.setProps(finalProps);
    this.setIsOpen(true);

    if (finalProps.duration && finalProps.duration > 0) {
      setTimeout(() => {
        if (this.propsSignal() === finalProps) {
          this.hide();
        }
      }, finalProps.duration);
    }
  }

  hide() {
    this.setIsOpen(false);
    setTimeout(() => this.setProps(null), 300);
  }

  destroy() {
    this.hide();
  }
}

const ModalContainer = (p: { isOpen: boolean; props: ModalProps | null; onClose: () => void }) => {
  onMount(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && p.isOpen && p.props?.overlay) {
        p.onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    onCleanup(() => document.removeEventListener("keydown", handleEscape));
  });

  return (
    <Show when={p.props}>
      {(propsData) => {
        const props = propsData();

        const getTypeClasses = () => {
          switch (props.type) {
            case "success":
              return "border-emerald-500/50 bg-gray-900/95 text-emerald-100";
            case "error":
              return "border-rose-500/50 bg-gray-900/95 text-rose-100";
            case "warning":
              return "border-amber-500/50 bg-gray-900/95 text-amber-100";
            case "info":
              return "border-blue-500/50 bg-gray-900/95 text-blue-100";
            default:
              return "border-gray-700/80 bg-gray-900/95 text-gray-100";
          }
        };

        const getWidthClasses = () => {
          if (props.width === "full" || props.width === "max-w-5xl") {
            return "w-[94vw] max-w-5xl max-h-[88vh] h-[88vh]";
          } else if (props.width === "max-w-4xl") {
            return "w-[90vw] max-w-4xl max-h-[85vh]";
          } else if (props.width === "max-w-2xl") {
            return "w-[90vw] max-w-2xl max-h-[85vh]";
          }
          return `${props.width || "max-w-lg"} w-full max-h-[85vh]`;
        };

        const getPositionClasses = () => {
          switch (props.position) {
            case "top":
              return "items-start pt-16 justify-center";
            case "bottom":
              return "items-end pb-16 justify-center";
            case "top-right":
              return "items-start pt-16 justify-end pr-8";
            case "bottom-right":
              return "items-end pb-16 justify-end pr-8";
            case "center":
            default:
              return "items-center justify-center";
          }
        };

        const getButtonStyle = (style?: string) => {
          switch (style) {
            case "primary":
              return "bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow";
            case "danger":
              return "bg-rose-600 hover:bg-rose-500 text-white border-transparent shadow";
            case "ghost":
              return "bg-transparent hover:bg-gray-800 text-gray-300 border-transparent";
            case "secondary":
            default:
              return "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700";
          }
        };

        return (
          <div
            class={`fixed inset-0 flex ${getPositionClasses()} z-[100000] p-4 pointer-events-none transition-opacity duration-300 ${
              p.isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Overlay */}
            <Show when={props.overlay}>
              <div
                class="fixed inset-0 bg-black/75 backdrop-blur-md pointer-events-auto transition-opacity"
                onClick={p.onClose}
              />
            </Show>

            {/* Modal Dialog */}
            <div
              class={`relative flex flex-col pointer-events-auto backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 ${getWidthClasses()} ${getTypeClasses()} ${
                p.isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
              }`}
            >
              {/* Header */}
              <Show when={props.title || props.icon}>
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/80">
                  <div class="flex items-center gap-3">
                    <Show when={props.icon}>
                      <span class="text-2xl" innerHTML={props.icon} />
                    </Show>
                    <Show when={props.title}>
                      <h3 class="text-lg font-bold text-white tracking-wide">{props.title}</h3>
                    </Show>
                  </div>
                  <button
                    type="button"
                    onClick={p.onClose}
                    class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </Show>

              {/* Content */}
              <div class="px-6 py-5 overflow-y-auto flex-1 font-sans">
                <div innerHTML={typeof props.content === "string" ? props.content : ""} />
              </div>

              {/* Buttons */}
              <Show when={props.buttons && props.buttons.length > 0}>
                <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-950/80 border-t border-gray-800">
                  {props.buttons?.map((btn) => (
                    <button
                      type="button"
                      onClick={() => {
                        btn.onClick();
                        p.onClose();
                      }}
                      class={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${getButtonStyle(
                        btn.style
                      )}`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              </Show>

              {/* Default Close Button if no buttons and overlay */}
              <Show when={props.overlay && (!props.buttons || props.buttons.length === 0)}>
                <div class="flex items-center justify-end px-6 py-4 bg-gray-950/80 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={p.onClose}
                    class={`px-6 py-2 rounded-xl text-xs font-semibold transition-colors border ${getButtonStyle(
                      "primary"
                    )}`}
                  >
                    Dismiss
                  </button>
                </div>
              </Show>
            </div>
          </div>
        );
      }}
    </Show>
  );
};

export const Modal = new ModalManagerImpl();

export const ModalUI = () => {
  return (
    <Portal mount={document.body}>
      <ModalContainer
        isOpen={Modal.isOpenSignal()}
        props={Modal.propsSignal()}
        onClose={() => Modal.hide()}
      />
    </Portal>
  );
};

export default Modal;
