import type React from "react";
import { BrowserRouter } from "react-router";
import Routes from "./routes";
import "./styles/global.css";

const App: React.FC = () => (
	<BrowserRouter>
		<Routes />
	</BrowserRouter>
);

export default App;
