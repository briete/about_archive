---
layout: ../../layouts/BaseLayout.astro
title: Astro v2とCloudflare Pagesで個人ブログを作ってみた
---

なぜ人はほとんど更新もしないのに個人ブログを作りたくなってしまうのか。今の時代個人ブログを自作するハードルは限りなく下がりました。私もその時流行っている技術の試す場として活用してきました。過去には以下のような技術を試しました。

- Next.js
- Nuxt.js
- Gatsby
- Hugo

最近、Astroという静的サイトジェネレータが巷で流行っていると聞いたので、試してみました。サイトを作るとなるとどこでホスティングするかの問題もありますが、最近だとホスティングもほとんど自動で行ってくれる便利なものがたくさんあるのでそれにあやかりたいと思います。今回はCloudflare Pagesを使いました。独自ドメインもCloudflare Domainで取得しました。個人的には最近Cloudflareが推しです。ホスティングできるのは他にも以下のようなサービスがあります。

- Vercel
- AWS Amplify
- Firebase
- Netlify
- Deno Deploy
- Heroku
- etc...

## Astroとは

Astroとは、静的サイトジェネレータの一種です。特徴は、Zero Runtime JavaScriptです。サーバーサイドで不要なJavaScriptを削除してからHTMLを生成するため、非常に高速です。フロントエンドはバンドル後のサイズがブラウザの表示速度に影響してしまうのでこれはうれしいですね。

また、Astro Islandという仕組みでコンポーネントごとに並列にレンダリングをすることができます。Integrationという仕組みもあり特定のUIフレームワークに依存しないため、自分の好きなフレームワークを使うことができます。さきほどコンポーネントごとにレンダリングされるとありましたが、各コンポーネントが独立しているため極端な話ヘッダーコンポーネントはReact、コンテンツはVue.jsを使うということもできます。

公式でも言及されていますが、AstroはWebアプリケーションではなく、コンテンツベースのWebサイトを作るフレームワークと強調されています。Webアプリケーションを作る場合はNext.js、静的なサイトを作る場合はAstroを使うなど他のフレームワークと棲み分ければ良さそうですね。

## 作ってみた

基本的には公式の[Getting Started](https://docs.astro.build/en/getting-started/)を見れば良いので、この記事では詳しく手順は書きません。


## コードテスト
```typescript
import { useEffect } from "react";
import 'zenn-content-css';

type Props = {
    html: string;
}

export const Article = (props: Props): JSX.Element => {
    const { html } = props;

    useEffect(()=> {
        import("zenn-embed-elements")
      },[])
      
    return (
        <div 
            className="znc"
            dangerouslySetInnerHTML={{
                __html: html
            }}
        />
    );
};

```
