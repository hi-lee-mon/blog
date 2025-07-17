import { Card, CardContent, Grid } from "@mui/material";
import Spacer from "@/components/shared/spacer";

const Item = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card sx={{ border: "1px solid" }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

// 幅を狭めた時にカードの数が変化する
export default function Page() {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid size="auto">
          <Item>自分の幅で長さが決まりまっせ〜(size=auto)</Item>
        </Grid>
        <Grid size={4}>
          <Item>私は指定されたサイズ固定です(size=4)</Item>
        </Grid>
        <Grid size="grow">
          <Item>残ったスペースいっぱいに広がりますよ(size=grow)</Item>
        </Grid>
      </Grid>
      <Spacer className="h-30" />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {[1, 2, 3, 4, 5, 6].map((e) => (
          <Grid key={e} size={4}>
            <Item>{e + 1}</Item>
          </Grid>
        ))}
      </Grid>
      <Spacer className="h-30" />
      {/* 幅を狭めた時にカードが折り返す */}
      {/* TODO: 折り返した時に、折り返したアイテムが中央寄せになってしまうのをどうにかできるか確認する */}
      <Grid container spacing={3} wrap="wrap" justifyContent="center">
        {[1, 2, 3, 4].map((e) => (
          <Grid key={e} size={3} minWidth={200} flexGrow={1}>
            <Item>{e + 1}</Item>
          </Grid>
        ))}
      </Grid>
      <Spacer className="h-30" />
    </div>
  );
}
