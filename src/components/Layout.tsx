import type { FC } from "react";
import { NavLink, Outlet } from "react-router";

const Layout: FC = () => (
	<div>
		<nav style={{ padding: "1rem", background: "#1a1a1a" }}>
			<NavLink to="/" end style={{ marginRight: "1rem", color: "#fff" }}>
				Users
			</NavLink>
			<NavLink to="/ping" style={{ color: "#fff" }}>
				Ping
			</NavLink>
		</nav>

		<main style={{ padding: "1rem" }}>
			{/* 子ルートを書き換える場所 */}
			<Outlet />
		</main>
	</div>
);

export default Layout;
