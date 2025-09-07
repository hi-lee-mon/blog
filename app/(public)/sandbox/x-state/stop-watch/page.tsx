"use client";
import { useActor } from "@xstate/react";
import { assign, fromCallback, setup } from "xstate";

type StopwatchContext = {
  elapsed: number;
};

type StopwatchEvent =
  | { type: "START" }
  | { type: "STOP" }
  | { type: "RESET" }
  | { type: "TICK" };

export const stopwatchMachine = setup({
  types: {} as {
    context: StopwatchContext;
    events: StopwatchEvent;
  },
  actors: {
    // ステートマシンの外で実行される独立した処理単位をアクターと呼びます
    ticks: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        // 0.1秒ごとにカウントアップする
        sendBack({ type: "TICK" });
      }, 10);
      return () => clearInterval(interval);
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsAOB3AhigxgBYDEASgKIDK5AKgNoAMAuoqBmrAJYqdoB2rEAA9EAFgBMAGhABPRAEYA7OIB080QGZx4gJzyAbIaM6AviempMuAoRWWMGSMUo0AgqXrNB7Lj36CRBHFlFX1FeQAORQBWaTkghlUdaI15cWizC3RsPCIVACcAVz4+Tj4oYhoASQBhAGlGFiQQH25eAWbA0Xl5FVEdcUiYuMQI3ozzEHtrPKKSsoqXAHkABUbvDjb-TsRxMZUGfXSRhHlo1VEUtInJvjQIOEFp3MIN33aAxABafROfzKm2Rmtnsjggby2HVAgTOGlCDB0GmGsgUyRUGn0OkUeiMuNMk2eNgKxVK5QhfihwkQGgiohUsRRpwiFyu6TMZiAA */
  id: "stopwatch",
  initial: "stopped",
  context: {
    elapsed: 0,
  },
  states: {
    stopped: {
      on: {
        START: "running",
      },
    },
    running: {
      invoke: {
        // actorsのkey名を指定することで非同期として処理を呼び出す
        src: "ticks",
      },
      on: {
        TICK: {
          actions: assign({
            elapsed: ({ context }) => context.elapsed + 1,
          }),
        },
        STOP: "stopped",
      },
    },
  },
  on: {
    RESET: {
      actions: assign({
        elapsed: 0,
      }),
      target: ".stopped",
    },
  },
});

export default function Page() {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center">
        <Stopwatch />
      </div>
    </div>
  );
}

export const Stopwatch = () => {
  const [state, send] = useActor(stopwatchMachine);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-gray-800">
      <div className="mb-8 flex h-64 w-64 items-center justify-center rounded-full bg-gray-100 shadow-lg md:h-80 md:w-80">
        <div className="font-bold font-mono text-4xl text-gray-700 tabular-nums md:text-5xl">
          {formatTime(state.context.elapsed)}
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() =>
            send({ type: state.matches("running") ? "STOP" : "START" })
          }
          className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label={state.matches("running") ? "Stop" : "Start"}
        >
          {state.matches("running") ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => send({ type: "RESET" })}
          className="rounded-full bg-gray-200 px-6 py-2 font-bold text-gray-700 transition duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          aria-label="Reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
