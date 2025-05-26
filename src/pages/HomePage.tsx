import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const features = [
	{ title: "ユーザー一覧", desc: "ユーザー API を呼び出す", path: "/users" },
	{ title: "Ping API", desc: "サーバー疎通チェック", path: "/ping" },
];

export default function HomePage() {
	return (
		<div>
			{/* ヒーロー部：プレーンテキスト */}
			<section className="rounded-2xl bg-gradient-to-r py-20 text-center">
				<h1 className="text-5xl font-extrabold tracking-tight">
					Hackathon&nbsp;Starter
				</h1>
				<p className="mt-4 text-lg opacity-90">
					Vite × React × TS × Tailwind × Shadcn/ui
				</p>
			</section>

			{/* カード群：中央３カラム配置 */}
			<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{features.map((f) => (
					<Card key={f.title} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle>{f.title}</CardTitle>
							<CardDescription>{f.desc}</CardDescription>
						</CardHeader>
						<CardContent className="mt-auto">
							<Button asChild variant="outline" className="w-full">
								<a
									href={f.path}
									className="flex items-center justify-center gap-1"
								>
									Go <ArrowRight className="size-4" />
								</a>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
