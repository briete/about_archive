---
layout: ../../layouts/BaseLayout.astro
title: Astro v2とCloudflare Pagesで個人ブログを作ってみた
tags: [astro, cloudflare-pages]
createdAt: 2022-02-06
---

なぜ人はほとんど更新もしないのに個人ブログを作りたくなってしまうのか。今の時代個人ブログを自作するハードルは限りなく下がりました。私もその時流行っている技術の試す場として活用してきました。過去には以下のような技術を試しました。

- Next.js
- Nuxt.js
- Gatsby
- Hugo

最近、Astro という静的サイトジェネレータが巷で流行っていると聞いたので、試してみました。サイトをどこでホスティングするかの問題もありますが、最近だとホスティングもほとんど自動で行ってくれる便利なものがたくさんあるのでそれにあやかります。今回は Cloudflare Pages を使いました。独自ドメインも Cloudflare Domain で取得しました。個人的には最近 Cloudflare が推しです。ホスティングできるのは他にも以下のようなサービスがあります。

- Vercel
- AWS Amplify
- Firebase
- Netlify
- Deno Deploy
- Heroku
- etc...

## Astro とは

Astro とは、静的サイトジェネレータの一種です。特徴は、Zero Runtime JavaScript です。サーバーサイドで不要な JavaScript を削除してから HTML を生成するため、非常に高速です。フロントエンドはバンドル後のサイズがブラウザの表示速度に影響してしまうのでこれはうれしいですね。

また、Astro Island という仕組みでコンポーネントごとに並列レンダリングができます。Integration という仕組みもあり特定の UI フレームワークに依存しないため、自分の好きなフレームワークを使うことができます。さきほどコンポーネントごとにレンダリングされるとありましたが、各コンポーネントが独立しているため極端な話ヘッダーコンポーネントは React、コンテンツは Vue.js を使うということもできます。

公式でも言及されていますが、Astro は Web アプリケーションではなく、コンテンツベースの Web サイトを作るフレームワークと強調されています。Web アプリケーションを作る場合は Next.js、静的なサイトを作る場合は Astro を使うなど他のフレームワークと棲み分ければ良さそうですね。

## 作ってみた

### Getting Started

基本的には公式の[Getting Started](https://docs.astro.build/en/getting-started/)を参照してプロジェクトの雛形を作成します。この記事では詳しく手順は書きません。

### markdownをContent Collectionsで管理する

Astroでは `/pages` 配下に `.md` を置くことで自動的にルーティングを作成します。そのまま `/pages` 配下に置くでもいいんですが、Astro 2.0 から `Content Collections` という機能が追加されました。`/src/content` 配下に置くことでMarkdownをコンテンツの種類ごとに管理できます。さらに `Zod` を使うことで、markdownテンプレートの自体のバリデーションなどもできるようになりました。astroからは `/content` 配下にアクセスるるための専用のAPIが用意されているので、それ経由でmarkdownを一括で取得したり個別で取得できます。

### markdownをHTMLに変換する

markdownを書いてそのままビルドしてもなんの装飾もされていないただの文章が表示されるので、markdownをHTMLに変換する仕組みが必要になります。`zenn-markdown-html` という ZennがOSSで提供しているmarkdownのパーサがあるのでそれを使います。

https://github.com/zenn-dev/zenn-editor

まず、tsxを使いたいので、Astro上でReactを使用できるようにします。AstroはIntegrationという仕組みでかんたんにReactなどのUIフレームワークを導入できるようになっているので、それを利用します。

```
npx astro add react
```

以下のように、`/src/components/Article.tsx` を作成し、markdownのコンテンツを受け取って、HTMLに変換してレンダリングするコンポーネントを作成します。

```typescript
import { useEffect } from "react";
import markdownToHtml from 'zenn-markdown-html';
import "zenn-content-css";

type Props = {
  body: string;
};

export const Article = (props: Props): JSX.Element => {
  const { body } = props;
  const html = markdownToHtml(body);

  useEffect(() => {
    import("zenn-embed-elements");
  }, []);

  return (
    <div
      className="znc"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
```

このコンポーネントをAstroのページから使用します。`pages/articles/[slug].astro` のダイナミックルーティングのファイルを作成します。`getCollection` を使うことで `/content` 配下にあるmarkdownの一覧を取得できます。`getStaticPaths` 関数でダイナミックルーティングのSSGを行います。

```typescript
---
import { getCollection } from "astro:content";

import { Article } from "../../components/Article";
import Layout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const articleEntries = await getCollection("article");

  return articleEntries.map((entry) => {
    return {
      params: {
        slug: entry.slug,
      },
      props: {
        title: entry.data.title,
        tags: entry.data.tags,
        body: entry.body,
      },
    };
  });
}

const { body, title, tags } = Astro.props;
---

<Layout title="hoge">
  <main>
    <h1>{title}</h1>
    <Article body={body} />
  </main>
</Layout>
```

これでmarkdownを増やすごとに自動的に新しい記事ページができあがります。

### Cloudflare Pagesにデプロイする

AstroはCloudflare PagesでSSG、SSR両方に対応しています。特にSSRする必要もないので、今回はSSGでデプロイします。といっても、SSGでデプロイする場合は特に設定をする必要はないです。GitHubにリポジトリを作ってPushしてCloudflare Pagesでデプロイするだけです。

## まとめ

Astroで個人サイトを作ってみました。SPAの機能はないので、Webアプリケーションを作るのは他のフレームワークのほうが向いていそうですが、コンテンツベースのWeb制作にはかなり協力なフレームワークだと感じました。基本的にはHTMLとCSSの知識さえあればすぐに開発を初められる敷居の低さも良いと思いました。また、必要に応じてReactなどのフレームワークも使えたり、Headless CMSとも連携できるので、拡張性もありそうです。