"use client";

import { useCallback, useState } from "react";

export const useTableSelection = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [radioSelected, setRadioSelected] = useState<number | null>(null);

  // チェックボックス選択処理
  const handleSelectAll = useCallback((checked: boolean, allIds: number[]) => {
    if (checked) {
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setSelected((prev) => {
      const selectedIndex = prev.indexOf(id);
      if (selectedIndex === -1) {
        return [...prev, id];
      } else {
        return prev.filter((selectedId) => selectedId !== id);
      }
    });
  }, []);

  // ラジオボタン選択処理
  const handleRadioSelect = useCallback((id: number) => {
    setRadioSelected(id);
  }, []);

  // 選択状態チェック
  const isSelected = useCallback(
    (id: number) => selected.indexOf(id) !== -1,
    [selected],
  );

  // 選択クリア
  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const clearRadioSelection = useCallback(() => {
    setRadioSelected(null);
  }, []);

  return {
    selected,
    radioSelected,
    handleSelectAll,
    toggleSelection,
    handleRadioSelect,
    isSelected,
    clearSelection,
    clearRadioSelection,
  };
};
