import Layout from "@components/Layout";
import PingPage from "@pages/PingPage";
import UsersPage from "@pages/UsersPage";
import type { FC } from "react";
import { Route, Routes } from "react-router";

const AppRoutes: FC = () => (
	<Routes>
		{/* すべてのページを Layout でラップ */}
		<Route element={<Layout />}>
			<Route index element={<UsersPage />} />
			<Route path="ping" element={<PingPage />} />
		</Route>
	</Routes>
);

export default AppRoutes;
