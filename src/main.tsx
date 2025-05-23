import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@theme";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
