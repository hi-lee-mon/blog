"use client";

import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Box, Fade, Paper, type PaperProps } from "@mui/material";
import { Resizable } from "re-resizable";
import { Fragment, type ReactNode, useState } from "react";

type Props = {
  // 初期表示のダイアログ表示状態
  defaultOpen?: boolean;
  // ダイアログの初期表示位置
  defaultPosition: {
    x: number;
    y: number;
  };
  // ダイアログの初期サイズ
  defaultSize: { width: number; height: number };
  // ダイアログの最小幅
  minWidth?: number;
  // ダイアログの最小高
  minHeight?: number;
  // ダイアログの最大幅
  maxWidth?: number;
  // ダイアログの最大高
  maxHeight?: number;
  // ダイアログの影の深さ
  elevation?: PaperProps["elevation"];
  // ダイアログに適用するスタイル
  paperSx?: PaperProps["sx"];
  // 閉じる時に現在位置を保持するかどうか
  keepPositionOnClose?: boolean;
  // 閉じる時に現在サイズを保持するかどうか
  keepSizeOnClose?: boolean;
  // ダイアログのz-index値
  zIndex?: number;
  // ダイアログの内容を定義する関数（close関数を受け取る）
  children: (close: () => void) => ReactNode;
  // ダイアログを開くためのトリガー要素を定義する関数
  trigger: (openDialog: () => void) => ReactNode;
};

export default function DraggableResizableItem({
  defaultOpen = false,
  defaultPosition,
  defaultSize,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  elevation = 2,
  paperSx = [],
  keepPositionOnClose = false,
  keepSizeOnClose = false,
  zIndex = 1300,
  children,
  trigger,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [size, setSize] = useState(defaultSize);
  const [position, setPosition] = useState(defaultPosition);
  const [isResizing, setIsResizing] = useState(false);
  // 指定px以上の移動がない場合ドラッグしていないと判定する。これによりクリックとドラッグを識別できるようになりダイアログ上のボタンが押下できるようになる
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
  );
  // 画面外への移動を禁止する
  const modifiers = [restrictToWindowEdges];

  const handleDragEnd = (event: DragEndEvent) => {
    // リサイズ中はドラッグ中止
    if (isResizing) return;
    setPosition((prev) => ({
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  return (
    <Fragment>
      {trigger(() => {
        setIsOpen(true);
        if (!keepPositionOnClose) {
          // 開くときに必ず元の位置に戻す
          setPosition(defaultPosition);
        }
        if (!keepSizeOnClose) {
          // サイズを必ず元の位置に戻す
          setSize(defaultSize);
        }
      })}
      {/* Fadeコンポーネントによるアニメーションを適用するための設定。閉じた際はダイアログに対しての全ての操作、tabフォーカス、aria機能を無効にする */}
      <Box
        sx={{
          pointerEvents: isOpen ? "all" : "none",
        }}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
      >
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          modifiers={modifiers}
        >
          <Draggable
            position={position}
            isDragDisabled={isResizing}
            zIndex={zIndex}
          >
            <Resizable
              size={size}
              minWidth={minWidth}
              minHeight={minHeight}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              onResize={(_e, direction, ref) => {
                const newWidth = parseInt(ref.style.width, 10);
                const newHeight = parseInt(ref.style.height, 10);

                setSize({
                  width: newWidth,
                  height: newHeight,
                });

                if (direction === "top") {
                  setPosition((prev) => ({
                    ...prev,
                    y: prev.y - (newHeight - size.height),
                  }));
                }
                if (direction === "left") {
                  setPosition((prev) => ({
                    ...prev,
                    x: prev.x - (newWidth - size.width),
                  }));
                }
                if (direction === "topLeft") {
                  setPosition((prev) => ({
                    x: prev.x - (newWidth - size.width),
                    y: prev.y - (newHeight - size.height),
                  }));
                }
                if (direction === "topRight") {
                  setPosition((prev) => ({
                    ...prev,
                    y: prev.y - (newHeight - size.height),
                  }));
                }
                if (direction === "bottomLeft") {
                  setPosition((prev) => ({
                    ...prev,
                    x: prev.x - (newWidth - size.width),
                  }));
                }
              }}
              onResizeStart={() => {
                setIsResizing(true);
              }}
              onResizeStop={() => {
                setIsResizing(false);
              }}
            >
              <Fade in={isOpen}>
                {/* ダイアログの見た目部分 */}
                <Paper
                  role="dialog"
                  // NOTE:sxのマージ方法は公式ドキュメントを参照(https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop)
                  sx={[
                    {
                      width: "100%",
                      height: "100%",
                      borderRadius: "16px",
                    },
                    ...(Array.isArray(paperSx) ? paperSx : [paperSx]),
                  ]}
                  elevation={elevation}
                >
                  {children(() => setIsOpen(false))}
                </Paper>
              </Fade>
            </Resizable>
          </Draggable>
        </DndContext>
      </Box>
    </Fragment>
  );
}

const Draggable = ({
  children,
  position,
  isDragDisabled,
  zIndex,
}: {
  children: React.ReactNode;
  position: { x: number; y: number };
  isDragDisabled: boolean;
  zIndex: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  return (
    <Box
      onMouseDown={() => {
        setIsDragging(true);
      }}
      onMouseUp={() => {
        setIsDragging(false);
      }}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex,
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        // リサイズ中はドラッグ中のスタイルを削除することでドラッグしていないように見せる
        transform: isDragDisabled
          ? undefined
          : transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
      }}
    >
      {children}
    </Box>
  );
};
