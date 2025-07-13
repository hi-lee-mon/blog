import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";

export default function Layout({ children }: { children: React.ReactNode }) {
	// optionsのkeyで独自のキャッシュキーを指定できる。今回特に意味がないが指定しておく。補足：emotionが生成するキーを一致させるため、RSCとCCで同一キーを使用するための設定
	return (
		<AppRouterCacheProvider options={{ key: "sandbox" }}>
			{/* マテリアルUIのデフォルトスタイルを適用 */}
			{/* <CssBaseline /> */}
			<ScopedCssBaseline>
				{/* Next.jsのテーマを適用 */}
				<ThemeProvider theme={theme}>{children}</ThemeProvider>
			</ScopedCssBaseline>
		</AppRouterCacheProvider>
	);
}
