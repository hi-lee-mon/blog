import {
  assign,
  createActor,
  fromPromise,
  type SnapshotFrom,
  setup,
} from "xstate";

// typeはイベント名。states.stateName.on.イベント名
type ToggleEvent = { type: "TOGGLE" } | { type: "RESET" };

type ToggleContext = {
  count: number;
  maxCount: number;
};
type ToggleInput = {
  initialCount?: number;
  initialMaxCount?: number;
};
type ResetCountInput = { input: { maxCount: number } };

export const toggleMachine = setup({
  types: {} as {
    events: ToggleEvent;
    context: ToggleContext;
    input: ToggleInput;
  },
  // actorのsendによって呼び出される同期処理
  actions: {
    incrementCount: assign({
      count: ({ context }) => context.count + 1, // returnしたあたいでcountが更新される
    }),
  },
  // 遷移の条件分岐
  guards: {
    isLessThanMaxCount: ({ context }) => context.count < context.maxCount,
  },
  // 非同期処理
  actors: {
    resetCount: fromPromise(async ({ input }: ResetCountInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.5) {
        throw new Error("リセットエラー");
      }

      return {
        count: input.maxCount / 2,
      };
    }),
  },
}).createMachine({
  id: "toggle",
  context: ({ input }) => ({
    // inputの内容で初期化
    count: input.initialCount ?? 0,
    maxCount: input.initialMaxCount ?? 10,
  }),
  initial: "inactive", // 初期状態。statesのkeyを指定する
  states: {
    inactive: {
      on: {
        TOGGLE: {
          target: "active", // 遷移先のstateを指定
          actions: "incrementCount", // 実行するactionsを指定
          guard: "isLessThanMaxCount", // 実行するguardを指定。条件がtrueのときのみ遷移させる
        },
        RESET: {
          target: "resetting",
        },
      },
    },
    active: {
      // entry: 状態に遷移するときに実行される
      // exit: 状態から遷移するときに実行される
      // update: 状態が更新されるときに実行される
      // always: 状態が更新されるときに実行される
      // guard: 状態が更新されるときに実行される
      // conditon: 状態が更新されるときに実行される
      // target: 状態が更新されるときに実行される
      // on: イベントが発火するときに実行される
      // invoke:
      on: { TOGGLE: "inactive" },
      // active stateに来たタイミングから2秒カウント後に自動的にinactiveへ遷移する
      after: { 2000: "inactive" },
      // entry: 状態に遷移するときに実行される
      entry: [
        // 配列で定義することで上から順番に実行される
        () => {
          console.log("active状態に遷移したときに実行される");
        },
        "incrementCount",
        () => {
          console.log("active状態に遷移したときに実行される");
        },
      ],
      exit: "incrementCount", // active状態から遷移するときに実行される
    },
    resetting: {
      // 非同期処理にはinvokeを使用する
      invoke: {
        src: "resetCount", // actorsのkey名を指定
        input: ({ context: { maxCount } }) => ({ maxCount }),
        onDone: {
          target: "inactive",
          actions: assign({ count: ({ event }) => event.output.count }),
        },
        onError: {
          target: "inactive",
        },
      },
    },
  },
});

const actor = createActor(toggleMachine, {
  // inputを設定することでContextの初期値を外から操作できるようになる
  input: {
    initialCount: 10,
    initialMaxCount: 11,
  },
});

// stateの変化を監視して処理を発火させる仕組み
actor.subscribe({
  next: (snapshot: SnapshotFrom<typeof actor>) => {
    // stateが変化するたびに現在のstateを取得
    if (snapshot.matches("active")) {
      console.log("active に遷移しました");
    }
    // contextにアクセス
    console.log(snapshot.context.count);
  },
});

// actorの実行
actor.start();
actor.send({ type: "TOGGLE" }); // 現在のstateが持つTOGGLEイベントを発火させる
actor.stop();
