/* src/pages/HomePage.tsx */
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";

const features = [
	{ title: "ユーザー一覧", desc: "ユーザー API を呼び出す", path: "/users" },
	{ title: "Ping API", desc: "サーバー疎通チェック", path: "/ping" },
];

export default function HomePage() {
	return (
		<>
			{/* Hero */}
			<section className="rounded-2xl bg-gradient-to-r from-brand to-blue-500 py-20 text-center text-white shadow-xl">
				<h1 className="text-5xl font-extrabold tracking-tight">
					Hackathon&nbsp;Starter
				</h1>
				<p className="mt-4 text-lg opacity-90">
					Tailwind × MUI × Vite × React × TS
				</p>

				<Button variant="contained" size="large" href="/users" sx={{ mt: 6 }}>
					さっそく触ってみる
				</Button>
			</section>

			{/* Features */}
			<section className="mt-20">
				<Grid container spacing={4}>
					{features.map((f) => (
						<Grid
							/* v7 では item/xs/sm/md プロップは廃止。
                 size オブジェクトでブレークポイントを指定する */
							size={{ xs: 12, sm: 6, md: 4 }}
							key={f.title}
						>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<CardHeader title={f.title} />
								<CardContent sx={{ flexGrow: 1 }}>{f.desc}</CardContent>
								<Button href={f.path}>Go</Button>
							</Card>
						</Grid>
					))}
				</Grid>
			</section>
		</>
	);
}
