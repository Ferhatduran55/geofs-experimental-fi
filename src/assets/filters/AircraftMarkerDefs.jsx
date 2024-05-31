export const defs = {
  outline: (
    <filter
      id="outline-filter-0"
      color-interpolation-filters="sRGB"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
    >
      <title>Outline</title>
      <feMorphology
        in="SourceAlpha"
        result="dilated"
        radius="1"
        operator="dilate"
        x="0"
      ></feMorphology>
      <feFlood result="flood" style="flood-opacity: 0.39;"></feFlood>
      <feComposite
        in="flood"
        in2="dilated"
        operator="in"
        result="outline"
        x="0"
        y="0"
      ></feComposite>
      <feMerge result="merge-0">
        <feMergeNode in="outline"></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  ),
};
