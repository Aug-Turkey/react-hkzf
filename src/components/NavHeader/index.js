// 顶部导航栏组件，实现城市选择，地图找房页面的复用
import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
// props 校验
import "./index.scss";

const NavHeader = ({ children }) => {
	const navigate = useNavigate();
	// 顶部左侧点击返回上一页
	const back = () => {
		navigate(-1);
	};
	return (
		<NavBar className="navbar" onBack={back}>
			{children}
		</NavBar>
	);
};

export default NavHeader;
