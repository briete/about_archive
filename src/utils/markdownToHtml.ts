/* eslint-disable */

import markdownToHtml from "zenn-markdown-html";

let __markdownToHtml: Function;
if (typeof markdownToHtml == "function") {
  __markdownToHtml = markdownToHtml;
} else if ((markdownToHtml as any).hasOwnProperty("default")) {
  __markdownToHtml = (markdownToHtml as any).default;
} else {
  console.error("markdownToHtml is not a support");
  throw new Error();
}

export const zennMarkDownToHtml = __markdownToHtml;
