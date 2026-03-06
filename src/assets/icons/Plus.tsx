export default (props: any) => (
  <svg
    class="flex-shrink-0 size-3.5"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={props.fill || "currentColor"}
    stroke={props.stroke || "currentColor"}
    stroke-width={props["stroke-width"] || 2}
    stroke-linecap="round"
    stroke-linejoin="round"
    data-darkreader-inline-stroke=""
    style="--darkreader-inline-stroke: currentColor;"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);
