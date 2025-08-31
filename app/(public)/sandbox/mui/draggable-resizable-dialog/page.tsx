"use client";
import { Button, Typography } from "@mui/material";
import dynamic from "next/dynamic";

// windowオブジェクトがないとエラーが出るため、ssr: false を設定
const DraggableResizableDialog = dynamic(
  () => import("./draggable-resizable-dialog"),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <DraggableResizableDialog
      defaultPosition={{ x: 200, y: 200 }}
      defaultSize={{ width: 300, height: 200 }}
      minWidth={200}
      minHeight={100}
      maxWidth={600}
      maxHeight={400}
      trigger={(open) => (
        <Button variant="contained" onClick={open}>
          ダイアログを開く
        </Button>
      )}
    >
      {(close) => (
        <div className="p-4">
          <Typography variant="h6">ダイアログの内容</Typography>
          <Button variant="outlined" onClick={close}>
            ダイアログを閉じる
          </Button>
        </div>
      )}
    </DraggableResizableDialog>
  );
}
