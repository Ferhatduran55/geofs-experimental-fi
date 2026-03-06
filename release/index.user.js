// ==UserScript==
// @name         Experimental Flight Interface
// @namespace    https://github.com/Ferhatduran55/geofs-experimental-fi
// @version      0.8.0
// @description  Improve your plane with the interface that offers experimental features.
// @author       Ferhatduran55
// @match        https://www.geo-fs.com/geofs.php?v=3.9
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        unsafeWindow
// @license      MIT
// @homepage     https://greasyfork.org/scripts/488227
// @supportURL   https://greasyfork.org/scripts/488227/feedback
// @downloadURL  https://update.greasyfork.org/scripts/488227.user.js
// @updateURL    https://update.greasyfork.org/scripts/488227.meta.js
// @run-at       document-end
// ==/UserScript==

(function() {
  "use strict";
  (function injectCodeCustomRunTimeFunction(cssCode, options) {
    try {
      if (typeof document != "undefined") {
        var elementStyle = document.createElement("style");
        for (const attribute in options.attributes) {
          elementStyle.setAttribute(
            attribute,
            options.attributes[attribute]
          );
        }
        elementStyle.appendChild(document.createTextNode(cssCode));
        document.head.appendChild(elementStyle);
      }
    } catch (e) {
      console.error("vite-plugin-css-injected-by-js", e);
    }
  })('*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: Roboto, sans-serif; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font-family by default.\n2. Use the user\'s configured `mono` font-feature-settings by default.\n3. Use the user\'s configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type=\'button\']),\ninput:where([type=\'reset\']),\ninput:where([type=\'submit\']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden="until-found"])) {\n  display: none;\n}\r\n.container {\n  width: 100%;\n}\r\n@media (min-width: 640px) {\n\n  .container {\n    max-width: 640px;\n  }\n}\r\n@media (min-width: 768px) {\n\n  .container {\n    max-width: 768px;\n  }\n}\r\n@media (min-width: 1024px) {\n\n  .container {\n    max-width: 1024px;\n  }\n}\r\n@media (min-width: 1280px) {\n\n  .container {\n    max-width: 1280px;\n  }\n}\r\n@media (min-width: 1536px) {\n\n  .container {\n    max-width: 1536px;\n  }\n}\r\n.visible {\n  visibility: visible;\n}\r\n.static {\n  position: static;\n}\r\n.absolute {\n  position: absolute;\n}\r\n.relative {\n  position: relative;\n}\r\n.left-0 {\n  left: 0px;\n}\r\n.right-0 {\n  right: 0px;\n}\r\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\r\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\r\n.mb-4 {\n  margin-bottom: 1rem;\n}\r\n.ml-1 {\n  margin-left: 0.25rem;\n}\r\n.ml-4 {\n  margin-left: 1rem;\n}\r\n.mr-2 {\n  margin-right: 0.5rem;\n}\r\n.mt-1 {\n  margin-top: 0.25rem;\n}\r\n.mt-2 {\n  margin-top: 0.5rem;\n}\r\n.mt-3 {\n  margin-top: 0.75rem;\n}\r\n.mt-4 {\n  margin-top: 1rem;\n}\r\n.block {\n  display: block;\n}\r\n.inline-block {\n  display: inline-block;\n}\r\n.flex {\n  display: flex;\n}\r\n.inline-flex {\n  display: inline-flex;\n}\r\n.table {\n  display: table;\n}\r\n.grid {\n  display: grid;\n}\r\n.hidden {\n  display: none;\n}\r\n.size-3\\.5 {\n  width: 0.875rem;\n  height: 0.875rem;\n}\r\n.h-2 {\n  height: 0.5rem;\n}\r\n.h-2\\.5 {\n  height: 0.625rem;\n}\r\n.h-4 {\n  height: 1rem;\n}\r\n.h-5 {\n  height: 1.25rem;\n}\r\n.h-6 {\n  height: 1.5rem;\n}\r\n.h-7 {\n  height: 1.75rem;\n}\r\n.h-8 {\n  height: 2rem;\n}\r\n.w-12 {\n  width: 3rem;\n}\r\n.w-28 {\n  width: 7rem;\n}\r\n.w-4 {\n  width: 1rem;\n}\r\n.w-5 {\n  width: 1.25rem;\n}\r\n.w-6 {\n  width: 1.5rem;\n}\r\n.w-7 {\n  width: 1.75rem;\n}\r\n.w-\\[380px\\] {\n  width: 380px;\n}\r\n.w-full {\n  width: 100%;\n}\r\n.min-w-\\[80px\\] {\n  min-width: 80px;\n}\r\n.max-w-md {\n  max-width: 28rem;\n}\r\n.flex-1 {\n  flex: 1 1 0%;\n}\r\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\r\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.cursor-pointer {\n  cursor: pointer;\n}\r\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\r\n.list-none {\n  list-style-type: none;\n}\r\n.appearance-none {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\r\n.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\r\n.grid-cols-4 {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\r\n.flex-col {\n  flex-direction: column;\n}\r\n.flex-wrap {\n  flex-wrap: wrap;\n}\r\n.items-center {\n  align-items: center;\n}\r\n.justify-center {\n  justify-content: center;\n}\r\n.justify-between {\n  justify-content: space-between;\n}\r\n.gap-1 {\n  gap: 0.25rem;\n}\r\n.gap-2 {\n  gap: 0.5rem;\n}\r\n.gap-3 {\n  gap: 0.75rem;\n}\r\n.gap-4 {\n  gap: 1rem;\n}\r\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\r\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\r\n.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\r\n.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\r\n.space-y-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n}\r\n.space-y-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n}\r\n.space-y-6 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));\n}\r\n.overflow-y-auto {\n  overflow-y: auto;\n}\r\n.rounded {\n  border-radius: 0.25rem;\n}\r\n.rounded-full {\n  border-radius: 9999px;\n}\r\n.rounded-lg {\n  border-radius: 0.5rem;\n}\r\n.rounded-md {\n  border-radius: 0.375rem;\n}\r\n.border {\n  border-width: 1px;\n}\r\n.border-0 {\n  border-width: 0px;\n}\r\n.border-2 {\n  border-width: 2px;\n}\r\n.border-4 {\n  border-width: 4px;\n}\r\n.border-none {\n  border-style: none;\n}\r\n.border-amber-300\\/50 {\n  border-color: rgb(252 211 77 / 0.5);\n}\r\n.border-blue-300\\/50 {\n  border-color: rgb(147 197 253 / 0.5);\n}\r\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));\n}\r\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n}\r\n.border-gray-500\\/30 {\n  border-color: rgb(107 114 128 / 0.3);\n}\r\n.border-green-300\\/50 {\n  border-color: rgb(134 239 172 / 0.5);\n}\r\n.border-green-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(34 197 94 / var(--tw-border-opacity, 1));\n}\r\n.border-green-500\\/50 {\n  border-color: rgb(34 197 94 / 0.5);\n}\r\n.border-red-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));\n}\r\n.border-red-500\\/50 {\n  border-color: rgb(239 68 68 / 0.5);\n}\r\n.border-yellow-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 240 138 / var(--tw-border-opacity, 1));\n}\r\n.border-yellow-500\\/50 {\n  border-color: rgb(234 179 8 / 0.5);\n}\r\n.bg-amber-100\\/50 {\n  background-color: rgb(254 243 199 / 0.5);\n}\r\n.bg-amber-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(217 119 6 / var(--tw-bg-opacity, 1));\n}\r\n.bg-blue-100\\/50 {\n  background-color: rgb(219 234 254 / 0.5);\n}\r\n.bg-blue-200\\/50 {\n  background-color: rgb(191 219 254 / 0.5);\n}\r\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n}\r\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));\n}\r\n.bg-emerald-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-200\\/80 {\n  background-color: rgb(229 231 235 / 0.8);\n}\r\n.bg-gray-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-300\\/50 {\n  background-color: rgb(209 213 219 / 0.5);\n}\r\n.bg-gray-400\\/50 {\n  background-color: rgb(156 163 175 / 0.5);\n}\r\n.bg-gray-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-800\\/50 {\n  background-color: rgb(31 41 55 / 0.5);\n}\r\n.bg-gray-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));\n}\r\n.bg-gray-900\\/70 {\n  background-color: rgb(17 24 39 / 0.7);\n}\r\n.bg-green-100\\/50 {\n  background-color: rgb(220 252 231 / 0.5);\n}\r\n.bg-green-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));\n}\r\n.bg-green-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));\n}\r\n.bg-green-900\\/30 {\n  background-color: rgb(20 83 45 / 0.3);\n}\r\n.bg-orange-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));\n}\r\n.bg-orange-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(234 88 12 / var(--tw-bg-opacity, 1));\n}\r\n.bg-red-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));\n}\r\n.bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));\n}\r\n.bg-red-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));\n}\r\n.bg-red-900\\/30 {\n  background-color: rgb(127 29 29 / 0.3);\n}\r\n.bg-transparent {\n  background-color: transparent;\n}\r\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n}\r\n.bg-yellow-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));\n}\r\n.bg-yellow-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(234 179 8 / var(--tw-bg-opacity, 1));\n}\r\n.bg-yellow-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 138 4 / var(--tw-bg-opacity, 1));\n}\r\n.bg-yellow-900\\/30 {\n  background-color: rgb(113 63 18 / 0.3);\n}\r\n.p-0 {\n  padding: 0px;\n}\r\n.p-1 {\n  padding: 0.25rem;\n}\r\n.p-3 {\n  padding: 0.75rem;\n}\r\n.p-4 {\n  padding: 1rem;\n}\r\n.p-6 {\n  padding: 1.5rem;\n}\r\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\r\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\r\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\r\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\r\n.py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n}\r\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\r\n.pb-4 {\n  padding-bottom: 1rem;\n}\r\n.pl-2 {\n  padding-left: 0.5rem;\n}\r\n.text-center {\n  text-align: center;\n}\r\n.text-right {\n  text-align: right;\n}\r\n.align-middle {\n  vertical-align: middle;\n}\r\n.font-display {\n  font-family: Orbitron, sans-serif;\n}\r\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n}\r\n.font-sans {\n  font-family: Roboto, sans-serif;\n}\r\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\r\n.text-5xl {\n  font-size: 3rem;\n  line-height: 1;\n}\r\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\r\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\r\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\r\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\r\n.font-bold {\n  font-weight: 700;\n}\r\n.font-medium {\n  font-weight: 500;\n}\r\n.font-semibold {\n  font-weight: 600;\n}\r\n.italic {\n  font-style: italic;\n}\r\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity, 1));\n}\r\n.text-blue-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 64 175 / var(--tw-text-opacity, 1));\n}\r\n.text-cyan-400 {\n  --tw-text-opacity: 1;\n  color: rgb(34 211 238 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-300 {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity, 1));\n}\r\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity, 1));\n}\r\n.text-green-400 {\n  --tw-text-opacity: 1;\n  color: rgb(74 222 128 / var(--tw-text-opacity, 1));\n}\r\n.text-green-400\\/80 {\n  color: rgb(74 222 128 / 0.8);\n}\r\n.text-green-700 {\n  --tw-text-opacity: 1;\n  color: rgb(21 128 61 / var(--tw-text-opacity, 1));\n}\r\n.text-orange-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 146 60 / var(--tw-text-opacity, 1));\n}\r\n.text-red-300\\/80 {\n  color: rgb(252 165 165 / 0.8);\n}\r\n.text-red-400 {\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity, 1));\n}\r\n.text-red-600 {\n  --tw-text-opacity: 1;\n  color: rgb(220 38 38 / var(--tw-text-opacity, 1));\n}\r\n.text-red-700 {\n  --tw-text-opacity: 1;\n  color: rgb(185 28 28 / var(--tw-text-opacity, 1));\n}\r\n.text-red-800 {\n  --tw-text-opacity: 1;\n  color: rgb(153 27 27 / var(--tw-text-opacity, 1));\n}\r\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\r\n.text-yellow-200 {\n  --tw-text-opacity: 1;\n  color: rgb(254 240 138 / var(--tw-text-opacity, 1));\n}\r\n.text-yellow-200\\/80 {\n  color: rgb(254 240 138 / 0.8);\n}\r\n.text-yellow-300 {\n  --tw-text-opacity: 1;\n  color: rgb(253 224 71 / var(--tw-text-opacity, 1));\n}\r\n.text-yellow-400 {\n  --tw-text-opacity: 1;\n  color: rgb(250 204 21 / var(--tw-text-opacity, 1));\n}\r\n.text-yellow-400\\/60 {\n  color: rgb(250 204 21 / 0.6);\n}\r\n.text-yellow-600 {\n  --tw-text-opacity: 1;\n  color: rgb(202 138 4 / var(--tw-text-opacity, 1));\n}\r\n.text-yellow-700 {\n  --tw-text-opacity: 1;\n  color: rgb(161 98 7 / var(--tw-text-opacity, 1));\n}\r\n.shadow-2xl {\n  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.outline {\n  outline-style: solid;\n}\r\n.drop-shadow {\n  --tw-drop-shadow: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\r\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\r\n.backdrop-blur-md {\n  --tw-backdrop-blur: blur(12px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\r\n.transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\r\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\r\n.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\r\n.transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\r\n.duration-200 {\n  transition-duration: 200ms;\n}\r\n.duration-300 {\n  transition-duration: 300ms;\n}\r\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\r\n.ease-in-out {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\r\n.\\[appearance\\:textfield\\] {\n  -webkit-appearance: textfield;\n     -moz-appearance: textfield;\n          appearance: textfield;\n}\r\n\r\n/* Orbitron font - embedded as base64 during build */\r\n@font-face {\r\n  font-family: "Orbitron";\r\n  src: url("data:font/ttf;base64,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AKQApQCmAKcAqACpAAEAGgBPAFcAWABaAFsAYABhAGIAYwBpAGoAawBsAG0AbwB2AHcAeAB5AHwAfQCCAIMAhACFAIgAAwAAAAEACAABABgACQBiAFoAUgBMAEYAQAA6ADQALgABAAkAAQAyADMATwBqAIIAgwCEAIgAAgCPAKkAAgCOAKcAAgCNAKYAAgCMAKUAAgCLAJoAAgCKAJAAAwBGAEwATgADAEUASwBNAAIAOgBKAAEAAAABAAgAAgBSACYAOwA8AD0APgA/AEAAQQBCAEMARABHAEgASQCRAJIAkwCUAJUAlgCXAJgAmQCbAJwAnQCeAJ8AoAChAKIAowCkAKgAtAC1ALYAtwDGAAEAJgAKABUAGgAbAB0AHgAgACgAKQAqADQANQA4AFcAWABaAFsAYABhAGIAYwBpAGsAbABtAG8AdgB3AHgAeQB8AH0AhQCsAK4AsQCzAL8AAAABAAAAAAIsAAAAFAAAAAAAAAAAABgBCgAAAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAYgBjAGQAZQBmAGcAaABpAGoAawBsAG0AbgBvAHAAcQByAHMAdAB1AHYAdwB4AHkAegB7AHwAfQB+AH8AgACBAIIAgwCEAIUAhgCHAIgAiQCKAIsAjACNAI4AjwCQAJEAkgCTAJQAlQCWAJcAmACZAJoAmwCcAJ0AngCfAKAAoQCiAKMApAClAKYApwCoAKkAqgCrAKwArQCuAK8AsACxALIAswC0ALUAtgC3ALgAuQC6ALsAvAC9AL4AvwDAAMEAwgDDAMQAxQDGAMcAyADJAMoAywDMAM0AzgDPANAA0QDSANMA1ADVANYA1wDYANkA2gDbANwA3QDeAN8A4ADhAOIA4wDkAOUA5gDnAOgA6QDqAOsA7ADtAO4A7wDwAPEA8gDzAPQA9QD2APcA+AD5APoA+wD8AP0A/gD/AQABAQECAQMBBAEFAQYBBwEIAQkAAQAAAR4AAQAAAAwBCgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADqAAAAAADbAAAAAAAAAAAAAAAAAAAAAAAAACEAABUAAAAAAAAAIwAAAAAAAAAAAAAAAA4AAAApAAAAAAAA7gAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAD/AAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAATMiFJAAAAAAAAGQAAAAAREwAAAAAAAAAAZ2dISBgbMjIAAAAAFgAACwAAAAAA7wAAAAAAAAAAAAAAAABlQtUATwAAAAAAAAAAAAAAANvqAAAAAAEAAQAAQABAAAH0ABQDRAA6A0QAOgNEADoDRAA6A0QAOgNEADoDRAA6BV8ANgNAADsDNgA4AzYAOANCADoC/gA6Av4AOgL+ADoC/gA6Av4AOgLTADoDPgA4A1MAOQDWAEIA1gA+ANb/9QDW/+gA1gApAwwABAMdADkDCwA5A6AAOANAADgDQAA4AzwANgM8ADYDPAA2AzwANgM8ADYDPAA2BV4ANQMXADgDdAA2AzkAOAM2ADMDNgAzAvcAFAM8ADYDPAA2AzwANgM8ADYDPAA2A+sAIwSbACMDLAAuAyYAIAMmACADJgAgAzUAMwM1ADMDBgAEAzYANAMyADEChQADAz0ANgSDADYDOwA2AzgANgNkADYDOgA2AywALgMGADYEkwAxAz0ANgM4ADMDMgAxAwYANgMGAAAEkAAAAzsANQSDADUCtgA0ArYANAK2ADQCtgA0ArYANAK2ADQCtgA0BJoANQKbADYCtwAzArcAMwKbABcCtAAzArQAMwK0ADMCtAAzArQAMwGXADUCqwApApwANgDQADQA1gBCANYAPADW//MA1v/mANYAJwDv/0UChgA2AS4ANAPSADYCuAA2ArgANgK0ADMCtAAzArQAMwK0ADMCtAAzArQAMwSZADQCmAA2ApgAFAIAADQCrgAwAq4AMANBADkBmgA1ArcANQK3ADUCtwA1ArcANQK3ADUDFgAVBC8AIwK0AC4CrQAqAq0AKgKtACoCugA2AroANgK1ADMCnQA2ArkANQPSADUCugA2ArQAMwLVADUCvAA2ArUAMwLBADYCfgA2Ak8ANgKyADMCywA2ANYANgKRAAUCqgA2ApMANgM4ADYCxQA2ArQAMwKUADYDAgAzArwANgKvADEChAAWArcANQMhABUENgAiArQALgKwABICugA2A0IAOQGHAAEDPgA5AzoANQLaAAYDPgA5AzQAOQKUAAMDQgA5AzwAMwMvADEC0wAJAwMALgMQAAwA1gA2AMEANgDWADYAwQAzAj4ANgDcADoA0gA1AqYAHwKjABMBcwCQAesAGQMdACACCQAGAggABQKbABsBFQA0ARYAOAEhABcBIQAzARMANgEUADMCBQA7AsQANgM2ADYDPAA2AWsALwFrADYAqAAhAKYANgF0ADsA4AA7ARAAAAEQAAADHwAjAnwAIQMUACIC3gAnAbEAEQIFADsCIgA1AfwAEgJ+ADsB2wA7AdkABQGUABgDxgAwA0AANgOqADUDQQA4AbcALQDWADYAAP97AAD/1gAA/7wAAP/RAAD/iQAA/5sAAP+uAAD/VgAAAW8B0gBkAOgASgE7AGYA1QA8AbkAZAEpADABHwAoAOkAIgGTACAB9ABXANUALwH0AL0DAwAuAxAADAMvADECmwAbAtMACQSQAAAEkwAxAwYANgAEADYAAgAAAAAAAP+cADIAAAAAAAAAAAAAAAAAAAAAAAAAAAEKAAAAJADJAMcAYgCtAGMArgCQACUAJgBkACcAKABlAMgAygDLACkAKgArACwAzADNAM4AzwAtAC4ALwAwADEAZgAyANAA0QBnANMArwCwADMANAA1ADYA5AA3ADgA1ADVAGgA1gA5ADoAOwA8AOsAuwA9AOYBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYARABpAGsAbABqAG4AbQCgAEUARgBvAEcASABwAHIAcwBxAEkASgBLAEwA1wB0AHYAdwB1AE0ATgBPAFAAUQB4AFIAeQB7AHwAegB9ALEAUwBUAFUAVgDlAIkAVwBYAH4AgACBAH8AWQBaAFsAXADsALoAXQDnARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgATABQAFQAWABcAGAAZABoAGwAcATcBOAE5AToAEQAPAB0AHgCrAAQAowAiAKIAhwANAAYAEgA/ATsACwAMAF4AYAA+AEAAEACyALMAQgC0ALUAtgC3AAUACgADATwBPQCEAAcAhQAOAO8A8AC4ACAAIQAfAGEACAAjAAkAiACDAF8BPgE/AUABQQFCAUMBRAFFAUYAjgDcAEMAjQDYAOEA2wDdANkA2gDeAOABRwFIAUkBSgFLAUwBTQFOAU8BUAVBLmFsdAVDLmFsdAVJLmFsdAVKLmFsdAVLLmFsdAVNLmFsdAVOLmFsdAVPLmFsdAVRLmFsdAVSLmFsdAVTLmFsdAVWLmFsdAVXLmFsdAVYLmFsdAVZLmFsdAVaLmFsdAZBLmFsdDIGVi5hbHQyBlcuYWx0MgZWLmFsdDMGVy5hbHQ0BWEuYWx0BWsuYWx0BXYuYWx0BXcuYWx0BXguYWx0BXouYWx0BGEuc2MEYi5zYwRjLnNjBGQuc2MEZS5zYwRmLnNjBGcuc2MEaC5zYwRpLnNjBGouc2MEay5zYwRsLnNjBG0uc2MEbi5zYwRvLnNjBHAuc2MEcS5zYwRyLnNjBHMuc2MEdC5zYwR1LnNjBHYuc2MEdy5zYwR4LnNjBHkuc2MEei5zYwd0d28uYWx0CGZvdXIuYWx0CXNldmVuLmFsdAhuaW5lLmFsdAxxdWVzdGlvbi5hbHQHdW5pMDBBMARFdXJvB3VuaTAzMDgHdW5pMDMwNwlncmF2ZWNvbWIJYWN1dGVjb21iB3VuaTAzMDIHdW5pMDMwQwd1bmkwMzBBCXRpbGRlY29tYgd1bmkwMzI3B3VuaUUwMDIHdW5pRTAwMwd1bmlFMDA1B3VuaUUwMDYHdW5pRTAwNwd1bmlFMDA4B3VuaUUwMDkHdW5pRTAwQQd1bmlFMDBCB3VuaUUwMEMAAAAAGwFKAAMAAQQJAAAA9gOoAAMAAQQJAAEAEAOYAAMAAQQJAAIADgOKAAMAAQQJAAMANgNUAAMAAQQJAAQAIAM0AAMAAQQJAAUAGgMaAAMAAQQJAAYAIAL6AAMAAQQJAAgANgLEAAMAAQQJAAkAHAKoAAMAAQQJAAsAUAJYAAMAAQQJAAwAHgI6AAMAAQQJAA0BIAEaAAMAAQQJAA4ANADmAAMAAQQJABkAEAOYAAMAAQQJAQAADADaAAMAAQQJAQEADgOKAAMAAQQJAQIADADOAAMAAQQJAQMAEAC+AAMAAQQJAQQACAC2AAMAAQQJAQUAEgCkAAMAAQQJAQYACgCaAAMAAQQJAQcAIAL6AAMAAQQJAQgAHgB8AAMAAQQJAQkAIgBaAAMAAQQJAQoAGgBAAAMAAQQJAQsAJAAcAAMAAQQJAQwAHAAAAE8AcgBiAGkAdAByAG8AbgAtAEIAbABhAGMAawBPAHIAYgBpAHQAcgBvAG4ALQBFAHgAdAByAGEAQgBvAGwAZABPAHIAYgBpAHQAcgBvAG4ALQBCAG8AbABkAE8AcgBiAGkAdAByAG8AbgAtAFMAZQBtAGkAQgBvAGwAZABPAHIAYgBpAHQAcgBvAG4ALQBNAGUAZABpAHUAbQBCAGwAYQBjAGsARQB4AHQAcgBhAEIAbwBsAGQAQgBvAGwAZABTAGUAbQBpAEIAbwBsAGQATQBlAGQAaQB1AG0AVwBlAGkAZwBoAHQAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAbABpAGMAZQBuAHMAZQBkACAAdQBuAGQAZQByACAAdABoAGUAIABTAEkATAAgAE8AcABlAG4AIABGAG8AbgB0ACAATABpAGMAZQBuAHMAZQAsACAAVgBlAHIAcwBpAG8AbgAgADEALgAxAC4AIABUAGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGkAcwAgAGEAdgBhAGkAbABhAGIAbABlACAAdwBpAHQAaAAgAGEAIABGAEEAUQAgAGEAdAA6ACAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAGgAdAB0AHAAOgAvAC8AbQBhAHQAdAAuAGMAYwAvAGgAdAB0AHAAcwA6AC8ALwB3AHcAdwAuAHQAaABlAGwAZQBhAGcAdQBlAG8AZgBtAG8AdgBlAGEAYgBsAGUAdAB5AHAAZQAuAGMAbwBtAC8ATQBhAHQAdAAgAE0AYwBJAG4AZQByAG4AZQB5AFQAaABlACAATABlAGEAZwB1AGUAIABvAGYAIABNAG8AdgBlAGEAYgBsAGUAIABUAHkAcABlAE8AcgBiAGkAdAByAG8AbgAtAFIAZQBnAHUAbABhAHIAVgBlAHIAcwBpAG8AbgAgADIALgAwADAAMQBPAHIAYgBpAHQAcgBvAG4AIABSAGUAZwB1AGwAYQByADIALgAwADAAMQA7AE4ATwBOAEUAOwBPAHIAYgBpAHQAcgBvAG4ALQBSAGUAZwB1AGwAYQByAFIAZQBnAHUAbABhAHIATwByAGIAaQB0AHIAbwBuAEMAbwBwAHkAcgBpAGcAaAB0ACAAMgAwADEAOAAgAFQAaABlACAATwByAGIAaQB0AHIAbwBuACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AdABoAGUAbABlAGEAZwB1AGUAbwBmAC8AbwByAGIAaQB0AHIAbwBuACkALAAgAHcAaQB0AGgAIABSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0ACAATgBhAG0AZQA6ACAAIgBPAHIAYgBpAHQAcgBvAG4AIgAuAAEAAAAKACYAQAACREZMVAAObGF0bgAOAAQAAAAA//8AAgAAAAEAAmtlcm4AFG1hcmsADgAAAAEAAQAAAAEAAAACAuoABgAEAAAAAQAIAAEC0gImAAIClgAMAFECFAIOAhQCDgIUAg4CFAIOAhQCDgIUAg4CFAIOAggCsAIIArACAgH4AgIB+AICAfgCAgH4AgIB+AHyAegB8gHoAfIB6AHyAegB8gHoAeIB3AHiAdwB1gHQAdYB0AHWAdAB1gHQAdYB0AHWAdAB1gHQAdYB0AHWAdAB1gHQAdYB0AHWAdAB1gHQAdYB0AHKAAABygAAAcoAAAHEAAABxAAAAdYB0AHWAdABvgG4Ab4BuAG+AbgBvgG4Ab4BuAG+AbgBvgG4Ab4BuAG+AbgBrgGkAa4BpAGuAaQBrgGkAa4BpAGeAAABngAAAZ4AAAGeAAABngAAAZQBhAGUAYQBfgF4AX4BeAF+AXgBfgF4AX4BeAF+AXgBbgFkAW4BZAFaAAABWgAAAVoAAAFaAAABWgAAAVAAAAFQAAABUAAAAUYAAAFGAAAAAwFWAkQJqgAAAAMBUQJEC5QAAAADAV0CRAjwC4oAAwFiAAAJkgAAAAMBVQJDC3YCfAABAVn//gABAVkCQgADAVoAAAAKAAAAAAAmgAAAAwFaAkQM8gAAAAEAawJEAAMBWwAACKYAAAADAVsCRAicAAAAAQFsAAAAAQFvAkQAAQGbAtAAAQGSAtAAAQGeAAAAAQGeAtAAAQGTAAAAAQGTAtAAAwBqAAAGBAAAAAEAbQLQAAMBkAAACFIAAAABAY4C0AABAbkC0AABAaIAAAABAaIC0AACABIAAQAHAAAACgALAAcADQARAAkAFQAZAA4AHgAlABMAKAAoABsAKgArABwALQAxAB4ANQA5ACMAQQBCACgATwBVACoAWABZADEAWwBfADMAZABoADgAbQB0AD0AeQB6AEUAfQCBAEcAhQCJAEwACQAAADYAAAA2AAAANgAAADYAAAAsAAAANgAAADYAAAA2AAEAJgABAbkAAAADAAECRAouAAAAAQAAAkQAAgABAOsA8wAAAAIACAABAAgAAQB6AEQAAAA4C7QLmguSC2YLTAsUCvoKmAuSCmwKTAo+C5IKGAnyCd4JxAmACWYJIgjSCL4IbghgCFgISggwB6oHeAciBvwGpgZcBgwF8gVOBTQFIASgBEoEEgPCA6IDmgMmAuICkgIkAfgBkAGCAT4BGAEKAQIA7gABADgAAQAJAAoADAANABIAEwAVABoAGwAcAB0AHgAgACcAKQAqACwALQAyADMANAA1ADgARQBGAEoATwBXAFgAWgBbAGAAYQBiAGMAaQBqAGsAbABtAG8AdgB3AHgAeQB8AH0AggCDAIQAhQCIAL8AxwDUAAMAawAACkwAfAAACkwAggAABOAAAQAsAAAKXgABAIL//wAIAAAAJYAAAAYAT//nBloAW//nAAAAYgAACpYAa//sBlQAfP/sBlQAiP/sBwYACwBP/+kGNABY/+wKAgBb/+wKAgBqAAAKTgBrAAoKTgBt//EBTgBv/+kGNAB2AAAKcAB4AAAKTgB5AAAKcACDAAAKcAACAFv/zwfeAH0AAAoKAA4ATwAACfYAWAAACfYAW//gAAAAYQAAAGIAYgAACfwAYwAACfwAawAACh4AbQAAAFwAb//sB4AAeP/sAFYAef/xB4AAfAAABnAAfQAACfwAhQAABpQAAAAHgAAAAAANgAAAAAACgAAABgBPAAAAJgBb/+IAAABjAAAJaABv/+MGrgB5/+cEqACCAAAJaAAAAAqAAAARAFf/8QBoAFj/7AkcAFoACgmKAFv/8QmKAGD/9gGYAGEAAAmKAGoAAAmKAGz/7AVIAG0ABQkcAG8AAAmKAHb/8QBoAHn/8QmeAHz/8QmKAIMAAAmKAIT/8QYGAIj/8QBoANQAAAloAAAAGYAAAA0ATwAACGIAVwAFApwAWgAUCGIAYgAFAzYAYwAFCK4AbAAACGIAeAAACM4AeQAACM4AfAAACM4AggAAApwAhQAACM4AiAAFAzYAuAAACM4ACwBY/+0EkABb//EFHgBhAAAEwgBq//EIzABt/+kEkABvAAAIqgB9/+wFJACC/+wEvACDAAAIpACE/9sIeACI/+kEkAARAE8AAAgUAFcAAAg6AFoAAABuAFsAAAg6AGAAAAgUAGEAAAg6AGIAAAg6AGMAAAgUAGsAAAg6AG0AAAgUAG//+wg6AHkAAAgUAH0AAAgUAIIAAAg6AIgAAAg6ALj/7AgUALn/DQBoAAAATIAAAAAAOIAAAAEAff/nBvIABABaABkEggBjAA8AGgBpAAAHvgB5AAoIDAAAABaAAAAMAE//9gdMAFcAAAfsAGv/7AOqAG3/8QYqAG//7Ad+AHj/9gdMAHn/7ARQAHz/6QRWAH3/6QRoAIL/8wYqAIP/3QBKAIT/3QbKAAAACYAAAAgAV//sBAwAWP/sBy4AWwAAB3QAYQAAB5wAb//xB5wAdv/2A/oAeQAAB3oAhP/nADIAAAAogAAACgBPAAAAUABXAAAHPABYAAAExgBbAAAExgBhAAAASgBq//MARABs//MARABtAAAHZAB2AAAAPgCD/+cARAAAAACAAAAAAASAAAAAAAWAAAAAAAuAAAAQAE//9gB6AFcAAAB0AFoABQIAAFv/8QIAAGAAAAbAAGMAAAZUAGsAAAbAAGz/9gbAAG0AAAbAAG//9gaaAH0AAABuAIL/xQBoAIP/vwE0AIUAAAaaAIgAAAbAANT/qQBiAAAATYAAAAAAQ4AAAAAALoAAAAAAJ4AAAAAANIAAAAIAW//7AA4AYwAABkAAAAApgAAABABPAAAGLABb/+wGBgBpAAAAmgB9AAAGLAATAE//3QCeAFj/8QFSAFoAAAXsAFsAAAYSAGD/0QCYAGEAAAAAAGIAAAXsAGoAAAYSAGsAAAWmAG3/8QCSAHb/5wCMAHf/8QCGAHgAAAWmAHkAAACAAHwAAAXsAIL/+wB6AIMAAAXsAIT/1wB0AIgAAAYSAAAARIAAAAAAMIAAAAAAPIAAAAAARYAAAAAAP4AAAAAAQoAAAAAARoAAAAAAO4AAAAQATwAFBU4AWwAABBoAYAAKBbwAYwAFBU4ADQBP//EFogBY//EFtgBb//EFtgBgAAAFogBhAAAFgABsAAAFogBv/+wCBgB4//EFogB5/+sAAAB9/+cAAACD/+wC/gCFAAAFgACIAAAFogAKAE8AAAUEAFoAAAUEAGIAAAUEAGkAAATeAGsAAATeAG0AAATeAG8AAAUEAHwABQBEAH0ACgAAALn/SwA+AAAASoAAAAAANYAAAA0AWP/sBJoAW//xBQgAYQAABQgAYgAABQgAaQAABLoAa//sAVoAbwAABOYAeP/7AMwAeQAABQgAgv/sAFAAg//iAP4AhP/vAYQAhQAABQgAAAAIgAAABgBb/+wBFgBv/+oDEAB4AAAEsgB9/+kAdgCDAAAEsgCFAAAEkAAMABUAAARqAE8AAASMAFcAAASMAFgAAASMAFv/5wAAAGL/8QLKAGr/7AD8AG8AAASMAHgAAASMAHz/5wBQAH3/7ABKAIj/7AD8AAAAHoAAAAAAI4AAAAYATwAABDYAWgAeBA4AfQAABDYAggAAACwAgwAAACYA1AAAA+gAAAAPgAAAAAAagAAADgBX/+cAgABY//YAegBhAAAEBABiAAAEBABqAAAEBABr//YDZABs/+wAdABt//EAbgB4//sBcgB5/+wAaACC/+wAYgCD/+IAXACE//EAVgCI/+cAgAAAAB+AAAAAABiAAAAAABOAAAAAACKAAAAAACqAAAAAAByAAAAAAA6AAAAAACGAAAACAEv+rQAUAEz+pwAOAAAAQYAAAAAAPYAAAAEAOv6rAAgAAQACgAAAAQA6/pcASAACADX/9gMAAFsAAAMmAAgAKv/dAEoAT/+fAEQAW/+JAD4AY//tADgAb/+JAD4Adv+dAEQAef+LADIAff+fAEQAAABIgAAAAAAygAAAAABHgAAAAABJgAAAAAA6gAAAAwAJ/90CogBPAAACzgBbAAACzgAJAAH/5QBKACD/6QBKAE//8QBEAFv/3QBEAGIAAAK0AGP/9gK0AG//5wA+AH3/7AA+AIUAAAA4AAAAEYAAAAAABoAAAAAAA4AAAAAAEIAAAAcAAf/bAD4AIP/fADgAKv/sAhgAWwAAADIAYwAAAj4Ab//iAmoAef/YACwAAAAVgAAAAAABgAAAAAA5gAAAAAA2gAAABAB5AAACSACCAAACJgCDAAACSACEAAACSAAGAG//hQA+AHn/hwA+AH3/mwA4AIP/rQAyAIX/pQAsAIj/mQAmAAAAUYAAAAAAToAAAAAAS4AAAAAAUIAAAAAAT4AAAAQAHv/tAeoAM//nAf4ANf/2AZwAgwAAAcIAAgAy/+0ADgAz/+0ADgAAABeAAAAEAAEACgG8ABr/RQAgAFoACgG8AIIAAQAaAAAAJIAAAAEAAYAAAAYAMv/lAaoAM//lAaoANP/ZAHQAWAAAAXQAYQAAAZYAiAAAAXQAAgBPAAABcABY//YBcAAEADL/GQCoADP/fwAaADX/TQEOAGsAAAEUAAAAMYAAAAUAAf/iACYAFP/jACAATwAAAUIAbwAAARoAhQAAAUIAAAAsgAAAAAArgAAADgAaAAAAXAAbAAAAyAAsAAAAogBPAAAAogBXAAAAyABtAAAAogBvAAAAyAB2AAAAogB3AAAAogB4AAAAyAB5AAAAyACCAAAAVgCDAAAAyACEAAAAogAAAD6AAAAAADeAAAADADP/5QDIADUAAAAUAFoAAABmAAAAFIAAAAUAGv8QADIAKQAFACwALAAKAAAAhf/sACYAuP+AACAAAQAAgAAAAAAzgAAAAAAggAAAAABAgAAAAgAd/+MAFAAg/+EADgAAAC+AAAAAAC2AAAAFAB0AAAAmADL/4wBcADMAAAAgADj/5QAAAGMAAABIAAAADIAAAAAAEoAAAAEAWwAAABwAAwAy/88AFAA1/+EAFABiAAAAFAAAABuAAAACADP/4QAOADX/8wAOAAAAHYAAAAAAAQAAAAEAAQAAAioBCgAAAAACLAAAAAsAJgAsADMAOQA/AEUASwBoAJoAswC5ANUA5ADqAPEA9wD9AQsBNAFDAUsBUQFYAV4BZAF7AY8BmQGqAbkBvwHjAekB8AH2AfwCAgIlAkUCbwKVAswC0wLfAvQC+gMBAwcDDQMYAyoDQANQA1YDXANrA3EDhAOqA7kDyAPqBAAEEAQ3BF4EjQSxBMAE2AUGBSAFRAVXBWUFfwWPBaQFvAXCBckFzwXVBdsF4QYMBikGQQZHBmQGhQaMBpMGmgahBrcG3wbyBv8HBwcNBxQHGgcgBzEHRQdXB3AHggeJB60Hswe6B8AHxgfMB/0IGwg4CEkIfwiHCLgIzQjiCOoI8gj6CQIJDgkhCTcJUglZCWAJcgl5CZYJrgm+CdgJ/AoiCj0KbgqGCqIKsQq/CuYK9gr+CxULKQs0C0ULVQt5C5cLwAvlDBsMJww8DEgMWgxwDHsMjQy3DMUM7A0lDToNYQ2KDZgN2g4IDioOPg5MDm0Odw6GDpMOpQ60DsAOzA7sDxAPIg86D2IPbg97D6UPvg/UD/UQExAfECsQNBA9EEYQTxBmEHoQiRCXEKUQsBC3EL4Q4RECEVERchGDEYwRpBG1EcERzxHeEfgSURKPEs0S7RMRExoTJhMvEzoTRRNUE2IThhObE6YTrhO2E74TxRPNE9MT6xPyE/gT+BP/E/8UDRQzFFUUfxSTFK0UxRTUFOcU+kAAgAEACAAIAAADAgYCAQLsFBQCFOwTAIABAAgAHQAADg0AAQICAQICAgIEAQMBA4ELCBzj9wC0SrS02yNKgAHk+IEI+OQA4SzctbXcAIABAAgAAgAAAIWFAIABAAgABQAAAIAAAYOFgAEACAACAAAAhYUAgAEACAACAAAAhYUAgAEACAACAAAAhYUAgAEACAACAAAAhYUAgAEACAAgAAAPDgICAgICAgICAgIDAQMBA4ANCRy9AMoAvbZMtrbdJUwO5PgAtSXbSwDhACzctbXcAIABAAgAPAAAHh0BAQICAQEBAQEBAQECAgIBAwEDAQMBAwEDAQMBAwGAB+f6AwMDBwkCghH34yPbtLTbI0pKI964uN4jSkqBG/jk9vf7/QsJCRwIAEtLJADZ2QAkJCT93LW13P2AAQAIACkAAAACHBQIgwIIFByBB0RESkpKSkREhYEFCBQc5Oz4ggm1tbW8u0VFS0tLhIABAAgAAgAAAIWFAIABAAgAHwAADw4BAQICAQICAQEDAQMBAwGAAeP3gQn34yLbtLTbIklJgQz45BwIAEtLJNy1tdwkgAEACAAOAAAGBQECAgICAoAECEwWTAiABLUl20sAgAEACAACAAAAhYUAgAEACAAFAAAAgAABg4WAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIAAwAAAUEAQICAgKAAwhMFkyAA7Ul2wAAgAEACAAwAAAXFgACAgECAgECAgIBAwEDAQMBAwICAQICARwIgQ4IHOP3ALS02yNKSiPbtMqBAffjgAMIHOT4gQ/45L3ctbXcJEtLJN4oHAgAAIABAAgADgAABgUBAgICAgKABEq0/bRKgAAlgQHbAIABAAgABwAAAAPd3SQkg4eAAQAIAAIAAACFhQCAAQAIAAUAAACAAAGDhYABAAgAAgAAAIWFAIABAAgAAgAAAIWFAIABAAgAGAAACwoAAgICAQMBAwMCAgocCABKSiPbtAD35IAJCBxAJEtLJBwIAACAAQAIAB4AAACBDEpK788JCTUICM/vSkqDggElJYECywA1gQHb24QAgAEACAAKAAAAgQFKSoWCAUtLhACAAQAIABkAAACBCTH6wvT0qan6SkqDggBBg0L/b//O/26EgAEACAAUAAAAgQIxtLSBAs9KSoOCQACUg0D/boQAgAEACAACAAAAhYUAgAEACAAqAAAUEwACAgECAgECAgECAgEBAwEDAQMBARwIgQMIHOT3gQn35CPbtLTbI0pKgAMIHOT4gQz45BwIAEtLJNy1tdwkgAEACAACAAAAhYUAgAEACAAFAAAAgAABg4WAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIACgAABMSAAICAQICAgICAgIBAQMBAwEDAQEcCIEOCBy9AMoAvSXdtrbdJUxMgBEIHOT4ALUl20sAS0sk3LW13CQAgAEACAAjAAASEQACAgEBAQEBAgECAQMBAwEDAYAB4/eDCvfjSiPbtLTbI0pKgQ/56+T99ujh4CsrBd22tt0FAIABAAgAMgAAGBcAAQECAgICAQICAQICAQICAQEDAQMBAwEF5uYA9BwIgQMIHOT3gQn35CPbtLTbI0pKgAdsIUsACBzk+IEM+OQcCABLSyTctbXcJIABAAgALAAAFhUAAQEBAgICAQEBAQECAQIBAwEDAQMBBs/pSgQA4/eDCvfjSiPbtLTbI0pKgALh4TSBD/nr5P326OHgKysF3ba23QWAAQAIAEMAACEgAAICAgEDAQMBAwECAgECAgECAgIBAwEDAQMBAgIBAgICIB8LA01NJt63t94fCwMDCx/n+gO3t94mTU0m5/oDA/rnBoANCBxDJEtLJAHb2+L35PiBDfjkvdy1tdz/JSUeCRwIgYABAAgABQAAAIIABoGFgAEACAAKAAAEAwICAgIA2oEAJQO1ALUAgAEACAAWAAAKCQACAgMDAQMDAgIJHAgASiPbtAD35IAICBwkS0skHAgAgAEACAACAAAAhYUAgAEACAAFAAAAgAABg4WAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIAAwAAACCBFUS0CQjg4MAdoYAgAEACAAbAAAAggpPGeQR3Kj09MT6MYODQACVgUAAlYNA/2iEgAEACAAiAAAAggDTgQo5BtILCzcKCtIEOYOBAjQAzIEAPIECzAA1gQDDhACAAQAIABYAAAAJ2dnZ1zP+yyckJIOBAP6BAESBAP2EAIABAAgAAgAAAIWFAIABAAgAAgAAAIWFAIABAAgAFAAAAIJA/26DQACShYECMLW1gQLQS0uEAIABAAgAAgAAAIWFAIABAAgAFAAACAcCAQICAQECAgf8veqjFS1PowYx/wDk5AAqQP9igAEACABCAAAAAhwUCIMUCBQc5O36AgMAtLRERkpKSkpGRLS0gQQB++3kHIOBBQgUHOTs+IMT/fTrw8O1tbW5u0VHS0tLPT0WDQOGAIABAAgADgAABgUCAgICAgKAANuBASUABUu1ALVLAIABAAgADQAABgUDAwMCAQEF68UQCPrzA0skHAiBAIABAAgAJgAAExIBAgEDAQMCAQEBAQEBAQIBAwEDgARKSiPbtIICDykQgQS0tdwjSoEQ/yUl/wD0BgYA+vwMAAHb2wEAgAEACAAWAAALCgIBAQECAwMCAgMCgAm8w9DXjbMSyO5Jggf45Ny1ANy1AACAAQAIAA8AAAcGAgECAgMDAoAF5PgAtNtKgQT45Ny1AIABAAgALgAAFhUCAgECAgECAgECAgECAgEBAwEDAQMBA9slHAiBAwgc5PeBCffkI9u0tNsjSkoGJdsACBzk+IEM+OQcCABLSyTctbXcJIABAAgALgAAFhUBAgECAgECAgECAgECAgEBAwEDAQMBA9olHAiBAwgc5PeBCffkI9u0tNsjSkqABfkACBzk+IEM+OQcCABLSyTctbXcJIABAAgAOAAAHBsAAgIBAQEBAQEBAQEBAQEBAwMBAwIBAwEDAQMBgAHk+IMGFC9GSUYvFIELtNsjSiPbtLTbI0pKgBoB+evk/QYPEQwGAPv9Bg8H4eEHKysF3ba23QWAAQAIACoAABQTAgMBAwECAgECAgMDAQMBAgIBAgIF3La23BwIgQcIHCRLSyTk+IEB+OQTSyQB29vi9+T4ALXc/yUlHgkcCACAAQAIABQAAACCBUZGv/DwLYOBAf//QACNgQDBhACAAQAIACcAAAASHx8faWnnHh42NrPq6hvs7E8A6oGDQACQgQHM40AAkIEAzYEAioSAAQAIAFMAAACCBOfArMLogglKSkozI93Ntra2ghEaQFNBGwEBAbe3t87eIjJJSUqDgAgMBfj2AAoJ/PSBB/8PJSUlJQ//gQj0+wgKAPb4BgyBBwHy29vb2/IBhIABAAgAHAAADQwDAwEDAQICAwMCAgICDNu0tNscCABKI7QA+OQMSyQB29vi9/8lABwIAACAAQAIACoAABQTAAICAQICAQMBAwMCAgECAgEDAQMBHAiBBwgc3La23OT4gQX45CRLSySAEggcCR4lJf/ctQD45Pfi29sBJEuAAQAIABQAAAgHAgEBAgECAwGABi3vvtZGmUYG//8xAOQAKkD/YoABAAgAEwAAAAHU1IEENbi4BASDgQDNgUAAlIaAAQAIACsAAAAJzMz//zOyssvLAEH/f/9/BsnJmfv7ANuBgQDNgUAAkwHjzIFAAJGDAIqEgAEACAAPAAAHBgACAgMDAgIGHAgASiO0AIADCBwkS4GAAQAIABUAAAoJAAICAwMCAgMCAgkcBwBJI8UP6Y3XgAYIHCRLACRLgQCAAQAIABoAAAwLAAICAgEDAwMBAgICCxgGALe33ub9/SC3R4AKBxgk4LkA7uhH8CCAAQAIAAIAAACFhQCAAQAIAAUAAACAAAGDhYABAAgAAgAAAIWFAIABAAgAAgAAAIWFAIABAAgAAgAAAIWFAIABAAgAAgAAAIWFAIABAAgANAAAFxYAAgICAQMCAQIBAQIBAwIBAgIEAQMBAxEXBv+2tt3/nq+2tv//2LYftkZB/2//bwKW2P+ABAcYJOC5gQ757+jcJEcAR/AgEOC5ueAAgAEACAAgAAAQDwICAQICAQICAQEDAQMBAwGADkfl9/399+Uf3ba23R9HR4IM+egYBwBHRyDgubngIIABAAgAGgAADAsAAgIBAgICAQMBAwIBGAeBBwcY/iBHRyD9gAoHGOj5ALm54CBHAIABAAgAAgAAAIWFAIABAAgAIAAAEA8AAwEBAgICAgIBAwEDAQMBABeCCwYXt/4g3re33iBHR4ADEhjo+YIHR0cg4Lm54CCAAQAIACYAABIRAAICAQICAQMBAgEDAgMBAwEDARgHgQ0HGOb9/UdHIP23t94gR4ADBxjo+YEK7ujcIEcAEOC5ueCAAQAIAAUAAACAAP6DhYABAAgABQAAAIAA/4OFgAEACAAFAAAAgAD+g4WAAQAIAAUAAACAAP6DhYABAAgAFgAACwoBAQEBAgIBAwICA4IHCBkjIEcjRyGACejt+AC4uN8AuQAAgAEACAAvAAAXFgIBAwIDAQECAgECAgEDAQEBAwEDAQMBA/HfuBmCDwcZ5/j//+3nIN+4uN8gR0cHR0cgABIY6PmBAvnoF4EHR0cg4Lm54CCAAQAIABIAAAkIAQMBAgIDAwEDgAdH5fb9tt0fR4IF+ejgubngAIABAAgACgAABQQCAgMCAoADRwBHFYIBuAAAgAEACAAEAAACAQICAd0kgYABAAgAAgAAAIWFAIABAAgABQAAAIAAAYOFgAEACAACAAAAhYUAgAEACAACAAAAhYUAgAEACAAQAAAHBgMDAwMBAwKABdkfDQfZHwZqQzojIwC4AIABAAgAHgAAAIIMR0f11gQEMwUF1vVHR4ODASQkgQLNADOBAdzchACAAQAIABEAAAgHAAICAgEDAgMHGAcASEghNCOABAcYASBHgQCAAQAIABsAAA0MAQICAgMDAQMCAQMBA4ALvM3UjbXmDcbG7R9GgQr56OC5ueAA4Lm54IABAAgAEQAACAcBAgICAwMBA4AG5ff9tt0fR4EF+ejgubngAIABAAgABQAAAIAA9oOFgAEACAAqAAAUEwACAgECAgEDAQECAgIBAwEDAQMBARgHgQ8HGOb9/f335iDet7feIEdHgAMHGOj5gQzu6BgHAEdHIOC5ueAggAEACAACAAAAhYUAgAEACAAFAAAAgAABg4WAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIAAIAAACFhQCAAQAIADsAABwbAAECAQECAQEBAgICAQMCAwEDAQMBAwEFAQMBAwEZE4IRBxMZn6+2///YtiDfuLjfIEdHQf9v/28Cltj/gQMSGOj5ghL56NwgRwBHRyDgubngIBDgubngAIABAAgAIQAAEA8CAQICAQICAgEBAwEDAQMBgA7l9/399+VHH922tt0fR0eBA/noGAeBB0dHIOC5ueAgAIABAAgAIAAAEA8CAQMBAQICAgEBAwEDAQMBAbcXggoGF/4g3re33iBHR4EDEhjo+YEHR0cg4Lm54CCAAQAIABAAAAcGAgICAgEDA4AFBxkTIEcOBuj5ALm54AAAgAEACABCAAAgHwACAgIBAwEDAQMBAgIBAgIBAgICAQMBAwEDAQICAQICCxgHAEdHIN63t94YB4ERBxjm9/63t94gR0cg5vf+/vfmgA0HGC0gR0cgA9zc4/To+YEO+ejT4Lm54P0kJB0MGAcAgAEACAAEAAABAAEA/wABAIABAAgAOgAAHRwBAQICAQEBAQEBAQEBAQECAgIBAwEDAgEDAQMBA4EaCBnT2+ft7Ozs+ezs7OXT9cylpcz1zKWlzCBHgAHp+oIW/vfv6Ov0/AAYBwBHRyD30BkZ8uG6uuEAgAEACAAVAAAKCQACAgICAgEDAgMJGQgARyNHRyAjKYAGBxjuALkgR4EAgAEACAAWAAAKCQACAgMDAQMDAgIJGAYARyDetv335oAIBxggR0cgGAcAgAEACAAEAAABAAEA/gD/AIABAAgABAAAAQABAP8A/wCAAQAIAAQAAAEAAQD+AP8AgAEACAAEAAABAAEA/gD/AIABAAgADgAAAAf//wBQEdIiI4ODAHOGAIABAAgAHAAAAIIMShffB8yc5ea59CsA7oGDQACDgQB+g0D/e4QAgAEACAAiAAAAggDWgQoxA9MGBjAFBdQDMYOBAjEAz4EANIECzwAxgQDGhACAAQAIAB4AAA4NAgEDAgMBAwMBAwIBAwED8d+4GYEHRyDfuP//7ecNXV02ABIYIEdHIAAtFhaAAQAIAAUAAACAAP+DhYABAAgABQAAAIAA/4OFgAEACAAaAAAAgkD/aIEB/f1AAJUB/f2DgQItubmBAtNHR4QAgAEACAAFAAAAgAAGg4WAAQAIACAAAA8OAAICAQICAQMBAwIDAQMBARgHgQoHGOb9/SC33iBHR4ADBxjo+YEH7uhH4Lm54CAAgAEACAAaAAAMCwICAQMDAgEBAgMDAoAKR922/f3/+v223UcL7iQk/fT+AAMMA9wAgAEACAAPAAAHBgACAgMDAgIGGAYARyC2/YADBxggR4GAAQAIABwAAA0MAAICAwMBAwIBAwEDAgwYBwBGHu3GDg7ntI3UgAsHGCBHRyAAIEdHIAAAgAEACAAqAAAUEwICAQEBAQMDAQMDAQEBAQIDAwEDgAID/v6BDUcf3bb9/f3/+v223R9HEwwDAAX39P0kJP309wIAAwwD3NwDgAEACAAsAAAVFAACAgECAgEDAQMDAwEBAgIBAwEDAgEYB4EQBxjet7fe5v39/ffmIEdHIP2AEwcYDB0kJP3guQDu6PTj3NwDIEcAAIABAAgAHQAADg0BAQICAQICAgIEAQMBA4ELBxni9PqzR7Oz2iBHgAHo+YEI+egA6jDgubngAIABAAgAOgAAHRwCAQQBAQEBAQEBAQICAQEDAQMBAwEDAQMBAwEDAYAA6YIXBggC/f399uUg3ba23SBHRyDhurrhIEdHgRrn9fb7/QwNDBgHAEdHIA7n5w4gJCT96sPD6v0AgAEACAAaAAAMCwACAgEDAQIBAwEDAgEYBoEHERj+IEdHIP6AAgcY54EFubngIEcAgAEACAAfAAAPDgIBAgIBAgIBAQMBAwEDAYAN5fb9/fblIN22tt0gR0eBDPnnGAcAR0cg4Lm54CCAAQAIAA4AAAYFAgICAgICgAQIRxlHCIAEuSTcRwCAAQAIAAwAAAUEAgICAgKAAwhHGUeAA7kk3AAAgAEACAAtAAAWFQACAgEDAQEEAgEDAQMBAwEDAgIBAgIBGAeBERIY5v23t94gR0cg3rfa/f335oACBxjngg7n1OC5ueAgR0cg6ygYBwAAgAEACAAPAAAHBgICAgICAgIGAkm3/7dJAoAAJIEA3IGAAQAIAAYAAACCAUdHg4gAgAEACAAYAAALCgADAQIBAwEDAwICABmBB0dHIN22/fflgAkSGDogR0cgGAcAAIABAAgAHgAAAIIMR0f11gQEMwUF1vVHR4ODASQkgQLNADOBAdzchACAAQAIAAwAAACCA0dH/f2DgwFHR4QAgAEACAAZAAAAggkx977t7aWl90dHg4MAUYNC/1z/0f9chIABAAgAFgAAAIIJL7a2/f3NR0cA/4GDQACSg0D/b4QAgAEACAAqAAAUEwACAgECAgEDAQECAgIBAwEDAQMBARgHgQ8HGOb9/f335iDet7feIEdHgAMHGOj5gQzu6BgHAEdHIOC5ueAggAEACAAhAAAQDwECAgIBAgIBAgEDAQMBAwGADuX3/f335Ucf3ba23R9HR4EN+ej66eLhKioD4Lm54AMAgAEACAAwAAAXFgABAgECAgECAgEDAQECAgIBAwEDAQMBBNrs8RgHgQ8HGOb9/f335iDet7feIEdHgABHgQMHGOj5gQzu6BgHAEdHIOC5ueAgAIABAAgAKwAAFRQCAQICAQIBAQEBAgECAQEDAQMBAwGAE+b3///89/RcBdP0RyDet7feIEdHgRL56Pru5eLiNQDiACoqA+C5ueADgAEACABCAAAgHwACAgIBAwEDAQMBAgIBAgIBAgICAQMBAwEDAQICAQICCxgHAEdHIN63t94YB4ERBxjm9/63t94gR0cg5vf+/vfmgA0HGCIgR0cgA9zc4/To+YEO+eje4Lm54P0kJB0MGAcAgAEACAAKAAAEAwICAgID2QD9IQO5ALkAgAEACAAWAAAKCQACAgMDAQMDAgIJGAYARyDetv335oAIBxggR0cgGAcAgAEACAAOAAAAB/7+AE8Q0R8jg4MAcYYAgAEACAAaAAAAggxKGN8HzJzo5bn0KwABgYMAf4EAfYMAgIQAgAEACAAiAAAAggDUgQoxA9UGBjAFBdQDMYOBAjEAz4EAM4ECzwAxgQDGhACAAQAIAA0AAACDBVUk8EZGRoOEAEOHgAEACAAaAAAAgkD/aIEB/f1AAJUB/f2DgQItubmBAtNHR4QAgAEACABLAAAAAhkTCIMNCBMZ09rl7Ozs7OXa0xlBAI8AjwbMvKWlpUdHQP9eAyAwR0eDgQUMHCLl6/iDBfjr5SIcDIINUVFRUToqlXJytra2zd2DgAEACAASAAAABxISEmAAKVhYg4FA/3MBz8+GAIABAAgALgAAFhUCAgIBAwEDAQMCAQICAQQBBAEDAQMCgAcIGcylpcwgR4EKCBnT7OzTIEdHIOwVCRohIfrgubngwuj5///o8tnZACBHAIABAAgARgAAIiEAAgICAQMBAwEDAgEDAQMBAwIBAwEBAgIBAQEBAQEBAQICEBgHAEZGH8ukpMvs0Kmp0B9GgQ4SGNjp8PDw9Pbs6+vr5dOAIAcYQCBHRyD+1x4e9+C5ueDC6P////no7/L09fsGBhgHAIABAAgAFwAACAcCAgECAgICAgW5ANMA8ABBAJD/uQb5Jv9B+QBBQP9/AIABAAgALgAAFhUAAgICAQMBAwEDAgIBAwEDAQMBAQICFRkIAEdHIMylpcwA7CBHRyDT7Ozs5dOAFAcYMyBHRyD91v+5ueD2Hh4MBhgHAIABAAgAMAAAFxYAAgIBAgICAQMBAwEDAQECAgIBAwEDAgEZCIESCBn9IEdHINPs7Ozl0yDMpaXMR4AVBxjo+f+5ueDzGxsJAxgHAEdHIPrTIACAAQAIAAwAAAUEAgMDAgIEtt3l9/0E4boA+ukAgAEACABRAAAoJwACAgECAQEBAQECAgECAQEBAQEBAQECAgMBAwEDAQMBBAEDAQMBAwEBGQiBAvrz+oIdCBnT6O3s7Oz57Ozs5dMgzKWlzCBHRyDMpaXMIEdHgCYHGAb9+vfw7uj5///99u7u8/oDBhgHAEdHIP3W1v0gHx/44Lm54PgAgAEACAA3AAAbGgABAQEBAQMBAwECAgEDAQECAgECAgMCAwEDARobEQL4+c6np84bCgMDFRvW6O7u6NYjp84jSkqBGBQ0R0cgD+jo7wHo////+egYBwAw4Lm54AmAAQAIADoAAAACGBACgQakpCAwR0dHgg0HEhjT3Ojt7OxHR+zsGIOBGAkSJAi4uLjP38TE5+34/v7+/vz17d36R0eFAIABAAgAFAAACQgCAgECAQICAgIIuQDhEHq5APAACPch/ck/KT/3AACAAQAIAAwAAAUEAgECAgEE/IMA8CwEMrkA0AAAgAEACAAmAAASEQEBAwECAgECAgECAgMCAwEDAQSkpMsYB4EKBxjT5esgpMsgR0eABhDp6e8B6PmBB/noMOC5ueAJgAEACAAHAAADAgICAoABRxMAR4GAAQAIABQAAACCBkdHRzQTADKBB/7+PDwgFwf9gwCAAQAIAAsAAAUEAgIDAgKAA0cARyEC+LBHgYABAAgAEgAACAcBAgECAQMCAgcBSEg1FABISQf+PCAH/fiwAIABAAgADgAABgUCAgMCAwKABEcCSgZNBUcARwBHAIABAAgACgAABAMCAgMCgAJHAEeAAv5HAIABAAgACgAABAMCAgMCgAJHAEcDCQDqpIABAAgAJAAAERABAQICAQMBAwIBBAEEAQMEAhDn5+3/0Kmp0ADX8PDXCC/nLxD5HS41NQ7iuwAB6gbt7RRHAACAAQAIACoAABQTAAICAQICAQMCAQICAQMBAwEBBAIBGQiBDwgZ6sMKCgLxIEdHIPPywwqAEgcY/Q4UFO0I5dTNzfQgR0cA6qSAAQAIABIAAAgHAAIBAgECAQIHAtzcAv4kJP4H0vf0GRn099KAAQAIACYAAAARLCzy3QAX8fE5ORYqTjkAFAAZgQ/KyvXUyA0Z8/MYDcjU9MqsgwCAAQAIAEcAAAAC7e3mgRz61fz87OQxN7y0AAbp6e8U7u78BLu1LTZERMmkIIOBFfPzOjrIyA8PAQEPDwEBDw/IyDo68/OBB/PzADo6OsjIg4ABAAgADwAAAIID2goKL4OBBDEIAM72g4ABAAgAEAAAAAHW1oECMQoJg4EAyYEAL4QAgAEACAAyAAAYFwEBAgEBAQMBAwICAQECAQICAQMBAQMEAhfm5u34/dqzs9pHAP4DGOLz+vro4gYt5i0MJxwtNDQ0DeG6yuz0/YEI+ukF7OzsE0cAgAEACAAbAAANDAACAgEDAQIBAwEDAgMBGAaBCBEYPSBHRyA9EYACBxjpgQS6uuEgR4GAAQAIABcAAAsKAwMBAwMCAgECAgIKHvf3Hic3Pj43JxMIRyDhugD66RgHgYABAAgAJgAAEhEAAwEBAQEBAQQCAQMBAQEBAwIDEvn5+YEL+fkSNhlAQGdAQBk2gBASGPz2GRbpALq64esIKCBHAIABAAgAIgAAEA8DAwEBAQEDAwQBAQEBAQICDx329s/29h0kPT03Nz09NiQPRyAoCe3hugDpFxr5/RgHAIABAAgACgAABAMCAgICgAI9Rz0D/7lHAIABAAgACgAABAMCAgICgAL2AD0DR7n/AIABAAgABgAAAgECAoAAGwEj3IABAAgABgAAAgECAoAA/QEj3IABAAgABgAAAgECAoAA7QEj3IABAAgABgAAAgECAoAA6wH+t4ABAAgAGAAACwoCAQEBAgMBAQECAgr+/hExRCAgNFRnZwrc5vb+wNvl9f2/AACAAQAIABQAAAkIAgICAQMCAgECgAdHMxMiaVY1Zwjx1r608da+tAAAgAEACAAOAAAGBQIBAQECAgUBARQ0R0gF2uTz/L4AgAEACAAMAAAFBAICAgECgANHNBNIBPHWvbQAAIABAAgADAAABQQCAgMCAgQDSekvGATytfK1AACAAQAIAAgAAAMCAgICgAFHGwLytAAAgAEACAAFAAAAgAAygYOAAQAIAAUAAACAADKBg4ABAAgAKAAAExIAAwECAgICAQQCAQMCAgICAQMCEgjx8QDxAPHxCOoQN/o3+jc3EOqAERIY1RzYHuj/ubngHtgc1SBHAACAAQAIACUAABIRAgECAgECAgICAgICAgECAQMBAgQZCIEMCBkETABMAEwgBCBHR4EPBxjn+P/r/7dHABBHt7feIACAAQAIAGEAADIxAgEBAQICAQMCAQEBAQEBAQEBAQICAQEBAQEBAgMCAQEBAQEBAgEBAgECAQMBBAEDAQML0hwSBgBISCHRHBMHgyEGEhzSGdDa5err7KTLGdDa5erq6uPXzhkh0SFISBnKpKTLgg0IHD8hSNnZ2d/t9+Tt+YEA74IN+e3kwOC4Hx8fGA4JHAiBChAguLjf+khHIP/YAIABAAgAJQAAEhEBAgICAQMBAQICAgEDAQMCAgKAEPEA8fEDCN7w9a6u1RA3BTf1gANH0hnpggn66cDrxMTrGdJHAIABAAgAEAAABwYCAgICAgICBuoA6jEbMRYG3CMNI9zyAACAAQAIAAYAAAIBAgKAABsBI9yAAQAIACYAAAAQ///54v0AMg3oHSE5Ix3oDTGDEPPzHf/cCgo8Cgrd/x7z88DzgwCAAQAIABAAAAcGAgIDAgMCAgb1BeAn4CcLBjjxRv8l3QAAgAEACAAKAAAEAwICAwKAAgkACQMz7DHqgAEACAASAAAAggCpgQEaGoMH398yAM0fD++DAIABAAgAFAAAAAEZGYEDGRlvGYMH39/vDh/OADGDAIABAAgAKgAAAAUDAgsTGxyBChohHxgRDw8kJAsDgxLd3djT09O0EyEhISUqKio+6d3dgwCAAQAIAKkAAAAJ/f39wejoHw4IAoM/AggOAQcNDw8PDw0HAQ5hYa27zs7OzrutYVNAQEBAU+jj3dra2trd4+ja4efp6enp5+Ha6Ds7iJapqamplog7LQQaGhoaLYOBPzEI/s3x6Ojq8Pfr8ff4+Pj49/Hr9/Dq6OjoKSkpKTxKmKa5ubm5pphKPCkKCgwSGQwTGRoaGhoZEwwZEgwKCgoQSkpKSl1rucfa2trax7lrXUqDgAEACABMAAAmJQACAgECAgEEAgEBAQEBAQEBAQEBAQEBAgEDAQMBAwICAgMBAwEEARkIgSEIGdPsBwEAAgICAgABB+bt7urqpaXMIEdHIOwIveQILy/vgAMHGOn6gQjpGBgUFRv8AwSDEQQD/E3hurrhIEcATfrT0/omAIABAAgAcwAAAAIYEgeDI+DI+vr6+gEMEtjf6/Dv76mpqcDQGipBQUGkpOvr2NjV0NDTIEP/W/9c/1j/WwciIjBHR0dHMIOBCwYQGPr6/w3z4unw+4MV/vfvzs7h0bq6urrR4QBQJCQpNN7h7oEMR0dHMyO/x8fOvyAwR4OAAQAIACQAABEQAgECAgECAgICAgECAQMBBQICuRkIgQsIGQC5ASC5IEdHuQEQ2dng8drr8gDZACGrq9L6IasAgAEACAAqAAAUEwACAgEDAQEBAwEDAQIBAwEDAQMBARgHgQ8SGAsQIiIQCyP/2Nj/I0pKE8bN39Pq6urq09/GxhER6sihocjqgAEACAAGAAACAQICgABHAdoQgAEACAAKAAAEAwICAwID7DPOFANIAEgAgAEACAAGAAACAQECAd0kAUgAgAEACAAMAAAABNvbyxcog4EBQECEAIABAAgADAAAAATb2+s5KIOBAUBAhACAAQAIABQAAAAH2Nj1Ciff/SCDB+LiERHi4qXigwCAAQAIABIAAAAH6+vFHv3ePBSDgQRDQ2xDQ4QAgAEACAAqAAAUEwACAQEBAgECAQEBAgEBAwEDAQMBEwPs7OzsA/4UFBQU/gj47+/4CBERE+v5Av0GFBQG/QL56wgI/vju7vj+gAEACAAWAAAKCQABAgECAQECAQIJ6OQCFe4NGu7qEgnh4dvbDg4OEhLhgAEACAAMAAAAA9jlMyWDA+///++DAIABAAgABgAAAAIyAGWBhACAAQAIAAYAAAACIQBCgYQAgAEACAAGAAAAAvYA1YGEAIABAAgABAAAAAAFg4QAgAEACAAGAAAAAigAT4GEAIABAAgAAgAAAISEAIABAAgAJgAAABAmFP8ARkY7MQH68/M5OiMdJoMQg4OVxMXIysnJysjFxZWDg4ODAIABAAgABAAAAAABg4QAgAEACAACAAAAhIQAgAEACAAEAAAAAP2DhACAAQAIAAwAAAUEAgECAgEE/IMA8CwEMrkA0AAAgAEACAAsAAAVFAABAQEBAQECAgECAgECAgICAwEDAQekpKSwtaoYB4EKBxjT5esgpMsgR0eACe/79enp6e8B6PmBB/noMOC5ueAJAIABAAgAOgAAAAIYEAKBBqSkIDBHR0eCDQcSGNPc6O3s7EdH7OwYg4EYCRIkCLi4uM/fxMTn7fj+/v7+/PXt3fpHR4UAgAEACAAyAAAYFwABAgEBAQMBAwICAQECAQICAQMBAQMDAhfm5u34/dqzs9pHAP4DGOLz+vro4gYt5i0MJxwtNDQ0DeG6yuz0/YEI+ukF7OzsE0cAgAEACAAUAAAJCAICAQIBAgICAgi5AOEQerkA8AAI9yH9yT8pP/cAAIABAAgAKwAAAAnMzP//M7Kyy8sAQf9//38GycmZ+/sA24GBAM2BQACTAePMgUAAkYMAioSAAQAIACcAAAASHx8faWnnHh42NrPq6hvs7E8A6oGDQACQgQHM40AAkIEAzYEAioSAAQAIABQAAACCBUZGv/DwLYOBAf//QACNgQDBhACAAQAIABQAAAgHAgECAgEBAgIH/L3qoxUtT6MGMf8A5OQAKkD/YoABAAgAFAAACAcCAQECAQIDAYAGLe++1kaZRgb//zEA5AAqQP9iAAIAFAAAAeAC0AAEAAkAACExJREhAzERIREB4P40AcwU/lwBAs/9RAKo/VkAAgA6AAADCgLQABAAGwAAMxE0NjYzITIWFhURIxEhESMTIRE0JiMhIgYVETogNyEB4CE3IFH90lFRAi4XEP4gEBcCWCE3ICA3If2oAQf++QFYAQAQFxcQ/wD//wA6AAADCgOXAiYAAQAAAAcA7gGiAIz//wA6AAADCgOzAiYAAQAAAAcA7wGhAIz//wA6AAADCgNeAiYAAQAAAAcA6wGiAIz//wA6AAADCgOXAiYAAQAAAAcA7QGiAIz//wA6AAADCgPBAiYAAQAAAAcA8QGiAIz//wA6AAADCgPOAiYAAQAAAAcA8gGiAIwAAgA2AAAFRgLQABQAHwAAMzERNDY2MyEVIRUhFSEVIRUhESERETEhETQmIyEiBhU2IDchBJj9wAHP/jECQP1v/dICLhcQ/iAQFwJYITcgUe5S7lEBB/75AVgBABAXFxAAAwA7AAADCwLQABMAIwAzAAAzESEyFhYVFRQGBxYWFRUUBgYjITchMjY1NTQmIyEiBhUVFBYTITI2NTU0JiMhIgYVFRQWOwI5ITcgBwYWFiA3If2oeAHgEBcXEP4gEBcXEAHBEBYWEP4/EBcXAtAgNyGZDhsMITAZqCE3IFEXEKgQFxcQqBAXAUcXEJkQFxcQmRAXAAEAOAAAAwYC0AAVAAAzIiYmNRE0NjYzIRUhIgYVERQWMyEVsCE3ICA3IQJW/aoQFxcQAlYgNyEB4CE3IFEXEP4gEBdRAP//ADj/dQMGAtACJgAKAAAABgDzAAAAAgA6AAADCgLQAAsAGwAAMxEhMhYWFREUBgYjJSEyNjURNCYjISIGFREUFjoCWCE3ICA3If4gAeAQFxcQ/iAQFxcC0CA3If4gITcgURcQAeAQFxcQ/iAQFwAAAQA6AAACywLQAAsAADMRIRUhFSEVIRUhFToCkf3AAc/+MQJAAtBR7lLuUf//ADoAAALLA5cCJgANAAAABwDuAY4AjP//ADoAAALLA7MCJgANAAAABwDvAY0AjP//ADoAAALLA14CJgANAAAABwDrAY4AjP//ADoAAALLA5cCJgANAAAABwDtAY4AjAABADoAAALLAtAACQAAMxEhFSEVIRUhEToCkf3AAc/+MQLQUe5S/sEAAQA4AAADCALQACkAADMiJiY1ETQ2NjMhMhYWFRUjNTQmIyEiBhURFBYzITI2NTUjNSERFAYGI7AhNyAgNyEB4CE3IFEXEP4gEBcXEAHgEBeyAQMgNyEgNyEB4CE3ICA3IR0dEBcXEP4gEBcXELJS/vwhNyAAAAEAOQAAAxsC0AALAAAzETMRIREzESMRIRE5UQI/UlL9wQLQ/sEBP/0wAT/+wQABAEIAAACUAtAAAwAAMxEzEUJSAtD9MP//AD4AAACwA5cCJgAVAAAABwDuAG0AjP////UAAADmA7MCJgAVAAAABwDvAGwAjP///+gAAADyA14CJgAVAAAABwDrAG0AjP//ACkAAACcA5cCJgAVAAAABwDtAG0AjAABAAQAAALUAtAAFQAAMyImJjU1MxUUFjMhMjY1ETMRFAYGI3whNyBRFxAB4BAXUSA3ISA3ITk5EBcXEAJY/aghNyAAAAEAOQAAAugC0AAOAAAzETMRMwEzFQEBFSMBIxE5UugBDGj+0wEuaf706ALQ/sEBPwH+mf6ZAQE//sEAAAEAOQAAAwkC0QAFAAAzETMRIRU5UQJ/AtH9gFEAAAEAOAAAA2wC0AALAAAzETMBATMRIxEBARE4bwErAStvUf63/rcC0P6cAWT9MAJ0/nkBh/2MAAEAOAAAAwgC0AAJAAAzETMBETMRIwEROG8CEFFv/fAC0P2MAnT9MAJ0/Yz//wA4AAADCAPOAiYAHgAAAAcA8gGTAIwAAgA2AAADBgLQABMAIwAAMyImJjURNDY2MyEyFhYVERQGBiMlITI2NRE0JiMhIgYVERQWriE3ICA3IQHgITcgIDch/iAB4BAXFxD+IBAXFyA3IQHgITcgIDch/iAhNyBRFxAB4BAXFxD+IBAXAP//ADYAAAMGA5cCJgAgAAAABwDuAZ4AjP//ADYAAAMGA7MCJgAgAAAABwDvAZ0AjP//ADYAAAMGA14CJgAgAAAABwDrAZ4AjP//ADYAAAMGA5cCJgAgAAAABwDtAZ4AjP//ADYAAAMGA84CJgAgAAAABwDyAZ4AjAACADUAAAVFAtAAEwAjAAAzIiYmNRE0NjYzIRUhFSEVIRUhFSUhMjY1ETQmIyEiBhURFBatITcgIDchBJj9wAHP/jECQPtoAeAQFxcQ/iAQFxcgNyEB4CE3IFHuUu5RURcQAeAQFxcQ/iAQFwACADgAAAMIAs8ADQAdAAAzESEyFhYVFRQGBiMhERMhMjY1NTQmIyEiBhUVFBY4AlghNyAgNyH9+ScB4BAXFxD+IBAXFwLPITYh0yE2If70AV4WENMQFxcQ0xAWAAMANgAAA2QC0AAFABkAKQAAITU3FTMVISImJjURNDY2MyEyFhYVERQGBiMlITI2NRE0JiMhIgYVERQWAoaAXv1KITcgIDchAeAhNyAgNyH+IAHgEBcXEP4gEBcXJFcqUSA3IQHgITcgIDch/iAhNyBRFxAB4BAXFxD+IBAXAAMAOAAAAwgCzwAEABIAIgAAIQMzExUhESEyFhYVFRQGBiMhERMhMjY1NTQmIyEiBhUVFBYCmOtq7P01AlghNyAgNyH9+ScB4BAXFxD+IBAXFwEY/ukBAs8hNiHTITYh/vQBXhYQ0xAXFxDTEBYAAQAzAAADAwLQADkAADMiJiY1NTMVFBYzITI2NTU0JiMhIiYmNTU0NjYzITIWFhUVIzU0JiMhIgYVFRQWMyEyFhYVFRQGBiOrITcgURcQAeAQFxcQ/iAhNyAgNyEB4CE3IFEXEP4gEBcXEAHgITcgIDchIDchHBwQFxcQoRAWITYhoSE3ICA3IRwcEBcXEKEQFiE2IaEhNyAA//8AMwAAAwMDgQImACoAAAAHAPABngCMAAEAFAAAAuQC0AAIAAAhMREhNSEVIREBVP7AAtD+wQJ/UVH9gQAAAQA2AAADBgLQABYAADMiJiY1ETMRFBYzITI2NREzERQGBiMhriE3IFEXEAHgEBdRIDch/iAgNyECWP2oEBcXEAJY/aghNyD//wA2AAADBgOXAiYALQAAAAcA7gGeAIz//wA2AAADBgOzAiYALQAAAAcA7wGdAIz//wA2AAADBgNeAiYALQAAAAcA6wGeAIz//wA2AAADBgOXAiYALQAAAAcA7QGeAIwAAQAjAAADwgLQAAcAACExATMBATMBAcT+X18BcQFwX/5gAtD9fwKB/TAAAQAjAAAEfALQAA0AACExATMTEzMTEzMBIwMDASn++lbT0mLT0Vj++kfg4ALQ/b4CQv2+AkL9MAJn/ZkAAQAuAAAC9ALQABAAADMxNQEBNTMTEzMVAQEVIwMDLgEu/tJo+/po/tIBL2n6+wEBZwFnAf7XASkB/pn+mQEBKf7XAAABACAAAAMHAtAACQAAITERATMBATMBEQFr/rVdARcBFF/+tQEPAcH+oAFg/j/+8f//ACAAAAMHA5cCJgA1AAAABwDuAZIAjP//ACAAAAMHA14CJgA1AAAABwDrAZIAjAABADMAAAMDAtAACgAAMzE1ASE1IRUBIRUzAnT9jALQ/YwCdG8CEFFv/fBR//8AMwAAAwMDgQImADgAAAAHAPABmwCMAAIABAAAAtgC0QAJAA0AADMxNQEzESM1IQcTMSERBAJkcFP+lKrwASYBAtD9L8rKAR0BWAABADQAAAMFAtAAIgAAMyImJjURNDY2MyEyFhYXFyM1ISIGFREUFjMhNTMVDgIjIawhNyAgNyEB4BswJAcDUf34EBcXEAIITgckMBv+ICA3IQHgITcgHS4ZXnEXEP4gEBdxXhkuHQABADEAAAMBAtAADAAAMzE1IREhNSEVIREhFTEBP/7BAtD+wQE/UQIuUVH90lEAAQADAAACTALQAA0AADMxNSEyNjURMxEUBgYjAwHREBZSITYhURcQAlj9qCE3IAAAAQA2AAADBwLQAB8AADMxETMRFBYzITI2NREzERQGBxYWFREjETQmIyEiBhURNlEXEAHhEBdRLjU0LlEXEP4gEBcC0P7kEBYWEAEc/vkqMAoKMSn+/wEWDxcXD/7qAAEANgAABF0C0AAWAAAzMREhMhYWFREjETQmIyERIxE0JiMhETYDryE2IVIWEP6BUhYQ/poC0CA3If2oAlgQF/2BAlgQF/2BAAEANgAAAwYC0AAPAAAzMREhMhYWFREjETQmIyERNgJYITcgURcQ/fkC0CA3If2oAlgQF/2BAAMANgAAAwYC0AAEABgAKAAAATE1MxUBIiYmNRE0NjYzITIWFhURFAYGIyUhMjY1ETQmIyEiBhURFBYBc1L+6SE3ICA3IQHgITcgIDch/iAB4BAXFxD+IBAXFwE/UlL+wSA3IQHgITcgIDch/iAhNyBRFxAB4BAXFxD+IBAXAAMANv+PAwYC0AADABcAJwAABTUzFSUiJiY1ETQ2NjMhMhYWFREUBgYjJSEyNjURNCYjISIGFREUFgF1Uv7nITcgIDchAeAhNyAgNyH+IAHgEBcXEP4gEBcXcYGBcSA3IQHgITcgIDch/iAhNyBRFxAB4BAXFxD+IBAXAAACADYAAAMGAtAAHAAsAAAzEQUyFhYVFRQOAiMyHgIVFSM1NCYjISIGFRUTITI2NTU0JiMhIgYVFRQWNgJYITcgGSQkCgsjJBlRFxD+IBAXJwHgEBcXEP4gEBcXAtABITYh0xUeEwkJEx4V5uYPFxcP5gFeFhDTEBcXENMQFgABAC4AAAL+AtAAJwAAMzUhMjY1NTQmIyEiJiY1NTQ2NjMhFSEiBhUVFBYzITIWFhUVFAYGIy4CWBAWFhD+ICE3ICA3IQJY/agQFxcQAeAhNyAgNyFRFxChEBYhNiGhITcgURcQoRAWITYhoSE3IAAAAQA2AAADCQLRAAgAADMxETMRATMVATZTAhVr/Z0C0f2MAnMB/TEAAAEAMQAABJMC0AAQAAAzMREzEQEzFQMRATMVASMRATFSAhZp7wIWav2ecP7gAtD9jQJzAf7r/qMCcwH9MQFX/qkAAAEANgAAAwcC0AApAAAzETQ2NjMiJiY1ETMRFBYzITI2NREzERQGBiMyFhYVESMRNCYjISIGFRE3Jz8kJEAnURcQAeEQF1EoPyQkPydRFxD+IRAXAQEZLh0dLhkBB/7kEBYWEAEc/vkZLh0dLhn+/wEWDxcXD/7qAAEAMwAAAwMC0AAdAAAzMTUhMjY1NTQmIyEiJiY1ETMRFBYzIREzERQGBiMzAlgQFxcQ/iAhNyBRFxACB1EgNyFRFxChEBYhNiEBGf7nEBYBP/2oITcgAAABADEAAAMBAtAAJwAAMyImJjU1NDY2MyEyNjU1NCYjITUhMhYWFRUUBgYjISIGFRUUFjMhFakhNyAgNyEB4BAWFhD9qAJYITcgIDch/iAQFxcQAlggNyGhITYhFhChEBdRIDchoSE2IRYQoRAXUQAAAgA2AAADCgLRAAkADQAAMzERMwEVIychFRExIQE2cAJkbKv+lgEn/tkC0f0wAcrKAR0BWAAAAQAAAAACzALQAAgAACExATUzAREzEQJd/aNrAhBRAs8B/YwCdP0wAAEAAAAABGMC0AAQAAAhMQE1MwERAzUzAREzESMBEQJk/ZxsAhXwagIWUm/+4ALPAf2NAV0BFQH9jQJz/TABV/6pAAEANQAAAwUC0AAPAAAzIiYmNREzERQWMyERMxEhrSE3IFEXEAIHUf2oIDchAlj9qBAXAn/9MAAAAQA1AAAEXALQABYAADMiJiY1ETMRFBYzIREzERQWMyERMxEhrSE2IVIXDwF/UhYQAWZS/FEgNyECWP2oEBcCf/2oEBcCf/0wAAACADQAAAKDAkQAEgAZAAAzIiYmNTUhNTQmIyE1ITIWFhURJSE1IRUUFq0hNyEB/BcQ/isB1SI3If4qAYP+VhchNyHSgBAXUiE3If41UqeAEBf//wA0AAACgwMLAiYATwAAAAcA7gFvAAD//wA0AAACgwMnAiYATwAAAAcA7wFuAAD//wA0AAACgwLSAiYATwAAAAcA6wFvAAD//wA0AAACgwMLAiYATwAAAAcA7QFvAAD//wA0AAACgwM1AiYATwAAAAcA8QFvAAD//wA0AAACgwNCAiYATwAAAAcA8gFvAAAAAwA1AAAEfwJEABkAIAAqAAAzIiYmNTUhNTQmIyE1ITIWFhUVIRUWFjMhFSUhNSEVFBYlITU0JiMhIgYVriI3IAH8FxD+KwPRIjcg/gQBFw8B1fwvAYP+VhcB5QGqFxD+pBAXITch0oAQF1IhNyHShA8UUlKngBAX+YAQFxcQAAACADYAAAKFAwIADgAeAAAzMREzFSEyFhYVERQGBiMlITI2NRE0JiMhIgYVERQWNlIBhCE3ISE3If6kAVwQFxcQ/qQQGBgDAr4hNyH+riE3IVIXEAFSEBcXEP6uEBcAAQAzAAACggJEABYAADMiJiY1ETQ2NjMhFSEiBhURFBYzIRUhrCE3ISE3IQHU/iwQFxcQAdb+KiE3IQFSITchUhcQ/q4QF1L//wAz/3UCggJEAiYAWAAAAAYA87MAAAIAFwAAAmYDAgAOAB4AADMiJiY1ETQ2NjMhNTMRITUhMjY1ETQmIyEiBhURFBaRIjchITciAYNS/isBXBAXFxD+pBAXFyE3IQFSITchvvz+UhcQAVIQFxcQ/q4QFwACADMAAAKCAkQAFwAhAAAzIiYmNRE0NjYzITIWFhUVIRUUFjMhFSEDITU0JiMhIgYVrCE3ISE3IQFcIjch/gMXEAHW/ionAaoXEP6kEBchNyEBUiE3ISE3IdKAEBdSAUuAEBcXEP//ADMAAAKCAwsCJgBbAAAABwDuAVsAAP//ADMAAAKCAycCJgBbAAAABwDvAVoAAP//ADMAAAKCAtICJgBbAAAABwDrAVsAAP//ADMAAAKCAwsCJgBbAAAABwDtAVsAAAABADUAAAGCAwIAEQAAMzERNDY2MzMVIyIGFRUzFSMRNSA3ItTUEBf7+wKJIjcgUhcQRVL+DgACACn/GwJ3AkQAGwArAAAXMTUhMjY1NSEiJiY1ETQ2NjMhMhYWFREUBgYjASEyNjURNCYjISIGFREUFpQBahAX/n0hNyEhNyEBXCI3ICA3Iv6kAVwQFxcQ/qQQFxflUxcQayE3IQFSITchITch/coiNyEBNxcQAVIQFxcQ/q4QFwAAAQA2AAAChQMCABQAADMxETMVITIWFhURIxE0JiMhIgYVETZSAYQhNyFSFxD+pBAYAwK+ITch/jUByxAXFxD+NQAAAgA0AAAAhgMCAAQACQAAMzERMxEDMTUzFTRSUlICRP28ArBSUgABAEIAAACUAkQABAAAMzERMxFCUgJE/bwA//8APAAAAK4DCwImAGQAAAAGAO5rAP////MAAADkAycCJgBkAAAABgDvagD////mAAAA8ALSAiYAZAAAAAYA62sA//8AJwAAAJoDCwImAGQAAAAGAO1rAAAC/0X/DQC0AwIADQASAAAHMTUzMjY1ETMRFAYGIxMxNTMVu/UQF1MhNyInU/NTFxACvf1DIjchA6NSUgABADYAAAJ4AwIADwAAMzERMxEzNzMVAQEVIycjFTZSoORs/vkBBmvkoAMC/kn5Af7f/t8B+fkAAAEANAAAAQ8DAgANAAAzIiYmNREzERQWMzMVI60hNyFSFxBiYiE3IQKJ/XcQF1IAAAEANgAAA60CRAAcAAAzMREhMhYWFREjETQmIyMiBhURIxE0JiMjIgYVETYC/iI3IFEYEPEQF1MXEPIQFwJEITch/jUByxAXFxD+NQHLEBcXEP41AAEANgAAAoUCRAASAAAzMREhMhYWFREjETQmIyEiBhURNgHWITchUhcQ/qQQGAJEITch/jUByxAXFxD+NQD//wA2AAAChQNCAiYAbQAAAAcA8gFaAAAAAgAzAAACggJEABQAJAAAMyImJjURNDY2MyEyFhYVERQGBiMhNSEyNjURNCYjISIGFREUFqwhNyEhNyEBXCI3ISE3Iv6kAVwQFxcQ/qQQFxchNyEBUiE3ISE3If6uITchUhcQAVIQFxcQ/q4QF///ADMAAAKCAwkCJgBvAAAABwDuAVn//v//ADMAAAKCAyUCJgBvAAAABwDvAVj//v//ADMAAAKCAtACJgBvAAAABwDrAVn//v//ADMAAAKCAwkCJgBvAAAABwDtAVn//v//ADMAAAKCA0ACJgBvAAAABwDyAVn//gADADQAAAR+AkQAFwAoADMAADMiJiY1ETQ2NjMhMhYWFRUhFRQWMyEVITUxITI2NRE0JiMhIgYVERQWJTEhNTQmIyEiBhWtIjcgIDciA1giNyD+BBcQAdX8LwFcEBcXEP6kEBcXAeUBqhcQ/qQQFyE3IQFSITchITch0oAQF1JSFxABUhAXFxD+rhAX+YAQFxcQAAIANv8aAoUCRAAOAB4AABcxESEyFhYVERQGBiMhFRMhMjY1ETQmIyEiBhURFBY2AdYhNyEhNyH+fCgBXBAXFxD+pBAYGOYDKiE3If6uITch5gE4FxABUhAXFxD+rhAXAAIAFP8aAmMCRAAOAB4AAAUxNSEiJiY1ETQ2NjMhEQEhMjY1ETQmIyEiBhURFBYCEf59IjchITciAdX+KwFcEBcXEP6kEBcX5uYhNyEBUiE3IfzWATgXEAFSEBcXEP6uEBcAAQA0AAAB8wJEAA0AADMxETQ2NjMhFSEiBhURNCE3IQFG/roQFwHLITchUhcQ/jUAAQAwAAACfwJEADoAADMiJiY1NTMVFBYzITI2NTU0JiMhIiYmNTU0NjYzITIWFhUVIzU0JiMhIgYVFRQWMyEyFhYVFRQGBiMhqSE3IVIXEAFcEBcXEP6kITchITchAVwiNyFTFxD+pBAXFxABXCI3ISE3Iv6kITchCAgQFxcQWRAXITchWSE3ISE3IQgIEBcXEFkQFyE3IVkhNyH//wAwAAACfwL0AiYAeQAAAAcA8AFV//8AAQA5AAADEALQAC4AADMxETQ2NjMhMhYWFxUUBxYVFRQGBiMhNSEyNjU1NCYjITUhMjY1NTQmIyEiBhUROSA3IgHlHDIkBx4eITch/oUBexAXFxD+hQF7EBcXEP4bEBcCViI3IR0vGqMoKScprSE3IVIXEK0QF0cXEJoQFxcQ/asAAAEANQAAAYIDAgARAAAzIiYmNREzFTMVIxEUFjMzFSOuIjcgUvv7FxDU1CE3IQKJvlL+hxAXUgAAAQA1AAAChAJEABYAADMiJiY1ETMRFBYzITI2NREzERQGBiMhriE3IVIXEAFcEBhSITci/qQhNyEBy/41EBcXEAHL/jUhNyH//wA1AAAChAMLAiYAfQAAAAcA7gFdAAD//wA1AAAChAMnAiYAfQAAAAcA7wFcAAD//wA1AAAChALSAiYAfQAAAAcA6wFdAAD//wA1AAAChAMLAiYAfQAAAAcA7QFdAAAAAQAVAAAC9QJEAAcAACExATMBATMBAVX+wGABEAEQYP6/AkT+DAH0/bwAAQAjAAAEFgJEAA0AACExAzMTEzMTEzMDIwMDAQfkWLC7bMekWdtH2M0CRP5QAbD+UQGv/bwB3/4hAAEALgAAAn8CRAAQAAAzMTUTAzUzFzczFQMTFSMnBy7y8my8vWvy82y9vAEBJgEcAdzcAf7k/toB6OgAAAEAKv8aAngCQgAdAAAXMTUhMjY1NSEiJiY1ETMRFBYzITI2NREzERQGBiOVAWoQF/59ITchUhcQAVwQF1IgNyLmUxcQbCE3IQHJ/jcQFxcQAcn9UiI3If//ACr/GgJ4AwsCJgCFAAAABwDuAVEAAP//ACr/GgJ4AtICJgCFAAAABwDrAVEAAAABADYAAAKFAkQACgAAMzE1ASE1IRUBIRU2AfX+CwJP/gsB9XABglJw/n5S//8ANgAAAoUC9QImAIgAAAAHAPABVgAAAAIAMwAAAoICRAAQAB0AADMiJiY1ETQ2NjMhMhYWFREhNSERNCYjISIGFREUFqwhNyEhNyEBXCI3If4qAYMXEP6kEBcXITchAVIhNyEhNyH+NVIBeRAXFxD+rhAXAAABADYAAAKFAwIAGQAAMzERMxEhMjY1NTMVFAYHFhYVFSM1NCYjIRU2UgGEEBdSEA0NEFIXEP58AwL+SRcQ0tITKhMTKhPS0hAX+QAAAQA1AAAChAJEAA8AADMiJiY1ETMRFBYzIREzESGuITchUhcQAYRS/iohNyEBy/41EBcB8v28AAABADUAAAOsAkQAHAAAMyImJjURMxEUFjMzMjY1ETMRFBYzMzI2NREzESGvIjchUhgQ8RAXUhcQ8xAXUv0DITchAcv+NRAXFxABy/41EBcXEAHL/bwAAAEANgAAAoUCRAAmAAAzMTU0NjcmJjU1MxUUFjMhMjY1NTMVFAYHFhYVFSM1NCYjISIGFRU2EA0NEFIYEAFcEBdSEA0NEFIXEP6kEBjSEyoTEyoT0tIQFxcQ0tITKhMTKhPS0hAXFxDSAAABADMAAAKCAkQAKAAAMyImJjU1NDY2MyEyNjU1NCYjITUhMhYWFRUUBgYjISIGFRUUFjMhFSGsITchITchAVwQFxcQ/isB1SI3ISE3Iv6kEBcXEAHW/iohNyFZITchFxBZEBdSITchWSE3IRcQWRAXUgACADUAAAKjAkQAEAAbAAAzMRE0NjYzITIWFhURIzUhFTUxITU0JiMhIgYVNSE3IQF8ITchUv42AcoXEP6EEBcByyE3ISE3If41oKDz2BAXFxAAAwA2AAACjwJFABMAIwAzAAAzMREhMhYWFRUUBgcWFhUVFAYGIyUhMjY1NTQmIyEiBhUVFBY3ITI2NTU0JiMhIgYVFRQWNgHAIjchCAUWFiE3If6ZAWcQFxcQ/pkQFxcQAUcQFxcQ/rkQFxcCRSE3IV0OGwwiMBlWITchUhcQVhAXFxBWEBf2FxBdEBcXEF0QFwABADMAAAKAAkUAFgAAMyImJjURNDY2MyEVISIGFREUFjMhFSGsITchITchAdT+LBAXFxAB1P4sITchAVMhNyFSFxD+rRAXUgACADYAAAKPAkUADAAcAAAzMREhMhYWFREUBgYjJSEyNjURNCYjISIGFREUFjYB4CE3ISE3If6ZAWcQFxcQ/pkQFxcCRSE3If6tITchUhcQAVMQFxcQ/q0QFwABADYAAAJFAkUADAAAMzERIRUhFSEVIRUhFTYCD/5DAUv+tQG9AkVSqFKnUgAAAQA2AAACRQJFAAoAADMxESEVIRUhFSEVNgIP/kMBS/61AkVSqFL5AAEAMwAAAoICRQAqAAAzIiYmNRE0NjYzITIWFhUVIzU0JiMhIgYVERQWMyEyNjU1IzUhFRQGBiMhrCE3ISE3IQFcIjchUxcQ/qQQFxcQAVwQF7MBBiE3Iv6kITchAVMhNyEhNyEODhAXFxD+rRAXFxBgUrIhNyEAAAEANgAAApYCRAAMAAAzMREzFSE1MxEjNSEVNlIBvFJS/kQCRPn5/bz5+QAAAQA2AAAAiAJEAAQAADMxETMRNlICRP28AAABAAUAAAJeAkQAFgAAMyImJjU1MxUUFjMhMjY1ETMRFAYGIyF+ITchUhcQAWcQF1IhNyH+mSE3ITAwEBcXEAHL/jUhNyEAAQA2AAACeAJEAA8AADMxETMVMzczFQEBFSMnIxU2UqDkbP75AQZr5KACRPn5Af7f/t8B+fkAAQA2AAACjwJEAAYAADMxETMRIRU2UgIHAkT+DlIAAQA2AAADCQJFAAwAADMxETMTEzMRIxEBARE2bvv5cVL+6P7pAkX+mgFm/bsB+f5yAY7+BwAAAQA2AAACjwJEAAoAADMxETMBETMRIwERNm8BmFJv/mgCRP4YAej9vAHp/hcAAAIAMwAAAoICRAAUACQAADMiJiY1ETQ2NjMhMhYWFREUBgYjITUhMjY1ETQmIyEiBhURFBasITchITchAVwiNyEhNyL+pAFcEBcXEP6kEBcXITchAVIhNyEhNyH+riE3IVIXEAFSEBcXEP6uEBcAAgA2AAAChQJEAA4AHgAAMzERITIWFhUVFAYGIyEVEyEyNjU1NCYjISIGFRUUFjYB1iE3ISE3If58KAFcEBcXEP6kEBgYAkQhNyGCITch0AEiFxCCEBcXEIIQFwADADMAAALhAkQAAwAYACgAACE3MxUhIiYmNRE0NjYzITIWFhURFAYGIyE1ITI2NRE0JiMhIgYVERQWAfJrhP3LITchITchAVwiNyEhNyL+pAFcEBcXEP6kEBcXUlIhNyEBUiE3ISE3If6uITchUhcQAVIQFxcQ/q4QFwAAAgA2AAAChwJEABMAIwAAMzERITIWFhUVFAYGIyMXFSMnIxUTITI2NTU0JiMhIgYVFRQWNgHVIjcgIDcia+dp5LInAVwQFxcQ/qQQFxcCRCE3IYIhNyHPAdDQASIXEIIQFxcQghAXAAABADEAAAKAAkQAOgAAMyImJjU1MxUUFjMhMjY1NTQmIyEiJiY1NTQ2NjMhMhYWFRUjNTQmIyEiBhUVFBYzITIWFhUVFAYGIyGqITchUhcQAVwQFxcQ/qQhNyEhNyEBXCI3IVMXEP6kEBcXEAFcIjchITci/qQhNyESEhAXFxBZEBchNyFZITchITchEhIQFxcQWRAXITchWSE3IQABABYAAAJvAkQACAAAITERITUhFSERARr+/AJZ/v0B8lJS/g4AAAEANQAAAoQCRAAWAAAzIiYmNREzERQWMyEyNjURMxEUBgYjIa4hNyFSFxABXBAYUiE3Iv6kITchAcv+NRAXFxABy/41ITchAAEAFQAAAwACRAAHAAAhMQEzAQEzAQFc/rlhARUBFWD+ugJE/g0B8/28AAEAIgAABBwCRAANAAAhMQMzExMzExMzAyMDAwEK6FizwGTLqFjdSNjNAkT+UQGv/lIBrv28AdP+LQABAC4AAAJ/AkQAEAAAMzE1EwM1Mxc3MxUDExUjJwcu8vJsvLxs8vNsvbwBAScBGwHb2wH+5f7ZAenpAAABABIAAAKFAkQACQAAITE1ATMTEzMBFQEi/vBg2dlh/vDIAXz+5QEb/oTIAAEANgAAAoUCRAAKAAAzMTUBITUhFQEhFTYB9f4LAk/+CwH1cAGCUnD+flIAAwA5AAADEALQABQAGwAiAAAzIiYmNRE0NjYzITIWFhURFAYGIyEnMSEyNjURATEBISIGFbIiNyAgNyIB5SE3ISE3If4bHQICEBf9zQIo/f8QFyE3IQHdIjchITci/iMhNyFSFxABof6bAcgXEAABAAEAAAEuAtAABwAAMzERByM3MxHbb2u9cAJ0heH9MAAAAQA5AAADEALRAC0AADMxETQ2NjMhMjY1NTQmIyEiBhUVIzU0NjYzITIWFhUVFAYGIyEiBhUVFBYzIRU5IDciAeUQFxcQ/hsQF1IgNyIB5SE3ISE3If4bEBcXEAJeAQ4iNyAXEKkQFxcQHBwiNyEhNyKpITchFxCVEBdSAAEANQAAAw0C0QA5AAAzIiYmNTUzFRQWMyEyNjU1NCYjITUhMjY1NTQmIyEiBhUVIzU0NjYzITIWFhUVFAYHFhYVFRQGBiMhryI3IVMXEAHlEBcXEP4rAbUQFxcQ/jsQF1MhNyIBxSI3IAcFGRMhNyH+GyE3IRAQEBcXEKcQF1IXEJcQFxcQGhoiNyEhNyKXDhsLGDoapyE3IQACAAYAAAK+AtEACwAPAAAhMTUhNQEzETMVIxUBMSERAfz+CgHsXHBw/iEBjbpcAbv+O1K6AQwBVgAAAQA5AAADEALRACkAADMiJiY1NTMVFBYzITI2NTU0JiMhESEVISIGFRUUFjMhMhYWFRUUBgYjIbIiNyBSFxAB5RAXFxD9ogLX/aIQFxcQAeUhNyEhNyH+GyE3IR0dEBcXEKoQFwGHUxcQkxAYIDciqiE3IQACADkAAAMQAtEAHgArAAAzIiYmNRE0NjYzIRUhIgYVFRQWMyEyFhYVFRQGBiMhNSEyNjU1NCYjIRUUFrIiNyAgNyIB4P4gEBcXEAHlITchITch/hsB5RAXFxD99BchNyEB3iI3IVMXEJAQGCA3Iq0hNyFSFxCtEBfUEBcAAQADAAACXALRAA0AACExETQmIyE1ITIWFhURAgoXEP4gAeAhNyECVxAXUyE3Iv2pAAADADkAAAMQAtEAIAAxAEIAADMiJiY1NTQ2NyYmNTU0NjYzITIWFhcVFAcWFRUUBgYjITUxITI2NTU0JiMhIgYVFRQWEzEhMjY1NTQmIyEiBhUVFBayIjcgEA4OECA3IgHlHDElBx4eITch/hsB5RAXFxD+GxAXFxAB5RAXFxD+GxAXFyE3IaoUKRMTKhSTIjchHS8apygpJymqITchUhcQqhAXFxCqEBcBPxcQnhAXFxCeEBcAAAIAMwAAAwsC0QAhAC8AADMiJiYnITI2NTU0JiMhIiYmNTU0NjYzITIWFhURFAYGIyERMSE1NCYjISIGFRUUFq0aLyIIAlgQFxcQ/hsiNyEhNyIB5SE3ISE3If4bAgwXEP4bEBcXFSUYFxCREBchNyGtIjchITci/iIhNyEBg9QQFxcQrRAXAAABADEAAAMHAtEAHAAAMyImJycBNSEiBhUVIzU0NjYzITIWFhcVARUhFSGpK0IKAQKE/fYQF1MhNyIB5RsxJAf9fQKD/aI4J3QBR2QXECoqIjchHS8ag/64TlIAAAEACQAAAsEC0QAQAAAhMTUhNQEzFQEhNTMVMxUjFQH//goBeVv+ggGgUnBwul0Buh/+Wp2dUroAAQAuAAADAQLQAAgAADMxNQEhNSEVATICH/3dAtP9nQECfVIC/TIAAAIADAAAAuQCzwAVACMAACExETQmIyEiJiY1NTQ2NjMhMhYWFREBMSE1NCYjISIGFRUUFgKSFxD+GyI3ISE3IgHlITch/aICDBcQ/hsQFxcBCBAXITchrSI3ISE3Iv2rAYHUEBcXEK0QFwABADYAAACIAFIABAAAMzE1MxU2UlJSAAABADb/fQCIAFIABwAAFzE1MxUUBgY2UhUlg9ViGy4iAAIANgAAAIgCTAAEAAkAABMxNTMVAzE1MxU2UlJSAfpSUv4GUlIAAgAz/30AhQJMAAcADAAAFzE1MxUUBgYDMTUzFTNSFSUYUoPVYhsuIgJ1UlIAAAMANgAAAgIAUgAEAAkADgAAMzE1MxUzMTUzFTMxNTMVNlNrUmpSUlJSUlJSAAACADoAAACMAtAABAAJAAA3MREzEQcxNTMVOlJSUssCBf37y1JSAAIANQAAAIcC2AAEAAkAADMxETMRAzE1MxU1UlJSAgX9+wKFU1MAAgAfAAACnQLQAB8AJAAANzE1NDY2MyEyNjU1NCYjITUFMhYWFRUUBgYjISIGFRUHMTUzFZkhNyEBEhAXFxD9+wIFITchITch/u4QF1JSySoiNyAXEMIQF1QBITciwiE3IRcQKslSUgACABMAAAKQAtgAHwAkAAAzIiYmNTU0NjYzITI2NTUzFRQGBiMhIgYVFRQWMyEXIQExNTMVjCI3ICA3IgEREBdSIDci/u8QFxcQAgMB/fwBOFIhNyHCIjchFxAwMCI3IRcQwhAXUgKFU1MAAQCQAUUA4gGTAAwAABMiNTU0MzMyFRUUIyOsHBwZHR0ZAUUcFR0dFRwAAQAZATsBwgLPAA8AABMxJzcnNxc1MxU3FwcXByeTQ1qRGJNSkRuSWkJbATsvfi9PMZqZME8vfTB7AAIAIAAAAwUCzwAcACEAADMxNyM1MzcjNTM3MwchNzMHMxUjBzMVIwcjNyEHNzEhNyFPNmV/R6bAOFE5AQU4UTlgeUefuTVSNv78NVABA0f+/KtS3FKkpKSkUtxSq6ur/dwAAQAGAAACAALQAAYAADMxNQE3FQEGAfMH/g5qAl4IaP2iAAEABQAAAgAC0AAGAAAhMQE1MwEXAfz+CQYB9AECbWP9m2sAAAIAGwAAAocC0AAlACoAADcxNTQ2NjMzMjY1NTQmIyEVIzU+AjMhMhYWFRUUBgYjIyIGFRUHMTUzFcwhNyLIEBcXEP5fUgcjMRwBfCE3ISE3IcgQF1NTl10iNyAXEMIQF3JgGi4dITciwiE3IRcQXZdSUgAAAQA0AAAAygLQABYAADMiJiY1ETQ2NjMzFSMiBhURFBYzMxUjrSE3ISE3IR0dEBcXEB0dITchAd0iNyFTFxD+IxAXUgABADgAAADOAtAAFgAAMzE1MzI2NRE0JiMjNTMyFhYVERQGBiM4HBAXFxAcHCE4ISE4IVIXEAHdEBdTITci/iMhNyEAAAEAFwAAANwC0AAdAAAzIiYmNTUnNTc1NDY2MzMVIyIGFRUHFxUUFjMzFSO/ITchLy8hNyEdHRAXVFQXEB0dITchox1gGaQiNyFTFxCrQ0WqEBdSAAEAMwAAAPcC0AAdAAAzMTUzMjY1NTcnNTQmIyM1MzIWFhUVFxUHFRQGBiMzHRAXVFQXEB0dITchLi4hNyFSFxCpRUKtEBdTITcipBtfHaIhNyEAAAEANgAAAMwC0QAIAAAzMREzFSMRMxU2lkREAtFT/dRSAAABADMAAADJAtEACAAAMzE1MxEjNTMRM0NDllICLFP9LwAAAQA7AP8BwQFRAAQAADcxNSEVOwGG/1JSAAABADYA/gKPAVAABAAANzE1IRU2Aln+UlIAAAEANgD+AwcBUAAEAAA3MTUhFTYC0f5SUgAAAQA2/64DDgAAAAQAABcxNSEVNgLYUlJSAAACAC8B9gE2AssABwAPAAATMTU0NjY3FTMxNTQ2NjcVLxUmGGIVJRgB9mIbLyIH1WIbLyIH1QACADYB/AE9AtEABwAPAAATMTUzFRQGBhcxNTMVFAYGNlMVJp1SFSUB/NViGy8iB9ViGy8iAAABACEB9wB0AswABwAAEzE1NDY2NxUhFSYYAfdiGy8iB9UAAQA2AfwAiALRAAcAABMxNTMVFAYGNlIVJQH81WIbLyIAAAIAOwJEASgC0AAEAAkAABMxNTMVIzE1MxXWUu1SAkSMjIyMAAEAOwJEAI0C0AAEAAATMTUzFTtSAkSMjAAAAQAjAAAC+QLRACYAACEiJiY1NSM1MzUjNTM1NDY2MyEVISIGFRUhFSEVIRUhFRQWMyEVIQEGIjchaWlpaSE3IgHz/g0QFwGo/lgBqP5YFxAB8/4NITchbVJnU2UiNyFTFxBlU2dSbRAXUgAAAgAh/40CbQLWABgAIgAABTE1IyImJjURNDY2MzM1MxUzFSMRMxUjFSczESMiBhURFBYBH4UiNyAgNyKFUvz8/PzXhYUQFxdzcyE3IQFcIjchh4dT/lZSc8UBqhcQ/qQQFwADACL/jgL6A0MANgBAAEsAAAUxNSMiJiY1NTMVFBYzMzUjIiYmNTU0NjYzMzUzFTMyFhYHByM1NCYjIxUzMhYWFRUUBgYjIxUBMzUjIgYVFRQWATE3MjY1NTQmIyMBZcshNyBRFxDLyyE3ICA3IctSySE4IQEBURcQyckhOCEgNyHL/uPLyxAXFwEtyg8XGA/JcnIgNyEcHBAX7iE2IaEhNyBzcyA3IRwbEBjtITchoSE3IHICA+4XEKEQFv7AARcQoBAXAAABACcAAAKzAtAAIgAAMzE1MzUjNTM1NDY2MyEyFhYVFSM1NCYjISIGFRUhFSEVIRUnaWlpITciAS8hNyJTFxD+0RAXAWD+oAHQUvFSwSI3ISE3Ig8PEBcXEMFS8VIAAQARAGQBlwHqAAwAADcxNSM1MzUzFTMVIxWpmJhSnJxkm1KZmVKbAAEAOwD/AcEBUQAEAAA3MTUhFTsBhv9SUgAAAQA1AF8B3gH6ABAAADcxNzcnJzMXNzMHBxcXIycHNgaYnANsaWpqBJqYBmpqaV8IxskEkJAFyMcHkJAAAwASAAEB7AJDAAQACQAOAAA3MTUhFQUxNTMVAzE1MxUSAdr+61JSUv9SUv5SUgHwUlIAAAIAOwCXAkABsQAEAAkAABMxNSEVBTE1IRU7AgX9+wIFAV9SUshSUgABADsADgHNAj4ABwAANzE1JSU1BRU7AUD+wAGSDl+5uV/nYQABAAUAEAGXAkAABwAAJTElNSUVBQUBl/5uAZL+wAFAEOhh51+5uQAAAQAYAPUBawFiABIAACUiJyYjIgc1NjMyFxYzMjcVBiMBKSNDQyonFxsjKEhIGiAjIx/1JCMIJQkjJBApDQAFADD//wOkAtEABgAbACwAQQBSAAAzMTUBNxUBEyImJjU1NDY2MzMyFhYVFRQGBiMjJzEzMDAxNTAwMSMwMDEVMDABIiYmNTU0NjYzMzIWFhUVFAYGIyMnMTMwMDE1MDAxIzAwMRUwMIkCzAz9ORAiNyEhNyJeIjchITciXj3Y2AJfIjcgIDciXyE3ISE3IV8819dsAlsKa/2pAXohNyFUIjchITciVCE3IT3MzP45ITchVSE3ISE3IVUhNyE9zc0AAAIANgAAAw0C0AAvADwAADMiJiY1ETQ2NjMhMhYWFREhIiYmNTU0NjYzMzIWFhUVMxE0JiMhIgYVERQWMyEVITczNTQmIyMiBhUVFBavIjcgIDciAeUhNyH+ZSI3ICA3Il8hNyFxFxD+GxAXFxACXv2irrAXEIkQFxchNyEB3SI3ISE3Iv5qITciVCE3ISE3IZABWBAXFxD+IxAXUv6lEBcXEH4QFwACADUAAAOSAs8AKQA2AAAzIiYmNTU0NjMmNTU0NjYzITIWFhcVIzU0JiMhIgYVFQE1MxUXFScGBiMlITI2NwEjIgYVFRQWriE3ITYtOSE3IQGbHDIlB1MXEP5lEBcCCVKGiRBAJv4bAeUKFwf+Ag8QFxchNyHXFisrNWQiNyEdLxo3IhAXFxCL/vmLpk9ITSk0UhQQAQEXENcQFwADADgAAAMPAtAAEgAcACEAACExESEiJiY1NTQ2NjMhESMRIxEBIREhIgYVFRQWITEzESMB4f7QIjcgIDciAl5Siv5+ATD+0BAXFwGSiooBDyE3Ic4hOCH9MAEP/vEBYQEcFxDOEBcBHAAAAgAtAZEBfwLYABQAJAAAEyImJjU1NDY2MzMyFhYVFRQGBiMjJzMyNjU1NCYjIyIGFRUUFqciNyEhNyJeIjchITciXhaKEBcXEIoQFxcBkSE3IVQiNyEhNyJUITchPRcQfhAXFxB+EBcAAAEANv+NAIgDSgAEAAAXMREzETZScwO9/EMAAv97AoAAhQLSAAQACQAAEzE1MxUhMTUzFTJT/vZTAoBSUlJSAAAB/9YCgAApAtIAAwAAAzUzFSpTAoBSUgAB/7wCgAAvAwsABAAAAzEnMxchI1EiAoCLiwAAAf/RAoAAQwMLAAQAAAMxNzMHLyNPIgKAi4sAAAH/iQKeAHoDJwAHAAADMTczFyMnB3dRT1E+OjwCnomJaWkAAAH/mwKAAGQC9QAHAAADMSczFzczBx1IKjw6KUYCgHVVVXUAAAL/rgKVAFIDNQAPAB8AAAMiJjU1NDYzMzIWFRUUBiMnMzI2NTU0JiMjIgYVFRQWHBYgIBY4FiAgFj1CBAUFBEIEBQUClR8WNhYfHxY2Fh8oBgQ8BAYGBDwEBgAAAf9WAqcAqgNCAA4AABMiJyYjIzUzMhcWMzMVI241RUM1JjoqRUUxNTwCpy0tQS0tQQABAW//dQHlABAAAwAABTczBwFvJ08mi5ub//8AZAKAAW4C0gAHAOsA6QAA//8ASgKAAJ0C0gAGAOx0AP//AGYCgADZAwsABwDtAKoAAP//ADwCgACuAwsABgDuawD//wBkAp4BVQMnAAcA7wDbAAD//wAwAoAA+QL1AAcA8ACVAAAAAQAoA2gA4QOrABAAABMiJiczFBYzMzI2NTMGBiMjaR4iASALClcHBx8BIR83A2goGxEREREbKP//ACIDAQDGA6EABgDxdGz//wAgAqcBdANCAAcA8gDKAAAAAQBXAn4BmwLQAAQAABMxNSEVVwFEAn5SUv//AC//dQClABAABwDz/sAAAAABAL3/BgE3/+8ABAAAFzE1MxW9evrp6QABAC4AAAMBAtAACAAAMzE1ASE1IRUBMgIf/d0C0/2dAQJ9UgL9MgAAAgAMAAAC5ALPABUAIgAAIRE0JiYjISImJjU1NDY2MyEyFhYVEQEhNTQmIyEiBhUVFBYCkgsSCv4bIjchITciAeUhNyH9ogIMFxD+GxAXFwEIChILITchrSI3ISE3Iv2rAYHUEBcXEK0QFwAAAQAxAAADBwLRABwAADMiJicnATUhIgYVFSM1NDY2MyEyFhYXFQEVIRUhqStCCgEChP32EBdTITciAeUbMSQH/X0Cg/2iOCd0AUdkFxAqKiI3IR0vGoP+uE5SAAACABsAAAKHAtAAJAAoAAA3NTQ2NjMzMjY1NTQmIyEVIzU+AjMhMhYWFRUUBgYjIyIGFRUHNTMVzCE3IsgQFxcQ/l9SByMxHAF8ITchITchyBAXU1OXXSI3IBcQwhAXcmAaLh0hNyLCITchFxBdl1JSAAABAAkAAALBAtEAEAAAITE1ITUBMxUBITUzFTMVIxUB//4KAXlb/oIBoFJwcLpdAbof/lqdnVK6AAEAAAAABGMC0AAQAAAhMQE1MwERAzUzAREzESMBEQJk/ZxsAhXwagIWUm/+4ALPAf2NAV0BFQH9jQJz/TABV/6pAAEAMQAABJMC0AAQAAAzMREzEQEzFQMRATMVASMRATFSAhZp7wIWav2ecP7gAtD9jQJzAf7r/qMCcwH9MQFX/qkAAAEANgAAAwkC0QAIAAAzMREzEQEzFQE2UwIVa/2dAtH9jAJzAf0xAAACAAQAAALYAtEACQANAAAzMTUBMxEjNSEHEzEhEQQCZHBT/pSq8AEmAQLQ/S/KygEdAVgAAgA2AAADCgLRAAkADQAAMzERMwEVIychFRExIQE2cAJkbKv+lgEn/tkC0f0wAcrKAR0BWAAAAA==") format("truetype");\r\n  font-weight: 400;\r\n  font-style: normal;\r\n  font-display: swap;\r\n}\r\n\r\n/* Orbitron display font for digital readouts */\r\n.orbitron-display {\r\n  font-family: "Orbitron", sans-serif;\r\n  font-optical-sizing: auto;\r\n  font-weight: 400;\r\n  font-style: normal;\r\n}\r\n\r\n/* Override GeoFS default positioning for our assistant menu */\r\n.geofs-efi-list {\r\n  position: relative !important;\r\n  left: auto !important;\r\n  top: auto !important;\r\n  transform: none !important;\r\n}\r\n\r\n/* Custom scrollbar styling for assistant menu */\r\n.geofs-efi-list::-webkit-scrollbar {\r\n  width: 6px;\r\n}\r\n\r\n.geofs-efi-list::-webkit-scrollbar-track {\r\n  background: transparent;\r\n}\r\n\r\n.geofs-efi-list::-webkit-scrollbar-thumb {\r\n  background-color: #4b5563;\r\n  border-radius: 3px;\r\n}\r\n\r\n.hover\\:cursor-pointer:hover {\n  cursor: pointer;\n}\r\n\r\n.hover\\:bg-amber-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(180 83 9 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-blue-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-blue-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-emerald-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 120 87 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-gray-300:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-gray-400\\/50:hover {\n  background-color: rgb(156 163 175 / 0.5);\n}\r\n\r\n.hover\\:bg-gray-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-gray-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-green-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-orange-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(194 65 12 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-red-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:bg-yellow-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(161 98 7 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.hover\\:text-gray-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity, 1));\n}\r\n\r\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n\r\n.focus\\:ring-0:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\r\n\r\n.group\\/engine[open] .group-open\\/engine\\:rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n\r\n.group[open] .group-open\\:rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n\r\n.dark\\:border-amber-700\\/50:is(.dark *) {\n  border-color: rgb(180 83 9 / 0.5);\n}\r\n\r\n.dark\\:border-blue-700\\/50:is(.dark *) {\n  border-color: rgb(29 78 216 / 0.5);\n}\r\n\r\n.dark\\:border-gray-600:is(.dark *) {\n  --tw-border-opacity: 1;\n  border-color: rgb(75 85 99 / var(--tw-border-opacity, 1));\n}\r\n\r\n.dark\\:border-green-700\\/50:is(.dark *) {\n  border-color: rgb(21 128 61 / 0.5);\n}\r\n\r\n.dark\\:border-red-700:is(.dark *) {\n  --tw-border-opacity: 1;\n  border-color: rgb(185 28 28 / var(--tw-border-opacity, 1));\n}\r\n\r\n.dark\\:border-yellow-800:is(.dark *) {\n  --tw-border-opacity: 1;\n  border-color: rgb(133 77 14 / var(--tw-border-opacity, 1));\n}\r\n\r\n.dark\\:bg-amber-900\\/30:is(.dark *) {\n  background-color: rgb(120 53 15 / 0.3);\n}\r\n\r\n.dark\\:bg-black:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.dark\\:bg-black\\/30:is(.dark *) {\n  background-color: rgb(0 0 0 / 0.3);\n}\r\n\r\n.dark\\:bg-black\\/70:is(.dark *) {\n  background-color: rgb(0 0 0 / 0.7);\n}\r\n\r\n.dark\\:bg-blue-800\\/50:is(.dark *) {\n  background-color: rgb(30 64 175 / 0.5);\n}\r\n\r\n.dark\\:bg-blue-900\\/30:is(.dark *) {\n  background-color: rgb(30 58 138 / 0.3);\n}\r\n\r\n.dark\\:bg-gray-600:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.dark\\:bg-gray-700:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.dark\\:bg-gray-800\\/60:is(.dark *) {\n  background-color: rgb(31 41 55 / 0.6);\n}\r\n\r\n.dark\\:bg-gray-900\\/70:is(.dark *) {\n  background-color: rgb(17 24 39 / 0.7);\n}\r\n\r\n.dark\\:bg-green-900\\/30:is(.dark *) {\n  background-color: rgb(20 83 45 / 0.3);\n}\r\n\r\n.dark\\:bg-red-900\\/30:is(.dark *) {\n  background-color: rgb(127 29 29 / 0.3);\n}\r\n\r\n.dark\\:bg-yellow-900\\/20:is(.dark *) {\n  background-color: rgb(113 63 18 / 0.2);\n}\r\n\r\n.dark\\:text-blue-200:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(191 219 254 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-blue-300:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(147 197 253 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-gray-300:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-gray-400:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-green-300:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(134 239 172 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-neutral-400:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-red-200:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(254 202 202 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-red-300:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(252 165 165 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-red-400:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-white:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-yellow-300:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(253 224 71 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:text-yellow-400:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(250 204 21 / var(--tw-text-opacity, 1));\n}\r\n\r\n.dark\\:hover\\:bg-gray-600:hover:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));\n}\r\n\r\n.dark\\:hover\\:bg-gray-700\\/50:hover:is(.dark *) {\n  background-color: rgb(55 65 81 / 0.5);\n}\r\n\r\n.dark\\:hover\\:text-white:hover:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\r\n\r\n.\\[\\&\\:\\:-webkit-details-marker\\]\\:hidden::-webkit-details-marker {\n  display: none;\n}\r\n\r\n.\\[\\&\\:\\:-webkit-inner-spin-button\\]\\:appearance-none::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n          appearance: none;\n}\r\n\r\n.\\[\\&\\:\\:-webkit-outer-spin-button\\]\\:appearance-none::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n          appearance: none;\n}', {});
})();
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const sharedConfig = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: false,
  getContextId() {
    return getContextId(this.context.count);
  },
  getNextContextId() {
    return getContextId(this.context.count++);
  }
};
function getContextId(count) {
  const num = String(count), len = num.length - 1;
  return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext(context) {
  sharedConfig.context = context;
}
const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
const NO_INIT = {};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root2 = unowned ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: current ? current.context : null,
    owner: current
  }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root2)));
  Owner = root2;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options2) {
  options2 = options2 ? Object.assign({}, signalOptions, options2) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options2.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      value2 = value2(s.value);
    }
    return writeSignal(s, value2);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options2) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options2) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options2) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE), s = SuspenseContext && useContext(SuspenseContext);
  if (s) c.suspense = s;
  if (!options2 || !options2.render) c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options2) {
  options2 = options2 ? Object.assign({}, signalOptions, options2) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options2.equals || void 0;
  updateComputation(c);
  return readSignal.bind(c);
}
function isPromise(v) {
  return v && typeof v === "object" && "then" in v;
}
function createResource(pSource, pFetcher, pOptions) {
  let source;
  let fetcher;
  let options2;
  {
    source = true;
    fetcher = pSource;
    options2 = {};
  }
  let pr = null, initP = NO_INIT, id = null, loadedUnderTransition = false, scheduled = false, resolved = "initialValue" in options2, dynamic = typeof source === "function" && createMemo(source);
  const contexts = /* @__PURE__ */ new Set(), [value, setValue] = (options2.storage || createSignal)(options2.initialValue), [error, setError] = createSignal(void 0), [track, trigger] = createSignal(void 0, {
    equals: false
  }), [state, setState] = createSignal(resolved ? "ready" : "unresolved");
  if (sharedConfig.context) {
    id = sharedConfig.getNextContextId();
    if (options2.ssrLoadFrom === "initial") initP = options2.initialValue;
    else if (sharedConfig.load && sharedConfig.has(id)) initP = sharedConfig.load(id);
  }
  function loadEnd(p, v, error2, key) {
    if (pr === p) {
      pr = null;
      key !== void 0 && (resolved = true);
      if ((p === initP || v === initP) && options2.onHydrated) queueMicrotask(() => options2.onHydrated(key, {
        value: v
      }));
      initP = NO_INIT;
      completeLoad(v, error2);
    }
    return v;
  }
  function completeLoad(v, err) {
    runUpdates(() => {
      if (err === void 0) setValue(() => v);
      setState(err !== void 0 ? "errored" : resolved ? "ready" : "unresolved");
      setError(err);
      for (const c of contexts.keys()) c.decrement();
      contexts.clear();
    }, false);
  }
  function read() {
    const c = SuspenseContext && useContext(SuspenseContext), v = value(), err = error();
    if (err !== void 0 && !pr) throw err;
    if (Listener && !Listener.user && c) {
      createComputed(() => {
        track();
        if (pr) {
          if (c.resolved && Transition && loadedUnderTransition) Transition.promises.add(pr);
          else if (!contexts.has(c)) {
            c.increment();
            contexts.add(c);
          }
        }
      });
    }
    return v;
  }
  function load(refetching = true) {
    if (refetching !== false && scheduled) return;
    scheduled = false;
    const lookup = dynamic ? dynamic() : source;
    loadedUnderTransition = Transition;
    if (lookup == null || lookup === false) {
      loadEnd(pr, untrack(value));
      return;
    }
    let error2;
    const p = initP !== NO_INIT ? initP : untrack(() => {
      try {
        return fetcher(lookup, {
          value: value(),
          refetching
        });
      } catch (fetcherError) {
        error2 = fetcherError;
      }
    });
    if (error2 !== void 0) {
      loadEnd(pr, void 0, castError(error2), lookup);
      return;
    } else if (!isPromise(p)) {
      loadEnd(pr, p, void 0, lookup);
      return p;
    }
    pr = p;
    if ("v" in p) {
      if (p.s === 1) loadEnd(pr, p.v, void 0, lookup);
      else loadEnd(pr, void 0, castError(p.v), lookup);
      return p;
    }
    scheduled = true;
    queueMicrotask(() => scheduled = false);
    runUpdates(() => {
      setState(resolved ? "refreshing" : "pending");
      trigger();
    }, false);
    return p.then((v) => loadEnd(p, v, void 0, lookup), (e) => loadEnd(p, void 0, castError(e), lookup));
  }
  Object.defineProperties(read, {
    state: {
      get: () => state()
    },
    error: {
      get: () => error()
    },
    loading: {
      get() {
        const s = state();
        return s === "pending" || s === "refreshing";
      }
    },
    latest: {
      get() {
        if (!resolved) return read();
        const err = error();
        if (err && !pr) throw err;
        return value();
      }
    }
  });
  let owner = Owner;
  if (dynamic) createComputed(() => (owner = Owner, load(false)));
  else load(false);
  return [read, {
    refetch: (info) => runWithOwner(owner, () => load(info)),
    mutate: setValue
  }];
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function on(deps, fn, options2) {
  const isArray = Array.isArray(deps);
  let prevInput;
  return (prevValue) => {
    let input;
    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;
  else if (Owner.cleanups === null) Owner.cleanups = [fn];
  else Owner.cleanups.push(fn);
  return fn;
}
function getListener() {
  return Listener;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
function resumeEffects(e) {
  Effects.push.apply(Effects, e);
  e.length = 0;
}
function createContext(defaultValue, options2) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
}
function children(fn) {
  const children2 = createMemo(fn);
  const memo2 = createMemo(() => resolveChildren(children2()));
  memo2.toArray = () => {
    const c = memo2();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo2;
}
let SuspenseContext;
function getSuspenseContext() {
  return SuspenseContext || (SuspenseContext = createContext());
}
function readSignal() {
  if (this.sources && this.state) {
    if (this.state === STALE) updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(node, node.value, time);
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner, listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options2) {
  const c = {
    fn,
    state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null) ;
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if (node.state === 0) return;
  if (node.state === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE) {
      updateComputation(node);
    } else if (node.state === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i, userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);
    else queue[userLength++] = e;
  }
  if (sharedConfig.context) {
    if (sharedConfig.count) {
      sharedConfig.effects || (sharedConfig.effects = []);
      sharedConfig.effects.push(...queue.slice(0, userLength));
      return;
    }
    setHydrateContext();
  }
  if (sharedConfig.effects && (sharedConfig.done || !sharedConfig.count)) {
    queue = [...sharedConfig.effects, ...queue];
    userLength += sharedConfig.effects.length;
    delete sharedConfig.effects;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options2) {
  return function provider(props) {
    let res;
    createRenderEffect(() => res = untrack(() => {
      Owner.context = {
        ...Owner.context,
        [id]: props.value
      };
      return children(() => props.children);
    }), void 0);
    return res;
  };
}
const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options2 = {}) {
  let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [], newLen = newItems.length, i, j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options2.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options2.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = /* @__PURE__ */ new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== void 0 && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== void 0) return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== void 0) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i2 = sourceKeys.length - 1; i2 >= 0; i2--) {
      const key = sourceKeys[i2];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== void 0 ? desc : void 0;
      } else {
        const sources2 = sourcesMap[key];
        if (sources2) {
          if (desc.get) sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0) sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i], desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps(props, ...keys) {
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map((k) => {
      return new Proxy({
        get(property) {
          return k.includes(property) ? props[property] : void 0;
        },
        has(property) {
          return k.includes(property) && property in props;
        },
        keys() {
          return k.filter((property) => property in props);
        }
      }, propTraps);
    });
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? void 0 : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter((k) => !blocked.has(k));
      }
    }, propTraps));
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}
const narrowedError = (name) => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, void 0, void 0);
  const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
    equals: (a, b) => !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(() => child(keyed ? c : () => {
        if (!untrack(condition)) throw narrowedError("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, void 0, void 0);
}
function Switch(props) {
  const chs = children(() => props.children);
  const switchFunc = createMemo(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => void 0;
    for (let i = 0; i < mps.length; i++) {
      const index = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo(() => prevFunc() ? void 0 : mp.when, void 0, void 0);
      const condition = mp.keyed ? conditionValue : createMemo(conditionValue, void 0, {
        equals: (a, b) => !a === !b
      });
      func = () => prevFunc() || (condition() ? [index, conditionValue, mp] : void 0);
    }
    return func;
  });
  return createMemo(() => {
    const sel = switchFunc()();
    if (!sel) return props.fallback;
    const [index, conditionValue, mp] = sel;
    const child = mp.children;
    const fn = typeof child === "function" && child.length > 0;
    return fn ? untrack(() => child(mp.keyed ? conditionValue() : () => {
      var _a;
      if (((_a = untrack(switchFunc)()) == null ? void 0 : _a[0]) !== index) throw narrowedError("Match");
      return conditionValue();
    })) : child;
  }, void 0, void 0);
}
function Match(props) {
  return props;
}
const SuspenseListContext = /* @__PURE__ */ createContext();
function Suspense(props) {
  let counter = 0, show, ctx, p, flicker, error;
  const [inFallback, setFallback] = createSignal(false), SuspenseContext2 = getSuspenseContext(), store = {
    increment: () => {
      if (++counter === 1) setFallback(true);
    },
    decrement: () => {
      if (--counter === 0) setFallback(false);
    },
    inFallback,
    effects: [],
    resolved: false
  }, owner = getOwner();
  if (sharedConfig.context && sharedConfig.load) {
    const key = sharedConfig.getContextId();
    let ref = sharedConfig.load(key);
    if (ref) {
      if (typeof ref !== "object" || ref.s !== 1) p = ref;
      else sharedConfig.gather(key);
    }
    if (p && p !== "$$f") {
      const [s, set] = createSignal(void 0, {
        equals: false
      });
      flicker = s;
      p.then(() => {
        if (sharedConfig.done) return set();
        sharedConfig.gather(key);
        setHydrateContext(ctx);
        set();
        setHydrateContext();
      }, (err) => {
        error = err;
        set();
      });
    }
  }
  const listContext = useContext(SuspenseListContext);
  if (listContext) show = listContext.register(store.inFallback);
  let dispose2;
  onCleanup(() => dispose2 && dispose2());
  return createComponent(SuspenseContext2.Provider, {
    value: store,
    get children() {
      return createMemo(() => {
        if (error) throw error;
        ctx = sharedConfig.context;
        if (flicker) {
          flicker();
          return flicker = void 0;
        }
        if (ctx && p === "$$f") setHydrateContext();
        const rendered = createMemo(() => props.children);
        return createMemo((prev) => {
          const inFallback2 = store.inFallback(), {
            showContent = true,
            showFallback = true
          } = show ? show() : {};
          if ((!inFallback2 || p && p !== "$$f") && showContent) {
            store.resolved = true;
            dispose2 && dispose2();
            dispose2 = ctx = p = void 0;
            resumeEffects(store.effects);
            return rendered();
          }
          if (!showFallback) return;
          if (dispose2) return prev;
          return createRoot((disposer) => {
            dispose2 = disposer;
            if (ctx) {
              setHydrateContext({
                id: ctx.id + "F",
                count: 0
              });
              ctx = void 0;
            }
            return props.fallback;
          }, owner);
        });
      });
    }
  });
}
const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
const Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "noValidate", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
const ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
const DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
const SVGElements = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
const memo = (fn) => createMemo(() => fn());
function reconcileArrays(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options2 = {}) {
  let disposer;
  createRoot((dispose2) => {
    disposer = dispose2;
    element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
  }, options2.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return isSVG ? t.content.firstChild.firstChild : t.content.firstChild;
  };
  const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttributeNS(namespace, name);
  else node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  if (isHydrating(node)) return;
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute("class");
  else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function getNextElement(template2) {
  let node, key, hydrating = isHydrating();
  if (!hydrating || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
    return template2();
  }
  if (sharedConfig.completed) sharedConfig.completed.add(node);
  sharedConfig.registry.delete(key);
  return node;
}
function isHydrating(node) {
  return !!sharedConfig.context && !sharedConfig.done && (!node || node.isConnected);
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating(node)) return value;
    if (prop === "class" || prop === "className") className(node, value);
    else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;
    else node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node, ns, prop, value);
    else setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  if (sharedConfig.registry && sharedConfig.events) {
    if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
  }
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (node.nodeType === 8 && node.data.slice(0, 2) === "!$") node.remove();
      else cleaned.push(node);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === void 0) return current = [...parent.childNodes];
      let node = array[0];
      if (node.parentNode !== parent) return current;
      const nodes = [node];
      while ((node = node.nextSibling) !== marker) nodes.push(node);
      return current = nodes;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap2) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap2) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
function getHydrationKey() {
  return sharedConfig.getNextContextId();
}
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
}
function Portal(props) {
  const {
    useShadow
  } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
  let content;
  let hydrating = !!sharedConfig.context;
  createEffect(() => {
    if (hydrating) getOwner().user = hydrating = false;
    content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
    const el = mount();
    if (el instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot((dispose2) => insert(el, () => !clean() ? content() : dispose2(), null));
      onCleanup(cleanup);
    } else {
      const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
        mode: "open"
      }) : container;
      Object.defineProperty(container, "_$host", {
        get() {
          return marker.parentNode;
        },
        configurable: true
      });
      insert(renderRoot, content);
      el.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => el.removeChild(container));
    }
  }, void 0, {
    render: !hydrating
  });
  return marker;
}
function createDynamic(component, props) {
  const cached = createMemo(component);
  return createMemo(() => {
    const component2 = cached();
    switch (typeof component2) {
      case "function":
        return untrack(() => component2(props));
      case "string":
        const isSvg = SVGElements.has(component2);
        const el = sharedConfig.context ? getNextElement() : createElement(component2, isSvg);
        spread(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic(props) {
  const [, others] = splitProps(props, ["component"]);
  return createDynamic(() => props.component, others);
}
const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
function wrap$1(value) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = /* @__PURE__ */ new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW]) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);
    else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);
    else set.add(item);
    const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes) Object.defineProperty(target, symbol, {
    value: nodes = /* @__PURE__ */ Object.create(null)
  });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property]) return nodes[property];
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return nodes[property] = s;
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE) return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  getListener() && getNode(getNodes(target, $NODE), $SELF)();
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__") return true;
    getListener() && getNode(getNodes(target, $HAS), property)();
    return property in target;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (!deleting && state[property] === value) return;
  const prev = state[property], len = state.length;
  if (value === void 0) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== void 0) state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === void 0) state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE), node;
  if (node = getNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0, len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part, prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part, isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === void 0 && value == void 0) return;
  value = unwrap(value);
  if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(...[store, options2]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}
const $ROOT = Symbol("store-root");
function applyState(target, parent, property, merge, key) {
  const previous = parent[property];
  if (target === previous) return;
  const isArray = Array.isArray(target);
  if (property !== $ROOT && (!isWrappable(target) || !isWrappable(previous) || isArray !== Array.isArray(previous) || key && target[key] !== previous[key])) {
    setProperty(parent, property, target);
    return;
  }
  if (isArray) {
    if (target.length && previous.length && (!merge || key && target[0] && target[0][key] != null)) {
      let i, j, start, end, newEnd, item, newIndicesNext, keyVal;
      for (start = 0, end = Math.min(previous.length, target.length); start < end && (previous[start] === target[start] || key && previous[start] && target[start] && previous[start][key] === target[start][key]); start++) {
        applyState(target[start], previous, start, merge, key);
      }
      const temp = new Array(target.length), newIndices = /* @__PURE__ */ new Map();
      for (end = previous.length - 1, newEnd = target.length - 1; end >= start && newEnd >= start && (previous[end] === target[newEnd] || key && previous[end] && target[newEnd] && previous[end][key] === target[newEnd][key]); end--, newEnd--) {
        temp[newEnd] = previous[end];
      }
      if (start > newEnd || start > end) {
        for (j = start; j <= newEnd; j++) setProperty(previous, j, target[j]);
        for (; j < target.length; j++) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        }
        if (previous.length > target.length) setProperty(previous, "length", target.length);
        return;
      }
      newIndicesNext = new Array(newEnd + 1);
      for (j = newEnd; j >= start; j--) {
        item = target[j];
        keyVal = key && item ? item[key] : item;
        i = newIndices.get(keyVal);
        newIndicesNext[j] = i === void 0 ? -1 : i;
        newIndices.set(keyVal, j);
      }
      for (i = start; i <= end; i++) {
        item = previous[i];
        keyVal = key && item ? item[key] : item;
        j = newIndices.get(keyVal);
        if (j !== void 0 && j !== -1) {
          temp[j] = previous[i];
          j = newIndicesNext[j];
          newIndices.set(keyVal, j);
        }
      }
      for (j = start; j < target.length; j++) {
        if (j in temp) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        } else setProperty(previous, j, target[j]);
      }
    } else {
      for (let i = 0, len = target.length; i < len; i++) {
        applyState(target[i], previous, i, merge, key);
      }
    }
    if (previous.length > target.length) setProperty(previous, "length", target.length);
    return;
  }
  const targetKeys = Object.keys(target);
  for (let i = 0, len = targetKeys.length; i < len; i++) {
    applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
  }
  const previousKeys = Object.keys(previous);
  for (let i = 0, len = previousKeys.length; i < len; i++) {
    if (target[previousKeys[i]] === void 0) setProperty(previous, previousKeys[i], void 0);
  }
}
function reconcile(value, options2 = {}) {
  const {
    merge,
    key = "id"
  } = options2, v = unwrap(value);
  return (state) => {
    if (!isWrappable(state) || !isWrappable(v)) return v;
    const res = applyState(v, {
      [$ROOT]: state
    }, $ROOT, merge, key);
    return res === void 0 ? state : res;
  };
}
const producers = /* @__PURE__ */ new WeakMap();
const setterTraps = {
  get(target, property) {
    if (property === $RAW) return target;
    const value = target[property];
    let proxy;
    return isWrappable(value) ? producers.get(value) || (producers.set(value, proxy = new Proxy(value, setterTraps)), proxy) : value;
  },
  set(target, property, value) {
    setProperty(target, property, unwrap(value));
    return true;
  },
  deleteProperty(target, property) {
    setProperty(target, property, void 0, true);
    return true;
  }
};
function produce(fn) {
  return (state) => {
    if (isWrappable(state)) {
      let proxy;
      if (!(proxy = producers.get(state))) {
        producers.set(state, proxy = new Proxy(state, setterTraps));
      }
      fn(proxy);
    }
    return state;
  };
}
const makeTimer = (fn, delay, timer) => {
  const intervalId = timer(fn, delay);
  const clear = () => clearInterval(intervalId);
  return onCleanup(clear);
};
const createTimer = (fn, delay, timer) => {
  if (typeof delay === "number") {
    makeTimer(fn, delay, timer);
    return;
  }
  let done = false;
  let prevTime = performance.now();
  let fractionDone = 0;
  let shouldHandleFraction = false;
  const callHandler = () => {
    untrack(fn);
    prevTime = performance.now();
    done = timer === setTimeout;
  };
  createEffect((prevDelay) => {
    if (done)
      return;
    const currDelay = delay();
    if (currDelay === false) {
      if (prevDelay)
        fractionDone += (performance.now() - prevTime) / prevDelay;
      return currDelay;
    }
    if (prevDelay === false)
      prevTime = performance.now();
    if (shouldHandleFraction) {
      if (prevDelay)
        fractionDone += (performance.now() - prevTime) / prevDelay;
      prevTime = performance.now();
      if (fractionDone >= 1) {
        fractionDone = 0;
        callHandler();
      } else if (fractionDone > 0) {
        const [listen, rerunEffect] = createSignal(void 0, { equals: false });
        listen();
        makeTimer(() => {
          fractionDone = 0;
          shouldHandleFraction = false;
          rerunEffect();
          callHandler();
        }, (1 - fractionDone) * currDelay, setTimeout);
        return currDelay;
      }
    }
    shouldHandleFraction = true;
    makeTimer(callHandler, currDelay, timer);
    return currDelay;
  });
};
const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const promiseTimeout = (ms, throwOnTimeout = false, reason = "Timeout") => new Promise((resolve, reject) => throwOnTimeout ? setTimeout(() => reject(reason), ms) : setTimeout(resolve, ms));
function raceTimeout(input, ms, throwOnTimeout = false, reason = "Timeout") {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const promises = asArray(input);
    const timeout = promiseTimeout(ms, throwOnTimeout, reason).catch((e) => {
      !resolved && reject(e);
    });
    const race = Promise.race([...promises, timeout]);
    race.then(resolve, reject);
    race.finally(() => {
      resolved = true;
      promises.forEach(
        // inputted promises can have .dispose() method on them,
        // it will be called when the first promise resolves, to stop the rest
        (p) => {
          p && typeof p === "object" && typeof p.dispose === "function" && p.dispose();
        }
      );
    });
  });
}
const propsData = [
  {
    name: "Definition",
    options: {
      source: { target: "geofs.aircraft.instance", prop: "definition" },
      reactive: true,
      reset: true,
      allowed: [
        { name: "startupTime", type: "float" },
        { name: "shutdownTime", type: "float" },
        { name: "optionalAnimatedPartTravelTime", type: "float" },
        { name: "airbrakesTravelTime", type: "float" },
        { name: "accessoriesTravelTime", type: "float" },
        { name: "flapsTravelTime", type: "float" },
        { name: "flapsSteps", type: "int" },
        { name: "gearTravelTime", type: "float" },
        { name: "zeroThrustAltitude", type: "int" },
        { name: "zeroRPMAltitude", type: "int" },
        { name: "mass", type: "int" },
        { name: "minRPM", type: "int", comment: "not recommended" },
        { name: "maxRPM", type: "int", comment: "not recommended" }
      ],
      ignored: [
        "object",
        "function",
        "undefined",
        "null",
        "boolean",
        "symbol",
        "array"
      ]
    }
  },
  {
    name: "Icons",
    options: {
      source: {
        target: "geofs.map",
        prop: "icons"
      },
      reactive: true
    }
  },
  {
    name: "Engines",
    options: {
      source: {
        target: "geofs.aircraft.instance",
        prop: "engines"
      },
      reactive: true,
      reset: true,
      allowed: [
        { name: "thrust", type: "int" },
        { name: "afterBurnerThrust", type: "int" },
        { name: "reverseThrust", type: "int" }
      ],
      ignored: [
        "object",
        "function",
        "undefined",
        "null",
        "boolean",
        "symbol",
        "array"
      ]
    }
  },
  {
    name: "ExperimentalFeatures",
    options: {
      allowed: [
        { name: "fuelSystem", type: "boolean", label: "Fuel Management System" },
        { name: "aircraftMarkers", type: "boolean", label: "Special Aircraft Markers" },
        { name: "aircraftRadar", type: "boolean", label: "Aircraft Radar" }
      ],
      ignored: []
    }
  }
];
function getObjectFromPath(path, safe = false) {
  if (typeof path !== "string") {
    return path;
  }
  const parts = path.split(".");
  let obj = unsafeWindow;
  for (let part of parts) {
    obj = obj[part];
    if (obj === void 0) {
      if (safe) {
        return null;
      }
      throw new Error(`Path ${path} does not exist`);
    }
  }
  return obj;
}
function formatLabel(name) {
  if (!name) return "";
  let s = String(name).replace(/[_-]+/g, " ");
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  s = s.split(" ").map((w) => w.length ? w.charAt(0).toUpperCase() + w.slice(1) : "").join(" ");
  return s.trim();
}
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
const LOG_STYLES = {
  debug: "color: #888; font-style: italic;",
  info: "color: #2196F3;",
  warn: "color: #FF9800; font-weight: bold;",
  error: "color: #F44336; font-weight: bold;"
};
const _Logger = class _Logger {
  constructor(module) {
    __publicField(this, "module");
    this.module = module;
  }
  static configure(config) {
    _Logger._config = {
      ..._Logger._config,
      ...config
    };
    if (config.devMode) {
      _Logger._config.minLevel = "debug";
    }
  }
  static setDevMode(enabled) {
    _Logger._config.devMode = enabled;
    _Logger._config.minLevel = enabled ? "debug" : "info";
  }
  static isDevMode() {
    return _Logger._config.devMode;
  }
  static create(module) {
    return new _Logger(module);
  }
  shouldLog(level) {
    if (!_Logger._config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[_Logger._config.minLevel];
  }
  formatPrefix(_level) {
    const parts = [];
    if (_Logger._config.showTimestamp) {
      parts.push((/* @__PURE__ */ new Date()).toISOString().substr(11, 12));
    }
    parts.push(`[${_Logger._config.prefix}]`);
    parts.push(`[${this.module}]`);
    return parts.join(" ");
  }
  debug(message, ...args) {
    if (!this.shouldLog("debug")) return;
    console.log(`%c${this.formatPrefix("debug")} ${message}`, LOG_STYLES.debug, ...args);
  }
  info(message, ...args) {
    if (!this.shouldLog("info")) return;
    console.log(`%c${this.formatPrefix("info")} ${message}`, LOG_STYLES.info, ...args);
  }
  warn(message, ...args) {
    if (!this.shouldLog("warn")) return;
    console.warn(`%c${this.formatPrefix("warn")} ${message}`, LOG_STYLES.warn, ...args);
  }
  error(message, ...args) {
    if (!this.shouldLog("error")) return;
    console.error(`%c${this.formatPrefix("error")} ${message}`, LOG_STYLES.error, ...args);
  }
  log(level, message, ...args) {
    switch (level) {
      case "debug":
        this.debug(message, ...args);
        break;
      case "info":
        this.info(message, ...args);
        break;
      case "warn":
        this.warn(message, ...args);
        break;
      case "error":
        this.error(message, ...args);
        break;
    }
  }
  group(label, collapsed = true) {
    if (!_Logger._config.enabled) return;
    const method = collapsed ? console.groupCollapsed : console.group;
    method(`${this.formatPrefix("info")} ${label}`);
  }
  groupEnd() {
    if (!_Logger._config.enabled) return;
    console.groupEnd();
  }
  time(label) {
    if (!_Logger._config.enabled) return;
    console.time(`${this.formatPrefix("debug")} ${label}`);
  }
  timeEnd(label) {
    if (!_Logger._config.enabled) return;
    console.timeEnd(`${this.formatPrefix("debug")} ${label}`);
  }
  table(data) {
    if (!_Logger._config.enabled) return;
    console.log(`${this.formatPrefix("info")} Table:`);
    console.table(data);
  }
};
__publicField(_Logger, "_config", {
  enabled: true,
  minLevel: "info",
  prefix: "EFI",
  showTimestamp: false,
  devMode: false
});
let Logger = _Logger;
const log$e = Logger.create("Reactive");
class Reactive {
  static set cache(value) {
    this._cache = value;
  }
  static get cache() {
    return this._cache;
  }
  static parse(target, propName) {
    if (target[propName] === void 0) {
      throw new Error("Invalid path.");
    }
    const originalValue = target[propName];
    const [prop, setProp] = createSignal(originalValue);
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propName);
    Object.defineProperty(target, propName, {
      get: function() {
        return prop();
      },
      set: function(newValue) {
        setProp(newValue);
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.call(this, newValue);
        }
      },
      configurable: true,
      enumerable: true
    });
    if (Object.getOwnPropertyDescriptor(target, propName) === void 0) {
      throw new Error("Reactive property not created.");
    }
    this._cache[propName] = true;
    return [prop, setProp];
  }
  static smartParse(target, propName) {
    if (typeof target === "string" && typeof propName === "string") {
      return this.parse(getObjectFromPath(target), propName);
    } else if (typeof target === "object" && typeof propName === "string") {
      return this.parse(target, propName);
    } else {
      throw new Error("The target must be a string or an object. The property must be a string.");
    }
  }
  static cleanup() {
    log$e.debug("Starting cleanup, cache size:", Object.keys(this._cache).length);
    this._cache = {};
    log$e.debug("Cleanup completed");
  }
}
__publicField(Reactive, "_cache", {});
const log$d = Logger.create("Props");
class Props {
  static get reactive() {
    return this._reactive;
  }
  static set reactive(value) {
    this._reactive = value;
  }
  static async load(...arr) {
    return await new Promise((resolve, reject) => {
      try {
        if (!arr.length) {
          throw new Error("No props to load");
        }
        if (!Array.isArray(arr)) {
          throw new Error("Props must be an array");
        }
        for (const item of arr[0]) {
          const {
            name,
            options: options2
          } = item;
          const {
            source
          } = options2;
          if (options2.reactive) {
            if (!options2.source) {
              throw new Error("Reactive props require a source");
            }
            if (!options2.source.target || !options2.source.prop) {
              throw new Error("Reactive props require a target and prop");
            }
            Reactive.smartParse(source.target, source.prop);
          }
          Object.defineProperty(this, name, {
            get: function() {
              return this._data[name];
            },
            set: function(newValue) {
              this._data[name] = newValue;
            },
            configurable: true,
            enumerable: true
          });
          this[name] = {
            allowed: options2.allowed || [],
            ignored: options2.ignored || [],
            reset: options2.reset || false
          };
        }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
  static cleanup() {
    log$d.debug("Starting cleanup...");
    if (this._reactive) {
      Reactive.cleanup();
    }
    const propsToDelete = Object.keys(this._data);
    log$d.debug("Properties to delete:", propsToDelete);
    this._data = {};
    for (const key of propsToDelete) {
      try {
        delete this[key];
        log$d.debug(`Deleted property: ${key}`);
      } catch (error) {
        log$d.warn(`Could not delete property ${key}:`, error);
      }
    }
    log$d.debug("Cleanup completed");
  }
}
__publicField(Props, "_reactive");
__publicField(Props, "_data", {});
const _Aircraft = class _Aircraft {
  get instance() {
    return _Aircraft._instance;
  }
  set instance(value) {
    _Aircraft._instance = value;
  }
  static refresh() {
    _Aircraft._instance = geofs.aircraft.instance;
  }
  static getAllowed(group) {
    var _a;
    const propsData2 = Props._data;
    const groupName = group === "definition" ? "Definition" : "Engines";
    return ((_a = propsData2[groupName]) == null ? void 0 : _a.allowed) || [];
  }
  static isAllowed(group, itemName) {
    const allowed = this.getAllowed(group);
    return allowed.find((p) => p.name === itemName);
  }
  static definitions() {
    var _a;
    const definitions = (_a = this._instance) == null ? void 0 : _a.definition;
    if (!definitions) return [];
    const response = [];
    for (const [name, value] of Object.entries(definitions)) {
      const allowedItem = this.isAllowed("definition", name);
      if (allowedItem) {
        response.push([name, value, allowedItem.type]);
      }
    }
    return response;
  }
  static engines() {
    var _a;
    const engines = (_a = this._instance) == null ? void 0 : _a.engines;
    if (!engines) return [];
    const response = [];
    for (let i = 0; i < engines.length; i++) {
      const engineProps = [];
      for (const [name, value] of Object.entries(engines[i])) {
        const allowedItem = this.isAllowed("engines", name);
        if (allowedItem) {
          engineProps.push([name, value, allowedItem.type]);
        }
      }
      if (engineProps.length) {
        response.push(engineProps);
      }
    }
    return response;
  }
};
__publicField(_Aircraft, "aircrafts", geofs.aircraftList);
__publicField(_Aircraft, "_instance");
let Aircraft = _Aircraft;
const log$c = Logger.create("Storage");
class Storage {
  static get version() {
    return this._version;
  }
  static set version(value) {
    this._version = value;
  }
  static get options() {
    return this._options;
  }
  static set options(value) {
    this._options = value;
  }
  static config(version, options2 = {
    prefix: ""
  }) {
    this._version = version;
    this._options = options2;
    log$c.info(`Configured v${version} with prefix: "${options2.prefix}"`);
  }
  static setCaching(enabled, timeout = 5e3) {
    this._cacheEnabled = enabled;
    this._cacheTimeout = timeout;
    if (!enabled) {
      this.clearCache();
    }
    log$c.debug(`Caching ${enabled ? "enabled" : "disabled"} (timeout: ${timeout}ms)`);
  }
  static clearCache() {
    this._cache.clear();
    this._cacheTimestamps.clear();
  }
  static isCacheValid(key) {
    if (!this._cacheEnabled) return false;
    const timestamp = this._cacheTimestamps.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this._cacheTimeout;
  }
  static setCache(key, value) {
    if (!this._cacheEnabled) return;
    this._cache.set(key, value);
    this._cacheTimestamps.set(key, Date.now());
  }
  static getCache(key) {
    if (!this._cacheEnabled) return null;
    if (!this.isCacheValid(key)) {
      this._cache.delete(key);
      this._cacheTimestamps.delete(key);
      return null;
    }
    return this._cache.get(key);
  }
  static _prefix(key) {
    return this._options.prefix + key;
  }
  static _unprefix(key) {
    return key.substring(this._options.prefix.length);
  }
  static _parse(value) {
    if (value === null || value === void 0) return value;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
  static _stringify(value) {
    if (value === null || value === void 0) return String(value);
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch (error) {
      log$c.error("Failed to stringify value:", error);
      return String(value);
    }
  }
  static _isUndefined(value) {
    return value === void 0;
  }
  static _isType(value, type) {
    return (value == null ? void 0 : value.constructor) === type;
  }
  static async read(key, defaultValue) {
    try {
      const cached = this.getCache(key);
      if (cached !== null) {
        return cached;
      }
      const prefixedKey = this._prefix(key);
      const raw = await GM.getValue(prefixedKey, defaultValue);
      const parsed = this._parse(raw);
      this.setCache(key, parsed);
      return parsed;
    } catch (error) {
      log$c.error(`Failed to read key "${key}":`, error);
      return defaultValue;
    }
  }
  static write(key, value) {
    try {
      const prefixedKey = this._prefix(key);
      const stringified = this._stringify(value);
      GM.setValue(prefixedKey, stringified);
      this.setCache(key, value);
    } catch (error) {
      log$c.error(`Failed to write key "${key}":`, error);
      throw error;
    }
  }
  static delete(key) {
    try {
      const prefixedKey = this._prefix(key);
      GM.deleteValue(prefixedKey);
      this._cache.delete(key);
      this._cacheTimestamps.delete(key);
      return true;
    } catch (error) {
      log$c.error(`Failed to delete key "${key}":`, error);
      return false;
    }
  }
  static async readKeys() {
    try {
      const keys = await GM.listValues();
      return Array.isArray(keys) ? keys : [];
    } catch (error) {
      log$c.error("Failed to read keys:", error);
      return [];
    }
  }
  static async get(key, defaultValue) {
    return await this.read(key, defaultValue);
  }
  static async set(key, value) {
    try {
      const savedVal = await this.read(key);
      if (this._isUndefined(savedVal) || !savedVal) {
        return await this.add(key, value);
      } else {
        this.write(key, value);
        return true;
      }
    } catch (error) {
      log$c.error(`Failed to set key "${key}":`, error);
      return false;
    }
  }
  static async add(key, value) {
    try {
      const savedVal = await this.read(key, false);
      if (this._isUndefined(savedVal) || !savedVal) {
        this.write(key, value);
        return true;
      } else {
        if (Array.isArray(savedVal)) {
          const arr = savedVal;
          if (!arr.includes(value)) {
            arr.push(value);
            this.write(key, arr);
            return true;
          }
          return false;
        }
        if (this._isType(savedVal, Object) && this._isType(value, Object)) {
          const merged = Object.assign({}, savedVal, value);
          this.write(key, merged);
          return true;
        }
        return false;
      }
    } catch (error) {
      log$c.error(`Failed to add key "${key}":`, error);
      return false;
    }
  }
  static async replace(key, itemFind, itemReplacement) {
    try {
      const savedVal = await this.read(key, false);
      if (this._isUndefined(savedVal) || !savedVal) {
        return false;
      }
      if (Array.isArray(savedVal)) {
        const arr = savedVal;
        const index = arr.indexOf(itemFind);
        if (index !== -1) {
          arr[index] = itemReplacement;
          this.write(key, arr);
          return true;
        }
        return false;
      }
      if (this._isType(savedVal, Object) && !Array.isArray(savedVal)) {
        const obj = savedVal;
        if (itemFind in obj) {
          obj[itemFind] = itemReplacement;
          this.write(key, obj);
          return true;
        }
      }
      return false;
    } catch (error) {
      log$c.error(`Failed to replace in key "${key}":`, error);
      return false;
    }
  }
  static async remove(key, value) {
    try {
      if (this._isUndefined(value)) {
        return this.delete(key);
      }
      const savedVal = await this.read(key);
      if (this._isUndefined(savedVal) || !savedVal) {
        return true;
      }
      if (Array.isArray(savedVal)) {
        const index = savedVal.indexOf(value);
        if (index !== -1) {
          savedVal.splice(index, 1);
          this.write(key, savedVal);
          return true;
        }
        return false;
      }
      if (this._isType(savedVal, Object) && !Array.isArray(savedVal)) {
        const obj = savedVal;
        if (value in obj) {
          delete obj[value];
          this.write(key, obj);
          return true;
        }
      }
      return false;
    } catch (error) {
      log$c.error(`Failed to remove from key "${key}":`, error);
      return false;
    }
  }
  static async getAll() {
    try {
      const keys = await this._listKeys();
      const obj = {};
      for (const key of keys) {
        obj[key] = await this.read(key);
      }
      return obj;
    } catch (error) {
      log$c.error("Failed to get all:", error);
      return {};
    }
  }
  static async getKeys() {
    return await this._listKeys();
  }
  static getPrefix() {
    return this._options.prefix;
  }
  static async empty() {
    try {
      const keys = await this._listKeys();
      for (const key of keys) {
        this.delete(key);
      }
      this.clearCache();
      log$c.debug("All data cleared");
    } catch (error) {
      log$c.error("Failed to empty storage:", error);
    }
  }
  static async has(key) {
    try {
      const value = await this.get(key);
      return value !== null && value !== void 0;
    } catch (error) {
      log$c.error(`Failed to check key "${key}":`, error);
      return false;
    }
  }
  static async forEach(callback) {
    try {
      const allContent = await this.getAll();
      for (const key in allContent) {
        if (Object.prototype.hasOwnProperty.call(allContent, key)) {
          callback(key, allContent[key]);
        }
      }
    } catch (error) {
      log$c.error("Failed to iterate:", error);
    }
  }
  static async _listKeys(usePrefix = false) {
    try {
      const prefixed = await this.readKeys();
      if (usePrefix) {
        return prefixed;
      }
      return prefixed.filter((key) => key.startsWith(this._options.prefix)).map((key) => this._unprefix(key));
    } catch (error) {
      log$c.error("Failed to list keys:", error);
      return [];
    }
  }
  static async setMany(entries) {
    try {
      for (const [key, value] of Object.entries(entries)) {
        await this.set(key, value);
      }
    } catch (error) {
      log$c.error("Failed to set many:", error);
      throw error;
    }
  }
  static async getMany(keys) {
    const result = {};
    try {
      for (const key of keys) {
        result[key] = await this.get(key);
      }
    } catch (error) {
      log$c.error("Failed to get many:", error);
    }
    return result;
  }
  static async deleteMany(keys) {
    try {
      for (const key of keys) {
        await this.delete(key);
      }
    } catch (error) {
      log$c.error("Failed to delete many:", error);
    }
  }
  static async export() {
    return {
      version: this._version,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      data: await this.getAll()
    };
  }
  static async import(exportData) {
    try {
      if (exportData.data) {
        await this.setMany(exportData.data);
      }
      log$c.debug("Import successful");
    } catch (error) {
      log$c.error("Import failed:", error);
      throw error;
    }
  }
  static async getSize() {
    try {
      const allData = await this.getAll();
      const json = JSON.stringify(allData);
      return new Blob([json]).size;
    } catch (error) {
      log$c.error("Failed to calculate size:", error);
      return 0;
    }
  }
  static async getStats() {
    const keys = await this.getKeys();
    const size = await this.getSize();
    return {
      totalKeys: keys.length,
      totalSize: size,
      prefix: this._options.prefix,
      version: this._version,
      cacheEnabled: this._cacheEnabled,
      cacheSize: this._cache.size
    };
  }
}
__publicField(Storage, "_version", "1.0.0");
__publicField(Storage, "_options", {
  prefix: ""
});
__publicField(Storage, "_cache", /* @__PURE__ */ new Map());
__publicField(Storage, "_cacheEnabled", true);
__publicField(Storage, "_cacheTimeout", 5e3);
__publicField(Storage, "_cacheTimestamps", /* @__PURE__ */ new Map());
var _tmpl$$D = /* @__PURE__ */ template(`<div class=sonner-loading-wrapper><div class=sonner-spinner>`), _tmpl$2$6 = /* @__PURE__ */ template(`<div class=sonner-loading-bar>`), _tmpl$3$4 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"clip-rule=evenodd>`), _tmpl$4$4 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"clip-rule=evenodd>`), _tmpl$5$4 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"clip-rule=evenodd>`), _tmpl$6$4 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"clip-rule=evenodd>`), _tmpl$7$4 = /* @__PURE__ */ template(`<div class=sonner-loader>`), _tmpl$8$2 = /* @__PURE__ */ template(`<button aria-label="Close toast"data-close-button><svg xmlns=http://www.w3.org/2000/svg width=12 height=12 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round><line x1=18 y1=6 x2=6 y2=18></line><line x1=6 y1=6 x2=18 y2=18>`), _tmpl$9$2 = /* @__PURE__ */ template(`<li aria-atomic=true role=status tabindex=0 data-sonner-toast="">`), _tmpl$10$2 = /* @__PURE__ */ template(`<div data-icon="">`), _tmpl$11$1 = /* @__PURE__ */ template(`<div data-description="">`), _tmpl$12$1 = /* @__PURE__ */ template(`<div data-content=""><div data-title="">`), _tmpl$13$1 = /* @__PURE__ */ template(`<button data-button data-cancel>`), _tmpl$14$1 = /* @__PURE__ */ template(`<button data-button="">`), _tmpl$15$1 = /* @__PURE__ */ template(`<section tabindex=-1>`), _tmpl$16$1 = /* @__PURE__ */ template(`<ol tabindex=-1 data-sonner-toaster>`);
function styleInject(css, {
  insertAt
} = {}) {
  if (typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style2 = document.createElement("style");
  style2.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style2, head.firstChild);
    } else {
      head.appendChild(style2);
    }
  } else {
    head.appendChild(style2);
  }
  if (style2.styleSheet) {
    style2.styleSheet.cssText = css;
  } else {
    style2.appendChild(document.createTextNode(css));
  }
}
styleInject(':where(html[dir=ltr]),\n:where([data-sonner-toaster][dir=ltr]) {\n  --toast-icon-margin-start: -3px;\n  --toast-icon-margin-end: 4px;\n  --toast-svg-margin-start: -1px;\n  --toast-svg-margin-end: 0px;\n  --toast-button-margin-start: auto;\n  --toast-button-margin-end: 0;\n  --toast-close-button-start: 0;\n  --toast-close-button-end: unset;\n  --toast-close-button-transform: translate(-35%, -35%);\n}\n:where(html[dir=rtl]),\n:where([data-sonner-toaster][dir=rtl]) {\n  --toast-icon-margin-start: 4px;\n  --toast-icon-margin-end: -3px;\n  --toast-svg-margin-start: 0px;\n  --toast-svg-margin-end: -1px;\n  --toast-button-margin-start: 0;\n  --toast-button-margin-end: auto;\n  --toast-close-button-start: unset;\n  --toast-close-button-end: 0;\n  --toast-close-button-transform: translate(35%, -35%);\n}\n:where([data-sonner-toaster]) {\n  position: fixed;\n  width: var(--width);\n  font-family:\n    ui-sans-serif,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    Roboto,\n    Helvetica Neue,\n    Arial,\n    Noto Sans,\n    sans-serif,\n    Apple Color Emoji,\n    Segoe UI Emoji,\n    Segoe UI Symbol,\n    Noto Color Emoji;\n  --gray1: hsl(0, 0%, 99%);\n  --gray2: hsl(0, 0%, 97.3%);\n  --gray3: hsl(0, 0%, 95.1%);\n  --gray4: hsl(0, 0%, 93%);\n  --gray5: hsl(0, 0%, 90.9%);\n  --gray6: hsl(0, 0%, 88.7%);\n  --gray7: hsl(0, 0%, 85.8%);\n  --gray8: hsl(0, 0%, 78%);\n  --gray9: hsl(0, 0%, 56.1%);\n  --gray10: hsl(0, 0%, 52.3%);\n  --gray11: hsl(0, 0%, 43.5%);\n  --gray12: hsl(0, 0%, 9%);\n  --border-radius: 8px;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  outline: none;\n  z-index: 999999999;\n}\n:where([data-sonner-toaster][data-x-position=right]) {\n  right: max(var(--offset), env(safe-area-inset-right));\n}\n:where([data-sonner-toaster][data-x-position=left]) {\n  left: max(var(--offset), env(safe-area-inset-left));\n}\n:where([data-sonner-toaster][data-x-position=center]) {\n  left: 50%;\n  transform: translateX(-50%);\n}\n:where([data-sonner-toaster][data-y-position=top]) {\n  top: max(var(--offset), env(safe-area-inset-top));\n}\n:where([data-sonner-toaster][data-y-position=bottom]) {\n  bottom: max(var(--offset), env(safe-area-inset-bottom));\n}\n:where([data-sonner-toast]) {\n  --y: translateY(100%);\n  --lift-amount: calc(var(--lift) * var(--gap));\n  z-index: var(--z-index);\n  position: absolute;\n  opacity: 0;\n  transform: var(--y);\n  filter: blur(0);\n  touch-action: none;\n  transition:\n    transform 400ms,\n    opacity 400ms,\n    height 400ms,\n    box-shadow 200ms;\n  box-sizing: border-box;\n  outline: none;\n  overflow-wrap: anywhere;\n}\n:where([data-sonner-toast][data-styled=true]) {\n  padding: 16px;\n  background: var(--normal-bg);\n  border: 1px solid var(--normal-border);\n  color: var(--normal-text);\n  border-radius: var(--border-radius);\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);\n  width: var(--width);\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n:where([data-sonner-toast]:focus-visible) {\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\n}\n:where([data-sonner-toast][data-y-position=top]) {\n  top: 0;\n  --y: translateY(-100%);\n  --lift: 1;\n  --lift-amount: calc(1 * var(--gap));\n}\n:where([data-sonner-toast][data-y-position=bottom]) {\n  bottom: 0;\n  --y: translateY(100%);\n  --lift: -1;\n  --lift-amount: calc(var(--lift) * var(--gap));\n}\n:where([data-sonner-toast]) :where([data-description]) {\n  font-weight: 400;\n  line-height: 1.4;\n  color: inherit;\n}\n:where([data-sonner-toast]) :where([data-title]) {\n  font-weight: 500;\n  line-height: 1.5;\n  color: inherit;\n}\n:where([data-sonner-toast]) :where([data-icon]) {\n  display: flex;\n  height: 16px;\n  width: 16px;\n  position: relative;\n  justify-content: flex-start;\n  align-items: center;\n  flex-shrink: 0;\n  margin-left: var(--toast-icon-margin-start);\n  margin-right: var(--toast-icon-margin-end);\n}\n:where([data-sonner-toast][data-promise=true]) :where([data-icon]) > svg {\n  opacity: 0;\n  transform: scale(0.8);\n  transform-origin: center;\n  animation: sonner-fade-in 300ms ease forwards;\n}\n:where([data-sonner-toast]) :where([data-icon]) > * {\n  flex-shrink: 0;\n}\n:where([data-sonner-toast]) :where([data-icon]) svg {\n  margin-left: var(--toast-svg-margin-start);\n  margin-right: var(--toast-svg-margin-end);\n}\n:where([data-sonner-toast]) :where([data-content]) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n[data-sonner-toast][data-styled=true] [data-button] {\n  border-radius: 4px;\n  padding-left: 8px;\n  padding-right: 8px;\n  height: 24px;\n  font-size: 12px;\n  color: var(--normal-bg);\n  background: var(--normal-text);\n  margin-left: var(--toast-button-margin-start);\n  margin-right: var(--toast-button-margin-end);\n  border: none;\n  cursor: pointer;\n  outline: none;\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  transition: opacity 400ms, box-shadow 200ms;\n}\n:where([data-sonner-toast]) :where([data-button]):focus-visible {\n  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);\n}\n:where([data-sonner-toast]) :where([data-button]):first-of-type {\n  margin-left: var(--toast-button-margin-start);\n  margin-right: var(--toast-button-margin-end);\n}\n:where([data-sonner-toast]) :where([data-cancel]) {\n  color: var(--normal-text);\n  background: rgba(0, 0, 0, 0.08);\n}\n:where([data-sonner-toast][data-theme=dark]) :where([data-cancel]) {\n  background: rgba(255, 255, 255, 0.3);\n}\n:where([data-sonner-toast]) :where([data-close-button]) {\n  position: absolute;\n  left: var(--toast-close-button-start);\n  right: var(--toast-close-button-end);\n  top: 0;\n  height: 20px;\n  width: 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  background: var(--gray1);\n  color: var(--gray12);\n  border: 1px solid var(--gray4);\n  transform: var(--toast-close-button-transform);\n  border-radius: 50%;\n  cursor: pointer;\n  z-index: 1;\n  transition:\n    opacity 100ms,\n    background 200ms,\n    border-color 200ms;\n}\n:where([data-sonner-toast]) :where([data-close-button]):focus-visible {\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\n}\n:where([data-sonner-toast]) :where([data-disabled=true]) {\n  cursor: not-allowed;\n}\n:where([data-sonner-toast]):hover :where([data-close-button]):hover {\n  background: var(--gray2);\n  border-color: var(--gray5);\n}\n:where([data-sonner-toast][data-swiping=true])::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 100%;\n  z-index: -1;\n}\n:where([data-sonner-toast][data-y-position=top][data-swiping=true])::before {\n  bottom: 50%;\n  transform: scaleY(3) translateY(50%);\n}\n:where([data-sonner-toast][data-y-position=bottom][data-swiping=true])::before {\n  top: 50%;\n  transform: scaleY(3) translateY(-50%);\n}\n:where([data-sonner-toast][data-swiping=false][data-removed=true])::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  transform: scaleY(2);\n}\n:where([data-sonner-toast])::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  height: calc(var(--gap) + 1px);\n  bottom: 100%;\n  width: 100%;\n}\n:where([data-sonner-toast][data-mounted=true]) {\n  --y: translateY(0);\n  opacity: 1;\n}\n:where([data-sonner-toast][data-expanded=false][data-front=false]) {\n  --scale: var(--toasts-before) * 0.05 + 1;\n  --y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));\n  height: var(--front-toast-height);\n}\n:where([data-sonner-toast]) > * {\n  transition: opacity 400ms;\n}\n:where([data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]) > * {\n  opacity: 0;\n}\n:where([data-sonner-toast][data-visible=false]) {\n  opacity: 0;\n  pointer-events: none;\n}\n:where([data-sonner-toast][data-mounted=true][data-expanded=true]) {\n  --y: translateY(calc(var(--lift) * var(--offset)));\n  height: var(--initial-height);\n}\n:where([data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]) {\n  --y: translateY(calc(var(--lift) * -100%));\n  opacity: 0;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]) {\n  --y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));\n  opacity: 0;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]) {\n  --y: translateY(40%);\n  opacity: 0;\n  transition: transform 500ms, opacity 200ms;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false])::before {\n  height: calc(var(--initial-height) + 20%);\n}\n[data-sonner-toast][data-swiping=true] {\n  transform: var(--y) translateY(var(--swipe-amount, 0px));\n  transition: none;\n}\n[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],\n[data-sonner-toast][data-swipe-out=true][data-y-position=top] {\n  animation: swipe-out 200ms ease-out forwards;\n}\n@keyframes swipe-out {\n  from {\n    transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));\n    opacity: 1;\n  }\n  to {\n    transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));\n    opacity: 0;\n  }\n}\n@media (max-width: 600px) {\n  [data-sonner-toaster] {\n    position: fixed;\n    --mobile-offset: 16px;\n    right: var(--mobile-offset);\n    left: var(--mobile-offset);\n    width: 100%;\n  }\n  [data-sonner-toaster] [data-sonner-toast] {\n    left: 0;\n    right: 0;\n    width: calc(100% - var(--mobile-offset) * 2);\n  }\n  [data-sonner-toaster][data-x-position=left] {\n    left: var(--mobile-offset);\n  }\n  [data-sonner-toaster][data-y-position=bottom] {\n    bottom: 20px;\n  }\n  [data-sonner-toaster][data-y-position=top] {\n    top: 20px;\n  }\n  [data-sonner-toaster][data-x-position=center] {\n    left: var(--mobile-offset);\n    right: var(--mobile-offset);\n    transform: none;\n  }\n}\n[data-sonner-toaster][data-theme=light] {\n  --normal-bg: #fff;\n  --normal-border: var(--gray4);\n  --normal-text: var(--gray12);\n  --success-bg: hsl(143, 85%, 96%);\n  --success-border: hsl(145, 92%, 91%);\n  --success-text: hsl(140, 100%, 27%);\n  --info-bg: hsl(208, 100%, 97%);\n  --info-border: hsl(221, 91%, 91%);\n  --info-text: hsl(210, 92%, 45%);\n  --warning-bg: hsl(49, 100%, 97%);\n  --warning-border: hsl(49, 91%, 91%);\n  --warning-text: hsl(31, 92%, 45%);\n  --error-bg: hsl(359, 100%, 97%);\n  --error-border: hsl(359, 100%, 94%);\n  --error-text: hsl(360, 100%, 45%);\n}\n[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true] {\n  --normal-bg: #000;\n  --normal-border: hsl(0, 0%, 20%);\n  --normal-text: var(--gray1);\n}\n[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true] {\n  --normal-bg: #fff;\n  --normal-border: var(--gray3);\n  --normal-text: var(--gray12);\n}\n[data-sonner-toaster][data-theme=dark] {\n  --normal-bg: #000;\n  --normal-border: hsl(0, 0%, 20%);\n  --normal-text: var(--gray1);\n  --success-bg: hsl(150, 100%, 6%);\n  --success-border: hsl(147, 100%, 12%);\n  --success-text: hsl(150, 86%, 65%);\n  --info-bg: hsl(215, 100%, 6%);\n  --info-border: hsl(223, 100%, 12%);\n  --info-text: hsl(216, 87%, 65%);\n  --warning-bg: hsl(64, 100%, 6%);\n  --warning-border: hsl(60, 100%, 12%);\n  --warning-text: hsl(46, 87%, 65%);\n  --error-bg: hsl(358, 76%, 10%);\n  --error-border: hsl(357, 89%, 16%);\n  --error-text: hsl(358, 100%, 81%);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=success] {\n  background: var(--success-bg);\n  border-color: var(--success-border);\n  color: var(--success-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=success] [data-close-button] {\n  background: var(--success-bg);\n  border-color: var(--success-border);\n  color: var(--success-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=info] {\n  background: var(--info-bg);\n  border-color: var(--info-border);\n  color: var(--info-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=info] [data-close-button] {\n  background: var(--info-bg);\n  border-color: var(--info-border);\n  color: var(--info-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=warning] {\n  background: var(--warning-bg);\n  border-color: var(--warning-border);\n  color: var(--warning-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=warning] [data-close-button] {\n  background: var(--warning-bg);\n  border-color: var(--warning-border);\n  color: var(--warning-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=error] {\n  background: var(--error-bg);\n  border-color: var(--error-border);\n  color: var(--error-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=error] [data-close-button] {\n  background: var(--error-bg);\n  border-color: var(--error-border);\n  color: var(--error-text);\n}\n.sonner-loading-wrapper {\n  --size: 16px;\n  height: var(--size);\n  width: var(--size);\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n}\n.sonner-loading-wrapper[data-visible=false] {\n  transform-origin: center;\n  animation: sonner-fade-out 0.2s ease forwards;\n}\n.sonner-spinner {\n  position: relative;\n  top: 50%;\n  left: 50%;\n  height: var(--size);\n  width: var(--size);\n}\n.sonner-loading-bar {\n  animation: sonner-spin 1.2s linear infinite;\n  background: var(--gray11);\n  border-radius: 6px;\n  height: 8%;\n  left: -10%;\n  position: absolute;\n  top: -3.9%;\n  width: 24%;\n}\n.sonner-loading-bar:nth-child(1) {\n  animation-delay: -1.2s;\n  transform: rotate(0.0001deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(2) {\n  animation-delay: -1.1s;\n  transform: rotate(30deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(3) {\n  animation-delay: -1s;\n  transform: rotate(60deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(4) {\n  animation-delay: -0.9s;\n  transform: rotate(90deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(5) {\n  animation-delay: -0.8s;\n  transform: rotate(120deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(6) {\n  animation-delay: -0.7s;\n  transform: rotate(150deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(7) {\n  animation-delay: -0.6s;\n  transform: rotate(180deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(8) {\n  animation-delay: -0.5s;\n  transform: rotate(210deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(9) {\n  animation-delay: -0.4s;\n  transform: rotate(240deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(10) {\n  animation-delay: -0.3s;\n  transform: rotate(270deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(11) {\n  animation-delay: -0.2s;\n  transform: rotate(300deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(12) {\n  animation-delay: -0.1s;\n  transform: rotate(330deg) translate(146%);\n}\n@keyframes sonner-fade-in {\n  0% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes sonner-fade-out {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n}\n@keyframes sonner-spin {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0.15;\n  }\n}\n@media (prefers-reduced-motion) {\n  [data-sonner-toast],\n  [data-sonner-toast] > *,\n  .sonner-loading-bar {\n    transition: none !important;\n    animation: none !important;\n  }\n}\n.sonner-loader {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center;\n  transition: opacity 200ms, transform 200ms;\n}\n.sonner-loader[data-visible=false] {\n  opacity: 0;\n  transform: scale(0.8) translate(-50%, -50%);\n}\n');
var bars = Array(12).fill(0);
function Loader(props) {
  return (() => {
    var _el$ = _tmpl$$D(), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(For, {
      each: bars,
      children: () => _tmpl$2$6()
    }));
    createRenderEffect(() => setAttribute(_el$, "data-visible", props.visible));
    return _el$;
  })();
}
function SuccessIcon() {
  return _tmpl$3$4();
}
function WarningIcon() {
  return _tmpl$4$4();
}
function InfoIcon() {
  return _tmpl$5$4();
}
function ErrorIcon() {
  return _tmpl$6$4();
}
function getAsset(type) {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
}
var toastsCounter = 0;
var Observer = class {
  constructor() {
    __publicField(this, "subscribers");
    __publicField(this, "toasts");
    // We use arrow functions to maintain the correct `this` reference
    __publicField(this, "subscribe", (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    });
    __publicField(this, "publish", (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    });
    __publicField(this, "addToast", (data) => {
      this.publish(data);
      this.toasts = [...this.toasts, data];
    });
    __publicField(this, "create", (data) => {
      var _a;
      const {
        message,
        ...rest
      } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || data.id && ((_a = data.id) == null ? void 0 : _a.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          id
        });
      }
      return id;
    });
    __publicField(this, "dismiss", (id) => {
      if (!id) {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      this.subscribers.forEach((subscriber) => subscriber({
        id,
        dismiss: true
      }));
      return id;
    });
    __publicField(this, "message", (message, data) => {
      return this.create({
        ...data,
        message
      });
    });
    __publicField(this, "error", (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    });
    __publicField(this, "success", (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    });
    __publicField(this, "info", (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    });
    __publicField(this, "warning", (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    });
    __publicField(this, "promise", (promise, data) => {
      if (!data) {
        return;
      }
      let id;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading
        });
      }
      const p = promise instanceof Promise ? promise : promise();
      let shouldDismiss = id !== void 0;
      p.then((response) => {
        if (response && typeof response.ok === "boolean" && !response.ok) {
          shouldDismiss = false;
          const message = typeof data.error === "function" ? data.error(`HTTP error! status: ${response.status}`) : data.error;
          this.create({
            id,
            type: "error",
            message
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const message = typeof data.success === "function" ? data.success(response) : data.success;
          this.create({
            id,
            type: "success",
            message
          });
        }
      }).catch((error) => {
        if (data.error !== void 0) {
          shouldDismiss = false;
          const message = typeof data.error === "function" ? data.error(error) : data.error;
          this.create({
            id,
            type: "error",
            message
          });
        }
      }).finally(() => {
        var _a;
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        (_a = data.finally) == null ? void 0 : _a.call(data);
      });
      return id;
    });
    __publicField(this, "loading", (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    });
    // We can't provide the toast we just created as a prop as we didn't create it yet, so we can create a default toast object, I just don't know how to use function in argument when calling()?
    __publicField(this, "custom", (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.publish({
        jsx: jsx(id),
        id,
        ...data
      });
      return id;
    });
    this.subscribers = [];
    this.toasts = [];
  }
};
var ToastState = new Observer();
function toastFunction(message, data) {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
}
var basicToast = toastFunction;
var toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
});
function useIsDocumentHidden() {
  const [isDocumentHidden, setIsDocumentHidden] = createSignal(false);
  onMount(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    onCleanup(() => {
      window.removeEventListener("visibilitychange", callback);
    });
  });
  return isDocumentHidden;
}
var VISIBLE_TOASTS_AMOUNT = 3;
var VIEWPORT_OFFSET = "32px";
var TOAST_LIFETIME = 4e3;
var TOAST_WIDTH = 356;
var GAP = 14;
var SWIPE_TRESHOLD = 20;
var TIME_BEFORE_UNMOUNT = 200;
function _cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
var Toast = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [removed, setRemoved] = createSignal(false);
  const [swiping, setSwiping] = createSignal(false);
  const [swipeOut, setSwipeOut] = createSignal(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = createSignal(0);
  const [initialHeight, setInitialHeight] = createSignal(0);
  let toastRef;
  const isFront = () => props.index === 0;
  const isVisible = () => props.index + 1 <= props.visibleToasts;
  const toastType = () => props.toast.type;
  const toastClassname = () => props.toast.class || "";
  const toastDescriptionClassname = () => props.toast.descriptionClass || "";
  const propsWithDefaults = mergeProps({
    gap: GAP
  }, props);
  const heightIndex = () => props.heights.findIndex((height) => height.toastId === props.toast.id) || 0;
  const duration = () => props.toast.duration || props.duration || TOAST_LIFETIME;
  let closeTimerStartTimeRef = 0;
  let lastCloseTimerStartTimeRef = 0;
  const [pointerStartRef, setPointerStartRef] = createSignal(null);
  const coords = () => props.position.split("-");
  const toastsHeightBefore = () => {
    return props.heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex()) return prev;
      return prev + curr.height;
    }, 0);
  };
  const isDocumentHidden = useIsDocumentHidden();
  const invert = () => props.toast.invert || props.invert;
  const disabled = () => toastType() === "loading";
  const offset = () => heightIndex() * propsWithDefaults.gap + toastsHeightBefore();
  function getLoadingIcon() {
    var _a;
    if ((_a = props.icons) == null ? void 0 : _a.loading) {
      return (() => {
        var _el$8 = _tmpl$7$4();
        insert(_el$8, () => props.icons.loading);
        createRenderEffect(() => setAttribute(_el$8, "data-visible", toastType() === "loading"));
        return _el$8;
      })();
    }
    return createComponent(Loader, {
      get visible() {
        return toastType() === "loading";
      }
    });
  }
  onMount(() => {
    setMounted(true);
  });
  onMount(() => {
    const toastNode = toastRef;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    createEffect(() => {
      props.setHeights((heights) => {
        const alreadyExists = heights.find((height) => height.toastId === props.toast.id);
        if (!alreadyExists) return [{
          toastId: props.toast.id,
          height: newHeight,
          position: props.toast.position
        }, ...heights];
        else return heights.map((height) => height.toastId === props.toast.id ? {
          ...height,
          height: newHeight
        } : height);
      });
    });
  });
  const deleteToast = () => {
    setRemoved(true);
    setOffsetBeforeRemove(offset());
    props.setHeights((h) => h.filter((height) => height.toastId !== props.toast.id));
    setTimeout(() => {
      props.removeToast(props.toast);
    }, TIME_BEFORE_UNMOUNT);
  };
  let remainingTime = duration();
  createEffect(on(() => [props.expanded, props.interacting, props.toast, duration(), props.toast.promise, toastType(), props.pauseWhenPageIsHidden, isDocumentHidden()], ([expanded, interacting, toast2, duration2, promise, toastType2, pauseWhenPageIsHidden, isDocumentHidden2]) => {
    if (promise && toastType2 === "loading" || duration2 === Number.POSITIVE_INFINITY) return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
        remainingTime = remainingTime - elapsedTime;
      }
      lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    };
    const startTimer = () => {
      closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(() => {
        var _a;
        (_a = toast2.onAutoClose) == null ? void 0 : _a.call(toast2, toast2);
        deleteToast();
      }, remainingTime);
    };
    if (expanded || interacting || pauseWhenPageIsHidden && isDocumentHidden2) pauseTimer();
    else startTimer();
    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  }));
  createEffect(on(() => props.toast.id, (toastId) => {
    const toastNode = toastRef;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      props.setHeights((h) => [{
        toastId,
        height,
        position: props.toast.position
      }, ...h]);
      onCleanup(() => {
        props.setHeights((h) => h.filter((height2) => height2.toastId !== toastId));
      });
    }
  }));
  createEffect(on(() => props.toast.delete, (d) => {
    if (d) deleteToast();
  }));
  return (() => {
    var _el$9 = _tmpl$9$2();
    _el$9.$$pointermove = (event) => {
      if (!pointerStartRef()) return;
      const yPosition = event.clientY - pointerStartRef().y;
      const xPosition = event.clientX - pointerStartRef().x;
      const clamp = coords()[0] === "top" ? Math.min : Math.max;
      const clampedY = clamp(0, yPosition);
      const swipeStartThreshold = event.pointerType === "touch" ? 10 : 2;
      const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold;
      if (isAllowedToSwipe) {
        toastRef == null ? void 0 : toastRef.style.setProperty("--swipe-amount", `${yPosition}px`);
      } else if (Math.abs(xPosition) > swipeStartThreshold) {
        setPointerStartRef(null);
      }
    };
    _el$9.$$pointerup = () => {
      var _a, _b;
      if (swipeOut()) return;
      setPointerStartRef(null);
      const swipeAmount = Number((toastRef == null ? void 0 : toastRef.style.getPropertyValue("--swipe-amount").replace("px", "")) || 0);
      if (Math.abs(swipeAmount) >= SWIPE_TRESHOLD) {
        setOffsetBeforeRemove(offset());
        (_b = (_a = props.toast).onDismiss) == null ? void 0 : _b.call(_a, props.toast);
        deleteToast();
        setSwipeOut(true);
        return;
      }
      toastRef == null ? void 0 : toastRef.style.setProperty("--swipe-amount", "0px");
      setSwiping(false);
    };
    _el$9.$$pointerdown = (event) => {
      if (disabled()) return;
      setOffsetBeforeRemove(offset());
      event.target.setPointerCapture(event.pointerId);
      if (event.target.tagName === "BUTTON") return;
      setSwiping(true);
      setPointerStartRef({
        x: event.clientX,
        y: event.clientY
      });
    };
    var _ref$ = toastRef;
    typeof _ref$ === "function" ? use(_ref$, _el$9) : toastRef = _el$9;
    insert(_el$9, createComponent(Show, {
      get when() {
        return props.closeButton && !props.toast.jsx;
      },
      get children() {
        var _el$10 = _tmpl$8$2();
        addEventListener(_el$10, "click", disabled() ? void 0 : () => {
          var _a, _b;
          deleteToast();
          (_b = (_a = props.toast).onDismiss) == null ? void 0 : _b.call(_a, props.toast);
        }, true);
        createRenderEffect((_p$) => {
          var _a, _b, _c;
          var _v$ = disabled(), _v$2 = _cn((_a = props.classes) == null ? void 0 : _a.closeButton, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.closeButton);
          _v$ !== _p$.e && setAttribute(_el$10, "data-disabled", _p$.e = _v$);
          _v$2 !== _p$.t && className(_el$10, _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$10;
      }
    }), null);
    insert(_el$9, createComponent(Show, {
      get when() {
        return props.toast.jsx || props.toast.title instanceof Element;
      },
      get fallback() {
        return [createComponent(Show, {
          get when() {
            return toastType() || props.toast.icon || props.toast.promise;
          },
          get children() {
            var _el$11 = _tmpl$10$2();
            insert(_el$11, (() => {
              var _c$ = memo(() => !!(props.toast.promise || props.toast.type === "loading" && !props.toast.icon));
              return () => _c$() ? props.toast.icon || getLoadingIcon() : null;
            })(), null);
            insert(_el$11, (() => {
              var _c$2 = memo(() => props.toast.type !== "loading");
              return () => {
                var _a;
                return _c$2() ? props.toast.icon || ((_a = props.icons) == null ? void 0 : _a[toastType()]) || getAsset(toastType())() : null;
              };
            })(), null);
            return _el$11;
          }
        }), (() => {
          var _el$12 = _tmpl$12$1(), _el$13 = _el$12.firstChild;
          insert(_el$13, () => props.toast.title);
          insert(_el$12, createComponent(Show, {
            get when() {
              return props.toast.description;
            },
            get children() {
              var _el$14 = _tmpl$11$1();
              insert(_el$14, () => props.toast.description);
              createRenderEffect(() => {
                var _a, _b, _c;
                return className(_el$14, _cn(props.descriptionClass, toastDescriptionClassname(), (_a = props.classes) == null ? void 0 : _a.description, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.description));
              });
              return _el$14;
            }
          }), null);
          createRenderEffect(() => {
            var _a, _b, _c;
            return className(_el$13, _cn((_a = props.classes) == null ? void 0 : _a.title, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.title));
          });
          return _el$12;
        })(), createComponent(Show, {
          get when() {
            return props.toast.cancel;
          },
          get children() {
            var _el$15 = _tmpl$13$1();
            _el$15.$$click = () => {
              var _a;
              deleteToast();
              if ((_a = props.toast.cancel) == null ? void 0 : _a.onClick) props.toast.cancel.onClick();
            };
            insert(_el$15, () => props.toast.cancel.label);
            createRenderEffect((_p$) => {
              var _a, _b, _c;
              var _v$20 = props.toast.cancelButtonStyle || props.cancelButtonStyle, _v$21 = _cn((_a = props.classes) == null ? void 0 : _a.cancelButton, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.cancelButton);
              _p$.e = style(_el$15, _v$20, _p$.e);
              _v$21 !== _p$.t && className(_el$15, _p$.t = _v$21);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$15;
          }
        }), createComponent(Show, {
          get when() {
            return props.toast.action;
          },
          get children() {
            var _el$16 = _tmpl$14$1();
            _el$16.$$click = (event) => {
              var _a;
              (_a = props.toast.action) == null ? void 0 : _a.onClick(event);
              if (event.defaultPrevented) return;
              deleteToast();
            };
            insert(_el$16, () => props.toast.action.label);
            createRenderEffect((_p$) => {
              var _a, _b, _c;
              var _v$22 = props.toast.actionButtonStyle || props.actionButtonStyle, _v$23 = _cn((_a = props.classes) == null ? void 0 : _a.actionButton, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.actionButton);
              _p$.e = style(_el$16, _v$22, _p$.e);
              _v$23 !== _p$.t && className(_el$16, _p$.t = _v$23);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$16;
          }
        })];
      },
      get children() {
        return props.toast.jsx || props.toast.title;
      }
    }), null);
    createRenderEffect((_p$) => {
      var _a, _b, _c, _d, _e, _f, _g;
      var _v$3 = props.toast.important ? "assertive" : "polite", _v$4 = _cn(props.class, toastClassname(), (_a = props.classes) == null ? void 0 : _a.toast, (_c = (_b = props.toast) == null ? void 0 : _b.classes) == null ? void 0 : _c.toast, (_d = props.classes) == null ? void 0 : _d.default, (_e = props.classes) == null ? void 0 : _e[toastType()], (_g = (_f = props.toast) == null ? void 0 : _f.classes) == null ? void 0 : _g[toastType()]), _v$5 = !(props.toast.jsx || props.toast.unstyled || props.unstyled), _v$6 = mounted(), _v$7 = Boolean(props.toast.promise), _v$8 = removed(), _v$9 = isVisible(), _v$10 = coords()[0], _v$11 = coords()[1], _v$12 = props.index, _v$13 = isFront(), _v$14 = swiping(), _v$15 = toastType(), _v$16 = invert(), _v$17 = swipeOut(), _v$18 = Boolean(props.expanded || props.expandByDefault && mounted()), _v$19 = {
        "--index": props.index,
        "--toasts-before": props.index,
        "--z-index": props.toasts.length - props.index,
        "--offset": `${removed() ? offsetBeforeRemove() : offset()}px`,
        "--initial-height": props.expandByDefault ? "auto" : `${initialHeight()}px`,
        ...props.style,
        ...props.toast.style
      };
      _v$3 !== _p$.e && setAttribute(_el$9, "aria-live", _p$.e = _v$3);
      _v$4 !== _p$.t && className(_el$9, _p$.t = _v$4);
      _v$5 !== _p$.a && setAttribute(_el$9, "data-styled", _p$.a = _v$5);
      _v$6 !== _p$.o && setAttribute(_el$9, "data-mounted", _p$.o = _v$6);
      _v$7 !== _p$.i && setAttribute(_el$9, "data-promise", _p$.i = _v$7);
      _v$8 !== _p$.n && setAttribute(_el$9, "data-removed", _p$.n = _v$8);
      _v$9 !== _p$.s && setAttribute(_el$9, "data-visible", _p$.s = _v$9);
      _v$10 !== _p$.h && setAttribute(_el$9, "data-y-position", _p$.h = _v$10);
      _v$11 !== _p$.r && setAttribute(_el$9, "data-x-position", _p$.r = _v$11);
      _v$12 !== _p$.d && setAttribute(_el$9, "data-index", _p$.d = _v$12);
      _v$13 !== _p$.l && setAttribute(_el$9, "data-front", _p$.l = _v$13);
      _v$14 !== _p$.u && setAttribute(_el$9, "data-swiping", _p$.u = _v$14);
      _v$15 !== _p$.c && setAttribute(_el$9, "data-type", _p$.c = _v$15);
      _v$16 !== _p$.w && setAttribute(_el$9, "data-invert", _p$.w = _v$16);
      _v$17 !== _p$.m && setAttribute(_el$9, "data-swipe-out", _p$.m = _v$17);
      _v$18 !== _p$.f && setAttribute(_el$9, "data-expanded", _p$.f = _v$18);
      _p$.y = style(_el$9, _v$19, _p$.y);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$9;
  })();
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) return window.getComputedStyle(document.documentElement).direction;
  return dirAttribute;
}
var Toaster$1 = (props) => {
  const propsWithDefaults = mergeProps({
    position: "bottom-right",
    hotkey: ["altKey", "KeyT"],
    theme: "light",
    visibleToasts: VISIBLE_TOASTS_AMOUNT,
    dir: getDocumentDirection()
  }, props);
  const [toastsStore, setToastsStore] = createStore({
    toasts: []
  });
  const possiblePositions = () => {
    return Array.from(new Set([propsWithDefaults.position].concat(toastsStore.toasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  };
  const [heights, setHeights] = createSignal([]);
  const [expanded, setExpanded] = createSignal(false);
  const [interacting, setInteracting] = createSignal(false);
  let listRef;
  const hotkeyLabel = () => propsWithDefaults.hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const [lastFocusedElementRef, setLastFocusedElementRef] = createSignal(null);
  const [isFocusedWithinRef, setIsFocusedWithinRef] = createSignal(false);
  const [actualTheme, setActualTheme] = createSignal(propsWithDefaults.theme !== "system" ? propsWithDefaults.theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const removeToast = (toast2) => setToastsStore("toasts", (toasts) => toasts.filter(({
    id
  }) => id !== toast2.id));
  onMount(() => {
    const unsub = ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        setToastsStore("toasts", produce((_toasts) => {
          _toasts.forEach((t) => {
            if (t.id === toast2.id) t.delete = true;
          });
        }));
        return;
      }
      const changedIndex = toastsStore.toasts.findIndex((t) => t.id === toast2.id);
      if (changedIndex !== -1) {
        setToastsStore("toasts", [changedIndex], reconcile(toast2));
        return;
      }
      setToastsStore("toasts", produce((_toasts) => {
        _toasts.unshift(toast2);
      }));
    });
    onCleanup(() => {
      unsub();
    });
  });
  createEffect(on(() => propsWithDefaults.theme, (theme) => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (typeof window === "undefined") return;
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({
      matches
    }) => {
      if (matches) setActualTheme("dark");
      else setActualTheme("light");
    });
  }));
  createEffect(() => {
    if (toastsStore.toasts.length <= 1) setExpanded(false);
  });
  onMount(() => {
    const handleKeyDown = (event) => {
      const isHotkeyPressed = propsWithDefaults.hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        setExpanded(true);
        listRef == null ? void 0 : listRef.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef || (listRef == null ? void 0 : listRef.contains(document.activeElement)))) setExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });
  createEffect(on(() => listRef, (ref) => {
    if (ref) {
      onCleanup(() => {
        var _a;
        if (lastFocusedElementRef()) {
          (_a = lastFocusedElementRef()) == null ? void 0 : _a.focus({
            preventScroll: true
          });
          setLastFocusedElementRef(null);
          setIsFocusedWithinRef(false);
        }
      });
    }
  }));
  return createComponent(Show, {
    get when() {
      return toastsStore.toasts.length > 0;
    },
    get children() {
      var _el$17 = _tmpl$15$1();
      insert(_el$17, createComponent(For, {
        get each() {
          return possiblePositions();
        },
        children: (position, index) => {
          const [y, x] = position.split("-");
          return (() => {
            var _el$18 = _tmpl$16$1();
            _el$18.$$pointerup = () => setInteracting(false);
            _el$18.$$pointerdown = () => {
              setInteracting(true);
            };
            _el$18.addEventListener("mouseleave", () => {
              if (!interacting()) setExpanded(false);
            });
            _el$18.$$mousemove = () => setExpanded(true);
            _el$18.addEventListener("mouseenter", () => setExpanded(true));
            _el$18.addEventListener("focus", (event) => {
              if (!isFocusedWithinRef()) {
                setIsFocusedWithinRef(true);
                setLastFocusedElementRef(event.relatedTarget);
              }
            });
            _el$18.addEventListener("blur", (event) => {
              var _a;
              if (isFocusedWithinRef() && !event.currentTarget.contains(event.relatedTarget)) {
                setIsFocusedWithinRef(false);
                if (lastFocusedElementRef()) {
                  (_a = lastFocusedElementRef()) == null ? void 0 : _a.focus({
                    preventScroll: true
                  });
                  setLastFocusedElementRef(null);
                }
              }
            });
            var _ref$2 = listRef;
            typeof _ref$2 === "function" ? use(_ref$2, _el$18) : listRef = _el$18;
            setAttribute(_el$18, "data-y-position", y);
            setAttribute(_el$18, "data-x-position", x);
            insert(_el$18, createComponent(For, {
              get each() {
                return toastsStore.toasts.filter((toast2) => !toast2.position && index() === 0 || toast2.position === position);
              },
              children: (toast2, index2) => createComponent(Toast, {
                get index() {
                  return index2();
                },
                get icons() {
                  return propsWithDefaults.icons;
                },
                toast: toast2,
                get duration() {
                  var _a;
                  return ((_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.duration) ?? props.duration;
                },
                get ["class"]() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.class;
                },
                get classes() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.classes;
                },
                get cancelButtonStyle() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.cancelButtonStyle;
                },
                get actionButtonStyle() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.actionButtonStyle;
                },
                get descriptionClass() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.descriptionClass;
                },
                get invert() {
                  return Boolean(propsWithDefaults.invert);
                },
                get visibleToasts() {
                  return propsWithDefaults.visibleToasts;
                },
                get closeButton() {
                  return Boolean(propsWithDefaults.closeButton);
                },
                get interacting() {
                  return interacting();
                },
                get position() {
                  return propsWithDefaults.position;
                },
                get style() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.style;
                },
                get unstyled() {
                  var _a;
                  return (_a = propsWithDefaults.toastOptions) == null ? void 0 : _a.unstyled;
                },
                removeToast,
                get toasts() {
                  return toastsStore.toasts;
                },
                get heights() {
                  return heights();
                },
                setHeights,
                get expandByDefault() {
                  return Boolean(propsWithDefaults.expand);
                },
                get gap() {
                  return propsWithDefaults.gap;
                },
                get expanded() {
                  return expanded();
                },
                get pauseWhenPageIsHidden() {
                  return propsWithDefaults.pauseWhenPageIsHidden;
                }
              })
            }));
            createRenderEffect((_p$) => {
              var _a;
              var _v$24 = propsWithDefaults.dir === "auto" ? getDocumentDirection() : propsWithDefaults.dir, _v$25 = propsWithDefaults.class, _v$26 = actualTheme(), _v$27 = propsWithDefaults.richColors, _v$28 = {
                "--front-toast-height": `${(_a = heights()[0]) == null ? void 0 : _a.height}px`,
                "--offset": typeof propsWithDefaults.offset === "number" ? `${propsWithDefaults.offset}px` : propsWithDefaults.offset || VIEWPORT_OFFSET,
                "--width": `${TOAST_WIDTH}px`,
                "--gap": `${GAP}px`,
                ...propsWithDefaults.style
              };
              _v$24 !== _p$.e && setAttribute(_el$18, "dir", _p$.e = _v$24);
              _v$25 !== _p$.t && className(_el$18, _p$.t = _v$25);
              _v$26 !== _p$.a && setAttribute(_el$18, "data-theme", _p$.a = _v$26);
              _v$27 !== _p$.o && setAttribute(_el$18, "data-rich-colors", _p$.o = _v$27);
              _p$.i = style(_el$18, _v$28, _p$.i);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0
            });
            return _el$18;
          })();
        }
      }));
      createRenderEffect(() => setAttribute(_el$17, "aria-label", `Notifications ${hotkeyLabel()}`));
      return _el$17;
    }
  });
};
/*!
 * Original code by Emil Kowalski
 * MIT Licensed, Copyright 2023 Emil Kowalski, see https://github.com/emilkowalski/sonner/blob/main/LICENSE.md for details
 *
 * Credits:
 * https://github.com/emilkowalski/sonner/blob/main/src/index.tsx
 */
delegateEvents(["pointerdown", "pointerup", "pointermove", "click", "mousemove"]);
const toastOptions = {
  duration: 2e3,
  closeButton: true
};
class Notify {
  static configure(options2) {
    if (options2.batchDelay !== void 0) {
      this.batchDelay = options2.batchDelay;
    }
    if (options2.maxBatchSize !== void 0) {
      this.maxBatchSize = options2.maxBatchSize;
    }
    if (options2.maxDisplayItems !== void 0) {
      this.maxDisplayItems = options2.maxDisplayItems;
    }
  }
  static loading(message) {
    return toast.loading(message, {
      ...toastOptions,
      duration: Infinity
    });
  }
  static dismiss(toastId) {
    toast.dismiss(toastId);
  }
  static promise(promise, messages) {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...toastOptions
    });
    return promise;
  }
  static success(message, category = "default") {
    this.queue("success", message, category);
  }
  static error(message, category = "default") {
    this.queue("error", message, category);
  }
  static info(message, category = "default") {
    this.queue("info", message, category);
  }
  static warning(message, category = "default") {
    this.queue("warning", message, category);
  }
  static immediate(type, message) {
    this.showToast(type, message);
  }
  static successNow(message) {
    this.showToast("success", message);
  }
  static errorNow(message) {
    this.showToast("error", message);
  }
  static infoNow(message) {
    this.showToast("info", message);
  }
  static warningNow(message) {
    this.showToast("warning", message);
  }
  static queue(type, message, category) {
    const key = `${category}_${type}`;
    if (!this.pendingNotifications.has(key)) {
      this.pendingNotifications.set(key, []);
    }
    const notifications = this.pendingNotifications.get(key);
    notifications.push({
      type,
      message,
      timestamp: Date.now()
    });
    if (notifications.length >= this.maxBatchSize) {
      this.flush(key);
      return;
    }
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key));
    }
    const timeoutId = window.setTimeout(() => {
      this.flush(key);
    }, this.batchDelay);
    this.timeoutIds.set(key, timeoutId);
  }
  static flush(key) {
    const notifications = this.pendingNotifications.get(key);
    if (!notifications || notifications.length === 0) return;
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key));
      this.timeoutIds.delete(key);
    }
    const type = notifications[0].type;
    const message = this.buildBatchedMessage(notifications);
    this.showToast(type, message);
    this.pendingNotifications.set(key, []);
  }
  static parseMessage(message) {
    const setToMatch = message.match(/^(\w+)\s+(?:set|reset)\s+to\s+(.+)$/i);
    if (setToMatch) {
      return {
        property: setToMatch[1],
        value: setToMatch[2]
      };
    }
    const colonMatch = message.match(/^(\w+):\s*(.+)$/);
    if (colonMatch) {
      return {
        property: colonMatch[1],
        value: colonMatch[2]
      };
    }
    return null;
  }
  static buildBatchedMessage(notifications) {
    if (notifications.length === 1) {
      return notifications[0].message;
    }
    const propertyChanges = /* @__PURE__ */ new Map();
    const unparsedMessages = [];
    for (const n of notifications) {
      const parsed = this.parseMessage(n.message);
      if (parsed) {
        const existing = propertyChanges.get(parsed.property);
        if (existing) {
          existing.lastValue = parsed.value;
          existing.count++;
        } else {
          propertyChanges.set(parsed.property, {
            firstValue: parsed.value,
            lastValue: parsed.value,
            count: 1,
            unparsedMessages: []
          });
        }
      } else {
        unparsedMessages.push(n.message);
      }
    }
    const parts = [];
    let itemCount = 0;
    propertyChanges.forEach((data, property) => {
      if (itemCount >= this.maxDisplayItems) return;
      if (data.count === 1) {
        parts.push(`${property}: ${data.lastValue}`);
      } else if (data.firstValue === data.lastValue) {
        parts.push(`${property}: ${data.lastValue} (×${data.count})`);
      } else {
        parts.push(`${property}: ${data.firstValue} → ${data.lastValue} (×${data.count})`);
      }
      itemCount++;
    });
    const unparsedCounts = /* @__PURE__ */ new Map();
    for (const msg of unparsedMessages) {
      unparsedCounts.set(msg, (unparsedCounts.get(msg) || 0) + 1);
    }
    unparsedCounts.forEach((count, message) => {
      if (itemCount >= this.maxDisplayItems) return;
      parts.push(count > 1 ? `${message} (×${count})` : message);
      itemCount++;
    });
    const totalItems = propertyChanges.size + unparsedCounts.size;
    const remainingCount = totalItems - this.maxDisplayItems;
    if (remainingCount > 0) {
      parts.push(`+${remainingCount} more`);
    }
    return parts.join(" • ");
  }
  static showToast(type, message) {
    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  }
  static flushAll() {
    this.pendingNotifications.forEach((_, key) => {
      this.flush(key);
    });
  }
  static clearAll() {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds.clear();
    this.pendingNotifications.clear();
  }
  static getPendingCount() {
    let count = 0;
    this.pendingNotifications.forEach((notifications) => {
      count += notifications.length;
    });
    return count;
  }
}
__publicField(Notify, "pendingNotifications", /* @__PURE__ */ new Map());
__publicField(Notify, "timeoutIds", /* @__PURE__ */ new Map());
__publicField(Notify, "batchDelay", 500);
__publicField(Notify, "maxBatchSize", 10);
__publicField(Notify, "maxDisplayItems", 5);
var _tmpl$$C = /* @__PURE__ */ template(`<svg class="flex-shrink-0 size-3.5"xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"stroke-linecap=round stroke-linejoin=round data-darkreader-inline-stroke=""style=--darkreader-inline-stroke:currentColor;><path d="M5 12h14"></path><path d="M12 5v14">`);
const Plus = (props) => (() => {
  var _el$ = _tmpl$$C();
  createRenderEffect((_p$) => {
    var _v$ = props.fill || "currentColor", _v$2 = props.stroke || "currentColor", _v$3 = props["stroke-width"] || 2;
    _v$ !== _p$.e && setAttribute(_el$, "fill", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "stroke", _p$.t = _v$2);
    _v$3 !== _p$.a && setAttribute(_el$, "stroke-width", _p$.a = _v$3);
    return _p$;
  }, {
    e: void 0,
    t: void 0,
    a: void 0
  });
  return _el$;
})();
var _tmpl$$B = /* @__PURE__ */ template(`<svg class="flex-shrink-0 size-3.5"xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"stroke-linecap=round stroke-linejoin=round data-darkreader-inline-stroke=""style=--darkreader-inline-stroke:currentColor;><path d="M5 12h14">`);
const Minus = (props) => (() => {
  var _el$ = _tmpl$$B();
  createRenderEffect((_p$) => {
    var _v$ = props.fill || "currentColor", _v$2 = props.stroke || "currentColor", _v$3 = props["stroke-width"] || 2;
    _v$ !== _p$.e && setAttribute(_el$, "fill", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "stroke", _p$.t = _v$2);
    _v$3 !== _p$.a && setAttribute(_el$, "stroke-width", _p$.a = _v$3);
    return _p$;
  }, {
    e: void 0,
    t: void 0,
    a: void 0
  });
  return _el$;
})();
var _tmpl$$A = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke-linecap=round stroke-linejoin=round><path d="M6 9l6 6 6-6">`);
const ExpandMore = (props) => (() => {
  var _el$ = _tmpl$$A();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5", _v$2 = props.stroke || "currentColor", _v$3 = props["stroke-width"] || 2;
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "stroke", _p$.t = _v$2);
    _v$3 !== _p$.a && setAttribute(_el$, "stroke-width", _p$.a = _v$3);
    return _p$;
  }, {
    e: void 0,
    t: void 0,
    a: void 0
  });
  return _el$;
})();
var _tmpl$$z = /* @__PURE__ */ template(`<svg class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out group-open:rotate-180"xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M6 9l6 6 6-6">`);
const GroupRotation = () => _tmpl$$z();
var _tmpl$$y = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z">`);
const Warning = (props) => (() => {
  var _el$ = _tmpl$$y();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$x = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2z"></path><path d="M11 10h2v5h-2zm0 6h2v2h-2z">`);
const WarningAmber = (props) => (() => {
  var _el$ = _tmpl$$x();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$w = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z">`);
const CheckCircle = (props) => (() => {
  var _el$ = _tmpl$$w();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$v = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z">`);
const Description = (props) => (() => {
  var _el$ = _tmpl$$v();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5 mr-2", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$u = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z">`);
const Tune = (props) => (() => {
  var _el$ = _tmpl$$u();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5 mr-2", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$t = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z">`);
const LocalGasStation = (props) => (() => {
  var _el$ = _tmpl$$t();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5 mr-2", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$s = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 -960 960 960"><path d="M120-120q-33 0-56.5-23.5T40-200v-200q0-33 23.5-56.5T120-480v-171q-18-11-29-28.5T80-720v-40q0-33 23.5-56.5T160-840h200q33 0 56.5 23.5T440-760v40q0 23-11 40.5T400-651v171h160v-171q-18-11-29-28.5T520-720v-40q0-33 23.5-56.5T600-840h200q33 0 56.5 23.5T880-760v40q0 23-11 40.5T840-651v171q33 0 56.5 23.5T920-400v200q0 33-23.5 56.5T840-120H120Zm480-600h200v-40H600v40Zm-440 0h200v-40H160v40Zm480 240h120v-160H640v160Zm-440 0h120v-160H200v160Zm-80 280h720v-200H120v200Zm40-520v-40 40Zm440 0v-40 40ZM120-200v-200 200Z">`);
const Engine = (props) => (() => {
  var _el$ = _tmpl$$s();
  createRenderEffect((_p$) => {
    var _v$ = props.class || "w-5 h-5 mr-2", _v$2 = props.fill || "currentColor";
    _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
    _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
    return _p$;
  }, {
    e: void 0,
    t: void 0
  });
  return _el$;
})();
var _tmpl$$r = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg height=20px viewBox="0 -960 960 960"width=20px fill=currentColor><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z">`);
const Refresh = (props) => {
  return (() => {
    var _el$ = _tmpl$$r();
    spread(_el$, mergeProps({
      get ["class"]() {
        return props.class || "";
      }
    }, props), true, true);
    return _el$;
  })();
};
var _tmpl$$q = /* @__PURE__ */ template(`<div class="w-full bg-gray-900 dark:bg-black rounded-md p-3"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-400"></span><span class="text-sm font-mono text-green-400"></span></div><input type=color class="w-full h-8 rounded cursor-pointer">`), _tmpl$2$5 = /* @__PURE__ */ template(`<div class="w-full bg-gray-900 dark:bg-black rounded-md p-3 flex items-center justify-between"><div><span class="text-sm text-gray-400"></span></div><div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in"><button type=button role=switch><span>`), _tmpl$3$3 = /* @__PURE__ */ template(`<div class="text-xs text-gray-500">`), _tmpl$4$3 = /* @__PURE__ */ template(`<div class="w-full bg-gray-900 dark:bg-black rounded-md p-3"><div class="flex items-center justify-between mb-2"><div><span class="text-sm text-gray-400"></span></div><span class="text-sm font-mono text-green-400"></span></div><input type=range class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">`), _tmpl$5$3 = /* @__PURE__ */ template(`<div class="text-xs text-gray-500 dark:text-gray-400 mt-2">`), _tmpl$6$3 = /* @__PURE__ */ template(`<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"><span></span><span>`), _tmpl$7$3 = /* @__PURE__ */ template(`<div class="w-full bg-gray-900 dark:bg-black rounded-md p-3 flex items-center justify-between"><span class="text-sm text-gray-400"></span><div class="flex items-center space-x-3"><input class="font-display text-2xl text-cyan-400 bg-transparent border-none w-28 text-right focus:ring-0 focus:outline-none p-0 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"><button type=button class="font-display bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center transition-colors select-none">x</button><div class="flex items-center space-x-1"><button type=button class="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"></button><button type=button class="bg-blue-500 hover:bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">`);
const log$b = Logger.create("Input");
const Input = (props) => {
  const notifyMode = props.notifyMode || "input";
  const notifyCategory = props.notifyCategory || "input_changes";
  const debounceApply = props.debounceApply ?? 0;
  let inputAttributes = {};
  let defaultValue;
  let reference;
  const multipliers = [1, 2, 5, 10, 100];
  const [currentMultiplierIndex, setCurrentMultiplierIndex] = createSignal(0);
  const multiplier = () => multipliers[currentMultiplierIndex()];
  const cycleMultiplier = () => {
    setCurrentMultiplierIndex((prev) => (prev + 1) % multipliers.length);
  };
  let applyTimeout = null;
  const scheduleApply = (value) => {
    if (!props.onApply) return;
    if (applyTimeout) {
      clearTimeout(applyTimeout);
      applyTimeout = null;
    }
    if (debounceApply && debounceApply > 0) {
      applyTimeout = window.setTimeout(() => {
        try {
          props.onApply && props.onApply(value);
        } catch (e) {
        }
        applyTimeout = null;
      }, debounceApply);
    } else {
      try {
        props.onApply && props.onApply(value);
      } catch (e) {
      }
    }
  };
  const flushApply = (value) => {
    if (applyTimeout) {
      clearTimeout(applyTimeout);
      applyTimeout = null;
    }
    try {
      props.onApply && props.onApply(value);
    } catch (e) {
    }
  };
  const notify = (msg, type = "success") => {
    const category = props.notifyCategory || notifyCategory;
    switch (type) {
      case "error":
        Notify.error(msg, category);
        break;
      case "info":
        Notify.info(msg, category);
        break;
      case "warning":
        Notify.warning(msg, category);
        break;
      default:
        Notify.success(msg, category);
    }
  };
  const resetToDefault = () => {
    if (defaultValue === void 0) return;
    if (!reference) return;
    if (!isResourceValid() && props.value === void 0) return;
    const parsedValue = prototypeOfValue() === "number" ? parseFloat(defaultValue) : defaultValue;
    if (reference) reference.value = parsedValue;
    const res = resource();
    if (res && props.name) {
      res[props.name] = parsedValue;
    }
    if (props.onChange) props.onChange(parsedValue);
    if (props.onApply) props.onApply(parsedValue);
    if (prototypeOfValue() === "number") calculateMax();
  };
  try {
    if (!props.resource && props.value === void 0 && !props.name) {
      throw new Error("Input component requires either a resource/name pair or a value prop.");
    }
    if (props.resource && typeof props.resource !== "string" && typeof props.resource !== "object") {
      throw new Error("Input component resource prop must be an object or string.");
    }
  } catch (e) {
    log$b.error("Input validation failed:", e);
    return null;
  }
  const resource = () => {
    if (!props.resource) return null;
    if (typeof props.resource === "string") {
      const obj = getObjectFromPath(props.resource, true);
      if (!obj) return null;
      return obj;
    }
    return props.resource;
  };
  const isResourceValid = () => {
    const res = resource();
    return res !== null && res !== void 0;
  };
  const prototypeOfValue = () => {
    return ["int", "float"].includes(props.type ?? "") ? "number" : "text";
  };
  const values = () => {
    if (!isResourceValid()) return {};
    if (prototypeOfValue() === "number") {
      const res = resource();
      if (!res || !props.name || !(props.name in res)) return {};
      const resourceValue = res[props.name];
      const isNegative = resourceValue < 0;
      return {
        min: isNegative ? String(resourceValue * 2) : "0",
        value: resourceValue,
        max: isNegative ? "-1" : String(resourceValue * 2),
        step: props.type == "float" ? "0.1" : "1"
      };
    }
  };
  const setDefaults = () => {
    if (!isResourceValid()) return;
    const res = resource();
    if (res && props.name && props.name in res) {
      defaultValue = res[props.name];
    }
  };
  const between = () => {
    if (prototypeOfValue() !== "number" || !reference) return false;
    const value = Number(reference.value);
    const min = Number(reference.min);
    const max = Number(reference.max);
    if (max < 0) {
      return value >= min && value <= max;
    }
    return value > min && value <= max;
  };
  const calculateMax = () => {
    if (!isResourceValid()) return;
    const res = resource();
    if (!res || !props.name || !(props.name in res)) return;
    const currentValue = res[props.name];
    const isNegative = currentValue < 0;
    if (isNegative) {
      const newMin = currentValue * 2 * 100;
      reference.min = newMin > -1 ? "-10" : newMin.toString();
      reference.max = "-1";
    } else {
      const newMax = currentValue * 2 * 100;
      reference.max = newMax < 1 ? "10" : newMax.toString();
      reference.min = "0";
    }
    reference.placeholder = `Between ${reference == null ? void 0 : reference.min} and ${reference == null ? void 0 : reference.max}`;
  };
  const reset = () => {
    if (!isResourceValid()) return;
    if (defaultValue === void 0) return notify("No default value set.", "error");
    const res = resource();
    if (!res || !props.name) return;
    reference.value = defaultValue;
    res[props.name] = reference.value;
    notify(`${props.name} reset to ${reference.value}`, "info");
  };
  if (props.ref) {
    props.ref({
      reset,
      resetToDefault
    });
  }
  const apply = (event) => {
    if (prototypeOfValue() === "number") {
      if (event instanceof KeyboardEvent) {
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          const isMac = navigator.platform === "MacIntel";
          const currentValue = isNaN(parseFloat((reference == null ? void 0 : reference.value) || "0")) ? parseFloat((reference == null ? void 0 : reference.min) || "0") || 0 : parseFloat((reference == null ? void 0 : reference.value) || "0");
          const direction = event.key === "ArrowUp" ? 1 : -1;
          const typeModifier = props.type === "int" ? 10 : 1;
          const keyboardModifier = (isMac ? event.metaKey : event.ctrlKey) ? 100 * typeModifier : event.shiftKey ? 10 * typeModifier : event.altKey ? 0.1 * typeModifier : 1 * typeModifier;
          const currentMultiplier = multiplier();
          const totalModifier = keyboardModifier * currentMultiplier;
          const decimals = Math.max((currentValue.toString().split(".")[1] || "").length, event.altKey ? 1 : 0);
          const newValue = currentValue + direction * totalModifier;
          reference.value = newValue.toFixed(decimals);
          if (!between()) {
            if (!isResourceValid()) return;
            const res2 = resource();
            if (res2 && props.name && props.name in res2) {
              reference.value = res2[props.name];
            }
            return notify(`Value must be between ${reference == null ? void 0 : reference.min} and ${reference == null ? void 0 : reference.max}`, "error");
          }
          if (!isResourceValid()) return;
          const res = resource();
          if (res) {
            if (props.name) res[props.name] = reference.value;
          }
          calculateMax();
          notify(`${props.name} set to ${reference.value}`, "success");
        }
      } else if (event instanceof InputEvent) {
        if (!between()) {
          if (!isResourceValid()) return;
          const res2 = resource();
          if (res2 && props.name && props.name in res2) {
            reference.value = res2[props.name];
          }
          return notify(`Value must be between ${reference == null ? void 0 : reference.min} and ${reference == null ? void 0 : reference.max}`, "error");
        }
        if (!isResourceValid()) return;
        const res = resource();
        if (res && props.name) {
          res[props.name] = parseFloat(reference.value);
        }
        calculateMax();
        const numericValue = parseFloat(reference.value);
        props.onChange && props.onChange(numericValue);
        if (notifyMode === "input" || notifyMode === "both") {
          notify(`${props.name} set to ${reference.value}`, "success");
        }
        scheduleApply(numericValue);
      }
    }
  };
  const increment = () => {
    if (prototypeOfValue() !== "number" || !reference) return;
    if (!isResourceValid()) return;
    const currentValue = isNaN(parseFloat(reference.value || "0")) ? parseFloat(reference.min || "0") || 0 : parseFloat(reference.value || "0");
    const baseStep = props.type === "int" ? 1 : 0.1;
    const step = baseStep * multiplier();
    const decimals = props.type === "int" ? 0 : Math.max(1, Math.ceil(Math.log10(1 / step)));
    const newValue = currentValue + step;
    reference.value = newValue.toFixed(decimals);
    if (!between()) {
      const res2 = resource();
      if (res2 && props.name && props.name in res2) {
        reference.value = res2[props.name];
      }
      return notify(`Value must be between ${reference.min} and ${reference.max}`, "error");
    }
    const res = resource();
    if (res && props.name) {
      const numericValue = parseFloat(reference.value);
      res[props.name] = numericValue;
      props.onChange && props.onChange(numericValue);
      if (notifyMode === "input" || notifyMode === "both") {
        notify(`${props.name} set to ${reference.value}`, "success");
      }
      scheduleApply(numericValue);
    }
    calculateMax();
  };
  const decrement = () => {
    if (prototypeOfValue() !== "number" || !reference) return;
    if (!isResourceValid()) return;
    const currentValue = isNaN(parseFloat(reference.value || "0")) ? parseFloat(reference.min || "0") || 0 : parseFloat(reference.value || "0");
    const baseStep = props.type === "int" ? 1 : 0.1;
    const step = baseStep * multiplier();
    const decimals = props.type === "int" ? 0 : Math.max(1, Math.ceil(Math.log10(1 / step)));
    const newValue = currentValue - step;
    reference.value = newValue.toFixed(decimals);
    if (!between()) {
      const res2 = resource();
      if (res2 && props.name && props.name in res2) {
        reference.value = res2[props.name];
      }
      return notify(`Value must be between ${reference.min} and ${reference.max}`, "error");
    }
    const res = resource();
    if (res && props.name) {
      const numericValue = parseFloat(reference.value);
      res[props.name] = numericValue;
      props.onChange && props.onChange(numericValue);
      if (notifyMode === "input" || notifyMode === "both") {
        notify(`${props.name} set to ${reference.value}`, "success");
      }
      scheduleApply(numericValue);
    }
    calculateMax();
  };
  inputAttributes = values();
  onMount(() => {
    calculateMax();
    setDefaults();
  });
  onCleanup(() => {
    reset();
    reference = void 0;
  });
  if (props.type === "color") {
    const currentVal = () => {
      if (props.value !== void 0) {
        if (typeof props.value === "function") {
          try {
            return String(props.value());
          } catch (e) {
            return String(props.value);
          }
        }
        return String(props.value);
      }
      const res = resource();
      if (res && props.name && props.name in res) return String(res[props.name]);
      return "#ffffff";
    };
    return (() => {
      var _el$ = _tmpl$$q(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling;
      insert(_el$3, () => props.label || formatLabel(String(props.name || "")));
      insert(_el$4, currentVal);
      _el$5.$$input = (e) => {
        const value = String(e.currentTarget.value);
        props.onChange && props.onChange(value);
        if (isResourceValid() && props.name) {
          const res = resource();
          if (res) res[props.name] = value;
        }
        scheduleApply(value);
      };
      createRenderEffect(() => _el$5.value = currentVal());
      return _el$;
    })();
  }
  if (props.type === "boolean") {
    const currentVal = () => {
      if (props.value !== void 0) {
        if (typeof props.value === "function") {
          try {
            return Boolean(props.value());
          } catch (e) {
            return Boolean(props.value);
          }
        }
        return Boolean(props.value);
      }
      const res = resource();
      if (res && props.name && props.name in res) return Boolean(res[props.name]);
      return false;
    };
    return (() => {
      var _el$6 = _tmpl$2$5(), _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild, _el$9 = _el$7.nextSibling, _el$10 = _el$9.firstChild, _el$11 = _el$10.firstChild;
      insert(_el$8, () => props.label || formatLabel(String(props.name || "")));
      insert(_el$7, (() => {
        var _c$ = memo(() => !!props.comment);
        return () => _c$() && (() => {
          var _el$12 = _tmpl$3$3();
          insert(_el$12, () => props.comment);
          return _el$12;
        })();
      })(), null);
      _el$10.$$click = () => {
        const newValue = !currentVal();
        props.onChange && props.onChange(newValue);
        if (isResourceValid() && props.name) {
          const res = resource();
          if (res) res[props.name] = newValue;
        }
        flushApply(newValue);
      };
      createRenderEffect((_p$) => {
        var _v$ = `relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${currentVal() ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`, _v$2 = currentVal(), _v$3 = `absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${currentVal() ? "right-0 border-green-500" : "left-0 border-gray-300 dark:border-gray-600"}`;
        _v$ !== _p$.e && className(_el$10, _p$.e = _v$);
        _v$2 !== _p$.t && setAttribute(_el$10, "aria-checked", _p$.t = _v$2);
        _v$3 !== _p$.a && className(_el$11, _p$.a = _v$3);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      });
      return _el$6;
    })();
  }
  if (props.type === "range") {
    const currentVal = () => {
      if (props.value !== void 0) {
        if (typeof props.value === "function") {
          try {
            return Number(props.value());
          } catch (e) {
            return Number(props.value);
          }
        }
        return Number(props.value);
      }
      const res = resource();
      if (res && props.name && props.name in res) return Number(res[props.name]);
      return 0;
    };
    const decimals = (() => {
      const s = props.step ?? 1;
      const n = typeof s === "number" ? s : parseFloat(String(s));
      if (!isFinite(n) || n <= 0) return 0;
      const d = Math.max(0, -Math.floor(Math.log10(n)));
      return d;
    })();
    const formatValue = (v) => {
      if (props.valueFormatter) return props.valueFormatter(v);
      return Number.isFinite(v) ? v.toFixed(decimals) : String(v);
    };
    const showLimits = props.showLimits !== void 0 ? props.showLimits : true;
    return (() => {
      var _el$13 = _tmpl$4$3(), _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild, _el$17 = _el$15.nextSibling, _el$18 = _el$14.nextSibling;
      insert(_el$16, () => props.label || formatLabel(String(props.name || "")));
      insert(_el$17, () => formatValue(currentVal()), null);
      insert(_el$17, () => props.unit ? ` ${props.unit}` : "", null);
      _el$18.$$pointerup = (e) => {
        const v = Number(e.currentTarget.value);
        flushApply(v);
      };
      _el$18.$$input = (e) => {
        const value = Number(e.currentTarget.value);
        if (props.onChange) props.onChange(value);
        if (isResourceValid() && props.name) {
          const res = resource();
          if (res && props.name) res[props.name] = value;
        }
        if (notifyMode === "input" || notifyMode === "both") {
          Notify.success(`${formatValue(value)}${props.unit ? " " + props.unit : ""}`, props.notifyCategory || notifyCategory);
        }
        scheduleApply(value);
      };
      insert(_el$13, (() => {
        var _c$2 = memo(() => !!props.comment);
        return () => _c$2() && (() => {
          var _el$19 = _tmpl$5$3();
          insert(_el$19, () => props.comment);
          return _el$19;
        })();
      })(), null);
      insert(_el$13, showLimits && (() => {
        var _el$20 = _tmpl$6$3(), _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling;
        insert(_el$21, () => props.min ?? 0, null);
        insert(_el$21, () => props.unit ? ` ${props.unit}` : "", null);
        insert(_el$21, () => props.minLabel ? ` • ${props.minLabel}` : "", null);
        insert(_el$22, () => props.max ?? 100, null);
        insert(_el$22, () => props.unit ? ` ${props.unit}` : "", null);
        insert(_el$22, () => props.maxLabel ? ` • ${props.maxLabel}` : "", null);
        return _el$20;
      })(), null);
      createRenderEffect((_p$) => {
        var _v$4 = props.min ?? 0, _v$5 = props.max ?? 100, _v$6 = props.step ?? 1;
        _v$4 !== _p$.e && setAttribute(_el$18, "min", _p$.e = _v$4);
        _v$5 !== _p$.t && setAttribute(_el$18, "max", _p$.t = _v$5);
        _v$6 !== _p$.a && setAttribute(_el$18, "step", _p$.a = _v$6);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      });
      createRenderEffect(() => _el$18.value = currentVal());
      return _el$13;
    })();
  }
  return (() => {
    var _el$23 = _tmpl$7$3(), _el$24 = _el$23.firstChild, _el$25 = _el$24.nextSibling, _el$26 = _el$25.firstChild, _el$27 = _el$26.nextSibling;
    _el$27.firstChild;
    var _el$29 = _el$27.nextSibling, _el$30 = _el$29.firstChild, _el$31 = _el$30.nextSibling;
    insert(_el$24, () => formatLabel(String(props.name || "")));
    var _ref$ = reference;
    typeof _ref$ === "function" ? use(_ref$, _el$26) : reference = _el$26;
    spread(_el$26, mergeProps({
      get type() {
        return prototypeOfValue();
      }
    }, inputAttributes, {
      "onInput": (e) => apply(e),
      "onKeyDown": (e) => apply(e)
    }), false, false);
    _el$27.$$click = cycleMultiplier;
    insert(_el$27, multiplier, null);
    _el$30.$$click = decrement;
    insert(_el$30, createComponent(Minus, {
      "class": "w-4 h-4"
    }));
    _el$31.$$click = increment;
    insert(_el$31, createComponent(Plus, {
      "class": "w-4 h-4"
    }));
    return _el$23;
  })();
};
delegateEvents(["input", "click", "pointerup"]);
var _tmpl$$p = /* @__PURE__ */ template(`<li class="flex gap-2">`);
const log$a = Logger.create("Definitions");
const inputRefs = /* @__PURE__ */ new Map();
const resetDefinitions = () => {
  if (inputRefs.size === 0) {
    Notify.errorNow("No definitions to reset");
    return;
  }
  inputRefs.forEach((ref) => {
    if (ref && typeof ref.reset === "function") {
      ref.reset();
    }
  });
  log$a.info("Definitions reset to defaults");
  Notify.successNow("Definitions reset to defaults");
};
const getDefinitions = async () => {
  return await new Promise((resolve, reject) => {
    var _a, _b, _c;
    try {
      const {
        allowed,
        ignored,
        reset
      } = Props.Definition;
      const definition = (_c = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance) == null ? void 0 : _c.definition;
      if (!definition) throw new Error("No definition found.");
      inputRefs.clear();
      const response = [];
      for (const item of Object.entries(definition)) {
        const [propName, prop] = item;
        const propType = typeof prop;
        if (ignored.includes(propType)) continue;
        const isAllowed = allowed.some((p) => p.name === propName);
        if (!isAllowed) continue;
        const syncType = allowed.find((p) => p.name === propName).type;
        if (!syncType) continue;
        const hasComment = allowed.find((p) => p.name === propName).comment;
        response.push((() => {
          var _el$ = _tmpl$$p();
          insert(_el$, createComponent(Input, {
            name: propName,
            type: syncType,
            comment: hasComment,
            resource: "geofs.aircraft.instance.definition",
            ref: (el) => {
              if (reset && el) {
                inputRefs.set(propName, el);
              }
            }
          }));
          return _el$;
        })());
      }
      log$a.debug(`Loaded ${response.length} definition properties`);
      resolve(response);
    } catch (e) {
      log$a.error("Failed to load definitions:", e);
      reject(e);
    }
  });
};
var _tmpl$$o = /* @__PURE__ */ template(`<li class="flex gap-2">`), _tmpl$2$4 = /* @__PURE__ */ template(`<details class="group/engine bg-gray-800/50 dark:bg-black/30 rounded-lg"><summary class="flex items-center justify-between gap-2 p-3 font-medium cursor-pointer list-none [&amp;::-webkit-details-marker]:hidden"><span class="flex gap-2 text-gray-900 dark:text-white"></span></summary><article class="px-4 pb-4"><ul class="flex flex-col gap-4 pl-2 mt-2">`);
const log$9 = Logger.create("Engines");
const engineInputRefs = /* @__PURE__ */ new Map();
const resetEngines = () => {
  if (engineInputRefs.size === 0) {
    Notify.errorNow("No engines to reset");
    return;
  }
  let resetCount = 0;
  engineInputRefs.forEach((propsMap) => {
    propsMap.forEach((ref) => {
      if (ref && typeof ref.reset === "function") {
        ref.reset();
        resetCount++;
      }
    });
  });
  if (resetCount > 0) {
    log$9.info(`Reset ${resetCount} engine properties to defaults`);
    Notify.successNow(`${resetCount} engine properties reset to defaults`);
  } else {
    Notify.errorNow("No engine properties to reset");
  }
};
const getEngines = async () => {
  return await new Promise((resolve, reject) => {
    var _a, _b, _c, _d;
    try {
      const {
        allowed,
        ignored,
        reset
      } = Props.Engines;
      const engines = (_c = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance) == null ? void 0 : _c.engines;
      if (!engines) throw new Error("No engines found.");
      engineInputRefs.clear();
      const response = [];
      for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i].name || `Engine ${i + 1}`;
        const engineKey = `engine_${i}`;
        const currentEngine = engines[i];
        if (!engineInputRefs.has(engineKey)) {
          engineInputRefs.set(engineKey, /* @__PURE__ */ new Map());
        }
        const currentEngineRefs = engineInputRefs.get(engineKey);
        const engineInputs = [];
        for (const item of Object.entries(currentEngine)) {
          const [propName, prop] = item;
          const propType = typeof prop;
          if (ignored.includes(propType)) continue;
          const isAllowed = allowed.some((p) => p.name === propName);
          if (!isAllowed) continue;
          const syncType = allowed.find((p) => p.name === propName).type;
          if (!syncType) continue;
          const hasComment = (_d = allowed.find((p) => p.name === propName)) == null ? void 0 : _d.comment;
          engineInputs.push((() => {
            var _el$ = _tmpl$$o();
            insert(_el$, createComponent(Input, {
              name: propName,
              type: syncType,
              comment: hasComment,
              resource: currentEngine,
              ref: (el) => {
                if (reset && el) {
                  currentEngineRefs.set(propName, el);
                }
              }
            }));
            return _el$;
          })());
        }
        response.push((() => {
          var _el$2 = _tmpl$2$4(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$3.nextSibling, _el$6 = _el$5.firstChild;
          insert(_el$4, engineName);
          insert(_el$3, createComponent(ExpandMore, {
            "class": "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out group-open/engine:rotate-180"
          }), null);
          insert(_el$6, engineInputs);
          return _el$2;
        })());
      }
      log$9.debug(`Loaded ${engines.length} engines`);
      resolve(response);
    } catch (e) {
      log$9.error("Failed to load engines:", e);
      reject(e);
    }
  });
};
const log$8 = Logger.create("InstrumentManager");
class InstrumentManager {
  /**
   * Initialize the InstrumentManager and hook into ALL GeoFS instrument functions
   */
  static init() {
    if (this.isInitialized) return;
    const instruments = unsafeWindow.instruments;
    if (!instruments) {
      log$8.warn("GeoFS instruments system not available yet");
      return;
    }
    this.isInitialized = true;
    log$8.info("InstrumentManager initialized with full GeoFS integration");
  }
  /**
   * Hook into ALL GeoFS instrument functions
   */
  /**
   * Register an instrument definition in GeoFS's instruments.definitions
   */
  static registerDefinition(definition) {
    const instruments = unsafeWindow.instruments;
    if (!(instruments == null ? void 0 : instruments.definitions)) {
      log$8.error("instruments.definitions not available");
      return false;
    }
    const {
      name
    } = definition;
    const geofsDefinition = {
      container: definition.container,
      stackX: definition.stackX ?? true,
      stackY: definition.stackY,
      group: definition.group || "all",
      compositors: definition.compositors || "css",
      overlay: definition.overlay
    };
    if (definition.animations) {
      geofsDefinition.animations = definition.animations;
    }
    if (definition.visibility !== void 0) {
      geofsDefinition.visibility = definition.visibility;
    }
    instruments.definitions[name] = geofsDefinition;
    this.registeredInstruments.set(name, {
      definition,
      indicator: null,
      isActive: false
    });
    log$8.debug(`Registered instrument definition: ${name}`);
    return true;
  }
  /**
   * Activate an instrument by triggering a re-init of the instrument system
   * This ensures correct stacking and layout handling by GeoFS
   */
  static activateInstrument(name) {
    const instruments = unsafeWindow.instruments;
    if (!instruments) {
      log$8.error("GeoFS instrument system not available");
      return false;
    }
    const registered = this.registeredInstruments.get(name);
    if (!registered) {
      log$8.error(`Instrument not registered: ${name}`);
      return false;
    }
    registered.isActive = true;
    this.reinitializeActiveInstruments();
    log$8.debug(`Activated instrument (reinit): ${name}`);
    return true;
  }
  /**
   * Deactivate an instrument (hide it, don't destroy to preserve stack position if possible, 
   * or destroy if we want to remove it completely)
   */
  static deactivateInstrument(name) {
    const registered = this.registeredInstruments.get(name);
    if (!registered) return false;
    registered.isActive = false;
    if (registered.definition.onDestroy) {
      try {
        registered.definition.onDestroy();
      } catch (e) {
      }
    }
    this.reinitializeActiveInstruments();
    log$8.debug(`Deactivated instrument (reinit): ${name}`);
    return true;
  }
  /**
   * Ensure all registered definitions exist in instruments.definitions
   */
  static ensureDefinitionsRegistered() {
    const instruments = unsafeWindow.instruments;
    if (!(instruments == null ? void 0 : instruments.definitions)) return;
    for (const [name, registered] of this.registeredInstruments) {
      if (!instruments.definitions[name]) {
        const geofsDefinition = {
          container: registered.definition.container,
          stackX: registered.definition.stackX ?? true,
          group: registered.definition.group || "all",
          compositors: registered.definition.compositors || "css",
          overlay: registered.definition.overlay
        };
        if (registered.definition.animations) {
          geofsDefinition.animations = registered.definition.animations;
        }
        if (registered.definition.visibility !== void 0) {
          geofsDefinition.visibility = registered.definition.visibility;
        }
        instruments.definitions[name] = geofsDefinition;
        log$8.debug(`Ensured definition exists: ${name}`);
      }
    }
  }
  /**
   * Re-initialize GeoFS instruments to include currently active registered instruments
   */
  static reinitializeActiveInstruments() {
    var _a;
    const instruments = unsafeWindow.instruments;
    if (!instruments) {
      log$8.warn("Cannot reinitialize instruments: GeoFS instruments not available");
      return;
    }
    this.ensureDefinitionsRegistered();
    const listObj = {};
    if (instruments.list) {
      for (const key in instruments.list) {
        listObj[key] = "";
      }
    }
    for (const [name, registered] of this.registeredInstruments) {
      if (registered.isActive) {
        listObj[name] = "";
      } else {
        if (listObj[name]) delete listObj[name];
      }
    }
    try {
      instruments.init(listObj);
      for (const [name, registered] of this.registeredInstruments) {
        registered.indicator = ((_a = instruments.list) == null ? void 0 : _a[name]) || null;
        if (registered.indicator && registered.definition.onInit) {
          try {
            registered.definition.onInit();
          } catch (e) {
          }
        }
      }
      instruments.rescale && instruments.rescale();
      instruments.updateScreenPositions && instruments.updateScreenPositions();
      log$8.debug("Reinitialized active instruments via GeoFS init");
    } catch (e) {
      log$8.error("Failed to reinitialize instruments:", e);
    }
  }
  /**
   * Check if an instrument is active
   */
  static isActive(name) {
    const registered = this.registeredInstruments.get(name);
    return (registered == null ? void 0 : registered.isActive) ?? false;
  }
  /**
   * Check if instrument exists in instruments.list
   */
  static exists(name) {
    var _a;
    const instruments = unsafeWindow.instruments;
    return !!((_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name]);
  }
  /**
   * Check if an instrument is visible (uses GeoFS native system)
   */
  static isVisible(name) {
    var _a;
    const instruments = unsafeWindow.instruments;
    const indicator = (_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name];
    if (!indicator) return false;
    return indicator.visibility !== false;
  }
  /**
   * Get instrument indicator
   */
  static getIndicator(name) {
    var _a;
    return (_a = this.registeredInstruments.get(name)) == null ? void 0 : _a.indicator;
  }
  /**
   * Show an instrument (uses GeoFS native method)
   * Works with instruments.show() and instruments.show(groupName)
   */
  static show(name) {
    var _a;
    const instruments = unsafeWindow.instruments;
    if ((_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name]) {
      instruments.list[name].show();
      log$8.debug(`Showed instrument: ${name}`);
    }
  }
  /**
   * Hide an instrument (uses GeoFS native method)
   * Works with instruments.hide() and instruments.hide(groupName)
   */
  static hide(name) {
    var _a;
    const instruments = unsafeWindow.instruments;
    if ((_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name]) {
      instruments.list[name].hide();
      log$8.debug(`Hid instrument: ${name}`);
    }
  }
  /**
   * Toggle instrument visibility
   */
  static toggle(name) {
    if (this.isVisible(name)) {
      this.hide(name);
    } else {
      this.show(name);
    }
  }
  /**
   * Set instrument opacity (uses GeoFS native method)
   */
  static setOpacity(name, opacity) {
    var _a, _b;
    const instruments = unsafeWindow.instruments;
    if ((_b = (_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name]) == null ? void 0 : _b.overlay) {
      instruments.list[name].overlay.setOpacity(opacity);
    }
  }
  /**
   * Rescale an instrument (uses GeoFS native method)
   */
  static rescale(name) {
    var _a;
    const instruments = unsafeWindow.instruments;
    if ((_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name]) {
      instruments.list[name].scale();
    }
  }
  /**
   * Update screen position for an instrument
   */
  static updateScreenPosition(name) {
    var _a, _b;
    const instruments = unsafeWindow.instruments;
    const geofs2 = unsafeWindow.geofs;
    const indicator = (_a = instruments == null ? void 0 : instruments.list) == null ? void 0 : _a[name];
    if (!indicator || !indicator.definition) return;
    if (((_b = geofs2 == null ? void 0 : geofs2.camera) == null ? void 0 : _b.currentModeName) === "cockpit" && indicator.definition.cockpit) {
      indicator.updateCockpitPosition();
    } else {
      if (instruments.updateScreenPositions) {
        instruments.updateScreenPositions();
      }
    }
  }
  /**
   * Unregister an instrument completely
   */
  static unregister(name) {
    var _a;
    this.deactivateInstrument(name);
    const instruments = unsafeWindow.instruments;
    if ((_a = instruments == null ? void 0 : instruments.definitions) == null ? void 0 : _a[name]) {
      delete instruments.definitions[name];
    }
    this.registeredInstruments.delete(name);
    log$8.debug(`Unregistered instrument: ${name}`);
  }
  /**
   * Get all registered instrument names
   */
  static getRegisteredInstruments() {
    return Array.from(this.registeredInstruments.keys());
  }
  /**
   * Apply custom layout logic (e.g. new lines)
   * This runs after instruments.init has placed everything in a single row
   */
  /**
   * Get all active instrument names
   */
  static getActiveInstruments() {
    return Array.from(this.registeredInstruments.entries()).filter(([, r]) => r.isActive).map(([name]) => name);
  }
  /**
   * Cleanup - restore ALL original functions and remove all custom instruments
   */
  static cleanup() {
    const instruments = unsafeWindow.instruments;
    for (const name of this.registeredInstruments.keys()) {
      this.deactivateInstrument(name);
    }
    if (instruments) {
      if (this.originals.init) instruments.init = this.originals.init;
      if (this.originals.update) instruments.update = this.originals.update;
      if (this.originals.show) instruments.show = this.originals.show;
      if (this.originals.hide) instruments.hide = this.originals.hide;
      if (this.originals.toggle) instruments.toggle = this.originals.toggle;
      if (this.originals.setOpacity) instruments.setOpacity = this.originals.setOpacity;
      if (this.originals.rescale) instruments.rescale = this.originals.rescale;
      if (this.originals.reset) instruments.reset = this.originals.reset;
      if (this.originals.updateScreenPositions) instruments.updateScreenPositions = this.originals.updateScreenPositions;
      if (this.originals.updateCockpitPositions) instruments.updateCockpitPositions = this.originals.updateCockpitPositions;
    }
    this.originals = {
      init: null,
      update: null,
      show: null,
      hide: null,
      toggle: null,
      setOpacity: null,
      rescale: null,
      reset: null,
      updateScreenPositions: null,
      updateCockpitPositions: null
    };
    this.registeredInstruments.clear();
    this.isInitialized = false;
    log$8.info("InstrumentManager cleaned up - all original functions restored");
  }
}
__publicField(InstrumentManager, "registeredInstruments", /* @__PURE__ */ new Map());
__publicField(InstrumentManager, "originals", {
  init: null,
  update: null,
  show: null,
  hide: null,
  toggle: null,
  setOpacity: null,
  rescale: null,
  reset: null,
  updateScreenPositions: null,
  updateCockpitPositions: null
});
__publicField(InstrumentManager, "isInitialized", false);
const log$7 = Logger.create("FuelSystem");
const FUEL_INSTRUMENT_NAME = "efiFuelGauge";
const _FuelSystem = class _FuelSystem {
  // ============================================
  // INSTRUMENT DEFINITION
  // ============================================
  static getInstrumentDefinition() {
    const fuelFaceSVG = this.createFuelFaceSVG();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(fuelFaceSVG);
    const fuelFaceBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
    return {
      name: FUEL_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      compositors: "canvas,css",
      stackX: true,
      group: "all",
      visibility: true,
      animations: [{
        value: "view",
        type: "show",
        notEq: "cockpit"
      }],
      overlay: {
        url: "images/instruments/background.png",
        class: "geofs-instrument-background geofs-fuel-gauge",
        size: {
          x: 200,
          y: 200
        },
        anchor: {
          x: 100,
          y: 100
        },
        position: {
          x: 100,
          y: 100
        },
        rescale: true,
        rescalePosition: true,
        overlays: [{
          url: fuelFaceBase64,
          anchor: {
            x: 100,
            y: 100
          },
          size: {
            x: 200,
            y: 200
          },
          position: {
            x: 0,
            y: 0
          }
        }, {
          animations: [{
            type: "rotate",
            value: "fuelPercentage",
            ratio: -2.7,
            offset: 135,
            min: 0,
            max: 100
          }],
          url: "images/instruments/airspeed-hand.png",
          anchor: {
            x: 10,
            y: 34
          },
          size: {
            x: 20,
            y: 120
          },
          position: {
            x: 0,
            y: 0
          },
          class: "geofs-fuel-needle"
        }, {
          animations: [{
            type: "rotate",
            value: "fuelConsumption",
            ratio: -120,
            min: 0
          }],
          url: "images/instruments/mach-hand.png",
          anchor: {
            x: 5,
            y: 5
          },
          size: {
            x: 11,
            y: 31
          },
          position: {
            x: 0,
            y: -60
          },
          class: "geofs-fuel-consumption-needle"
        }]
      },
      onInit: () => _FuelSystem.onInstrumentReady(),
      onDestroy: () => _FuelSystem.onInstrumentDestroyed(),
      onShow: () => log$7.debug("Fuel gauge shown"),
      onHide: () => log$7.debug("Fuel gauge hidden")
    };
  }
  // ============================================
  // INSTRUMENT CALLBACKS
  // ============================================
  static onInstrumentReady() {
    this.updateAnimationValues();
    log$7.debug("Fuel gauge ready");
  }
  static onInstrumentDestroyed() {
    log$7.debug("Fuel gauge destroyed");
  }
  // ============================================
  // STORAGE
  // ============================================
  static getStorage() {
    var _a;
    return (_a = unsafeWindow.flightAssistant) == null ? void 0 : _a.Storage;
  }
  static async loadSettings() {
    try {
      const Storage2 = this.getStorage();
      if (!Storage2) return;
      const savedCapacity = await Storage2.get(this.STORAGE_KEYS.capacityMultiplier);
      const savedConsumption = await Storage2.get(this.STORAGE_KEYS.consumptionMultiplier);
      if (typeof savedCapacity === "number") this.capacityMultiplier = savedCapacity;
      if (typeof savedConsumption === "number") this.consumptionMultiplier = savedConsumption;
      log$7.debug("Loaded settings:", {
        capacityMultiplier: this.capacityMultiplier,
        consumptionMultiplier: this.consumptionMultiplier
      });
    } catch (error) {
      log$7.error("Failed to load settings:", error);
    }
  }
  static saveSettings() {
    try {
      const Storage2 = this.getStorage();
      if (!Storage2) return;
      Storage2.write(this.STORAGE_KEYS.capacityMultiplier, this.capacityMultiplier);
      Storage2.write(this.STORAGE_KEYS.consumptionMultiplier, this.consumptionMultiplier);
    } catch (error) {
      log$7.error("Failed to save settings:", error);
    }
  }
  static saveFuelState() {
    try {
      const Storage2 = this.getStorage();
      if (!Storage2) return;
      Storage2.write(this.STORAGE_KEYS.fuelPercentage, this.fuelPercentage);
      Storage2.write(this.STORAGE_KEYS.aircraftId, this.currentAircraftId);
      Storage2.write(this.STORAGE_KEYS.isActive, this.isActive);
    } catch (error) {
      log$7.error("Failed to save fuel state:", error);
    }
  }
  static async loadFuelState() {
    try {
      const Storage2 = this.getStorage();
      if (!Storage2) return {
        percentage: 100,
        isActive: false
      };
      const savedPercentage = await Storage2.get(this.STORAGE_KEYS.fuelPercentage);
      const savedAircraftId = await Storage2.get(this.STORAGE_KEYS.aircraftId);
      const savedIsActive = await Storage2.get(this.STORAGE_KEYS.isActive);
      if (savedAircraftId !== this.currentAircraftId && savedAircraftId !== void 0) {
        return {
          percentage: 100,
          isActive: savedIsActive === true
        };
      }
      return {
        percentage: typeof savedPercentage === "number" ? savedPercentage : 100,
        isActive: savedIsActive === true
      };
    } catch (error) {
      log$7.error("Failed to load fuel state:", error);
      return {
        percentage: 100,
        isActive: false
      };
    }
  }
  static clearStorage() {
    try {
      const Storage2 = this.getStorage();
      if (!Storage2) return;
      Storage2.delete(this.STORAGE_KEYS.fuelPercentage);
      Storage2.delete(this.STORAGE_KEYS.aircraftId);
      Storage2.delete(this.STORAGE_KEYS.isActive);
    } catch (error) {
      log$7.error("Failed to clear storage:", error);
    }
  }
  // ============================================
  // SETTINGS
  // ============================================
  static setCapacityMultiplier(value) {
    this.capacityMultiplier = Math.max(0.1, Math.min(2, value));
    this.saveSettings();
    this.recalculateCapacity();
  }
  static setConsumptionMultiplier(value) {
    this.consumptionMultiplier = Math.max(1e-3, Math.min(1, value));
    this.saveSettings();
  }
  static recalculateCapacity() {
    var _a, _b, _c;
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (!aircraft) return;
    const aircraftMass = ((_c = aircraft.definition) == null ? void 0 : _c.mass) || 1e3;
    const oldPercentage = this.fuelPercentage;
    this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
    this.currentFuelGal = this.fuelCapacityGal * oldPercentage / 100;
  }
  // ============================================
  // INITIALIZATION
  // ============================================
  static async initialize() {
    var _a, _b, _c;
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
      if (!aircraft) {
        log$7.error("No aircraft instance found, retrying...");
        this.isInitializing = false;
        setTimeout(() => this.initialize(), 1e3);
        return;
      }
      const aircraftId = aircraft.id || 0;
      const aircraftChanged = this.currentAircraftId !== aircraftId && this.currentAircraftId !== -1;
      if (aircraftChanged && this.gaugeExists()) {
        InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);
      }
      const aircraftMass = ((_c = aircraft.definition) == null ? void 0 : _c.mass) || 1e3;
      this.lastAircraftMassKg = aircraftMass;
      await this.loadSettings();
      this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
      const hasEngines = aircraft.engines && Array.isArray(aircraft.engines) && aircraft.engines.length > 0;
      const savedState = await this.loadFuelState();
      this.fuelPercentage = savedState.percentage;
      this.currentFuelGal = this.fuelCapacityGal * savedState.percentage / 100;
      this.lastUpdateTime = Date.now();
      this.currentAircraftId = aircraftId;
      this.isActive = savedState.isActive;
      this.isInitializing = false;
      if (this.isActive && hasEngines) {
        if (!this.gaugeExists() || aircraftChanged) {
          this.createFuelIndicator();
        }
        this.startMonitoring();
      }
    } catch (error) {
      log$7.error("Initialization failed:", error);
      this.isActive = false;
      this.isInitializing = false;
    }
  }
  // ============================================
  // ACTIVATION / DEACTIVATION
  // ============================================
  static async activate() {
    var _a, _b, _c;
    if (this.isActive) return;
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (!aircraft) {
      log$7.error("No aircraft instance found");
      return;
    }
    const hasEngines = (aircraft == null ? void 0 : aircraft.engines) && Array.isArray(aircraft.engines) && aircraft.engines.length > 0;
    if (!hasEngines) {
      log$7.debug("No engines, skipping activation");
      return;
    }
    if (this.fuelCapacityGal === 0) {
      const aircraftMass = ((_c = aircraft.definition) == null ? void 0 : _c.mass) || 1e3;
      this.lastAircraftMassKg = aircraftMass;
      await this.loadSettings();
      this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
      this.currentAircraftId = aircraft.id || 0;
      const savedState = await this.loadFuelState();
      this.fuelPercentage = savedState.percentage;
      this.currentFuelGal = this.fuelCapacityGal * savedState.percentage / 100;
      this.lastUpdateTime = Date.now();
    }
    this.isActive = true;
    this.saveFuelState();
    InstrumentManager.init();
    if (!InstrumentManager.isActive(FUEL_INSTRUMENT_NAME)) {
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      InstrumentManager.activateInstrument(FUEL_INSTRUMENT_NAME);
    } else {
      InstrumentManager.show(FUEL_INSTRUMENT_NAME);
    }
    this.startMonitoring();
    log$7.info("Fuel system activated");
  }
  static deactivate() {
    var _a, _b;
    if (!this.isActive) return;
    this.isActive = false;
    this.unhookFlightTick();
    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
      this.saveIntervalId = null;
    }
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (aircraft && aircraft.crashed) {
      aircraft.crashed = false;
    }
    InstrumentManager.hide(FUEL_INSTRUMENT_NAME);
    this.saveFuelState();
    log$7.info("Fuel system deactivated");
  }
  static gaugeExists() {
    return InstrumentManager.isActive(FUEL_INSTRUMENT_NAME);
  }
  // ============================================
  // MONITORING
  // ============================================
  static startMonitoring() {
    this.hookFlightTick();
    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
    }
    this.saveIntervalId = window.setInterval(() => {
      this.saveFuelState();
      this.checkAircraftChange();
    }, 5e3);
  }
  static hookFlightTick() {
    if (this.isHooked) return;
    const flight = unsafeWindow.flight;
    if (!flight || typeof flight.tick !== "function") {
      log$7.warn("flight.tick not found, retrying...");
      setTimeout(() => this.hookFlightTick(), 1e3);
      return;
    }
    this.originalFlightTick = flight.tick.bind(flight);
    const self = this;
    flight.tick = function(e, t, a) {
      if (self.originalFlightTick) {
        self.originalFlightTick(e, t, a);
      }
      if (self.isActive) {
        self.tickUpdate(e);
      }
    };
    this.isHooked = true;
    log$7.debug("Hooked into flight.tick");
  }
  static unhookFlightTick() {
    if (!this.isHooked) return;
    const flight = unsafeWindow.flight;
    if (flight && this.originalFlightTick) {
      flight.tick = this.originalFlightTick;
      this.originalFlightTick = null;
    }
    this.isHooked = false;
  }
  static checkAircraftChange() {
    var _a, _b, _c;
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (!aircraft) return;
    const currentId = aircraft.id || 0;
    if (currentId !== this.currentAircraftId && this.currentAircraftId !== -1) {
      setTimeout(() => this.initialize(), 500);
      return;
    }
    const aircraftMass = ((_c = aircraft.definition) == null ? void 0 : _c.mass) || 0;
    if (this.lastAircraftMassKg !== null && aircraftMass !== this.lastAircraftMassKg) {
      const newCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
      const oldPercentage = this.fuelPercentage;
      this.fuelCapacityGal = newCapacityGal;
      this.currentFuelGal = this.fuelCapacityGal * oldPercentage / 100;
      this.currentFuelGal = Math.max(0, Math.min(this.currentFuelGal, this.fuelCapacityGal));
      this.fuelPercentage = this.fuelCapacityGal > 0 ? this.currentFuelGal / this.fuelCapacityGal * 100 : 0;
      this.lastAircraftMassKg = aircraftMass;
    }
  }
  // ============================================
  // TICK UPDATE & ANIMATION VALUES
  // ============================================
  static tickUpdate(deltaTime) {
    var _a;
    if (!this.isActive) return;
    const geofs2 = unsafeWindow.geofs;
    if (!geofs2 || geofs2.pause) return;
    const aircraft = (_a = geofs2 == null ? void 0 : geofs2.aircraft) == null ? void 0 : _a.instance;
    if (!aircraft) return;
    if (!aircraft.engines || !Array.isArray(aircraft.engines) || aircraft.engines.length === 0) {
      return;
    }
    let totalConsumptionGalPerSec = 0;
    for (let i = 0; i < aircraft.engines.length; i++) {
      const engine = aircraft.engines[i];
      const thrust = Math.abs((engine == null ? void 0 : engine.currentThrust) ?? 0);
      const rpm = Math.abs((engine == null ? void 0 : engine.rpm) || 0);
      if (!rpm || rpm === 0) continue;
      const perEngineKgPerSec = thrust / rpm * this.consumptionMultiplier;
      const perEngineGalPerSec = perEngineKgPerSec * this.KG_TO_GAL;
      totalConsumptionGalPerSec += perEngineGalPerSec;
    }
    this.consumptionRateGalPerSec = totalConsumptionGalPerSec;
    this.updateAnimationValues();
    if (this.fuelPercentage > 0) {
      const consumedFuel = this.consumptionRateGalPerSec * deltaTime;
      this.currentFuelGal = Math.max(0, this.currentFuelGal - consumedFuel);
      this.fuelPercentage = this.currentFuelGal / this.fuelCapacityGal * 100;
      if (aircraft.crashed) {
        aircraft.crashed = false;
      }
    }
    if (this.fuelPercentage < 20 && this.fuelPercentage > 19.5) {
      this.showLowFuelWarning();
    }
    if (this.fuelPercentage <= 0) {
      this.onFuelEmpty();
    }
  }
  static updateAnimationValues() {
    var _a;
    const geofs2 = unsafeWindow.geofs;
    if ((_a = geofs2 == null ? void 0 : geofs2.animation) == null ? void 0 : _a.values) {
      geofs2.animation.values.fuelPercentage = this.fuelPercentage;
      geofs2.animation.values.fuelConsumption = this.consumptionRateGalPerSec;
    }
  }
  // ============================================
  // FUEL OPERATIONS
  // ============================================
  static refuel(percentage = 100) {
    var _a, _b;
    percentage = Math.max(0, Math.min(100, percentage));
    this.fuelPercentage = percentage;
    this.currentFuelGal = this.fuelCapacityGal * percentage / 100;
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (aircraft && this.fuelPercentage > 0 && aircraft.crashed) {
      aircraft.crashed = false;
    }
    this.saveFuelState();
    this.updateAnimationValues();
  }
  static showLowFuelWarning() {
  }
  static onFuelEmpty() {
    var _a, _b;
    const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
    if (aircraft) {
      aircraft.crashed = true;
      if (typeof aircraft.stopEngine === "function") {
        aircraft.stopEngine();
      }
    }
  }
  // ============================================
  // INSTRUMENT CREATION
  // ============================================
  static createFuelIndicator() {
    var _a, _b, _c;
    if (this.gaugeExists() || this.creatingGauge) return;
    this.creatingGauge = true;
    try {
      const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
      if (!aircraft || !((_c = aircraft.engines) == null ? void 0 : _c.length)) {
        this.creatingGauge = false;
        return;
      }
      if (!unsafeWindow.instruments) {
        this.creatingGauge = false;
        return;
      }
      InstrumentManager.init();
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      if (InstrumentManager.activateInstrument(FUEL_INSTRUMENT_NAME)) {
        this.updateAnimationValues();
        log$7.debug("Fuel indicator created");
      }
    } catch (error) {
      log$7.error("Failed to create fuel indicator:", error);
    } finally {
      this.creatingGauge = false;
    }
  }
  // ============================================
  // SVG GENERATION
  // ============================================
  static createFuelFaceSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    svg.setAttribute("viewBox", "0 0 200 200");
    const cx = 100;
    const cy = 100;
    const radius = 88;
    const arcWidth = 10;
    const arcs = [{
      start: 0,
      end: 10,
      color: "#ff0000"
    }, {
      start: 10,
      end: 40,
      color: "#ff8800"
    }, {
      start: 40,
      end: 75,
      color: "#ffdd00"
    }, {
      start: 75,
      end: 100,
      color: "#00ff00"
    }];
    const percentToAngle = (percent) => {
      return -135 + percent / 100 * 270;
    };
    const createArcPath = (startPercent, endPercent, r) => {
      const startAngle = percentToAngle(startPercent) * Math.PI / 180;
      const endAngle = percentToAngle(endPercent) * Math.PI / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    };
    let svgContent = '<g transform="rotate(270 100 100)">';
    for (const arc of arcs) {
      svgContent += `<path d="${createArcPath(arc.start, arc.end, radius)}" fill="none" stroke="${arc.color}" stroke-width="${arcWidth}" stroke-linecap="butt" opacity="0.9"/>`;
    }
    for (let percent = 0; percent <= 100; percent += 2) {
      const angle = percentToAngle(percent) * Math.PI / 180;
      const isMajor = percent % 10 === 0;
      const outerRadius = radius - arcWidth / 2 - 2;
      const innerRadius = isMajor ? outerRadius - 10 : outerRadius - 4;
      const x1 = cx + innerRadius * Math.cos(angle);
      const y1 = cy + innerRadius * Math.sin(angle);
      const x2 = cx + outerRadius * Math.cos(angle);
      const y2 = cy + outerRadius * Math.sin(angle);
      const strokeWidth = isMajor ? 3 : 1;
      const strokeColor = isMajor ? "#ffffff" : "#aaaaaa";
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    }
    for (let percent = 0; percent <= 100; percent += 10) {
      const angle = percentToAngle(percent) * Math.PI / 180;
      const labelRadius = radius - arcWidth / 2 - 22;
      const x = cx + labelRadius * Math.cos(angle);
      const y = cy + labelRadius * Math.sin(angle);
      let label = String(percent);
      if (percent === 0) label = "E";
      else if (percent === 100) label = "F";
      svgContent += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="12" font-family="Arial" font-weight="bold" transform="rotate(-270 ${x} ${y})">${label}</text>`;
    }
    svgContent += "</g>";
    svgContent += '<text x="100" y="90" text-anchor="middle" fill="#ffffff" font-size="16" font-family="Arial" font-weight="bold">FUEL</text>';
    svgContent += '<text x="100" y="120" text-anchor="middle" fill="#ffffff" font-size="10" font-family="Arial">PERCENT</text>';
    const innerR = 20;
    const centerX = 100;
    const centerY = 160;
    const innerCirc = (2 * Math.PI * innerR).toFixed(3);
    const tickOuterR = innerR + 8;
    const frameR = tickOuterR + 2;
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${frameR}" fill="none" stroke="#333" stroke-width="2"/>`;
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${innerR}" fill="none" stroke="#00ff88" stroke-width="3" stroke-linecap="round" transform="rotate(-90 ${centerX} ${centerY})" stroke-dasharray="${innerCirc}" stroke-dashoffset="${innerCirc}"/>`;
    for (let i = 0; i <= 14; i++) {
      const value = i * 0.2;
      const isMajor = Math.abs(value - Math.round(value)) < 1e-6 && (value === 0 || value === 1 || value === 2);
      const angleDeg = value * 120 - 90;
      const angle = angleDeg * Math.PI / 180;
      const outerR = innerR + 6;
      const innerTickR = isMajor ? outerR - 8 : outerR - 4;
      const x1 = centerX + outerR * Math.cos(angle);
      const y1 = centerY + outerR * Math.sin(angle);
      const x2 = centerX + innerTickR * Math.cos(angle);
      const y2 = centerY + innerTickR * Math.sin(angle);
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width="${isMajor ? 2 : 1}"/>`;
      if (isMajor) {
        const lx = centerX + (innerTickR - 8) * Math.cos(angle);
        const ly = centerY + (innerTickR - 8) * Math.sin(angle) + 2;
        svgContent += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="#ffffff" font-size="10" font-family="Arial">${Math.round(value)}</text>`;
      }
    }
    svg.innerHTML = svgContent;
    return svg;
  }
  // ============================================
  // STATUS & CLEANUP
  // ============================================
  static getStatus() {
    return {
      isActive: this.isActive,
      percentage: this.fuelPercentage,
      currentGal: this.currentFuelGal,
      capacityGal: this.fuelCapacityGal,
      consumptionRateGalPerSec: this.consumptionRateGalPerSec
    };
  }
  static cleanup(removeUI = true) {
    var _a;
    this.unhookFlightTick();
    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
      this.saveIntervalId = null;
    }
    this.isActive = false;
    this.fuelPercentage = 100;
    this.currentFuelGal = 0;
    this.fuelCapacityGal = 0;
    this.consumptionRateGalPerSec = 0;
    this.saveFuelState();
    if (removeUI) {
      InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);
      const geofs2 = unsafeWindow.geofs;
      if ((_a = geofs2 == null ? void 0 : geofs2.animation) == null ? void 0 : _a.values) {
        delete geofs2.animation.values.fuelPercentage;
        delete geofs2.animation.values.fuelConsumption;
      }
    }
  }
};
// State
__publicField(_FuelSystem, "isActive", false);
__publicField(_FuelSystem, "fuelPercentage", 100);
__publicField(_FuelSystem, "fuelCapacityGal", 0);
__publicField(_FuelSystem, "currentFuelGal", 0);
__publicField(_FuelSystem, "consumptionRateGalPerSec", 0);
__publicField(_FuelSystem, "smoothedConsumptionGalPerSec", 0);
// Constants
__publicField(_FuelSystem, "KG_TO_GAL", 0.330215);
// Aircraft tracking
__publicField(_FuelSystem, "lastAircraftMassKg", null);
__publicField(_FuelSystem, "currentAircraftId", -1);
__publicField(_FuelSystem, "lastUpdateTime", 0);
// Flags
__publicField(_FuelSystem, "isInitializing", false);
__publicField(_FuelSystem, "creatingGauge", false);
__publicField(_FuelSystem, "isHooked", false);
// Hooks
__publicField(_FuelSystem, "originalFlightTick", null);
__publicField(_FuelSystem, "saveIntervalId", null);
// Settings
__publicField(_FuelSystem, "capacityMultiplier", 0.6349575);
__publicField(_FuelSystem, "consumptionMultiplier", 0.05);
__publicField(_FuelSystem, "STORAGE_KEYS", {
  fuelPercentage: "fuel_system_percentage",
  aircraftId: "fuel_system_aircraft_id",
  isActive: "fuel_system_is_active",
  capacityMultiplier: "fuel_system_capacity_multiplier",
  consumptionMultiplier: "fuel_system_consumption_multiplier"
});
let FuelSystem = _FuelSystem;
const log$6 = Logger.create("SaveManager");
const SAVE_STORAGE_KEY = "aircraft_save";
const getAircraft = () => {
  var _a, _b;
  return (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
};
const getAircraftKey = () => {
  const aircraft = getAircraft();
  if (!(aircraft == null ? void 0 : aircraft.id)) {
    log$6.warn("No aircraft loaded");
    return null;
  }
  return `${SAVE_STORAGE_KEY}_${aircraft.id}`;
};
const extractDefinitionData = () => {
  var _a;
  const {
    allowed
  } = Props.Definition || {
    allowed: []
  };
  const definition = (_a = getAircraft()) == null ? void 0 : _a.definition;
  if (!definition || !allowed) {
    log$6.debug("No definition or allowed props found");
    return {};
  }
  const data = {};
  for (const prop of allowed) {
    if (prop.name && prop.name in definition) {
      data[prop.name] = definition[prop.name];
    }
  }
  log$6.debug(`Extracted ${Object.keys(data).length} definition properties`);
  return data;
};
const extractEngineData = () => {
  var _a;
  const {
    allowed
  } = Props.Engines || {
    allowed: []
  };
  const engines = (_a = getAircraft()) == null ? void 0 : _a.engines;
  if (!engines || !allowed) {
    log$6.debug("No engines or allowed props found");
    return [];
  }
  const data = [];
  for (let i = 0; i < engines.length; i++) {
    const engineData = {};
    for (const prop of allowed) {
      if (prop.name && prop.name in engines[i]) {
        engineData[prop.name] = engines[i][prop.name];
      }
    }
    data.push({
      index: i,
      name: engines[i].name || `Engine ${i + 1}`,
      data: engineData
    });
  }
  log$6.debug(`Extracted data for ${data.length} engines`);
  return data;
};
const applyDefinitionData = (data) => {
  var _a;
  const definition = (_a = getAircraft()) == null ? void 0 : _a.definition;
  if (!definition) return 0;
  let appliedCount = 0;
  for (const [key, value] of Object.entries(data)) {
    if (key in definition) {
      definition[key] = value;
      appliedCount++;
    }
  }
  log$6.debug(`Applied ${appliedCount} definition properties`);
  return appliedCount;
};
const applyEngineData = (enginesData) => {
  var _a;
  const engines = (_a = getAircraft()) == null ? void 0 : _a.engines;
  if (!engines) return 0;
  let appliedCount = 0;
  for (const engineData of enginesData) {
    if (engineData.index < engines.length) {
      for (const [key, value] of Object.entries(engineData.data)) {
        if (key in engines[engineData.index]) {
          engines[engineData.index][key] = value;
          appliedCount++;
        }
      }
    }
  }
  log$6.debug(`Applied ${appliedCount} engine properties`);
  return appliedCount;
};
const saveAircraft = async () => {
  var _a;
  try {
    const aircraftKey = getAircraftKey();
    if (!aircraftKey) {
      Notify.errorNow("No aircraft loaded");
      return false;
    }
    const aircraft = getAircraft();
    const definitionData = extractDefinitionData();
    const engineData = extractEngineData();
    if (Object.keys(definitionData).length === 0 && engineData.length === 0) {
      Notify.errorNow("No data to save");
      return false;
    }
    const saveData = {
      aircraftId: aircraft.id,
      aircraftName: ((_a = aircraft.definition) == null ? void 0 : _a.name) || "Unknown",
      timestamp: Date.now(),
      version: Storage.version,
      definition: definitionData,
      engines: engineData
    };
    await Storage.set(aircraftKey, saveData);
    const defCount = Object.keys(definitionData).length;
    const engCount = engineData.reduce((sum, e) => sum + Object.keys(e.data).length, 0);
    log$6.info(`Saved aircraft: ${saveData.aircraftName} (${defCount} definition props, ${engCount} engine props)`);
    Notify.successNow(`Saved ${saveData.aircraftName}: ${defCount} definition, ${engCount} engine properties`);
    return true;
  } catch (error) {
    log$6.error("Save failed:", error);
    Notify.errorNow("Failed to save aircraft configuration");
    return false;
  }
};
const loadAircraft = async () => {
  try {
    const aircraftKey = getAircraftKey();
    if (!aircraftKey) {
      Notify.errorNow("No aircraft loaded");
      return false;
    }
    log$6.debug(`Loading from key: ${aircraftKey}`);
    const saveData = await Storage.get(aircraftKey);
    log$6.debug("Raw save data:", saveData);
    if (!saveData) {
      Notify.infoNow("No saved configuration found for this aircraft");
      return false;
    }
    let parsedData = saveData;
    if (typeof saveData === "string") {
      try {
        parsedData = JSON.parse(saveData);
        log$6.debug("Parsed string data:", parsedData);
      } catch (e) {
        log$6.error("Failed to parse save data string:", e);
      }
    }
    let defApplied = 0;
    let engApplied = 0;
    if (parsedData.definition && Object.keys(parsedData.definition).length > 0) {
      defApplied = applyDefinitionData(parsedData.definition);
    }
    if (parsedData.engines && parsedData.engines.length > 0) {
      engApplied = applyEngineData(parsedData.engines);
    }
    const savedDate = new Date(parsedData.timestamp).toLocaleString();
    log$6.info(`Loaded aircraft: ${parsedData.aircraftName} (${defApplied} definition, ${engApplied} engine properties)`);
    Notify.successNow(`Loaded: ${defApplied} definition, ${engApplied} engine properties (saved: ${savedDate})`);
    setTimeout(() => {
      reloadUI();
    }, 100);
    return true;
  } catch (error) {
    log$6.error("Load failed:", error);
    Notify.errorNow("Failed to load aircraft configuration");
    return false;
  }
};
const deleteAircraftSave = async () => {
  try {
    const aircraftKey = getAircraftKey();
    if (!aircraftKey) {
      Notify.errorNow("No aircraft loaded");
      return false;
    }
    const exists = await Storage.has(aircraftKey);
    if (!exists) {
      Notify.infoNow("No saved configuration to delete");
      return false;
    }
    await Storage.remove(aircraftKey);
    log$6.info("Deleted aircraft save");
    Notify.successNow("Saved configuration deleted");
    return true;
  } catch (error) {
    log$6.error("Delete failed:", error);
    Notify.errorNow("Failed to delete saved configuration");
    return false;
  }
};
const hasSave = async () => {
  const aircraftKey = getAircraftKey();
  if (!aircraftKey) return false;
  return await Storage.has(aircraftKey);
};
const getSaveInfo = async () => {
  const aircraftKey = getAircraftKey();
  if (!aircraftKey) return {
    exists: false
  };
  const saveData = await Storage.get(aircraftKey);
  if (!saveData) return {
    exists: false
  };
  return {
    exists: true,
    timestamp: saveData.timestamp,
    name: saveData.aircraftName
  };
};
const getAllSaveKeys = async () => {
  const keys = await Storage.getKeys();
  return keys.filter((key) => key.startsWith(SAVE_STORAGE_KEY));
};
const exportAllSaves = async () => {
  try {
    const keys = await getAllSaveKeys();
    const exports = {};
    for (const key of keys) {
      const data = await Storage.get(key);
      if (data) {
        exports[key] = data;
      }
    }
    log$6.info(`Exported ${Object.keys(exports).length} saves`);
    return exports;
  } catch (error) {
    log$6.error("Export failed:", error);
    return {};
  }
};
const importSaves = async (data) => {
  try {
    let imported = 0;
    for (const [key, saveData] of Object.entries(data)) {
      if (saveData && saveData.aircraftId) {
        await Storage.set(key, saveData);
        imported++;
      }
    }
    log$6.info(`Imported ${imported} saves`);
    Notify.successNow(`Imported ${imported} saves`);
    return imported;
  } catch (error) {
    log$6.error("Import failed:", error);
    Notify.errorNow("Failed to import saves");
    return 0;
  }
};
const SaveManager = {
  save: saveAircraft,
  load: loadAircraft,
  delete: deleteAircraftSave,
  hasSave,
  getSaveInfo,
  getAllSaveKeys,
  exportAll: exportAllSaves,
  import: importSaves
};
const userOptions = {
  anchor: [15, 15],
  className: "geofs-map-icon",
  size: [30, 30]
};
const selfOptions = {
  anchor: [20, 20],
  className: "geofs-myself-icon",
  size: [40, 40]
};
const options = { user: userOptions, self: selfOptions };
const groups = {
  default: [
    "9",
    "51",
    "52",
    "102",
    "1000",
    "1025",
    "1027",
    "2726",
    "2806",
    "2840",
    "2844",
    "2852",
    "3049",
    "4090",
    "4197",
    "4949",
    "5002"
  ],
  fighter: ["7", "15", "2808", "4251"],
  fighterJet: [
    "3",
    "18",
    "27",
    "29",
    "1024",
    "2310",
    "2364",
    "2556",
    "2581",
    "2857",
    "2948",
    "2988",
    "3591",
    "3617",
    "5229",
    "5347",
    "5405",
    "5431"
  ],
  glider: ["11", "41", "50", "53", "103", "2953", "2968"],
  singleEngine: [
    "1",
    "2",
    "8",
    "12",
    "13",
    "21",
    "22",
    "23",
    "31",
    "40",
    "1019",
    "1022",
    "1026",
    "1069",
    "2000",
    "2750",
    "2786",
    "2976",
    "2989",
    "3211",
    "4341",
    "4390",
    "4409",
    "4596",
    "5061",
    "5486",
    "5499"
  ],
  twinPistonEngine: ["14", "16", "28", "4398", "4401"],
  privateJet: [],
  twinTurboprop: ["6", "26", "2864", "3460"],
  twinjetNarrowBody: [
    "4",
    "238",
    "242",
    "1001",
    "1003",
    "1007",
    "1008",
    "2003",
    "2769",
    "2772",
    "2843",
    "2865",
    "2870",
    "2871",
    "2878",
    "2879",
    "2899",
    "3011",
    "3054",
    "3140",
    "3292",
    "3534",
    "4140",
    "4646",
    "4743",
    "4745",
    "5086",
    "5156",
    "5203",
    "5551"
  ],
  rearMountedTwinJet: [],
  wideBody4Engine: [
    "10",
    "252",
    "1002",
    "1010",
    "1012",
    "2153",
    "2752",
    "2951",
    "5193",
    "5211",
    "5314",
    "5409"
  ],
  twinjetNarrowBody2: [],
  twinjetWideBody: [
    "24",
    "25",
    "235",
    "237",
    "239",
    "240",
    "244",
    "1004",
    "1005",
    "1006",
    "1009",
    "1011",
    "2386",
    "2856",
    "2973",
    "3179",
    "3180",
    "3575",
    "4402",
    "4631",
    "4764"
  ],
  narrowBody4Engine: ["20", "1014", "2395"],
  trijet: ["1023", "5038"],
  regionalJet: [
    "236",
    "1015",
    "1016",
    "1017",
    "1018",
    "2004",
    "2700",
    "2706",
    "3036",
    "3307",
    "3341",
    "4017"
  ],
  heavyCargo: ["2788", "5516"],
  businessJet: ["5", "1021", "2461", "3109", "5073"],
  turbopropCommuter: [
    "247",
    "1013",
    "1020",
    "2418",
    "2420",
    "2426",
    "2892",
    "2943",
    "3289",
    "3436"
  ]
};
var _tmpl$$n = /* @__PURE__ */ template(`<svg><filter id=outline-filter-0 color-interpolation-filters=sRGB x=-50% y=-50% width=200% height=200%><title>Outline</title><feMorphology in=SourceAlpha result=dilated radius=1 operator=dilate x=0></feMorphology><feFlood result=flood style=flood-opacity:0.39;></feFlood><feComposite in=flood in2=dilated operator=in result=outline x=0 y=0></feComposite><feMerge result=merge-0><feMergeNode in=outline></feMergeNode><feMergeNode in=SourceGraphic></svg>`, false, true);
const defs = {
  outline: _tmpl$$n()
};
class Marker {
  constructor(props) {
    __publicField(this, "props");
    __publicField(this, "plane");
    this.clear();
    this.props = props;
  }
  hasChildren() {
    return this.props.children.length > 0;
  }
  render(options2) {
    if (!this.hasChildren()) throw new Error("Marker must have children");
    const {
      width,
      height,
      viewBox,
      defs: defs2,
      children: children2
    } = this.props;
    this.plane = this.template("svg", {
      width: options2.width ?? width,
      height: options2.height ?? height,
      viewBox: viewBox ?? `0 0 ${options2.width ?? width} ${options2.height ?? height}`
    });
    const fragment = document.createDocumentFragment();
    if (defs2) {
      fragment.appendChild(this.template("defs"));
      for (const def2 of defs2) {
        fragment.firstChild.appendChild(def2);
      }
    }
    for (const {
      tagName,
      attributes
    } of children2) {
      let _attributes = Array.from(attributes).reduce((acc, attr) => ({
        ...acc,
        [attr.name]: attr.value
      }), {});
      let _child = this.template(tagName, _attributes);
      if (_attributes.filters) {
        _child.style.filter = `url(${this.defs(_attributes.filters)})`;
      }
      if (Object.keys(options2.children).includes(_attributes.name)) {
        Object.entries(options2.children[_attributes.name]).forEach(([key, value]) => {
          _child.setAttributeNS(null, key, value);
        });
      }
      fragment.appendChild(_child);
    }
    this.plane.appendChild(fragment);
    return this;
  }
  template(elementType, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttributeNS(null, key, value);
    });
    return element;
  }
  defs(indexes) {
    return [this.props.defs.filter((index) => indexes.includes(index.toString())).map((def2) => `#${def2.id}`)].join(",");
  }
  clear() {
    this.plane = null;
  }
  toBase64() {
    return `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(this.plane))}`;
  }
}
var _tmpl$$m = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers"d="M 5.101 15.347 C 2.964 16.627 1.651 20.48 4.784 22.347 L 18.428 22.427 L 18.34 27.221 L 14.479 29.308 L 14.454 32.061 L 15.93 33.312 L 24.341 33.439 L 25.637 32.184 L 25.606 29.62 L 21.474 27.133 L 21.513 22.427 L 35.197 22.387 C 38.144 20.244 36.826 17.341 35.356 15.585 L 22.554 15.521 L 23.117 12.941 L 21.93 11.38 L 19.954 10.848 L 18.043 11.497 L 16.884 12.976 L 17.333 15.443 L 5.101 15.347"></svg>`, false, true);
const def = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$m();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$l = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 7.462 27.371 L 7.079 28.003 L 7.04 28.816 L 8.516 28.759 L 8.562 28.151 L 17.252 28.185 L 17.146 30.781 L 13.182 34.386 L 13.098 36.219 L 13.519 36.754 L 17.208 36.717 L 18.096 36.428 L 18.176 33.765 L 18.56 35.681 L 19.085 37.248 L 19.707 37.266 L 20 38.6 L 20.299 37.281 L 20.83 37.224 L 21.42 35.624 L 21.69 33.696 L 21.877 36.45 L 22.749 36.722 L 26.521 36.658 L 26.981 35.989 L 26.822 34.255 L 22.927 30.89 L 22.966 28.044 L 31.426 28.065 L 31.576 28.775 L 32.862 28.687 L 32.869 27.938 L 32.413 27.582 L 32.243 21.254 L 31.474 25.144 L 23.77 18.686 L 22.474 14.206 L 21.604 8.572 L 21.17 4.509 L 19.945 1.396 L 18.829 4.558 L 18.389 8.531 L 17.389 14.241 L 16.334 18.726 L 8.577 24.995 L 7.694 21.259 L 7.424 27.369"></svg>`, false, true);
const fighter = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$l();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$k = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers"d="M 19.745 4.207 C 19.819 3.899 20.298 2.806 20.654 4.205 C 20.921 5.256 21.28 7.204 21.28 7.247 C 21.28 7.317 24.835 10.529 25.08 10.757 C 25.323 10.99 25.029 11.865 24.871 11.805 L 21.911 11.006 C 21.503 11.12 23.396 18.508 23.573 18.733 C 23.759 19.18 32.785 28.852 32.57 28.708 C 32.784 29.296 32.515 31.546 32.435 31.33 C 32.419 31.437 24.948 32.67 24.143 32.52 C 23.45 32.313 21.734 32.018 21.734 32.095 L 20.199 35.862 L 18.579 32.108 C 18.484 32.021 16.159 32.567 15.963 32.596 C 15.771 32.626 7.871 31.262 7.926 31.295 C 7.76 31.368 7.538 28.83 7.718 28.747 L 16.511 19.141 C 16.888 18.946 18.961 11.135 18.225 11.043 L 15.319 11.771 C 15.064 11.771 15.195 10.47 15.446 10.47 L 19.041 7.227 L 19.745 4.207 Z"></svg>`, false, true);
const fighterJet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$k();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$j = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers"d="M 19.379 15.812 C 19.444 14.978 20.585 14.995 20.644 15.869 L 20.761 18.971 C 21.713 18.887 35.793 19.418 35.913 19.479 C 36.8 19.932 36.096 20.578 35.889 20.577 C 35.888 20.577 20.713 21.155 20.713 21.155 L 20.47 27.107 C 21.332 27.712 22.318 28.887 21.939 28.85 L 18.043 28.842 C 17.652 28.875 18.651 27.784 19.522 27.112 L 19.162 21.152 L 3.91 20.643 C 3.479 20.6 2.919 19.876 3.875 19.484 C 3.875 19.484 18.355 18.958 19.162 19.021 L 19.379 15.812 Z"></svg>`, false, true);
const glider = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$j();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$i = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers"d="M 17.826 17.655 L 18.29 13.267 C 18.394 11.302 21.829 11.302 21.725 13.267 L 22.214 17.656 L 36.888 17.967 C 37.101 17.957 36.977 21.653 36.888 21.621 C 36.801 21.59 22.292 22.471 22.292 22.471 C 21.955 22.463 21.278 30.615 21.633 30.606 L 26.166 31.806 C 26.339 31.806 26.346 34.326 26.243 34.326 L 21.008 35.254 L 20.033 37 L 19.076 35.254 L 13.885 34.326 C 13.77 34.326 13.77 31.806 13.885 31.806 L 18.338 30.606 C 18.693 30.412 17.925 22.355 17.718 22.471 L 3.111 21.621 C 2.97 21.621 2.97 17.899 3.111 17.899 L 17.826 17.655 Z"></svg>`, false, true);
const singleEngine = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$i();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$h = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers"d="M 18.155 17.368 L 18.456 13.739 C 18.456 13.143 18.966 10.1 19.071 9.848 C 19.369 9.128 20.023 8.709 20.043 8.761 C 20.114 8.732 20.782 9.056 21.112 9.848 C 21.287 10.275 21.712 13.143 21.712 13.739 L 21.997 17.368 L 25.158 17.368 L 25.158 13.739 C 25.89 13.143 26.898 13.143 27.654 13.739 L 27.654 17.368 L 38.007 17.803 L 38.007 21.981 L 27.654 21.981 C 26.898 23.701 25.858 23.701 25.158 21.981 C 25.158 21.981 22.028 21.981 21.997 21.981 L 21.112 33.163 L 26.898 33.429 L 26.898 36.79 L 13.402 36.79 L 13.402 33.429 L 19.071 33.163 L 18.155 21.981 L 15.21 21.981 C 14.463 23.701 13.402 23.701 12.694 21.981 L 2.007 21.981 L 2.007 17.803 L 12.694 17.368 L 12.694 13.739 C 13.402 13.143 14.525 13.143 15.21 13.739 L 15.21 17.368 L 18.155 17.368 Z"></svg>`, false, true);
const twinPistonEngine = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$h();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$g = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 18.285 17.094 L 7.606 19.124 C 7.458 19.101 6.512 22.72 6.591 22.734 L 16.329 22.745 L 16.713 28.721 L 18.329 28.721 L 19.154 26.824 L 19.154 30.819 L 17.715 32.479 L 17.715 35.51 L 15.777 36.742 L 15.581 38.299 L 20.034 37.312 L 24.645 38.299 L 24.406 36.742 L 22.393 35.51 L 22.393 32.479 L 20.997 30.776 L 20.997 26.824 L 21.794 28.721 L 23.379 28.721 L 23.748 22.745 L 33.575 22.745 C 33.698 22.713 32.732 19.024 32.61 19.056 L 21.794 17.12 L 21.741 4.909 C 21.537 3.741 21.594 3.461 20.997 2.507 C 20.734 2.088 20.505 1.829 20.031 1.7 C 19.591 1.847 19.399 2.045 19.154 2.507 C 18.692 3.377 18.6 3.594 18.329 4.895 L 18.285 17.094 Z"></svg>`, false, true);
const privateJet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$g();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$f = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 21.699 17.936 L 21.699 7.409 C 21.719 6.981 21.408 6.24 20.924 5.756 C 20.406 5.237 19.986 5.248 19.986 5.248 C 19.986 5.248 19.614 5.276 19.134 5.756 C 18.674 6.217 18.334 7.007 18.334 7.409 L 18.334 17.936 L 18.334 18.315 L 15.338 18.315 L 15.338 15.644 C 14.884 14.551 13.978 14.551 13.546 15.644 L 13.546 18.315 L 1.918 19.041 C 1.727 18.968 1.727 21.517 1.918 21.589 L 13.546 22.256 C 14.193 23.82 14.692 23.821 15.338 22.256 L 18.334 22.256 C 18.334 22.256 19.114 36.07 19.134 36.116 L 13.546 36.854 L 13.546 39.487 L 26.655 39.487 L 26.655 36.91 L 20.924 36.145 L 21.699 22.256 L 24.47 22.256 C 25.11 23.803 25.667 23.808 26.31 22.256 L 37.649 21.589 C 37.856 21.552 37.773 19.017 37.649 19.041 L 26.31 18.315 L 26.31 15.644 C 25.894 14.551 24.936 14.551 24.511 15.644 L 24.511 18.315 L 21.699 18.315 L 21.699 17.936 Z"></svg>`, false, true);
const twinTurboprop = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$f();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$e = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 17.854 4.596 C 17.854 4.596 18.928 1.371 20.004 1.371 C 21.079 1.371 22.153 4.596 22.153 4.596 L 22.153 14.273 L 24.304 15.347 L 24.304 13.197 C 25.38 12.768 25.38 12.758 26.454 13.197 L 26.454 16.423 L 37.205 21.799 C 37.59 21.799 37.613 23.948 37.205 23.948 L 26.454 20.723 C 24.304 20.442 22.153 20.723 22.153 20.723 C 22.153 20.723 21.76 34.735 21.079 34.699 L 26.454 37.29 C 26.745 37.924 26.454 39 26.454 39 C 26.454 39 20.004 37.561 20.004 37.561 C 20.004 37.561 13.553 39 13.553 39 C 13.553 39 13.277 37.924 13.553 37.315 C 13.562 37.297 18.928 34.699 18.928 34.699 C 18.283 34.699 17.854 20.723 17.854 20.723 C 17.854 20.723 15.703 20.428 13.553 20.723 L 2.802 23.948 C 2.4 23.948 2.406 21.799 2.802 21.799 L 13.553 16.371 L 13.553 13.197 C 14.628 12.788 14.628 12.752 15.703 13.197 L 15.703 15.347 L 17.854 14.273 L 17.854 4.596 Z"></svg>`, false, true);
const twinjetNarrowBody = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$e();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$d = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 17.919 4.912 C 17.919 4.912 18.88 0.75 20 0.75 C 21.119 0.75 22.081 4.912 22.081 4.912 L 22.369 13.238 L 25.203 15.318 L 25.203 13.238 C 26.323 12.79 26.167 12.78 27.284 13.238 L 27.284 16.358 L 37.69 21.561 C 38.091 21.561 38.115 23.643 37.69 23.643 L 25.203 20.52 C 23.121 20.107 22.081 20.52 22.081 20.52 C 22.081 20.52 22.081 31.967 21.04 34.049 L 26.244 37.169 C 27.284 37.919 27.008 39.251 27.008 39.251 L 20 37.169 L 13.001 39.251 C 13.001 39.251 12.716 37.917 13.757 37.169 C 13.765 37.151 18.96 34.049 18.96 34.049 C 17.919 31.967 17.919 20.52 17.919 20.52 C 17.919 20.52 16.879 20.093 14.798 20.52 L 2.311 23.643 C 1.893 23.643 1.899 21.561 2.311 21.561 L 12.716 16.358 L 12.716 13.238 C 13.834 12.811 13.679 12.773 14.798 13.238 L 14.798 15.318 L 17.631 13.238 L 17.919 4.912 Z"></svg>`, false, true);
const twinjetNarrowBody2 = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$d();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$c = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 18.5 15.064 L 18.61 2.931 C 18.573 2.931 18.716 2.43 18.904 1.977 C 18.904 1.977 19.485 0.905 20 0.905 C 20.542 0.905 21.121 1.977 21.121 1.977 C 21.313 2.44 21.466 2.941 21.466 2.941 L 21.466 15.117 L 34.454 20 L 34.454 21.003 L 21.466 21.003 L 21.466 23.205 C 21.499 23.041 23.437 23.041 23.404 23.205 L 23.124 28.571 L 21.466 28.571 L 20.717 33.893 L 25.435 37.187 C 25.495 37.187 25.494 38.688 25.435 38.688 L 20 37.187 L 14.487 38.688 C 14.429 38.688 14.429 37.187 14.487 37.187 L 19.301 33.893 L 18.585 28.571 L 16.795 28.571 L 16.5 23.205 C 16.5 23.073 18.585 23.073 18.585 23.205 L 18.585 21.003 L 5.963 21.003 L 5.963 20 L 18.5 15.064 Z"></svg>`, false, true);
const rearMountedTwinJet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$c();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$b = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 4 C 20.36 4 21 5 21 5 C 21 5 22 6.5 22 8 L 22 15.5 L 24 16 L 24 14 C 24 13.5 25.49 13.5 25.49 14 L 25.49 16.5 L 27 17 L 27 15 C 27 14.5 28.5 14.5 28.5 15 L 28.5 17.5 L 36 20 C 36.268 20 36.268 22 36 22 L 22 20.5 L 22 26 C 22 26 22 29 21 34 L 27 37 L 27 39 L 20 37.5 L 13 39 L 13 37 L 19 34 C 18 29 18 26 18 26 L 18 20.5 L 4 22 C 3.81 22 3.82 20 4 20 L 11.503 17.5 L 11.503 15 C 11.503 14.5 13 14.5 13 15 L 13 17 L 14.447 16.5 L 14.447 14 C 14.447 13.5 16 13.5 16 14 L 16 16 L 18 15.5 L 18 8 C 18 6.5 19 5 19 5 C 19 5 19.644 4 20 4 Z"></svg>`, false, true);
const wideBody4Engine = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$b();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$a = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 2 C 21.5 2 23 6 23 10 L 23 15 L 25 15.8 L 25 13 L 28 13 L 28 17 L 38 21 L 38 24 L 23 19 L 23 32 L 30 36 L 30 38 L 20 36 L 10 38 L 10 36 L 17 32 L 17 19 L 2 24 L 2 21 L 12 17 L 12 13 L 15 13 L 15 15.8 L 17 15 L 17 10 C 17 6 18.5 2 20 2 Z"></svg>`, false, true);
const twinjetWideBody = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$a();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$9 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 17.854 4.596 C 17.854 4.596 18.928 1.371 20.004 1.371 C 21.079 1.371 22.153 4.596 22.153 4.596 L 22.153 14.273 L 24.304 15.347 L 24.304 13.197 C 25.38 12.768 25.38 12.758 26.454 13.197 L 26.454 16.423 L 29 17.7 L 29 15.5 C 30.075 15.1 30.075 15.1 31.15 15.5 L 31.15 18.8 L 37.205 21.799 C 37.59 21.799 37.613 23.948 37.205 23.948 L 26.454 20.723 C 24.304 20.442 22.153 20.723 22.153 20.723 C 22.153 20.723 21.76 34.735 21.079 34.699 L 26.454 37.29 C 26.745 37.924 26.454 39 26.454 39 C 26.454 39 20.004 37.561 20.004 37.561 C 20.004 37.561 13.553 39 13.553 39 C 13.553 39 13.277 37.924 13.553 37.315 C 13.562 37.297 18.928 34.699 18.928 34.699 C 18.283 34.699 17.854 20.723 17.854 20.723 C 17.854 20.723 15.703 20.428 13.553 20.723 L 2.802 23.948 C 2.4 23.948 2.406 21.799 2.802 21.799 L 8.85 18.8 L 8.85 15.5 C 9.925 15.1 9.925 15.1 11 15.5 L 11 17.7 L 13.553 16.371 L 13.553 13.197 C 14.628 12.788 14.628 12.752 15.703 13.197 L 15.703 15.347 L 17.854 14.273 L 17.854 4.596 Z"></svg>`, false, true);
const narrowBody4Engine = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$9();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$8 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 2 C 21 2 22 5 22 8 L 22 14 L 36 19 L 36 22 L 22 18 L 22 32 L 28 35 L 28 37 L 20 35.5 L 12 37 L 12 35 L 18 32 L 18 18 L 4 22 L 4 19 L 18 14 L 18 8 C 18 5 19 2 20 2 Z M 20 16 C 21 16 22 17 22 18 C 22 19 21 20 20 20 C 19 20 18 19 18 18 C 18 17 19 16 20 16 Z"></svg>`, false, true);
const trijet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$8();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$7 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 2 C 20.8 2 21.8 5 21.8 8 L 21.8 15 L 36 22 L 36 24 L 21.8 19 L 21.8 25 L 24.5 25 L 24.5 31 L 21.8 30 L 21.8 33 L 27 36 L 27 38 L 20 37 L 13 38 L 13 36 L 18.2 33 L 18.2 30 L 15.5 31 L 15.5 25 L 18.2 25 L 18.2 19 L 4 24 L 4 22 L 18.2 15 L 18.2 8 C 18.2 5 19.2 2 20 2 Z"></svg>`, false, true);
const regionalJet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$7();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$6 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 3 C 20.8 3 21.5 6 21.5 9 L 21.5 14 L 23.5 14.5 L 23.5 12 L 26 12 L 26 15.5 L 38 20 L 38 23 L 21.5 18 L 21.5 31 L 29 35 L 29 37 L 20 35 L 11 37 L 11 35 L 18.5 31 L 18.5 18 L 2 23 L 2 20 L 14 15.5 L 14 12 L 16.5 12 L 16.5 14.5 L 18.5 14 L 18.5 9 C 18.5 6 19.2 3 20 3 Z"></svg>`, false, true);
const heavyCargo = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$6();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$5 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 4 C 20.8 4 21.5 6 21.5 8 L 21.5 15 L 35 19 L 35 21 L 21.5 18 L 21.5 23 L 23.5 23 L 23.5 28 L 21.5 28 L 21.5 30 L 26 32 L 26 34 L 20 32.5 L 14 34 L 14 32 L 18.5 30 L 18.5 28 L 16.5 28 L 16.5 23 L 18.5 23 L 18.5 18 L 5 21 L 5 19 L 18.5 15 L 18.5 8 C 18.5 6 19.2 4 20 4 Z"></svg>`, false, true);
const businessJet = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$5();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
var _tmpl$$4 = /* @__PURE__ */ template(`<svg><path name=path-0 style="paint-order:fill markers;stroke-linecap:round;stroke-linejoin:round;"d="M 20 2 L 21.7 5 L 21.7 12 L 23.5 12 L 23.5 11 L 25 11 L 25 13.5 L 37 18 L 37 20.5 L 25 17 L 23.5 17.5 L 21.7 18 L 21.7 29 L 27 31.5 L 27 33.5 L 20 32 L 13 33.5 L 13 31.5 L 18.3 29 L 18.3 18 L 16.5 17.5 L 15 17 L 3 20.5 L 3 18 L 15 13.5 L 15 11 L 16.5 11 L 16.5 12 L 18.3 12 L 18.3 5 L 20 2 Z"></svg>`, false, true);
const turbopropCommuter = new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [(() => {
    var _el$ = _tmpl$$4();
    setAttribute(_el$, "filters", [0]);
    return _el$;
  })()]
});
const icons = {
  default: def,
  fighter,
  fighterJet,
  glider,
  singleEngine,
  twinPistonEngine,
  privateJet,
  twinTurboprop,
  twinjetNarrowBody,
  twinjetNarrowBody2,
  rearMountedTwinJet,
  wideBody4Engine,
  twinjetWideBody,
  narrowBody4Engine,
  trijet,
  regionalJet,
  heavyCargo,
  businessJet,
  turbopropCommuter
};
const log$5 = Logger.create("RadarSystem");
const STORAGE_KEYS = {
  range: "radar_range",
  showLabels: "radar_show_labels",
  sweepSpeed: "radar_sweep_speed"
};
const DEFAULT_SETTINGS$1 = {
  range: 50,
  showLabels: true,
  sweepSpeed: 4
};
const NM_TO_METERS = 1852;
const RADAR_INSTRUMENT_NAME = "efiRadar";
const _RadarSystem = class _RadarSystem {
  // ============================================
  // INSTRUMENT DEFINITION (used by InstrumentManager)
  // ============================================
  static getInstrumentDefinition() {
    return {
      name: RADAR_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      stackX: true,
      compositors: "css",
      visibility: true,
      animations: [{
        value: "view",
        type: "show",
        notEq: "cockpit"
      }],
      overlay: {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3C/svg%3E",
        anchor: {
          x: 100,
          y: 100
        },
        position: {
          x: 100,
          y: 100
        },
        rescale: true,
        rescalePosition: true,
        size: {
          x: 200,
          y: 200
        },
        class: "efi-radar-background geofs-instrument-background",
        overlays: [{
          class: "efi-radar-screen",
          anchor: {
            x: 100,
            y: 100
          },
          size: {
            x: 200,
            y: 200
          },
          position: {
            x: 0,
            y: 0
          }
        }]
      },
      onInit: () => _RadarSystem.onInstrumentReady(),
      onDestroy: () => _RadarSystem.onInstrumentDestroyed(),
      onShow: () => log$5.debug("Radar instrument shown"),
      onHide: () => log$5.debug("Radar instrument hidden")
    };
  }
  static getStyles() {
    return `
      .efi-radar-background {
        position: relative;
      }

      .efi-radar-screen {
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(0, 20, 0, 0.95) 0%, rgba(0, 10, 0, 0.98) 100%);
        border-radius: 50%;
        border: 3px solid #1a3a1a;
        box-shadow: 
          inset 0 0 40px rgba(0, 255, 0, 0.08),
          inset 0 0 10px rgba(0, 255, 0, 0.15),
          0 0 15px rgba(0, 0, 0, 0.6);
        overflow: hidden;
      }

      .efi-radar-grid {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform-origin: center center;
        transition: transform 0.1s linear;
      }

      .efi-radar-ring {
        position: absolute;
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .efi-radar-ring-1 { width: 33%; height: 33%; }
      .efi-radar-ring-2 { width: 66%; height: 66%; }
      .efi-radar-ring-3 { width: 95%; height: 95%; }

      .efi-radar-crosshair-h,
      .efi-radar-crosshair-v {
        position: absolute;
        background: rgba(0, 255, 0, 0.2);
      }

      .efi-radar-crosshair-h {
        width: 100%;
        height: 1px;
        top: 50%;
        left: 0;
      }

      .efi-radar-crosshair-v {
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
      }

      .efi-radar-cardinal {
        position: absolute;
        color: rgba(0, 255, 0, 0.9);
        font-size: 10px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
      }

      .efi-radar-n { top: 3px; left: 50%; transform: translateX(-50%); }
      .efi-radar-s { bottom: 3px; left: 50%; transform: translateX(-50%) rotate(180deg); }
      .efi-radar-e { right: 3px; top: 50%; transform: translateY(-50%) rotate(90deg); }
      .efi-radar-w { left: 3px; top: 50%; transform: translateY(-50%) rotate(-90deg); }

      .efi-radar-sweep-trail {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 50%;
        transform-origin: center center;
        background: conic-gradient(
          from 90deg at 50% 50%,
          transparent 0deg,
          transparent 270deg,
          rgba(0, 255, 0, 0.03) 290deg,
          rgba(0, 255, 0, 0.08) 310deg,
          rgba(0, 255, 0, 0.15) 330deg,
          rgba(0, 255, 0, 0.25) 345deg,
          rgba(0, 255, 0, 0.35) 355deg,
          rgba(0, 255, 0, 0.45) 360deg
        );
        mask-image: radial-gradient(circle, transparent 5%, black 8%, black 92%, transparent 95%);
        -webkit-mask-image: radial-gradient(circle, transparent 5%, black 8%, black 92%, transparent 95%);
      }

      .efi-radar-sweep-line {
        position: absolute;
        width: 50%;
        height: 2px;
        top: 50%;
        left: 50%;
        transform-origin: left center;
        background: linear-gradient(90deg, 
          rgba(0, 255, 0, 1) 0%, 
          rgba(0, 255, 0, 0.7) 40%,
          rgba(0, 255, 0, 0.3) 70%,
          transparent 100%
        );
        box-shadow: 0 0 6px rgba(0, 255, 0, 0.9), 0 0 12px rgba(0, 255, 0, 0.5);
        margin-top: -1px;
      }

      .efi-radar-heading-indicator {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 8px solid rgba(0, 255, 0, 0.9);
        filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.8));
      }

      .efi-radar-center {
        position: absolute;
        width: 10px;
        height: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, #00ff00 30%, rgba(0, 255, 0, 0.6) 100%);
        border-radius: 50%;
        box-shadow: 0 0 8px #00ff00, 0 0 16px rgba(0, 255, 0, 0.6);
      }

      .efi-radar-blips {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .efi-radar-blip {
        position: absolute;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, #00ff00 40%, rgba(0, 255, 0, 0.4) 100%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 4px #00ff00, 0 0 8px rgba(0, 255, 0, 0.6);
        transition: opacity 0.3s ease-out;
      }

      .efi-radar-blip-above {
        background: radial-gradient(circle, #00ffff 40%, rgba(0, 255, 255, 0.4) 100%);
        box-shadow: 0 0 4px #00ffff, 0 0 8px rgba(0, 255, 255, 0.6);
      }

      .efi-radar-blip-below {
        background: radial-gradient(circle, #ffff00 40%, rgba(255, 255, 0, 0.4) 100%);
        box-shadow: 0 0 4px #ffff00, 0 0 8px rgba(255, 255, 0, 0.6);
      }

      .efi-radar-blip-label {
        position: absolute;
        left: 12px;
        top: -3px;
        font-size: 9px;
        color: inherit;
        white-space: nowrap;
        text-shadow: 0 0 4px #000, 1px 1px 2px #000;
        font-family: monospace;
        opacity: 0.9;
      }
    `;
  }
  // ============================================
  // INSTRUMENT CALLBACKS
  // ============================================
  static onInstrumentReady() {
    this.createRadarElements();
    log$5.debug("Radar instrument ready");
  }
  static onInstrumentDestroyed() {
    this.stopUpdating();
    log$5.debug("Radar instrument destroyed");
  }
  // ============================================
  // SETTINGS
  // ============================================
  static async loadSettings() {
    try {
      const range = await Storage.get(STORAGE_KEYS.range);
      const showLabels = await Storage.get(STORAGE_KEYS.showLabels);
      const sweepSpeed = await Storage.get(STORAGE_KEYS.sweepSpeed);
      if (typeof range === "number") this.settings.range = range;
      if (typeof showLabels === "boolean") this.settings.showLabels = showLabels;
      if (typeof sweepSpeed === "number") this.settings.sweepSpeed = sweepSpeed;
      log$5.debug("Loaded radar settings:", this.settings);
    } catch (error) {
      log$5.error("Failed to load radar settings:", error);
    }
  }
  static saveSettings() {
    try {
      Storage.write(STORAGE_KEYS.range, this.settings.range);
      Storage.write(STORAGE_KEYS.showLabels, this.settings.showLabels);
      Storage.write(STORAGE_KEYS.sweepSpeed, this.settings.sweepSpeed);
    } catch (error) {
      log$5.error("Failed to save radar settings:", error);
    }
  }
  static setRange(range) {
    this.settings.range = Math.max(5, Math.min(100, range));
    this.saveSettings();
  }
  static setShowLabels(show) {
    this.settings.showLabels = show;
    this.saveSettings();
  }
  static setSweepSpeed(speed) {
    this.settings.sweepSpeed = Math.max(2, Math.min(10, speed));
    this.saveSettings();
  }
  // ============================================
  // ACTIVATION / DEACTIVATION
  // ============================================
  static async activate() {
    if (this.isActive) return;
    await this.loadSettings();
    this.injectStyles();
    InstrumentManager.init();
    if (!InstrumentManager.isActive(RADAR_INSTRUMENT_NAME)) {
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      InstrumentManager.activateInstrument(RADAR_INSTRUMENT_NAME);
    } else {
      InstrumentManager.show(RADAR_INSTRUMENT_NAME);
    }
    this.startUpdating();
    this.isActive = true;
    log$5.info("Radar system activated");
  }
  static deactivate() {
    if (!this.isActive) return;
    this.stopUpdating();
    this.targets.clear();
    InstrumentManager.hide(RADAR_INSTRUMENT_NAME);
    this.isActive = false;
    log$5.info("Radar system deactivated");
  }
  // ============================================
  // UPDATE LOOP
  // ============================================
  static startUpdating() {
    this.stopUpdating();
    this.updateInterval = window.setInterval(() => {
      const geofs2 = unsafeWindow.geofs;
      if (!geofs2 || geofs2.pause) return;
      this.updateTargets();
    }, 500);
    this.sweepInterval = window.setInterval(() => {
      const geofs2 = unsafeWindow.geofs;
      if (!geofs2 || geofs2.pause) return;
      this.updateSweep();
    }, 50);
    this.lastSweepTime = Date.now();
  }
  static stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.sweepInterval) {
      clearInterval(this.sweepInterval);
      this.sweepInterval = null;
    }
  }
  // ============================================
  // SWEEP & RENDERING
  // ============================================
  static updateSweep() {
    var _a, _b;
    const now = Date.now();
    const elapsed = Math.min((now - this.lastSweepTime) / 1e3, 0.1);
    const degreesPerSecond = 360 / this.settings.sweepSpeed;
    this.sweepAngle = (this.sweepAngle + elapsed * degreesPerSecond) % 360;
    this.lastSweepTime = now;
    const sweepLine = document.querySelector(".efi-radar-sweep-line");
    const sweepTrail = document.querySelector(".efi-radar-sweep-trail");
    if (sweepLine) sweepLine.style.transform = `rotate(${this.sweepAngle}deg)`;
    if (sweepTrail) sweepTrail.style.transform = `rotate(${this.sweepAngle}deg)`;
    const geofs2 = unsafeWindow.geofs;
    const heading = ((_b = (_a = geofs2 == null ? void 0 : geofs2.animation) == null ? void 0 : _a.values) == null ? void 0 : _b.heading) || 0;
    this.updateCardinalDirections(heading);
    this.renderBlips();
  }
  static updateCardinalDirections(heading) {
    const grid = document.querySelector(".efi-radar-grid");
    if (grid) {
      grid.style.transform = `rotate(${-heading}deg)`;
    }
  }
  static createRadarElements() {
    const screen = document.querySelector(".efi-radar-screen");
    if (!screen) {
      log$5.warn("Radar screen not found, retrying...");
      setTimeout(() => this.createRadarElements(), 200);
      return;
    }
    screen.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "efi-radar-grid";
    grid.innerHTML = `
      <div class="efi-radar-ring efi-radar-ring-1"></div>
      <div class="efi-radar-ring efi-radar-ring-2"></div>
      <div class="efi-radar-ring efi-radar-ring-3"></div>
      <div class="efi-radar-crosshair-h"></div>
      <div class="efi-radar-crosshair-v"></div>
      <span class="efi-radar-cardinal efi-radar-n">N</span>
      <span class="efi-radar-cardinal efi-radar-e">E</span>
      <span class="efi-radar-cardinal efi-radar-s">S</span>
      <span class="efi-radar-cardinal efi-radar-w">W</span>
    `;
    screen.appendChild(grid);
    const sweepTrail = document.createElement("div");
    sweepTrail.className = "efi-radar-sweep-trail";
    screen.appendChild(sweepTrail);
    const sweepLine = document.createElement("div");
    sweepLine.className = "efi-radar-sweep-line";
    screen.appendChild(sweepLine);
    const center = document.createElement("div");
    center.className = "efi-radar-center";
    screen.appendChild(center);
    const headingIndicator = document.createElement("div");
    headingIndicator.className = "efi-radar-heading-indicator";
    screen.appendChild(headingIndicator);
    const blips = document.createElement("div");
    blips.className = "efi-radar-blips";
    screen.appendChild(blips);
    log$5.debug("Radar elements created");
  }
  static renderBlips() {
    var _a, _b;
    const blipsContainer = document.querySelector(".efi-radar-blips");
    if (!blipsContainer) return;
    const geofs2 = unsafeWindow.geofs;
    const heading = ((_b = (_a = geofs2 == null ? void 0 : geofs2.animation) == null ? void 0 : _a.values) == null ? void 0 : _b.heading) || 0;
    blipsContainer.innerHTML = "";
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const radius = 85;
    for (const [, target] of this.targets) {
      const normalizedDistance = target.distance / rangeMeters;
      if (normalizedDistance > 1) continue;
      const distancePixels = normalizedDistance * radius;
      const relativeBearing = (target.bearing - heading + 360) % 360;
      const angleRad = this.toRad(relativeBearing - 90);
      const x = Math.cos(angleRad) * distancePixels;
      const y = Math.sin(angleRad) * distancePixels;
      const angleDiff = (relativeBearing - this.sweepAngle + 360) % 360;
      const intensity = angleDiff < 90 ? 1 - angleDiff / 90 : 0.15;
      const blip = document.createElement("div");
      blip.className = "efi-radar-blip";
      if (target.relativeAltitude > 300) {
        blip.classList.add("efi-radar-blip-above");
      } else if (target.relativeAltitude < -300) {
        blip.classList.add("efi-radar-blip-below");
      }
      blip.style.left = `calc(50% + ${x}px)`;
      blip.style.top = `calc(50% + ${y}px)`;
      blip.style.opacity = String(0.15 + intensity * 0.85);
      if (this.settings.showLabels && intensity > 0.3) {
        const label = document.createElement("span");
        label.className = "efi-radar-blip-label";
        label.textContent = target.callsign.substring(0, 5);
        blip.appendChild(label);
      }
      blipsContainer.appendChild(blip);
    }
  }
  // ============================================
  // TARGET TRACKING
  // ============================================
  static updateTargets() {
    var _a, _b, _c;
    const geofs2 = unsafeWindow.geofs;
    const multiplayer = unsafeWindow.multiplayer;
    const ownAircraft = (_a = geofs2 == null ? void 0 : geofs2.aircraft) == null ? void 0 : _a.instance;
    if (!ownAircraft || !(multiplayer == null ? void 0 : multiplayer.users)) return;
    const ownLla = ownAircraft.llaLocation;
    if (!ownLla) return;
    const [ownLat, ownLon, ownAlt] = ownLla;
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const now = Date.now();
    const activeIds = /* @__PURE__ */ new Set();
    for (const [userId, userData] of Object.entries(multiplayer.users)) {
      const coords = ((_b = userData == null ? void 0 : userData.lastUpdate) == null ? void 0 : _b.co) || (userData == null ? void 0 : userData.referenceCoord);
      if (!coords || !Array.isArray(coords) || coords.length < 2) continue;
      const [targetLat, targetLon, targetAlt = 0] = coords;
      const distance = this.calculateDistance(ownLat, ownLon, targetLat, targetLon);
      if (distance > rangeMeters) continue;
      const absoluteBearing = this.calculateBearing(ownLat, ownLon, targetLat, targetLon);
      activeIds.add(userId);
      this.targets.set(userId, {
        id: userId,
        callsign: userData.callsign || userId.substring(0, 6),
        distance,
        bearing: absoluteBearing,
        altitude: targetAlt,
        relativeAltitude: targetAlt - ownAlt,
        aircraftType: ((_c = userData.aircraft) == null ? void 0 : _c.toString()) || "unknown",
        lastUpdate: now
      });
    }
    for (const [id] of this.targets) {
      if (!activeIds.has(id)) {
        this.targets.delete(id);
      }
    }
  }
  // ============================================
  // MATH UTILITIES
  // ============================================
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  static calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = this.toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
    const x = Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) - Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon);
    return (this.toDeg(Math.atan2(y, x)) + 360) % 360;
  }
  static toRad(deg) {
    return deg * (Math.PI / 180);
  }
  static toDeg(rad) {
    return rad * (180 / Math.PI);
  }
  // ============================================
  // STYLES
  // ============================================
  static injectStyles() {
    const styleId = "efi-radar-styles";
    if (document.getElementById(styleId)) return;
    const style2 = document.createElement("style");
    style2.id = styleId;
    style2.textContent = this.getStyles();
    document.head.appendChild(style2);
  }
};
// State
__publicField(_RadarSystem, "isActive", false);
__publicField(_RadarSystem, "settings", {
  ...DEFAULT_SETTINGS$1
});
__publicField(_RadarSystem, "targets", /* @__PURE__ */ new Map());
// Animation
__publicField(_RadarSystem, "sweepAngle", 0);
__publicField(_RadarSystem, "lastSweepTime", 0);
// Intervals
__publicField(_RadarSystem, "updateInterval", null);
__publicField(_RadarSystem, "sweepInterval", null);
let RadarSystem = _RadarSystem;
const log$4 = Logger.create("AircraftMarkers");
let markersEnabled = false;
let radarEnabled = false;
let originalAddPlayerMarker = null;
const MARKER_STORAGE_KEYS = {
  selfColor: "marker_self_color",
  otherColor: "marker_other_color",
  strokeColor: "marker_stroke_color"
};
const DEFAULT_SETTINGS = {
  selfColor: "#ffc107",
  otherColor: "#3155B1",
  strokeColor: "#ffffff"
};
let markerSettings = {
  ...DEFAULT_SETTINGS
};
async function loadMarkerSettings() {
  try {
    const selfColor = await Storage.get(MARKER_STORAGE_KEYS.selfColor);
    const otherColor = await Storage.get(MARKER_STORAGE_KEYS.otherColor);
    const strokeColor = await Storage.get(MARKER_STORAGE_KEYS.strokeColor);
    if (selfColor) markerSettings.selfColor = selfColor;
    if (otherColor) markerSettings.otherColor = otherColor;
    if (strokeColor) markerSettings.strokeColor = strokeColor;
    log$4.debug("Loaded marker settings:", markerSettings);
  } catch (error) {
    log$4.error("Failed to load marker settings:", error);
  }
}
function saveMarkerSettings() {
  try {
    Storage.write(MARKER_STORAGE_KEYS.selfColor, markerSettings.selfColor);
    Storage.write(MARKER_STORAGE_KEYS.otherColor, markerSettings.otherColor);
    Storage.write(MARKER_STORAGE_KEYS.strokeColor, markerSettings.strokeColor);
    log$4.debug("Saved marker settings:", markerSettings);
  } catch (error) {
    log$4.error("Failed to save marker settings:", error);
  }
}
function getMarkerSettings() {
  return {
    ...markerSettings
  };
}
function setSelfColor(color) {
  markerSettings.selfColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}
function setOtherColor(color) {
  markerSettings.otherColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}
function setStrokeColor(color) {
  markerSettings.strokeColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}
function resetMarkerSettings() {
  markerSettings = {
    ...DEFAULT_SETTINGS
  };
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}
function getCustomSvgOptions() {
  return {
    user: {
      children: {
        "path-0": {
          fill: markerSettings.otherColor,
          stroke: markerSettings.strokeColor,
          strokeWidth: "0.25px"
        }
      }
    },
    self: {
      children: {
        "path-0": {
          fill: markerSettings.selfColor,
          stroke: markerSettings.strokeColor,
          strokeWidth: "0.5px"
        }
      }
    }
  };
}
function getAircraftTypeCount() {
  return Object.keys(groups).length;
}
function getAircraftGroupNames() {
  return Object.keys(groups);
}
function defineMarkers() {
  const customOptions = getCustomSvgOptions();
  for (let a in groups) {
    if (icons[a]) {
      flightAssistant.instance.icons[a] = {
        url: icons[a].render(customOptions.user).toBase64(),
        ...options.user
      };
      addSelfMarker(a, customOptions);
    }
  }
  log$4.debug(`Defined ${Object.keys(groups).length} aircraft marker types`);
}
function redefineMarkers() {
  clearIconCache();
  flightAssistant.instance.icons = {};
  defineMarkers();
  refreshMarker();
  refreshAllPlayerMarkers();
  log$4.debug("Markers redefined with new settings");
}
function addSelfMarker(a, customOptions) {
  const opts = customOptions || getCustomSvgOptions();
  flightAssistant.instance.icons[a + "-self"] = {
    url: icons[a].render(opts.self).toBase64(),
    ...options.self
  };
}
function getMarker(a, isSelf = false) {
  return flightAssistant.instance.icons[isSelf ? a + "-self" : a];
}
function getGroup(aircraftId) {
  const id = String(aircraftId);
  for (let groupName in groups) {
    if (groups[groupName].includes(id)) {
      return groupName;
    }
  }
  return "default";
}
function refreshMarker() {
  var _a, _b, _c;
  if (!markersEnabled) {
    log$4.debug("Markers disabled, skipping refresh");
    return;
  }
  const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
  if (!(aircraft == null ? void 0 : aircraft.id)) {
    log$4.warn("No aircraft instance found, scheduling retry...");
    setTimeout(refreshMarker, 1e3);
    return;
  }
  const group = getGroup(aircraft.id);
  log$4.debug(`Refreshing marker for aircraft ${aircraft.id} (group: ${group})`);
  const geofs2 = unsafeWindow.geofs;
  clearIconCache();
  if ((_c = geofs2 == null ? void 0 : geofs2.map) == null ? void 0 : _c.planeMarker) {
    geofs2.map.planeMarker.destroy();
  }
  const selfMarker = getMarker(group, true);
  geofs2.map.planeMarker = new geofs2.api.map.marker({
    zIndex: 1e3,
    icon: geofs2.api.map.getIcon(group + "-self", selfMarker)
  });
  geofs2.map.planeMarker.addToMap();
}
function clearIconCache() {
  var _a, _b;
  const geofs2 = unsafeWindow.geofs;
  if ((_b = (_a = geofs2 == null ? void 0 : geofs2.api) == null ? void 0 : _a.map) == null ? void 0 : _b.icons) {
    for (const key in geofs2.api.map.icons) {
      if (key !== "blue" && key !== "yellow" && key !== "red" && key !== "green") {
        delete geofs2.api.map.icons[key];
      }
    }
    log$4.debug("Cleared GeoFS icon cache");
  }
}
function customAddPlayerMarker(userId, group, label) {
  var _a, _b;
  const geofs2 = unsafeWindow.geofs;
  const ui2 = unsafeWindow.ui;
  const multiplayer = unsafeWindow.multiplayer;
  if (!group && ((_b = (_a = multiplayer == null ? void 0 : multiplayer.users) == null ? void 0 : _a[userId]) == null ? void 0 : _b.aircraft)) {
    group = getGroup(multiplayer.users[userId].aircraft.toString());
  }
  if (!group) {
    group = "default";
  }
  if (!ui2.playerMarkers[userId]) {
    const marker = getMarker(group);
    const markerOptions = {
      coords: [0, 0],
      icon: marker ? geofs2.api.map.getIcon(group, marker) : geofs2.api.map.getIcon("blue", geofs2.map.icons.blue),
      label: label || "-"
    };
    ui2.playerMarkers[userId] = new geofs2.api.map.marker(markerOptions);
  }
  if (geofs2.api.map._map && this.mapActive) {
    ui2.playerMarkers[userId].addToMap();
  }
  return ui2.playerMarkers[userId];
}
function refreshAllPlayerMarkers() {
  var _a, _b, _c;
  const geofs2 = unsafeWindow.geofs;
  const ui2 = unsafeWindow.ui;
  const multiplayer = unsafeWindow.multiplayer;
  if (!(ui2 == null ? void 0 : ui2.playerMarkers) || !(multiplayer == null ? void 0 : multiplayer.users)) {
    log$4.debug("No player markers or multiplayer users to refresh");
    return;
  }
  clearIconCache();
  const usersToRefresh = [];
  for (const markerId in ui2.playerMarkers) {
    if (ui2.playerMarkers[markerId] && multiplayer.users[markerId]) {
      try {
        const user = multiplayer.users[markerId];
        usersToRefresh.push({
          id: markerId,
          aircraft: ((_a = user.aircraft) == null ? void 0 : _a.toString()) || "default",
          label: ui2.playerMarkers[markerId]._label || user.callsign || "-"
        });
        (_c = (_b = ui2.playerMarkers[markerId]).destroy) == null ? void 0 : _c.call(_b);
        delete ui2.playerMarkers[markerId];
      } catch (e) {
        log$4.warn(`Failed to destroy marker for user ${markerId}:`, e);
      }
    }
  }
  for (const user of usersToRefresh) {
    const group = getGroup(user.aircraft);
    const marker = getMarker(group);
    if (marker) {
      const markerOptions = {
        coords: [0, 0],
        icon: geofs2.api.map.getIcon(group, marker),
        label: user.label
      };
      ui2.playerMarkers[user.id] = new geofs2.api.map.marker(markerOptions);
      if (geofs2.api.map._map && geofs2.map.mapActive) {
        ui2.playerMarkers[user.id].addToMap();
      }
    }
  }
  log$4.debug(`Refreshed ${usersToRefresh.length} player markers with new icons`);
}
async function enableMarkers() {
  var _a;
  if (markersEnabled) return;
  await loadMarkerSettings();
  const geofs2 = unsafeWindow.geofs;
  if (!originalAddPlayerMarker && ((_a = geofs2 == null ? void 0 : geofs2.map) == null ? void 0 : _a.addPlayerMarker)) {
    originalAddPlayerMarker = geofs2.map.addPlayerMarker.bind(geofs2.map);
  }
  if (!flightAssistant.instance.icons) {
    flightAssistant.instance.icons = {};
  }
  defineMarkers();
  geofs2.map.addPlayerMarker = customAddPlayerMarker.bind(geofs2.map);
  markersEnabled = true;
  log$4.info("Aircraft markers enabled");
  refreshAllPlayerMarkers();
  setTimeout(refreshMarker, 500);
}
function disableMarkers() {
  var _a, _b, _c;
  if (!markersEnabled) return;
  const geofs2 = unsafeWindow.geofs;
  const ui2 = unsafeWindow.ui;
  if (originalAddPlayerMarker && (geofs2 == null ? void 0 : geofs2.map)) {
    geofs2.map.addPlayerMarker = originalAddPlayerMarker;
    log$4.debug("Restored original addPlayerMarker function");
  }
  if (ui2 == null ? void 0 : ui2.playerMarkers) {
    for (const markerId in ui2.playerMarkers) {
      if (ui2.playerMarkers[markerId]) {
        try {
          (_b = (_a = ui2.playerMarkers[markerId]).destroy) == null ? void 0 : _b.call(_a);
        } catch (e) {
        }
      }
    }
    for (const key in ui2.playerMarkers) {
      delete ui2.playerMarkers[key];
    }
    log$4.debug("Cleared player markers for refresh");
  }
  if ((_c = geofs2 == null ? void 0 : geofs2.map) == null ? void 0 : _c.planeMarker) {
    try {
      geofs2.map.planeMarker.destroy();
    } catch (e) {
    }
    geofs2.map.planeMarker = new geofs2.api.map.marker({
      zIndex: 1e3,
      icon: geofs2.api.map.getIcon("yellow", geofs2.map.icons.yellow)
    });
    geofs2.map.planeMarker.addToMap();
    log$4.debug("Restored default plane marker with yellow icon");
  }
  markersEnabled = false;
  log$4.info("Aircraft markers disabled, reverted to GeoFS defaults");
}
async function enableRadar() {
  if (radarEnabled && RadarSystem.isActive) {
    log$4.debug("Radar already enabled, skipping");
    return;
  }
  if (RadarSystem.isActive) {
    RadarSystem.deactivate();
  }
  await RadarSystem.activate();
  radarEnabled = true;
  log$4.info("Radar enabled");
}
function disableRadar() {
  if (!radarEnabled && !RadarSystem.isActive) {
    log$4.debug("Radar already disabled, skipping");
    return;
  }
  RadarSystem.deactivate();
  radarEnabled = false;
  log$4.info("Radar disabled");
}
function getRadarSettings() {
  return RadarSystem.settings;
}
function setRadarRange(range) {
  RadarSystem.setRange(range);
}
function setRadarShowLabels(show) {
  RadarSystem.setShowLabels(show);
}
function setRadarSweepSpeed(speed) {
  RadarSystem.setSweepSpeed(speed);
}
var _tmpl$$3 = /* @__PURE__ */ template(`<div class="space-y-2 mb-4"><h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Configuration</h3><div class="flex flex-wrap gap-2"><button class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:cursor-pointer transition-colors text-sm"title="Save current aircraft configuration (definition + engines)">Save</button><button class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:cursor-pointer transition-colors text-sm"title="Load saved aircraft configuration">Load</button><button class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-red-600 text-white shadow-md hover:bg-red-700 hover:cursor-pointer transition-colors text-sm"title="Delete saved aircraft configuration">Delete`), _tmpl$2$3 = /* @__PURE__ */ template(`<h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Features`), _tmpl$3$2 = /* @__PURE__ */ template(`<div class="flex items-center justify-between p-3 rounded-md bg-gray-400/50 dark:bg-gray-800/60 border border-gray-500/30"><div><h3 class="font-semibold text-gray-900 dark:text-white"></h3><p class="text-xs text-gray-600 dark:text-gray-400"></p></div><div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in"><button type=button role=switch><span>`), _tmpl$4$2 = /* @__PURE__ */ template(`<div class="ml-4 space-y-2"><h4 class="font-semibold text-gray-900 dark:text-white text-sm">Special Aircraft Markers</h4><div class="p-3 rounded-md bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50"><p class="text-xs text-blue-700 dark:text-blue-300 mb-2"><span class=font-medium></span> different aircraft types available</p><div class="flex flex-wrap gap-1">`), _tmpl$5$2 = /* @__PURE__ */ template(`<span class="px-2 py-0.5 text-xs bg-blue-200/50 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded">`), _tmpl$6$2 = /* @__PURE__ */ template(`<div class="mt-4 space-y-3"><h3 class="font-semibold text-gray-900 dark:text-white text-sm">Fuel Management System</h3><div class="p-3 rounded-md bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-700/50 space-y-4"><button class="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">Reset to Defaults`), _tmpl$7$2 = /* @__PURE__ */ template(`<div class="mt-4 space-y-3"><h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Markers Settings</h3><div class="p-3 rounded-md bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50 space-y-4"><button class="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">Reset to Defaults`), _tmpl$8$1 = /* @__PURE__ */ template(`<div class="mt-4 space-y-3"><h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Radar Settings</h3><div class="p-3 rounded-md bg-green-100/50 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700/50 space-y-4"><div class="text-xs text-green-700 dark:text-green-300 space-y-1"><p>🟢 Green: Same altitude (±300m)</p><p>🔵 Cyan: Above you (+300m)</p><p>🟡 Yellow: Below you (-300m)`), _tmpl$9$1 = /* @__PURE__ */ template(`<h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Developer`), _tmpl$10$1 = /* @__PURE__ */ template(`<div class="flex items-center justify-between p-3 rounded-md bg-gray-400/50 dark:bg-gray-800/60 border border-gray-500/30"><div><h3 class="font-semibold text-gray-900 dark:text-white">Debug Mode</h3><p class="text-xs text-gray-600 dark:text-gray-400">Enable detailed console logging</p></div><div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in"><button type=button role=switch><span>`);
const log$3 = Logger.create("ExperimentalFeatures");
const FEATURE_KEYS = {
  fuelSystem: "experimental_fuel_system",
  aircraftMarkers: "experimental_aircraft_markers",
  aircraftRadar: "experimental_aircraft_radar",
  debugMode: "experimental_debug_mode"
};
if (typeof window !== "undefined") {
  window.addEventListener("experimentalFeatureChanged", (event) => {
    const {
      feature,
      enabled
    } = event.detail;
    log$3.debug(`Global event: ${feature} changed to ${enabled}`);
    if (feature === "fuelSystem") {
      log$3.debug(`Fuel gauge ${enabled ? "shown" : "hidden"}`);
    }
  });
}
const [fuelSystemEnabled, setFuelSystemEnabled] = createSignal(false);
const [aircraftMarkersEnabled, setAircraftMarkersEnabled] = createSignal(false);
const [aircraftRadarEnabled, setAircraftRadarEnabled] = createSignal(false);
const [debugModeEnabled, setDebugModeEnabled] = createSignal(false);
let statesLoaded = false;
let autoApplied = false;
const getFeatureState = async (feature) => {
  const value = await Storage.get(FEATURE_KEYS[feature]);
  if (typeof value === "boolean") {
    return value;
  }
  return value === "true" || value === true;
};
const setFeatureState = (feature, value) => {
  Storage.write(FEATURE_KEYS[feature], value);
  Storage.clearCache();
  log$3.debug(`Wrote ${feature} = ${value}, cache cleared`);
};
const loadFeatureStates = async () => {
  if (statesLoaded) return;
  const fuelState = await getFeatureState("fuelSystem");
  const markersState = await getFeatureState("aircraftMarkers");
  const radarState = await getFeatureState("aircraftRadar");
  const debugState = await getFeatureState("debugMode");
  setFuelSystemEnabled(fuelState);
  setAircraftMarkersEnabled(markersState);
  setAircraftRadarEnabled(radarState);
  setDebugModeEnabled(debugState);
  Logger.setDevMode(debugState);
  statesLoaded = true;
  log$3.info("Loaded states from storage:", {
    fuelSystem: fuelState,
    aircraftMarkers: markersState,
    aircraftRadar: radarState,
    debugMode: debugState
  });
};
const dispatchFeatureStateChange = (feature, enabled) => {
  const event = new CustomEvent("experimentalFeatureChanged", {
    detail: {
      feature,
      enabled,
      timestamp: Date.now()
    }
  });
  window.dispatchEvent(event);
  log$3.debug(`Dispatched state change event for ${feature}`);
};
const toggleFeature = async (featureName, label) => {
  let currentState;
  switch (featureName) {
    case "fuelSystem":
      currentState = fuelSystemEnabled();
      break;
    case "aircraftMarkers":
      currentState = aircraftMarkersEnabled();
      break;
    case "aircraftRadar":
      currentState = aircraftRadarEnabled();
      break;
    case "debugMode":
      currentState = debugModeEnabled();
      break;
  }
  const newState = !currentState;
  log$3.debug(`Toggling ${featureName}: ${currentState} → ${newState}`);
  switch (featureName) {
    case "fuelSystem":
      setFuelSystemEnabled(newState);
      break;
    case "aircraftMarkers":
      setAircraftMarkersEnabled(newState);
      break;
    case "aircraftRadar":
      setAircraftRadarEnabled(newState);
      break;
    case "debugMode":
      setDebugModeEnabled(newState);
      Logger.setDevMode(newState);
      break;
  }
  setFeatureState(featureName, newState);
  log$3.debug(`Saved ${featureName} = ${newState} to storage`);
  Notify.successNow(`${label} ${newState ? "enabled" : "disabled"}`);
  if (featureName === "aircraftMarkers") {
    applyAircraftMarkersFeature(newState);
  } else if (featureName === "fuelSystem") {
    await applyFuelSystemFeature(newState);
  } else if (featureName === "aircraftRadar") {
    await applyRadarFeature(newState);
  }
  dispatchFeatureStateChange(featureName, newState);
  if (featureName !== "debugMode") {
    setTimeout(() => {
      log$3.debug("Reloading UI to update system status");
      reloadUI();
    }, 100);
  }
};
const applyAircraftMarkersFeature = (enabled) => {
  if (enabled) {
    log$3.debug("Activating Aircraft Markers...");
    enableMarkers();
    Notify.successNow("Aircraft Markers activated");
  } else {
    log$3.debug("Deactivating Aircraft Markers...");
    disableMarkers();
    Notify.infoNow("Aircraft markers reverted to default");
  }
};
const applyFuelSystemFeature = async (enabled) => {
  if (enabled) {
    log$3.debug("Activating Fuel System...");
    try {
      await FuelSystem.activate();
      log$3.info("Fuel System activated");
      Notify.successNow("Fuel Management System activated");
    } catch (error) {
      log$3.error("Fuel System activation failed:", error);
      Notify.errorNow("Failed to activate Fuel System");
      setFuelSystemEnabled(false);
      setFeatureState("fuelSystem", false);
    }
  } else {
    log$3.debug("Deactivating Fuel System...");
    FuelSystem.deactivate();
    log$3.info("Fuel System deactivated");
    Notify.infoNow("Fuel Management System deactivated");
  }
};
const applyRadarFeature = async (enabled) => {
  if (enabled) {
    log$3.debug("Activating Radar...");
    try {
      await enableRadar();
      log$3.info("Radar activated");
      Notify.successNow("Aircraft Radar activated");
    } catch (error) {
      log$3.error("Radar activation failed:", error);
      Notify.errorNow("Failed to activate Radar");
      setAircraftRadarEnabled(false);
      setFeatureState("aircraftRadar", false);
    }
  } else {
    log$3.debug("Deactivating Radar...");
    disableRadar();
    log$3.info("Radar deactivated");
    Notify.infoNow("Aircraft Radar deactivated");
  }
};
const getExperimentalFeatures = async () => {
  return await new Promise(async (resolve, reject) => {
    try {
      const {
        allowed
      } = Props.ExperimentalFeatures || {
        allowed: []
      };
      await loadFeatureStates();
      if (!autoApplied) {
        autoApplied = true;
        log$3.debug("Auto-applying saved states...");
        if (fuelSystemEnabled()) {
          log$3.debug("Fuel System is enabled in storage, activating...");
          try {
            await FuelSystem.activate();
            log$3.debug("Fuel System activated (auto-load)");
          } catch (error) {
            log$3.error("Fuel System auto-activation failed:", error);
          }
        } else {
          log$3.debug("Fuel System is disabled in storage, skipping activation");
        }
        if (aircraftMarkersEnabled()) {
          log$3.debug("Auto-enabling Aircraft Markers from storage");
          applyAircraftMarkersFeature(true);
        } else {
          log$3.debug("Aircraft Markers are disabled in storage");
        }
        if (aircraftRadarEnabled()) {
          log$3.debug("Auto-enabling Radar from storage");
          await applyRadarFeature(true);
        } else {
          log$3.debug("Radar is disabled in storage");
        }
        log$3.info("Auto-apply completed");
        setTimeout(() => {
          log$3.debug("Reloading UI after auto-apply to update status");
          reloadUI();
        }, 200);
      }
      const response = [];
      response.push((() => {
        var _el$ = _tmpl$$3(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
        _el$4.$$click = () => SaveManager.save();
        _el$5.$$click = () => SaveManager.load();
        _el$6.$$click = () => SaveManager.delete();
        return _el$;
      })());
      response.push(_tmpl$2$3());
      for (const feature of allowed) {
        const {
          name,
          label
        } = feature;
        const getIsEnabled = () => {
          switch (name) {
            case "fuelSystem":
              return fuelSystemEnabled();
            case "aircraftMarkers":
              return aircraftMarkersEnabled();
            case "aircraftRadar":
              return aircraftRadarEnabled();
            default:
              return false;
          }
        };
        response.push((() => {
          var _el$8 = _tmpl$3$2(), _el$9 = _el$8.firstChild, _el$10 = _el$9.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$9.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild;
          insert(_el$10, label);
          insert(_el$11, name === "fuelSystem" && "Advanced fuel consumption", null);
          insert(_el$11, name === "aircraftMarkers" && "Special markers on map", null);
          insert(_el$11, name === "aircraftRadar" && "Radar instrument display", null);
          _el$13.$$click = () => toggleFeature(name, label);
          createRenderEffect((_p$) => {
            var _v$ = `relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${getIsEnabled() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`, _v$2 = getIsEnabled(), _v$3 = `absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${getIsEnabled() ? "right-0 border-blue-500" : "left-0 border-gray-300 dark:border-gray-600"}`;
            _v$ !== _p$.e && className(_el$13, _p$.e = _v$);
            _v$2 !== _p$.t && setAttribute(_el$13, "aria-checked", _p$.t = _v$2);
            _v$3 !== _p$.a && className(_el$14, _p$.a = _v$3);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$8;
        })());
        if (name === "aircraftMarkers" && aircraftMarkersEnabled()) {
          const typeCount = getAircraftTypeCount();
          const groupNames = getAircraftGroupNames();
          response.push((() => {
            var _el$15 = _tmpl$4$2(), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling, _el$18 = _el$17.firstChild, _el$19 = _el$18.firstChild, _el$20 = _el$18.nextSibling;
            insert(_el$19, typeCount);
            insert(_el$20, () => groupNames.map((groupName) => (() => {
              var _el$21 = _tmpl$5$2();
              insert(_el$21, groupName);
              return _el$21;
            })()));
            return _el$15;
          })());
        }
      }
      if (fuelSystemEnabled()) {
        const [capacityMult, setCapacityMult] = createSignal(FuelSystem.capacityMultiplier);
        const [consumptionMult, setConsumptionMult] = createSignal(FuelSystem.consumptionMultiplier);
        response.push((() => {
          var _el$22 = _tmpl$6$2(), _el$23 = _el$22.firstChild, _el$24 = _el$23.nextSibling, _el$25 = _el$24.firstChild;
          insert(_el$24, createComponent(Input, {
            type: "range",
            name: "capacity_multiplier",
            min: 0.1,
            max: 2,
            step: 0.01,
            get value() {
              return capacityMult();
            },
            onChange: (v) => {
              setCapacityMult(v);
              FuelSystem.setCapacityMultiplier(v);
            },
            notifyMode: "none",
            minLabel: "Less fuel",
            maxLabel: "More fuel",
            showLimits: true,
            comment: "Fuel capacity = Aircraft Mass × Multiplier × 0.33 (kg→gal)",
            valueFormatter: (v) => Number(v).toFixed(4)
          }), _el$25);
          insert(_el$24, createComponent(Input, {
            type: "range",
            name: "consumption_multiplier",
            min: 1e-3,
            max: 0.2,
            step: 1e-3,
            get value() {
              return consumptionMult();
            },
            onChange: (v) => {
              setConsumptionMult(v);
              FuelSystem.setConsumptionMultiplier(v);
            },
            notifyMode: "none",
            minLabel: "Slow burn",
            maxLabel: "Fast burn",
            showLimits: true,
            comment: "Fuel burn rate = (Thrust/RPM) × Multiplier",
            valueFormatter: (v) => Number(v).toFixed(4)
          }), _el$25);
          _el$25.$$click = () => {
            setCapacityMult(0.6349575);
            setConsumptionMult(0.05);
            FuelSystem.setCapacityMultiplier(0.6349575);
            FuelSystem.setConsumptionMultiplier(0.05);
            Notify.successNow("Fuel settings reset to defaults");
          };
          return _el$22;
        })());
      }
      if (aircraftMarkersEnabled()) {
        const settings = getMarkerSettings();
        const [selfColor, setSelfColorState] = createSignal(settings.selfColor);
        const [otherColor, setOtherColorState] = createSignal(settings.otherColor);
        const [strokeColor, setStrokeColorState] = createSignal(settings.strokeColor);
        response.push((() => {
          var _el$26 = _tmpl$7$2(), _el$27 = _el$26.firstChild, _el$28 = _el$27.nextSibling, _el$29 = _el$28.firstChild;
          insert(_el$28, createComponent(Input, {
            type: "color",
            name: "marker_self_color",
            get value() {
              return selfColor();
            },
            onChange: (v) => {
              setSelfColorState(v);
              setSelfColor(v);
            },
            notifyMode: "none"
          }), _el$29);
          insert(_el$28, createComponent(Input, {
            type: "color",
            name: "marker_other_color",
            get value() {
              return otherColor();
            },
            onChange: (v) => {
              setOtherColorState(v);
              setOtherColor(v);
            },
            notifyMode: "none"
          }), _el$29);
          insert(_el$28, createComponent(Input, {
            type: "color",
            name: "marker_stroke_color",
            get value() {
              return strokeColor();
            },
            onChange: (v) => {
              setStrokeColorState(v);
              setStrokeColor(v);
            },
            notifyMode: "none"
          }), _el$29);
          _el$29.$$click = () => {
            setSelfColorState("#ffc107");
            setOtherColorState("#3155B1");
            setStrokeColorState("#ffffff");
            resetMarkerSettings();
            Notify.successNow("Marker settings reset to defaults");
          };
          return _el$26;
        })());
      }
      if (aircraftRadarEnabled()) {
        const radarSettings = getRadarSettings();
        const [radarRange, setRadarRangeState] = createSignal(radarSettings.range);
        const [showLabels, setShowLabelsState] = createSignal(radarSettings.showLabels);
        const [sweepSpeed, setSweepSpeedState] = createSignal(radarSettings.sweepSpeed);
        response.push((() => {
          var _el$30 = _tmpl$8$1(), _el$31 = _el$30.firstChild, _el$32 = _el$31.nextSibling, _el$33 = _el$32.firstChild;
          insert(_el$32, createComponent(Input, {
            type: "range",
            name: "radar_range",
            min: 5,
            max: 100,
            step: 1,
            get value() {
              return radarRange();
            },
            onChange: (v) => {
              setRadarRangeState(v);
              setRadarRange(v);
            },
            notifyMode: "none",
            unit: "NM"
          }), _el$33);
          insert(_el$32, createComponent(Input, {
            type: "range",
            name: "radar_sweep_speed",
            min: 2,
            max: 10,
            step: 1,
            get value() {
              return sweepSpeed();
            },
            onChange: (v) => {
              setSweepSpeedState(v);
              setRadarSweepSpeed(v);
            },
            notifyMode: "none",
            unit: "s"
          }), _el$33);
          insert(_el$32, createComponent(Input, {
            type: "boolean",
            name: "radar_show_labels",
            get value() {
              return showLabels();
            },
            onChange: (v) => {
              setShowLabelsState(v);
              setRadarShowLabels(v);
            },
            notifyMode: "none"
          }), _el$33);
          return _el$30;
        })());
      }
      response.push(_tmpl$9$1());
      response.push((() => {
        var _el$35 = _tmpl$10$1(), _el$36 = _el$35.firstChild, _el$37 = _el$36.nextSibling, _el$38 = _el$37.firstChild, _el$39 = _el$38.firstChild;
        _el$38.$$click = () => toggleFeature("debugMode", "Debug Mode");
        createRenderEffect((_p$) => {
          var _v$4 = `relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${debugModeEnabled() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`, _v$5 = debugModeEnabled(), _v$6 = `absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${debugModeEnabled() ? "right-0 border-blue-500" : "left-0 border-gray-300 dark:border-gray-600"}`;
          _v$4 !== _p$.e && className(_el$38, _p$.e = _v$4);
          _v$5 !== _p$.t && setAttribute(_el$38, "aria-checked", _p$.t = _v$5);
          _v$6 !== _p$.a && className(_el$39, _p$.a = _v$6);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$35;
      })());
      resolve(response);
    } catch (e) {
      log$3.error("Failed to load experimental features:", e);
      reject(e);
    }
  });
};
delegateEvents(["click"]);
var _tmpl$$2 = /* @__PURE__ */ template(`<div class="p-4 text-center text-gray-500 dark:text-neutral-400"><p class="text-lg font-semibold mb-2">⛽ Fuel Management System</p><p>System is not active.</p><p class="text-sm mt-2">Enable it in <strong>Experimental Features</strong> tab.</p><button class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">Refresh Page`), _tmpl$2$2 = /* @__PURE__ */ template(`<div class=p-4>`), _tmpl$3$1 = /* @__PURE__ */ template(`<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4"><p class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">⚠️ System Initializing...</p><p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Please wait or enable Fuel System in Experimental Features.`), _tmpl$4$1 = /* @__PURE__ */ template(`<div class="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-6 text-center"><div class="flex flex-col items-center gap-3"><div class=text-5xl>⚠️</div><h3 class="text-xl font-bold text-red-800 dark:text-red-200">Engine Not Detected</h3><p class="text-base text-red-700 dark:text-red-300 max-w-md">No engines found on this aircraft. The fuel consumption system cannot operate without engines.</p><p class="text-sm text-red-600 dark:text-red-400 mt-2">This aircraft may be a glider or non-powered vehicle.`), _tmpl$5$1 = /* @__PURE__ */ template(`<div class="bg-gray-800 dark:bg-black/70 p-4 rounded-lg space-y-6"><div><h3 class="text-base font-semibold text-white mb-4">Current Fuel Status</h3><div class=space-y-3><div class="flex justify-between items-center text-sm text-gray-300"><span>Fuel Level</span><span>%</span></div><div class="w-full bg-gray-700 rounded-full h-2.5"><div></div></div></div><div class="grid grid-cols-2 gap-3 mt-4"><div class="bg-gray-900/70 p-3 rounded-md"><p class="text-xs text-gray-400">Current Fuel</p><p class="font-display text-xl text-white"> <span class="text-base text-gray-400">gal</span></p></div><div class="bg-gray-900/70 p-3 rounded-md"><p class="text-xs text-gray-400">Capacity</p><p class="font-display text-xl text-white"> <span class="text-base text-gray-400">gal</span></p></div><div class="bg-gray-900/70 p-3 rounded-md"><p class="text-xs text-gray-400">Consumption</p><p class="font-display text-xl text-white"> <span class="text-base text-gray-400">gal/s</span></p></div><div class="bg-gray-900/70 p-3 rounded-md"><p class="text-xs text-gray-400">Est. Time</p><p class="font-display text-xl text-white">`), _tmpl$6$1 = /* @__PURE__ */ template(`<div class="bg-gray-800 dark:bg-black/70 p-4 rounded-lg"><h3 class="text-base font-semibold text-white mb-3">Refuel Aircraft`), _tmpl$7$1 = /* @__PURE__ */ template(`<span class="text-base text-gray-400">min`), _tmpl$8 = /* @__PURE__ */ template(`<div class="space-y-3 mb-4"><div class="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3"><div class="flex items-center text-yellow-400 font-semibold text-sm">Refueling Safety Requirements</div><div class="text-yellow-200/80 mt-2 ml-1 text-sm space-y-1"><p class=text-yellow-200>`), _tmpl$9 = /* @__PURE__ */ template(`<p class="text-xs text-yellow-400/60">Find a runway or suitable landing area.`), _tmpl$10 = /* @__PURE__ */ template(`<div class="mt-3 space-y-2 ml-1"><div><span></span><span>Engage parking brakes</span></div><div><span></span><span>Stop completely</span></div><div><span></span><span>Turn off engines`), _tmpl$11 = /* @__PURE__ */ template(`<span class="text-xs text-yellow-400/60 ml-1">(Press <kbd class="px-1 py-0.5 bg-gray-700 rounded text-xs">.</kbd>)`), _tmpl$12 = /* @__PURE__ */ template(`<span class="text-xs text-yellow-400/60 ml-1">(Below 0.5 kt)`), _tmpl$13 = /* @__PURE__ */ template(`<span class="text-xs text-yellow-400/60 ml-1">(Press <kbd class="px-1 py-0.5 bg-gray-700 rounded text-xs">E</kbd>)`), _tmpl$14 = /* @__PURE__ */ template(`<div class="space-y-3 mb-4"><div class="bg-green-900/30 border border-green-500/50 rounded-lg p-3"><div class="flex items-center text-green-400 font-semibold text-sm">All safety checks passed</div><div class="mt-2 space-y-1 ml-1 text-sm text-green-400/80"><div class="flex items-center gap-2"><span>✓</span><span>Aircraft landed</span></div><div class="flex items-center gap-2"><span>✓</span><span>Parking brakes engaged</span></div><div class="flex items-center gap-2"><span>✓</span><span>Aircraft stopped</span></div><div class="flex items-center gap-2"><span>✓</span><span>Engines off`), _tmpl$15 = /* @__PURE__ */ template(`<div class="grid grid-cols-4 gap-2 mb-4"><button class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm">25%</button><button class="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm">50%</button><button class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm">75%</button><button class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm">100%`), _tmpl$16 = /* @__PURE__ */ template(`<div class=space-y-2><label class="block text-sm font-medium text-gray-300">Custom Amount`), _tmpl$17 = /* @__PURE__ */ template(`<button class="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">Empty Tank (0%)`), _tmpl$18 = /* @__PURE__ */ template(`<div class="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mt-4"><div class="flex items-center text-red-400 font-semibold text-sm">LOW FUEL WARNING</div><p class="text-sm text-red-300/80 mt-1 ml-1">Fuel level is critically low. Consider refueling soon.`);
const getFuelManagement = async () => {
  return await new Promise((resolve, reject) => {
    try {
      const [isSystemActive, setIsSystemActive] = createSignal(FuelSystem.isActive);
      const checkInterval = setInterval(() => {
        setIsSystemActive(FuelSystem.isActive);
      }, 1e3);
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 1e4);
      if (!isSystemActive()) {
        resolve([(() => {
          var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling;
          _el$5.$$click = () => {
            window.location.reload();
          };
          return _el$;
        })()]);
        return;
      }
      const [currentFuel, setCurrentFuel] = createSignal(FuelSystem.fuelPercentage);
      const [fuelGal, setFuelGal] = createSignal(FuelSystem.currentFuelGal);
      const [capacityGal, setCapacityGal] = createSignal(FuelSystem.fuelCapacityGal);
      const [consumptionRateGal, setConsumptionRateGal] = createSignal(FuelSystem.consumptionRateGalPerSec);
      const [hasEngines, setHasEngines] = createSignal(true);
      const [canRefuel, setCanRefuel] = createSignal(false);
      const [refuelConditions, setRefuelConditions] = createSignal({
        onGround: false,
        brakesOn: false,
        lowSpeed: false,
        enginesOff: false
      });
      const checkRefuelConditions = () => {
        var _a, _b, _c;
        const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
        if (!aircraft) return;
        const conditions = {
          onGround: aircraft.groundContact === true,
          brakesOn: aircraft.brakesOn === true,
          lowSpeed: (aircraft.groundSpeed || 0) < 0.5,
          enginesOff: !((_c = aircraft.engine) == null ? void 0 : _c.on)
        };
        setRefuelConditions(conditions);
        const allConditionsMet = Object.values(conditions).every((c) => c === true);
        setCanRefuel(allConditionsMet);
      };
      const updateInterval = setInterval(() => {
        var _a, _b;
        if (FuelSystem.isActive) {
          setCurrentFuel(FuelSystem.fuelPercentage);
          setFuelGal(FuelSystem.currentFuelGal);
          setCapacityGal(FuelSystem.fuelCapacityGal);
          setConsumptionRateGal(FuelSystem.consumptionRateGalPerSec);
          setIsSystemActive(true);
          checkRefuelConditions();
          const aircraft = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance;
          setHasEngines(!!((aircraft == null ? void 0 : aircraft.engines) && aircraft.engines.length > 0));
        } else {
          setIsSystemActive(false);
        }
      }, 500);
      setTimeout(() => {
        return () => clearInterval(updateInterval);
      }, 0);
      let refuelTimeout = null;
      const doRefuel = (percent) => {
        const p = Math.max(0, Math.min(100, Math.round(percent)));
        FuelSystem.refuel(p);
        setCurrentFuel(FuelSystem.fuelPercentage);
        setFuelGal(FuelSystem.currentFuelGal);
      };
      const refuelToPercentage = (percent, immediate = false) => {
        setCurrentFuel(percent);
        if (refuelTimeout) {
          clearTimeout(refuelTimeout);
          refuelTimeout = null;
        }
        if (immediate) {
          doRefuel(percent);
          return;
        }
        refuelTimeout = window.setTimeout(() => {
          doRefuel(percent);
          refuelTimeout = null;
        }, 250);
      };
      const response = [(() => {
        var _el$6 = _tmpl$2$2();
        insert(_el$6, (() => {
          var _c$ = memo(() => !!!isSystemActive());
          return () => _c$() ? _tmpl$3$1() : (() => {
            var _c$2 = memo(() => !!!hasEngines());
            return () => _c$2() ? _tmpl$4$1() : [(() => {
              var _el$9 = _tmpl$5$1(), _el$10 = _el$9.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild, _el$15 = _el$14.nextSibling, _el$16 = _el$15.firstChild, _el$17 = _el$13.nextSibling, _el$18 = _el$17.firstChild, _el$19 = _el$12.nextSibling, _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling, _el$23 = _el$22.firstChild, _el$24 = _el$20.nextSibling, _el$25 = _el$24.firstChild, _el$26 = _el$25.nextSibling, _el$27 = _el$26.firstChild, _el$28 = _el$24.nextSibling, _el$29 = _el$28.firstChild, _el$30 = _el$29.nextSibling, _el$31 = _el$30.firstChild, _el$32 = _el$28.nextSibling, _el$33 = _el$32.firstChild, _el$34 = _el$33.nextSibling;
              insert(_el$15, () => currentFuel().toFixed(1), _el$16);
              insert(_el$22, () => fuelGal().toFixed(1), _el$23);
              insert(_el$26, () => capacityGal().toFixed(1), _el$27);
              insert(_el$30, () => consumptionRateGal().toFixed(3), _el$31);
              insert(_el$34, (() => {
                var _c$3 = memo(() => consumptionRateGal() >= 1e-4);
                return () => _c$3() ? [memo(() => Math.floor(fuelGal() / consumptionRateGal() / 60)), " ", _tmpl$7$1()] : "∞";
              })());
              createRenderEffect((_p$) => {
                var _v$ = `font-display ${currentFuel() > 75 ? "text-green-400" : currentFuel() > 40 ? "text-yellow-400" : currentFuel() > 10 ? "text-orange-400" : "text-red-400"}`, _v$2 = `h-2.5 rounded-full transition-all duration-300 ${currentFuel() > 75 ? "bg-green-500" : currentFuel() > 40 ? "bg-yellow-500" : currentFuel() > 10 ? "bg-orange-500" : "bg-red-500"}`, _v$3 = `width: ${currentFuel()}%`;
                _v$ !== _p$.e && className(_el$15, _p$.e = _v$);
                _v$2 !== _p$.t && className(_el$18, _p$.t = _v$2);
                _p$.a = style(_el$18, _v$3, _p$.a);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$9;
            })(), (() => {
              var _el$35 = _tmpl$6$1(), _el$36 = _el$35.firstChild;
              insert(_el$35, (() => {
                var _c$4 = memo(() => !!!canRefuel());
                return () => _c$4() ? (() => {
                  var _el$38 = _tmpl$8(), _el$39 = _el$38.firstChild, _el$40 = _el$39.firstChild, _el$41 = _el$40.firstChild, _el$42 = _el$40.nextSibling, _el$43 = _el$42.firstChild;
                  insert(_el$40, createComponent(WarningAmber, {
                    "class": "w-5 h-5 mr-2",
                    fill: "currentColor"
                  }), _el$41);
                  insert(_el$43, () => !refuelConditions().onGround ? "Land the aircraft first." : "Complete the following steps:");
                  insert(_el$42, (() => {
                    var _c$5 = memo(() => !!!refuelConditions().onGround);
                    return () => _c$5() && _tmpl$9();
                  })(), null);
                  insert(_el$39, (() => {
                    var _c$6 = memo(() => !!refuelConditions().onGround);
                    return () => _c$6() && (() => {
                      var _el$45 = _tmpl$10(), _el$46 = _el$45.firstChild, _el$47 = _el$46.firstChild, _el$48 = _el$47.nextSibling, _el$49 = _el$46.nextSibling, _el$50 = _el$49.firstChild, _el$51 = _el$50.nextSibling, _el$52 = _el$49.nextSibling, _el$53 = _el$52.firstChild, _el$54 = _el$53.nextSibling;
                      insert(_el$47, () => refuelConditions().brakesOn ? "✓" : "→");
                      insert(_el$46, (() => {
                        var _c$7 = memo(() => !!!refuelConditions().brakesOn);
                        return () => _c$7() && _tmpl$11();
                      })(), null);
                      insert(_el$50, () => refuelConditions().lowSpeed ? "✓" : "→");
                      insert(_el$49, (() => {
                        var _c$8 = memo(() => !!!refuelConditions().lowSpeed);
                        return () => _c$8() && _tmpl$12();
                      })(), null);
                      insert(_el$53, () => refuelConditions().enginesOff ? "✓" : "→");
                      insert(_el$52, (() => {
                        var _c$9 = memo(() => !!!refuelConditions().enginesOff);
                        return () => _c$9() && _tmpl$13();
                      })(), null);
                      createRenderEffect((_p$) => {
                        var _v$4 = `flex items-center gap-2 text-sm ${refuelConditions().brakesOn ? "text-green-400" : "text-yellow-300"}`, _v$5 = `flex items-center gap-2 text-sm ${refuelConditions().lowSpeed ? "text-green-400" : "text-yellow-300"}`, _v$6 = `flex items-center gap-2 text-sm ${refuelConditions().enginesOff ? "text-green-400" : "text-yellow-300"}`;
                        _v$4 !== _p$.e && className(_el$46, _p$.e = _v$4);
                        _v$5 !== _p$.t && className(_el$49, _p$.t = _v$5);
                        _v$6 !== _p$.a && className(_el$52, _p$.a = _v$6);
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0
                      });
                      return _el$45;
                    })();
                  })(), null);
                  return _el$38;
                })() : [(() => {
                  var _el$58 = _tmpl$14(), _el$59 = _el$58.firstChild, _el$60 = _el$59.firstChild, _el$61 = _el$60.firstChild;
                  insert(_el$60, createComponent(CheckCircle, {
                    "class": "w-5 h-5 mr-2",
                    fill: "currentColor"
                  }), _el$61);
                  return _el$58;
                })(), (() => {
                  var _el$62 = _tmpl$15(), _el$63 = _el$62.firstChild, _el$64 = _el$63.nextSibling, _el$65 = _el$64.nextSibling, _el$66 = _el$65.nextSibling;
                  _el$63.$$click = () => refuelToPercentage(25, true);
                  _el$64.$$click = () => refuelToPercentage(50, true);
                  _el$65.$$click = () => {
                    doRefuel(75);
                  };
                  _el$66.$$click = () => {
                    doRefuel(100);
                  };
                  return _el$62;
                })(), (() => {
                  var _el$67 = _tmpl$16(), _el$68 = _el$67.firstChild;
                  insert(_el$67, createComponent(Input, {
                    type: "range",
                    name: "fuel_custom",
                    min: 0,
                    max: 100,
                    step: 0.1,
                    get value() {
                      return currentFuel();
                    },
                    onChange: (v) => setCurrentFuel(v),
                    onApply: (v) => doRefuel(v),
                    debounceApply: 250,
                    notifyMode: "input",
                    notifyCategory: "fuel",
                    unit: "%"
                  }), null);
                  return _el$67;
                })(), (() => {
                  var _el$69 = _tmpl$17();
                  _el$69.$$click = () => refuelToPercentage(0);
                  return _el$69;
                })()];
              })(), null);
              return _el$35;
            })(), memo(() => memo(() => !!(hasEngines() && currentFuel() < 20))() && (() => {
              var _el$70 = _tmpl$18(), _el$71 = _el$70.firstChild, _el$72 = _el$71.firstChild;
              insert(_el$71, createComponent(Warning, {
                "class": "w-5 h-5 mr-2",
                fill: "currentColor"
              }), _el$72);
              return _el$70;
            })())];
          })();
        })());
        return _el$6;
      })()];
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
delegateEvents(["click"]);
const Groups = () => [{
  name: "definitions",
  title: "Definitions",
  icon: Description,
  className: "bg-gray-300/50 dark:bg-gray-900/70",
  resource: createResource(getDefinitions),
  reference: null,
  onReset: resetDefinitions
}, {
  name: "engines",
  title: "Engines",
  icon: Engine,
  className: "bg-gray-300/50 dark:bg-gray-900/70",
  resource: createResource(getEngines),
  reference: null,
  onReset: resetEngines
}, {
  name: "experimental",
  title: "Settings",
  icon: Tune,
  className: "bg-gray-300/50 dark:bg-gray-900/70",
  resource: createResource(getExperimentalFeatures),
  reference: null
}, {
  name: "fuelManagement",
  title: "Fuel Management",
  icon: LocalGasStation,
  className: "bg-gray-800 dark:bg-black/70",
  resource: createResource(getFuelManagement),
  reference: null
}];
var _tmpl$$1 = /* @__PURE__ */ template(`<button type=button class="p-1 rounded-full hover:bg-gray-400/50 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"title=Reset>`), _tmpl$2$1 = /* @__PURE__ */ template(`<summary class="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white cursor-pointer list-none outline-none select-none [&amp;::-webkit-details-marker]:hidden"><div class="flex items-center"></div><div class="flex items-center gap-2">`), _tmpl$3 = /* @__PURE__ */ template(`<span>Loading...`), _tmpl$4 = /* @__PURE__ */ template(`<span>Error: `), _tmpl$5 = /* @__PURE__ */ template(`<div><ul class="flex flex-col gap-4">`), _tmpl$6 = /* @__PURE__ */ template(`<div> Loading...`), _tmpl$7 = /* @__PURE__ */ template(`<details class="group space-y-2"open>`);
const log$2 = Logger.create("Group");
const Summary = (props) => {
  const handleReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onReset && typeof props.onReset === "function") {
      props.onReset();
    }
  };
  return (() => {
    var _el$ = _tmpl$2$1(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$2, (() => {
      var _c$ = memo(() => !!props.icon);
      return () => _c$() && createComponent(Dynamic, {
        get component() {
          return props.icon;
        }
      });
    })(), null);
    insert(_el$2, () => props.title, null);
    insert(_el$3, createComponent(Show, {
      get when() {
        return props.onReset;
      },
      get children() {
        var _el$4 = _tmpl$$1();
        _el$4.$$click = handleReset;
        insert(_el$4, createComponent(Refresh, {
          "class": "w-5 h-5"
        }));
        return _el$4;
      }
    }), null);
    insert(_el$3, createComponent(GroupRotation, {}), null);
    return _el$;
  })();
};
const Article = (props) => {
  return (() => {
    var _el$5 = _tmpl$5(), _el$6 = _el$5.firstChild;
    var _ref$ = props.reference;
    typeof _ref$ === "function" ? use(_ref$, _el$6) : props.reference = _el$6;
    insert(_el$6, createComponent(Suspense, {
      get fallback() {
        return (() => {
          var _el$10 = _tmpl$6(), _el$11 = _el$10.firstChild;
          insert(_el$10, () => props.title, _el$11);
          return _el$10;
        })();
      },
      get children() {
        return createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                var _a;
                return (_a = props.resource) == null ? void 0 : _a.loading;
              },
              get children() {
                return _tmpl$3();
              }
            }), createComponent(Match, {
              get when() {
                var _a;
                return (_a = props.resource) == null ? void 0 : _a.error;
              },
              get children() {
                var _el$8 = _tmpl$4();
                _el$8.firstChild;
                insert(_el$8, () => props.resource.error, null);
                return _el$8;
              }
            }), createComponent(Match, {
              get when() {
                return props.resource();
              },
              get children() {
                return createComponent(For, {
                  get each() {
                    return props.resource();
                  },
                  children: (i) => {
                    return i;
                  }
                });
              }
            })];
          }
        });
      }
    }));
    createRenderEffect(() => className(_el$5, `p-4 rounded-lg space-y-4 ${props.className || "bg-gray-300/50 dark:bg-gray-900/70"}`));
    return _el$5;
  })();
};
const Details = (props) => {
  return (() => {
    var _el$12 = _tmpl$7();
    insert(_el$12, createComponent(Summary, props), null);
    insert(_el$12, createComponent(Article, props), null);
    return _el$12;
  })();
};
const Group = (props) => {
  try {
    if (!props.name || !props.resource) {
      throw new Error("Group component requires a name and resource prop.");
    }
    if (typeof props.resource !== "function") {
      throw new Error("Group component resource prop must be an function.");
    }
    let {
      name,
      resource
    } = props;
    let icon = props.icon || true;
    let title = props.title || name;
    let reference = props.reference || null;
    let className2 = props.className;
    let onReset = props.onReset || null;
    return createComponent(Details, {
      name,
      title,
      resource,
      icon,
      reference,
      className: className2,
      onReset
    });
  } catch (e) {
    log$2.error("Group validation failed:", e);
    return null;
  }
};
delegateEvents(["click"]);
const ui = {
  left: document.querySelector(".geofs-ui-left"),
  bottom: document.querySelector(".geofs-ui-bottom")
};
var _tmpl$ = /* @__PURE__ */ template(`<ul class="geofs-list geofs-toggle-panel geofs-efi-list w-[380px] bg-gray-200/80 dark:bg-black/70 backdrop-blur-md shadow-2xl overflow-y-auto font-sans text-gray-800 dark:text-gray-300 p-4 space-y-6"data-noblur=true data-onshow={geofs.initializePreferencesPanel()} data-onhide={geofs.savePreferencesPanel()}>`), _tmpl$2 = /* @__PURE__ */ template(`<button class="mdl-button mdl-js-button geofs-f-standard-ui"id=geofs-efi-button tabindex=0 data-upgraded=,MaterialButton data-toggle-panel=.geofs-efi-list data-tooltip-classname=mdl-tooltip--top title="Experimental Flight Interface">CONFIG`);
const log$1 = Logger.create("Assistant");
let reloadUICallback = null;
const reloadUI = () => {
  log$1.debug("External reload UI called");
  if (reloadUICallback) {
    reloadUICallback();
  }
};
const MenuComponent = () => {
  return createComponent(GroupsList, {});
};
const GroupsList = () => {
  const groups2 = Groups();
  onMount(() => {
    log$1.debug("GroupsList mounted with groups:", groups2.length);
    for (let i = 0; i < groups2.length; i++) {
      let {
        name,
        reference
      } = groups2[i];
      flightAssistant.refs[name] = reference;
    }
  });
  onCleanup(() => {
    log$1.debug("GroupsList cleanup");
  });
  return createComponent(For, {
    each: groups2,
    children: (group) => {
      return createComponent(Group, {
        get name() {
          return group.name;
        },
        get title() {
          return group.title;
        },
        get icon() {
          return group.icon;
        },
        get className() {
          return group.className;
        },
        get resource() {
          return group.resource[0];
        },
        get reference() {
          return group.reference;
        },
        get onReset() {
          return group.onReset;
        }
      });
    }
  });
};
const ContainerComponent = () => {
  let ref;
  const [renderKey, setRenderKey] = createSignal(0);
  const forceReload = () => {
    log$1.debug("Force reloading UI...");
    if (ref) {
      ref.innerHTML = "";
      setRenderKey((prev) => prev + 1);
      render(() => createComponent(MenuComponent, {}), ref);
      log$1.debug("UI reloaded with key:", renderKey());
    }
  };
  onMount(() => {
    flightAssistant.refs.container = ref;
    reloadUICallback = forceReload;
    log$1.debug("Reload callback registered");
  });
  onCleanup(() => {
    flightAssistant.refs.container = null;
    reloadUICallback = null;
  });
  return (() => {
    var _el$ = _tmpl$();
    var _ref$ = ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : ref = _el$;
    insert(_el$, createComponent(MenuComponent, {}));
    return _el$;
  })();
};
const ButtonComponent = () => {
  let ref;
  onMount(() => {
    flightAssistant.refs.button = ref;
  });
  onCleanup(() => {
    flightAssistant.refs.button = null;
  });
  return (() => {
    var _el$2 = _tmpl$2();
    var _ref$2 = ref;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : ref = _el$2;
    return _el$2;
  })();
};
const Container = () => render(() => createComponent(ContainerComponent, {}), ui.left);
const Button = () => render(() => createComponent(ButtonComponent, {}), ui.bottom);
const Toaster = () => createComponent(Portal, {
  get mount() {
    return document.body;
  },
  get children() {
    return createComponent(Toaster$1, {
      position: "top-right",
      gap: 8,
      expand: false,
      richColors: true
    });
  }
});
const log = Logger.create("App");
const App = () => {
  const [status, setStatus] = createStore({
    loading: true,
    ready: false,
    initDelay: 5e3,
    error: void 0
  });
  const initializeApplication = () => {
    Storage.config(GM.info.script.version, {
      prefix: "geofs_efi_"
    });
    log.info(`Storage initialized v${GM.info.script.version} with prefix: "geofs_efi_"`);
    flightAssistant = {
      version: GM.info.script.version,
      refs: {},
      instance: {},
      status,
      Storage
    };
  };
  const initializeComponents = () => {
    Props.load(propsData);
    Container();
    Button();
    if (!flightAssistant.instance.icons) {
      flightAssistant.instance.icons = {};
    }
    Aircraft.refresh();
    setStatus({
      ...status,
      ready: true,
      loading: false
    });
  };
  const handleInitializationError = (error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setStatus({
      ...status,
      loading: false,
      error: errorMessage
    });
  };
  const startApplication = async () => {
    const starter = new Promise((resolve, reject) => {
      createTimer(() => {
        try {
          initializeComponents();
          resolve("Flight Assistant started successfully!");
        } catch (error) {
          handleInitializationError(error);
          reject(error);
        }
      }, () => status.initDelay, setTimeout);
    });
    const starterWithTimeout = raceTimeout(starter, status.initDelay * 2, true, "Initialization timeout");
    await Notify.promise(starterWithTimeout, {
      loading: "Flight Assistant is starting...",
      success: (data) => data,
      error: (err) => `Error: ${err.message}`
    });
  };
  const setupAircraftMonitoring = () => {
    let lastAircraftId = null;
    const checkAircraftChange = () => {
      var _a, _b, _c;
      const currentAircraftId = (_c = (_b = (_a = unsafeWindow.geofs) == null ? void 0 : _a.aircraft) == null ? void 0 : _b.instance) == null ? void 0 : _c.id;
      if (currentAircraftId && currentAircraftId !== lastAircraftId) {
        if (lastAircraftId !== null) {
          log.info("Aircraft changed, cleaning up and reloading reactive properties");
          Props.cleanup();
          Reactive.cleanup();
          flightAssistant.instance.icons = {};
          setTimeout(async () => {
            try {
              await Props.load(propsData);
              log.info("Reactive properties reloaded");
              setTimeout(() => {
                log.debug("Triggering UI reload...");
                reloadUI();
                refreshMarker();
                Notify.successNow("Aircraft changed, configuration reloaded!");
              }, 500);
            } catch (error) {
              log.error("Error reloading reactive properties:", error);
              Notify.errorNow("Error reloading configuration");
            }
          }, 1e3);
        }
        lastAircraftId = currentAircraftId;
      }
    };
    raceTimeout(createTimer(checkAircraftChange, () => status.ready ? 1e3 : false, setInterval), 1e3);
  };
  initializeApplication();
  unsafeWindow.executeOnEventDone("geofsStarted", async () => {
    await startApplication();
  });
  unsafeWindow.flightAssistant = flightAssistant;
  setupAircraftMonitoring();
  return createComponent(Toaster, {});
};
const root = document.body;
render(() => createComponent(App, {}), root);