import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuildingPage from "./pages/BuildingPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/building/:buildingId" element={<BuildingPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

