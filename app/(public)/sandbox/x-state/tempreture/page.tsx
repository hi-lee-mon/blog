"use client";

import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";

interface TemperatureContext {
  tempC?: number | string;
  tempF?: number | string;
}

type TemperatureEvent =
  | {
      type: "CELSIUS";
      value: string;
    }
  | {
      type: "FAHRENHEIT";
      value: string;
    };

export const temperatureMachine = createMachine({
  types: {} as {
    context: TemperatureContext;
    events: TemperatureEvent;
  },
  context: { tempC: undefined, tempF: undefined },
  on: {
    CELSIUS: {
      actions: assign({
        // actionsが呼ばれるとtempC状態を更新する
        tempC: ({ event }) => event.value,
        // actionsが呼ばれるとtempC状態を更新する
        tempF: ({ event }) =>
          event.value.length ? +event.value * (9 / 5) + 32 : "",
      }),
    },
    FAHRENHEIT: {
      actions: assign({
        tempC: ({ event }) =>
          event.value.length ? (+event.value - 32) * (5 / 9) : "",
        tempF: ({ event }) => event.value,
      }),
    },
  },
});

export default function Page() {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center">
        <TemperatureConverter />
      </div>
    </div>
  );
}

export const TemperatureConverter = () => {
  const [state, send] = useMachine(temperatureMachine);

  const handleCelsiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: "CELSIUS", value: e.target.value });
  };

  const handleFahrenheitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: "FAHRENHEIT", value: e.target.value });
  };

  return (
    <div className="mx-auto max-w-sm rounded-lg p-6 shadow-md">
      <h2 className="mb-6 text-center font-bold text-2xl">温度変換器</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="celsius" className="mb-1 block font-medium text-sm">
            摂氏 (°C)
          </label>
          <input
            id="celsius"
            type="number"
            value={state.context.tempC ?? ""}
            onChange={handleCelsiusChange}
            placeholder="摂氏を入力"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="fahrenheit"
            className="mb-1 block font-medium text-sm"
          >
            華氏 (°F)
          </label>
          <input
            id="fahrenheit"
            type="number"
            value={state.context.tempF ?? ""}
            onChange={handleFahrenheitChange}
            placeholder="華氏を入力"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
