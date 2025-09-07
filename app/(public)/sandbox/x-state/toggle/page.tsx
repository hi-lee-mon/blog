"use client";

import { useMachine } from "@xstate/react";
import { Power } from "lucide-react";
import { setup } from "xstate";

export type ToggleEvent = { type: "TOGGLE" };

// sleep関数の実装


export const toggleMachine = setup({
  types: {} as {
    // TypeScript対応
    events: ToggleEvent;
  },
}).createMachine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: { target: "active" } },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
});

export default function Page() {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center">
        <ToggleButton />
      </div>
    </div>
  );
}

export const ToggleButton = () => {
  const [state, send] = useMachine(toggleMachine);
  /// 現在の状態を取得
  const isActive = state.matches("active");
  return (
    <>
      <button
        type="button"
        onClick={() => send({ type: "TOGGLE" })}
        className={`h-16 w-32 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          isActive ? "bg-green-500" : "bg-gray-300"
        }`}
        aria-label={isActive ? "Turn off" : "Turn on"}
      >
        <div
          className={`flex h-14 w-14 transform items-center justify-center rounded-full transition-transform duration-300 ease-in-out ${
            isActive ? "translate-x-16 bg-white" : "translate-x-0 bg-gray-100"
          }`}
        >
          <Power
            className={`h-8 w-8 ${isActive ? "text-green-500" : "text-gray-400"}`}
          />
        </div>
      </button>
      <span className="mt-4 font-bold text-2xl text-gray-700 dark:text-gray-200">
        {isActive ? "ON" : "OFF"}
      </span>
      <span className="sr-only">
        {isActive ? "The switch is on" : "The switch is off"}
      </span>
    </>
  );
};
