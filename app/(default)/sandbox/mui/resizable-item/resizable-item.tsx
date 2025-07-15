"use client";

import { Box, Paper, Typography } from "@mui/material";
import { Resizable } from "re-resizable";
import { useState } from "react";

export default function ResizableItem() {
  const [size, setSize] = useState({ width: 600, height: 400 });

  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Resizable
        defaultSize={size}
        minWidth={150}
        minHeight={100}
        maxWidth={800}
        maxHeight={600}
        onResize={(_e, _direction, ref, _d) => {
          setSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
        }}
        // enableを省略すると全ての方向のリサイズが許可される
        style={{
          border: "4px solid #1976d2",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            このコンテンツエリアは上下左右、および四隅のハンドルでリサイズできます。
            最小サイズ: 150x100px、最大サイズ: 800x600px
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography fontSize={40} color="primary">
              {size.width} x {size.height}
            </Typography>
          </Box>
        </Paper>
      </Resizable>
    </Box>
  );
}
