"use client";

import { useMachine } from "@xstate/react";
import { useState } from "react";
import { assign, setup } from "xstate";

export default function Page() {
  return <Todos />;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export type TodosFilter = "all" | "active" | "completed";

type TodosContext = {
  todo: string;
  todos: TodoItem[];
  filter: TodosFilter;
};

type TodosEvent =
  | { type: "newTodo.change"; value: string }
  | { type: "newTodo.commit"; value: string }
  | { type: "todo.commit"; todo: TodoItem }
  | { type: "todo.delete"; id: string }
  | { type: "filter.change"; filter: TodosFilter }
  | { type: "todo.mark"; id: string; mark: "active" | "completed" }
  | { type: "todo.markAll"; mark: "active" | "completed" }
  | { type: "todos.clearCompleted" };

export const todosMachine = setup({
  types: {} as {
    context: TodosContext;
    events: TodosEvent;
  },
}).createMachine({
  id: "todos",
  context: {
    todo: "",
    todos: [
      {
        id: "1",
        title: "Learn state machines",
        completed: false,
      },
    ],
    filter: "all",
  },
  on: {
    "newTodo.change": {
      actions: assign({
        todo: ({ event }) => event.value,
      }),
    },
    "newTodo.commit": {
      guard: ({ event }) => event.value.trim().length > 0,
      actions: assign({
        todo: "",
        todos: ({ context, event }) => {
          const newTodo: TodoItem = {
            id: Math.random().toString(36).substring(7),
            title: event.value,
            completed: false,
          };

          return [...context.todos, newTodo];
        },
      }),
    },
    "todo.commit": {
      actions: assign({
        todos: ({ context, event }) => {
          // event.todoがテキストフィールドに入力されているtodo
          const { todo: todoToUpdate } = event;

          if (!todoToUpdate.title.trim().length) {
            return context.todos.filter((todo) => todo.id !== todoToUpdate.id);
          }

          return context.todos.map((todo) => {
            if (todo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return todo;
          });
        },
      }),
    },
    "todo.delete": {
      actions: assign({
        todos: ({ context, event }) => {
          const { id } = event;

          return context.todos.filter((todo) => todo.id !== id);
        },
      }),
    },
    "filter.change": {
      actions: assign({
        filter: ({ event }) => event.filter,
      }),
    },
    "todo.mark": {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            if (todo.id === event.id) {
              return {
                ...todo,
                completed: mark === "completed",
              };
            }

            return todo;
          });
        },
      }),
    },
    "todo.markAll": {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            return {
              ...todo,
              completed: mark === "completed",
            };
          });
        },
      }),
    },
    "todos.clearCompleted": {
      actions: assign({
        todos: ({ context }) => {
          return context.todos.filter((todo) => !todo.completed);
        },
      }),
    },
  },
});

export const Todos = () => {
  const [state, send] = useMachine(todosMachine);
  const { todos, todo, filter } = state.context;

  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTodos = todos.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="flex min-h-screen justify-center p-4">
      <div className="w-full max-w-md rounded-lg p-6 shadow-md">
        <h1 className="mb-6 text-center font-bold text-3xl">Todo App</h1>
        <input
          type="text"
          value={todo}
          onChange={(e) =>
            // todoはテキストフィールドのvalueに渡す状態
            send({ type: "newTodo.change", value: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Enterキーでtodosにtodoを追加する
              send({ type: "newTodo.commit", value: todo });
            }
          }}
          placeholder="What needs to be done?"
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New todo input"
        />
        <ul className="mb-4" aria-label="Todo list">
          {filteredTodos.map((item) => (
            <li
              key={item.id}
              className="mb-3 flex items-center rounded-md border-2 p-2 transition-colors duration-200 hover:bg-foreground/5"
            >
              <div className="flex min-w-0 flex-grow items-center">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() =>
                    send({
                      type: "todo.mark",
                      id: item.id,
                      mark: item.completed ? "active" : "completed",
                    })
                  }
                  className="mr-3 h-5 w-5 flex-shrink-0 text-blue-600"
                  aria-label={`Mark "${item.title}" as ${item.completed ? "active" : "completed"}`}
                />
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      send({
                        type: "todo.commit",
                        todo: { ...item, title: e.target.value },
                      })
                    }
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingId(null);
                      }
                    }}
                    className="w-full rounded-md border px-2 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Edit todo "${item.title}"`}
                  />
                ) : (
                  <button
                    type="button"
                    onDoubleClick={() => setEditingId(item.id)}
                    className={`truncate text-lg ${
                      item.completed
                        ? "text-gray-500 line-through"
                        : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => send({ type: "todo.delete", id: item.id })}
                className="ml-2 flex-shrink-0 font-bold text-red-500 text-xl hover:text-red-700"
                aria-label={`Delete todo "${item.title}"`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between text-gray-600 text-sm">
          <span className="mb-2 sm:mb-0">{activeTodos.length} items left</span>
          <div className="mb-2 flex space-x-2 sm:mb-0">
            <button
              type="button"
              onClick={() => send({ type: "filter.change", filter: "all" })}
              className={`rounded-md px-3 py-1 ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "all"}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => send({ type: "filter.change", filter: "active" })}
              className={`rounded-md px-3 py-1 ${
                filter === "active"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "active"}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() =>
                send({ type: "filter.change", filter: "completed" })
              }
              className={`rounded-md px-3 py-1 ${
                filter === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "completed"}
            >
              Completed
            </button>
          </div>
          {completedTodos.length > 0 && (
            <button
              type="button"
              onClick={() => send({ type: "todos.clearCompleted" })}
              className="rounded-md bg-red-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-red-600"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
