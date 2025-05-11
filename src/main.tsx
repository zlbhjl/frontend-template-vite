import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// root 要素を取得
const container = document.getElementById("root");

// nullチェック
if (!container) {
	throw new Error("Root container element not found");
}

const root = ReactDOM.createRoot(container);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
