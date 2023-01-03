import { Navigate } from "react-router-dom";
// UI 组件
import Home from "../pages/Home";
import CityList from "../pages/CityList";
import News from "../pages/News";
import HouseList from "../pages/HouseList";
import Index from "../pages/Index";
import Profile from "../pages/Profile";
import Map from "../pages/Map";
import Detail from "../pages/Detail";

const routes = [
	{
		path: "/",
		element: <Navigate to="/home/index" />,
	},
	{
		path: "/home",
		element: <Navigate to="/home/index" />,
	},
	{
		path: "/home",
		element: <Home />,
		// 定义二级路由，注意不要加 /
		children: [
			{
				path: "index",
				element: <Index />,
			},
			{
				path: "houselist",
				element: <HouseList />,
			},
			{
				path: "news",
				element: <News />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
		],
	},
	{
		path: "/citylist",
		element: <CityList />,
	},
	{
		path: "/map",
		element: <Map />,
	},
	{
		path: "/detail/:id",
		element: <Detail />,
	},
];

export default routes;
