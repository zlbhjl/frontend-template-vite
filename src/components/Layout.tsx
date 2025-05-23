import { AppBar, Button, Container, Toolbar } from "@mui/material";
import type { FC } from "react";
import { Link, Outlet } from "react-router";

const Layout: FC = () => (
	<>
		{/* Top Navigation */}
		<AppBar position="static" color="primary">
			<Toolbar variant="dense">
				{/* `component={Link}` で react-router のリンクに変換 */}
				<Button component={Link} to="/" color="inherit">
					Home
				</Button>
				<Button component={Link} to="/users" color="inherit">
					Users
				</Button>
				<Button component={Link} to="/ping" color="inherit">
					Ping
				</Button>
			</Toolbar>
		</AppBar>

		{/* Main content */}
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Outlet />
		</Container>
	</>
);

export default Layout;
