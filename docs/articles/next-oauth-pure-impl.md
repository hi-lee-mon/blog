---
title: "OAuthクライアントをNextAuthなしで実装する"
emoji: "🔑"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nextjs", "oauth"]
published: true
---

[OAuth2.0](https://openid-foundation-japan.github.io/rfc6749.ja.html)は3rd partyアプリケーションがユーザーに代わってリソースサーバーへアクセスすることを可能にする、認可フレームワークです。X（Twitter）やGithub、Facebookなどの著名なOAuthプロバイダーはそれぞれ拡張や制限を儲けることで**認証**にも対応しており、「OAuth認証」という言葉が多く溢れていますが、OAuth自体はあくまで**認可**の仕組みです。これらの違いや注意点については筆者の[過去の記事](https://zenn.dev/akfm/articles/authentication-with-security)を参照いただけたらと思います。

前述のようなOAuthプロバイダーを利用して認証を実装したいことはよくある要件です。筆者はNext.jsを扱うことが多いのですが、Next.jsにおいてOAuthを扱おうと思った時には[NextAuth](https://next-auth.js.org/)を検討される方も多いでしょう。筆者がこのライブラリを試したのはだいぶ前ですが、かなりライトに認証を導入できた印象が記憶に残っています。一方でNextAuthはじめOAuthのライブラリは当然処理を隠蔽するため、「どんな処理をしてるかわからない」「正しい使い方なのかわからない」などの不安を抱く方も多いのではないでしょうか。認証周りはユーザーの個人情報を扱う最も重要な部分であり、これらの不安を解消すべく理解に努めることはとても大切だと筆者は考えています。

本稿では表題の通りNextAuthなどのライブラリをあえて採用せずスクラッチでOAuthクライアントを[Next.js (App Router)](https://nextjs.org/docs/app)上に実装することで、これらのライブラリが行ってる処理やOAuthの仕様について、そしてApp Routerにおけるセッション管理について理解を深めることを目指します。

## 実装要件

本稿で実装するアプリケーション概要としては以下の通りです。

- GitHub OAuth(認可コード付与)でアクセストークンの取得を行う
- `state`パラメータを検証しCSRF攻撃対策を行う
- 取得したアクセストークンはサーバー側セッションとしてRedisに保存する

:::message
GihHub OAuthを選んだのは、単に多くの開発者がアカウントを持ってると思ったからです。<br />基本的な処理の流れは変わらないので、他のプロバイダーでも大枠の実装は変わりません。
:::

:::message alert
OAuthは認可の仕組みであり、本稿はOAuthを用いた認証にも対応しているGitHubを用いた参考実装です。OAuthに対応してるからと言って必ずしも認証に用いても良い訳ではないので、ご注意ください。
:::

## 参考実装

実装の全量を記載するとわかりにくいため一部実装を省略記載してる部分もあります。実装の全量については以下のリポジトリをご参照ください。

https://github.com/AkifumiSato/next-oauth-pure-impl-example

## 設定・環境構築

まずは先に設定と環境構築です。

### GitHubにOAuthアプリケーションを設定

1. GitHubにログイン
2. [OAuth Apps](https://github.com/settings/developers)にアクセス
3. 「New OAuth App」をクリック
4. 必要な情報を入力
   - Application name: に任意の名前 
   - Homepage URL: `http://localhost:3000` 
   - Authorization callback URL: `http://localhost:3000/login/callback`
5. 「Register application」をクリック
6. Client IDとClient Secretを控えておく

![GitHubにOAuthアプリケーションを設定](/images/next-oauth-pure-impl/github_register_app.png)

:::message alert
Client Secretは遷移すると表示されなくなるのでご注意ください。
再発行も可能なので、表示されなくなってしまった時は再発行しましょう。
:::

### Next.js App Routerプロジェクトの作成

Next.jsのプロジェクトを作成します。できるだけシンプルな雛形を使いたいので`--example hello-world`をつけています。また、筆者はpnpm推しなので`--use-pnpm`をつけています。

```shell-session
$ pnpm create next-app --use-pnpm --example hello-world
```

### Redisをdocker-composeで起動

作業PCにDockerがインストールされていることを前提とします。`docker-compose.yml`を作成し、ローカル環境でRedisを起動します。

```yml
# docker-compose.yml
services:
  redis:
    image: redis
    ports:
      - 6379:6379
    expose:
      - 6379
    container_name: next_oauth_pure_impl_example_redis
    volumes:
      - next-oauth-pure-impl-example-redis:/data
    restart: always
volumes:
  next-oauth-pure-impl-example-redis:
    driver: local
```

```shell-session
$ docker-compose up
```

Redis接続のために[ioredis](https://www.npmjs.com/package/ioredis)もインストールしておきます。

```shell-session
$ pnpm add ioredis
```

## App Routerにおけるセッション管理

必要なものは揃ったので、実装に移ります。まずはセッション管理を実装し、その後OAuthの仕様に沿ってリダイレクトやAPIリクエストなどを実装していきます。

### セッションの設計

セッションには認証状態とGitHubのアクセストークンを保存しておきたいので、Redisに保存する構造はタグ付きunionで定義すると以下のような型になります。ファイルは`app/lib/session.ts`とします。

```ts
type RedisSession = {
  currentUser:
    | {
    isLogin: false;
  }
    | {
    isLogin: true;
    accessToken: string;
  };
};
```

セッションはCookieにセッションIDを保存することで実現するわけですが、App RouterにおいてCookie操作はServer ActionやRoute Handlerに限られます。

https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options

このことから、上記に定義した`RedisSession`を読み取り専用で参照する場合と、変更可能なセッションとして扱う2つが考えられます。前者はReadOnlyな`RedisSession`で十分ですが、後者は`MutableSession`クラスとしてセッション操作時のメソッドを定義することにします。

```ts
class MutableSession {
  private readonly redisSession: RedisSession;

  constructor(redisSession: RedisSession) {
    this.redisSession = redisSession;
  }

  get currentUser() {
    return this.redisSession.currentUser;
  }

  private async save(): Promise<void> { /* ... */ }
}
```

この`MutableSession`に必要に応じて変更の振る舞いを追加していきます。これらのクラスや構造を取得する関数として、以下を定義します。

```ts
export async function getMutableSession(): Promise<MutableSession> { /* ... */ }
export async function getReadonlySession(): Promise<Readonly<RedisSession>> { /* ... */ }
```

`page.tsx`やServer Actionそれぞれ上記関数を呼び出してセッションを扱うものとします。

これらの具体の処理を実装していきます。まずは`MutableSession`の`save`にRedisへの保存とNext.jsの`cookies`でセッションIDの設定を行うよう実装します。

```ts
import Redis from "ioredis";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const SESSION_COOKIE_NAME = "sessionId";

// ...

class MutableSession {
  // ...
  private async save(): Promise<void> {
    const sessionIdFromCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
    let sessionId: string;
    if (sessionIdFromCookie) {
      sessionId = sessionIdFromCookie;
    } else {
      sessionId = uuid();
      cookies().set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        // localhost以外で動作させる場合はsecure: trueを有効にする
        // secure: true,
      });
    }
    await redisStore.set(sessionId, JSON.stringify(this.values));
  }
  // ...
}
```

`MutableSession`は初期値をコンスラクタに取ります。これは`getMutableSession`と共通化できるので、CookieやRedisを参照して初期値を取得する`loadPersistedSession`関数を実装します。

```ts
async function loadPersistedSession(): Promise<RedisSession> {
  const sessionIdFromCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = sessionIdFromCookie
    ? await redisStore.get(sessionIdFromCookie)
    : null;
  if (session) {
    return JSON.parse(session) as RedisSession;
  }
  return { currentUser: { isLogin: false } };
}

// use only in actions/route handlers
export async function getMutableSession(): Promise<MutableSession> {
  return new MutableSession(await loadPersistedSession());
}

// readonly session
export async function getReadonlySession(): Promise<
  Readonly<RedisSession>
> {
  return await loadPersistedSession();
}
```

`Readonly<RedisSession>`としてますが、`DeepReadOnly`を定義する方がより良いでしょう。本項の趣旨から外れるのでここでは割愛します。

これでセッションを利用する準備は整いました。以降はOAuthのフローを実装しながらセッション操作は`MutableSession`にメソッドで実装していきます。

## OAuthの認可コード付与の実装

OAuth2.0ではアクセストークンを取得する方法としていくつかのフローを定義しています。最も標準的なのは[認可コード付与](https://tex2e.github.io/rfc-translater/html/rfc6749.html#4-1--Authorization-Code-Grant)という手法で、Github OAuthでもこれをサポートしており、Webアプリケーションでは通常このフローを採用します。

:::message
GitHubでは[デバイス認証付与](https://tex2e.github.io/rfc-translater/html/rfc8628.html)もサポートしていますが、これはブラウザが利用できないCLIやツールなどでの採用を想定しています。
:::

ここからは以下のGitHun公式ドキュメントに沿って、認可コード付与の実装を行います。

https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow

### 1. ユーザーの GitHub ID を要求する

まずはGitHubの認可ページにリダイレクトします。リダイレクト前に、`state`パラメータに付与するCSRFトークンを発行しセッションに保存する必要があります。

これは、CSRF攻撃を防ぐための措置で、**GitHubへ認証しに行った人とGitHubから認証して帰ってきた人が同一である**ことを確認するためのものです。これらが異なる場合、悪意ある攻撃者が他人を自分のアカウントで認証させようとしている可能性があります。例えば筆者が攻撃者で、GitHubで認証しリダイレクトされるURLが発行された段階でリクエストを停止し、読者であるあなたに送りつけたとします。あなたがそのURLをクリックすると、筆者のアカウントで他アプリケーションにログインした状態になってしまいます。このままあなたが気づかず、未入力になっていた個人情報を入力するとどうでしょう？筆者は同じアカウントでログイン可能なので、個人情報の奪取に成功してしまいます。これを防ぐために、`state`パラメータによるCSRFトークンの検証により「GitHubへ認証しに行った人とGitHubから認証して帰ってきた人が同一である」という確認が必要なのです。

https://qiita.com/ist-n-m/items/67a5a0fb4f50ac1e30c1#oauth20-%E3%81%AE-csrfcross-stie-request-forgery

:::message
実際には`code`の有効期限が10分なので、攻撃リスクは低いかもしれませんが、被害が出てからでは遅いので`state`パラメータの検証は行うようにしましょう。
:::

発行したCSRFトークンはセッションに保存する必要があるので、ログイン処理としてServer ActionsでCSRFトークンの発行とセッションへ保存（`MutableSession`の`preLogin()`メソッド）後にGitHubへリダイレクトすることになります。

```tsx
// app/page.tsx
import { login } from "./action";

export default function Page() {
  return (
    <>
      <h1>Hello, Github OAuth App!</h1>
      <form action={login}>
        <button type="submit">Github OAuth</button>
      </form>
    </>
  );
}

// app/action.ts
"use server";

import { redirect } from "next/navigation";
import { getMutableSession } from "./lib/session";

export async function login() {
  const mutableSession = await getMutableSession();
  const state = await mutableSession.preLogin();

  redirect(
    `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`,
  );
}
```

リダイレクトURLには`state`以外にもパラメータに`client_id`と`scope`を指定しています。`client_id`はGitHubのOAuthアプリケーションの設定で取得したものです。`scope`はGitHubの認可ページで要求する権限を指定します。ここでは`user:email`を指定していますが、他にも[様々なスコープ](https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes)があります。

`mutableSession.preLogin()`はCSRFトークンを発行し、セッションに保存するメソッドです。このメソッドを`MutableSession`に実装します。

```tsx
// app/lib/session.ts
import { v4 as uuid } from "uuid";
// ...
class MutableSession {
  // ...
  async preLogin() {
    const state = uuid();
    this.redisSession.currentUser = { isLogin: false, state };
    await this.save();

    return state;
  }
  // ...
}
```

これでGitHubの認可ページにリダイレクトする準備が整いました。

### 2. GitHub によってユーザーが元のサイトにリダイレクトされる

GitHubの認可ページでユーザーが認可を行うと、指定したURLにリダイレクトされます。このリダイレクト先のURLはOAuthアプリケーションの設定で指定した `http://localhost:3000/login/callback` です。リダイレクト時にはGETパラメータで`state`と`code`が渡されます。`state`はセッションのCSRFトークンと照合し、異なる値であれば処理を中断しなければなりません。

`http://localhost:3000/login/callback` に実装する処理の流れは、以下のようになります。

1. セッションのCSRFトークンとリダイレクト時の`state`パラメータを照合
2. `code`パラメータを使ってGitHubにアクセストークンを要求・取得 
3. セッションにアクセストークンを保存
4. `/user`へリダイレクト

`GITHUB_CLIENT_ID`と`GITHUB_CLIENT_SECRET`はGitHubのOAuthアプリケーションの設定で取得したものです。ローカル環境の`.env`ファイルに記述するなどして環境変数として設定しましょう。

```ts
// app/(auth)/login/callback/route.ts
import { RedirectType, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getMutableSession } from "../../../lib/session";

type GithubAccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

export async function GET(request: NextRequest) {
  const mutableSession = await getMutableSession();
  // type guardのために=== ture
  if (mutableSession.currentUser.isLogin === true) {
    throw new Error("Already login.");
  }

  const searchParams = request.nextUrl.searchParams;

  // check state(csrf token)
  const urlState = searchParams.get("state");
  if (mutableSession.currentUser.state !== urlState) {
    console.error("CSRF Token", mutableSession.currentUser.state, urlState);
    throw new Error("CSRF Token not equaled.");
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  if (GITHUB_CLIENT_ID === undefined || GITHUB_CLIENT_SECRET === undefined) {
    throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not defined");
  }

  const code = searchParams.get("code"); // required
  const githubTokenResponse: GithubAccessTokenResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
    {
      method: "GET",
      headers: {
        Accept: " application/json",
      },
    },
  ).then((res) => {
    if (!res.ok) throw new Error("failed to get access token");
    return res.json();
  });

  await mutableSession.onLogin(githubTokenResponse.access_token);

  redirect("/user", RedirectType.replace);
}

// app/lib/session.ts
class MutableSession {
  // ...
  async onLogin(accessToken: string) {
    this.redisSession.currentUser = { isLogin: true, accessToken };
    await this.save();
  }
  // ...
}
```

これでアクセストークンを取得することに成功しました。

### 3. アクセストークンを使ってAPIにアクセスする

次は`/user`ページで実際にGitHub APIを叩いてユーザー情報を取得してみます。ログインを必須とするページな想定として`session.currentUser.isLogin`をチェックし、ログインしていない場合は`NotLogin`コンポーネントを返すようにします。

`isLogin`が`true`の場合、アクセストークンを保持してるのでこれを使いGitHub APIからユーザー情報を取得します。リクエスト時には`Authorization`ヘッダーに`Bearer ${session.currentUser.accessToken}`を付与する必要があります。

```tsx
// app/(auth)/user/page.tsx
import { getReadonlySession } from "../../lib/session";
import { GithubUser, NotLogin } from "./presentational";

// Partial type
export type GithubUserResponse = {
  id: number;
  name: string;
  email: string;
};

export default async function Page() {
  const session = await getReadonlySession();
  if (!session.currentUser.isLogin) {
    return <NotLogin />;
  }

  const githubUser: GithubUserResponse = await fetch(
    "https://api.github.com/user",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.currentUser.accessToken}`,
      },
    },
  ).then(async (res) => {
    if (!res.ok) {
      console.error(res.status, await res.json());
      throw new Error("failed to get github user");
    }
    return res.json();
  });

  return <GithubUser githubUser={githubUser} />;
}
```

GitHub OAuthの認可コード付与の実装はこれで以上です。アクセストークンを取得し、GitHub APIを利用することができるようになりました。

## より深く理解するために

自分でプロバイダーのドキュメントを読みながらOAuthクライアントを実装してみると、悪意ある攻撃やそれらに対する保護方法など、多くの学びが得られます。OAuth2.0やOpen ID Connectの仕様を明記してるRFCを読むとさらにより深い理解を得られるので、業務でこれらを利用すると言う方はぜひ一度RFCも読んでみることをお勧めします。

https://openid-foundation-japan.github.io/rfc6749.ja.html

https://openid-foundation-japan.github.io/openid-connect-core-1_0.ja.html

### 余談: 単体テストの実装


本稿の参考実装で登場するテストコードは[Vitest](https://vitest.dev/)で実装しています。モックは[msw](https://mswjs.io/)と[ioredis-mock](https://www.npmjs.com/package/ioredis-mock)を利用しているので、下記のコマンドでインストールしてください。

```shell-session
$ pnpm add -D vitest @vitejs/plugin-react msw ioredis-mock
```

vitestとmswの設定は以下のように行います。

```ts
// vitest.config.mts
/// <reference types="vitest" />
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}"],
    setupFiles: "./vitest.setup.ts",
    env: {
      GITHUB_CLIENT_ID: "GITHUB_CLIENT_ID",
      GITHUB_CLIENT_SECRET: "GITHUB_CLIENT_SECRET",
    },
  },
});
```

```tsx
// vitest.setup.ts
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "./app/mocks";

