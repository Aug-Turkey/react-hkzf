import { useRoutes } from "react-router-dom";
import routes from "./routes/index";

function App() {
	// 生成路由规则
	const element = useRoutes(routes);

	return (
		<div className="App">
			{/* 路由规则 */}
			{element}
		</div>
	);
}

export default App;
