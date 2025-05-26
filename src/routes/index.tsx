import Layout from "@components/Layout";
import HomePage from "@pages/HomePage";
import PingPage from "@pages/PingPage";
import UsersPage from "@pages/UsersPage";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
	return (
		<Routes>
			{/* すべてのページを共通レイアウトでラップ */}
			<Route element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="users" element={<UsersPage />} />
				<Route path="ping" element={<PingPage />} />
				{/* 万一の 404 は Home にリダイレクト */}
				<Route path="*" element={<HomePage />} />
			</Route>
		</Routes>
	);
}