vi.mock("ioredis", async () => await import("ioredis-mock"));

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const cookiesMock = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies() {
    return cookiesMock;
  },
}));

const redirectMock = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("next/navigation")>()),
    redirect: redirectMock,
  };
});

beforeEach(() => {
  cookiesMock.get.mockClear();
  cookiesMock.set.mockClear();
  redirectMock.mockClear();
});
```

```tsx
// app/mocks.ts
import { setupServer } from "msw/node";

export const server = setupServer();
```

テスト時はセッションを任意の状態にしたいので、utilityを作成します。

```ts
import { Redis as OriginalRedis } from "ioredis";
import Redis from "ioredis-mock";

let redis: OriginalRedis;

export function getRedisInstance() {
  if (!redis) {
    redis = new Redis({
      enableAutoPipelining: true,
    });
  }
  return redis;
}
```

これでテストの準倍が整いました。

### Server Action `login` のテスト

筆者は過去の記事にあるようにAAAパターンを採用したテストの書き方を好んでいます。また、可能な限り最も外部の部分だけをモックして単一プロセスで実行できる状態を目指します。詳細については下記の記事をご参照ください。

https://zenn.dev/akfm/articles/frontend-unit-testing

今回もAAAパターンでテストを書いていきます。

```ts
// app/action.test.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Mock, describe, expect, test } from "vitest";
import { login } from "./action";
import { getRedisInstance } from "./lib/test-utils/session";

