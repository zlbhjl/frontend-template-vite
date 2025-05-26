import AppRoutes from "@routes/index";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@styles/global.css";

/** ルーターを生成して Provider でアプリに挿入 */
const router = createBrowserRouter([
	{
		path: "/*",
		element: <AppRoutes />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
