"use client";

import { DndContext, type DragEndEvent, useDraggable } from "@dnd-kit/core";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

function Draggable({
  children,
  position,
}: {
  children: React.ReactNode;
  position: { x: number; y: number };
}) {
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
        zIndex: 1300,
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {children}
    </Box>
  );
}

export default function DraggableItem() {
  const [position, setPosition] = useState(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return { x: (w - 100) / 2, y: (h - 100) / 2 };
  });
  const handleDragEnd = (event: DragEndEvent) => {
    setPosition((prev) => ({
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  return (
    <Box>
      <Typography color="text.secondary">
        dnd kitで実装 ドラッグ可能なアイテム
      </Typography>
      <DndContext onDragEnd={handleDragEnd}>
        <Draggable position={position}>
          <Box
            width={100}
            height={100}
            borderRadius={100}
            bgcolor="skyblue"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Drag me!
          </Box>
        </Draggable>
      </DndContext>
    </Box>
  );
}
