"use client"; // エラーバウンダリはクライアントコンポーネントである必要があります

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをエラー報告サービスにログ記録する
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
