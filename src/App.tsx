import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import Kanban from "./pages/Kanban";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App()
{
	const router = createBrowserRouter([
		{
			index: true,
			Component: Home // aka Boards
		},
		{
			path: "kanban/:boardId",
			Component: Kanban
		},
		{
			path: "settings",
			Component: SettingsPage
		},
		{
			path: "*",
			Component: NotFound
		}
	]);

	return <RouterProvider router={router}/>;
}

export default App;