const cookiesMock = cookies() as unknown as {
  get: Mock;
  set: Mock;
};

describe("login", () => {
  test("sessionにstate tokenが保存されredirectされる", async () => {
    // Arrange
    cookiesMock.get.mockReturnValue({ value: "DUMMY_SESSION_ID" });
    const redis = getRedisInstance();
    // Act
    await login();
    // Assert
    expect(redirect).toBeCalledTimes(1);
    const session = JSON.parse(await redis.get("DUMMY_SESSION_ID"));
    expect(session?.currentUser?.isLogin).toBe(false);
    expect(session?.currentUser?.state).toBeTypeOf("string");
  });
});
```

### `/login/callback` のテスト

`/login/callback`のテストでは、セッションの状態やAPI呼び出しの状態に応じた振る舞いをテストします。

```tsx
// app/(auth)/login/callback/route.test.ts
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { Mock, describe, expect, test } from "vitest";
import { getRedisInstance } from "../../../lib/test-utils/session";
import { server } from "../../../mocks";
import { githubApiHandlers } from "../../mocks";
import { GET } from "./route";

const cookiesMock = cookies() as unknown as {
  get: Mock;
  set: Mock;
};

function prepareSessionHasState() {
  const DUMMY_SESSION_ID = "DUMMY_SESSION_ID";
  const DUMMY_STATE = "DUMMY_STATE";

  cookiesMock.get.mockReturnValue({ value: DUMMY_SESSION_ID });
  const redis = getRedisInstance();
  redis.set(
    DUMMY_SESSION_ID,
    JSON.stringify({
      currentUser: {
        isLogin: false,
        state: DUMMY_STATE,
      },
    }),
  );

  return {
    redis,
    state: DUMMY_STATE,
    sessionId: DUMMY_SESSION_ID,
  };
}

