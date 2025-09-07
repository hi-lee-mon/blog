"use client";

import { useMachine } from "@xstate/react";
import { Circle, X } from "lucide-react";
import { assign, type EventObject, setup } from "xstate";

export default function Page() {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center">
        <TicTacToe />
      </div>
    </div>
  );
}

function assertEvent<TEvent extends EventObject, Type extends TEvent["type"]>(
  ev: TEvent,
  type: Type,
): asserts ev is Extract<TEvent, { type: Type }> {
  if (ev.type !== type) {
    throw new Error("Unexpected event type.");
  }
}

type Player = "x" | "o";

const context = {
  board: Array(9).fill(null) as Array<Player | null>,
  moves: 0,
  player: "x" as Player,
  winner: undefined as Player | undefined,
};

type TicTacToeEvent = { type: "PLAY"; value: number } | { type: "RESET" };
export const ticTacToeMachine = setup({
  types: {} as {
    context: typeof context;
    events: TicTacToeEvent;
  },
  actions: {
    updateBoard: assign({
      board: ({ context, event }) => {
        assertEvent(event, "PLAY");
        const updatedBoard = [...context.board];
        updatedBoard[event.value] = context.player;
        return updatedBoard;
      },
      moves: ({ context }) => context.moves + 1,
      player: ({ context }) => (context.player === "x" ? "o" : "x"),
    }),
    resetGame: assign(context),
    setWinner: assign({
      winner: ({ context }) => (context.player === "x" ? "o" : "x"),
    }),
  },
  guards: {
    checkWin: ({ context }) => {
      const { board } = context;
      const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (const line of winningLines) {
        const xWon = line.every((index) => {
          return board[index] === "x";
        });

        if (xWon) {
          return true;
        }

        const oWon = line.every((index) => {
          return board[index] === "o";
        });

        if (oWon) {
          return true;
        }
      }

      return false;
    },
    checkDraw: ({ context }) => {
      return context.moves === 9;
    },
    isValidMove: ({ context, event }) => {
      if (event.type !== "PLAY") {
        return false; // PLAYイベント以外はバリデーションを通さない
      }

      // すでに埋まっているマスには置けない(nullの場合のみ置ける)
      return context.board[event.value] === null;
    },
  },
}).createMachine({
  initial: "playing", // 初期状態
  context, // 初期コンテキスト
  states: {
    playing: {
      // playing状態がtargetされるたびに常に実行される
      always: [
        // guardのcheckWinがtrueならgemeOver.winner状態へ移動
        { guard: "checkWin", target: "gameOver.winner" },
        { guard: "checkDraw", target: "gameOver.draw" },
      ],
      on: {
        // guard -> trueならactionとtargetを実行したのち、playing状態に遷移して再度alwaysを評価する。falseならactionとtargetは実行されず、状態も遷移しない
        PLAY: [
          {
            guard: "isValidMove", // guard処理
            actions: "updateBoard", // guardがtrueを返したら、actionを実行してtargetを実行する
            target: "playing", // guardがtrueを返したら、playing状態に遷移
          },
        ],
      },
    },
    gameOver: {
      initial: "winner",
      states: {
        winner: {
          tags: "winner",
          entry: "setWinner",
        },
        draw: {
          tags: "draw",
        },
      },
      on: {
        RESET: {
          target: "playing",
          actions: "resetGame",
        },
      },
    },
  },
});

export const TicTacToe = () => {
  const [state, send] = useMachine(ticTacToeMachine);
  // 状態
  const { board, player, winner } = state.context;

  const handleCellClick = (index: number) => {
    send({ type: "PLAY", value: index });
  };

  const resetGame = () => {
    send({ type: "RESET" });
  };

  const renderCell = (value: string | null, index: number) => {
    return (
      <button
        type="button"
        key={index}
        className="flex h-24 w-24 transform items-center justify-center border-2 border-gray-200 text-4xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-50"
        onClick={() => handleCellClick(index)}
        disabled={!!value || state.hasTag("winner") || state.hasTag("draw")}
      >
        {value === "x" && <X className="h-16 w-16 text-blue-600" />}
        {value === "o" && <Circle className="h-16 w-16 text-red-600" />}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div className="w-auto rounded-2xl border border-gray-100 p-8 shadow-2xl">
        <h1 className="mb-8 text-center font-extrabold text-4xl tracking-tight">
          ○×ゲーム
        </h1>
        <div className="mb-8 grid grid-cols-3 gap-4">
          {board.map((cell, index) => renderCell(cell, index))}
        </div>
        <div className="text-center">
          {state.hasTag("winner") && (
            <p
              className="mb-6 animate-pulse font-bold text-2xl"
              style={{ color: winner === "x" ? "#2563EB" : "#DC2626" }}
            >
              プレイヤー {winner === "x" ? "✗" : "○"} の勝利です！
            </p>
          )}
          {state.hasTag("draw") && (
            <p className="mb-6 animate-pulse font-bold text-2xl text-gray-600">
              引き分けです！
            </p>
          )}
          {!state.hasTag("winner") && !state.hasTag("draw") && (
            <p className="mb-6 font-semibold text-2xl">
              現在のプレイヤー:{" "}
              <span style={{ color: player === "x" ? "#2563EB" : "#DC2626" }}>
                {player === "x" ? "✗" : "○"}
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={resetGame}
            className="transform rounded-full bg-gradient-to-r from-blue-500 to-red-500 px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ゲームをリセット
          </button>
        </div>
      </div>
    </div>
  );
};
