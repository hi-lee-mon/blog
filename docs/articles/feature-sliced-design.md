---
title: "Feature-Sliced Design - スケーラブルなフロントエンドアーキテクチャを目指して"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "vue"]
published: true
---

:::message alert
この記事は当時まだ日本語での情報が少なかったFeature Sliced Designについて、筆者なりにまとめたものです。

その後現在に至るまで**筆者はFeature Sliced Designを採用しておらず、積極的に推奨する立場にはありません**。

本稿は備忘録を兼ねて残しますが、筆者の現在の見解とは異なる点があることをご理解ください。
:::

## Feature-Sliced Designとは

[Feature-Sliced Design](https://feature-sliced.github.io/documentation)（以下FSD）とは、フロントエンドのディレクトリ設計方法の1つです。公式には「Architectural methodology for frontend projects(フロントエンドのアーキテクチャ方法論)」とされています。

FSDはLayers・Slices・Segmentsといった3つの概念と、それを取り巻くルールやプラクティスで成り立っています。

![schema](/images/feature-sliced-design/schema.png)

FSDは予測可能なスコープとスケーラブルな設計を目指しています。プロジェクトがスケールするにつれて発生する問題、例えば増えすぎたコンポーネントによる複雑な依存関係や名前空間の衝突などの防止に役立ちます。また、FSDはこの構成の不完全さについても言及しており、小規模すぎる場合にはデメリットの方が上回ってしまう可能性があること、そして大規模な場合にはFSDをベースに拡張するなどする必要性があることを強調しています。FSDは非常によく研究されており、段階的導入も可能なので、フロントエンドの設計に起因する問題に悩んだ際には一考の価値があると思います。

本稿は、FSDのv2について筆者なりにポイントをまとめたものになります。

:::message
筆者はFSDはまだ学んでいる途中なので、加筆修正する可能性があります。また、記事の内容に誤りがあった場合はご指摘ください。
:::

## 目的と前提

https://feature-sliced.github.io/documentation/docs/about/motivation

FSDの最大の目的は**開発を促進しコストを下げる**ことです。この目的を達成するために、FSDでは以下の価値観を持って問題解決に取り組んでいます。

### 設計原則やプロセスだけでは不十分

SOLID・KISS・YAGNIなどの設計原則は非常に重要ですが、アーキテクチャに対する具体的な回答としては不十分です。そして全ての人がそれらを理解しているわけではありません。アーキテクチャについてチームに説明するのは簡単である必要があります。

同様に、ドキュメント・テストなどのプロセス的アプローチも形骸化・新規参画者の高い学習コストなどいくつかの問題を引き起こします。学習が不十分な状態だと、さらに別な問題を引き起こします。

### FSDはプロジェクト知識の学習にこそ重きをおく

FSDによると、開発時の知識は以下の3つに分けられます。

| name                 | detail                                                         | e.g.                                               |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| **基礎知識**         | 実質的に時代とともに変化しない知識。                           | アルゴリズム、コンピュータサイエンス               |
| **技術スタック**     | プロジェクトで使用される一連の技術ソリューションに関する知識。 | プログラミング言語、フレームワーク、ライブラリ     |
| **プロジェクト知識** | 現在のプロジェクトの枠組みの中でのみ適用可能な知識。           | ビジネスドメインの知識、事業やクライアントの価値観 |

FSDは、開発者はプロジェクト知識の学習にこそ時間を割くべきと考えており、その他の知識については必要最低限の学習と流用が可能なよう設計を試みています。

## コンセプト

FSDは目的達成のために多くのコンセプトを掲げています。FSDは開発現場で実際に起きる問題の多くと向き合っており、細かいものや公式が執筆途中のものも含めると説明が非常に長くなってしまうので、ここではいくつかピックアップして紹介します。

FSDはこれらを「コンセプト」と読んでますが、これらはFSDに対する要件でもあります。

### アーキテクチャ

FSDは以下の3つをアーキテクチャ要件として掲げています。

- **明示性**
  - プロジェクトとそのアーキテクチャを習得し、チームに説明するのは簡単でなければならない
  - 明示的な副作用と抽象化間の接続が必要
  - 優れたアーキテクチャーには、異質な抽象化とルールが多すぎてはならない
- **コントロール**
  - 機能の導入をスピードアップする必要がある
  - コードの拡張、変更、削除が容易である必要がある
- **適応性**
  - フレームワークやプラットフォームに依存してはいけない
  - 開発の並行化の可能性により、プロジェクトとチームを簡単にスケーリングできる必要がある
  - 変化する要件や状況に簡単に適応できる必要がある

### クロスコミュニケーション

FSDはモジュールの依存関係について、以下の要件を掲げています。

- モジュールは低カップリングに結合され、影響は予測可能・把握可能であること
- モジュールは低結合・高凝集であること(以下図の右下)
- 循環依存は排除されるべき

![low-coupling](/images/feature-sliced-design/low-coupling.png)

### Public API

Public APIは常に一定のルール下によって制限される必要があります。

FSDでは、`index.ts`(.tsとしていますが.jsなどでも同様)でre exportしているもののみが外部(他Layersのモジュール)から利用することが可能です。これにより、モジュールと外部の契約が`index.ts`集約されます。

これにより、モジュールの内部構造のリファクタは外部に影響せず安全に行うことができ、逆に破壊的変更は影響範囲の特定を容易にします。

## FSDの設計とルール概要

以降はこれらの目的やコンセプトに基づく、FSDの設計ルールについて概要を記載します。

### Layers・Slices・Segments

FSD最大の特徴は冒頭にあった図のような**Layers・Slices・Segments**の3つの階層構造です。以下再掲です。

![schema](/images/feature-sliced-design/schema.png)

#### Layers

昨今のフロントエンドのアプリケーションコードは大抵`src`ディレクトリに配置されます。FSDにおいてもこれが踏襲されており、全てのアプリケーションコードは`src`に格納されます。FSDにおいて`src`配下は**Layers**と呼ばれる階層で、以下の7つのディレクトリに分類されます。

1. **app**: アプリ全体の設定、スタイル、Providerなど。
1. **processes**: 認証などの複雑なpages間のプロセス。
1. **pages**: entities/features/widgetsからページを構成するLayer。
1. **widgets**: entitiesとfeaturesを意味のあるブロックに結合するLayer。(e.g. IssuesList、UserProfile)
1. **features**: ユーザーとのインタラクションや、ビジネス価値をもたらす機能。(e.g. SendComment、AddToCart、UsersSearch)
1. **entities**: ビジネスドメインのエンティティ。(e.g. User, Product, Order)
1. **shared**: プロジェクト/ビジネスの詳細から切り離された、再利用可能な機能。(e.g. UIKit、ライブラリ、API)

これらのLayer間の依存は一方向にのみ許可され、上位のLayerは下位のLayerにのみ依存できます。最上位のLayersは`app`です。

```
app > processes > pages > features > entities > shared
```

#### Slices

Layers直下は**Slices**と呼ばれる第2階層を持ちます。SlicesはFSDによる命名ではなく、ビジネスロジックに基づいてディレクトリが作成されるため、プロジェクトに強く依存します。

以下はディレクトリ構成の例と、各LayersにおけるSlicesの切り方の指針です。

```
├── app/
|   # Does not have specific slices,
|   # Because it contains meta-logic on the project and its initialization
├── processes/
|   # Slices implementing processes on pages
|   ├── payment
|   ├── auth
|   ├── quick-tour
|   └── ...
├── pages/
|   # Slices implementing application pages
|   # At the same time, due to the specifics of routing, they can be invested in each other
|   ├── profile
|   ├── sign-up
|   ├── feed
|   └── ...
├── widgets/
|   # Slices implementing independent page blocks
|   ├── header
|   ├── feed
|   └── ...
├── features/
|   # Slices implementing user scenarios on pages
|   ├── auth-by-phone
|   ├── inline-post
|   └── ...
├── entities/
|   # Slices of business entities for implementing a more complex BL
|   ├── viewer
|   ├── posts
|   ├── i18n
|   └── ...
├── shared/
|    # Does not have specific slices
|    # is rather a set of commonly used segments, without binding to the BL
```

**同じLayerに属するSlicesは、お互いに依存してはいけません**。これは依存関係を明確にすること、そしてビジネスロジックを凝集するために非常に重要なルールです。

また、基本的にはSlicesはネストしてはいけません。ただし、`pages`などはフレームワークの要件によってネストが必要になる場合があります。例えばNext.jsはファイルルーティングに基づくため、URL構造と同様のネストが必要となります。

#### Segments

Slices配下は`Segments`と呼ばれ、実装の目的に応じてファイルやディレクトリが分けられます。以下は例です。

```
{layer}/
    ├── {slice}/
    |   ├── ui/                     # UI-logic (components, ui-widgets,...)
    |   ├── model/                  # Business logic (store, actions, effects, reducers,...)
    |   ├── lib/                    # Infrastructure logic (utils/helpers)
    |   ├── config*/                # Configuration (of the project / slice)
    |   └── api*/                   # Logic of API requests (api instances, requests,...)
```

### Public API

コンセプト:Public APIにもありましたが、FSDでは公開モジュールはすべて各Slicesの`index.ts`のみに存在します。外部公開前のモジュールは、`AuthForm`ではなく`Form`のように短い命名にしてre export時にユニークな命名に変更することが推奨されています。

```ts
// features/auth-form/index.ts
export { Form as AuthForm } from "./ui";
export * as authFormModel from "./model";
```

```ts
// features/post-form/index.ts
export { Form as PostForm } from "./ui";
export * as postFormModel from "./model";
```

```ts
// usecase
import { AuthForm, authFormModel } from "features/auth-form";
import { PostForm, postFormModel } from "features/post-form";
```

なお、この際にバンドルサイズの肥大化が気になるケースもあるでしょう。webpackの[sideEffects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)オプションを有効にすることでこれを最適化できる可能性があります。

## 段階的な導入

FSDは段階的な導入が可能です。FSDでは過去の経験や研究に基づき、以下のような段階的導入を提案しています。プロジェクトに応じて調整しつつ、基本は以下の手順に則ることが推奨されています。

1. `app`と`shared`から作成し、土台を気づきます。通常これらのLayerは最小です。
1. FSD の規則に違反する依存関係がある場合でも、すべてのUIを`widget`と`pages`に分類します。
1. `features`と`entities`を分離し、`pages`と`widgets`を純粋な合成Layerに徐々に変えていくことで、分解の精度を徐々に高めていきます。

## 実装の参考例

コンセプトや概要を理解することと同様に、実際の実装例を学ぶことも重要です。公式のチュートリアルやexamplesが参考になることでしょう。本稿は概要説明に留まるため、以下公式のリンクを参考にしてください。

https://feature-sliced.github.io/documentation/docs/get-started/tutorial

https://feature-sliced.github.io/documentation/examples

## 考察

昨今のディレクトリ設計について調べてみたところ、日本語記事では[atomic desing](https://design.dena.com/design/atomic-design-%E3%82%92%E5%88%86%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%A4%E3%82%82%E3%82%8A%E3%81%AB%E3%81%AA%E3%82%8B)について言及してる記事が多かったのですが、英語記事を検索すると結構な割合でFSD同様`features`ディレクトリや「機能に基づいて設計すべき」という意見が多数見られました。

この`features`による設計を、[クリーンアーキテクチャ](https://www.kadokawa.co.jp/product/301806000678/)に出てくる「叫ぶアーキテクチャ」と照らし合わせて考察している記事が興味深いものでした。「叫ぶアーキテクチャ」によると、アーキテクチャはなんのシステムであるか一目でわかるはずであるとされています。

> ヘルスケア システムを構築している場合、新しいプログラマーがソース リポジトリを見たときの第一印象は、「ああ、これはヘルスケア システムだ」と思うはずです。(翻訳)

`features`にフォーカスした設計やFSDのSlicesは、まさにこれを体現しています。ビジネスロジックに基づく分類を行うため、`features`や`entities`のSlicesを見れば何のシステムか叫んでいるはずです。

これは言い換えると、FSDは過去すでに提唱されていた設計原則の上に成り立っているということです。

## 感想

今回FSDについてまとめてみて、FSDは昨今のフロントエンドでよく起こる問題を非常によく研究していると感じました。筆者自身まだFSDを隈なく理解しているわけではないですが、それでもこれまで筆者が悩んだ経験のあるいくつかの問題に対する打ち手としては筋が良さそうに思えました。

また、FSD自体が発展途上であることを強調しているところが非常に良いなと感じました。FSDはフロントエンド開発で発生する問題を集め、対策を研究・議論し徐々に適用しています。あらかじめ設計し切るのではなく、時代と共に変化する問題に適用・変化することは非常に重要であり、共感を覚えました。

一方でデメリットとして、まだ知名度が低いことと学習コストが挙げられます。知名度は今後次第かなとも思いつつ、学習コストは難しいところです。個人的にはルールも比較的シンプルだと思うし、eslintである程度強制することもできると思いますが、それでも非常にシンプルなatomic designなどと比較すると採用ハードルは高いのかなという印象も持ちました。

### 総括

FSDは銀の弾丸ではないのでデメリットもある程度あるし合う合わないはプロジェクトにもよるとは思いますが、それでも一向の価値があるアプローチだと思います。また、FSDには学ぶべき点が多数あります。採用する・しないにかかわらず、FSDがどういうものか知っておくことにメリットはあるとも思いました。

本稿がFSDを知るきっかけや、参考になれば幸いです。
