import type React from "react";
import { Route, Routes } from "react-router";
import PingPage from "../pages/PingPage";
import UsersPage from "../pages/UsersPage";

const AppRoutes: React.FC = () => (
	<Routes>
		<Route path="/" element={<UsersPage />} />
		<Route path="/ping" element={<PingPage />} />
	</Routes>
);

export default AppRoutes;
