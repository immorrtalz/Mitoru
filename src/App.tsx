import { createHashRouter, Outlet, RouterProvider } from "react-router";
import { TopBar } from "./components/TopBar";

function App()
{
	const router = createHashRouter([
		{
			Component: () =>
				<>
					<TopBar/>
					<Outlet/>
				</>,
			children: [
				{
					index: true,
					lazy: () => import("./pages/Home").then(imported => ({ Component: imported.default })) // aka Boards
				},
				{
					path: "kanban/:boardId",
					lazy: () => import("./pages/Kanban").then(imported => ({ Component: imported.default }))
				},
				{
					path: "settings",
					lazy: () => import("./pages/Settings").then(imported => ({ Component: imported.default }))
				},
				{
					path: "*",
					lazy: () => import("./pages/NotFound").then(imported => ({ Component: imported.default }))
				}
			]
		}
	]);

	return <RouterProvider router={router}/>;
}

export default App;