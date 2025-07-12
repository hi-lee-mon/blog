---
title: 'Dynamic IOの成り立ちと"use cache"の深層'
emoji: "🌍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nextjs", "swc"]
published: true
---

`"use cache"`は、Next.jsのDynamic IOで利用することができる新たなディレクティブです。本稿は筆者の備忘録を兼ねて、Dynamic IOの成り立ちや`"use cache"`の内部実装について解説するものです。

:::message
[_Our Journey with Caching_](https://nextjs.org/blog/our-journey-with-caching)を未読の方は、まずこちらから読むことをお勧めします。
:::

:::message alert
本稿における調査は、Next.jsリポジトリの[564794d](https://github.com/vercel/next.js/tree/564794df56e421d6d4c2575b466a8be3a96dd39a)を参照しています。最新のコミットでは仕様や実装が変更されている可能性があります。
:::

## Dynamic IOの成り立ち

[Dynamic IO](https://nextjs.org/docs/canary/app/api-reference/config/next-config-js/dynamicIO)は2024年10月のNext Confで発表された、Next.jsにおける新しいコンセプトを実証するための実験的モードです。Dynamic IOはその名の通り、主に動的I/O処理に対する振る舞いを大きく変更するものです。

具体的には、以下の処理に対する振る舞いが変更されます。

- データフェッチ: `fetch()`やDBアクセスなど
- [Dynamic APIs](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis): `headers()`や`cookies()`など
- Next.jsがラップするモジュール: `Date`、`Math`、Node.jsの`crypto`モジュールなど
- 任意の非同期関数(マイクロタスクを除く)

Dynamic IOでこれらを扱う際には`<Suspense>`境界内に配置、もしくは`"use cache"`でキャッシュ可能であることを宣言する必要があります^[Dynamic APIsはリクエスト時の情報を基本としているため、`"use cache"`することはできません。]。

- `<Suspense>`: 動的にデータフェッチを実行する場合、対象のServer Componentsを`<Suspense>`境界内に配置します。従来同様`<Suspense>`境界内はStreamingで配信されます。
- `"use cache"`: データフェッチがキャッシュ可能な場合、`"use cache"`を宣言することで、Next.jsにキャッシュ可能であることを指示します。

**Partial Pre-Rendering**（PPR）を理解してる方であれば、[Static Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)と[Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)が1つのページで混在し`<Suspense>`境界単位でレンダリングを分離していく設計については馴染み深いことでしょう。

![ppr shell](/images/nextjs-partial-pre-rendering/ppr-shell.png)

https://zenn.dev/akfm/articles/nextjs-partial-pre-rendering

Dynamic IOではさらにこれを発展させ、Dynamic RenderingにStatic Renderingを入れ子にすることが可能となります。

```tsx
export default function Page() {
  return (
    <>
      ...
      {/* Static Rendering */}
      <Suspense fallback={<Loading />}>
        {/* Dynamic Rendering */}
        <DynamicComponent>
          {/* Static Rendering */}
          <StaticComponent />
        </DynamicComponent>
      </Suspense>
    </>
  );
}
```

Dynamic IOではレスポンスの開始がデータフェッチによってブロックされることがないため、効率的な配信が可能となります。

### 私見: キャッシュの混乱とNext.jsへの評価

Dynamic IOは現状実験的モードですが、未来のNext.jsのあり方の1つとも考えられます。従来のNext.jsのデフォルトで強力なキャッシュは、開発者に多くの混乱をもたらしました。Dynamic IOにおいて開発者は、`<Suspense>`境界内で常に実行するか`"use cache"`でキャッシュ可能にするか明示的に選択することになるため、従来の混乱は解消されると考えられます。

キャッシュの複雑さはNext.jsに対する最も大きなネガティブ要素だったと言っても過言ではありません。Dynamic IOの開発が進むにつれ、**Next.jsに対する評価も大きく改める必要がある**のではないかと筆者は考えています。

### `"use cache"`

`"use cache"`はDynamic IOにおける最も重要なコンセプトです。`"use cache"`はファイルや関数の先頭につけることができ、Next.jsはこれにより関数やファイルスコープがキャッシュ可能であることを理解します。

```tsx
// File level
"use cache";

export default async function Page() {
  // ...
}

// Component level
export async function MyComponent() {
  "use cache";
  return <></>;
}

// Function level
export async function getData() {
  "use cache";
  const data = await fetch("/api/data");
  return data;
}
```

`"use cache"`は引数や参照してる変数などを自動的にキャッシュのキーとして認識しますが、`children`のようなキーに不適切な一部の値は自動的に除外されます。

より詳細に知りたい方は、以下公式ドキュメントを参照ください。

https://nextjs.org/docs/canary/app/api-reference/directives/use-cache

### キャッシュの永続化

`"use cache"`によるキャッシュは、内部的に以下2つに分類されます。

- オンデマンドキャッシュ^[「`CacheHandler`由来のキャッシュ」では冗長なため、本稿において筆者が命名したものです。]: オンデマンド（`next start`以降）で利用されるキャッシュ
- `ResumeDataCache`: PPRのPrerenderから引き継がれるキャッシュ

オンデマンドキャッシュは、現時点ではシンプルなLRUのインメモリキャッシュです。内部的には`CacheHandler`という抽象化がされており、将来的には開発者がカスタマイズ可能になることが示唆されています。

`ResumeDataCache`はPPRのPrerenderから引き継がれる特殊なキャッシュで、現時点では`CacheHandler`とは別物になっています。

:::message
上記`CacheHandler`は、[`incrementalCacheHandlerPath`](https://nextjs.org/docs/app/api-reference/next-config-js/incrementalCacheHandlerPath)で設定可能なカスタムキャッシュハンドラーとは別物です。
:::

## `"use cache"`の内部実装

以降は`"use cache"`がどう実現されているのか、Next.jsの内部実装について解説します。

`"use cache"`は大まかに以下のような仕組みで実現されています。

1. SWC Pluginで`"use cache"`対象となる関数を、Next.js内部定義の`cache()`を通して定義する形に変換する
2. `cache()`は引数にキャッシュのIDや元となる関数などを含み、このIDなどをもとにキャッシュの取得や保存を行う

### `"use cache"`に対するトランスパイル

Next.jsアプリケーションは[SWC](https://swc.rs/)でトランスパイルされ、Server Actionsをマークする`"use server"`に対しては[SWC Plugin](https://swc.rs/docs/plugin/ecmascript/getting-started)によって独自の変換処理が適用されます。`"use cache"`の変換も、このSWC Pluginに含まれる形で実装されています。

`"use server"`用のPluginで`"use cache"`に関する処理をしているのはだいぶ違和感がありますが、実験的モードですし実装速度を優先したのかもしれません。

以下は`function() {}`の先頭に`"use cache"`があった時の処理です。`if let Directive::UseCache { cache_kind } = directive { ... }`で`"use cache"`を判定しています。

:::message
下記は`function() {}`に関する実装ですが、アロー関数（`() => {}`）にも同様の処理がされます。
:::

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/crates/next-custom-transforms/src/transforms/server_actions.rs#L993-L1032

この処理内で`self.maybe_hoist_and_create_proxy_for_cache_function()`が呼ばれることで、`self.has_cache = true`となります。ここで設定された`self.has_cache`により、以下の分岐に入ります。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/crates/next-custom-transforms/src/transforms/server_actions.rs#L1979-L2001

ここでは対象コードのアウトプットである`new`に対し、コメントにもあるような`import { cache as $$cache__ } from "private-next-rsc-cache-wrapper";`が挿入されるような処理がされています。

さらに`self.maybe_hoist_and_create_proxy_for_cache_function()`の後続処理で、対象の`function() {}`に対し`export var {cache_ident} = ...`の形に変換処理が適用されます。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/crates/next-custom-transforms/src/transforms/server_actions.rs#L836-L863

上記の`init`で呼ばれる`wrap_cache_expr()`にて、対象の`function() {}`は`$$cache__("name", "id", 0, function() {})`のような形に変換されます。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/crates/next-custom-transforms/src/transforms/server_actions.rs#L2217-L2236

これらの処理により、`"use cache"`の対象関数は`private-next-rsc-cache-wrapper`の`cache()`関数を介して定義される形に変換されます。

その他にもいくつか処理はありますが、残り部分の処理は割愛します。これらの処理を経て最終的には以下のような入出力が得られます。

```tsx :input
"use cache";
import React from "react";
import { Inter } from "@next/font/google";

const inter = Inter();

export async function Cached({ children }) {
  return <div className={inter.className}>{children}</div>;
}
```

```js :output
/* __next_internal_action_entry_do_not_use__ {"c0dd5bb6fef67f5ab84327f5164ac2c3111a159337":"$$RSC_SERVER_CACHE_0"} */ import { registerServerReference } from "private-next-rsc-server-reference";
import {
  encryptActionBoundArgs,
  decryptActionBoundArgs,
} from "private-next-rsc-action-encryption";
import { cache as $$cache__ } from "private-next-rsc-cache-wrapper";
import React from "react";
import inter from '@next/font/google/target.css?{"path":"app/test.tsx","import":"Inter","arguments":[],"variableName":"inter"}';
export var $$RSC_SERVER_CACHE_0 = $$cache__(
  "default",
  "c0dd5bb6fef67f5ab84327f5164ac2c3111a159337",
  0,
  /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ async function Cached({
    children,
  }) {
    return <div className={inter.className}>{children}</div>;
  },
);
Object.defineProperty($$RSC_SERVER_CACHE_0, "name", {
  value: "Cached",
  writable: false,
});
export var Cached = registerServerReference(
  $$RSC_SERVER_CACHE_0,
  "c0dd5bb6fef67f5ab84327f5164ac2c3111a159337",
  null,
);
```

### `private-next-rsc-cache-wrapper`

上記の変換で挿入された`private-next-rsc-cache-wrapper`は、webpackのaliasです。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/build/create-compiler-aliases.ts#L165-L166

上記パスは以下のファイルのbuild結果で、`use-cache-wrapper.ts`より`cache()`をそのまま`export`しています。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/build/webpack/loaders/next-flight-loader/cache-wrapper.ts

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/server/use-cache/use-cache-wrapper.ts#L438-L443

この`cache()`関数こそが、`"use cache"`の振る舞いを実装している部分になります。

### `cache()`

`cache()`関数は数百行程度ありますが、ここでは特にキャッシュの永続化の仕組みについて確認します。キャッシュの永続化は前述の通り以下2つに分けられています。

- オンデマンドキャッシュ（`CacheHandler`由来）
- `ResumeDataCache`

#### オンデマンドキャッシュ（`CacheHandler`由来）

`CacheHandler`は以下で定義されます。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/server/use-cache/use-cache-wrapper.ts#L57-L60

設定可能なCacheHandlerのように見えますが、[導入時のPR](https://github.com/vercel/next.js/pull/71505)や筆者が実装を確認した限りでは設定できるような手段は見つかりませんでした。そのため、現状は必ず`DefaultCacheHandler`が利用されるものと考えられます。なお、`DefaultCacheHandler`はLRUのインメモリキャッシュです。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/server/lib/cache-handlers/default.ts#L33

#### `ResumeDataCache`

`ResumeDataCache`は、文字通りレンダリングをResume=再開するためのキャッシュです。これはPPR有効時に利用される共有キャッシュで、`next build`時に生成したキャッシュをそのまま`next start`で再利用することができます。

https://github.com/vercel/next.js/blob/564794df56e421d6d4c2575b466a8be3a96dd39a/packages/next/src/server/use-cache/use-cache-wrapper.ts#L552-L557

`ResumeDataCache`は以下のPRで追加されました。

https://github.com/vercel/next.js/pull/72161

Prerender時にアクセスされなかった`"use cache"`な関数は、`ResumeDataCache`ではなく`CacheHandler`でハンドリングされます。

#### キャッシュデータの実態

`CacheHandler`で永続化されるキャッシュも`ResumeDataCache`も、データの実態はRSC Payloadです。つまり`"use cache"`を適用するとコンポーネントも関数も同様に、RSC Payloadとして内部的に処理されます。

`"use cache"`のキャッシュのキーや関数の戻り値はシリアル化可能であるという制約は、内部的にRSC Payloadで扱うことや、外部に保存することを考慮しての制約だと考えられます。

おおよそ`"use cache"`を実現するための実装が理解できたので、調査はここまでとしました。

## 感想

これまで筆者はNext.jsのキャッシュの仕組みに関する記事をいくつか執筆してきました。

https://zenn.dev/akfm/articles/next-app-router-navigation

https://zenn.dev/akfm/articles/next-app-router-client-cache

https://zenn.dev/akfm/articles/nextjs-revalidate

上記の記事を執筆してる時に何度も、注意すべき制約が多いことが気がかりでした。今回`"use cache"`について調査している時には、利用者側の制約については少ないような印象を受けました。SWC Pluginによる実装は黒魔術やMagicと称され忌避されることも多いですが、実際利用する観点においてはシンプルに設計されていると思います。

従来のキャッシュに対するネガティブな意見は、デフォルト挙動に関するものが大きかったとは思います。Dynamic IOはシンプルな設計の上に成り立っているように感じており、調査を進めるほど期待感が高まりました。今後のDynamic IOの開発に期待したいところです。
