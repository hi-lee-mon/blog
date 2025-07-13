"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	typography: {
		// Next.jsのフォントを使用するために下記の設定が必要 https://mui.com/material-ui/integrations/nextjs/#font-optimization
		fontFamily: "var(--font-m-plus-rounded-1c)",
	},
});

export default theme;
