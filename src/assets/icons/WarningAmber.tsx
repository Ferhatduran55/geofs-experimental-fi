export default (props: any) => (
  <svg
    class={props.class || "w-5 h-5"}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={props.fill || "currentColor"}
  >
    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2z" />
    <path d="M11 10h2v5h-2zm0 6h2v2h-2z" />
  </svg>
);
