"use client";

import { useMachine } from "@xstate/react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { assign, createMachine } from "xstate";

type CounterContext = {
  count: number;
};

export type CounterEvent =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" };

//

export const counterMachine = createMachine({
  types: {} as {
    context: CounterContext;
    events: CounterEvent;
  },
  id: "counterMachine",
  context: { count: 0 },
  // stateが1つの場合はstatesを使用しなくてもOK
  on: {
    INCREMENT: {
      actions: assign({ count: ({ context }) => context.count + 1 }),
    },
    DECREMENT: {
      actions: assign({
        count: ({ context }) => Math.max(0, context.count - 1),
      }),
    },
    RESET: {
      actions: assign({ count: 0 }),
    },
  },
});

export default function Page() {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center">
        <Counter />
      </div>
    </div>
  );
}

export const Counter = () => {
  const [state, send] = useMachine(counterMachine);

  return (
    <div className="rounded-lg bg-white p-12 shadow-2xl transition-all duration-500 ease-in-out hover:shadow-3xl">
      <div
        className={`mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-amber-200 bg-opacity-10 transition-all duration-300`}
        aria-live="polite"
      >
        <span className="font-light text-7xl text-gray-800 transition-all duration-300 ease-in-out hover:tracking-wider">
          {state.context.count}
        </span>
      </div>
      <div className="flex justify-center space-x-6">
        {[
          {
            type: "INCREMENT",
            icon: Plus,
            label: "Increment",
            color: "text-green-600",
          },
          {
            type: "DECREMENT",
            icon: Minus,
            label: "Decrement",
            color: "text-red-600",
          },
          {
            type: "RESET",
            icon: RotateCcw,
            label: "Reset",
            color: "text-blue-600",
          },
        ].map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            type="button"
            className={`rounded-full border-2 border-gray-300 p-3 ${color} transition-all duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400`}
            onClick={() => send({ type: type } as CounterEvent)}
          >
            <Icon className="h-6 w-6" aria-label={label} />
          </button>
        ))}
      </div>
    </div>
  );
};