describe("GET", () => {
  test("stateパラメータがセッションの値と不一致時にエラー", () => {
    // Arrange
    const { state } = prepareSessionHasState();
    const DUMMY_STATE = `${state}__NO_NEED_PREFIX`;
    const request = new NextRequest(
      `http://localhost:3000/auth/github/callback?code=123&state=${DUMMY_STATE}`,
    );
    // Act
    const responsePromise = GET(request);
    // Assert
    expect(responsePromise).rejects.toThrow("CSRF Token not equaled.");
  });

  test("access_tokenの取得エラー", async () => {
    // Arrange
    const { state } = prepareSessionHasState();
    server.use(githubApiHandlers.accessToken.error());
    const request = new NextRequest(
      `http://localhost:3000/auth/github/callback?code=123&state=${state}`,
    );
    // Act
    const responsePromise = GET(request);
    // Assert
    await expect(responsePromise).rejects.toThrow("failed to get access token");
  });

  test("access_token取得後`/user`にリダイレクト", async () => {
    // Arrange
    const { redis, state, sessionId } = prepareSessionHasState();
    server.use(
      githubApiHandlers.accessToken.success(),
      githubApiHandlers.user.success(),
    );
    const request = new NextRequest(
      `http://localhost:3000/auth/github/callback?code=123&state=${state}`,
    );
    // Act
    const response = await GET(request);
    // Assert
    expect(response).toBeUndefined();
    const sessionValues = await redis
      .get(sessionId)
      .then((res) => (res === null ? null : JSON.parse(res)));
    expect(sessionValues).toEqual({
      currentUser: {
        isLogin: true,
        accessToken: "DUMMY TOKEN",
      },
    });
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith("/user", RedirectType.replace);
  });
});
```

### `/user` ページのテスト

`/user`ページのテストでも同様に、セッションの状態やAPI呼び出しの状態に応じた振る舞いをテストします。

```tsx
import { cookies } from "next/headers";
import { Mock, describe, expect, test, vi } from "vitest";
import { getRedisInstance } from "../../lib/test-utils/session";
import { server } from "../../mocks";
import { githubApiHandlers } from "../mocks";
import Page from "./page";
import { GithubUser, NotLogin } from "./presentational";

