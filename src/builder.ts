import dayjs from "dayjs";
import Parser from "rss-parser";
import { getHostFromURL } from "./lib/helper";

export const urlList = [
  "https://zenn.dev/briete/feed",
  "https://dev.classmethod.jp/author/sato-naoya/feed/",
];

export type RSSItem = {
  title: string;
  url: string;
  date: string;
};

const parser = new Parser();

export async function build() {
  const feed: RSSItem[] = [];
  for (const url of urlList) {
    const items = await fetchFeedItems(url);
    feed.push(...(items as any));
  }

  const allRows = feed.map((item) => {
    return {
      date: item.date,
      title: item.title,
      url: item.url,
      action: `Posted on ${getHostFromURL(item.url)}`,
    };
  });

  return allRows.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

async function fetchFeedItems(url: string) {
  try {
    const feed = await parser.parseURL(url);
    if (!feed?.items?.length) return [];
    return feed.items.map(({ title, link, isoDate }) => {
      return {
        title,
        url: link,
        date: dayjs(isoDate).format("YYYY-MM-DD"),
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}
