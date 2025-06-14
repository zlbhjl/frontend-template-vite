import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 必要なら自作またはUIライブラリから追加

export default function HomePage() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		// 簡易的な認証チェック（必要なら実際のAPIなどと連携可能）
		if (username === "admin" && password === "password") {
			setIsLoggedIn(true);
		} else {
			alert("ユーザー名またはパスワードが間違っています。");
		}
	};

	const handleSelect = (id: string) => {
		navigate(`/building/${id}`);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			{!isLoggedIn ? (
				<>
					<h1 className="text-2xl font-semibold">ログインしてください</h1>
					<div className="flex flex-col gap-4 w-80">
						<Input
							type="text"
							placeholder="ユーザー名"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="パスワード"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={handleLogin}>ログイン</Button>
					</div>
				</>
			) : (
				<>
					<h1 className="text-3xl font-bold">学生寮 棟を選択してください</h1>
					<div className="flex gap-4">
						<Button onClick={() => handleSelect("a")}>A棟</Button>
						<Button onClick={() => handleSelect("b")}>B棟</Button>
						<Button onClick={() => handleSelect("c")}>C棟</Button>
					</div>
				</>
			)}
		</div>
	);
}