const cookiesMock = cookies() as unknown as {
  get: Mock;
  set: Mock;
};

function prepareSession({ isLogin }: { isLogin: boolean }) {
  const redis = getRedisInstance();
  if (!isLogin) {
    return {
      redis,
      sessionId: null,
    };
  }

  const DUMMY_SESSION_ID = "DUMMY_SESSION_ID";
  const DUMMY_ACCESS_TOKEN = "DUMMY_ACCESS_TOKEN";
  cookiesMock.get.mockReturnValue({ value: DUMMY_SESSION_ID });
  redis.set(
    DUMMY_SESSION_ID,
    JSON.stringify({
      currentUser: {
        isLogin: true,
        accessToken: DUMMY_ACCESS_TOKEN,
      },
    }),
  );

  return {
    redis,
    sessionId: DUMMY_SESSION_ID,
  };
}

test("未ログイン時、<NotLogin />", async () => {
  // Arrange
  prepareSession({ isLogin: false });
  // Act
  const { type } = await Page();
  // Assert
  expect(type).toBe(NotLogin);
});

describe("ログイン時", () => {
  test("github user api呼び出し失敗時、エラー", async () => {
    // Arrange
    prepareSession({ isLogin: true });
    server.use(githubApiHandlers.user.error());
    // Act
    const pagePromise = Page();
    // Assert
    expect(pagePromise).rejects.toThrow("failed to get github user");
  });

  test("github user api成功時、<GithubUser />", async () => {
    // Arrange
    prepareSession({ isLogin: true });
    server.use(githubApiHandlers.user.success());
    // Act
    const { type } = await Page();
    // Assert
    expect(type).toBe(GithubUser);
  });
});
```

テストの参考実装については以上です。
