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

// export default function DraggableDialog() {
// 	const [open, setOpen] = useState(false);
// 	const [position, setPosition] = useState({ x: 100, y: 100 });
// 	const [size, setSize] = useState({ width: 400, height: 300 });

// 	// dnd-kitのドラッグ設定
// 	const { attributes, listeners, setNodeRef, transform } = useDraggable({
// 		id: "draggable-dialog",
// 	});

// 	const handleDragEnd = useCallback(
// 		(event: { delta?: { x: number; y: number } }) => {
// 			if (event && event.delta) {
// 				setPosition((prev) => ({
// 					x: prev.x + event.delta!.x,
// 					y: prev.y + event.delta!.y,
// 				}));
// 			}
// 		},
// 		[],
// 	);

// 	const handleResizeStop: ResizeCallback = (e, direction, ref, d) => {
// 		setSize((prev) => ({
// 			width: prev.width + d.width,
// 			height: prev.height + d.height,
// 		}));
// 	};

// 	const style: React.CSSProperties = {
// 		position: "fixed",
// 		left: position.x,
// 		top: position.y,
// 		zIndex: 1300,
// 		transform: transform
// 			? `translate(${transform.x}px, ${transform.y}px)`
// 			: undefined,
// 	};

// 	return (
// 		<div>
// 			<Button variant="contained" onClick={() => setOpen(true)}>
// 				ダイアログを開く
// 			</Button>
// 			<DndContext onDragEnd={handleDragEnd}>
// 				{open && (
// 					<div style={style}>
// 						<Resizable
// 							size={size}
// 							minWidth={240}
// 							minHeight={120}
// 							maxWidth={800}
// 							maxHeight={600}
// 							onResizeStop={handleResizeStop}
// 							style={{
// 								background: "white",
// 								borderRadius: 8,
// 								boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
// 								overflow: "hidden",
// 								display: "flex",
// 								flexDirection: "column",
// 							}}
// 						>
// 							<Paper
// 								elevation={0}
// 								style={{
// 									width: "100%",
// 									height: "100%",
// 									display: "flex",
// 									flexDirection: "column",
// 								}}
// 							>
// 								<div
// 									ref={setNodeRef}
// 									{...listeners}
// 									{...attributes}
// 									style={{
// 										cursor: "move",
// 										userSelect: "none",
// 										padding: "16px",
// 										background: "#f5f5f5",
// 										fontWeight: "bold",
// 									}}
// 								>
// 									ドラッグ&リサイズ可能なダイアログ
// 								</div>
// 								<div style={{ flex: 1, padding: "16px" }}>
// 									ここに任意の内容を配置できます。
// 								</div>
// 								<Button
// 									onClick={() => setOpen(false)}
// 									sx={{ m: 2, alignSelf: "flex-end" }}
// 								>
// 									閉じる
// 								</Button>
// 							</Paper>
// 						</Resizable>
// 					</div>
// 				)}
// 			</DndContext>
// 		</div>
// 	);
// }
