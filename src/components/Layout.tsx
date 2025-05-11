import type React from "react";
import { Link } from "react-router";

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => (
	<div>
		<nav style={{ padding: "1rem", background: "#1a1a1a" }}>
			<Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>
				Users
			</Link>
			<Link to="/ping" style={{ color: "#fff" }}>
				Ping
			</Link>
		</nav>
		<main style={{ padding: "1rem" }}>{children}</main>
	</div>
);

export default Layout;
