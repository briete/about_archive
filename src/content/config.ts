import { defineCollection } from "astro:content";

const articleCollection = defineCollection({});
export const collections = {
  article: articleCollection,
};
