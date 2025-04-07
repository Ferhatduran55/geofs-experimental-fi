import PlusIcon from "../assets/icons/Plus";
import MinusIcon from "../assets/icons/Minus";
import { getObjectFromPath } from "../utils/Misc";
import { toast } from "solid-sonner";
import { onMount, onCleanup } from "solid-js";

//Fonksiyon bileşenine dönüştürülmüş InputComponent
export default (props: {
  name: string;
  type: string;
  comment?: string;
  resource: string;
}) => {
  // State değişkenleri
  let inputAttributes: any = {};
  let defaultValue: any;
  let reference: HTMLInputElement | undefined;

  // Props doğrulaması
  try {
    if (!props.name || !props.resource) {
      throw new Error("Input component requires a name and resource prop.");
    }
    if (typeof getObjectFromPath(props.resource) !== typeof {}) {
      throw new Error("Input component resource prop must be an object.");
    }
  } catch (e) {
    console.error(e);
    return null;
  }

  // Değerlerin prototipini döndürür
  const prototypeOfValue = () => {
    return ["int", "float"].includes(props.type) ? "number" : "text";
  };

  // Değerleri döndürür
  const values = () => {
    if (prototypeOfValue() === "number") {
      const resourceValue = getObjectFromPath(props.resource)[props.name];
      return {
        min: "0",
        value: resourceValue,
        max: resourceValue * 2,
        step: props.type == "float" ? "0.1" : "1",
      };
    }
  };

  // Varsayılan değerleri ayarlar
  const setDefaults = () => {
    defaultValue = getObjectFromPath(props.resource)[props.name];
  };

  // Değerin sınırlar arasında olup olmadığını kontrol eder
  const between = () => {
    if (
      prototypeOfValue() == "number" &&
      Number(reference?.value) > Number(reference?.min) &&
      Number(reference?.value) <= Number(reference?.max)
    )
      return true;
  };

  // Maksimum değeri hesaplar
  const calculateMax = () => {
    let max = getObjectFromPath(props.resource)[props.name] * 2 * 100;
    reference!.max = max < 1 ? "10" : max.toString();
    reference!.placeholder = `Between ${reference?.min} and ${reference?.max}`;
  };

  // Değeri sıfırlar
  const reset = () => {
    if (defaultValue === undefined)
      return notify("No default value set.", "error");
    reference!.value = defaultValue;
    getObjectFromPath(props.resource)[props.name] = reference!.value;
    notify(`${props.name} reset to ${reference!.value}`, "info");
  };

  // Değeri uygular
  const apply = (event: KeyboardEvent | InputEvent) => {
    if (prototypeOfValue() === "number") {
      if (event instanceof KeyboardEvent) {
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          const isMac = navigator.platform === "MacIntel";
          const currentValue = isNaN(parseFloat(reference?.value || "0"))
            ? parseFloat(reference?.min || "0") || 0
            : parseFloat(reference?.value || "0");

          const direction = event.key === "ArrowUp" ? 1 : -1;
          const typeModifier = props.type === "int" ? 10 : 1;
          const modifier = (isMac ? event.metaKey : event.ctrlKey)
            ? 100 * typeModifier
            : event.shiftKey
            ? 10 * typeModifier
            : event.altKey
            ? 0.1 * typeModifier
            : 1 * typeModifier;

          const decimals = Math.max(
            (currentValue.toString().split(".")[1] || "").length,
            event.altKey ? 1 : 0
          );

          const newValue = currentValue + direction * modifier;

          reference!.value = newValue.toFixed(decimals);
          if (!between()) {
            reference!.value = getObjectFromPath(props.resource)[props.name];
            return notify(
              `Value must be between ${reference?.min} and ${reference?.max}`,
              "error"
            );
          }

          getObjectFromPath(props.resource)[props.name] = reference!.value;
          calculateMax();
          notify(`${props.name} set to ${reference!.value}`, "success");
        }
      } else if (event instanceof InputEvent) {
        if (!between()) {
          reference!.value = getObjectFromPath(props.resource)[props.name];
          return notify(
            `Value must be between ${reference?.min} and ${reference?.max}`,
            "error"
          );
        }
        getObjectFromPath(props.resource)[props.name] = reference!.value;
        calculateMax();
        notify(`${props.name} set to ${reference!.value}`, "success");
      }
    }
  };

  // Bildirim gönderir
  const notify = (msg: string, type: string = "default") => {
    type == "error" ? toast.error(msg, { duration: 2000 }) : null;
    type == "success" ? toast.success(msg, { duration: 2000 }) : null;
    type == "info" ? toast.info(msg, { duration: 2000 }) : null;
    type == "warning" ? toast.warning(msg, { duration: 2000 }) : null;
    type == "default" ? toast(msg, { duration: 2000 }) : null;
  };

  // İlk değerleri ayarla
  inputAttributes = values();
  onMount(() => {
    calculateMax();
    setDefaults();
  });
  onCleanup(() => {
    reset();
    reference = undefined;
  });

  // JSX çıktısı
  return (
    <InputContainer>
      <InputCenter>
        <InputField>
          <InputLabel name={props.name} comment={props.comment} />
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type={prototypeOfValue()}
            {...inputAttributes}
            ref={reference}
            onInput={(e: InputEvent) => apply(e)}
            onKeyDown={(e: KeyboardEvent) => apply(e)}
          />
        </InputField>
        <InputControllers>
          <button
            type="button"
            class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            onClick={() =>
              reference!.dispatchEvent(
                new KeyboardEvent("keydown", { key: "ArrowDown" })
              )
            }
          >
            <MinusIcon />
          </button>
          <button
            type="button"
            class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            onClick={() =>
              reference!.dispatchEvent(
                new KeyboardEvent("keydown", { key: "ArrowUp" })
              )
            }
          >
            <PlusIcon />
          </button>
        </InputControllers>
      </InputCenter>
    </InputContainer>
  );
};

// Diğer bileşenler
const InputContainer = (props: { children: any }) => {
  return (
    <div class="w-full bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
      {props.children}
    </div>
  );
};

const InputCenter = (props: { children: any }) => {
  return (
    <div class="w-full flex justify-between items-center gap-x-1">
      {props.children}
    </div>
  );
};

const InputControllers = (props: { children: any }) => {
  return (
    <div class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
      {props.children}
    </div>
  );
};

const InputField = (props: { children: any }) => {
  return <div class="grow py-2 px-3">{props.children}</div>;
};

const InputLabel = (props: { name: string; comment?: string }) => {
  return (
    <span class="block text-xs text-gray-500 dark:text-neutral-400">
      {props.name}:
      {props.comment ? (
        <span class="text-sm text-slate-500">{props.comment}</span>
      ) : null}
    </span>
  );
};
